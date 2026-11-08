// 편지 분석 · 25일 배치 · 날짜 규칙 · 문장 채우기 (모두 기기 안에서, 밖으로 보내지 않음)
import { THEMES, THEME_ORDER, GENERIC } from '../data/themes.js';
import { GOOD, FORTUNE, MISSION, COLORS, THINGS } from '../data/words.js';

export const DAYS = 25;
export const SPECIAL_DAYS = [6, 12, 18, 24];

// ---------- 받침에 맞춘 조사 ----------
function hasBatchim(word) {
  const ch = (word || '').trim().slice(-1); const code = ch.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 !== 0;
  return /[013678lmnLMN]$/.test(ch); // 숫자·영어는 읽는 소리로 (일·삼·육·칠·팔·영, l·m·n)
}
function rieul(word) { const c = (word || '').trim().slice(-1).charCodeAt(0); return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 === 8; }
const PAIRS = { 이: ['이', '가'], 을: ['을', '를'], 은: ['은', '는'], 와: ['과', '와'], 아: ['아', '야'], 이랑: ['이랑', '랑'], 이야: ['이야', '야'], 이에요: ['이에요', '예요'] };
export function josa(word, j) {
  if (!j) return word;
  if (j === '으로') return word + (hasBatchim(word) && !rieul(word) ? '으로' : '로');
  const p = PAIRS[j]; if (!p) return word + j;
  return word + (hasBatchim(word) ? p[0] : p[1]);
}
// 아이 이름 부르기: 받침이 있으면 '민준이'처럼 '이'를 붙여 부른다 (부를 때는 '민준아')
export function callName(n) { n = (n || '').trim(); return hasBatchim(n) && /[가-힣]$/.test(n) ? n + '이' : n; }
export function fill(text, ctx) {
  return text.replace(/\{(이름|소원|말)(?::([^}]+))?\}/g, (_, k, j) => {
    if (k === '이름') return j && j !== '아' ? josa(callName(ctx.name), j) : josa(ctx.name || '', j);
    return josa((k === '소원' ? ctx.wish : ctx.msg) || '', j);
  });
}

