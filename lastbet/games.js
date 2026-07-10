/* ═══════════════════════════════════════════════════════════
   도박의 덫 — LAST BET · 게임 모듈 (슬롯/파워볼/사다리/VIP바카라)
   ═══════════════════════════════════════════════════════════ */
"use strict";

const Games = (() => {

    let timers = [];
    let locked = false;          // 베팅 진행 중 뒤로가기 금지
    let currentGame = null;

    const reg = (id) => { timers.push(id); return id; };
    const every = (fn, ms) => reg(setInterval(fn, ms));
    const after = (fn, ms) => reg(setTimeout(fn, ms));

    function open(title, name) {
        closeCurrent();
        currentGame = name;
        $("#game-title").textContent = title;
        $("#game-overlay").classList.remove("hidden");
        renderMoney();
    }
    function closeCurrent() {
        timers.forEach(t => { clearInterval(t); clearTimeout(t); });
        timers = [];
        locked = false;
        currentGame = null;
        $("#game-body").innerHTML = "";
    }
    function isOpen(name) {
        return currentGame === name && !$("#game-overlay").classList.contains("hidden");
    }
    function tryLockExit() {
        if (locked) { UI.toast("⏳ 베팅 결과 확인 중에는 나갈 수 없습니다", { type: "warn" }); return true; }
        return false;
    }

    /* ── 공용: 방 분위기(접속자/채팅) ── */
    function roomVibe({ viewersEl, chatEl, base = 200 }) {
        if (viewersEl) {
            const bump = () => { viewersEl.textContent = fmt(base + randInt(-15, 25)); };
            bump();
            every(bump, 4000);
        }
        if (chatEl) {
            every(() => {
                if (Math.random() < 0.35) return;
                /* 페르소나 일관성: 멘트 풀과 닉네임 풀을 짝지어 뽑는다 */
                const fj = friendsJoined();
                let name, line;
                if (fj.length && Math.random() < 0.22) {
                    name = rand(fj).name;
                    line = rand(DATA.shillChat);
                } else {
                    const r = Math.random();
                    if (r < 0.18) { name = rand(DATA.fakeNamesNew); line = rand(DATA.shillChatNew); }
                    else if (r < 0.42) { name = rand(DATA.fakeNames); line = rand(DATA.shillChatVet); }
                    else { name = rand(DATA.fakeNames); line = rand(DATA.shillChat); }
                }
                const text = line
                    .replaceAll("{amt}", rand([randInt(3, 9) + "만", randInt(10, 80) + "만", fmt(randInt(5, 50) * 10000) + "원"]));
                const div = document.createElement("div");
                div.className = "chat-msg";
                div.innerHTML = `<b>${esc(name)}</b><span>${esc(text)}</span>`;
                chatEl.appendChild(div);
                while (chatEl.children.length > 30) chatEl.removeChild(chatEl.firstChild);
                chatEl.scrollTop = chatEl.scrollHeight;
            }, 2200);
        }
    }

    /* ── 공용: 결과 팝업 ── */
    function resultPop({ win, amount, payout, jackpot = false }) {
        const body = $("#game-body");
        const pop = document.createElement("div");
        pop.className = "result-pop " + (win ? "win" : "lose");
        if (win) {
            Sound[jackpot ? "jackpot" : "win"]();
            UI.coinRain(jackpot ? 40 : 18);
            UI.flash("rgba(255,215,0,.25)", 2);
            pop.innerHTML = `
                <h2>${jackpot ? "💎 JACKPOT 💎" : "🎉 적중!"}</h2>
                <div class="rp-amt">+${fmtW(payout)}</div>
                ${S.streak >= 2 ? `<div class="rp-streak">🔥 ${S.streak}연승 중!</div>` : ""}
                <p>${rand(DATA.temptWin)}</p>`;
        } else {
            Sound.lose();
            UI.shake();
            UI.flash("rgba(255,0,60,.28)", 1);
            pop.innerHTML = `
                <h2>❌ 미적중</h2>
                <div class="rp-amt lose">-${fmtW(amount)}</div>
                <p>${rand(DATA.temptLose)}</p>`;
        }
        body.appendChild(pop);
        after(() => pop.remove(), 2400);
    }

    /* ── 공용: 금액 선택 위젯 ── */
    function amountPicker({ presets, min = 0 }) {
        return `
        <div class="amount-picker">
            <div class="ap-btns">
                ${presets.map(p => `<button class="ap-btn" data-amt="${p}">${p >= 10000 ? (p / 10000) + "만" : (p / 1000) + "천"}</button>`).join("")}
                <button class="ap-btn max" data-amt="max">올인</button>
                <button class="ap-btn reset" data-amt="reset">초기화</button>
            </div>
            <div class="ap-display">
                <div><span>베팅 금액</span><b id="ap-amount">0</b></div>
                <div class="right"><span>적중 시 (배당 <i id="ap-rate">1.95</i>)</span><b id="ap-expect" class="hl-y">0</b></div>
            </div>
        </div>`;
    }
    function bindAmountPicker(state, rateGetter) {
        $$(".ap-btn").forEach(b => b.addEventListener("click", () => {
            if (state.betLocked) return;
            Sound.chip();
            const v = b.dataset.amt;
            if (state.allinOnly) {
                /* 확정픽 적용 중: 어떤 버튼을 눌러도 전액 배팅 */
                state.amount = S.balance;
                UI.toast("👑 확정픽은 <b>전액 배팅</b>만 적용됩니다", { type: "warn", sound: false });
            }
            else if (v === "reset") state.amount = 0;
            else if (v === "max") state.amount = S.balance;
            else {
                const before = state.amount;
                state.amount = Math.min(state.amount + +v, S.balance);
                /* 이미 잔액 한도에 걸려 있으면 그 버튼 금액으로 새로 시작 — 초기화를 먼저 눌러야 하는 답답함 제거 */
                if (state.amount === before) state.amount = Math.min(+v, S.balance);
                if (state.amount === before) {
                    if (S.balance <= 0) UI.toast("잔액이 없습니다 — 충전이 필요해요", { type: "warn", sound: false });
                    else UI.toast("이미 <b>잔액 전액</b>이 배팅 금액입니다", { type: "warn", sound: false });
                }
            }
            refreshAmount(state, rateGetter);
        }));
    }
    function refreshAmount(state, rateGetter) {
        const apA = $("#ap-amount"), apE = $("#ap-expect"), apR = $("#ap-rate");
        if (!apA) return;
        const rate = rateGetter();
        apA.textContent = fmt(state.amount);
        apR.textContent = rate.toFixed(2);
        apE.textContent = fmt(Math.floor(state.amount * rate));
    }

    /* ═══════════════ 1. 황금성 슬롯 ═══════════════ */
    const SLOT_SYMBOLS = ["🐢", "🐙", "🦀", "🌊", "👑", "💰", "7️⃣"];
    /* 승리 시 심볼별 배당 (가중 추첨) */
    const SLOT_WINS = [
        { sym: "🐢", rate: 2.0, w: 45 },
        { sym: "🦀", rate: 2.5, w: 25 },
        { sym: "👑", rate: 5.0, w: 20 },
        { sym: "💰", rate: 8.0, w: 7 },
        { sym: "7️⃣", rate: 15.0, w: 3 },
    ];

    function openSlot() {
        open("🎰 황금성 슬롯", "slot");
        const body = $("#game-body");
        body.innerHTML = `
            <div class="room-live"><span class="live-dot"></span> 슬롯홀 접속 <b id="room-viewers">-</b>명 · 오늘 잭팟 3회 터짐</div>
            <div class="slot-machine">
                <div class="slot-top">💰 GOLD CASTLE 💰</div>
                <div class="slot-reels">
                    <div class="reel" id="reel-0">🐢</div>
                    <div class="reel" id="reel-1">👑</div>
                    <div class="reel" id="reel-2">7️⃣</div>
                </div>
                <div class="slot-paytable">
                    🐢×3 <b>2배</b> · 🦀×3 <b>2.5배</b> · 👑×3 <b>5배</b> · 💰×3 <b>8배</b> · 7️⃣×3 <b class="hl-y">15배</b>
                </div>
            </div>
            ${amountPicker({ presets: [5000, 10000, 50000, 100000] })}
            <button class="mbtn gold wide big" id="btn-spin">🎰 스핀!</button>
            <div class="room-chat" id="slot-chat"></div>`;

        const state = { amount: 0, betLocked: false };
        bindAmountPicker(state, () => 2.0);
        roomVibe({ viewersEl: $("#room-viewers"), chatEl: $("#slot-chat"), base: 172 });

        $("#btn-spin").addEventListener("click", async () => {
            if (state.betLocked) return;
            const amt = state.amount;
            if (!Engine.canBet(amt)) return;

            /* 결과 선결정 */
            let winInfo = null;
            const baseWin = Rig.decide(amt, { rate: 2.0, game: "slot" });
            if (baseWin) {
                const pool = SLOT_WINS.flatMap(w => Array(w.w).fill(w));
                winInfo = rand(pool);
            }
            Engine.placeBet(amt);
            state.betLocked = true; locked = true;
            $("#btn-spin").disabled = true;

            /* 릴 애니메이션 */
            const reels = [$("#reel-0"), $("#reel-1"), $("#reel-2")];
            let final;
            if (winInfo) final = [winInfo.sym, winInfo.sym, winInfo.sym];
            else {
                /* 니어미스: 45% 확률로 두 개 일치 + 하나 빗나감 */
                if (Math.random() < 0.45) {
                    const s = rand(SLOT_WINS.filter(w => w.rate >= 5)).sym; /* 아깝게 큰 것 놓침 */
                    let other = rand(SLOT_SYMBOLS.filter(x => x !== s));
                    final = [s, s, other];
                } else {
                    final = [rand(SLOT_SYMBOLS), rand(SLOT_SYMBOLS), rand(SLOT_SYMBOLS)];
                    if (final[0] === final[1] && final[1] === final[2]) final[2] = rand(SLOT_SYMBOLS.filter(x => x !== final[0]));
                }
            }
            const spinIds = reels.map((r, i) => every(() => {
                r.textContent = rand(SLOT_SYMBOLS);
                if (i === 0) Sound.spin();
            }, 70));
            for (let i = 0; i < 3; i++) {
                await new Promise(res => after(res, 700 + i * 620));
                clearInterval(spinIds[i]);
                reels[i].textContent = final[i];
                reels[i].classList.add("stop");
                after(() => reels[i].classList.remove("stop"), 350);
                Sound.tick();
                /* 니어미스 긴장감: 마지막 릴 직전 두 개 일치 시 강조 */
                if (i === 1 && final[0] === final[1]) {
                    reels.forEach(r => r.classList.add("hot"));
                    Sound.alarm();
                }
            }
            reels.forEach(r => r.classList.remove("hot"));
            await new Promise(res => after(res, 350));

            const win = !!winInfo;
            const rate = winInfo ? winInfo.rate : 2.0;
            const payout = Engine.resolve({ win, rate, amount: amt, game: "slot" });
            resultPop({ win, amount: amt, payout, jackpot: winInfo && winInfo.rate >= 8 });
            if (win) reels.forEach(r => { r.classList.add("winline"); after(() => r.classList.remove("winline"), 2000); });

            state.betLocked = false; locked = false;
            const sp = $("#btn-spin");
            if (sp) sp.disabled = false;
            if (state.amount > S.balance) state.amount = S.balance; /* 패배 후 잔액보다 큰 배팅액이 남지 않게 */
            refreshAmount(state, () => 2.0);
        });
    }

    /* ═══════════════ 2. 파워볼 홀짝 ═══════════════ */
    function openPowerball() {
        open("🎱 파워볼 홀짝", "powerball");
        const body = $("#game-body");
        const forced = (S.forcedPick && S.forcedPick.game === "powerball") ? S.forcedPick : null;
        body.innerHTML = `
            <div class="room-live"><span class="live-dot"></span> 실시간 참여 <b id="room-viewers">-</b>명 · <span id="pb-round">제 ${randInt(180, 260)}회차</span></div>
            ${forced ? `<div class="pick-banner">✈️ ${esc(forced.note)}</div>` : ""}
            <div class="pb-stage">
                <div class="pb-machine"><div class="pb-ball-icon" id="pb-ball">🎱</div><div class="pb-result-num" id="pb-num"></div></div>
                <div class="pb-timer"><div class="pb-timer-bar" id="pb-timer-bar"></div><span id="pb-timer-text">15</span></div>
            </div>
            <div class="pb-sides">
                <div class="pb-side odd" id="side-odd">
                    <div class="pbs-head"><b>홀</b><span>×1.95</span></div>
                    <div class="pbs-total">참여 <b id="total-odd">0</b>원</div>
                    <div class="pbs-feed" id="feed-odd"></div>
                </div>
                <div class="pb-side even" id="side-even">
                    <div class="pbs-head"><b>짝</b><span>×1.95</span></div>
                    <div class="pbs-total">참여 <b id="total-even">0</b>원</div>
                    <div class="pbs-feed" id="feed-even"></div>
                </div>
            </div>
            ${amountPicker({ presets: [10000, 50000, 100000, 200000] })}
            <button class="mbtn gold wide big" id="btn-pb-bet">베팅하기</button>
            <div class="sb-dots" id="pb-history"></div>
            <div class="room-chat" id="pb-chat"></div>`;

        /* 과거 기록 점 */
        const hist = $("#pb-history");
        for (let i = 0; i < 28; i++) {
            const d = document.createElement("span");
            d.className = "dot " + (Math.random() > 0.5 ? "b" : "r");
            hist.appendChild(d);
        }

        roomVibe({ viewersEl: $("#room-viewers"), chatEl: $("#pb-chat"), base: 318 });

        const state = { amount: 0, side: null, betLocked: false, closed: false };
        bindAmountPicker(state, () => 1.95);

        /* 강제픽 적용 */
        if (forced) {
            state.amount = forced.amount === "all" ? S.balance : Math.min(forced.amount, S.balance);
            state.side = forced.side;
            refreshAmount(state, () => 1.95);
        }

        const sideEls = { odd: $("#side-odd"), even: $("#side-even") };
        const applySide = (side) => {
            state.side = side;
            sideEls.odd.classList.toggle("sel", side === "odd");
            sideEls.even.classList.toggle("sel", side === "even");
        };
        Object.entries(sideEls).forEach(([side, el]) => {
            el.addEventListener("click", () => {
                if (state.betLocked || state.closed) return;
                Sound.chip();
                applySide(side);
                /* 픽 반대쪽도 골라지긴 하지만 — 속마음이 스치고 스스로 픽으로 돌아온다 (첫 픽만, 그루밍 연출) */
                if (forced && !forced.freeSide && side !== forced.side) {
                    UI.toast(`💭 …아니야, 괜히 꼬지 말자. 실장님 픽대로 <b>${forced.side === "odd" ? "홀" : "짝"}</b> 가자.`, {});
                    after(() => {
                        if (state.betLocked || state.closed) return;
                        Sound.chip();
                        applySide(forced.side);
                    }, 1100);
                }
            });
        });
        if (forced) sideEls[forced.side].classList.add("sel");

        /* 타인 베팅 연출 */
        const totals = { odd: 0, even: 0 };
        every(() => {
            if (state.closed) return;
            const side = Math.random() < 0.5 ? "odd" : "even";
            const fj = friendsJoined();
            const name = (fj.length && Math.random() < 0.25) ? rand(fj).name : rand(DATA.fakeNames);
            const amt = randInt(1, 30) * 10000;
            totals[side] += amt;
            const feed = $("#feed-" + side);
            if (!feed) return;
            const row = document.createElement("div");
            row.innerHTML = `<span>${esc(name)}</span><b>${fmt(amt)}</b>`;
            feed.prepend(row);
            while (feed.children.length > 4) feed.removeChild(feed.lastChild);
            $("#total-" + side).textContent = fmt(totals[side]);
        }, 1300);

        /* 라운드 타이머 */
        let timeLeft = 15;
        const bar = $("#pb-timer-bar"), tt = $("#pb-timer-text");
        every(() => {
            if (state.closed) return;
            timeLeft--;
            tt.textContent = Math.max(0, timeLeft);
            bar.style.width = (timeLeft / 15 * 100) + "%";
            if (timeLeft <= 4 && timeLeft > 0) { Sound.tick(); tt.classList.add("urgent"); }
            if (timeLeft <= 0) closeRound();
        }, 1000);

        $("#btn-pb-bet").addEventListener("click", () => {
            if (state.betLocked || state.closed) return;
            if (!state.side) { UI.toast("홀 또는 짝을 선택하세요", { type: "warn" }); return; }
            /* 자동 복귀 전에 베팅을 눌렀다면 — 픽으로 되돌리고 한 번 더 누르게 한다 (첫 픽만) */
            if (forced && !forced.freeSide && state.side !== forced.side) {
                UI.toast(`💭 …그래도 첫 판은 실장님 픽대로. <b>${forced.side === "odd" ? "홀" : "짝"}</b>으로 간다.`, {});
                applySide(forced.side);
                return;
            }
            if (!Engine.canBet(state.amount)) return;
            const followed = !forced || !forced.side || state.side === forced.side;
            state.win = Rig.decide(state.amount, { rate: 1.95, game: "powerball" });
            /* 조작된 판 — 실장 픽을 어기면 결과는 픽대로 나오고 나만 잃는다 */
            if (!followed) state.win = false;
            state.usedPick = !!forced && followed; /* 실장 픽을 따라간 베팅인지 — 튜토리얼 진행 판정에 사용 */
            state.missedPick = !!forced && !followed; /* 픽을 어긴 베팅 — 실장의 질책/재픽 트리거 */
            Engine.placeBet(state.amount);
            if (forced) S.forcedPick = null;
            state.betLocked = true; locked = true;
            const btn = $("#btn-pb-bet");
            btn.disabled = true;
            btn.textContent = "베팅 완료 — 추첨 대기 중";
            /* 내 베팅도 피드에 */
            totals[state.side] += state.amount;
            $("#total-" + state.side).textContent = fmt(totals[state.side]);
            const feed = $("#feed-" + state.side);
            const row = document.createElement("div");
            row.className = "mine";
            row.innerHTML = `<span>${esc(S.nickname)} (나)</span><b>${fmt(state.amount)}</b>`;
            feed.prepend(row);
        });

        async function closeRound() {
            state.closed = true;
            tt.textContent = "마감";
            tt.classList.remove("urgent");

            /* 결과 숫자 결정 */
            let isOdd;
            if (state.betLocked) isOdd = (state.side === "odd") === state.win;
            else isOdd = Math.random() < 0.5;
            let num = randInt(1, 28);
            if ((num % 2 === 1) !== isOdd) num++;

            /* 추첨 연출 */
            const ball = $("#pb-ball"), numEl = $("#pb-num");
            ball.classList.add("rolling");
            for (let i = 0; i < 10; i++) { await new Promise(r => after(r, 120)); Sound.spin(); }
            ball.classList.remove("rolling");
            ball.classList.add("hidden");
            numEl.textContent = num;
            numEl.className = "pb-result-num show " + (isOdd ? "blue" : "red");
            Sound.flip();

            /* 기록 점 추가 */
            const d = document.createElement("span");
            d.className = "dot " + (isOdd ? "b" : "r");
            hist.prepend(d);

            /* 정산 */
            await new Promise(r => after(r, 700));
            if (state.betLocked) {
                const payout = Engine.resolve({ win: state.win, rate: 1.95, amount: state.amount, game: "powerball", pick: state.usedPick, missedPick: state.missedPick });
                resultPop({ win: state.win, amount: state.amount, payout });
            }
            locked = false;

            /* 다음 회차 */
            after(() => { if (isOpen("powerball") && S.phase !== "RUIN") openPowerball(); }, 3200);
        }
    }

    /* ═══════════════ 3. 네임드 사다리 ═══════════════ */
    function openLadder() {
        open("🔀 네임드 사다리", "ladder");
        const body = $("#game-body");
        body.innerHTML = `
            <div class="room-live"><span class="live-dot"></span> 실시간 참여 <b id="room-viewers">-</b>명 · 제 ${randInt(300, 420)}회차</div>
            <div class="ladder-stage">
                <div class="ladder-labels"><span class="blue">좌</span><span class="red">우</span></div>
                <svg id="ladder-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="25" y1="6" x2="25" y2="94" class="lbase"/>
                    <line x1="75" y1="6" x2="75" y2="94" class="lbase"/>
                    <line x1="25" y1="30" x2="75" y2="30" class="lbase"/>
                    <line x1="25" y1="50" x2="75" y2="50" class="lbase"/>
                    <line x1="25" y1="70" x2="75" y2="70" class="lbase"/>
                </svg>
                <div class="ladder-result" id="ladder-res"></div>
            </div>
            <div class="ladder-opts">
                <button class="lopt blue" data-g="start" data-k="left">좌출발<span>×1.95</span></button>
                <button class="lopt red" data-g="start" data-k="right">우출발<span>×1.95</span></button>
                <button class="lopt blue" data-g="lines" data-k="3">3줄<span>×1.95</span></button>
                <button class="lopt red" data-g="lines" data-k="4">4줄<span>×1.95</span></button>
            </div>
            <div class="combo-hint" id="ladder-combo">💡 출발 + 줄수를 <b>같이</b> 고르면 조합배당 <b class="hl-y">×3.60</b></div>
            ${amountPicker({ presets: [10000, 50000, 100000, 200000] })}
            <button class="mbtn gold wide big" id="btn-ladder-bet">베팅하기</button>
            <div class="room-chat" id="ladder-chat"></div>`;

        roomVibe({ viewersEl: $("#room-viewers"), chatEl: $("#ladder-chat"), base: 241 });

        /* 단픽 ×1.95, 조합픽(출발+줄수) ×3.60 — 실제 사이트가 도박성을 키우는 방식 */
        const state = { amount: 0, pickStart: null, pickLines: null, betLocked: false };
        const curRate = () => (state.pickStart && state.pickLines) ? 3.60 : 1.95;
        bindAmountPicker(state, curRate);

        function refreshCombo() {
            const el = $("#ladder-combo");
            if (!el) return;
            if (state.pickStart && state.pickLines) {
                el.innerHTML = `🔥 조합픽 <b>${state.pickStart === "left" ? "좌출발" : "우출발"} + ${state.pickLines}줄</b> — 배당 <b class="hl-y">×3.60</b>`;
                el.classList.add("on");
            } else {
                el.innerHTML = `💡 출발 + 줄수를 <b>같이</b> 고르면 조합배당 <b class="hl-y">×3.60</b>`;
                el.classList.remove("on");
            }
            refreshAmount(state, curRate);
        }

        $$(".lopt").forEach(b => b.addEventListener("click", () => {
            if (state.betLocked) return;
            Sound.chip();
            const g = b.dataset.g, k = b.dataset.k;
            if (g === "start") state.pickStart = state.pickStart === k ? null : k;
            else state.pickLines = state.pickLines === k ? null : k;
            $$(".lopt").forEach(x => x.classList.toggle("sel",
                (x.dataset.g === "start" && x.dataset.k === state.pickStart) ||
                (x.dataset.g === "lines" && x.dataset.k === state.pickLines)));
            refreshCombo();
        }));

        $("#btn-ladder-bet").addEventListener("click", async () => {
            if (state.betLocked) return;
            if (!state.pickStart && !state.pickLines) { UI.toast("좌우출발·줄수 중 하나 이상 선택하세요 (같이 고르면 ×3.60)", { type: "warn" }); return; }
            const amt = state.amount;
            if (!Engine.canBet(amt)) return;
            const rate = curRate();
            const win = Rig.decide(amt, { rate, game: "ladder" });
            Engine.placeBet(amt);
            state.betLocked = true; locked = true;
            $("#btn-ladder-bet").disabled = true;

            /* 결과 결정: 승리면 픽 전부 일치, 패배면 딱 하나만 어긋나게(니어미스) */
            const flipStart = s => s === "left" ? "right" : "left";
            const flipLines = l => l === "3" ? "4" : "3";
            let start, lines;
            if (win) {
                start = state.pickStart || (Math.random() < 0.5 ? "left" : "right");
                lines = +(state.pickLines || (Math.random() < 0.5 ? "3" : "4"));
            } else if (state.pickStart && state.pickLines) {
                if (Math.random() < 0.5) { start = flipStart(state.pickStart); lines = +state.pickLines; }
                else { start = state.pickStart; lines = +flipLines(state.pickLines); }
            } else if (state.pickStart) {
                start = flipStart(state.pickStart);
                lines = Math.random() < 0.5 ? 3 : 4;
            } else {
                start = Math.random() < 0.5 ? "left" : "right";
                lines = +flipLines(state.pickLines);
            }

            /* SVG 경로 애니메이션 */
            const svg = $("#ladder-svg");
            let html = `<line x1="25" y1="6" x2="25" y2="94" class="lbase"/><line x1="75" y1="6" x2="75" y2="94" class="lbase"/>`;
            const gap = 88 / (lines + 1);
            for (let i = 1; i <= lines; i++) {
                const y = 6 + i * gap;
                html += `<line x1="25" y1="${y}" x2="75" y2="${y}" class="lbase"/>`;
            }
            let x = start === "left" ? 25 : 75;
            let dPath = `M ${x} 6 `;
            for (let i = 1; i <= lines; i++) {
                const y = 6 + i * gap;
                dPath += `L ${x} ${y} `;
                x = x === 25 ? 75 : 25;
                dPath += `L ${x} ${y} `;
            }
            dPath += `L ${x} 94`;
            html += `<path id="lpath" class="lactive" d="${dPath}"/>`;
            svg.innerHTML = html;
            const path = $("#lpath");
            const len = path.getTotalLength();
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
            path.getBoundingClientRect();
            path.style.transition = "stroke-dashoffset 2.4s linear";
            path.style.strokeDashoffset = "0";
            for (let i = 0; i < 6; i++) { await new Promise(r => after(r, 380)); Sound.tick(); }

            const resEl = $("#ladder-res");
            resEl.textContent = `${start === "left" ? "좌출발" : "우출발"} · ${lines}줄`;
            resEl.classList.add("show");
            await new Promise(r => after(r, 600));

            const payout = Engine.resolve({ win, rate, amount: amt, game: "ladder" });
            resultPop({ win, amount: amt, payout, jackpot: win && rate >= 3 });
            locked = false;

            after(() => { if (isOpen("ladder") && S.phase !== "RUIN") openLadder(); }, 2800);
        });
    }

    /* ═══════════════ 4. VIP 바카라 ═══════════════ */
    const VIP_MIN = 100000;

    function cardHtml(v, suit) {
        const red = suit === "♥" || suit === "♦";
        const rank = v === 1 ? "A" : v === 0 ? rand(["10", "J", "Q", "K"]) : String(v);
        return `<div class="pcard back"><div class="pc-face ${red ? "red" : ""}"><span class="pc-rank">${rank}</span><span class="pc-suit">${suit}</span></div></div>`;
    }
    /* 합(mod 10)이 total이 되는 카드 2장 */
    function twoCards(total) {
        const c1 = randInt(0, 9);
        const c2 = (total - c1 + 10) % 10;
        return [c1, c2];
    }

    function openVip() {
        open("👑 VIP 바카라", "vip");
        const body = $("#game-body");
        const forced = (S.forcedPick && S.forcedPick.game === "vip") ? S.forcedPick : null;
        body.innerHTML = `
            <div class="vip-room">
                <div class="room-live vip"><span class="live-dot"></span> VIP홀 <b id="room-viewers">-</b>명 · 최소배팅 100,000원</div>
                ${forced ? `<div class="pick-banner gold">👑 ${esc(forced.note)}</div>` : ""}
                <div class="bacc-table">
                    <div class="bacc-hand">
                        <span class="bh-label">PLAYER</span>
                        <div class="bh-cards" id="cards-player"></div>
                        <span class="bh-total" id="total-player"></span>
                    </div>
                    <div class="bacc-vs">VS</div>
                    <div class="bacc-hand">
                        <span class="bh-label banker">BANKER</span>
                        <div class="bh-cards" id="cards-banker"></div>
                        <span class="bh-total" id="total-banker"></span>
                    </div>
                </div>
                <div class="bacc-bets">
                    <button class="bacc-bet player" data-k="player">플레이어<span>×1.95</span></button>
                    <button class="bacc-bet tie" data-k="tie">타이<span>×8.0</span></button>
                    <button class="bacc-bet banker" data-k="banker">뱅커<span>×1.95</span></button>
                </div>
                ${amountPicker({ presets: [100000, 200000, 500000] })}
                <button class="mbtn gold wide big" id="btn-bacc-bet">베팅하기</button>
                <div class="vip-feed" id="vip-feed"></div>
            </div>`;

        roomVibe({ viewersEl: $("#room-viewers"), base: 12 });

        /* 대기 상태: 카드 뒷면 배치 */
        const backCard = `<div class="pcard back"><div class="pc-face"></div></div>`;
        $("#cards-player").innerHTML = backCard + backCard;
        $("#cards-banker").innerHTML = backCard + backCard;

        /* VIP 하이롤러 피드 */
        every(() => {
            const feed = $("#vip-feed");
            if (!feed || Math.random() < 0.4) return;
            const fj = friendsJoined();
            const name = (fj.length && Math.random() < 0.3) ? rand(fj).name : rand(DATA.fakeNames);
            const win = Math.random() < 0.6;
            const row = document.createElement("div");
            row.innerHTML = `<span>💼 ${esc(name)}</span><b class="${win ? "ok" : "no"}">${win ? "+" : "-"}${fmt(randInt(10, 80) * 10000)}</b>`;
            feed.prepend(row);
            while (feed.children.length > 4) feed.removeChild(feed.lastChild);
        }, 2600);

        const state = { amount: 0, pick: null, betLocked: false };
        bindAmountPicker(state, () => state.pick === "tie" ? 8.0 : 1.95);

        if (forced) {
            /* freeSide 확정픽(마지막 올인): 어디를 고르든 자유 — 어차피 지도록 조작돼 있다 */
            state.pick = forced.freeSide ? null : forced.side;
            state.amount = forced.amount === "all" ? S.balance : Math.min(forced.amount, S.balance);
            state.allinOnly = forced.amount === "all";
            refreshAmount(state, () => 1.95);
        }

        const applyPick = (k) => {
            state.pick = k;
            $$(".bacc-bet").forEach(x => x.classList.toggle("sel", x.dataset.k === k));
            refreshAmount(state, () => state.pick === "tie" ? 8.0 : 1.95);
        };
        $$(".bacc-bet").forEach(b => b.addEventListener("click", () => {
            if (state.betLocked) return;
            Sound.chip();
            applyPick(b.dataset.k);
            /* 확정픽 반대쪽을 골라도 — 속마음이 스치고 스스로 픽으로 돌아온다 */
            if (forced && !forced.freeSide && b.dataset.k !== forced.side) {
                UI.toast("💭 …아니지, 본사 확정픽이랬잖아. 이 돈을 걸고 모험할 순 없어.", {});
                after(() => {
                    if (state.betLocked) return;
                    Sound.chip();
                    applyPick(forced.side);
                }, 1100);
            }
        }));
        if (forced && !forced.freeSide) $$(".bacc-bet").forEach(x => x.classList.toggle("sel", x.dataset.k === forced.side));

        $("#btn-bacc-bet").addEventListener("click", async () => {
            if (state.betLocked) return;
            if (!state.pick) { UI.toast("플레이어 / 타이 / 뱅커 중 선택하세요", { type: "warn" }); return; }
            /* 자동 복귀 전에 베팅을 눌렀다면 — 확정픽으로 되돌리고 한 번 더 누르게 한다 */
            if (forced && !forced.freeSide && state.pick !== forced.side) {
                UI.toast("💭 …그래도 확정픽인데. 시키는 대로 가자.", {});
                applyPick(forced.side);
                return;
            }
            let amt = state.amount;
            if (forced && forced.amount === "all") amt = S.balance;
            if (amt < VIP_MIN) { UI.toast("VIP룸 최소 배팅은 100,000원입니다", { type: "warn" }); if (amt > 0 && S.balance < VIP_MIN) Director.onBroke(); return; }
            if (!Engine.canBet(amt)) return;
            const rate = state.pick === "tie" ? 8.0 : 1.95;
            const win = Rig.decide(amt, { rate, game: "vip" });
            Engine.placeBet(amt);
            if (forced) S.forcedPick = null;
            state.betLocked = true; locked = true;
            $("#btn-bacc-bet").disabled = true;

            /* 결과 결정 */
            let result;
            if (win) result = state.pick;
            else result = rand(["player", "banker", "tie"].filter(k => k !== state.pick));
            let pTotal, bTotal;
            if (result === "tie") { pTotal = randInt(4, 9); bTotal = pTotal; }
            else if (result === "player") { pTotal = randInt(6, 9); bTotal = randInt(0, pTotal - 1); }
            else { bTotal = randInt(6, 9); pTotal = randInt(0, bTotal - 1); }

            /* 니어미스 강화: 내가 진 판은 1점 차이로 아깝게 */
            if (!win && result !== "tie" && Math.random() < 0.6) {
                if (state.pick === "player") { bTotal = randInt(7, 9); pTotal = bTotal - 1; result = "banker"; }
                else if (state.pick === "banker") { pTotal = randInt(7, 9); bTotal = pTotal - 1; result = "player"; }
            }

            const pCards = twoCards(pTotal), bCards = twoCards(bTotal);
            const suits = ["♠", "♥", "♦", "♣"];
            $("#cards-player").innerHTML = pCards.map(v => cardHtml(v, rand(suits))).join("");
            $("#cards-banker").innerHTML = bCards.map(v => cardHtml(v, rand(suits))).join("");

            /* 카드 순차 플립 */
            const cards = $$("#game-body .pcard");
            for (const c of cards) {
                await new Promise(r => after(r, 650));
                c.classList.remove("back");
                Sound.flip();
            }
            $("#total-player").textContent = pTotal;
            $("#total-banker").textContent = bTotal;
            await new Promise(r => after(r, 800));

            /* 승리 사이드 하이라이트 */
            $$(".bacc-bet").forEach(x => x.classList.toggle("winside", x.dataset.k === result));

            const payout = Engine.resolve({ win, rate, amount: amt, game: "vip" });
            resultPop({ win, amount: amt, payout, jackpot: win && amt >= 500000 });
            locked = false;

            after(() => { if (isOpen("vip") && S.phase !== "RUIN") openVip(); }, 3000);
        });
    }

    /* ═══════════════ 5. 스포츠 토토 (betedu 실경기 DB 이식) ═══════════════ */
    const SP_LEAGUES = [
        { key: "soccer",     label: "⚽ 축구", draw: true },
        { key: "baseball",   label: "⚾ 야구", draw: false },
        { key: "basketball", label: "🏀 농구", draw: false },
        { key: "volleyball", label: "🏐 배구", draw: false },
    ];
    const SP_MAX_FOLD = 3;

    /* 연출용 스코어: 원하는 결과와 실제 결과가 다르면 그럴듯하게 재구성 */
    function spScore(m, res) {
        if (res === m.result) return m.score;
        const parts = m.score.split("-").map(Number);
        const hi = Math.max(parts[0], parts[1]), lo = Math.min(parts[0], parts[1]);
        if (res === "home") return (hi === lo ? hi + 1 : hi) + "-" + lo;
        if (res === "away") return lo + "-" + (hi === lo ? hi + 1 : hi);
        return lo + "-" + lo;
    }
    const spResName = (res) => res === "home" ? "홈승" : res === "away" ? "원정승" : "무승부";

    function openSports(leagueKey = "soccer") {
        open("⚽ 스포츠 토토", "sports");
        const body = $("#game-body");
        const lg = SP_LEAGUES.find(l => l.key === leagueKey);
        /* 12경기 중 6경기 랜덤 편성 */
        const pool = [...SPORTS_DB[leagueKey]];
        const matches = [];
        while (matches.length < 6 && pool.length) matches.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);

        body.innerHTML = `
            <div class="room-live"><span class="live-dot"></span> 스포츠홀 접속 <b id="room-viewers">-</b>명 · 실경기 배당 · 최대 ${SP_MAX_FOLD}폴더</div>
            <div class="sp-tabs">
                ${SP_LEAGUES.map(l => `<button class="sp-tab ${l.key === leagueKey ? "on" : ""}" data-lg="${l.key}">${l.label}</button>`).join("")}
            </div>
            <div class="sp-list" id="sp-list">
                ${matches.map((m, i) => `
                <div class="sp-match" data-i="${i}">
                    <div class="sp-head">
                        <span class="sp-teams"><b>${esc(m.home)}</b> vs <b>${esc(m.away)}</b></span>
                        <span class="sp-note">${esc(m.note)}</span>
                    </div>
                    <div class="sp-odds">
                        <button class="sp-odd-btn" data-i="${i}" data-pick="home">홈승 <b>${m.oddsHome.toFixed(2)}</b></button>
                        ${lg.draw ? `<button class="sp-odd-btn" data-i="${i}" data-pick="draw">무 <b>${m.oddsDraw.toFixed(2)}</b></button>` : ""}
                        <button class="sp-odd-btn" data-i="${i}" data-pick="away">원정승 <b>${m.oddsAway.toFixed(2)}</b></button>
                    </div>
                    <div class="sp-result" id="sp-result-${i}"></div>
                </div>`).join("")}
            </div>
            <div class="sp-cart"><span>선택 <b id="sp-fold">0</b>폴더</span><span>합산 배당 <b id="sp-total" class="hl-y">1.00</b></span></div>
            ${amountPicker({ presets: [10000, 50000, 100000, 200000] })}
            <button class="mbtn gold wide big" id="btn-sp-bet">베팅하기</button>
            <div class="room-chat" id="sp-chat"></div>`;

        roomVibe({ viewersEl: $("#room-viewers"), chatEl: $("#sp-chat"), base: 264 });

        const state = { amount: 0, betLocked: false, picks: {}, totalOdds: 1 };
        bindAmountPicker(state, () => state.totalOdds);

        function refreshCart() {
            const keys = Object.keys(state.picks);
            state.totalOdds = keys.length ? keys.reduce((t, k) => t * state.picks[k].odds, 1) : 1;
            $("#sp-fold").textContent = keys.length;
            $("#sp-total").textContent = state.totalOdds.toFixed(2);
            refreshAmount(state, () => state.totalOdds);
        }

        $$(".sp-odd-btn").forEach(b => b.addEventListener("click", () => {
            if (state.betLocked) return;
            const i = b.dataset.i, pick = b.dataset.pick;
            const m = matches[i];
            const cur = state.picks[i];
            if (cur && cur.pick === pick) {
                delete state.picks[i];                    /* 같은 픽 다시 누르면 해제 */
            } else {
                if (!cur && Object.keys(state.picks).length >= SP_MAX_FOLD) {
                    UI.toast(`조합은 최대 ${SP_MAX_FOLD}폴더까지 가능합니다`, { type: "warn" });
                    return;
                }
                const odds = pick === "home" ? m.oddsHome : pick === "away" ? m.oddsAway : m.oddsDraw;
                state.picks[i] = { pick, odds };
            }
            Sound.chip();
            $$(`.sp-odd-btn[data-i="${i}"]`).forEach(x => x.classList.toggle("sel", state.picks[i] && x.dataset.pick === state.picks[i].pick));
            refreshCart();
        }));

        $$(".sp-tab").forEach(t => t.addEventListener("click", () => {
            if (state.betLocked) return;
            Sound.pop();
            openSports(t.dataset.lg);
        }));

        $("#btn-sp-bet").addEventListener("click", async () => {
            if (state.betLocked) return;
            const idxs = Object.keys(state.picks);
            if (!idxs.length) { UI.toast("경기를 1개 이상 선택하세요", { type: "warn" }); return; }
            const amt = state.amount;
            if (!Engine.canBet(amt)) return;
            const rate = state.totalOdds;
            const win = Rig.decide(amt, { rate, game: "sports" });
            Engine.placeBet(amt);
            state.betLocked = true; locked = true;
            const btn = $("#btn-sp-bet");
            btn.disabled = true;
            btn.textContent = "경기 결과 집계 중…";

            /* 다리(폴더)별 결과 결정 — 패배 시 딱 한 경기만 아깝게 빗나가게 */
            const legs = idxs.map(i => ({ i, m: matches[i], pick: state.picks[i].pick }));
            if (win) legs.forEach(l => { l.hit = true; l.res = l.pick; });
            else {
                const missAt = randInt(0, legs.length - 1);
                legs.forEach((l, n) => {
                    if (n === missAt) {
                        l.hit = false;
                        l.res = l.m.result !== l.pick ? l.m.result
                            : (l.pick === "home" ? "away" : "home");
                    } else { l.hit = true; l.res = l.pick; }
                });
                legs.push(...legs.splice(legs.findIndex(l => !l.hit), 1)); /* 빗나간 경기를 마지막에 공개 */
            }

            /* 미선택 경기 흐리게 */
            $$(".sp-match").forEach(el => { if (!state.picks[el.dataset.i]) el.classList.add("dim"); });

            /* 순차 공개 연출 */
            await new Promise(r => after(r, 900));
            for (const l of legs) {
                Sound.flip();
                const resEl = $("#sp-result-" + l.i);
                resEl.innerHTML = `
                    <span class="sp-score">${spScore(l.m, l.res)}</span>
                    <span class="sp-res-name">${spResName(l.res)}</span>
                    <span class="sp-badge ${l.hit ? "hit" : "miss"}">${l.hit ? "적중" : "미적중"}</span>`;
                resEl.classList.add("show");
                if (!l.hit) { Sound.alarm(); UI.shake(); }
                await new Promise(r => after(r, l.hit ? 750 : 1100));
            }

            const payout = Engine.resolve({ win, rate, amount: amt, game: "sports" });
            resultPop({ win, amount: amt, payout, jackpot: win && rate >= 8 });
            locked = false;

            after(() => { if (isOpen("sports") && S.phase !== "RUIN") openSports(leagueKey); }, 3400);
        });
    }

    return { openSlot, openPowerball, openLadder, openVip, openSports, closeCurrent, tryLockExit, isOpen, isBusy: () => locked };
})();
