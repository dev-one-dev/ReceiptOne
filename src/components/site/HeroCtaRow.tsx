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
 * From the breakpoint, a 2 x 2 grid:
 *
 *                       OR GET THE APP
 *   [trial btn]   gap   [QR] [App Store ]
 *   no card                  [Google Play]
 *
 * Primary group (button + no-card line) on the left; then a plain gap, no
 * divider: 56px, or 52px for FR on the landing hero, where 56 would run the
 * row into the mascot column; then the secondary group: an eyebrow label in
 * row 1, the QR and the badges (8px apart, centred on the QR) in row 2. Row 2
 * is top-aligned, so the button's top edge is the QR tile's top edge, not the
 * label's.
 */

type Breakpoint = "lg" | "xl";

/** Gap between the two groups, in px. */
type GroupGap = 56 | 52;

/** Literal gap classes per breakpoint, so Tailwind sees every one. */
const GAP: Record<Breakpoint, Record<GroupGap, string>> = {
  lg: { 56: "lg:gap-x-14", 52: "lg:gap-x-13" },
  xl: { 56: "xl:gap-x-14", 52: "xl:gap-x-13" },
};

/** Literal class strings per breakpoint, so Tailwind sees every one. */
const BP: Record<
  Breakpoint,
  {
    row: string;
    primary: string;
    line: string;
    label: string;
    secondary: string;
    qr: string;
    badges: string;
  }
> = {
  lg: {
    row: "lg:grid lg:w-max lg:grid-cols-[auto_auto] lg:items-start lg:gap-y-2",
    primary: "contents lg:col-start-1 lg:row-start-2 lg:flex lg:flex-col",
    line: "hidden text-sm text-ink-60 lg:mt-2 lg:block",
    label: "eyebrow hidden lg:col-start-2 lg:row-start-1 lg:block",
    secondary: "contents lg:col-start-2 lg:row-start-2 lg:flex lg:items-center lg:gap-3",
    qr: "hidden lg:block",
    badges: "lg:flex-col lg:flex-nowrap lg:items-stretch lg:gap-2",
  },
  xl: {
    row: "xl:grid xl:w-max xl:grid-cols-[auto_auto] xl:items-start xl:gap-y-2",
    primary: "contents xl:col-start-1 xl:row-start-2 xl:flex xl:flex-col",
    line: "hidden text-sm text-ink-60 xl:mt-2 xl:block",
    label: "eyebrow hidden xl:col-start-2 xl:row-start-1 xl:block",
    secondary: "contents xl:col-start-2 xl:row-start-2 xl:flex xl:items-center xl:gap-3",
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
  gap = 56,
  className,
  badgeAlign,
}: {
  /** The breakpoint the grid (and the QR) starts at. */
  from: Breakpoint;
  lang: Lang;
  region: StoreRegion;
  /** 96 for FR on the landing hero: at 112 its row does not clear the mascot column. */
  qrSize?: 112 | 96;
  /**
   * Gap between the groups: 56, or 52 for FR on the landing hero, whose row is
   * then 622.5px against 624 before the mascot column (56 would make it 626.5).
   */
  gap?: GroupGap;
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
      className={`${className} flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center ${c.row} ${GAP[from][gap]}`}
    >
      {/* Primary group */}
      <div data-hero-cta-primary className={c.primary}>
        <PrimaryCta href={ROUTES.signup}>{t.trial}</PrimaryCta>
        <p className={c.line}>{t.noCard}</p>
      </div>
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
