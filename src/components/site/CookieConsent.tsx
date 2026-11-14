import { useEffect, useRef, useState, type Ref } from "react";
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

type BannerCopy = {
  title: string;
  body: string;
  link: string;
  accept: string;
  essential: string;
};

const COPY: Record<Lang, BannerCopy> = {
  en: {
    title: "We use a few cookies",
    body: "Essential cookies keep the site working and remember which link brought you here. With your OK, Google Analytics cookies measure visits. Choose Essential only and no analytics code loads. See our",
    link: "Cookie Policy",
    accept: "Accept all",
    essential: "Essential only",
  },
  fr: {
    title: "Nous utilisons quelques témoins",
    body: "Les témoins essentiels font fonctionner le site et retiennent le lien qui vous a amené ici. Avec votre accord, les témoins de Google Analytics mesurent les visites. Choisissez Essentiels seulement et aucun code d'analyse n'est chargé. Consultez notre",
    link: "Politique relative aux témoins",
    accept: "Tout accepter",
    essential: "Essentiels seulement",
  },
};

// Same size on purpose: equal prominence. Accept all is filled, Essential only
// is outlined; both are ink on paper. Stacked full-width on phones (the French
// labels do not fit two-up at 375px), side by side from sm.
const BUTTON_BASE =
  "rounded-pill border border-ink px-4 py-2 font-display text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember";
const BUTTON_FILLED = `${BUTTON_BASE} bg-ink text-paper`;
const BUTTON_OUTLINED = `${BUTTON_BASE} bg-paper text-ink`;

type BannerProps = {
  lang: Lang;
  onChoose: (choice: ConsentChoice) => void;
  firstButtonRef?: Ref<HTMLButtonElement>;
};

/** The banner itself, stateless: title, text, policy link and the two choice buttons. */
export function CookieConsentBanner({ lang, onChoose, firstButtonRef }: BannerProps) {
  const t = COPY[lang];
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-text"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4 sm:px-6 lg:px-8 print:hidden"
    >
      <div className="pointer-events-auto flex w-full max-w-[1200px] flex-col gap-3 rounded-card border border-hairline bg-paper p-4 shadow-[0_12px_40px_rgba(0,0,0,0.10)] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p id="cookie-consent-title" className="font-display text-body font-semibold text-ink">
            {t.title}
          </p>
          <p id="cookie-consent-text" className="mt-1 font-sans text-sm text-ink-80">
            {t.body}{" "}
            <Link
              to={lang === "fr" ? "/fr/privacy" : "/privacy"}
              hash="section-2-4"
              className="text-ink underline underline-offset-4"
            >
              {t.link}
            </Link>
            .
          </p>
        </div>
        <div className="grid shrink-0 gap-2 sm:auto-cols-fr sm:grid-flow-col">
          <button
            ref={firstButtonRef}
            type="button"
            className={BUTTON_FILLED}
            onClick={() => onChoose("granted")}
          >
            {t.accept}
          </button>
          <button type="button" className={BUTTON_OUTLINED} onClick={() => onChoose("denied")}>
            {t.essential}
          </button>
        </div>
      </div>
    </div>
  );
}

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

  return <CookieConsentBanner lang={lang} onChoose={choose} firstButtonRef={firstButton} />;
}
