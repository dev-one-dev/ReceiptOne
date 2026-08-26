# ReceiptOne — Claude Code Guidelines

## Design System

All tokens live in `src/receiptone-tokens.css`, imported once from
`src/styles.css`. Never redeclare a token in a component, and never add a value
that is not in the scale below.

- **Font display:** Inter Tight (`font-display`)
- **Font sans:** Inter Tight (`font-sans`) — both families resolve to Inter Tight
- **Font mono:** Geist Mono (`font-mono`) — eyebrows, pills, nav, figures. Always uppercase, always 400.
- **Page background:** `bg-paper` (`#f5f4f0`)
- **Dark section background:** `bg-ink` (`#0d0d14`)
- **Accent orange:** `bg-ember` / `text-ember` (`#f97316`), hover `bg-ember-hover` (`#ea6c0a`), amber light `#fed7aa`
- **Max content width:** `max-w-[1200px]`
- **Card style:** `rounded-card border border-hairline shadow-[0_2px_12px_rgba(0,0,0,0.06)]`
- **Card hover:** `hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]`

### Type scale — eight steps, nothing between

| Token | Size | Role |
|---|---|---|
| `text-display` | clamp 44 → 72 | `h1` only. Applied automatically by the role rule. |
| `text-h2` | clamp 36 → 48 | Section headings. Applied automatically. |
| `text-h3` | clamp 24 → 30 | Sub-section headings, standalone block titles. |
| `text-lead` | 20 | Hero subhead, card titles that repeat in a grid. |
| `text-body` | 16 | Carries the page. |
| `text-sm` | 14 | Buttons, secondary text. |
| `text-label` | 12 | Mono eyebrows and pills. |
| `text-nav` | 10 | Mono nav, legal, badges. |

`h1`, `h2` and `h3` are styled by role rules scoped to `[data-interactive-page]`.
**Do not put size, weight, family or tracking utilities on a heading** — set the
attribute on the page shell and let the role apply. Only override when a heading
genuinely needs a different step (e.g. a card title at `text-lead`).

Tracking is bound to size: `tracking-display` (-0.04em) at 36px and above,
`tracking-h3` (-0.025em) at 24–30, `tracking-body` (0) at 20 and below,
`tracking-mono` (0.025em) for all uppercase mono. Line-height comes from the
step — do not add `leading-*`.

### Eyebrows

Every section label above a heading uses `.eyebrow` — mono, 12px, uppercase,
+0.025em, weight 400, ink at 60%. On dark sections add `text-white/50`. Never
rebuild the treatment out of utilities.

### Weights — ceiling is 600

`font-normal` (400), `font-medium` (500), `font-semibold` (600). **600 is the
heaviest weight on the page.** 700 and 800 are not fetched, so `font-bold` would
render as faux bold.

### Radii — two, nothing between

`rounded-card` (12px) and `rounded-pill`. No other radius.

### Color — one ink at varying alpha

Muted text is ink at reduced alpha, never a separate gray:
`text-ink-80` / `text-ink-60` / `text-ink-40`, surfaces `bg-ink-05` / `bg-ink-10` /
`bg-ink-20`. Every hairline border is `border-hairline`. Do not introduce a gray
hex or a new black-alpha value.

Ember on paper is ~2.9:1 — below the 4.5:1 floor. Use it as a fill or a border
with ink on top; never as running text on a light background.

---

## Page Spacing — Standard Scale

Use these values for **all new standalone pages** (e.g. `/articles`, `/about`, `/faq`).
The goal is a compact, information-dense layout — not an airy marketing scroll.

### Page hero (below fixed header)

```
pt-24 pb-4          ← top clears the fixed header; minimal bottom air
```

Breadcrumb below the eyebrow label: `mb-2`

### Section wrapper

```
py-6 sm:py-8 lg:py-10
```

Never use `py-16`, `py-20`, or `py-24` on interior pages — those are reserved for the main landing page hero sections.

### Section header (eyebrow + h2 + subtitle)

```
mb-4                ← gap between header block and content below
gap-2               ← between left text and right "see all" link
mt-1                ← eyebrow → h2
mt-2                ← h2 → subtitle paragraph
```

### Grid gaps (card grids, column layouts)

```
gap-3               ← between cards
mt-3                ← between grid rows
```

### CTA / dark strip sections

```
py-6 sm:py-8
mt-2                ← eyebrow → h2
mt-2                ← h2 → body text
mt-4                ← body text → button row
```

---

## Card Internal Spacing

### Featured card (large, 2/3-width)

```
p-4 sm:p-5         ← content padding
mt-2               ← pill → title
mt-1.5             ← title → excerpt
mt-3               ← excerpt → meta row
mt-3               ← meta row → CTA link
```

### Small card (compact, sidebar or grid)

```
p-3                ← content padding
mt-1.5             ← pill → title
pt-2               ← title → meta row (mt-auto pushes it down)
```

