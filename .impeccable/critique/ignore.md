# Critique Ignore List

Findings below were reviewed and resolved by the user directly (not by a code
fix) or otherwise confirmed not to apply. Drop these silently in future
critique runs instead of re-flagging them.

## /us landing page (`src-routes-us-index-tsx`)

- **Hero mascot video responsive override** (`TopBanner.tsx:130`, `w-[190%] max-w-none`). Originally flagged as a P2 in the 2026-07-02 critique as a code-reading risk ("may over-crop on mobile since the sizing is unscoped by breakpoint"). Verified manually on a real mobile device on 2026-07-06 — nothing crops, the composition holds at mobile width. No code change needed or wanted. Applies to `/ca` as well (same shared `TopBanner.tsx`).
