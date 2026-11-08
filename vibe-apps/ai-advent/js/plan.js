// 편지 분석 · 25일 배치 · 날짜 규칙 · 문장 채우기 (모두 기기 안에서, 밖으로 보내지 않음)
import { THEMES, THEME_ORDER, GENERIC, finalKindOf } from '../data/themes.js';
import { GOOD, FORTUNE, MISSION, COLORS, THINGS } from '../data/words.js';
import { EMOJI } from '../data/emoji_ko.js';

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

// ---------- 이모지 색인에서 찾기 ----------
const EIDX = new Map(EMOJI.map((e, i) => [e[0], i]));
export function searchEmoji(text, min = 0) {
  const raw = (text || '').toLowerCase();
  const flat = raw.replace(/[\s.,!?~'"“”‘’()\-_/]+/g, '');
  const toks = raw.split(/[\s.,!?~'"“”‘’()\-_/]+/).filter(Boolean).map(t => t.replace(STRIP, '')).filter(t => t && !GENERIC.has(t));
  let best = -1, bs = 0;
  EMOJI.forEach(([, label, tags], i) => {
    const L = label.replace(/\s+/g, ''), tg = tags ? tags.split(' ') : [];
    let s = 0;
    for (const t of toks) {
      if (t === L) s = Math.max(s, 10);
      else if (L.length >= 2 && t.includes(L)) s = Math.max(s, 6 + L.length * 0.1);
      else if (t.length >= 2 && L.includes(t)) s = Math.max(s, 5 - (L.length - t.length) * 0.1);
      else if (t.length >= 2 && tg.includes(t)) s = Math.max(s, 3);
    }
    if (!s && L.length >= 2 && flat.includes(L)) s = 4 + L.length * 0.1;
    if (s > bs) { bs = s; best = i; }
  });
  return best >= 0 && bs >= min ? EMOJI[best][0] : null;
}
// 같은 묶음 이모지부터, 모자라면 목록에서 가까운 것으로 채움
export function relatedEmoji(e, n = 20) {
  const i = EIDX.get(e); if (i == null) return [];
  const sg = EMOJI[i][3];
  const idx = EMOJI.map((_, k) => k).sort((a, b) => (EMOJI[b][3] === sg) - (EMOJI[a][3] === sg) || Math.abs(a - i) - Math.abs(b - i));
  return idx.slice(0, n).map(k => EMOJI[k][0]);
}
export function emojiName(e) { const i = EIDX.get(e); return i == null ? '선물' : EMOJI[i][1]; }

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
    } else {
      const e = searchEmoji(w);
      if (e) { found.push({ wish: w.trim(), theme: '@' + e }); if (!themes.includes('@' + e)) themes.push('@' + e); }
      else found.push({ wish: w.trim(), theme: null });
    }
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
    const t = owner[i], id = list[t];
    if (id[0] === '@') { const rel = relatedEmoji(id.slice(1), counts[t]); plan[d] = `e:${rel[used[t]++ % rel.length]}`; return; }
    const n = THEMES[id].items.length;
    const idx = Math.min(n - 1, Math.floor(used[t]++ * n / counts[t]));
    plan[d] = `${id}:${idx}`;
  });
  SPECIAL_DAYS.forEach(d => { plan[d] = `winter:s${d}`; });
  plan[25] = list[0][0] === '@' ? `e:${list[0].slice(1)}:final` : `${list[0]}:final`;
  // 이미 연 상자는 그대로 둔다
  Object.keys(keep).forEach(d => { if (keep[d]) plan[+d] = keep[d]; });
  const wishOf = {};
  found.forEach(f => { if (f.theme && !wishOf[f.theme]) wishOf[f.theme] = f.wish; });
  return { plan: plan.slice(1), themes: list, found, wishOf };
}

// 아이템 정보 꺼내기
export function itemOf(ref, ctx) {
  const [id, key] = ref.split(':');
  if (id === 'e') {
    const e = key, name = emojiName(e), wish = ctx.wishes?.[0] || '';
    if (ref.endsWith(':final')) return { ref, theme: 'e', name: wish || name, kind: 'e:' + e, colors: [], story: fill('산타 할아버지께 {소원} 이야기가 잘 전해졌어! 크리스마스 아침을 기대해 봐.', { ...ctx, wish }), final: true };
    const tpl = E_STORY[hash(e) % E_STORY.length];
    return { ref, theme: 'e', name, kind: 'e:' + e, colors: [], story: fill(tpl.replace('{n:이}', josa(name, '이')).replace('{n:은}', josa(name, '은')).replace('{n:을}', josa(name, '을')).replace('{n}', name), { ...ctx, wish }) };
  }
  const th = THEMES[id] || THEMES.winter;
  const wish = (ctx.wishOf && ctx.wishOf[id]) || ctx.wishes?.[0] || '';
  const c = { ...ctx, wish };
  if (key === 'final') {
    const se = finalKindOf(wish) ? null : searchEmoji(wish, 5);
    const special = finalKindOf(wish) || (se ? 'e:' + se : null);
    const [kind, colors] = special ? [special, []] : th.final;
    return { ref, theme: id, name: wish || '소원 선물', kind, colors, story: fill('산타 할아버지께 {소원} 이야기가 잘 전해졌어! 크리스마스 아침을 기대해 봐.', c), final: true };
  }
  if (key[0] === 's') {
    const [name, kind, colors, story] = THEMES.winter.special[+key.slice(1)];
    return { ref, theme: 'winter', name, kind, colors, story: fill(story, c), special: true };
  }
  const [name, kind, colors, story] = th.items[+key] || th.items[0];
  return { ref, theme: id, name, kind, colors, story: fill(story, c) };
}

const E_STORY = [
  '오늘 상자에서 {n:이} 톡 튀어나왔어!', '{n}, {이름}에게 딱 어울리는 선물이야.', '짜잔! 반짝반짝 {n:이} 숨어 있었네.',
  '{n:을} 보니까 기분이 몽글몽글해져.', '요정 방울이가 고른 오늘의 {n}!', '{이름:아}, {n:은} 소중히 간직해 줘.',
  '{n:이} {이름:을} 기다리고 있었대.', '오늘은 {n}의 날! 하루 종일 즐거울 거야.',
];

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
