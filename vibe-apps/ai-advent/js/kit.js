// 공통 3D 부품: 툰 재질, 외곽선, 기본 도형 (모든 모델이 이걸로 만든다)
import * as THREE from '../vendor/three.module.js';
export { THREE };

// 3단 툰 그림자
const GRAD = (() => {
  const v = [96, 178, 255], d = new Uint8Array(12);
  v.forEach((x, i) => { d.set([x, x, x, 255], i * 4); });
  const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();

const matCache = new Map();
export function tmat(color, o = {}) {
  const key = [color, o.e, o.ei, o.op, o.map && o.map.uuid, o.flat].join('|');
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshToonMaterial({ color, gradientMap: GRAD, map: o.map || null });
    if (o.e) { m.emissive = new THREE.Color(o.e); m.emissiveIntensity = o.ei ?? 1; }
    if (o.op != null && o.op < 1) { m.transparent = true; m.opacity = o.op; m.depthWrite = false; }
    matCache.set(key, m);
  }
  return m;
}

// 화면 픽셀 기준 외곽선 (뒷면을 법선 방향으로 밀어 그림)
export const RES = { value: new THREE.Vector2(400, 240) };
export const THICK = { value: 1.0 };
export const OUTLINE = new THREE.ShaderMaterial({
  uniforms: { res: RES, thick: THICK, col: { value: new THREE.Color('#4b342d') } },
  vertexShader: `attribute vec3 oNormal; uniform vec2 res; uniform float thick;
    void main(){ vec4 c = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      vec3 n = normalize(normalMatrix * oNormal); vec2 d = n.xy; float l = length(d);
      if (l > 1e-4) d /= l; c.xy += d * thick * 2.0 / res * c.w; c.z += 0.00015 * c.w; gl_Position = c; }`,
  fragmentShader: `uniform vec3 col; void main(){ gl_FragColor = vec4(col,1.0); }`,
  side: THREE.BackSide,
});

function ensureONormal(g) {
  if (g.attributes.oNormal) return;
  if (!g.attributes.normal) g.computeVertexNormals();
  const p = g.attributes.position, n = g.attributes.normal, map = new Map(), keys = new Array(p.count);
  for (let i = 0; i < p.count; i++) {
    const k = Math.round(p.getX(i) * 1e4) + ',' + Math.round(p.getY(i) * 1e4) + ',' + Math.round(p.getZ(i) * 1e4);
    keys[i] = k; let a = map.get(k); if (!a) map.set(k, a = [0, 0, 0]);
    a[0] += n.getX(i); a[1] += n.getY(i); a[2] += n.getZ(i);
  }
  const arr = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const a = map.get(keys[i]), l = Math.hypot(a[0], a[1], a[2]) || 1;
    arr[i * 3] = a[0] / l; arr[i * 3 + 1] = a[1] / l; arr[i * 3 + 2] = a[2] / l;
  }
  g.setAttribute('oNormal', new THREE.BufferAttribute(arr, 3));
}

export function M(geom, color, o = {}) {
  const m = new THREE.Mesh(geom, tmat(color, o));
  if (o.ol !== false && !(o.op < 1)) {
    ensureONormal(geom);
    const ol = new THREE.Mesh(geom, OUTLINE); ol.raycast = () => {}; ol.userData.outline = true; m.add(ol);
  }
  return m;
}

// 위치·회전·크기를 한 번에
export function put(par, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1) {
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  if (Array.isArray(s)) m.scale.set(s[0], s[1], s[2]); else m.scale.setScalar(s);
  par.add(m); return m;
}

// ---------- 도형 (캐시) ----------
const gc = new Map();
const cache = (k, f) => { let g = gc.get(k); if (!g) gc.set(k, g = f()); return g; };

