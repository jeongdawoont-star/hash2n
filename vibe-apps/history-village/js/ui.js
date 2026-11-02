/**
 * 초등 한국사 메타버스 - UI 및 인터랙션 컨트롤러 (복원/신문인쇄/타임슬립)
 */

import { HISTORICAL_ERAS } from './historical_data.js';

export class HistoryMetaverseUI {
  constructor() {
    this.engine = null;
    this.currentEraId = 'gojoseon';
    this.score = 0;
    this.solvedQuizzes = [];
    this.restoredLandmarks = [];

    // 인벤토리: 시대별 리소스 ID -> 보유 수량
    this.inventory = {
      bronze: 2,
      stone: 3,
      herb: 1,
      pottery: 0,
      iron: 2,
      silk: 2,
      gold: 1,
      fur: 2,
      pearl: 2,
      granite: 1,
      basalt: 2,
      grain: 2,
      paper: 1,
      clay: 2,
      wood_block: 2,
      ginseng: 1,
      brass: 2,
      hanji: 2,
      timber: 2
    };

    // DOM 캐시
    this.brandTitle = document.getElementById('brand-title');
    this.brandEyebrow = document.getElementById('brand-eyebrow');
    this.brandCenter = document.getElementById('brand-center');
    this.questTag = document.getElementById('quest-era-tag');
    this.questGoal = document.getElementById('quest-goal-text');
    this.invContainer = document.getElementById('inventory-list');
    this.scoreText = document.getElementById('score-val');
    this.promptBox = document.getElementById('interact-prompt');
    this.promptText = document.getElementById('prompt-text');

    // 대화 모달
    this.dialogueModal = document.getElementById('dialogue-modal');
    this.speakerRole = document.getElementById('speaker-role');
    this.speakerName = document.getElementById('speaker-name');
    this.dialogueText = document.getElementById('dialogue-text');
    this.quizContainer = document.getElementById('quiz-container');
    this.portraitEmoji = document.getElementById('portrait-emoji');
    this.closeDialogueBtn = document.getElementById('close-dialogue-btn');

    // 신문 인쇄 모달
    this.newspaperModal = document.getElementById('newspaper-modal');
    this.printNewspaperBtn = document.getElementById('print-newspaper-btn');
    this.closeNewspaperBtn = document.getElementById('close-newspaper-btn');

    this.initEvents();
  }

  setEngine(engine) {
    this.engine = engine;
  }

