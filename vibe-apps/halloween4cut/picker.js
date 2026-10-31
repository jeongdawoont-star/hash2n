// 분장 뽑기: 네컷 안에서 절대 중복 없음 + 최근 16개 회피 (app/picker.py와 같은 규칙)
export const RECENT_WINDOW = 16;

export class Picker {
  constructor(catalog, storage = null, random = Math.random) {
    this.catalog = catalog;
    this.storage = storage;
    this.random = random;
    this.max = Math.min(RECENT_WINDOW, catalog.length - 4);
    this.recent = [];
    try {
      const saved = JSON.parse(storage?.getItem('h4c-recent') || '[]');
      this.recent = saved.filter(id => catalog.some(c => c.id === id)).slice(-this.max);
    } catch { this.recent = []; }
  }

  pick(sessionUsed) {
    const banned = new Set(sessionUsed);
    const remain = this.catalog.filter(c => !banned.has(c.id));
    if (!remain.length) throw new Error('남은 분장이 없습니다');
    let pool = remain.filter(c => !this.recent.includes(c.id));
    if (!pool.length) {   // 후보가 바닥나면 가장 오래전에 나온 것부터 허용
      const age = c => this.recent.indexOf(c.id);
      pool = [remain.reduce((a, b) => (age(b) < age(a) ? b : a))];
    }
    // 조선 귀신과 세계 괴물이 고르게 섞이도록 적은 쪽을 우대
    const group = id => this.catalog.find(c => c.id === id).group;
    const seen = {};
    for (const c of this.catalog) seen[c.group] = 0;
    for (const id of sessionUsed) seen[group(id)]++;
    const least = Math.min(...Object.values(seen));
    const weights = pool.map(c => (seen[c.group] === least ? 3 : 1));
    let r = this.random() * weights.reduce((a, b) => a + b, 0);
    let choice = pool[pool.length - 1];
    for (let i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) { choice = pool[i]; break; }
    }
    this.recent.push(choice.id);
    if (this.recent.length > this.max) this.recent.shift();
    try { this.storage?.setItem('h4c-recent', JSON.stringify(this.recent)); } catch { /* 사생활 모드 */ }
    return choice;
  }
}
