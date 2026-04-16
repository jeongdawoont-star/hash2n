/**
 * optimize-images.js
 *
 * img/ 폴더의 원본 이미지를 img-re/ 폴더에 AVIF로 변환합니다.
 * 목표: 150 KB 이하에서 가장 높은 화질 유지 (이진 탐색)
 *
 * 사용법:
 *   npm install sharp
 *   node tools/optimize-images.js
 *
 * GitHub Actions에서 자동 실행됨 (.github/workflows/optimize-images.yml)
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const IMG_DIR  = path.join(__dirname, '..', 'img');
const OUT_DIR  = path.join(__dirname, '..', 'img-re');
const MAX_BYTES = 150 * 1024; // 150 KB
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.bmp']);

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

/**
 * 이진 탐색으로 150 KB 이하의 최대 품질을 찾아 AVIF 변환
 */
async function convertToAvif(inputPath, outputPath) {
  const src = sharp(inputPath);
  const meta = await src.metadata();

  let lo = 1, hi = 85, bestQuality = 1, bestBuf = null;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const buf = await sharp(inputPath)
      .avif({ quality: mid, effort: 4 })
      .toBuffer();

    if (buf.length <= MAX_BYTES) {
      bestQuality = mid;
      bestBuf = buf;
      lo = mid + 1; // 더 높은 품질 시도
    } else {
      hi = mid - 1; // 품질 낮추기
    }
  }

  // 품질 1도 150 KB 초과 → 해상도를 줄여서 재시도
  if (!bestBuf) {
    let scale = 0.8;
    while (scale > 0.1) {
      const w = Math.max(1, Math.round((meta.width || 800) * scale));
      const buf = await sharp(inputPath)
        .resize(w)
        .avif({ quality: 40, effort: 4 })
        .toBuffer();
      if (buf.length <= MAX_BYTES) {
        bestBuf = buf;
        break;
      }
      scale -= 0.1;
    }
  }

  if (!bestBuf) {
    console.error(`✗ ${path.basename(inputPath)}: 변환 실패 (스케일 최소 도달)`);
    return;
  }

  fs.writeFileSync(outputPath, bestBuf);
  const kb = (bestBuf.length / 1024).toFixed(1);
  console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}  ${kb} KB  (quality=${bestQuality})`);
}

async function main() {
  const files = fs.readdirSync(IMG_DIR).filter(f => {
    if (f.startsWith('.')) return false;
    return EXTS.has(path.extname(f).toLowerCase());
  });

  if (files.length === 0) {
    console.log('img/ 폴더에 이미지가 없습니다.');
    return;
  }

  for (const file of files) {
    const inputPath  = path.join(IMG_DIR, file);
    const baseName   = path.basename(file, path.extname(file));
    const outputPath = path.join(OUT_DIR, baseName + '.avif');

    // 이미 최신 버전이면 건너뜀
    if (fs.existsSync(outputPath)) {
      const srcMtime = fs.statSync(inputPath).mtimeMs;
      const outMtime = fs.statSync(outputPath).mtimeMs;
      if (outMtime >= srcMtime) {
        const kb = (fs.statSync(outputPath).size / 1024).toFixed(1);
        console.log(`⏭  ${file} → 건너뜀 (최신, ${kb} KB)`);
        continue;
      }
    }

    await convertToAvif(inputPath, outputPath);
  }

  console.log('\n완료!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
