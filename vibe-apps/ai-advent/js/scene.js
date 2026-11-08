// 위 화면 3D: 눈 내리는 마을(모은 아이템이 트리 밑에 쌓임) + 상자 여는 방
import { THREE, M, put, SPH, HEMI, CYL, CONE, TOR, CAP, RB, STAR, OCT, RES, THICK, tmat, fit, patternTex } from './kit.js';
import { build } from './models.js';

const PI = Math.PI;
let renderer, canvas, clock, cb = {};
let mode = 'village', crisp = false;
const W3 = 400, H3 = 240;
const tweens = [];
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();

// ---------- 작은 애니메이션 도구 ----------
const ease = { out: k => 1 - Math.pow(1 - k, 3), inOut: k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2, back: k => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); } };
function tween(dur, fn, delay = 0) { return new Promise(res => tweens.push({ t: -delay, dur, fn, res })); }
function runTweens(dt) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const w = tweens[i]; w.t += dt; if (w.t < 0) continue;
    const k = Math.min(1, w.t / w.dur); w.fn(k); if (k >= 1) { tweens.splice(i, 1); w.res(); }
  }
}
const wait = s => tween(s, () => {});

// ---------- 공통: 눈, 반짝이 ----------
function dotTex() {
  const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d');
  const g = x.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 32, 32); const t = new THREE.CanvasTexture(c); return t;
}
const DOT = dotTex();
function makeSnow(n, area) {
  const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3), sp = new Float32Array(n);
  for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - 0.5) * area.x; p[i * 3 + 1] = Math.random() * area.y; p[i * 3 + 2] = area.z0 + Math.random() * area.z; sp[i] = 0.3 + Math.random() * 0.5; }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const m = new THREE.PointsMaterial({ size: 0.07, map: DOT, transparent: true, depthWrite: false, color: '#ffffff' });
  const pts = new THREE.Points(g, m); pts.userData = { sp, area };
  pts.frustumCulled = false; return pts;
}
function stepSnow(pts, dt, t) {
  const a = pts.geometry.attributes.position, { sp, area } = pts.userData;
  for (let i = 0; i < sp.length; i++) {
    let y = a.getY(i) - sp[i] * dt; let x = a.getX(i) + Math.sin(t * 0.8 + i) * 0.003;
    if (y < 0) y += area.y; a.setXY(i, x, y);
  }
  a.needsUpdate = true;
}
class Sparkles {
  constructor(scene, n = 60) {
    this.n = n; this.g = new THREE.BufferGeometry(); this.p = new Float32Array(n * 3); this.v = new Float32Array(n * 3); this.life = new Float32Array(n); this.col = new Float32Array(n * 3);
    this.g.setAttribute('position', new THREE.BufferAttribute(this.p, 3)); this.g.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    this.m = new THREE.PointsMaterial({ size: 0.12, map: DOT, transparent: true, depthWrite: false, vertexColors: true, blending: THREE.AdditiveBlending });
    this.pts = new THREE.Points(this.g, this.m); this.pts.frustumCulled = false; scene.add(this.pts); this.life.fill(0); this.p.fill(-99);
  }
  burst(x, y, z, k = 1, spread = 2.2) {
    const cols = ['#ffd166', '#ffffff', '#ff8fab', '#7bdff2', '#b9fbc0'].map(c => new THREE.Color(c));
    for (let i = 0; i < this.n; i++) {
      this.p.set([x, y, z], i * 3); const a = Math.random() * PI * 2, e = Math.random() * PI - PI / 2, s = (0.6 + Math.random()) * spread * k;
      this.v.set([Math.cos(a) * Math.cos(e) * s, Math.abs(Math.sin(e)) * s + 0.8, Math.sin(a) * Math.cos(e) * s], i * 3);
      const c = cols[i % cols.length]; this.col.set([c.r, c.g, c.b], i * 3); this.life[i] = 0.8 + Math.random() * 0.8;
    }
  }
  step(dt) {
    let any = false;
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) { this.p[i * 3 + 1] = -99; continue; } any = true;
      this.life[i] -= dt; this.v[i * 3 + 1] -= 2.2 * dt;
      for (let j = 0; j < 3; j++) { this.v[i * 3 + j] *= 0.97; this.p[i * 3 + j] += this.v[i * 3 + j] * dt; }
    }
    if (any || this._any) { this.g.attributes.position.needsUpdate = true; this.g.attributes.color.needsUpdate = true; } this._any = any;
  }
}

