# ReceiptOne — Claude Code Guidelines

## Design System

- **Font display:** Inter Tight (`font-display`)
- **Font sans:** Inter (`font-sans`)
- **Page background:** `bg-[#f5f4f0]`
- **Dark section background:** `bg-[#0d0d14]`
- **Accent orange:** `#f97316` / amber light `#fed7aa`
- **Max content width:** `max-w-[1200px]`
- **Card style:** `rounded-2xl border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.06)]`
- **Card hover:** `hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]`

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
| Advantages | hugs Trust, hugs Pricing | `pt-4 pb-4 sm:pt-6 sm:pb-6` |
| Pricing | hugs Advantages | `pt-4 pb-4 sm:pt-6 sm:pb-6` |
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
