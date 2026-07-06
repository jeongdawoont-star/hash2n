import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import { minify as minifyHtml } from 'html-minifier-terser';
import { transform as esbuildTransform } from 'esbuild';

const rootDir = process.cwd();
const configPath = path.join(rootDir, 'tools', 'hardening', 'hardening.config.json');
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));

const sourceDir = path.resolve(rootDir, config.sourceDir || '.');
const outDir = path.resolve(rootDir, config.outDir || '.deploy-hardened');
const ignore = config.copyIgnore || [];

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });

const entries = await fg(['**/*'], {
  cwd: sourceDir,
  dot: true,
  onlyFiles: true,
  ignore
});

for (const rel of entries) {
  const from = path.join(sourceDir, rel);
  const to = path.join(outDir, rel);
  await fs.mkdir(path.dirname(to), { recursive: true });

  const ext = path.extname(rel).toLowerCase();
  const raw = await fs.readFile(from);

  if (ext === '.html' && config.minify?.html) {
    const minified = await minifyHtml(raw.toString('utf8'), {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: false,
      keepClosingSlash: true,
      removeRedundantAttributes: false,
      removeEmptyAttributes: false
    });
    await fs.writeFile(to, minified, 'utf8');
    continue;
  }

  if (ext === '.css' && config.minify?.css) {
    const out = await esbuildTransform(raw.toString('utf8'), {
      loader: 'css',
      minify: true,
      sourcemap: false,
      legalComments: 'none'
    });
    await fs.writeFile(to, out.code, 'utf8');
    continue;
  }

  if (ext === '.js' && config.minify?.js) {
    const out = await esbuildTransform(raw.toString('utf8'), {
      loader: 'js',
      minify: true,
      sourcemap: false,
      legalComments: 'none'
    });
    await fs.writeFile(to, out.code, 'utf8');
    continue;
  }

  await fs.writeFile(to, raw);
}

console.log(`[B] Hardened build complete: ${entries.length} files -> ${path.relative(rootDir, outDir)}`);
