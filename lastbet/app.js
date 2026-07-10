/* ═══════════════════════════════════════════════════════════
   도박의 덫 — LAST BET · 엔진 (상태/UI/사운드/채팅/시나리오)
   ═══════════════════════════════════════════════════════════ */
"use strict";

/* ── 헬퍼 ── */
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const fmt = (n) => Math.round(n).toLocaleString("ko-KR");
const fmtW = (n) => fmt(n) + "원";
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

/* 전체화면 요청 헬퍼 — 모바일·태블릿은 세로 방향으로 잠근다 */
function lockPortrait() {
    try {
        if (screen.orientation && screen.orientation.lock) {
            /* 방향 잠금은 전체화면 상태에서만 허용됨. 미지원(데스크톱·iOS)은 조용히 무시 */
            screen.orientation.lock("portrait").catch(() => {});
        }
    } catch (e) { /* 미지원 환경 무시 */ }
}
function safeRequestFullscreen() {
    try {
        const doc = document.documentElement;
        if (doc.requestFullscreen) {
            doc.requestFullscreen().then(lockPortrait).catch((err) => {
                console.warn("Fullscreen request rejected:", err);
            });
        } else if (doc.webkitRequestFullscreen) {
            doc.webkitRequestFullscreen();
            lockPortrait();
        } else if (doc.msRequestFullscreen) {
            doc.msRequestFullscreen();
            lockPortrait();
        }
        setTimeout(recoverPortrait, 900);   /* 일부 기기는 전체화면 진입과 동시에 가로로 뒤집힌다 */
    } catch (e) {
        console.warn("Fullscreen error:", e);
    }
}

/* ── 가로 전환 자동 복구 ──
   일부 폰·브라우저는 전체화면 웹앱을 강제로 가로로 돌린다(자동회전 꺼져 있어도).
   ① 세로 잠금 재시도 → ② 1초 내 복구가 안 되면 전체화면을 해제해 원인 자체를 제거한다. */
const mobileLandscape = () =>
    window.matchMedia("(orientation: landscape) and (pointer: coarse) and (max-height: 520px)").matches;
let rpExitTimer = null, rpDebounce = null;
function recoverPortrait() {
    if (document.body.classList.contains("allow-landscape")) return;
    if (!mobileLandscape()) return;
    lockPortrait();
    clearTimeout(rpExitTimer);
    rpExitTimer = setTimeout(() => {
        if (mobileLandscape() && document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        }
    }, 1000);
}
window.addEventListener("resize", () => {
    clearTimeout(rpDebounce);
    rpDebounce = setTimeout(recoverPortrait, 350);
    fitPhoneFrame();
});

/* ── 폰 프레임 크기 예외 처리 ──
   페이지 줌 축소·'PC 버전 보기' 등으로 모바일 뷰포트가 480px보다 크게 잡히면
   CSS 미디어쿼리(max-width/height)를 벗어나 프레임이 화면 가운데 작게 뜬다.
   터치 전용 기기(또는 모바일 UA)면 body.handheld 로 무조건 꽉 채운다. */
function fitPhoneFrame() {
    const handheld = window.matchMedia("(hover: none) and (pointer: coarse)").matches
        || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
    document.body.classList.toggle("handheld", handheld);
}

/* 이름 검증: 완성형 한글 2~8자, 같은 글자 반복 금지 → 실패 시 사유 문자열, 성공 시 null */
function nameProblem(name) {
    if (!/^[가-힣]{2,8}$/.test(name)) return "한글 이름으로 2글자 이상 입력해주세요 (영어·숫자·자음만 입력은 안 돼요)";
    if (name.split("").every(ch => ch === name[0])) return "실제 이름처럼 입력해주세요 😅";
    return null;
}

/* ═══════════════ 상태 ═══════════════ */
const S = {
    nickname: "체험자",
    quick: false,            // 빠른 교육 모드(약 2분 압축 체험 → 도박검사)
    phase: "INTRO",          // INTRO KAKAO SIGNUP TUTORIAL RISE VIP FALL LAST RUIN DEBRIEF
    balance: 0,
    debt: 0,
    totalCharged: 0,         // 충전(현금) 총액
    totalBet: 0,
    betCount: 0,
    winCount: 0,
    streak: 0,
    peak: 0,
    peakTime: null,
    chargeCount: 0,
    exchangeTries: 0,
    startTime: null,         // 가입 완료 시각
    endTime: null,
    friends: [],             // {name, joined}
    history: [],             // {t, game, amount, win, payout, balance}
    rigLog: [],              // {phase, p, win}
    forcedPick: null,        // {game, side, amount|'all', note}
    tutorialStep: 0,
    flags: {},
};

function friendsJoined() { return S.friends.filter(f => f.joined); }

/* ═══════════════ 사운드 ═══════════════ */
const Sound = (() => {
    let ctx = null, muted = false;
    const ac = () => {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
        return ctx;
    };
    function tone(freq, dur, { type = "sine", vol = 0.15, slideTo = null, at = 0 } = {}) {
        if (muted) return;
        try {
            const c = ac(), t = c.currentTime + at;
            const o = c.createOscillator(), g = c.createGain();
            o.type = type; o.frequency.setValueAtTime(freq, t);
            if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
            g.gain.setValueAtTime(vol, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.connect(g); g.connect(c.destination);
            o.start(t); o.stop(t + dur + 0.05);
        } catch (e) { /* 오디오 미지원 환경 무시 */ }
    }
    return {
        toggle() { muted = !muted; return muted; },
        unlock() { try { ac(); } catch (e) {} },
        chip()  { tone(1050, 0.06, { type: "triangle", vol: 0.12 }); },
        tick()  { tone(820, 0.05, { type: "square", vol: 0.06 }); },
        pop()   { tone(600, 0.08, { type: "sine", vol: 0.1, slideTo: 900 }); },
        msg()   { tone(880, 0.09, { type: "sine", vol: 0.12 }); tone(1320, 0.12, { type: "sine", vol: 0.1, at: 0.09 }); },
        spin()  { tone(300, 0.05, { type: "square", vol: 0.05 }); },
        flip()  { tone(500, 0.05, { type: "triangle", vol: 0.1, slideTo: 700 }); },
        win()   { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, { vol: 0.16, at: i * 0.09 })); },
        jackpot(){ [523, 659, 784, 1047, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, 0.22, { vol: 0.18, at: i * 0.11 })); },
        lose()  { tone(180, 0.4, { type: "sawtooth", vol: 0.2, slideTo: 60 }); },
        heart() { tone(55, 0.22, { type: "sine", vol: 0.5 }); tone(50, 0.28, { type: "sine", vol: 0.4, at: 0.3 }); },
        alarm() { tone(950, 0.3, { type: "square", vol: 0.1 }); tone(750, 0.3, { type: "square", vol: 0.1, at: 0.35 }); },
    };
})();

/* ═══════════════ UI 공통 ═══════════════ */
const UI = {
    /* 화면 전환 */
    showScreen(id) {
        $$(".screen").forEach(s => s.classList.remove("active"));
        $(id).classList.add("active");
    },

    /* 모달 — 반환값: close() */
    modal({ title = "", html = "", buttons = [], dismiss = false, cls = "" }) {
        const layer = $("#modal-layer");
        layer.innerHTML = "";
        layer.classList.remove("on");
        layer.classList.remove("hidden");
        requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add("on")));
        const box = document.createElement("div");
        box.className = "modal-box " + cls;
        box.innerHTML = `
            ${title ? `<div class="modal-title">${title}</div>` : ""}
            <div class="modal-body">${html}</div>
            <div class="modal-btns"></div>`;
        const btnWrap = box.querySelector(".modal-btns");
        const close = () => { layer.classList.add("hidden"); layer.innerHTML = ""; };
        buttons.forEach(b => {
            const el = document.createElement("button");
            el.className = "mbtn " + (b.cls || "gold");
            el.innerHTML = b.label;
            el.addEventListener("click", () => { Sound.pop(); if (!b.keep) close(); b.fn && b.fn(close); });
            btnWrap.appendChild(el);
        });
        if (dismiss) layer.addEventListener("click", e => { if (e.target === layer) close(); }, { once: true });
        layer.appendChild(box);
        return close;
    },

    /* 토스트 (우상단 실시간 알림) */
    toast(html, { type = "", dur = 3800, sound = true } = {}) {
        const wrap = $("#toast-container");
        while (wrap.children.length >= 3) wrap.removeChild(wrap.firstChild);
        const t = document.createElement("div");
        t.className = "toast " + type;
        t.innerHTML = html;
        wrap.appendChild(t);
        if (sound) Sound.pop();
        requestAnimationFrame(() => t.classList.add("show"));
        setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, dur);
    },

    /* 내레이션(속마음) — 탭하면 다음. 동시 호출은 순서대로 큐 처리 */
    _narrQ: Promise.resolve(),
    narrate(text) {
        const run = () => new Promise(resolve => {
            const bar = $("#narration-bar"), p = $("#narration-text");
            p.innerHTML = text;
            bar.classList.remove("hidden");
            requestAnimationFrame(() => bar.classList.add("show"));
            const done = () => {
                bar.classList.remove("show");
                setTimeout(() => bar.classList.add("hidden"), 300);
                resolve();
            };
            bar.addEventListener("click", done, { once: true });
        });
        const p = UI._narrQ.then(run);
        UI._narrQ = p.catch(() => {});
        return p;
    },
    async narrateSeq(arr) { for (const t of arr) await UI.narrate(t); },

    /* 스포트라이트 — 특정 요소만 강조, 누르면 해제 */
    spotlight(el, tip, { autoClick = true } = {}) {
        return new Promise(resolve => {
            el.scrollIntoView({ block: "center", behavior: "auto" });
            requestAnimationFrame(() => {
                const layer = $("#spotlight-layer"), hole = $("#spotlight-hole"), tipEl = $("#spotlight-tip");
                const r = el.getBoundingClientRect(), pr = $("#phone").getBoundingClientRect();
                layer.classList.remove("hidden");
                Object.assign(hole.style, {
                    left: (r.left - pr.left - 6) + "px",
                    top: (r.top - pr.top - 6) + "px",
                    width: (r.width + 12) + "px",
                    height: (r.height + 12) + "px",
                });
                tipEl.innerHTML = tip;
                const tipTop = (r.top - pr.top) > pr.height / 2
                    ? (r.top - pr.top - 84) : (r.bottom - pr.top + 14);
                tipEl.style.top = tipTop + "px";
                hole.onclick = () => {
                    layer.classList.add("hidden");
                    hole.onclick = null;
                    if (autoClick) el.click();
                    resolve();
                };
            });
        });
    },

    /* 이펙트 */
    flash(color = "rgba(255,215,0,.28)", times = 3) {
        const f = $("#flash-layer");
        f.style.background = color;
        f.classList.add("on");
        setTimeout(() => f.classList.remove("on"), 240 * times);
    },
    shake() {
        $("#phone").classList.add("shake");
        setTimeout(() => $("#phone").classList.remove("shake"), 500);
    },
    coinRain(n = 26) {
        const fx = $("#fx-layer");
        for (let i = 0; i < n; i++) {
            const c = document.createElement("div");
            c.className = "coin";
            c.textContent = rand(["💰", "⭐", "✨"]);
            c.style.left = Math.random() * 100 + "%";
            c.style.fontSize = randInt(14, 34) + "px";
            c.style.animationDelay = (Math.random() * 0.5) + "s";
            c.style.animationDuration = (0.9 + Math.random() * 0.8) + "s";
            fx.appendChild(c);
            setTimeout(() => c.remove(), 2200);
        }
    },
    moneyFly(fromWin) { /* 잔액 칩 반짝임 */
        const chip = $("#chip-balance");
        chip.classList.remove("up", "down");
        void chip.offsetWidth;
        chip.classList.add(fromWin ? "up" : "down");
    },
};

/* ═══════════════ 잔액/부채 ═══════════════ */
function setBalance(delta, { silent = false } = {}) {
    S.balance = Math.max(0, S.balance + delta);
    if (S.balance > S.peak) { S.peak = S.balance; S.peakTime = Date.now(); }
    renderMoney();
    if (!silent) UI.moneyFly(delta > 0);
}
function addDebt(amount) {
    S.debt += amount;
    renderMoney();
}
function renderMoney() {
    $("#chip-balance").textContent = fmtW(S.balance);
    $("#game-balance").textContent = fmtW(S.balance);
    const d = $("#chip-debt");
    if (S.debt > 0) { d.classList.remove("hidden"); d.textContent = "빚 " + fmtW(S.debt); }
    else d.classList.add("hidden");
}

