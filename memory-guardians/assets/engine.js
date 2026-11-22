/* 기억 수호단 엔진 — 암호화된 기억의 문을 여는 스크립트 */
(function(){
"use strict";
const $ = (s,el=document)=>el.querySelector(s);
const enc = new TextEncoder(), dec = new TextDecoder();

function norm(s){
  s=(s||"").normalize("NFC").toLowerCase().replace(/[\s.,·ㆍ‧!?'"`\-_~()\[\]\/:;]/g,"");
  const m=s.match(/^(\d+)(년|명|번|살|세|개|월)?$/); if(m) s=m[1];
  return s;
}
async function sha(str){ return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(str))); }
const hex=u=>Array.from(u).map(b=>b.toString(16).padStart(2,"0")).join("");
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function idOf(keyBytes){ return hex(await sha("id|"+hex(keyBytes))).slice(0,16); }
async function decryptBlob(keyBytes, blob){
  const k=await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
  const pt=await crypto.subtle.decrypt({name:"AES-GCM", iv:b64(blob.iv)}, k, b64(blob.ct));
  return JSON.parse(fixText(dec.decode(pt)));
}
/* 이야기 속 특정 장소(벽화)를 어느 학교에서나 맞는 말로 바꾼다. 마지막 장소 이름은 places.js에서 화면에 따로 나온다. */
const TEXT_FIX=[
  ["훈민정음 벽화 앞에서","마지막 장소에서"],
  ["벽화 앞으로","마지막 장소로"],
  ["훈민정음 벽화의 글자들이","흩어졌던 글자들이"]
];
function fixText(s){ TEXT_FIX.forEach(([a,b])=>{ s=s.split(a).join(b); }); return s; }
async function open(map, material){
  const k=await sha(material); const id=await idOf(k);
  if(!map[id]) return null;
  try{ return {data:await decryptBlob(k,map[id]), key:k}; }catch(e){ return null; }
}

/* ---------- 태블릿 기록(실패해도 게임은 계속) ---------- */
const store={
  get(k,d){ try{ const v=localStorage.getItem("ij_"+k); return v?JSON.parse(v):d; }catch(e){ return d; } },
  set(k,v){ try{ localStorage.setItem("ij_"+k, JSON.stringify(v)); }catch(e){} }
};
function penalty(code){ const p=store.get("p_"+code,{h:{},w:0}); return Object.keys(p.h).length + p.w; }
function addHint(code,tag){ const p=store.get("p_"+code,{h:{},w:0}); p.h[tag]=1; store.set("p_"+code,p); }
function addWrong(code){ const p=store.get("p_"+code,{h:{},w:0}); p.w++; store.set("p_"+code,p); }

function placeName(id){
  const P=window.PLACES||{}; const p=P[id]; return p? (p[0]+" "+p[1]) : id;
}
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function img(src,cls){ return `<img class="${cls||"scene"}" src="${src}" alt="" onerror="this.remove()">`; }
function marker(gl){
  const words=(gl||[]).map(g=>g[0]).sort((a,b)=>b.length-a.length);
  return text=>{
    let parts=[esc(text)];
    words.forEach(w=>{
      const ew=esc(w), i=(gl||[]).findIndex(g=>g[0]===w);
      parts=parts.flatMap(p=>typeof p!=="string"?[p]:p.split(ew).flatMap((x,k)=>k?[{i,w:ew},x]:[x]));
    });
    return parts.map(p=>typeof p==="string"?p:`<button type="button" class="gl" data-i="${p.i}">${p.w}</button>`).join("");
  };
}
function glossUI(root, gl){
  let pop=document.querySelector(".glpop");
  if(!pop){ pop=document.createElement("div"); pop.className="glpop"; document.body.appendChild(pop); pop.onclick=()=>pop.classList.remove("on"); }
  root.querySelectorAll(".gl").forEach(b=>b.onclick=e=>{
    e.stopPropagation(); const g=gl[+b.dataset.i];
    pop.innerHTML=`<b>${esc(g[0])}</b><span>${esc(g[1])}</span><small>눌러서 닫기</small>`; pop.classList.add("on");
  });
}
function shake(el){ el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }
function doorAnim(){
  const d=document.createElement("div"); d.className="door";
  d.innerHTML='<div class="l"></div><div class="r"></div>';
  document.body.appendChild(d); requestAnimationFrame(()=>d.classList.add("open"));
  setTimeout(()=>d.remove(),1400);
}

function noCrypto(){
  if(window.crypto && crypto.subtle) return false;
  $("#app").innerHTML='<div class="card warn">이 브라우저에서는 기억의 문을 열 수 없어요. 크롬이나 사파리 최신 버전에서 https 주소로 열어 주세요.</div>';
  return true;
}

/* ================= 거점(기억의 문) ================= */
async function station(){
  if(noCrypto()) return;
  const D=window.DOOR, app=$("#app");
  const lastCode=store.get("code","");
  app.innerHTML=`
  <header class="door-head"><div class="seal">門</div><h1>기억의 문</h1><p>요원 코드와 열쇠 낱말을 넣으면 문이 열린다.</p></header>
  <form class="card" id="f">
    <label>요원 코드 <small>(미션지 맨 위 4자리)</small><input id="code" inputmode="numeric" maxlength="4" autocomplete="off" value="${esc(lastCode)}" required></label>
    <label>열쇠 낱말 <small>(첫 문: 출발 열쇠 / 그다음: 앞 문에서 받은 열쇠)</small><input id="key" autocomplete="off" required></label>
    <button class="btn big">문 열기</button>
    <p class="msg" id="msg"></p>
  </form>`;
  $("#f").onsubmit=async e=>{
    e.preventDefault();
    const code=norm($("#code").value), key=norm($("#key").value);
    const r=await open(D.blobs, `${D.salt}|${code}|${key}`);
    if(!r){ $("#msg").textContent="문이 열리지 않는다. 요원 코드·열쇠 낱말·지금 서 있는 장소를 다시 확인하라."; shake($("#f")); return; }
    if(r.data.n===1) freshStart(code);
    store.set("code",code); doorAnim(); setTimeout(()=>chapter(r.data, r.key, code), 500);
  };
}

/* 첫 문: 같은 코드로 남은 기록(힌트·오답)이 있으면 새 모둠인지 묻는다.
   확인 → 이 태블릿 기록을 모두 지우고 새로 시작 / 취소 → 기록을 그대로 두고 이어서 */
function freshStart(code){
  const p=store.get("p_"+code,null);
  if(!p) return;
  const h=Object.keys(p.h||{}).length, w=p.w||0;
  if(!h && !w) return;
  const ok=confirm(`이 태블릿에 요원 코드 ${code}의 지난 기록이 남아 있다. (힌트 ${h}개 · 오답 ${w}번)\n\n새 모둠이면 [확인]: 앞 모둠 기록을 지우고 처음부터 시작한다.\n같은 모둠이 이어서 하는 중이면 [취소]: 기록을 그대로 두고 계속한다.`);
  if(!ok) return;
  try{ Object.keys(localStorage).filter(k=>k.startsWith("ij_")).forEach(k=>localStorage.removeItem(k)); }catch(e){}
}

function chapter(c, k1, code){
  const app=$("#app"); document.documentElement.style.setProperty("--hero",c.color);
  const used=store.get("p_"+code,{h:{}}).h; const M=marker(c.g);
  app.innerHTML=`
  <article class="chap">
    <div class="chap-top"><span class="who">${esc(c.name)}의 기억</span><span class="no">${c.n} / 5</span></div>
    <h2>${esc(c.t)}</h2>
    <div class="when"><span>${esc(c.when)}</span><span>${esc(c.where)}</span></div>
    ${img(c.img)}
    <div class="story">${c.s.map(p=>`<p>${M(p)}</p>`).join("")}</div>
    <aside class="record"><h3>기록 카드</h3><ul>${c.f.map(x=>`<li>${M(x)}</li>`).join("")}</ul></aside>
    ${c.g&&c.g.length?`<details class="words" open><summary>📖 낱말 풀이 <small>(밑줄 친 낱말을 눌러도 뜻이 나와요)</small></summary><dl>${c.g.map(g=>`<div><dt>${esc(g[0])}</dt><dd>${esc(g[1])}</dd></div>`).join("")}</dl></details>`:""}
    <section class="quest card" id="quest">
      <h3>임무</h3><p class="q">${M(c.q)}</p>
      ${c.type==="choice"
        ? `<div class="opts">${c.opts.map(o=>`<button type="button" class="btn opt">${esc(o)}</button>`).join("")}</div>`
        : `<form id="af"><input id="ans" autocomplete="off" placeholder="답을 적어라"><button class="btn">확인</button></form>`}
      <p class="msg" id="amsg"></p>
      <div class="hints">${c.h.map((h,i)=>`<button type="button" class="hint ${used[c.n+"-"+i]?"used":""}" data-i="${i}">${used[c.n+"-"+i]?esc(h):"힌트 "+(i+1)+" 보기"}</button>`).join("")}</div>
      <p class="tiny">힌트를 쓰거나 답을 틀리면 엔딩 칭호가 달라진다. 미션지 힌트 칸에 ✔ 표시!</p>
    </section>
  </article>`;
  window.scrollTo(0,0); glossUI(app, c.g||[]);
  app.querySelectorAll(".hint").forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i; if(i===1 && !used[c.n+"-0"] && !b.classList.contains("used")){ $("#amsg").textContent="힌트 1부터 보자."; return; }
    if(b.classList.contains("used")) return;
    if(!confirm("힌트를 볼까? (엔딩 칭호에 영향이 있다)")) return;
    addHint(code, c.n+"-"+i); used[c.n+"-"+i]=1; b.classList.add("used"); b.textContent=c.h[i];
  });
  const tryAns=async raw=>{
    const a=norm(raw); if(!a) return;
    const k2=await sha(hex(k1)+"|"+a); const id=await idOf(k2);
    let rv=null; if(c.rv[id]){ try{ rv=await decryptBlob(k2,c.rv[id]); }catch(e){} }
    if(!rv){ addWrong(code); $("#amsg").textContent="기억이 흐려진다… 다시 생각해 보라."; shake($("#quest")); return; }
    reveal(c, rv, code);
  };
  if(c.type==="choice") app.querySelectorAll(".opt").forEach(b=>b.onclick=()=>tryAns(b.textContent));
  else $("#af").onsubmit=e=>{ e.preventDefault(); tryAns($("#ans").value); };
}

