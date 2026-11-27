#!/usr/bin/env node
// Generates the visual assets for every article from its frontmatter:
//   public/images/hero/<slug>.png   1200×630  social/OG image (Google Discover, X, LinkedIn, Slack)
//   public/images/hero/<slug>.webp  1200×630  the scorecard shown inside the article
//   public/images/pins/<slug>.png   1000×1500 Pinterest pin (feeds workflows/pinterest-pin-automation.json)
//   public/images/og-default.png    1200×630  fallback for non-article pages
//
// Uses Playwright + the site's own fonts, so images match the site exactly.
// Run: npm run images            (only regenerates images that are missing or older than the article)
//      npm run images -- --force (regenerate everything)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import YAML from 'yaml';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');
const { SITE } = await import(pathToFileURL(path.join(root, 'src/site.config.mjs')).href);

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.warn('[images] Playwright not installed; skipping image generation (committed images will be used).');
  process.exit(0);
}

const tools = Object.fromEntries(
  JSON.parse(fs.readFileSync(path.join(root, 'src/data/tools.json'), 'utf8')).map((t) => [t.id, t])
);
const articleDir = path.join(root, 'src/content/articles');
const out = { hero: path.join(root, 'public/images/hero'), pins: path.join(root, 'public/images/pins') };
Object.values(out).forEach((d) => fs.mkdirSync(d, { recursive: true }));

// Fonts are inlined as data URLs: pages rendered with setContent() can't load file:// URLs.
const fontFile = (pkg, file) =>
  'data:font/woff2;base64,' + fs.readFileSync(path.join(root, 'node_modules/@fontsource-variable', pkg, 'files', file)).toString('base64');
const fonts = `
@font-face{font-family:B;src:url(${fontFile('plus-jakarta-sans', 'plus-jakarta-sans-latin-wght-normal.woff2')}) format('woff2');font-weight:200 800}
@font-face{font-family:L;src:url(${fontFile('inter', 'inter-latin-wght-normal.woff2')}) format('woff2');font-weight:200 900}`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const initials = (n) => {
  const w = n.replace(/\.[a-z]+$/i, '').replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean);
  return w.length > 1 ? w.slice(0, 2).map((x) => x[0]).join('') : w[0].slice(0, 2);
};
// Tool logo on a light tile if public/logos/<id>.png exists, else coloured initials.
const logoUri = (t) => {
  const f = path.join(root, 'public/logos', `${t.id}.png`);
  return fs.existsSync(f) ? 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') : null;
};
const mono = (t, s) => {
  const uri = logoUri(t);
  return uri
    ? `<span class="m" style="background:#fff;border:2px solid #e6e9f0;width:${s}px;height:${s}px"><img src="${uri}" style="width:70%;height:70%;object-fit:contain;border-radius:18%"></span>`
    : `<span class="m" style="background:${t.color};width:${s}px;height:${s}px;font-size:${s * 0.4}px">${initials(t.name)}</span>`;
};

