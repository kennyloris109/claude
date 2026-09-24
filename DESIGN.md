---
name: Ocean Marine Services
description: Karachi ship chandler; a port call on chart paper, in harbour ink and Q-flag yellow.
colors:
  chart-paper: "#f2f5f3"
  shoal: "#dce8ee"
  paper-white: "#ffffff"
  harbour-ink: "#0e2a3b"
  deep-water: "#0a2130"
  steel: "#3f5868"
  on-shoal: "#25475a"
  mist: "#b9ccd6"
  rule: "#b8c7cf"
  input-stroke: "#9fb2bc"
  signal-yellow: "#f4c20d"
  signal-yellow-hi: "#ffd233"
  flag-red: "#c8102e"
  flag-blue: "#1d4f9c"
  destructive: "#b3261e"
typography:
  display:
    fontFamily: "Big Shoulders Stencil, Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.4rem, 11vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 0.98
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(1.7rem, 2.6vw, 2.3rem)"
    fontWeight: 700
    lineHeight: 1.02
  lead:
    fontFamily: "Barlow, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Barlow, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
rounded:
  hairline: "2px"
  corner: "3px"
spacing:
  gutter: "16px"
  gutter-wide: "32px"
  stack: "20px"
  block: "48px"
  section: "96px"
  section-wide: "128px"
  container: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.signal-yellow}"
    textColor: "{colors.harbour-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.corner}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.signal-yellow-hi}"
    textColor: "{colors.harbour-ink}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.harbour-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.corner}"
    padding: "0 24px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.harbour-ink}"
    textColor: "{colors.chart-paper}"
  button-icon:
    textColor: "{colors.harbour-ink}"
    rounded: "{rounded.corner}"
    size: "48px"
  input-field:
    backgroundColor: "{colors.chart-paper}"
    textColor: "{colors.harbour-ink}"
    rounded: "{rounded.corner}"
    padding: "0 12px"
    height: "48px"
  chip-item:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.harbour-ink}"
    rounded: "{rounded.corner}"
    padding: "6px 12px"
  panel-form:
    backgroundColor: "{colors.paper-white}"
    rounded: "{rounded.corner}"
    padding: "32px"
  nav-bar-scrolled:
    backgroundColor: "{colors.chart-paper}"
    textColor: "{colors.harbour-ink}"
    height: "64px"
---

# Design System: Ocean Marine Services

## Overview

**Creative North Star: "The Port Call Manifest"**

The site reads like the paperwork and plates of a working port: an Admiralty chart laid on chart paper, a requisition typed in harbour ink, and signal flags run up a halyard. Light surfaces are chart paper and shoal-water blue; dark surfaces are deep harbour water. Yellow is the Q-flag: the one colour that means "act here", reserved for the quotation action, the active state and the focus ring.

Density is moderate and editorial. Sections breathe with tall vertical padding, headlines are condensed and heavy, and lists are ruled like a manifest rather than boxed into cards. Photography is real Karachi Harbour and supply work, full-bleed or in square-cornered frames; the stencil face appears only where a crate stencil would, on the name and on single emphatic words.

The system is light-only by design: it is read on deck and in offices in daylight. Motion is slow and physical (push-in, wipe, hoist, a vessel moving up a channel) and every motion path stops for reduced-motion users.

**Key Characteristics:**
- Chart paper ground, harbour ink text, Q-flag yellow as the single action colour.
- Stencil display for the name and big one-word statements; Barlow Condensed for all headings, buttons and labels; Barlow for reading.
- 3px corners everywhere; nothing is pill-shaped or softly rounded.
- 2px ink rules open lists and panels; 1px rule lines divide their rows.
- Signal flags O-M-S as the brand mark, drawn as ICS flags in flag red, blue, yellow and white.
- Soft, diffuse shadows only, and rarely.

## Colors

A cold harbour palette of paper, ink and water, lit by one signal yellow and the two flag colours.

### Primary
- **Q-Flag Signal Yellow** (`signal-yellow`): the quotation action on every surface, the active tab marker, the running slide timer, the step marker on the port-call chart, list bullets, text selection and the 3px focus outline. Always carries harbour-ink text, never white.
- **Bright Signal** (`signal-yellow-hi`): hover state of yellow buttons only.

### Secondary
- **ICS Flag Red** (`flag-red`): the O flag, the vessel's route line drawn on the chart, and the text caret in inputs. Never a surface or button fill.
- **ICS Flag Blue** (`flag-blue`): the M and S flags only.

### Neutral
- **Chart Paper** (`chart-paper`): page ground, input fill, the chart's backing, and text on ink buttons.
- **Shoal Water** (`shoal`): alternate section ground (coverage strip, "why us"), the form's segmented control, the request preview.
- **Paper White** (`paper-white`): the quotation form panel and item chips; the only white surface.
- **Harbour Ink** (`harbour-ink`): all text on light grounds, 2px manifest rules, outline buttons, the port-call section ground.
- **Deep Water** (`deep-water`): the darkest ground (airline section, footer, mobile menu) and every photo legibility wash, as a gradient at 10-90% opacity.
- **Steel** (`steel`): secondary copy and lead paragraphs on chart paper, inactive tabs.
- **Shoal Ink** (`on-shoal`): secondary copy set on shoal grounds, where steel would lose contrast.
- **Mist** (`mist`): muted text on deep water.
- **Rule Line** (`rule`): 1px dividers between list rows and the scrolled header's bottom edge; disabled control strokes.
- **Input Stroke** (`input-stroke`): field borders at rest.
- **Destructive Red** (`destructive`): validation error text only.

