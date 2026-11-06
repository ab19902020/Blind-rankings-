// Bundles the app into ../android/app/src/main/assets/www (and dist/ for the web).
import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'node:child_process';

const here = path.dirname(new URL(import.meta.url).pathname);
execFileSync(process.execPath, [path.join(here, 'prepare-catalog.mjs')], { cwd: here, stdio: 'inherit' });
const out = process.argv[2] || path.join(here, 'dist');
const entry = process.argv[3] || 'src/main.jsx';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const nodePaths = [path.join(here, 'node_modules'), '/opt/npm-tools/node_modules'].filter(p => fs.existsSync(p));

await esbuild.build({
  entryPoints: [path.join(here, entry)],
  bundle: true, minify: true, sourcemap: false,
  outfile: path.join(out, 'app.js'),
  jsx: 'automatic', target: ['chrome100'],
  loader: { '.woff2': 'file', '.woff': 'file' },
  assetNames: 'fonts/[name]-[hash]',
  define: { 'process.env.NODE_ENV': '"production"' },
  nodePaths, logLevel: 'info',
  plugins: [{
    name: 'optional-fonts',
    setup(b) {
      b.onResolve({ filter: /^@fontsource\// }, args => {
        const found = nodePaths.some(p => fs.existsSync(path.join(p, '@fontsource')));
        return found ? undefined : { path: args.path, namespace: 'empty-css' };
      });
      b.onLoad({ filter: /.*/, namespace: 'empty-css' }, () => ({ contents: '', loader: 'css' }));
    },
  }],
});

fs.copyFileSync(path.join(here, 'src/index.html'), path.join(out, 'index.html'));
const cat = path.join(here, 'public/catalog.json');
if (fs.existsSync(cat)) { fs.copyFileSync(cat, path.join(out, 'catalog.json')); console.log('catalog bundled'); } else console.log('no catalog to bundle — app will use live lookups');

// face-api (UMD build + tiny face detector model) if installed
const fa = nodePaths.map(p => path.join(p, '@vladmandic/face-api')).find(p => fs.existsSync(p));
if (fa) {
  fs.mkdirSync(path.join(out, 'vendor'), { recursive: true });
  fs.copyFileSync(path.join(fa, 'dist/face-api.js'), path.join(out, 'vendor/face-api.js'));
  fs.mkdirSync(path.join(out, 'models'), { recursive: true });
  for (const f of fs.readdirSync(path.join(fa, 'model'))) {
    if (f.startsWith('tiny_face_detector')) fs.copyFileSync(path.join(fa, 'model', f), path.join(out, 'models', f));
  }
  console.log('face-api bundled');
} else console.log('face-api not installed — face tracking disabled in this build');
