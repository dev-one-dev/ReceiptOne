---
target: /ca landing page
total_score: 30
p0_count: 0
p1_count: 3
timestamp: 2026-07-02T22-04-03Z
slug: src-routes-ca-tsx
---
Method: dual-agent (isolated Assessment A design review + Assessment B detector/evidence sub-agents)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Solid — `useLayoutEffect`-gated store-CTA avoids hydration flash, header scroll state, widget loading/toast states |
| 2 | Match System / Real World | 3 | CRA/GST/HST/PST terminology correct throughout; docked for unsourced hero stat bar |
| 3 | User Control and Freedom | 3 | Escape/click-outside works everywhere except the feature widget (deliberate) |
| 4 | Consistency and Standards | 2 | Muted-text alpha values used ad hoc (`/35,/40,/45,/50,/55,/60,/65,/70`); FAQ header breaks the page's own section-header pattern |
| 5 | Error Prevention | 3 | Only real input (feature widget) has min-length + char-cap validation |
| 6 | Recognition Rather Than Recall | 3 | Sticky nav; minor "Benefits" label collision between two sections |
| 7 | Flexibility and Efficiency | 4 | Responsive scroll-offset math, region switcher preserves context |
| 8 | Aesthetic and Minimalist Design | 2 | 11 consecutive near-identical feature cards (InfoCards + NotAll) with no pacing break |
| 9 | Error Recovery | 3 | Specific, human toast copy on the one form present |
| 10 | Help and Documentation | 4 | FAQ is genuinely tax-specific domain content, not filler |
| **Total** | | **30/40** | **Good — address weak dimensions** |

## Anti-Patterns Verdict

**LLM assessment**: Mostly clean. Real bespoke engineering exists (FAQ accordion animation-stability work, scroll-offset-aware nav). Three checklist items land: the hero 5-stat bar is the textbook SaaS trust-strip pattern (unsourced numbers cut against a "precision" brand); `HowItWorks`' ghost `01/02/03` numerals are reflex scaffolding adding no information; and InfoCards→NotAll stacks 11 near-identical feature cards back to back with no pacing break.

**Deterministic scan**: `detect.mjs` returned **exit 0, zero findings** across all 13 files. This is expected, not a contradiction — the regex/structural engine doesn't wire up contrast checking without a rendered DOM (that's what the manual sweep below exists to cover). No false positives to flag since there were no findings.

