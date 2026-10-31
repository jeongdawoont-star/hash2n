// 할로윈네컷 웹 AR: 얼굴·포즈를 실시간 추적해 Blender로 구운 3D 분장을 카메라 위에 그린다.
// 영상은 기기 밖으로 나가지 않는다.
import * as THREE from './lib/three.module.js';
import { FaceLandmarker, PoseLandmarker, ImageSegmenter, FilesetResolver } from './lib/vision_bundle.mjs';
import { CATALOG } from './catalog.js';
import { Picker } from './picker.js';

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const TEST = params.get('test');             // ?test=dracula 분장 고정 (점검용)
const DEBUG = params.has('debug');           // ?debug=1 인식 상태 표시 (점검용)
const MOBILE = /Android|iPhone|iPad/.test(navigator.userAgent) || (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1);
// 휴대기기 GPU 인식은 분할 마스크가 깨지는 기기가 있어 CPU로 돌린다. ?delegate=gpu|cpu 로 바꿔 볼 수 있다.
const FORCE_DELEGATE = { gpu: 'GPU', cpu: 'CPU' }[params.get('delegate')] || (MOBILE ? 'CPU' : null);
const MAX_FACES = MOBILE ? 2 : 4;
const CUTS = 4, MAX_PEOPLE = 4, GAP_MS = 2600;
const EYE_L = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
const EYE_R = [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466];
const STABLE = [10, 151, 9, 8, 168, 6, 197, 195, 5, 4, 1, 234, 454, 127, 356, 93, 323, 33, 263, 133, 362, 70, 300, 54, 284, 103, 332, 21, 251, 162, 389];
const HEAD_C = [0, 3.5, 1.5], HEAD_R = [8.6, 10.8, 10.8];
const CLOSED_FACE = new Set(['talgwi', 'scarecrow', 'skeleton', 'reaper']);
const RIGID_FACE = new Set(['talgwi']);
const SHADE_KEEP = { talgwi: 0, scarecrow: .1, mummy: .3, skeleton: .35, reaper: .35, clown: .6 };
const TEX_ALIAS = { reaper: 'skeleton' };
const NO_FACE = new Set(['pumpkin', 'dalgyal']);
const BACK_PARTS = new Set(['cape', 'wing', 'spar']);

const video = $('video'), canvas = $('gl'), msg = $('msg');
const picker = new Picker(CATALOG, localStorage);
const byId = Object.fromEntries(CATALOG.map(c => [c.id, c]));
let W = 1280, H = 960, renderer, scene, camera, faceTopo;
let faceLm, poseLm, segmenter, delegate = 'GPU';
const stats = { fps: 0, face: 0, pose: 0, seg: 0, draw: 0 };

// ---------- 수학 ----------
const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const toScene = (p, out = v3()) => out.set(p.x * W, -p.y * H, -p.z * W);
const BASE = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);   // 굽기 좌표(cm) → 화면 축

// Horn의 사원수 해법: 표준 얼굴 기준점과 관측 기준점 사이의 최적 회전
function solveRotation(src, dst, q0) {
  const S = new Float64Array(9);
  for (let i = 0; i < src.length; i++)
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) S[a * 3 + b] += src[i][a] * dst[i][b];
  const [xx, xy, xz, yx, yy, yz, zx, zy, zz] = S;
  const N = [
    [xx + yy + zz, yz - zy, zx - xz, xy - yx],
    [yz - zy, xx - yy - zz, xy + yx, zx + xz],
    [zx - xz, xy + yx, -xx + yy - zz, yz + zy],
    [xy - yx, zx + xz, yz + zy, -xx - yy + zz]];
  const shift = Math.abs(xx) + Math.abs(yy) + Math.abs(zz) + Math.abs(xy) + Math.abs(xz) + Math.abs(yz) + Math.abs(yx) + Math.abs(zx) + Math.abs(zy);
  let q = q0.slice();
  for (let it = 0; it < 24; it++) {
    const n = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) { for (let j = 0; j < 4; j++) n[i] += N[i][j] * q[j]; n[i] += shift * q[i]; }
    const len = Math.hypot(...n) || 1;
    q = n.map(x => x / len);
  }
  return q;       // [w,x,y,z]
}

// ---------- 텍스처·셰이더 ----------
const texLoader = new THREE.TextureLoader();
function loadTex(url, srgb = true) {
  return new Promise((ok, no) => texLoader.load(url, t => {
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    ok(t);
  }, undefined, no));
}

const videoTex = () => {
  const t = new THREE.VideoTexture(video);
  t.colorSpace = THREE.NoColorSpace;
  t.minFilter = t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = false;
  return t;
};

const maskData = new Uint8Array(256 * 256 * 4);
const maskTex = new THREE.DataTexture(maskData, 256, 256, THREE.RGBAFormat);
maskTex.flipY = true;
maskTex.minFilter = maskTex.magFilter = THREE.LinearFilter;

const faceUniforms = () => ({
  uCentres: { value: Array.from({ length: MAX_PEOPLE }, () => new THREE.Vector3(9, 9, 1)) },
  uSkin: { value: Array.from({ length: MAX_PEOPLE }, () => new THREE.Vector4(1, 1, 1, 0)) },
});
const bgUniforms = {
  uVideo: { value: null }, uMask: { value: maskTex }, uTint: { value: new THREE.Color(.3, .4, .6) },
  uDark: { value: .7 }, uSat: { value: .7 }, uHasMask: { value: 0 }, ...faceUniforms(),
};

