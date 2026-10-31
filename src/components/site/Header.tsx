import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";
import { ROUTES, type AppRoute } from "@/lib/routes";
import { FRENCH_PAGES, US_PAGES, canadianPageOf, langOf, type Lang } from "@/lib/locales";

/** Header copy. French follows the portal's own labels (authPage, nav). */
const COPY: Record<Lang, Record<string, string>> = {
  en: {
    howItWorks: "How It Works",
    benefits: "Benefits",
    pricing: "Pricing",
    faq: "FAQ",
    login: "Log in",
    join: "Join now",
    changeRegion: "Change region",
    canada: "Canada",
    usa: "USA",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primary: "Primary",
    sections: "Site sections",
    language: "Language",
  },
  fr: {
    howItWorks: "Comment ça marche",
    benefits: "Avantages",
    pricing: "Tarifs",
    faq: "FAQ",
    login: "Se connecter",
    join: "S'inscrire",
    changeRegion: "Changer de région",
    canada: "Canada",
    usa: "États-Unis",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    primary: "Navigation principale",
    sections: "Sections du site",
    language: "Langue",
  },
};

/**
 * Header — pixel-mapped from Figma node 29:26473
 * Pill nav, max-width 960px; desktop: inline nav; mobile/tablet: drawer under pill.
 */
