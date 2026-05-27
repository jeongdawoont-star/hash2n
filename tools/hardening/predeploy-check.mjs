import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';

const rootDir = process.cwd();
const configPath = path.join(rootDir, 'tools', 'hardening', 'hardening.config.json');
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
const outDir = path.resolve(rootDir, config.outDir || '.deploy-hardened');

const problems = [];

async function mustExist(rel) {
  const p = path.join(outDir, rel);
  try {
    await fs.access(p);
  } catch {
    problems.push(`Missing required file: ${rel}`);
  }
}

await mustExist('index.html');
await mustExist('records.js');
await mustExist('js/main.js');

const recordsPath = path.join(outDir, 'records.js');
try {
  const records = await fs.readFile(recordsPath, 'utf8');
  if (records.includes('jeongdawoont-star.github.io/hash2n')) {
    problems.push('records.js contains legacy absolute GitHub Pages links. Prefer relative paths for internal apps.');
  }
} catch {
  problems.push('Unable to read records.js for link checks.');
}

const mapFiles = await fg(['**/*.map'], { cwd: outDir, onlyFiles: true });
if (mapFiles.length > 0) {
  problems.push(`Source map files detected (${mapFiles.length}). Remove for minimal code exposure.`);
}

if (problems.length > 0) {
  console.error('[CHECK] Predeploy failed:');
  for (const msg of problems) console.error(`- ${msg}`);
  process.exit(1);
}

console.log('[CHECK] Predeploy passed.');
