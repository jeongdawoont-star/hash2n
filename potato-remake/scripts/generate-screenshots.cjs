'use strict';
// ============================================================
// generate-screenshots.js
// Generates 7 × 3 devices × 2 languages = 42 screenshots
// for Google Play Store submission
// ============================================================

const puppeteer = require('puppeteer-core');
const http      = require('http');
const fs        = require('fs');
const path      = require('path');
const urlMod    = require('url');

// ── Config ───────────────────────────────────────────────────
const CHROME_PATH  = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const DIST_DIR     = path.resolve(__dirname, '..', 'dist');
const OUTPUT_BASE  = path.resolve(__dirname, '..', 'release', 'screenshots');
const PORT         = 13579;
const BASE_URL     = `http://localhost:${PORT}`;

const DEVICES = [
  { name: 'phone',       width: 1920, height: 1080 },
  { name: 'tablet_7in',  width: 1280, height:  800 },
  { name: 'tablet_10in', width: 1920, height: 1200 },
];

const LANGUAGES = ['ko', 'en'];

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.png': 'image/png',  '.jpg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.webm': 'video/webm', '.mp4': 'video/mp4',
  '.ttf': 'font/ttf',   '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.json': 'application/json', '.wav': 'audio/wav', '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon', '.webp': 'image/webp',
};

// ── Game-state builders ───────────────────────────────────────
const NOW = Date.now();

function makeBase(overrides = {}) {
  return {
    day: 1, bonus: 0,
    stats: { gram: 181, large: 179, shape: 83, nutri: 85, regist: 55, hard: 61 },
    initialStats: { gram: 181, large: 179, shape: 83, nutri: 85, regist: 55, hard: 61 },
    plan: { morning: null, afternoon: null, evening: null },
    planCursor: 0, resolvingDay: false,
    touchCombo: 0, touchComboUpdatedAt: NOW,
    weekIndex: 1, weekFocusStat: 'gram',
    seedSlot: { results: ['gram','large','nutri','gram','large'], jackpot: false, rerolls: 0, rolled: false },
    touchMood: 'idle', dragPower: 0, actionPlayback: null,
    currentMessage: '돌아온 감자 키우기', messageLockedUntil: 0,
    eventLog: [], activeEvent: null, eventSeen: {}, lastEventTurn: 0,
    harvestFocus: null, currentEnding: null,
    unlockedEndingIds: [], endingSeenCount: {}, lastEndingId: null,
    screen: 'title', collectionReturnScreen: 'title',
    runCount: 0, careCount: 0,
    potatoName: '귀여운 감자', unlockedSlotsCount: 3,
    toys: { worm: false, sweet: false, landdog: false, doraji: false },
    recordSaved: false, combo100Duration: 0, combo100MaxDuration: 0, combo100ReachedAt: null,
    ...overrides,
  };
}

// Screen 2 – Slot machine (씨감자 재능 슬롯)
function slotState(lang) {
  return makeBase({
    screen: 'intro',
    seedSlot: { results: ['gram','large','nutri','gram','regist'], jackpot: false, rerolls: 1, rolled: true },
    potatoName: lang === 'ko' ? '반짝이 감자' : 'Sparkling Spud',
    runCount: 2, bonus: 2,
    unlockedEndingIds: ['E01','E05'],
    endingSeenCount: { E01: 2, E05: 1 },
  });
}

// Screen 3 – In-game mid-growth (day 35, week 5)
function ingameState(lang) {
  return makeBase({
    day: 35, bonus: 3,
    stats:        { gram: 420, large: 368, shape: 245, nutri: 312, regist: 198, hard: 237 },
    initialStats: { gram: 181, large: 179, shape:  83, nutri:  85, regist:  55, hard:  61 },
    plan: { morning: 'feed', afternoon: 'water', evening: 'photo' },
    planCursor: 0, weekIndex: 5, weekFocusStat: 'gram',
    seedSlot: { results: ['gram','large','nutri','gram','regist'], jackpot: false, rerolls: 0, rolled: true },
    touchCombo: 12, touchComboUpdatedAt: NOW,
    currentMessage: lang === 'ko'
      ? '점심 운동: 으라차차 움직이며 강한 감자 근성을 다집니다.'
      : 'Afternoon: With determined movement, it builds potato grit.',
    eventSeen: { worm: 1, sweet: 1 }, lastEventTurn: 20,
    unlockedEndingIds: ['E01','E05','E09'],
    endingSeenCount: { E01: 2, E05: 1, E09: 1 }, lastEndingId: 'E01',
    screen: 'game', runCount: 3, careCount: 22,
    potatoName: lang === 'ko' ? '귀여운 감자' : 'Cute Potato',
  });
}

