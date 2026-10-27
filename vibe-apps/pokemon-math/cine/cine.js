// 포켓몬수학 컷신. Lemo-Opuscar 방식: 장면 = 시간 t를 받아 한 프레임을 그리는 함수, 소리 = 시각별 큐 목록.
// 게임은 CINE.play(이름, 값)으로 실시간 재생하고, cine/index.html은 같은 장면을 Lemo-Opuscar 렌더러(window.DUR · render(t))로 뽑아 확인한다.
(function(){
'use strict';
const TAU=Math.PI*2,INK='#1d2b53',FONT='"Black Han Sans","Jua",sans-serif';
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),sg=(t,a,b)=>cl((t-a)/(b-a)),lerp=(a,b,x)=>a+(b-a)*x;
const eo=x=>1-(1-x)**3,eio=x=>x<.5?4*x*x*x:1-(-2*x+2)**3/2,bk=x=>{const c=1.70158;return x<=0?0:1+(c+1)*(x-1)**3+c*(x-1)**2};
const bo=x=>{const n=7.5625,d=2.75;return x<1/d?n*x*x:x<2/d?n*(x-=1.5/d)*x+.75:x<2.5/d?n*(x-=2.25/d)*x+.9375:n*(x-=2.625/d)*x+.984375};
const rnd=i=>{const s=Math.sin(i*12.9898+78.233)*43758.5453;return s-Math.floor(s)};
const BALLC={poke:['#ee1515',null],great:['#3b7de0','#ee1515'],ultra:['#2b2b33','#ffcb05']};
const CONF=['#ee1515','#ffcb05','#3b7de0','#22b46b','#ff9ad5','#ffffff','#7fe3ee'];

// ---- 그리기 도구
function tx(c,s,x,y,px,o={}){c.save();c.font=`${px}px ${FONT}`;const w=c.measureText(s).width,mw=o.max||1e9;if(w>mw){px*=mw/w;c.font=`${px}px ${FONT}`}
 c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.translate(x,y);if(o.rot)c.rotate(o.rot);if(o.sc&&o.sc!==1)c.scale(o.sc,o.sc);
 const lw=px*(o.lw||.18),st=o.st||INK;c.lineWidth=lw;c.strokeStyle=st;c.fillStyle=st;
 if(o.drop!==0){c.strokeText(s,0,px*.1);c.fillText(s,0,px*.1)}
 c.strokeText(s,0,0);
 if(o.grad){const g=c.createLinearGradient(0,-px*.5,0,px*.5);g.addColorStop(0,o.grad[0]);g.addColorStop(1,o.grad[1]);c.fillStyle=g}else c.fillStyle=o.fill||'#ffcb05';
 c.fillText(s,0,0);c.restore()}
function bg(c,W,H,a,b){const g=c.createRadialGradient(W/2,H*.45,0,W/2,H*.45,Math.hypot(W,H)*.6);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;c.fillRect(0,0,W,H)}
function rays(c,x,y,n,rot,R,col,a){c.save();c.globalAlpha*=a;c.fillStyle=col;c.beginPath();for(let i=0;i<n;i+=2){const a0=rot+i*TAU/n,a1=a0+TAU/n;c.moveTo(x,y);c.lineTo(x+Math.cos(a0)*R,y+Math.sin(a0)*R);c.lineTo(x+Math.cos(a1)*R,y+Math.sin(a1)*R);c.closePath()}c.fill();c.restore()}
function glow(c,x,y,r,col,a){if(a<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(255,255,255,0)');c.save();c.globalAlpha*=a;c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore()}
function flash(c,W,H,a,col='#fff'){if(a<=0)return;c.save();c.globalAlpha=cl(a);c.fillStyle=col;c.fillRect(0,0,W,H);c.restore()}
// 만화 집중선: 가장자리에서 가운데로
function focus(c,W,H,t,col,a,inner=.36){if(a<=0)return;const f=Math.floor(t*16),R=Math.hypot(W,H),m=Math.min(W,H);c.save();c.globalAlpha*=a;c.fillStyle=col;c.beginPath();
 for(let i=0;i<70;i++){const an=rnd(i)*TAU,w=.006+rnd(i+31)*.014,r0=m*(inner+rnd(i*3+f)*.14);c.moveTo(W/2+Math.cos(an)*r0,H/2+Math.sin(an)*r0);c.lineTo(W/2+Math.cos(an-w)*R,H/2+Math.sin(an-w)*R);c.lineTo(W/2+Math.cos(an+w)*R,H/2+Math.sin(an+w)*R);c.closePath()}c.fill();c.restore()}
function star(c,x,y,r,rot,fill,stroke=INK,lw){c.save();c.translate(x,y);c.rotate(rot);c.beginPath();for(let i=0;i<10;i++){const rr=i%2?r*.45:r,a=-Math.PI/2+i*Math.PI/5;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}c.closePath();
 c.lineJoin='round';if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.lineWidth=lw||r*.16;c.strokeStyle=stroke;c.stroke()}c.restore()}
function twinkle(c,x,y,r,a){if(a<=0||r<=0)return;c.save();c.globalAlpha*=a;c.fillStyle='#fff';c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x,y,x+r,y);c.quadraticCurveTo(x,y,x,y+r);c.quadraticCurveTo(x,y,x-r,y);c.quadraticCurveTo(x,y,x,y-r);c.fill();c.restore()}
function confetti(c,x,y,t,t0,U,n,seed){if(t<t0)return;const d=t-t0,fa=1-sg(d,1.3,2.2);if(fa<=0)return;c.save();c.globalAlpha*=fa;
 for(let i=0;i<n;i++){const a=rnd(seed+i)*TAU,sp=(30+rnd(seed+i*1.7)*70)*U,k=(1-Math.exp(-3*d))/3,px=x+Math.cos(a)*sp*k,py=y+Math.sin(a)*sp*k+18*U*d*d,s=U*(1+rnd(seed+i*2.3)*1.4);
  c.save();c.translate(px,py);c.rotate(d*(4+rnd(i)*8)+i);c.scale(1,Math.cos(d*9+i));c.fillStyle=CONF[i%CONF.length];c.fillRect(-s,-s*.5,s*2,s);c.restore()}c.restore()}
function ring(c,x,y,t,t0,R,U,col='#fff'){const p=sg(t,t0,t0+.7);if(p<=0||p>=1)return;c.save();c.globalAlpha=1-p;c.strokeStyle=col;c.lineWidth=U*3*(1-p)+1;c.beginPath();c.arc(x,y,R*eo(p),0,TAU);c.stroke();c.restore()}
function pball(c,x,y,r,kind,ang=0,open=0,lit=0){const k=BALLC[kind]||BALLC.poke,lw=r*.09;c.save();c.translate(x,y);c.rotate(ang);c.lineWidth=lw;c.strokeStyle=INK;c.lineJoin='round';
 if(open>0)glow(c,0,-r*.2,r*(1.6+open*1.4),'rgba(255,248,200,1)',open);
 c.beginPath();c.arc(0,0,r,0,Math.PI);c.closePath();c.fillStyle='#fff';c.fill();
 c.save();c.clip();c.fillStyle='rgba(29,43,83,.12)';c.beginPath();c.arc(r*.25,r*.1,r,0,TAU);c.fill();c.fillStyle=INK;c.fillRect(-r,0,r*2,r*.1);c.restore();c.stroke();
 c.save();if(open>0){c.translate(-r,0);c.rotate(-open*1.3);c.translate(r,0)}
 c.beginPath();c.arc(0,0,r,Math.PI,TAU);c.closePath();c.fillStyle=k[0];c.fill();
 c.save();c.clip();
 if(kind==='great'){c.fillStyle=k[1];for(const s of[-1,1]){c.beginPath();c.moveTo(s*r*.3,-r*1.1);c.lineTo(s*r*.62,-r*1.1);c.lineTo(s*r*.86,-r*.3);c.lineTo(s*r*.56,-r*.3);c.closePath();c.fill()}}
 if(kind==='ultra'){c.fillStyle=k[1];for(const s of[-1,1])c.fillRect(s*r*.62-r*.13,-r*1.1,r*.26,r*.84);c.fillRect(-r*.62,-r*.62,r*1.24,r*.2)}
 c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.ellipse(-r*.42,-r*.55,r*.24,r*.12,-.6,0,TAU);c.fill();
 c.fillStyle=INK;c.fillRect(-r,-r*.1,r*2,r*.1);c.restore();c.stroke();c.restore();
 c.beginPath();c.arc(0,0,r*.3,0,TAU);c.fillStyle='#fff';c.fill();c.stroke();
 c.lineWidth=lw*.55;c.beginPath();c.arc(0,0,r*.17,0,TAU);if(lit>0){c.save();c.shadowColor='#fff27a';c.shadowBlur=r*.8*lit;c.fillStyle=`rgba(255,240,120,${lit})`;c.fill();c.restore()}c.stroke();c.restore()}
// 포켓몬 그림: sil=1이면 검은 그림자, rim은 그림자 테두리 빛
const OFF=document.createElement('canvas'),OX=OFF.getContext('2d');
const okImg=im=>im&&im.complete&&im.naturalWidth>0;
function mon(c,im,x,y,s,o={}){if(s<=0)return;c.save();c.globalAlpha*=o.a==null?1:o.a;
 if(o.sx||o.sy){c.translate(x,y+s/2);c.scale(o.sx||1,o.sy||1);c.translate(-x,-y-s/2)}
 if(!okImg(im)){c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.arc(x,y,s*.35,0,TAU);c.fill();tx(c,'?',x,y,s*.4,{fill:'#fff'});c.restore();return}
 const sil=o.sil||0;
 if(sil<1){if(o.glow){c.shadowColor=o.glow;c.shadowBlur=s*.1}c.drawImage(im,x-s/2,y-s/2,s,s);c.shadowBlur=0}
 if(sil>0){const n=Math.min(1024,Math.ceil(s));if(OFF.width<n)OFF.width=OFF.height=n;OX.globalCompositeOperation='source-over';OX.clearRect(0,0,OFF.width,OFF.height);OX.drawImage(im,0,0,n,n);
  OX.globalCompositeOperation='source-in';OX.fillStyle=o.silCol||'#0d1230';OX.fillRect(0,0,n,n);OX.globalCompositeOperation='source-over';
  c.globalAlpha*=sil;if(o.rim){c.shadowColor=o.rim;c.shadowBlur=s*.09;c.drawImage(OFF,0,0,n,n,x-s/2,y-s/2,s,s)}c.shadowBlur=0;c.drawImage(OFF,0,0,n,n,x-s/2,y-s/2,s,s)}
 c.restore()}
function bolt(c,x0,y0,x1,y1,seed,U){c.save();c.strokeStyle='#fff6b0';c.shadowColor='#ffcb05';c.shadowBlur=U*3;c.lineWidth=U*1.1;c.lineJoin='round';c.beginPath();c.moveTo(x0,y0);
 for(let i=1;i<=8;i++){const p=i/8;c.lineTo(lerp(x0,x1,p)+(i<8?(rnd(seed+i)-.5)*U*12:0),lerp(y0,y1,p))}c.stroke();c.restore()}
function ribbon(c,W,y,h,p,fill){const x=-W*(1-p);c.save();c.translate(x,0);c.beginPath();c.moveTo(-h,y-h/2);c.lineTo(W+h*.4,y-h/2);c.lineTo(W-h*.2,y+h/2);c.lineTo(-h,y+h/2);c.closePath();
 const g=c.createLinearGradient(0,y-h/2,0,y+h/2);g.addColorStop(0,fill[0]);g.addColorStop(1,fill[1]);c.fillStyle=g;c.fill();c.lineWidth=h*.08;c.strokeStyle=INK;c.stroke();c.restore()}
// 흔들림: 시작 시각, 길이, 세기
const quake=(t,list,U)=>{let x=0,y=0;for(const[a,d,s]of list){const p=sg(t,a,a+d);if(p>0&&p<1){const k=(1-p)*s*U;x+=Math.sin(t*93)*k;y+=Math.cos(t*71)*k}}return[x,y]};

// ---- 장면
const ballT=p=>{const L=p.leg?2.6:0,Ro=4.45+L,Rv=p.leg?Ro+.5:5.25;return{Ro,Rv,end:Rv+2.3}};
const FILMS={
// 볼 열기: 떨어짐 → 세 번 흔들림 → 뚜껑 열림·섬광 → 그림자 → (전설: 번개와 땅울림) → 공개
ball:{dur:p=>ballT(p).end,
 draw(c,t,W,H,p){const U=Math.min(W,H)/100,cx=W/2,cy=H/2,{Ro,Rv}=ballT(p),leg=!!p.leg,k=BALLC[p.kind]||BALLC.poke,dark=leg&&t>4.3&&t<Rv;
  c.save();c.globalAlpha=eo(sg(t,0,.3));
  bg(c,W,H,dark?'#3a1650':t>=Rv?(leg?'#ffd27a':'#6cc7ff'):'#2d3f7a',dark?'#07030f':t>=Rv?(leg?'#b8561a':'#1b4f8a'):'#0b1030');
  rays(c,cx,cy,28,t*(t>4.3?.9:.25),Math.hypot(W,H),t>=Rv?'#fff':dark?'#ffcb05':k[0],t>=Rv?.22:dark?.2+.1*Math.sin(t*20):.16);
  const[qx,qy]=quake(t,[[.72,.25,1.2],[4.2,.4,1.5],...(leg?[[4.45,Ro-4.45,1.1],[4.9,.4,2.4],[5.9,.4,2.4],[Rv,.4,2]]:[[Rv,.35,1.2]])],U);c.translate(qx,qy);
  if(t<4.3){const r=U*15;let y=lerp(-r*2.2,cy,bo(sg(t,.1,.85)))-eio(sg(t,3.3,3.8))*U*5,ang=0;
   for(const s of[1,1.8,2.6]){const ph=sg(t,s,s+.55);if(ph>0&&ph<1)ang+=Math.sin(ph*TAU*2)*.42*(1-ph)}
   const lit=t>3.2?sg(t,3.2,3.45):Math.max(0,Math.sin((t-1)*Math.PI/.8))*.35*(t>1?1:0),open=eo(sg(t,3.8,4.12));
   c.save();c.globalAlpha*=.35*(1-sg(t,3.3,3.8)*.6);c.fillStyle='#000';c.beginPath();c.ellipse(cx,cy+r*1.08,r*.9*cl(sg(t,.1,.85)*1.2),r*.2,0,0,TAU);c.fill();c.restore();
   pball(c,cx+ang*r*.5,y,r,p.kind,ang,open,lit);
   if(t>3.2)for(let i=0;i<6;i++)twinkle(c,cx+Math.cos(i+t*2)*r*1.5,y+Math.sin(i*2+t*2)*r*1.3,U*2.4*Math.abs(Math.sin(t*6+i)),sg(t,3.2,3.4));
   const ta=sg(t,.9,1.2)*(1-sg(t,3.5,3.8));if(ta>0){c.save();c.globalAlpha*=ta;tx(c,'두근두근…',cx,H*.84,U*8,{sc:1+.06*Math.sin(t*9),fill:'#fff',max:W*.9,lw:.2,drop:0});c.restore()}}
  const S=U*56,my=cy-U*4;
  if(t>=4.25){const sc=t<Rv?lerp(.15,1,bk(sg(t,4.25,leg?Ro-.4:4.85))):1+.14*(1-eo(sg(t,Rv,Rv+.5))),sil=1-sg(t,Rv,Rv+.12),bob=Math.sin(t*3)*U*.8;
   glow(c,cx,my,S*(t>=Rv?.9:.75),leg?'rgba(255,214,90,.95)':'rgba(255,255,255,.9)',t>=Rv?.85:.55+.15*Math.sin(t*10));
   if(dark&&t>4.45)for(let i=0;i<3;i++){const f=Math.floor(t*11)+i*7;if(rnd(f)<.3){const x0=W*(.15+rnd(f+1)*.7);bolt(c,x0,-U*5,lerp(x0,cx,.6),my-S*.3,f,U)}}
   mon(c,p.im,cx,my+bob,S*sc,{sil,rim:leg?'#ffcb05':'#ffffff',glow:t>=Rv?'rgba(255,255,255,.9)':0});
   if(t<Rv){if(leg&&t>4.6)tx(c,'전설의 기운이…!',cx,H*.13,U*10,{sc:1+1.6*(1-eo(sg(t,4.6,4.8))),grad:['#fff6b0','#ffb000'],max:W*.92});
    else if(!leg&&t>4.5)tx(c,'누구일까?',cx,H*.86,U*8,{fill:'#fff',max:W*.9,sc:1+.05*Math.sin(t*9)})}}
  ring(c,cx,my,t,Rv,U*75,U);ring(c,cx,my,t,Rv+.12,U*55,U,leg?'#ffcb05':'#fff');
  confetti(c,cx,my,t,Rv,U,leg?150:90,7);
  if(t>Rv)for(let i=0;i<10;i++){const a=rnd(i+40)*TAU,rr=S*(.45+rnd(i+50)*.25);twinkle(c,cx+Math.cos(a)*rr,my+Math.sin(a)*rr,U*3*Math.max(0,Math.sin(t*4+i*1.3)),1)}
  if(t>Rv+.2){const bp=eo(sg(t,Rv+.2,Rv+.55));ribbon(c,W,H*.84,U*14,bp,leg?['#ffe27a','#f0a000']:['#ff5546','#b30c0c']);
   c.save();c.globalAlpha*=bp;tx(c,p.name||'',cx-(1-bp)*W,H*.84,U*10,{fill:leg?'#fff':'#ffcb05',max:W*.8});c.restore()}
  if(leg&&t>Rv+.35)tx(c,p.kindName||'전설의 포켓몬!',cx,H*.12,U*9,{sc:1+1.4*(1-eo(sg(t,Rv+.35,Rv+.55))),grad:['#fff6b0','#ffb000'],max:W*.92});
  if(p.isNew&&t>Rv+.7){const sp=eo(sg(t,Rv+.7,Rv+.9)),x=cx+S*.4,y=my-S*.38;c.save();c.translate(x,y);c.rotate(-.22);c.scale(1+1.6*(1-sp),1+1.6*(1-sp));c.globalAlpha*=sp;
   c.fillStyle='#ee1515';c.strokeStyle=INK;c.lineWidth=U*1.1;c.beginPath();c.roundRect(-U*11,-U*5.5,U*22,U*11,U*3);c.fill();c.stroke();tx(c,'NEW!',0,0,U*7.5,{fill:'#fff',drop:0});c.restore()}
  c.restore();
  flash(c,W,H,sg(t,4.18,4.24)-sg(t,4.3,4.75));flash(c,W,H,(sg(t,Rv-.06,Rv)-sg(t,Rv+.05,Rv+.45))*.95);
  if(leg){flash(c,W,H,(sg(t,4.9,4.93)-sg(t,4.95,5.2))*.5,'#fff6b0');flash(c,W,H,(sg(t,5.9,5.93)-sg(t,5.95,6.2))*.5,'#fff6b0')}},
 cues(p){const{Ro,Rv}=ballT(p),q=[[.72,'thud'],[3.3,'ding'],[3.8,'whoosh'],[4.18,'flash'],[Rv,'pop'],[Rv,p.leg?'legend':'fanfare'],[Rv+.2,'swish']];
  for(const s of[1,1.8,2.6])q.push([s,'click'],[s-.05,'heart']);
  if(p.leg)q.push([4.45,'rumble',Ro-4.45],[4.6,'slam'],[4.9,'thunder'],[5.9,'thunder'],[Rv+.35,'slam']);
  if(p.isNew)q.push([Rv+.7,'stamp']);return q}},
// 미션 성공: 사선 화면 전환 → 파트너 달려옴 → 글자 쾅 → 별 → 받은 볼
clear:{dur:p=>p.ball?4.7:3.7,
 draw(c,t,W,H,p){const U=Math.min(W,H)/100,cx=W/2,end=p.ball?4.7:3.7,perf=p.s===3,w=eo(sg(t,0,.32))*(W+H*.6);
  c.save();c.globalAlpha=1-sg(t,end-.35,end);
  c.save();c.beginPath();c.moveTo(0,0);c.lineTo(w,0);c.lineTo(w-H*.6,H);c.lineTo(0,H);c.closePath();c.clip();
  bg(c,W,H,perf?'#ffe27a':'#ff6a55',perf?'#e07800':'#9c0a0a');rays(c,cx,H*.62,24,t*.5,Math.hypot(W,H),perf?'#fff':'#ffcb05',.22);
  c.save();c.globalAlpha*=.1;c.fillStyle='#fff';for(let i=-10;i<30;i++){const x=i*U*12+(t*U*30)%(U*24);c.beginPath();c.moveTo(x,0);c.lineTo(x+U*6,0);c.lineTo(x+U*6-H*.6,H);c.lineTo(x-H*.6,H);c.fill()}c.restore();
  c.restore();
  const[qx,qy]=quake(t,[[.72,.35,2.2],...(p.ball?[[2.75,.25,1]]:[])],U);c.translate(qx,qy);
  const da=sg(t,.2,.3)*(1-sg(t,.75,1));if(da>0){c.save();c.globalAlpha*=da;c.fillStyle='#fff';for(let i=0;i<26;i++){const y=H*(.35+rnd(i)*.5),x=W*(1-((t*3+rnd(i+9))%1)*1.6);c.fillRect(x,y,W*(.2+rnd(i+3)*.3),U*(.4+rnd(i+5)*.8))}c.restore()}
  const S=U*42,land=sg(t,.7,.92),px=lerp(W+S,cx,eo(sg(t,.25,.7))),py=H*.62-Math.abs(Math.sin(Math.max(0,t-.95)*5))*U*3*(t>.95?1:0);
  glow(c,cx,H*.62,S*.85,'rgba(255,255,255,.95)',sg(t,.6,.9)*.8);
  if(t>.25)mon(c,p.im,px,py,S,{sx:1+.12*Math.sin(land*Math.PI),sy:1-.16*Math.sin(land*Math.PI)});
  if(t>.7){const sl=eo(sg(t,.7,.9));c.save();c.globalAlpha*=sg(t,.7,.76);tx(c,perf?'PERFECT!!':'MISSION CLEAR!',cx,H*.16,U*13,{sc:1+1.8*(1-sl),grad:perf?['#ffffff','#ffcb05']:['#fff6b0','#ffb000'],max:W*.92,lw:.2});c.restore()}
  if(t>1)tx(c,(perf?'완벽해요!':'미션 성공!')+(p.next?' 다음 단계가 열렸어요':''),cx,H*.265,U*5.6,{fill:'#fff',max:W*.92,drop:0,sc:eo(sg(t,1,1.2))});
  for(let i=0;i<3;i++){const sx=cx+(i-1)*U*16,sy=H*.37,on=i<p.s,a0=1.15+i*.28,f=eo(sg(t,a0,a0+.3));
   if(t>1.05)star(c,sx,sy,U*6.2,0,'rgba(29,43,83,.35)','rgba(255,255,255,.6)',U*.7);
   if(on&&f>0){const ox=cx+(i-1)*W*.7,x=lerp(ox,sx,f),y=lerp(-U*20,sy,f),s=1+.5*Math.sin(sg(t,a0+.3,a0+.5)*Math.PI);star(c,x,y,U*6.6*s,(1-f)*6,'#ffcb05',INK,U*1);
    const bp=sg(t,a0+.3,a0+.7);if(bp>0&&bp<1)for(let j=0;j<6;j++){const a=j*TAU/6;twinkle(c,sx+Math.cos(a)*U*10*eo(bp),sy+Math.sin(a)*U*10*eo(bp),U*2*(1-bp),1)}}}
  if(p.ball&&t>2.3){const r=U*7.5,bx=cx+U*30,by=lerp(-r*2,H*.72,bo(sg(t,2.3,2.85))),wob=t>2.85?Math.sin((t-2.85)*14)*.3*Math.exp(-(t-2.85)*3):0;glow(c,bx,H*.72,r*2.4,'rgba(255,255,255,.9)',sg(t,2.8,3)*.8);pball(c,bx,by,r,p.ball,wob,0,sg(t,2.85,3.1));
   if(t>2.85)tx(c,`${p.ballName||'몬스터볼'} GET!`,cx,H*.9,U*8,{sc:1+1.2*(1-eo(sg(t,2.85,3.05))),fill:'#fff',max:W*.9})}
  c.restore()},
 cues(p){const q=[[0,'swish'],[.3,'dash'],[.72,'slam'],[.75,'clear']];for(let i=0;i<p.s;i++)q.push([1.45+i*.28,'star',i]);if(p.ball)q.push([2.82,'thud'],[2.9,'get']);return q}},
// 새 장이 열림: 해 뜨는 언덕 → 자물쇠 흔들림·부서짐 → 문 열림 → 파트너 등장 → 장 이름
chapter:{dur:()=>6.2,
 draw(c,t,W,H,p){const U=Math.min(W,H)/100,cx=W/2,hz=H*.72;c.save();c.globalAlpha=eo(sg(t,0,.4))*(1-sg(t,5.8,6.2));
  const g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#2b1b5a');g.addColorStop(.55,'#ff7a59');g.addColorStop(1,'#ffd27a');c.fillStyle=g;c.fillRect(0,0,W,H);
  const sy=lerp(H*.82,H*.58,eo(sg(t,0,4.5)));glow(c,cx,sy,U*60,'rgba(255,240,180,1)',.8);c.fillStyle='#fff2b8';c.beginPath();c.arc(cx,sy,U*12,0,TAU);c.fill();
  rays(c,cx,sy,30,t*.15,Math.hypot(W,H),'#fff',.12);
  for(const[k,col,h]of[[0,'#6b3f8f',.06],[1,'#3b2a6b',.035]]){c.fillStyle=col;c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=W/40)c.lineTo(x,hz-H*h*(1+Math.sin(x/W*7+k*2))+k*H*.03);c.lineTo(W,H);c.fill()}
  c.fillStyle='#2a1d4f';c.fillRect(0,hz+H*.03,W,H);
  const[qx,qy]=quake(t,[[1.95,.35,2.2],[3.4,.3,1.6]],U);c.translate(qx,qy);
  const gw=U*46,gh=U*54,gb=H*.8,gy=gb-gh,op=eio(sg(t,2.05,2.9));
  glow(c,cx,gy+gh*.5,gw*(.6+op),'rgba(255,255,230,1)',op);
  c.fillStyle='#fffbe0';c.fillRect(cx-gw/2,gy,gw,gh);
  c.lineWidth=U*1.2;c.strokeStyle=INK;c.lineJoin='round';
  for(const s of[-1,1]){const dw=gw/2*(1-op*.85);c.save();c.beginPath();const x0=cx+s*gw/2,x1=x0-s*dw;c.rect(Math.min(x0,x1),gy,dw,gh);c.fillStyle=s<0?'#d64545':'#c23434';c.fill();c.stroke();
   c.fillStyle='#ffcb05';c.fillRect(Math.min(x0,x1)+dw*.15,gy+gh*.12,dw*.7,U*1.4);c.fillRect(Math.min(x0,x1)+dw*.15,gy+gh*.82,dw*.7,U*1.4);c.restore()}
  c.fillStyle='#8a5a3c';c.strokeStyle=INK;c.beginPath();c.rect(cx-gw/2-U*5,gy-U*6,gw+U*10,U*7);c.fill();c.stroke();c.fillRect(cx-gw/2-U*5,gy,U*5,gh);c.strokeRect(cx-gw/2-U*5,gy,U*5,gh);c.fillRect(cx+gw/2,gy,U*5,gh);c.strokeRect(cx+gw/2,gy,U*5,gh);
  const ly=gy+gh*.45;if(t<1.95){let a=0;for(const s of[.6,1.1,1.6]){const ph=sg(t,s,s+.35);if(ph>0&&ph<1)a+=Math.sin(ph*TAU*2)*.35*(1-ph)}lock(c,cx,ly,U,a,0)}
  else{const d=t-1.95;if(d<1.4){c.save();c.globalAlpha*=1-sg(d,.8,1.4);lockShackle(c,cx+d*U*30,ly-U*6-d*U*40+d*d*U*40,U,d*6);lockBody(c,cx-d*U*10,ly+d*d*U*90,U,-d*4);c.restore()}
   for(let i=0;i<10;i++){const a=rnd(i+60)*TAU,r=U*25*eo(sg(d,0,.6));twinkle(c,cx+Math.cos(a)*r,ly+Math.sin(a)*r,U*2.5*(1-sg(d,.3,.8)),1)}}
  if(t>2.6){const f=sg(t,2.6,3.4),S=U*36*lerp(.25,1,eo(f)),y=lerp(gy+gh*.55,H*.66,eo(f))-Math.sin(f*Math.PI)*U*12-(t>3.4?Math.abs(Math.sin((t-3.4)*5))*U*2:0);mon(c,p.im,cx,y,S,{glow:'rgba(255,255,255,.8)'})}
  if(t>3.1)tx(c,'NEW CHAPTER',cx,H*.1,U*5.5,{fill:'#fff',drop:0,sc:eo(sg(t,3.1,3.3))});
  if(t>3.4)tx(c,p.name||'',cx,H*.2,U*11,{sc:1+1.6*(1-eo(sg(t,3.4,3.6))),grad:['#fff6b0','#ffb000'],max:W*.92});
  if(t>3.9){c.save();c.globalAlpha*=sg(t,3.9,4.2);tx(c,p.sub||'새로운 모험이 열렸어요!',cx,H*.92,U*6,{fill:'#fff',max:W*.9});c.restore()}
  confetti(c,cx,H*.2,t,3.4,U,90,3);c.restore();flash(c,W,H,(sg(t,1.93,1.96)-sg(t,2,2.4))*.8)},
 cues:()=>[[.2,'pad'],[.6,'click'],[1.1,'click'],[1.6,'click'],[1.95,'break'],[2.05,'gate'],[2.7,'dash'],[3.4,'slam'],[3.45,'clear']]},
// 새 세대: 밤하늘 아래 그림자 행렬 → 세대 이름
gen:{dur:()=>5.6,
 draw(c,t,W,H,p){const U=Math.min(W,H)/100,cx=W/2,ims=p.ims||[];c.save();c.globalAlpha=eo(sg(t,0,.35))*(1-sg(t,5.25,5.6));
  bg(c,W,H,'#2d3f7a','#070b22');for(let i=0;i<90;i++)twinkle(c,rnd(i)*W,rnd(i+300)*H*.8,U*(.5+rnd(i+600)*1.1)*(.6+.4*Math.sin(t*3+i)),.9);
  glow(c,cx,H*.9,W*.7,'rgba(108,199,255,.6)',.6);
  const[qx,qy]=quake(t,[[2.9,.35,2]],U);c.translate(qx,qy);
  ims.forEach((im,i)=>{const a=.15+i*.32,f=sg(t,a,a+2.1);if(f<=0||f>=1)return;const s=U*(30+rnd(i+5)*12),x=lerp(W+s,-s,f),y=H*(.62+(i%2)*.1)-Math.abs(Math.sin(f*14+i))*U*4;mon(c,im,x,y,s,{sil:1,rim:'#9fdcff'})});
  if(t>2.9){rays(c,cx,H*.3,24,t*.6,Math.hypot(W,H),'#ffcb05',.16*sg(t,2.9,3.2));tx(c,`${p.g}세대`,cx,H*.3,U*22,{sc:1+1.6*(1-eo(sg(t,2.9,3.1))),grad:['#fff6b0','#ffb000'],max:W*.9,lw:.16})}
  if(t>3.3){c.save();c.globalAlpha*=sg(t,3.3,3.6);tx(c,'새로운 포켓몬이 나타났다!',cx,H*.46,U*6.5,{fill:'#fff',max:W*.92});c.restore()}
  ims.forEach((im,i)=>{const a=3.7+i*.1,f=sg(t,a,a+.3);if(f<=0)return;const n=ims.length,s=U*15*bk(f),x=cx+(i-(n-1)/2)*U*17,y=H*.72;mon(c,im,x,y,s,{sil:1,rim:'#9fdcff'});if(f>=1)tx(c,'?',x+s*.3,y-s*.35,U*5,{fill:'#ffcb05',drop:0})});
  confetti(c,cx,H*.3,t,2.9,U,70,11);c.restore();flash(c,W,H,(sg(t,2.86,2.9)-sg(t,2.95,3.3))*.7)},
 cues(p){const q=[[.1,'pad'],[2.9,'slam'],[2.95,'clear']];for(let i=0;i<(p.ims||[]).length;i++)q.push([3.7+i*.1,'pop2']);return q}},
// 3연속 정답 컷인 (문제 푸는 화면 위로 지나감, 화면은 막지 않음)
combo:{dur:()=>1.5,light:1,
 draw(c,t,W,H,p){const U=Math.min(W,H)/100,cx=W/2,cy=H*.45,h=U*22,x=t<.3?-W*(1-eo(sg(t,0,.28))):W*eio(sg(t,1.15,1.5));
  c.save();c.translate(x,0);c.translate(cx,cy);c.rotate(-.1);c.translate(-cx,-cy);
  c.fillStyle=INK;c.fillRect(-W,cy-h/2-U*1.6,W*3,h+U*3.2);
  const g=c.createLinearGradient(0,cy-h/2,0,cy+h/2);g.addColorStop(0,'#ffe14d');g.addColorStop(1,'#f0a000');c.fillStyle=g;c.fillRect(-W,cy-h/2,W*3,h);
  c.fillStyle='#ee1515';c.fillRect(-W,cy-h/2,W*3,U*1.4);c.fillRect(-W,cy+h/2-U*1.4,W*3,U*1.4);
  c.save();c.globalAlpha*=.35;c.fillStyle='#fff';for(let i=0;i<18;i++){const ly=cy-h/2+h*rnd(i),lx=((rnd(i+7)-t*2.4)%1+1)%1*W*1.4-W*.2;c.fillRect(lx,ly,W*.18,U*.5)}c.restore();
  mon(c,p.im,cx-U*30,cy-U*2,U*30,{});
  tx(c,'COMBO',cx+U*12,cy-U*6,U*5,{fill:'#fff',drop:0});tx(c,`${p.n||3}연속 정답!`,cx+U*12,cy+U*4,U*9,{fill:'#ee1515',st:INK,max:W*.6});
  c.restore()},
 cues:()=>[[0,'arp']]}
};
function lockBody(c,x,y,U,a){c.save();c.translate(x,y);c.rotate(a);c.lineWidth=U*1.1;c.strokeStyle=INK;c.fillStyle='#ffcb05';c.beginPath();c.roundRect(-U*7,-U*5,U*14,U*11,U*2);c.fill();c.stroke();c.fillStyle=INK;c.beginPath();c.arc(0,-U*.5,U*1.6,0,TAU);c.fill();c.fillRect(-U*.7,0,U*1.4,U*3);c.restore()}
function lockShackle(c,x,y,U,a){c.save();c.translate(x,y);c.rotate(a);c.lineWidth=U*2.2;c.strokeStyle=INK;c.beginPath();c.arc(0,0,U*4.5,Math.PI,TAU);c.stroke();c.lineWidth=U*1.2;c.strokeStyle='#c9d3e3';c.beginPath();c.arc(0,0,U*4.5,Math.PI,TAU);c.stroke();c.restore()}
function lock(c,x,y,U,a){c.save();c.translate(x,y);c.rotate(a);lockShackle(c,0,-U*5,U,0);lockBody(c,0,0,U,0);c.restore()}

