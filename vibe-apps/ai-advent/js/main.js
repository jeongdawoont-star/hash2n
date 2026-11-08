// 화면 흐름: 첫 만남 → 이름 → 편지 → 달력 → 상자 열기 → 카드
import * as G from './scene.js';
import { makePlan, analyzeLetter, itemOf, fortuneOf, fill, josa, today, seasonOf, canOpen, daysUntil, DAYS } from './plan.js';
import { THEMES } from '../data/themes.js';
import { SANTA } from '../data/words.js';
import { load, save, blank, archive, wipe, toCode, fromCode } from './store.js';
import { sfx, setSound } from './sound.js';

const $ = s => document.querySelector(s);
const view = $('#view'), hud = $('#hud');
const FAIRY = '방울이';
let st;

// ---------- 아이콘 (단순한 그림) ----------
const IC = {
  letter: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2" fill="#fff" stroke="#5b4636" stroke-width="2"/><path d="M4 7l8 6 8-6" fill="none" stroke="#5b4636" stroke-width="2"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="#5b4636" stroke-width="2.4" stroke-dasharray="3.6 1.9"/><circle cx="12" cy="12" r="3" fill="#5b4636"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#5b4636" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" fill="#7d8fae"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#7d8fae" stroke-width="2.6"/></svg>',
  bow: '<svg viewBox="0 0 24 24" class="bow"><path d="M12 12C8 6 3 7 4 11s5 2 8 1zm0 0c4-6 9-5 8-1s-5 2-8 1z" fill="var(--rib,#f2c14e)" stroke="#4b342d" stroke-width="1.4"/><circle cx="12" cy="12" r="2.4" fill="var(--rib,#f2c14e)" stroke="#4b342d" stroke-width="1.4"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="#fff"/></svg>',
};
const WRAP_CSS = [['#e63946', '#ffd166'], ['#2d6a4f', '#e63946'], ['#4cc9f0', '#ffffff'], ['#ff8fab', '#ffffff'], ['#9b5de5', '#ffd166'], ['#f2c14e', '#e63946'], ['#7fb7e0', '#ffffff'], ['#e76f51', '#2d6a4f']];