export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isUS = location.pathname.startsWith("/us");
  const current: "ca" | "us" = isUS ? "us" : "ca";
  const lang = langOf(location.pathname);
  const t = COPY[lang];
  const home: AppRoute = isUS ? "/us" : lang === "fr" ? "/fr" : "/ca";
  // The page this one mirrors in the other language/region, when it has one.
  const canadianPage = canadianPageOf(location.pathname);
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
    if (region === current) return;
    const path = location.pathname;
    if (region === "us") {
      if (path.startsWith("/articles")) {
        navigate({ to: "/us/articles/" as any });
        return;
      }
      navigate({ to: ((canadianPage && US_PAGES[canadianPage]) ?? "/us") as AppRoute });
    } else {
      if (path.startsWith("/us/articles")) {
        navigate({ to: "/articles/" as any });
        return;
      }
      navigate({ to: (canadianPage ?? "/ca") as AppRoute });
    }
  };

  const scrollOffset = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches ? 88 : 104;

  const scrollTo = (id: string) => () => {
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset();
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      navigate({ to: home, hash: id });
    }
  };

  const mobileNavBtnClass =
    "w-full rounded-card px-4 py-3 text-left font-sans text-body font-medium text-ink transition-colors hover:bg-ink-05";

  // Rendered twice below (desktop, grouped with the nav; mobile, next to the
  // hamburger) -- each wrapper's responsive visibility is mutually exclusive
  // (lg:hidden vs hidden lg:flex), so only one copy is ever visible/reachable
  // at a time. Both share this component's open/setOpen state.
  const regionSwitcher = (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setMobileNavOpen(false);
        }}
        className="flex items-center gap-1.5 rounded-card px-1 py-1 font-display text-body font-semibold text-ink"
        aria-label={t.changeRegion}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {current === "ca" ? (
          <FlagCanada className="size-7 sm:size-8" />
        ) : (
          <FlagUSA className="size-7 sm:size-8" />
        )}
        {/* The flag carries the region on phones, where the language switch
            needs the room next to the wordmark. */}
        <span className={isUS ? undefined : "hidden sm:inline"}>
          {current === "ca" ? "CA" : "US"}
        </span>
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
          className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-card border border-hairline bg-white py-1 shadow-lg sm:min-w-[12.5rem]"
        >
          <button
            role="menuitem"
            type="button"
            onClick={() => select("ca")}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-body font-medium hover:bg-ink-05"
          >
            <FlagCanada className="size-6 shrink-0 sm:size-7" />
            <span>{t.canada}</span>
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => select("us")}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-body font-medium hover:bg-ink-05"
          >
            <FlagUSA className="size-6 shrink-0 sm:size-7" />
            <span>{t.usa}</span>
          </button>
        </div>
      )}
    </div>
  );

  const enPath = (canadianPage ?? "/ca") as AppRoute;
  const frPath = ((canadianPage && FRENCH_PAGES[canadianPage]) ?? "/fr") as AppRoute;
  const langLinkClass = (active: boolean) =>
    `rounded-pill px-2 py-1 transition-colors ${active ? "bg-ink text-paper" : "text-ink-60 hover:text-ink"}`;
  const languageSwitcher = isUS ? null : (
    <div
      role="group"
      aria-label={t.language}
      className="flex shrink-0 items-center rounded-pill border border-hairline bg-white/60 p-0.5 font-mono text-label uppercase tracking-mono"
    >
      <Link
        to={enPath}
        hash={location.hash || undefined}
        hrefLang="en-CA"
        lang="en"
        aria-label="English"
        aria-current={lang === "en" ? "true" : undefined}
        className={langLinkClass(lang === "en")}
      >
        EN
      </Link>
      <Link
        to={frPath}
        hash={location.hash || undefined}
        hrefLang="fr-CA"
        lang="fr"
        aria-label="Français"
        aria-current={lang === "fr" ? "true" : undefined}
        className={langLinkClass(lang === "fr")}
      >
        FR
      </Link>
    </div>
  );

  return (
    <header
      data-cta-location="header"
      className="fixed inset-x-0 top-0 z-50 flex w-full justify-center px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8"
    >
      <div ref={rootRef} className="relative w-full max-w-[1200px]">
        <nav
          className={`flex w-full items-center justify-between gap-2 rounded-card border p-3 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 sm:gap-3 sm:p-3.5 md:p-4 ${
            scrolled
              ? "border-hairline bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              : "border-transparent bg-white/40"
          }`}
          aria-label={t.primary}
        >
          <Link
            to={home}
            onClick={(e) => {
              if (location.pathname === home) {
                e.preventDefault();
              }
              setMobileNavOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2"
          >
            <LogoMark />
            <LogoWordmark compact={!isUS} />
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-3 lg:flex">
            <ul className="flex items-center gap-3 font-sans text-body font-medium text-ink">
              <li>
                <button
                  type="button"
                  onClick={scrollTo("how-it-works")}
                  className="rounded-card px-0.5 py-1 transition-opacity hover:opacity-70 whitespace-nowrap"
                >
                  {t.howItWorks}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollTo("benefits")}
                  className="rounded-card px-0.5 py-1 transition-opacity hover:opacity-70"
                >
                  {t.benefits}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollTo("pricing")}
                  className="rounded-card px-0.5 py-1 transition-opacity hover:opacity-70"
                >
                  {t.pricing}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollTo("faq")}
                  className="rounded-card px-0.5 py-1 transition-opacity hover:opacity-70"
                >
                  {t.faq}
                </button>
              </li>
            </ul>

            {languageSwitcher}
            {regionSwitcher}
          </div>

          <div className="flex shrink-0 flex-nowrap items-center justify-end gap-2">
            <div className="flex items-center gap-2 lg:hidden">
              {languageSwitcher}
              {regionSwitcher}
            </div>

            <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
              <a
                href={ROUTES.login}
                className="shrink-0 whitespace-nowrap rounded-pill border border-ink px-3 py-2 font-display text-body font-semibold text-ink transition-colors hover:bg-ink-05"
              >
                {t.login}
              </a>
              <a
                href={ROUTES.signup}
                className="shrink-0 whitespace-nowrap rounded-pill bg-ink px-3 py-2 font-display text-body font-semibold text-paper transition-opacity hover:opacity-90"
              >
                {t.join}
              </a>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-card border border-hairline bg-white/80 text-ink transition-colors hover:bg-ink-05 lg:hidden"
              aria-label={mobileNavOpen ? t.closeMenu : t.openMenu}
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
            aria-label={t.sections}
            className="absolute left-0 right-0 top-full z-40 mt-2 rounded-card border border-hairline bg-white/95 p-3 shadow-[0_16px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-0.5 border-b border-hairline pb-2">
              <button
                type="button"
                className={mobileNavBtnClass}
                onClick={scrollTo("how-it-works")}
              >
                {t.howItWorks}
              </button>
              <button type="button" className={mobileNavBtnClass} onClick={scrollTo("benefits")}>
                {t.benefits}
              </button>
              <button type="button" className={mobileNavBtnClass} onClick={scrollTo("pricing")}>
                {t.pricing}
              </button>
              <button type="button" className={mobileNavBtnClass} onClick={scrollTo("faq")}>
                {t.faq}
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={ROUTES.login}
                onClick={() => setMobileNavOpen(false)}
                className="block w-full rounded-pill border border-ink py-3 text-center font-display text-body font-semibold text-ink transition-colors hover:bg-ink-05"
              >
                {t.login}
              </a>
              <a
                href={ROUTES.signup}
                onClick={() => setMobileNavOpen(false)}
                className="block w-full rounded-pill bg-ink py-3 text-center font-display text-body font-semibold text-paper transition-opacity hover:opacity-90"
              >
                {t.join}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function MenuOpenIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function MenuCloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Inline SVGs (no external assets needed) ---------- */

function LogoMark() {
  return <img src={logoMark} alt="" aria-hidden className="block size-8 shrink-0 sm:size-10" />;
}

/**
 * `compact`: on the narrowest phones (< 360px) the header also carries the
 * EN/FR switch, so the wordmark steps aside and the mark alone stands in.
 */
function LogoWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src={logoWordmark}
      alt="ReceiptOne"
      className={`${compact ? "hidden min-[360px]:block" : "block"} h-[18px] w-auto max-w-[min(140px,38vw)] shrink object-left object-contain sm:h-6 sm:max-w-none`}
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