// ---- 소리 (Web Audio로 그때그때 합성)
function SND(ac,out){
 const tn=(f,t,d,type='square',v=.06,f2)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(out);o.start(t);o.stop(t+d+.05)};
 let NB=null;const nz=(t,d,v=.2,f0=800,f1,type='lowpass')=>{if(!NB){NB=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const a=NB.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
  const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();s.buffer=NB;s.loop=true;fl.type=type;fl.frequency.setValueAtTime(f0,t);if(f1)fl.frequency.exponentialRampToValueAtTime(f1,t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+Math.min(.05,d/3));g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl).connect(g).connect(out);s.start(t);s.stop(t+d+.05)};
 const seq=(t,ns,type='square',v=.05)=>ns.forEach(([dt,f,d=.18])=>tn(f,t+dt,d,type,v));
 return{
  thud:t=>{tn(150,t,.25,'sine',.35,45);nz(t,.15,.15,600)},
  click:t=>{tn(1400,t,.04,'square',.05);tn(700,t+.06,.05,'square',.04);nz(t,.06,.08,3000)},
  heart:t=>{tn(80,t,.14,'sine',.3,45);tn(80,t+.2,.12,'sine',.22,45)},
  ding:t=>{tn(1319,t,.5,'triangle',.1);tn(1760,t+.09,.6,'triangle',.08)},
  whoosh:t=>nz(t,.45,.3,300,5000,'bandpass'),swish:t=>nz(t,.3,.18,900,4000,'bandpass'),
  flash:t=>{nz(t,.7,.3,7000,400);tn(2093,t,.6,'sine',.05,1047)},
  pop:t=>{tn(500,t,.12,'square',.08,1500);nz(t,.1,.12,5000)},pop2:t=>tn(700,t,.08,'square',.05,1400),
  rumble:(t,d)=>{nz(t,d,.4,150,90);tn(42,t,d,'sawtooth',.07,38)},
  thunder:t=>{nz(t,1.2,.55,4000,150);tn(60,t,.8,'sawtooth',.08,30)},
  slam:t=>{tn(110,t,.35,'square',.12,50);nz(t,.3,.3,2000,200)},
  stamp:t=>{tn(220,t,.12,'square',.1,110);nz(t,.08,.2,3000)},
  dash:t=>nz(t,.5,.22,500,3000,'bandpass'),
  break:t=>{nz(t,.4,.45,4000,600);tn(1600,t,.15,'square',.05,300);tn(900,t+.05,.2,'triangle',.06,200)},
  gate:t=>{nz(t,1,.16,200,1500,'bandpass');tn(65,t,1,'sawtooth',.04,98)},
  pad:t=>[262,330,392].forEach(f=>tn(f,t,2.4,'triangle',.035)),
  arp:t=>seq(t,[[0,784,.1],[.05,988,.1],[.1,1175,.1],[.15,1568,.25]],'square',.045),
  star:(t,i)=>{tn([1047,1319,1568][i]||1568,t,.3,'square',.05);tn(([1047,1319,1568][i]||1568)*2,t+.04,.25,'triangle',.04)},
  clear:t=>{seq(t,[[0,659,.12],[.11,784,.12],[.22,988,.12],[.33,1319,.55]],'square',.06);seq(t,[[0,165,.3],[.33,330,.55]],'triangle',.12)},
  get:t=>{seq(t,[[0,523,.1],[.1,659,.1],[.2,784,.1],[.3,1047,.4]],'square',.05);seq(t,[[.3,262,.4]],'triangle',.1)},
  fanfare:t=>{seq(t,[[0,784,.1],[.12,784,.1],[.24,784,.1],[.36,1047,.2],[.56,988,.12],[.68,1047,.5]],'square',.055);seq(t,[[0,196,.3],[.36,262,.3],[.68,392,.5]],'triangle',.12)},
  legend:t=>{[[0,[262,330,392]],[.45,[349,440,523]],[.9,[392,494,587]],[1.35,[523,659,784,1047]]].forEach(([dt,ch])=>ch.forEach(f=>{tn(f,t+dt,dt>1?1.4:.5,'sawtooth',.025);tn(f*2,t+dt,dt>1?1.2:.45,'triangle',.02)}));tn(65,t,2.6,'triangle',.15)}}}

