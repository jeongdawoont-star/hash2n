// 더 그린 모델: 이모지에 없거나 어울리는 모델이 없던 아이들 소원 (2026-11-08 보충)
import { THREE, M, put, SPH, HEMI, CYL, CONE, TOR, CAP, RB, TUBE, STAR, HEART, PUFF, LATHE, POLY, patternTex } from './kit.js';

const PI = Math.PI, H = PI / 2;
const WHITE = '#fffaf2', DARK = '#3b2f2f', GOLD = '#f2c14e', SILVER = '#cfd6de', WOOD = '#c98b55', PINK = '#ff9fb5', RED = '#e63946', SKY = '#7fc8f8', MINT = '#7dd3b0', LILAC = '#b79cf2';
const RAINBOW = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa'];
const eye2 = (g, y, z, sp = 0.08, r = 0.03) => { put(g, M(SPH(r), DARK, { ol: false }), -sp, y, z); put(g, M(SPH(r), DARK, { ol: false }), sp, y, z); };

export function more() {
  const X = {};

  // ---------- 장난감 ----------
  X.tamagotchi = c => { // 달걀 모양 키우기 게임기
    const g = new THREE.Group(), a = c[0] || '#ff8fab';
    put(g, M(SPH(0.4), a), 0, 0.45, 0, 0, 0, 0, [0.9, 1.08, 0.45]);
    put(g, M(RB(0.36, 0.3, 0.06, 0.2), '#d8f3dc'), 0, 0.52, 0.17);
    put(g, M(SPH(0.07), '#3b2f2f', { ol: false }), 0, 0.5, 0.21, 0, 0, 0, [1, 0.9, 0.3]); // 화면 속 친구
    eye2(g, 0.53, 0.225, 0.025, 0.012);
    [-0.12, 0, 0.12].forEach((x, i) => put(g, M(SPH(0.045), [GOLD, '#4dabf7', '#69db7c'][i]), x, 0.26 - Math.abs(x) * 0.3, 0.16, 0, 0, 0, [1, 1, 0.6]));
    put(g, M(TOR(0.07, 0.022), SILVER), 0, 0.92, 0);
    return g;
  };
  X.squishy = c => { // 말랑이
    const g = new THREE.Group(), a = c[0] || '#ffd6e0';
    put(g, M(SPH(0.4), a), 0, 0.32, 0, 0, 0, 0, [1.15, 0.8, 1]);
    eye2(g, 0.38, 0.38, 0.12, 0.035);
    put(g, M(TOR(0.05, 0.015, PI), DARK, { ol: false }), 0, 0.31, 0.39, 0, 0, PI);
    [-1, 1].forEach(s => put(g, M(SPH(0.05), PINK, { ol: false }), s * 0.22, 0.3, 0.33, 0, 0, 0, [1, 0.6, 0.3]));
    return g;
  };
  X.popit = c => { // 팝잇: 무지개 뽁뽁이 판
    const g = new THREE.Group();
    for (let r = 0; r < 6; r++) {
      put(g, M(RB(0.9, 0.1, 0.16, 0.3), c[r] || RAINBOW[r]), 0, 0.05, -0.4 + r * 0.16);
      for (let k = 0; k < 5; k++) put(g, M(HEMI(0.06), c[r] || RAINBOW[r]), -0.32 + k * 0.16, 0.1, -0.4 + r * 0.16);
    }
    g.rotation.x = 0.75; return g;
  };
  X.sandbucket = c => { // 모래 놀이 양동이 + 삽
    const g = new THREE.Group(), a = c[0] || '#4dabf7';
    put(g, M(LATHE('bucket', [[0, 0], [0.26, 0], [0.33, 0.5], [0.3, 0.5], [0, 0.04]]), a), 0, 0, 0);
    put(g, M(SPH(0.3), '#f1d39a'), 0, 0.46, 0, 0, 0, 0, [1, 0.35, 1]);
    put(g, M(TOR(0.32, 0.02, PI), SILVER), 0, 0.5, 0, 0, 0, 0);
    const sh = new THREE.Group(); put(sh, M(CYL(0.025, 0.025, 0.5), c[1] || GOLD), 0, 0.25, 0); put(sh, M(RB(0.18, 0.2, 0.04, 0.4), c[1] || GOLD), 0, -0.05, 0);
    put(g, sh, 0.25, 0.5, 0.05, 0, 0, -0.5);
    return g;
  };
  X.dollhouse = c => {
    const g = new THREE.Group(), a = c[0] || '#ffc8dd';
    put(g, M(RB(0.8, 0.6, 0.6, 0.2), a), 0, 0.3, 0);
    put(g, M(CONE(0.62, 0.38, 4), c[1] || '#e5989b'), 0, 0.8, 0, 0, PI / 4, 0, [1, 1, 0.75]);
    put(g, M(RB(0.18, 0.28, 0.04, 0.3), WOOD), 0, 0.14, 0.31);
    [-0.24, 0.24].forEach(x => { put(g, M(RB(0.16, 0.16, 0.04, 0.3), SKY), x, 0.4, 0.31); });
    put(g, M(HEART(0.08, 0.03), RED), 0, 0.82, 0.24);
    return g;
  };
  X.clawmachine = c => {
    const g = new THREE.Group(), a = c[0] || '#ff6b9a';
    put(g, M(RB(0.7, 0.42, 0.6, 0.2), a), 0, 0.21, 0);
    put(g, M(RB(0.66, 0.5, 0.56, 0.25), '#d9f2ff', { op: 0.45 }), 0, 0.68, 0);
    put(g, M(RB(0.7, 0.14, 0.6, 0.2), a), 0, 0.98, 0);
    put(g, M(CYL(0.01, 0.01, 0.2), SILVER), 0.05, 0.84, 0); put(g, M(CONE(0.07, 0.08, 3), SILVER), 0.05, 0.72, 0, PI);
    [['#ffd166', -0.15], ['#bde0fe', 0.12], ['#cdb4db', 0]].forEach(([col, x], i) => put(g, M(SPH(0.09), col), x, 0.52, -0.1 + i * 0.1));
    put(g, M(CYL(0.02, 0.02, 0.12), DARK), 0.2, 0.48, 0.28); put(g, M(SPH(0.04), RED), 0.2, 0.55, 0.28);
    return g;
  };
  X.jenga = c => {
    const g = new THREE.Group(), a = c[0] || '#e9c46a';
    for (let l = 0; l < 7; l++) for (let k = 0; k < 3; k++) {
      if (l === 4 && k === 1) continue; // 빠진 블록
      const rot = l % 2 ? H : 0, o = (k - 1) * 0.13;
      put(g, M(RB(0.38, 0.11, 0.12, 0.2), l % 2 ? a : (c[1] || '#d4a373')), l % 2 ? o : 0, 0.06 + l * 0.115, l % 2 ? 0 : o, 0, rot, 0);
    }
    put(g, M(RB(0.38, 0.11, 0.12, 0.2), '#f4a261'), 0.32, 0.06, 0.3, 0, 0.6, 0);
    return g;
  };
  X.goboard = c => { // 바둑판 + 돌
    const g = new THREE.Group();
    put(g, M(RB(0.9, 0.14, 0.9, 0.18), c[0] || '#e0b56b'), 0, 0.07, 0);
    const lines = new THREE.Group();
    for (let i = 0; i < 7; i++) { const p = -0.36 + i * 0.12; put(lines, M(new THREE.BoxGeometry(0.72, 0.004, 0.008), DARK, { ol: false }), 0, 0, p); put(lines, M(new THREE.BoxGeometry(0.008, 0.004, 0.72), DARK, { ol: false }), p, 0, 0); }
    put(g, lines, 0, 0.142, 0);
    [[0, 0, 1], [1, 1, 0], [-1, 1, 1], [1, -1, 0], [-2, 0, 0], [2, 1, 1]].forEach(([x, z, b]) => put(g, M(SPH(0.055), b ? '#2b2b2b' : WHITE), x * 0.12, 0.16, z * 0.12, 0, 0, 0, [1, 0.45, 1]));
    return g;
  };
  X.boardgame = c => { // 상자 위 말판 + 말 + 주사위
    const g = new THREE.Group();
    put(g, M(RB(0.9, 0.12, 0.9, 0.15), c[0] || '#4dabf7'), 0, 0.06, 0);
    const t = patternTex('check', '#fff3bf', '#ffc9c9', 3);
    put(g, M(new THREE.BoxGeometry(0.76, 0.01, 0.76), '#ffffff', { map: t, ol: false }), 0, 0.125, 0);
    [[RED, -0.2, -0.1], ['#69db7c', 0.15, 0.2], [GOLD, 0.25, -0.22]].forEach(([col, x, z]) => { put(g, M(CONE(0.06, 0.16), col), x, 0.21, z); put(g, M(SPH(0.045), col), x, 0.3, z); });
    put(g, M(RB(0.13, 0.13, 0.13, 0.3), WHITE), -0.15, 0.2, 0.22, 0.3, 0.4, 0);
    return g;
  };
  X.cube = c => { // 3x3 큐브
    const g = new THREE.Group(), cols = ['#ff6b6b', '#ffd43b', '#4dabf7', '#69db7c', '#ffa94d', WHITE];
    put(g, M(RB(0.66, 0.66, 0.66, 0.35), '#2b2b2b'), 0, 0.33, 0);
    const face = (axis, sgn, col) => { for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      const p = [0, 0, 0]; p[axis] = sgn * 0.335; const o = [0, 1, 2].filter(k => k !== axis); p[o[0]] = i * 0.205; p[o[1]] = j * 0.205;
      const sz = [0.17, 0.17, 0.17]; sz[axis] = 0.02;
      put(g, M(RB(...sz, 0.3), col, { ol: false }), p[0], p[1] + 0.33, p[2]);
    } };
    face(0, 1, c[0] || cols[0]); face(1, 1, c[1] || cols[5]); face(2, 1, c[2] || cols[2]); face(0, -1, cols[4]); face(2, -1, cols[3]);
    g.rotation.set(0.15, 0.6, 0); return g;
  };
  X.watergun = c => { // 물총 (알록달록 장난감)
    const g = new THREE.Group(), a = c[0] || '#4dabf7', b = c[1] || '#ffd43b';
    put(g, M(CAP(0.11, 0.5), a), 0, 0.45, 0, 0, 0, H);
    put(g, M(CYL(0.05, 0.05, 0.2), b), 0.42, 0.45, 0, 0, 0, H);
    put(g, M(RB(0.14, 0.34, 0.12, 0.3), a), -0.12, 0.22, 0, 0, 0, -0.25);
    put(g, M(SPH(0.15), '#9be7ff', { op: 0.75 }), -0.05, 0.66, 0);
    put(g, M(TOR(0.07, 0.02), b), 0.04, 0.28, 0, H, 0, 0);
    return g;
  };
  X.genielamp = c => {
    const g = new THREE.Group(), a = c[0] || GOLD;
    put(g, M(SPH(0.3), a), 0, 0.3, 0, 0, 0, 0, [1.3, 0.6, 0.9]);
    put(g, M(CONE(0.08, 0.5), a), 0.48, 0.38, 0, 0, 0, -1.3);
    put(g, M(TOR(0.12, 0.03), a), -0.42, 0.34, 0, 0, 0, 0);
    put(g, M(CYL(0.12, 0.2, 0.1), a), 0, 0.5, 0); put(g, M(SPH(0.06), c[1] || '#9775fa'), 0, 0.6, 0);
    put(g, M(CYL(0.16, 0.2, 0.08), a), 0, 0.06, 0);
    [0, 1, 2].forEach(i => put(g, M(SPH(0.04 + i * 0.015), '#e5dbff', { op: 0.7 }), 0.62 + i * 0.06, 0.55 + i * 0.12, 0));
    return g;
  };
  X.treasure = c => { // 보물 상자
    const g = new THREE.Group(), a = c[0] || '#a0522d';
    put(g, M(RB(0.8, 0.42, 0.52, 0.15), a), 0, 0.21, 0);
    put(g, M(new THREE.CylinderGeometry(0.26, 0.26, 0.8, 20, 1, false, 0, PI), a), 0, 0.42, 0, 0, 0, H);
    [-0.3, 0.3].forEach(x => { put(g, M(RB(0.06, 0.44, 0.54, 0.2), GOLD), x, 0.22, 0); put(g, M(TOR(0.265, 0.03, PI), GOLD), x, 0.42, 0, 0, H, 0); });
    put(g, M(RB(0.12, 0.14, 0.04, 0.3), GOLD), 0, 0.4, 0.27);
    [[-0.12, '#ffd43b'], [0.05, '#ff6b6b'], [0.18, '#4dabf7']].forEach(([x, col]) => put(g, M(SPH(0.06), col), x, 0.62, 0.05));
    return g;
  };
  X.doctorbag = c => { // 병원 놀이 가방
    const g = new THREE.Group(), a = c[0] || WHITE;
    put(g, M(RB(0.8, 0.5, 0.36, 0.25), a), 0, 0.25, 0);
    put(g, M(TOR(0.14, 0.035, PI), c[1] || '#ff8787'), 0, 0.52, 0);
    put(g, M(RB(0.06, 0.22, 0.02, 0.3), RED), 0, 0.27, 0.185); put(g, M(RB(0.22, 0.06, 0.02, 0.3), RED), 0, 0.27, 0.185);
    return g;
  };
  X.drone = c => {
    const g = new THREE.Group(), a = c[0] || '#495057', b = c[1] || '#ff922b';
    put(g, M(RB(0.34, 0.12, 0.34, 0.3), a), 0, 0.3, 0);
    put(g, M(SPH(0.06), '#74c0fc'), 0, 0.3, 0.18);
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([x, z]) => {
      put(g, M(CYL(0.025, 0.025, 0.42), a), x * 0.17, 0.32, z * 0.17, H, Math.atan2(x, z), 0);
      put(g, M(CYL(0.03, 0.03, 0.08), a), x * 0.32, 0.36, z * 0.32);
      put(g, M(CYL(0.16, 0.16, 0.015, 20), b, { op: 0.8 }), x * 0.32, 0.41, z * 0.32);
      put(g, M(CYL(0.02, 0.02, 0.16), a), x * 0.14, 0.18, z * 0.06);
    });
    return g;
  };
  X.excavator = c => { // 포크레인
    const g = new THREE.Group(), a = c[0] || '#ffc107';
    put(g, M(RB(0.8, 0.14, 0.5, 0.3), '#495057'), 0, 0.08, 0);
    [-0.28, 0, 0.28].forEach(x => [-0.2, 0.2].forEach(z => put(g, M(CYL(0.06, 0.06, 0.08), '#868e96'), x, 0.08, z, H)));
    put(g, M(RB(0.5, 0.26, 0.44, 0.25), a), -0.05, 0.3, 0);
    put(g, M(RB(0.26, 0.28, 0.4, 0.25), a), -0.15, 0.55, 0); put(g, M(RB(0.2, 0.16, 0.02, 0.3), SKY), -0.15, 0.58, 0.2);
    put(g, M(RB(0.5, 0.09, 0.09, 0.3), a), 0.3, 0.6, 0.12, 0, 0, 0.55);
    put(g, M(RB(0.36, 0.08, 0.08, 0.3), a), 0.58, 0.55, 0.12, 0, 0, -0.9);
    put(g, M(RB(0.18, 0.16, 0.2, 0.25), '#868e96'), 0.68, 0.32, 0.12, 0, 0, 0.3);
    return g;
  };
  X.bugnet = c => { // 잠자리채
    const g = new THREE.Group();
    put(g, M(CYL(0.025, 0.025, 1.0), c[0] || WOOD), 0, 0.5, 0, 0, 0, 0.35);
    put(g, M(TOR(0.2, 0.02), c[1] || '#69db7c'), -0.24, 0.98, 0, H - 0.2, 0, 0.35);
    put(g, M(CONE(0.19, 0.4, 16), '#e9fac8', { op: 0.7 }), -0.2, 0.82, 0.02, 0.2, 0, 0.35 + PI);
    return g;
  };

  // ---------- 운동·음악 ----------
  X.hoop = c => { const g = new THREE.Group(); put(g, M(TOR(0.48, 0.035), c[0] || '#ff6b9a'), 0, 0.5, 0); for (let i = 0; i < 8; i++) { const t = i / 8 * PI * 2; put(g, M(TOR(0.05, 0.036, PI / 6), c[1] || GOLD, { ol: false }), Math.cos(t) * 0.48, 0.5 + Math.sin(t) * 0.48, 0, 0, 0, t); } return g; };
  X.belt = c => { // 태권도 띠
    const g = new THREE.Group(), a = c[0] || '#2b2b2b';
    put(g, M(TOR(0.3, 0.05), a), 0, 0.5, 0, 0.25, 0, 0, [1, 0.9, 0.5]);
    put(g, M(RB(0.14, 0.12, 0.1, 0.25), a), 0, 0.24, 0.07);
    [-1, 1].forEach(s => put(g, M(RB(0.09, 0.36, 0.04, 0.3), a), s * 0.08, 0.06, 0.08, 0, 0, s * 0.2));
    put(g, M(RB(0.06, 0.08, 0.02, 0.3), GOLD, { ol: false }), 0.06, 0.04, 0.11, 0, 0, 0.2);
    return g;
  };
  X.rollerskate = c => {
    const g = new THREE.Group(), a = c[0] || '#ff8fab';
    put(g, M(PUFF('rskate', [[-0.3, 0], [0.38, 0], [0.42, 0.14], [0.1, 0.2], [0.02, 0.58], [-0.3, 0.6]], 0.3, 0.07), a), 0, 0.18, 0);
    put(g, M(RB(0.8, 0.06, 0.34, 0.3), WHITE), 0.04, 0.15, 0);
    [-0.22, 0.28].forEach(x => [-0.13, 0.13].forEach(z => put(g, M(CYL(0.07, 0.07, 0.06), c[1] || '#ffd43b'), x, 0.08, z, H)));
    put(g, M(SPH(0.06), c[1] || '#ffd43b'), 0.44, 0.12, 0);
    for (let i = 0; i < 3; i++) put(g, M(CYL(0.012, 0.012, 0.3), WHITE, { ol: false }), 0.05, 0.38 + i * 0.07, 0, H);
    g.rotation.y = 0.3; return g;
  };
  X.trampoline = c => {
    const g = new THREE.Group();
    put(g, M(TOR(0.45, 0.06), c[0] || '#4dabf7'), 0, 0.3, 0, H);
    put(g, M(CYL(0.42, 0.42, 0.02, 32), '#343a40'), 0, 0.3, 0);
    for (let i = 0; i < 6; i++) { const t = i / 6 * PI * 2; put(g, M(CYL(0.025, 0.025, 0.3), SILVER), Math.cos(t) * 0.42, 0.15, Math.sin(t) * 0.42); }
    put(g, M(SPH(0.1), c[1] || '#ffd43b'), 0, 0.62, 0);
    return g;
  };
  X.recorder = c => { // 리코더·플루트
    const g = new THREE.Group(), a = c[0] || '#fff3d6';
    put(g, M(CYL(0.06, 0.08, 0.95), a), 0, 0.5, 0);
    put(g, M(CYL(0.09, 0.1, 0.16), c[1] || '#a47148'), 0, 0.9, 0); put(g, M(CYL(0.1, 0.12, 0.1), c[1] || '#a47148'), 0, 0.05, 0);
    for (let i = 0; i < 6; i++) put(g, M(SPH(0.018), DARK, { ol: false }), 0, 0.25 + i * 0.09, 0.07);
    g.rotation.z = 0.5; return g;
  };
  X.kalimba = c => {
    const g = new THREE.Group();
    put(g, M(RB(0.7, 0.16, 0.5, 0.25), c[0] || '#d4a373'), 0, 0.08, 0);
    put(g, M(CYL(0.08, 0.08, 0.02), '#6f4e37', { ol: false }), 0, 0.17, 0.12);
    for (let i = 0; i < 9; i++) { const x = (i - 4) * 0.06, len = 0.34 - Math.abs(i - 4) * 0.03; put(g, M(RB(0.035, 0.02, len, 0.3), SILVER), x, 0.19, -0.05 - len / 2 + 0.17); }
    put(g, M(RB(0.6, 0.04, 0.05, 0.3), '#6f4e37'), 0, 0.2, -0.08);
    g.rotation.x = 0.55; return g;
  };

  // ---------- 기기 ----------
  X.projector = c => {
    const g = new THREE.Group(), a = c[0] || WHITE;
    put(g, M(RB(0.7, 0.3, 0.5, 0.25), a), 0, 0.17, 0);
    put(g, M(CYL(0.11, 0.11, 0.06), '#495057'), 0.16, 0.18, 0.26, H); put(g, M(CYL(0.07, 0.07, 0.02), '#74c0fc', { ol: false }), 0.16, 0.18, 0.29, H);
    [-0.18, -0.08].forEach(x => put(g, M(SPH(0.025), [RED, '#69db7c'][x < -0.1 ? 0 : 1], { ol: false }), x, 0.33, 0.1));
    return g;
  };
  X.humidifier = c => {
    const g = new THREE.Group(), a = c[0] || '#b2f2bb';
    put(g, M(SPH(0.34), a), 0, 0.34, 0, 0, 0, 0, [1, 1.05, 1]);
    eye2(g, 0.4, 0.31, 0.1, 0.03); [-1, 1].forEach(s => put(g, M(SPH(0.045), PINK, { ol: false }), s * 0.17, 0.33, 0.28, 0, 0, 0, [1, 0.6, 0.3]));
    put(g, M(CYL(0.06, 0.08, 0.08), WHITE), 0, 0.72, 0);
    [0, 1, 2].forEach(i => put(g, M(SPH(0.05 + i * 0.02), '#e7f5ff', { op: 0.75 }), (i - 1) * 0.04, 0.84 + i * 0.1, 0));
    return g;
  };

  // ---------- 패션·꾸미기 ----------
  X.bracelet = c => { const g = new THREE.Group(), n = 12; for (let i = 0; i < n; i++) { const t = i / n * PI * 2; put(g, M(SPH(0.07), c[i % 3] || RAINBOW[i % 6]), Math.cos(t) * 0.32, 0.4 + Math.sin(t) * 0.32, 0); } put(g, M(HEART(0.09, 0.04), RED), 0, 0.02, 0.02); return g; };
  X.earring = c => { const g = new THREE.Group(); [-1, 1].forEach(s => { put(g, M(TOR(0.08, 0.015), GOLD), s * 0.2, 0.7, 0); put(g, M(CYL(0.01, 0.01, 0.12), GOLD), s * 0.2, 0.56, 0); put(g, M(HEART(0.12, 0.05), c[0] || '#ff8fab'), s * 0.2, 0.38, 0); put(g, M(SPH(0.04), WHITE), s * 0.2, 0.22, 0); }); return g; };
  X.scrunchie = c => { const g = new THREE.Group(), a = c[0] || '#ffa8c5'; for (let i = 0; i < 14; i++) { const t = i / 14 * PI * 2; put(g, M(SPH(0.12), i % 2 ? a : (c[1] || '#ffc9de')), Math.cos(t) * 0.3, 0.14, Math.sin(t) * 0.3, 0, -t, 0, [0.8, 0.9, 1.1]); } return g; };
  X.padding = c => { // 패딩 점퍼
    const g = new THREE.Group(), a = c[0] || '#4c6ef5';
    for (let i = 0; i < 4; i++) put(g, M(CAP(0.26 - (i === 0 ? 0.02 : 0), 0.2), a), 0, 0.18 + i * 0.17, 0, 0, 0, H);
    [-1, 1].forEach(s => { for (let i = 0; i < 3; i++) put(g, M(SPH(0.11), a), s * (0.36 + i * 0.07), 0.62 - i * 0.16, 0); });
    put(g, M(TOR(0.15, 0.06), c[1] || '#dee2e6'), 0, 0.78, 0, H);
    put(g, M(CYL(0.012, 0.012, 0.62), SILVER, { ol: false }), 0, 0.42, 0.28);
    return g;
  };
  X.hoodie = c => {
    const g = new THREE.Group(), a = c[0] || '#ffa94d';
    put(g, M(PUFF('hoodie', [[-0.34, 0], [0.34, 0], [0.36, 0.5], [0.62, 0.42], [0.66, 0.56], [0.3, 0.72], [-0.3, 0.72], [-0.66, 0.56], [-0.62, 0.42], [-0.36, 0.5]], 0.28, 0.07), a), 0, 0.04, 0);
    put(g, M(SPH(0.22), a), 0, 0.82, -0.08, 0, 0, 0, [1, 0.8, 0.8]);
    put(g, M(RB(0.4, 0.16, 0.04, 0.3), c[1] || a), 0, 0.2, 0.17);
    [-1, 1].forEach(s => put(g, M(CYL(0.012, 0.012, 0.18), WHITE, { ol: false }), s * 0.06, 0.62, 0.18));
    return g;
  };
  X.earmuff = c => {
    const g = new THREE.Group(), a = c[0] || '#ffc9de';
    put(g, M(TOR(0.32, 0.03, PI), c[1] || '#f783ac'), 0, 0.4, 0);
    [-1, 1].forEach(s => put(g, M(SPH(0.17), a), s * 0.33, 0.38, 0, 0, 0, 0, [0.7, 1, 1]));
    return g;
  };
  X.perfume = c => {
    const g = new THREE.Group(), a = c[0] || '#e5dbff';
    put(g, M(RB(0.4, 0.42, 0.24, 0.35), a, { op: 0.85 }), 0, 0.21, 0);
    put(g, M(RB(0.3, 0.28, 0.16, 0.35), c[1] || '#b197fc'), 0, 0.18, 0);
    put(g, M(CYL(0.05, 0.05, 0.08), GOLD), 0, 0.46, 0); put(g, M(SPH(0.09), c[2] || '#f783ac'), 0, 0.57, 0);
    put(g, M(TOR(0.05, 0.015), GOLD), 0.1, 0.55, 0, 0, H, 0);
    return g;
  };
  X.nailpolish = c => { const g = new THREE.Group(); put(g, M(SPH(0.2), c[0] || '#f06595', { op: 0.95 }), 0, 0.2, 0, 0, 0, 0, [1, 0.95, 1]); put(g, M(CYL(0.08, 0.09, 0.32), c[1] || DARK), 0, 0.52, 0); put(g, M(SPH(0.05), WHITE, { ol: false }), -0.08, 0.26, 0.15); return g; };
  X.handcream = c => {
    const g = new THREE.Group(), a = c[0] || '#ffe3ec';
    put(g, M(LATHE('tube', [[0, 0], [0.12, 0], [0.13, 0.08], [0.16, 0.6], [0.02, 0.72], [0, 0.72]]), a), 0, 0.05, 0, 0, 0, 0, [1, 1, 0.55]);
    put(g, M(CYL(0.09, 0.09, 0.08), c[1] || '#f06595'), 0, 0.06, 0);
    put(g, M(HEART(0.07, 0.03), c[1] || '#f06595'), 0, 0.42, 0.07);
    g.rotation.z = 0.25; return g;
  };
  X.piggybank = c => {
    const g = new THREE.Group(), a = c[0] || '#ffadc6';
    put(g, M(SPH(0.36), a), 0, 0.38, 0, 0, 0, 0, [1.15, 1, 1]);
    put(g, M(CYL(0.1, 0.1, 0.08), a), 0.42, 0.38, 0, 0, 0, H); [-0.03, 0.03].forEach(z => put(g, M(SPH(0.018), DARK, { ol: false }), 0.47, 0.38, z));
    [[0.2, 0.15], [0.2, -0.15], [-0.2, 0.15], [-0.2, -0.15]].forEach(([x, z]) => put(g, M(CYL(0.06, 0.06, 0.12), a), x, 0.08, z));
    [-1, 1].forEach(s => put(g, M(CONE(0.08, 0.12, 3), a), 0.24, 0.68, s * 0.14, s * 0.3, 0, -0.4));
    put(g, M(SPH(0.03), DARK, { ol: false }), 0.36, 0.5, 0.14); put(g, M(SPH(0.03), DARK, { ol: false }), 0.36, 0.5, -0.14);
    put(g, M(RB(0.18, 0.02, 0.04, 0.3), DARK, { ol: false }), 0, 0.74, 0);
    put(g, M(CYL(0.1, 0.1, 0.03), GOLD), 0, 0.84, 0, H);
    g.rotation.y = -0.6; return g;
  };
  X.blanket = c => { const g = new THREE.Group(), t = patternTex('check', c[0] || '#ffc9c9', c[1] || '#fff5f5', 3); for (let i = 0; i < 3; i++) put(g, M(RB(0.8, 0.12, 0.56, 0.3), '#ffffff', { map: t }), i * 0.03, 0.06 + i * 0.12, i * 0.02, 0, i * 0.08, 0); return g; };

  // ---------- 간식 ----------
  X.choco = c => { const g = new THREE.Group(), a = c[0] || '#7f4f24'; put(g, M(RB(0.7, 0.08, 0.44, 0.3), a), 0, 0.04, 0); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) put(g, M(RB(0.15, 0.06, 0.18, 0.3), a), -0.25 + i * 0.165, 0.1, -0.1 + j * 0.2); put(g, M(RB(0.4, 0.1, 0.48, 0.2), c[1] || '#e63946'), -0.22, 0.08, 0); put(g, M(RB(0.06, 0.11, 0.5, 0.2), GOLD), -0.1, 0.08, 0); return g; };
  X.jelly = c => { // 곰 젤리 세 개
    const g = new THREE.Group();
    [['#ff6b6b', -0.28], ['#69db7c', 0], ['#ffd43b', 0.28]].forEach(([col, x], i) => {
      const k = c[i] || col, b = new THREE.Group();
      put(b, M(SPH(0.15), k, { op: 0.85 }), 0, 0.17, 0, 0, 0, 0, [1, 1.15, 0.8]); put(b, M(SPH(0.11), k, { op: 0.85 }), 0, 0.4, 0);
      [-1, 1].forEach(s => { put(b, M(SPH(0.045), k, { op: 0.85 }), s * 0.08, 0.5, 0); put(b, M(SPH(0.05), k, { op: 0.85 }), s * 0.13, 0.22, 0.03); });
      put(g, b, x, 0, i === 1 ? 0.08 : 0, 0, (i - 1) * -0.3, 0);
    });
    return g;
  };
  X.tanghulu = c => {
    const g = new THREE.Group();
    put(g, M(CYL(0.018, 0.018, 1.0), '#e9c46a'), 0, 0.5, 0);
    [['#e03131', 0.2], ['#e03131', 0.4], [c[0] || '#2f9e44', 0.6], [c[1] || '#ffa94d', 0.8]].forEach(([col, y], i) => put(g, M(SPH(i === 2 ? 0.11 : 0.12), col, { op: 0.92 }), 0, y, 0, 0, 0, 0, i === 2 ? [1, 1, 1] : [1, 1.12, 1]));
    put(g, M(SPH(0.03), WHITE, { ol: false }), -0.06, 0.45, 0.09);
    g.rotation.z = 0.25; return g;
  };
  X.macaron = c => {
    const g = new THREE.Group(), cols = ['#ffc9de', '#b2f2bb', '#d0bfff'];
    cols.forEach((col, i) => { const k = c[i] || col, b = new THREE.Group();
      put(b, M(SPH(0.2), k), 0, 0.06, 0, 0, 0, 0, [1, 0.45, 1]); put(b, M(CYL(0.19, 0.19, 0.06), WHITE), 0, 0.14, 0); put(b, M(SPH(0.2), k), 0, 0.22, 0, 0, 0, 0, [1, 0.45, 1]);
      put(g, b, (i - 1) * 0.36, i === 1 ? 0.0 : 0, i === 1 ? 0.12 : 0, i === 1 ? 0 : 0.4 * (i - 1), 0, 0);
    });
    return g;
  };
  X.tteokbokki = c => {
    const g = new THREE.Group();
    put(g, M(LATHE('tbowl', [[0, 0], [0.24, 0], [0.4, 0.22], [0.37, 0.22], [0, 0.04]]), c[0] || '#4dabf7'), 0, 0, 0);
    put(g, M(CYL(0.36, 0.36, 0.02, 24), '#e8590c'), 0, 0.19, 0);
    for (let i = 0; i < 7; i++) { const t = i * 1.7, r = 0.08 + (i % 3) * 0.07; put(g, M(CAP(0.04, 0.16), '#ff6b6b'), Math.cos(t) * r, 0.23, Math.sin(t) * r, H, t, 0); }
    put(g, M(SPH(0.07), WHITE), 0.1, 0.25, -0.1, 0, 0, 0, [1, 0.8, 1]); put(g, M(SPH(0.04), GOLD, { ol: false }), 0.1, 0.3, -0.08);
    return g;
  };
  X.chocosticks = c => { // 막대 과자
    const g = new THREE.Group();
    put(g, M(RB(0.4, 0.5, 0.12, 0.25), c[0] || '#e03131'), 0, 0.25, 0);
    for (let i = 0; i < 5; i++) { const x = -0.12 + i * 0.06; put(g, M(CYL(0.018, 0.018, 0.3), '#f1d39a'), x, 0.52, 0); put(g, M(CYL(0.022, 0.022, 0.22), c[1] || '#6f4e37'), x, 0.6, 0); }
    put(g, M(HEART(0.08, 0.03), WHITE), 0, 0.25, 0.07);
    return g;
  };

  return X;
}