---

## Footer Spacing

```
pt-8 pb-4 lg:pt-10     ← outer container
gap-6                   ← main grid (brand col + nav cols)
gap-4                   ← between nav columns
mt-3                    ← logo → tagline
mt-4                    ← tagline → social icons
mt-2 space-y-1.5        ← column heading → link list / between links
mt-6 pt-4 gap-2         ← bottom bar (border-t row)
gap-4                   ← between bottom-bar legal links
```

---

## Landing Page Section Spacing

The landing page uses **asymmetric padding** to visually group related sections together. The pattern:

- Full padding on the "opening" side of a section
- Compressed padding (`pb-4 sm:pb-6`) on the "closing" side when the next section is a visual continuation

### Current groupings (ca.tsx order)

| Section | Relationship | Padding |
|---|---|---|
| HowItWorks | standalone | `py-8 lg:py-12` |
| InfoCards | opens group | `pt-16 pb-4 sm:pt-20 sm:pb-6` |
| NotAll | closes group above / opens below | `pt-4 pb-4 sm:pt-6 sm:pb-6` |
| Testimonials | closes group | `pt-4 pb-12 sm:pt-6 sm:pb-16` |
| Trust (dark) | standalone | `pt-12 pb-6 sm:pt-16 sm:pb-8` |
| Integrations | hugs Trust, hugs Pricing | `pt-4 pb-4 sm:pt-6 sm:pb-6` |
| Pricing | hugs Integrations | `pt-4 pb-4 sm:pt-6 sm:pb-6` |
| Faq | hugs Pricing | `pt-4 pb-10 md:pt-6 md:pb-14` |

### Rules

- Grouped sections: **pb-4 sm:pb-6** on the section above, **pt-4 sm:pt-6** on the section below → ~32px total gap
- Dark sections (Trust): keep at least **pb-6 sm:pb-8** so the dark bg doesn't feel truncated
- Standalone sections: use symmetric `py-12 sm:py-16` or `py-16 sm:py-20`
- Never use `py-16` or larger on interior pages (reserved for landing page only)

---

## What NOT to use on interior pages

| Class | Use instead | Note |
|---|---|---|
| `py-16` / `py-20` / `py-24` | `py-6` / `py-8` / `py-10` | Landing hero only |
| `pt-32` | `pt-24` | Header clearance is 24, not 32 |
| `mb-10` | `mb-4` | Section header bottom gap |
| `gap-5` / `gap-8` / `gap-12` | `gap-3` / `gap-4` / `gap-6` | Cards / nav cols / main grid |
| `mt-5` / `mt-8` / `mt-16` | `mt-3` / `mt-4` / `mt-6` | Internal and footer margins |
| `space-y-3` (footer lists) | `space-y-1.5` | Footer nav link lists |

---

## Banned everywhere on the marketing surface

These reintroduce the vocabulary the token migration removed. The eight-step
scale, the 600 ceiling and the two radii are the point — do not add a ninth
step, a heavier weight, or a third radius.

| Class | Use instead | Note |
|---|---|---|
| `text-xs` / `text-base` / `text-lg` / `text-xl` | `text-label` / `text-body` / `text-lead` | Off-scale aliases |
| `text-2xl` … `text-6xl` | `text-h3` / `text-h2` / role rule | Headings are role-driven |
| `text-[13px]` and any arbitrary size | nearest of the eight steps | No new steps |
| `font-bold` / `font-extrabold` / `font-black` | `font-semibold` | 700+ is not fetched — renders faux bold |
| `rounded-sm` … `rounded-3xl`, `rounded-full` | `rounded-card` / `rounded-pill` | Two radii only |
| `rounded-[20px]` and any arbitrary radius | `rounded-card` | |
| `text-black/55`, `text-black/70`, any gray hex | `text-ink-60` / `text-ink-80` | One ink at alpha |
| `border-black/10`, `border-black/[0.07]` | `border-hairline` | One hairline |
| `bg-[#f97316]` / `bg-[#f5f4f0]` / `bg-[#0d0d14]` | `bg-ember` / `bg-paper` / `bg-ink` | Use the token |
| `leading-*` on token-sized text | nothing | Line-height comes from the step |
| `tracking-tight` / `tracking-widest` | `tracking-display` / `tracking-h3` / `tracking-body` / `tracking-mono` | Tracking is size-bound |
| hand-built uppercase labels | `.eyebrow` | One eyebrow treatment |

**Out of scope for these rules:** `src/routes/dashboard*`,
`src/components/dashboard/**`, `src/components/ui/**`, `src/components/helpdesk/**`,
`src/routes/helpdesk*`, `/terms`, `/privacy`, `/login`, `/signup`, and
`SuggestFeatureWidget` (which lives in `components/site` but renders only in the
dashboard). Those surfaces use shadcn semantic theming and the `--radius-*` ramp
in `styles.css`; leave them alone.
