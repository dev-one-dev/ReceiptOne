import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  OPEN_CONSENT_EVENT,
  deleteAnalyticsCookies,
  getConsent,
  saveConsent,
  type ConsentChoice,
} from "@/lib/consent";
import { getAnalytics } from "@/lib/analytics";
import { useLang } from "@/lib/use-lang";
import type { Lang } from "@/lib/locales";

const COPY: Record<
  Lang,
  { label: string; text: string; link: string; accept: string; decline: string }
> = {
  en: {
    label: "Cookie consent",
    text: "With your OK, we use Google Analytics cookies to measure site visits and ad performance.",
    link: "Cookie details",
    accept: "Accept",
    decline: "Decline",
  },
  fr: {
    label: "Consentement aux témoins",
    text: "Avec votre accord, nous utilisons les témoins de Google Analytics pour mesurer les visites et la performance de nos publicités.",
    // The privacy policy is English-only for now.
    link: "Détails sur les témoins (en anglais)",
    accept: "Accepter",
    decline: "Refuser",
  },
};

// Accept and Decline share one style on purpose: equal prominence.
const BUTTON =
  "flex-1 rounded-pill border border-ink bg-ink px-4 py-2 font-display text-sm font-semibold text-paper transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember sm:flex-none";

/**
 * Consent banner + analytics wiring. Client-only: renders nothing until
 * mounted, then shows until ro_consent is set. Not a wall -- a strip pinned
 * to the bottom that leaves the page readable and usable.
 *
 * Also owns the delegated cta_click listener, which only reports once
 * consent is granted (see lib/analytics.ts).
 */
export function CookieConsent() {
  const lang = useLang();
  const t = COPY[lang];
  const [open, setOpen] = useState(false);
  const focusOnOpen = useRef(false);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const firstButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const choice = getConsent();
    if (choice === "granted") getAnalytics()?.grant();
    else if (choice === null) setOpen(true);

    const onOpen = () => {
      returnFocusTo.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      focusOnOpen.current = true;
      setOpen(true);
      // Already open: the effect below won't re-run, so focus here.
      firstButton.current?.focus();
    };
    // Capture phase so the event is seen even if a handler further down
    // unmounts the link (e.g. the mobile menu closing on click).
    const onClick = (event: MouseEvent) => getAnalytics()?.handleClick(event);

    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false;
      firstButton.current?.focus();
    }
  }, [open]);

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    const analytics = getAnalytics();
    if (choice === "granted") {
      analytics?.grant();
    } else {
      analytics?.deny();
      deleteAnalyticsCookies();
    }
    setOpen(false);
    returnFocusTo.current?.focus();
    returnFocusTo.current = null;
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t.label}
      aria-describedby="cookie-consent-text"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4 sm:px-6 lg:px-8 print:hidden"
    >
      <div className="pointer-events-auto flex w-full max-w-[1200px] flex-col gap-3 rounded-card border border-hairline bg-paper p-4 shadow-[0_12px_40px_rgba(0,0,0,0.10)] sm:flex-row sm:items-center sm:justify-between">
        <p id="cookie-consent-text" className="font-sans text-sm text-ink-80">
          {t.text}{" "}
          <Link
            to="/privacy"
            hash="section-2-4"
            hrefLang={lang === "fr" ? "en" : undefined}
            className="text-ink underline underline-offset-4"
          >
            {t.link}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            ref={firstButton}
            type="button"
            className={BUTTON}
            onClick={() => choose("granted")}
          >
            {t.accept}
          </button>
          <button type="button" className={BUTTON} onClick={() => choose("denied")}>
            {t.decline}
          </button>
        </div>
      </div>
    </div>
  );
}