// Screen 4 – Event overlay
function eventState(lang) {
  return {
    ...ingameState(lang),
    activeEvent: {
      id: 'worm',
      title:   lang === 'ko' ? '흙 속의 지렁이'   : 'Earthworm in the Soil',
      speaker: lang === 'ko' ? '지렁이'            : 'Earthworm',
      message: lang === 'ko'
        ? '"앗 비켜, 내 밭이라구!" 지렁이가 꿈틀대며 화를 냅니다! 흙 속 지름길을 두고 감자에게 비키라고 씩씩거리며 꼬리를 흔드네요.'
        : '"Hey, move it! This is my field!" The earthworm wiggles angrily, waving its tail and demanding the potato clear its underground shortcut.',
      image: '/assets/original/worm1.png',
      choices: [
        {
          id: 'worm_deal',
          label: lang === 'ko' ? '지렁이를 상대한다 (무게 350g 이상 필요)' : 'Face the earthworm (Weight 350g+ needed)',
          result: '', effects: {}, tone: 'good',
        },
        {
          id: 'worm_ignore',
          label: lang === 'ko' ? '지렁이를 무시한다' : 'Ignore the earthworm',
          result: lang === 'ko'
            ? '"바쁘니까 비켜줄게... 칫." 감자가 지렁이의 억지를 묵묵히 받아들이고 멀리 돌아갑니다.'
            : '"Fine, I\'ll move... hmph." The potato quietly accepts the demands and takes the long way around.',
          effects: {}, tone: 'bad',
        },
      ],
    },
  };
}

// Screen 5a – Ending screen  (E01=해시브라운, imageIndex 1 matches the image file)
function endingState(lang) {
  return {
    ...ingameState(lang),
    screen: 'ending',
    collectionReturnScreen: 'ending',
    runCount: 4,
    currentEnding: {
      endingId: 'E01',
      imageIndex: 1,
      title: lang === 'ko' ? '해시브라운' : 'Hash Brown',
      hint:  lang === 'ko' ? '바삭하고 고소한 아침의 단짝' : 'Crispy and Savory Morning Sidekick',
      tier: 3,
      statKeys: ['large', 'shape', 'nutri', 'regist'],
      score: 2180,
      isNew: true,
      story: lang === 'ko'
        ? '당신이 정성껏 키운 감자는\n잘 자라서 해시브라운이 되었습니다.\n바삭하고 고소한 해시브라운!\n케첩파인가요, 머스터드파인가요?'
        : 'The potato you grew with love\nbecame a crispy Hash Brown!\nCrunchy on the outside, soft inside.\nTeam ketchup or team mustard?',
    },
    unlockedEndingIds: ['E01', 'E02', 'E05'],
    endingSeenCount: { E01: 3, E02: 1, E05: 1 },
  };
}

// Screen 5b – Ending collection (테이블/도감)
function collectionState(lang) {
  return {
    ...ingameState(lang),
    screen: 'collection', collectionReturnScreen: 'title',
    unlockedEndingIds: ['E01','E02','E05','E07','E09','E12','E15','E18','E20','E25','E27'],
    endingSeenCount:   { E01:3, E02:1, E05:2, E07:1, E09:2, E12:1, E15:1, E18:1, E20:1, E25:1, E27:2 },
    runCount: 11,
  };
}

// Base state for Hall of Fame + Achievement screens (title screen)
function richTitleState(lang) {
  return makeBase({
    day: 80, screen: 'title', weekIndex: 12, bonus: 13, runCount: 13, careCount: 30,
    seedSlot: { results: ['gram','large','nutri','gram','regist'], jackpot: false, rerolls: 0, rolled: true },
    plan: { morning: 'feed', afternoon: 'water', evening: 'photo' },
    unlockedEndingIds: ['E01','E02','E03','E04','E05','E06','E07','E08','E09','E10','E11','E12','E13'],
    endingSeenCount:   { E01:3,  E02:2, E03:1, E04:1, E05:2, E06:1, E07:1, E08:1, E09:2, E10:1, E11:1, E12:1, E13:1 },
    eventSeen: { worm:2, sweet:2, landdog:1, doraji:1, bugs:2, dung:1 },
    potatoName: lang === 'ko' ? '귀여운 감자' : 'Cute Potato',
  });
}

