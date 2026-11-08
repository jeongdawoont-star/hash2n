// 아이템 모델 모음: build(kind, colors) → THREE.Group
// 모두 기본 도형 조합. 색은 colors[0], [1], [2] 순서로 바꿀 수 있다.
import { THREE, M, put, SPH, HEMI, CYL, CONE, TOR, CAP, OCT, ICO, RB, LATHE, STAR, HEART, POLY, TUBE, patternTex, tmat } from './kit.js';

const PI = Math.PI, H = PI / 2;
const WHITE = '#fffaf2', DARK = '#3b2f2f', GOLD = '#f2c14e', SILVER = '#cfd6de', WOOD = '#c98b55', GLASS = '#bfe6ff', PINK = '#ff9fb5';

function eyes(g, y, z, sp = 0.09, r = 0.035) {
  put(g, M(SPH(r), DARK, { ol: false }), -sp, y, z); put(g, M(SPH(r), DARK, { ol: false }), sp, y, z);
}
function blush(g, y, z, sp = 0.16) {
  put(g, M(SPH(0.04), PINK, { ol: false }), -sp, y, z, 0, 0, 0, [1, 0.6, 0.3]);
  put(g, M(SPH(0.04), PINK, { ol: false }), sp, y, z, 0, 0, 0, [1, 0.6, 0.3]);
}
function wheel(g, x, y, z, r = 0.14, w = 0.1, rot = H) {
  put(g, M(CYL(r, r, w), '#3d3a40'), x, y, z, rot, 0, 0); put(g, M(CYL(r * 0.45, r * 0.45, w * 1.1), SILVER, { ol: false }), x, y, z, rot, 0, 0);
}

// 동물 인형 (dog, cat, bear, bunny, ham, deer, pig, chick, unicorn, dino)
function plush(c, type) {
  const g = new THREE.Group(), a = c[0], b = c[1] || WHITE;
  if (type === 'dino') {
    put(g, M(CAP(0.26, 0.45), a), 0, 0.36, 0, 0, 0, H);
    put(g, M(SPH(0.24), a), 0.42, 0.66, 0); put(g, M(CAP(0.11, 0.28), a), 0.32, 0.5, 0, 0, 0, -0.6);
    put(g, M(CONE(0.15, 0.5), a), -0.6, 0.32, 0, 0, 0, H + 0.3);
    for (let i = 0; i < 4; i++) put(g, M(CONE(0.07, 0.15, 4), b), -0.3 + i * 0.18, 0.62 - Math.abs(i - 1.5) * 0.03, 0);
    [[-0.18, 0.12], [0.18, 0.12], [-0.18, -0.12], [0.18, -0.12]].forEach(([x, z]) => put(g, M(CYL(0.08, 0.09, 0.22), a), x, 0.11, z));
    put(g, M(SPH(0.03), DARK, { ol: false }), 0.56, 0.74, 0.14); put(g, M(SPH(0.03), DARK, { ol: false }), 0.56, 0.74, -0.14);
    g.rotation.y = -0.5; return g;
  }
  put(g, M(SPH(0.32), a), 0, 0.3, 0, 0, 0, 0, [1, 0.92, 0.9]);
  put(g, M(SPH(0.2), b), 0, 0.28, 0.17, 0, 0, 0, [1, 1, 0.5]);
  const hy = 0.74; put(g, M(SPH(0.27), a), 0, hy, 0.02);
  [-1, 1].forEach(s => {
    put(g, M(SPH(0.1), a), s * 0.22, 0.08, 0.12); // 발
    put(g, M(CAP(0.07, 0.12), a), s * 0.3, 0.36, 0.08, 0.3, 0, s * 0.5); // 팔
    if (type === 'dog') put(g, M(SPH(0.11), c[2] || b), s * 0.27, hy + 0.02, 0, 0, 0, s * 0.3, [0.6, 1.3, 0.8]);
    if (type === 'cat') { put(g, M(CONE(0.1, 0.18, 4), a), s * 0.16, hy + 0.26, 0, 0, PI / 4, s * -0.25); }
    if (type === 'bear' || type === 'ham' || type === 'pig') put(g, M(SPH(type === 'ham' ? 0.06 : 0.08), a), s * 0.19, hy + 0.22, 0);
    if (type === 'bunny') { put(g, M(CAP(0.06, 0.26), a), s * 0.1, hy + 0.38, 0, 0, 0, s * -0.12); put(g, M(CAP(0.035, 0.18), PINK, { ol: false }), s * 0.1, hy + 0.38, 0.04, 0, 0, s * -0.12); }
    if (type === 'deer') { put(g, M(CYL(0.025, 0.03, 0.26), WOOD), s * 0.13, hy + 0.32, 0, 0, 0, s * -0.4); put(g, M(CYL(0.02, 0.025, 0.12), WOOD), s * 0.2, hy + 0.36, 0, 0, 0, s * 0.6); put(g, M(SPH(0.06), a), s * 0.25, hy + 0.08, 0, 0, 0, 0, [1.3, 0.7, 0.7]); }
    if (type === 'chick') put(g, M(SPH(0.07), a), s * 0.31, 0.38, 0, 0, 0, s * 0.8, [1.6, 0.6, 1]);
  });
  if (type === 'unicorn') { put(g, M(CONE(0.06, 0.28), GOLD), 0, hy + 0.32, 0.08, 0.3); put(g, M(SPH(0.09), b), 0, hy + 0.18, -0.12, 0, 0, 0, [1, 1.4, 1]); }
  if (type === 'chick') put(g, M(CONE(0.05, 0.1), '#ff9b3d'), 0, hy - 0.04, 0.29, H);
  else if (type === 'pig') put(g, M(CYL(0.08, 0.08, 0.06), PINK), 0, hy - 0.06, 0.27, H);
  else put(g, M(SPH(0.09), b), 0, hy - 0.06, 0.22, 0, 0, 0, [1.2, 0.85, 1]);
  if (type !== 'chick' && type !== 'pig') put(g, M(SPH(0.035), DARK, { ol: false }), 0, hy - 0.02, 0.31);
  eyes(g, hy + 0.06, 0.25); blush(g, hy - 0.04, 0.22, 0.17);
  if (type === 'cat' || type === 'dog') put(g, M(CAP(0.04, 0.2), a), 0.05, 0.25, -0.33, -0.8);
  return g;
}

function box3(c) { // 작은 선물 상자
  const g = new THREE.Group();
  put(g, M(RB(0.8, 0.6, 0.8, 0.15), c[0]), 0, 0.3, 0);
  put(g, M(RB(0.86, 0.16, 0.86, 0.15), c[0]), 0, 0.62, 0);
  put(g, M(RB(0.16, 0.66, 0.84, 0.2), c[1] || GOLD), 0, 0.34, 0); put(g, M(RB(0.84, 0.66, 0.16, 0.2), c[1] || GOLD), 0, 0.34, 0);
  [-1, 1].forEach(s => put(g, M(TOR(0.11, 0.045), c[1] || GOLD), s * 0.12, 0.78, 0, 0, s * 0.4, 0));
  return g;
}

