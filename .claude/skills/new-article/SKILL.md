---
name: new-article
description: Research, write, illustrate and validate a new AI-tool comparison article for ToolVerdict. Use when the user asks for a new article, comparison, "X vs Y", or "best AI tools for Z" page.
---

# New comparison article

Input: a topic such as "Notion AI vs ClickUp Brain" or "best AI tools for students". If none was given, choose the highest-priority unwritten topic from `docs/content-plan.md`.

## 1. Research (don't skip)
- Use WebSearch for current pricing, plans and recent changes for each tool. Prefer the vendor's own pricing and docs pages. Treat third-party blogs as leads to verify, not as facts.
- Find the questions people ask: search "<tool a> vs <tool b>" and note "People also ask" style questions and Reddit threads.
- Read the existing articles in `src/content/articles/` to avoid overlap and find internal-linking opportunities.

## 2. Tools data
- Add any missing tool to `src/data/tools.json` (id = kebab-case, a distinct `color`, honest `startingPrice` written as "about $X/mo").

## 3. Write `src/content/articles/<slug>.md`
Follow the frontmatter schema in `src/content.config.ts` and the writing rules in `CLAUDE.md`. Structure:
1. Intro paragraph (what differs, in 2–4 sentences).
2. `## How we compared them`: the jobs and criteria. Don't claim tests you didn't run.
3. One `##` per tool: what it is, "Where it shines" bullets, a "Trade-off" line.
4. A decision table (`| If you… | Choose |`).
5. `## The bottom line` with links to each `/tools/<id>/` page and at least one related `/compare/…/` article.
6. 4+ FAQs in frontmatter, phrased the way people search.

## 4. Link it in
Add a contextual link to the new article from 1–2 existing related articles, and bump their `updatedDate`.

## 5. Images and checks
```bash
npm run images
npm run check:content
npm run build
```
Fix every error. Look at `public/images/hero/<slug>.png` and `public/images/pins/<slug>.png` to confirm they render cleanly.

## 6. Ship
Commit the markdown, tools.json and images together with a message like `Add <title>`, then push. After Cloudflare deploys, run `npm run indexnow -- /compare/<slug>/`.