// ---------- 요정 "방울이" ----------
function makeFairy() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  put(body, M(SPH(0.22), '#fffaf2'), 0, 0, 0, 0, 0, 0, [1, 0.95, 0.95]);
  put(body, M(SPH(0.035), '#3b2f2f', { ol: false }), -0.075, 0.03, 0.2); put(body, M(SPH(0.035), '#3b2f2f', { ol: false }), 0.075, 0.03, 0.2);
  put(body, M(SPH(0.012), '#ffffff', { ol: false }), -0.065, 0.045, 0.232); put(body, M(SPH(0.012), '#ffffff', { ol: false }), 0.085, 0.045, 0.232);
  [-1, 1].forEach(s => put(body, M(SPH(0.04), '#ff9fb5', { ol: false }), s * 0.13, -0.03, 0.17, 0, 0, 0, [1, 0.6, 0.3]));
  put(body, M(TOR(0.025, 0.008, PI), '#3b2f2f', { ol: false }), 0, -0.03, 0.215, 0, 0, PI);
  const hat = new THREE.Group(); put(body, hat, 0, 0.14, 0, -0.15, 0, 0.18);
  put(hat, M(CONE(0.2, 0.36, 18), '#e63946'), 0, 0.17, 0); put(hat, M(TOR(0.19, 0.05), '#ffffff'), 0, 0.0, 0, PI / 2); put(hat, M(SPH(0.06), '#ffffff'), 0, 0.37, 0);
  put(hat, M(SPH(0.035), '#f2c14e', { e: '#f2c14e', ei: 0.4 }), 0.12, 0.05, 0.12);
  const wings = []; [-1, 1].forEach(s => { const w = new THREE.Group(); put(w, M(SPH(0.16), '#c8f1ff', { op: 0.65 }), s * 0.12, 0.08, 0, 0, 0, s * 0.5, [0.55, 1, 0.12]); put(body, w, s * 0.1, 0.02, -0.15); wings.push(w); });
  [-1, 1].forEach(s => put(body, M(CAP(0.035, 0.07), '#fffaf2'), s * 0.21, -0.08, 0.04, 0, 0, s * 0.6));
  const wand = new THREE.Group(); put(wand, M(CYL(0.012, 0.012, 0.22), '#c98b55'), 0, 0.1, 0); put(wand, M(STAR(5, 0.07, 0.03, 0.03), '#ffd166', { e: '#ffd166', ei: 0.5 }), 0, 0.23, 0);
  put(body, wand, 0.25, -0.1, 0.06, 0, 0, -0.3);
  put(g, M(CYL(0.12, 0.12, 0.01, 20), '#5b6b9a', { op: 0.18, ol: false }), 0, -0.9, 0);
  g.userData = { body, wings, wand, hop: 0 };
  return g;
}
function animFairy(f, t) {
  const u = f.userData; u.body.position.y = Math.sin(t * 2.2) * 0.06 + u.hop; u.body.rotation.z = Math.sin(t * 1.3) * 0.08;
  u.wings.forEach((w, i) => { w.rotation.y = (i ? -1 : 1) * (0.3 + Math.sin(t * 16) * 0.35); });
  u.wand.rotation.z = -0.3 + Math.sin(t * 3) * 0.15;
}
function fairyHop(f) { tween(0.45, k => { f.userData.hop = Math.sin(k * PI) * 0.18; }); }