const VERT_QUAD = `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const FRAG_COMMON = `
varying vec2 vUv; uniform sampler2D uVideo,uMask; uniform vec3 uTint; uniform float uDark,uSat,uHasMask;
uniform vec3 uCentres[${MAX_PEOPLE}]; uniform vec4 uSkin[${MAX_PEOPLE}];
vec3 toLin(vec3 c){return pow(c,vec3(2.2));}
vec3 graded(vec3 c,float k){float g=dot(c,vec3(.3,.59,.11));return mix(vec3(g),c,uSat)*k;}
vec4 nearestSkin(vec2 uv){vec4 r=vec4(1.);float best=1e9;for(int i=0;i<${MAX_PEOPLE};i++){float d=distance(uv,uCentres[i].xy);if(uSkin[i].a>0.&&d<best){best=d;r=uSkin[i];}}return r;}
`;
const bgMat = new THREE.ShaderMaterial({
  uniforms: bgUniforms, vertexShader: VERT_QUAD, depthTest: false, depthWrite: false, transparent: true,
  fragmentShader: FRAG_COMMON + `void main(){
    vec3 c=toLin(texture2D(uVideo,vUv).rgb);
    vec2 d=(vUv-.5)*vec2(1.25,1.);float vig=clamp(1.06-pow(length(d)*1.5,2.6)*.8,.12,1.);
    c=graded(c,uDark*.7)*(.45+uTint*1.15)*vig;
    gl_FragColor=vec4(pow(c,vec3(1./2.2)),1.);}`,
});
const personMat = new THREE.ShaderMaterial({
  uniforms: bgUniforms, vertexShader: VERT_QUAD, depthTest: false, depthWrite: false, transparent: true,
  fragmentShader: FRAG_COMMON + `void main(){
    vec3 c=toLin(texture2D(uVideo,vUv).rgb); vec4 m=texture2D(uMask,vUv);
    vec4 sk=nearestSkin(vUv); float skin=m.g;
    float l=dot(c,vec3(.3,.59,.11));
    vec3 tinted=sk.rgb*clamp(l*2.6,.25,1.25);
    c=mix(c,tinted,skin*sk.a);
    c=mix(c,c*.05,smoothstep(.15,.6,m.b));                 // 원래 머리카락은 어둡게 눌러 가발 뒤로 숨긴다
    c=graded(c,mix(1.,uDark*1.2,1.-skin*.5));
    float a=uHasMask>.5?smoothstep(.25,.75,m.r):0.;
    gl_FragColor=vec4(pow(c,vec3(1./2.2)),a);}`,
});
// 소매 앞으로 나오는 진짜 손
const handUniforms = { uHands: { value: Array.from({ length: MAX_PEOPLE * 2 }, () => new THREE.Vector3(9, 9, 0)) } };
const handMat = new THREE.ShaderMaterial({
  uniforms: { ...bgUniforms, ...handUniforms }, vertexShader: VERT_QUAD, depthTest: false, depthWrite: false, transparent: true,
  fragmentShader: FRAG_COMMON + `uniform vec3 uHands[${MAX_PEOPLE * 2}];
  void main(){vec3 c=toLin(texture2D(uVideo,vUv).rgb);vec4 m=texture2D(uMask,vUv);
    float near=0.;for(int i=0;i<${MAX_PEOPLE * 2};i++){if(uHands[i].z>.0)near=max(near,1.-smoothstep(uHands[i].z*.7,uHands[i].z,distance(vUv*vec2(${'$'}{ASPECT},1.),uHands[i].xy*vec2(${'$'}{ASPECT},1.))));}
    vec4 sk=nearestSkin(vUv);float l=dot(c,vec3(.3,.59,.11));c=mix(c,sk.rgb*clamp(l*2.6,.25,1.25),sk.a);
    gl_FragColor=vec4(pow(graded(c,uDark*1.1),vec3(1./2.2)),near*smoothstep(.35,.7,m.g));}`.replaceAll('${ASPECT}', '1.3333'),
});

function faceMaterial(tex, surf, keep) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: true, side: THREE.FrontSide,
    uniforms: {
      uMap: { value: tex }, uSurf: { value: surf }, uVideo: bgUniforms.uVideo, uKeep: { value: keep },
      uLuma: { value: .4 }, uLight: scene.userData.light, uAmbient: scene.userData.ambient,
    },
    vertexShader: `attribute vec2 uvPhoto; varying vec2 vUv,vPhoto; varying vec3 vN,vPos;
      void main(){vUv=uv;vPhoto=uvPhoto;vN=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);vPos=p.xyz;gl_Position=projectionMatrix*p;}`,
    fragmentShader: `precision highp float; varying vec2 vUv,vPhoto; varying vec3 vN,vPos;
      uniform sampler2D uMap,uSurf,uVideo; uniform float uKeep,uLuma; uniform vec3 uLight,uAmbient;
      void main(){vec4 t=texture2D(uMap,vUv); if(t.a<.01)discard;
        vec3 lin=pow(t.rgb,vec3(2.2));
        vec3 pv=pow(texture2D(uVideo,vPhoto).rgb,vec3(2.2));
        float l=dot(pv,vec3(.3,.59,.11))/max(uLuma,.05);
        float shade=mix(1.,mix(.45,1.18,clamp(l/1.6,0.,1.)),uKeep);
        vec2 e=vec2(1./1024.);
        float h=texture2D(uSurf,vUv).r; float hx=texture2D(uSurf,vUv+vec2(e.x,0.)).r-h, hy=texture2D(uSurf,vUv+vec2(0.,e.y)).r-h;
        vec3 n=normalize(vN+vec3(-hx,-hy,0.)*14.);
        float rough=texture2D(uSurf,vUv).g;
        float dif=max(dot(n,uLight),0.);
        vec3 hv=normalize(uLight+vec3(0.,0.,1.));
        float sp=pow(max(dot(n,hv),0.),mix(90.,8.,rough))*(1.-rough)*.5;
        vec3 c=lin*shade*mix(1.5,1.,uKeep)*(uAmbient+dif*.72)+sp;
        gl_FragColor=vec4(pow(max(c,0.),vec3(1./2.2)),t.a);}`,
  });
}

// ---------- 자산 ----------
const assetCache = new Map();
function loadAsset(id) {
  if (assetCache.has(id)) return assetCache.get(id);
  const job = (async () => {
    const buf = await (await fetch(`assets/${id}.bin`)).arrayBuffer();
    const len = new DataView(buf).getUint32(0, true);
    const meta = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, len)));
    const base = 4 + len;
    const parts = meta.parts.map(p => {
      const g = new THREE.BufferGeometry();
      const pi = new Int16Array(buf, base + p.pos, p.n * 3), pos = new Float32Array(p.n * 3);
      for (let i = 0; i < pos.length; i++) pos[i] = pi[i] / 32767 * meta.range;
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.BufferAttribute(new Int8Array(buf, base + p.nor, p.n * 3), 3, true));
      g.setAttribute('color', new THREE.BufferAttribute(new Uint8Array(buf, base + p.col, p.n * 3), 3, true));
      g.setIndex(new THREE.BufferAttribute(p.idx32 ? new Uint32Array(buf, base + p.idx, p.tris) : new Uint16Array(buf, base + p.idx, p.tris), 1));
      if (p.uv !== undefined) {
        const u = new Uint16Array(buf, base + p.uv, p.n * 2), f = new Float32Array(p.n * 2);
        for (let i = 0; i < f.length; i++) f[i] = u[i] / 16000;
        g.setAttribute('uv', new THREE.BufferAttribute(f, 2));
      }
      if (p.ji !== undefined) {
        const ji = new Uint8Array(buf, base + p.ji, p.n * 2), jw = new Uint8Array(buf, base + p.jw, p.n * 2);
        const si = new Uint16Array(p.n * 4), sw = new Float32Array(p.n * 4);
        for (let i = 0; i < p.n; i++) { si[i * 4] = ji[i * 2]; si[i * 4 + 1] = ji[i * 2 + 1]; sw[i * 4] = jw[i * 2] / 255; sw[i * 4 + 1] = jw[i * 2 + 1] / 255; }
        g.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4));
        g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
      }
      return { ...p, geometry: g };
    });
    const keep = SHADE_KEEP[id] ?? 1;
    let faceMat = null;
    if (!NO_FACE.has(id)) {
      const t = TEX_ALIAS[id] || id;
      const [c, s] = await Promise.all([loadTex(`makeup/${t}_color.webp`), loadTex(`makeup/${t}_surf.webp`, false)]);
      faceMat = faceMaterial(c, s, keep);
    }
    return { meta, parts, faceMat, id };
  })();
  assetCache.set(id, job);
  return job;
}

let strandTex = null, bujeokTex = null;
function partMaterial(p) {
  const m = p.mat;
  const isHair = m.hair;
  const opt = {
    vertexColors: true, roughness: m.rough, metalness: m.metal, side: THREE.DoubleSide,
    transparent: true,      // 불투명 목록을 쓰지 않아야 renderOrder대로 사람 층 위에 그려진다
    color: p.cloth && !isHair ? 0xffffff : new THREE.Color().setRGB(...m.color),
    emissive: new THREE.Color().setRGB(...m.emit),
  };
  if (isHair) Object.assign(opt, { map: strandTex, alphaTest: .32, alphaToCoverage: true, roughness: .5 });
  if (m.tex === 'bujeok') Object.assign(opt, { map: bujeokTex, color: 0xffffff, vertexColors: false });
  if (m.opacity < 1) Object.assign(opt, { transparent: true, opacity: m.opacity, depthWrite: false });
  return new THREE.MeshStandardMaterial(opt);
}

// ---------- 사람 한 명의 무대 ----------
function eyeCanvas(spec) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  const hex = a => `rgb(${a.map(v => Math.round(Math.pow(Math.min(v * (1 + spec.glow * .35), 1), 1 / 2.2) * 255)).join(',')})`;
  if (spec.kind === 'solid') { x.fillStyle = hex(spec.iris); x.beginPath(); x.arc(64, 64, 63, 0, 7); x.fill(); return c; }
  x.fillStyle = spec.kind === 'black' ? '#050505' : '#d8d2c6'; x.beginPath(); x.arc(64, 64, 63, 0, 7); x.fill();
  return c;
}
function irisCanvas(spec) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  const col = spec.iris.map(v => Math.round(Math.pow(Math.min(v * (1 + spec.glow * .4), 1), 1 / 2.2) * 255));
  const g = x.createRadialGradient(64, 64, 8, 64, 64, 62);
  g.addColorStop(0, `rgb(${col})`); g.addColorStop(.8, `rgb(${col.map(v => v * .55 | 0)})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.arc(64, 64, 62, 0, 7); x.fill();
  x.fillStyle = '#020202'; x.beginPath();
  if (spec.slit) x.ellipse(64, 64, 8, 40, 0, 0, 7); else x.arc(64, 64, 20, 0, 7);
  x.fill();
  x.fillStyle = 'rgba(255,255,255,.75)'; x.beginPath(); x.arc(50, 48, 7, 0, 7); x.fill();
  return c;
}

