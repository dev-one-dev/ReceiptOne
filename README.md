# ReceiptOne — Landing Page

Marketing site for **ReceiptOne**, a tax-ready expense tracking and receipt management app for freelancers and small businesses in Canada and the USA.

Built with TanStack Start (React 19) and Tailwind CSS v4. The site is static marketing only: sign-in, sign-up and the signed-in product live in the web app on `app.receipt-one.com`. The contact form and the feature-idea widget call the web portal's Firebase Cloud Functions.

See [CHANGELOG.md](./CHANGELOG.md) for what changed in September 2026.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Origins and Redirects](#origins-and-redirects)
- [Features](#features)
- [Backend](#backend)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Known Issues](#known-issues)

---

## Overview

This repository is the public-facing landing site for ReceiptOne. It serves two regional storefronts:

- `/ca` — Canada (beaver mascot, CAD pricing, CRA tax context)
- `/us` — United States (eagle mascot, USD pricing, IRS tax context)

The site includes:
- Regional landing pages with hero video, feature highlights, pricing, and FAQ
- Articles and FAQ pages per region
- A contact form (`/contact`, `/us/contact`) that files a support request in the web portal
- A feature suggestion widget with anonymous community voting (no account required) — component kept, currently not mounted on any route
- A referral landing (`/r/:code`) that records the code and forwards to the app's signup
- Legal pages (Privacy Policy, Terms of Use)

The landing has **no auth and no dashboard of its own**. `/login`, `/signup`, `/dashboard/*` and `/helpdesk*` were removed in September 2026 and 301 to the web app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) 1.167 (React 19, SSR) |
| Router | [TanStack Router](https://tanstack.com/router) — file-based routing |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 + shadcn/ui (New York) |
| Icons | [Lucide React](https://lucide.dev) |
| Backend | Firebase Cloud Functions + Firestore (project `check-app-a93a2`, owned by the web portal repo) |
| Bot protection | Firebase App Check (reCAPTCHA v3) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |
| QR codes | [qrcode.react](https://github.com/zpao/qrcode.react) |
| Build | [Vite](https://vitejs.dev) 7 via `@lovable.dev/vite-tanstack-config` |
| OG image | [Playwright](https://playwright.dev) (dev dependency, `npm run og`) |
| Deploy | [Vercel](https://vercel.com) (Nitro preset) |
| Language | TypeScript 5.8 (strict mode) |

---

## Project Structure

```
figma-craft-39/
├── src/
│   ├── routes/                     # TanStack Router file-based routes
│   │   ├── __root.tsx              # Root document shell (html/head/body)
│   │   ├── index.tsx               # Redirects / → /ca
│   │   ├── ca.tsx                  # Canada landing page
│   │   ├── us.tsx                  # USA landing page
│   │   ├── us/                     # US variants: index, contact, faq, articles/
│   │   ├── articles/               # Article index + $slug (CA)
│   │   ├── faq.tsx                 # FAQ page (CA)
│   │   ├── contact.tsx             # Contact form (CA)
│   │   ├── r/$code.tsx             # Referral landing → app signup
│   │   ├── privacy.tsx             # Privacy Policy
│   │   └── terms.tsx               # Terms of Use
│   ├── components/
│   │   ├── site/                   # Page section components
│   │   │   ├── Header.tsx          # Fixed nav with region switcher
│   │   │   ├── TopBanner.tsx       # Hero section, region-aware (beaver/eagle, video)
│   │   │   ├── Numbers.tsx         # Animated stats marquee
│   │   │   ├── InfoCards.tsx       # Benefits section (region-aware)
│   │   │   ├── NotAll.tsx          # Feature grid (region-aware)
│   │   │   ├── Advantages.tsx      # Feature comparison (shared)
│   │   │   ├── AppBanner.tsx       # App download CTA + QR code
│   │   │   ├── Pricing.tsx         # Pricing table
│   │   │   ├── Faq.tsx             # FAQ accordion
│   │   │   ├── Footer.tsx          # Footer with region-aware links
│   │   │   ├── ContactForm.tsx     # Contact form → submitContactRequest callable
│   │   │   └── SuggestFeatureWidget.tsx  # Feature ideas panel (not mounted)
│   │   └── ui/                     # shadcn/ui primitives (Radix-based)
│   ├── hooks/
│   │   ├── use-mobile.tsx          # Mobile breakpoint detection
│   │   └── use-reveal-on-scroll.tsx # Staggered scroll-reveal animation
│   ├── integrations/firebase/
│   │   ├── client.ts               # Firebase app + App Check + functions
│   │   ├── support.ts              # submitContactRequest wrapper
│   │   ├── featureIdeas.ts         # list / submit / vote idea wrappers + anonId
│   │   └── callable-error.ts       # Callable error → toast message helpers
│   ├── lib/
│   │   ├── external.ts             # APP_URL / SITE_URL, appUrl() / siteUrl()
│   │   ├── routes.ts               # Typed internal paths + cross-origin login/signup
│   │   ├── seo.ts                  # Meta/OG helpers, JSON-LD
│   │   ├── articles.ts, articles.us.ts  # Article content per region
│   │   └── utils.ts                # cn() Tailwind class merger
│   ├── assets/figma/               # SVG/WebP/MP4 Figma exports
│   ├── styles.css                  # Tailwind + custom keyframes + design tokens
│   ├── router.tsx                  # Router config + error boundary
│   └── routeTree.gen.ts            # Auto-generated by TanStack Router
├── scripts/
│   ├── check-routes.mjs            # Fails the build if routeTree.gen.ts is stale
│   ├── generate-sitemap.mjs        # Writes public/sitemap.xml from src/routes
│   ├── generate-og-image.mjs       # Renders public/og-image.png with Playwright
│   ├── og/og-template.html         # 1200×630 OG card template
│   └── regen-route-tree.mjs        # Regenerates routeTree.gen.ts without vite dev
├── middleware.ts                   # Vercel edge: geo redirect + 301s to the app
├── vite.config.ts
├── tsconfig.json
├── components.json                 # shadcn/ui config
└── wrangler.jsonc                  # Cloudflare Workers config (optional)
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Geo redirect (302): US visitors to `/us`, everyone else to `/ca` |
| `/ca`, `/us` | Regional landing pages |
| `/articles`, `/articles/:slug`, `/us/articles/...` | Articles |
| `/faq`, `/us/faq` | FAQ pages |
| `/contact`, `/us/contact` | Contact form |
| `/r/:code` | Referral landing: stores the code, forwards to the app signup (noindex) |
| `/privacy`, `/terms` | Legal pages |
| `/login`, `/signup` | 301 to `app.receipt-one.com/login` / `/signup`, query string carried over |
| `/dashboard`, `/dashboard/*` | 301 to `app.receipt-one.com` |
| `/helpdesk`, `/helpdesk/*` | 301 to `app.receipt-one.com/support` |

The 301s are implemented in `middleware.ts` (Vercel edge). `robots.txt` disallows `/r` and `/api/`.

---

## Origins and Redirects

Every cross-origin URL is built in `src/lib/external.ts`:

- `APP_URL` / `appUrl(path)` — the web app (`https://app.receipt-one.com` by default, override with `VITE_APP_URL`)
- `SITE_URL` / `siteUrl(path)` — this site's canonical origin (`https://receipt-one.com` by default, override with `VITE_SITE_URL`)

Env is read from both `import.meta.env` (Vite) and `process.env` (SSR and the edge middleware), so the same module works everywhere. Log in / Join now / "Start 7-day free trial" CTAs are plain same-tab `<a href>` anchors to `appUrl(...)`, never router links. `seo.ts` derives canonical and OG URLs from `siteUrl()`.

The apex `receipt-one.com` is the canonical host; `www.receipt-one.com` 308s to it. That redirect is not configured in this repo.

### Referral links

`/r/:code` persists the code in `localStorage` (`ro_referral`) and a 30-day `ro_referral` cookie, scoped to the site's registrable domain in production so the app subdomain can read it, then replaces the location with `appUrl("/signup?ref=<code>")`. The route head sets `robots: noindex,nofollow`.

---

## Features

### Regional Landing Pages (`/ca`, `/us`)

Each page composes full-page sections:

1. **Header** — Fixed pill nav with smooth-scroll anchors (Benefits, Apps, Pricing, FAQ), region switcher (CA ↔ US), mobile drawer, ARIA-accessible; Log in / Join now link to the web app
2. **Hero** (`TopBanner`) — Animated transparent WebM video with MP4 fallback, "Start 7-day free trial" CTA above the store badges, social proof avatars
3. **Numbers** — Auto-scrolling marquee of key stats
4. **Benefits** (`InfoCards` / inline on US) — Feature highlights
5. **Feature Grid** (`NotAll`) — Equal-height interactive cards with 3D tilt, spotlight glow, and gradient border effects on pointer move
6. **Advantages** — Feature comparison with interactive hotspots overlaid on Figma artwork
7. **App Download** (`AppBanner`) — Platform-detected QR code (App Store / Google Play) + download CTAs
8. **Pricing** — Weekly / Monthly / Yearly toggle with one computed saving line per card (shown only when the saving is positive); trial CTA + store badges
9. **FAQ** — Accordion with animated height collapse
10. **Footer** — Aurora cursor-follow glow, back-to-top, legal links, account links to the web app

### Feature Suggestion Widget

A floating action button that opens directly to a browsable, votable list of existing feature ideas — "Suggest new idea" is a secondary action inside the panel. The component lives in `src/components/site/SuggestFeatureWidget.tsx` and is currently not mounted on any route; it is kept wired to the live backend so it can be dropped back in.

**Flow:**
1. Opening the widget calls `listPublicFeatureIdeas` — public ideas most-voted first, plus the ids this browser has already voted for
2. Ideas with status `open` ("Open for voting") show a Vote button, calling `voteFeatureIdea` (idempotent per voter). `planned`, `in_progress` and `done` keep their count and a muted "Voted" trace; voting on them is refused client-side
3. "Suggest new idea" switches to a Title + Description form; `submitFeatureIdea` files it as `pending_review`, hidden until staff triage it in the portal. The browser's anonId is sent so the server counts the author's own vote at creation

**No account required.** Anonymous callers are identified by App Check plus a uuid stored in `localStorage` as `ro_anon_id`, which the server hashes into the vote key. Submissions and votes are IP rate-limited server-side.

### SEO assets

- `public/og-image.png` is a designed 1200×630 card rendered by `npm run og`: the script boots the Vite dev server, screenshots the first Pricing card on `/ca` at 2x, injects it into `scripts/og/og-template.html` and renders the page with Playwright Chromium. Set `OG_BASE_URL` to render against an already-running server instead
- `public/sitemap.xml` is generated in `prebuild` from `src/routes`, expanding article slugs and skipping `/` and other dynamic segments
- `scripts/check-routes.mjs` runs in `prebuild` and fails the build if `routeTree.gen.ts` is out of date

### Scroll Reveal Animations

Custom `useRevealOnScroll` hook applies staggered entrance animations to page sections using `IntersectionObserver`. Respects `prefers-reduced-motion`.

### Interactive Micro-Interactions

- **Card hover-lift** — feature/testimonial/step cards lift slightly (`-translate-y-0.5`) with a softer, larger shadow on hover
- **Bento card hover** — `Advantages.tsx`'s cards scale down and tilt a fraction of a degree with the accent panel rising and rotating independently underneath
- **Animated underline** — inline text links reveal an underline via a growing `background-size`, not `text-decoration`
- **FAQ accordion** — height/opacity transition scoped to `grid-template-rows` for a jitter-free expand/collapse
- **Nav pill** — blurs and tightens its background/shadow once the page scrolls past 8px

See `DESIGN.md`'s Elevation section for the full shadow/motion vocabulary.

---

## Backend

This repo has no server code of its own. Supabase and Resend were removed in September 2026. Everything dynamic goes through **Firebase Cloud Functions** (v2 `onCall`, region `us-central1`, project `check-app-a93a2`) that are owned and deployed by the web portal repo (`ReceiptOne-Web-Portal`, see its `docs/SUPPORT_AND_IDEAS.md`):

| Function | Called from | Writes / reads | Abuse controls |
|---|---|---|---|
| `submitContactRequest` | `ContactForm.tsx` | creates `supportRequests/{id}` (`source: "website"`) | App Check required, 5 / hour / IP |
| `listPublicFeatureIdeas` | `SuggestFeatureWidget.tsx` | reads public `featureIdeas` + caller's voted ids | App Check |
| `submitFeatureIdea` | `SuggestFeatureWidget.tsx` | creates `featureIdeas/{id}` as `pending_review` | App Check, 5 / hour / IP |
| `voteFeatureIdea` | `SuggestFeatureWidget.tsx` | `featureIdeas/{id}/votes/{voterKey}` + counter | App Check, 60 / hour / IP |

The browser never reads or writes Firestore directly. App Check (reCAPTCHA v3) is initialised in `src/integrations/firebase/client.ts` before `getFunctions`, so every callable request carries an `X-Firebase-AppCheck` header. Wrappers live in `src/integrations/firebase/support.ts` and `featureIdeas.ts`; `callable-error.ts` maps `functions/resource-exhausted` and validation errors to toast copy.

The contact form sends name, email, subject, message, locale (`en-CA` / `en-US` by storefront) and userAgent. Tickets land in Firestore and are answered from `app.receipt-one.com/support`; idea moderation lives in the portal under System Admin → Ideas & Votes.

---

## Getting Started

### Prerequisites

- Node.js 20+
- Access to the `check-app-a93a2` Firebase project's web app config (for the contact form and feature widget)

### Install

```bash
# with npm
npm install

# with bun
bun install
```

### Run locally

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000). The root redirects to `/ca`.

---

## Environment Variables

Create a `.env.local` file in the project root (never commit `.env`). See `.env.example` for the full list. All values are `VITE_`-prefixed and public; there are no server-only secrets in this repo.

| Variable | Required | Purpose |
|---|---|---|
| `VITE_APP_URL` | no | Web app origin. Defaults to `https://app.receipt-one.com`. Override for previews or local app dev |
| `VITE_SITE_URL` | no | This site's canonical origin. Defaults to `https://receipt-one.com`. Used for canonical/OG URLs and the referral cookie domain |
| `VITE_FIREBASE_API_KEY` | yes | Firebase web config (project `check-app-a93a2`) |
| `VITE_FIREBASE_AUTH_DOMAIN` | yes | Firebase web config |
| `VITE_FIREBASE_PROJECT_ID` | yes | Firebase web config |
| `VITE_FIREBASE_STORAGE_BUCKET` | yes | Firebase web config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | yes | Firebase web config |
| `VITE_FIREBASE_APP_ID` | yes | Firebase web config |
| `VITE_FIREBASE_MEASUREMENT_ID` | yes | Firebase web config |
| `VITE_FIREBASE_APP_CHECK_SITE_KEY` | yes | reCAPTCHA v3 site key for App Check |

`VITE_FIREBASE_APP_CHECK_SITE_KEY` is required for the contact form and the feature widget to work: the callables reject requests without a valid App Check token. reCAPTCHA v3 only issues tokens on domains registered for the key, so local dev against production functions needs `localhost` on the key (or an App Check debug token).

Removed in September 2026 and no longer read anywhere: `SUPABASE_*`, `VITE_SUPABASE_*`, `RESEND_*`, `HELPDESK_*`, `ADMIN_USER_IDS`, `VITE_APP_STORE_URL`, `VITE_PLAY_STORE_URL` (store URLs are hardcoded in `StoreBadge.tsx`) and `VITE_GOOGLE_MAPS_API_KEY` (only the removed dashboard's mileage page used it).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (Vercel/Nitro output). `prebuild` runs `check:routes` and `sitemap` first |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run check:routes` | Verify `routeTree.gen.ts` matches `src/routes` |
| `npm run sitemap` | Regenerate `public/sitemap.xml` (`SITE_ORIGIN` overrides the origin) |
| `npm run og` | Regenerate `public/og-image.png` with Playwright |
| `node scripts/regen-route-tree.mjs` | Regenerate `routeTree.gen.ts` without starting `vite dev` |

---

## Deployment

The project deploys to **Vercel** using the Nitro preset configured in `vite.config.ts`:

```ts
plugins: [nitro({ preset: 'vercel' })]
```

There are no file-based server routes, so Nitro has no `serverDir`. `middleware.ts` at the repo root is bundled by Vercel as edge middleware (geo redirect on `/`, 301s for the removed auth, dashboard and helpdesk paths).

A `wrangler.jsonc` is also present for optional **Cloudflare Workers** deployment — set `cloudflare: true` in `vite.config.ts` to enable it.

### Vercel

1. Connect the GitHub repo in the Vercel dashboard
2. Set environment variables (see [Environment Variables](#environment-variables) above)
3. Deploy — Vercel auto-detects the Nitro/Vite output

> **Every merge to `main` deploys to production automatically.**
> See [docs/pull-request-workflow.md](./docs/pull-request-workflow.md) for the branch and PR process.

---

## Known Issues

The following issues are tracked and open for contribution:

| # | Issue | Severity |
|---|---|---|
| [#2](https://github.com/dev-one-dev/figma-craft-39/issues/2) | `.env` committed with live credentials | High |
| [#6](https://github.com/dev-one-dev/figma-craft-39/issues/6) | Footer `/privacy` and `/terms` links are swapped | Medium |
| [#7](https://github.com/dev-one-dev/figma-craft-39/issues/7) | Duplicate `id="benefits"` on both pages | Low |
| [#9](https://github.com/dev-one-dev/figma-craft-39/issues/9) | App Store URL is a placeholder | Medium |
| [#16](https://github.com/dev-one-dev/figma-craft-39/issues/16) | No favicon defined | Low |
| [#17](https://github.com/dev-one-dev/figma-craft-39/issues/17) | Site performance — 40+ MB of unoptimised assets, no lazy loading | High |
| [#18](https://github.com/dev-one-dev/figma-craft-39/issues/18) | Double scrollbar on `/ca` and `/us` | Medium |

**Obsolete since the Supabase removal (2026-09)**: `#3`, `#4`, `#8` (feature votes/ideas now go through rate-limited Cloud Functions with server-side vote keys) and `#10` (login/signup moved to the web app).

**Fixed since this table was written**: `#5` (`Toaster` never mounted) — resolved 2026-07-06, mounted globally in `__root.tsx`. `#9` (App Store URL placeholder) also looks resolved from the current code (real URLs are hardcoded in `StoreBadge.tsx`) but hasn't been independently verified against the linked issue.
