// 다시 다듬은 모델 + 골프 모델: 실루엣을 폭신하게 부풀려서 더 장난감처럼
import { THREE, M, put, SPH, HEMI, CYL, CONE, TOR, CAP, RB, TUBE, STAR, HEART, PUFF, patternTex } from './kit.js';

const PI = Math.PI, H = PI / 2;
const WHITE = '#fffaf2', DARK = '#3b2f2f', GOLD = '#f2c14e', SILVER = '#cfd6de', WOOD = '#c98b55', PINK = '#ff9fb5';
const mirror = pts => pts.concat(pts.slice(1, -1).reverse().map(([x, y]) => [-x, y]));

// 야구공 이음매 곡선 (구 위의 두 개의 U자)
function seamPts(r, n = 120) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = i / n * PI * 2, a = 0.75, b = 0.25;
    const v = new THREE.Vector3(a * Math.cos(t) + b * Math.cos(3 * t), a * Math.sin(t) - b * Math.sin(3 * t), 2 * Math.sqrt(a * b) * Math.sin(2 * t));
    out.push(v.normalize().multiplyScalar(r));
  }
  return out;
}

export function extra() {
  const X = {};

  X.baseball = c => {
    const g = new THREE.Group(), r = 0.42, red = c[0] || '#e63946';
    put(g, M(SPH(r, 32, 22), WHITE), 0, r, 0);
    const pts = seamPts(r * 1.005);
    const curve = new THREE.CatmullRomCurve3(pts, true);
    put(g, M(new THREE.TubeGeometry(curve, 160, 0.008, 6, true), '#d9cfc0', { ol: false }), 0, r, 0);
    // 바늘땀: 이음매를 따라 V자 빨간 실
    for (let i = 0; i < 44; i++) {
      const u = i / 44, p = curve.getPointAt(u), tng = curve.getTangentAt(u), nrm = p.clone().normalize(), side = new THREE.Vector3().crossVectors(tng, nrm).normalize();
      [-1, 1].forEach(s => {
        const m = M(CAP(0.007, 0.045), red, { ol: false });
        const dir = side.clone().multiplyScalar(s).addScaledVector(tng, 0.55).normalize();
        m.position.copy(p).addScaledVector(side, s * 0.022).addScaledVector(nrm, 0.004); m.position.y += r;
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); g.add(m);
      });
    }
    g.rotation.set(0.4, 0.6, 0.2); return g;
  };

  // 운동화: 옆모습 실루엣으로 윗부분과 밑창을 따로 부풀림
  X.shoe = c => {
    const g = new THREE.Group(), a = c[0] || '#ef476f', b = c[1] || WHITE;
    put(g, M(PUFF('shoeUp', [[-0.44, 0.1], [-0.5, 0.3], [-0.47, 0.52], [-0.32, 0.56], [-0.18, 0.48], [-0.04, 0.55], [0.12, 0.44], [0.3, 0.32], [0.46, 0.22], [0.52, 0.12], [0.42, 0.08], [0, 0.08]], 0.2, 0.09), a), 0, 0, 0);
    put(g, M(PUFF('shoeSole', [[-0.53, 0.0], [-0.56, 0.08], [-0.52, 0.15], [-0.1, 0.13], [0.42, 0.14], [0.58, 0.1], [0.56, 0.01], [0, -0.01]], 0.3, 0.035), b), 0, 0, 0);
    put(g, M(PUFF('shoeToe', [[0.22, 0.1], [0.3, 0.24], [0.47, 0.2], [0.55, 0.12], [0.45, 0.09]], 0.26, 0.05), b), 0.0, 0.0, 0);
    [-1, 1].forEach(s => put(g, M(TUBE('shoeStripe', [[-0.36, 0.2, 0], [-0.16, 0.28, 0], [0.06, 0.24, 0], [0.24, 0.18, 0]], 0.022), c[2] || '#4cc9f0', { ol: false }), 0, 0, s * 0.19));
    for (let i = 0; i < 4; i++) { const x = -0.08 + i * 0.1, y = 0.53 - i * 0.065; put(g, M(CAP(0.022, 0.2), WHITE), x, y, 0, H, 0, 0); }
    put(g, M(RB(0.1, 0.16, 0.12, 0.4), c[2] || '#4cc9f0'), -0.49, 0.5, 0);
    g.rotation.y = 0.2; return g;
  };

  // 벙어리장갑 한 켤레 (끈으로 이어짐)
  X.mitten = c => {
    const g = new THREE.Group(), a = c[0] || '#e63946', b = c[1] || WHITE;
    const shape = [[-0.21, 0.02], [-0.25, 0.35], [-0.23, 0.6], [-0.13, 0.77], [0.02, 0.81], [0.15, 0.75], [0.21, 0.6], [0.22, 0.46], [0.3, 0.43], [0.39, 0.47], [0.43, 0.37], [0.35, 0.24], [0.22, 0.17], [0.2, 0.02]];
    [-1, 1].forEach(s => {
      const m = new THREE.Group();
      put(m, M(PUFF('mit', shape, 0.1, 0.1), a), 0, 0.12, 0);
      put(m, M(PUFF('mitCuff', [[-0.27, -0.1], [0.27, -0.1], [0.27, 0.12], [-0.27, 0.12]], 0.14, 0.07, false), b, { map: patternTex('stripe', b, '#e9e1d4', 3) }), 0, 0.05, 0);
      put(m, M(HEART(0.09, 0.03), b), 0, 0.55, 0.15);
      put(g, m, s * 0.33, 0, 0, 0, s < 0 ? PI : 0, s * -0.12);
    });
    put(g, M(TUBE('mitStr', [[-0.33, 0.0, 0], [-0.2, -0.25, 0.1], [0.2, -0.25, 0.1], [0.33, 0.0, 0]], 0.015), b, { ol: false }), 0, 0, 0);
    return g;
  };

  // 야구 글러브
  X.glove = c => {
    const g = new THREE.Group(), a = c[0] || '#b5651d', lace = '#e9c46a';
    put(g, M(PUFF('glove', [[-0.33, 0], [-0.42, 0.3], [-0.41, 0.56], [-0.37, 0.72], [-0.29, 0.71], [-0.24, 0.52], [-0.21, 0.76], [-0.14, 0.87], [-0.05, 0.85], [-0.04, 0.56], [0.0, 0.82], [0.07, 0.9], [0.15, 0.87], [0.14, 0.56], [0.18, 0.74], [0.25, 0.8], [0.31, 0.74], [0.3, 0.46], [0.42, 0.42], [0.55, 0.35], [0.55, 0.22], [0.38, 0.1], [0.28, 0]], 0.18, 0.08), a), 0, 0.05, 0);
    put(g, M(PUFF('gloveWeb', [[0.28, 0.48], [0.44, 0.44], [0.5, 0.33], [0.36, 0.3]], 0.06, 0.03), '#8d4f1d'), 0, 0.05, 0.08);
    put(g, M(SPH(0.24, 20, 14), '#d48a4a', { ol: false }), 0, 0.35, 0.13, 0, 0, 0, [1, 1, 0.25]);
    [-0.25, -0.08, 0.1, 0.25].forEach(x => put(g, M(TUBE('gl' + x, [[x - 0.03, 0.7, 0.13], [x + 0.03, 0.62, 0.15], [x - 0.03, 0.55, 0.15]], 0.012), lace, { ol: false }), 0, 0.05, 0));
    g.rotation.y = -0.3; return g;
  };

  // 양말 (크리스마스 양말 겸용)
  X.sock = c => {
    const g = new THREE.Group(), a = c[0] || '#e63946', b = c[1] || WHITE;
    put(g, M(PUFF('sock', [[-0.2, 0.92], [0.2, 0.92], [0.21, 0.42], [0.27, 0.27], [0.46, 0.21], [0.58, 0.12], [0.54, 0.0], [0.3, -0.05], [0.02, -0.05], [-0.19, 0.06], [-0.22, 0.32]], 0.16, 0.09), a, { map: patternTex('stripe', a, shade(a), 3) }), 0, 0, 0);
    put(g, M(PUFF('sockCuff', [[-0.27, 0.8], [0.27, 0.8], [0.27, 1.06], [-0.27, 1.06]], 0.24, 0.07, false), b), 0, 0, 0);
    put(g, M(PUFF('sockToe', [[0.32, -0.03], [0.55, 0.0], [0.58, 0.12], [0.46, 0.2], [0.36, 0.1]], 0.2, 0.06), b), 0, 0, 0);
    put(g, M(PUFF('sockHeel', [[-0.19, 0.06], [0.0, -0.04], [0.06, 0.1], [-0.12, 0.2], [-0.21, 0.2]], 0.2, 0.06), b), 0, 0, 0);
    put(g, M(TOR(0.07, 0.022), b), -0.22, 1.1, 0, 0, H, 0);
    g.rotation.y = -0.35; return g;
  };

  // 스웨터 (눈꽃 무늬 띠 + 고무단)
  X.sweater = c => {
    const g = new THREE.Group(), a = c[0] || '#e63946', b = c[1] || WHITE;
    const body = [[-0.16, 0.72], [-0.38, 0.66], [-0.66, 0.36], [-0.56, 0.24], [-0.38, 0.4], [-0.36, 0.06], [0.36, 0.06], [0.38, 0.4], [0.56, 0.24], [0.66, 0.36], [0.38, 0.66], [0.16, 0.72], [0.0, 0.64]];
    put(g, M(PUFF('sweater', body, 0.18, 0.09, false), a), 0, 0, 0);
    put(g, M(PUFF('swBand', [[-0.37, 0.3], [0.37, 0.3], [0.37, 0.44], [-0.37, 0.44]], 0.2, 0.06, false), b, { map: patternTex('stars', b, a, 2) }), 0, 0, 0.0);
    put(g, M(PUFF('swHem', [[-0.37, -0.02], [0.37, -0.02], [0.37, 0.1], [-0.37, 0.1]], 0.22, 0.06, false), shade(a)), 0, 0, 0);
    [-1, 1].forEach(s => put(g, M(CAP(0.07, 0.1), shade(a)), s * 0.62, 0.29, 0, 0, 0, s * -0.85));
    put(g, M(TOR(0.13, 0.05), shade(a)), 0, 0.68, 0, H, 0, 0, [1.2, 1, 1]);
    return g;
  };

  // 핸드백
  X.bag = c => {
    const g = new THREE.Group(), a = c[0] || '#ff8fab', b = c[1] || '#ffc8dd';
    put(g, M(PUFF('bag', [[-0.42, 0.0], [0.42, 0.0], [0.36, 0.5], [-0.36, 0.5]], 0.22, 0.1, false), a), 0, 0.02, 0);
    put(g, M(PUFF('bagFlap', [[-0.38, 0.5], [0.38, 0.5], [0.3, 0.26], [0, 0.18], [-0.3, 0.26]], 0.06, 0.04, false), b), 0, 0.04, 0.17);
    put(g, M(TOR(0.24, 0.035, PI), b), 0, 0.6, 0); put(g, M(SPH(0.05), GOLD), 0, 0.24, 0.24);
    return g;
  };

  // 뼈다귀
  X.bone = c => {
    const g = new THREE.Group();
    put(g, M(PUFF('bone', [[-0.3, 0.07], [-0.4, 0.17], [-0.52, 0.14], [-0.53, 0.0], [-0.52, -0.14], [-0.4, -0.17], [-0.3, -0.07], [0.3, -0.07], [0.4, -0.17], [0.52, -0.14], [0.53, 0.0], [0.52, 0.14], [0.4, 0.17], [0.3, 0.07]], 0.12, 0.08), c[0] || '#fff3dc'), 0, 0.25, 0, 0, 0, 0.15);
    return g;
  };

  // 물고기
  X.fish = c => {
    const g = new THREE.Group(), a = c[0] || '#ff8c42', b = c[1] || '#ffd166';
    put(g, M(PUFF('fish', [[0.52, 0.0], [0.4, 0.19], [0.1, 0.27], [-0.2, 0.18], [-0.36, 0.05], [-0.56, 0.24], [-0.6, 0.12], [-0.52, 0.0], [-0.6, -0.12], [-0.56, -0.24], [-0.36, -0.05], [-0.2, -0.18], [0.1, -0.27], [0.4, -0.19]], 0.16, 0.1), a), 0, 0.4, 0);
    put(g, M(PUFF('fishFin', [[-0.1, 0.22], [0.05, 0.4], [0.18, 0.25]], 0.04, 0.04), b), 0, 0.4, 0);
    put(g, M(PUFF('fishBand', [[-0.05, 0.25], [0.06, 0.26], [0.08, -0.26], [-0.04, -0.24]], 0.3, 0.03), b), 0, 0.4, 0);
    [-1, 1].forEach(s => { put(g, M(SPH(0.06), WHITE, { ol: false }), 0.3, 0.46, s * 0.15, 0, 0, 0, [1, 1, 0.5]); put(g, M(SPH(0.032), DARK, { ol: false }), 0.32, 0.46, s * 0.175); put(g, M(SPH(0.03), PINK, { ol: false }), 0.24, 0.36, s * 0.16, 0, 0, 0, [1, 0.6, 0.4]); });
    g.rotation.y = -0.35; return g;
  };

  // 기타
  X.guitar = c => {
    const g = new THREE.Group(), a = c[0] || '#e76f51', w = c[1] || WOOD;
    put(g, M(PUFF('guitar', mirror([[0, 0.0], [0.22, 0.04], [0.32, 0.22], [0.28, 0.44], [0.18, 0.53], [0.22, 0.66], [0.2, 0.82], [0.08, 0.9], [0, 0.9]]), 0.14, 0.06), a), 0, 0, 0);
    put(g, M(CYL(0.09, 0.09, 0.03, 24), DARK, { ol: false }), 0, 0.56, 0.12, H);
    put(g, M(RB(0.18, 0.05, 0.04, 0.3), DARK), 0, 0.25, 0.12);
    put(g, M(RB(0.1, 0.7, 0.06, 0.2), w), 0, 1.22, 0.03); put(g, M(RB(0.16, 0.2, 0.07, 0.25), w), 0, 1.63, 0.03);
    for (let i = 0; i < 4; i++) put(g, M(CYL(0.004, 0.004, 1.3, 4), '#eeeeee', { ol: false }), -0.03 + i * 0.02, 0.92, 0.12);
    g.rotation.z = 0.3; return g;
  };

  // ---------- 골프 ----------
  X.golfball = c => { const g = new THREE.Group(); put(g, M(SPH(0.4, 32, 22), WHITE, { map: patternTex('dots', '#ffffff', '#e4e4ea', 8) }), 0, 0.4, 0); put(g, M(SPH(0.06), c[0] || '#e63946', { ol: false }), 0.15, 0.62, 0.28, 0, 0, 0, [1, 1, 0.3]); return g; };
  X.tee = c => { const g = new THREE.Group(), a = c[0] || '#ffd166'; put(g, M(CYL(0.03, 0.012, 0.7), a), 0, 0.35, 0); put(g, M(CYL(0.12, 0.035, 0.1, 16), a), 0, 0.74, 0); const b = X.golfball([]); put(g, b, 0, 0.74, 0, 0, 0, 0, 0.45); return g; };
  X.golfclub = c => {
    const g = new THREE.Group(), a = c[0] || '#1d3557';
    put(g, M(CYL(0.018, 0.022, 1.4, 10), SILVER), 0, 0.85, 0, 0, 0, 0.12);
    put(g, M(CYL(0.032, 0.03, 0.34, 12), DARK), -0.155, 1.4, 0, 0, 0, 0.12);
    put(g, M(PUFF('driver', [[-0.08, 0.0], [0.42, -0.03], [0.56, 0.12], [0.44, 0.3], [0.1, 0.28], [-0.06, 0.13]], 0.3, 0.09), a), 0.04, 0.06, 0, 0, 0, 0);
    put(g, M(RB(0.05, 0.24, 0.34, 0.3), SILVER), 0.62, 0.2, 0);
    put(g, M(STAR(5, 0.06, 0.025, 0.02), c[1] || '#ffd166', { ol: false }), 0.28, 0.2, 0.25);
    g.rotation.y = -0.6; return g;
  };
  X.putter = c => { const g = new THREE.Group(); put(g, M(CYL(0.018, 0.02, 1.3, 10), SILVER), 0, 0.75, 0, 0, 0, 0.08); put(g, M(CYL(0.032, 0.03, 0.32, 12), c[1] || '#e63946'), -0.09, 1.28, 0, 0, 0, 0.08);
    put(g, M(RB(0.42, 0.1, 0.14, 0.3), c[0] || SILVER), 0.12, 0.06, 0); put(g, M(RB(0.2, 0.02, 0.02), WHITE, { ol: false }), 0.12, 0.115, 0.04); g.rotation.y = -0.5; return g; };
  X.iron = c => { const g = new THREE.Group(); put(g, M(CYL(0.018, 0.02, 1.3, 10), SILVER), 0, 0.78, 0, 0, 0, 0.15); put(g, M(CYL(0.032, 0.03, 0.32, 12), DARK), -0.18, 1.3, 0, 0, 0, 0.15);
    put(g, M(PUFF('iron', [[0, 0.02], [0.32, 0.0], [0.36, 0.18], [0.04, 0.12]], 0.05, 0.03, false), c[0] || SILVER), 0.06, 0.04, 0); for (let i = 0; i < 4; i++) put(g, M(RB(0.22, 0.008, 0.01), '#9aa5b1', { ol: false }), 0.28, 0.08 + i * 0.03, 0.06); g.rotation.y = -0.5; return g; };
  X.golfflag = c => { const g = new THREE.Group(); put(g, M(CYL(0.5, 0.52, 0.08, 32), '#80b918'), 0, 0.04, 0); put(g, M(CYL(0.1, 0.1, 0.085, 20), DARK, { ol: false }), 0.05, 0.045, 0);
    put(g, M(CYL(0.018, 0.018, 1.2, 8), WHITE), 0.05, 0.64, 0); put(g, M(PUFF('flag', [[0, 0], [0.38, -0.1], [0, -0.22]], 0.02, 0.02, false), c[0] || '#e63946'), 0.06, 1.22, 0);
    const b = X.golfball([]); put(g, b, -0.25, 0.08, 0.2, 0, 0, 0, 0.25); return g; };
  X.golfbag = c => { const g = new THREE.Group(), a = c[0] || '#2a9d8f', b = c[1] || WHITE;
    put(g, M(CYL(0.22, 0.2, 0.9, 20), a), 0, 0.5, 0); put(g, M(CYL(0.24, 0.24, 0.1, 20), b), 0, 0.96, 0); put(g, M(CYL(0.23, 0.23, 0.08, 20), b), 0, 0.08, 0);
    put(g, M(RB(0.24, 0.4, 0.12, 0.4), b), 0, 0.5, 0.2); put(g, M(TUBE('bagStrap', [[-0.2, 0.85, -0.05], [-0.32, 0.5, -0.12], [-0.2, 0.2, -0.05]], 0.03), DARK, { ol: false }), 0, 0, 0);
    [[-0.08, 0.04, '#1d3557'], [0.07, 0.07, SILVER], [0.0, -0.08, '#e63946']].forEach(([x, z, col], i) => { put(g, M(CYL(0.012, 0.012, 0.3), SILVER), x, 1.12, z); put(g, M(SPH(0.07), col), x + 0.03, 1.28 + i * 0.03, z, 0, 0, 0, [1.4, 0.8, 1]); });
    [-1, 1].forEach(s => put(g, M(CYL(0.012, 0.012, 0.7), SILVER), s * 0.12, 0.38, -0.22, -0.3, 0, s * 0.1)); g.rotation.z = 0.08; return g; };
  X.visor = c => { const g = new THREE.Group(); put(g, M(HEMI(0.38), c[0] || WHITE), 0, 0.05, 0, 0, 0, 0, [1, 0.75, 1]); put(g, M(SPH(0.3), c[1] || '#2a9d8f'), 0, 0.06, 0.38, 0, 0, 0, [1.1, 0.08, 0.8]);
    put(g, M(SPH(0.05), c[1] || '#2a9d8f'), 0, 0.33, 0); return g; };
  X.golfglove = c => { const g = new THREE.Group(); const gl = X.glove([c[0] || WHITE]); put(g, gl, 0, 0, 0, 0, 0, 0, [0.85, 1, 0.6]); put(g, M(RB(0.3, 0.1, 0.05, 0.4), c[1] || '#2a9d8f'), 0, 0.1, 0.08); return g; };
  X.golfmat = c => { const g = new THREE.Group(); put(g, M(RB(1.1, 0.06, 0.6, 0.3), '#80b918', { map: patternTex('stripe', '#80b918', '#72a815', 4) }), 0, 0.03, 0); const t = X.tee(['#ffd166']); put(g, t, 0.2, 0.06, 0, 0, 0, 0, 0.3); put(g, M(RB(0.3, 0.02, 0.05), WHITE, { ol: false }), -0.25, 0.065, 0.15); return g; };
  X.golfcart = c => { const g = new THREE.Group(), a = c[0] || WHITE;
    put(g, M(RB(0.9, 0.24, 0.52, 0.3), a), 0, 0.28, 0); put(g, M(RB(0.3, 0.3, 0.5, 0.3), c[1] || '#2a9d8f'), -0.12, 0.5, 0);
    [-0.38, 0.32].forEach(x => [-1, 1].forEach(s => put(g, M(CYL(0.02, 0.02, 0.62), SILVER), x, 0.68, s * 0.22)));
    put(g, M(RB(1.0, 0.06, 0.62, 0.3), c[1] || '#2a9d8f'), -0.03, 1.0, 0);
    [-0.3, 0.3].forEach(x => [-0.27, 0.27].forEach(z => { put(g, M(CYL(0.12, 0.12, 0.08), DARK), x, 0.12, z, H); put(g, M(CYL(0.06, 0.06, 0.09), SILVER, { ol: false }), x, 0.12, z, H); }));
    const bag = X.golfbag(['#e63946']); put(g, bag, -0.48, 0.3, 0, 0, 0, -0.5, 0.45); g.rotation.y = -0.6; return g; };

  return X;
}
function shade(hex) { const c = new THREE.Color(hex); c.offsetHSL(0, 0, -0.07); return '#' + c.getHexString(); }