class Slot {
  constructor(i) {
    this.i = i;
    this.group = new THREE.Group(); scene.add(this.group);
    this.headRoot = new THREE.Group(); this.headRoot.matrixAutoUpdate = false; this.group.add(this.headRoot);
    this.bones = Array.from({ length: 6 }, () => { const b = new THREE.Bone(); b.matrixAutoUpdate = false; b.matrixWorldAutoUpdate = false; return b; });
    this.wingBones = Array.from({ length: 6 }, () => { const b = new THREE.Bone(); b.matrixAutoUpdate = false; b.matrixWorldAutoUpdate = false; return b; });
    this.skeleton = new THREE.Skeleton(this.bones, this.bones.map(() => new THREE.Matrix4()));
    this.wingSkeleton = new THREE.Skeleton(this.wingBones, this.wingBones.map(() => new THREE.Matrix4()));
    // 깊이만 쓰는 머리·얼굴 (뒷머리가 얼굴 뒤로 숨고 눈이 눈꺼풀 뒤로 들어간다)
    const hole = new THREE.MeshBasicMaterial({ colorWrite: false, transparent: true });
    const sph = new THREE.SphereGeometry(1, 24, 16);
    this.occHead = new THREE.Mesh(sph, hole); this.occHead.position.set(HEAD_C[0], HEAD_C[1] + 2.2, HEAD_C[2]);
    this.occHead.scale.set(HEAD_R[0] * .86, HEAD_R[1] * .8, HEAD_R[2] * .86); this.occHead.renderOrder = 3;
    this.headRoot.add(this.occHead);
    const n = 468;
    this.pos = new THREE.BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.photo = new THREE.BufferAttribute(new Float32Array(n * 2), 2).setUsage(THREE.DynamicDrawUsage);
    const uv = new THREE.BufferAttribute(new Float32Array(faceTopo.uv), 2);
    const geo = idx => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', this.pos); g.setAttribute('uv', uv); g.setAttribute('uvPhoto', this.photo);
      g.setIndex(idx);
      return g;
    };
    this.geoHoled = geo(faceTopo.tris); this.geoClosed = geo(faceTopo.tris_all);
    this.occFace = new THREE.Mesh(this.geoHoled, hole); this.occFace.frustumCulled = false; this.occFace.renderOrder = 3;
    this.group.add(this.occFace);
    this.faceMesh = new THREE.Mesh(this.geoHoled, new THREE.MeshBasicMaterial()); this.faceMesh.frustumCulled = false;
    this.faceMesh.renderOrder = 7; this.faceMesh.visible = false; this.group.add(this.faceMesh);
    this.eyes = [0, 1].map(() => {
      const mk = () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true })); m.frustumCulled = false; m.renderOrder = 6; m.visible = false; this.group.add(m); return m; };
      return { white: mk(), iris: mk() };
    });
    this.wisps = [0, 1].map(() => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: scene.userData.glow, blending: THREE.AdditiveBlending, depthTest: false, transparent: true }));
      s.visible = false; s.renderOrder = 9; this.group.add(s); return s;
    });
    this.meshes = [];
    this.costume = null;
    this.seen = false;
    this.q = [1, 0, 0, 0]; this.s = 0; this.t = v3();
    this.lm = null; this.pose = null; this.gesture = 'neutral';
    this.group.visible = false;
  }

  async wear(id) {
    if (this.wanted === id) return;
    this.wanted = id;
    const a = await loadAsset(id);
    if (this.wanted !== id) return;
    for (const m of this.meshes) { m.parent.remove(m); m.material.dispose(); if (m.isSkinnedMesh) m.bindMode = 'detached'; }
    this.meshes = [];
    for (const p of a.parts) {
      const mat = partMaterial(p);
      let mesh;
      if (p.body) {
        mesh = new THREE.SkinnedMesh(p.geometry, mat);
        mesh.bindMode = 'detached';
        mesh.frustumCulled = false;
        mesh.bind(p.behind ? this.wingSkeleton : this.skeleton, new THREE.Matrix4());
        mesh.renderOrder = p.behind ? 1 : 4;
        this.group.add(mesh);
      } else {
        mesh = new THREE.Mesh(p.geometry, mat);
        mesh.frustumCulled = false;
        mesh.renderOrder = p.behind ? 1 : p.mat.opacity < 1 ? 8 : 6;
        this.headRoot.add(mesh);
      }
      this.meshes.push(mesh);
    }
    this.costume = id;
    const c = byId[id];
    bgUniforms.uSkin.value[this.i].set(...c.skin.map(x => x), c.skin_k);
    this.faceMesh.visible = !!a.faceMat;
    if (a.faceMat) {
      this.faceMesh.material = a.faceMat;
      this.faceMesh.geometry = CLOSED_FACE.has(id) ? this.geoClosed : this.geoHoled;
    }
    const e = a.meta.eyes;
    this.eyeSpec = e;
    for (const y of this.eyes) {
      y.white.visible = y.iris.visible = false;
      if (!e) continue;
      y.white.material.map?.dispose();
      y.white.material.map = new THREE.CanvasTexture(eyeCanvas(e)); y.white.material.map.colorSpace = THREE.SRGBColorSpace;
      y.white.material.needsUpdate = true;
      if (e.kind !== 'solid') {
        y.iris.material.map?.dispose();
        y.iris.material.map = new THREE.CanvasTexture(irisCanvas(e)); y.iris.material.map.colorSpace = THREE.SRGBColorSpace;
        y.iris.material.needsUpdate = true;
      }
    }
    this.joints = a.meta.joints;
  }

  updateHead(lm, snap) {
    const src = [], dst = [];
    let sc = [0, 0, 0], dc = [0, 0, 0];
    const H3 = faceTopo.head;
    for (const i of STABLE) {
      // 굽기 좌표 → 화면 축: (x, -y안쪽→z, z위→y)
      const s = [H3[i * 3], H3[i * 3 + 2], -H3[i * 3 + 1]], d = [lm[i].x * W, -lm[i].y * H, -lm[i].z * W];
      src.push(s); dst.push(d);
      for (let k = 0; k < 3; k++) { sc[k] += s[k]; dc[k] += d[k]; }
    }
    sc = sc.map(x => x / src.length); dc = dc.map(x => x / src.length);
    let ss = 0, sd = 0;
    for (let i = 0; i < src.length; i++) for (let k = 0; k < 3; k++) { src[i][k] -= sc[k]; dst[i][k] -= dc[k]; ss += src[i][k] ** 2; sd += dst[i][k] ** 2; }
    const q = solveRotation(src, dst, this.q);
    const scale = Math.sqrt(sd / ss);
    const Q = new THREE.Quaternion(q[1], q[2], q[3], q[0]);
    const t = v3(...dc).sub(v3(...sc).applyQuaternion(Q).multiplyScalar(scale));
    // 움직임이 크면 곧바로, 작으면 부드럽게 (떨림 방지)
    const speed = this.s ? t.distanceTo(this.t) / this.s : 99;
    const a = snap ? 1 : Math.min(1, .3 + speed * .9);
    if (!this.s || a >= 1) { this.Q = Q; this.t = t; this.s = scale; }
    else { this.Q.slerp(Q, a); this.t.lerp(t, a); this.s += (scale - this.s) * a; }
    this.q = q;
    const M = new THREE.Matrix4().compose(this.t, this.Q, v3(this.s, this.s, this.s)).multiply(BASE);
    this.headRoot.matrix.copy(M); this.headRoot.matrixWorldNeedsUpdate = true;
    this.headM = M;
    // 얼굴 메시: 살짝 앞으로 띄운다
    const fw = v3(0, 0, 1).applyQuaternion(this.Q).multiplyScalar(this.s * .06);
    const rigid = RIGID_FACE.has(this.costume);
    const off = rigid ? v3(0, 0, 1).applyQuaternion(this.Q).multiplyScalar(this.s * .55) : fw;
    const p = this.pos.array, u = this.photo.array, tmp = v3();
    for (let i = 0; i < 468; i++) {
      if (rigid) tmp.set(H3[i * 3], H3[i * 3 + 1], H3[i * 3 + 2]).applyMatrix4(M);
      else toScene(lm[i], tmp);
      p[i * 3] = tmp.x + off.x; p[i * 3 + 1] = tmp.y + off.y; p[i * 3 + 2] = tmp.z + off.z;
      u[i * 2] = lm[i].x; u[i * 2 + 1] = 1 - lm[i].y;
    }
    this.pos.needsUpdate = true; this.photo.needsUpdate = true;
    this.geoHoled.computeVertexNormals(); this.geoClosed.setAttribute('normal', this.geoHoled.getAttribute('normal'));
    this.updateEyes(lm);
    let mx = 0, my = 0;
    for (const i of [1, 10, 152, 234, 454]) { mx += lm[i].x / 5; my += lm[i].y / 5; }
    bgUniforms.uCentres.value[this.i].set(mx, 1 - my, 1);
    this.faceW = Math.hypot((lm[454].x - lm[234].x) * W, (lm[454].y - lm[234].y) * H);
  }

  updateEyes(lm) {
    const e = this.eyeSpec;
    this.eyes.forEach((y, k) => {
      if (!e) return;
      const rim = k ? EYE_R : EYE_L, c = v3(), t = v3();
      for (const i of rim) c.add(toScene(lm[i], t));
      c.divideScalar(rim.length);
      const a = toScene(lm[rim[0]], v3()), b = toScene(lm[rim[8]], v3());
      const w = a.distanceTo(b) * 1.18 * (e.size || 1);
      const back = v3(0, 0, -1).applyQuaternion(this.Q).multiplyScalar(this.s * .75);
      y.white.position.copy(c).add(back); y.white.quaternion.copy(this.Q); y.white.scale.set(w, w, 1); y.white.visible = true;
      if (e.kind !== 'solid') {
        const ic = toScene(lm[k ? 473 : 468], v3()).add(back).add(v3(0, 0, 1).applyQuaternion(this.Q).multiplyScalar(this.s * .08));
        const r = w * .66;
        y.iris.position.copy(ic); y.iris.quaternion.copy(this.Q); y.iris.scale.set(r, r, 1); y.iris.visible = true;
      }
    });
  }

  updateBody(pose) {
    if (!this.joints) return;
    const J = this.joints, s = this.s;
    const P2 = i => new THREE.Vector2(pose[i].x * W, -pose[i].y * H);
    const zPlane = v3(HEAD_C[0], HEAD_C[1], HEAD_C[2]).applyMatrix4(this.headM).z;
    const R = k => J[k];
    const vis = i => (pose?.[i]?.visibility ?? 0) > .4;
    const smR = [(R('ls')[0] + R('rs')[0]) / 2, 0, (R('ls')[2] + R('rs')[2]) / 2];
    const hmR = [(R('lh')[0] + R('rh')[0]) / 2, 0, (R('lh')[2] + R('rh')[2]) / 2];
    const restW = R('rs')[0] - R('ls')[0], restL = smR[2] - hmR[2];
    let ls, rs, lh, rh;
    if (pose && vis(11) && vis(12)) {
      ls = P2(11); rs = P2(12);
      this.swap = ls.x > rs.x;
      if (this.swap) [ls, rs] = [rs, ls];
      const c = ls.clone().add(rs).multiplyScalar(.5), k = 1.1;     // 어깨점은 관절이라 실제 어깨보다 안쪽이다
      ls.sub(c).multiplyScalar(k).add(c); rs.sub(c).multiplyScalar(k).add(c);
    } else {     // 어깨가 안 보이면 얼굴 크기로 추정
      const c = v3(0, 0, -16.9).applyMatrix4(this.headM);
      const half = restW / 2 * s;
      ls = new THREE.Vector2(c.x - half, c.y); rs = new THREE.Vector2(c.x + half, c.y);
    }
    const sw = rs.distanceTo(ls), S = Math.max(sw / restW, s * .75);
    const sm = ls.clone().add(rs).multiplyScalar(.5);
    const ang = Math.atan2(rs.y - ls.y, rs.x - ls.x);
    const hipI = this.swap ? [24, 23] : [23, 24];
    if (pose && vis(23) && vis(24)) { lh = P2(hipI[0]); rh = P2(hipI[1]); }
    else {
      const d = new THREE.Vector2(Math.sin(ang), -Math.cos(ang)).multiplyScalar(restL * S);
      lh = ls.clone().add(d).add(new THREE.Vector2(0, 0)); rh = rs.clone().add(d);
    }
    const hm = lh.clone().add(rh).multiplyScalar(.5);
    const L = hm.distanceTo(sm);
    const frame = (o, a, sx, sy, restO) => new THREE.Matrix4()
      .makeTranslation(o.x, o.y, zPlane)
      .multiply(new THREE.Matrix4().makeRotationZ(a))
      .multiply(new THREE.Matrix4().makeScale(sx, sy, S))
      .multiply(BASE)
      .multiply(new THREE.Matrix4().makeTranslation(-restO[0], -HEAD_C[1], -restO[2]));
    const WIDE = 1.16;      // 원래 옷을 덮도록 어깨를 넉넉하게
    const up = frame(sm, ang, sw / restW * WIDE, L / restL, smR);
    const lowAng = Math.atan2(rh.y - lh.y, rh.x - lh.x);
    const lowW = Math.max(rh.distanceTo(lh), 1), restHW = R('rh')[0] - R('lh')[0];
    // 아랫몸: 윗몸과 같은 원점에서 골반 쪽으로 늘린다
    const low = frame(sm, (ang + lowAng) / 2, (sw / restW + lowW / restHW) / 2 * WIDE, L / restL, smR);
    this.bones[0].matrixWorld.copy(up); this.bones[1].matrixWorld.copy(low);
    const restDown = (a, b) => { const u = v3(...b).sub(v3(...a)).applyMatrix4(new THREE.Matrix4().extractRotation(BASE)); return u; };
    const limb = (bone, restA, restB, A, B) => {
      const rd = restDown(restA, restB), rAng = Math.atan2(rd.y, rd.x), rLen = rd.length();
      const d = B.clone().sub(A), tAng = Math.atan2(d.y, d.x), k = Math.max(d.length(), 1) / rLen;
      const m = new THREE.Matrix4().makeTranslation(A.x, A.y, zPlane)
        .multiply(new THREE.Matrix4().makeRotationZ(tAng))
        .multiply(new THREE.Matrix4().makeScale(k, S, S))
        .multiply(new THREE.Matrix4().makeRotationZ(-rAng))
        .multiply(BASE)
        .multiply(new THREE.Matrix4().makeTranslation(-restA[0], -restA[1], -restA[2]));
      bone.matrixWorld.copy(m);
    };
    const restPoint = (k) => { const q = v3(...R(k)).applyMatrix4(up); return new THREE.Vector2(q.x, q.y); };
    const [eL, eR, wL, wR] = this.swap ? [14, 13, 16, 15] : [13, 14, 15, 16];
    const le = pose && vis(eL) ? P2(eL) : restPoint('le'), re = pose && vis(eR) ? P2(eR) : restPoint('re');
    const lw = pose && vis(wL) ? P2(wL) : restPoint('lw'), rw = pose && vis(wR) ? P2(wR) : restPoint('rw');
    limb(this.bones[2], R('ls'), R('le'), ls, le); limb(this.bones[3], R('le'), R('lw'), le, lw);
    limb(this.bones[4], R('rs'), R('re'), rs, re); limb(this.bones[5], R('re'), R('rw'), re, rw);
    // 날개·망토: 팔을 벌리면 크게
    const g = pose ? classifyGesture(pose, this, { ls, rs, lw, rw }) : 'neutral';
    this.gesture = g;
    const pivot = v3(sm.x, sm.y, zPlane), k = g === 'arms_open' ? 1.28 : 1;
    const wide = new THREE.Matrix4().makeTranslation(pivot.x, pivot.y, pivot.z).multiply(new THREE.Matrix4().makeScale(k, k, 1)).multiply(new THREE.Matrix4().makeTranslation(-pivot.x, -pivot.y, -pivot.z));
    this.wingBones[0].matrixWorld.copy(wide.clone().multiply(up));
    this.wingBones[1].matrixWorld.copy(wide.clone().multiply(low));
    for (let i = 2; i < 6; i++) this.wingBones[i].matrixWorld.copy(this.bones[i].matrixWorld);
    this.skeleton.update(); this.wingSkeleton.update();
    // 손 위치: 소매 앞으로 진짜 손을 다시 그린다 / 손을 들면 도깨비불
    const r = this.faceW * .85 / W * 1.0;
    handUniforms.uHands.value[this.i * 2].set(lw.x / W, 1 + lw.y / H, pose && vis(wL) ? r * .75 : 0);
    handUniforms.uHands.value[this.i * 2 + 1].set(rw.x / W, 1 + rw.y / H, pose && vis(wR) ? r * .75 : 0);
    const t = performance.now() / 300;
    [lw, rw].forEach((w, i) => {
      const sp = this.wisps[i];
      sp.visible = g === 'hands_up';
      if (sp.visible) {
        const pul = this.faceW * (1.1 + .12 * Math.sin(t + i * 2));
        sp.position.set(w.x + Math.sin(t * .7 + i) * this.faceW * .22, w.y + this.faceW * .4 + Math.cos(t * .9) * this.faceW * .16, 600);
        sp.scale.set(pul, pul, 1);
        sp.material.color.setRGB(...(byId[this.costume].grade.tint.map(v => v * 1.6 + .25)));
      }
    });
  }
}

