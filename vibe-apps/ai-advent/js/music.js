// 배경 캐롤: 저작권이 끝난 옛 캐롤을 Web Audio로 직접 연주 (파일 없음)
// 음표 표기: "E5-2" = 미(5옥타브) 8분음표 2개 길이, "R-2" = 쉼표
const SONGS = [
  { title: '징글 벨', speed: 300, voice: 'chip', jingle: true,
    mel: 'E5-2 E5-2 E5-4 E5-2 E5-2 E5-4 E5-2 G5-2 C5-3 D5-1 E5-8 F5-2 F5-2 F5-3 F5-1 F5-2 E5-2 E5-2 E5-1 E5-1 E5-2 D5-2 D5-2 E5-2 D5-4 G5-4 E5-2 E5-2 E5-4 E5-2 E5-2 E5-4 E5-2 G5-2 C5-3 D5-1 E5-8 F5-2 F5-2 F5-3 F5-1 F5-2 E5-2 E5-2 E5-1 E5-1 G5-2 G5-2 F5-2 D5-2 C5-8',
    bass: 'C3-8 C3-8 C3-8 C3-8 F2-8 C3-8 D3-8 G2-8 C3-8 C3-8 C3-8 C3-8 F2-8 C3-8 G2-8 C3-8' },
  { title: '위 위시 유 어 메리 크리스마스', speed: 330, voice: 'box',
    mel: 'D5-2 G5-2 G5-1 A5-1 G5-1 F#5-1 E5-2 C5-2 E5-2 A5-2 A5-1 B5-1 A5-1 G5-1 F#5-2 D5-2 F#5-2 B5-2 B5-1 C6-1 B5-1 A5-1 G5-2 E5-2 D5-1 D5-1 E5-2 A5-2 F#5-2 G5-6',
    bass: 'R-2 G2-6 C3-6 A2-6 D3-6 B2-6 E3-6 C3-3 D3-3 G2-6' },
  { title: '고요한 밤 거룩한 밤', speed: 190, voice: 'bell',
    mel: 'G4-3 A4-1 G4-2 E4-6 G4-3 A4-1 G4-2 E4-6 D5-4 D5-2 B4-6 C5-4 C5-2 G4-6 A4-4 A4-2 C5-3 B4-1 A4-2 G4-3 A4-1 G4-2 E4-6 A4-4 A4-2 C5-3 B4-1 A4-2 G4-3 A4-1 G4-2 E4-6 D5-4 D5-2 F5-3 D5-1 B4-2 C5-6 E5-6 C5-3 G4-1 E4-2 G4-3 F4-1 D4-2 C4-12',
    bass: 'C3-6 C3-6 C3-6 C3-6 G2-6 G2-6 C3-6 C3-6 F2-6 F2-6 C3-6 C3-6 F2-6 F2-6 C3-6 C3-6 G2-6 G2-6 C3-6 C3-6 C3-6 G2-6 C3-12' },
  { title: '덱 더 홀스', speed: 300, voice: 'chip', jingle: true,
    mel: 'G5-3 F5-1 E5-2 D5-2 C5-2 D5-2 E5-2 C5-2 D5-1 E5-1 F5-1 D5-1 E5-3 D5-1 C5-2 B4-2 C5-4 G5-3 F5-1 E5-2 D5-2 C5-2 D5-2 E5-2 C5-2 D5-1 E5-1 F5-1 D5-1 E5-3 D5-1 C5-2 B4-2 C5-4 D5-3 E5-1 F5-2 D5-2 E5-3 F5-1 G5-2 D5-2 E5-1 F#5-1 G5-2 A5-1 B5-1 C6-2 B5-2 A5-2 G5-4 G5-3 F5-1 E5-2 D5-2 C5-2 D5-2 E5-2 C5-2 A5-1 A5-1 A5-1 A5-1 G5-3 F5-1 E5-2 D5-2 C5-4',
    bass: 'C3-8 C3-8 G2-8 C3-4 G2-2 C3-2 C3-8 C3-8 G2-8 C3-4 G2-2 C3-2 G2-8 C3-8 D3-8 G2-8 C3-8 C3-8 F2-8 G2-4 C3-4' },
  { title: '기쁘다 구주 오셨네', speed: 280, voice: 'box',
    mel: 'C6-4 B5-3 A5-1 G5-6 F5-2 E5-4 D5-4 C5-6 G5-2 A5-6 A5-2 B5-6 B5-2 C6-6 C6-2 C6-2 B5-2 A5-2 G5-2 G5-3 F5-1 E5-2 C6-2 C6-2 B5-2 A5-2 G5-2 G5-3 F5-1 E5-2 E5-2 E5-2 E5-2 E5-2 E5-1 F5-1 G5-6 F5-1 E5-1 D5-2 D5-2 D5-2 D5-1 E5-1 F5-6 E5-1 D5-1 C5-2 C6-4 A5-2 G5-3 F5-1 E5-2 F5-2 E5-4 D5-4 C5-8',
    bass: 'C3-8 C3-8 F2-4 G2-4 C3-8 F2-8 G2-8 C3-8 C3-8 C3-8 C3-8 C3-8 C3-8 C3-8 G2-8 G2-8 F2-4 C3-4 F2-4 G2-4 G2-8 C3-8' },
  { title: '참 반가운 신도여', speed: 250, voice: 'bell',
    mel: 'G4-2 G4-4 D4-2 G4-2 A4-4 D4-4 B4-2 A4-2 B4-2 C5-2 B4-4 A4-2 G4-2 G4-4 F#4-2 E4-2 F#4-2 G4-2 A4-2 B4-2 F#4-4 E4-3 D4-1 D4-8',
    bass: 'R-2 G2-8 D3-8 G2-8 D3-8 C3-8 D3-8 D3-4 A2-4 D3-8' },
];

