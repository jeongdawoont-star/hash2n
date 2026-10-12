// Web Audio API 기반 레트로 포켓몬 효과음 엔진 (무설치/순수 브라우저 오디오)
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1, delay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // audio context blocked or error
      }
    }, delay * 1000);
  }

  // 버튼 클릭
  playClick() {
    this.playTone(600, 'sine', 0.06, 0.08);
  }

  // 볼 선택 및 흔들림 (딸깍)
  playBallShake() {
    this.playTone(320, 'triangle', 0.08, 0.12);
    setTimeout(() => this.playTone(480, 'triangle', 0.08, 0.1), 90);
  }

  // 볼 열림 팡!
  playBallOpen() {
    this.init();
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } catch(e) {}
  }

  // 포켓몬 획득 팡파레! (빰빰빰 빰~ 빰!)
  playCatchFanfare() {
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },    // C5
      { f: 659.25, d: 0.12, t: 0.14 }, // E5
      { f: 783.99, d: 0.12, t: 0.28 }, // G5
      { f: 1046.50, d: 0.35, t: 0.42 },// C6
      { f: 880.00, d: 0.15, t: 0.8 },  // A5
      { f: 1046.50, d: 0.5, t: 1.0 }   // C6
    ];
    notes.forEach(n => {
      this.playTone(n.f, 'square', n.d, 0.08, n.t);
    });
  }

  // 식사 타이머 시작음
  playTimerStart() {
    this.playTone(440, 'triangle', 0.1, 0.1, 0);
    this.playTone(554.37, 'triangle', 0.1, 0.1, 0.12);
    this.playTone(659.25, 'triangle', 0.25, 0.12, 0.24);
  }

  // 타이머 1초 째깍
  playTick() {
    this.playTone(800, 'sine', 0.02, 0.03);
  }

  // 식사 성공 완료음!
  playMealSuccess() {
    const melody = [
      { f: 440, d: 0.1, t: 0 },
      { f: 554, d: 0.1, t: 0.12 },
      { f: 659, d: 0.1, t: 0.24 },
      { f: 880, d: 0.3, t: 0.36 },
      { f: 659, d: 0.1, t: 0.7 },
      { f: 880, d: 0.45, t: 0.85 }
    ];
    melody.forEach(m => this.playTone(m.f, 'triangle', m.d, 0.1, m.t));
  }

  // 식사 실패 위로음
  playMealFail() {
    this.playTone(400, 'sine', 0.25, 0.09, 0);
    this.playTone(350, 'sine', 0.25, 0.09, 0.25);
    this.playTone(300, 'sine', 0.4, 0.09, 0.5);
  }

  // 합성 / 진화 신비로운 사운드
  playSynthesize() {
    const freqs = [330, 440, 550, 660, 880, 1100, 1320];
    freqs.forEach((f, idx) => {
      this.playTone(f, 'sine', 0.15, 0.08, idx * 0.08);
    });
    setTimeout(() => {
      this.playTone(1046.5, 'triangle', 0.5, 0.12, 0);
    }, 600);
  }

  // 포켓몬 탭 반응 (울음소리풍 전자음)
  playCry(id) {
    const baseFreq = 260 + ((id * 37) % 600);
    this.playTone(baseFreq, 'square', 0.08, 0.08, 0);
    this.playTone(baseFreq * 1.25, 'square', 0.1, 0.07, 0.06);
    this.playTone(baseFreq * 0.9, 'square', 0.12, 0.06, 0.14);
  }
}

const sounds = new SoundEngine();