// ---------- 분석 ----------
const STRIP = /(이랑|랑|이나|나|이요|요|이에요|예요|이|가|을|를|은|는|도|와|과|하고|이고|고|좀|주세요|갖고싶어요|갖고싶어|싶어요|받고싶어요)$/;
export function analyzeWish(text) {
  const raw = (text || '').toLowerCase();
  const flat = raw.replace(/[\s.,!?~'"“”‘’()\-_/]+/g, '');
  const tokens = raw.split(/[\s.,!?~'"“”‘’()\-_/]+/).filter(Boolean).map(t => [t, t.replace(STRIP, '')]);
  const scores = [];
  for (const id of THEME_ORDER) {
    let s = 0;
    for (const kw of THEMES[id].kw) {
      const k = kw.toLowerCase();
      const kk = k.replace(/\s+/g, '');
      if (kk.length <= 1) { if (tokens.some(([t, b]) => t === kk || b === kk)) s += GENERIC.has(kk) ? 0.6 : 1.5; }
      else if (flat.includes(kk)) s += GENERIC.has(kw) ? 0.6 : Math.min(kk.length, 6);
    }
    if (s > 0) scores.push([id, s]);
  }
  scores.sort((a, b) => b[1] - a[1] || (a[0] === 'winter') - (b[0] === 'winter'));
  return scores; // [[주제, 점수], ...]
}

// 소원 여러 개 → 주제 목록(최대 3개, 순서 유지)
export function analyzeLetter(wishes) {
  const found = []; // {wish, theme}
  const themes = [];
  wishes.forEach(w => {
    if (!w || !w.trim()) return;
    const sc = analyzeWish(w);
    const best = sc[0];
    if (best) {
      found.push({ wish: w.trim(), theme: best[0] });
      if (!themes.includes(best[0])) themes.push(best[0]);
      const second = sc[1];
      if (second && second[1] >= best[1] * 0.6 && !themes.includes(second[0])) themes.push(second[0]);
    } else found.push({ wish: w.trim(), theme: null });
  });
  return { found, themes: themes.slice(0, 3) };
}

// ---------- 25일 배치 ----------
// 6·12·18·24일은 크리스마스 특별 상자, 나머지 20일은 소원 주제(여러 개면 번갈아), 25일은 소원 상자
export function makePlan(wishes, keep = {}) {
  const { found, themes } = analyzeLetter(wishes);
  const list = themes.length ? themes : ['winter'];
  const normalDays = [];
  for (let d = 1; d <= 24; d++) if (!SPECIAL_DAYS.includes(d)) normalDays.push(d);
  const counts = list.map(() => 0);
  const owner = normalDays.map((_, i) => { const t = i % list.length; counts[t]++; return t; });
  const used = list.map(() => 0);
  const plan = new Array(DAYS + 1).fill(null);
  normalDays.forEach((d, i) => {
    const t = owner[i], id = list[t], n = THEMES[id].items.length;
    const idx = Math.min(n - 1, Math.floor(used[t]++ * n / counts[t]));
    plan[d] = `${id}:${idx}`;
  });
  SPECIAL_DAYS.forEach(d => { plan[d] = `winter:s${d}`; });
  plan[25] = `${list[0]}:final`;
  // 이미 연 상자는 그대로 둔다
  Object.keys(keep).forEach(d => { if (keep[d]) plan[+d] = keep[d]; });
  const wishOf = {};
  found.forEach(f => { if (f.theme && !wishOf[f.theme]) wishOf[f.theme] = f.wish; });
  return { plan: plan.slice(1), themes: list, found, wishOf };
}

// 아이템 정보 꺼내기
export function itemOf(ref, ctx) {
  const [id, key] = ref.split(':'); const th = THEMES[id] || THEMES.winter;
  const wish = (ctx.wishOf && ctx.wishOf[id]) || ctx.wishes?.[0] || '';
  const c = { ...ctx, wish };
  if (key === 'final') {
    const [kind, colors] = th.final;
    return { ref, theme: id, name: wish || '소원 선물', kind, colors, story: fill('산타 할아버지께 {소원} 이야기가 잘 전해졌어! 크리스마스 아침을 기대해 봐.', c), final: true };
  }
  if (key[0] === 's') {
    const [name, kind, colors, story] = THEMES.winter.special[+key.slice(1)];
    return { ref, theme: 'winter', name, kind, colors, story: fill(story, c), special: true };
  }
  const [name, kind, colors, story] = th.items[+key] || th.items[0];
  return { ref, theme: id, name, kind, colors, story: fill(story, c) };
}

// ---------- 좋은 말·운세 (이름 + 시즌으로 섞어서 25일 동안 겹치지 않게) ----------
function hash(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffled(arr, seed) { const r = rng(seed), a = arr.map((_, i) => i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export function fortuneOf(day, ctx) {
  const seed = hash((ctx.name || '') + '|' + (ctx.season || '') + '|' + (ctx.created || ''));
  const pick = (arr, salt) => arr[shuffled(arr, seed + salt)[(day - 1) % arr.length]];
  const r = rng(seed + day * 97);
  return {
    good: pick(GOOD, 1), fortune: fill(pick(FORTUNE, 2), ctx), mission: pick(MISSION, 3),
    color: pick(COLORS, 4), number: 1 + Math.floor(r() * 9), thing: pick(THINGS, 5),
  };
}

// ---------- 날짜 ----------
// 주소에 ?date=2026-12-05 를 붙이면 그 날짜로 시험해 볼 수 있다
export function today() {
  const q = new URLSearchParams(location.search).get('date');
  if (q) { const m = q.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:T(\d{1,2}):(\d{2}))?/); if (m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 12), +(m[5] || 0)); }
  return new Date();
}
// 이번 시즌 연도: 1~2월은 지난해 크리스마스 시즌으로 본다
export function seasonOf(now = today()) { return now.getMonth() <= 1 ? now.getFullYear() - 1 : now.getFullYear(); }
export function openDate(day, season) { return new Date(season, 11, day, 0, 0, 0); }
export function canOpen(day, season, now = today()) { return now >= openDate(day, season); }
export function daysUntil(day, season, now = today()) {
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const b = openDate(day, season);
  return Math.round((b - a) / 86400000);
}
