# Critique Ignore List

Findings below were reviewed and resolved by the user directly (not by a code
fix) or otherwise confirmed not to apply. Drop these silently in future
critique runs instead of re-flagging them.

## /us landing page (`src-routes-us-index-tsx`)

- **Hero mascot video responsive override** (`TopBanner.tsx:130`, `w-[190%] max-w-none`). Originally flagged as a P2 in the 2026-07-02 critique as a code-reading risk ("may over-crop on mobile since the sizing is unscoped by breakpoint"). Verified manually on a real mobile device on 2026-07-06 — nothing crops, the composition holds at mobile width. No code change needed or wanted. Applies to `/ca` as well (same shared `TopBanner.tsx`).

## Sitewide (all pages)

- **Ember (`#f97316`) text/icons directly on white/near-white backgrounds, ~2.8:1.** Confirmed intentional brand-consistency decision (2026-07-06) — same category as the white-text-on-`#f97316` badge exception already documented in `DESIGN.md`'s One Accent Rule. Do not re-flag as a P1/P2 in future critique or audit passes. Known locations: `InfoCards.tsx:86` (feature label), `ArticlesSection.tsx:28` (`CategoryPill` featured variant) and `:80` ("Read article" CTA text), `articles/$slug.tsx:292` (category pill), `:266` (hover-only link color), and `:116` (a `size-5` decorative icon — iconographic, not subject to text-contrast rules in the first place, but same color choice). The hero H1's orange-period accent (`TopBanner.tsx:43-44`) is the same color choice at display size and is covered by this exception too.

  The author-initials avatar badge (`articles/$slug.tsx:309`, `us/articles/$slug.tsx:256`) was **not** folded into this exception — it was genuinely readable text on a worse, different background, so it was fixed instead (2026-07-06): `text-[#f97316]` (~2.07:1) → `text-[#9a3412]` (~5.40:1), a darker step from the same ember ramp, background unchanged at `#fed7aa`. Nothing to ignore here going forward; a future pass will just see it already passing.
