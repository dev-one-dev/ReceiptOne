import { Link } from "@tanstack/react-router";

/**
 * Header — pixel-mapped from Figma node 29:26473
 * Pill nav, max-width 900px, white bg, soft shadow stack, 12px padding.
 */
export function Header() {
  return (
    <header className="flex w-full justify-center px-8 pt-8">
      <nav
        className="flex w-full max-w-[900px] items-center justify-between rounded-[20px] border border-black/[0.12] bg-white p-3"
        style={{
          boxShadow:
            "0 22px 48px 0 rgba(122,122,122,0.10), 0 87px 87px 0 rgba(122,122,122,0.09), 0 196px 118px 0 rgba(122,122,122,0.05), 0 349px 139px 0 rgba(122,122,122,0.01)",
        }}
        aria-label="Primary"
      >
        {/* Logo container — fixed 250px to balance the right cluster */}
        <Link to="/ca" className="flex w-[250px] shrink-0 items-center gap-2">
          <LogoMark />
          <LogoWordmark />
        </Link>

        {/* Center nav links */}
        <ul className="flex items-center gap-6 font-sans text-sm leading-5 text-black">
          <li>
            <a href="#benefits" className="transition-opacity hover:opacity-70">
              Benefits
            </a>
          </li>
          <li>
            <a href="#apps" className="transition-opacity hover:opacity-70">
              Apps
            </a>
          </li>
          <li>
            <a href="#pricing" className="transition-opacity hover:opacity-70">
              Pricing
            </a>
          </li>
          <li>
            <a href="#faq" className="transition-opacity hover:opacity-70">
              FAQ
            </a>
          </li>
        </ul>

        {/* Right cluster */}
        <div className="flex w-[250px] shrink-0 items-center justify-end gap-3">
          <button
            type="button"
            className="flex items-center gap-1 font-display text-sm font-semibold leading-5 text-black"
            aria-label="Change language"
          >
            <FlagCanada className="size-6" />
            <span>EN</span>
          </button>
          <button
            type="button"
            className="rounded-xl border border-black px-5 py-2 font-display text-sm font-semibold leading-5 text-black transition-colors hover:bg-black/5"
          >
            Log in
          </button>
          <button
            type="button"
            className="rounded-xl bg-black px-5 py-2 font-display text-sm font-semibold leading-5 text-white transition-opacity hover:opacity-90"
          >
            Join now
          </button>
        </div>
      </nav>
    </header>
  );
}

/* ---------- Inline SVGs (no external assets needed) ---------- */

function LogoMark() {
  // Black rounded square with stylised "R" — matches Figma R_COLOR_WORK bubble.
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-black text-white">
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6 4h7.2c2.65 0 4.8 2.06 4.8 4.6 0 1.95-1.27 3.62-3.07 4.27L18.5 20H15l-3.2-6.6H9.3V20H6V4zm3.3 2.7v4.1h3.6c1.18 0 2.1-.9 2.1-2.05s-.92-2.05-2.1-2.05H9.3z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function LogoWordmark() {
  return (
    <span className="font-display text-[18px] font-semibold leading-6 tracking-tight text-black">
      ReceiptOne
    </span>
  );
}

function FlagCanada({ className }: { className?: string }) {
  // Circular USA flag (matches Figma design — "US & Canada" market)
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="United States"
      role="img"
    >
      <defs>
        <clipPath id="flagCircle">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#flagCircle)">
        <rect width="24" height="24" fill="#fff" />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} y={i * 1.85 * 2} width="24" height="1.85" fill="#B22234" />
        ))}
        <rect width="11" height="13" fill="#3C3B6E" />
        {/* Star field — simplified dots */}
        {Array.from({ length: 5 }).flatMap((_, row) =>
          Array.from({ length: 5 }).map((__, col) => (
            <circle
              key={`s-${row}-${col}`}
              cx={1.2 + col * 2.1 + (row % 2 ? 1.05 : 0)}
              cy={1.2 + row * 2.4}
              r={0.45}
              fill="#fff"
            />
          )),
        )}
      </g>
    </svg>
  );
}