// Hall of Fame records
function getRecords(lang) {
  if (lang === 'ko') {
    return [
      { id:1, name:'왕왕포테이토',  endingTitle:'해시브라운',      stats:{ gram:1540, large:1490, shape:920,  nutri:1180, regist:780, hard:850 }, savedAt: NOW-7*86400000 },
      { id:2, name:'도트러버',      endingTitle:'매시드 포테이토', stats:{ gram:980,  large:920,  shape:640,  nutri:850,  regist:520, hard:610 }, savedAt: NOW-5*86400000 },
      { id:3, name:'포테토치',      endingTitle:'감자칩',          stats:{ gram:780,  large:710,  shape:480,  nutri:630,  regist:390, hard:470 }, savedAt: NOW-3*86400000 },
      { id:4, name:'식목일',        endingTitle:'감자조림',        stats:{ gram:520,  large:490,  shape:310,  nutri:420,  regist:250, hard:300 }, savedAt: NOW-2*86400000 },
      { id:5, name:'뽀끔감자',      endingTitle:'치즈웨지감자',    stats:{ gram:430,  large:400,  shape:250,  nutri:350,  regist:190, hard:230 }, savedAt: NOW-1*86400000 },
      { id:6, name:'돼냥이',        endingTitle:'돼지 사료',       stats:{ gram:210,  large:180,  shape:110,  nutri:160,  regist:95,  hard:120 }, savedAt: NOW-43200000  },
    ];
  }
  return [
    { id:1, name:'KingPotato',   endingTitle:'해시브라운',      stats:{ gram:1540, large:1490, shape:920,  nutri:1180, regist:780, hard:850 }, savedAt: NOW-7*86400000 },
    { id:2, name:'DotLover',     endingTitle:'매시드 포테이토', stats:{ gram:980,  large:920,  shape:640,  nutri:850,  regist:520, hard:610 }, savedAt: NOW-5*86400000 },
    { id:3, name:'PotatoTchi',   endingTitle:'감자칩',          stats:{ gram:780,  large:710,  shape:480,  nutri:630,  regist:390, hard:470 }, savedAt: NOW-3*86400000 },
    { id:4, name:'PlantDay',     endingTitle:'감자조림',        stats:{ gram:520,  large:490,  shape:310,  nutri:420,  regist:250, hard:300 }, savedAt: NOW-2*86400000 },
    { id:5, name:'PuffSpud',     endingTitle:'치즈웨지감자',    stats:{ gram:430,  large:400,  shape:250,  nutri:350,  regist:190, hard:230 }, savedAt: NOW-1*86400000 },
    { id:6, name:'PiggyTater',   endingTitle:'돼지 사료',       stats:{ gram:210,  large:180,  shape:110,  nutri:160,  regist:95,  hard:120 }, savedAt: NOW-43200000  },
  ];
}

// ── Helpers ───────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

// setStorage must run BEFORE React initializes (to beat the beforeunload auto-save).
// evaluateOnNewDocument injects code into the NEW document before page scripts run,
// which happens AFTER beforeunload (which fires on the old page during reload).
// Scripts accumulate per-page but run in insertion order; the last one wins for each key.
async function setStorage(page, gameState, records, lang) {
  await page.evaluateOnNewDocument(
    (state, recs, language) => {
      if (state) localStorage.setItem('potato-remake-classic-v2', JSON.stringify(state));
      else       localStorage.removeItem('potato-remake-classic-v2');
      if (recs)  localStorage.setItem('potato-remake-records-v1', JSON.stringify(recs));
      else       localStorage.removeItem('potato-remake-records-v1');
      localStorage.setItem('potato-lang',   language);
      localStorage.setItem('potato-muted',  'true');
      localStorage.setItem('potato-bgm-on', 'false');
    },
    gameState, records, lang
  );
}

async function waitForGame(page, expectedScreen = null) {
  // Step 1: Wait for React to mount <main>
  await page.waitForSelector('main', { timeout: 10000 });

  // Step 2: Wait for hotfix splash to disappear (~600ms after mount)
  await page.waitForFunction(
    () => !document.querySelector('.hotfix-splash-overlay'),
    { timeout: 12000, polling: 150 }
  );

  // Step 3: Wait for the expected screen class
  if (expectedScreen) {
    await page.waitForFunction(
      (sc) => document.querySelector(`main.screen-${sc}`) !== null,
      { timeout: 8000, polling: 100 },
      expectedScreen
    );
  }

  // Step 4: Brief pause for CSS transitions / font rendering
  await sleep(500);
}