let ac = null, master = null, on = true, playing = false, timer = null, order = [], idx = -1, nowTitle = '';
const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function freq(n) { const m = n.match(/^([A-G])(#|b)?(\d)$/); if (!m) return 0; const s = NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); return 440 * Math.pow(2, (s + (+m[3] + 1) * 12 - 69) / 12); }
function parse(str) { return str.trim().split(/\s+/).map(t => { const [n, d] = t.split('-'); return [n === 'R' ? 0 : freq(n), +d]; }); }

function ctx() {
  if (!ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ac = new C(); master = ac.createGain(); master.gain.value = 0.0; master.connect(ac.destination); }
  if (ac.state === 'suspended') ac.resume(); return ac;
}
function note(f, t, dur, voice, vol) {
  if (!f) return;
  const o = ac.createOscillator(), g = ac.createGain();
  let decay = dur;
  if (voice === 'chip') { o.type = 'square'; vol *= 0.45; decay = dur * 0.9; }
  else if (voice === 'bell') { o.type = 'sine'; decay = Math.max(dur, 0.9); const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.frequency.value = f * 3.01; g2.gain.setValueAtTime(vol * 0.18, t); g2.gain.exponentialRampToValueAtTime(0.0005, t + 0.4); o2.connect(g2).connect(master); o2.start(t); o2.stop(t + 0.45); }
  else if (voice === 'bass') { o.type = 'triangle'; decay = dur * 0.95; }
  else { o.type = 'triangle'; decay = Math.max(dur, 0.7); const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.type = 'sine'; o2.frequency.value = f * 2; g2.gain.setValueAtTime(vol * 0.3, t); g2.gain.exponentialRampToValueAtTime(0.0005, t + 0.5); o2.connect(g2).connect(master); o2.start(t); o2.stop(t + 0.55); }
  o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0005, t + decay);
  o.connect(g).connect(master); o.start(t); o.stop(t + decay + 0.05);
}
function shaker(t) {
  const len = 0.05, b = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = b; f.type = 'highpass'; f.frequency.value = 6000; g.gain.value = 0.18;
  s.connect(f).connect(g).connect(master); s.start(t);
}

// 곡 하나 예약하기 (정해진 시간에 소리 나도록 미리 넣어 둠)
function schedule(song, start) {
  const e = 60 / song.speed; let t = start;
  for (const [f, d] of parse(song.mel)) { note(f, t, d * e, song.voice, 0.16); t += d * e; }
  let tb = start; for (const [f, d] of parse(song.bass)) { note(f, tb, d * e, 'bass', 0.1); tb += d * e; }
  if (song.jingle) for (let x = start; x < t; x += e * 2) shaker(x + e);
  return Math.max(t, tb);
}
function nextSong() {
  if (!playing) return;
  if (!order.length) { order = SONGS.map((_, i) => i).sort(() => Math.random() - 0.5); if (order[0] === idx) order.push(order.shift()); }
  idx = order.shift(); const song = SONGS[idx]; nowTitle = song.title;
  const start = ac.currentTime + 0.15, end = schedule(song, start);
  onChange && onChange(nowTitle);
  timer = setTimeout(nextSong, (end - ac.currentTime + 2.0) * 1000);
}
let onChange = null;
export function onSong(fn) { onChange = fn; }
export function setMusic(v) { on = v; if (!v) stop(); }
export function musicOn() { return on; }
export function startMusic() {
  if (!on || playing) return; if (!ctx()) return;
  playing = true; master.gain.cancelScheduledValues(ac.currentTime); master.gain.setValueAtTime(0, ac.currentTime); master.gain.linearRampToValueAtTime(0.55, ac.currentTime + 1.5);
  nextSong();
}
export function stop() {
  playing = false; clearTimeout(timer);
  if (ac && master) { master.gain.cancelScheduledValues(ac.currentTime); master.gain.setValueAtTime(master.gain.value, ac.currentTime); master.gain.linearRampToValueAtTime(0, ac.currentTime + 0.3);
    // 예약된 음은 새 출력으로 바꿔서 끊는다
    const old = master; setTimeout(() => { try { old.disconnect(); } catch (e) {} }, 400); master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination); }
}
export function skip() { if (!playing) return; stop(); setTimeout(startMusic, 450); }
export function title() { return nowTitle; }
export const SONG_COUNT = SONGS.length;