// ---------- 선물 상자 ----------
const WRAPS = [['#e63946', '#ffd166', 'stripe'], ['#2d6a4f', '#e63946', 'dots'], ['#4cc9f0', '#ffffff', 'stars'], ['#ff8fab', '#ffffff', 'dots'], ['#9b5de5', '#ffd166', 'stripe'], ['#f2c14e', '#e63946', 'check'], ['#ffffff', '#4cc9f0', 'stars'], ['#e76f51', '#2d6a4f', 'check']];
function numTex(n) {
  const c = document.createElement('canvas'); c.width = 64; c.height = 64; const x = c.getContext('2d');
  x.fillStyle = '#fff8e7'; x.beginPath(); x.arc(32, 32, 30, 0, 7); x.fill(); x.lineWidth = 4; x.strokeStyle = '#4b342d'; x.stroke();
  x.fillStyle = '#4b342d'; x.font = 'bold 34px "Jua", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), 32, 35);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function giftBox(day, scale = 1) {
  const [a, b, pat] = day === 25 ? ['#f2c14e', '#e63946', 'stars'] : WRAPS[(day * 5) % WRAPS.length];
  const g = new THREE.Group(), sz = day === 25 ? 1.1 : 1;
  const map = patternTex(pat, a, pat === 'stripe' ? shade(a) : b, 2);
  const base = put(g, M(RB(0.9 * sz, 0.72 * sz, 0.9 * sz, 0.16), a, { map }), 0, 0.36 * sz, 0);
  const ribbons = new THREE.Group(); g.add(ribbons);
  put(ribbons, M(RB(0.17, 0.76 * sz, 0.94 * sz, 0.2), b), 0, 0.38 * sz, 0); put(ribbons, M(RB(0.94 * sz, 0.76 * sz, 0.17, 0.2), b), 0, 0.38 * sz, 0);
  const lid = new THREE.Group(); put(g, lid, 0, 0.72 * sz, 0);
  put(lid, M(RB(0.98 * sz, 0.18 * sz, 0.98 * sz, 0.16), a, { map }), 0, 0.08 * sz, 0);
  put(lid, M(RB(0.18, 0.2 * sz, 1.0 * sz, 0.2), b), 0, 0.08 * sz, 0); put(lid, M(RB(1.0 * sz, 0.2 * sz, 0.18, 0.2), b), 0, 0.08 * sz, 0);
  const bow = new THREE.Group(); put(lid, bow, 0, 0.18 * sz, 0);
  [-1, 1].forEach(s => { put(bow, M(TOR(0.13, 0.055), b), s * 0.14, 0.1, 0, 0, s * 0.35, s * 0.25, [1, 1, 1.6]); put(bow, M(CAP(0.05, 0.16), b), s * 0.12, -0.02, 0.12, 0.9, 0, s * 0.8); });
  put(bow, M(SPH(0.075), b), 0, 0.06, 0);
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: numTex(day), transparent: true }));
  tag.position.set(0.24 * sz, 0.4 * sz, 0.455 * sz + 0.003); base.parent.add(tag);
  g.userData = { base, ribbons, lid, bow, tag, sz };
  g.scale.setScalar(scale); return g;
}
function shade(hex) { const c = new THREE.Color(hex); c.offsetHSL(0, 0, -0.08); return '#' + c.getHexString(); }