function template({ title, toolList, picks, w, h, pin, verdict = '' }) {
  const rows = picks.slice(0, pin ? 5 : 3);
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
  *{box-sizing:border-box;margin:0}
  body{width:${w}px;height:${h}px;background:#f7f8fb;color:#0f172a;font-family:B;padding:${pin ? 80 : 64}px;display:flex;flex-direction:column;overflow:hidden}
  .m{display:inline-grid;place-items:center;border-radius:30%;color:#fff;font-weight:800;letter-spacing:-.04em;box-shadow:0 0 0 5px #f7f8fb}
  .tools{display:flex;align-items:center;gap:18px;font-weight:700;font-size:${pin ? 34 : 28}px}
  .vs{color:#526075;font-style:italic;font-weight:500;font-size:.8em}
  h1{font-weight:800;letter-spacing:-.04em;line-height:1;font-size:${pin ? 96 : title.length > 48 ? 58 : 70}px;margin-top:${pin ? 56 : 36}px;max-width:${pin ? 840 : 1000}px}
  .vd{font-family:L;font-size:36px;line-height:1.45;color:#526075;margin-top:44px;max-width:820px}
  .picks{margin-top:auto;border-top:4px solid #18212c}
  .row{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:${pin ? 22 : 14}px 0;border-bottom:2px solid #e6e9f0;font-size:${pin ? 34 : 26}px}
  .row span:first-child{color:#526075}
  .row b{font-weight:800;background:linear-gradient(100deg,transparent 4px,#f6d33c 6px,#f6d33c calc(100% - 6px),transparent calc(100% - 4px));padding:2px 10px}
  .brand{display:flex;align-items:center;gap:12px;font-weight:800;font-size:${pin ? 34 : 26}px;margin-top:${pin ? 40 : 22}px;letter-spacing:-.03em}
  .ck{width:${pin ? 40 : 32}px;height:${pin ? 40 : 32}px;border-radius:28%;background:#2457e6;color:#fff;display:grid;place-items:center;font-size:.7em}
  </style></head><body>
  <div class="tools">${toolList.map((t, i) => (i ? '<span class="vs">vs</span>' : '') + mono(t, pin ? 96 : 72)).join('')}</div>
  <h1>${esc(title)}</h1>
  ${pin && verdict ? `<p class="vd">${esc(verdict.split(/(?<=\.)\s/)[0])}</p>` : ''}
  ${rows.length ? `<div class="picks">${rows.map((p) => `<div class="row"><span>${esc(p.useCase)}</span><b>${esc(tools[p.tool]?.name ?? p.tool)}</b></div>`).join('')}</div>` : '<div style="margin-top:auto"></div>'}
  <div class="brand"><span class="ck">✓</span>${esc(SITE.name)}<span style="font-weight:400;color:#526075;margin-left:auto;font-size:.8em">${esc(new URL(SITE.url).hostname)}</span></div>
  </body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage();

async function shoot(html, w, h, file) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png' });
  await sharp(buf).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(file);
  return buf;
}

let made = 0;
for (const f of fs.readdirSync(articleDir).filter((f) => f.endsWith('.md'))) {
  const slug = f.replace(/\.md$/, '');
  const src = path.join(articleDir, f);
  const heroPng = path.join(out.hero, `${slug}.png`);
  if (!force && fs.existsSync(heroPng) && fs.statSync(heroPng).mtimeMs > fs.statSync(src).mtimeMs) continue;

  const fm = YAML.parse(fs.readFileSync(src, 'utf8').split(/^---$/m)[1]);
  const toolList = fm.tools.map((id) => tools[id]).filter(Boolean);
  const picks = fm.picks ?? [];
  const buf = await shoot(template({ title: fm.title, toolList, picks, w: 1200, h: 630 }), 1200, 630, heroPng);
  await sharp(buf).webp({ quality: 82 }).toFile(path.join(out.hero, `${slug}.webp`));
  await shoot(template({ title: fm.title, toolList, picks, w: 1000, h: 1500, pin: true, verdict: fm.verdict }), 1000, 1500, path.join(out.pins, `${slug}.png`));
  made++;
  console.log(`[images] ${slug}`);
}

// Tool explainer cards: what goes in, what the tool does, what comes out (1200×630).
const toolDir = path.join(root, 'public/images/tools');
fs.mkdirSync(toolDir, { recursive: true });
const chip = (x) => `<span class="c">${esc(x)}</span>`;
let toolsMade = 0;
for (const t of Object.values(tools)) {
  const file = path.join(toolDir, `${t.id}.png`);
  if (!force && fs.existsSync(file) && fs.statSync(file).mtimeMs > fs.statSync(path.join(root, 'src/data/tools.json')).mtimeMs) continue;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:630px;background:#f7f8fb;color:#0f172a;font-family:B;padding:56px 64px;display:flex;flex-direction:column}
  .m{display:inline-grid;place-items:center;border-radius:28%;overflow:hidden}
  .top{display:flex;align-items:center;gap:20px}
  h1{font-size:56px;font-weight:800;letter-spacing:-.04em}
  .v{font-size:22px;color:#526075;margin-top:4px}
  .flow{display:grid;grid-template-columns:1fr 56px 1.15fr 56px 1fr;gap:10px;margin-top:40px;flex:1}
  .col{border:2px solid #e6e9f0;border-radius:24px;padding:22px;background:#fff}
  .core{background:#edf2fe;border-color:#c9d6fb;display:flex;flex-direction:column;justify-content:center;font-family:L;font-size:24px;line-height:1.4}
  .lab{font-size:18px;font-weight:700;color:#526075;margin-bottom:14px}
  .c{display:inline-block;font-size:19px;font-weight:600;padding:8px 12px;border:2px solid #e6e9f0;border-radius:12px;margin:0 8px 8px 0;background:#fff}
  .out .c{border-color:#bfe3cc}
  .ar{display:grid;place-items:center;color:#2457e6;font-size:44px;font-weight:800}
  .brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:24px;margin-top:26px}
  .ck{width:30px;height:30px;border-radius:28%;background:#2457e6;color:#fff;display:grid;place-items:center;font-size:.7em}
  </style></head><body>
  <div class="top">${mono(t, 84)}<div><h1>How ${esc(t.name)} works</h1><div class="v">${esc(t.vendor)} · ${esc(t.startingPrice)}</div></div></div>
  <div class="flow">
    <div class="col"><div class="lab">You give it</div>${(t.inputs || []).map(chip).join('')}</div>
    <div class="ar">→</div>
    <div class="col core">${esc(t.does || '')}</div>
    <div class="ar">→</div>
    <div class="col out"><div class="lab">You get</div>${(t.outputs || []).map(chip).join('')}</div>
  </div>
  <div class="brand"><span class="ck">✓</span>${esc(SITE.name)}<span style="font-weight:400;color:#526075;margin-left:auto;font-size:.8em">Illustration · ${esc(new URL(SITE.url).hostname)}</span></div>
  </body></html>`;
  await shoot(html, 1200, 630, file);
  toolsMade++;
}
console.log(`[images] ${toolsMade} tool explainer image(s) rendered`);

const def = path.join(root, 'public/images/og-default.png');
if (force || !fs.existsSync(def)) {
  await shoot(
    template({ title: 'Which AI tool should you use? We compare them and pick one.', toolList: ['chatgpt', 'claude', 'gemini'].map((t) => tools[t]), picks: [], w: 1200, h: 630 }),
    1200, 630, def
  );
}
await browser.close();
console.log(`[images] done (${made} article${made === 1 ? '' : 's'} rendered)`);
