---
name: refresh-article
description: Re-verify prices and features in existing ToolVerdict articles and update them. Use when the user asks to refresh, update or audit articles, or when check:content warns that lastVerified is older than 90 days.
---

# Refresh articles

1. Run `npm run check:content` and list the articles flagged as stale. If the user named one, use that.
2. For each article, WebSearch each tool's current pricing and notable changes since `lastVerified`, using official pages first.
3. Update `src/data/tools.json` prices, the article body, `comparison` rows, `picks` and the `verdict` if the right answer changed. Never keep a claim you couldn't re-verify; remove it instead.
4. Set `lastVerified` and `updatedDate` to today. Keep `pubDate` and the slug unchanged.
5. `npm run images && npm run check:content && npm run build`, then commit with `Refresh <slug>: <what changed>` and push.
6. After deploy: `npm run indexnow -- /compare/<slug>/`.

Freshness is a ranking and citation signal for both Google and AI engines, so refresh the top-traffic articles monthly.
