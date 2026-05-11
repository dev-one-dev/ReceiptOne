import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";
import { ROUTES } from "@/lib/routes";

const APP_STORE_URL = "https://apps.apple.com/app/receiptone/id0000000000";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.receiptone.app";

type FooterProps = {
  region?: "ca" | "us";
};

const PRODUCT_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "Pricing", href: "#pricing" },
  { label: "Articles", href: "/articles" },
  { label: "Help Center", href: "/faq" },
];

const COMPANY_LINKS_CA = [
  { label: "Log in", href: ROUTES.login, internal: true },
  { label: "Sign up", href: ROUTES.signup, internal: true },
];

const LEGAL_LINKS = [
  { label: "Terms of Use", href: ROUTES.terms, internal: true },
  { label: "Privacy Policy", href: ROUTES.privacy, internal: true },
];

const SOCIAL = [
  { Icon: Twitter, label: "Twitter", href: "https://twitter.com/receiptone" },
  { Icon: Instagram, label: "Instagram", href: "https://instagram.com/receiptone" },
  { Icon: Facebook, label: "Facebook", href: "https://facebook.com/receiptone" },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function FooterAppleGlyph() {
  return (
    <svg className="h-[16px] w-[16px] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function FooterGooglePlayMark() {
  return (
    <svg className="h-[16px] w-[16px] shrink-0" viewBox="0 0 29.4 32" fill="none" aria-hidden>
      <path fill="#00D9FF" d="M13.3 15.1 1.1 2.9C.4 3.6 0 4.6 0 5.7v20.7c0 1 .4 2 1.1 2.7l12.2-12.2v-.8Z" />
      <path fill="#FFD23D" d="m27.5 13.8-5.1-3L14.3 15v2l8.1 4.7 5.1-3c1.6-.9 1.6-3.1 0-4Z" />
      <path fill="#FF3A44" d="M14.3 17v2L2.1 31.2c.7.7 1.7 1.1 2.8 1.1.6 0 1.2-.1 1.7-.4l12.2-7V17h-4.5Z" />
      <path fill="#00F076" d="M14.3 15 4.8.8C4.3.4 3.7.2 3.1.2 2 .2 1 .6.3 1.3L14.3 15Z" />
    </svg>
  );
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
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download ReceiptOne on the App Store"
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-3 font-display text-white transition-colors hover:bg-white/[0.13]"
              >
                <FooterAppleGlyph />
                <span className="flex flex-col items-start">
                  <span className="text-[7px] font-normal leading-none text-white/45">Download on the</span>
                  <span className="text-[11px] font-semibold leading-tight">App Store</span>
                </span>
              </a>
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get ReceiptOne on Google Play"
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-3 font-display text-white transition-colors hover:bg-white/[0.13]"
              >
                <FooterGooglePlayMark />
                <span className="flex flex-col items-start">
                  <span className="text-[7px] font-normal leading-none text-white/45">GET IT ON</span>
                  <span className="text-[11px] font-semibold leading-tight">Google Play</span>
                </span>
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-3 gap-4 lg:col-span-3">

            {/* Product */}
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/30">
                Product
              </p>
              <ul className="mt-2 space-y-1.5">
                {PRODUCT_LINKS.map(({ label, href }) => (
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
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/30">
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
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/30">
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
          <p className="font-sans text-sm text-white/30">
            &copy; {new Date().getFullYear()} ReceiptOne. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                to={href as typeof ROUTES[keyof typeof ROUTES]}
                className="font-sans text-sm text-white/30 transition-colors hover:text-white/60"
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