function classifyGesture(pose, slot, j) {
  const fw = slot.faceW, n = new THREE.Vector2(pose[0].x * W, -pose[0].y * H);
  const up = (pose[15].visibility > .5 && pose[16].visibility > .5);
  if (!up) return 'neutral';
  if (j.lw.y > n.y + fw * .4 && j.rw.y > n.y + fw * .4) return 'hands_up';
  if (Math.abs(j.lw.x - j.rw.x) > j.ls.distanceTo(j.rs) * 2.4) return 'arms_open';
  return 'neutral';
}

// ---------- 초기화 ----------
async function initVision() {
  const fs = await FilesetResolver.forVisionTasks('lib/wasm');
  const make = async d => {
    const base = path => ({ baseOptions: { modelAssetPath: path, delegate: d } });
    faceLm = await FaceLandmarker.createFromOptions(fs, { ...base('models/face_landmarker.task'), runningMode: 'VIDEO', numFaces: MAX_FACES, minFaceDetectionConfidence: .4, minFacePresenceConfidence: .4 });
    poseLm = await PoseLandmarker.createFromOptions(fs, { ...base('models/pose_landmarker_lite.task'), runningMode: 'VIDEO', numPoses: MAX_FACES, minPoseDetectionConfidence: .4 });
    // 다중 분류 모델은 CPU에서 너무 느려 사람만 가르는 가벼운 모델을 쓴다 (피부·머리 구분은 빠진다)
    segmenter = await ImageSegmenter.createFromOptions(fs, { ...base(d === 'CPU' ? 'models/selfie_segmenter.tflite' : 'models/selfie_multiclass_256x256.tflite'), runningMode: 'VIDEO', outputConfidenceMasks: true, outputCategoryMask: false });
  };
  if (FORCE_DELEGATE) { delegate = FORCE_DELEGATE; await make(delegate); return; }
  try { await make('GPU'); } catch (e) { console.warn('GPU 인식 실패, CPU로 전환', e); delegate = 'CPU'; await make('CPU'); }
}