// ---------- 마을 ----------
const V = {};
function buildVillage() {
  const s = new THREE.Scene(); V.scene = s;
  V.sky = new THREE.Color('#a9c6f0'); s.background = V.sky; s.fog = new THREE.Fog('#a9c6f0', 9, 20);
  V.hemi = new THREE.HemisphereLight('#ffffff', '#b8c7e0', 1.5); s.add(V.hemi);
  V.sun = new THREE.DirectionalLight('#fff4e0', 2.2); V.sun.position.set(3, 6, 4); s.add(V.sun);
  V.cam = new THREE.PerspectiveCamera(30, W3 / H3, 0.1, 60); V.cam.position.set(0, 2.5, 7.2); V.cam.lookAt(0, 0.85, 0);
  // 땅
  put(s, M(CYL(10, 10, 0.4, 48), '#f4f8ff'), 0, -0.2, 0);
  [[-3.5, -3, 2.5], [3.8, -3.6, 2.2], [0, -6, 4], [-6, -5, 3], [6, -5, 3.4]].forEach(([x, z, r]) => put(s, M(SPH(r, 24, 12), '#eaf2ff'), x, -r * 0.55, z, 0, 0, 0, [1, 0.6, 1]));
  [[-1.6, -0.25], [-1.25, 0.25], [-0.75, 0.6]].forEach(([x, z], i) => put(s, M(CYL(0.2, 0.22, 0.05, 10), '#c9c3d6'), x, 0.02, z, 0, i, 0, [1, 1, 0.8]));
  // 멀리 나무
  [[-4.2, -2.8], [-3.2, -4.2], [3.4, -2.6], [4.4, -3.8], [-5.5, -1.4], [5.6, -1.2], [1.8, -4.6], [-1.8, -5.2]].forEach(([x, z], i) => { const t = pine(0.9 + (i % 3) * 0.25); put(s, t, x, 0, z); });
  // 오두막
  const house = new THREE.Group(); put(s, house, -2.25, 0, -1.0, 0, 0.4, 0);
  put(house, M(RB(1.5, 1.1, 1.2, 0.08), '#e9b872'), 0, 0.55, 0);
  put(house, M(CYL(1.0, 1.0, 1.4, 3), '#b5523b'), 0, 1.35, 0, PI / 2, 0, PI / 2, [1, 1, 0.62]);
  put(house, M(CYL(1.02, 1.02, 1.42, 3), '#ffffff'), 0, 1.42, 0, PI / 2, 0, PI / 2, [0.55, 1, 0.5]);
  put(house, M(RB(0.36, 0.62, 0.06, 0.2), '#8d5524'), 0.25, 0.32, 0.6); put(house, M(SPH(0.03), '#f2c14e', { ol: false }), 0.37, 0.32, 0.64);
  V.win = put(house, M(RB(0.34, 0.32, 0.05, 0.2), '#ffe8a3', { e: '#ffd166', ei: 0.4 }), -0.35, 0.6, 0.6);
  put(house, M(RB(0.06, 0.34, 0.06), '#8d5524'), -0.35, 0.6, 0.63); put(house, M(RB(0.36, 0.05, 0.06), '#8d5524'), -0.35, 0.6, 0.63);
  put(house, M(RB(0.24, 0.5, 0.24, 0.15), '#9a8c98'), 0.45, 1.75, -0.2); put(house, M(RB(0.3, 0.1, 0.3, 0.3), '#ffffff'), 0.45, 2.0, -0.2);
  put(house, M(RB(0.9, 0.12, 0.24, 0.5), '#ffffff'), -0.1, 0.06, 0.8, 0, 0, 0, 1);
  // 큰 트리
  const tree = new THREE.Group(); V.tree = tree; put(s, tree, 0.45, 0, -0.75);
  put(tree, M(CYL(0.16, 0.2, 0.4), '#8d5524'), 0, 0.2, 0);
  [[1.05, 0.9, 0.75], [0.82, 0.8, 1.3], [0.58, 0.7, 1.8]].forEach(([r, h, y]) => { put(tree, M(CONE(r, h, 12), '#2d6a4f'), 0, y, 0); put(tree, M(CONE(r * 0.82, h * 0.25, 12), '#ffffff'), 0, y + h * 0.36, 0); });
  V.topStar = put(tree, M(STAR(5, 0.2, 0.09, 0.08), '#ffd166', { e: '#ffd166', ei: 0.6 }), 0, 2.28, 0);
  V.lights = [];
  const LC = ['#ff595e', '#ffd166', '#7bdff2', '#b9fbc0', '#ff8fab'];
  for (let i = 0; i < 26; i++) { const k = i / 26, y = 0.45 + k * 1.65, r = 1.0 * (1 - k * 0.72), a = i * 2.4;
    const m = put(tree, M(SPH(0.05, 10, 8), LC[i % 5], { e: LC[i % 5], ei: 0.8, ol: false }), Math.cos(a) * r, y, Math.sin(a) * r); m.material = m.material.clone(); V.lights.push(m); }
  // 우체통
  const mail = new THREE.Group(); V.mail = mail; put(s, mail, 2.45, 0, -0.55, 0, -0.5, 0);
  put(mail, M(CYL(0.05, 0.05, 0.7), '#8d5524'), 0, 0.35, 0); put(mail, M(RB(0.42, 0.34, 0.5, 0.4), '#e63946'), 0, 0.82, 0);
  put(mail, M(RB(0.24, 0.04, 0.03), '#3b2f2f', { ol: false }), 0, 0.88, 0.25); put(mail, M(RB(0.04, 0.24, 0.14), '#ffd166'), 0.22, 0.95, -0.1);
  put(mail, M(RB(0.46, 0.08, 0.54, 0.5), '#ffffff'), 0, 1.0, 0);
  // 가로등
  const lamp = new THREE.Group(); put(s, lamp, 3.1, 0, -1.6);
  put(lamp, M(CYL(0.04, 0.05, 1.4), '#3d405b'), 0, 0.7, 0); V.lampBulb = put(lamp, M(SPH(0.13), '#fff3b0', { e: '#ffd166', ei: 0.5, ol: false }), 0, 1.5, 0);
  put(lamp, M(CONE(0.2, 0.16, 6), '#3d405b'), 0, 1.66, 0); put(lamp, M(RB(0.28, 0.06, 0.28, 0.5), '#ffffff'), 0, 1.75, 0);
  // 눈사람
  const sm = build('snowman', ['#4cc9f0', '#3d405b']); put(s, fit(sm, 0.75), 1.9, 0, -1.6, 0, -0.4, 0);
  // 요정
  V.fairy = makeFairy(); put(s, V.fairy, 1.35, 1.25, 1.2, 0, -0.35, 0); V.fairy.scale.setScalar(1.15);
  V.snow = makeSnow(500, { x: 12, y: 6, z0: -5, z: 9 }); s.add(V.snow);
  V.items = new THREE.Group(); s.add(V.items); V.ready = new THREE.Group(); s.add(V.ready);
  V.spark = new Sparkles(s, 80);
}
function pine(h) {
  const t = new THREE.Group(); put(t, M(CYL(0.08, 0.1, 0.3), '#8d5524'), 0, 0.15, 0);
  [[0.55, 0.7, 0.55], [0.42, 0.6, 0.95], [0.28, 0.5, 1.3]].forEach(([r, hh, y]) => { put(t, M(CONE(r, hh, 8), '#40916c'), 0, y, 0); put(t, M(CONE(r * 0.8, hh * 0.3, 8), '#ffffff'), 0, y + hh * 0.3, 0); });
  t.scale.setScalar(h); return t;
}
// 트리 밑 자리 (앞쪽 반원, 두 줄)
// 트리 앞 눈밭에 세 줄로 (1일이 뒷줄 왼쪽)
function slot(i) {
  const row = Math.floor(i / 8), j = i % 8;
  return [-2.2 + j * 0.62 + (row % 2) * 0.18, 0.4 + row * 0.58];
}
export function setCollection(list) {
  V.items.clear();
  list.forEach((it, i) => {
    const big = it.final; const m = fit(build(it.kind, it.colors), big ? 0.8 : 0.46);
    const [x, z] = big ? [0.45, -0.05] : slot(it.day - 1);
    m.position.set(x, 0, z); m.rotation.y = Math.atan2(-x, V.cam.position.z - z) + (i % 2 ? 0.25 : -0.25);
    m.userData.ref = it.ref; m.userData.day = it.day; m.userData.phase = i * 0.7; V.items.add(m);
  });
}
export function setReady(n) {
  V.ready.clear();
  for (let i = 0; i < Math.min(n, 5); i++) { const b = giftBox(3 + i * 4, 0.3); b.position.set(-0.75 + i * 0.07 * (i % 2 ? 1 : -1), i < 3 ? 0 : 0.24, -0.25 + i * 0.22); if (i >= 3) b.position.set(-0.7 + (i - 3) * 0.28, 0.24, -0.05); b.rotation.y = i * 0.7; b.userData.phase = i; V.ready.add(b); }
}
function isNight() { const h = new Date().getHours(); return h >= 17 || h < 7; }
function applyTime() {
  const n = isNight();
  V.sky.set(n ? '#33427a' : '#a9c6f0'); V.scene.fog.color.set(n ? '#33427a' : '#a9c6f0');
  V.hemi.intensity = n ? 0.9 : 1.5; V.hemi.color.set(n ? '#c7d2ff' : '#ffffff'); V.sun.intensity = n ? 1.0 : 2.2; V.sun.color.set(n ? '#b9c8ff' : '#fff4e0');
  V.win.material.emissiveIntensity = n ? 1.1 : 0.35; V.lampBulb.material.emissiveIntensity = n ? 1.3 : 0.3;
}

