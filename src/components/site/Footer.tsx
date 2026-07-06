import { Link } from "@tanstack/react-router";
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

export function Footer({ region = "ca" }: FooterProps) {
  const tagline =
    region === "us"
      ? "The fastest way to turn receipts into IRS-ready expense reports. Built for US freelancers and contractors."
      : "Snap a receipt, get a CRA-ready report. Built for Canadian freelancers and contractors who'd rather work than do paperwork.";

  return (
    <footer className="w-full bg-[#0d0d14] text-white">
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
              <img src={logoWordmark} alt="ReceiptOne" className="h-5 shrink-0 brightness-0 invert" />
            </button>

            <p className="mt-3 text-sm leading-relaxed text-white/45">
              {tagline}
            </p>

            {/* Social */}
            <div className="mt-4 flex items-center gap-4">
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-white/25 hover:text-white"
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
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/50">
                Product
              </p>
              <ul className="mt-2 space-y-1.5">
                {productLinks(region).map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="font-sans text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/50">
                Account
              </p>
              <ul className="mt-2 space-y-1.5">
                {COMPANY_LINKS_CA.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href as typeof ROUTES[keyof typeof ROUTES]}
                      className="font-sans text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/50">
                Legal
              </p>
              <ul className="mt-2 space-y-1.5">
                {LEGAL_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href as typeof ROUTES[keyof typeof ROUTES]}
                      className="font-sans text-sm text-white/55 transition-colors hover:text-white"
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
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/[0.07] pt-4 sm:flex-row">
          <p className="font-sans text-sm text-white/50">
            &copy; {new Date().getFullYear()} ReceiptOne. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                to={href as typeof ROUTES[keyof typeof ROUTES]}
                className="font-sans text-sm text-white/50 transition-colors hover:text-white/80"
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
