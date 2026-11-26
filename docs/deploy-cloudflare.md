# Deploying to Cloudflare Pages

The site is fully static (`dist/`), so Cloudflare Pages hosts it for free and redeploys on every push.

## 1. Buy or choose a domain
The placeholder is `toolverdict.com`. Check it's available (or pick another name) at any registrar.
Cloudflare Registrar sells at cost and makes DNS automatic. Then update **`src/site.config.mjs`**:
`name`, `url` and (optionally) `twitter`. Commit and push.

## 2. Connect the repo
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick this GitHub repo and set:

| Setting | Value |
|---|---|
| Production branch | the branch you merge into (currently `claude/pinterest-automation-agent-bl4n8k`; renaming it to `main` is recommended) |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION` = `22` |

3. Save and deploy. Every push to the production branch redeploys, and other branches get preview URLs.

## 3. Attach the domain
Pages project → **Custom domains → Set up a domain** → enter your domain. If the domain uses
Cloudflare DNS, the records are created for you.

Also turn on, under the zone's settings:
- **SSL/TLS → Always Use HTTPS**
- **Speed → Optimization**: Brotli is on by default. Leave "Rocket Loader" **off**, because the site ships almost no JS.
- **Security → Bots**: make sure "Block AI bots" / "AI Scrapers and Crawlers" is **off**. Otherwise
  Cloudflare blocks GPTBot, ClaudeBot and PerplexityBot at the edge, and you won't be cited in AI answers.
  Also check **AI Crawl Control** so the bots listed in `/robots.txt` are allowed.

## 4. After the first deploy
See `docs/seo-ai-growth-playbook.md` → "Launch checklist" (Search Console, Bing Webmaster Tools, IndexNow).