// ---------- 도우미 ----------
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ctx = () => ({ name: st.name, wishes: st.wishes, msg: st.msg, wishOf: st.wishOf || {}, season: st.season, created: st.created });
const T = s => fill(s, ctx());
function persist() { save(st); }
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2200); }
async function fadeTo(fn) { const f = $('#fade'); f.classList.add('on'); await sleep(230); fn(); await sleep(60); f.classList.remove('on'); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
function on(sel, ev, fn) { view.querySelectorAll(sel).forEach(el => el.addEventListener(ev, e => { fn(e, el); })); }
function now() { return today(); }
function monthDay(d) { return `${d.getMonth() + 1}월 ${d.getDate()}일`; }

// 말풍선: 글자가 하나씩 나오고, 누르면 다음으로
function talk(lines, done, extra = '') {
  lines = lines.filter(Boolean); let i = 0, timer = null, full = false;
  view.innerHTML = `<div class="talk" id="tk"><span class="who">${FAIRY}</span><span id="tx"></span><span class="more" id="more" hidden></span></div>${extra}`;
  const tk = $('#tk'), tx = $('#tx'), more = $('#more');
  function show() {
    const s = lines[i]; let n = 0; full = false; more.hidden = true; tx.textContent = ''; clearInterval(timer);
    timer = setInterval(() => { n++; tx.textContent = s.slice(0, n); if (n % 2) sfx.blip(n); if (n >= s.length) { clearInterval(timer); full = true; more.hidden = i >= lines.length - 1 && !done; } }, 32);
    G.fairyBounce();
  }
  tk.addEventListener('click', () => {
    if (!full) { clearInterval(timer); tx.textContent = lines[i]; full = true; more.hidden = i >= lines.length - 1 && !done; return; }
    if (i < lines.length - 1) { i++; sfx.tap(); show(); } else if (done) { sfx.tap(); done(); }
  });
  show();
  return { finish() { clearInterval(timer); } };
}

// ---------- 위 화면 ----------
function setHud(left, right = '') { hud.innerHTML = `${left ? `<span class="chip">${left}</span>` : '<span></span>'}${right ? `<span class="chip gold">${right}</span>` : ''}`; }
function villageHud() {
  const d = now(), left = daysUntil(25, st.season, d);
  const r = d.getMonth() === 11 && d.getDate() >= 25 ? '메리 크리스마스!' : left > 0 ? `크리스마스까지 <b>${left}</b>일` : '';
  setHud(monthDay(d), r);
}
function refreshVillage() {
  const list = [];
  if (st.plan) for (let d = 1; d <= DAYS; d++) if (st.opened[d]) list.push({ ...itemOf(st.plan[d - 1], ctx()), day: d });
  G.setCollection(list);
  G.setReady(readyDays().length);
}
function readyDays() { if (!st.plan) return []; const out = []; for (let d = 1; d <= DAYS; d++) if (!st.opened[d] && canOpen(d, st.season, now())) out.push(d); return out; }

// ---------- 화면들 ----------
function goIntro() {
  G.setMode('village'); villageHud(); st.step = 'intro'; persist();
  talk([
    '안녕! 나는 산타 할아버지의 편지 요정 방울이야.',
    '크리스마스까지 매일 작은 선물 상자를 하나씩 열 수 있게 도와줄게.',
    '먼저 너의 이름을 알려 줄래?',
  ], goName);
}
function goName() {
  view.innerHTML = `<div class="talk"><span class="who">${FAIRY}</span>너의 이름은 뭐야?</div>
    <input class="field" id="nm" maxlength="10" placeholder="이름" autocomplete="off" value="${esc(st.name)}">
    <div class="row end"><button class="btn go" id="ok">좋아</button></div>`;
  const nm = $('#nm'); setTimeout(() => nm.focus(), 50);
  const ok = () => { const v = nm.value.trim().replace(/\s+/g, ' '); if (!v) { toast('이름을 적어 줘'); return; } st.name = v; persist(); sfx.tap();
    talk([`${josa(v, '아')}, 반가워!`, '산타 할아버지께 편지를 써 보자.', '받고 싶은 선물을 적으면 내가 꼭 전해 줄게!'], goLetter); };
  $('#ok').onclick = ok; nm.addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
}
function goLetter() {
  st.step = 'letter'; persist(); G.setMode('village'); villageHud();
  const w = st.wishes;
  view.innerHTML = `<div class="letter">
      <div class="stamp">${IC.heart}</div>
      <h2>산타 할아버지께</h2>
      <label for="w0">받고 싶은 선물 (하나만 써도 돼요)</label>
      <input id="w0" maxlength="24" placeholder="예) 강아지 인형" value="${esc(w[0])}">
      <input id="w1" maxlength="24" placeholder="또 받고 싶은 것" value="${esc(w[1])}">
      <input id="w2" maxlength="24" placeholder="하나 더" value="${esc(w[2])}">
      <label for="ms">하고 싶은 말</label>
      <textarea id="ms" maxlength="80" placeholder="올해 나는…">${esc(st.msg)}</textarea>
      <div class="from">${esc(st.name)} 올림</div>
    </div>
    <div class="row end">${st.plan ? '<button class="btn" id="cancel">그대로 두기</button>' : ''}<button class="btn go" id="send">우체통에 넣기</button></div>`;
  if ($('#cancel')) $('#cancel').onclick = () => { sfx.tap(); goCalendar(); };
  $('#send').onclick = async () => {
    const wishes = ['w0', 'w1', 'w2'].map(id => $('#' + id).value.trim()).filter(Boolean);
    if (!wishes.length) { toast('받고 싶은 선물을 하나 적어 줘'); return; }
    st.wishes = wishes; st.msg = $('#ms').value.trim();
    const keep = {}; Object.keys(st.opened).forEach(d => { if (st.plan) keep[d] = st.plan[d - 1]; });
    const r = makePlan(wishes, keep); st.plan = r.plan; st.wishOf = r.wishOf; st.themes = r.themes; st.step = 'calendar'; persist();
    sfx.send(); view.innerHTML = `<div class="talk"><span class="who">${FAIRY}</span>편지를 우체통에 쏙!</div>`;
    await G.sendLetter();
    view.innerHTML = `<div class="talk"><span class="who">${FAIRY}</span>산타 할아버지가 편지를 읽고 계셔… 반짝반짝…</div>`;
    G.celebrate('village'); sfx.sparkle(); await sleep(1300);
    const lines = r.found.map(f => f.theme ? `${f.wish}! ${THEMES[f.theme].say}.` : `${f.wish}! 처음 들어 보는 멋진 선물이야. 겨울 마법 상자로 준비할게.`);
    const d = now(), first = daysUntil(1, st.season, d);
    talk([...lines, T('산타 할아버지가 {이름:을} 위해 스물다섯 개 상자를 준비하셨대.'),
      first > 0 ? `12월 1일부터 하루에 하나씩 열 수 있어. ${first}일만 기다려!` : '못 연 상자가 있으면 몰아서 열어도 괜찮아. 오늘 상자부터 열어 볼까?'], goCalendar);
  };
}
function goCalendar() {
  st.step = 'calendar'; persist();
  G.setMode('village'); villageHud(); refreshVillage();
  const d = now(), ready = readyDays();
  const isDec = d.getMonth() === 11 && d.getFullYear() === st.season;
  let title;
  if (daysUntil(1, st.season, d) > 0) title = `12월 1일까지 <b>${daysUntil(1, st.season, d)}</b>일 남았어`;
  else if (ready.length) title = `열 수 있는 상자 <b>${ready.length}</b>개`;
  else if (Object.keys(st.opened).length >= DAYS) title = '상자를 모두 열었어!';
  else title = '오늘 상자 끝! 내일 또 만나';
  let cells = '';
  for (let n = 1; n <= DAYS; n++) {
    const opened = st.opened[n], ok = canOpen(n, st.season, d), isToday = isDec && d.getDate() === n;
    const cls = ['day', opened ? 'opened' : ok ? 'ready' : 'locked', n === 25 ? 'final' : '', isToday ? 'today' : ''].join(' ');
    let inner = `<span class="n">${n}</span>`;
    if (opened) { const it = itemOf(st.plan[n - 1], ctx()); inner += `<img alt="${esc(it.name)}" src="${G.thumb(it.kind, it.colors)}">`; }
    else if (ok) inner += IC.bow; else inner += IC.lock;
    const [wc, rc] = WRAP_CSS[(n * 5) % WRAP_CSS.length];
    cells += `<button class="${cls}" data-d="${n}" style="--wrap:${n === 25 ? '' : wc};--rib:${n === 25 ? '' : rc}" aria-label="${n}일">${inner}</button>`;
  }
  view.innerHTML = `<div class="cal-head"><div class="title">${title}</div>
      <button class="btn icon" id="lt" aria-label="편지">${IC.letter}</button><button class="btn icon" id="cfg" aria-label="설정">${IC.gear}</button></div>
    <div class="grid">${cells}</div>
    <div class="prog"><span>모은 선물</span><div class="bar"><i style="width:${Object.keys(st.opened).length / DAYS * 100}%"></i></div><b>${Object.keys(st.opened).length}/${DAYS}</b></div>`;
  on('.day', 'click', (e, el) => tapDay(+el.dataset.d));
  $('#lt').onclick = () => { sfx.tap(); goLetterView(); };
  $('#cfg').onclick = () => { sfx.tap(); goSettings(); };
}
function tapDay(n) {
  const d = now();
  if (st.opened[n]) { sfx.tap(); fadeTo(() => { G.setMode('stage'); G.showItem(itemOf(st.plan[n - 1], ctx())); goCard(n, false); }); return; }
  if (!canOpen(n, st.season, d)) {
    sfx.locked(); const left = daysUntil(n, st.season, d);
    toast(left === 1 ? `${n}일 상자는 내일 열 수 있어!` : `${n}일 상자는 ${left}일 뒤에 열 수 있어!`); return;
  }
  sfx.tap(); fadeTo(() => { G.setMode('stage'); G.showBox(n); goBox(n); });
}
function goBox(n) {
  setHud(`${n}일 상자`, n === 25 ? '크리스마스' : '');
  view.innerHTML = `<div class="talk"><span class="who">${FAIRY}</span>${n === 25 ? '드디어 크리스마스! 마지막 상자야.' : `${n}일 상자가 도착했어!`}<br>상자를 톡 누르면 열려. 손가락으로 살짝 돌려 볼 수도 있어.</div>
    <div class="spacer"></div>
    <div class="row"><button class="btn icon" id="bk" aria-label="달력으로">${IC.back}</button><span class="spacer"></span><button class="btn go" id="op">열어 보기</button></div>`;
  let opening = false;
  const doOpen = async () => {
    if (opening) return; opening = true; $('#op').disabled = true;
    const it = itemOf(st.plan[n - 1], ctx());
    st.opened[n] = Date.now(); persist();
    await G.openBox(it);
    if (n === 25) sfx.jingle(); else sfx.sparkle();
    goCard(n, true);
  };
  window.__boxTap = doOpen;
  $('#op').onclick = doOpen;
  $('#bk').onclick = () => { if (opening) return; sfx.tap(); fadeTo(goCalendar); };
}
function goCard(n, fresh) {
  window.__boxTap = null;
  const it = itemOf(st.plan[n - 1], ctx()), f = fortuneOf(n, ctx());
  setHud(`${n}일 상자`, it.final ? '크리스마스' : it.special ? '크리스마스 특별 상자' : '');
  const done = st.missions && st.missions[n];
  view.innerHTML = `<div class="card">
      <div class="day-no">12월 ${n}일${fresh ? ' · 새로 열었어!' : ''}</div>
      <h2>${esc(it.name)}</h2>
      <div class="story">${esc(it.story)}</div>
    </div>
    <div class="box-sec"><span class="k">오늘의 좋은 말</span>${esc(f.good)}</div>
    <div class="box-sec"><span class="k">오늘의 운세</span>${esc(f.fortune)}
      <div class="lucky"><span><i style="background:${f.color[1]}"></i>${esc(f.color[0])}</span><span>행운의 숫자 ${f.number}</span><span>행운의 물건 ${esc(f.thing)}</span></div></div>
    <div class="box-sec mission ${done ? 'done' : ''}" id="mi"><span class="ck"></span><span><span class="k">오늘의 작은 미션</span><span class="t">${esc(f.mission)}</span></span></div>
    <div class="row">${it.final ? '<button class="btn red" id="santa">산타 할아버지 답장</button>' : ''}<span class="spacer"></span><button class="btn go" id="bk">달력으로</button></div>`;
  $('#mi').onclick = () => { st.missions = st.missions || {}; st.missions[n] = !st.missions[n]; persist(); $('#mi').classList.toggle('done', !!st.missions[n]); if (st.missions[n]) { sfx.sparkle(); G.celebrate('stage'); toast('미션 완료! 멋져!'); } else sfx.tap(); };
  $('#bk').onclick = () => { sfx.tap(); fadeTo(goCalendar); };
  if ($('#santa')) $('#santa').onclick = () => { sfx.tap(); goSanta(); };
  if (fresh) G.celebrate('stage');
}
function goSanta() {
  const c = ctx(); c.wish = st.wishes.join(', ');
  const lines = SANTA.lines.map(l => l === '{말} ' ? (st.msg ? `‘${st.msg}’라고 써 준 말은 할아버지 마음에 꼭 간직할게.` : '') : fill(l, c)).filter(Boolean);
  view.innerHTML = `<div class="letter santa"><h2>${esc(fill(SANTA.open, c))}</h2>${lines.map(l => `<p>${esc(l)}</p>`).join('')}<p class="sign">${esc(SANTA.sign)}</p></div>
    <div class="row end"><button class="btn go" id="bk">달력으로</button></div>`;
  sfx.jingle();
  $('#bk').onclick = () => { sfx.tap(); fadeTo(goCalendar); };
}
function goLetterView() {
  const allOpen = Object.keys(st.opened).length >= DAYS;
  view.innerHTML = `<div class="letter"><div class="stamp">${IC.heart}</div><h2>산타 할아버지께</h2>
      <label>받고 싶은 선물</label>${st.wishes.map(w => `<div style="font-size:20px">${esc(w)}</div>`).join('')}
      ${st.msg ? `<label>하고 싶은 말</label><div style="font-size:18px;line-height:1.6">${esc(st.msg)}</div>` : ''}
      <div class="from">${esc(st.name)} 올림</div></div>
    <p class="hint">${allOpen ? '상자를 모두 열었어. 내년에 또 편지 쓰자!' : '편지를 고치면 아직 안 연 상자가 새로 준비돼요.'}</p>
    <div class="row"><button class="btn icon" id="bk" aria-label="달력으로">${IC.back}</button><span class="spacer"></span>${allOpen ? '' : '<button class="btn" id="ed">편지 고쳐 쓰기</button>'}</div>`;
  $('#bk').onclick = () => { sfx.tap(); goCalendar(); };
  if ($('#ed')) $('#ed').onclick = () => { sfx.tap(); goLetter(); };
}
function goSettings() {
  const s = st.settings;
  view.innerHTML = `<div class="set"><h3>소리</h3><div class="toggle" id="snd"><button data-v="1" class="${s.sound ? 'on' : ''}">켜기</button><button data-v="0" class="${s.sound ? '' : 'on'}">끄기</button></div></div>
    <div class="set"><h3>화면</h3><div class="toggle" id="crp"><button data-v="0" class="${s.crisp ? '' : 'on'}">게임기 느낌</button><button data-v="1" class="${s.crisp ? 'on' : ''}">선명하게</button></div></div>
    <div class="set"><h3>이어하기 코드</h3><p>열어 본 기록은 이 기기에 저장돼요. 다른 기기로 옮기거나 기록이 지워졌을 때 이 코드를 붙여 넣으면 이어서 할 수 있어요.</p>
      <div class="code" id="code">${toCode(st)}</div>
      <div class="row"><button class="btn small" id="copy">코드 복사</button><button class="btn small" id="paste">코드 붙여 넣기</button></div>
      <div id="pasteBox" hidden><textarea class="field" id="pc" placeholder="AIAC-로 시작하는 코드"></textarea><div class="row end" style="margin-top:8px"><button class="btn small go" id="load">불러오기</button></div></div></div>
    <div class="set"><h3>홈 화면에 추가</h3><p>브라우저 메뉴에서 ‘홈 화면에 추가’를 누르면 앱처럼 열리고, 기록도 더 안전하게 남아요.</p></div>
    <div class="set"><h3>처음부터 다시</h3><p>이름, 편지, 열어 본 상자가 모두 지워져요.</p><div class="row"><button class="btn small red" id="reset">처음부터 다시</button></div></div>
    <div class="row"><button class="btn icon" id="bk" aria-label="달력으로">${IC.back}</button></div>`;
  view.querySelectorAll('#snd button').forEach(b => b.onclick = () => { s.sound = b.dataset.v === '1'; setSound(s.sound); persist(); sfx.tap(); goSettings(); });
  view.querySelectorAll('#crp button').forEach(b => b.onclick = () => { s.crisp = b.dataset.v === '1'; applyCrisp(); persist(); sfx.tap(); goSettings(); });
  $('#copy').onclick = async () => { try { await navigator.clipboard.writeText(toCode(st)); toast('코드를 복사했어요'); } catch (e) { const r = document.createRange(); r.selectNodeContents($('#code')); getSelection().removeAllRanges(); getSelection().addRange(r); toast('코드를 길게 눌러 복사해 주세요'); } };
  $('#paste').onclick = () => { $('#pasteBox').hidden = false; $('#pc').focus(); };
  $('#load').onclick = () => { const n = fromCode($('#pc').value, blank(seasonOf())); if (!n) { toast('코드가 맞지 않아요'); return; }
    n.settings = st.settings; const r = makePlan(n.wishes, {}); n.wishOf = r.wishOf; n.themes = r.themes; st = n; persist(); toast(`${st.name}의 기록을 불러왔어요`); goCalendar(); };
  let armed = false;
  $('#reset').onclick = () => { if (!armed) { armed = true; $('#reset').textContent = '정말 지울까요? 한 번 더 누르기'; sfx.locked(); return; }
    wipe(); st = blank(seasonOf()); st.settings = s; persist(); refreshVillage(); goIntro(); };
  $('#bk').onclick = () => { sfx.tap(); goCalendar(); };
}
function applyCrisp() { G.setCrisp(!!st.settings.crisp); $('#cv').classList.toggle('crisp', !!st.settings.crisp); }

// ---------- 시작 ----------
function start() {
  const season = seasonOf();
  st = load();
  if (st && st.season < season && now().getMonth() >= 10) {
    archive(st); const name = st.name, settings = st.settings; st = blank(season); st.name = name; st.settings = settings; st.step = 'newseason';
  }
  if (!st) st = blank(season);
  if (st.plan && !st.wishOf) { const r = makePlan(st.wishes, {}); st.wishOf = r.wishOf; }
  setSound(st.settings.sound !== false);
  G.init($('#cv'), {
    sfx: k => sfx[k] && sfx[k](),
    onBoxTap: () => window.__boxTap && window.__boxTap(),
    onItemTap: day => { if (day) tapDay(day); },
    onFairyTap: () => { if (st.step === 'calendar' && G.getMode() === 'village') { sfx.blip(3); const r = readyDays().length; toast(r ? `열 수 있는 상자가 ${r}개 있어!` : '내일도 꼭 만나자!'); } },
    onReadyTap: () => { const r = readyDays(); if (r.length && st.step === 'calendar') tapDay(r[0]); },
    onMailTap: () => { if (st.step === 'calendar') { sfx.tap(); goLetterView(); } },
  });
  applyCrisp(); refreshVillage();
  if (st.step === 'newseason') { G.setMode('village'); villageHud(); talk([`${josa(st.name, '아')}, 또 만났네!`, '올해도 산타 할아버지께 편지를 써 볼까?'], goLetter); }
  else if (!st.name) goIntro();
  else if (!st.plan) goLetter();
  else goCalendar();
  // 날짜가 바뀌면(자정) 달력 새로 그리기
  let lastDay = now().getDate();
  setInterval(() => { const d = now().getDate(); if (d !== lastDay) { lastDay = d; if (st.step === 'calendar' && G.getMode() === 'village') goCalendar(); } }, 30000);
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !/localhost|127\.0\.0\.1/.test(location.hostname)) navigator.serviceWorker.register('sw.js').catch(() => {});
  window.__app = { get state() { return st; }, goCalendar, tapDay };
}
Promise.race([document.fonts ? document.fonts.load('20px Jua') : Promise.resolve(), sleep(1500)]).catch(() => {}).finally(start);