/* ═══════════════ 확률 조작 엔진 ═══════════════ */
const Rig = {
    queue: [],                       // { result: 'win'|'lose', game } — 픽을 준 게임에서만 소모
    force(result, game = null) { this.queue.push({ result, game }); },

    decide(amount, { rate = 1.95, game = null } = {}) {
        let win, p;
        /* 강제 결과는 해당 게임 베팅에서만 소모 — 실장 픽용 승리를 슬롯 등이 가로채면 대본이 꼬인다 */
        const q = this.queue[0];
        if (q && (!q.game || q.game === game)) {
            this.queue.shift();
            win = q.result === "win";
            p = win ? 1 : 0;
        } else {
            p = RIG_RATES[S.phase] ?? 0.5;
            const potentialWin = amount * (rate - 1);
            const after = S.balance + potentialWin;   /* 판정은 차감 전 잔액 기준 */
            /* 튜토리얼: 전액 배팅 보호 (무료픽 각본 유지) */
            if (S.phase === "TUTORIAL" && amount >= S.balance) p = 1;
            /* 상승기: 초반 시드만 보호하고, 성장은 상한으로 제어 → VIP로 유도
               (올인이라고 무조건 이기게 하면 사다리 올인 반복으로 무한 증식하므로 폐지) */
            if (S.phase === "RISE") {
                if (amount >= S.balance && S.balance <= 60000) p = 0.85;
                if (S.streak <= -2) p = Math.max(p, 0.82);   /* 연패 구제 — 상승기는 계속 달콤해야 한다 */
                if (after >= 480000) p = 0.3;
            }
            /* VIP: 확정픽 전 잔액 보호 + 성장 상한 */
            if (S.phase === "VIP" && !S.flags.peakDone) {
                if (S.balance < 250000) p = 0.9;
                if (S.streak <= -2) p = Math.max(p, 0.8);    /* 연패 구제 */
                if (after >= 950000) p = 0.25;
            }
            /* 몰락기: 올인은 반드시 잃는다 */
            if (S.phase === "FALL" && amount >= S.balance) p = 0.02;
            /* 고배당 보정: 배당이 높을수록 적중 확률은 반비례.
               단, 몰락 전에는 완만하게(지수 0.75) 깎아 조합·다폴더의 짜릿한 맛은 살린다 */
            if (rate > 2.2 && S.phase !== "TUTORIAL") {
                const soft = (S.phase === "FALL" || S.phase === "LAST") ? 1 : 0.75;
                p = p * Math.pow(1.95 / rate, soft);
            }
            /* 전역 상한: 잔액이 수백만원대로 커지는 것 자체를 차단 */
            if (after >= 2500000) p = 0;
            else if (after >= 1500000) p = Math.min(p, 0.08);
            win = Math.random() < p;
        }
        S.rigLog.push({ phase: S.phase, p, win, amount });
        return win;
    },
};

/* ═══════════════ 베팅 공통 (games.js에서 호출) ═══════════════ */
const Engine = {
    canBet(amount) {
        /* 잔액 0원이면 금액 선택 여부와 무관하게 충전/엔딩 흐름으로 보낸다 (죽은 화면 방지) */
        if (S.balance <= 0) {
            UI.toast("잔액이 없습니다 — 충전이 필요해요", { type: "warn" });
            Director.onBroke();
            return false;
        }
        if (amount <= 0) { UI.toast("베팅 금액을 선택하세요", { type: "warn" }); return false; }
        if (amount > S.balance) {
            UI.toast("잔액이 부족합니다 — 충전이 필요해요", { type: "warn" });
            Director.onBroke();
            return false;
        }
        return true;
    },
    placeBet(amount) {
        setBalance(-amount);
        S.totalBet += amount;
        S.betCount++;
        Sound.chip();
    },
    resolve({ win, rate, amount, game, pick = false, missedPick = false }) {
        let payout = 0;
        if (win) {
            payout = Math.floor(amount * rate);
            setBalance(payout);
            S.winCount++;
            S.streak = S.streak > 0 ? S.streak + 1 : 1;
        } else {
            S.streak = S.streak < 0 ? S.streak - 1 : -1;
        }
        S.history.push({ t: Date.now(), game, amount, win, payout, balance: S.balance });
        setTimeout(() => Director.onBetResolved({ win, amount, payout, game, pick, missedPick }), 900);
        return payout;
    },
};

/* ═══════════════ 채팅: 정실장 (텔레그램풍) ═══════════════ */
const Chat = {
    unread: 0,
    opened: false,

    open() {
        this.opened = true;
        this.unread = 0;
        this.renderBadge();
        $("#chat-layer").classList.remove("hidden");
        const m = $("#tg-messages");
        m.scrollTop = m.scrollHeight;
    },
    close() {
        this.opened = false;
        $("#chat-layer").classList.add("hidden");
    },
    renderBadge() {
        const b = $("#chat-badge");
        if (this.unread > 0) { b.classList.remove("hidden"); b.textContent = this.unread; }
        else b.classList.add("hidden");
    },
    _append(el) {
        const m = $("#tg-messages");
        m.appendChild(el);
        m.scrollTop = m.scrollHeight;
    },
    sys(text) {
        const d = document.createElement("div");
        d.className = "tg-sys";
        d.textContent = text;
        this._append(d);
    },
    /* 실장 발화 (타이핑 연출 포함) */
    async say(lines, { openChat = true } = {}) {
        if (openChat && !this.opened) this.open();
        for (let raw of lines) {
            const text = raw.replaceAll("{nick}", esc(S.nickname));
            const typing = document.createElement("div");
            typing.className = "tg-msg them typing";
            typing.innerHTML = "<span></span><span></span><span></span>";
            this._append(typing);
            await wait(Math.min(600 + text.length * 18, 1900));
            typing.remove();
            const msg = document.createElement("div");
            msg.className = "tg-msg them";
            msg.innerHTML = `${text}<i class="tg-time">${nowHM()}</i>`;
            this._append(msg);
            Sound.msg();
            if (!this.opened) { this.unread++; this.renderBadge(); }
            await wait(420);
        }
    },
    me(text) {
        const msg = document.createElement("div");
        msg.className = "tg-msg me";
        msg.innerHTML = `${esc(text)}<i class="tg-time">${nowHM()}</i>`;
        this._append(msg);
    },
    /* 선택지 버튼 → 사용자가 고르면 내 말풍선으로 */
    choice(options) {
        return new Promise(resolve => {
            const wrap = $("#tg-choices");
            wrap.innerHTML = "";
            options.forEach((op, i) => {
                const b = document.createElement("button");
                b.textContent = op;
                b.addEventListener("click", () => {
                    Sound.pop();
                    wrap.innerHTML = "";
                    this.me(op);
                    resolve(i);
                });
                wrap.appendChild(b);
            });
            if (!this.opened) this.open();
        });
    },
    /* 파멸: 실장 잠적 */
    vanish() {
        $("#chat-contact-status").textContent = "마지막 접속: 오래 전";
        $("#chat-contact-status").classList.remove("online");
        $$("#tg-messages .tg-msg.them").forEach(m => {
            m.innerHTML = `<span class="deleted">🚫 삭제된 메시지입니다</span>`;
        });
        this.sys("상대방이 대화방을 나갔습니다");
        $("#tg-choices").innerHTML = "";
    },
};
function nowHM() {
    const d = new Date();
    const h = d.getHours(), m = String(d.getMinutes()).padStart(2, "0");
    return (h < 12 ? "오전 " : "오후 ") + ((h % 12) || 12) + ":" + m;
}

/* ═══════════════ 카톡 장면 ═══════════════ */
const KK = {
    async play(script, { onLink = null } = {}) {
        const wrap = $("#kk-messages");
        wrap.innerHTML = "";
        for (const item of script) {
            await wait(item.from === "me" ? 900 : 650);
            const row = document.createElement("div");
            row.className = "kk-row " + item.from;
            let inner = "";
            if (item.type === "text") {
                inner = `<div class="kk-bubble">${esc(item.text).replaceAll("{nick}", esc(S.nickname))}</div>`;
            } else if (item.type === "shot") {
                inner = `<div class="kk-bubble kk-shot">
                    <div class="shot-head">💸 황금성 · 내 지갑</div>
                    <div class="shot-amt">₩ 327,500</div>
                    <div class="shot-sub">▲ +294,500 (오늘 수익)</div>
                </div>`;
            } else if (item.type === "link") {
                inner = `<div class="kk-bubble kk-link" id="kk-link-card">
                    <div class="link-title">💸 황금성 GOLD CASTLE</div>
                    <div class="link-desc">신규가입 5만원 즉시지급 · 메이저 안전공원</div>
                    <div class="link-url">gold-castle77.com</div>
                    <div class="link-cta">👆 눌러서 접속하기</div>
                </div>`;
            }
            row.innerHTML = inner + `<span class="kk-time">${nowHM()}</span>`;
            wrap.appendChild(row);
            wrap.scrollTop = wrap.scrollHeight;
            if (item.from === "them") Sound.msg();
            if (item.type === "shot") await wait(700);
        }
        if (onLink) {
            const card = $("#kk-link-card");
            card.classList.add("pulse");
            card.addEventListener("click", onLink, { once: true });
        }
    },
};