### Named Rules
**The Q-Flag Rule.** Yellow means "act here". It marks the quotation action, the current state and focus; it is never a decorative panel, a heading colour on light ground, or a background band.

**The Flags Stay Flags Rule.** Flag red and flag blue appear in the ICS flags and the chart route; UI chrome uses ink, paper and yellow.

## Typography

**Display Font:** Big Shoulders Stencil 800 (with Barlow Condensed, Arial Narrow)
**Heading / Label Font:** Barlow Condensed 500-700 (with Arial Narrow)
**Body Font:** Barlow 400-600 (with Helvetica Neue, Arial)

**Character:** A crate stencil for the name and single loud statements, a condensed industrial grotesque for everything that labels or commands, and a plain open sans for reading on a phone in sunlight.

### Hierarchy
- **Display** (800, clamp 3.4-6rem, 0.86, uppercase): the hero wordmark, one word per line. The same face and case at smaller clamps sets the footer wordmark (up to 4.5rem), the active supply category name (up to 4.2rem, 0.9) and the closing commitment line (up to 6rem, 0.95), and the port-call step numerals (2.25rem).
- **Headline** (700, clamp 2.4-4rem, 0.98): every section title, sentence case, balanced wrap.
- **Title** (700, clamp 1.7-2.3rem, 1.02): service titles over photos; the same weight at 1.5-1.9rem for port-call steps, reasons and category tabs.
- **Lead** (400, 1.125rem, 1.6): the paragraph under a section title, 52-62ch, in steel (or on-shoal / white at 75-85%).
- **Body** (400, 1.0625rem, 1.6): running copy, under 56ch.
- **Label** (700, 1.25rem condensed): buttons, the header's company name, coverage place names, footer column heads. Nav links are body weight 500.
- **Data**: coordinates, the slide counter, IMO numbers and the request preview use tabular numerals.

### Named Rules
**The Stencil Is Paint Rule.** The stencil face is for the company name and single emphatic words set uppercase at display size; it never sets sentences below 2rem, body, buttons or labels.

**The Headline Stands Alone Rule.** Section titles open directly with the condensed headline and a lead paragraph; there is no small label, kicker or numbering above them.

## Layout

One centred container (1320px max) with 16px gutters on mobile and 32px from 640px. Sections stack full-bleed with 96px vertical padding (128px from 640px; 144px for the commitment statement), alternating chart paper, shoal and deep-water grounds. A section header is a headline, 20px gap, lead paragraph, then 48px to the content.

Two-column splits are asymmetric fractional grids that engage at 1024px (for example 1.15fr / 1fr, 0.8fr / 1.6fr, 1fr / 1.2fr) with 48-80px gaps; below 1024px they stack. Tailwind breakpoints are used as-is (640, 768, 1024).

The hero is full-viewport (min 680px) with content anchored bottom-left and a slide rail across the bottom. The port-call section is a tall scroll track (320-360svh) with a sticky 100svh stage: copy left, chart right on desktop; chart above one step at a time on mobile. The services slider bleeds cards at 88% / 64% / 44% widths so the next card always peeks.

The fixed 64px header is clear over the hero and turns to chart paper once past it; anchor scrolling is offset by 5rem.

## Elevation & Depth

Depth comes from grounds, photographs and gradient washes, not from stacked cards. Surfaces are flat at rest; shadows are soft, long and low-opacity, used on four elements only. Photo legibility is handled by deep-water gradients from the bottom and left edges.

### Shadow Vocabulary
- **Header lift** (`box-shadow: 0 1px 0 var(--color-rule), 0 8px 24px -16px rgb(14 42 59 / 0.35)`): the header once it leaves the hero.
- **Form float** (`box-shadow: 0 24px 60px -40px rgb(14 42 59 / 0.45)`): the white quotation panel.
- **Signal glow** (`box-shadow: 0 10px 30px -12px rgb(244 194 13 / 0.7)`): the hero's primary button over photography only.
- **Flag drop** (`box-shadow: 0 12px 24px -10px rgb(0 0 0 / 0.6)`): hoisted hero flags.

### Named Rules
**The Flat Manifest Rule.** Lists, tabs and service entries are ruled, not raised. If something needs separation, use a 2px ink rule or a ground change before a shadow.

## Shapes

A single corner: 3px (the shadcn radius is set to 0.1875rem, so every derived radius collapses to near-square). Nested pieces inside a 3px frame use 2px. Photo frames, buttons, inputs, chips and panels all share it. The only round shapes are progress bars (3px tall, fully rounded) and the chart's station dots.

