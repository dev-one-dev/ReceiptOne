import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";

/**
 * Header — pixel-mapped from Figma node 29:26473
 * Pill nav, max-width 900px, white bg, soft shadow stack, 12px padding.
 */
export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isUS = location.pathname.startsWith("/us");
  const current: "ca" | "us" = isUS ? "us" : "ca";
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const select = (region: "ca" | "us") => {
    setOpen(false);
    if (region !== current) {
      navigate({ to: region === "ca" ? "/ca" : "/us" });
    }
  };

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
        <Link to={isUS ? "/us" : "/ca"} className="flex w-[250px] shrink-0 items-center gap-2">
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
        <div className="flex shrink-0 flex-nowrap items-center justify-end gap-3">
          <div ref={wrapRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 font-display text-sm font-semibold leading-5 text-black"
              aria-label="Change region"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              {current === "ca" ? <FlagCanada className="size-6" /> : <FlagUSA className="size-6" />}
              <span>{current === "ca" ? "CA" : "US"}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg"
              >
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => select("ca")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-black/5"
                >
                  <FlagCanada className="size-5" />
                  <span>Canada</span>
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => select("us")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-black/5"
                >
                  <FlagUSA className="size-5" />
                  <span>USA</span>
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="shrink-0 whitespace-nowrap rounded-full border border-black px-6 py-2.5 font-display text-sm font-semibold leading-5 text-black transition-colors hover:bg-black/5"
          >
            Log in
          </button>
          <button
            type="button"
            className="shrink-0 whitespace-nowrap rounded-full bg-black px-6 py-2.5 font-display text-sm font-semibold leading-5 text-white transition-opacity hover:opacity-90"
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

function FlagUSA({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="USA"
      role="img"
    >
      <defs>
        <clipPath id="flagCircleUS">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#flagCircleUS)">
        <rect width="24" height="24" fill="#fff" />
        {/* 7 red stripes */}
        {[0, 2, 4, 6, 8, 10, 12].map((y) => (
          <rect key={y} y={y * (24 / 13)} width="24" height={24 / 13} fill="#B22234" />
        ))}
        {/* Blue canton */}
        <rect width="11" height={24 / 13 * 7} fill="#3C3B6E" />
      </g>
    </svg>
  );
}
