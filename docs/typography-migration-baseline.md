# Typography migration — BEFORE baseline

Captured on branch `dev`, cut from `main` at commit 894ae63, prior to any edit.

> **Derivation note — read this before comparing.**
> These are **statically derived**, not browser-measured. The Chrome extension was
> not available in the session that produced this file, and there is no local dev
> server on this project. Every value below is computed from the element's class
> string plus Tailwind v4 default theme values and the radius ramp in
> `src/styles.css` (`--radius: 0.625rem`). No class in the BEFORE state uses
> `clamp()` except the TopBanner `h1`, and no value depends on container queries,
> so the 390px / 1440px columns are exact. What is **not** verified here is actual
> rendering: font fetch success, fallback synthesis, and subpixel metrics.
> Treat this as a spec-level baseline, not a measurement.

Breakpoints: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280.
At **390px** only base classes apply. At **1440px** all of `sm/md/lg/xl` apply.

---

## 1. `h1` — hero headline

`src/components/site/TopBanner.tsx:17`

```
font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.06] tracking-tight text-black
```

| Property | @390px | @1440px |
|---|---|---|
| font-family | Inter Tight | Inter Tight |
| font-size | **38.4px** (clamp floor; 6vw = 23.4px) | **72px** (clamp ceiling; 6vw = 86.4px) |
| line-height | 1.06 → 40.7px | 1.06 → 76.32px |
| letter-spacing | -0.025em | -0.025em |
| font-weight | **700** | **700** |
| color | `rgb(0 0 0)` | `rgb(0 0 0)` |

## 2. `h2` — canonical section heading

`src/components/site/HowItWorks.tsx:66` — this exact string appears in 8+ components.

```
mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]
```

| Property | @390px | @1440px |
|---|---|---|
| font-family | Inter Tight | Inter Tight |
| font-size | **30px** (`text-3xl`) | **44px** (`lg:text-[2.75rem]`) |
| line-height | 1.25 → 37.5px | 1.25 → 55px |
| letter-spacing | -0.025em | -0.025em |
| font-weight | 600 | 600 |
| color | `rgb(0 0 0)` | `rgb(0 0 0)` |

> The identical string is used on `<h1>` in six components. h1 and h2 are
> typographically indistinguishable in the BEFORE state. This is the defect the
> migration exists to fix.

## 3. `h3` — feature block heading

`src/components/site/InfoCards.tsx:101`

```
mt-3 font-display text-3xl font-semibold tracking-tight text-black sm:text-4xl
```

| Property | @390px | @1440px |
|---|---|---|
| font-family | Inter Tight | Inter Tight |
| font-size | **30px** (`text-3xl`) | **36px** (`sm:text-4xl`) |
| line-height | 1.2 (default) → 36px | 1.1111 (default) → 40px |
| letter-spacing | -0.025em | -0.025em |
| font-weight | 600 | 600 |
| color | `rgb(0 0 0)` | `rgb(0 0 0)` |

> `h3` at 30px equals `h2` at 30px on mobile. Three heading levels collapse to one
> size at 390px.

## 4. Body copy

`src/components/site/InfoCards.tsx:104`

```
mt-4 text-base leading-relaxed text-black/70
```

| Property | @390px | @1440px |
|---|---|---|
| font-family | **Inter** (via `font-sans` on the page shell) | Inter |
| font-size | 16px | 16px |
| line-height | 1.625 → 26px | 1.625 → 26px |
| letter-spacing | 0 (normal) | 0 |
| font-weight | 400 | 400 |
| color | `rgb(0 0 0 / 0.7)` | `rgb(0 0 0 / 0.7)` |

Most-common body variant sitewide is `text-sm text-black/55` (141 + 65 uses):
14px / 1.4286 → 20px, `rgb(0 0 0 / 0.55)`.

## 5. Primary button

Ember CTA — `src/routes/articles/index.tsx:118` (5 identical instances)

```
inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3 font-sans text-sm font-semibold text-white
hover:bg-[#ea6c0a] hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)]
```

| Property | @390px | @1440px |
|---|---|---|
| font-family | Inter | Inter |
| font-size | 14px | 14px |
| line-height | 1.4286 → 20px | 20px |
| font-weight | 600 | 600 |
| color | `rgb(255 255 255)` | same |
| background | `#f97316` | same |
| hover background | `#ea6c0a` | same |
| border-radius | **9999px** | 9999px |
| padding | 12px 24px | 12px 24px |

Light-on-dark CTA — `src/components/site/FinalCta.tsx:27`:
`rounded-full bg-white px-7 py-3.5 font-display text-base font-semibold text-black`
→ Inter Tight 600, 16px/24px, radius 9999px, padding 14px 28px.

## 6. Card

Standard card per CLAUDE.md — `border border-black/[0.07]` variant, 28 instances:

```
rounded-2xl border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.06)]
```

| Property | @390px | @1440px |
|---|---|---|
| border-radius | **18px** (`--radius` 0.625rem + 8px) | 18px |
| border | 1px solid `rgb(0 0 0 / 0.07)` | same |
| box-shadow | `0 2px 12px rgba(0,0,0,0.06)` | same |
| background | `#fff` | `#fff` |

Large feature card — `src/components/site/InfoCards.tsx:94`
`rounded-3xl bg-white p-8 shadow-sm lg:p-12` → **22px** radius, padding 32px → 48px.

Step card — `src/components/site/HowItWorks.tsx:78`
`rounded-3xl border border-black/[0.07] p-6 sm:p-8` → **22px** radius.

## 7. Eyebrow

`src/components/site/HowItWorks.tsx:63` — the dominant pattern, 10 instances on paper.

```
font-sans text-xs font-semibold uppercase tracking-widest text-black/55
```

| Property | @390px | @1440px |
|---|---|---|
| font-family | **Inter** | Inter |
| font-size | 12px | 12px |
| line-height | 1.3333 → 16px | 16px |
| letter-spacing | **0.1em** → 1.2px | 0.1em |
| font-weight | **600** | 600 |
| text-transform | uppercase | uppercase |
| color | `rgb(0 0 0 / 0.55)` | same |

Dark-section variant (`Footer.tsx:127,150,169`, `Trust.tsx:87`):
`font-display text-sm ... text-white/50` → Inter Tight 600, **14px**, `rgb(255 255 255 / 0.5)`.
Ember variant (`InfoCards.tsx:98`): same metrics, `color: #f97316`.

---

## Fonts fetched in the BEFORE state

`src/routes/__root.tsx:52-53`

```
https://fonts.googleapis.com/css2
  ?family=Inter:wght@400;500;600;700
  &family=Inter+Tight:wght@500;600;700;800
  &display=swap
```

Inter Tight has **no 400** in the BEFORE state.

## Expected deltas (for spot-checking the AFTER state)

| Element | Change |
|---|---|
| h1 @1440 | 72px → 72px (unchanged); weight **700 → 600**; tracking -0.025 → **-0.04em** |
| h1 @390 | 38.4px → **44px** |
| h2 @390 / @1440 | 30 → **36px** / 44 → **48px** |
| h3 @390 / @1440 | 30 → **24px** / 36 → **30px** |
| Body | Inter → **Inter Tight**; `black/70` → `ink-80` |
| Eyebrow | Inter 600 / 0.1em → **Geist Mono 400 / 0.025em**; `black/55` → `ink-60` |
| Card radius | 18px and 22px → **12px** |
| Button radius | 9999px (unchanged) |
