import { Link, useNavigate } from "@tanstack/react-router";
import { Facebook, Linkedin } from "lucide-react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";
import { ROUTES } from "@/lib/routes";
import { StoreBadge } from "@/components/site/StoreBadge";

type FooterProps = {
  region?: "ca" | "us";
};

function productLinks(region: "ca" | "us") {
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

const COMPANY_LINKS_CA = [
  { label: "Log in", href: ROUTES.login, internal: true },
  { label: "Sign up", href: ROUTES.signup, internal: true },
];

const LEGAL_LINKS = [
  { label: "Terms of Use", href: ROUTES.terms, internal: true },
  { label: "Privacy Policy", href: ROUTES.privacy, internal: true },
];

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
  const tagline =
    region === "us"
      ? "Turn receipts into IRS-ready expense reports in seconds. Built for US freelancers and contractors."
      : "Snap a receipt, get a CRA-ready report. Built for Canadian freelancers and contractors who'd rather work than do paperwork.";

  const scrollToSection = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset();
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      navigate({ to: (region === "us" ? "/us" : "/ca") as any, hash: id });
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
              aria-label="Back to top"
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

            {/* Store badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StoreBadge platform="apple" variant="dark" />
              <StoreBadge platform="google" variant="dark" />
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-3 gap-4 lg:col-span-3">
            {/* Product */}
            <div>
              <p className="eyebrow">Product</p>
              <ul className="mt-2 space-y-1.5">
                {productLinks(region).map(({ label, href }) => {
                  const isHashLink = href.startsWith("#");
                  return (
                    <li key={label}>
                      <a
                        href={href}
                        onClick={isHashLink ? scrollToSection(href.slice(1)) : undefined}
                        className="font-sans text-sm text-paper-60 transition-colors hover:text-paper"
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="eyebrow">Account</p>
              <ul className="mt-2 space-y-1.5">
                {COMPANY_LINKS_CA.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href as (typeof ROUTES)[keyof typeof ROUTES]}
                      className="font-sans text-sm text-paper-60 transition-colors hover:text-paper"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="eyebrow">Legal</p>
              <ul className="mt-2 space-y-1.5">
                {LEGAL_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href as (typeof ROUTES)[keyof typeof ROUTES]}
                      className="font-sans text-sm text-paper-60 transition-colors hover:text-paper"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-hairline-void pt-4 sm:flex-row">
          <p className="font-sans text-sm text-paper-40">
            &copy; {new Date().getFullYear()} ReceiptOne. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                to={href as (typeof ROUTES)[keyof typeof ROUTES]}
                className="font-sans text-sm text-paper-40 transition-colors hover:text-paper-80"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
