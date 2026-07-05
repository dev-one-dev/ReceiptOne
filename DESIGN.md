---
name: ReceiptOne
description: Tax-ready expense tracking marketing site — warm ledger paper, precise near-black ink, one orange accent used sparingly.
colors:
  ink: "#000000"
  paper: "#f5f4f0"
  void: "#0d0d14"
  ember: "#f97316"
  ember-light: "#fed7aa"
  surface: "#ffffff"
typography:
  display:
    fontFamily: "Inter Tight, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter Tight, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter Tight, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "8px 12px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "8px 12px"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "28px"
  card-popular:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "28px"
  badge-accent:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "4px 16px"
---

# Design System: ReceiptOne

## 1. Overview

**Creative North Star: "The Well-Kept Ledger"**

ReceiptOne's site reads like a well-kept paper ledger, not a fintech dashboard: a warm off-white page (`#f5f4f0`), precise near-black ink for every word that matters, and exactly one accent — a single warm orange — reserved for the moments that deserve a highlighter mark. This is a brand register site (marketing, not app UI), built for freelancers deciding in minutes whether to trust a tool with their tax records, so credibility is load-bearing: nothing on the page should look decorative for its own sake.

The regional beaver (`/ca`) and eagle (`/us`) mascots are a stamp in the margin of the ledger, not the ledger itself — a light territorial marker rendered large in the hero but never played for cuteness. They wear a cap, hold a receipt, and get out of the way. The system explicitly rejects three things: the generic cream-and-navy fintech template (gradient badges, stock hero illustration), cluttered QuickBooks-era accounting-software density, and an overly playful, mascot-led brand voice that would undercut the seriousness of handling someone's tax documents.

Two token layers coexist in the codebase and should not be confused. The **marketing layer** (`/ca`, `/us`, `/faq`, `/articles` — everything this DESIGN.md governs) hardcodes literal hex/black-alpha values directly in JSX (`bg-[#f5f4f0]`, `text-black/55`, `border-black/[0.07]`). The **shadcn utility layer** (`/login`, `/signup`, legal pages, and every primitive in `components/ui/`) runs on a separate OKLCH grayscale token system (`--background`, `--foreground`, etc.) defined in `styles.css`. Both are real and both ship today; this document describes the marketing layer, which is what carries the brand.

**Key Characteristics:**
- Warm paper background, never bright white, never cream-with-a-gradient
- Near-black ink for text; color is reserved for the one accent, not spread across the palette
- Neutral scale is black/white *alpha*, not named grays — `text-black/55`, `border-black/[0.07]`, `bg-white/[0.04]`
- Exactly one accent color (`#f97316`) carrying ratings, the "Most Popular" badge, and hero punctuation — nothing else competes with it
- Soft, ambient elevation — thin alpha borders and diffuse shadows, glow effects reserved for the hero mascot and footer cursor-follow
- Two regions (CA/US), one visual bar — same system, swapped mascot, currency, and tax-authority copy

## 2. Colors

The palette is almost monochrome by design: paper, ink, void, and one ember accent. Depth and hierarchy come from opacity on black or white, not from additional hues.

### Primary
- **Ember** (`#f97316`): the single accent. Used for the trailing punctuation mark in hero headlines, star ratings, the "Most Popular" pricing badge, and radial glow behind the hero mascot. Never used for body text or large fills.

### Secondary
- **Ember Light** (`#fed7aa`): the "Best Deal" badge background, paired with black text. A quieter second-tier use of the accent hue — reserved for badges, not CTAs.

### Neutral
- **Ink** (`#000000`): primary text color and the fill for high-contrast surfaces (popular pricing card, primary buttons, "Join now" CTA). Applied at full opacity for text, then diluted via alpha for everything else — `text-black/55`+ for body copy and eyebrow labels, `text-black/[0.07]` for hairline borders.
- **Paper** (`#f5f4f0`): the page background across every marketing route. Warm off-white, never pure white — this is the ledger-paper surface everything else sits on.
- **Void** (`#0d0d14`): dark-section background (Trust, Footer, dark CTA strips). Near-black with a faint blue undertone, not a flat `#000`.
- **Surface** (`#ffffff`): card and control backgrounds on light sections; also the ink color on dark sections, diluted the same way (`text-white/50`, `border-white/[0.07]`, `bg-white/[0.04]`).

### Named Rules
**The One Accent Rule.** Ember (`#f97316`) is the only saturated color in the system, used exactly as-is everywhere — no darker or lighter substitutes. If a second saturated hue is tempting, the answer is alpha-black or alpha-white instead, not a new color. White text sits directly on `#f97316` in a few places (badges, the Advantages "Export" panel); this is a deliberate brand-consistency choice made with the contrast tradeoff known — it measures under WCAG AA (~2.8:1) and is not meant to be "fixed" by darkening the fill or switching the text to black.

