#!/usr/bin/env node
// SEO / AI-search quality gate for articles. Run: npm run check:content
// Fails (exit 1) on errors; prints warnings for things worth fixing.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src/content/articles');
const tools = new Set(JSON.parse(fs.readFileSync(path.join(root, 'src/data/tools.json'), 'utf8')).map((t) => t.id));
const slugs = new Set(fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)));
const today = new Date();
let errors = 0;
let warnings = 0;

for (const slug of slugs) {
  const raw = fs.readFileSync(path.join(dir, `${slug}.md`), 'utf8');
  const [, fmRaw, ...rest] = raw.split(/^---$/m);
  const fm = YAML.parse(fmRaw);
  const body = rest.join('---');
  // Count everything that renders on the page: body + verdict + picks + FAQs.
  const extra = [fm.verdict, ...(fm.picks ?? []).map((p) => `${p.useCase} ${p.why}`), ...(fm.faqs ?? []).map((f) => `${f.q} ${f.a}`)].join(' ');
  const words = `${body} ${extra}`.split(/\s+/).filter(Boolean).length;
  const err = (m) => (errors++, console.log(`  ✗ ${m}`));
  const warn = (m) => (warnings++, console.log(`  ! ${m}`));
  console.log(`\n${slug}`);

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err('slug must be lowercase-kebab-case');
  if (fm.title.length > 65) warn(`title is ${fm.title.length} chars; Google truncates around 60`);
  if (fm.description.length < 110 || fm.description.length > 160) err(`description is ${fm.description.length} chars (want 110–160)`);
  for (const t of fm.tools ?? []) if (!tools.has(t)) err(`unknown tool "${t}"; add it to src/data/tools.json`);
  for (const p of fm.picks ?? []) if (!tools.has(p.tool)) err(`pick uses unknown tool "${p.tool}"`);
  if (words < 700) warn(`only ${words} words on the page; aim for 900+ for competitive comparisons`);
  if ((fm.faqs ?? []).length < 3) warn('fewer than 3 FAQs; FAQs are heavily used by AI answer engines');
  if ((fm.sources ?? []).length < 1) err('no sources; link the official pricing pages');
  if (!fm.heroAlt || fm.heroAlt.length < 40) err('heroAlt missing or too short');
  if (!/^## /m.test(body)) err('no H2 headings in body');
  if (/^# /m.test(body)) err('body must not contain an H1 (the title is the H1)');

  const internal = [...body.matchAll(/\]\((\/[^)\s#]*)/g)].map((m) => m[1]);
  if (internal.length < 2) warn(`only ${internal.length} internal links; add links to related comparisons and tool pages`);
  for (const href of internal) {
    const cmp = href.match(/^\/compare\/([^/]+)\/$/);
    const tool = href.match(/^\/tools\/([^/]+)\/$/);
    if (cmp && !slugs.has(cmp[1])) err(`broken internal link ${href}`);
    if (tool && !tools.has(tool[1])) err(`broken tool link ${href}`);
  }

  const ageDays = (today - new Date(fm.lastVerified)) / 86400000;
  if (ageDays > 90) warn(`prices last verified ${Math.round(ageDays)} days ago; re-check vendor pages and bump lastVerified/updatedDate`);
  if (!fs.existsSync(path.join(root, 'public/images/hero', `${slug}.png`))) err('hero image missing; run npm run images');
}

console.log(`\n${errors} error(s), ${warnings} warning(s) across ${slugs.size} articles`);
process.exit(errors ? 1 : 0);