function initScene() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
  canvas.addEventListener('webglcontextlost', () => { msg.textContent = '화면 처리가 중단됐어요. 새로고침해 주세요.'; });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.autoClear = true;
  renderer.sortObjects = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(0, W, 0, -H, 1, 8000);
  camera.position.z = 3000;
  const hemi = new THREE.HemisphereLight(0xffffff, 0x8a8078, 1.25); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff4e6, 2.1); key.position.set(.3, .6, 1); scene.add(key);
  const rim = new THREE.DirectionalLight(0xb9ccff, 1.1); rim.position.set(-.7, .3, -.5); scene.add(rim);
  scene.userData = { key, hemi, light: { value: v3(.3, .5, .8).normalize() }, ambient: { value: new THREE.Color(.55, .55, .55) } };
  const g = document.createElement('canvas'); g.width = g.height = 128;
  const x = g.getContext('2d'), rg = x.createRadialGradient(64, 64, 2, 64, 64, 64);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.18, 'rgba(255,255,255,.7)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = rg; x.fillRect(0, 0, 128, 128);
  scene.userData.glow = new THREE.CanvasTexture(g);
  const quad = (mat, order) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); m.frustumCulled = false; m.renderOrder = order; scene.add(m); return m; };
  bgUniforms.uVideo.value = videoTex();
  quad(bgMat, 0); quad(personMat, 2); quad(handMat, 5);
}

