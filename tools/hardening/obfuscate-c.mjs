import fs from 'node:fs/promises';
import path from 'node:path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const rootDir = process.cwd();
const configPath = path.join(rootDir, 'tools', 'hardening', 'hardening.config.json');
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));

if (!config.obfuscation?.enabled) {
  console.log('[C] Obfuscation disabled in config.');
  process.exit(0);
}

const outDir = path.resolve(rootDir, config.outDir || '.deploy-hardened');
const targets = config.obfuscation.targets || [];
const excluded = new Set(config.obfuscation.exclude || []);

let changed = 0;
for (const rel of targets) {
  if (excluded.has(rel)) {
    console.log(`[C] Skip excluded target: ${rel}`);
    continue;
  }

  const filePath = path.join(outDir, rel);
  try {
    const code = await fs.readFile(filePath, 'utf8');
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      disableConsoleOutput: false,
      identifierNamesGenerator: 'hexadecimal',
      renameGlobals: false,
      selfDefending: false,
      simplify: true,
      stringArray: true,
      stringArrayThreshold: 0.6,
      transformObjectKeys: false,
      unicodeEscapeSequence: false
    }).getObfuscatedCode();

    await fs.writeFile(filePath, obfuscated, 'utf8');
    changed += 1;
    console.log(`[C] Obfuscated: ${rel}`);
  } catch (err) {
    console.warn(`[C] Skip missing or unreadable file: ${rel}`);
  }
}

console.log(`[C] Obfuscation complete. changed=${changed}`);