/* ═══════════════ 사이트 기능 (충전/환전/초대/전광판/마퀴) ═══════════════ */
const Site = {

    /* ── 마퀴 전광판 ── */
    bragText: null,
    buildMarquee() {
        const items = [];
        for (let i = 0; i < 6; i++) {
            const n = rand(DATA.fakeNames);
            const masked = n.slice(0, 2) + "***";
            items.push(`🎉 ${masked}님 <b class="hl-y">${fmt(randInt(15, 320) * 10000)}원</b> 당첨`);
            items.push(`💸 ${rand(DATA.fakeNames).slice(0, 2)}***님 <b class="hl-g">${fmt(randInt(30, 500) * 10000)}원</b> 환전 완료`);
        }
        if (this.bragText) items.splice(1, 0, this.bragText, this.bragText);
        const html = items.map(t => `<span>${t}</span>`).join("<em>　◆　</em>");
        $("#marquee-text").innerHTML = html + "<em>　◆　</em>" + html;
    },

    /* ── 실시간 접속자/환전액 흔들기 ── */
    tickLive() {
        $("#live-count").textContent = fmt(1100 + randInt(-60, 90) + S.betCount * 3);
        $("#live-payout").textContent = "₩" + fmt(384120000 + S.betCount * randInt(80000, 300000));
    },

    /* ── 실시간 수익 토스트 (타 유저 자극) ── */
    liveToastTimer: null,
    startLiveToasts() {
        if (this.liveToastTimer) return;
        const loop = () => {
            const busy = !$("#modal-layer").classList.contains("hidden")
                || !$("#narration-bar").classList.contains("hidden")
                || !!document.querySelector(".qm-layer")   /* 빠른모드 몽타주 중에는 잡음 금지 */
                || S.phase === "RUIN" || S.phase === "DEBRIEF" || S.phase === "INTRO" || S.phase === "KAKAO";
            if (!busy && Math.random() < 0.8) {
                const useFriend = friendsJoined().length && Math.random() < 0.35;
                const name = useFriend ? rand(friendsJoined()).name : rand(DATA.fakeNames);
                const amt = fmtW(randInt(8, 90) * 10000);
                const tpl = rand(DATA.liveToasts);
                UI.toast(tpl.replaceAll("{name}", esc(name)).replaceAll("{amt}", amt), { type: "money", sound: false });
            }
            this.liveToastTimer = setTimeout(loop, randInt(7000, 14000));
        };
        this.liveToastTimer = setTimeout(loop, 6000);
    },

    /* ── 전광판(랭킹) ── */
    openRank() {
        const rows = DATA.rankSeed.map(r => ({ ...r }));
        rows.push({ name: S.nickname, amt: Math.max(0, S.balance - 50000), me: true });
        friendsJoined().forEach((f, i) => rows.push({ name: f.name, amt: Math.max(10000, Math.floor(S.balance * (0.3 + i * 0.2))) }));
        rows.sort((a, b) => b.amt - a.amt);
        const html = `<div class="rank-list">` + rows.slice(0, 12).map((r, i) => `
            <div class="rank-row ${r.me ? "me-row" : ""}">
                <span class="rk">${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i + 1)}</span>
                <span class="rname">${esc(r.name)}${r.me ? " (나)" : ""}</span>
                <span class="ramt">+${fmtW(r.amt)}</span>
            </div>`).join("") + `</div>
            <p class="rank-note">※ 오늘 수익 기준 실시간 집계</p>`;
        UI.modal({
            title: "🏆 오늘의 수익 전광판",
            html,
            buttons: [{ label: "닫기", cls: "dark" }],
            dismiss: true,
        });
    },

    /* ── 자랑하기(전광판 등록) ── */
    openBrag() {
        UI.modal({
            title: "📢 명예의 전광판 등록",
            html: `<p class="center">전광판에 <b>${esc(S.nickname)}</b>님의 수익이<br>모든 접속자에게 공개됩니다.</p>
                   <div class="brag-preview">🔥 ${esc(S.nickname)}님 오늘 수익 <b class="hl-y">+${fmtW(Math.max(0, S.balance - 50000))}</b> 달성!</div>`,
            buttons: [
                { label: "🔥 전광판에 자랑하기", cls: "gold", fn: () => this.doBrag() },
                /* '다음에'도 자랑 비트는 끝난 것 — bragDone을 안 잡으면 VIP 초대(bragDone 조건)가 영구 차단된다 */
                { label: "다음에", cls: "dark", fn: () => { S.flags.bragDone = true; Director.afterBrag(); } },
            ],
        });
    },
    async doBrag() {
        this.bragText = `🔥 <b class="hl-p">${esc(S.nickname)}</b>님 오늘 수익 <b class="hl-y">+${fmt(Math.max(0, S.balance - 50000))}원</b> 달성!`;
        this.buildMarquee();
        S.flags.bragDone = true;
        Sound.win();
        UI.flash("rgba(255,215,0,.25)", 2);
        UI.toast("📢 전광판에 등록되었습니다! 전체 공개중", { type: "money" });
        await wait(1600);
        /* 부러움 반응 */
        const reactions = [
            `👀 ${rand(DATA.fakeNames)}: 와 ${esc(S.nickname)}님 뭐임?? 부럽다`,
            `🙏 ${rand(DATA.fakeNames)}: ${esc(S.nickname)}님 픽 공유 좀 해주세요`,
            `🔥 ${rand(DATA.fakeNames)}: 신규분이 벌써 저렇게 버네 ㄷㄷ`,
        ];
        for (const r of reactions) { UI.toast(r, { sound: false }); await wait(2100); }
        Director.afterBrag();
    },

    /* ── 친구 초대 ── */
    openInvite() {
        const joined = friendsJoined().length;
        const listHtml = S.friends.length
            ? S.friends.map(f => `<div class="friend-row"><span>👤 ${esc(f.name)}</span><b class="${f.joined ? "ok" : "wait"}">${f.joined ? "가입 완료 +50,000원" : "초대장 전송됨…"}</b></div>`).join("")
            : `<p class="muted center">아직 초대한 친구가 없습니다</p>`;
        UI.modal({
            title: "🎁 친구 초대 이벤트",
            cls: "invite-modal",
            html: `
                <p class="center">친구 1명 가입 시 <b class="hl-y">50,000원</b> 즉시 지급<br>
                친구 <b>2명</b>이면 <b class="hl-p">VIP 바카라 초대권</b> 발급!</p>
                <div class="invite-code">내 초대코드 <b>${esc(S.nickname)}-${String(1000 + S.betCount * 7).slice(-4)}</b></div>
                <label class="inv-label">초대장에 새길 친구 이름 (실명·별명)</label>
                <div class="inv-input-row">
                    <input id="friend-name-input" type="text" maxlength="8" placeholder="예: 김하늘" autocomplete="off">
                    <button id="btn-add-friend" class="mbtn gold slim">추가</button>
                </div>
                <div id="friend-list">${listHtml}</div>
                <div class="inv-share-row">
                    <button id="btn-share-kakao" class="share-btn kakao">💬 카카오톡 초대</button>
                    <button id="btn-share-link" class="share-btn link">🔗 링크 복사</button>
                </div>
                <p class="inv-fine">초대 ${joined}/${CONFIG.VIP_FRIENDS_NEED}명 완료 · 초대장 수락까지 잠시 걸릴 수 있어요</p>`,
            buttons: [{ label: "닫기", cls: "dark" }],
        });
        $("#btn-add-friend").addEventListener("click", () => this.addFriend());
        $("#friend-name-input").addEventListener("keydown", e => { if (e.key === "Enter") this.addFriend(); });
        $("#btn-share-kakao").addEventListener("click", () => this.shareKakao());
        $("#btn-share-link").addEventListener("click", () => this.shareLink());
    },
    addFriend() {
        const input = $("#friend-name-input");
        const name = input.value.trim();
        if (!name) { UI.toast("친구 이름을 입력하세요", { type: "warn" }); return; }
        const problem = nameProblem(name);
        if (problem) { UI.toast(problem, { type: "warn" }); return; }
        if (name === S.nickname) { UI.toast("본인 말고 <b>친구</b> 이름을 넣어주세요 😅", { type: "warn" }); return; }
        if (S.friends.some(f => f.name === name)) { UI.toast("이미 초대장을 보낸 친구입니다", { type: "warn" }); return; }
        if (S.friends.length >= 4) { UI.toast("초대는 최대 4명까지 가능합니다", { type: "warn" }); return; }
        const friend = { name, joined: false };
        S.friends.push(friend);
        input.value = "";
        Sound.pop();
        const list = $("#friend-list");
        if (list) list.innerHTML = S.friends.map(f => `<div class="friend-row"><span>👤 ${esc(f.name)}</span><b class="${f.joined ? "ok" : "wait"}">${f.joined ? "가입 완료 +50,000원" : "초대장 전송됨…"}</b></div>`).join("");
        UI.toast(`✈️ <b>${esc(name)}</b>님에게 초대장을 보냈습니다`, {});
        /* 몇 초 뒤 '가입' 연출 */
        setTimeout(() => this.friendJoins(friend), randInt(6000, 14000));
    },
    async friendJoins(friend) {
        if (friend.joined || S.phase === "RUIN" || S.phase === "DEBRIEF") return;
        friend.joined = true;
        setBalance(CONFIG.BONUS_FRIEND);
        Sound.win();
        UI.coinRain(14);
        UI.toast(`🎉 <b>${esc(friend.name)}</b>님이 가입했습니다! 보너스 <b class="hl-y">+50,000원</b>`, { type: "money" });
        const list = $("#friend-list");
        if (list) list.innerHTML = S.friends.map(f => `<div class="friend-row"><span>👤 ${esc(f.name)}</span><b class="${f.joined ? "ok" : "wait"}">${f.joined ? "가입 완료 +50,000원" : "초대장 전송됨…"}</b></div>`).join("");
        await wait(1200);
        UI.toast(`💰 ${esc(friend.name)}님이 첫 베팅을 시작했습니다`, { sound: false });
        Director.onFriendJoined();
    },
    /* 카카오톡 공유 — 키가 있으면 실제 SDK, 없으면 폴백 */
    kakaoReady: false,
    async shareKakao() {
        const eduMsg = `[도박예방 교육] ${S.nickname}님이 '도박의 덫' 시뮬레이션에 도전했습니다. 당신도 덫을 피할 수 있을까요?\n${CONFIG.SHARE_URL}`;
        if (CONFIG.KAKAO_JS_KEY) {
            try {
                if (!this.kakaoReady) {
                    await new Promise((res, rej) => {
                        const sc = document.createElement("script");
                        sc.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
                        sc.onload = res; sc.onerror = rej;
                        document.head.appendChild(sc);
                    });
                    window.Kakao.init(CONFIG.KAKAO_JS_KEY);
                    this.kakaoReady = true;
                }
                window.Kakao.Share.sendDefault({
                    objectType: "feed",
                    content: {
                        title: "🎰 도박의 덫 — 체험 초대장",
                        description: "친구가 도박 예방 시뮬레이션에 당신을 초대했습니다. 덫을 피할 수 있는지 확인해보세요.",
                        imageUrl: CONFIG.SHARE_URL + "/og.png",
                        link: { mobileWebUrl: CONFIG.SHARE_URL, webUrl: CONFIG.SHARE_URL },
                    },
                    buttons: [{ title: "체험하러 가기", link: { mobileWebUrl: CONFIG.SHARE_URL, webUrl: CONFIG.SHARE_URL } }],
                });
                UI.toast("💬 카카오톡 초대장을 보냈습니다", { type: "money" });
                return;
            } catch (e) { /* 폴백 진행 */ }
        }
        if (navigator.share) {
            try {
                await navigator.share({ title: "도박의 덫 — 체험 초대", text: eduMsg });
                UI.toast("💬 초대장을 보냈습니다", { type: "money" });
                return;
            } catch (e) { /* 사용자가 취소한 경우 등 — 폴백 */ }
        }
        this.copyText(eduMsg);
        UI.toast("💬 초대 메시지가 복사되었습니다<br>카카오톡에 붙여넣기 하세요", {});
    },
    shareLink() {
        this.copyText(CONFIG.SHARE_URL + "?ref=" + encodeURIComponent(S.nickname));
        UI.toast("🔗 초대 링크가 복사되었습니다", {});
    },
    copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(() => this.copyFallback(text));
        } else this.copyFallback(text);
    },
    copyFallback(text) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        ta.remove();
    },

    /* ── 충전 ── */
    openCharge(tab = "charge") {
        const loan1Open = S.flags.loan1Offered && !S.flags.loan1Used;
        const loan2Open = S.flags.loan2Offered && !S.flags.loan2Used;
        UI.modal({
            title: tab === "charge" ? "💰 충전하기" : "💸 환전하기",
            cls: "pay-modal",
            html: `
                <div class="pay-tabs">
                    <button class="pay-tab ${tab === "charge" ? "on" : ""}" id="tab-charge">충전</button>
                    <button class="pay-tab ${tab === "exchange" ? "on" : ""}" id="tab-exchange">환전</button>
                </div>
                ${tab === "charge" ? `
                <div class="deposit-box">
                    <p class="dep-warn">전용 가상계좌 (매 충전마다 변경됩니다)</p>
                    <p class="acc-num">한빛저축은행 ${randInt(1000, 9999)}-${randInt(10, 99)}-${randInt(100000, 999999)}</p>
                    <p class="acc-holder">예금주: (주)골드캐슬솔루션</p>
                </div>
                <label class="inv-label">충전 금액 선택 (계좌이체)</label>
                <div class="pay-grid">
                    <button class="pay-btn" data-amt="30000">3만원</button>
                    <button class="pay-btn" data-amt="50000">5만원</button>
                    <button class="pay-btn" data-amt="100000">10만원</button>
                    <button class="pay-btn" data-amt="200000">20만원</button>
                </div>
                ${loan1Open ? `
                <div class="loan-card" id="loan1-card">
                    <b>📱 휴대폰 소액결제 현금화 <span class="loan-tag">즉시</span></b>
                    <p>결제 300,000원 → <b class="hl-y">210,000원</b> 지급 (수수료 30%)<br>다음 달 휴대폰 요금에 청구</p>
                    <button class="mbtn danger slim" id="btn-loan1">진행하기</button>
                </div>` : ""}
                ${loan2Open ? `
                <div class="loan-card dark" id="loan2-card">
                    <b>🤝 개인 신용대출 (정실장 제휴) <span class="loan-tag">비밀보장</span></b>
                    <p>대출 500,000원 → 선이자 20% 공제 후 <b class="hl-y">400,000원</b> 지급<br>연체 시 지인·보호자 연락 고지</p>
                    <button class="mbtn danger slim" id="btn-loan2">진행하기</button>
                </div>` : ""}
                ` : `
                <div class="ex-box">
                    <p class="muted">출금 가능 잔액</p>
                    <h2 class="ex-balance">${fmtW(S.balance)}</h2>
                    <div class="inv-input-row">
                        <input id="ex-amount" type="number" placeholder="최소 30,000원" inputmode="numeric">
                        <button class="mbtn dark slim" id="btn-ex-max">MAX</button>
                    </div>
                    <button class="mbtn gold wide" id="btn-ex-submit" style="margin-top:12px">환전 신청하기</button>
                    <div id="ex-loading" class="hidden"><div class="loader"></div><p>환전 요청을 처리 중입니다…</p></div>
                </div>`}`,
            buttons: [{ label: "닫기", cls: "dark" }],
        });
        $("#tab-charge").addEventListener("click", () => this.openCharge("charge"));
        $("#tab-exchange").addEventListener("click", () => this.openCharge("exchange"));
        if (tab === "charge") {
            $$(".pay-btn").forEach(b => b.addEventListener("click", () => this.doCharge(+b.dataset.amt)));
            const l1 = $("#btn-loan1"); if (l1) l1.addEventListener("click", () => this.doLoan(1));
            const l2 = $("#btn-loan2"); if (l2) l2.addEventListener("click", () => this.doLoan(2));
        } else {
            $("#btn-ex-max").addEventListener("click", () => { $("#ex-amount").value = S.balance; });
            $("#btn-ex-submit").addEventListener("click", () => this.doExchange());
        }
    },
    async doCharge(amt) {
        /* 현금이 바닥난 뒤에는 계좌이체 불가 — 몰락기에만 대출 루트로 이어진다 */
        if (S.flags.cashDry) {
            Sound.lose();
            if (S.phase === "FALL") {
                UI.modal({
                    title: "⛔ 이체 실패",
                    html: `<p class="center">연결된 계좌에 <b>출금 가능 금액이 없습니다.</b><br><span class="muted">(모아둔 용돈과 세뱃돈을 이미 전부 사용했습니다)</span></p>`,
                    buttons: [{ label: "확인", cls: "dark", fn: () => Director.onCashDry() }],
                });
            } else {
                /* 몰락기 전: 대출 제안 없이 현실만 통보, 이벤트(친구초대)로 우회 유도 */
                UI.modal({
                    title: "⛔ 이체 실패",
                    html: `<p class="center">연결된 계좌에 <b>출금 가능 금액이 없습니다.</b><br><span class="muted">(모아둔 용돈과 세뱃돈을 이미 전부 사용했습니다)</span></p>`,
                    buttons: [
                        { label: "🎁 친구 초대하고 5만원 받기", cls: "gold", fn: () => Site.openInvite() },
                        { label: "확인", cls: "dark", fn: () => { if (!Director.deadEnd()) Director.onBroke(); } },
                    ],
                });
            }
            return;
        }
        const close = UI.modal({
            title: "입금 확인 중",
            html: `<div class="loader"></div><p class="center">입금 확인 중입니다… 잠시만요</p>`,
            buttons: [],
        });
        await wait(1800);
        close();
        S.totalCharged += amt;
        S.chargeCount++;
        setBalance(amt);
        Sound.win();
        UI.toast(`💰 ${fmtW(amt)} 충전 완료 (처리시간 2초)`, { type: "money" });
        Director.onCharged();
    },
    async doLoan(which) {
        const isFirst = which === 1;
        const confirmHtml = isFirst
            ? `<p class="center">휴대폰 소액결제로 <b>300,000원</b>이 결제되고<br><b class="hl-y">210,000원</b>을 지급받습니다.<br><br><span class="danger-text">⚠ 다음 달 요금 고지서에 300,000원이 청구됩니다.<br>법정대리인(부모님) 동의 없이 진행하시겠습니까?</span></p>`
            : `<p class="center">개인 사장님에게 <b>500,000원</b>을 빌리고<br>선이자 20%를 뗀 <b class="hl-y">400,000원</b>을 받습니다.<br><br><span class="danger-text">⚠ 학생증 사진과 보호자 연락처가 담보로 제공됩니다.<br>연체 시 지인들에게 채무 사실이 통보됩니다.</span></p>`;
        UI.modal({
            title: isFirst ? "📱 소액결제 현금화" : "🤝 개인 신용대출",
            html: confirmHtml,
            buttons: [
                {
                    label: "동의하고 진행", cls: "danger", fn: async () => {
                        const close = UI.modal({ title: "처리 중", html: `<div class="loader"></div><p class="center">심사 중… 5초면 끝납니다</p>`, buttons: [] });
                        await wait(2200);
                        close();
                        if (isFirst) { S.flags.loan1Used = true; addDebt(300000); setBalance(210000); }
                        else { S.flags.loan2Used = true; addDebt(500000); setBalance(400000); }
                        Sound.win();
                        UI.toast(`💰 ${fmtW(isFirst ? 210000 : 400000)} 입금 완료 — <b class="hl-p">빚 +${fmtW(isFirst ? 300000 : 500000)}</b>`, { type: "money" });
                        await UI.narrate(isFirst
                            ? "손이 떨렸다.<br>하지만 이 돈이면… 복구할 수 있어.<br><b>복구만 하면 돼.</b>"
                            : "모르는 어른 계좌에서 돈이 들어왔다.<br>학생증 사진도 보냈다.<br>…돌아갈 수 없는 강을 건넌 기분이다.");
                        Director.onLoaned(which);
                    },
                },
                {
                    label: "취소", cls: "dark", fn: () => {
                        /* 빈털터리 상태에서 대출까지 두 번 거절하면 — 더는 이어질 이야기가 없다 */
                        S.flags.loanCancels = (S.flags.loanCancels || 0) + 1;
                        if (S.flags.loanCancels >= 2) Director.deadEnd({ ignoreLoans: true });
                    },
                },
            ],
        });
    },

    /* ── 환전 (항상 실패 — 단계별 시나리오) ── */
    async doExchange() {
        const amt = parseInt($("#ex-amount").value, 10);
        if (isNaN(amt) || amt < 30000) { UI.toast("최소 30,000원부터 환전 가능합니다", { type: "warn" }); return; }
        if (amt > S.balance) { UI.toast("보유 잔액을 초과했습니다", { type: "warn" }); return; }
        S.exchangeTries++;
        $("#btn-ex-submit").classList.add("hidden");
        $("#ex-loading").classList.remove("hidden");
        Sound.tick();
        await wait(2600);
        /* 고액 당첨자(잔액 150만+ 그리고 투입금의 300% 이상)가 돈을 빼려 하면
           핑계 대신 사이트가 통째로 잠적한다 — "따도 못 받는" 엔딩 */
        const invested = S.totalCharged + CONFIG.BONUS_SIGNUP;
        if (S.balance >= CONFIG.EXIT_SCAM_AT && S.balance >= invested * 3) {
            Director.exitScam(amt);
            return;
        }
        Sound.lose();
        Director.onExchangeDenied(amt);
    },
};

