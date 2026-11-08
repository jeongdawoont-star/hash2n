// 이모지 → 도트 블록 3D: 기기의 이모지 글꼴로 작게 그린 뒤 칸마다 블록을 세운다.
// 가장자리는 얇고 가운데는 도톰하게(쿠션 모양). 모델 이름은 "e:🦖" 처럼 쓴다.
import { THREE, GRADMAP, ensureONormal, OUTLINE } from './kit.js';

const N = 24;          // 가로세로 칸 수
const SS = 6;          // 칸 하나를 몇 픽셀로 그려서 고를지
let cvs = null;
const cache = new Map();

function sample(ch) {
  const S = N * SS;
  if (!cvs) { cvs = document.createElement('canvas'); cvs.width = cvs.height = S; }
  const x = cvs.getContext('2d', { willReadFrequently: true });
  x.clearRect(0, 0, S, S);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = `${Math.round(S * 0.8)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif`;
  x.fillText(ch, S / 2, S / 2 + S * 0.04);
  const d = x.getImageData(0, 0, S, S).data;
  const cells = [];
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    let a = 0, r = 0, g = 0, b = 0, n = 0;
    for (let v = 0; v < SS; v++) for (let u = 0; u < SS; u++) {
      const k = ((j * SS + v) * S + i * SS + u) * 4, al = d[k + 3]; a += al;
      if (al > 128) { r += d[k]; g += d[k + 1]; b += d[k + 2]; n++; }
    }
    cells.push(a / (SS * SS) > 110 && n ? [r / n, g / n, b / n] : null);
  }
  return cells;
}

// 바깥에서 몇 칸 들어왔는지 (가운데일수록 크다)
function depthMap(cells) {
  const D = new Array(N * N).fill(0), q = [];
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i; if (!cells[k]) continue;
    const edge = i === 0 || j === 0 || i === N - 1 || j === N - 1 || !cells[k - 1] || !cells[k + 1] || !cells[k - N] || !cells[k + N];
    if (edge) { D[k] = 1; q.push(k); }
  }
  for (let h = 0; h < q.length; h++) {
    const k = q[h], i = k % N, j = (k / N) | 0;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= N || b >= N) continue;
      const m = b * N + a; if (cells[m] && !D[m]) { D[m] = D[k] + 1; q.push(m); }
    }
  }
  return D;
}

export function emojiGeometry(ch) {
  if (cache.has(ch)) return cache.get(ch);
  const cells = sample(ch);
  if (!cells.some(Boolean)) { cache.set(ch, null); return null; }
  const D = depthMap(cells), s = 1 / N;
  const half = k => (cells[k] ? (0.9 + Math.min(D[k] - 1, 4) * 0.55) * s : 0);
  // 그림이 있는 범위 가운데로 맞추기
  let x0 = N, x1 = 0, y0 = N, y1 = 0;
  cells.forEach((c, k) => { if (c) { const i = k % N, j = (k / N) | 0; x0 = Math.min(x0, i); x1 = Math.max(x1, i); y0 = Math.min(y0, j); y1 = Math.max(y1, j); } });
  const cx = (x0 + x1 + 1) / 2, cy = (y0 + y1 + 1) / 2;
  const P = [], Nn = [], C = [], O = [], col = new THREE.Color();
  // 외곽선용(O)은 앞뒤 면 + 바깥 벽만: 안쪽 계단에 검은 줄이 생기지 않게
  const quad = (a, b, c, d, n, rgb, ol = true) => { for (const v of [a, b, c, a, c, d]) { P.push(...v); Nn.push(...n); C.push(...rgb); if (ol) O.push(...v); } };
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i, c = cells[k]; if (!c) continue;
    col.setRGB(c[0] / 255, c[1] / 255, c[2] / 255, THREE.SRGBColorSpace);
    const rgb = [col.r, col.g, col.b], side = [col.r * 0.8, col.g * 0.8, col.b * 0.8];
    const h = half(k), L = (i - cx) * s, R = L + s, T = (cy - j) * s, B = T - s;
    quad([L, B, h], [R, B, h], [R, T, h], [L, T, h], [0, 0, 1], rgb);
    quad([R, B, -h], [L, B, -h], [L, T, -h], [R, T, -h], [0, 0, -1], rgb);
    const nb = [[i + 1, j, [1, 0, 0]], [i - 1, j, [-1, 0, 0]], [i, j - 1, [0, 1, 0]], [i, j + 1, [0, -1, 0]]];
    for (const [a, b, n] of nb) {
      const hn = a < 0 || b < 0 || a >= N || b >= N ? 0 : half(b * N + a);
      if (hn >= h) continue;
      const segs = hn > 0 ? [[hn, h], [-h, -hn]] : [[-h, h]];
      const out = hn === 0;
      for (const [z0, z1] of segs) {
        if (n[0] === 1) quad([R, B, z1], [R, B, z0], [R, T, z0], [R, T, z1], n, side, out);
        else if (n[0] === -1) quad([L, B, z0], [L, B, z1], [L, T, z1], [L, T, z0], n, side, out);
        else if (n[1] === 1) quad([L, T, z1], [R, T, z1], [R, T, z0], [L, T, z0], n, side, out);
        else quad([L, B, z0], [R, B, z0], [R, B, z1], [L, B, z1], n, side, out);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(Nn, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
  g.translate(0, 0.5, 0); // 바닥에 세우기
  const o = new THREE.BufferGeometry(); o.setAttribute('position', new THREE.Float32BufferAttribute(O, 3)); o.translate(0, 0.5, 0); o.computeVertexNormals(); ensureONormal(o);
  g.userData.outline = o;
  cache.set(ch, g); return g;
}

let mat = null;
export function emojiModel(ch) {
  const g = emojiGeometry(ch); if (!g) return null;
  if (!mat) mat = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: GRADMAP });
  const m = new THREE.Mesh(g, mat);
  const ol = new THREE.Mesh(g.userData.outline, OUTLINE); ol.raycast = () => {}; ol.userData.outline = true; m.add(ol);
  const grp = new THREE.Group(); grp.add(m); return grp;
}