  initEvents() {
    // 시대 탭
    const eraTabs = document.querySelectorAll('.era-tab');
    eraTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const eraId = tab.dataset.era;
        if (eraId && eraId !== this.currentEraId) {
          eraTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.switchEra(eraId);
        }
      });
    });

    // 대화창 닫기
    if (this.closeDialogueBtn) {
      this.closeDialogueBtn.addEventListener('click', () => {
        this.closeDialogue();
      });
    }

    // 타임슬립 나침반 토글
    const compassBtn = document.getElementById('compass-btn');
    if (compassBtn) {
      compassBtn.addEventListener('click', () => {
        if (this.engine) {
          const isCompass = this.engine.toggleCompassMode();
          compassBtn.classList.toggle('active', isCompass);
          this.showToast(
            isCompass 
              ? '🧭 [타임슬립 위성뷰 활성화] 과거 영토와 현대 대한민국 지명을 위성에서 비교합니다.'
              : '🚶 [일반 탐험 모드 복귀] 캐릭터 쿼터뷰 시점으로 돌아왔습니다.'
          );
        }
      });
    }

    // 탐구 신문 발행 버튼
    const newsBtn = document.getElementById('newspaper-btn');
    if (newsBtn) {
      newsBtn.addEventListener('click', () => {
        this.openNewspaperModal();
      });
    }

    if (this.printNewspaperBtn) {
      this.printNewspaperBtn.addEventListener('click', () => {
        window.print();
      });
    }

    if (this.closeNewspaperBtn) {
      this.closeNewspaperBtn.addEventListener('click', () => {
        if (this.newspaperModal) this.newspaperModal.classList.remove('open');
      });
    }
  }

  switchEra(eraId) {
    this.currentEraId = eraId;
    if (this.engine) {
      this.engine.loadEra(eraId);
    }
  }

  onEraLoaded(era) {
    if (this.brandTitle) this.brandTitle.textContent = era.name;
    if (this.brandEyebrow) this.brandEyebrow.textContent = era.period;
    if (this.brandCenter) this.brandCenter.textContent = era.centerName;

    if (this.questTag) this.questTag.textContent = era.name;
    if (this.questGoal) this.questGoal.textContent = era.objective;

    this.renderInventory(era);
  }

  renderInventory(era) {
    if (!this.invContainer) return;
    this.invContainer.innerHTML = '';

    era.resources.forEach(res => {
      const count = this.inventory[res.id] || 0;
      const div = document.createElement('div');
      div.className = 'inv-item';
      div.innerHTML = `
        <span>${res.icon}</span>
        <span>${res.name.split(' ')[0]}</span>
        <span class="count">${count}</span>
      `;
      this.invContainer.appendChild(div);
    });
  }

  onNearInteractableChange(item) {
    if (!this.promptBox) return;

    if (item) {
      this.promptBox.style.display = 'flex';
      if (item.type === 'npc') {
        this.promptText.innerHTML = `<small>역사 인물과 대화</small><strong>${item.data.name} 만나기</strong>`;
      } else if (item.type === 'resource') {
        this.promptText.innerHTML = `<small>역사 자원 채집</small><strong>${item.data.name} 획득하기</strong>`;
      } else if (item.type === 'construction') {
        this.promptText.innerHTML = `<small>학급 협동 복원</small><strong>${item.data.name} 기여하기</strong>`;
      }
    } else {
      this.promptBox.style.display = 'none';
    }
  }

  onInteract(item) {
    if (!item) return;

    if (item.type === 'npc') {
      this.openNpcDialogue(item.data);
    } else if (item.type === 'resource') {
      this.collectResource(item.data);
    } else if (item.type === 'construction') {
      this.contributeToConstruction(item.data);
    }
  }

  openNpcDialogue(npc) {
    if (!this.dialogueModal) return;

    this.speakerRole.textContent = npc.role;
    this.speakerName.textContent = npc.name;
    this.dialogueText.textContent = npc.dialogue;
    this.portraitEmoji.textContent = npc.emoji || '📜';

    this.quizContainer.innerHTML = '';
    if (npc.quiz) {
      const qBox = document.createElement('div');
      qBox.style.marginBottom = '12px';
      qBox.style.fontWeight = '800';
      qBox.style.fontSize = '14px';
      qBox.style.color = '#1f483a';
      qBox.textContent = `💡 [역사 탐구 문제] ${npc.quiz.question}`;
      this.quizContainer.appendChild(qBox);

      const optionsGrid = document.createElement('div');
      optionsGrid.className = 'quiz-options-container';

      npc.quiz.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = `${optIdx + 1}. ${optText}`;
        btn.addEventListener('click', () => {
          this.handleQuizAnswer(npc.quiz, optIdx, btn, npc.name);
        });
        optionsGrid.appendChild(btn);
      });

      this.quizContainer.appendChild(optionsGrid);
    }

    this.dialogueModal.classList.add('open');
  }

  handleQuizAnswer(quiz, selectedIdx, clickedBtn, npcName) {
    const isCorrect = (selectedIdx === quiz.answer);
    if (isCorrect) {
      clickedBtn.style.background = '#40b284';
      clickedBtn.style.color = '#ffffff';
      clickedBtn.style.borderColor = '#2d8b64';
      clickedBtn.textContent += ' ⭕ 정답!';

      this.score += 100;
      if (this.scoreText) this.scoreText.textContent = this.score;

      this.dialogueText.textContent = `✨ 참 훌륭하구나! 정답이다! (${quiz.explanation})`;

      // 해결한 퀴즈 기록 (신문용)
      this.solvedQuizzes.push({
        question: quiz.question,
        npc: npcName,
        era: HISTORICAL_ERAS[this.currentEraId].name
      });

      const allBtns = this.quizContainer.querySelectorAll('.quiz-option-btn');
      allBtns.forEach(b => b.disabled = true);
    } else {
      clickedBtn.style.background = '#f87171';
      clickedBtn.style.color = '#ffffff';
      clickedBtn.textContent += ' ❌ 다시 생각해보렴!';
    }
  }

  collectResource(res) {
    this.score += 25;
    this.inventory[res.id] = (this.inventory[res.id] || 0) + (res.amount || 1);

    if (this.scoreText) this.scoreText.textContent = this.score;
    this.renderInventory(HISTORICAL_ERAS[this.currentEraId]);

    this.showToast(`🎉 [자원 획득] ${res.name}을(를) 채집했습니다! (+25점)`);
  }

  contributeToConstruction(site) {
    if (site.stage >= 2) {
      this.showToast(`🏆 ${site.name}은(는) 이미 훌륭하게 완공되었습니다!`);
      return;
    }

    // 자원 요구량 검사
    let canBuild = true;
    for (const [resId, reqCount] of Object.entries(site.required)) {
      if ((this.inventory[resId] || 0) < reqCount) {
        canBuild = false;
        break;
      }
    }

    if (canBuild) {
      // 자원 차감
      for (const [resId, reqCount] of Object.entries(site.required)) {
        this.inventory[resId] -= reqCount;
      }
      this.renderInventory(HISTORICAL_ERAS[this.currentEraId]);

      // 단계 성장
      const advanced = this.engine.advanceConstructionStage();
      if (advanced) {
        this.score += 300;
        if (this.scoreText) this.scoreText.textContent = this.score;

        if (site.stage === 2) {
          this.restoredLandmarks.push({
            name: site.name,
            era: HISTORICAL_ERAS[this.currentEraId].name,
            desc: site.desc
          });
          this.showCelebrationModal(site.name);
        } else {
          this.showToast(`🔨 [복원 기여 완료] ${site.name} 골조를 완성했습니다! (+300점)`);
        }
      }
    } else {
      const neededText = Object.entries(site.required)
        .map(([k, v]) => `${k} ${v}개`)
        .join(', ');
      alert(`⚠️ [자원 부족] ${site.name} 복원에는 [${neededText}]가 필요합니다. 주변 자원을 더 채집해보세요!`);
    }
  }

  showCelebrationModal(siteName) {
    alert(`🎊 축하합니다! 🎊\n\n우리 반의 힘으로 [${siteName}]을(를) 찬란하게 완공하였습니다!\n역사의 소중한 문화유산이 복원되었습니다 (+300점)`);
  }

  openNewspaperModal() {
    if (!this.newspaperModal) return;

    const paperEra = document.getElementById('paper-era-text');
    const paperScore = document.getElementById('paper-score-text');
    const paperRelics = document.getElementById('paper-relics-list');
    const paperQuizzes = document.getElementById('paper-quizzes-list');

    if (paperEra) paperEra.textContent = HISTORICAL_ERAS[this.currentEraId].name;
    if (paperScore) paperScore.textContent = `${this.score}점`;

    if (paperRelics) {
      paperRelics.innerHTML = '';
      if (this.restoredLandmarks.length === 0) {
        paperRelics.innerHTML = '<li>아직 복원된 문화유산이 없습니다. 자원을 모아 랜드마크를 완공해보세요!</li>';
      } else {
        this.restoredLandmarks.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>[${item.era}] ${item.name}</strong>: ${item.desc}`;
          paperRelics.appendChild(li);
        });
      }
    }

    if (paperQuizzes) {
      paperQuizzes.innerHTML = '';
      if (this.solvedQuizzes.length === 0) {
        paperQuizzes.innerHTML = '<li>아직 해결한 역사 탐구 문제가 없습니다. 역사 인물(NPC)과 대화해보세요!</li>';
      } else {
        this.solvedQuizzes.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${item.npc}의 질문</strong>: ${item.question} (정답 확인 완료)`;
          paperQuizzes.appendChild(li);
        });
      }
    }

    this.newspaperModal.classList.add('open');
  }

  closeDialogue() {
    if (this.dialogueModal) {
      this.dialogueModal.classList.remove('open');
    }
  }

  showToast(message) {
    let toast = document.getElementById('game-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'game-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '110px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(23, 44, 35, 0.94)';
      toast.style.color = '#ffffff';
      toast.style.padding = '10px 22px';
      toast.style.borderRadius = '999px';
      toast.style.fontSize = '12px';
      toast.style.fontWeight = '900';
      toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      toast.style.zIndex = '100';
      toast.style.transition = 'opacity 0.3s ease';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 2800);
  }
}
