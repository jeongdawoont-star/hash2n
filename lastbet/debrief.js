/* ═══════════════════════════════════════════════════════════
   도박의 덫 — LAST BET · 디브리핑 리포트
   (색·마크는 검증된 다크 팔레트: surface #1a1a19 / series #3987e5
    인쇄 시 @media print에서 라이트 팔레트로 전환되어 A4 임상보고서 형태가 된다)
   ═══════════════════════════════════════════════════════════ */
"use strict";

const Debrief = {

    _cagi: { idx: 0, answers: [], done: false },
    _docNo: null,

    show() {
        S.endTime = S.endTime || Date.now();
        try { Games.closeCurrent(); } catch (e) {}
        document.body.classList.add("debrief-mode");
        const layer = $("#debrief-layer");
        layer.classList.remove("hidden");
        layer.scrollTop = 0;

        const d = new Date();
        this._docNo = this._docNo || "LB-" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + randInt(1000, 9999);

        const lost = S.totalCharged + S.debt;                    // 실제로 사라진 돈
        const elapsedMs = S.startTime ? (S.endTime - S.startTime) : 0;
        const elapsedMin = Math.max(1, Math.round(elapsedMs / 60000));
        const wageEarned = Math.round(elapsedMs / 3600000 * CONFIG.MIN_WAGE);
        /* 빠른 모드: 실제 소요(약 2분)로 비교하면 무의미 — 스토리 시간(2주)의 주말 알바로 환산 */
        const cmpLabelA = S.quick ? "같은 2주, 주말 알바를 했다면" : `${elapsedMin}분 동안 편의점 알바를 했다면`;
        const cmpLabelB = S.quick ? "같은 2주, 도박을 한 결과" : `${elapsedMin}분 동안 도박을 한 결과`;
        const cmpEarn = S.quick ? 24 * CONFIG.MIN_WAGE : wageEarned;
        const cmpSub = S.quick ? `하루 6시간 · 주 2일 × 2주 · 최저시급 ${fmt(CONFIG.MIN_WAGE)}원` : `2026년 최저시급 ${fmt(CONFIG.MIN_WAGE)}원 기준`;
        const workHours = lost > 0 ? Math.ceil(lost / CONFIG.MIN_WAGE) : 0;
        const workDays = Math.ceil(workHours / 8);
        const weekendWeeks = Math.ceil(workHours / 12);          // 주말 알바(6h×2일)
        const actualWinRate = S.betCount ? Math.round(S.winCount / S.betCount * 100) : 0;
        const friendNames = S.friends.map(f => esc(f.name));
        const behavior = this.computeBehavior(elapsedMs);

        $("#debrief-content").innerHTML = `
        <div class="db-wrap">

            <!-- 문서 헤더 (임상 보고서 스타일) -->
            <header class="db-doc">
                <div class="db-doc-org">
                    <span class="db-doc-badge">청소년 도박위험 예방교육</span>
                    <button class="db-print-btn no-print" id="btn-print">🖨 A4 리포트 인쇄 · PDF 저장</button>
                </div>
                <h1 class="db-doc-title">체험 결과 및 도박위험 평가 보고서</h1>
                <div class="db-doc-meta">
                    <div><span>대상자</span><b>${esc(S.nickname)}</b></div>
                    <div><span>발급 일시</span><b>${d.toLocaleDateString("ko-KR")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}</b></div>
                    <div><span>문서 번호</span><b>${this._docNo}</b></div>
                    <div><span>평가 도구</span><b>행동 관찰 + CAGI 자가진단(9)</b></div>
                </div>
            </header>

            <header class="db-header">
                <p class="db-eyebrow">도박의 덫 — LAST BET</p>
                <h1>${esc(S.nickname)}님, 방금 겪은 일은<br>전부 <span class="db-critical">실제 수법</span>이었습니다</h1>
            </header>

            <!-- 히어로: 총 손실 -->
            <section class="db-hero">
                <p class="db-tile-label">이 체험에서 사라진 (가상의) 진짜 돈</p>
                <div class="db-hero-value">−${fmt(lost)}<span>원</span></div>
                <p class="db-hero-sub">충전 ${fmt(S.totalCharged)}원 + 빚 ${fmt(S.debt)}원 · ${S.quick ? "스토리상 2주 (압축 체험)" : `가입 ${elapsedMin}분 만에`}</p>
                ${S.flags.exitScam ? `<p class="db-hero-sub"><b class="db-critical">${fmt(S.peak)}원을 따고도 한 푼도 받지 못했습니다</b> — 환전을 신청하자 사이트가 통째로 사라졌습니다. 불법 사이트에서는 이기는 것조차 의미가 없습니다.</p>` : ""}
            </section>

            <!-- 잔액 곡선 -->
            ${S.history.length >= 3 ? `
            <section class="db-card">
                <h2>📉 당신의 자산 곡선 — 설계된 상승과 몰락</h2>
                <p class="db-desc">베팅 회차별 잔액 변화입니다. 이 곡선의 모양(달콤한 상승 → 최고점 → 급락)은
                우연이 아니라 <b>모든 피해자에게 똑같이 그려지는 각본</b>입니다.</p>
                ${this.curveSvg()}
            </section>` : ""}

            <!-- 스탯 타일 -->
            <section class="db-tiles">
                <div class="db-tile"><p class="db-tile-label">최고 잔액 (최고점)</p><b>${fmt(S.peak)}원</b><span class="db-delta down">▼ 그 후 전액 상실</span></div>
                <div class="db-tile"><p class="db-tile-label">총 베팅 횟수</p><b>${fmt(S.betCount)}회</b><span class="db-delta">${S.quick ? "스토리 2주 누적" : `${elapsedMin}분 동안`}</span></div>
                <div class="db-tile"><p class="db-tile-label">총 베팅 금액</p><b>${fmt(S.totalBet)}원</b><span class="db-delta">회전할수록 사이트의 수익</span></div>
                <div class="db-tile"><p class="db-tile-label">충전 성공</p><b>${S.chargeCount + (S.flags.loan1Used ? 1 : 0) + (S.flags.loan2Used ? 1 : 0)}회</b><span class="db-delta">평균 처리 2초</span></div>
                <div class="db-tile"><p class="db-tile-label">환전 성공</p><b>0회</b><span class="db-delta down">시도 ${S.exchangeTries}회 전부 거부</span></div>
                <div class="db-tile"><p class="db-tile-label">체험 소요 시간</p><b>${elapsedText()}</b><span class="db-delta">${S.quick ? "2주를 압축 체험" : "현실이었다면?"}</span></div>
            </section>

            <!-- 시간·기회비용 충격 -->
            <section class="db-card">
                <h2>⏱ 같은 시간, 같은 돈의 두 개의 세계</h2>
                <div class="db-compare">
                    <div class="db-comp-side">
                        <p class="db-tile-label">${cmpLabelA}</p>
                        <b class="good">+${fmt(cmpEarn)}원</b>
                        <span>${cmpSub}</span>
                    </div>
                    <div class="db-comp-side">
                        <p class="db-tile-label">${cmpLabelB}</p>
                        <b class="bad">−${fmt(lost)}원</b>
                        <span>빚 ${fmt(S.debt)}원 포함</span>
                    </div>
                </div>
                ${lost > 0 ? `
                <p class="db-note">잃은 ${fmt(lost)}원을 다시 벌려면 최저시급 알바 <b>${fmt(workHours)}시간</b> —
                하루 8시간씩 <b>${fmt(workDays)}일</b>, 주말 알바(하루 6시간·주 2회)로는 <b>${fmt(weekendWeeks)}주</b>를 일해야 합니다.</p>
                <div class="db-cost-grid">
                    <div class="db-cost"><i>🍗</i><span>치킨</span><b>${fmt(Math.floor(lost / 20000))}마리</b></div>
                    <div class="db-cost"><i>🍜</i><span>편의점 삼김+라면</span><b>${fmt(Math.floor(lost / 4000))}끼</b></div>
                    <div class="db-cost"><i>🎮</i><span>PC방</span><b>${fmt(Math.floor(lost / 1500))}시간</b></div>
                    <div class="db-cost"><i>📱</i><span>최신 스마트폰(150만)</span><b>${Math.min(999, Math.round(lost / 1500000 * 100))}%</b></div>
                </div>
                <p class="db-desc" style="margin:12px 0 0">이 돈이 있었다면 누렸을 일상의 행복이 전부 사이트 운영자의 주머니로 들어갔습니다.</p>
                ` : ""}
            </section>

            <!-- 승률 조작 공개 차트 -->
            <section class="db-card">
                <h2>🎯 당신의 승률은 처음부터 설계되어 있었습니다</h2>
                <p class="db-desc">구간별로 시스템이 설정한 승률입니다. 이긴 게 아니라, <b>이기게 해준 것</b>입니다.
                막대를 누르면 설명이 나옵니다.</p>
                <div class="db-chart" id="rig-chart">
                    <div class="db-chart-plot" id="rig-plot">
                        <div class="db-gridline" style="bottom:100%"><i>100%</i></div>
                        <div class="db-gridline" style="bottom:75%"><i>75</i></div>
                        <div class="db-gridline" style="bottom:50%"><i>50</i></div>
                        <div class="db-gridline" style="bottom:25%"><i>25</i></div>
                        <div class="db-gridline base" style="bottom:0"><i>0</i></div>
                        <div class="db-refline" style="bottom:48%"><i>공정한 게임의 승률 ≈ 48%</i></div>
                        <div class="db-cols" id="rig-cols"></div>
                    </div>
                </div>
                <p class="db-chart-detail" id="rig-detail">막대를 눌러 각 구간의 수법을 확인하세요</p>
                ${S.betCount ? `<p class="db-note">체험 전체에서 당신의 실제 승률은 <b>${actualWinRate}%</b>였지만, 결국 전부 잃었습니다.
                승률이 아니라 <b>구조</b>가 결과를 정하기 때문입니다.</p>` : ""}
            </section>

            <!-- 행동 위험 프로파일 (육각 레이더) — 빠른모드는 실제 행동 표본이 없어 표시하지 않음 -->
            ${(S.betCount >= 2 && !S.quick) ? `
            <section class="db-card">
                <h2>🧠 도박 행동 위험 프로파일 (행동 관찰 지표)</h2>
                <p class="db-desc">체험 중 ${esc(S.nickname)}님이 실제로 보인 행동을 정신의학에서 쓰는
                6가지 위험 지표로 환산한 결과입니다. <b>수치가 바깥쪽일수록 실제 도박 상황에서 위험한 반응 패턴</b>입니다.</p>
                ${this.radarSvg(behavior)}
                <ul class="db-radar-notes">
                    ${behavior.map(m => `<li><b>${m.k} ${m.v}</b><span>${m.note}</span></li>`).join("")}
                </ul>
                <p class="db-note">이 프로파일은 진단이 아니라 <b>체험 중 행동의 관찰 기록</b>입니다.
                다만 손실 추격·중단 실패 지표가 높다면, 실제 상황에서도 같은 패턴이 나올 가능성이 높습니다.</p>
            </section>` : ""}

            <!-- CAGI 자가진단 -->
            <section class="db-card" id="cagi-card">
                <h2>📋 청소년 도박문제 자가진단 (CAGI · 9문항)</h2>
                <p class="db-desc">한국도박문제예방치유원이 보급하는 청소년 표준 선별검사입니다.
                방금의 체험이 아니라 <b>실제 나의 지난 3개월</b>을 기준으로 답하세요. 결과는 어디에도 저장·전송되지 않습니다.</p>
                <div id="cagi-body"></div>
            </section>

            <!-- 전부 가짜 -->
            <section class="db-card">
                <h2>🎭 그 방에 진짜 사람은 당신뿐이었습니다</h2>
                <ul class="db-fake-list">
                    <li><b>전광판 당첨자·환전 알림</b> — 프로그램이 8~14초마다 자동 생성한 가짜</li>
                    <li><b>게임방의 참여자 ${fmt(300)}여 명과 채팅</b> — 전부 '바람잡이' 봇</li>
                    <li><b>정실장의 무료픽·확정픽·복구픽</b> — 결과를 미리 정해놓고 준 각본</li>
                    <li><b>수익 인증을 보낸 친구 민준</b> — 그 아이도 같은 덫에 걸린 피해자</li>
                    ${friendNames.length ? `<li><b>함께 베팅하던 ${friendNames.join(", ")}</b> — 이 체험에선 프로그램이 만든 환영이었지만,
                    현실에서 초대 링크를 보냈다면 <span class="db-critical">진짜 친구가 진짜 돈을 잃습니다</span></li>` : ""}
                </ul>
            </section>

            <!-- 개인정보 -->
            <section class="db-card">
                <h2>🔓 3초 자동가입의 대가</h2>
                <p class="db-desc">가입할 때 '전체 동의'를 눌렀던 것, 기억하나요? 실제 불법 사이트에서 그 순간:</p>
                <ul class="db-fake-list">
                    <li>이름·연락처·계좌가 <b>제3자에게 판매</b>됩니다 (건당 수백 원에 거래)</li>
                    <li>보이스피싱·스미싱·대포통장 모집의 <b>표적 명단</b>에 오릅니다</li>
                    <li>탈퇴해도 <b>정보는 삭제되지 않습니다</b> — 애초에 불법 조직이니까요</li>
                </ul>
            </section>

            <!-- 왜 이길 수 없는가 -->
            <section class="db-card">
                <h2>🔬 왜 절대 이길 수 없는가 — 3가지 과학</h2>
                <div class="db-sci">
                    <div class="db-sci-item">
                        <b>① 수학의 배신 — 기댓값은 항상 음수</b>
                        <p>모든 사설 토토·파워볼·사다리는 환수율이 100% 미만으로 설계됩니다. 배팅할 때마다 판돈의
                        일부를 업자가 가져간다는 뜻이고, 반복할수록 잔액은 수학 법칙에 따라 <b>0원에 수렴</b>합니다.
                        오래 할수록 반드시 잃습니다.</p>
                    </div>
                    <div class="db-sci-item">
                        <b>② 도파민 하이재킹 — 뇌가 먼저 망가진다</b>
                        <p>도박의 도파민 자극은 일상의 즐거움보다 수십 배 강합니다. 이 자극에 익숙해지면 공부·친구·취미로는
                        아무 감흥이 없는 <b>무기력 상태</b>가 되고, 베팅할 때만 살아있다고 느끼게 됩니다.
                        아까 심장이 두근거렸다면 — 그게 바로 그 시작입니다.</p>
                    </div>
                    <div class="db-sci-item">
                        <b>③ 조작과 잠적 — 애초에 공정한 판이 아니다</b>
                        <p>오늘 체험 그대로입니다. 처음엔 일부러 따게 해주고, 돈을 빼려는 순간 롤링 규정·점검·계정 정지를
                        핑계로 막다가, 결국 <b>사이트째 사라집니다</b>. '출금' 버튼은 처음부터 장식이었습니다.</p>
                    </div>
                </div>
                <div class="db-myth">
                    <div class="db-myth-item">
                        <b>❓ "계속 잃었으니 이제 딸 차례다?"</b>
                        <p><b>도박사의 오류</b>입니다. 동전이 5번 연속 앞면이어도 다음이 뒷면일 확률은 커지지 않습니다.
                        모든 판은 독립이며, 판을 거듭할수록 손실만 쌓입니다.</p>
                    </div>
                    <div class="db-myth-item">
                        <b>❓ "친구끼리 소액 내기는 도박이 아니다?"</b>
                        <p>모든 도박 중독은 <b>소액 내기에서 시작</b>됐습니다. 단톡방 사다리, 판돈 걸린 게임 —
                        금액이 아니라 '돈을 걸고 승패를 가리는 구조' 자체가 관문입니다.</p>
                    </div>
                </div>
            </section>

            <!-- 실제 통계 -->
            <section class="db-card">
                <h2>📊 이건 시뮬레이션이지만, 아래는 현실입니다</h2>
                <div class="db-stats">
                    ${DATA.realStats.map(s => `<div class="db-stat"><p>${s.text}</p><span>— ${s.src}</span></div>`).join("")}
                </div>
            </section>

            <!-- 실천 가이드 -->
            <section class="db-card">
                <h2>🧭 이미 시작했다면 — 끊어내는 4단계</h2>
                <ol class="db-steps">
                    <li><b>차단</b><span>불법 사이트·앱·텔레그램 채널·내기 단톡방에서 나가고 차단합니다. '구경만'도 없습니다.</span></li>
                    <li><b>돈의 주권 양도</b><span>돈이 내 손에 있으면 다시 걸게 됩니다. 체크카드를 부모님께 맡기거나 이체 한도를 최소로 낮춥니다.</span></li>
                    <li><b>손절 인정</b><span>이미 잃은 돈은 무슨 수를 써도 돌아오지 않습니다. '복구'라는 단어가 다음 파산을 만듭니다.</span></li>
                    <li><b>도움 요청</b><span>혼자 해결하려 하지 않기. 부모님·선생님, 그리고 1336. 혼나는 일이 아니라 도움받을 일입니다.</span></li>
                </ol>
            </section>

            <!-- 서약서 -->
            <section class="db-card" id="pledge-card">
                <h2>✍️ 나와의 서약</h2>
                <p class="db-desc">누군가 "꽁머니 준대"라며 링크를 보내는 날이 반드시 옵니다. 그날의 나를 위해 지금 서명해 두세요.</p>
                <div id="pledge-form">
                    <label class="db-oath"><input type="checkbox" class="oath-chk"> 나는 온·오프라인의 모든 불법 도박과 돈내기 게임을 하지 않겠습니다.</label>
                    <label class="db-oath"><input type="checkbox" class="oath-chk"> 공짜 머니·확정픽 링크는 미끼임을 알기에, 누르지 않고 알립니다.</label>
                    <label class="db-oath"><input type="checkbox" class="oath-chk"> 나 또는 친구가 위험할 때, 숨기지 않고 어른이나 1336에 도움을 요청하겠습니다.</label>
                    <textarea id="pledge-input" rows="2" maxlength="200" placeholder="나에게 남기는 한 줄 (예: 공짜 돈은 미끼다. 나는 링크를 누르지 않는다.)"></textarea>
                    <div class="db-sign-row">
                        <input id="pledge-name" type="text" maxlength="8" placeholder="서명 (이름)" value="${S.nickname === "체험자" ? "" : esc(S.nickname)}">
                        <button class="db-btn" id="btn-pledge">서약하기</button>
                    </div>
                </div>
                <div id="pledge-done" class="hidden"></div>
            </section>

            <!-- 도움 -->
            <section class="db-help">
                <p>나 또는 친구가 이미 도박을 시작했다면, 혼나는 일이 아니라 <b>도움받을 일</b>입니다.</p>
                <div class="db-help-grid">
                    <div><span>24시간 전화</span><b>1336</b></div>
                    <div><span>무료 문자</span><b>#1336</b></div>
                    <div><span>카카오톡 채널</span><b>한국도박문제예방치유원</b></div>
                </div>
                <p class="db-help-sub">한국도박문제예방치유원 · 24시간 · 무료 · 비밀 보장 (kcgp.or.kr)</p>
            </section>

            <div class="db-actions no-print">
                <button class="db-btn" id="btn-print2">🖨 A4 리포트 인쇄 · PDF 저장</button>
                <button class="db-btn ghost" id="btn-restart">처음부터 다시 체험하기</button>
            </div>
            <p class="db-foot">본 보고서는 불법도박 예방 교육용 시뮬레이션의 결과물이며 모든 금액·인물·사이트는 가상입니다.
            CAGI 자가진단 결과를 포함한 어떤 정보도 저장·전송되지 않습니다. · 문서번호 ${this._docNo}</p>
        </div>
        <div id="print-report" aria-hidden="true"></div>`;

        /* 빠른 교육 모드: 체험이 끝나면 바로 도박검사(CAGI)로 이어진다 — 최상단 배치 + 자동 시작 */
        if (S.quick) {
            const cagi = $("#cagi-card"), hero = $("#debrief-content .db-hero");
            if (cagi && hero) hero.after(cagi);
            this._cagi.started = true;
        }

        this.renderChart();
        this.renderCagi();

        /* 인쇄는 화면 리포트가 아니라 2쪽 요약 보고서(#print-report)만 나간다 */
        const doPrint = () => { this.buildPrintReport(); window.print(); };
        $("#btn-print").addEventListener("click", doPrint);
        $("#btn-print2").addEventListener("click", doPrint);
        if (!Debrief._printHook) {
            Debrief._printHook = true;    /* Ctrl+P 대비 */
            window.addEventListener("beforeprint", () => { if ($("#print-report")) this.buildPrintReport(); });
        }
        $("#btn-pledge").addEventListener("click", () => this.signPledge());
        $$("#pledge-form .oath-chk").forEach(c => c.addEventListener("change", e => e.target.closest(".db-oath").classList.remove("miss")));
        $("#btn-restart").addEventListener("click", () => location.reload());
    },

    /* ── 인쇄용 A4 2쪽 요약 보고서 ── */
    buildPrintReport() {
        const el = $("#print-report");
        if (!el) return;
        const d = new Date();
        const lost = S.totalCharged + S.debt;
        const elapsedMs = S.startTime ? ((S.endTime || Date.now()) - S.startTime) : 0;
        const elapsedMin = Math.max(1, Math.round(elapsedMs / 60000));
        const behavior = this.computeBehavior(elapsedMs);
        const workHours = lost > 0 ? Math.ceil(lost / CONFIG.MIN_WAGE) : 0;
        const workDays = Math.ceil(workHours / 8);
        const actualWinRate = S.betCount ? Math.round(S.winCount / S.betCount * 100) : 0;
        const top = [...behavior].sort((a, b) => b.v - a.v).slice(0, 2);

        /* 종합 소견 (자동 작성) */
        const ending = S.flags.exitScam
            ? `최고 ${fmt(S.peak)}원에 도달했으나 환전을 신청하는 순간 사이트가 잠적하여 단 한 푼도 회수하지 못했습니다`
            : `최고 ${fmt(S.peak)}원까지 도달했으나 환전이 거부된 이후 설계된 하락 구간에서 전액을 잃었습니다`;
        const cagiLine = S.cagi
            ? `자가진단(CAGI) 결과는 ${S.cagi.score}점으로 '${S.cagi.grade.name}'에 해당합니다.`
            : `자가진단(CAGI)은 실시되지 않았습니다.`;
        const behaviorLine = S.quick ? ""
            : `행동 관찰에서는 <b>${esc(top[0].k)}(${top[0].v})</b>, <b>${esc(top[1].k)}(${top[1].v})</b> 지표가 상대적으로 높게 나타났습니다.`;
        const opinion = `대상자는 ${S.quick ? "약 2분의 압축 체험(스토리상 2주)에서" : `${elapsedMin}분 동안`} 총 ${fmt(S.betCount)}회(${fmt(S.totalBet)}원) 베팅하였으며, ${ending}.
            실제 손실은 충전 ${fmt(S.totalCharged)}원과 부채 ${fmt(S.debt)}원을 합한 <b>${fmt(lost)}원</b>입니다.
            ${behaviorLine}
            ${cagiLine} 본 체험의 모든 승패·채팅·타 이용자는 사전에 설계된 가상이며, 동일한 구조가 실제 불법 도박사이트에서 그대로 사용됩니다.`;

        const cagiHtml = S.cagi ? `
            <div class="pr-cagi">
                <div class="pr-lights">
                    <i class="g ${S.cagi.grade.light === "green" ? "on" : ""}">안전</i>
                    <i class="y ${S.cagi.grade.light === "yellow" ? "on" : ""}">주의</i>
                    <i class="r ${S.cagi.grade.light === "red" ? "on" : ""}">경고</i>
                </div>
                <div class="pr-cagi-body">
                    <b>${S.cagi.score}점 / 27점 — ${S.cagi.grade.name}</b>
                    <p>${S.cagi.grade.desc}</p>
                    <p class="pr-guide">지침: ${S.cagi.grade.guide}</p>
                </div>
            </div>`
            : `<p class="pr-small">미실시 — 화면에서 자가진단(9문항)을 완료한 뒤 인쇄하면 이 영역에 결과가 기재됩니다.</p>`;

        const pledgeHtml = S.pledge ? `
            <p class="pr-oath">나는 모든 불법 도박과 돈내기 게임을 하지 않으며, 공짜 머니 링크를 누르지 않고,
            위험할 때 숨기지 않고 도움을 요청할 것을 서약합니다.${S.pledge.memo ? ` — “${esc(S.pledge.memo)}”` : ""}</p>
            <div class="pr-signrow"><span>서약자 <b>${esc(S.pledge.name)}</b></span><span>서명일 ${S.pledge.date}</span></div>`
            : `
            <p class="pr-oath">나는 모든 불법 도박과 돈내기 게임을 하지 않으며, 공짜 머니 링크를 누르지 않고,
            위험할 때 숨기지 않고 도움을 요청할 것을 서약합니다.</p>
            <div class="pr-signrow"><span>서약자: <i class="pr-line"></i></span><span>서명: <i class="pr-line"></i></span><span>날짜: ${d.toLocaleDateString("ko-KR")}</span></div>`;

        el.innerHTML = `
        <div class="pr-page">
            <header class="pr-head">
                <div class="pr-head-top">
                    <span class="pr-badge">청소년 도박위험 예방교육 · LAST BET</span>
                    <span class="pr-docno">문서번호 ${this._docNo}</span>
                </div>
                <h1>체험 결과 및 도박위험 평가 보고서</h1>
                <div class="pr-meta">
                    <span>대상자 <b>${esc(S.nickname)}</b></span>
                    <span>발급 <b>${d.toLocaleDateString("ko-KR")}</b></span>
                    <span>체험 시간 <b>${elapsedText()}</b></span>
                    <span>평가 도구 <b>행동 관찰 + CAGI(9)</b></span>
                </div>
            </header>

            <div class="pr-stats">
                <div class="crit"><span>실제 손실 (충전+빚)</span><b>−${fmt(lost)}원</b></div>
                <div><span>최고 잔액</span><b>${fmt(S.peak)}원</b></div>
                <div><span>총 베팅</span><b>${fmt(S.betCount)}회 · ${fmt(S.totalBet)}원</b></div>
                <div><span>체험 승률</span><b>${actualWinRate}%</b></div>
                <div class="crit"><span>환전 성공</span><b>0회 / 시도 ${S.exchangeTries}회</b></div>
                <div><span>손실 회복에 필요한 노동</span><b>알바 ${fmt(workHours)}시간 (${fmt(workDays)}일)</b></div>
            </div>

            ${S.history.length >= 3 ? `
            <section class="pr-sec">
                <h2>1. 자산 곡선 — 설계된 상승과 몰락</h2>
                ${this.curveSvg()}
                <p class="pr-small">달콤한 상승 → 최고점 → 환전 거부 → 급락. 이 곡선은 우연이 아니라 모든 피해자에게 똑같이 그려지는 각본입니다.</p>
            </section>` : ""}

            <div class="pr-cols">
                <section class="pr-sec pr-radar">
                    <h2>2. 행동 위험 프로파일</h2>
                    ${(S.betCount >= 2 && !S.quick) ? this.radarSvg(behavior) : `<p class="pr-small">${S.quick ? "빠른 교육 모드 — 행동 표본 미수집" : "표본 부족"}</p>`}
                </section>
                <section class="pr-sec">
                    <h2>지표 해설 (체험 중 실측)</h2>
                    ${S.quick ? `<p class="pr-small">빠른 교육 모드는 압축 몽타주로 진행되어 행동 지표를 실측하지 않습니다. 실전 체험 모드에서 측정됩니다.</p>` : `
                    <ul class="pr-notes">
                        ${behavior.map(m => `<li><b>${m.k} ${m.v}</b> ${m.note}</li>`).join("")}
                    </ul>`}
                </section>
            </div>
        </div>

        <div class="pr-page">
            <section class="pr-sec">
                <h2>3. 구간별 설계 승률 — 이긴 게 아니라 이기게 해준 것</h2>
                <table class="pr-table">
                    <thead><tr><th>구간</th><th>설정 승률</th><th>수법</th></tr></thead>
                    <tbody>
                        ${DATA.rigChart.map(r => `<tr><td>${esc(r.label).replace("\n", " ")}</td><td>${r.rate}%</td><td>${esc(r.desc)}</td></tr>`).join("")}
                    </tbody>
                </table>
                <p class="pr-small">체험 전체의 실제 승률은 ${actualWinRate}%였으나 최종 결과는 전액 손실 — 승률이 아니라 <b>구조</b>가 결과를 결정합니다.</p>
            </section>

            <section class="pr-sec">
                <h2>4. 청소년 도박문제 자가진단 (CAGI)</h2>
                ${cagiHtml}
            </section>

            <section class="pr-sec">
                <h2>5. 종합 소견</h2>
                <p class="pr-opinion">${opinion}</p>
            </section>

            <section class="pr-sec">
                <h2>6. 기회비용</h2>
                <p class="pr-small">잃은 ${fmt(lost)}원은 2026년 최저시급(${fmt(CONFIG.MIN_WAGE)}원) 기준 <b>알바 ${fmt(workHours)}시간</b>,
                하루 8시간씩 <b>${fmt(workDays)}일</b>의 노동에 해당하며, 치킨 ${fmt(Math.floor(lost / 20000))}마리 ·
                편의점 식사 ${fmt(Math.floor(lost / 4000))}끼 · PC방 ${fmt(Math.floor(lost / 1500))}시간과 같은 값입니다.</p>
            </section>

            <section class="pr-sec">
                <h2>7. 서약</h2>
                ${pledgeHtml}
            </section>

            <footer class="pr-foot">
                <b>한국도박문제예방치유원</b> — 전화 <b>1336</b> · 문자 <b>#1336</b> · 카카오톡 채널 (24시간 · 무료 · 비밀보장) · kcgp.or.kr<br>
                본 보고서는 예방교육용 시뮬레이션 결과물로, 모든 금액·인물·사이트는 가상이며 어떤 정보도 저장·전송되지 않습니다. · ${this._docNo}
            </footer>
        </div>`;
    },

    /* ── 행동 관찰 → 6개 위험 지표 (0~100) ── */
    computeBehavior(elapsedMs) {
        const clamp = v => Math.max(4, Math.min(100, Math.round(v)));
        const h = S.history, n = h.length;
        const min = Math.max(0.5, elapsedMs / 60000);

        /* 1. 충동성: 베팅 빈도 */
        const perMin = n / min;
        /* 2. 손실 추격: 패배 직후 베팅액이 얼마나 커졌나 */
        const chase = [];
        for (let i = 1; i < n; i++) if (!h[i - 1].win && h[i - 1].amount > 0) chase.push(h[i].amount / h[i - 1].amount);
        const chaseAvg = chase.length ? chase.reduce((a, b) => a + b, 0) / chase.length : 0;
        /* 3. 위험 감수: 잔액 대비 베팅 비중 */
        let shareSum = 0, shareN = 0, allins = 0;
        h.forEach(b => {
            const before = b.balance - b.payout + b.amount;
            if (before > 0) { const s = b.amount / before; shareSum += s; shareN++; if (s >= 0.98) allins++; }
        });
        const shareAvg = shareN ? shareSum / shareN : 0;
        /* 4. 유혹 순응: 실장의 제안 수락률 */
        let offered = 0, taken = 0;
        const hook = (off, take) => { if (off) { offered++; if (take) taken++; } };
        hook(true, S.tutorialStep >= 3);
        hook(S.flags.bragOffered, S.flags.bragDone);
        hook(S.flags.vipOffered, S.flags.vipUnlocked);
        hook(S.flags.allinOffered, S.flags.peakDone || S.flags.allinArmed);
        hook(S.flags.recoveryGiven, true);
        hook(S.flags.loan1Offered, S.flags.loan1Used);
        hook(S.flags.loan2Offered, S.flags.loan2Used);
        /* 5. 무리한 자금 조달 */
        const financing = S.chargeCount * 18 + (S.flags.loan1Used ? 25 : 0) + (S.flags.loan2Used ? 35 : 0);
        /* 6. 중단 실패: 환전이 막힌 뒤에도 이어간 베팅 */
        const fallBets = S.rigLog.filter(r => r.phase === "FALL").length;

        return [
            { k: "충동성", v: clamp(perMin / 2.2 * 100), note: `분당 ${perMin.toFixed(1)}회 베팅 — 결과 확인 후 다음 베팅까지 평균 ${Math.round(60 / Math.max(0.3, perMin))}초` },
            { k: "손실 추격", v: clamp(chase.length ? (chaseAvg - 0.8) / 1.4 * 100 : 0), note: chase.length ? `패배 직후 베팅액이 평균 ${chaseAvg.toFixed(1)}배로 변화 (1.0배 초과 = 추격 배팅)` : "패배 후 재베팅 표본 없음" },
            { k: "위험 감수", v: clamp(shareAvg / 0.65 * 100), note: `한 판에 평균 잔액의 ${Math.round(shareAvg * 100)}%를 베팅${allins ? ` · 올인 ${allins}회` : ""}` },
            { k: "유혹 순응", v: clamp(offered ? taken / offered * 100 : 0), note: `정실장의 제안 ${offered}건 중 ${taken}건 수락` },
            { k: "자금 조달", v: clamp(financing), note: `현금 충전 ${S.chargeCount}회${S.flags.loan1Used ? " · 소액결제 현금화" : ""}${S.flags.loan2Used ? " · 개인 사채" : ""}` },
            { k: "중단 실패", v: clamp(fallBets / 12 * 100 + (S.debt > 0 ? 25 : 0)), note: `환전이 막힌 뒤에도 ${fallBets}회 더 베팅${S.debt > 0 ? ` · 빚 ${fmtW(S.debt)}` : ""}` },
        ];
    },

    /* ── 육각(레이더) 차트 SVG ── */
    radarSvg(metrics) {
        const cx = 180, cy = 148, R = 100;   /* 좌우 라벨이 잘리지 않도록 넉넉한 캔버스 */
        const ang = i => -Math.PI / 2 + i * Math.PI / 3;
        const pt = (i, r) => (cx + Math.cos(ang(i)) * r).toFixed(1) + "," + (cy + Math.sin(ang(i)) * r).toFixed(1);
        const ring = f => `<polygon class="rd-grid" points="${metrics.map((_, i) => pt(i, R * f)).join(" ")}"/>`;
        const axes = metrics.map((_, i) => {
            const [x, y] = pt(i, R).split(",");
            return `<line class="rd-grid" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`;
        }).join("");
        const poly = metrics.map((m, i) => pt(i, R * m.v / 100)).join(" ");
        const dots = metrics.map((m, i) => {
            const [x, y] = pt(i, R * m.v / 100).split(",");
            return `<circle class="rd-dot" cx="${x}" cy="${y}" r="4"/>`;
        }).join("");
        const labels = metrics.map((m, i) => {
            const a = ang(i), lx = cx + Math.cos(a) * (R + 20), ly = cy + Math.sin(a) * (R + 20);
            const anchor = Math.cos(a) > 0.35 ? "start" : Math.cos(a) < -0.35 ? "end" : "middle";
            return `<text class="rd-label" x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="${anchor}">${m.k} <tspan class="rd-val">${m.v}</tspan></text>`;
        }).join("");
        return `
        <svg class="db-radar" viewBox="0 0 360 300" role="img" aria-label="행동 위험 프로파일 육각 차트">
            ${ring(1)}${ring(0.75)}${ring(0.5)}${ring(0.25)}
            ${axes}
            <polygon class="rd-area" points="${poly}"/>
            <polyline class="rd-line" points="${poly} ${poly.split(" ")[0]}"/>
            ${dots}
            ${labels}
        </svg>`;
    },

    /* ── 잔액 곡선 SVG ── */
    curveSvg() {
        const ys = [CONFIG.BONUS_SIGNUP, ...S.history.map(b => b.balance)];
        const W = 640, H = 230, L = 52, Rp = 16, T = 30, B = 30;
        const maxRaw = Math.max(...ys, 100000);
        const unit = maxRaw > 1000000 ? 500000 : maxRaw > 400000 ? 250000 : 100000;
        const maxY = Math.ceil(maxRaw / unit) * unit;
        const px = i => L + (W - L - Rp) * (ys.length === 1 ? 0 : i / (ys.length - 1));
        const py = v => T + (H - T - B) * (1 - v / maxY);
        const pts = ys.map((v, i) => px(i).toFixed(1) + "," + py(v).toFixed(1)).join(" ");
        const area = `M ${px(0).toFixed(1)},${py(0).toFixed(1)} L ${pts.replaceAll(" ", " L ")} L ${px(ys.length - 1).toFixed(1)},${py(0).toFixed(1)} Z`;
        const short = v => v >= 10000 ? fmt(v / 10000) + "만" : fmt(v);
        const grid = [0, maxY / 2, maxY].map(v =>
            `<line class="cv-grid ${v === 0 ? "base" : ""}" x1="${L}" y1="${py(v).toFixed(1)}" x2="${W - Rp}" y2="${py(v).toFixed(1)}"/>
             <text class="cv-tick" x="${L - 6}" y="${(py(v) + 3.5).toFixed(1)}" text-anchor="end">${short(v)}</text>`).join("");
        /* 최고점·종료 마커 */
        const peakI = ys.indexOf(Math.max(...ys));
        const lastI = ys.length - 1;
        const peakAnchor = peakI > ys.length * 0.72 ? "end" : "middle";
        const marker = (i, cls, label, dy, anchor) => `
            <circle class="${cls}" cx="${px(i).toFixed(1)}" cy="${py(ys[i]).toFixed(1)}" r="4.5"/>
            <text class="cv-mark-label ${cls}" x="${px(i).toFixed(1)}" y="${(py(ys[i]) + dy).toFixed(1)}" text-anchor="${anchor}">${label}</text>`;
        return `
        <svg class="db-curve" viewBox="0 0 ${W} ${H}" role="img" aria-label="베팅 회차별 잔액 곡선">
            ${grid}
            <path class="cv-area" d="${area}"/>
            <polyline class="cv-line" points="${pts}"/>
            ${marker(peakI, "cv-peak", "최고점 " + short(ys[peakI]) + "원", -10, peakAnchor)}
            ${marker(lastI, "cv-end", short(ys[lastI]) + "원", -10, "end")}
            <text class="cv-tick" x="${L}" y="${H - 4}" text-anchor="start">베팅 회차 → (총 ${S.history.length}회)</text>
        </svg>`;
    },

    /* ── CAGI 자가진단 ── */
    renderCagi() {
        const body = $("#cagi-body");
        if (!body) return;
        const st = this._cagi;
        const Q = DATA.cagi.questions;

        if (st.done) {
            const score = st.answers.reduce((a, b) => a + b, 0);
            const g = DATA.cagi.grade(score);
            S.cagi = { score, grade: g };
            const lightCls = { green: "safe", yellow: "warn", red: "danger" }[g.light];
            body.innerHTML = `
                <div class="cagi-result">
                    <div class="cagi-lights">
                        <span class="cagi-light green ${g.light === "green" ? "on" : ""}">안전</span>
                        <span class="cagi-light yellow ${g.light === "yellow" ? "on" : ""}">주의</span>
                        <span class="cagi-light red ${g.light === "red" ? "on" : ""}">경고</span>
                    </div>
                    <p class="cagi-score">종합 점수 <b>${score}</b><span> / 27점</span> — <b class="cagi-name ${lightCls}">${g.name}</b></p>
                    <div class="cagi-band">
                        <div class="cagi-seg safe" style="width:26%">0~1 비문제</div>
                        <div class="cagi-seg warn" style="width:30%">2~5 위험</div>
                        <div class="cagi-seg danger" style="width:44%">6~27 문제</div>
                        <div class="cagi-pin" style="left:${Math.min(97, Math.max(2, (score <= 1 ? score / 2 * 26 : score <= 5 ? 26 + (score - 2) / 4 * 30 : 56 + Math.min(1, (score - 6) / 21) * 42)))}%">
                            <em>${score}점</em>
                        </div>
                    </div>
                    <p class="db-desc" style="margin:22px 0 10px">${g.desc}</p>
                    <div class="db-note"><b>행동 지침</b> — ${g.guide}</div>
                    <button class="db-btn ghost no-print" id="btn-cagi-redo" style="margin-top:12px">다시 검사하기</button>
                </div>`;
            $("#btn-cagi-redo").addEventListener("click", () => { this._cagi = { idx: 0, answers: [], done: false }; this.renderCagi(); });
            return;
        }

        if (st.idx === 0 && st.answers.length === 0 && !st.started) {
            body.innerHTML = `
                <div class="cagi-intro">
                    <p class="db-note">${DATA.cagi.note}</p>
                    <button class="db-btn no-print" id="btn-cagi-start" style="margin-top:12px">검사 시작 (약 1분)</button>
                    <p class="cagi-unprinted">※ 인쇄 시 이 영역에는 검사 결과가 들어갑니다. 검사를 완료한 뒤 인쇄하세요.</p>
                </div>`;
            $("#btn-cagi-start").addEventListener("click", () => { st.started = true; this.renderCagi(); });
            return;
        }

        const q = Q[st.idx];
        body.innerHTML = `
            <div class="cagi-quiz no-print">
                <div class="cagi-progress"><i style="width:${st.idx / Q.length * 100}%"></i></div>
                <p class="cagi-qnum">문항 ${st.idx + 1} / ${Q.length}</p>
                <p class="cagi-qtext">${q.text}</p>
                <div class="cagi-opts">
                    ${q.options.map((op, i) => `<button class="cagi-opt ${st.answers[st.idx] === i ? "sel" : ""}" data-i="${i}">${op}</button>`).join("")}
                </div>
                ${st.idx > 0 ? `<button class="db-btn ghost slim" id="btn-cagi-prev">‹ 이전 문항</button>` : ""}
            </div>`;
        $$(".cagi-opt").forEach(b => b.addEventListener("click", () => {
            st.answers[st.idx] = +b.dataset.i;
            if (st.idx < Q.length - 1) { st.idx++; }
            else { st.done = true; }
            this.renderCagi();
        }));
        const prev = $("#btn-cagi-prev");
        if (prev) prev.addEventListener("click", () => { st.idx--; this.renderCagi(); });
    },

    /* ── 서약 ── */
    signPledge() {
        const checks = $$("#pledge-form .oath-chk");
        const allChecked = [...checks].every(c => c.checked);
        if (!allChecked) { checks.forEach(c => { if (!c.checked) c.closest(".db-oath").classList.add("miss"); }); return; }
        const name = $("#pledge-name").value.trim() || S.nickname;
        const memo = $("#pledge-input").value.trim();
        S.pledge = { name, memo, date: new Date().toLocaleDateString("ko-KR") };
        $("#pledge-form").classList.add("hidden");
        const done = $("#pledge-done");
        done.classList.remove("hidden");
        done.innerHTML = `
            <div class="db-pledge-card">
                <p class="db-pledge-oaths">나는 모든 불법 도박과 돈내기 게임을 하지 않으며, 공짜 머니 링크를 누르지 않고,
                위험할 때 숨기지 않고 도움을 요청할 것을 서약합니다.</p>
                ${memo ? `“${esc(memo)}”` : ""}
                <span>— ${esc(name)} · ${S.pledge.date} · 문서번호 ${this._docNo}</span>
            </div>`;
    },

    renderChart() {
        const wrap = $("#rig-cols");
        const detail = $("#rig-detail");
        DATA.rigChart.forEach((d, i) => {
            const col = document.createElement("button");
            col.className = "db-col";
            col.style.setProperty("--h", Math.max(d.rate, 1) + "%");
            col.innerHTML = `
                <span class="db-col-val">${d.rate}%</span>
                <span class="db-col-bar"></span>
                <span class="db-col-label">${esc(d.label).replace("\n", "<br>")}</span>`;
            col.addEventListener("click", () => {
                $$(".db-col").forEach(c => c.classList.toggle("on", c === col));
                detail.innerHTML = `<b>${esc(d.label).replace("\n", " ")}</b> — ${esc(d.desc)}`;
            });
            wrap.appendChild(col);
        });
    },
};
