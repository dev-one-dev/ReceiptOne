import { Link, useNavigate } from "@tanstack/react-router";
import { Facebook, Linkedin } from "lucide-react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";
import { ROUTES, type AppRoute } from "@/lib/routes";
import { StoreBadge } from "@/components/site/StoreBadge";
import { useLang } from "@/lib/use-lang";
import type { Lang } from "@/lib/locales";

type FooterProps = {
  region?: "ca" | "us";
};

/**
 * `en` marks a link from a French page to a page that is still English-only
 * (articles, legal pages): it gets hrefLang="en" and a visible "(en anglais)",
 * so a French reader is not dropped into English without warning.
 */
type FooterLink = { label: string; href: string; en?: boolean };

const EN_ONLY = " (en anglais)";

function productLinks(region: "ca" | "us", lang: Lang): FooterLink[] {
  if (lang === "fr")
    return [
      { label: "Comment ça marche", href: "#how-it-works" },
      { label: "Avantages", href: "#benefits" },
      { label: "Tarifs", href: "#pricing" },
      { label: "Articles", href: "/articles", en: true },
      { label: "Centre d'aide", href: "/fr/faq" },
      { label: "Nous joindre", href: "/fr/contact" },
    ];
  const prefix = region === "us" ? "/us" : "";
  return [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Benefits", href: "#benefits" },
    { label: "Pricing", href: "#pricing" },
    { label: "Articles", href: `${prefix}/articles` },
    { label: "Help Center", href: `${prefix}/faq` },
    { label: "Contact", href: `${prefix}/contact` },
  ];
}

// Cross-origin: the web app owns auth. Plain anchors, same tab.
const ACCOUNT_LINKS: Record<Lang, FooterLink[]> = {
  en: [
    { label: "Log in", href: ROUTES.login },
    { label: "Sign up", href: ROUTES.signup },
  ],
  // The portal's own fr labels (authPage.loginTitle / signupTitle).
  fr: [
    { label: "Se connecter", href: ROUTES.login },
    { label: "S'inscrire", href: ROUTES.signup },
  ],
};

const LEGAL_LINKS: Record<Lang, { label: string; href: AppRoute; en?: boolean }[]> = {
  en: [
    { label: "Terms of Use", href: ROUTES.terms },
    { label: "Privacy Policy", href: ROUTES.privacy },
  ],
  fr: [
    { label: "Conditions d'utilisation", href: ROUTES.terms, en: true },
    { label: "Politique de confidentialité", href: ROUTES.privacy, en: true },
  ],
};

const FOOTER_COPY: Record<Lang, Record<string, string>> = {
  en: {
    backToTop: "Back to top",
    product: "Product",
    account: "Account",
    legal: "Legal",
    rights: "All rights reserved.",
  },
  fr: {
    backToTop: "Retour en haut",
    product: "Produit",
    account: "Compte",
    legal: "Juridique",
    rights: "Tous droits réservés.",
  },
};

const SOCIAL = [
  { Icon: XIcon, label: "X", href: "https://x.com/receiptone" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/receiptone" },
  { Icon: Facebook, label: "Facebook", href: "https://facebook.com/receiptone" },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Matches Header.tsx's scrollTo() -- same mobile/desktop offset and the same
// find-on-page-else-navigate-with-hash fallback, so a "How It Works"/"Benefits"/
// "Pricing" click behaves identically whether it's clicked from the header or
// the footer, and whether or not those sections exist on the current page.
const scrollOffset = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches ? 88 : 104;

export function Footer({ region = "ca" }: FooterProps) {
  const navigate = useNavigate();
  const lang: Lang = useLang() === "fr" && region === "ca" ? "fr" : "en";
  const t = FOOTER_COPY[lang];
  const home = region === "us" ? "/us" : lang === "fr" ? "/fr" : "/ca";
  const tagline =
    region === "us"
      ? "Turn receipts into IRS-ready expense reports in seconds. Built for US freelancers and contractors."
      : lang === "fr"
        ? "Un reçu photographié, un rapport prêt pour l'ARC. Conçu pour les travailleurs autonomes et les contractuels du Canada qui préfèrent travailler plutôt que remplir des papiers."
        : "Snap a receipt, get a CRA-ready report. Built for Canadian freelancers and contractors who'd rather work than do paperwork.";

  const scrollToSection = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset();
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      navigate({ to: home as any, hash: id });
    }
  };

  return (
    <footer data-surface="void" className="w-full bg-ink text-paper">
      <div className="mx-auto max-w-[1200px] px-4 pt-8 pb-4 sm:px-6 lg:px-8 lg:pt-10">
        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2.5 focus-visible:outline-none"
              aria-label={t.backToTop}
            >
              <img src={logoMark} alt="" aria-hidden className="size-8 shrink-0" />
              <img
                src={logoWordmark}
                alt="ReceiptOne"
                className="h-5 shrink-0 brightness-0 invert"
              />
            </button>

            <p className="mt-3 text-sm text-paper-40">{tagline}</p>

            {/* Social */}
            <div className="mt-4 flex items-center gap-4">
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-pill border border-hairline-void text-paper-40 transition-colors hover:border-paper-40 hover:text-paper"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-3 gap-4 lg:col-span-3">
            {/* Product */}
            <div>
              <p className="eyebrow">{t.product}</p>
              <ul className="mt-2 space-y-1.5">
                {productLinks(region, lang).map(({ label, href, en }) => {
                  const isHashLink = href.startsWith("#");
                  return (
                    <li key={label}>
                      <a
                        href={href}
                        hrefLang={en ? "en" : undefined}
                        onClick={isHashLink ? scrollToSection(href.slice(1)) : undefined}
                        className="font-sans text-sm text-paper-60 transition-colors hover:text-paper"
                      >
                        {label}
                        {en && EN_ONLY}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="eyebrow">{t.account}</p>
              <ul className="mt-2 space-y-1.5">
                {ACCOUNT_LINKS[lang].map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="font-sans text-sm text-paper-60 transition-colors hover:text-paper"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="eyebrow">{t.legal}</p>
              <ul className="mt-2 space-y-1.5">
                {LEGAL_LINKS[lang].map(({ label, href, en }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      hrefLang={en ? "en" : undefined}
                      className="font-sans text-sm text-paper-60 transition-colors hover:text-paper"
                    >
                      {label}
                      {en && EN_ONLY}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Store badges — one row, left-aligned, directly above the copyright line */}
        <div className="mt-6 flex items-center gap-2">
          <StoreBadge platform="apple" region={region} variant="dark" size="sm" />
          <StoreBadge platform="google" region={region} variant="dark" size="sm" />
        </div>

        {/* Bottom bar */}
        <div className="mt-4 flex flex-col items-center justify-between gap-2 border-t border-hairline-void pt-4 sm:flex-row">
          <p className="font-sans text-sm text-paper-40">
            &copy; {new Date().getFullYear()} ReceiptOne. {t.rights}
          </p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS[lang].map(({ label, href, en }) => (
              <Link
                key={label}
                to={href}
                hrefLang={en ? "en" : undefined}
                className="font-sans text-sm text-paper-40 transition-colors hover:text-paper-80"
              >
                {label}
                {en && EN_ONLY}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
