import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";

/**
 * Header — pixel-mapped from Figma node 29:26473
 * Pill nav, max-width 960px; desktop: inline nav; mobile/tablet: drawer under pill.
 */
export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isUS = location.pathname.startsWith("/us");
  const current: "ca" | "us" = isUS ? "us" : "ca";
  const [open, setOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMobileNavOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileNavOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileNavOpen(false);
  }, [location.pathname]);

  const select = (region: "ca" | "us") => {
    setOpen(false);
    setMobileNavOpen(false);
    if (region !== current) {
      navigate({ to: region === "ca" ? "/ca" : "/us" });
    }
  };

  const scrollOffset = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches
      ? 88
      : 104;

  const scrollTo = (id: string) => () => {
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset();
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const mobileNavBtnClass =
    "w-full rounded-xl px-4 py-3 text-left font-sans text-base font-medium leading-6 text-black transition-colors hover:bg-black/5";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex w-full justify-center px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <div ref={rootRef} className="relative w-full max-w-[760px]">
        <nav
          className={`flex w-full items-center justify-between gap-2 rounded-[20px] border p-3 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 sm:gap-3 sm:p-3.5 md:p-4 ${
            scrolled
              ? "border-black/[0.08] bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              : "border-transparent bg-white/40"
          }`}
          aria-label="Primary"
        >
          <Link
            to={isUS ? "/us" : "/ca"}
            onClick={(e) => {
              if (location.pathname === (isUS ? "/us" : "/ca")) {
                e.preventDefault();
              }
              setMobileNavOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2"
          >
            <LogoMark />
            <LogoWordmark />
          </Link>

          <ul className="hidden flex-1 items-center justify-center gap-3 font-sans text-[15px] font-medium leading-6 text-black lg:flex">
            <li>
              <button
                type="button"
                onClick={scrollTo("benefits")}
                className="rounded-md px-0.5 py-1 transition-opacity hover:opacity-70"
              >
                Benefits
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={scrollTo("apps")}
                className="rounded-md px-0.5 py-1 transition-opacity hover:opacity-70"
              >
                Apps
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={scrollTo("pricing")}
                className="rounded-md px-0.5 py-1 transition-opacity hover:opacity-70"
              >
                Pricing
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={scrollTo("faq")}
                className="rounded-md px-0.5 py-1 transition-opacity hover:opacity-70"
              >
                FAQ
              </button>
            </li>
          </ul>

          <div className="flex shrink-0 flex-nowrap items-center justify-end gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpen((v) => !v);
                  setMobileNavOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-md px-1 py-1 font-display text-[15px] font-semibold leading-6 text-black sm:text-base sm:leading-7"
                aria-label="Change region"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                {current === "ca" ? (
                  <FlagCanada className="size-7 sm:size-8" />
                ) : (
                  <FlagUSA className="size-7 sm:size-8" />
                )}
                <span>{current === "ca" ? "CA" : "US"}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 10 10"
                  className="shrink-0 sm:h-[14px] sm:w-[14px]"
                  aria-hidden
                >
                  <path
                    d="M2 4l3 3 3-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {open && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-lg sm:min-w-[12.5rem]"
                >
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => select("ca")}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[15px] font-medium leading-6 hover:bg-black/5 sm:text-base sm:leading-7"
                  >
                    <FlagCanada className="size-6 shrink-0 sm:size-7" />
                    <span>Canada</span>
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => select("us")}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[15px] font-medium leading-6 hover:bg-black/5 sm:text-base sm:leading-7"
                  >
                    <FlagUSA className="size-6 shrink-0 sm:size-7" />
                    <span>USA</span>
                  </button>
                </div>
              )}
            </div>

            <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
              <Link
                to="/login"
                className="shrink-0 whitespace-nowrap rounded-full border border-black px-3 py-2 font-display text-[15px] font-semibold leading-6 text-black transition-colors hover:bg-black/5"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="shrink-0 whitespace-nowrap rounded-full bg-black px-3 py-2 font-display text-[15px] font-semibold leading-6 text-white transition-opacity hover:opacity-90"
              >
                Join now
              </Link>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white/80 text-black transition-colors hover:bg-black/5 lg:hidden"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
              aria-controls="site-mobile-nav"
              onClick={() => {
                setMobileNavOpen((v) => !v);
                setOpen(false);
              }}
            >
              {mobileNavOpen ? <MenuCloseIcon /> : <MenuOpenIcon />}
            </button>
          </div>
        </nav>

        {mobileNavOpen && (
          <div
            id="site-mobile-nav"
            role="navigation"
            aria-label="Site sections"
            className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-black/10 bg-white/95 p-3 shadow-[0_16px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-0.5 border-b border-black/5 pb-2">
              <button type="button" className={mobileNavBtnClass} onClick={scrollTo("benefits")}>
                Benefits
              </button>
              <button type="button" className={mobileNavBtnClass} onClick={scrollTo("apps")}>
                Apps
              </button>
              <button type="button" className={mobileNavBtnClass} onClick={scrollTo("pricing")}>
                Pricing
              </button>
              <button type="button" className={mobileNavBtnClass} onClick={scrollTo("faq")}>
                FAQ
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileNavOpen(false)}
                className="block w-full rounded-full border border-black py-3 text-center font-display text-[15px] font-semibold leading-6 text-black transition-colors hover:bg-black/5"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileNavOpen(false)}
                className="block w-full rounded-full bg-black py-3 text-center font-display text-[15px] font-semibold leading-6 text-white transition-opacity hover:opacity-90"
              >
                Join now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function MenuOpenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function MenuCloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Inline SVGs (no external assets needed) ---------- */

function LogoMark() {
  return <img src={logoMark} alt="" aria-hidden className="block size-8 shrink-0 sm:size-10" />;
}

function LogoWordmark() {
  return (
    <img
      src={logoWordmark}
      alt="ReceiptOne"
      className="block h-[18px] w-auto max-w-[min(140px,38vw)] shrink object-left object-contain sm:h-6 sm:max-w-none"
    />
  );
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
        <rect width="6" height="24" fill="#D52B1E" />
        <rect x="6" width="12" height="24" fill="#fff" />
        <rect x="18" width="6" height="24" fill="#D52B1E" />
        <path
          fill="#D52B1E"
          d="m14.03 13.565 2.553-1.276-1.276-.638v-1.277l-2.553 1.277 1.276-2.553h-1.276l-1.276-1.915-1.277 1.915h-1.276l1.277 2.553-2.553-1.277v1.277l-1.277.638 2.553 1.276-.638.639h2.553V17h1.276v-2.796h2.553l-.638-.639Z"
        />
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
        {[0, 2, 4, 6, 8, 10, 12].map((y) => (
          <rect key={y} y={y * (24 / 13)} width="24" height={24 / 13} fill="#B22234" />
        ))}
        <rect width="11" height={(24 / 13) * 7} fill="#3C3B6E" />
      </g>
    </svg>
  );
}