// ---------- 상자 방 ----------
const S = {};
function buildStage() {
  const s = new THREE.Scene(); S.scene = s; s.background = new THREE.Color('#f3d2b3');
  s.add(new THREE.HemisphereLight('#fff6ea', '#c99a7a', 1.5)); const d = new THREE.DirectionalLight('#fff1dc', 2.3); d.position.set(2.5, 5, 4); s.add(d);
  S.cam = new THREE.PerspectiveCamera(30, W3 / H3, 0.1, 40); S.cam.position.set(0, 1.35, 3.4); S.cam.lookAt(0, 0.62, 0);
  // 벽·창문·바닥
  put(s, M(RB(14, 6, 0.2, 0.05), '#f7d9bc', { map: patternTex('stripe', '#f7d9bc', '#f2ceaa', 10), ol: false }), 0, 2, -2.6);
  const win = new THREE.Group(); put(s, win, -1.6, 1.55, -2.45);
  put(win, M(RB(1.3, 1.1, 0.12, 0.15), '#ffffff'), 0, 0, 0); S.winGlass = put(win, M(RB(1.1, 0.9, 0.13, 0.1), '#5d7bd5', { e: '#3a4f9a', ei: 0.4, ol: false }), 0, 0, 0.01);
  put(win, M(RB(0.06, 0.92, 0.15), '#ffffff'), 0, 0, 0.02); put(win, M(RB(1.12, 0.06, 0.15), '#ffffff'), 0, 0, 0.02);
  put(win, M(RB(1.4, 0.1, 0.3, 0.4), '#ffffff'), 0, -0.6, 0.12);
  const wr = build('wreath', ['#40916c', '#e63946']); put(s, fit(wr, 0.55), 1.55, 1.35, -2.45);
  const t = pine(1.25); put(s, t, 2.2, -0.6, -1.8);
  for (let i = 0; i < 7; i++) { const a = i * 0.9; put(t, M(SPH(0.05, 8, 6), ['#ff595e', '#ffd166', '#7bdff2'][i % 3], { e: ['#ff595e', '#ffd166', '#7bdff2'][i % 3], ei: 0.9, ol: false }), Math.cos(a) * 0.4 * (1 - i / 9), 0.6 + i * 0.12, Math.sin(a) * 0.4 * (1 - i / 9) + 0.15); }
  put(s, M(CYL(9, 9, 0.2, 32), '#b5835a', { map: patternTex('band', '#b5835a', '#a87650', 12), ol: false }), 0, -0.7, 0);
  // 둥근 탁자
  put(s, M(CYL(1.25, 1.25, 0.14, 40), '#c98b55'), 0, -0.07, 0); put(s, M(CYL(1.27, 1.2, 0.04, 40), '#e8c9a0', { ol: false }), 0, -0.155, 0);
  put(s, M(CYL(0.12, 0.2, 0.6), '#a0673c'), 0, -0.45, 0);
  put(s, M(CYL(1.0, 1.0, 0.012, 40), '#e63946', { map: patternTex('check', '#e63946', '#ffffff', 6), ol: false }), 0, 0.005, 0);
  S.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: '#fff3b0', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  S.glow.scale.set(2.2, 2.2, 1); S.glow.position.set(0, 0.95, -0.3); s.add(S.glow);
  S.holder = new THREE.Group(); s.add(S.holder);
  S.spark = new Sparkles(s, 90);
  S.yaw = 0; S.pitch = 0; S.tYaw = 0; S.tPitch = 0; S.vel = 0;
}
export function showBox(day) {
  S.holder.clear(); S.item = null; S.day = day; S.state = 'box';
  S.box = giftBox(day); S.holder.add(S.box); S.box.position.y = 0;
  S.yaw = S.tYaw = -0.25; S.pitch = S.tPitch = 0; S.glow.material.opacity = 0;
  // 등장
  S.box.scale.setScalar(0.01); tween(0.45, k => S.box.scale.setScalar(Math.max(0.01, ease.back(k))));
}
export function showItem(item) {
  S.holder.clear(); S.box = null; S.state = 'item';
  S.item = fit(build(item.kind, item.colors), item.final ? 1.1 : 0.95); S.holder.add(S.item); S.item.position.y = 0.15;
  S.yaw = S.tYaw = 0; S.pitch = S.tPitch = 0; S.vel = 0.6; S.glow.material.opacity = 0.55;
  S.item.scale.multiplyScalar(0.01); const target = S.item.scale.x * 100;
  tween(0.5, k => S.item.scale.setScalar(Math.max(0.001, ease.back(k) * target)));
}
export async function openBox(item) {
  if (S.state !== 'box') return; S.state = 'opening';
  const b = S.box, u = b.userData;
  cb.sfx?.('shake');
  await tween(0.55, k => { b.rotation.z = Math.sin(k * PI * 6) * 0.12 * (1 - k); b.position.y = Math.abs(Math.sin(k * PI * 3)) * 0.06; });
  cb.sfx?.('pop');
  tween(0.4, k => { u.bow.position.y = 0.18 * u.sz + ease.out(k) * 0.9; u.bow.scale.setScalar(Math.max(0.001, 1 - k)); u.bow.rotation.y = k * 4; });
  tween(0.35, k => { u.ribbons.scale.set(1, Math.max(0.001, 1 - k), 1); u.tag.material.opacity = 1 - k; }, 0.1);
  await tween(0.55, k => { const e = ease.out(k); u.lid.position.set(-e * 0.9, 0.72 * u.sz + Math.sin(k * PI) * 0.8 + e * 0.1, -e * 0.5); u.lid.rotation.set(-e * 1.2, 0, e * 1.6); }, 0.15);
  // 아이템 등장
  cb.sfx?.('open');
  const it = fit(build(item.kind, item.colors), item.final ? 1.1 : 0.95); S.holder.add(it); S.item = it;
  const target = it.scale.x; it.scale.setScalar(0.001); it.position.y = 0.4;
  S.spark.burst(0, 0.9, 0, 1);
  tween(0.6, k => { const e = ease.back(k); it.scale.setScalar(Math.max(0.001, e * target)); it.position.y = 0.35 + ease.out(k) * 0.3; S.glow.material.opacity = k * 0.6; });
  tween(0.6, k => { b.position.y = -ease.inOut(k) * 1.3; u.lid.position.y -= 0.02; b.scale.setScalar(Math.max(0.001, 1 - k * 0.6)); }, 0.2);
  await wait(0.7);
  S.holder.remove(b); S.box = null;
  await tween(0.4, k => { it.position.y = 0.65 - ease.inOut(k) * 0.5; });
  S.state = 'item'; S.vel = 1.2; S.tYaw = S.yaw;
}
export function celebrate(where = 'stage') { const sp = where === 'stage' ? S.spark : V.spark; if (where === 'stage') sp.burst(0, 1.0, 0, 1.3); else sp.burst(V.fairy.position.x, V.fairy.position.y, V.fairy.position.z, 0.8); }

