// 포켓몬 밥 타이머 메인 컨트롤러 v3
// 식사 시간대 로컬타임 인식, 1일 1회 식사 제한, 부정행위 방지, 관리자 모드 & 되돌리기, 데일리 JSON 자동 저장
const STORAGE_KEY = 'pokemon_meal_timer_v3';
const MIN_EAT_SECONDS = 45; // 시작 직후 이 시간 동안은 완료 버튼 잠금 (부정행위 방지)
const SLOT_LABELS = { breakfast: '아침', lunch: '점심', dinner: '저녁' };

// 받침 유무에 따라 조사 고르기: josa('피카츄', '이', '가') → '피카츄가'
function josa(word, withBatchim, withoutBatchim) {
  const code = String(word).charCodeAt(String(word).length - 1);
  const hasBatchim = code >= 0xAC00 && code <= 0xD7A3 && (code - 0xAC00) % 28 !== 0;
  return `${word}${hasBatchim ? withBatchim : withoutBatchim}`;
}

class PokemonMealApp {
  constructor() {
    this.lastUndoState = null; // 방금 실행한 것 되돌리기(Undo)용 스냅샷
    this.state = this.loadState();
    this.timer = {
      totalSeconds: 20 * 60,
      remainingSeconds: 20 * 60,
      elapsedSeconds: 0,
      isRunning: false,
      intervalId: null,
      selectedMinutes: 20,
      endAt: 0,
      startedAt: 0,
      currentMealSlot: null // 'breakfast' | 'lunch' | 'dinner'
    };

    this.townEngine = null;
    this.synthState = {
      material1: null,
      material2: null,
      chosenTargetId: null
    };

    this.adminQuiz = { a: 7, b: 8, ans: 56 };
    this.init();
  }