// ---------- 매 프레임 ----------
let slots = [], frameNo = 0, lastVideoT = -1, assignments = [], sessionUsed = [], fpsT = performance.now(), fpsN = 0, lastFaces = [], lastPoses = [];

function costumeFor(i) {
  if (TEST) return TEST.split(',')[i] || TEST.split(',')[0];
  if (!assignments[i]) { const c = picker.pick(sessionUsed); sessionUsed.push(c.id); assignments[i] = c.id; }
  return assignments[i];
}

function matchPose(lm, poses) {
  let best = null, d0 = 1e9;
  const nose = lm[1];
  for (const p of poses) {
    const d = Math.hypot((p[0].x - nose.x) * W, (p[0].y - nose.y) * H);
    if (d < d0) { d0 = d; best = p; }
  }
  const fw = Math.hypot((lm[454].x - lm[234].x) * W, (lm[454].y - lm[234].y) * H);
  return d0 < fw * 1.5 ? best : null;
}

function updateMask(res) {
  const m = res.confidenceMasks;
  if (!m?.length) return;
  const a = m.map(x => x.getAsFloat32Array());
  const multi = m.length >= 6;
  const mw = m[0].width, mh = m[0].height, d = maskData;
  for (let y = 0; y < 256; y++) {
    const sy = Math.min(mh - 1, y * mh / 256 | 0);
    for (let x = 0; x < 256; x++) {
      const i = sy * mw + Math.min(mw - 1, x * mw / 256 | 0), o = (y * 256 + x) * 4;
      d[o] = (multi ? 1 - a[0][i] : a[a.length - 1][i]) * 255;
      d[o + 1] = multi ? Math.max(a[2][i], a[3][i]) * 255 : 0;   // 피부
      d[o + 2] = multi ? a[1][i] * 255 : 0;                      // 머리카락
      d[o + 3] = 255;
    }
  }
  m.forEach(x => x.close());
  maskTex.needsUpdate = true;
  bgUniforms.uHasMask.value = 1;
}