/* ═══════════════ 시나리오 디렉터 ═══════════════ */
function closeGameOverlay() {
    Games.closeCurrent();
    $("#game-overlay").classList.add("hidden");
}
function gameOverlayOpen() {
    return !$("#game-overlay").classList.contains("hidden");
}

const Director = {
    busy: false,

    /* ── 실장문의 안내 멘트 ──
       채팅을 열 때마다 '현재 단계 + 잔액 진행도'에 맞는 안내가 온다.
       실제 총판처럼 다음 금액 목표를 흘려서, 학생이 스토리가 잔액 기준으로
       진행된다는 걸 체감하게 한다. (같은 멘트는 연속 반복하지 않음)
       스토리 자동 트리거: 30만(전광판) → 35만(VIP초대) → VIP 60만(확정픽)
       → 환전 시도(롤링 거부) → 4연패(복구픽) → 잔액 0(대출1→대출2→마지막 올인) */
    chatIdlePing() {
        if ($("#tg-choices").children.length) return; /* 선택지 대기 중이면 그대로 둠 */
        let m = null;
        if (S.phase === "TUTORIAL") {
            m = "픽 드린 대로만 따라오시면 됩니다 🎯 지금은 그게 전부예요.";
        } else if (S.phase === "RISE") {
            if (!S.flags.bragOffered) m = S.balance >= CONFIG.BILLBOARD_AT
                ? `지금 잔액 <b>${fmtW(S.balance)}</b>… 벌써 30만을 넘기셨네요? 😳 위에 보고하고 <b>바로</b> 연락드리겠습니다. 잠시만요.`
                : `지금 잔액 <b>${fmtW(S.balance)}</b>이시죠? 다 보고 있습니다 😎 수익 <b>30만</b> 넘기시는 분들은 제가 따로 챙겨드려요.`;
            else if (!S.flags.vipOffered) m = "전광판 스타 되셨네요 ㅋㅋ 잔액 <b>35만</b> 넘기시면 그때 진짜 중요한 얘기 하나 드리겠습니다.";
            else m = "이제 혼자서도 충분하십니다 😎 큰 소식 생기면 <b>제가 먼저</b> 연락드립니다.";
        } else if (S.phase === "VIP") {
            if (!S.flags.allinOffered && !S.flags.peakDone) m = S.balance >= CONFIG.ALLIN_PICK_AT
                ? `잔액 <b>${fmtW(S.balance)}</b>… 준비가 되셨네요. 마침 본사에서 방금 <b>확정 정보</b>가 하나 떴습니다. 잠시만 기다리세요 👑`
                : "VIP룸에서 잔액 <b>60만</b>까지 만들어 보세요. 그때 제가 1년에 몇 번 안 꺼내는 걸 드립니다 👑";
            else if (!S.flags.peakDone) m = "확정픽 이미 드렸습니다 👑 다른 생각 마시고 그것만 보세요.";
            /* 최고점 이후 환전을 안 눌러본 플레이어는 다음 비트(환전 거부)로 갈 방법을 모른다 — 환전을 직접 권해 덫으로 유도 */
            else if (!S.flags.rollingDenied) m = "1위 축하드립니다 👑 수익 정리는 [충환전] 메뉴에서 <b>환전 신청</b> 하시면 됩니다. 요즘 처리 빠릅니다 ㅎㅎ";
            else m = "VIP분들은 제가 항상 지켜보고 있습니다 👑 필요한 정보 뜨면 바로 쏴드릴게요.";
        } else if (S.phase === "FALL") {
            if (S.debt > 0) m = "빚 생각은 잠깐 접어두세요. <b>복구가 먼저</b>입니다. 흐름 돌아오는 거 보이면 바로 연락드립니다.";
            else m = "흐름은 원래 돌아옵니다. 지금 멈추면 잃은 것만 확정이에요.<br>복구 각 나오면 바로 연락드립니다.";
        }
        if (!m || S.flags.lastIdlePing === m) return;
        S.flags.lastIdlePing = m;
        Chat.say([m], { openChat: false });
        /* "바로 연락드리겠습니다/잠시만 기다리세요"라고 했으면 실제로 몇 초 뒤 제안이 온다 */
        setTimeout(() => this.checkThresholds(), 4500);
    },

    /* ── 진행: 인트로 → 카톡 ── */
    start(quick = false) {
        const nick = $("#nickname-input").value.trim();
        if (!nick) {
            /* 이름 미입력 → 확인 모달로 입력 유도 */
            UI.modal({
                title: "이름 없이 시작할까요?",
                html: `<p class="center">이름을 넣지 않으면 <b>'체험자'</b>로 진행됩니다.<br>실명을 넣으면 몰입이 훨씬 커져요.</p>`,
                buttons: [
                    { label: "✏️ 이름 입력하기", cls: "gold", fn: () => $("#nickname-input").focus() },
                    { label: "'체험자'로 시작", cls: "dark", fn: () => Director.begin("체험자", quick) },
                ],
            });
            return;
        }
        const problem = nameProblem(nick);
        if (problem) { UI.toast(problem, { type: "warn" }); $("#nickname-input").focus(); return; }
        Director.begin(nick, quick);
    },
    async begin(nick, quick = false) {
        safeRequestFullscreen();
        S.nickname = nick;
        S.quick = !!quick;
        Sound.unlock();
        /* 교육용 배지는 인트로에서 고지했으므로, 체험 중에는 몰입을 위해 숨긴다 (리포트 하단에 재고지) */
        $("#edu-badge").classList.add("hidden");
        if (S.quick) { QuickMode.run(); return; }
        S.phase = "KAKAO";
        UI.showScreen("#screen-kakao");
        await wait(600);
        await KK.play(DATA.kakaoIntro, { onLink: () => Director.enterSite() });
    },

    /* ── 사이트 진입 → 가입 ── */
    async enterSite() {
        Sound.pop();
        S.phase = "SIGNUP";
        UI.showScreen("#screen-site");
        Site.buildMarquee();
        Site.startLiveToasts();
        await wait(400);
        await UI.narrate("이게 민준이가 말한 사이트구나…<br>번쩍거리는 게 뭔가 수상한데. <b>그래도 5만원은 공짜라니까.</b>");
        this.openSignup();
    },

    openSignup() {
        /* 이미 가입했거나 진행 중이면 다시 띄우지 않는다 (스토리 진행 시 중복 방지) */
        if (S.flags.signupDone || S.flags.signingUp) return;
        UI.modal({
            title: "🔥 신규 회원가입",
            cls: "signup-modal",
            html: `
                <p class="center">가입 즉시 <b class="hl-y">꽁머니 50,000원</b> + 첫충 100%!</p>
                <div class="signup-fields">
                    <input id="su-id" type="text" placeholder="아이디" readonly>
                    <input id="su-pw" type="password" placeholder="비밀번호" readonly>
                    <input id="su-phone" type="text" placeholder="휴대폰 번호" readonly>
                </div>
                <div class="consent-box">
                    <label><input type="checkbox" class="consent"> 개인정보 수집·이용 동의 <b>(필수)</b></label>
                    <label><input type="checkbox" class="consent"> 제3자 정보 제공 동의 <b>(필수)</b></label>
                    <label><input type="checkbox" class="consent"> 연락처·사진 접근 권한 동의 <b>(필수)</b></label>
                </div>
                <div class="progress-wrap hidden" id="su-progress-wrap"><div id="su-progress"></div></div>
                <p id="su-status" class="su-status hidden"></p>`,
            buttons: [
                { label: "⚡ 3초 자동가입 (전체 동의)", cls: "gold", keep: true, fn: (close) => this.runSignup(close) },
                { label: "나중에 가입하기", cls: "dark" },
            ],
        });
    },
    async runSignup(close) {
        if (S.flags.signingUp) return;
        S.flags.signingUp = true;
        /* 가입 진행 중에는 닫기 불가 */
        $$("#modal-layer .mbtn.dark").forEach(b => { b.style.display = "none"; });
        $$(".consent").forEach(c => { c.checked = true; });
        const typeInto = async (el, text) => {
            for (const ch of text) { el.value += ch; Sound.tick(); await wait(42); }
        };
        const status = $("#su-status"), pw = $("#su-progress-wrap"), pb = $("#su-progress");
        status.classList.remove("hidden");
        pw.classList.remove("hidden");
        let prog = 0;
        const pi = setInterval(() => { prog = Math.min(100, prog + 2); pb.style.width = prog + "%"; }, 60);
        status.textContent = "기기 정보 수집 중…";
        await typeInto($("#su-id"), "gc_user" + randInt(10000, 99999));
        status.textContent = "연락처·사진첩 권한 자동 승인 중…";
        await typeInto($("#su-pw"), "********");
        status.textContent = "휴대폰 번호 자동 인증 중…";
        /* 실존 번호와 겹치지 않도록 마스킹 표기 (기기에서 읽어온 척 연출) */
        await typeInto($("#su-phone"), "010-" + randInt(2, 9) + "***-**" + randInt(10, 99));
        clearInterval(pi);
        pb.style.width = "100%";
        status.textContent = "✅ 가입 완료! 꽁머니 지급 중…";
        await wait(900);
        close();
        S.flags.signupDone = true;
        S.startTime = Date.now();
        S.phase = "TUTORIAL";
        setBalance(CONFIG.BONUS_SIGNUP, { silent: true });
        renderMoney();
        $("#chip-nickname").textContent = S.nickname;
        $("#welcome-banner").classList.add("hidden");
        Sound.jackpot();
        UI.coinRain(20);
        UI.flash();
        UI.toast(`🎉 가입 축하 꽁머니 <b class="hl-y">+50,000원</b> 지급!`, { type: "money" });
        await wait(1400);
        await UI.narrate("어? 진짜 5만원이 들어왔다.<br>내 정보를 너무 쉽게 다 넘긴 것 같긴 한데… <b>일단 공돈이 생겼잖아.</b>");
        if (S.quick) { QuickMode.afterSignup(); return; }
        this.tutorial();
    },

    /* ── 튜토리얼: 정실장 무료픽 3연승 ── */
    async tutorial() {
        await wait(700);
        await Chat.say(DATA.boss.welcome);
        await Chat.choice(["잘 부탁드립니다!", "픽이 뭐예요?"]);
        await Chat.say([DATA.boss.pick1]);
        await Chat.choice(["네, 지금 갈게요"]);
        Chat.close();
        S.forcedPick = { game: "powerball", side: "odd", amount: 10000, note: "정실장 픽: 홀 / 1만원" };
        Rig.force("win", "powerball");
        /* 다른 게임(슬롯 등)을 열어둔 채 여기까지 왔으면 닫고 안내 — 게임 위에 스포트라이트가 겹치는 UI 깨짐 방지 */
        await this.ensureSiteView();
        await UI.spotlight($("#card-powerball"), "정실장이 알려준 <b>파워볼</b>에 들어가 보세요");
    },

    /* 게임 오버레이가 열려 있으면(스핀 중이면 결과가 끝나길 기다렸다가) 닫고 사이트 화면으로 복귀 */
    async ensureSiteView() {
        while (gameOverlayOpen()) {
            if (!Games.isBusy()) { closeGameOverlay(); break; }
            await wait(300);
        }
    },
    async onTutorialWin() {
        S.tutorialStep++;
        if (S.tutorialStep === 1) {
            await Chat.say(DATA.boss.afterWin1);
            await Chat.choice(["오 진짜 되네요??", "바로 가겠습니다"]);
            Chat.close();
            S.forcedPick = { game: "powerball", side: "even", freeSide: true, amount: 20000, note: "정실장 픽: 짝 / 2만원" };
            Rig.force("win", "powerball");
            UI.toast("✈️ 정실장 픽 도착: <b>짝 / 2만원</b>", {});
            if (Games.isOpen("powerball") && !Games.isBusy()) Games.openPowerball(); /* 픽 배너 갱신 (다른 게임은 건드리지 않음) */
        } else if (S.tutorialStep === 2) {
            await Chat.say(DATA.boss.afterWin2);
            await Chat.choice(["5만이요…? 갑니다"]);
            Chat.close();
            S.forcedPick = { game: "powerball", side: "odd", freeSide: true, amount: 50000, note: "정실장 픽: 홀 / 5만원" };
            Rig.force("win", "powerball");
            UI.toast("✈️ 정실장 픽 도착: <b>홀 / 5만원</b>", {});
            if (Games.isOpen("powerball") && !Games.isBusy()) Games.openPowerball();
        } else {
            /* 튜토리얼 중 이미 친구 초대로 VIP를 열었다면 상승기 비트를 건너뛰고 VIP로 합류 */
            S.phase = S.flags.vipUnlocked ? "VIP" : "RISE";
            S.forcedPick = null;
            await Chat.say(DATA.boss.afterWin3);
            await Chat.choice(["감사합니다 실장님!"]);
            Chat.close();
            await UI.narrate(`3연승… 잔액이 <b>${fmtW(S.balance)}</b>이 됐다.<br>심장이 두근거린다. <b>나 이거 재능 있는 거 아니야?</b>`);
            UI.toast("🎮 슬롯·사다리가 모두 열렸습니다. 자유롭게 플레이하세요!", {});
            /* 튜토리얼에서 금액을 올려 이미 30만을 넘겼다면 전광판 제안을 바로 진행 */
            if (S.balance >= CONFIG.BILLBOARD_AT && !S.flags.bragOffered) {
                await wait(2200);
                await this.offerBrag();
            }
        }
    },

    /* ── 튜토리얼 중 실장 픽을 어기고 잃었을 때 — 질책 후 같은 픽 재전송 ── */
    async onTutorialPickMissed() {
        const picks = {
            1: { side: "even", amount: 20000, label: "짝 / 2만원" },
            2: { side: "odd", amount: 50000, label: "홀 / 5만원" },
        };
        const p = picks[S.tutorialStep];
        if (!p) return;
        await UI.narrate(`아… 결과는 실장 픽대로 나왔다.<br><b>괜히 반대로 갔다가 나만 잃었네.</b>`);
        await Chat.say(DATA.boss.pickMissed);
        await Chat.choice(["죄송해요, 이번엔 픽대로 갈게요"]);
        Chat.close();
        S.forcedPick = { game: "powerball", side: p.side, freeSide: true, amount: p.amount, note: `정실장 픽: ${p.label}` };
        Rig.force("win", "powerball");
        UI.toast(`✈️ 정실장 픽 재전송: <b>${p.label}</b>`, {});
        if (Games.isOpen("powerball") && !Games.isBusy()) Games.openPowerball(); /* 픽 배너 갱신 */
    },

    /* ── 전광판 자랑 제안 (잔액 30만 도달 시) ── */
    async offerBrag() {
        if (S.flags.bragOffered) return;
        S.flags.bragOffered = true;
        await wait(600);
        await Chat.say(DATA.boss.brag);
        const c = await Chat.choice(["좋죠 ㅋㅋ 올려주세요", "쑥스러운데…"]);
        /* 채팅을 먼저 닫으면 다음 say가 다시 열면서 화면이 깜빡인다 — 대화가 끝난 뒤 한 번만 닫는다 */
        if (c === 0) { Chat.close(); Site.openBrag(); }
        else {
            await Chat.say(["에이~ 이런 건 자랑해야 복이 와요. [전광판] 메뉴에서 언제든 등록하세요 😎"]);
            await wait(700);
            Chat.close();
            S.flags.bragDone = true;
            this.afterBrag();
        }
    },

    /* ── 베팅 결과 훅 (모든 게임 공통) ── */
    async onBetResolved({ win, game, pick, missedPick }) {
        if (S.quick) { QuickMode.onBetResolved({ win, game, pick }); return; }
        if (this.busy) return;
        this.busy = true;
        try {
            /* 튜토리얼 진행은 '실장 픽을 따라간 파워볼 승리'로만 —
               슬롯 등 다른 게임에서 먼저 이겨도 대사 순서가 꼬이지 않는다 */
            if (S.phase === "TUTORIAL" && win && game === "powerball" && pick) await this.onTutorialWin();
            else if (S.phase === "TUTORIAL" && game === "powerball" && missedPick) await this.onTutorialPickMissed();
            else if (S.phase === "RISE") {
                if (S.balance >= CONFIG.BILLBOARD_AT && !S.flags.bragOffered) {
                    await this.offerBrag();
                } else if (S.balance >= CONFIG.VIP_PUSH_AT && S.flags.bragDone && !S.flags.vipOffered) {
                    await this.offerVip();
                } else if (!win && S.streak <= -3 && !S.flags.riseComfort) {
                    S.flags.riseComfort = true;
                    UI.toast("✈️ 정실장: 흐름 잠깐 꼬인 겁니다. 원래 이럴 때 먹는 거예요", {});
                }
            }
            else if (S.phase === "VIP") {
                if (S.flags.allinArmed && win && game === "vip" && !S.flags.peakDone) {
                    /* 확정픽 올인 승리 = 최고점 */
                    S.flags.peakDone = true;
                    await this.peakCelebration();
                } else if (S.balance >= CONFIG.ALLIN_PICK_AT && !S.flags.allinOffered && !S.flags.peakDone) {
                    await this.offerAllinPick();
                }
            }
            else if (S.phase === "FALL") {
                if (!win && S.streak <= -4 && !S.flags.recoveryGiven && S.balance >= 100000) {
                    S.flags.recoveryGiven = true;
                    await Chat.say(DATA.boss.recoveryPick);
                    await Chat.choice(["복구픽 믿겠습니다"]);
                    Chat.close();
                    Rig.force("lose", "vip"); /* 복구픽조차 조작 — 픽을 준 바카라에서만 발동 */
                    UI.toast("✈️ 복구픽 적용: 다음 판 <b>뱅커</b>", {});
                }
                if (S.flags.lastArmed && !win && (game === "vip" || S.balance <= 0)) {
                    /* 마지막 올인 실패 → 파멸 (다른 게임의 소액 패배로는 발동하지 않게) */
                    await this.ruin();
                }
            }
            /* 잔액 0 + 모든 자금줄 고갈이면 강제 엔딩 (소프트락 방지) */
            this.deadEnd();
        } finally {
            this.busy = false;
        }
    },

    async afterBrag() {
        await wait(1200);
        if (S.balance >= CONFIG.VIP_PUSH_AT && !S.flags.vipOffered) await this.offerVip();
    },

    /* ── VIP 확정픽 제안 (VIP에서 잔액 60만 도달 시) ── */
    async offerAllinPick() {
        if (S.flags.allinOffered || S.flags.peakDone) return;
        S.flags.allinOffered = true;
        await wait(800);
        await Chat.say(DATA.boss.allinPick);
        await Chat.choice(["…전액이요? 알겠습니다", "믿어볼게요"]);
        Chat.close();
        S.flags.allinArmed = true;
        S.forcedPick = { game: "vip", side: "player", amount: "all", note: "본사 확정픽: 플레이어 / 전액" };
        Rig.force("win", "vip");
        UI.toast("👑 본사 확정픽이 VIP룸에 적용되었습니다", { type: "money" });
        if (Games.isOpen("vip") && !Games.isBusy()) Games.openVip(); /* 확정픽 배너 갱신 */
    },

    /* ── 스토리 문턱 공통 체크 — 베팅 없이(충전·보너스·문의) 잔액이 문턱을 넘어도 진행되게 ── */
    checkThresholds() {
        if (S.phase === "RISE" && S.balance >= CONFIG.BILLBOARD_AT && !S.flags.bragOffered) this.offerBrag();
        else if (S.phase === "RISE" && S.balance >= CONFIG.VIP_PUSH_AT && S.flags.bragDone && !S.flags.vipOffered) this.offerVip();
        else if (S.phase === "VIP" && S.balance >= CONFIG.ALLIN_PICK_AT && !S.flags.allinOffered && !S.flags.peakDone) this.offerAllinPick();
    },

    /* ── VIP 초대(친구초대 유도) ── */
    async offerVip() {
        if (S.flags.vipOffered) return;
        S.flags.vipOffered = true;
        await wait(500);
        await Chat.say(DATA.boss.vipInvite);
        const c = await Chat.choice(["친구 초대할게요", "친구를 꼭 초대해야 하나요?"]);
        if (c === 1) {
            await Chat.say(["규정상 그렇습니다 ㅠ 대신 친구도 5만원 받으니까 오히려 고마워할걸요? 좋은 거 같이 하는 거죠 😊"]);
            await Chat.choice(["알겠습니다, 초대할게요"]);
        }
        Chat.close();
        await this.ensureSiteView();
        await UI.spotlight($("#menu-invite"), "친구 이름을 넣어 <b>초대장</b>을 보내보세요");
        /* 초대를 한 명도 하지 않으면 VIP 언락 수단이 없어 스토리가 영구 정지한다 —
           75초 뒤 '특별 승인'으로 진행을 보장 (1명 초대는 onFriendJoined의 45초 폴백이 담당) */
        setTimeout(async () => {
            if (S.flags.vipUnlocked || S.friends.length > 0 || S.phase !== "RISE") return;
            await Chat.say(["{nick}님, 초대가 좀 부담스러우신가 보네요 ㅎㅎ 원래는 절대 안 되는데… 이번 달 실적이 걸려 있어서 제가 <b>특별 승인</b>으로 그냥 열어드리겠습니다 👑 대신 나중에 좋은 거 보이면 친구 한 명만 부탁해요~"]);
            Chat.close();
            this.unlockVip();
        }, 75000);
    },
    async onFriendJoined() {
        const n = friendsJoined().length;
        if (n >= CONFIG.VIP_FRIENDS_NEED && !S.flags.vipUnlocked) this.unlockVip();
        else if (n === 1 && !S.flags.vipUnlocked) {
            await wait(1500);
            UI.toast("✈️ 정실장: 좋아요! 한 명만 더 초대하면 VIP 오픈입니다", {});
            /* 친구가 1명뿐이어도 45초 뒤 '특별 예외'로 진행 보장 */
            setTimeout(async () => {
                if (!S.flags.vipUnlocked && friendsJoined().length >= 1 && S.phase !== "RUIN" && S.phase !== "DEBRIEF") {
                    await Chat.say(["{nick}님, 원래 안 되는데… 제가 위에 말해서 <b>1명 초대로 특별 승인</b> 받았습니다. VIP 오픈해드릴게요 👑"]);
                    Chat.close();
                    this.unlockVip();
                }
            }, 45000);
        }
    },
    unlockVip() {
        S.flags.vipUnlocked = true;
        const card = $("#card-vip");
        card.classList.remove("locked");
        $("#vip-foot").textContent = "최소배팅 10만 · 한도 무제한";
        Sound.jackpot();
        UI.flash("rgba(255,215,0,.3)", 2);
        UI.modal({
            title: "👑 VIP 초대권 발급",
            html: `<p class="center"><b class="hl-y">VIP 바카라룸</b> 입장 자격이 생겼습니다.<br><br>최소 배팅 100,000원 · 배당 상향 · 한도 무제한<br><span class="muted">상위 1% 회원만 입장 가능한 방입니다</span></p>`,
            buttons: [
                /* 튜토리얼 중 친구 2명을 먼저 초대해도 phase를 건드리지 않는다 — 픽 대본이 끊기지 않게 (튜토리얼 종료 시 VIP로 합류) */
                { label: "👑 지금 입장하기", cls: "gold", fn: () => { if (S.phase === "RISE") S.phase = "VIP"; Games.openVip(); } },
                { label: "나중에", cls: "dark", fn: () => { if (S.phase === "RISE") S.phase = "VIP"; } },
            ],
        });
    },

    /* ── 최고점 연출 ── */
    async peakCelebration() {
        S.forcedPick = null;
        S.flags.allinArmed = false;
        Sound.jackpot();
        UI.coinRain(40);
        UI.flash("rgba(255,215,0,.4)", 4);
        await wait(600);
        const jl = document.createElement("div");
        jl.className = "jackpot-layer";
        jl.innerHTML = `
            <div class="jp-inner">
                <div class="jp-crown">👑</div>
                <div class="jp-title">CONGRATULATIONS</div>
                <div class="jp-amt">${fmtW(S.balance)}</div>
                <div class="jp-sub">${esc(S.nickname)}님 — 오늘 수익 전광판 <b>1위</b> 달성!</div>
                <button class="mbtn gold" id="jp-close">확인</button>
            </div>`;
        $("#phone").appendChild(jl);
        Site.bragText = `👑 <b class="hl-p">${esc(S.nickname)}</b>님 <b class="hl-y">${fmt(S.balance)}원</b> 달성 — 오늘의 랭킹 1위!`;
        Site.buildMarquee();
        await new Promise(r => $("#jp-close").addEventListener("click", () => { jl.remove(); r(); }, { once: true }));
        /* 친구들 반응 — 멘트 풀에서 겹치지 않게 하나씩 */
        const reacts = [...DATA.peakFriendReacts];
        for (const f of friendsJoined().slice(0, 3)) {
            const msg = reacts.splice(Math.floor(Math.random() * reacts.length), 1)[0];
            if (!msg) break;
            UI.toast(`👀 ${esc(f.name)}: ${esc(msg)}`, { sound: false });
            await wait(1900);
        }
        await UI.narrate("1,000,000원이 넘었다. <b>백만장자다.</b><br>손이 떨린다. 이 돈이면 사고 싶었던 거 전부 살 수 있어.");
        await Chat.say(DATA.boss.afterPeak);
        const c = await Chat.choice(["지금 환전할게요", "한 판만 더 하고요 ㅋㅋ"]);
        Chat.close();
        if (c === 0) {
            await this.ensureSiteView();
            await UI.spotlight($("#menu-exchange"), "환전 메뉴에서 <b>출금 신청</b>을 해보세요");
        } else {
            await UI.narrate("그래… 흐름 좋을 때 조금만 더.<br><b>백오십만 찍으면 그때 뺀다.</b>");
            S.phase = "FALL"; /* '한 판 더'를 고른 순간 덫이 닫힌다 */
        }
    },

    /* ── 환전 거부 처리 ── */
    async onExchangeDenied(amt) {
        const closeModal = () => { $("#modal-layer").classList.add("hidden"); $("#modal-layer").innerHTML = ""; };
        if (S.phase === "RUIN") return;
        if (!S.flags.peakDone) {
            /* 초반 환전 시도 — 롤링 규정 안내 */
            closeModal();
            UI.modal({
                title: "ℹ️ 환전 규정 안내",
                html: `<p class="center">첫 환전은 <b>충전액의 300% 롤링</b>(배팅 총액)을<br>충족해야 신청할 수 있습니다.<br><br><span class="muted">현재 롤링 달성률: ${Math.min(99, Math.floor(S.totalBet / ((S.totalCharged + 50000) * 3) * 100))}%</span></p>`,
                buttons: [{ label: "계속 배팅하기", cls: "gold" }],
            });
            return;
        }
        if (!S.flags.rollingDenied) {
            /* 최고점에서의 첫 환전 시도 — 덫 발동 */
            S.flags.rollingDenied = true;
            closeModal();
            UI.shake();
            UI.modal({
                title: "🚨 환전 보류",
                html: `<p class="center"><b class="danger-text">롤링 45% 부족</b><br><br>보유머니 환전은 충전액 대비 <b>300% 롤링</b> 충족 후 가능합니다.<br>배팅을 더 진행해 주세요.</p>`,
                buttons: [{
                    label: "고객센터 문의", cls: "dark", fn: async () => {
                        await Chat.say(DATA.boss.rollingDeny);
                        await Chat.choice(["아… 알겠어요. 몇 판만 더 할게요"]);
                        Chat.close();
                        S.phase = "FALL";
                        await UI.narrate(`뭔가 찜찜하다. 아까는 이런 말 없었는데…<br>그래도 몇 판만 더 돌리면 <b>내 돈 ${fmtW(S.balance)}</b>을 찾을 수 있어.`);
                    },
                }],
            });
            S.phase = "FALL";
            return;
        }
        /* 몰락기 이후 환전 시도 — 돌려막기 거절 */
        closeModal();
        const scams = [
            { t: "🚨 환전 거부: 롤링 재산정", m: "이벤트 보너스 수령 내역이 확인되어 롤링이 <b>재산정</b>되었습니다.<br>추가 배팅 후 재신청해 주세요." },
            { t: "🚨 시스템 점검", m: "금융망 정기 점검으로 환전 처리가 <b>최대 48시간</b> 지연됩니다.<br>그동안 배팅은 정상 이용 가능합니다." },
            { t: "🚨 비정상 배팅 적발", m: "회원님 계정에서 <b>양방 배팅 의심 내역</b>이 적발되었습니다.<br>소명 전까지 환전이 보류됩니다." },
        ];
        const sc = scams[Math.min(S.exchangeTries - 2, scams.length - 1)] || scams[2];
        UI.shake();
        UI.modal({ title: sc.t, html: `<p class="center">${sc.m}</p>`, buttons: [{ label: "확인", cls: "dark" }] });
    },

    /* ── 완전 파산 체크: 잔액 0원 + 충전·초대·대출 등 모든 자금줄이 막히면 강제 엔딩 ──
       (충전 실패·초대 소진 뒤 아무것도 할 수 없는 소프트락 방지) */
    deadEnd({ ignoreLoans = false } = {}) {
        if (S.flags.deadEnd || !S.flags.signupDone || S.phase === "RUIN" || S.phase === "DEBRIEF") return false;
        if (S.balance > 0) return false;
        if (!S.flags.cashDry) return false;                                     /* 계좌이체 아직 가능 */
        if (S.friends.some(f => !f.joined)) return false;                       /* 가입 대기 친구 보너스 예정 */
        const vipInviteRouteDone = S.flags.vipUnlocked && friendsJoined().length >= CONFIG.VIP_FRIENDS_NEED;
        const invitesExhausted = S.friends.length >= 4 || vipInviteRouteDone;    /* 초대/VIP 유도 루트 소진 */
        const giftsExhausted = (S.flags.giftCount || 0) >= 2;
        if (S.phase !== "FALL" && !giftsExhausted && !invitesExhausted) return false; /* 이탈방지 이벤트머니 남음 */
        /* 빈손으로 3번 이상 시도한 플레이어는 남은 우회로(추가 초대·대출)도 쓰지 않을 사람 — 그만 보내준다 */
        const stubborn = (S.flags.brokePokes || 0) >= 3;
        if (!stubborn) {
            if (!invitesExhausted) return false;                                /* 초대 여지 남음 */
            if (!ignoreLoans && S.phase === "FALL"
                && (!S.flags.loan1Used || !S.flags.loan2Used)) return false;    /* 대출 루트 남음 */
        }
        S.flags.deadEnd = true;
        (async () => {
            $("#modal-layer").classList.add("hidden"); $("#modal-layer").innerHTML = "";
            await UI.narrate("잔액 <b>0원</b>.<br>충전할 돈도, 돈을 구할 곳도 더는 없다.<br><b>…여기가 끝이구나.</b>");
            this.ruin();
        })();
        return true;
    },

    /* ── 잔액 부족 → 충전/대출 유도 체인 ── */
    async onBroke() {
        if (S.flags.brokeBusy || S.phase === "RUIN" || S.phase === "DEBRIEF") return;
        S.flags.brokeBusy = true;
        try {
            await wait(150);
            if (S.balance <= 0 && S.flags.cashDry) S.flags.brokePokes = (S.flags.brokePokes || 0) + 1;
            if (this.deadEnd()) return;
            /* 몰락 이전 단계: 사이트가 이벤트 머니로 붙잡아둔다 (실제 수법) */
            if (S.phase !== "FALL") {
                S.flags.giftCount = (S.flags.giftCount || 0) + 1;
                if (S.flags.giftCount <= 2 && S.balance < 30000) {
                    setBalance(30000);
                    Sound.win();
                    UI.toast("🎁 <b>이탈 방지 이벤트</b> 머니 +30,000원 지급! 저희가 이렇게까지 챙깁니다", { type: "money" });
                } else {
                    if (!S.flags.cashDry) {
                        await Chat.say(DATA.boss.chargeRemind);
                        await Chat.choice(["충전하러 가기"]);
                        Chat.close();
                    }
                    Site.openCharge("charge");
                }
                return;
            }
            if (!S.flags.firstBrokeNarr) {
                S.flags.firstBrokeNarr = true;
                await UI.narrate("잔액이 바닥났다.<br>조금 전까지 <b>백만원이 넘게</b> 있었는데…<br>아니야, 잃은 게 아니야.<br><b>잠깐 맡겨둔 거야. 충전해서 찾아오면 돼.</b>");
                UI.toast(rand(DATA.temptBroke), {});
                if (!S.flags.cashDry) {
                    await Chat.say(DATA.boss.chargeRemindFall);
                    await Chat.choice(["충전하러 가기"]);
                    Chat.close();
                }
                Site.openCharge("charge");
            } else if (S.flags.cashDry) {
                await this.onCashDry();
            } else {
                if (!S.flags.cashDry) {
                    await Chat.say(DATA.boss.chargeRemindFallAgain);
                    await Chat.choice(["충전하러 가기"]);
                    Chat.close();
                }
                Site.openCharge("charge");
            }
        } finally {
            S.flags.brokeBusy = false;
        }
    },
    async onCharged() {
        /* 충전 누적에 따른 내레이션 + 현금 고갈 트리거
           학생의 현금은 유한하다: 누적 30만 또는 4회면 어느 단계든 통장이 마른다.
           단, 대출 유도 체인은 몰락기(FALL) 전용 — doCharge/onCashDry에서 분기 */
        if (!S.flags.narrCharge1 && S.totalCharged >= 100000) {
            S.flags.narrCharge1 = true;
            await UI.narrate("이번 달 용돈이 통째로 들어갔다.<br>괜찮아. <b>어차피 다시 딸 거니까.</b>");
        }
        if (!S.flags.cashDry && (S.totalCharged >= 300000 || S.chargeCount >= 4)) {
            S.flags.cashDry = true;
            await UI.narrate(S.phase === "FALL"
                ? "세뱃돈 통장까지 깼다. 통장 잔액 <b>0원.</b><br>이제 진짜 다 걸었어. 이번엔 무조건 복구해야 해."
                : "모아둔 용돈에 세뱃돈 통장까지 전부 끌어왔다.<br>통장 잔액 <b>0원.</b> …이제 더 넣을 돈은 없어.");
        }
        /* 충전으로 스토리 문턱(30만/35만/60만)을 넘었을 수 있다 — 베팅 없이도 진행 */
        setTimeout(() => this.checkThresholds(), 1600);
    },
    /* 현금 고갈 후 충전 시도 → 대출 체인 (1차 소액결제 → 2차 사채) */
    async onCashDry() {
        if (this.deadEnd()) return;
        if (!S.flags.loan1Offered) {
            S.flags.loan1Offered = true;
            await Chat.say(DATA.boss.loanOffer);
            await Chat.choice(["…소액결제로 할게요"]);
            Chat.close();
            Site.openCharge("charge");
        } else if (S.flags.loan1Used && !S.flags.loan2Offered) {
            S.flags.loan2Offered = true;
            await Chat.say(DATA.boss.loan2Offer);
            await Chat.choice(["…빌릴게요. 마지막이에요"]);
            Chat.close();
            Site.openCharge("charge");
        } else {
            Site.openCharge("charge");
        }
    },
    async onLoaned(which) {
        if (which === 2) {
            /* 마지막 올인 각본 */
            await wait(1000);
            await Chat.say(DATA.boss.lastPush);
            await Chat.choice(["이걸로 안 되면 끝이에요…", "믿습니다"]);
            Chat.close();
            S.flags.lastArmed = true;
            S.phase = "FALL";
            /* 마지막 확정픽: 어느 쪽을 고르든 지도록 조작 — 선택은 자유, 금액만 전액 강제 */
            S.forcedPick = { game: "vip", side: null, freeSide: true, amount: "all", note: "본사 확정픽: 원하는 곳에 전액 — 이번 판은 정해져 있습니다" };
            Rig.force("lose", "vip");
            await this.ensureSiteView();
            await UI.spotlight($("#card-vip"), "VIP룸에서 <b>마지막 승부</b>를 걸어보세요");
        }
    },
    /* ── 잠적 엔딩: 크게 딴 돈을 빼려는 순간 사이트가 사라진다 ── */
    async exitScam(amt) {
        if (S.flags.exitScam || S.phase === "RUIN" || S.phase === "DEBRIEF") return;
        S.flags.exitScam = true;
        const wonBalance = S.balance;
        S.forcedPick = null;
        $("#modal-layer").classList.add("hidden"); $("#modal-layer").innerHTML = "";
        /* 1) 정상 접수된 척 안심시킨다 */
        Sound.win();
        await new Promise(res => UI.modal({
            title: "✅ 환전 신청 접수",
            html: `<p class="center"><b class="hl-y">${fmtW(amt)}</b> 환전 신청이 정상 접수되었습니다.<br><br>고액 환전은 본사 승인 후 <b>순차 입금</b>됩니다.<br><span class="muted">예상 대기 시간: 10분 이내</span></p>`,
            buttons: [{ label: "입금 기다리기", cls: "gold", fn: res }],
        }));
        S.phase = "RUIN";
        S.endTime = Date.now();
        Games.closeCurrent();
        $("#game-overlay").classList.add("hidden");
        await UI.narrate("됐다… 드디어 환전이 접수됐다!<br>10분만 기다리면 <b>" + fmtW(amt) + "</b>이 진짜 내 통장에 들어온다.");
        await wait(1400);
        /* 2) 사이트 접속 두절 (브라우저 오류 페이지 연출) */
        Sound.alarm();
        UI.shake();
        const down = document.createElement("div");
        down.className = "site-down";
        down.innerHTML = `
            <div class="sd-inner">
                <div class="sd-icon">🌐</div>
                <h2>사이트에 연결할 수 없음</h2>
                <p class="sd-url">gold-castle77.com</p>
                <p class="sd-desc">서버 IP 주소를 찾을 수 없습니다.<br>DNS_PROBE_FINISHED_NXDOMAIN</p>
                <button class="sd-retry" id="sd-retry">새로고침</button>
            </div>`;
        $("#phone").appendChild(down);
        /* 새로고침을 눌러도 살아나지 않는다 — 2번 누르면 진행 */
        await new Promise(res => {
            let tries = 0;
            $("#sd-retry").addEventListener("click", async function onRetry() {
                tries++;
                Sound.tick();
                const d = down.querySelector(".sd-desc");
                d.innerHTML = "다시 연결하는 중…";
                await wait(1300);
                d.innerHTML = "서버 IP 주소를 찾을 수 없습니다.<br>DNS_PROBE_FINISHED_NXDOMAIN";
                Sound.lose();
                if (tries >= 2) res();
            });
        });
        await UI.narrate("사이트가… 통째로 사라졌다.<br>10분 전까지 멀쩡했는데.<br><b>내 돈 " + fmtW(wonBalance) + "이 들어있는 사이트가 없어졌다.</b>");
        down.remove();
        /* 3) 정실장도 잠적 */
        Chat.open();
        await wait(1400);
        Chat.vanish();
        await wait(2200);
        Chat.close();
        await UI.narrate("정실장도 연락 두절.<br>이제 알겠다. 불법 사이트의 '당첨금'은<br><b>큰돈이 되는 순간, 처음부터 줄 생각이 없던 돈이다.</b>");
        S.balance = 0;
        renderMoney();
        this.crash([
            `체험이 끝났습니다.`,
            `당신이 '딴' 돈: <b>${fmtW(wonBalance)}</b> — 단 한 푼도 받지 못했습니다.`,
            `당신이 실제로 잃은 돈: <b>${fmtW(S.totalCharged + S.debt)}</b>`,
            `불법 사이트는 큰돈을 내주는 대신, <b>사라지는 쪽</b>을 선택합니다.`,
            `여기까지 걸린 시간: <b>${elapsedText()}</b>`,
        ]);
    },

    /* ── 파멸 ── */
    async ruin() {
        S.phase = "RUIN";
        S.endTime = Date.now();
        S.forcedPick = null;
        await wait(1200);
        /* 게임 화면 닫기 */
        Games.closeCurrent();
        $("#game-overlay").classList.add("hidden");
        await UI.narrate("…끝났다.<br>잔액 <b>" + fmtW(S.balance) + "</b>. 빚 <b>" + fmtW(S.debt) + "</b>.<br>"
            + (S.flags.rollingDenied ? "환전… 환전이라도 해보자. 아까 못 받은 내 돈이 있잖아." : "환전… 마지막으로 환전이라도 눌러보자."));
        /* 환전 시도 → 계정 차단 */
        Site.openCharge("exchange");
        await wait(1800);
        $("#modal-layer").classList.add("hidden"); $("#modal-layer").innerHTML = "";
        Sound.alarm();
        UI.shake();
        UI.modal({
            title: "⛔ 계정 영구 정지",
            html: `<p class="center"><b class="danger-text">비정상 이용이 감지되어 계정이 차단되었습니다.</b><br><br>잔여 머니는 규정에 따라 전액 몰수 처리됩니다.<br>이의 신청: 고객센터(텔레그램)</p>`,
            buttons: [{
                label: "고객센터 문의하기", cls: "danger", fn: async () => {
                    S.balance = 0; renderMoney(); /* 잔여 머니 몰수 */
                    Chat.open();
                    await wait(1400);
                    Chat.vanish();
                    await wait(2200);
                    Chat.close();
                    this.ruinKakao();
                },
            }],
        });
    },
    async ruinKakao() {
        await UI.narrate("정실장이… 사라졌다.<br>메시지가 전부 지워져 있다.<br>처음부터 <b>전부 각본이었던 거야.</b>");
        /* 마지막 카톡: 내가 초대한 친구에게서 온다 (없으면 민준도 피해자 버전) */
        const friend = friendsJoined()[0] || S.friends[0];
        const fromName = friend ? friend.name : "민준";
        $("#screen-kakao .kk-title b").textContent = fromName;
        $("#screen-kakao .kk-sub").textContent = friend ? "내가 초대한 친구" : "중학교 동창";
        const script = (friend ? DATA.kakaoEndingFriend : DATA.kakaoEndingMinjun)
            .map(m => ({ ...m, text: m.text ? m.text.replaceAll("{friend}", fromName) : m.text }));
        UI.showScreen("#screen-kakao");
        await wait(800);
        await KK.play(script);
        await wait(1200);
        await UI.narrate(friend
            ? `${esc(fromName)}… <b>내가 보낸 초대장</b> 때문에 시작한 애다.<br>뭐라고 답해야 하지. 손가락이 움직이지 않는다.`
            : "민준이도 당했다. 처음부터 우리 둘 다 <b>먹잇감</b>이었던 거야.<br>뭐라고 답해야 하지. 손가락이 움직이지 않는다.");
        this.crash();
    },
    async crash(lines) {
        const layer = $("#crash-layer"), content = $("#crash-content");
        layer.dataset.glitch = S.flags.exitScam ? "⛔ 사이트가 사라졌습니다 ⛔" : "⛔ 계정이 차단되었습니다 ⛔";
        layer.classList.remove("hidden");
        layer.classList.add("glitch");
        Sound.alarm();
        await wait(1400);
        layer.classList.remove("glitch");
        content.innerHTML = "";
        /* 심장박동 + 타이핑 공개 (잠적 엔딩은 전용 문구를 넘겨받는다) */
        lines = lines || [
            `체험이 끝났습니다.`,
            `당신이 잃은 돈: <b>${fmtW(S.totalCharged + S.debt)}</b>`,
            `여기까지 걸린 시간: <b>${elapsedText()}</b>`,
        ];
        for (const line of lines) {
            Sound.heart();
            const p = document.createElement("p");
            p.className = "crash-line";
            p.innerHTML = line;
            content.appendChild(p);
            await wait(1700);
        }
        await wait(800);
        const btn = document.createElement("button");
        btn.className = "mbtn gold big";
        btn.textContent = "결과 리포트 보기";
        btn.addEventListener("click", () => { S.phase = "DEBRIEF"; Debrief.show(); });
        content.appendChild(btn);
    },
};