const B = {
  // ----- 강아지·고양이·동물 -----
  dog: c => plush([c[0] || '#e8c08a', c[1] || WHITE, c[2] || '#9a6a45'], 'dog'),
  cat: c => plush([c[0] || '#f2a65a', c[1] || WHITE], 'cat'),
  bear: c => plush([c[0] || '#b07a52', c[1] || '#f3d9b8'], 'bear'),
  bunny: c => plush([c[0] || '#ffffff', c[1] || '#ffe3ea'], 'bunny'),
  ham: c => plush([c[0] || '#f5c27a', c[1] || WHITE], 'ham'),
  deer: c => plush([c[0] || '#b9824f', c[1] || '#f3dcc0'], 'deer'),
  pig: c => plush([c[0] || '#ffb8c6', c[1] || '#ffd8e0'], 'pig'),
  chick: c => plush([c[0] || '#ffe066', c[1] || '#fff3b0'], 'chick'),
  unicorn: c => plush([c[0] || '#ffffff', c[1] || '#c9a7ff'], 'unicorn'),
  dino: c => plush([c[0] || '#7fd17f', c[1] || '#ffd166'], 'dino'),
  bone: c => { const g = new THREE.Group(), a = c[0] || '#fff3dc'; put(g, M(CYL(0.09, 0.09, 0.8), a), 0, 0.15, 0, 0, 0, H);
    [[-0.42, 0.08], [-0.42, -0.08], [0.42, 0.08], [0.42, -0.08]].forEach(([x, z]) => put(g, M(SPH(0.12), a), x, 0.15, z)); return g; },
  bowl: c => { const g = new THREE.Group(); put(g, M(LATHE('bowl', [[0.3, 0], [0.42, 0.04], [0.48, 0.3], [0.42, 0.3], [0.36, 0.08], [0, 0.08]]), c[0] || '#ff6b6b'), 0, 0, 0);
    for (let i = 0; i < 9; i++) put(g, M(SPH(0.07), c[1] || '#b9824f', { ol: false }), Math.cos(i * 2.4) * 0.22 * (i % 3) / 2, 0.22, Math.sin(i * 2.4) * 0.22 * (i % 3) / 2); return g; },
  collar: c => { const g = new THREE.Group(); put(g, M(TOR(0.4, 0.07), c[0] || '#e84a5f'), 0, 0.45, 0); put(g, M(SPH(0.1), c[1] || GOLD), 0, 0.02, 0.04);
    put(g, M(CYL(0.08, 0.08, 0.03), c[1] || GOLD), 0, -0.12, 0.04, H); return g; },
  doghouse: c => { const g = new THREE.Group(); put(g, M(RB(0.9, 0.7, 0.9, 0.12), c[0] || '#e8a15a'), 0, 0.35, 0);
    put(g, M(CYL(0.62, 0.62, 1.0, 3), c[1] || '#d9534f'), 0, 0.9, 0, 0, 0, H, [1, 1, 0.55]);
    put(g, M(CAP(0.18, 0.2), DARK, { ol: false }), 0, 0.28, 0.42, 0, 0, 0, [1, 1, 0.2]); put(g, M(RB(0.3, 0.12, 0.04), WHITE), 0, 0.62, 0.46); return g; },
  paw: c => { const g = new THREE.Group(); put(g, M(CYL(0.45, 0.45, 0.06, 28), c[0] || WHITE), 0, 0.03, 0, 0, 0, 0);
    const p = c[1] || '#e88aa0'; put(g, M(SPH(0.16), p), 0, 0.07, 0.06, 0, 0, 0, [1.1, 0.3, 0.9]);
    [[-0.2, -0.14], [-0.07, -0.24], [0.07, -0.24], [0.2, -0.14]].forEach(([x, z]) => put(g, M(SPH(0.07), p), x, 0.07, z, 0, 0, 0, [1, 0.3, 1.1]));
    g.rotation.x = 1.1; return g; },
  cushion: c => { const g = new THREE.Group(); put(g, M(RB(1, 0.32, 0.8, 0.5), c[0] || '#8ecae6', { map: patternTex('check', c[0] || '#8ecae6', c[1] || '#bde0fe', 2) }), 0, 0.16, 0); return g; },
  yarn: c => { const g = new THREE.Group(), a = c[0] || '#ff7aa2'; put(g, M(SPH(0.4), a), 0, 0.4, 0);
    for (let i = 0; i < 4; i++) put(g, M(TOR(0.4, 0.03), c[1] || '#ff4f86', { ol: false }), 0, 0.4, 0, i * 0.8, i * 0.6, 0);
    put(g, M(TUBE('yarnTail', [[0.3, 0.2, 0.2], [0.6, 0.05, 0.3], [0.8, 0.03, 0]], 0.03), a), 0, 0, 0); return g; },
  mousetoy: c => { const g = new THREE.Group(), a = c[0] || '#b8b8c8'; put(g, M(SPH(0.3), a), 0, 0.22, 0, 0, 0, 0, [1.4, 0.8, 1]);
    [-1, 1].forEach(s => put(g, M(SPH(0.1), PINK), 0.3, 0.42, s * 0.12, 0, 0, 0, [0.4, 1, 1])); put(g, M(SPH(0.03), DARK, { ol: false }), 0.42, 0.3, 0.1); put(g, M(SPH(0.03), DARK, { ol: false }), 0.42, 0.3, -0.1);
    put(g, M(TUBE('mtail', [[-0.4, 0.2, 0], [-0.6, 0.3, 0.1], [-0.75, 0.15, 0.2]], 0.025), PINK), 0, 0, 0); return g; },
  feather: c => { const g = new THREE.Group(); put(g, M(CYL(0.03, 0.03, 1.1), c[1] || WOOD), 0, 0.55, 0, 0, 0, 0.5);
    [0, 1, 2].forEach(i => put(g, M(SPH(0.12), [c[0] || '#ff6fa8', '#7bdff2', '#ffd166'][i]), -0.32 - i * 0.05, 1.0 + i * 0.08, (i - 1) * 0.08, 0, 0, 0.7, [0.6, 1.8, 0.4])); return g; },
  fishtoy: c => B.fish([c[0] || '#ffd166', c[1] || '#ff8c42']),
  brush: c => { const g = new THREE.Group(); put(g, M(RB(0.9, 0.16, 0.36, 0.4), c[0] || '#ff9f1c'), 0, 0.3, 0);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) put(g, M(CYL(0.025, 0.025, 0.16, 6), WHITE, { ol: false }), -0.3 + i * 0.12, 0.17, -0.07 + j * 0.14);
    put(g, M(CAP(0.07, 0.5), c[0] || '#ff9f1c'), 0.62, 0.3, 0, 0, 0, H); return g; },
  leash: c => { const g = new THREE.Group(); put(g, M(TUBE('leash', [[-0.5, 0.05, 0], [-0.2, 0.3, 0.2], [0.2, 0.1, -0.2], [0.5, 0.4, 0]], 0.05), c[0] || '#4cc9f0'), 0, 0, 0);
    put(g, M(TOR(0.15, 0.05), c[0] || '#4cc9f0'), 0.6, 0.5, 0); put(g, M(CYL(0.05, 0.05, 0.12), SILVER), -0.55, 0.05, 0, 0, 0, H); return g; },
  cage: c => { const g = new THREE.Group(); put(g, M(RB(1, 0.16, 0.7, 0.3), c[0] || '#ff8fab'), 0, 0.08, 0);
    for (let i = 0; i < 7; i++) put(g, M(CYL(0.015, 0.015, 0.6, 6), SILVER), -0.45 + i * 0.15, 0.45, 0.32); put(g, M(HEMI(0.5), c[0] || '#ff8fab'), 0, 0.75, 0, 0, 0, 0, [1, 0.3, 0.7]);
    put(g, M(TOR(0.16, 0.03), c[1] || '#ffd166'), 0.15, 0.35, 0, 0, H, 0); return g; },
  wheelrun: c => { const g = new THREE.Group(); put(g, M(TOR(0.4, 0.05), c[0] || '#7bdff2'), 0, 0.5, 0); put(g, M(CYL(0.4, 0.4, 0.04, 24), c[1] || '#caf0f8', { op: 0.7 }), 0, 0.5, -0.05, H);
    put(g, M(CYL(0.04, 0.04, 0.5), SILVER), 0, 0.25, -0.1); put(g, M(RB(0.5, 0.06, 0.3), c[0] || '#7bdff2'), 0, 0.03, -0.1); return g; },
  carrot: c => { const g = new THREE.Group(); put(g, M(CONE(0.14, 0.7), c[0] || '#ff8c42'), 0, 0.35, 0, PI); [-0.3, 0, 0.3].forEach(r => put(g, M(SPH(0.06), '#52b788'), r * 0.2, 0.78, 0, 0, 0, r, [0.6, 2, 0.6])); g.rotation.z = 1.2; return g; },
  egg: c => { const g = new THREE.Group(); put(g, M(SPH(0.4), c[0] || '#f6f1d1'), 0, 0.5, 0, 0, 0, 0, [1, 1.3, 1]);
    [[0.25, 0.6, 0.25], [-0.3, 0.4, 0.2], [0.05, 0.8, -0.32], [0.35, 0.35, -0.1]].forEach(p => put(g, M(SPH(0.08), c[1] || '#90be6d', { ol: false }), p[0], p[1], p[2], 0, 0, 0, [1, 1, 0.4])); return g; },
  footprint: c => { const g = new THREE.Group(); put(g, M(SPH(0.4), c[0] || '#d4a373'), 0, 0.05, 0, 0, 0, 0, [1, 0.15, 1.3]);
    [-0.25, 0, 0.25].forEach((x, i) => put(g, M(CONE(0.1, 0.3, 8), c[1] || '#a47148'), x, 0.08, -0.55 - (i === 1 ? 0.08 : 0), -H)); g.rotation.x = 0.9; return g; },
  fossil: c => { const g = new THREE.Group(); put(g, M(RB(1, 0.2, 0.8, 0.5), c[0] || '#d6ccc2'), 0, 0.1, 0);
    [-0.25, -0.08, 0.08, 0.25].forEach(x => put(g, M(CAP(0.035, 0.3), c[1] || WHITE), x, 0.2, 0, H)); put(g, M(CAP(0.04, 0.6), c[1] || WHITE), 0, 0.2, 0, 0, 0, H); g.rotation.x = 0.6; return g; },
  volcano: c => { const g = new THREE.Group(); put(g, M(CYL(0.15, 0.55, 0.6, 12), c[0] || '#8d6e63'), 0, 0.3, 0); put(g, M(SPH(0.16), c[1] || '#ff6b35', { e: '#ff6b35', ei: 0.6 }), 0, 0.62, 0, 0, 0, 0, [1, 0.5, 1]);
    [0, 2, 4].forEach(i => put(g, M(CAP(0.05, 0.2), c[1] || '#ff6b35', { e: '#ff6b35', ei: 0.5 }), Math.cos(i) * 0.14, 0.5, Math.sin(i) * 0.14 + 0.06)); return g; },
  leaf: c => { const g = new THREE.Group(); put(g, M(SPH(0.4), c[0] || '#80b918'), 0, 0.1, 0, 0, 0, 0.5, [1.3, 0.12, 0.7]); put(g, M(CYL(0.02, 0.02, 0.9), c[1] || '#55a630'), 0, 0.14, 0, 0, 0, H + 0.5); g.rotation.x = 0.7; return g; },

  // ----- 게임·전자기기 -----
  gamepad: c => { const g = new THREE.Group(), a = c[0] || '#5e60ce'; put(g, M(RB(1, 0.42, 0.24, 0.35), a), 0, 0.3, 0);
    [-1, 1].forEach(s => put(g, M(SPH(0.22), a), s * 0.42, 0.18, 0, 0, 0, s * 0.4, [1, 1.2, 0.55]));
    put(g, M(RB(0.22, 0.07, 0.07), DARK), -0.28, 0.33, 0.13); put(g, M(RB(0.07, 0.22, 0.07), DARK), -0.28, 0.33, 0.13);
    [['#ff595e', 0.32, 0.4], ['#ffca3a', 0.42, 0.3], ['#8ac926', 0.22, 0.3], ['#1982c4', 0.32, 0.2]].forEach(([col, x, y]) => put(g, M(SPH(0.05), col), x, y, 0.12)); return g; },
  console: c => { const g = new THREE.Group(), a = c[0] || '#e63946';
    put(g, M(RB(1.0, 0.1, 0.7, 0.25), a), 0, 0.05, 0); put(g, M(RB(0.5, 0.02, 0.36, 0.2), '#2b2d42', { e: '#9be7ff', ei: 0.35 }), 0, 0.11, -0.06);
    put(g, M(RB(0.16, 0.03, 0.05), DARK), -0.36, 0.11, 0.1); put(g, M(RB(0.05, 0.03, 0.16), DARK), -0.36, 0.11, 0.1); put(g, M(SPH(0.04), '#ffd166'), 0.36, 0.12, 0.1); put(g, M(SPH(0.04), '#06d6a0'), 0.44, 0.12, 0.02);
    const lid = new THREE.Group(); put(lid, M(RB(1.0, 0.1, 0.7, 0.25), a), 0, 0, 0.35); put(lid, M(RB(0.62, 0.02, 0.4, 0.2), '#2b2d42', { e: '#c3f0ff', ei: 0.5 }), 0, -0.06, 0.35);
    put(g, lid, 0, 0.1, -0.35, -1.9 + PI); return g; },
  tablet: c => { const g = new THREE.Group(); put(g, M(RB(0.8, 1.1, 0.07, 0.2), c[0] || '#adb5bd'), 0, 0.55, 0); put(g, M(RB(0.68, 0.94, 0.02, 0.15), '#22223b', { e: c[1] || '#7bdff2', ei: 0.35 }), 0, 0.55, 0.035);
    put(g, M(SPH(0.12), '#ffd166', { ol: false, e: '#ffd166', ei: 0.4 }), -0.1, 0.62, 0.05, 0, 0, 0, [1, 1, 0.2]); put(g, M(RB(0.3, 0.06, 0.02), WHITE, { ol: false }), 0.05, 0.4, 0.05); g.rotation.x = -0.2; return g; },
  phone: c => { const g = B.tablet(c); g.scale.set(0.7, 0.9, 1); return g; },
  headphone: c => { const g = new THREE.Group(), a = c[0] || '#ff8fab'; put(g, M(TOR(0.42, 0.06, PI), a), 0, 0.5, 0);
    [-1, 1].forEach(s => { put(g, M(CYL(0.17, 0.17, 0.14), a), s * 0.44, 0.42, 0, 0, 0, H); put(g, M(CYL(0.13, 0.13, 0.15), c[1] || WHITE, { ol: false }), s * 0.42, 0.42, 0, 0, 0, H); }); return g; },
  cartridge: c => { const g = new THREE.Group(); put(g, M(RB(0.6, 0.8, 0.14, 0.15), c[0] || '#6c757d'), 0, 0.4, 0); put(g, M(RB(0.46, 0.4, 0.02, 0.2), c[1] || '#ffd166'), 0, 0.48, 0.07);
    put(g, M(STAR(5, 0.12, 0.05, 0.02), '#ff595e'), 0, 0.48, 0.09); return g; },
  arcade: c => { const g = new THREE.Group(), a = c[0] || '#3a86ff'; put(g, M(RB(0.6, 1.1, 0.5, 0.15), a), 0, 0.55, 0); put(g, M(RB(0.46, 0.36, 0.02, 0.2), '#22223b', { e: '#ff006e', ei: 0.4 }), 0, 0.8, 0.26);
    put(g, M(RB(0.56, 0.08, 0.3, 0.2), c[1] || '#ffbe0b'), 0, 0.52, 0.25); put(g, M(CYL(0.02, 0.02, 0.12), DARK), -0.12, 0.6, 0.3); put(g, M(SPH(0.04), '#ff006e'), -0.12, 0.67, 0.3); put(g, M(SPH(0.035), '#8ac926'), 0.1, 0.58, 0.3); return g; },
  coin: c => { const g = new THREE.Group(); put(g, M(CYL(0.4, 0.4, 0.1, 28), c[0] || GOLD), 0, 0.42, 0, H); put(g, M(STAR(5, 0.2, 0.09, 0.04), c[1] || '#f9a03f'), 0, 0.42, 0.06); return g; },
  mushroom: c => { const g = new THREE.Group(); put(g, M(CYL(0.16, 0.2, 0.36), '#fff3dc'), 0, 0.18, 0); put(g, M(HEMI(0.4), c[0] || '#e63946'), 0, 0.32, 0, 0, 0, 0, [1, 0.8, 1]);
    [[0, 0.62, 0], [0.24, 0.48, 0.18], [-0.24, 0.48, 0.18], [0, 0.46, -0.3]].forEach(p => put(g, M(SPH(0.07), c[1] || WHITE, { ol: false }), p[0], p[1], p[2], 0, 0, 0, [1, 0.5, 1]));
    eyes(g, 0.2, 0.17, 0.06, 0.025); return g; },
  heartlife: c => { const g = new THREE.Group(); put(g, M(HEART(0.45), c[0] || '#ff4d6d'), 0, 0.42, 0); put(g, M(SPH(0.07), WHITE, { ol: false }), -0.18, 0.55, 0.1, 0, 0, 0, [1, 1, 0.3]); return g; },
  trophy: c => { const g = new THREE.Group(), a = c[0] || GOLD; put(g, M(LATHE('troph', [[0, 0.45], [0.35, 0.95], [0.3, 0.95], [0.12, 0.55], [0.06, 0.45], [0.06, 0.25], [0.2, 0.2], [0.2, 0.1], [0, 0.1]]), a), 0, 0, 0);
    [-1, 1].forEach(s => put(g, M(TOR(0.12, 0.03, PI), a), s * 0.33, 0.78, 0, 0, 0, s * -H)); put(g, M(RB(0.5, 0.12, 0.4), c[1] || '#6d4c41'), 0, 0.05, 0); put(g, M(STAR(5, 0.1, 0.045, 0.03), WHITE), 0, 0.7, 0.24); return g; },
  medal: c => { const g = new THREE.Group(); [-1, 1].forEach(s => put(g, M(RB(0.18, 0.6, 0.03), s < 0 ? c[1] || '#4361ee' : '#ef476f'), s * 0.1, 0.8, 0, 0, 0, s * 0.3));
    put(g, M(CYL(0.26, 0.26, 0.07, 28), c[0] || GOLD), 0, 0.35, 0, H); put(g, M(STAR(5, 0.13, 0.06, 0.03), '#f9a03f'), 0, 0.35, 0.05); return g; },
  robot: c => { const g = new THREE.Group(), a = c[0] || '#90a4ae', b = c[1] || '#4cc9f0';
    put(g, M(RB(0.5, 0.42, 0.4, 0.2), a), 0, 0.3, 0); put(g, M(RB(0.2, 0.14, 0.02, 0.3), b, { e: b, ei: 0.4 }), 0, 0.33, 0.21);
    put(g, M(RB(0.56, 0.42, 0.44, 0.2), a), 0, 0.78, 0); put(g, M(RB(0.4, 0.18, 0.02, 0.3), '#22223b'), 0, 0.8, 0.22);
    [-1, 1].forEach(s => { put(g, M(SPH(0.04), b, { e: b, ei: 0.9, ol: false }), s * 0.1, 0.8, 0.235); put(g, M(CAP(0.06, 0.24), a), s * 0.33, 0.3, 0, 0, 0, s * 0.2); put(g, M(CYL(0.08, 0.09, 0.14), DARK), s * 0.14, 0.05, 0); });
    put(g, M(CYL(0.015, 0.015, 0.16), DARK), 0, 1.07, 0); put(g, M(SPH(0.05), '#ff595e', { e: '#ff595e', ei: 0.6 }), 0, 1.16, 0); return g; },
  gear: c => { const g = new THREE.Group(), a = c[0] || '#adb5bd'; put(g, M(CYL(0.36, 0.36, 0.14, 24), a), 0, 0.45, 0, H);
    for (let i = 0; i < 8; i++) { const r = i / 8 * PI * 2; put(g, M(RB(0.14, 0.16, 0.14, 0.4), a), Math.cos(r) * 0.42, 0.45 + Math.sin(r) * 0.42, 0, 0, 0, r); }
    put(g, M(CYL(0.12, 0.12, 0.16), c[1] || '#495057'), 0, 0.45, 0, H); return g; },
  battery: c => { const g = new THREE.Group(); put(g, M(CYL(0.2, 0.2, 0.8), c[0] || '#2b2d42'), 0, 0.4, 0); put(g, M(CYL(0.205, 0.205, 0.32), c[1] || '#ffd166'), 0, 0.62, 0);
    put(g, M(CYL(0.08, 0.08, 0.08), SILVER), 0, 0.84, 0); put(g, M(POLY('bolt', [[0, 0.12], [-0.06, 0], [0, 0], [-0.03, -0.12], [0.07, 0.03], [0.01, 0.03]], 0.02), '#ffd166', { ol: false }), 0, 0.35, 0.2); return g; },
  remote: c => { const g = new THREE.Group(); put(g, M(RB(0.32, 0.9, 0.12, 0.35), c[0] || '#ffbe0b'), 0, 0.45, 0);
    put(g, M(CYL(0.06, 0.06, 0.04), '#ff006e'), 0, 0.72, 0.06, H); for (let i = 0; i < 3; i++) put(g, M(CYL(0.04, 0.04, 0.04), DARK), 0, 0.5 - i * 0.12, 0.06, H); g.rotation.x = -0.4; return g; },
  laptop: c => { const g = new THREE.Group(), a = c[0] || '#ced4da'; put(g, M(RB(1, 0.06, 0.7, 0.2), a), 0, 0.03, 0); put(g, M(RB(0.8, 0.02, 0.36, 0.2), '#495057'), 0, 0.07, 0.08);
    const lid = new THREE.Group(); put(lid, M(RB(1, 0.06, 0.7, 0.2), a), 0, 0, 0.35); put(lid, M(RB(0.86, 0.02, 0.56, 0.15), '#22223b', { e: c[1] || '#90e0ef', ei: 0.4 }), 0, -0.04, 0.35); put(g, lid, 0, 0.06, -0.35, -1.85 + PI); return g; },
  camera: c => { const g = new THREE.Group(); put(g, M(RB(0.9, 0.6, 0.4, 0.25), c[0] || '#7bdff2'), 0, 0.3, 0); put(g, M(CYL(0.2, 0.22, 0.16), DARK), 0, 0.3, 0.24, H);
    put(g, M(CYL(0.13, 0.13, 0.17), '#4361ee', { e: '#4cc9f0', ei: 0.3 }), 0, 0.3, 0.25, H); put(g, M(RB(0.2, 0.12, 0.1), c[1] || WHITE), 0.28, 0.66, 0); put(g, M(RB(0.14, 0.1, 0.04), '#ffd166', { e: '#ffd166', ei: 0.4 }), -0.28, 0.48, 0.2); return g; },
  watch: c => { const g = new THREE.Group(); put(g, M(TOR(0.3, 0.07), c[0] || '#4cc9f0'), 0, 0.38, 0, 0, 0, 0, [1, 1.25, 0.6]);
    put(g, M(RB(0.34, 0.4, 0.14, 0.3), '#2b2d42'), 0, 0.38, 0.28); put(g, M(RB(0.26, 0.3, 0.02, 0.3), '#22223b', { e: c[1] || '#06d6a0', ei: 0.45 }), 0, 0.38, 0.36); return g; },

  // ----- 블록·장난감 -----
  brick: c => { const g = new THREE.Group(), a = c[0] || '#e63946'; put(g, M(RB(0.8, 0.4, 0.4, 0.12), a), 0, 0.2, 0);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) put(g, M(CYL(0.07, 0.07, 0.08), a), -0.3 + i * 0.2, 0.43, -0.1 + j * 0.2); return g; },
  bricks: c => { const g = new THREE.Group(); [['#e63946', 0, 0, 0], ['#ffd166', 0.12, 0.42, 0.05], ['#118ab2', -0.1, 0.84, -0.03], ['#06d6a0', 0.4, 0, 0.3]].forEach(([col, x, y, r], i) => { const b = B.brick([c[i] || col]); put(g, b, x, y, i === 3 ? 0.45 : 0, 0, r * 3); }); return g; },
  minifig: c => { const g = new THREE.Group(); put(g, M(CYL(0.16, 0.16, 0.22), '#ffd166'), 0, 0.95, 0); put(g, M(CYL(0.07, 0.07, 0.06), '#ffd166'), 0, 1.09, 0);
    put(g, M(RB(0.42, 0.4, 0.24, 0.2), c[0] || '#e63946'), 0, 0.63, 0); put(g, M(RB(0.4, 0.4, 0.24, 0.2), c[1] || '#1d3557'), 0, 0.22, 0);
    [-1, 1].forEach(s => put(g, M(CAP(0.06, 0.24), c[0] || '#e63946'), s * 0.26, 0.6, 0.05, 0.3, 0, s * 0.15)); eyes(g, 0.98, 0.15, 0.05, 0.02); return g; },
  castle: c => { const g = new THREE.Group(), a = c[0] || '#adb5bd'; put(g, M(RB(0.9, 0.5, 0.6, 0.1), a), 0, 0.25, 0);
    [-1, 1].forEach(s => { put(g, M(CYL(0.18, 0.18, 0.8), a), s * 0.45, 0.4, 0); put(g, M(CONE(0.22, 0.32), c[1] || '#e63946'), s * 0.45, 0.96, 0); });
    put(g, M(CAP(0.11, 0.12), DARK, { ol: false }), 0, 0.2, 0.3, 0, 0, 0, [1, 1, 0.2]); put(g, M(RB(0.12, 0.08, 0.02), c[1] || '#e63946'), 0.45, 1.24, 0); return g; },
  puzzle: c => { const g = new THREE.Group(), a = c[0] || '#4cc9f0'; put(g, M(RB(0.6, 0.12, 0.6, 0.2), a), 0, 0.06, 0); put(g, M(CYL(0.12, 0.12, 0.12), a), 0.36, 0.06, 0); put(g, M(CYL(0.12, 0.12, 0.12), a), 0, 0.06, -0.36);
    const b = new THREE.Group(); put(b, M(RB(0.6, 0.12, 0.6, 0.2), c[1] || '#ffd166'), 0, 0, 0); put(g, b, 0.15, 0.16, 0.4, 0.2, 0.4, 0.1); return g; },
  dice: c => { const g = new THREE.Group(); put(g, M(RB(0.6, 0.6, 0.6, 0.18), c[0] || WHITE), 0, 0.3, 0);
    [[0, 0.3, 0.31], [0.15, 0.45, 0.31], [-0.15, 0.15, 0.31]].forEach(p => put(g, M(SPH(0.06), c[1] || '#e63946', { ol: false }), p[0], p[1], p[2], 0, 0, 0, [1, 1, 0.3]));
    [[0, 0.61, 0]].forEach(p => put(g, M(SPH(0.07), c[1] || '#e63946', { ol: false }), p[0], p[1], p[2], 0, 0, 0, [1, 0.3, 1])); g.rotation.y = 0.5; return g; },
  topspin: c => { const g = new THREE.Group(); put(g, M(CONE(0.4, 0.5, 24), c[0] || '#ff595e', { map: patternTex('band', c[0] || '#ff595e', c[1] || '#ffd166', 1) }), 0, 0.3, 0, PI); put(g, M(CYL(0.4, 0.4, 0.1, 24), c[1] || '#ffd166'), 0, 0.58, 0); put(g, M(CYL(0.04, 0.04, 0.3), WOOD), 0, 0.78, 0); return g; },
  balloon: c => { const g = new THREE.Group(); put(g, M(SPH(0.32), c[0] || '#ff4d6d'), 0, 0.95, 0, 0, 0, 0, [1, 1.15, 1]); put(g, M(CONE(0.05, 0.06), c[0] || '#ff4d6d'), 0, 0.57, 0, PI);
    put(g, M(TUBE('bstr', [[0, 0.55, 0], [0.06, 0.35, 0], [-0.04, 0.18, 0], [0, 0, 0]], 0.01), WHITE, { ol: false }), 0, 0, 0); put(g, M(SPH(0.07), WHITE, { ol: false }), -0.12, 1.08, 0.24, 0, 0, 0, [0.6, 1, 0.3]); return g; },
  kite: c => { const g = new THREE.Group(); put(g, M(POLY('kite', [[0, 0.55], [0.35, 0.1], [0, -0.45], [-0.35, 0.1]], 0.03), c[0] || '#ff595e'), 0, 0.6, 0);
    put(g, M(TUBE('ktail', [[0, 0.15, 0], [0.15, 0, 0], [-0.1, -0.2, 0], [0.1, -0.4, 0]], 0.015), c[1] || '#ffd166', { ol: false }), 0, 0, 0); return g; },

  // ----- 탈것 -----
  car: c => { const g = new THREE.Group(), a = c[0] || '#ef476f'; put(g, M(RB(1, 0.3, 0.56, 0.3), a), 0, 0.28, 0); put(g, M(RB(0.56, 0.3, 0.5, 0.3), c[1] || '#f8f9fa'), -0.06, 0.52, 0);
    put(g, M(RB(0.5, 0.18, 0.52, 0.3), '#8ecae6', { ol: false }), -0.06, 0.54, 0); [-0.32, 0.32].forEach(x => [-0.28, 0.28].forEach(z => wheel(g, x, 0.14, z)));
    [-1, 1].forEach(s => put(g, M(SPH(0.05), '#ffd166', { e: '#ffd166', ei: 0.5, ol: false }), 0.5, 0.3, s * 0.18)); g.rotation.y = -0.6; return g; },
  police: c => { const g = B.car([c[0] || '#f8f9fa', '#1d3557']); put(g, M(RB(0.18, 0.08, 0.12), '#e63946', { e: '#e63946', ei: 0.5 }), -0.06, 0.7, 0.05); put(g, M(RB(0.18, 0.08, 0.12), '#4361ee', { e: '#4361ee', ei: 0.5 }), -0.06, 0.7, -0.08); return g; },
  bus: c => { const g = new THREE.Group(), a = c[0] || '#ffbe0b'; put(g, M(RB(1.3, 0.6, 0.56, 0.18), a), 0, 0.42, 0);
    put(g, M(RB(1.2, 0.2, 0.58, 0.2), '#8ecae6', { ol: false }), 0, 0.55, 0); [-0.42, 0.42].forEach(x => [-0.28, 0.28].forEach(z => wheel(g, x, 0.14, z))); g.rotation.y = -0.6; return g; },
  train: c => { const g = new THREE.Group(), a = c[0] || '#2a9d8f'; put(g, M(CYL(0.24, 0.24, 0.7), a), 0.15, 0.42, 0, 0, 0, H); put(g, M(RB(0.4, 0.6, 0.5, 0.15), c[1] || '#e76f51'), -0.35, 0.48, 0);
    put(g, M(RB(0.46, 0.08, 0.56, 0.2), DARK), -0.35, 0.8, 0); put(g, M(CYL(0.08, 0.06, 0.24), DARK), 0.35, 0.75, 0); [-0.35, 0, 0.35].forEach(x => [-0.24, 0.24].forEach(z => wheel(g, x, 0.14, z, 0.13)));
    put(g, M(CYL(0.12, 0.12, 0.05), GOLD), 0.5, 0.42, 0, 0, 0, H); g.rotation.y = -0.6; return g; },
  plane: c => { const g = new THREE.Group(), a = c[0] || '#f8f9fa'; put(g, M(CAP(0.17, 0.9), a), 0, 0.4, 0, 0, 0, H); put(g, M(RB(0.34, 0.05, 1.3, 0.3), c[1] || '#4361ee'), 0.05, 0.38, 0);
    put(g, M(RB(0.2, 0.3, 0.05, 0.3), c[1] || '#4361ee'), -0.52, 0.6, 0); put(g, M(RB(0.18, 0.04, 0.5, 0.3), c[1] || '#4361ee'), -0.52, 0.42, 0);
    for (let i = 0; i < 3; i++) put(g, M(SPH(0.04), '#8ecae6', { ol: false }), 0.25 - i * 0.18, 0.47, 0.15); g.rotation.set(0, -0.5, 0.15); return g; },
  rocket: c => { const g = new THREE.Group(); put(g, M(CYL(0.24, 0.24, 0.8), c[1] || WHITE), 0, 0.6, 0); put(g, M(CONE(0.24, 0.4), c[0] || '#ef476f'), 0, 1.2, 0);
    for (let i = 0; i < 3; i++) { const r = i * 2.09; put(g, M(RB(0.06, 0.34, 0.24, 0.3), c[0] || '#ef476f'), Math.cos(r) * 0.26, 0.32, Math.sin(r) * 0.26, 0, -r, 0); }
    put(g, M(TOR(0.09, 0.03), SILVER), 0, 0.75, 0.23); put(g, M(CYL(0.08, 0.08, 0.02), '#8ecae6', { e: '#8ecae6', ei: 0.3, ol: false }), 0, 0.75, 0.24, H);
    put(g, M(CONE(0.14, 0.3), '#ffbe0b', { e: '#ff9f1c', ei: 0.7, ol: false }), 0, 0.08, 0, PI); return g; },
  bike: c => { const g = new THREE.Group(), a = c[0] || '#06d6a0'; [-0.4, 0.4].forEach(x => { put(g, M(TOR(0.26, 0.04), '#3d3a40'), x, 0.3, 0); put(g, M(CYL(0.04, 0.04, 0.06), SILVER), x, 0.3, 0, H); });
    put(g, M(CYL(0.03, 0.03, 0.62), a), 0, 0.42, 0, 0, 0, 1.2); put(g, M(CYL(0.03, 0.03, 0.4), a), -0.18, 0.46, 0, 0, 0, -0.4); put(g, M(CYL(0.03, 0.03, 0.45), a), 0.34, 0.5, 0, 0, 0, -0.3);
    put(g, M(RB(0.2, 0.06, 0.1, 0.4), DARK), -0.25, 0.68, 0); put(g, M(CYL(0.025, 0.025, 0.36), DARK), 0.4, 0.74, 0, H); put(g, M(RB(0.16, 0.12, 0.2, 0.3), c[1] || '#ffd166'), 0.5, 0.62, 0); g.rotation.y = -0.4; return g; },
  scooter: c => { const g = new THREE.Group(), a = c[0] || '#4cc9f0'; put(g, M(RB(0.8, 0.06, 0.2, 0.3), a), 0, 0.12, 0); wheel(g, -0.42, 0.08, 0, 0.08, 0.06); wheel(g, 0.42, 0.08, 0, 0.08, 0.06);
    put(g, M(CYL(0.03, 0.03, 0.8), SILVER), 0.42, 0.5, 0, 0, 0, -0.1); put(g, M(CYL(0.035, 0.035, 0.42), DARK), 0.46, 0.9, 0, H); g.rotation.y = -0.5; return g; },
  skate: c => { const g = new THREE.Group(); put(g, M(RB(0.9, 0.05, 0.3, 0.5), c[0] || '#ff006e', { map: patternTex('stripe', c[0] || '#ff006e', c[1] || '#ffbe0b', 2) }), 0, 0.16, 0); [-0.3, 0.3].forEach(x => [-0.11, 0.11].forEach(z => wheel(g, x, 0.07, z, 0.06, 0.06))); g.rotation.y = -0.5; return g; },
  helmet: c => { const g = new THREE.Group(); put(g, M(HEMI(0.42), c[0] || '#ff595e'), 0, 0.05, 0, 0, 0, 0, [1, 1, 1.15]); put(g, M(RB(0.08, 0.36, 0.86, 0.4), c[1] || WHITE), 0, 0.3, 0, 0, 0, 0);
    put(g, M(RB(0.5, 0.06, 0.2, 0.4), c[0] || '#ff595e'), 0, 0.06, 0.45, -0.2); return g; },
  wrench: c => { const g = new THREE.Group(); put(g, M(RB(0.14, 0.8, 0.06, 0.4), c[0] || SILVER), 0, 0.5, 0); put(g, M(TOR(0.14, 0.05, PI * 1.5), c[0] || SILVER), 0, 0.95, 0, 0, 0, -PI * 0.25); put(g, M(RB(0.18, 0.3, 0.08, 0.4), c[1] || '#e63946'), 0, 0.25, 0); g.rotation.z = 0.5; return g; },
  sign: c => { const g = new THREE.Group(); put(g, M(CYL(0.03, 0.03, 0.9), SILVER), 0, 0.45, 0); put(g, M(CYL(0.28, 0.28, 0.05, 8), c[0] || '#e63946'), 0, 0.9, 0, H, 0, PI / 8); put(g, M(RB(0.3, 0.07, 0.02), WHITE, { ol: false }), 0, 0.9, 0.03); return g; },
  wheelset: c => { const g = new THREE.Group(); wheel(g, -0.2, 0.3, 0, 0.3, 0.16, 0); put(g, M(TOR(0.3, 0.04), c[0] || '#ffd166'), -0.2, 0.3, 0); return g; },

  // ----- 운동 -----
  ball: c => { const g = new THREE.Group(); put(g, M(SPH(0.45), c[0] || '#ff595e', { map: patternTex('band', c[0] || '#ff595e', c[1] || WHITE, 1) }), 0, 0.45, 0, 0.3, 0, 0.3); return g; },
  soccer: c => { const g = new THREE.Group(); put(g, M(SPH(0.45), WHITE), 0, 0.45, 0); const d = new THREE.IcosahedronGeometry(0.45, 0).attributes.position;
    const seen = new Set(); for (let i = 0; i < d.count; i++) { const v = new THREE.Vector3(d.getX(i), d.getY(i), d.getZ(i)); const k = v.toArray().map(n => n.toFixed(2)).join(); if (seen.has(k)) continue; seen.add(k);
      const p = v.normalize().multiplyScalar(0.43); const m = put(g, M(CYL(0.12, 0.12, 0.06, 5), c[0] || '#2b2d42', { ol: false }), p.x, p.y + 0.45, p.z); m.lookAt(p.x * 2, p.y * 2 + 0.45, p.z * 2); m.rotateX(H); } return g; },
  basket: c => { const g = new THREE.Group(); put(g, M(SPH(0.45), c[0] || '#f77f00'), 0, 0.45, 0); [0, H].forEach(r => put(g, M(TOR(0.452, 0.012), DARK, { ol: false }), 0, 0.45, 0, 0, r, 0)); put(g, M(TOR(0.452, 0.012), DARK, { ol: false }), 0, 0.45, 0, H, 0, 0); return g; },
  baseball: c => { const g = new THREE.Group(); put(g, M(SPH(0.4), WHITE), 0, 0.4, 0); [-1, 1].forEach(s => put(g, M(TOR(0.3, 0.015, PI), c[0] || '#e63946', { ol: false }), s * 0.16, 0.4, 0, 0, s * H * 0.8, s * H)); return g; },
  bat: c => { const g = new THREE.Group(); put(g, M(LATHE('bat', [[0, 0], [0.06, 0], [0.05, 0.05], [0.04, 0.4], [0.09, 0.85], [0.1, 1.05], [0, 1.1]]), c[0] || WOOD), 0, 0, 0); put(g, M(CYL(0.045, 0.045, 0.25), c[1] || DARK), 0, 0.17, 0); g.rotation.z = 0.9; return g; },
  glove: c => { const g = new THREE.Group(), a = c[0] || '#b5651d'; put(g, M(SPH(0.35), a), 0, 0.4, 0, 0, 0, 0, [1, 1.1, 0.5]);
    for (let i = 0; i < 4; i++) put(g, M(CAP(0.07, 0.2), a), -0.2 + i * 0.13, 0.78, 0, 0, 0, (i - 1.5) * -0.1); put(g, M(CAP(0.08, 0.18), a), 0.36, 0.4, 0, 0, 0, -0.9); return g; },
  shoe: c => { const g = new THREE.Group(); put(g, M(RB(0.9, 0.12, 0.4, 0.4), WHITE), 0, 0.06, 0); put(g, M(RB(0.75, 0.36, 0.38, 0.4), c[0] || '#ef476f'), -0.06, 0.26, 0);
    put(g, M(RB(0.3, 0.3, 0.36, 0.4), c[0] || '#ef476f'), -0.26, 0.42, 0); for (let i = 0; i < 3; i++) put(g, M(RB(0.04, 0.02, 0.26), c[1] || WHITE, { ol: false }), 0.02 + i * 0.1, 0.42 - i * 0.03, 0, 0, 0, -0.3); g.rotation.y = -0.6; return g; },
  rope: c => { const g = new THREE.Group(); [-1, 1].forEach(s => put(g, M(CAP(0.07, 0.25), c[0] || '#ff006e'), s * 0.45, 0.2, 0, 0, 0, 0)); put(g, M(TUBE('rope', [[-0.45, 0.38, 0], [-0.3, 0.8, 0.1], [0, 0.95, 0], [0.3, 0.8, -0.1], [0.45, 0.38, 0]], 0.025), c[1] || '#4cc9f0'), 0, 0, 0); return g; },
  whistle: c => { const g = new THREE.Group(); put(g, M(CYL(0.22, 0.22, 0.2, 20), c[0] || '#ffd166'), 0, 0.3, 0, H); put(g, M(RB(0.4, 0.12, 0.18, 0.3), c[0] || '#ffd166'), 0.3, 0.42, 0); put(g, M(TOR(0.07, 0.025), SILVER), -0.22, 0.48, 0); return g; },
  goal: c => { const g = new THREE.Group(), a = c[0] || WHITE; [-0.5, 0.5].forEach(x => put(g, M(CYL(0.03, 0.03, 0.6), a), x, 0.3, 0)); put(g, M(CYL(0.03, 0.03, 1.03), a), 0, 0.6, 0, 0, 0, H);
    put(g, M(RB(1, 0.58, 0.02, 0.05), c[1] || '#caf0f8', { op: 0.5 }), 0, 0.3, -0.2); put(g, M(RB(1.4, 0.04, 0.8, 0.3), '#52b788'), 0, 0.02, 0); const b = B.soccer([]); put(g, b, 0.15, 0.04, 0.2, 0, 0, 0, 0.3); return g; },
  racket: c => { const g = new THREE.Group(); put(g, M(TOR(0.28, 0.035), c[0] || '#4361ee'), 0, 0.75, 0, 0, 0, 0, [1, 1.25, 1]); put(g, M(CYL(0.27, 0.27, 0.01, 24), c[1] || '#e9ecef', { op: 0.7 }), 0, 0.75, 0, H, 0, 0, [1, 1, 1.25]);
    put(g, M(CYL(0.035, 0.04, 0.5), DARK), 0, 0.2, 0); g.rotation.z = 0.4; return g; },
  skirope: c => B.rope(c),
  swim: c => { const g = new THREE.Group(); put(g, M(TOR(0.36, 0.14), c[0] || '#ff595e', { map: patternTex('stripe', c[0] || '#ff595e', c[1] || WHITE, 4) }), 0, 0.14, 0, H); return g; },
  goggle: c => { const g = new THREE.Group(); [-1, 1].forEach(s => { put(g, M(TOR(0.16, 0.04), c[0] || '#4cc9f0'), s * 0.2, 0.4, 0); put(g, M(CYL(0.15, 0.15, 0.02, 20), '#caf0f8', { op: 0.6 }), s * 0.2, 0.4, 0, H); });
    put(g, M(TOR(0.45, 0.02, PI), c[1] || DARK), 0, 0.4, -0.05, H, 0, 0, [1, 0.6, 1]); return g; },

  // ----- 미술·만들기 -----
  pencil: c => { const g = new THREE.Group(); put(g, M(CYL(0.08, 0.08, 0.8, 6), c[0] || '#ffbe0b'), 0, 0.4, 0); put(g, M(CONE(0.08, 0.18, 6), '#f2d0a4'), 0, 0.89, 0); put(g, M(CONE(0.03, 0.07, 8), DARK, { ol: false }), 0, 0.95, 0);
    put(g, M(CYL(0.082, 0.082, 0.07), SILVER), 0, 0.02, 0); put(g, M(CYL(0.08, 0.08, 0.08), c[1] || PINK), 0, -0.05, 0); g.rotation.z = 1.1; return g; },
  crayons: c => { const g = new THREE.Group(); ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#9b5de5'].forEach((col, i) => { put(g, M(CYL(0.07, 0.07, 0.6), c[i] || col), -0.32 + i * 0.16, 0.4, 0); put(g, M(CONE(0.07, 0.14), c[i] || col), -0.32 + i * 0.16, 0.77, 0); });
    put(g, M(RB(0.9, 0.42, 0.22, 0.12), c[5] || '#ffbe0b'), 0, 0.21, 0); return g; },
  paintbrush: c => { const g = new THREE.Group(); put(g, M(CYL(0.045, 0.06, 0.7), c[1] || WOOD), 0, 0.35, 0); put(g, M(CYL(0.065, 0.06, 0.16), SILVER), 0, 0.78, 0); put(g, M(SPH(0.07), c[0] || '#4361ee'), 0, 0.92, 0, 0, 0, 0, [1, 1.8, 1]); g.rotation.z = 1.0; return g; },
  palette: c => { const g = new THREE.Group(); put(g, M(SPH(0.5), c[0] || '#e9c46a'), 0, 0.05, 0, 0, 0, 0, [1.2, 0.08, 0.9]);
    ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#9b5de5'].forEach((col, i) => { const r = i * 0.9 + 0.8; put(g, M(SPH(0.08), col, { ol: false }), Math.cos(r) * 0.36, 0.09, Math.sin(r) * 0.27, 0, 0, 0, [1, 0.4, 1]); }); g.rotation.x = 0.8; return g; },
  sketchbook: c => { const g = new THREE.Group(); put(g, M(RB(0.8, 1.0, 0.06, 0.12), c[0] || '#2a9d8f'), 0, 0.5, 0); put(g, M(RB(0.74, 0.94, 0.07, 0.1), WHITE, { ol: false }), 0.02, 0.48, 0.01);
    for (let i = 0; i < 6; i++) put(g, M(TOR(0.04, 0.012), SILVER, { ol: false }), -0.3 + i * 0.12, 1.0, 0, 0, H, 0); put(g, M(SPH(0.15), c[1] || '#ffd166', { ol: false }), 0.05, 0.5, 0.05, 0, 0, 0, [1, 1, 0.2]); g.rotation.x = -0.3; return g; },
  clay: c => { const g = new THREE.Group(); ['#ff595e', '#ffca3a', '#8ac926', '#1982c4'].forEach((col, i) => put(g, M(SPH(0.2 - i * 0.02), c[i] || col), Math.cos(i * 1.6) * 0.25, 0.18, Math.sin(i * 1.6) * 0.25, 0, 0, 0, [1, 0.8, 1])); put(g, M(CAP(0.07, 0.3), '#c77dff'), 0, 0.12, 0, 0, 0.8, H); return g; },
  slime: c => { const g = new THREE.Group(); put(g, M(CYL(0.36, 0.3, 0.4, 24), c[1] || '#e9ecef', { op: 0.55 }), 0, 0.2, 0); put(g, M(SPH(0.3), c[0] || '#80ffdb'), 0, 0.3, 0, 0, 0, 0, [1.1, 0.7, 1.1]); put(g, M(CYL(0.38, 0.38, 0.08, 24), c[2] || '#9b5de5'), 0, 0.44, 0.3, 1.2); return g; },
  scissors: c => { const g = new THREE.Group(); [-1, 1].forEach(s => { put(g, M(TOR(0.12, 0.04), c[0] || '#ff006e'), s * 0.13, 0.15, 0, H); put(g, M(RB(0.06, 0.6, 0.03, 0.4), SILVER), s * 0.05, 0.55, 0, 0, 0, s * 0.18); }); return g; },
  frame: c => { const g = new THREE.Group(); put(g, M(RB(0.9, 0.72, 0.08, 0.1), c[0] || '#c98b55'), 0, 0.4, 0); put(g, M(RB(0.72, 0.54, 0.09, 0.1), '#caf0f8', { ol: false }), 0, 0.4, 0);
    put(g, M(SPH(0.12), '#ffd166', { ol: false, e: '#ffd166', ei: 0.3 }), 0.18, 0.5, 0.05, 0, 0, 0, [1, 1, 0.2]); put(g, M(CONE(0.24, 0.25, 3), c[1] || '#52b788', { ol: false }), -0.12, 0.3, 0.05, 0, 0, 0, [1, 1, 0.2]); return g; },
  easel: c => { const g = new THREE.Group(); [-1, 1].forEach(s => put(g, M(CYL(0.025, 0.025, 1.1), WOOD), s * 0.25, 0.53, 0, 0, 0, s * 0.15)); put(g, M(CYL(0.025, 0.025, 1), WOOD), 0, 0.5, -0.3, 0.35);
    put(g, M(RB(0.7, 0.5, 0.04, 0.1), WHITE), 0, 0.78, 0.04, -0.1); put(g, M(HEART(0.12, 0.02), c[0] || '#ff4d6d', { ol: false }), 0, 0.8, 0.07, -0.1); return g; },
  stamp: c => { const g = new THREE.Group(); put(g, M(RB(0.4, 0.14, 0.4, 0.3), c[1] || '#ef476f'), 0, 0.07, 0); put(g, M(CYL(0.08, 0.1, 0.3), WOOD), 0, 0.28, 0); put(g, M(SPH(0.14), WOOD), 0, 0.5, 0); return g; },
  tape: c => { const g = new THREE.Group(); put(g, M(TOR(0.3, 0.12), c[0] || '#ffadad', { map: patternTex('dots', c[0] || '#ffadad', c[1] || WHITE, 6) }), 0, 0.42, 0); return g; },
  glitter: c => { const g = B.bottle([c[0] || '#e0aaff', c[1] || '#ffd166']); for (let i = 0; i < 6; i++) put(g, M(OCT(0.04), GOLD, { ol: false, e: GOLD, ei: 0.5 }), Math.sin(i) * 0.12, 0.25 + i * 0.05, Math.cos(i) * 0.12); return g; },

  // ----- 음악 -----
  note: c => { const g = new THREE.Group(), a = c[0] || '#3a0ca3'; put(g, M(SPH(0.16), a), 0, 0.18, 0, 0, 0, 0.4, [1.3, 1, 0.8]); put(g, M(CYL(0.03, 0.03, 0.75), a), 0.17, 0.55, 0);
    put(g, M(TUBE('flag', [[0.17, 0.92, 0], [0.3, 0.82, 0], [0.38, 0.65, 0]], 0.04), a), 0, 0, 0); return g; },
  drum: c => { const g = new THREE.Group(); put(g, M(CYL(0.42, 0.42, 0.42), c[0] || '#e63946', { map: patternTex('stripe', c[0] || '#e63946', c[1] || WHITE, 3) }), 0, 0.22, 0); put(g, M(CYL(0.43, 0.43, 0.04), WHITE), 0, 0.45, 0);
    [0.45, 0.01].forEach(y => put(g, M(TOR(0.43, 0.03), GOLD), 0, y, 0, H)); [-1, 1].forEach(s => { put(g, M(CYL(0.02, 0.02, 0.6), WOOD), s * 0.15, 0.6, 0.1, 0.3, 0, s * 0.6); put(g, M(SPH(0.04), WOOD), s * 0.32, 0.85, 0.18); }); return g; },
  guitar: c => { const g = new THREE.Group(), a = c[0] || '#e76f51'; put(g, M(SPH(0.3), a), 0, 0.3, 0, 0, 0, 0, [1, 1, 0.4]); put(g, M(SPH(0.22), a), 0, 0.68, 0, 0, 0, 0, [1, 1, 0.4]);
    put(g, M(CYL(0.08, 0.08, 0.03, 20), DARK, { ol: false }), 0, 0.52, 0.11, H); put(g, M(RB(0.1, 0.7, 0.06, 0.2), c[1] || WOOD), 0, 1.15, 0); put(g, M(RB(0.16, 0.18, 0.06, 0.2), c[1] || WOOD), 0, 1.56, 0); g.rotation.z = 0.3; return g; },
  piano: c => { const g = new THREE.Group(); put(g, M(RB(1.2, 0.16, 0.5, 0.15), c[0] || '#2b2d42'), 0, 0.08, 0);
    for (let i = 0; i < 9; i++) put(g, M(RB(0.11, 0.05, 0.3, 0.2), WHITE), -0.48 + i * 0.12, 0.18, 0.08); [0, 1, 3, 4, 5, 7].forEach(i => put(g, M(RB(0.06, 0.05, 0.17, 0.2), DARK), -0.42 + i * 0.12, 0.22, 0.01)); g.rotation.x = 0.4; return g; },
  xylophone: c => { const g = new THREE.Group(); ['#ef476f', '#f78c6b', '#ffd166', '#06d6a0', '#118ab2', '#9b5de5'].forEach((col, i) => put(g, M(RB(0.13, 0.06, 0.7 - i * 0.07, 0.2), col), -0.42 + i * 0.17, 0.15, 0));
    [-0.2, 0.2].forEach(z => put(g, M(RB(1.1, 0.08, 0.06, 0.3), WOOD), 0, 0.08, z * (1 - 0.3))); put(g, M(CYL(0.02, 0.02, 0.6), WOOD), 0.1, 0.3, 0.3, 0, 0.6, H); put(g, M(SPH(0.06), '#ff595e'), 0.35, 0.3, 0.12); return g; },
  mic: c => { const g = new THREE.Group(); put(g, M(SPH(0.2), SILVER, { map: patternTex('check', '#cfd6de', '#9aa5b1', 4) }), 0, 0.8, 0); put(g, M(CYL(0.08, 0.05, 0.6), c[0] || '#ff006e'), 0, 0.38, 0); put(g, M(TOR(0.09, 0.03), c[1] || GOLD), 0, 0.64, 0, H); g.rotation.z = 0.4; return g; },
  bell: c => { const g = new THREE.Group(); put(g, M(LATHE('bell', [[0, 0.75], [0.12, 0.72], [0.22, 0.55], [0.28, 0.25], [0.4, 0.08], [0.42, 0.02], [0, 0.04]]), c[0] || GOLD), 0, 0, 0);
    put(g, M(SPH(0.08), c[0] || GOLD), 0, 0.03, 0); put(g, M(TOR(0.06, 0.02), c[0] || GOLD), 0, 0.8, 0); [-1, 1].forEach(s => put(g, M(SPH(0.09), c[1] || '#e63946'), s * 0.1, 0.78, 0.05, 0, 0, s * 0.6, [1.4, 0.8, 0.6])); return g; },
  tambourine: c => { const g = new THREE.Group(); put(g, M(CYL(0.4, 0.4, 0.1, 24), c[0] || WOOD), 0, 0.42, 0, H); put(g, M(CYL(0.38, 0.38, 0.11, 24), c[1] || '#fff3dc', { ol: false }), 0, 0.42, 0, H);
    for (let i = 0; i < 6; i++) { const r = i / 6 * PI * 2; put(g, M(CYL(0.06, 0.06, 0.02), GOLD), Math.cos(r) * 0.42, 0.42 + Math.sin(r) * 0.42, 0, H); } return g; },
  speaker: c => { const g = new THREE.Group(); put(g, M(RB(0.56, 0.8, 0.46, 0.2), c[0] || '#3d405b'), 0, 0.4, 0); put(g, M(CYL(0.17, 0.17, 0.02), DARK), 0, 0.3, 0.23, H); put(g, M(CYL(0.09, 0.09, 0.02), DARK), 0, 0.62, 0.23, H);
    put(g, M(TOR(0.17, 0.02), c[1] || '#4cc9f0', { e: c[1] || '#4cc9f0', ei: 0.6, ol: false }), 0, 0.3, 0.24); return g; },
  musicbox: c => { const g = new THREE.Group(); put(g, M(RB(0.8, 0.4, 0.56, 0.15), c[0] || '#ffafcc'), 0, 0.2, 0); const lid = new THREE.Group(); put(lid, M(RB(0.82, 0.08, 0.58, 0.2), c[1] || '#cdb4db'), 0, 0, 0.28); put(g, lid, 0, 0.42, -0.28, -1.0);
    put(g, M(CYL(0.03, 0.03, 0.18), GOLD), 0, 0.5, 0); put(g, M(CONE(0.1, 0.18), '#ffd6e0'), 0, 0.66, 0); put(g, M(SPH(0.05), '#ffd6e0'), 0, 0.78, 0); return g; },
  headset: c => B.headphone(c),

  // ----- 책·공부 -----
  book: c => { const g = new THREE.Group(); put(g, M(RB(0.72, 0.95, 0.24, 0.12), c[0] || '#3a86ff'), 0, 0.48, 0); put(g, M(RB(0.66, 0.89, 0.2, 0.1), '#fff8e7', { ol: false }), 0.04, 0.48, 0);
    put(g, M(RB(0.08, 0.95, 0.26, 0.2), c[1] || '#ffbe0b'), -0.34, 0.48, 0); put(g, M(STAR(5, 0.13, 0.06, 0.02), c[1] || '#ffbe0b', { ol: false }), 0.04, 0.6, 0.12); g.rotation.y = -0.4; return g; },
  books: c => { const g = new THREE.Group(); ['#ef476f', '#118ab2', '#06d6a0'].forEach((col, i) => { put(g, M(RB(0.8 - i * 0.08, 0.2, 0.6, 0.12), c[i] || col), 0, 0.1 + i * 0.2, 0, 0, i * 0.2 - 0.2); put(g, M(RB(0.76 - i * 0.08, 0.16, 0.58, 0.1), '#fff8e7', { ol: false }), 0.03, 0.1 + i * 0.2, 0, 0, i * 0.2 - 0.2); }); return g; },
  openbook: c => { const g = new THREE.Group(); [-1, 1].forEach(s => { put(g, M(RB(0.5, 0.05, 0.7, 0.2), c[0] || '#9b5de5'), s * 0.26, 0.05, 0, 0, 0, s * 0.12); put(g, M(RB(0.46, 0.05, 0.66, 0.15), '#fff8e7', { ol: false }), s * 0.25, 0.09, 0, 0, 0, s * 0.18);
    for (let i = 0; i < 3; i++) put(g, M(RB(0.3, 0.005, 0.03), '#adb5bd', { ol: false }), s * 0.25, 0.125 + s * 0, -0.15 + i * 0.13, 0, 0, s * 0.18); }); g.rotation.x = 0.6; return g; },
  bookmark: c => { const g = new THREE.Group(); put(g, M(RB(0.24, 0.8, 0.02, 0.15), c[0] || '#90be6d'), 0, 0.45, 0); put(g, M(TOR(0.05, 0.015), GOLD), 0, 0.88, 0); put(g, M(TUBE('tassel', [[0, 0.88, 0], [0.04, 1.0, 0], [0.02, 1.12, 0]], 0.02), c[1] || '#ffbe0b'), 0, 0, 0);
    put(g, M(HEART(0.08, 0.02), c[1] || '#ef476f', { ol: false }), 0, 0.5, 0.02); return g; },
  glasses: c => { const g = new THREE.Group(); [-1, 1].forEach(s => { put(g, M(TOR(0.17, 0.035), c[0] || '#3d405b'), s * 0.22, 0.4, 0); put(g, M(CYL(0.16, 0.16, 0.01), '#caf0f8', { op: 0.5 }), s * 0.22, 0.4, 0, H); put(g, M(CYL(0.02, 0.02, 0.5), c[0] || '#3d405b'), s * 0.39, 0.42, -0.25, H); });
    put(g, M(TOR(0.06, 0.025, PI), c[0] || '#3d405b'), 0, 0.42, 0); return g; },
  lamp: c => { const g = new THREE.Group(); put(g, M(CYL(0.25, 0.28, 0.08), c[1] || '#3d405b'), 0, 0.04, 0); put(g, M(CYL(0.03, 0.03, 0.7), SILVER), 0, 0.42, 0);
    put(g, M(CYL(0.15, 0.35, 0.36, 20, true), c[0] || '#ffd166'), 0, 0.82, 0); put(g, M(SPH(0.1), '#fff3b0', { e: '#fff3b0', ei: 1, ol: false }), 0, 0.72, 0); return g; },
  globe: c => { const g = new THREE.Group(); put(g, M(SPH(0.36), c[0] || '#4cc9f0'), 0, 0.62, 0); [[0.2, 0.75, 0.25], [-0.25, 0.5, 0.22], [0.1, 0.4, -0.3], [-0.1, 0.9, -0.2]].forEach(p => put(g, M(SPH(0.12), c[1] || '#80b918', { ol: false }), p[0], p[1], p[2], 0, 0, 0, [1, 0.8, 0.4]));
    put(g, M(TOR(0.42, 0.025, PI), GOLD), 0, 0.62, 0, 0, H, 0.4); put(g, M(CYL(0.03, 0.03, 0.2), GOLD), 0, 0.15, 0); put(g, M(CYL(0.22, 0.25, 0.06), WOOD), 0, 0.03, 0); return g; },
  pencilcase: c => { const g = new THREE.Group(); put(g, M(CAP(0.18, 0.7), c[0] || '#ff8fab'), 0, 0.2, 0, 0, 0, H, [1, 1, 0.8]); put(g, M(TUBE('zip', [[-0.5, 0.36, 0], [0, 0.39, 0], [0.5, 0.36, 0]], 0.015), GOLD, { ol: false }), 0, 0, 0); put(g, M(SPH(0.04), GOLD), 0.35, 0.38, 0.03); return g; },
  backpack: c => { const g = new THREE.Group(), a = c[0] || '#ef476f'; put(g, M(RB(0.7, 0.85, 0.4, 0.35), a), 0, 0.43, 0); put(g, M(RB(0.5, 0.36, 0.14, 0.4), c[1] || '#ffd166'), 0, 0.3, 0.22);
    put(g, M(TOR(0.12, 0.04, PI), a), 0, 0.85, 0); return g; },
  ruler: c => { const g = new THREE.Group(); put(g, M(RB(1.2, 0.04, 0.2, 0.1), c[0] || '#ffd166'), 0, 0.02, 0); for (let i = 0; i < 11; i++) put(g, M(RB(0.012, 0.01, i % 5 ? 0.06 : 0.1), DARK, { ol: false }), -0.5 + i * 0.1, 0.045, -0.05); g.rotation.x = 0.6; return g; },
  eraser: c => { const g = new THREE.Group(); put(g, M(RB(0.6, 0.24, 0.32, 0.3), c[0] || '#ffadad'), 0, 0.12, 0); put(g, M(RB(0.4, 0.25, 0.33, 0.25), c[1] || '#4cc9f0'), 0.12, 0.125, 0); return g; },
  magnifier: c => { const g = new THREE.Group(); put(g, M(TOR(0.28, 0.05), c[0] || '#3d405b'), 0, 0.72, 0); put(g, M(CYL(0.27, 0.27, 0.02, 24), '#caf0f8', { op: 0.5 }), 0, 0.72, 0, H); put(g, M(CYL(0.05, 0.06, 0.45), c[1] || WOOD), 0, 0.25, 0); g.rotation.z = 0.5; return g; },
  scroll: c => { const g = new THREE.Group(); put(g, M(RB(0.9, 0.02, 0.6, 0.1), c[0] || '#f6e7c1'), 0, 0.03, 0); [-1, 1].forEach(s => put(g, M(CYL(0.07, 0.07, 0.66), c[1] || WOOD), s * 0.46, 0.07, 0, H));
    put(g, M(TUBE('mapline', [[-0.3, 0.05, 0.15], [-0.1, 0.05, -0.1], [0.1, 0.05, 0.12], [0.28, 0.05, -0.12]], 0.012), '#e63946', { ol: false }), 0, 0, 0); put(g, M(STAR(5, 0.06, 0.025, 0.01), '#e63946', { ol: false }), 0.28, 0.06, -0.12, -H); g.rotation.x = 0.8; return g; },
  medalbook: c => B.trophy(c),

  // ----- 우주·과학 -----
  planet: c => { const g = new THREE.Group(); put(g, M(SPH(0.4), c[0] || '#f4a261', { map: patternTex('band', c[0] || '#f4a261', c[2] || '#e9c46a', 1) }), 0, 0.5, 0); put(g, M(TOR(0.6, 0.05), c[1] || '#e9c46a'), 0, 0.5, 0, H + 0.4, 0, 0, [1, 1, 0.3]); return g; },
  moon: c => { const g = new THREE.Group(); put(g, M(SPH(0.42), c[0] || '#fff3b0'), 0, 0.45, 0); [[0.15, 0.6, 0.35], [-0.2, 0.35, 0.33], [0.05, 0.25, 0.38]].forEach(p => put(g, M(SPH(0.07), c[1] || '#e9d8a6', { ol: false }), p[0], p[1], p[2], 0, 0, 0, [1, 1, 0.3]));
    eyes(g, 0.5, 0.4, 0.1, 0.03); blush(g, 0.42, 0.38, 0.18); return g; },
  telescope: c => { const g = new THREE.Group(); put(g, M(CYL(0.1, 0.14, 0.9), c[0] || '#4361ee'), 0, 0.85, 0, 0, 0, -1.0); put(g, M(CYL(0.15, 0.15, 0.06), GOLD), 0.39, 1.1, 0, 0, 0, -1.0);
    [0, 2.1, 4.2].forEach(r => put(g, M(CYL(0.025, 0.025, 0.8), c[1] || DARK), Math.cos(r) * 0.15, 0.38, Math.sin(r) * 0.15, Math.sin(r) * 0.3, 0, -Math.cos(r) * 0.3)); return g; },
  ufo: c => { const g = new THREE.Group(); put(g, M(SPH(0.5), c[0] || '#adb5bd'), 0, 0.3, 0, 0, 0, 0, [1, 0.25, 1]); put(g, M(HEMI(0.24), c[1] || '#90e0ef', { op: 0.75 }), 0, 0.36, 0);
    put(g, M(SPH(0.1), '#80ed99'), 0, 0.4, 0); for (let i = 0; i < 6; i++) { const r = i / 6 * PI * 2; put(g, M(SPH(0.04), '#ffd166', { e: '#ffd166', ei: 0.8, ol: false }), Math.cos(r) * 0.42, 0.28, Math.sin(r) * 0.42); } return g; },
  astronaut: c => { const g = new THREE.Group(), a = c[0] || WHITE; put(g, M(RB(0.5, 0.5, 0.36, 0.4), a), 0, 0.4, 0); put(g, M(SPH(0.3), a), 0, 0.92, 0); put(g, M(SPH(0.21), '#22223b', { e: '#4361ee', ei: 0.3 }), 0, 0.92, 0.12, 0, 0, 0, [1.1, 0.85, 1]);
    [-1, 1].forEach(s => { put(g, M(CAP(0.08, 0.26), a), s * 0.32, 0.45, 0, 0, 0, s * 0.3); put(g, M(CAP(0.09, 0.14), a), s * 0.12, 0.1, 0); }); put(g, M(RB(0.14, 0.1, 0.02), c[1] || '#e63946'), 0.1, 0.5, 0.19); return g; },
  starstick: c => B.wand(c),
  flask: c => { const g = new THREE.Group(); put(g, M(LATHE('flask', [[0, 0], [0.38, 0.02], [0.4, 0.06], [0.14, 0.62], [0.14, 0.85], [0.17, 0.88], [0, 0.88]]), c[1] || '#caf0f8', { op: 0.55 }), 0, 0, 0);
    put(g, M(LATHE('flaskL', [[0, 0.03], [0.35, 0.05], [0.24, 0.3], [0, 0.3]]), c[0] || '#80ffdb', { e: c[0] || '#80ffdb', ei: 0.3 }), 0, 0, 0); for (let i = 0; i < 3; i++) put(g, M(SPH(0.04 + i * 0.01), WHITE, { op: 0.8 }), 0.03 * i, 0.4 + i * 0.25, 0); return g; },
  magnet: c => { const g = new THREE.Group(); put(g, M(TOR(0.3, 0.11, PI), c[0] || '#e63946'), 0, 0.5, 0, 0, 0, PI); [-1, 1].forEach(s => { put(g, M(CYL(0.11, 0.11, 0.25), c[0] || '#e63946'), s * 0.3, 0.62, 0); put(g, M(CYL(0.112, 0.112, 0.12), SILVER), s * 0.3, 0.8, 0); }); return g; },
  microscope: c => { const g = new THREE.Group(), a = c[0] || WHITE; put(g, M(RB(0.5, 0.08, 0.4, 0.3), a), 0, 0.04, 0); put(g, M(RB(0.1, 0.7, 0.12, 0.3), a), -0.18, 0.42, 0, 0, 0, 0.1); put(g, M(RB(0.3, 0.04, 0.3, 0.3), c[1] || '#4361ee'), 0.05, 0.3, 0);
    put(g, M(CYL(0.07, 0.07, 0.5), c[1] || '#4361ee'), 0.05, 0.62, 0, 0, 0, -0.35); put(g, M(CYL(0.04, 0.04, 0.12), DARK), 0.17, 0.42, 0); return g; },
  crystal: c => { const g = new THREE.Group(); [[0, 0.4, 0, 0, 0.55], [0.22, 0.25, 0.1, 0.5, 0.35], [-0.2, 0.22, -0.05, -0.4, 0.32]].forEach(([x, y, z, r, s]) => put(g, M(CYL(0.001, 0.12, 0.3, 6), c[0] || '#c77dff', { e: c[0] || '#c77dff', ei: 0.2 }), x, y + 0.08, z, 0, 0, r, [1, s * 4, 1]));
    put(g, M(SPH(0.32), c[1] || '#8d99ae'), 0, 0, 0, 0, 0, 0, [1.2, 0.35, 1]); return g; },
  comet: c => { const g = new THREE.Group(); put(g, M(STAR(5, 0.3, 0.13, 0.12), c[0] || '#ffd166', { e: '#ffd166', ei: 0.3 }), 0.25, 0.65, 0); [0, 1, 2].forEach(i => put(g, M(CAP(0.04, 0.5 - i * 0.1), [c[1] || '#ff9f1c', '#4cc9f0', '#f72585'][i], { ol: false }), -0.12 - i * 0.02, 0.45 - i * 0.1 + 0.1, 0, 0, 0, 1.0)); return g; },
  satellite: c => { const g = new THREE.Group(); put(g, M(RB(0.3, 0.3, 0.3, 0.2), c[0] || GOLD), 0, 0.5, 0); [-1, 1].forEach(s => put(g, M(RB(0.4, 0.02, 0.24, 0.1), c[1] || '#4361ee', { map: patternTex('check', '#4361ee', '#3a0ca3', 2) }), s * 0.42, 0.5, 0));
    put(g, M(CYL(0.12, 0.02, 0.1, 16), SILVER), 0, 0.72, 0, PI); put(g, M(CYL(0.01, 0.01, 0.14), SILVER), 0, 0.82, 0); g.rotation.z = 0.3; return g; },

  // ----- 바다 -----
  fish: c => { const g = new THREE.Group(), a = c[0] || '#ff8c42'; put(g, M(SPH(0.32), a), 0, 0.4, 0, 0, 0, 0, [1.3, 1, 0.6]); put(g, M(CONE(0.2, 0.26, 4), c[1] || '#ffd166'), -0.5, 0.4, 0, 0, 0, H, [1, 1, 0.3]);
    put(g, M(CONE(0.1, 0.16, 4), c[1] || '#ffd166'), 0, 0.72, 0, 0, 0, 0, [1, 1, 0.3]); [-1, 1].forEach(s => put(g, M(SPH(0.04), DARK, { ol: false }), 0.24, 0.47, s * 0.17)); put(g, M(TOR(0.04, 0.012, PI), DARK, { ol: false }), 0.4, 0.38, 0, 0, 0, H); return g; },
  whale: c => { const g = new THREE.Group(), a = c[0] || '#4895ef'; put(g, M(SPH(0.4), a), 0, 0.38, 0, 0, 0, 0, [1.3, 0.9, 0.9]); put(g, M(SPH(0.3), c[1] || WHITE), 0.05, 0.22, 0, 0, 0, 0, [1.1, 0.5, 0.75]);
    put(g, M(CONE(0.15, 0.4), a), -0.6, 0.48, 0, 0, 0, 1.2, [1, 1, 0.4]); [-1, 1].forEach(s => put(g, M(SPH(0.12), a), -0.75, 0.62, s * 0.1, s * 0.5, 0, 0, [0.5, 0.3, 1])); eyes(g, 0.42, 0.33, 0.0, 0.03); g.children.slice(-2).forEach((e, i) => e.position.set(0.32, 0.45, i ? 0.25 : -0.25));
    [0, 1, 2].forEach(i => put(g, M(SPH(0.04), '#90e0ef', { ol: false }), 0.1 + (i - 1) * 0.06, 0.82 + i * 0.05, 0)); return g; },
  octopus: c => { const g = new THREE.Group(), a = c[0] || '#f72585'; put(g, M(SPH(0.32), a), 0, 0.55, 0, 0, 0, 0, [1, 1.1, 1]);
    for (let i = 0; i < 6; i++) { const r = i / 6 * PI * 2; put(g, M(CAP(0.07, 0.2), a), Math.cos(r) * 0.24, 0.2, Math.sin(r) * 0.24, Math.sin(r) * 0.6, 0, -Math.cos(r) * 0.6); } eyes(g, 0.58, 0.3, 0.1, 0.04); blush(g, 0.5, 0.27, 0.18); return g; },
  shell: c => { const g = new THREE.Group(), a = c[0] || '#ffcad4'; for (let i = 0; i < 7; i++) put(g, M(CAP(0.06, 0.45), a), 0, 0.12, 0, -0.2, 0, (i - 3) * 0.28); put(g, M(SPH(0.1), c[1] || '#f4acb7'), 0, 0.08, 0.05, 0, 0, 0, [1.4, 0.6, 1]); g.children.forEach(m => { m.position.x = Math.sin(m.rotation.z) * 0.2; m.position.y = 0.05 + Math.cos(m.rotation.z) * 0.2; }); return g; },
  starfish: c => { const g = new THREE.Group(); put(g, M(STAR(5, 0.5, 0.2, 0.12), c[0] || '#ff9f1c'), 0, 0.5, 0); for (let i = 0; i < 5; i++) { const r = H + i * PI * 2 / 5; put(g, M(SPH(0.03), c[1] || '#ffd166', { ol: false }), Math.cos(r) * 0.25, 0.5 + Math.sin(r) * 0.25, 0.1); } return g; },
  boat: c => { const g = new THREE.Group(); put(g, M(RB(1, 0.3, 0.42, 0.35), c[0] || '#e63946'), 0, 0.15, 0); put(g, M(RB(0.9, 0.06, 0.36), WOOD), 0, 0.3, 0); put(g, M(CYL(0.025, 0.025, 0.9), WOOD), 0, 0.72, 0);
    put(g, M(POLY('sail', [[0, 0.7], [0.4, 0], [0, 0]], 0.02), c[1] || WHITE), 0.2, 0.75, 0); put(g, M(RB(0.14, 0.08, 0.01), '#ffd166'), 0.06, 1.15, 0); g.rotation.y = -0.6; return g; },
  anchor: c => { const g = new THREE.Group(), a = c[0] || '#3d5a80'; put(g, M(CYL(0.05, 0.05, 0.8), a), 0, 0.5, 0); put(g, M(TOR(0.32, 0.05, PI), a), 0, 0.42, 0, 0, 0, PI); put(g, M(TOR(0.09, 0.04), a), 0, 0.98, 0); put(g, M(CYL(0.04, 0.04, 0.4), a), 0, 0.8, 0, 0, 0, H);
    [-1, 1].forEach(s => put(g, M(CONE(0.07, 0.14), a), s * 0.32, 0.47, 0)); return g; },
  turtle: c => { const g = new THREE.Group(), a = c[0] || '#80b918'; put(g, M(HEMI(0.4), c[1] || '#a47148', { map: patternTex('check', c[1] || '#a47148', '#8b5e34', 2) }), 0, 0.12, 0, 0, 0, 0, [1, 0.8, 1]);
    put(g, M(SPH(0.15), a), 0.45, 0.2, 0); [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([x, z]) => put(g, M(SPH(0.1), a), x * 0.25, 0.08, z * 0.28, 0, 0, 0, [1.3, 0.5, 1])); [-1, 1].forEach(s => put(g, M(SPH(0.025), DARK, { ol: false }), 0.56, 0.25, s * 0.07)); return g; },
  crab: c => { const g = new THREE.Group(), a = c[0] || '#ef233c'; put(g, M(SPH(0.32), a), 0, 0.3, 0, 0, 0, 0, [1.3, 0.7, 1]); [-1, 1].forEach(s => { put(g, M(SPH(0.12), a), s * 0.5, 0.48, 0.15, 0, 0, s * 0.4, [1, 0.8, 0.5]);
    put(g, M(CYL(0.02, 0.02, 0.2), a), s * 0.1, 0.55, 0.1); put(g, M(SPH(0.05), WHITE), s * 0.1, 0.66, 0.1); put(g, M(SPH(0.025), DARK, { ol: false }), s * 0.1, 0.66, 0.15); for (let i = 0; i < 3; i++) put(g, M(CAP(0.03, 0.18), a), s * 0.35, 0.15, -0.15 + i * 0.12, 0, 0, s * 1.0); }); return g; },
  bubble: c => { const g = new THREE.Group(); [[0, 0.45, 0, 0.3], [0.32, 0.8, 0.05, 0.16], [-0.28, 0.85, 0, 0.12]].forEach(([x, y, z, r]) => { put(g, M(SPH(r), c[0] || '#90e0ef', { op: 0.5 }), x, y, z); put(g, M(SPH(r * 0.25), WHITE, { ol: false }), x - r * 0.4, y + r * 0.4, z + r * 0.6); }); return g; },
  fishbowl: c => { const g = new THREE.Group(); put(g, M(SPH(0.45), '#caf0f8', { op: 0.45 }), 0, 0.45, 0); put(g, M(SPH(0.42), c[1] || '#4cc9f0', { op: 0.35 }), 0, 0.38, 0, 0, 0, 0, [1, 0.75, 1]); put(g, M(CYL(0.3, 0.3, 0.06), '#e9c46a'), 0, 0.05, 0);
    const f = B.fish([c[0] || '#ff8c42']); put(g, f, 0, 0.25, 0, 0, 0, 0, 0.45); return g; },
  sub: c => { const g = new THREE.Group(), a = c[0] || '#ffd166'; put(g, M(CAP(0.26, 0.6), a), 0, 0.35, 0, 0, 0, H); put(g, M(RB(0.3, 0.24, 0.24, 0.3), a), 0.05, 0.66, 0); put(g, M(CYL(0.02, 0.02, 0.2), DARK), 0.12, 0.85, 0);
    [-0.2, 0.1].forEach(x => put(g, M(CYL(0.09, 0.09, 0.04), '#90e0ef', { e: '#90e0ef', ei: 0.3 }), x, 0.37, 0.24, H)); put(g, M(CONE(0.12, 0.2, 4), c[1] || '#e63946'), -0.62, 0.35, 0, 0, 0, H); g.rotation.y = -0.5; return g; },

  // ----- 간식·요리 -----
  cake: c => { const g = new THREE.Group(); put(g, M(CYL(0.45, 0.45, 0.32, 28), c[0] || '#ffc8dd'), 0, 0.16, 0); put(g, M(CYL(0.32, 0.32, 0.26, 28), c[0] || '#ffc8dd'), 0, 0.45, 0);
    [0.32, 0.58].forEach((y, i) => put(g, M(TOR(i ? 0.32 : 0.45, 0.05), c[1] || WHITE), 0, y, 0, H)); put(g, M(SPH(0.08), '#e63946'), 0.12, 0.65, 0.1); put(g, M(CYL(0.025, 0.025, 0.18), '#4cc9f0'), -0.08, 0.7, 0);
    put(g, M(CONE(0.03, 0.07), '#ffbe0b', { e: '#ffbe0b', ei: 1, ol: false }), -0.08, 0.83, 0); return g; },
  cupcake: c => { const g = new THREE.Group(); put(g, M(CYL(0.3, 0.22, 0.32, 16), c[1] || '#a2d2ff', { map: patternTex('stripe', c[1] || '#a2d2ff', '#cde7ff', 4) }), 0, 0.16, 0);
    [[0.3, 0.38], [0.23, 0.5], [0.15, 0.6]].forEach(([r, y]) => put(g, M(SPH(r), c[0] || '#ffafcc'), 0, y, 0, 0, 0, 0, [1, 0.6, 1])); put(g, M(SPH(0.07), '#e63946'), 0, 0.72, 0); return g; },
  donut: c => { const g = new THREE.Group(); put(g, M(TOR(0.3, 0.16), '#e9b872'), 0, 0.16, 0, H); put(g, M(TOR(0.3, 0.15, PI * 2), c[0] || '#ff8fab'), 0, 0.2, 0, H, 0, 0, [1, 1, 0.6]);
    for (let i = 0; i < 10; i++) { const r = i * 0.63; put(g, M(CAP(0.012, 0.05), ['#ffd166', '#06d6a0', '#4cc9f0', WHITE][i % 4], { ol: false }), Math.cos(r) * 0.3, 0.3, Math.sin(r) * 0.3, 0, r, H); } g.rotation.x = 0.4; return g; },
  icecream: c => { const g = new THREE.Group(); put(g, M(CONE(0.22, 0.6, 12), '#e9b872', { map: patternTex('check', '#e9b872', '#d4a056', 3) }), 0, 0.3, 0, PI);
    put(g, M(SPH(0.24), c[0] || '#ffafcc'), 0, 0.68, 0); put(g, M(SPH(0.21), c[1] || '#b9fbc0'), 0, 0.95, 0); put(g, M(SPH(0.06), '#e63946'), 0, 1.17, 0); return g; },
  cookie: c => { const g = new THREE.Group(); put(g, M(CYL(0.45, 0.45, 0.1, 24), c[0] || '#d4a373'), 0, 0.45, 0, H); for (let i = 0; i < 6; i++) put(g, M(SPH(0.05), c[1] || '#5c4033', { ol: false }), Math.cos(i * 1.1) * 0.25 * (i % 2 + 0.6), 0.45 + Math.sin(i * 1.1) * 0.25 * (i % 2 + 0.6), 0.05, 0, 0, 0, [1, 1, 0.5]); return g; },
  ginger: c => { const g = new THREE.Group(), a = c[0] || '#c68b59'; put(g, M(CYL(0.16, 0.16, 0.1, 20), a), 0, 0.85, 0, H); put(g, M(RB(0.32, 0.4, 0.1, 0.5), a), 0, 0.5, 0);
    [-1, 1].forEach(s => { put(g, M(CAP(0.08, 0.16), a), s * 0.24, 0.58, 0, 0, 0, s * 1.1); put(g, M(CAP(0.08, 0.2), a), s * 0.1, 0.18, 0, 0, 0, s * 0.3); });
    eyes(g, 0.88, 0.06, 0.05, 0.025); [0.55, 0.43].forEach(y => put(g, M(SPH(0.03), c[1] || '#ef476f', { ol: false }), 0, y, 0.06)); put(g, M(TOR(0.05, 0.012, PI), WHITE, { ol: false }), 0, 0.82, 0.06, 0, 0, PI); return g; },
  candy: c => { const g = new THREE.Group(); put(g, M(SPH(0.25), c[0] || '#ff595e', { map: patternTex('stripe', c[0] || '#ff595e', c[1] || WHITE, 2) }), 0, 0.3, 0, 0, 0, 0, [1.2, 1, 1]);
    [-1, 1].forEach(s => put(g, M(CONE(0.17, 0.25, 8), c[0] || '#ff595e'), s * 0.4, 0.3, 0, 0, 0, s * H)); return g; },
  lolli: c => { const g = new THREE.Group(); put(g, M(CYL(0.035, 0.035, 0.6), WHITE), 0, 0.3, 0); put(g, M(CYL(0.36, 0.36, 0.12, 28), c[0] || '#ff70a6', { map: patternTex('stripe', c[0] || '#ff70a6', c[1] || '#ffd670', 2) }), 0, 0.85, 0, H); return g; },
  cane: c => { const g = new THREE.Group(); put(g, M(TUBE('cane', [[0, 0, 0], [0, 0.6, 0], [0.04, 0.85, 0], [0.18, 0.95, 0], [0.3, 0.88, 0], [0.33, 0.75, 0]], 0.07), c[0] || WHITE, { map: patternTex('stripe', c[0] || WHITE, c[1] || '#e63946', 3) }), 0, 0, 0); return g; },
  apple: c => { const g = new THREE.Group(); put(g, M(SPH(0.38), c[0] || '#e63946'), 0, 0.38, 0, 0, 0, 0, [1, 0.92, 1]); put(g, M(CYL(0.025, 0.025, 0.14), '#6d4c41'), 0, 0.76, 0); put(g, M(SPH(0.08), '#52b788'), 0.1, 0.78, 0, 0, 0, -0.6, [1.6, 0.4, 0.8]); return g; },
  strawberry: c => { const g = new THREE.Group(); put(g, M(SPH(0.32), c[0] || '#ef233c'), 0, 0.38, 0, PI, 0, 0, [1, 1.15, 1]); put(g, M(CONE(0.28, 0.4), c[0] || '#ef233c'), 0, 0.2, 0, PI);
    for (let i = 0; i < 5; i++) { const r = i / 5 * PI * 2; put(g, M(SPH(0.08), '#52b788'), Math.cos(r) * 0.12, 0.7, Math.sin(r) * 0.12, 0, -r, 0.6, [1.6, 0.4, 0.8]); }
    for (let i = 0; i < 8; i++) { const r = i * 0.8; put(g, M(SPH(0.02), '#ffd166', { ol: false }), Math.cos(r) * 0.27, 0.32 + (i % 3) * 0.1, Math.sin(r) * 0.27); } return g; },
  pizza: c => { const g = new THREE.Group(); put(g, M(CYL(0.6, 0.6, 0.08, 3, false), '#f4d35e'), 0, 0.04, 0, 0, 0, 0, [1, 1, 0.6]); put(g, M(CAP(0.07, 0.6), '#d4a056'), -0.3, 0.07, 0, 0, 0.5, H);
    [[0.1, 0], [0.25, 0.1], [0.05, -0.15]].forEach(([x, z]) => put(g, M(CYL(0.07, 0.07, 0.03), c[0] || '#e63946', { ol: false }), x, 0.1, z)); g.rotation.x = 0.5; return g; },
  bread: c => { const g = new THREE.Group(); put(g, M(RB(0.8, 0.4, 0.5, 0.6), c[0] || '#e9b872'), 0, 0.2, 0); [-0.2, 0, 0.2].forEach(x => put(g, M(CAP(0.02, 0.3), c[1] || '#fff3dc', { ol: false }), x, 0.4, 0, H, 0, 0.4)); return g; },
  pan: c => { const g = new THREE.Group(); put(g, M(CYL(0.42, 0.36, 0.12, 24), c[0] || '#3d405b'), 0, 0.06, 0); put(g, M(CYL(0.04, 0.05, 0.6), WOOD), 0.62, 0.1, 0, 0, 0, H); put(g, M(SPH(0.14), WHITE, { ol: false }), 0, 0.12, 0, 0, 0, 0, [1.4, 0.2, 1.2]); put(g, M(SPH(0.07), '#ffbe0b', { ol: false }), 0, 0.15, 0, 0, 0, 0, [1, 0.5, 1]); return g; },
  chefhat: c => { const g = new THREE.Group(); put(g, M(CYL(0.3, 0.3, 0.32), c[0] || WHITE), 0, 0.16, 0); [[-0.18, 0], [0.18, 0], [0, 0.15], [0, -0.15], [0, 0]].forEach(([x, z]) => put(g, M(SPH(0.22), c[0] || WHITE), x, 0.48, z)); return g; },
  spoon: c => { const g = new THREE.Group(); put(g, M(SPH(0.16), c[0] || SILVER), 0, 0.85, 0, 0, 0, 0, [1, 1.3, 0.3]); put(g, M(CYL(0.035, 0.05, 0.7), c[0] || SILVER), 0, 0.35, 0); put(g, M(TOR(0.06, 0.02), c[1] || '#ff8fab'), 0, 0.05, 0); g.rotation.z = 0.5; return g; },
  mug: c => { const g = new THREE.Group(); put(g, M(CYL(0.3, 0.27, 0.6, 24), c[0] || '#e63946', { map: c[1] ? patternTex('dots', c[0] || '#e63946', c[1], 3) : null }), 0, 0.3, 0); put(g, M(TOR(0.15, 0.05), c[0] || '#e63946'), 0.33, 0.32, 0);
    put(g, M(CYL(0.27, 0.27, 0.02, 24), '#7f4f24', { ol: false }), 0, 0.57, 0); [[0.08, 0.04], [-0.1, -0.05], [0, -0.12]].forEach(([x, z]) => put(g, M(RB(0.1, 0.08, 0.1, 0.5), WHITE), x, 0.6, z)); return g; },
  juice: c => { const g = new THREE.Group(); put(g, M(CYL(0.26, 0.22, 0.7, 20), '#e9ecef', { op: 0.55 }), 0, 0.35, 0); put(g, M(CYL(0.24, 0.2, 0.5, 20), c[0] || '#ffbe0b', { op: 0.85 }), 0, 0.27, 0); put(g, M(CYL(0.025, 0.025, 0.7), c[1] || '#ff006e'), 0.08, 0.6, 0, 0, 0, -0.25); return g; },
  jam: c => { const g = new THREE.Group(); put(g, M(CYL(0.3, 0.3, 0.5, 24), c[0] || '#d00000'), 0, 0.25, 0); put(g, M(CYL(0.32, 0.32, 0.12, 24), WHITE, { map: patternTex('check', WHITE, c[1] || '#ff8fab', 4) }), 0, 0.55, 0); put(g, M(RB(0.34, 0.2, 0.02), '#fff3dc', { ol: false }), 0, 0.27, 0.3); return g; },
  ramen: c => { const g = new THREE.Group(); put(g, M(LATHE('rbowl', [[0.22, 0], [0.45, 0.25], [0.48, 0.4], [0.44, 0.4], [0.3, 0.12], [0, 0.12]]), c[0] || '#e63946'), 0, 0, 0); put(g, M(CYL(0.44, 0.44, 0.02, 24), '#f4a261', { ol: false }), 0, 0.33, 0);
    put(g, M(SPH(0.1), WHITE, { ol: false }), 0.12, 0.35, 0.05, 0, 0, 0, [1, 0.4, 1]); put(g, M(SPH(0.05), '#ffbe0b', { ol: false }), 0.12, 0.37, 0.05, 0, 0, 0, [1, 0.5, 1]); [-1, 1].forEach(s => put(g, M(CYL(0.015, 0.015, 0.8), WOOD), -0.1 + s * 0.04, 0.5, 0, 0, 0, 0.7)); return g; },
  sushi: c => { const g = new THREE.Group(); put(g, M(RB(0.5, 0.22, 0.28, 0.5), WHITE), 0, 0.11, 0); put(g, M(RB(0.56, 0.08, 0.3, 0.5), c[0] || '#ff8c69'), 0, 0.25, 0); put(g, M(RB(0.1, 0.32, 0.3, 0.5), '#2b2d42'), 0, 0.15, 0); return g; },

  // ----- 옷·꾸미기 -----
  sweater: c => { const g = new THREE.Group(), a = c[0] || '#e63946'; put(g, M(RB(0.7, 0.72, 0.3, 0.3), a, { map: patternTex('band', a, c[1] || WHITE, 1) }), 0, 0.4, 0);
    [-1, 1].forEach(s => put(g, M(CAP(0.11, 0.42), a), s * 0.45, 0.42, 0, 0, 0, s * 0.35)); put(g, M(TOR(0.12, 0.04), c[1] || WHITE), 0, 0.76, 0, H); return g; },
  dress: c => { const g = new THREE.Group(); put(g, M(CONE(0.5, 0.7, 24, true), c[0] || '#ffafcc'), 0, 0.35, 0); put(g, M(RB(0.36, 0.36, 0.26, 0.4), c[0] || '#ffafcc'), 0, 0.85, 0);
    put(g, M(TOR(0.48, 0.04), c[1] || WHITE), 0, 0.02, 0, H); [-1, 1].forEach(s => put(g, M(SPH(0.07), c[1] || WHITE), s * 0.2, 1.05, 0, 0, 0, 0, [1, 0.6, 0.6])); put(g, M(SPH(0.07), c[1] || GOLD), 0, 0.7, 0.14, 0, 0, 0, [1.6, 0.8, 0.5]); return g; },
  hat: c => { const g = new THREE.Group(); put(g, M(HEMI(0.42), c[0] || '#4361ee', { map: patternTex('stripe', c[0] || '#4361ee', c[1] || WHITE, 3) }), 0, 0.12, 0, 0, 0, 0, [1, 1.1, 1]); put(g, M(TOR(0.42, 0.1), c[1] || WHITE), 0, 0.12, 0, H); put(g, M(SPH(0.14), c[1] || WHITE), 0, 0.6, 0); return g; },
  scarf: c => { const g = new THREE.Group(), a = c[0] || '#2a9d8f'; put(g, M(TOR(0.32, 0.12), a, { map: patternTex('stripe', a, c[1] || '#e9c46a', 3) }), 0, 0.5, 0, H * 0.8);
    [-1, 1].forEach(s => put(g, M(RB(0.2, 0.6, 0.06, 0.3), a, { map: patternTex('band', a, c[1] || '#e9c46a', 1) }), s * 0.1 + 0.15, 0.2, 0.3, 0.2, 0, s * 0.15)); return g; },
  mitten: c => { const g = new THREE.Group(), a = c[0] || '#ff595e'; [-1, 1].forEach(s => { const m = new THREE.Group(); put(m, M(CAP(0.2, 0.3), a), 0, 0.42, 0); put(m, M(CAP(0.08, 0.12), a), 0.2, 0.38, 0, 0, 0, -0.6); put(m, M(CYL(0.2, 0.2, 0.14), c[1] || WHITE), 0, 0.08, 0); put(g, m, s * 0.3, 0, 0, 0, 0, s * -0.15, [s, 1, 1]); }); return g; },
  sock: c => { const g = new THREE.Group(), a = c[0] || '#e63946'; put(g, M(CYL(0.2, 0.2, 0.6, 20), a, { map: patternTex('stripe', a, c[1] || WHITE, 2) }), 0, 0.55, 0); put(g, M(CAP(0.2, 0.3), a), 0.15, 0.22, 0, 0, 0, H);
    put(g, M(CYL(0.23, 0.23, 0.18, 20), c[1] || WHITE), 0, 0.9, 0); put(g, M(TOR(0.07, 0.02), c[1] || WHITE), -0.2, 0.95, 0, 0, H, 0); return g; },
  hairpin: c => { const g = new THREE.Group(); [-1, 1].forEach(s => put(g, M(CONE(0.22, 0.4, 16), c[0] || '#ff70a6'), s * 0.22, 0.4, 0, 0, 0, s * H, [1, 1, 0.45])); put(g, M(SPH(0.1), c[1] || '#ffd670'), 0, 0.4, 0); return g; },
  necklace: c => { const g = new THREE.Group(); for (let i = 0; i < 14; i++) { const r = PI + i / 13 * PI; put(g, M(SPH(0.05), c[1] || WHITE), Math.cos(r) * 0.4, 0.75 + Math.sin(r) * 0.5, 0); } put(g, M(HEART(0.14, 0.06), c[0] || '#ff4d6d'), 0, 0.16, 0.02); return g; },
  ring: c => { const g = new THREE.Group(); put(g, M(TOR(0.3, 0.06), c[1] || GOLD), 0, 0.36, 0); put(g, M(OCT(0.15), c[0] || '#4cc9f0', { e: c[0] || '#4cc9f0', ei: 0.3 }), 0, 0.72, 0, 0, 0.4, 0, [1, 1.2, 1]); return g; },
  bag: c => { const g = new THREE.Group(), a = c[0] || '#ff8fab'; put(g, M(RB(0.8, 0.6, 0.3, 0.3), a), 0, 0.3, 0); put(g, M(TOR(0.26, 0.04, PI), c[1] || a), 0, 0.6, 0); put(g, M(RB(0.82, 0.22, 0.32, 0.3), c[1] || '#ffc8dd'), 0, 0.52, 0.0);
    put(g, M(SPH(0.05), GOLD), 0, 0.44, 0.17); return g; },
  mirror: c => { const g = new THREE.Group(); put(g, M(TOR(0.3, 0.06), c[0] || '#ffafcc'), 0, 0.72, 0); put(g, M(CYL(0.28, 0.28, 0.02, 24), '#caf0f8', { e: '#ffffff', ei: 0.15 }), 0, 0.72, 0, H);
    put(g, M(CAP(0.05, 0.36), c[0] || '#ffafcc'), 0, 0.22, 0); put(g, M(HEART(0.07, 0.02), c[1] || '#ff4d6d', { ol: false }), 0, 1.03, 0); return g; },
  lipbalm: c => { const g = new THREE.Group(); put(g, M(CYL(0.12, 0.12, 0.5), c[0] || '#ffafcc'), 0, 0.25, 0); put(g, M(CYL(0.1, 0.1, 0.18), c[1] || '#ff4d6d'), 0, 0.58, 0); put(g, M(SPH(0.1), c[1] || '#ff4d6d'), 0, 0.68, 0, 0, 0, 0, [1, 0.6, 1]); return g; },
  glassesstar: c => { const g = B.glasses([c[0] || '#ff70a6']); return g; },
  shoes2: c => B.shoe(c),
  tiara: c => { const g = new THREE.Group(); put(g, M(TOR(0.4, 0.035, PI), c[0] || SILVER), 0, 0.1, 0, 0, 0, 0); [0.5, 0.75, 1, 1.25, 1.5].forEach((t, i) => { const r = t * H; put(g, M(CONE(0.06, i === 2 ? 0.34 : 0.2), c[0] || SILVER), Math.cos(r) * 0.4, 0.1 + Math.sin(r) * 0.4 + 0.08, 0, 0, 0, r - H); });
    put(g, M(OCT(0.07), c[1] || '#ff70a6', { e: c[1] || '#ff70a6', ei: 0.3 }), 0, 0.52, 0.03); return g; },
  umbrella: c => { const g = new THREE.Group(); put(g, M(HEMI(0.5), c[0] || '#ff595e', { map: patternTex('stripe', c[0] || '#ff595e', c[1] || WHITE, 2) }), 0, 0.75, 0, 0, 0, 0, [1, 0.55, 1]);
    put(g, M(CYL(0.025, 0.025, 0.8), DARK), 0, 0.4, 0); put(g, M(TOR(0.07, 0.025, PI), DARK), 0.07, 0.02, 0, 0, 0, PI); return g; },

  // ----- 공주·마법 -----
  crown: c => { const g = new THREE.Group(), a = c[0] || GOLD; put(g, M(CYL(0.4, 0.38, 0.3, 24, true), a), 0, 0.15, 0); for (let i = 0; i < 6; i++) { const r = i / 6 * PI * 2; put(g, M(CONE(0.1, 0.22, 6), a), Math.cos(r) * 0.37, 0.4, Math.sin(r) * 0.37); put(g, M(SPH(0.04), a), Math.cos(r) * 0.37, 0.53, Math.sin(r) * 0.37); }
    [0, 2, 4].forEach(i => { const r = i / 6 * PI * 2 + 0.5; put(g, M(OCT(0.06), [c[1] || '#e63946', '#4361ee', '#06d6a0'][i / 2], { e: '#ffffff', ei: 0.1 }), Math.cos(r) * 0.4, 0.15, Math.sin(r) * 0.4); }); return g; },
  wand: c => { const g = new THREE.Group(); put(g, M(CYL(0.035, 0.035, 0.9), c[1] || WHITE), 0, 0.45, 0, 0, 0, 0.3); put(g, M(STAR(5, 0.24, 0.1, 0.1), c[0] || '#ffd166', { e: c[0] || '#ffd166', ei: 0.35 }), -0.28, 0.95, 0, 0, 0, 0.3);
    [[0.1, 1.1], [-0.5, 1.15], [-0.45, 0.75]].forEach(([x, y]) => put(g, M(OCT(0.04), WHITE, { e: '#ffffff', ei: 0.8, ol: false }), x, y, 0)); return g; },
  gem: c => { const g = new THREE.Group(); put(g, M(OCT(0.4), c[0] || '#4cc9f0', { e: c[0] || '#4cc9f0', ei: 0.25 }), 0, 0.5, 0, 0, 0.5, 0, [1, 1.25, 1]); return g; },
  potion: c => B.bottle(c),
  bottle: c => { const g = new THREE.Group(); put(g, M(SPH(0.32), '#e9ecef', { op: 0.5 }), 0, 0.34, 0); put(g, M(SPH(0.28), c[0] || '#c77dff', { e: c[0] || '#c77dff', ei: 0.25 }), 0, 0.3, 0, 0, 0, 0, [1, 0.8, 1]);
    put(g, M(CYL(0.1, 0.1, 0.24), '#e9ecef', { op: 0.5 }), 0, 0.72, 0); put(g, M(CYL(0.11, 0.09, 0.12), WOOD), 0, 0.88, 0); put(g, M(TOR(0.1, 0.025), c[1] || '#ffd166'), 0, 0.68, 0, H); return g; },
  castlepink: c => B.castle([c[0] || '#ffc8dd', c[1] || '#c77dff']),
  carriage: c => { const g = new THREE.Group(), a = c[0] || '#ffd166'; put(g, M(SPH(0.42), a), 0, 0.6, 0, 0, 0, 0, [1, 0.9, 0.8]); put(g, M(RB(0.3, 0.3, 0.02, 0.4), '#caf0f8', { ol: false }), 0, 0.64, 0.33);
    [-0.3, 0.3].forEach(x => [-0.3, 0.3].forEach(z => { put(g, M(TOR(0.15, 0.025), c[1] || '#f8f9fa'), x, 0.16, z); })); put(g, M(CONE(0.07, 0.18), c[1] || '#ff70a6'), 0, 1.04, 0); return g; },
  rainbow: c => { const g = new THREE.Group(); ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#9b5de5'].forEach((col, i) => put(g, M(TOR(0.55 - i * 0.08, 0.04, PI), col), 0, 0.1, 0));
    [-1, 1].forEach(s => [0, 1, 2].forEach(i => put(g, M(SPH(0.11), WHITE), s * (0.5 + (i - 1) * 0.12), 0.08 + (i === 1 ? 0.06 : 0), 0))); return g; },
  heart: c => { const g = new THREE.Group(); put(g, M(HEART(0.45), c[0] || '#ff4d6d'), 0, 0.42, 0); return g; },
  fairydust: c => B.glitter(c),
  book2: c => B.book(c),
  mapmagic: c => B.scroll(c),
  key: c => { const g = new THREE.Group(), a = c[0] || GOLD; put(g, M(TOR(0.16, 0.05), a), 0, 0.85, 0); put(g, M(CYL(0.045, 0.045, 0.62), a), 0, 0.4, 0); [0.12, 0.24].forEach(y => put(g, M(RB(0.14, 0.07, 0.07), a), 0.08, y, 0)); put(g, M(HEART(0.06, 0.03), c[1] || '#ff4d6d', { ol: false }), 0, 0.85, 0.03); return g; },
  shoesglass: c => { const g = B.shoe(['#caf0f8', WHITE]); return g; },
  musicbox2: c => B.musicbox(c),

  // ----- 카드·스티커·피규어 -----
  card: c => { const g = new THREE.Group(); put(g, M(RB(0.62, 0.86, 0.03, 0.12), c[0] || '#ffd166'), 0, 0.45, 0); put(g, M(RB(0.5, 0.42, 0.035, 0.1), c[1] || '#4cc9f0', { ol: false }), 0, 0.55, 0);
    put(g, M(STAR(5, 0.12, 0.05, 0.01), WHITE, { ol: false, e: '#ffffff', ei: 0.3 }), 0, 0.55, 0.025); put(g, M(RB(0.4, 0.04, 0.036), '#3d405b', { ol: false }), 0, 0.24, 0); put(g, M(RB(0.3, 0.04, 0.036), '#3d405b', { ol: false }), 0, 0.17, 0); g.rotation.y = -0.3; return g; },
  cards: c => { const g = new THREE.Group(); ['#ef476f', '#ffd166', '#4cc9f0'].forEach((col, i) => { const k = B.card([c[i] || col, ['#06d6a0', '#9b5de5', '#ffbe0b'][i]]); put(g, k, (i - 1) * 0.22, 0, i * 0.02, 0, 0, (1 - i) * 0.3); }); return g; },
  album: c => { const g = new THREE.Group(); put(g, M(RB(0.9, 1.0, 0.18, 0.15), c[0] || '#9b5de5'), 0, 0.5, 0); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) put(g, M(RB(0.2, 0.26, 0.02, 0.2), ['#ffd166', '#06d6a0', '#ef476f'][(i + j) % 3], { ol: false }), -0.18 + j * 0.36 - 0.0 + (i - 1) * 0.0, 0.25 + i * 0.27, 0.095);
    g.rotation.y = -0.3; return g; },
  sticker: c => { const g = new THREE.Group(); put(g, M(RB(0.8, 0.95, 0.02, 0.1), WHITE), 0, 0.48, 0); [[-0.18, 0.7, 'heart'], [0.18, 0.72, 'star'], [-0.15, 0.3, 'star'], [0.2, 0.3, 'heart']].forEach(([x, y, k], i) =>
    put(g, M(k === 'heart' ? HEART(0.12, 0.02) : STAR(5, 0.14, 0.06, 0.02), [c[0] || '#ff4d6d', c[1] || '#ffd166', '#4cc9f0', '#06d6a0'][i]), x, y, 0.03)); g.rotation.x = -0.3; return g; },
  ddakji: c => { const g = new THREE.Group(); put(g, M(RB(0.6, 0.1, 0.6, 0.12), c[0] || '#e63946'), 0, 0.05, 0); put(g, M(RB(0.06, 0.11, 0.86, 0.1), c[1] || '#4361ee'), 0, 0.06, 0, 0, PI / 4); put(g, M(RB(0.06, 0.11, 0.86, 0.1), c[1] || '#4361ee'), 0, 0.06, 0, 0, -PI / 4); g.rotation.x = 0.6; return g; },
  figure: c => { const g = new THREE.Group(); put(g, M(CYL(0.3, 0.34, 0.08, 24), '#3d405b'), 0, 0.04, 0); const p = plush([c[0] || '#ffd166', c[1] || '#ff595e'], 'chick'); put(g, p, 0, 0.08, 0, 0, 0, 0, 0.9);
    put(g, M(CONE(0.2, 0.3, 4), c[1] || '#ff595e'), 0, 1.0, 0, 0, PI / 4, 0, [1, 1, 0.3]); return g; },
  capsule: c => { const g = new THREE.Group(); put(g, M(HEMI(0.35), c[0] || '#ef476f'), 0, 0.38, 0); put(g, M(HEMI(0.35), '#e9ecef', { op: 0.6 }), 0, 0.38, 0, PI); put(g, M(SPH(0.15), c[1] || '#ffd166'), 0, 0.3, 0); put(g, M(TOR(0.35, 0.025), WHITE), 0, 0.38, 0, H); return g; },
  gacha: c => { const g = new THREE.Group(); put(g, M(RB(0.6, 0.5, 0.5, 0.2), c[0] || '#ef476f'), 0, 0.25, 0); put(g, M(SPH(0.32), '#caf0f8', { op: 0.5 }), 0, 0.75, 0);
    [[0.1, 0.65, 0.1, '#ffd166'], [-0.12, 0.66, -0.05, '#06d6a0'], [0.02, 0.85, 0, '#4cc9f0']].forEach(([x, y, z, col]) => put(g, M(SPH(0.1), col), x, y, z)); put(g, M(CYL(0.08, 0.08, 0.05), GOLD), 0, 0.3, 0.26, H); return g; },
  badge: c => { const g = new THREE.Group(); put(g, M(CYL(0.35, 0.35, 0.08, 28), c[0] || '#ffd166'), 0, 0.4, 0, H); put(g, M(STAR(5, 0.18, 0.08, 0.03), c[1] || '#ef476f'), 0, 0.4, 0.06); put(g, M(TOR(0.35, 0.025), WHITE, { ol: false }), 0, 0.4, 0.04); return g; },

  // ----- 겨울·크리스마스 -----
  snowman: c => { const g = new THREE.Group(); put(g, M(SPH(0.34), WHITE), 0, 0.3, 0); put(g, M(SPH(0.25), WHITE), 0, 0.78, 0); put(g, M(CONE(0.04, 0.18), '#ff8c42'), 0, 0.78, 0.3, H);
    eyes(g, 0.85, 0.22, 0.08, 0.03); put(g, M(TOR(0.2, 0.06), c[0] || '#e63946'), 0, 0.6, 0, H); put(g, M(CYL(0.17, 0.17, 0.25), c[1] || DARK), 0, 1.1, 0); put(g, M(CYL(0.25, 0.25, 0.03), c[1] || DARK), 0, 0.99, 0); return g; },
  tree: c => { const g = new THREE.Group(); put(g, M(CYL(0.08, 0.1, 0.2), WOOD), 0, 0.1, 0); [[0.42, 0.45, 0.4], [0.33, 0.4, 0.68], [0.22, 0.34, 0.93]].forEach(([r, h, y]) => put(g, M(CONE(r, h, 10), c[0] || '#2d6a4f'), 0, y, 0));
    put(g, M(STAR(5, 0.1, 0.045, 0.04), GOLD, { e: GOLD, ei: 0.5 }), 0, 1.15, 0); [[0.2, 0.45, 0.25, '#e63946'], [-0.22, 0.6, 0.2, '#ffd166'], [0.1, 0.8, 0.2, '#4cc9f0']].forEach(([x, y, z, col]) => put(g, M(SPH(0.05), col, { ol: false }), x, y, z)); return g; },
  ornament: c => { const g = new THREE.Group(); put(g, M(SPH(0.38), c[0] || '#e63946', { map: patternTex('band', c[0] || '#e63946', c[1] || GOLD, 1) }), 0, 0.4, 0); put(g, M(CYL(0.1, 0.1, 0.1), GOLD), 0, 0.82, 0); put(g, M(TOR(0.05, 0.015), GOLD), 0, 0.9, 0); return g; },
  wreath: c => { const g = new THREE.Group(); put(g, M(TOR(0.36, 0.13), c[0] || '#40916c'), 0, 0.5, 0); for (let i = 0; i < 5; i++) { const r = i * 1.25 + 0.3; put(g, M(SPH(0.05), '#e63946'), Math.cos(r) * 0.4, 0.5 + Math.sin(r) * 0.4, 0.12); }
    [-1, 1].forEach(s => put(g, M(SPH(0.1), c[1] || '#e63946'), s * 0.1, 0.16, 0.12, 0, 0, s * 0.5, [1.5, 0.8, 0.6])); return g; },
  snowglobe: c => { const g = new THREE.Group(); put(g, M(CYL(0.3, 0.36, 0.2, 24), c[0] || '#c1121f'), 0, 0.1, 0); put(g, M(SPH(0.36), '#e0fbfc', { op: 0.35 }), 0, 0.52, 0);
    const t = B.tree([]); put(g, t, 0, 0.22, 0, 0, 0, 0, 0.4); for (let i = 0; i < 6; i++) put(g, M(SPH(0.02), WHITE, { ol: false }), Math.sin(i * 2) * 0.2, 0.4 + i * 0.06, Math.cos(i * 2) * 0.2); return g; },
  candle: c => { const g = new THREE.Group(); put(g, M(CYL(0.15, 0.15, 0.6), c[0] || '#e63946'), 0, 0.35, 0); put(g, M(CYL(0.3, 0.26, 0.06, 20), GOLD), 0, 0.03, 0); put(g, M(SPH(0.07), '#ffd166', { e: '#ffbe0b', ei: 1, ol: false }), 0, 0.75, 0, 0, 0, 0, [1, 1.6, 1]); return g; },
  lantern: c => { const g = new THREE.Group(); put(g, M(RB(0.4, 0.5, 0.4, 0.15), '#fff3b0', { e: '#ffd166', ei: 0.7, ol: false }), 0, 0.4, 0); [-1, 1].forEach(sx => [-1, 1].forEach(sz => put(g, M(CYL(0.025, 0.025, 0.55), c[0] || '#3d405b'), sx * 0.2, 0.4, sz * 0.2)));
    put(g, M(CONE(0.32, 0.2, 4), c[0] || '#3d405b'), 0, 0.75, 0, 0, PI / 4); put(g, M(TOR(0.07, 0.02), c[0] || '#3d405b'), 0, 0.9, 0); put(g, M(RB(0.46, 0.06, 0.46), c[0] || '#3d405b'), 0, 0.12, 0); return g; },
  gift: c => box3(c),
  sled: c => { const g = new THREE.Group(); put(g, M(RB(0.9, 0.08, 0.44, 0.2), c[0] || '#e63946'), 0, 0.3, 0); [-1, 1].forEach(s => { put(g, M(TUBE('runner', [[-0.5, 0.05, 0], [0.4, 0.05, 0], [0.55, 0.15, 0], [0.5, 0.3, 0]], 0.025), GOLD), 0, 0, s * 0.18); put(g, M(CYL(0.02, 0.02, 0.24), GOLD), -0.25, 0.18, s * 0.18); put(g, M(CYL(0.02, 0.02, 0.24), GOLD), 0.25, 0.18, s * 0.18); }); g.rotation.y = -0.5; return g; },
  stocking: c => B.sock([c[0] || '#e63946', c[1] || WHITE]),
  santahat: c => { const g = new THREE.Group(); put(g, M(CONE(0.36, 0.7, 20), c[0] || '#e63946'), 0, 0.45, 0, 0, 0, -0.25); put(g, M(TOR(0.36, 0.1), WHITE), 0, 0.1, 0, H); put(g, M(SPH(0.12), WHITE), 0.2, 0.78, 0); return g; },
  star: c => { const g = new THREE.Group(); put(g, M(STAR(5, 0.48, 0.21, 0.16), c[0] || GOLD, { e: c[0] || GOLD, ei: 0.3 }), 0, 0.48, 0); eyes(g, 0.52, 0.12, 0.09, 0.035); blush(g, 0.44, 0.11, 0.17); return g; },
  snowflake: c => { const g = new THREE.Group(), a = c[0] || '#bde0fe'; for (let i = 0; i < 3; i++) put(g, M(RB(0.07, 0.9, 0.05, 0.4), a, { e: a, ei: 0.2 }), 0, 0.5, 0, 0, 0, i * PI / 3);
    for (let i = 0; i < 6; i++) { const r = i * PI / 3; [-1, 1].forEach(s => put(g, M(RB(0.05, 0.18, 0.04, 0.4), a), Math.sin(r) * 0.3, 0.5 + Math.cos(r) * 0.3, 0, 0, 0, -r + s * 0.7)); } return g; },
  reindeer: c => plush([c[0] || '#b9824f', c[1] || '#f3dcc0'], 'deer'),
  letter: c => { const g = new THREE.Group(); put(g, M(RB(0.9, 0.6, 0.04, 0.12), c[0] || '#fff3dc'), 0, 0.3, 0); put(g, M(POLY('flap', [[-0.43, 0.28], [0.43, 0.28], [0, -0.05]], 0.02), c[1] || '#f6e7c1'), 0, 0.42, 0.03);
    put(g, M(CYL(0.08, 0.08, 0.03, 16), '#e63946'), 0, 0.37, 0.06, H); g.rotation.x = -0.25; return g; },
  cocoa: c => B.mug([c[0] || '#e63946', c[1] || WHITE]),
  bellpair: c => { const g = new THREE.Group(); [-1, 1].forEach(s => { const b = B.bell([c[0] || GOLD, c[1] || '#e63946']); put(g, b, s * 0.22, 0, 0, 0, 0, s * -0.3, 0.8); }); return g; },
  clock: c => { const g = new THREE.Group(); put(g, M(CYL(0.36, 0.36, 0.2, 28), c[0] || '#ef476f'), 0, 0.45, 0, H); put(g, M(CYL(0.3, 0.3, 0.21, 28), WHITE, { ol: false }), 0, 0.45, 0, H);
    put(g, M(RB(0.03, 0.2, 0.02), DARK, { ol: false }), 0, 0.53, 0.11); put(g, M(RB(0.15, 0.03, 0.02), DARK, { ol: false }), 0.06, 0.45, 0.11); [-1, 1].forEach(s => { put(g, M(HEMI(0.11), c[1] || GOLD), s * 0.24, 0.8, 0, 0, 0, s * -0.5); put(g, M(CYL(0.02, 0.02, 0.16), DARK), s * 0.22, 0.1, 0, 0, 0, s * 0.4); }); return g; },
  sun: c => { const g = new THREE.Group(); put(g, M(SPH(0.3), c[0] || '#ffd166', { e: '#ffbe0b', ei: 0.3 }), 0, 0.5, 0, 0, 0, 0, [1, 1, 0.6]); for (let i = 0; i < 8; i++) { const r = i * PI / 4; put(g, M(CONE(0.07, 0.16, 6), c[1] || '#ff9f1c'), Math.cos(r) * 0.42, 0.5 + Math.sin(r) * 0.42, 0, 0, 0, r - H); }
    eyes(g, 0.55, 0.18, 0.09, 0.03); blush(g, 0.46, 0.17, 0.16); return g; },
  plant: c => { const g = new THREE.Group(); put(g, M(CYL(0.26, 0.2, 0.32, 16), c[1] || '#e76f51'), 0, 0.16, 0); put(g, M(CYL(0.24, 0.24, 0.03, 16), '#6d4c41', { ol: false }), 0, 0.31, 0);
    put(g, M(CYL(0.02, 0.02, 0.4), '#52b788'), 0, 0.5, 0); for (let i = 0; i < 5; i++) { const r = i / 5 * PI * 2; put(g, M(SPH(0.09), c[0] || '#ff8fab'), Math.cos(r) * 0.12, 0.72 + Math.sin(r) * 0.12, 0, 0, 0, 0, [1, 1, 0.5]); } put(g, M(SPH(0.07), '#ffd166'), 0, 0.72, 0.03); return g; },
};

// 예전 이름·별칭
const ALIAS = { pet: 'dog', present: 'gift' };
export const KINDS = Object.keys(B);

export function build(kind, colors = []) {
  const f = B[kind] || B[ALIAS[kind]] || B.gift;
  return f(colors || []);
}