function track(force = false) {
  const now = performance.now();
  if (video.currentTime === lastVideoT && !force) return;
  lastVideoT = video.currentTime;
  frameNo++;
  // CPU는 한 프레임에 하나씩만 돌려 화면이 끊기지 않게 한다
  const spread = delegate === 'CPU';
  let t = performance.now();
  if (force || !spread || frameNo % 2) {
    lastFaces = faceLm.detectForVideo(video, now).faceLandmarks || [];
    stats.face = performance.now() - t;
  }
  if (force || (spread ? frameNo % 4 === 0 : frameNo % 2 === 0)) {
    t = performance.now();
    lastPoses = poseLm.detectForVideo(video, now + .1).landmarks || [];
    stats.pose = performance.now() - t;
  }
  if (force || (spread ? frameNo % 4 === 2 : frameNo % 3 === 0)) {
    t = performance.now();
    segmenter.segmentForVideo(video, now + .2, updateMask);
    stats.seg = performance.now() - t;
  }
  const faces = [...lastFaces].sort((a, b) => a[1].x - b[1].x);
  slots.forEach((s, i) => {
    const lm = faces[i];
    s.group.visible = !!lm && !!s.costume;
    if (!lm) { bgUniforms.uSkin.value[i].w = 0; handUniforms.uHands.value[i * 2].z = 0; handUniforms.uHands.value[i * 2 + 1].z = 0; }
    if (!lm) { s.s = 0; return; }
    s.wear(costumeFor(i));
    if (!s.costume) return;
    s.updateHead(lm, force);
    s.updateBody(matchPose(lm, lastPoses));
  });
  updateLight();
  if (TEST === null) $('name').style.display = 'none';
  if (DEBUG) $('debug').textContent = `${delegate} ${W}x${H} fps ${stats.fps.toFixed(1)} 얼굴 ${lastFaces.length} (${stats.face | 0}ms) 포즈 ${lastPoses.length} (${stats.pose | 0}ms) 분할 ${stats.seg | 0}ms`;
}

// 얼굴 좌우 밝기·평균색으로 조명을 사진에 맞춘다
const probe = document.createElement('canvas'); probe.width = 16; probe.height = 12;
const probeX = probe.getContext('2d', { willReadFrequently: true });
function updateLight() {
  if (frameNo % 20) return;
  probeX.drawImage(video, 0, 0, 16, 12);
  const d = probeX.getImageData(0, 0, 16, 12).data;
  let l = 0, r = 0, R = 0, G = 0, B = 0;
  for (let y = 0; y < 12; y++) for (let x = 0; x < 16; x++) {
    const i = (y * 16 + x) * 4, v = d[i] + d[i + 1] + d[i + 2];
    if (x < 8) l += v; else r += v;
    R += d[i]; G += d[i + 1]; B += d[i + 2];
  }
  const side = Math.max(-1, Math.min(1, (r - l) / (r + l + 1) * 5));
  const n = 16 * 12 * 255;
  const amb = [R / n, G / n, B / n].map(v => Math.max(.38, Math.min(.8, Math.pow(v, 2.2) * 1.6 + .25)));
  const { key, hemi, light, ambient } = scene.userData;
  key.position.set(side * .8, .6, 1);
  light.value.set(side * .7, .5, .8).normalize();
  ambient.value.setRGB(...amb);
  hemi.color.setRGB(...amb);
}

function setGrade(id) {
  const g = byId[id].grade;
  bgUniforms.uTint.value.setRGB(...g.tint);
  bgUniforms.uDark.value = g.dark; bgUniforms.uSat.value = g.sat;
  const n = $('name'); n.textContent = byId[id].name; n.style.display = 'block';
}

function loop() {
  requestAnimationFrame(loop);
  if (video.readyState < 2 || paused) return;
  track();
  if (assignments[0] || TEST) setGrade(costumeFor(0));
  const t = performance.now();
  renderer.render(scene, camera);
  stats.draw = performance.now() - t;
  fpsN++;
  if (t - fpsT > 1000) { stats.fps = fpsN * 1000 / (t - fpsT); fpsN = 0; fpsT = t; }
}
let paused = false;

// ---------- 촬영 ----------
const sleep = ms => new Promise(r => setTimeout(r, ms));
let audio = null;
function beep(f, ms) {
  try { audio = audio || new AudioContext(); audio.resume(); const o = audio.createOscillator(), g = audio.createGain(); o.frequency.value = f; g.gain.value = .15; o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + ms / 1000); } catch { /* 소리 없음 */ }
}

async function countdown() {
  const el = $('count'); el.style.display = 'flex';
  for (const n of [3, 2, 1]) { el.textContent = n; beep(660, 120); await sleep(1000); }
  el.style.display = 'none';
}

// 4:3으로 자르고 거울처럼 뒤집어 저장한다
function grab() {
  const cw = Math.min(W, H * 4 / 3), ch = cw * 3 / 4;
  const c = document.createElement('canvas'); c.width = Math.round(cw); c.height = Math.round(ch);
  const x = c.getContext('2d');
  x.translate(c.width, 0); x.scale(-1, 1);
  x.drawImage(canvas, (W - cw) / 2, (H - ch) / 2, cw, ch, 0, 0, c.width, c.height);
  return c;
}

let cuts = [];
async function shoot() {
  $('start').disabled = true;
  cuts = []; sessionUsed = [];
  document.querySelectorAll('.slot').forEach((d, i) => { d.innerHTML = (i + 1) + '컷'; });
  for (let i = 0; i < CUTS; i++) {
    assignments = [];
    const first = costumeFor(0);
    setGrade(first);
    msg.textContent = `${i + 1}번째 컷! 포즈를 잡아 주세요`;
    await Promise.all([sleep(i ? GAP_MS : 900), loadAsset(first)]);
    for (;;) {
      await countdown();
      if (slots.some(s => s.group.visible)) break;
      msg.textContent = '얼굴이 보이지 않아요. 카메라를 보고 다시 찍을게요!';
      await sleep(1500);
    }
    beep(1320, 200);
    paused = true;
    let shot;
    try {
      try { track(true); } catch (e) { console.warn('촬영 순간 인식 실패, 직전 화면으로 찍는다', e); }
      renderer.render(scene, camera);
      shot = grab();
    } finally { paused = false; }
    $('flash').classList.remove('on'); void $('flash').offsetWidth; $('flash').classList.add('on');
    const names = slots.filter(s => s.group.visible).map(s => byId[s.costume].name);
    cuts.push({ canvas: shot, names });
    const d = $('slot' + i);
    d.innerHTML = '';
    const im = new Image(); im.src = shot.toDataURL('image/jpeg', .7); d.append(im);
    const tag = document.createElement('div'); tag.className = 'tag'; tag.textContent = names.join(' · '); d.append(tag);
  }
  await finish();
}