// ── Static file server ────────────────────────────────────────
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let pathname = urlMod.parse(req.url).pathname;
      if (pathname === '/' || !path.extname(pathname)) pathname = '/index.html';
      const filePath = path.join(DIST_DIR, pathname);
      const ext = path.extname(filePath).toLowerCase();

      fs.readFile(filePath, (err, data) => {
        if (err) {
          fs.readFile(path.join(DIST_DIR, 'index.html'), (_e, html) => {
            if (html) { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(html); }
            else       { res.writeHead(404); res.end('Not found'); }
          });
        } else {
          res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
          res.end(data);
        }
      });
    });
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`Server: ${BASE_URL}`);
      resolve(server);
    });
  });
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  console.log('\n🥔 Potato Screenshot Generator\n');

  // 1. Delete old screenshots
  console.log('Clearing existing screenshots...');
  for (const lang of LANGUAGES) {
    const dir = path.join(OUTPUT_BASE, lang);
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith('.png')) {
          fs.unlinkSync(path.join(dir, f));
          console.log(`  Deleted: ${lang}/${f}`);
        }
      }
    }
    fs.mkdirSync(dir, { recursive: true });
  }

  // 2. Start server
  const server = await startServer();

  // 3. Launch browser
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security',
           '--disable-features=IsolateOrigins,site-per-process'],
    defaultViewport: null,
  });

  let errorCount = 0;

  try {
    for (const lang of LANGUAGES) {
      console.log(`\n══════ ${lang.toUpperCase()} ══════`);
      const records = getRecords(lang);

      for (const device of DEVICES) {
        console.log(`\n  ▸ ${device.name} (${device.width}×${device.height})`);

        const page = await browser.newPage();
        await page.setViewport({ width: device.width, height: device.height, deviceScaleFactor: 1 });

        // Intercept hotfix/analytics requests so they resolve instantly
        await page.setRequestInterception(true);
        page.on('request', req => {
          const u = req.url();
          if (u.includes('github.io') || u.includes('hotfix') || u.includes('analytics') || u.includes('firebase')) {
            req.respond({ status: 200, contentType: 'application/json', body: '{}' });
          } else {
            req.continue();
          }
        });

        // shot(num, name, state, recs, expectedScreen, extra)
        const shot = async (num, name, state, recs, expectedScreen, extra) => {
          process.stdout.write(`    [${num}] ${name}...`);
          try {
            await setStorage(page, state, recs ?? null, lang);
            await page.reload({ waitUntil: 'load', timeout: 15000 });
            await waitForGame(page, expectedScreen);
            if (extra) await extra();
            const outPath = path.join(OUTPUT_BASE, lang, `${device.name}_${num}_${name}.png`);
            await page.screenshot({ path: outPath, type: 'png' });
            console.log(' ✓');
          } catch (e) {
            console.log(` ✗  ${e.message}`);
            errorCount++;
          }
        };

        // Initial navigation to set origin for localStorage
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });

        // ── 7 screenshots ──────────────────────────────────
        await shot('1', 'title',   null,                null,    'title');
        await shot('2', 'slots',   slotState(lang),     null,    'intro');
        await shot('3', 'ingame',  ingameState(lang),   null,    'game');
        await shot('4', 'event',   eventState(lang),    null,    'game');
        await shot('5', 'ending',  endingState(lang),   null,    'ending');
        await shot('6', 'table',   collectionState(lang), null,  'collection');

        await shot('7', 'hall_of_fame',
          makeBase({ screen:'title', bonus:6, runCount:6,
            unlockedEndingIds:['E01','E02','E05','E07','E09','E12'],
            endingSeenCount:{ E01:3,E02:2,E05:2,E07:1,E09:2,E12:1 } }),
          records, 'title',
          async () => {
            await page.click('button.btn-ranking');
            await page.waitForSelector('.records-overlay', { timeout: 4000 });
            await sleep(350);
          }
        );

        await shot('8', 'achievements',
          richTitleState(lang), records, 'title',
          async () => {
            await page.click('button.btn-achievements');
            await page.waitForSelector('.achievements-overlay', { timeout: 4000 });
            await sleep(350);
          }
        );

        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const total = LANGUAGES.length * DEVICES.length * 8;
  const ok = total - errorCount;
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`Done: ${ok}/${total} screenshots generated${errorCount ? ` (${errorCount} errors)` : ' ✅'}`);
}

main().catch(err => { console.error(err); process.exit(1); });