**The Alpha Neutral Rule.** There is no gray token scale. Every intermediate tone is `black/{opacity}` on light surfaces or `white/{opacity}` on dark surfaces. Text-carrying alpha values must clear WCAG AA (4.5:1 for normal text, 3:1 for large text) against their actual background — `black/55`+ and `white/50`+ are the verified-passing floor for body copy and eyebrow/label text; `black/35`/`white/30` were the site's original label convention but measured under 2.7:1 and were corrected sitewide. This keeps every section — light or dark — tonally consistent with its own background instead of drifting toward a generic gray, without sacrificing legibility.

## 3. Typography

**Display Font:** Inter Tight (with Inter, ui-sans-serif, system-ui fallback)
**Body Font:** Inter (with ui-sans-serif, system-ui fallback)
**Label/Mono Font:** none distinct — labels use Inter at small size with wide tracking

**Character:** Inter Tight for anything that needs to command attention (hero, section headlines, stat numbers, CTA copy) paired with plain Inter for reading copy. Both are geometric-adjacent sans faces from the same family, so the pairing reads as one confident voice rather than two competing ones — appropriate for a "precise" brand that shouldn't feel like it's mixing metaphors.

### Hierarchy
- **Display** (700, `clamp(2.4rem, 6vw, 4.5rem)`, leading 1.06, tracking -0.02em): hero H1 only. One per page.
- **Headline** (600, `clamp(1.875rem, 3vw, 2.75rem)` i.e. `text-3xl sm:text-4xl lg:text-[2.75rem]`, leading tight, tracking -0.02em): section H2s (Pricing, Trust, Faq, etc.).
- **Title** (600, 1rem–1.5rem depending on context): card titles, trust-item headings, stat values at `text-2xl sm:text-3xl lg:text-[2rem]` (700 weight for stat numbers specifically).
- **Body** (400, 1rem–1.125rem, leading relaxed, `text-black/55`+ or `text-white/50`+): all reading copy. Cap at ~65–75ch per the project's own house rules.
- **Label** (600, 0.75rem, tracking-widest, uppercase, `text-black/55`+ or `text-white/50`+): eyebrow copy above section headers, footer column headings, nav "region" text. Must clear 4.5:1 against its background — see the Alpha Neutral Rule.

### Named Rules
**The Two-Font Ceiling Rule.** Only two working fonts: Inter Tight for display/headline/label, Inter for body. A third "systemwide" font would break the restraint the brand personality calls for.

## 4. Elevation

The system is soft and ambient, not flat and not heavily layered. Separation between surfaces comes primarily from thin alpha borders (`border-black/[0.07]` on light, `border-white/[0.07]` on dark); shadows are diffuse and low-contrast, never a hard drop shadow. Glow and blur are reserved for two deliberate moments — the radial orange glow behind the hero mascot and the cursor-follow aurora glow in the footer — so they read as intentional flourishes, not decoration repeated everywhere.

### Shadow Vocabulary
- **Card ambient** (`box-shadow: 0 2px 12px rgba(0,0,0,0.06)`): default resting shadow on light cards (feature grid, pricing card default state).
- **Card hover** (`box-shadow: 0 12px 40px rgba(0,0,0,0.10)`, paired with `-translate-y-0.5`): the interaction response on hover — depth appears only as feedback, not at rest.
- **Nav pill scrolled** (`box-shadow: 0 8px 32px rgba(0,0,0,0.08)`): header pill gains this once the page scrolls past 8px, alongside a border and higher-opacity background.
- **Badge glow** (`box-shadow: 0 4px 12px rgba(249,115,22,0.4)`): "Most Popular" badge only — the one place a shadow carries the accent color instead of black.
- **Mobile drawer** (`box-shadow: 0 16px 48px rgba(0,0,0,0.12)`): elevated overlay surfaces (mobile nav, region dropdown).

### Named Rules
**The Response-Not-Rest Rule.** Elevation increases as a response to interaction (hover, scroll, open state), not as a static decoration. Cards and the nav pill are closer to flat at rest and lift only when touched.

## 5. Components

Buttons, cards, and inputs are precise and understated: pill shapes, thin borders, quiet opacity/background-shift hover states. No bounce, no elastic easing, no dramatic scale changes — motion here confirms an action was received, it doesn't perform.