// 편지 보내기 연출: 요정 → 우체통 → 하늘
export async function sendLetter() {
  const env = fit(build('letter', ['#fff3dc', '#f6e7c1']), 0.32); V.scene.add(env);
  const f = V.fairy.position.clone(), m = new THREE.Vector3(V.mail.position.x, 0.95, V.mail.position.z);
  fairyHop(V.fairy);
  await tween(0.9, k => { const e = ease.inOut(k); env.position.lerpVectors(f, m, e); env.position.y += Math.sin(k * PI) * 0.6; env.rotation.y = k * 6; });
  V.scene.remove(env); cb.sfx?.('pop');
  V.spark.burst(m.x, m.y + 0.2, m.z, 0.5);
  const orb = put(V.scene, M(STAR(5, 0.08, 0.035, 0.03), '#ffd166', { e: '#ffd166', ei: 1, ol: false }), m.x, m.y, m.z);
  await tween(1.2, k => { orb.position.set(m.x - k * 2, m.y + ease.inOut(k) * 4, m.z - k * 5); orb.rotation.z = k * 10; });
  V.scene.remove(orb); V.spark.burst(V.fairy.position.x, V.fairy.position.y + 0.3, V.fairy.position.z, 0.6);
}
export function fairyBounce() { fairyHop(V.fairy); }

