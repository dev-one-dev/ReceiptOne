/**
 * Upcoming tax deadlines shown in the landing-page footer (/ca, /fr, /us).
 *
 * Update for the next tax year after the last date passes.
 *
 * Only dates on or after today are shown; "today" is the server's clock at
 * render (passed in from the route loader), read in the region's westernmost
 * mainland time zone so a deadline stays listed until its day is over
 * everywhere it applies. When every date has passed the whole block is hidden.
 *
 * No React imports -- pure data, so tests and build scripts can load it.
 */
import type { Lang } from "@/lib/locales";

export type DeadlineRegion = "ca" | "us";

/** English always; French where the region has a French page (/fr is Canadian). */
type Localized<T> = { en: T; fr?: T };

export interface TaxDeadline {
  /** YYYY-MM-DD */
  date: string;
  label: Localized<string>;
}

export interface TaxDeadlineSet {
  taxYear: number;
  timeZone: string;
  title: Localized<string>;
  source: Localized<{ url: string; host: string }>;
  deadlines: TaxDeadline[];
}

export const TAX_DEADLINES: Record<DeadlineRegion, TaxDeadlineSet> = {
  ca: {
    taxYear: 2026,
    timeZone: "America/Vancouver",
    title: {
      en: "Key CRA dates — 2026 tax year",
      fr: "Dates clés de l'ARC — année d'imposition 2026",
    },
    source: {
      en: {
        url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/important-dates-individuals.html",
        host: "canada.ca",
      },
      fr: {
        url: "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/dates-importantes-particuliers.html",
        host: "canada.ca",
      },
    },
    deadlines: [
      { date: "2026-12-15", label: { en: "Q4 instalment", fr: "Versement du 4e trimestre" } },
      { date: "2027-03-15", label: { en: "Q1 instalment", fr: "Versement du 1er trimestre" } },
      { date: "2027-04-30", label: { en: "Balance owing due", fr: "Paiement du solde dû" } },
      {
        date: "2027-06-15",
        label: { en: "Self-employed return due", fr: "Déclaration des travailleurs autonomes" },
      },
    ],
  },
  us: {
    taxYear: 2026,
    timeZone: "America/Los_Angeles",
    title: { en: "Key IRS dates — 2026 tax year" },
    source: { en: { url: "https://www.irs.gov/filing/individuals/when-to-file", host: "irs.gov" } },
    deadlines: [
      { date: "2027-01-15", label: { en: "Q4 estimated tax payment" } },
      { date: "2027-04-15", label: { en: "Federal return and payment due" } },
    ],
  },
};

const MONTHS: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  fr: [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ],
};

/** "Dec 15, 2026" / "15 déc. 2026" -- fixed tables, so server and client agree. */
export function formatDeadlineDate(date: string, lang: Lang): string {
  const [y, m, d] = date.split("-").map(Number);
  const month = MONTHS[lang][m - 1];
  return lang === "fr" ? `${d} ${month} ${y}` : `${month} ${d}, ${y}`;
}

/** The calendar date (YYYY-MM-DD) of an instant in a time zone. */
export function dateInZone(now: string | Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(now));
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export interface UpcomingDeadlines {
  lang: Lang;
  title: string;
  sourceUrl: string;
  sourceHost: string;
  items: { date: string; display: string; label: string }[];
}

/**
 * The deadlines still ahead (date >= today in the region's zone), labelled in
 * `lang`; null when none are left, so the caller hides the block.
 * Falls back to English where a region has no French copy (/us).
 */
export function upcomingTaxDeadlines(
  region: DeadlineRegion,
  lang: Lang,
  now: string | Date,
): UpcomingDeadlines | null {
  const set = TAX_DEADLINES[region];
  const l: Lang = lang === "fr" && set.title.fr !== undefined ? "fr" : "en";
  const pick = <T>(v: Localized<T>): T => (l === "fr" && v.fr !== undefined ? v.fr : v.en);
  const today = dateInZone(now, set.timeZone);
  const items = set.deadlines
    .filter((d) => d.date >= today)
    .map((d) => ({ date: d.date, display: formatDeadlineDate(d.date, l), label: pick(d.label) }));
  if (items.length === 0) return null;
  const source = pick(set.source);
  return { lang: l, title: pick(set.title), sourceUrl: source.url, sourceHost: source.host, items };
}
