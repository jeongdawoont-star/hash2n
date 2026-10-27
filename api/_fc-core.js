/* 퍼스트클래스 라운지 서버 핵심 (테스트에서 가짜 db/auth를 넣어 쓸 수 있게 분리)
   - 로그인: 비밀번호 확인 → Firebase 로그인 토큰 발급 (학생 uid = 학급코드__학생id, 선생님 = 학급코드__T)
   - 돈: fc-econ.js 를 Firestore 트랜잭션 안에서 실행 (학생 브라우저는 지갑·장부를 직접 못 씀) */
import crypto from 'node:crypto';

const sha = s => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
/** 라운지·퍼스트클래스와 같은 학생 비밀번호 해시 */
export const pinHash = (sid, pin) => sha('fc-lounge:' + sid + ':' + pin);
const CODE_RE = /^[A-Za-z0-9_-]{1,60}$/;
const SID_RE = /^[A-Za-z0-9_-]{1,40}$/;

class HttpError extends Error { constructor(status, msg) { super(msg); this.status = status; } }
const bad = (m, s = 400) => { throw new HttpError(s, m); };

export function makeCore({ db, auth, X, codes = null, now = () => Date.now() }) {
  const D = (code, p) => db.doc(`fc/${code}/${p}`);
  const C = (code, n) => db.collection(`fc/${code}/${n}`);
  const getData = async ref => { const s = await ref.get(); return s.exists ? s.data() : null; };

  /* 비밀번호 대입 막기: 5번 틀리면 잠깐 잠금 (학생 5분, 선생님 10분) */
  async function limited(code, key, lockMs, fn) {
    const ref = D(code, 'priv/rl'), rl = (await getData(ref)) || {}, r = rl[key] || { n: 0, until: 0 };
    if (r.until > now()) bad(`비밀번호를 여러 번 틀려서 잠겼어요. ${Math.ceil((r.until - now()) / 60000)}분 뒤에 다시 해요`, 429);
    const ok = await fn();
    if (ok) { if (r.n) await ref.set({ [key]: { n: 0, until: 0 } }, { merge: true }); return true; }
    const n = r.n + 1; await ref.set({ [key]: n >= 5 ? { n: 0, until: now() + lockMs } : { n, until: 0 } }, { merge: true });
    return false;
  }
  const token = (code, uid, claims) => auth.createCustomToken(`${code}__${uid}`, { cls: code, ...claims });
  async function who(code, idToken) {
    if (!idToken) bad('로그인이 필요해요', 401);
    let d; try { d = await auth.verifyIdToken(idToken); } catch (e) { bad('로그인이 만료됐어요. 다시 들어와 주세요', 401); }
    if (d.cls !== code) bad('다른 학급의 로그인이에요', 403);
    return d.role === 't' ? { role: 't' } : d.role === 's' && d.sid ? { role: 's', sid: d.sid } : bad('권한이 없어요', 403);
  }

  async function checkTeacher(code, pin) {
    const p = await getData(D(code, 'priv/teacher'));
    if (p?.h) return sha(p.salt + ':' + pin) === p.h;
    const legacy = await getData(D(code, 'app/secret')); // 보안 전환 전: 예전 PIN(없으면 1234)으로 처음 한 번
    return pin === String(legacy?.tpin || '1234');
  }
  async function setTeacherPin(code, pin) {
    const salt = crypto.randomBytes(12).toString('hex');
    await D(code, 'priv/teacher').set({ salt, h: sha(salt + ':' + pin), at: now() });
    const sec = D(code, 'app/secret'); const s = await getData(sec); if (s && 'tpin' in s) await sec.set({ tpin: null }, { merge: true });
  }

  /** 트랜잭션 안에서 fc-econ 실행 */
  function runEcon(code, w, name, args) {
    return db.runTransaction(async t => {
      const exists = new Set();
      const tx = {
        now: now(),
        async get(p) { const s = await t.get(D(code, p)); if (s.exists) { exists.add(p); return s.data(); } return null; },
        async col(n) { const q = await t.get(C(code, n)); return q.docs.map(d => { exists.add(n + '/' + d.id); return { id: d.id, ...d.data() }; }); },
      };
      const r = await X.run(tx, w, name, args);
      for (const o of r.ops) {
        const ref = D(code, o.path);
        if (o.op === 'put') t.set(ref, o.d);
        else if (exists.has(o.path)) t.update(ref, o.f);
        else t.set(ref, X.expand(o.f), { merge: true });
      }
      return { msg: r.msg, n: r.ops.length };
    });
  }

  async function handle(body = {}, authz = '') {
    const a = body.a;
    if (a === 'ping') return { ok: true, secure: true, v: 1 };
    const code = String(body.code || '');
    if (!CODE_RE.test(code)) bad('학급 코드가 이상해요');
    if (codes && !codes.includes(code)) bad('등록되지 않은 학급이에요', 403);
    const idToken = (authz.match(/^Bearer (.+)$/) || [])[1];

    if (a === 'slogin') {
      const sid = String(body.sid || ''), pin = String(body.pin || '');
      if (!SID_RE.test(sid) || !/^\d{4,8}$/.test(pin)) bad('비밀번호를 확인해요');
      const ok = await limited(code, 's_' + sid, 5 * 60000, async () => {
        const pins = await getData(D(code, 'pins/main'));
        let h = pins?.h?.[sid];
        if (!h) h = (await getData(D(code, 'app/main')))?.pinH?.[sid]; // 보안 전환 전 자료
        return !!h && h === pinHash(sid, pin);
      });
      if (!ok) bad('비밀번호가 달라요', 401);
      return { ok: true, token: await token(code, sid, { role: 's', sid }) };
    }
    if (a === 'tlogin') {
      const pin = String(body.pin || ''); if (!/^\d{4,12}$/.test(pin)) bad('PIN을 확인해요');
      const ok = await limited(code, 't', 10 * 60000, () => checkTeacher(code, pin));
      if (!ok) bad('PIN이 달라요', 401);
      const fresh = !(await getData(D(code, 'priv/teacher')))?.h;
      if (fresh) await setTeacherPin(code, pin); // 처음 로그인하면 지금 PIN을 서버 전용 칸으로 옮김
      return { ok: true, token: await token(code, 'T', { role: 't' }), weak: pin.length < 6 || pin === '1234' };
    }

    const w = await who(code, idToken);
    if (a === 'handoff') { if (w.role !== 't') bad('선생님만', 403); return { ok: true, token: await token(code, 'T', { role: 't' }) }; }
    if (a === 'tpin') {
      if (w.role !== 't') bad('선생님만', 403); const pin = String(body.pin || '');
      if (!/^\d{6,12}$/.test(pin)) bad('교사 PIN은 숫자 6~12자리로 정해요'); await setTeacherPin(code, pin); return { ok: true };
    }
    if (a === 'run') {
      try { const r = await runEcon(code, w, String(body.name || ''), body.args || {}); return { ok: true, ...r }; }
      catch (e) { if (e.econ) bad(e.message, 409); throw e; }
    }
    bad('알 수 없는 요청');
  }
  return { handle, runEcon, HttpError };
}
