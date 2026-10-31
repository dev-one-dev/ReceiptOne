/**
 * Google Analytics 4 behind basic consent mode.
 *
 * Nothing Google-related exists on the page -- no dataLayer, no gtag.js, no
 * request to googletagmanager.com or google-analytics.com -- until the
 * visitor has ro_consent=granted (see lib/consent.ts). On grant, the
 * bootstrap below runs once: consent default (all denied), consent update
 * (all granted), then gtag.js and config. cookie_domain is left on "auto"
 * so _ga lands on .receipt-one.com and is shared with app.receipt-one.com,
 * which uses the same Measurement ID.
 *
 * Page views -- ONE mechanism: gtag itself. config is sent with its default
 * send_page_view (one page_view for the page consent was granted on, and one
 * per full load after that), and SPA route changes are counted by GA4
 * enhanced measurement's "page changes based on browser history events",
 * which is ON for this web stream. The app sends NO page_view of its own:
 * measured against the built site, a router-driven page_view on top of the
 * history events counted every SPA navigation twice (enhanced measurement
 * fires on history changes even with send_page_view: false). If that stream
 * setting is ever switched off, SPA navigations stop being counted -- add a
 * router page_view then, never both.
 *
 * Decline: consent update (all denied) plus window["ga-disable-<ID>"], so
 * the already-loaded tag sends nothing at all -- not even the cookieless
 * pings advanced consent mode would send.
 *
 * The factory takes its window/document so the tests can drive it with
 * fakes; the default instance below uses the real globals.
 */
import { APP_URL } from "./external.ts";

export type CtaType = "signup" | "login" | "app_store" | "google_play";
/** TopBanner renders the landing hero, so its CTAs report "hero". */
export type CtaLocation = "header" | "top_banner" | "hero" | "pricing" | "final_cta" | "footer";

const CTA_LOCATIONS: readonly CtaLocation[] = [
  "header",
  "top_banner",
  "hero",
  "pricing",
  "final_cta",
  "footer",
];

/** Set on the section that owns a CTA; read by the delegated click listener. */
export const CTA_LOCATION_ATTR = "data-cta-location";

const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;

/** VITE_FIREBASE_MEASUREMENT_ID, or undefined when unset or malformed. */
export function readMeasurementId(): string | undefined {
  const viteEnv = import.meta.env as Record<string, string | undefined> | undefined;
  const value = viteEnv?.VITE_FIREBASE_MEASUREMENT_ID?.trim();
  return value && MEASUREMENT_ID_PATTERN.test(value) ? value : undefined;
}

/** Which CTA an href points at, or null for any other link. */
export function classifyCta(href: string, appOrigin: string = APP_URL): CtaType | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (host === "apps.apple.com") return "app_store";
  if (host === "play.google.com") return "google_play";
  let app: URL;
  try {
    app = new URL(appOrigin);
  } catch {
    return null;
  }
  if (url.origin !== app.origin) return null;
  const path = url.pathname.replace(/\/+$/, "");
  if (path === "/signup") return "signup";
  if (path === "/login") return "login";
  return null;
}

export function parseCtaLocation(value: string | null | undefined): CtaLocation | null {
  return value && (CTA_LOCATIONS as readonly string[]).includes(value)
    ? (value as CtaLocation)
    : null;
}

type Gtag = (...args: unknown[]) => void;

type AnalyticsWindow = {
  dataLayer?: unknown[];
  gtag?: Gtag;
  /** window["ga-disable-G-…"]: gtag's own kill switch. */
  [gaDisable: `ga-disable-${string}`]: boolean | undefined;
};

type AnalyticsDocument = {
  createElement(tag: "script"): { async: boolean; src: string };
  head: { appendChild(node: unknown): unknown };
};

export type AnalyticsDeps = {
  win: AnalyticsWindow;
  doc: AnalyticsDocument;
  measurementId: string | undefined;
};

const ALL_DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

const ALL_GRANTED = {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
} as const;

export function createAnalytics(deps: AnalyticsDeps) {
  const { win, doc, measurementId } = deps;
  let loaded = false;
  let granted = false;

  const gtag: Gtag = (...args) => win.gtag?.(...args);

  /** Consent was granted (now, or on an earlier visit). Idempotent. */
  function grant(): void {
    if (!measurementId) return;
    granted = true;
    win[`ga-disable-${measurementId}`] = false;
    if (loaded) {
      gtag("consent", "update", ALL_GRANTED);
    } else {
      loaded = true;
      win.dataLayer = win.dataLayer || [];
      // gtag.js reads the Arguments object, not an array -- this must stay a
      // classic function using `arguments`.
      win.gtag = function gtagShim() {
        // eslint-disable-next-line prefer-rest-params
        win.dataLayer!.push(arguments);
      };
      gtag("consent", "default", ALL_DENIED);
      gtag("consent", "update", ALL_GRANTED);
      gtag("js", new Date());
      // Default send_page_view: this sends the page_view for the current page.
      gtag("config", measurementId);
      const script = doc.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      doc.head.appendChild(script);
    }
  }

  /** Consent was withdrawn. gtag stays loaded but stores and sends nothing. */
  function deny(): void {
    granted = false;
    if (!loaded || !measurementId) return;
    gtag("consent", "update", ALL_DENIED);
    win[`ga-disable-${measurementId}`] = true;
  }

  function trackCtaClick(cta: CtaType, location: CtaLocation): void {
    if (!loaded || !granted) return;
    gtag("event", "cta_click", { cta, location, transport_type: "beacon" });
  }

  /**
   * Delegated click handler: classifies the clicked <a> by its href and the
   * nearest [data-cta-location] ancestor. Never prevents or delays the click.
   */
  function handleClick(event: { target: unknown }): void {
    if (!loaded || !granted) return;
    const target = event.target as { closest?: (selector: string) => Element | null } | null;
    const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null | undefined;
    if (!anchor) return;
    const cta = classifyCta(anchor.href);
    if (!cta) return;
    const location = parseCtaLocation(
      anchor.closest(`[${CTA_LOCATION_ATTR}]`)?.getAttribute(CTA_LOCATION_ATTR),
    );
    if (location) trackCtaClick(cta, location);
  }

  return {
    grant,
    deny,
    trackCtaClick,
    handleClick,
    get loaded() {
      return loaded;
    },
  };
}

export type Analytics = ReturnType<typeof createAnalytics>;

let instance: Analytics | null = null;

/** The page's analytics instance; null during SSR. */
export function getAnalytics(): Analytics | null {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  if (!instance) {
    instance = createAnalytics({
      win: window as unknown as AnalyticsWindow,
      doc: document,
      measurementId: readMeasurementId(),
    });
  }
  return instance;
}
