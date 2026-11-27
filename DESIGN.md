# Design

The visual system for ToolVerdict. Product truth lives in `PRODUCT.md`; this file records how the site looks and behaves so every page (and every design skill) stays consistent. Tokens live in `src/styles/global.css`.

## Direction

A clean, light directory with an editorial voice. The interface is calm and card-based so tools are easy to scan; authority comes from **real verdicts set in the yellow highlighter**, dated prices and real tool logos, not from decoration. Bold moments are reserved for answers.

Page modes:

| Surface | Mode | What it optimises for |
|---|---|---|
| Homepage | Find (Operate + Persuade) | A real dated verdict on the first screen, picks per job, then the searchable directory |
| Comparison articles | Read | Short answer, picks, table, then comfortable long-form reading |
| Tool, category, directory pages | Operate | Scanning facts, prices and alternatives |

## Colour

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#f7f8fb` | `#121820` | Page ground |
| `--paper-raised` | `#ffffff` | `#1a222c` | Header, hero bands, cards, panels |
| `--ink` | `#0f172a` | `#e8ece9` | Text |
| `--ink-soft` | `#526075` | `#a6b0ba` | Secondary text (≥ 6:1 on paper) |
| `--rule` | `#e6e9f0` | `#2d3844` | Borders and dividers |
| `--cobalt` | `#2457e6` | `#7fa0ff` | Links, primary buttons, category labels, focus |
| `--tint` | `#edf2fe` | `#1e2840` | Quiet cobalt fills (table heads, tags) |
| `--highlight` | `#f6d33c` | `#e2bf2a` | **Verdicts only** (the `.marker` swipe) and text selection |
| `--logo-tile` | `#f2f5fb` | `#222c38` | Ground behind tool logos |

"Our pick" badges use a warm yellow pill (`#fff6d6` / `#6b4e00`, dark `#3a3010` / `#f5d77a`). No other accent colours; tool brand colours appear only inside their own logos and as comparison-table column rules.

## Type

| Role | Face | Use |
|---|---|---|
| Display / UI | Plus Jakarta Sans (variable, 500–800) | Headings, nav, buttons, cards, labels |
| Text | Inter (variable) | Body copy outside articles, tables, small UI text |
| Reading | Newsreader (variable, roman + italic) | Article prose and FAQ answers only (`--read`, 1.22rem / 1.7, 68ch) |

Headings use tight tracking (−0.025em to −0.045em), `text-wrap: balance`; paragraphs `text-wrap: pretty`. Uppercase is used only for the small category label on tool cards.

## Shape and depth

- Radii: 999px for pills and chips, 10–12px small controls, 16–24px cards and panels, 28% for logo tiles.
- Cards: white on `--paper`, 1px `--rule` border; depth only on hover (lift 3px, soft long shadow) and on the hero/verdict panels.
- No nested cards, no side-stripe accents, no gradients on text.

## Components

- **Header**: brand left, three nav links centred, one primary button ("Comparisons") right; sticky with a light blur.
- **Tool card**: logo tile → category label → name → "Best for …" → optional "Our pick: …" → price row → footer (pricing model, "Details →"). The whole card is the link.
- **Verdict panel**: "The short answer" + highlighter verdict + "last checked" date with a clock icon.
- **Pick cards** (articles): use case → logo + tool → one-line reason.
- **Comparison table**: inside a rounded panel, tool-coloured column rules, tabular numbers, scrolls on its own on small screens.
- **Search + chips**: one controller per grid; filters sync to `?q=` / `?cat=`; live result count; empty state names the search and category.
- **FAQ**: rounded `<details>` with a chevron; first item open.
- **How-it-works explainer** (`ToolExplainer`): "You give it" chips → tool core (tinted) → "You get" chips (green-edged), then Strengths (+) and Watch out for (!) panels. Labelled as an illustration. PNG versions in `public/images/tools/` are each tool page's share image.
- **Voices** (`Voices`): quote cards in Newsreader with name, role, linked source and date; always verbatim, with a note that the people quoted have no connection to the site.
- **Blog index** (`/compare/`): header with real counts, a featured latest comparison (image + highlighter verdict), category chips and image cards.
- **Article "tools up close"**: one open section per tool (divider, not a card) holding its explainer and voices; avoids nested cards.

## Motion

- One entrance per page: hero elements with `data-enter` lift 10px from 60% opacity, 0.6s exponential ease-out, staggered 90ms. Never starts invisible.
- Micro-interactions: cards lift on hover, buttons rise on hover and press (scale 0.98) on click, "Details" arrow slides.
- Everything respects `prefers-reduced-motion`.

## Do / don't

- **Do** lead with an answer; keep prices dated; use real tool logos (`public/logos/`).
- **Don't** add star ratings, testimonials, visitor counts or invented stats (see `PRODUCT.md` → Evidence on hand).
- **Don't** add eyebrow labels above headings, extra accent colours, shader/3D effects or carousels; this is a reading and scanning site.
- **Don't** apply `brand-guidelines` (Anthropic's brand) or a `theme-factory` theme to the site.
