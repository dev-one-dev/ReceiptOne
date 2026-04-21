import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";

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
  return <img src={logoMark} alt="" aria-hidden className="block size-10" />;
}

function LogoWordmark() {
  return <img src={logoWordmark} alt="ReceiptOne" className="block h-6 w-auto" />;
}

function FlagCanada({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Canada"
      role="img"
    >
      <defs>
        <clipPath id="flagCircle">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#flagCircle)">
        {/* Canadian flag: red bands + white center with maple leaf */}
        <rect width="6" height="24" fill="#D52B1E" />
        <rect x="6" width="12" height="24" fill="#fff" />
        <rect x="18" width="6" height="24" fill="#D52B1E" />
        {/* Stylized 11-point maple leaf, centered */}
        <path
          fill="#D52B1E"
          d="M12 5.2l.55 1.9 1.85-.55-.6 1.85 1.9.5-1.5 1.25 1.5 1.25-1.9.5.6 1.85-1.85-.55-.55 1.9-.55-1.9-1.85.55.6-1.85-1.9-.5 1.5-1.25-1.5-1.25 1.9-.5-.6-1.85 1.85.55z"
        />
        <rect x="11.6" y="14.5" width="0.8" height="3.5" fill="#D52B1E" />
      </g>
    </svg>
  );
}