**Manual contrast sweep** (fills the gap the CLI scan can't cover): 45 distinct text-color/background combinations checked by hand using the WCAG formula. **21 fail, 24 pass.** 10 of the failures are the exact `black/35`/`black/40`/`white/30` values already identified and fixed in Pricing — confirming the systemic pattern predicted in that earlier audit. 11 are new distinct failing values (`black/45`, `black/50` ×6, and two brand-new colored-background cases). Worst single case: `Advantages.tsx:104`, white text at 60% opacity on the `#f97316` ember "Export" card — **≈1.85:1**, roughly 2.4x under the AA floor, a different and more severe failure mode than the black/white-on-neutral pattern already fixed elsewhere.

## Overall Impression

The page is well-engineered where it counts (nav offset math, FAQ animation polish, real localized copy) and the card/type system is applied with genuine restraint. But it's undermined by a systemic, unaddressed contrast problem that's broader than the one component already fixed, and by a content-pacing problem that runs 11 near-identical feature cards before the page ever mentions security or CRA compliance — the exact reassurance a first-time visitor deciding whether to trust a tax tool is looking for.

## What's Working

1. **Scroll-offset-aware anchor navigation** (`Header.tsx:70-84`) computes a live 88px/104px offset via `matchMedia` so anchor jumps never land under the fixed header pill at any breakpoint — real engineering most marketing sites skip.
2. **FAQ accordion animation-stability work** (`Faq.tsx:130-251`) — inline comments document specific bugs found and fixed (card-lift jump, icon-scale pop, answer bounce) by narrowing `transition-all` to exact properties. Uncommonly disciplined for a marketing FAQ.
3. **Specific, real testimonial copy** (`Testimonials.tsx:13-38`) — quotes reference actual mechanics ("GST/HST used to be a nightmare") with plausible names, cities, job titles, reading as considered content rather than filler.

## Priority Issues

**[P1] Systemic WCAG AA contrast failure on secondary/label text, only partially fixed**
Why it matters: 21 of 45 sampled text/background combinations fail 4.5:1 (down to as low as 2.4-2.8:1), spanning `HowItWorks`, `Testimonials`, `Advantages` (×4 via `CardLabel`), `Trust`, `Footer` (×5), `SuggestFeatureWidget` (×5). `DESIGN.md` itself still codifies the failing `black/35`/`white/30` values as canonical — directly contradicted by Pricing's own recent fix to `black/55`, which was never rolled out further. Worst case: `Advantages.tsx:104`, white/60 on `#f97316` ≈1.85:1.
Fix: Roll the `black/55`+ / `white/50`+ pattern out to every location in the sweep; update `DESIGN.md`'s eyebrow-label spec to match.
Suggested command: `/impeccable polish`

**[P1] Two hardcoded off-system gray values break the documented "no named gray scale" rule**
Why it matters: `Faq.tsx:242` (`text-[#7e8890]`, every FAQ answer) and `InfoCards.tsx:91` (`text-neutral-700`, every feature card body) both bypass the black/white-alpha-only convention `DESIGN.md` explicitly mandates. Not a contrast failure on their own, but a system-purity defect that will keep recurring if unaddressed.
Fix: `text-black/60` and `text-black/70` respectively (both verified to pass AA at their sizes).
Suggested command: `/impeccable polish`

**[P1] Persistent floating "Suggest a feature" button competes with the primary conversion path**
Why it matters: Renders on every screen from the hero onward, sitting in the mobile thumb zone with equal or greater visual persistence than the actual trial/signup CTA. For a page whose entire job is converting a first-time visitor, giving a retention/roadmap tool that much real estate over acquisition CTAs is a mismatched priority.
Fix: Suppress above a scroll threshold (e.g. only appear once Pricing/FAQ is reached), or move it off the marketing route.
Suggested command: `/impeccable layout`

**[P2] FAQ section header breaks the page's own established section-header convention**
Why it matters: Every other section uses eyebrow + `text-3xl sm:text-4xl lg:text-[2.75rem]` headline. `Faq.tsx:271-283` instead uses a black pill badge and a bespoke `text-[28px]→text-[56px]` heading exceeding `DESIGN.md`'s documented 44px Headline ceiling — reads as designed in a separate pass.
Fix: Replace with the standard eyebrow + headline pattern used everywhere else on the page.
Suggested command: `/impeccable typeset`

**[P3] Illegible store-badge microcopy and sub-44px touch targets**
Why it matters: `text-[7-9px]` sub-labels on App Store/Google Play badges (TopBanner, Pricing, Footer) sit below common legibility thresholds; mobile hamburger (`Header.tsx:234`, 40px), region-switcher trigger (~32-36px), social icons (36px), and the widget's close button (~24px) all fall under the 44px recommended touch target (though all clear WCAG 2.2's 24px minimum).
Fix: Bump microcopy to 10px+ minimum; bump touch targets toward 44px where feasible.
Suggested command: `/impeccable adapt`

## Persona Red Flags

**Jordan (confused first-timer, sizing up trust with tax records)**: Hits the unsourced stat bar in the first two seconds with no way to verify any number. Has to scroll past 11 feature cards (InfoCards + NotAll) before reaching `Trust.tsx`'s "bank-grade encryption / CRA-compliant" reassurance — the section she's specifically looking for is buried past the halfway point.

**Riley (stress-tester — fast scroll, resize, edge cases)**: The region-switcher trigger (`Header.tsx:156-166`) computes to roughly 30px tall, next to the hamburger in a tight cluster — a real miss risk on a real phone. Pricing's decorative peek-image snaps size abruptly across the `sm:` breakpoint rather than scaling continuously (contained by `overflow-hidden`, so no layout break, just a visible jump).

**Priya — Canadian freelancer, tax-season stress, skimming on her phone during a break**: If she stops scrolling before screen 4-5 (a plausible "quick break" outcome), she never sees `Trust.tsx` at all — the one section that directly answers "can I trust this with my tax records" may never render in her session. The `text-[8px]` store-badge microcopy is likely unreadable at arm's length during a fast skim.

## Minor Observations

- Duplicate "Benefits" labeling: nav links to `InfoCards` (`id="benefits"`), but `Advantages.tsx` also self-labels "Benefits" on a separately-`id`'d section — minor recognition friction.
- The "Most Popular" badge fill was recently darkened to `#c2410c` for contrast, but its glow shadow (`Pricing.tsx:285`) is still tinted to the old lighter ember — a small mismatch between a badge's surface color and its own shadow.
- `NotAll.tsx:103` uses yet another distinct alpha value (`black/40`) for a divider header, suggesting these values are picked ad hoc per component rather than from a fixed small set.

## Questions to Consider

- Given `DESIGN.md` explicitly documents `black/35`/`white/30` as *the* canonical label color, and Pricing's own fix quietly contradicts that spec — should the fix roll out everywhere, or was Pricing's change actually meant to be a scope-limited exception the spec should carve out instead?
- Is the floating feature-suggestion widget meant to live on the public marketing route at all, or did it leak from an in-app context?
- Is there appetite to attach even a light citation ("since launch") to the hero stat bar, given the brand's entire differentiator is precision?