### Buttons
- **Shape:** full pill (`rounded-full`) for primary/outline CTAs (Log in, Join now, store badges' outer chrome uses `rounded-xl`/12px instead — see Store CTA below).
- **Primary:** `bg-black text-white`, `px-3 py-2`, `font-display font-semibold`; hover fades to `opacity-90`. On dark sections this doesn't invert — primary CTAs stay black-on-white via the surrounding white card, not white-on-void.
- **Outline/Secondary:** `border border-black`, transparent fill, black text; hover `bg-black/5`.
- **Store badges (Apple/Google Play):** `rounded-xl` (12px, not full-pill), `border-black/12`, `h-10`, two-line label (small caps micro-copy over a bold platform name); Apple variant is black-fill/white-text, Google Play is white-fill/black-text with `shadow-sm`.

### Cards
- **Corner Style:** `rounded-3xl` (24px) for pricing cards, `rounded-2xl` (16px) for feature/trust cards.
- **Background:** white on light sections (`border-black/[0.07]`), `white/[0.04]` on dark sections (`border-white/[0.07]`).
- **Shadow Strategy:** Card ambient at rest, Card hover on interaction (see Elevation).
- **Border:** always present as a hairline alpha border, even when a shadow is also applied — the border does the primary separation work, the shadow is secondary.
- **Internal Padding:** `p-6` to `p-7` (24–28px) for standalone cards.
- **Signature variant — Popular Pricing Card:** inverts to `bg-black text-white ring-2 ring-black`, drops the border/shadow treatment entirely since the fill itself provides contrast against the paper background.

### Inputs / Fields
- **Style:** `h-11`, `rounded-xl` (12px), `border border-border`, `bg-background`, `px-4 text-sm`.
- **Focus:** border shifts to `border-primary`, no ring/glow — a quiet, single-property change consistent with the "understated" component philosophy.
- **Placeholder:** `text-muted-foreground` — verify this hits 4.5:1 against the input background per the project's own accessibility bar; don't let placeholder contrast drift below body-text contrast.

### Navigation
- Fixed pill nav (`rounded-[20px]`, `max-w-[760px]`), `backdrop-blur-xl` with `bg-white/40` at rest, tightening to `bg-white/70` + border + shadow once scrolled past 8px. Nav links use `hover:opacity-70` rather than a color or underline change. Mobile collapses into a `rounded-2xl` dropdown drawer beneath the pill, not a full-screen takeover.

### Badges
- **Accent badge** ("Most Popular", "Coming soon"): `bg-[#f97316] text-white`, full pill, paired with Badge glow shadow — the single place the accent carries elevation. Contrast here is intentionally below WCAG AA; see the One Accent Rule.
- **Secondary badge** ("Best Deal"): `bg-[#fed7aa] text-black`, full pill, standard soft shadow (not the accent glow) — a deliberate step down from the primary badge.

## 6. Do's and Don'ts

### Do:
- **Do** keep the page background warm paper (`#f5f4f0`), never pure white and never a cream-with-gradient fintech template.
- **Do** treat `#f97316` as the only saturated color on any given screen; every other tone is black-alpha or white-alpha.
- **Do** keep the beaver/eagle mascots restrained — a large but secondary visual, never staged for cuteness, since credibility with tax records outranks charm (per PRODUCT.md's brand personality: "Trustworthy & precise").
- **Do** let elevation respond to interaction (hover lift, scroll-triggered nav shadow) rather than sitting decoratively on every card at rest.
- **Do** keep the existing eyebrow-label convention (`text-xs font-semibold uppercase tracking-widest`) for section headers and footer columns — it's the site's established, shipped system. Use `text-black/55`+ / `text-white/50`+ for it; the original `/35`/`/30` values measured under 2.7:1 and were corrected sitewide.
- **Do** keep `/ca` and `/us` on one visual bar — same tokens, same components, only mascot/currency/tax-authority copy swaps.

### Don't:
- **Don't** introduce a generic fintech look — cream background, navy text, gradient badges, stock hero illustrations. This is explicitly rejected in PRODUCT.md.
- **Don't** let the page read like dated, dense accounting software (QuickBooks-era clutter). Keep hierarchy clean even in dense content like pricing tables and FAQ.
- **Don't** push the mascots toward an overly playful or cartoonish treatment — no exaggerated expressions, no mascot-led hero copy, no cartoon sound-effect styling.
- **Don't** add a second saturated accent color. If something needs to stand out, use black or white at higher opacity, not a new hue.
- **Don't** invent a named gray scale (`gray-100`, `slate-400`, etc.) — the neutral system is black/white alpha, keyed to whichever background it sits on.
- **Don't** use `border-left`/`border-right` colored stripes, gradient text, or glassmorphism-as-decoration — these are outside this system's vocabulary entirely, not just discouraged.
- **Don't** ship muted/label text under `black/55` or `white/50` — anything lighter measured under WCAG AA's 4.5:1 in a full sitewide sweep.
