# Changelog

All notable changes to the ReceiptOne landing site. Dates are ISO (YYYY-MM-DD).

## 2026-09

### Added

- `src/lib/external.ts`: single source for cross-origin URLs (`APP_URL`, `SITE_URL`, `appUrl()`, `siteUrl()`), read from `VITE_APP_URL` / `VITE_SITE_URL` with production defaults; works in Vite, SSR and the Vercel edge middleware (2026-09-09).
- "Start 7-day free trial" web CTA (`PrimaryCta`) in the hero and the pricing store CTA, linking to the app signup (2026-09-09).
- Referral landing `/r/:code`: stores the code in `localStorage` and a 30-day `ro_referral` cookie, then forwards to `app.receipt-one.com/signup?ref=<code>`; `noindex,nofollow` (2026-09-09).
- Designed 1200×630 Open Graph image rendered with Playwright: `scripts/generate-og-image.mjs` + `scripts/og/og-template.html`, run with `npm run og`, output `public/og-image.png`. Playwright added as a dev dependency (2026-09-10).
- `.env.example` documenting every env key the site reads (2026-09-09).
- Feature widget: `open` idea status ("Open for voting"); the browser's anonId is sent on submit so the server counts the author's own vote (2026-09-11).
- `CHANGELOG.md` (this file) (2026-09-11).

### Changed

- Log in / Join now / trial CTAs in the header, footer and final CTA now point at the web app (`appUrl("/login")`, `appUrl("/signup")`) as plain `<a href>` anchors instead of router links (2026-09-09).
- OG image is served from this site's origin (`siteUrl("/og-image.png")`) instead of an external preview screenshot; `seo.ts` derives all URLs from `siteUrl()` (2026-09-09).
- Sitemap generator expands article slugs into one `<url>` per article under `/articles/` and `/us/articles/`, skips other dynamic segments and drops `/` (which only redirects) (2026-09-09).
- `robots.txt` disallows `/r` and `/api/` (2026-09-09).
- Contact form submits through the portal's `submitContactRequest` Cloud Function (us-central1) with name, email, subject, message, locale and userAgent; App Check token attached automatically. Rate-limit and validation errors map to toast copy (2026-09-10).
- Feature-idea widget reads and writes through `listPublicFeatureIdeas` / `submitFeatureIdea` / `voteFeatureIdea`. Voter key is a uuid in `localStorage` (`ro_anon_id`), hashed server-side; already-voted ids come from the list call. Statuses follow the Firestore enum (2026-09-10).
- Vote button renders only for `open` ideas; `planned`, `in_progress` and `done` keep their count with a muted "Voted" trace (2026-09-11).
- `vite.config.ts`: Nitro keeps the Vercel preset but drops `serverDir`; there are no file-based server routes left (2026-09-10).
- Pricing: "Most Popular" / "Best Deal" chips removed; the yearly option carries an inline saving label computed from the listed prices (2026-09-10).
- Pricing: one `yearlySavingPercent()` feeds both the toggle and the card; each card shows a single muted saving line against the next-shorter period, and Weekly shows none. `originalPrice` and `discountLabel` plan fields removed (2026-09-11).
- Store URLs are hardcoded in `StoreBadge.tsx` (2026-09-10).
- Hero, chips and store badges aligned: `PrimaryCta` at 44px, `StoreBadge` gains a 36px `size="sm"` for the footer (2026-09-10).

### Fixed

- Hero mascot video no longer intercepts clicks on the store badges at desktop widths (2026-09-10).
- Feature grid cards have equal heights in each row on `/ca` and `/us` (2026-09-10).
- Chip class string bypasses `cn()` so tailwind-merge no longer drops `text-label` (2026-09-10).
- Pre-existing `/articles` route type error, via `FileRoutesByTo` in `routes.ts` (2026-09-09).
- CA Monthly price aligned with the app (CAD 9.99). Saving tag and line are rendered only when the saving is positive (2026-09-11).

### Removed

- `/login`, `/signup` and `/dashboard/*` routes, `components/dashboard/*` and `lib/t2125.ts`. Auth and the signed-in product live on `app.receipt-one.com`; the edge middleware 301s the old paths there, carrying the query string on the auth paths (2026-09-09).
- `/helpdesk`, `/helpdesk/ideas`, `/helpdesk/support` and `components/helpdesk/*`; the middleware 301s `/helpdesk*` to `app.receipt-one.com/support` (2026-09-10).
- Supabase: `integrations/supabase/*`, `supabase/` migrations and config, `@supabase/supabase-js` (2026-09-10).
- Resend: `integrations/resend/*`, the `api/helpdesk/notify` server route, the `resend` package (2026-09-10).
- Unused dependencies `zod` and `date-fns`; `lib/html-escape.ts`; `timeAgo` / `errorMessage` helpers in `lib/utils.ts` (2026-09-10).
- Env vars: `SUPABASE_*`, `RESEND_*`, `HELPDESK_*`, `ADMIN_USER_IDS` (2026-09-10); `VITE_APP_STORE_URL`, `VITE_PLAY_STORE_URL` (2026-09-10); `VITE_GOOGLE_MAPS_API_KEY` dropped from `.env.example` (only the removed dashboard's mileage page read it) (2026-09-11).
- `/helpdesk` disallow from `robots.txt`; `/login` and `/signup` disallows replaced by the 301s (2026-09-09, 2026-09-10).