async function run() {
  try { await shoot(); } catch (e) {
    console.error(e);
    $('count').style.display = 'none';
    msg.textContent = '촬영 중 문제가 생겼어요: ' + e.message;
    $('start').disabled = false;
  }
}

function roundRect(x, a, b, w, h, r) { x.beginPath(); x.roundRect(a, b, w, h, r); }

const LAYOUTS = {
  '1x4': { CW: 1200, CH: 3600, cols: 1, rows: 4, pad: 60, bottom: 430 },
  '2x2': { CW: 1800, CH: 1680, cols: 2, rows: 2, pad: 50, bottom: 336 },
};

async function buildStrip(layout) {
  const { CW, CH, cols, rows, pad, bottom } = LAYOUTS[layout];
  const c = document.createElement('canvas'); c.width = CW; c.height = CH;
  const x = c.getContext('2d');
  const bg = x.createLinearGradient(0, 0, 0, CH); bg.addColorStop(0, '#22090f'); bg.addColorStop(1, '#100608');
  x.fillStyle = bg; x.fillRect(0, 0, CW, CH);
  let seed = 31; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < 240; i++) { x.fillStyle = `rgba(${150 + rnd() * 90},${110 + rnd() * 60},110,.8)`; x.beginPath(); x.arc(rnd() * CW, rnd() * CH, .7 + rnd() * 1.8, 0, 7); x.fill(); }
  const sw = Math.floor((CW - pad * (cols + 1)) / cols), sh = Math.floor((CH - pad - bottom - pad * (rows - 1)) / rows);
  cuts.forEach((cut, i) => {
    const px = pad + (i % cols) * (sw + pad), y = pad + Math.floor(i / cols) * (sh + pad);
    const k = Math.max(sw / cut.canvas.width, sh / cut.canvas.height);
    const dw = sw / k, dh = sh / k;
    x.drawImage(cut.canvas, (cut.canvas.width - dw) / 2, (cut.canvas.height - dh) / 2, dw, dh, px, y, sw, sh);
    // 사진 질감을 맞추는 미세 입자는 저장 크기에서 생략하고 테두리만 넣는다
    x.strokeStyle = '#f08422'; x.lineWidth = 3; x.strokeRect(px - 2, y - 2, sw + 4, sh + 4);
    x.font = '700 34px "Malgun Gothic","Apple SD Gothic Neo",sans-serif';
    const name = cut.names.join(' · '), tw = x.measureText(name).width;
    x.fillStyle = 'rgba(0,0,0,.65)'; roundRect(x, px + 18, y + sh - 76, tw + 36, 58, 6); x.fill();
    x.fillStyle = '#fae2be'; x.fillText(name, px + 36, y + sh - 34);
  });
  x.textAlign = 'center'; x.fillStyle = '#f08422';
  x.font = '900 112px "Malgun Gothic","Apple SD Gothic Neo",sans-serif';
  x.fillText('할로윈네컷', CW / 2, CH - bottom + 190);
  const now = new Date(), p = v => String(v).padStart(2, '0');
  x.fillStyle = '#d6c8b4'; x.font = '700 42px "Malgun Gothic","Apple SD Gothic Neo",sans-serif';
  x.fillText(`${now.getFullYear()}.${p(now.getMonth() + 1)}.${p(now.getDate())}`, CW / 2, CH - bottom + 275);
  const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', .93));
  const file = `할로윈네컷_${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}_${p(now.getHours())}${p(now.getMinutes())}${p(now.getSeconds())}.jpg`;
  return { blob, file };
}

let finalShot = null, layout = '1x4', buildNo = 0;
async function showLayout(next) {
  layout = next;
  document.querySelectorAll('#layouts button').forEach(b => b.classList.toggle('on', b.dataset.layout === next));
  const no = ++buildNo, built = await buildStrip(next);
  if (no !== buildNo) return;     // 그사이 다른 배치를 눌렀다
  finalShot = built;
  URL.revokeObjectURL($('strip').src);
  $('strip').src = URL.createObjectURL(built.blob);
}

async function finish() {
  msg.textContent = '';
  await showLayout(layout);
  $('file').textContent = '사진은 이 기기에만 있어요. 저장을 눌러 보관하세요.';
  $('result').style.display = 'flex';
  assignments = [];
}

async function save() {
  const { blob, file } = finalShot;
  const f = new File([blob], file, { type: 'image/jpeg' });
  if (navigator.canShare?.({ files: [f] }) && /iPad|iPhone|Android|Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1) {
    try { await navigator.share({ files: [f], title: '할로윈네컷' }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file; a.click();
}

function reset() {
  $('result').style.display = 'none';
  document.querySelectorAll('.slot').forEach((d, i) => { d.textContent = (i + 1) + '컷'; });
  $('start').disabled = false;
  msg.textContent = '화면에 얼굴이 보이면 바로 분장이 입혀져요.';
  assignments = [];
  costumeFor(0);
}

async function main() {
  for (let i = 0; i < CUTS; i++) { const d = document.createElement('div'); d.className = 'slot'; d.id = 'slot' + i; d.textContent = (i + 1) + '컷'; $('slots').append(d); }
  $('start').onclick = run; $('save').onclick = save; $('again').onclick = reset;
  document.querySelectorAll('#layouts button').forEach(b => { b.onclick = () => showLayout(b.dataset.layout); });
  $('debug').style.display = DEBUG ? 'block' : 'none';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { width: { ideal: MOBILE ? 960 : 1280 }, height: { ideal: MOBILE ? 720 : 960 }, facingMode: 'user' } });
    video.srcObject = stream;
    await video.play();
  } catch { msg.textContent = '카메라를 켤 수 없습니다. 브라우저의 카메라 권한을 확인해 주세요.'; return; }
  W = video.videoWidth; H = video.videoHeight;
  msg.textContent = '분장 도구를 불러오는 중... (처음 한 번만 오래 걸려요)';
  faceTopo = await (await fetch('assets/face.json')).json();
  initScene();
  [strandTex, bujeokTex] = await Promise.all([loadTex('assets/strand.webp'), loadTex('assets/bujeok.webp')]);
  await initVision();
  slots = Array.from({ length: MAX_PEOPLE }, (_, i) => new Slot(i));
  costumeFor(0);
  loop();
  msg.textContent = '화면에 얼굴이 보이면 바로 분장이 입혀져요.';
  $('start').disabled = false;
  window.__h4c = { stats, slots, get delegate() { return delegate; } };
}
main().catch(e => { console.error(e); msg.textContent = '시작에 실패했어요: ' + e.message; });