export const SPH = (r = 0.5, ws = 20, hs = 14) => cache(`s${r},${ws}`, () => new THREE.SphereGeometry(r, ws, hs));
export const HEMI = (r = 0.5) => cache(`h${r}`, () => new THREE.SphereGeometry(r, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2));
export const CYL = (rt = 0.5, rb = rt, h = 1, seg = 20) => cache(`c${rt},${rb},${h},${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg));
export const CONE = (r = 0.5, h = 1, seg = 20) => cache(`k${r},${h},${seg}`, () => new THREE.ConeGeometry(r, h, seg));
export const TOR = (R = 0.5, t = 0.1, arc = Math.PI * 2) => cache(`t${R},${t},${arc}`, () => new THREE.TorusGeometry(R, t, 10, 28, arc));
export const CAP = (r = 0.2, len = 0.5) => cache(`p${r},${len}`, () => new THREE.CapsuleGeometry(r, len, 6, 14));
export const OCT = (r = 0.5) => cache(`o${r}`, () => new THREE.OctahedronGeometry(r, 0));
export const ICO = (r = 0.5) => cache(`i${r}`, () => new THREE.IcosahedronGeometry(r, 0));

// 둥근 상자: 구를 상자 모양으로 눌러 만든다 (법선이 이어져서 외곽선이 끊기지 않음)
export const RB = (w = 1, h = 1, d = 1, p = 0.28) => cache(`b${w},${h},${d},${p}`, () => {
  const g = new THREE.SphereGeometry(1, 28, 20), a = g.attributes.position;
  for (let i = 0; i < a.count; i++) {
    const f = (v) => Math.sign(v) * Math.pow(Math.abs(v), p);
    a.setXYZ(i, f(a.getX(i)) * w / 2, f(a.getY(i)) * h / 2, f(a.getZ(i)) * d / 2);
  }
  g.computeVertexNormals(); return g;
});

export const LATHE = (key, pts, seg = 24) => cache('l' + key, () =>
  new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg));

function extrude(shape, depth, bevel = 0.04) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 10 });
  g.center(); return g;
}
export const STAR = (n = 5, ro = 0.5, ri = 0.22, depth = 0.12) => cache(`st${n},${ro},${ri},${depth}`, () => {
  const s = new THREE.Shape();
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? ri : ro, a = Math.PI / 2 + i * Math.PI / n;
    i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  return extrude(s, depth, 0.05);
});
export const HEART = (sz = 0.5, depth = 0.14) => cache(`he${sz},${depth}`, () => {
  const s = new THREE.Shape(), k = sz;
  s.moveTo(0, -0.9 * k);
  s.bezierCurveTo(0.2 * k, -0.6 * k, 1.0 * k, -0.2 * k, 0.9 * k, 0.35 * k);
  s.bezierCurveTo(0.8 * k, 0.85 * k, 0.15 * k, 0.9 * k, 0, 0.45 * k);
  s.bezierCurveTo(-0.15 * k, 0.9 * k, -0.8 * k, 0.85 * k, -0.9 * k, 0.35 * k);
  s.bezierCurveTo(-1.0 * k, -0.2 * k, -0.2 * k, -0.6 * k, 0, -0.9 * k);
  return extrude(s, depth, 0.05);
});
export const POLY = (key, pts, depth = 0.08) => cache('pl' + key, () => {
  const s = new THREE.Shape(); pts.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y));
  return extrude(s, depth, 0.03);
});
export const TUBE = (key, pts, r = 0.05, closed = false) => cache('tb' + key, () =>
  new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), closed), 48, r, 10, closed));

// 줄무늬·점무늬 텍스처
const texCache = new Map();
export function patternTex(kind, a, b, rep = 4) {
  const key = kind + a + b + rep; if (texCache.has(key)) return texCache.get(key);
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  x.fillStyle = a; x.fillRect(0, 0, 64, 64); x.fillStyle = b;
  if (kind === 'stripe') { for (let i = -64; i < 128; i += 22) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 11, 0); x.lineTo(i + 11 + 64, 64); x.lineTo(i + 64, 64); x.fill(); } }
  else if (kind === 'dots') { [[16, 16], [48, 48], [48, 16], [16, 48]].forEach(([u, v], i) => { if (i < 2) { x.beginPath(); x.arc(u, v, 8, 0, 7); x.fill(); } }); }
  else if (kind === 'check') { x.fillRect(0, 0, 32, 32); x.fillRect(32, 32, 32, 32); }
  else if (kind === 'band') { x.fillRect(0, 0, 64, 32); }
  else if (kind === 'stars') { x.font = 'bold 26px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('★', 16, 16); x.fillText('★', 48, 48); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep);
  t.magFilter = THREE.NearestFilter; t.colorSpace = THREE.SRGBColorSpace;
  texCache.set(key, t); return t;
}

// 모델 크기를 맞추고 바닥을 y=0에 둔다
export function fit(obj, size = 1) {
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj), s = new THREE.Vector3(), c = new THREE.Vector3();
  box.getSize(s); box.getCenter(c);
  const k = size / Math.max(s.x, s.y, s.z, 1e-3);
  const wrap = new THREE.Group(); obj.position.sub(new THREE.Vector3(c.x, box.min.y, c.z));
  wrap.add(obj); wrap.scale.setScalar(k); wrap.userData.h = s.y * k; return wrap;
}
