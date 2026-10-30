/* =========================================================
   퍼스트클래스 라운지 — 화폐 엔진 (fc-econ.js)
   학생 라운지(브라우저)와 Vercel 서버(/api/fc)가 이 파일 하나를 같이 씁니다.
   - 보안 모드: 서버가 Firestore 트랜잭션 안에서 실행 (학생 브라우저는 돈을 직접 못 고침)
   - 연결 전/체험 모드: 라운지가 같은 계산을 직접 실행

   돈의 흐름
     ⭐ 포인트(저축, 퍼스트클래스 칭찬 점수) ─1P=100만원, 수수료 10%→ 💰 화폐(wallets/{학생}.cash)
     💰 화폐 → 📈 주식 투자(잠김) / 🛒 매점 / 🔨 경매(입찰하면 바로 빠지고, 밀리거나 취소하면 돌려받음) / 🏦 은행(학생끼리 거래)
   통화량(그날 물가 기준) = Σ(포인트 × 수수료 뺀 1P 값 + 지갑 + 입찰에 걸린 돈)
   ========================================================= */
(function (root) {
  'use strict';
  const DEF_ST = { floor: 10, unit: 100000, rate: 1000000, buyFee: 10, fee: 10, div: 10, allowSelf: false, minBudget: 5 };
  /** 경매·은행 기본값. seatMin·busMin = 최저 입찰가, step = 최소 인상폭, ext = 마감 직전 입찰 시 연장(분), lock = 마감 몇 분 전부터 취소 불가 */
  const DEF_EC = { seatMin: 10000000, busMin: 10000000, step: 100000, ext: 2, lock: 10, bankers: [] };
  /** 매점 기본 상품 (가격 = 그날 1인당 통화량 × pct%) */
  const DEF_ITEMS = [
    { id: 'candy', name: '사탕', emoji: '🍬', pmin: 2, pmax: 5, pct: 3.5, stock: 30, daily: 2, on: true, auto: true },
    { id: 'enak', name: '에낙', emoji: '🍜', pmin: 20, pmax: 30, pct: 25, stock: 10, daily: 1, on: true, auto: true },
  ];

  const r10k = n => Math.round(n / 10000) * 10000;
  const dayKey = (t = Date.now()) => new Date(t + 9 * 3600e3).toISOString().slice(0, 10); // 한국 날짜
  const units = m => Object.values(m || {}).reduce((a, b) => a + (+b || 0), 0);
  const won = n => { n = Math.round(n / 10000); const s = n < 0 ? '-' : ''; n = Math.abs(n); const e = Math.floor(n / 10000), m = n % 10000; return s + (e ? e.toLocaleString() + '억' + (m ? ' ' : '') : '') + (m || !e ? m.toLocaleString() + '만' : '') + '원'; };
  const rid = () => Date.now().toString(36).slice(-5) + Math.random().toString(36).slice(2, 8);
  class EconError extends Error { constructor(m) { super(m); this.econ = true; } }
  const E = m => { throw new EconError(m); };

  const ST = set => { const cur = set?.stock || {}; return Object.assign({}, DEF_ST, cur, { unit: +cur.unit || 100000 }); };
  const EC = set => Object.assign({}, DEF_EC, set?.econ || {});

  /* ---------- 상태 계산 (ctx = {main, att, set, stock, econ, wallets:{id:w}, auctions:[...] }) ---------- */
  const roster = c => c.main?.roster || [];
  const pending = (c, id) => Object.values(c.att?.pen || {}).filter(p => p.sid === id && !p.applied).reduce((a, p) => a + (+p.pts || 0), 0);
  /** 쓸 수 있는 포인트 = 퍼스트클래스 점수 − 아직 반영 안 된 조정 */
  const pts = (c, id) => (+(c.main?.scores?.[id]) || 0) - pending(c, id);
  const curRound = c => c.stock?.cur ? c.stock.rounds?.[c.stock.cur] : null;
  function lockedInv(c, id) { const R = curRound(c); if (!R || R.status === 'settled' || !(R.v >= 2)) return 0; return units(c.wallets[id]?.inv?.[R.id]) * ST(c.set).unit; }
  const cash = (c, id) => +c.wallets[id]?.cash || 0;
  /** 바로 쓸 수 있는 화폐 = 지갑 − 투자 중 */
  const free = (c, id) => cash(c, id) - lockedInv(c, id);
  /** 진행 중인 경매에 걸어 둔 돈 (지갑에서 이미 빠져 있음) */
  function escrow(c, id) { let n = 0; for (const a of c.auctions || []) if (a.status === 'open') for (const t of Object.values(a.top || {})) if (t && t.sid === id) n += +t.amt || 0; return n; }
  const netPt = c => { const s = ST(c.set); return s.rate * (1 - (+s.buyFee || 0) / 100); };
  /** 총자산 = 포인트(수수료 뺀 값) + 지갑 + 입찰에 걸린 돈 */
  const asset = (c, id) => Math.max(0, pts(c, id)) * netPt(c) + cash(c, id) + escrow(c, id);
  function measure(c) {
    const r = roster(c), list = r.map(s => ({ id: s.id, a: asset(c, s.id) })), M = list.reduce((x, y) => x + y.a, 0);
    const sorted = list.map(x => x.a).sort((a, b) => a - b), med = sorted.length ? (sorted[(sorted.length - 1) >> 1] + sorted[sorted.length >> 1]) / 2 : 0;
    let P = 0, C = 0, X = 0; for (const s of r) { P += Math.max(0, pts(c, s.id)); C += cash(c, s.id); X += escrow(c, s.id); }
    return { M, n: r.length, perCap: r.length ? r10k(M / r.length) : 0, med: r10k(med), P, C, X };
  }
  /** 오늘 물가 기준. 오늘 처음 돈이 움직일 때 한 번 정해서(app/econ) 하루 동안 그대로 씀 */
  function econNow(c, now = Date.now()) {
    const d = dayKey(now);
    if (c.econ?.day === d) return { ...c.econ, frozen: true };
    return { day: d, ...measure(c), frozen: false };
  }
  const itemPrice = (it, eco) => Math.max(100000, r10k(eco.perCap * (+it.pct || 0) / 100));
  const soldToday = (it, d) => +it.sold?.[d] || 0;
  const myToday = (it, d, sid) => +it.cnt?.[d]?.[sid] || 0;

  /* ---------- 트랜잭션 도우미 ----------
     tx = { get(path) → 문서|null, col(name) → [{id,...}], now }
     실행 결과 ops = [{ op:'upd', path, f:{'a.b':값} } | { op:'put', path, d:{...} }]
     upd는 문서가 있으면 update(점 경로 = 그 칸을 통째로 바꿈), 없으면 새로 만듦 */
  async function loadCtx(tx, extra = {}) {
    const [main, att, set, stock, econ, wl, auctions] = await Promise.all([tx.get('app/main'), tx.get('app/attitude'), tx.get('app/settings'), tx.get('app/stock'), tx.get('app/econ'), tx.col('wallets'), tx.col('auctions')]);
    const c = { main, att, set, stock, econ, wallets: Object.fromEntries(wl.map(w => [w.id, w])), auctions, now: tx.now || Date.now(), ops: [] };
    for (const [k, p] of Object.entries(extra)) c[k] = p.endsWith('/') ? await tx.col(p.slice(0, -1)) : await tx.get(p);
    return c;
  }
  /** 읽기 절약: 몇 명의 지갑만 필요한 일은 전체 지갑·경매를 읽지 않음. 오늘 물가가 아직 안 정해졌으면(하루 첫 거래) 전체가 필요 */
  async function loadLite(tx, ids, auc) {
    const [main, att, set, stock, econ] = await Promise.all([tx.get('app/main'), tx.get('app/attitude'), tx.get('app/settings'), tx.get('app/stock'), tx.get('app/econ')]);
    const now = tx.now || Date.now();
    if (econ?.day !== dayKey(now)) return loadCtx(tx);
    const c = { main, att, set, stock, econ, wallets: {}, auctions: [], now, ops: [], lite: true };
    if (typeof auc === 'string' && /^[\w-]{1,60}$/.test(auc)) { const A = await tx.get('auctions/' + auc); if (A) c.auctions.push({ ...A, id: auc }); }
    for (const id of ids) await needW(tx, c, id);
    return c;
  }
  /** 가벼운 읽기에서 지갑 하나 더 (전체를 읽었으면 그대로) */
  async function needW(tx, c, id) { if (c.lite && id && !c.wallets[id]) { const w = await tx.get('wallets/' + id); if (w) c.wallets[id] = { ...w, id }; } }
  const upd = (c, path, f) => { const o = c.ops.find(x => x.op === 'upd' && x.path === path); if (o) Object.assign(o.f, f); else c.ops.push({ op: 'upd', path, f: { ...f } }); };
  const put = (c, path, d) => c.ops.push({ op: 'put', path, d });
  const nm = (c, id) => roster(c).find(s => s.id === id)?.name || '';
  function setCash(c, id, v) {
    if (!c.wallets[id]) c.wallets[id] = { cash: 0 };
    c.wallets[id].cash = v; upd(c, 'wallets/' + id, { cash: v, name: nm(c, id) });
  }
  const addCash = (c, id, d) => setCash(c, id, cash(c, id) + d);
  const ledger = (c, e) => { const id = rid(); put(c, 'ledger/' + id, { id, at: c.now, day: dayKey(c.now), ...e }); return id; };
  const isStu = (c, id) => roster(c).some(s => s.id === id);
  const needStu = (who, c) => { if (who.role !== 's' || !isStu(c, who.sid)) E('학생으로 들어와야 해요'); };
  const needT = who => { if (who.role !== 't') E('선생님만 할 수 있어요'); };
  const isBanker = (c, who) => who.role === 't' || (who.role === 's' && (EC(c.set).bankers || []).includes(who.sid));

  /** 하루가 바뀌면: 어제 판매를 보고 상품 가격 비율(pct)을 조정한 뒤, 오늘 통화량을 고정 */
  function rollDay(c) {
    const d = dayKey(c.now); if (c.econ?.day === d) return c.econ;
    const prev = c.econ?.day, m = measure(c), hist = { ...(c.econ?.hist || {}) };
    hist[d] = { M: m.M, perCap: m.perCap, med: m.med, n: m.n };
    const keys = Object.keys(hist).sort(); for (const k of keys.slice(0, Math.max(0, keys.length - 60))) hist[k] = null; // 최근 60일만
    const eco = { day: d, ...m, at: c.now };
    upd(c, 'app/econ', { day: d, M: m.M, n: m.n, perCap: m.perCap, med: m.med, P: m.P, C: m.C, X: m.X, at: c.now, ['hist.' + d]: hist[d], ...Object.fromEntries(Object.entries(hist).filter(e => e[1] === null).map(([k]) => ['hist.' + k, null])) });
    if (prev) for (const it of c.items || []) {
      if (!it.on || it.auto === false) continue;
      const s = soldToday(it, prev), stepP = ((+it.pmax || 0) - (+it.pmin || 0)) / 4; let p = +it.pct || 0;
      if (it.out === prev) p = Math.min(+it.pmax, p + stepP); // 어제 다 팔림 → 오름
      else if (s < (s + (+it.stock || 0)) / 2) p = Math.max(+it.pmin, p - stepP); // 절반도 안 팔림 → 내림
      if (p !== +it.pct) { it.pct = Math.round(p * 10) / 10; upd(c, 'shop/' + it.id, { pct: it.pct }); }
    }
    c.econ = eco; return eco;
  }

  /* ---------- 행동 ---------- */
  const ACT = {};
  /** 하루 물가 고정만 (아무나) */
  ACT.tick = async (tx, who) => { const c = await loadCtx(tx, { items: 'shop/' }); rollDay(c); return { c, msg: '' }; };

  /** ⭐ 포인트 → 💰 화폐 */
  ACT.xbuy = async (tx, who, a) => {
    const c = await loadLite(tx, [who.sid]); needStu(who, c); const me = who.sid, n = Math.floor(+a.pts);
    if (!(n > 0)) E('1P 이상 적어요'); if (n > pts(c, me)) E(`포인트가 모자라요 (지금 ${pts(c, me)}P)`);
    const st = ST(c.set), gross = n * st.rate, fee = r10k(gross * (+st.buyFee || 0) / 100), net = gross - fee, id = rid();
    const w = c.wallets[me] || {}; addCash(c, me, net);
    upd(c, 'wallets/' + me, { xl: [...(w.xl || []), { id, dir: 'buy', pts: n, won: net, fee, at: c.now }].slice(-200) });
    upd(c, 'app/attitude', { ['pen.buy' + id]: { sid: me, pts: n, at: c.now, applied: false, kind: 'buy', reason: `화폐로 바꿈 ${won(net)}` } });
    return { c, msg: `💰 ${won(net)}이 지갑에 들어왔어요` };
  };
  /** 💰 화폐 → ⭐ 포인트 (저축) */
  ACT.xsell = async (tx, who, a) => {
    const c = await loadLite(tx, [who.sid]); needStu(who, c); const me = who.sid, n = Math.floor(+a.pts);
    if (!(n > 0)) E('1P 이상 적어요');
    const st = ST(c.set), gross = n * st.rate, fee = r10k(gross * (+st.fee || 0) / 100), cost = gross + fee, id = rid();
    if (cost > free(c, me)) E(`쓸 수 있는 돈이 모자라요 (${won(cost)} 필요)`);
    const w = c.wallets[me] || {}; addCash(c, me, -cost);
    upd(c, 'wallets/' + me, { xl: [...(w.xl || []), { id, dir: 'sell', pts: n, won: cost, fee, at: c.now }].slice(-200) });
    upd(c, 'app/attitude', { ['pen.ex' + id]: { sid: me, pts: -n, at: c.now, applied: false, kind: 'ex', reason: `화폐 → 포인트 저축 ${won(cost)}` } });
    return { c, msg: `⭐ 포인트 +${n}P 저축! 퍼스트클래스에도 자동으로 들어가요` };
  };
  /** 📈 이번 라운드 투자 금액 저장 (inv = {학생id: 단위 수}) */
  ACT.invest = async (tx, who, a) => {
    const c = await loadLite(tx, [who.sid]); needStu(who, c); const me = who.sid, R = curRound(c), st = ST(c.set);
    if (!R || R.status !== 'open') E('지금은 투자할 수 없어요');
    const inv = {}; for (const [k, v] of Object.entries(a.inv || {})) { const u = Math.floor(+v); if (u > 0 && isStu(c, k) && (st.allowSelf || k !== me)) inv[k] = u; }
    const need = units(inv) * st.unit;
    if (R.v >= 2) { if (need > cash(c, me)) E(`화폐가 모자라요 (지갑 ${won(cash(c, me))})`); }
    else { const B = Math.max(pts(c, me), st.minBudget); if (units(inv) * st.unit > B * st.rate) E('투자 예산을 넘었어요'); }
    upd(c, 'wallets/' + me, { ['inv.' + R.id]: Object.fromEntries(Object.entries(inv).sort()), name: nm(c, me) });
    return { c, msg: '' };
  };

  /** 🛒 매점에서 사기 → 교환권(orders) */
  ACT.buy = async (tx, who, a) => {
    const c = await loadLite(tx, [who.sid]); c.items = await tx.col('shop'); needStu(who, c); const me = who.sid, eco = rollDay(c), d = eco.day;
    const it = (c.items || []).find(x => x.id === a.item); if (!it || !it.on) E('지금 팔지 않는 물건이에요');
    if ((+it.stock || 0) < 1) E('다 팔렸어요');
    if (+it.daily && myToday(it, d, me) >= +it.daily) E(`오늘은 ${it.daily}개까지만 살 수 있어요`);
    const price = itemPrice(it, eco); if (a.expect && +a.expect !== price) E(`가격이 ${won(price)}으로 바뀌었어요. 다시 확인해 주세요`);
    if (price > free(c, me)) E(`화폐가 모자라요 (${won(price)} 필요, 쓸 수 있는 돈 ${won(free(c, me))})`);
    addCash(c, me, -price);
    const left = +it.stock - 1, f = { stock: left, ['sold.' + d]: soldToday(it, d) + 1, ['cnt.' + d + '.' + me]: myToday(it, d, me) + 1 }; if (!left) f.out = d;
    upd(c, 'shop/' + it.id, f);
    const oid = rid(); put(c, 'orders/' + oid, { id: oid, sid: me, name: nm(c, me), item: it.id, label: `${it.emoji || ''} ${it.name}`.trim(), price, at: c.now, day: d, st: 'paid' });
    ledger(c, { kind: 'shop', from: me, to: null, amt: price, memo: it.name, ref: oid });
    return { c, msg: `🎟 ${it.name} 교환권이 생겼어요 (${won(price)})` };
  };
  /** 교환권 사용(간식 나눠 줌) — 선생님 */
  ACT.give = async (tx, who, a) => {
    needT(who); const c = await loadCtx(tx, { o: 'orders/' + a.id }); const o = c.o; if (!o || o.st !== 'paid') E('이미 처리된 교환권이에요');
    upd(c, 'orders/' + a.id, { st: 'given', givenAt: c.now }); return { c, msg: `${o.name} ${o.label} 지급 완료` };
  };
  /** 교환권 취소 → 환불 (지급 전, 본인 또는 선생님) */
  ACT.refund = async (tx, who, a) => {
    const c = await loadCtx(tx, { o: 'orders/' + a.id, items: 'shop/' }); const o = c.o; if (!o || o.st !== 'paid') E('취소할 수 없는 교환권이에요');
    if (!(who.role === 't' || (who.role === 's' && who.sid === o.sid))) E('내 교환권만 취소할 수 있어요');
    addCash(c, o.sid, +o.price); upd(c, 'orders/' + a.id, { st: 'refund', refundAt: c.now });
    const it = (c.items || []).find(x => x.id === o.item);
    if (it) upd(c, 'shop/' + it.id, { stock: (+it.stock || 0) + 1, ['sold.' + o.day]: Math.max(0, soldToday(it, o.day) - 1), ['cnt.' + o.day + '.' + o.sid]: Math.max(0, myToday(it, o.day, o.sid) - 1), ...(it.out === o.day ? { out: null } : {}) });
    ledger(c, { kind: 'refund', from: null, to: o.sid, amt: +o.price, memo: o.label + ' 취소', ref: a.id });
    return { c, msg: `↩ ${won(o.price)} 돌려받았어요` };
  };

  /* 🔨 경매 (auctions/{id}) — kind 'seat'(교실 자리) | 'bus'(소풍 버스)
     { title, kind, keys:[팔 자리], min, step, end, status:'open'|'closed'|'done', top:{자리:{sid,amt,at}|null}, hist:[], result:{자리:sid} } */
  const aucOpen = (A, now) => A.status === 'open' && now < +A.end;
  const myTop = (A, sid) => Object.entries(A.top || {}).find(e => e[1] && e[1].sid === sid);
  ACT.bid = async (tx, who, a) => {
    const c = await loadLite(tx, [who.sid], a.auc); needStu(who, c); const me = who.sid, A = c.auctions.find(x => x.id === a.auc);
    if (!A || !aucOpen(A, c.now)) E('입찰이 끝났어요'); if (!(A.keys || []).includes(a.key)) E('경매하지 않는 자리예요');
    const ec = EC(c.set), step = +A.step || ec.step, min = +A.min || ec.seatMin, amt = r10k(+a.amt);
    const cur = A.top?.[a.key], mine = myTop(A, me), hist = (A.hist || []).slice(-300), f = {};
    await needW(tx, c, cur?.sid); // 밀려나는 친구 지갑
    if (cur && cur.sid === me) { if (amt < +cur.amt + step) E(`${won(+cur.amt + step)} 이상으로 올려야 해요`); }
    else if (amt < (cur ? +cur.amt + step : min)) E(`${won(cur ? +cur.amt + step : min)} 이상 입찰해야 해요`);
    let back = 0; // 내가 다른 자리에 걸어 둔 돈 (옮기면 돌려받음)
    if (mine && mine[0] !== a.key) { back = +mine[1].amt; f['top.' + mine[0]] = null; hist.push({ k: mine[0], sid: me, amt: back, at: c.now, x: 'move' }); }
    const pay = cur && cur.sid === me ? amt - cur.amt : amt;
    if (pay > free(c, me) + back) E(`화폐가 모자라요 (${won(pay)} 필요, 쓸 수 있는 돈 ${won(free(c, me) + back)})`);
    addCash(c, me, back - pay);
    if (cur && cur.sid !== me) { addCash(c, cur.sid, +cur.amt); hist.push({ k: a.key, sid: cur.sid, amt: +cur.amt, at: c.now, x: 'out' }); }
    f['top.' + a.key] = { sid: me, amt, at: c.now }; hist.push({ k: a.key, sid: me, amt, at: c.now, x: 'bid' }); f.hist = hist;
    const ext = (+A.ext >= 0 ? +A.ext : ec.ext) * 60000; if (ext && +A.end - c.now < ext) f.end = c.now + ext; // 마감 직전 입찰 → 연장
    upd(c, 'auctions/' + A.id, f); A.top = { ...A.top, [a.key]: f['top.' + a.key] }; if (mine && mine[0] !== a.key) A.top[mine[0]] = null;
    return { c, msg: `🔨 ${won(amt)} 입찰! ${f.end ? '(마감 직전이라 시간이 늘었어요)' : ''}` };
  };
  ACT.unbid = async (tx, who, a) => {
    const c = await loadLite(tx, [who.sid], a.auc); needStu(who, c); const me = who.sid, A = c.auctions.find(x => x.id === a.auc);
    if (!A || !aucOpen(A, c.now)) E('입찰이 끝났어요');
    const mine = myTop(A, me); if (!mine) E('취소할 입찰이 없어요');
    const lock = (+A.lock >= 0 ? +A.lock : EC(c.set).lock) * 60000; if (+A.end - c.now < lock) E(`마감 ${lock / 60000}분 전부터는 취소할 수 없어요`);
    addCash(c, me, +mine[1].amt);
    upd(c, 'auctions/' + A.id, { ['top.' + mine[0]]: null, hist: [...(A.hist || []).slice(-300), { k: mine[0], sid: me, amt: +mine[1].amt, at: c.now, x: 'cancel' }] });
    return { c, msg: `↩ 입찰을 취소하고 ${won(mine[1].amt)}을 돌려받았어요` };
  };
  /** 마감 → 낙찰 확정 (선생님. 시간이 지났으면 학생 화면도 자동으로 부를 수 있음) */
  ACT.close = async (tx, who, a) => {
    const A0 = await tx.get('auctions/' + a.auc); if (!A0 || A0.status !== 'open') E('이미 마감된 경매예요'); // 여러 화면이 동시에 불러도 첫 번째 말고는 여기서 끝
    const c = await loadCtx(tx); const A = c.auctions.find(x => x.id === a.auc); if (!A || A.status !== 'open') E('이미 마감된 경매예요');
    if (who.role !== 't' && c.now < +A.end) E('아직 마감 시간이 아니에요');
    const result = {}, wins = [];
    for (const [k, t] of Object.entries(A.top || {})) if (t && t.sid) { result[k] = t.sid; wins.push({ k, ...t }); }
    for (const w of wins) ledger(c, { kind: 'auction', from: w.sid, to: null, amt: +w.amt, memo: `${A.title} ${A.kind === 'bus' ? '버스' : '자리'} ${w.k}`, ref: A.id });
    const sales = (A.sales || []).concat(wins.map(w => ({ k: w.k, amt: +w.amt, at: c.now })));
    upd(c, 'auctions/' + A.id, { status: 'closed', closedAt: c.now, result, sales });
    return { c, msg: `🔨 마감! 낙찰 ${wins.length}자리` };
  };
  /** 경매 취소(선생님) — 걸린 돈 모두 돌려줌 */
  ACT.aCancel = async (tx, who, a) => {
    needT(who); const c = await loadCtx(tx); const A = c.auctions.find(x => x.id === a.auc); if (!A || A.status !== 'open') E('진행 중인 경매가 아니에요');
    for (const t of Object.values(A.top || {})) if (t && t.sid) addCash(c, t.sid, +t.amt);
    upd(c, 'auctions/' + A.id, { status: 'void', top: {}, closedAt: c.now }); return { c, msg: '경매를 취소하고 모두 돌려줬어요' };
  };

  /** 🏦 은행: 구매자 → 판매자 화폐 이동 (은행 직책 학생·선생님) */
  ACT.transfer = async (tx, who, a) => {
    const c = await loadCtx(tx); if (!isBanker(c, who)) E('은행 직책만 할 수 있어요');
    const from = a.from, to = a.to, amt = r10k(+a.amt);
    if (!isStu(c, from) || !isStu(c, to) || from === to) E('구매자와 판매자를 다르게 골라요');
    if (who.role === 's' && (from === who.sid || to === who.sid)) E('내 거래는 다른 은행원이나 선생님이 입력해요');
    if (!(amt > 0)) E('금액을 10만원 단위로 적어요');
    if (amt > free(c, from)) E(`${nm(c, from)}의 화폐가 모자라요 (쓸 수 있는 돈 ${won(free(c, from))})`);
    addCash(c, from, -amt); addCash(c, to, amt);
    ledger(c, { kind: 'bank', from, to, amt, memo: String(a.memo || '').slice(0, 40), by: who.role === 't' ? 'T' : who.sid });
    return { c, msg: `🏦 ${nm(c, from)} → ${nm(c, to)} ${won(amt)} 보냈어요` };
  };
  /** 은행 거래 되돌리기 (선생님) */
  ACT.reverse = async (tx, who, a) => {
    needT(who); const c = await loadCtx(tx, { L: 'ledger/' + a.id }); const L = c.L;
    if (!L || L.kind !== 'bank' || L.rev) E('되돌릴 수 없는 기록이에요');
    addCash(c, L.to, -L.amt); addCash(c, L.from, +L.amt); upd(c, 'ledger/' + a.id, { rev: c.now });
    ledger(c, { kind: 'bankrev', from: L.to, to: L.from, amt: +L.amt, memo: '되돌림: ' + (L.memo || ''), ref: a.id, by: 'T' });
    return { c, msg: '거래를 되돌렸어요' };
  };

  /** 실행: 결과 ops를 돌려줌 (저장은 부른 쪽에서) */
  async function run(tx, who, name, args = {}) {
    const f = ACT[name]; if (!f) E('알 수 없는 요청');
    const r = await f(tx, who || {}, args);
    if (name !== 'tick' && r.c.econ?.day !== dayKey(r.c.now) && r.c.ops.length) { // 오늘 첫 거래면 물가도 같이 고정
      if (!r.c.items) r.c.items = await tx.col('shop');
      rollDay(r.c);
    }
    return { ops: r.c.ops, msg: r.msg };
  }

  /** 점 경로 {'a.b': v} → {a:{b:v}} (새 문서 만들 때) */
  function expand(f) { const o = {}; for (const [k, v] of Object.entries(f)) { const p = k.split('.'); let t = o; for (let i = 0; i < p.length - 1; i++) t = t[p[i]] = (t[p[i]] && typeof t[p[i]] === 'object') ? t[p[i]] : {}; t[p.at(-1)] = v; } return o; }

  root.FCEcon = { DEF_ST, DEF_EC, DEF_ITEMS, ST, EC, r10k, dayKey, won, units, pending, pts, cash, free, escrow, lockedInv, netPt, asset, measure, econNow, itemPrice, soldToday, myToday, curRound, myTop, aucOpen, run, expand, ACT, EconError };
})(typeof globalThis !== 'undefined' ? globalThis : this);
