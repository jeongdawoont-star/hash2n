/**
 * 이미지 리사이즈 스크립트
 * 사용법: node tools/resize.js <이미지파일> [출력폴더]
 *
 * 예시:
 *   node tools/resize.js 사진.jpg          → img/사진.jpg (자동)
 *   node tools/resize.js 사진.jpg img/     → img/사진.jpg
 *
 * 설치 필요: npm install sharp
 * (처음 한 번만 실행)
 */

const path = require('path');
const fs   = require('fs');

const TARGET_WIDTH   = 600;   // 가로 픽셀
const MAX_BYTES      = 200 * 1024;  // 200KB 목표
const INITIAL_QUALITY = 82;

async function resize(inputPath, outputDir) {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('sharp 패키지가 없습니다. 먼저 실행하세요: npm install sharp');
    process.exit(1);
  }

  const ext      = path.extname(inputPath).toLowerCase();
  const baseName = path.basename(inputPath, ext);
  const outName  = baseName + '.jpg';
  const outPath  = path.join(outputDir, outName);

  fs.mkdirSync(outputDir, { recursive: true });

  // 먼저 리사이즈 후 품질 조절로 용량 맞추기
  let quality = INITIAL_QUALITY;
  let buf;

  for (let attempt = 0; attempt < 5; attempt++) {
    buf = await sharp(inputPath)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    if (buf.length <= MAX_BYTES || quality <= 50) break;
    quality -= 8;
  }

  fs.writeFileSync(outPath, buf);

  const kb = (buf.length / 1024).toFixed(1);
  console.log(`✅ 저장 완료: ${outPath} (${kb} KB, quality=${quality})`);
}

// ── 실행 ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('사용법: node tools/resize.js <이미지파일> [출력폴더]');
  process.exit(0);
}

const inputFile = args[0];
const outputDir = args[1] || 'img';

if (!fs.existsSync(inputFile)) {
  console.error('파일을 찾을 수 없습니다:', inputFile);
  process.exit(1);
}

resize(inputFile, outputDir).catch(err => {
  console.error('오류:', err.message);
  process.exit(1);
});