// ---------- 입력 ----------
let down = null;
function onDown(e) { down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0, lx: e.clientX, ly: e.clientY }; canvas.setPointerCapture?.(e.pointerId); }
function onMove(e) {
  if (!down) return; const dx = e.clientX - down.lx, dy = e.clientY - down.ly; down.lx = e.clientX; down.ly = e.clientY; down.moved += Math.abs(dx) + Math.abs(dy);
  if (mode !== 'stage') return; const k = 3.2 / canvas.clientWidth;
  if (S.state === 'box') { S.tYaw = clamp(S.tYaw + dx * k, -0.44, 0.44); S.tPitch = clamp(S.tPitch + dy * k, -0.17, 0.17); }
  else if (S.state === 'item') { S.tYaw += dx * k * 1.4; S.vel = dx * k * 40; S.tPitch = clamp(S.tPitch + dy * k, -0.35, 0.35); }
}
function onUp(e) {
  if (!down) return; const tap = down.moved < 10 && performance.now() - down.t < 500; down = null;
  if (mode === 'stage') { if (S.state === 'box') { S.tYaw = -0.25; S.tPitch = 0; } else S.tPitch = 0; }
  if (!tap) return;
  const r = canvas.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  if (mode === 'stage') {
    ray.setFromCamera(ptr, S.cam);
    if (S.state === 'box' && ray.intersectObject(S.holder, true).length) cb.onBoxTap?.();
    else if (S.state === 'item') { S.vel = 3; cb.sfx?.('sparkle'); }
  } else {
    ray.setFromCamera(ptr, V.cam);
    const hit = ray.intersectObjects([V.items, V.fairy, V.ready, V.mail], true)[0];
    if (!hit) return; let o = hit.object;
    while (o && o.parent !== V.items && o !== V.fairy && o.parent !== V.ready && o !== V.mail) o = o.parent;
    if (!o) return;
    if (o === V.fairy) { fairyHop(V.fairy); cb.onFairyTap?.(); }
    else if (o.parent === V.items) { tween(0.4, k => { o.position.y = Math.sin(k * PI) * 0.25; }); cb.onItemTap?.(o.userData.day); }
    else if (o.parent === V.ready) cb.onReadyTap?.();
    else if (o === V.mail) cb.onMailTap?.();
  }
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- 시작·그리기 ----------
export function init(cv, callbacks) {
  canvas = cv; cb = callbacks || {};
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  buildVillage(); buildStage(); applyTime();
  clock = new THREE.Clock();
  canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', () => { down = null; });
  resize(); new ResizeObserver(resize).observe(canvas);
  renderer.setAnimationLoop(frame);
  setInterval(applyTime, 60000);
}
export function setCrisp(v) { crisp = v; resize(); }
function resize() {
  const cw = canvas.clientWidth || W3, ch = canvas.clientHeight || H3;
  let w = W3, h = Math.round(W3 * ch / cw);
  if (crisp) { const d = Math.min(2, window.devicePixelRatio || 1); w = Math.round(cw * d); h = Math.round(ch * d); }
  renderer.setPixelRatio(1); renderer.setSize(w, h, false);
  [V.cam, S.cam].forEach(c => { c.aspect = w / h; c.updateProjectionMatrix(); });
  THICK.value = crisp ? Math.max(1.2, w / 400) : 1.0;
}
export function setMode(m) { mode = m; }
export function getMode() { return mode; }

function frame() {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  runTweens(dt);
  const sz = renderer.getSize(new THREE.Vector2()); RES.value.copy(sz);
  if (mode === 'village') {
    animFairy(V.fairy, t); stepSnow(V.snow, dt, t); V.spark.step(dt);
    V.lights.forEach((m, i) => { m.material.emissiveIntensity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2 + i * 1.7)); });
    V.topStar.rotation.y = t * 0.8;
    V.items.children.forEach(m => { m.rotation.z = Math.sin(t * 1.5 + m.userData.phase) * 0.03; });
    V.ready.children.forEach(b => { b.rotation.z = Math.sin(t * 6 + b.userData.phase) * 0.06 * (Math.sin(t * 1.2 + b.userData.phase) > 0.6 ? 1 : 0); });
    V.cam.position.x = Math.sin(t * 0.15) * 0.25; V.cam.lookAt(0, 0.85, 0);
    renderer.render(V.scene, V.cam);
  } else {
    S.spark.step(dt);
    if (S.state === 'item' && !down) { S.tYaw += S.vel * dt; S.vel += (0.5 - S.vel) * dt * 1.5; }
    S.yaw += (S.tYaw - S.yaw) * Math.min(1, dt * (S.state === 'box' && !down ? 6 : 14)); S.pitch += (S.tPitch - S.pitch) * Math.min(1, dt * 8);
    S.holder.rotation.set(S.pitch, S.yaw, 0);
    if (S.item && S.state === 'item') S.item.position.y = 0.15 + Math.sin(t * 2) * 0.04;
    if (S.box && S.state === 'box') { const w = Math.sin(t * 1.6) > 0.85 ? Math.sin(t * 30) * 0.03 : 0; S.box.rotation.z = w; }
    S.glow.material.rotation = t * 0.3;
    renderer.render(S.scene, S.cam);
  }
}

