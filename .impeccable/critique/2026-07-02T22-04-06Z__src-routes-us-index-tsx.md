---
target: /us landing page
total_score: 29
p0_count: 0
p1_count: 4
timestamp: 2026-07-02T22-04-06Z
slug: src-routes-us-index-tsx
---
Method: dual-agent (isolated Assessment A design review + Assessment B detector/evidence sub-agents)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Same platform-aware store-CTA discipline as CA (shared component) |
| 2 | Match System / Real World | 4 | Real US tax vocabulary (IRS, Schedule C, 1099, sales tax) threaded through copy, not a currency-symbol reskin |
| 3 | User Control and Freedom | 3 | Region switcher preserves context; widget has explicit close |
| 4 | Consistency and Standards | 2 | Same ad hoc alpha-value sprawl as CA (shared files), compounded by two dead component files documented as live in README.md |
| 5 | Error Prevention | 3 | n/a mostly — same one form as CA |
| 6 | Recognition Rather Than Recall | 3 | Nav, plans, terms all self-evident |
| 7 | Flexibility and Efficiency | 3 | Anchor nav, region switch, mobile drawer functional |
| 8 | Aesthetic and Minimalist Design | 2 | CTA surfaces accumulate toward the bottom of the page (hero, Advantages, Pricing ×2, Footer ×1, plus the floating widget) |
| 9 | Error Recovery | 3 | Same toast-error handling as CA |
| 10 | Help and Documentation | 3 | FAQ + Help Center link |
| **Total** | | **29/40** | **Good — address weak dimensions** |

## Anti-Patterns Verdict

**LLM assessment**: Clean on gradient text, decorative glassmorphism, side-stripe borders. The card-recipe repetition across 7 sections is the project's own documented, deliberately consistent system — not slop. Minor reflex scaffolding in `HowItWorks`' ghost `01/02/03` numerals. The hero 5-stat bar is borderline but justified (concrete finance-relevant numbers, not vanity metrics). One real, unverified layout risk: the hero mascot video (`w-[190%] max-w-none`, no responsive override) was evidently composed for the desktop half-column bleed and may crop more aggressively than intended once the grid collapses to single-column on mobile.

**Deterministic scan**: `detect.mjs` returned **exit 0, zero findings** — confirmed as a genuine clean result (the detector's alt-check against a synthetic Papyrus-font violation correctly fired, so this isn't a silent no-op). Same known coverage gap on contrast as the CA report.

**Manual contrast sweep**: Confirms the CA findings carry over **verbatim** on the eyebrow/label pattern (same shared files, same classes — `black/35`≈2.4:1, `white/30`≈2.66:1, `black/40`≈2.85:1), plus the same two hardcoded gray violations (`Faq.tsx:242`, `InfoCards.tsx:91`) and several new alpha instances (`black/45`, `black/50` ×5+, `black/55` on the amber accent panel at a borderline 4.40:1). The CA report's worst case (`Advantages.tsx:104`, white/60 on `#f97316` ≈1.85:1) is the same shared file with zero confirmed numeric drift between regions, so it applies identically here even though it wasn't independently re-itemized in this pass.

**Critical wiring finding, independently confirmed by both assessments**: `TopBannerUS.tsx` and `NotAllUS.tsx` are **fully orphaned dead code** — zero imports anywhere in the app. The live `/us` hero renders through the exact same `TopBanner.tsx` component as `/ca` (via `region="us"`), not `TopBannerUS.tsx`. This was caught independently by both the design-review agent and the detector/evidence agent, which is strong corroboration.

## Overall Impression

Code-level parity between `/ca` and `/us` is excellent — the detector's region-drift check found **zero** numeric class differences in any shared component; only text, data, and images swap. The real story on `/us` is that the design system's own documentation (including `DESIGN.md`, written earlier this session) describes a signature detail — the handwritten "Grape Nuts" hero annotation — that doesn't exist on the page visitors actually see, because it lives entirely in a dead file. Beyond that, this page inherits every systemic issue found on `/ca` (same shared components), landing at nearly the same health score.

## What's Working

1. **Real localization, not reskinning.** `HowItWorks`, `Trust`, `Advantages`, and `Faq`'s US copy swaps actual tax mechanics (CRA/GST/PST → IRS/Schedule C/1099/sales tax), not just currency symbols — exactly the "restrained regional touch" the brand calls for.
2. **The platform-aware store CTA is well-engineered** (`Pricing.tsx:20`) — `useLayoutEffect` deliberately commits the OS-specific badge before paint to avoid a flash, evidence the recent Pricing fix pass was thorough.
3. **The card system is applied with real restraint** — one shadow/border/radius recipe reused verbatim across seven sections instead of each inventing its own style.

