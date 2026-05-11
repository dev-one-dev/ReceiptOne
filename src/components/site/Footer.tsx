import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";
import { ROUTES } from "@/lib/routes";

type FooterProps = {
  region?: "ca" | "us";
};

const PRODUCT_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
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

export function Footer({ region = "ca" }: FooterProps) {
  const tagline =
    region === "us"
      ? "The fastest way to turn receipts into IRS-ready expense reports. Built for US freelancers and contractors."
      : "The fastest way to turn receipts into CRA-ready expense reports. Built for Canadian freelancers and contractors.";

  return (
    <footer className="w-full bg-[#0d0d14] text-white">
      <div className="mx-auto max-w-[1200px] px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-20">

        {/* Main grid */}
        <div className="grid gap-12 lg:grid-cols-4">

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

            <p className="mt-5 text-sm leading-relaxed text-white/45">
              {tagline}
            </p>

            {/* Social */}
            <div className="mt-8 flex items-center gap-4">
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
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-3 gap-8 lg:col-span-3">

            {/* Product */}
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/30">
                Product
              </p>
              <ul className="mt-5 space-y-3">
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
              <ul className="mt-5 space-y-3">
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
              <ul className="mt-5 space-y-3">
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
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-6 sm:flex-row">
          <p className="font-sans text-sm text-white/30">
            &copy; {new Date().getFullYear()} ReceiptOne. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
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