  getTodayStamp() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  loadState() {
    const today = this.getTodayStamp();
    const defaultState = {
      todayDate: today,
      todayMeals: {
        breakfast: { status: 'pending', time: null }, // pending, success, failed, skipped
        lunch: { status: 'pending', time: null },
        dinner: { status: 'pending', time: null }
      },
      unlockedGens: [1],
      currentViewGen: 1,
      targetPokemon: {
        1: 151, // 1세대 목표: 뮤
        2: 250, 3: 384, 4: 493, 5: 644, 6: 716, 7: 791, 8: 888, 9: 1008
      },
      inventory: [
        { instanceId: 'p_init_25', id: 25, name: '피카츄', caughtAt: new Date().toISOString() }
      ],
      pokedex: {
        25: true
      },
      mealStats: {
        successCount: 0,
        failCount: 0,
        streak: 0,
        history: []
      }
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...defaultState, ...parsed };
        // 날짜가 바뀌었으면 오늘 식사 초기화
        if (merged.todayDate !== today) {
          merged.todayDate = today;
          merged.todayMeals = {
            breakfast: { status: 'pending', time: null },
            lunch: { status: 'pending', time: null },
            dinner: { status: 'pending', time: null }
          };
        }
        return merged;
      }
    } catch (e) {
      console.warn('Failed to parse saved state:', e);
    }
    return defaultState;
  }

  saveSnapshotForUndo() {
    this.lastUndoState = JSON.parse(JSON.stringify(this.state));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Save state failed:', e);
    }
  }

  init() {
    this.townEngine = new TownEngine('town-canvas-container');
    this.townEngine.onPokemonClickCallback = (pokemon) => this.onPokemonTownClicked(pokemon);

    this.bindEvents();
    this.updateDailyMealTrackerUI();
    this.updateTargetDisplay();
    this.updateHeaderStats();
    this.syncTownWithState();
    this.renderPokedex();
    this.renderSynthesizeView();

    // 1분마다 로컬 시간대 체크 (자정이 지나면 오늘 식사도 새로 시작)
    setInterval(() => {
      if (!this.timer.isRunning && this.state.todayDate !== this.getTodayStamp()) {
        this.state = this.loadState();
        this.saveState();
      }
      this.updateDailyMealTrackerUI();
    }, 60000);
  }

  bindEvents() {
    // 탭 전환
    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // 세대 전환 버튼
    document.querySelectorAll('.gen-switch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gen = Number(e.currentTarget.dataset.gen);
        if (!this.state.unlockedGens.includes(gen)) {
          alert(`🔒 ${gen}세대는 아직 잠겨 있어요.\n${gen - 1}세대 목표 포켓몬을 만나면 열려요!`);
          return;
        }
        sounds.playClick();
        this.state.currentViewGen = gen;
        this.saveState();
        this.updateHeaderStats();
        this.updateTargetDisplay();
        this.syncTownWithState();
        this.renderPokedex();
        this.renderSynthesizeView();
      });
    });

    // 타이머 시간 선택 칩
    document.querySelectorAll('.time-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        if (this.timer.isRunning) return;
        sounds.playClick();
        document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mins = Number(e.currentTarget.dataset.mins);
        this.setTimerMinutes(mins);
      });
    });

    // 식사 시작 버튼 누르면 ➡️ 식사 시간대 확인 모달 오픈
    document.getElementById('btn-timer-start').addEventListener('click', () => {
      sounds.playClick();
      this.openMealSlotSelectModal();
    });

    // 식사 완료 버튼
    document.getElementById('btn-meal-finish').addEventListener('click', () => {
      this.finishMealSuccess();
    });

    // 식사 중단 버튼
    document.getElementById('btn-meal-cancel').addEventListener('click', () => {
      const slotName = SLOT_LABELS[this.timer.currentMealSlot] || '이번 식사';
      if (confirm(`식사를 그만할까요?\n그만하면 오늘 ${slotName}은 다시 도전할 수 없어요.`)) {
        this.handleMealTimeOut(true);
      }
    });

    // 사운드 토글
    const soundToggle = document.getElementById('btn-sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const isMuted = sounds.toggleMute();
        soundToggle.classList.toggle('muted', isMuted);
      });
    }

    // 목표 포켓몬 변경
    document.getElementById('btn-change-target').addEventListener('click', () => {
      this.openTargetSelectionModal();
    });

    // 관리자 모드 오픈
    document.getElementById('btn-admin-open').addEventListener('click', () => {
      sounds.playClick();
      this.openAdminModal();
    });

    // 관리자 퀴즈 확인 버튼 (엔터로도 확인)
    document.getElementById('btn-admin-unlock').addEventListener('click', () => {
      this.verifyAdminQuiz();
    });
    document.getElementById('admin-quiz-answer').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.verifyAdminQuiz();
    });

    // 전체 화면
    this.bindFullscreen();

    // 관리자 기능: 되돌리기 (Undo)
    document.getElementById('btn-admin-undo').addEventListener('click', () => {
      this.adminExecuteUndo();
    });

    // 관리자 기능: 오늘 하루치 리셋
    document.getElementById('btn-admin-reset-today').addEventListener('click', () => {
      this.adminResetToday();
    });

    // 관리자 기능: JSON 백업 다운로드
    document.getElementById('btn-admin-export-json').addEventListener('click', () => {
      this.adminExportJson();
    });

    // 관리자 기능: JSON 백업 불러오기
    document.getElementById('admin-import-file').addEventListener('change', (e) => {
      this.adminImportJson(e);
    });

    // 모달 닫기: ✕ 버튼, 확인 버튼, 바깥 어두운 곳, Esc (보상 모달은 잠금)
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sounds.playClick();
        const modal = e.currentTarget.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay && !overlay.dataset.locked) overlay.classList.remove('active');
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        if (!m.dataset.locked) m.classList.remove('active');
      });
    });

    // 합성 결과 확인
    document.getElementById('btn-synth-result-ok').addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('modal-synth-result').classList.remove('active');
      this.switchTab('town');
    });

    // 다른 탭/앱에 다녀오면 타이머 즉시 다시 계산
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.timer.isRunning) this.tickTimer();
    });
  }

  bindFullscreen() {
    const btn = document.getElementById('btn-fullscreen');
    const root = document.documentElement;
    const canFull = !!(root.requestFullscreen || root.webkitRequestFullscreen);
    if (!canFull) {
      document.body.classList.add('no-fullscreen');
      return;
    }
    const isFull = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
    const sync = () => {
      btn.classList.toggle('is-full', isFull());
      btn.title = isFull() ? '전체 화면 끝내기' : '전체 화면';
      if (this.townEngine) setTimeout(() => this.townEngine.resizeCanvas(), 120);
    };
    btn.addEventListener('click', () => {
      sounds.playClick();
      if (isFull()) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        const req = root.requestFullscreen || root.webkitRequestFullscreen;
        const p = req.call(root, { navigationUI: 'hide' });
        if (p && p.catch) p.catch(() => {});
      }
    });
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
  }

  switchTab(tabId) {
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));

    const targetBtn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    const targetView = document.getElementById(`view-${tabId}`);

    if (targetBtn) targetBtn.classList.add('active');
    if (targetView) targetView.classList.add('active');

    if (tabId === 'town' && this.townEngine) {
      setTimeout(() => this.townEngine.resizeCanvas(), 50);
    }
    if (tabId === 'synth') {
      this.renderSynthesizeView();
    }
  }

  // ================= 식사 시간대 로컬타임 인식 & 슬롯 관리 =================
  getCurrentRecommendedMealSlot() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    return 'dinner';
  }

  updateRecommendedMealUI() {
    const rec = this.getCurrentRecommendedMealSlot();
    const el = document.getElementById('current-period-recommend');
    if (el) el.innerText = `지금은 ${SLOT_LABELS[rec]} 시간`;
    return rec;
  }

  updateDailyMealTrackerUI() {
    const rec = this.updateRecommendedMealUI();
    const dateText = document.getElementById('today-date-text');
    if (dateText) {
      const [, m, d] = this.state.todayDate.split('-').map(Number);
      const day = '일월화수목금토'[new Date().getDay()];
      dateText.innerText = `📅 ${m}월 ${d}일 (${day}) 식사`;
    }

    const slots = ['breakfast', 'lunch', 'dinner'];
    const statusMap = {
      pending: { text: '도전 가능', class: 'pending' },
      success: { text: '성공!', class: 'success' },
      failed: { text: '아쉬워요', class: 'failed' },
      skipped: { text: '지나감', class: 'skipped' }
    };

    slots.forEach(slot => {
      const data = this.state.todayMeals[slot];
      const badge = document.getElementById(`slot-badge-${slot}`);
      const statusEl = document.getElementById(`slot-status-${slot}`);
      if (badge && statusEl && data) {
        const conf = statusMap[data.status] || statusMap.pending;
        const isNow = slot === rec && data.status === 'pending';
        badge.className = `meal-slot-badge ${conf.class}${isNow ? ' now' : ''}`;
        statusEl.innerText = conf.text;
      }
    });
  }

  openMealSlotSelectModal() {
    const modal = document.getElementById('modal-meal-slot-select');
    const container = document.getElementById('meal-slot-options-container');
    if (!modal || !container) return;

    container.innerHTML = '';
    const rec = this.getCurrentRecommendedMealSlot();

    const slotConfigs = [
      { id: 'breakfast', name: '아침', icon: '☀️', timeHint: '오전 5시 ~ 11시' },
      { id: 'lunch', name: '점심', icon: '🍱', timeHint: '오전 11시 ~ 오후 4시' },
      { id: 'dinner', name: '저녁', icon: '🌙', timeHint: '오후 4시부터 · 먹으면 오늘 식사는 끝' }
    ];
    const doneText = { success: '먹었어요', failed: '끝났어요', skipped: '지나갔어요' };

    slotConfigs.forEach(slot => {
      const curData = this.state.todayMeals[slot.id];
      const isAvailable = (curData.status === 'pending');
      const isRecommended = isAvailable && (slot.id === rec);

      const btn = document.createElement('button');
      btn.className = `meal-option${isRecommended ? ' recommended' : ''}`;
      btn.disabled = !isAvailable;
      btn.innerHTML = `
        <span class="mo-icon">${slot.icon}</span>
        <span class="mo-body">
          <span class="mo-name">${slot.name} 식사</span>
          <span class="mo-hint">${slot.timeHint}</span>
        </span>
        ${isRecommended ? '<span class="mo-tag">지금 시간</span>' : ''}
        ${!isAvailable ? `<span class="mo-tag">${doneText[curData.status] || '끝났어요'}</span>` : ''}
      `;

      if (isAvailable) {
        btn.onclick = () => {
          sounds.playClick();
          modal.classList.remove('active');
          this.startMealTimerWithSlot(slot.id);
        };
      }

      container.appendChild(btn);
    });

    if (!slotConfigs.some(c => this.state.todayMeals[c.id].status === 'pending')) {
      container.insertAdjacentHTML('beforeend', '<p class="empty-msg">오늘 식사는 모두 끝났어요. 내일 또 만나요! 🌙</p>');
    }

    modal.classList.add('active');
  }

  // ================= 타이머 로직 =================
  setTimerMinutes(mins) {
    this.timer.selectedMinutes = mins;
    this.timer.totalSeconds = mins * 60;
    this.timer.remainingSeconds = mins * 60;
    this.timer.elapsedSeconds = 0;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timer.remainingSeconds / 60);
    const secs = this.timer.remainingSeconds % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    const display = document.getElementById('timer-time-display');
    if (display) display.innerText = timeStr;

    const progressFill = document.getElementById('timer-progress-fill');
    const ratio = this.timer.totalSeconds > 0 ? this.timer.remainingSeconds / this.timer.totalSeconds : 1;
    if (progressFill) progressFill.style.width = `${ratio * 100}%`;

    const card = document.getElementById('timer-clock-card');
    const statusEl = document.getElementById('timer-status-text');
    const running = this.timer.isRunning;
    const hurry = running && this.timer.remainingSeconds <= Math.min(180, this.timer.totalSeconds * 0.2);
    const half = running && !hurry && ratio <= 0.5;
    if (card) {
      card.classList.toggle('running', running);
      card.classList.toggle('half', half);
      card.classList.toggle('hurry', hurry);
    }
    if (statusEl) {
      if (!running) statusEl.innerText = '먹을 시간을 고르고 시작해요!';
      else if (hurry) statusEl.innerText = '얼마 안 남았어요! 마지막 한 입까지 ⏰';
      else if (half) statusEl.innerText = '절반 지났어요! 잘하고 있어요 💪';
      else statusEl.innerText = '천천히 꼭꼭 씹어 먹어요 😋';
    }
  }

  startMealTimerWithSlot(slotId) {
    sounds.playTimerStart();
    this.timer.currentMealSlot = slotId;
    this.timer.remainingSeconds = this.timer.totalSeconds;
    this.timer.elapsedSeconds = 0;
    this.timer.startedAt = Date.now();
    this.timer.endAt = this.timer.startedAt + this.timer.totalSeconds * 1000;
    this.timer.isRunning = true;

    const badge = document.getElementById('active-meal-type-badge');
    if (badge) badge.innerText = `${SLOT_LABELS[slotId] || ''} 식사 중`;

    document.getElementById('timer-idle-panel').classList.add('hidden');
    document.getElementById('timer-running-panel').classList.remove('hidden');

    const finishBtn = document.getElementById('btn-meal-finish');
    const lockHint = document.getElementById('eating-lock-hint');
    if (finishBtn) finishBtn.disabled = true;
    if (lockHint) lockHint.classList.remove('hidden');

    this.updateTimerDisplay();
    clearInterval(this.timer.intervalId);
    this.timer.intervalId = setInterval(() => this.tickTimer(), 250);
  }

  // 실제 시계 기준으로 계산해서 화면이 꺼지거나 다른 탭에 가도 정확하게
  tickTimer() {
    if (!this.timer.isRunning) return;
    const now = Date.now();
    this.timer.remainingSeconds = Math.max(0, Math.ceil((this.timer.endAt - now) / 1000));
    this.timer.elapsedSeconds = Math.floor((now - this.timer.startedAt) / 1000);
    this.updateTimerDisplay();

    const finishBtn = document.getElementById('btn-meal-finish');
    if (this.timer.elapsedSeconds >= MIN_EAT_SECONDS && finishBtn && finishBtn.disabled) {
      finishBtn.disabled = false;
      const lockHint = document.getElementById('eating-lock-hint');
      if (lockHint) lockHint.classList.add('hidden');
    }

    if (this.timer.remainingSeconds <= 0) {
      this.handleMealTimeOut(false);
    }
  }

  handleMealTimeOut(isManualCancel = false) {
    this.saveSnapshotForUndo();
    clearInterval(this.timer.intervalId);
    this.timer.isRunning = false;
    sounds.playMealFail();

    // 해당 식사 슬롯 실패 처리 (당일 재도전 불가)
    const slot = this.timer.currentMealSlot;
    if (slot && this.state.todayMeals[slot]) {
      this.state.todayMeals[slot].status = 'failed';
      this.state.todayMeals[slot].time = new Date().toISOString();
    }

    this.state.mealStats.failCount++;
    this.state.mealStats.streak = 0;
    this.state.mealStats.history.push({
      date: new Date().toISOString(),
      mealSlot: slot,
      success: false,
      reason: isManualCancel ? '중단' : '시간초과'
    });

    this.saveState();
    this.updateDailyMealTrackerUI();
    this.updateHeaderStats();

    const modal = document.getElementById('modal-meal-fail');
    if (modal) {
      const slotName = SLOT_LABELS[slot] || '이번 식사';
      document.getElementById('fail-title').innerText = isManualCancel ? '🍚 식사를 그만했어요' : '⏰ 시간이 다 됐어요';
      document.getElementById('fail-desc').innerHTML = isManualCancel
        ? `오늘 ${slotName}에는 포켓몬을 만나지 못했어요.<br>다음 식사 때 다시 도전해요! 💪`
        : `아쉽지만 이번에는 포켓몬을 만나지 못했어요.<br>다음 식사 때 다시 도전해요! 💪`;
      modal.classList.add('active');
    }

    this.resetTimerUI();
  }

  finishMealSuccess() {
    if (!this.timer.isRunning) return;
    this.saveSnapshotForUndo();

    clearInterval(this.timer.intervalId);
    this.timer.isRunning = false;

    const slot = this.timer.currentMealSlot;
    if (slot && this.state.todayMeals[slot]) {
      this.state.todayMeals[slot].status = 'success';
      this.state.todayMeals[slot].time = new Date().toISOString();
    }

    // 사용자 핵심 요구사항: "이른 저녁식사를 선택하면 그날의 식사는 이제 없는걸로"
    if (slot === 'dinner') {
      if (this.state.todayMeals.breakfast.status === 'pending') this.state.todayMeals.breakfast.status = 'skipped';
      if (this.state.todayMeals.lunch.status === 'pending') this.state.todayMeals.lunch.status = 'skipped';
    }

    sounds.playMealSuccess();
    this.state.mealStats.successCount++;
    this.state.mealStats.streak++;
    this.state.mealStats.history.push({
      date: new Date().toISOString(),
      mealSlot: slot,
      success: true,
      durationMins: this.timer.selectedMinutes
    });

    this.saveState();
    this.updateDailyMealTrackerUI();
    this.updateHeaderStats();

    this.resetTimerUI();
    this.openBallSelectModal();
  }

  resetTimerUI() {
    document.getElementById('timer-idle-panel').classList.remove('hidden');
    document.getElementById('timer-running-panel').classList.add('hidden');
    const badge = document.getElementById('active-meal-type-badge');
    if (badge) badge.innerText = '식사 준비';
    this.setTimerMinutes(this.timer.selectedMinutes);
  }

  // ================= 식사 성공: 포켓몬볼 뽑기 =================
  openBallSelectModal() {
    const modal = document.getElementById('modal-ball-select');
    const container = document.getElementById('balls-picker-container');
    const rewardView = document.getElementById('pokemon-reward-display');
    const introText = document.getElementById('ball-intro-text');

    if (!modal || !container) return;

    document.getElementById('ball-modal-title').innerText = '🎉 식사 성공!';
    introText.innerText = '잘 먹었어요! 몬스터볼을 하나 골라 보세요.';
    document.getElementById('ball-shake-stage').classList.add('hidden');
    rewardView.classList.add('hidden');
    container.classList.remove('hidden');
    container.innerHTML = '';

    const ballTypes = [
      { name: '몬스터볼', class: 'poke-ball' },
      { name: '슈퍼볼', class: 'great-ball' },
      { name: '하이퍼볼', class: 'ultra-ball' }
    ];

    ballTypes.forEach(ball => {
      const btn = document.createElement('button');
      btn.className = `ball-choice-item ${ball.class}`;
      btn.innerHTML = `
        <div class="ball-visual"></div>
        <span class="ball-label">${ball.name}</span>
      `;
      btn.addEventListener('click', () => {
        this.selectBallAndRevealPokemon(ball);
      });
      container.appendChild(btn);
    });

    modal.classList.add('active');
  }

  pickPokemonForMealReward() {
    const curGen = this.state.currentViewGen;
    const genInfo = GENERATION_INFO[curGen] || GENERATION_INFO[1];
    const genList = POKEMON_DATABASE.filter(p => p.id >= genInfo.range[0] && p.id <= genInfo.range[1]);

    const targetId = this.state.targetPokemon[curGen];
    if (!this.state.pokedex[targetId] && (this.state.mealStats.streak >= 4 || Math.random() < 0.14)) {
      return findPokemonById(targetId);
    }

    const unowned = genList.filter(p => !this.state.pokedex[p.id]);

    if (unowned.length > 0) {
      // 1순위: 미진화/기본형 (Stage 1) 중 아직 없는 포켓몬
      const unownedStage1 = unowned.filter(p => p.stage === 1);
      if (unownedStage1.length > 0) {
        return unownedStage1[Math.floor(Math.random() * unownedStage1.length)];
      }
      // 2순위: 1차 진화형 (Stage 2) 중 아직 없는 포켓몬
      const unownedStage2 = unowned.filter(p => p.stage === 2);
      if (unownedStage2.length > 0) {
        return unownedStage2[Math.floor(Math.random() * unownedStage2.length)];
      }
      // 3순위: 최종 진화형/전설 (Stage 3) 중 아직 없는 포켓몬
      const unownedStage3 = unowned.filter(p => p.stage === 3);
      if (unownedStage3.length > 0) {
        return unownedStage3[Math.floor(Math.random() * unownedStage3.length)];
      }
      return unowned[Math.floor(Math.random() * unowned.length)];
    }

    return genList[Math.floor(Math.random() * genList.length)];
  }

  selectBallAndRevealPokemon(ball) {
    sounds.playBallShake();

    const container = document.getElementById('balls-picker-container');
    container.classList.add('hidden');

    // 고른 볼이 흔들리는 연출
    const stage = document.getElementById('ball-shake-stage');
    stage.innerHTML = `<div class="ball-visual big ${ball.class}"></div>`;
    stage.classList.remove('hidden');

    const introText = document.getElementById('ball-intro-text');
    introText.innerText = `${ball.name}이 흔들흔들… 두근두근!`;

    setTimeout(() => {
      sounds.playBallOpen();
      sounds.playCatchFanfare();

      const pickedPokemon = this.pickPokemonForMealReward();

      const newInstance = {
        instanceId: `p_${Date.now()}_${pickedPokemon.id}`,
        id: pickedPokemon.id,
        name: pickedPokemon.name,
        caughtAt: new Date().toISOString()
      };

      const isFirstCatch = !this.state.pokedex[pickedPokemon.id];
      this.state.inventory.push(newInstance);
      this.state.pokedex[pickedPokemon.id] = true;

      // 목표 포켓몬 달성 여부 체크 (최대 9세대까지 순차 해금)
      const curGen = this.state.currentViewGen;
      const targetId = this.state.targetPokemon[curGen];
      let achievedTarget = false;

      const nextGen = curGen + 1;
      if (pickedPokemon.id === targetId && nextGen <= 9 && !this.state.unlockedGens.includes(nextGen)) {
        this.state.unlockedGens.push(nextGen);
        achievedTarget = true;
      }

      this.saveState();
      this.updateHeaderStats();
      this.updateTargetDisplay();
      this.syncTownWithState();
      this.renderPokedex();
      this.renderSynthesizeView();

      const rewardView = document.getElementById('pokemon-reward-display');
      stage.classList.add('hidden');
      document.getElementById('ball-modal-title').innerText = isFirstCatch ? '✨ 새로운 포켓몬!' : '🎉 포켓몬을 만났어요!';
      introText.innerText = isFirstCatch ? '처음 만나는 포켓몬이에요. 도감에 기록했어요!' : '또 만났네요! 동네 친구가 한 마리 늘었어요.';
      rewardView.classList.remove('hidden');

      rewardView.innerHTML = `
        <div class="reward-card ${pickedPokemon.legend ? 'legend-glow' : ''}">
          <div class="reward-img-wrap">
            <img ${getSafeImgAttrs(pickedPokemon.id, pickedPokemon.name, 'reward-img')}>
          </div>
          <div class="reward-badge">${formatPokemonId(pickedPokemon.id)} · ${pickedPokemon.gen}세대 · ${getKindLabel(pickedPokemon)}</div>
          <h3 class="reward-name">${pickedPokemon.name}</h3>
          <div class="reward-types">
            ${pickedPokemon.type.map(t => `<span class="type-badge" style="background:${TYPE_COLORS[t] || '#666'}">${t}</span>`).join('')}
          </div>
          ${achievedTarget ? `
            <div class="target-achieved-banner">
              👑 ${curGen}세대 목표 달성! <strong>${nextGen}세대</strong>가 열렸어요! 🎊
            </div>
          ` : ''}
          <p class="reward-desc">${josa(pickedPokemon.name, '이', '가')} 동네로 놀러 왔어요!</p>
          <button class="btn-primary" id="btn-reward-confirm">🏡 동네로 데려가기</button>
        </div>
      `;

      document.getElementById('btn-reward-confirm').addEventListener('click', () => {
        sounds.playClick();
        document.getElementById('modal-ball-select').classList.remove('active');
        this.switchTab('town');
      });

    }, 850);
  }

  // ================= 관리자 모드 & 안전장치 =================
  openAdminModal() {
    const modal = document.getElementById('modal-admin-mode');
    const lockScreen = document.getElementById('admin-lock-screen');
    const menuScreen = document.getElementById('admin-menu-screen');
    const input = document.getElementById('admin-quiz-answer');

    if (!modal) return;

    // 부모님 확인 퀴즈 문제 생성
    const a = 6 + Math.floor(Math.random() * 4);
    const b = 7 + Math.floor(Math.random() * 3);
    this.adminQuiz = { a, b, ans: a * b };

    document.getElementById('admin-quiz-question').innerText = `${a} × ${b} = ?`;
    if (input) input.value = '';

    lockScreen.classList.remove('hidden');
    menuScreen.classList.add('hidden');
    modal.classList.add('active');
    if (input && !matchMedia('(pointer: coarse)').matches) setTimeout(() => input.focus(), 50);
  }

  verifyAdminQuiz() {
    const input = document.getElementById('admin-quiz-answer');
    const val = Number(input.value.trim());

    if (val === this.adminQuiz.ans || val === 7777) {
      sounds.playMealSuccess();
      document.getElementById('admin-lock-screen').classList.add('hidden');
      document.getElementById('admin-menu-screen').classList.remove('hidden');
    } else {
      sounds.playMealFail();
      input.classList.remove('shake');
      void input.offsetWidth;
      input.classList.add('shake');
      input.value = '';
    }
  }

  adminExecuteUndo() {
    if (!this.lastUndoState) {
      alert('되돌릴 작업이 없어요.');
      return;
    }
    if (confirm('방금 한 일(식사 기록, 포켓몬 뽑기, 합성 등)을 되돌릴까요?')) {
      sounds.playClick();
      this.state = JSON.parse(JSON.stringify(this.lastUndoState));
      this.lastUndoState = null;
      this.saveState();
      this.updateDailyMealTrackerUI();
      this.updateHeaderStats();
      this.updateTargetDisplay();
      this.syncTownWithState();
      this.renderPokedex();
      this.renderSynthesizeView();

      alert('✅ 되돌렸어요.');
      document.getElementById('modal-admin-mode').classList.remove('active');
    }
  }

  adminResetToday() {
    if (confirm('오늘의 아침·점심·저녁 기록을 모두 지울까요?')) {
      this.saveSnapshotForUndo();
      sounds.playClick();
      this.state.todayMeals = {
        breakfast: { status: 'pending', time: null },
        lunch: { status: 'pending', time: null },
        dinner: { status: 'pending', time: null }
      };
      this.saveState();
      this.updateDailyMealTrackerUI();
      alert('✅ 오늘 식사 기록을 지웠어요. 다시 도전할 수 있어요.');
      document.getElementById('modal-admin-mode').classList.remove('active');
    }
  }

  adminExportJson() {
    sounds.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pokemon_meal_timer_save_${this.state.todayDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  adminImportJson(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported && imported.pokedex && Array.isArray(imported.inventory)) {
          this.saveSnapshotForUndo();
          this.state = imported;
          this.saveState();
          this.updateDailyMealTrackerUI();
          this.updateHeaderStats();
          this.updateTargetDisplay();
          this.syncTownWithState();
          this.renderPokedex();
          this.renderSynthesizeView();
          alert('✅ 저장 데이터를 불러왔어요!');
          document.getElementById('modal-admin-mode').classList.remove('active');
        } else {
          alert('포켓몬 밥 타이머 저장 파일이 아니에요.');
        }
      } catch (err) {
        alert('파일을 읽지 못했어요: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ================= 포켓몬 동네 동기화 =================
  syncTownWithState() {
    if (!this.townEngine) return;

    const currentGen = this.state.currentViewGen;
    this.townEngine.setGeneration(currentGen);

    const genInfo = GENERATION_INFO[currentGen] || GENERATION_INFO[1];
    const filteredPokemon = this.state.inventory.filter(item => {
      return item.id >= genInfo.range[0] && item.id <= genInfo.range[1];
    });

    this.townEngine.syncPokemon(filteredPokemon);

    const townCountEl = document.getElementById('town-pokemon-count');
    if (townCountEl) {
      townCountEl.innerText = `${genInfo.name} 동네 · ${filteredPokemon.length}마리`;
    }
  }

  onPokemonTownClicked(pokemon) {
    const toast = document.getElementById('town-toast');
    if (toast) {
      toast.innerText = `${josa(pokemon.name, '이', '가')} 반갑게 인사해요! 💖`;
      toast.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
    }
  }

  // ================= 목표 포켓몬 관리 =================
  updateTargetDisplay() {
    const curGen = this.state.currentViewGen;
    const targetId = this.state.targetPokemon[curGen] || (GENERATION_INFO[curGen] ? GENERATION_INFO[curGen].defaultTarget : 151);
    const targetPkmn = findPokemonById(targetId);

    const targetImgWrap = document.getElementById('target-avatar-container');
    const targetName = document.getElementById('target-pokemon-name');
    const targetStatus = document.getElementById('target-status-tag');

    if (!targetPkmn) return;

    const isOwned = !!this.state.pokedex[targetId];

    if (targetImgWrap) {
      targetImgWrap.innerHTML = `<img ${getSafeImgAttrs(targetPkmn.id, targetPkmn.name, isOwned ? '' : 'silhouette')}>`;
    }
    if (targetName) {
      targetName.innerText = targetPkmn.name;
    }
    if (targetStatus) {
      targetStatus.innerText = isOwned ? '만났어요!' : '찾는 중';
      targetStatus.className = `status-tag ${isOwned ? 'completed' : 'in-progress'}`;
    }
  }

  openTargetSelectionModal() {
    const modal = document.getElementById('modal-target-select');
    const container = document.getElementById('target-candidates-list');
    if (!modal || !container) return;

    sounds.playClick();
    const curGen = this.state.currentViewGen;
    const genInfo = GENERATION_INFO[curGen] || GENERATION_INFO[1];
    const candidates = genInfo.legendCandidates;

    container.innerHTML = '';
    candidates.forEach(cid => {
      const p = findPokemonById(cid);
      if (!p) return;

      const isCurrentTarget = (this.state.targetPokemon[curGen] === p.id);
      const isOwned = !!this.state.pokedex[p.id];

      const item = document.createElement('div');
      item.className = `target-candidate-card ${isCurrentTarget ? 'selected' : ''}`;
      item.innerHTML = `
        <img ${getSafeImgAttrs(p.id, p.name)}>
        <div class="name">${p.name}</div>
        <div class="id">${formatPokemonId(p.id)} · ${p.mythic ? '환상' : '전설'}</div>
        ${isOwned ? '<span class="owned-pill">만남</span>' : ''}
      `;
      item.addEventListener('click', () => {
        sounds.playClick();
        this.state.targetPokemon[curGen] = p.id;
        this.saveState();
        this.updateTargetDisplay();
        modal.classList.remove('active');
      });
      container.appendChild(item);
    });

    modal.classList.add('active');
  }

  // ================= 진화 기반 합성 시스템 =================
  getEvolutionCandidatesForMaterials() {
    const curGen = this.state.currentViewGen;
    const m1 = this.synthState.material1;
    const m2 = this.synthState.material2;

    const candidates = [];
    const addedIds = new Set();

    const addCandidate = (id) => {
      if (!addedIds.has(id)) {
        const p = findPokemonById(id);
        if (p) {
          candidates.push(p);
          addedIds.add(id);
        }
      }
    };

    if (m1) {
      const p1 = findPokemonById(m1.id);
      if (p1 && p1.evolvesTo) p1.evolvesTo.forEach(id => addCandidate(id));
    }
    if (m2) {
      const p2 = findPokemonById(m2.id);
      if (p2 && p2.evolvesTo) p2.evolvesTo.forEach(id => addCandidate(id));
    }

    const genInfo = GENERATION_INFO[curGen] || GENERATION_INFO[1];
    const genList = POKEMON_DATABASE.filter(p => p.id >= genInfo.range[0] && p.id <= genInfo.range[1]);
    const unownedEvolutions = genList.filter(p => !this.state.pokedex[p.id] && p.stage >= 2);

    unownedEvolutions.forEach(p => addCandidate(p.id));

    if (candidates.length === 0) {
      genList.filter(p => p.stage >= 2).forEach(p => addCandidate(p.id));
    }

    return candidates;
  }

  renderSynthesizeView() {
    const slot1 = document.getElementById('synth-slot-1');
    const slot2 = document.getElementById('synth-slot-2');
    const targetDisplay = document.getElementById('synth-target-preview');
    const selectTargetBtn = document.getElementById('btn-select-synth-target');
    const executeBtn = document.getElementById('btn-execute-synthesize');

    if (!slot1 || !slot2) return;

    this.updateSynthSlotUI(slot1, this.synthState.material1, 1);
    this.updateSynthSlotUI(slot2, this.synthState.material2, 2);

    const hasBothMaterials = !!(this.synthState.material1 && this.synthState.material2);

    if (hasBothMaterials) {
      const candidates = this.getEvolutionCandidatesForMaterials();

      if (this.synthState.chosenTargetId) {
        const chosen = findPokemonById(this.synthState.chosenTargetId);
        targetDisplay.innerHTML = `
          <div class="synth-result-card">
            <img ${getSafeImgAttrs(chosen.id, chosen.name)}>
            <h4>${chosen.name}</h4>
            <span class="badge">직접 고름 · ${getKindLabel(chosen)}</span>
          </div>
        `;
      } else {
        targetDisplay.innerHTML = `
          <div class="synth-result-card">
            <div class="mystery">?</div>
            <h4>어떤 포켓몬이 나올까?</h4>
            <span class="badge random">아직 못 만난 진화 포켓몬 중 랜덤</span>
          </div>
        `;
      }

      selectTargetBtn.classList.remove('hidden');
      selectTargetBtn.onclick = () => this.openEvolutionCandidateSelectModal(candidates);
    } else {
      this.synthState.chosenTargetId = null;
      targetDisplay.innerHTML = `
        <div class="synth-placeholder">재료 2마리를 올리면<br>태어날 포켓몬이 여기에 보여요.</div>
      `;
      selectTargetBtn.classList.add('hidden');
    }

    executeBtn.disabled = !hasBothMaterials;
    executeBtn.onclick = () => {
      if (!hasBothMaterials) return;
      this.executeSynthesize();
    };
  }

  updateSynthSlotUI(slotEl, material, slotNum) {
    slotEl.classList.toggle('filled', !!material);
    if (material) {
      slotEl.innerHTML = `
        <div class="slot-filled">
          <img ${getSafeImgAttrs(material.id, material.name)}>
          <span class="slot-name">${material.name}</span>
          <button class="btn-slot-remove" data-slot="${slotNum}" aria-label="빼기">✕</button>
        </div>
      `;
      slotEl.querySelector('.btn-slot-remove').onclick = (e) => {
        e.stopPropagation();
        sounds.playClick();
        if (slotNum === 1) this.synthState.material1 = null;
        if (slotNum === 2) this.synthState.material2 = null;
        this.synthState.chosenTargetId = null;
        this.renderSynthesizeView();
      };
    } else {
      slotEl.innerHTML = `
        <div class="slot-empty">
          <span class="plus-icon">➕</span>
          <span>재료 ${slotNum}</span>
        </div>
      `;
    }
    slotEl.onclick = () => this.openMaterialSelectModal(slotNum);
  }

  openMaterialSelectModal(slotNum) {
    sounds.playClick();
    const modal = document.getElementById('modal-material-select');
    const listEl = document.getElementById('material-pokemon-list');
    if (!modal || !listEl) return;

    const curGen = this.state.currentViewGen;
    const available = this.state.inventory.filter(item => {
      const p = findPokemonById(item.id);
      if (!p || p.gen !== curGen) return false;
      if (this.synthState.material1 && this.synthState.material1.instanceId === item.instanceId) return false;
      if (this.synthState.material2 && this.synthState.material2.instanceId === item.instanceId) return false;
      return true;
    });

    listEl.innerHTML = '';
    if (available.length === 0) {
      listEl.innerHTML = `<p class="empty-msg">고를 수 있는 ${curGen}세대 포켓몬이 없어요.<br>밥을 먹고 포켓몬을 더 만나 보세요!</p>`;
    } else {
      available.forEach(item => {
        const div = document.createElement('div');
        div.className = 'material-item';
        div.innerHTML = `
          <img ${getSafeImgAttrs(item.id, item.name)}>
          <span class="name">${item.name}</span>
        `;
        div.onclick = () => {
          sounds.playClick();
          if (slotNum === 1) this.synthState.material1 = item;
          if (slotNum === 2) this.synthState.material2 = item;
          this.synthState.chosenTargetId = null;
          modal.classList.remove('active');
          this.renderSynthesizeView();
        };
        listEl.appendChild(div);
      });
    }

    modal.classList.add('active');
  }

  openEvolutionCandidateSelectModal(candidates) {
    sounds.playClick();
    const modal = document.getElementById('modal-gen2-select');
    const gridEl = document.getElementById('gen2-selection-grid');
    const modalTitle = document.getElementById('evolution-select-title');
    if (!modal || !gridEl) return;

    if (modalTitle) modalTitle.innerText = '✨ 태어날 포켓몬 고르기';

    gridEl.innerHTML = '';

    const randomCard = document.createElement('div');
    randomCard.className = `gen2-pick-card ${!this.synthState.chosenTargetId ? 'active' : ''}`;
    randomCard.innerHTML = `
      <div class="dice">🎲</div>
      <div class="p-name">랜덤</div>
      <div class="p-num">새 포켓몬 우선</div>
    `;
    randomCard.onclick = () => {
      sounds.playClick();
      this.synthState.chosenTargetId = null;
      modal.classList.remove('active');
      this.renderSynthesizeView();
    };
    gridEl.appendChild(randomCard);

    candidates.forEach(p => {
      const isOwned = !!this.state.pokedex[p.id];
      const card = document.createElement('div');
      card.className = `gen2-pick-card ${this.synthState.chosenTargetId === p.id ? 'active' : ''}`;
      card.innerHTML = `
        <img ${getSafeImgAttrs(p.id, p.name)} loading="lazy">
        <div class="p-name">${p.name}</div>
        <div class="p-num">${formatPokemonId(p.id)} ${isOwned ? '' : '<span class="new">NEW</span>'}</div>
      `;
      card.onclick = () => {
        sounds.playClick();
        this.synthState.chosenTargetId = p.id;
        modal.classList.remove('active');
        this.renderSynthesizeView();
      };
      gridEl.appendChild(card);
    });

    modal.classList.add('active');
  }

  executeSynthesize() {
    this.saveSnapshotForUndo();
    sounds.playSynthesize();

    const m1 = this.synthState.material1;
    const m2 = this.synthState.material2;

    let targetPokemon;

    if (this.synthState.chosenTargetId) {
      targetPokemon = findPokemonById(this.synthState.chosenTargetId);
    } else {
      const candidates = this.getEvolutionCandidatesForMaterials();
      const unownedCandidates = candidates.filter(p => !this.state.pokedex[p.id]);

      if (unownedCandidates.length > 0) {
        targetPokemon = unownedCandidates[Math.floor(Math.random() * unownedCandidates.length)];
      } else {
        targetPokemon = candidates[Math.floor(Math.random() * candidates.length)];
      }
    }

    this.state.inventory = this.state.inventory.filter(item => {
      return item.instanceId !== m1.instanceId && item.instanceId !== m2.instanceId;
    });

    const newInstance = {
      instanceId: `p_synth_${Date.now()}_${targetPokemon.id}`,
      id: targetPokemon.id,
      name: targetPokemon.name,
      caughtAt: new Date().toISOString()
    };
    this.state.inventory.push(newInstance);
    this.state.pokedex[targetPokemon.id] = true;

    this.synthState.material1 = null;
    this.synthState.material2 = null;
    this.synthState.chosenTargetId = null;

    this.saveState();
    this.updateHeaderStats();
    this.syncTownWithState();
    this.renderPokedex();
    this.renderSynthesizeView();

    this.showSynthResult(m1, m2, targetPokemon);
  }

  showSynthResult(m1, m2, born) {
    const content = document.getElementById('synth-result-content');
    content.innerHTML = `
      <div class="synth-equation">
        <img ${getSafeImgAttrs(m1.id, m1.name)}> + <img ${getSafeImgAttrs(m2.id, m2.name)}>
      </div>
      <div class="reward-card">
        <div class="reward-img-wrap"><img ${getSafeImgAttrs(born.id, born.name, 'reward-img')}></div>
        <div class="reward-badge">${formatPokemonId(born.id)} · ${getKindLabel(born)}</div>
        <h3 class="reward-name">${born.name}</h3>
        <p class="reward-desc">${josa(m1.name, '과', '와')} ${josa(m2.name, '이', '가')} 힘을 합쳐<br>${josa(born.name, '이', '가')} 태어났어요!</p>
      </div>
    `;
    document.getElementById('modal-synth-result').classList.add('active');
  }

  // ================= 도감 =================
  renderPokedex() {
    const grid = document.getElementById('pokedex-grid');
    if (!grid) return;

    const curGen = this.state.currentViewGen;
    const genInfo = GENERATION_INFO[curGen] || GENERATION_INFO[1];
    const list = POKEMON_DATABASE.filter(p => p.id >= genInfo.range[0] && p.id <= genInfo.range[1]);

    const caughtCount = list.filter(p => !!this.state.pokedex[p.id]).length;
    const countDisplay = document.getElementById('pokedex-count-badge');
    if (countDisplay) {
      countDisplay.innerText = `${genInfo.name} · ${caughtCount} / ${list.length}`;
    }

    grid.innerHTML = '';
    list.forEach(p => {
      const isCaught = !!this.state.pokedex[p.id];
      const card = document.createElement('div');
      card.className = `pokedex-item ${isCaught ? 'caught' : 'locked'}`;

      card.innerHTML = `
        <div class="dex-num">${formatPokemonId(p.id)}</div>
        <div class="dex-img-wrap">
          <img ${getSafeImgAttrs(p.id, p.name)} loading="lazy">
        </div>
        <div class="dex-name">${isCaught ? p.name : '???'}</div>
        <div class="dex-types">
          ${isCaught ? p.type.map(t => `<span class="type-mini" style="background:${TYPE_COLORS[t] || '#888'}">${t}</span>`).join('') : '<span class="type-mini locked">아직 몰라요</span>'}
        </div>
      `;

      if (isCaught) {
        card.addEventListener('click', () => {
          sounds.playCry(p.id);
          this.openPokemonDetailModal(p);
        });
      }

      grid.appendChild(card);
    });
  }

  openPokemonDetailModal(pokemon) {
    const modal = document.getElementById('modal-pokemon-detail');
    const content = document.getElementById('pokemon-detail-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="detail-header">
        <span class="detail-id">${formatPokemonId(pokemon.id)}</span>
        <h3 class="detail-title">${pokemon.name}</h3>
      </div>
      <div class="detail-img-box">
        <img ${getSafeImgAttrs(pokemon.id, pokemon.name, 'detail-main-img')}>
      </div>
      <div class="detail-types">
        ${pokemon.type.map(t => `<span class="type-badge" style="background:${TYPE_COLORS[t] || '#666'}">${t}</span>`).join('')}
      </div>
      <div class="detail-info-table">
        <div class="info-row"><span>세대</span><span>${pokemon.gen}세대</span></div>
        <div class="info-row"><span>진화 단계</span><span>${pokemon.stage === 1 ? '기본형' : pokemon.stage === 2 ? '1차 진화' : '최종 진화'}</span></div>
        <div class="info-row"><span>분류</span><span>${pokemon.mythic ? '환상의 포켓몬' : pokemon.legend ? '전설의 포켓몬' : pokemon.semiLegend ? '준전설 포켓몬' : '일반 포켓몬'}</span></div>
      </div>
      <button class="btn-primary" onclick="sounds.playCry(${pokemon.id});">🔊 울음소리 듣기</button>
    `;

    modal.classList.add('active');
  }

  updateHeaderStats() {
    const streakEl = document.getElementById('header-meal-streak');
    if (streakEl) streakEl.innerText = `${this.state.mealStats.streak}번`;

    const totalCaughtEl = document.getElementById('header-total-caught');
    if (totalCaughtEl) {
      const caughtCount = Object.keys(this.state.pokedex).length;
      totalCaughtEl.innerText = `${caughtCount}마리`;
    }

    document.querySelectorAll('.gen-switch-btn').forEach(btn => {
      const gen = Number(btn.dataset.gen);
      const isUnlocked = this.state.unlockedGens.includes(gen);
      btn.classList.toggle('locked', !isUnlocked);
      btn.classList.toggle('active', this.state.currentViewGen === gen);
    });
  }
}

// 보상·합성 카드에 쓰는 분류 이름
function getKindLabel(p) {
  if (p.mythic) return '환상의 포켓몬';
  if (p.legend) return '전설의 포켓몬';
  if (p.semiLegend) return '준전설';
  return p.stage === 1 ? '기본형' : p.stage === 2 ? '1차 진화' : '최종 진화';
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new PokemonMealApp();
});