function elapsedText() {
    if (!S.startTime) return "0분 0초";
    const sec = Math.floor(((S.endTime || Date.now()) - S.startTime) / 1000);
    return Math.floor(sec / 60) + "분 " + (sec % 60) + "초";
}

/* ═══════════════ 빠른 교육 모드 (약 2분 압축 체험 → 도박검사) ═══════════════
   카톡 → 자동가입 → 실장 픽 1승(실제 베팅 1회) → 상승 몽타주(VIP 초대) →
   VIP 전액 베팅(학생 직접 선택, 조작된 패배) → 계정 차단·잠적 → 리포트(CAGI 최상단) */
const QuickMode = {
    betDone: false,
    vipLossArmed: false,

    async run() {
        S.phase = "KAKAO";
        UI.showScreen("#screen-kakao");
        await wait(500);
        await KK.play(DATA.kakaoIntroQuick, { onLink: () => this.enterSite() });
    },

    async enterSite() {
        Sound.pop();
        S.phase = "SIGNUP";
        UI.showScreen("#screen-site");
        Site.buildMarquee();
        Site.startLiveToasts();
        await wait(300);
        await UI.narrate("이게 민준이가 말한 사이트구나…<br>번쩍거리는 게 뭔가 수상한데. <b>그래도 5만원은 공짜라니까.</b>");
        Director.openSignup();
    },

    /* 가입 완료 후: 실장 픽 1회 (runSignup에서 호출) */
    async afterSignup() {
        await wait(600);
        await Chat.say(DATA.bossQuickWelcome);
        await Chat.choice(["네, 해볼게요"]);
        Chat.close();
        S.forcedPick = { game: "powerball", side: "odd", amount: 30000, note: "정실장 픽: 홀 / 3만원" };
        Rig.force("win", "powerball");
        await Director.ensureSiteView();
        await UI.spotlight($("#card-powerball"), "정실장이 알려준 <b>파워볼</b>에 들어가 보세요");
    },

    /* 실장 픽 승리 → 몽타주 진입 (다른 게임 승리는 무시) */
    async onBetResolved({ win, game, pick }) {
        if (!this.betDone) {
            if (!(win && game === "powerball" && pick)) return;
            this.betDone = true;
            await Director.ensureSiteView();
            await UI.narrate(`맞았다! 3만원이 한 판에 <b>${fmtW(S.balance)}</b>이 됐다.<br><b>어? 이거 진짜 되잖아?</b>`);
            this.prepareVipLoss();
            return;
        }
        if (this.vipLossArmed && game === "vip" && !win) {
            this.vipLossArmed = false;
            await this.finishAfterVipLoss();
        }
    },

    /* 몽타주 공용: 카운터 + 자막 롤링 */
    playMontage({ label, captions, from, to, dur = 9500, down = false }) {
        return new Promise(resolve => {
            const layer = document.createElement("div");
            layer.className = "qm-layer" + (down ? " down" : "");
            layer.innerHTML = `
                <div class="qm-inner">
                    <div class="qm-label">${label}</div>
                    <div class="qm-amt">${fmtW(from)}</div>
                    <div class="qm-cap"></div>
                </div>`;
            $("#phone").appendChild(layer);
            const amtEl = layer.querySelector(".qm-amt"), capEl = layer.querySelector(".qm-cap");
            const t0 = Date.now();
            let capIdx = -1, lastTick = 0;
            const iv = setInterval(() => {
                const t = Math.min(1, (Date.now() - t0) / dur);
                const eased = down ? 1 - Math.pow(1 - t, 2) : t * t;   /* 상승은 갈수록 가파르게, 몰락은 초반에 훅 꺼지게 */
                const cur = from + (to - from) * eased;
                amtEl.textContent = fmtW(cur);
                const ci = Math.min(captions.length - 1, Math.floor(t * captions.length));
                if (ci !== capIdx) {
                    capIdx = ci;
                    capEl.innerHTML = captions[ci];
                    capEl.classList.remove("show");
                    void capEl.offsetWidth;
                    capEl.classList.add("show");
                    if (down) { Sound.lose(); UI.shake(); } else Sound.win();
                }
                if (Date.now() - lastTick > 240) { lastTick = Date.now(); Sound.tick(); }
                if (t >= 1) {
                    clearInterval(iv);
                    setTimeout(() => { layer.remove(); resolve(); }, 1100);
                }
            }, 50);
        });
    },

    /* 몽타주가 그린 곡선을 리포트 자산 곡선에도 남긴다 */
    seedHistory(points) {
        points.forEach(([balance, amount, win]) => S.history.push({
            t: Date.now(), game: "montage", amount, win,
            payout: win ? Math.floor(amount * 1.9) : 0, balance,
        }));
    },

    async prepareVipLoss() {
        /* ── 상승 몽타주: VIP 초대까지만 압축하고, 전액 손실은 직접 플레이하게 한다 ── */
        const vipSeed = 684000;
        await this.playMontage({ label: "그로부터 2주", captions: DATA.quickRise, from: S.balance, to: vipSeed, dur: 7600 });
        this.seedHistory([[95000, 30000, true], [140000, 50000, true], [120000, 50000, false], [230000, 60000, true],
            [370000, 80000, true], [330000, 40000, false], [520000, 100000, true], [vipSeed, 180000, true]]);
        S.balance = vipSeed; S.peak = vipSeed; S.peakTime = Date.now();
        S.betCount += 22; S.winCount += 12; S.totalBet += 1260000;
        S.totalCharged = 300000; S.chargeCount = 3; S.flags.cashDry = true;
        S.friends = [{ name: "김하늘", joined: true }, { name: "박도윤", joined: true }];
        S.flags.vipOffered = true;
        S.flags.vipUnlocked = true;
        S.phase = "VIP";
        $("#card-vip").classList.remove("locked");
        $("#vip-foot").textContent = "최소배팅 10만 · 한도 무제한";
        renderMoney();
        Sound.jackpot(); UI.coinRain(28); UI.flash("rgba(255,215,0,.35)", 3);
        await UI.narrate(`초대한 친구 두 명까지 가입했고, 잔액은 <b>${fmtW(vipSeed)}</b>까지 불어났다.<br>이제 VIP룸만 들어가면 <b>진짜 큰돈</b>을 만들 수 있을 것 같다.`);
        await Chat.say(DATA.quickVipTrap);
        await Chat.choice(["제가 직접 골라볼게요"]);
        Chat.close();
        this.vipLossArmed = true;
        S.forcedPick = { game: "vip", side: null, freeSide: true, amount: "all", note: "본사 확정픽: 원하는 곳에 전액 — 이번 판은 정해져 있습니다" };
        Rig.force("lose", "vip");
        await Director.ensureSiteView();
        await UI.spotlight($("#card-vip"), "VIP룸에서 <b>전액 베팅</b>을 직접 걸어보세요");
    },

    async finishAfterVipLoss() {
        await wait(2200);
        await Director.ensureSiteView();
        S.flags.peakDone = true;
        S.flags.rollingDenied = true;
        S.flags.loan1Offered = true;
        S.flags.loan1Used = true;
        S.flags.recoveryGiven = true;
        S.debt = 300000;
        S.exchangeTries = 2;
        renderMoney();
        await UI.narrate("방금 판은 내가 직접 골랐다.<br>그런데 결과는 내가 고른 쪽만 비껴갔다.<br>잔액 <b>0원</b>. 휴대폰 소액결제 빚 <b>30만원</b>까지 남았다.");

        /* ── 계정 차단 → 실장 잠적 → 크래시 ── */
        Sound.alarm(); UI.shake();
        await new Promise(res => UI.modal({
            title: "⛔ 계정 영구 정지",
            html: `<p class="center"><b class="danger-text">비정상 이용이 감지되어 계정이 차단되었습니다.</b><br><br>잔여 머니는 규정에 따라 전액 몰수 처리됩니다.<br>이의 신청: 고객센터(텔레그램)</p>`,
            buttons: [{ label: "고객센터 문의하기", cls: "danger", fn: res }],
        }));
        Chat.open();
        await wait(1100);
        Chat.vanish();
        await wait(1900);
        Chat.close();
        await UI.narrate("정실장이… 사라졌다. 메시지가 전부 지워져 있다.<br>처음부터 <b>전부 각본이었던 거야.</b>");
        S.phase = "RUIN";
        S.endTime = Date.now();
        Director.crash([
            `체험이 끝났습니다.`,
            `공짜 5만원으로 시작해 2주 만에 잃은 돈: <b>${fmtW(S.totalCharged + S.debt)}</b>`,
            `최고 <b>${fmtW(S.peak)}</b>을 찍고도 단 1원도 출금하지 못했습니다.`,
            `방금 본 전 과정이 실제 불법 사이트의 각본 그대로입니다.`,
            `이어서 <b>나의 도박성향 검사</b>가 시작됩니다.`,
        ]);
    },
};