Borders do structural work: 2px harbour-ink rules open a list or close a service entry; 1px rule-line hairlines divide rows; 2px outlines make secondary buttons. Bullets are 7px signal-yellow squares; checklist marks are 12px empty squares with a 2px ink border. The ICS flags (3:2) are the recurring silhouette.

## Components

### Buttons
Short, condensed and assertive; they read like painted labels.
- **Shape:** near-square (3px), 48px tall (44px in header and footer, 40px in the desktop nav).
- **Primary:** signal yellow with harbour-ink condensed 700 text at 1.25rem, 24px side padding. Hover shifts to bright signal; the hero instance also lifts 2px and carries the signal glow.
- **Outline:** 2px harbour-ink border, ink text; hover fills ink with chart-paper text. Over photographs the border and text are white (80%) and hover fills white with ink text.
- **Icon:** 48px square outline in the same pattern (slider arrows); disabled drops to rule-line stroke. On the dark hero rail, 44px with a 1px white/30 border.
- **Focus:** 3px signal-yellow outline, 3px offset, on every interactive element.

### Chips
- **Style:** paper-white fill, 1px harbour-ink at 25% border, 3px corner, 6px 12px padding, body weight 500. Static item tags, not filters.

### Cards / Containers
- **Service entry:** a 4:3 photo frame (3px, ink backing) with the title set in white over a bottom deep-water wash, then summary and a two-column yellow-square list, closed by a 2px ink rule. No box, no fill.
- **Form panel:** paper white, 1px rule border, 3px corner, form float shadow, 20px padding (32px from 640px).
- **Request preview:** shoal fill, 1px dashed rule border, body face with tabular numerals.

### Inputs / Fields
- **Style:** 48px tall, chart-paper fill, 1px input-stroke border, 3px corner, 16px ink text, steel placeholders, flag-red caret. Labels above in body 600 at 0.98rem; hints below at 0.875rem in steel.
- **Focus:** border turns harbour ink plus a 3px signal-yellow ring at 60%.
- **Error:** hint turns destructive red and semibold; the IMO field validates its check digit live.

### Navigation
- **Header:** 64px, ICS flag mark plus company name in condensed 700. Desktop links in body 500 with a 2px signal underline that draws from the left on hover (300ms, expo out); a yellow quotation button ends the row.
- **Mobile:** a 44px menu button opens a right-hand deep-water sheet with condensed 1.875rem links divided by white/15 hairlines and a full-width yellow button.

### Tabs
- **Category tabs:** a ruled list of condensed titles (steel, active ink). Mobile: horizontal scroller on a 2px ink baseline with a 3px yellow underline for the active tab. Desktop: a vertical list under a 2px ink top rule with a 10px yellow square marking the active row.
- **Segmented control:** shoal track, 44px; the active segment fills ink with chart-paper text.

### Signal Flag Hoist (signature)
The O, M and S International Code of Signals flags drawn as SVG. As a mark they sit 18px wide with 2px gaps; in the hero they hoist up a white halyard on load with their names in condensed type.

### Photo Slider Rail (signature)
Hero slides change every 7s with a right-to-left clip-path wipe and a slow push-in (scale 1.02 to 1.14 over 9s). The rail beneath names the place, detail and coordinates, shows one 3px progress bar per slide (yellow filling for the current one), and provides previous, pause and next controls.

### Chart Passage (signature)
The 1918 Admiralty chart of Karachi Harbour, multiplied onto chart paper, with a dashed ink route and a flag-red line that draws as the reader scrolls. A small ink vessel with a yellow hatch follows the route; station dots fill yellow as each of the four supply steps activates, and the active step gains a yellow top rule and yellow numeral.

## Do's and Don'ts

### Do:
- **Do** keep chart paper as the default ground and alternate with shoal and deep water to pace the page.
- **Do** use signal yellow with harbour-ink text for every "Request a quotation" action and for active and focus states.
- **Do** keep every corner at 3px (2px when nested).
- **Do** open lists and panels with a 2px harbour-ink rule and divide rows with 1px rule lines.
- **Do** set headings, buttons and labels in Barlow Condensed, and reserve the stencil for the name and single uppercase statements.
- **Do** place white text over photographs only on a deep-water gradient wash.
- **Do** use the expo-out curve (cubic-bezier(0.16, 1, 0.3, 1)) for reveals and underlines, and give every animation a reduced-motion state.
- **Do** use tabular numerals for coordinates, counters and IMO numbers.

### Don't:
- **Don't** use yellow as a decorative fill, a section band or white-text button.
- **Don't** use flag red or flag blue for buttons, panels or headings.
- **Don't** round anything beyond 3px or make pill buttons or chips.
- **Don't** add a dark mode; the system is light-only for daylight reading.
- **Don't** put small labels, kickers or eyebrow text above headlines.
- **Don't** use hard offset shadows or stack shadowed cards; the four soft shadows above are the whole vocabulary.
- **Don't** represent a service or category with an icon tile; show it with a photograph.
