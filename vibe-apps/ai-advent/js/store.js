// 저장: localStorage + 브라우저에 "지우지 말아 주세요" 요청 + 이어하기 코드
const KEY = 'ai-advent-calendar.v1';
const ARCHIVE = 'ai-advent-calendar.archive';

export function blank(season) {
  return { v: 1, season, created: Date.now(), name: '', wishes: [], msg: '', plan: null, opened: {}, settings: { sound: true, crisp: false }, step: 'intro' };
}

export function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 1) return s; } catch (e) {}
  return null;
}

let persistAsked = false;
export function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  if (!persistAsked && navigator.storage && navigator.storage.persist) { persistAsked = true; navigator.storage.persist().catch(() => {}); }
}

// 지난 시즌 기록은 따로 보관
export function archive(state) {
  try { const a = JSON.parse(localStorage.getItem(ARCHIVE) || '[]'); a.push(state); localStorage.setItem(ARCHIVE, JSON.stringify(a.slice(-5))); } catch (e) {}
}

export function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} }

// 이어하기 코드: 저장 내용을 글자로 바꾼 것
export function toCode(state) {
  const slim = { s: state.season, c: state.created, n: state.name, w: state.wishes, m: state.msg, p: state.plan, o: state.opened };
  const b = btoa(unescape(encodeURIComponent(JSON.stringify(slim))));
  return 'AIAC-' + b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function fromCode(code, base) {
  try {
    let b = code.trim().replace(/^AIAC-/, '').replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    while (b.length % 4) b += '=';
    const o = JSON.parse(decodeURIComponent(escape(atob(b))));
    if (!o || !Array.isArray(o.p) || typeof o.n !== 'string') return null;
    return { ...base, season: o.s, created: o.c, name: o.n, wishes: o.w || [], msg: o.m || '', plan: o.p, opened: o.o || {}, step: 'calendar' };
  } catch (e) { return null; }
}
