# ToolVerdict: AI tools comparison site

Static Astro site deployed to Cloudflare Pages. The goal is to rank in Google **and** to be cited by AI answer engines (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews and AI Mode).

## Layout
- `src/site.config.mjs`: brand name, domain, author, IndexNow key. Change the brand here only.
- `src/data/tools.json`: one record per tool (pricing, best-for, color). Tool pages are generated from it.
- `src/content/articles/*.md`: comparisons. The schema is in `src/content.config.ts`, and the build fails on invalid frontmatter.
- `src/pages/`: routes. `compare/[slug]`, `tools/[id]`, `category/[category]`, `llms.txt`, `llms-full.txt`, `robots.txt`, `rss.xml`.
- `scripts/generate-images.mjs`: renders the OG/scorecard image and Pinterest pin for each article with Playwright. **Images are committed**, and the Cloudflare build doesn't regenerate them.
- `scripts/validate-content.mjs`: SEO quality gate.
- `workflows/`: the n8n Pinterest automation. It can post `public/images/pins/*.png`.

## Commands
- `npm run dev`: local dev server
- `npm run images`: render images for new or changed articles (`-- --force` to redo all)
- `npm run check:content`: must pass with 0 errors before committing
- `npm run build`: production build into `dist/`
- `npm run indexnow`: ping Bing and other engines after a deploy (site must be live)

## Writing rules (apply to every article)
1. **Answer first.** The `verdict` frontmatter field is a 2–3 sentence answer that names a pick for each main use case. AI engines quote this.
2. **One pick per use case** in `picks`. Each `why` is one concrete sentence.
3. **No invented facts.** Never invent benchmark numbers, test results, quotes or prices. Prices are approximate ("about $20/mo") and come from the official pricing page, which must be listed in `sources`. Set `lastVerified` to the date you checked. If you can't verify something, leave it out.
4. **Question-shaped H2s and FAQs** that match real searches ("Is X better than Y?").
5. **Internal links.** Link at least 2 related `/compare/…/` or `/tools/…/` pages, and add a link back from an older related article.
6. Title ≤ 60 chars where possible, description 110–160 chars, plain language, sentence case, no hype words ("revolutionary", "game-changer").
7. Slugs are `tool-a-vs-tool-b` or `best-<category>-for-<audience>`, and never change once published.
8. After adding an article: `npm run images && npm run check:content && npm run build`, then commit the markdown and the images.

Use the `new-article` and `refresh-article` skills in `.claude/skills/` for the full workflow.