function reveal(c, rv, code){
  const app=$("#app");
  const next = rv.next==="FINAL"
    ? `<div class="next final"><small>마지막 장소</small><b>${esc(placeName("FINAL"))}</b><p>다섯 글자를 바른 순서로 맞춰 마지막 문을 열어라.</p></div>`
    : `<div class="next"><small>다음 기억이 숨은 곳</small><b>${esc(placeName(rv.next))}</b></div>`;
  app.innerHTML=`
  <article class="chap">
    <div class="chap-top"><span class="who">${esc(c.name)}의 기억</span><span class="no">${c.n} / 5</span></div>
    <h2>기억 조각을 되찾았다!</h2>
    <div class="story"><p>${esc(rv.r)}</p></div>
    <div class="got">
      <div><small>기억 조각(글자)</small><div class="stamp">${esc(rv.letter)}</div></div>
      <div><small>미션지에 적을 열쇠 낱말</small><div class="kw">${esc(rv.kw)}</div></div>
    </div>
    ${next}
    <p class="tiny center">미션지에 글자와 열쇠 낱말을 적었으면 이동하라. 뛰지 말 것!</p>
  </article>`;
  window.scrollTo(0,0);
}

/* ================= 마지막 문(엔딩) ================= */
const TIERS=[
  {max:2, name:"빛나는 기억 수호자", line:"너희는 거의 도움 없이 모든 기억을 되찾았다. 기억의 서고가 너희 이름을 금빛으로 새긴다."},
  {max:5, name:"용감한 기억 수호자", line:"몇 번 길을 헤맸지만 끝까지 포기하지 않았다. 독립운동가들도 그렇게 넘어지고 다시 일어섰다."},
  {max:1e9, name:"끈기의 기억 수호자", line:"힌트와 실수가 많았던 만큼, 너희는 누구보다 오래 이 기억과 함께했다. 그 시간이 곧 기억이다."}
];
async function finalDoor(){
  if(noCrypto()) return;
  const D=window.DOOR, app=$("#app");
  app.innerHTML=`
  <header class="door-head gold"><div class="seal">光</div><h1>광복의 책</h1><p>되찾은 다섯 글자를 바른 순서로 새겨라.</p></header>
  <form class="card" id="f">
    <label>요원 코드<input id="code" inputmode="numeric" maxlength="4" autocomplete="off" value="${esc(store.get("code",""))}" required></label>
    <label>다섯 글자 비밀 낱말<input id="ph" autocomplete="off" maxlength="12" required></label>
    <button class="btn big">새기기</button>
    <p class="msg" id="msg"></p>
    <p class="tiny">순서가 헷갈리면? 그 사람의 마지막 장 이야기를 떠올려 보라. 그 사람과 가장 깊이 연결된 이름이다.</p>
  </form>
  <details class="card secret"><summary>🔒 비밀의 서고 (훈장 코드 3개 이상)</summary>
    <p>다른 미션지로 다시 도전해 얻은 훈장 코드를 모아 적어라. 한 줄에 하나씩.</p>
    <textarea id="medals" rows="4" placeholder="예) ABCDE">${esc(store.get("medals",[]).join("\n"))}</textarea>
    <button class="btn" id="sb">서고 열기</button><p class="msg" id="smsg"></p>
  </details>`;
  $("#f").onsubmit=async e=>{
    e.preventDefault();
    const code=norm($("#code").value), ph=norm($("#ph").value);
    const r=await open(D.blobs, `${D.salt}|${code}|${ph}`);
    if(!r){ $("#msg").textContent="글자가 새겨지지 않는다. 요원 코드나 글자 순서를 다시 확인하라."; shake($("#f")); return; }
    store.set("code",code); doorAnim(); setTimeout(()=>ending(r.data, code), 500);
  };
  $("#sb").onclick=()=>secret($("#medals").value);
}
function ending(E, code){
  const app=$("#app"); document.documentElement.style.setProperty("--hero",E.color);
  const p=penalty(code); const t=TIERS.find(t=>p<=t.max);
  const medals=store.get("medals",[]); if(!medals.includes(E.medal)){ medals.push(E.medal); store.set("medals",medals); }
  app.innerHTML=`
  <article class="chap ending">
    <div class="chap-top"><span class="who">ENDING</span><span class="no">${esc(E.name)}</span></div>
    <h2>${esc(E.title)}</h2>
    ${img("../img/"+E.key+"_end.jpg")}
    <div class="story">${E.body.map(x=>`<p>${esc(x)}</p>`).join("")}</div>
    <div class="tier"><small>너희 칭호</small><b>${t.name}</b><p>${t.line}</p></div>
    <div class="got">
      <div><small>훈장 코드 (미션지에 적어라)</small><div class="kw medal">${esc(E.medal)}</div></div>
      <div><small>이 태블릿에서 모은 엔딩</small><div class="kw">${medals.length} / 11</div></div>
    </div>
    <aside class="record"><h3>이어지는 기억</h3><p>${esc(E.linkmsg)}</p><p class="tiny">함께 연결된 사람: ${E.link.map(esc).join(", ")}</p></aside>
    <p class="tiny center">훈장 코드를 3개 이상 모으면 마지막 문 아래 '비밀의 서고'가 열린다.</p>
    <button class="btn" onclick="location.reload()">처음 화면으로</button>
  </article>`;
  window.scrollTo(0,0);
}
async function secret(text){
  const D=window.DOOR;
  const codes=[...new Set(text.split(/[\n,\s]+/).map(norm).filter(Boolean))].sort();
  store.set("medals", codes.map(c=>c.toUpperCase()));
  const fail=()=>{ $("#smsg").textContent="서고가 열리지 않는다. 서로 다른 진짜 훈장 코드 3개 이상이 필요하다."; };
  if(codes.length<3) return fail();
  if(codes.length>=11){
    const r=await open(D.s11, `${D.salt}|w11|${codes.join(",")}`);
    if(r) return secretView(r.data);
  }
  for(let a=0;a<codes.length;a++)for(let b=a+1;b<codes.length;b++)for(let c=b+1;c<codes.length;c++){
    const r=await open(D.w3, `${D.salt}|w3|${[codes[a],codes[b],codes[c]].join(",")}`);
    if(r){ const k=b64(r.data.k); const d=await decryptBlob(k, D.s3); return secretView(d); }
  }
  fail();
}
function secretView(S){
  doorAnim();
  setTimeout(()=>{
  document.documentElement.style.setProperty("--hero","#b8860b");
  $("#app").innerHTML=`
  <article class="chap ending">
    <div class="chap-top"><span class="who">SECRET ENDING</span><span class="no">${esc(S.tag)}</span></div>
    <h2>${esc(S.title)}</h2>
    <div class="story">${S.body.map(x=>`<p>${esc(x)}</p>`).join("")}</div>
    ${S.timeline?`<ol class="timeline">${S.timeline.map(([y,t])=>`<li><b>${y}</b><span>${esc(t)}</span></li>`).join("")}</ol>`:""}
    ${S.names?`<div class="names">${S.names.map(([n,p])=>`<div><b>${esc(n)}</b><span>${esc(p)}</span></div>`).join("")}</div>`:""}
    <aside class="record"><h3>마지막 질문</h3><p>${esc(S.question)}</p></aside>
    <button class="btn" onclick="location.reload()">처음 화면으로</button>
  </article>`; window.scrollTo(0,0); },500);
}

window.IJ={station, finalDoor, norm, store};
document.addEventListener("DOMContentLoaded",()=>{ if(window.DOOR) (window.DOOR.kind==="final"?finalDoor:station)(); });
})();
