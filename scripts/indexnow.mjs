#!/usr/bin/env node
// Pings IndexNow (Bing, Yandex, Seznam, Naver…) with changed URLs so they are re-crawled within
// minutes. Bing's index also powers ChatGPT Search and Copilot, so this matters for AI search.
// Usage:
//   npm run indexnow                      # submit every URL in the live sitemap
//   npm run indexnow -- /compare/foo/     # submit specific paths
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { SITE } = await import(pathToFileURL(path.join(root, 'src/site.config.mjs')).href);
const host = new URL(SITE.url).host;

let urls = process.argv.slice(2).map((p) => new URL(p, SITE.url).href);
if (!urls.length) {
  const idx = await (await fetch(`${SITE.url}/sitemap-index.xml`)).text();
  for (const sm of [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
    const xml = await (await fetch(sm)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key: SITE.indexNowKey, keyLocation: `${SITE.url}/${SITE.indexNowKey}.txt`, urlList: urls }),
});
console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URL(s)`);
if (res.status >= 400) process.exit(1);