// 한글 웹폰트는 글자 묶음별로 내려받으므로, 장면에 쓰는 글자를 먼저 받아 둔다
const TEXT='두근두근…누구일까?전설의 기운이…!환상의 포켓몬NEW!MISSION CLEAR!PERFECT!!완벽해요미션 성공다음 단계가 열렸어요몬스터볼슈퍼볼하이퍼볼 GET!새로운 모험이 열렸어요NEW CHAPTER세대 포켓몬이 나타났다COMBO연속 정답0123456789장학년기 수감각마을';
const fontsFor=p=>{try{return document.fonts.load(`40px ${FONT}`,TEXT+[p.name,p.kindName,p.ballName,p.sub].join(''))}catch(_){return Promise.resolve()}};
// ---- 재생기 (게임용)
let CUR=null;
async function play(name,p={},o={}){await Promise.race([fontsFor(p),new Promise(r=>setTimeout(r,700))]);return play1(name,p,o)}
function play1(name,p,o){return new Promise(res=>{const F=FILMS[name];if(!F)return res();if(CUR&&!F.light)CUR.stop();
 const dur=F.dur(p),cv=document.createElement('canvas'),c=cv.getContext('2d');let W=0,H=0;
 cv.style.cssText=`position:fixed;inset:0;width:100%;height:100%;z-index:${F.light?70:80};pointer-events:${F.light?'none':'auto'};touch-action:none`;
 const fit=()=>{const d=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=Math.round(W*d);cv.height=Math.round(H*d);c.setTransform(d,0,0,d,0,0)};fit();
 document.body.appendChild(cv);let skip=null;
 if(!F.light){skip=document.createElement('button');skip.textContent='건너뛰기 ▶▶';skip.style.cssText='position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));z-index:81;font:18px '+FONT+';color:#fff;background:rgba(0,0,0,.45);border:2px solid rgba(255,255,255,.7);border-radius:999px;padding:8px 16px;cursor:pointer';document.body.appendChild(skip)}
 let ac=null,out=null;try{ac=o.ac?o.ac():null;if(ac){out=ac.createGain();out.gain.value=.9;out.connect(ac.destination);const s=SND(ac,out),t0=ac.currentTime+.04;for(const[t,k,a]of F.cues(p))if(s[k])s[k](t0+t,a)}}catch(_){}
 const t0=performance.now();let raf=0,done=false;
 const stop=()=>{if(done)return;done=true;cancelAnimationFrame(raf);removeEventListener('resize',fit);removeEventListener('keydown',key);cv.remove();if(skip)skip.remove();
  if(out){try{out.gain.setTargetAtTime(.0001,ac.currentTime,.03);setTimeout(()=>out.disconnect(),300)}catch(_){}}if(CUR===me)CUR=null;res()};
 const key=e=>{if(!F.light&&['Escape','Enter',' '].includes(e.key)){e.preventDefault();stop()}};
 const me={stop};if(!F.light)CUR=me;if(skip)skip.onclick=stop;addEventListener('resize',fit);addEventListener('keydown',key);
 const tick=()=>{const t=(performance.now()-t0)/1000;if(t>=dur)return stop();c.clearRect(0,0,W,H);F.draw(c,t,W,H,p);raf=requestAnimationFrame(tick)};tick()})}
window.CINE={play,FILMS,fontsFor,draw:(name,c,t,W,H,p)=>FILMS[name].draw(c,t,W,H,p),dur:(name,p)=>FILMS[name].dur(p)};
})();
