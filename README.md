# ToolVerdict

An AI-tools comparison website built to rank in Google **and** get cited by AI answer engines.
It's built with Astro and hosted on Cloudflare Pages, and Claude Code can extend it end to end.

## Quick start
```bash
npm install
npm run dev            # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run images` | Render share images and Pinterest pins for new or changed articles |
| `npm run check:content` | SEO quality gate (titles, descriptions, links, FAQs, staleness) |
| `npm run indexnow` | Ask Bing and other engines to re-crawl (after deploy) |

## Working with Claude
Open this repo in Claude Code and ask:
- *"Write a new article: Notion AI vs ClickUp Brain"* (uses `.claude/skills/new-article`)
- *"Refresh any stale articles"* (uses `.claude/skills/refresh-article`)
- *"Pick the next 3 topics from the content plan and publish them"*

House rules for content live in `CLAUDE.md`.

## Docs
- [Deploying to Cloudflare Pages](docs/deploy-cloudflare.md)
- [SEO and AI-search growth playbook](docs/seo-ai-growth-playbook.md), with the launch checklist and weekly loop
- [Content plan](docs/content-plan.md), the prioritised list of the next ~25 articles
- [Pinterest pin automation (n8n)](docs/pinterest-automation.md), which can post `public/images/pins/*.png`

## Rebranding
Change the name and domain in `src/site.config.mjs`, then run `npm run images -- --force` so the images pick up the new brand.
