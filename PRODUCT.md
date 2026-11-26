# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Everyday people** (students, freelancers, creators) deciding which AI app to use or pay for. They want a plain answer fast and rarely read past the first screen of an article.
- **Professionals and small teams** (marketers, developers, small-business owners) choosing AI tools for work. They compare pricing tiers, free-plan limits, integrations and team features before committing.

Both arrive mostly from Google search and from AI answer engines (ChatGPT, Perplexity, Gemini, Google AI Overviews) with a specific question such as "Cursor vs Copilot" or "best AI meeting notetaker".

## Product Purpose

ToolVerdict is an AI tools directory and comparison site. It answers "which AI tool should I use for this job?" with a clear pick per use case, backed by current pricing and the trade-offs that matter. Success is a visitor leaving with a decision, and the site being ranked in Google and cited by AI answer engines.

## Positioning

Every comparison opens with a short answer that names a winner for each use case ("Pick X if…, pick Y if…") instead of a feature list ending in "it depends". Prices are dated ("last checked") and linked to the vendor's own pricing page.

## Operating Context

- Visitors land on a comparison article or tool page from search, read the verdict, scan the side-by-side table, and often click through to the tool.
- The homepage is a searchable directory: search box, category filters, tool cards, top picks by category, latest comparisons.
- Content is produced with Claude Code through the `new-article` and `refresh-article` skills; articles are Markdown with structured frontmatter (`src/content/articles/`), tools live in `src/data/tools.json`.

## Capabilities and Constraints

- Static Astro site deployed to Cloudflare Pages; near-zero JavaScript (only the tool search/filter).
- 28 tools across 8 categories (chatbots, coding, image, video, voice, AI search, meeting notetakers, presentation makers) and 8 comparison articles as of November 2026.
- SEO and AI-search requirements are part of the product: answer-first verdicts, JSON-LD, FAQs, `llms.txt`, visible updated dates, fast pages.
- Tool logos are the vendors' favicons, used to identify the products (`public/logos/`).
- The brand name "ToolVerdict" and domain `toolverdict.com` are placeholders, not yet registered.
- **Undecided:** final brand name and domain; a named author.

## Brand Commitments

- Voice: plain, direct, specific. Name the pick and the reason; no hype words.
- Independence: no vendor pays for a verdict or ranking.

## Evidence on Hand

- Editorial comparisons researched from official vendor pricing pages (linked under "Sources we checked" in each article).
- **Absent, must not be fabricated:** user reviews, star ratings, testimonials, visitor or traffic counts, hands-on test results or benchmark scores, a named author. The "Top pick" badge reflects our own comparison picks, not user ratings.

## Product Principles

1. **Answer first.** Every page leads with the decision; detail supports it.
2. **Truth over decoration.** Show only real, dated, sourced facts; leave out what can't be verified.
3. **Serve both depths.** A beginner gets a plain pick in one sentence; a professional finds tiers, limits and integrations one scroll away.
4. **Disclose money.** Revenue comes from affiliate links; every affiliate link is disclosed beside it and never changes a verdict.
5. **Readable by machines too.** Structure every page so search engines and AI answer engines can quote it accurately.

## Accessibility & Inclusion

No product-specific standard set; follow WCAG 2.2 AA as the baseline (keyboard access, visible focus, sufficient contrast, reduced-motion support).