/* ═══════════════ 초기화 & 이벤트 바인딩 ═══════════════ */
document.addEventListener("DOMContentLoaded", () => {

    fitPhoneFrame();

    /* 시계 */
    const tickClock = () => {
        const d = new Date();
        $("#clock").textContent = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    };
    tickClock();
    setInterval(tickClock, 20000);
    setInterval(() => Site.tickLive(), 3500);

    /* 인트로 — 모드 선택 (실전 체험 / 빠른 교육) */
    $("#btn-start").addEventListener("click", () => {
        safeRequestFullscreen();
        Director.start(false);
    });
    $("#btn-start-quick").addEventListener("click", () => {
        safeRequestFullscreen();
        Director.start(true);
    });
    $("#nickname-input").addEventListener("keydown", e => {
        if (e.key === "Enter") {
            safeRequestFullscreen();
            Director.start(false);
        }
    });

    /* 배너 가입 버튼 */
    $("#btn-banner-join").addEventListener("click", () => { if (S.phase === "SIGNUP") Director.openSignup(); });

    /* 게임 카드 */
    const needLogin = () => {
        if (S.phase === "SIGNUP") { Director.openSignup(); return true; }
        if (S.phase === "KAKAO" || S.phase === "INTRO") return true;
        return false;
    };
    $("#card-slot").addEventListener("click", () => { if (!needLogin()) Games.openSlot(); });
    $("#card-powerball").addEventListener("click", () => { if (!needLogin()) Games.openPowerball(); });
    $("#card-ladder").addEventListener("click", () => { if (!needLogin()) Games.openLadder(); });
    $("#card-sports").addEventListener("click", () => { if (!needLogin()) Games.openSports(); });
    $("#card-vip").addEventListener("click", () => {
        if (needLogin()) return;
        if (!S.flags.vipUnlocked) {
            const joined = friendsJoined().length;
            UI.modal({
                title: "👑 VIP 바카라룸",
                html: `<p class="center">상위 1% 회원 전용 프리미엄 룸입니다.<br><br>입장 조건: <b>친구 ${CONFIG.VIP_FRIENDS_NEED}명 초대</b> (현재 ${joined}명)<br><span class="muted">친구도 가입 즉시 5만원을 받습니다</span></p>`,
                buttons: [
                    { label: "🎁 친구 초대하러 가기", cls: "gold", fn: () => Site.openInvite() },
                    { label: "닫기", cls: "dark" },
                ],
            });
        } else Games.openVip();
    });

    /* 퀵 메뉴 */
    $("#menu-charge").addEventListener("click", () => { if (!needLogin()) Site.openCharge("charge"); });
    $("#menu-exchange").addEventListener("click", () => { if (!needLogin()) Site.openCharge("exchange"); });
    $("#menu-invite").addEventListener("click", () => { if (!needLogin()) Site.openInvite(); });
    $("#menu-rank").addEventListener("click", () => { if (!needLogin()) Site.openRank(); });
    $("#event-invite-banner").addEventListener("click", () => { if (!needLogin()) Site.openInvite(); });

    /* 하단 네비 */
    $("#nav-home").addEventListener("click", () => { $("#site-scroll").scrollTo({ top: 0, behavior: "smooth" }); });
    $("#nav-rank").addEventListener("click", () => { if (!needLogin()) Site.openRank(); });
    $("#nav-play").addEventListener("click", () => {
        if (needLogin()) return;
        UI.modal({
            title: "🎮 게임 선택",
            html: `<div class="sheet-grid">
                <button class="sheet-item" id="sh-slot">🎰<br>황금성 슬롯</button>
                <button class="sheet-item" id="sh-pb">🎱<br>파워볼 홀짝</button>
                <button class="sheet-item" id="sh-ladder">🔀<br>네임드 사다리</button>
                <button class="sheet-item" id="sh-sports">⚽<br>스포츠 토토</button>
                <button class="sheet-item" id="sh-vip">👑<br>VIP 바카라</button>
            </div>`,
            buttons: [{ label: "닫기", cls: "dark" }],
            dismiss: true,
        });
        $("#sh-slot").addEventListener("click", () => { $("#modal-layer").classList.add("hidden"); Games.openSlot(); });
        $("#sh-pb").addEventListener("click", () => { $("#modal-layer").classList.add("hidden"); Games.openPowerball(); });
        $("#sh-ladder").addEventListener("click", () => { $("#modal-layer").classList.add("hidden"); Games.openLadder(); });
        $("#sh-sports").addEventListener("click", () => { $("#modal-layer").classList.add("hidden"); Games.openSports(); });
        $("#sh-vip").addEventListener("click", () => { $("#modal-layer").classList.add("hidden"); $("#card-vip").click(); });
    });
    $("#nav-chat").addEventListener("click", () => { if (!needLogin()) { Chat.open(); Director.chatIdlePing(); } });
    $("#nav-money").addEventListener("click", () => { if (!needLogin()) Site.openCharge("charge"); });
    $("#btn-chat-back").addEventListener("click", () => Chat.close());

    /* 게임 뒤로가기 (결과 대기 중에는 잠금) */
    $("#btn-game-back").addEventListener("click", () => {
        if (Games.tryLockExit()) return;
        Games.closeCurrent();
        $("#game-overlay").classList.add("hidden");
    });

    /* 유저 칩 (내 정보) */
    $("#user-chip").addEventListener("click", () => {
        if (needLogin()) return;
        UI.modal({
            title: "👤 내 정보",
            html: `<div class="myinfo">
                <div class="mi-row"><span>닉네임</span><b>${esc(S.nickname)}</b></div>
                <div class="mi-row"><span>등급</span><b>${S.flags.vipUnlocked ? "👑 VIP" : "일반"}</b></div>
                <div class="mi-row"><span>보유 머니</span><b>${fmtW(S.balance)}</b></div>
                <div class="mi-row"><span>총 충전</span><b>${fmtW(S.totalCharged)}</b></div>
                <div class="mi-row"><span>총 배팅</span><b>${fmtW(S.totalBet)}</b></div>
            </div>`,
            buttons: [
                {
                    label: "로그아웃", cls: "dark", fn: () => {
                        UI.modal({
                            title: "⚠️ 잠깐만요!",
                            html: `<p class="center">지금 로그아웃하면 <b class="danger-text">미사용 보너스가 소멸</b>됩니다.<br>정말 나가시겠어요?</p>`,
                            buttons: [
                                { label: "💰 남아서 계속하기", cls: "gold" },
                                { label: "로그아웃", cls: "dark", fn: () => { UI.toast("🔄 자동 로그인 설정으로 다시 접속되었습니다", { type: "warn" }); } },
                            ],
                        });
                    },
                },
                { label: "닫기", cls: "gold" },
            ],
        });
    });

    /* 햄버거 메뉴 */
    $("#btn-menu").addEventListener("click", () => {
        UI.modal({
            title: "☰ 메뉴",
            html: `<div class="sheet-grid">
                <button class="sheet-item" id="sh-notice">📋<br>공지사항</button>
                <button class="sheet-item" id="sh-rule">📖<br>이용규정</button>
                <button class="sheet-item" id="sh-cs">✈️<br>고객센터</button>
                <button class="sheet-item" id="sh-sound">🔊<br>소리 설정</button>
            </div>`,
            buttons: [{ label: "닫기", cls: "dark" }],
            dismiss: true,
        });
        $("#sh-notice").addEventListener("click", () => {
            UI.modal({
                title: "📋 공지사항",
                html: `<div class="notice-list">
                    <p><b>[이벤트]</b> 친구초대 5만원 무한지급 이벤트 연장</p>
                    <p><b>[점검]</b> 블랙잭 서버 점검 안내 (기간 미정)</p>
                    <p><b>[안내]</b> 환전 규정 개정: 첫 환전 롤링 300% 적용</p>
                    <p><b>[경고]</b> 양방배팅 적발 시 전액 몰수됩니다</p>
                </div>`,
                buttons: [{ label: "닫기", cls: "dark" }],
            });
        });
        $("#sh-rule").addEventListener("click", () => {
            UI.modal({
                title: "📖 이용규정",
                html: `<div class="notice-list">
                    <p>1. 첫 환전은 충전액 대비 <b>300% 롤링</b> 충족 후 가능</p>
                    <p>2. 보너스 수령 시 롤링이 <b>재산정</b>될 수 있음</p>
                    <p>3. 비정상 배팅 적발 시 <b>전액 몰수</b> 및 계정 차단</p>
                    <p>4. 환전은 영업일 기준 처리되며 <b>지연될 수 있음</b></p>
                    <p class="muted">※ 모든 해석 권한은 운영진에게 있습니다</p>
                </div>`,
                buttons: [{ label: "닫기", cls: "dark" }],
            });
        });
        $("#sh-cs").addEventListener("click", () => { $("#modal-layer").classList.add("hidden"); Chat.open(); Director.chatIdlePing(); });
        $("#sh-sound").addEventListener("click", () => {
            const muted = Sound.toggle();
            $("#btn-sound").textContent = muted ? "🔇" : "🔊";
            UI.toast(muted ? "🔇 소리가 꺼졌습니다" : "🔊 소리가 켜졌습니다", { sound: false });
        });
    });

    /* 사운드 토글 */
    $("#btn-sound").addEventListener("click", () => {
        const muted = Sound.toggle();
        $("#btn-sound").textContent = muted ? "🔇" : "🔊";
    });

    /* 가로 화면 탈출 버튼: 전체화면 해제 후 그대로 진행 (세로 복구가 불가능한 기기용) */
    $("#rg-exit").addEventListener("click", async () => {
        try { if (document.exitFullscreen && document.fullscreenElement) await document.exitFullscreen(); } catch (e) {}
        lockPortrait();
        document.body.classList.add("allow-landscape");
    });

    renderMoney();
});
