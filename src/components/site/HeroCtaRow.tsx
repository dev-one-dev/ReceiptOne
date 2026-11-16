import heroQr from "@/assets/app-qr-hero.svg";
import { AppQrImage } from "@/components/site/AppQr";
import { PrimaryCta } from "@/components/site/PrimaryCta";
import { StoreBadge } from "@/components/site/StoreBadge";
import { ROUTES } from "@/lib/routes";
import type { Lang } from "@/lib/locales";
import type { StoreRegion } from "@/lib/stores";

/**
 * The hero call to action, shared by the landing hero (TopBanner, from xl)
 * and /ca/drivers (from lg).
 *
 * Below the breakpoint it is the row it always was: the trial button, then
 * the store badges, stacked on phones and wrapping from sm. The new pieces
 * are display:none there and the group wrappers are display:contents, so the
 * button and the badge strip are direct items of that row, unchanged.
 *
 * From the breakpoint, a 3 x 2 grid:
 *
 *               |   | OR GET THE APP
 *   [trial btn] | | | [QR] [App Store ]
 *   no card    |   |      [Google Play]
 *
 * Primary group (button + no-card line) on the left; a 1px hairline divider
 * centred in a 41px gutter (20 + 1 + 20), as tall as the QR tile; the
 * secondary group on the right: an eyebrow label in row 1, the QR and the
 * badges (8px apart, centred on the QR) in row 2. Row 2 is top-aligned, so
 * the button's top edge is the QR tile's top edge, not the label's.
 */

type Breakpoint = "lg" | "xl";

/** Literal class strings per breakpoint, so Tailwind sees every one. */
const BP: Record<
  Breakpoint,
  {
    row: string;
    primary: string;
    line: string;
    divider: string;
    label: string;
    secondary: string;
    qr: string;
    badges: string;
  }
> = {
  lg: {
    row: "lg:grid lg:w-max lg:grid-cols-[auto_auto_auto] lg:items-start lg:gap-x-5 lg:gap-y-2",
    primary: "contents lg:col-start-1 lg:row-start-2 lg:flex lg:flex-col",
    line: "hidden text-sm text-ink-60 lg:mt-2 lg:block",
    divider:
      "hidden border-l border-hairline lg:col-start-2 lg:row-start-2 lg:block lg:self-stretch",
    label: "eyebrow hidden lg:col-start-3 lg:row-start-1 lg:block",
    secondary: "contents lg:col-start-3 lg:row-start-2 lg:flex lg:items-center lg:gap-3",
    qr: "hidden lg:block",
    badges: "lg:flex-col lg:flex-nowrap lg:items-stretch lg:gap-2",
  },
  xl: {
    row: "xl:grid xl:w-max xl:grid-cols-[auto_auto_auto] xl:items-start xl:gap-x-5 xl:gap-y-2",
    primary: "contents xl:col-start-1 xl:row-start-2 xl:flex xl:flex-col",
    line: "hidden text-sm text-ink-60 xl:mt-2 xl:block",
    divider:
      "hidden border-l border-hairline xl:col-start-2 xl:row-start-2 xl:block xl:self-stretch",
    label: "eyebrow hidden xl:col-start-3 xl:row-start-1 xl:block",
    secondary: "contents xl:col-start-3 xl:row-start-2 xl:flex xl:items-center xl:gap-3",
    qr: "hidden xl:block",
    badges: "xl:flex-col xl:flex-nowrap xl:items-stretch xl:gap-2",
  },
};

const COPY: Record<Lang, { trial: string; noCard: string; orApp: string; availableOn: string }> = {
  en: {
    trial: "Start 7-day free trial",
    noCard: "No credit card required",
    orApp: "or get the app",
    availableOn: "Available on:",
  },
  fr: {
    trial: "Commencer l'essai gratuit de 7 jours",
    noCard: "Aucune carte de crédit requise",
    orApp: "ou obtenez l'application",
    availableOn: "Offert sur :",
  },
};

export function HeroCtaRow({
  from,
  lang,
  region,
  qrSize = 112,
  className,
  badgeAlign,
}: {
  /** The breakpoint the grid (and the QR) starts at. */
  from: Breakpoint;
  lang: Lang;
  region: StoreRegion;
  /** 96 for FR on the landing hero: at 112 its row does not clear the mascot column. */
  qrSize?: 112 | 96;
  /** The row's own margin/stacking classes, as each page had them. */
  className: string;
  /** Where the badge strip left-aligns below the breakpoint, as before. */
  badgeAlign: "sm:justify-start" | "lg:justify-start";
}) {
  const c = BP[from];
  const t = COPY[lang];
  return (
    <div
      data-hero-cta
      className={`${className} flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center ${c.row}`}
    >
      {/* Primary group */}
      <div data-hero-cta-primary className={c.primary}>
        <PrimaryCta href={ROUTES.signup}>{t.trial}</PrimaryCta>
        <p className={c.line}>{t.noCard}</p>
      </div>
      {/* Divider: hairline token, as tall as the QR row. */}
      <span data-hero-cta-divider aria-hidden className={c.divider} />
      {/* Secondary group: label above, QR + badges below. */}
      <p className={c.label}>{t.orApp}</p>
      <div data-hero-cta-secondary className={c.secondary}>
        {/* display:none below the breakpoint, so it is not even fetched there. */}
        <AppQrImage src={heroQr} size={qrSize} variant="light" className={c.qr} />
        <div
          className={`flex flex-wrap items-center justify-center gap-3 ${badgeAlign} ${c.badges}`}
        >
          {/* Kept for screen readers; visually the badges speak for themselves. */}
          <span className="sr-only">{t.availableOn}</span>
          <StoreBadge platform="apple" region={region} />
          <StoreBadge platform="google" region={region} />
        </div>
      </div>
    </div>
  );
}