## Priority Issues

**[P1] `TopBannerUS.tsx`/`NotAllUS.tsx` are orphaned dead code; the documented signature hero detail doesn't ship**
Why it matters: `DESIGN.md` states the one rare handwritten `font-script` accent "appears once, in the US hero." That annotation, a dashed-loop arrow, and a "Claim your free trial" CTA exist only in `TopBannerUS.tsx` (never imported). The live hero (`TopBanner.tsx`, region="us") has none of it — different H1, different layout, no script caption. `README.md` still documents both dead files as live, which will mislead the next contributor (human or agent) into "fixing" the wrong file, exactly as nearly happened when `DESIGN.md` was written this session.
Fix: Either port the annotation treatment into the live `TopBanner.tsx` US branch, or delete the dead files and correct `DESIGN.md`/`README.md` to stop describing them as shipping.
Suggested command: `/impeccable harden`

**[P1] Systemic WCAG AA contrast failure, confirmed to carry over verbatim from `/ca`**
Why it matters: Same shared-component failures as CA — worst on `Trust.tsx:90` ("Security & compliance" eyebrow, ≈2.66:1) — the exact section built to reassure a taxpayer about data safety is mechanically the hardest text on the page to read. `Advantages.tsx`'s ~1.85:1 worst-case applies here too (same file, zero drift).
Fix: Same as CA — roll `black/55`+/`white/50`+ out everywhere; update `DESIGN.md`.
Suggested command: `/impeccable polish`

**[P1] Same two hardcoded gray values, confirmed live on `/us`**
Why it matters: `Faq.tsx:242` and `InfoCards.tsx:91` render identically on both regions (shared files).
Fix: Same as CA.
Suggested command: `/impeccable polish`

**[P1] Same persistent floating widget issue, with an added mobile-specific overlap**
Why it matters: At the bottom of a scroll on mobile, the widget sits in the same screen quadrant as the Footer's own store-badge install CTAs — competing with the page's actual conversion action at the exact moment a visitor is deciding to install.
Fix: Same as CA.
Suggested command: `/impeccable layout`

**[P2] Hero mascot video has no responsive override — verify on a real mobile device**
Why it matters: `TopBanner.tsx:130`'s `w-[190%] max-w-none` is unscoped by breakpoint. Intentional on desktop (half-column bleed); on mobile the same column is nearly full viewport width, so the same ratio likely over-crops the mascot with no visible signal (silently clipped by `overflow-x-clip`).
Fix: Scope the oversize treatment to `lg:` and use a smaller mobile-appropriate width.
Suggested command: `/impeccable adapt`

## Persona Red Flags

**Jordan (confused first-timer)**: Reaches `Trust.tsx` looking for reassurance about handing over financial data and finds the least legible text on the page for the exact label announcing that section. Also may mistake the floating widget for a chat/support tool — it's the only persistent chrome-like element outside the header, with no onboarding context.

**Riley (stress-tester)**: Resizing across the `lg:1024px` breakpoint flips the hero from stacked to two-column, changing how the fixed-ratio mascot video crops — worth an actual resize test rather than a static read.

**US 1099 contractor, tax-season stress, skimming on phone during a break**: Copy is genuinely on-target (Schedule C, 1099, sales tax). But a fast scroll passes through several near-invisible eyebrow labels doing wayfinding work, lands on `Trust.tsx` right as its label is hardest to read, and if she reaches the bottom to install, the floating widget sits over the Footer's store badges.

## Minor Observations

- Store-badge microcopy shrinks progressively across the page: 8px (hero) → 9px (Pricing) → 7px (Footer) — the Footer instance is smaller than either already-flagged instance and effectively illegible at normal zoom.
- `InfoCards.tsx` renders its section headline as a raster PNG bled full-width via `mix-blend-multiply` — not selectable, no text fallback if the image fails to load.
- `Advantages.tsx`'s "Export" card has no region-conditional copy while every sibling card does — an inconsistent pattern, though the copy itself needs no localization there.

## Questions to Consider

- Was collapsing `TopBanner`/`TopBannerUS` and `NotAll`/`NotAllUS` into single region-prop components a deliberate decision that silently stranded the signature annotation in dead files, or should it be restored?
- Why is `Trust.tsx` — the section built explicitly to lower a taxpayer's anxiety — the least legible section on the page? Was this ever visually QA'd against the design system's own stated contrast intent?
- Does the floating "Suggest a feature" button earn permanent screen real estate on a storefront page with zero conversion value, given it structurally sits on top of the Footer's install CTAs on every mobile viewport?
