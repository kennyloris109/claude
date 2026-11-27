# SEO and AI-search growth playbook

Two audiences read this site: **people from Google** and **AI answer engines** (ChatGPT Search, Perplexity, Claude, Gemini, Google AI Overviews and AI Mode, Copilot). Both reward the same thing: clear, current, verifiable answers on a fast, well-structured page.

## What's already built in

| Signal | Where |
|---|---|
| Direct answer at the top of every page (the "short answer" AI engines quote) | `verdict` field → `Verdict.astro` |
| Article, BreadcrumbList, FAQPage, SoftwareApplication, Organization and WebSite JSON-LD | `Base.astro`, `compare/[slug].astro`, `tools/[id].astro` |
| Visible "updated" and "prices last checked" dates | article header and verdict |
| Sources linked on every article | `sources` field |
| `robots.txt` explicitly allowing GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and others | `src/pages/robots.txt.ts` |
| `llms.txt` and `llms-full.txt` (a plain-text map and full text for LLM agents) | `src/pages/llms*.txt.ts` |
| XML sitemap, RSS, canonical URLs, Open Graph and Twitter cards | Astro config, `Base.astro` |
| 1200×630 share images and 1000×1500 Pinterest pins per article | `scripts/generate-images.mjs` |
| Programmatic tool and category pages with internal links | `tools/[id]`, `category/[category]` |
| IndexNow (Bing → also feeds ChatGPT Search and Copilot) | `scripts/indexnow.mjs`, CI |
| Near-zero JavaScript, self-hosted fonts and long cache headers (Core Web Vitals) | `public/_headers` |
| Quality gate for titles, descriptions, links, FAQs and staleness | `npm run check:content` |

## Launch checklist (do once, ~1 hour)
1. **Google Search Console**: add a *Domain* property, verify via DNS (Cloudflare makes this one click), and submit `https://<domain>/sitemap-index.xml`.
2. **Bing Webmaster Tools**: import from Search Console, submit the sitemap. Bing's index powers ChatGPT Search, Copilot and DuckDuckGo, so this matters more than it looks.
3. Set the GitHub repo variable `SITE_LIVE=true` so CI pings IndexNow on every deploy.
4. Check `https://<domain>/robots.txt` and `/llms.txt` load, and that Cloudflare's AI-bot blocking is **off** (see `deploy-cloudflare.md`).
5. Test one article in Google's [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema validator](https://validator.schema.org/).
6. Replace the placeholder author on `/about/` with a real person: name, photo, background, LinkedIn. Then set `SITE.author` in `src/site.config.mjs`. Named experts are a major trust (E-E-A-T) signal.
7. Create a free Pinterest business account and point the n8n workflow (`workflows/`) at `public/images/pins/`. Pins are long-lived traffic for "X vs Y" and "best tools for" searches.

## The weekly growth loop
| Cadence | Action | How |
|---|---|---|
| 2–3× per week | Publish a new comparison from `docs/content-plan.md` | Ask Claude: *"use the new-article skill for <topic>"* |
| Weekly | Look at Search Console → Queries with impressions but low CTR (positions 5–20) | Rewrite that page's title and description, and add an FAQ that matches the query |
| Weekly | Ask ChatGPT, Perplexity and Gemini your target questions ("best AI meeting notetaker") and note who gets cited | Add what the cited pages have and you don't, such as a table, a fresher date or a missing tool |
| Monthly | Refresh the top 10 pages by traffic | *"use the refresh-article skill"* |
| Monthly | Earn mentions: answer relevant Reddit and Quora threads honestly, pitch "free tool" roundups, post pins | Mentions on trusted sites are the #1 factor in whether AI engines cite you |

## Writing for AI citations
- Put the answer in the **first 2–3 sentences**, naming the tool and the reason. Engines lift exactly this.
- Use **one idea per heading** with question-style H2s.
- Prefer **tables and lists** for facts (prices, limits, platforms). They're easy to extract.
- **Be specific and dated:** "about $20/mo as of November 2026" beats "affordable".
- **Cite primary sources** (vendor pricing pages) and link them.
- **Never fabricate** test results, benchmarks or quotes. One wrong price shared in an AI answer costs more trust than ten articles earn.
- **Add first-hand evidence over time.** Screenshots of real outputs, your own prompt tests and time or cost measurements are the strongest differentiator against AI-generated competitors. Add a "What we saw in testing" section once you've run the tools yourself.

## Monetisation (when traffic arrives)
Most AI tools run affiliate programs (look for "affiliates" or "partners" in each vendor's footer, or networks like PartnerStack and Impact). Add affiliate links to the `url` field in `tools.json` or to the pick rows, **disclose them next to the link**, and add `rel="sponsored"`. Never let commission change a verdict. Readers and AI engines both learn to distrust sites that do.
