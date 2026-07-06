/* ═══════════════════════════════════════════════════════════
   도박의 덫 — LAST BET · 디브리핑 리포트
   (색·마크는 검증된 다크 팔레트: surface #1a1a19 / series #3987e5)
   ═══════════════════════════════════════════════════════════ */
"use strict";

const Debrief = {

    show() {
        S.endTime = S.endTime || Date.now();
        try { Games.closeCurrent(); } catch (e) {}
        document.body.classList.add("debrief-mode");
        const layer = $("#debrief-layer");
        layer.classList.remove("hidden");
        layer.scrollTop = 0;

        const lost = S.totalCharged + S.debt;                    // 실제로 사라진 돈
        const elapsedMs = S.startTime ? (S.endTime - S.startTime) : 0;
        const elapsedMin = Math.max(1, Math.round(elapsedMs / 60000));
        const wageEarned = Math.round(elapsedMs / 3600000 * CONFIG.MIN_WAGE);
        const workHours = lost > 0 ? Math.ceil(lost / CONFIG.MIN_WAGE) : 0;
        const workDays = Math.ceil(workHours / 8);
        const actualWinRate = S.betCount ? Math.round(S.winCount / S.betCount * 100) : 0;
        const friendNames = S.friends.map(f => esc(f.name));

        $("#debrief-content").innerHTML = `
        <div class="db-wrap">

            <header class="db-header">
                <p class="db-eyebrow">도박의 덫 — 체험 결과 리포트</p>
                <h1>${esc(S.nickname)}님, 방금 겪은 일은<br>전부 <span class="db-critical">실제 수법</span>이었습니다</h1>
            </header>

            <!-- 히어로: 총 손실 -->
            <section class="db-hero">
                <p class="db-tile-label">이 체험에서 사라진 (가상의) 진짜 돈</p>
                <div class="db-hero-value">−${fmt(lost)}<span>원</span></div>
                <p class="db-hero-sub">충전 ${fmt(S.totalCharged)}원 + 빚 ${fmt(S.debt)}원 · 가입 ${elapsedMin}분 만에</p>
            </section>

            <!-- 스탯 타일 -->
            <section class="db-tiles">
                <div class="db-tile"><p class="db-tile-label">최고 잔액 (최고점)</p><b>${fmt(S.peak)}원</b><span class="db-delta down">▼ 그 후 전액 상실</span></div>
                <div class="db-tile"><p class="db-tile-label">총 베팅 횟수</p><b>${fmt(S.betCount)}회</b><span class="db-delta">${elapsedMin}분 동안</span></div>
                <div class="db-tile"><p class="db-tile-label">총 베팅 금액</p><b>${fmt(S.totalBet)}원</b><span class="db-delta">회전할수록 사이트의 수익</span></div>
                <div class="db-tile"><p class="db-tile-label">충전 성공</p><b>${S.chargeCount + (S.flags.loan1Used ? 1 : 0) + (S.flags.loan2Used ? 1 : 0)}회</b><span class="db-delta">평균 처리 2초</span></div>
                <div class="db-tile"><p class="db-tile-label">환전 성공</p><b>0회</b><span class="db-delta down">시도 ${S.exchangeTries}회 전부 거부</span></div>
                <div class="db-tile"><p class="db-tile-label">체험 소요 시간</p><b>${elapsedText()}</b><span class="db-delta">현실이었다면?</span></div>
            </section>

            <!-- 시간 충격 -->
            <section class="db-card">
                <h2>⏱ 같은 시간, 두 개의 세계</h2>
                <div class="db-compare">
                    <div class="db-comp-side">
                        <p class="db-tile-label">${elapsedMin}분 동안 편의점 알바를 했다면</p>
                        <b class="good">+${fmt(wageEarned)}원</b>
                        <span>2026년 최저시급 ${fmt(CONFIG.MIN_WAGE)}원 기준</span>
                    </div>
                    <div class="db-comp-side">
                        <p class="db-tile-label">${elapsedMin}분 동안 도박을 한 결과</p>
                        <b class="bad">−${fmt(lost)}원</b>
                        <span>빚 ${fmt(S.debt)}원 포함</span>
                    </div>
                </div>
                ${lost > 0 ? `<p class="db-note">잃은 ${fmt(lost)}원을 다시 벌려면 최저시급 알바 <b>${fmt(workHours)}시간</b>,
                하루 8시간씩 <b>${fmt(workDays)}일</b>을 일해야 합니다.</p>` : ""}
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

            <!-- 실제 통계 -->
            <section class="db-card">
                <h2>📊 이건 시뮬레이션이지만, 아래는 현실입니다</h2>
                <div class="db-stats">
                    ${DATA.realStats.map(s => `<div class="db-stat"><p>${s.text}</p><span>— ${s.src}</span></div>`).join("")}
                </div>
            </section>

            <!-- 다짐 -->
            <section class="db-card">
                <h2>✍️ 오늘의 나에게 남기는 한 줄</h2>
                <p class="db-desc">누군가 링크를 보내며 "꽁머니 준대"라고 말하는 날이 반드시 옵니다.
                그날의 나에게 지금 한 줄을 남겨두세요.</p>
                <textarea id="pledge-input" rows="3" maxlength="200" placeholder="예: 공짜 돈은 미끼다. 나는 링크를 누르지 않는다."></textarea>
                <button class="db-btn" id="btn-pledge">다짐 남기기</button>
                <div id="pledge-done" class="hidden"></div>
            </section>

            <!-- 도움 -->
            <section class="db-help">
                <p>나 또는 친구가 이미 도박을 시작했다면, 혼나는 일이 아니라 <b>도움받을 일</b>입니다.</p>
                <div class="db-help-num">📞 한국도박문제예방치유원 <b>1336</b></div>
                <p class="db-help-sub">24시간 · 무료 · 비밀 보장 (전화, 문자, 카카오톡 채널)</p>
            </section>

            <div class="db-actions">
                <button class="db-btn ghost" id="btn-restart">처음부터 다시 체험하기</button>
            </div>
            <p class="db-foot">본 프로그램은 불법도박 예방 교육용 시뮬레이션이며 모든 금액·인물·사이트는 가상입니다.</p>
        </div>`;

        this.renderChart();

        $("#btn-pledge").addEventListener("click", () => {
            const v = $("#pledge-input").value.trim();
            if (!v) return;
            const done = $("#pledge-done");
            done.classList.remove("hidden");
            done.innerHTML = `<div class="db-pledge-card">“${esc(v)}”<span>— ${esc(S.nickname)}, ${new Date().toLocaleDateString("ko-KR")}</span></div>`;
            $("#pledge-input").classList.add("hidden");
            $("#btn-pledge").classList.add("hidden");
        });
        $("#btn-restart").addEventListener("click", () => location.reload());
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
