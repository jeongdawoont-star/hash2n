// 효과음: Web Audio로 직접 합성 (파일 없음)
let ctx = null, on = true;
export function setSound(v) { on = v; }
// 사용자가 한 번 누르기 전에는 소리를 내지 않는다 (브라우저 정책)
let unlocked = false;
addEventListener('pointerdown', () => { unlocked = true; }, { capture: true, once: true });
function ac() {
  if (!unlocked) return null;
  if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function tone(freq, t0, dur, { type = 'sine', vol = 0.18, slide = 0, attack = 0.005 } = {}) {
  const a = ac(); if (!a || !on) return;
  const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + t0;
  o.type = type; o.frequency.setValueAtTime(freq, t); if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
}
function bell(freq, t0, vol = 0.12) { tone(freq, t0, 0.9, { vol }); tone(freq * 2.76, t0, 0.5, { vol: vol * 0.35 }); tone(freq * 5.4, t0, 0.25, { vol: vol * 0.15 }); }

export const sfx = {
  tap() { tone(880, 0, 0.07, { type: 'triangle', vol: 0.12 }); },
  blip(i = 0) { tone(520 + ((i * 37) % 5) * 60, 0, 0.045, { type: 'square', vol: 0.035 }); },
  pop() { tone(300, 0, 0.12, { type: 'sine', vol: 0.25, slide: 2.6 }); },
  shake() { [0, 0.08, 0.16].forEach((t, i) => tone(200 + i * 30, t, 0.06, { type: 'triangle', vol: 0.12 })); },
  locked() { tone(330, 0, 0.12, { type: 'triangle', vol: 0.12 }); tone(262, 0.12, 0.18, { type: 'triangle', vol: 0.12 }); },
  open() { [523, 659, 784, 1047, 1319].forEach((f, i) => bell(f, i * 0.07, 0.1)); },
  jingle() { [659, 659, 659, 0, 659, 659, 659, 0, 659, 784, 523, 587, 659].forEach((f, i) => f && bell(f, i * 0.13, 0.08)); },
  send() { [392, 523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.3, { type: 'triangle', vol: 0.1 })); },
  sparkle() { for (let i = 0; i < 6; i++) tone(1400 + Math.random() * 1200, i * 0.05, 0.12, { vol: 0.05 }); },
};