// ---------- 달력 칸 그림 (아이템 미리 그리기) ----------
const thumbCache = new Map(); let TH = null;
export function thumb(kind, colors) {
  const key = kind + JSON.stringify(colors || []); if (thumbCache.has(key)) return thumbCache.get(key);
  if (!TH) {
    TH = { scene: new THREE.Scene(), cam: new THREE.PerspectiveCamera(30, 1, 0.1, 20), rt: new THREE.WebGLRenderTarget(128, 128, { colorSpace: THREE.SRGBColorSpace }) };
    TH.scene.add(new THREE.HemisphereLight('#ffffff', '#c9b8a8', 1.6)); const d = new THREE.DirectionalLight('#ffffff', 2.2); d.position.set(2, 4, 3); TH.scene.add(d);
    TH.cam.position.set(0, 0.9, 2.6); TH.cam.lookAt(0, 0.45, 0);
    TH.c = document.createElement('canvas'); TH.c.width = TH.c.height = 128;
  }
  const m = fit(build(kind, colors), 0.95); m.rotation.y = -0.35; TH.scene.add(m);
  const prev = RES.value.clone(), pt = THICK.value; RES.value.set(128, 128); THICK.value = 1.6;
  renderer.setRenderTarget(TH.rt); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(TH.scene, TH.cam);
  const px = new Uint8Array(128 * 128 * 4); renderer.readRenderTargetPixels(TH.rt, 0, 0, 128, 128, px); renderer.setRenderTarget(null);
  RES.value.copy(prev); THICK.value = pt; TH.scene.remove(m);
  const x = TH.c.getContext('2d'), img = x.createImageData(128, 128);
  for (let y = 0; y < 128; y++) img.data.set(px.subarray((127 - y) * 512, (128 - y) * 512), y * 512);
  x.clearRect(0, 0, 128, 128); x.putImageData(img, 0, 0);
  const url = TH.c.toDataURL(); thumbCache.set(key, url); return url;
}
