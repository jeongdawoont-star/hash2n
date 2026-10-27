/* Vercel 서버 함수: https://hash2n.vercel.app/api/fc
   환경 변수 (Vercel > Settings > Environment Variables)
   - FIREBASE_SERVICE_ACCOUNT : Firebase 서비스 계정 키 JSON 전체 (또는 base64)
   - FC_CODES (선택)          : 허용할 학급 코드, 쉼표로 구분 (예: firstclass-lounge) */
import { readFileSync } from 'node:fs';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { makeCore } from './_fc-core.js';

let core = null, initErr = null;
function init() {
  if (core || initErr) return;
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) { initErr = 'not-configured'; return; }
    const sa = JSON.parse(raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8'));
    const app = getApps()[0] || initializeApp({ credential: cert(sa) });
    const db = getFirestore(app); db.settings({ ignoreUndefinedProperties: true });
    const holder = {}; new Function('globalThis', readFileSync(new URL('../vibe-apps/fc-econ.js', import.meta.url), 'utf8'))(holder);
    const codes = (process.env.FC_CODES || '').split(',').map(s => s.trim()).filter(Boolean);
    core = makeCore({ db, auth: getAuth(app), X: holder.FCEcon, codes: codes.length ? codes : null });
  } catch (e) { console.error(e); initErr = 'init-failed'; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 퍼스트클래스를 PC 파일로 열어도 부를 수 있게 (비밀번호·토큰으로 막음)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST only' });
  init();
  let body = req.body; if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  if (!core) return res.status(body?.a === 'ping' ? 200 : 503).json({ ok: body?.a === 'ping', secure: false, error: initErr });
  try { return res.status(200).json(await core.handle(body || {}, req.headers.authorization || '')); }
  catch (e) { if (e.status) return res.status(e.status).json({ ok: false, error: e.message }); console.error(e); return res.status(500).json({ ok: false, error: '서버 오류' }); }
}
