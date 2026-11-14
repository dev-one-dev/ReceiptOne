/**
 * CRA deadlines for the /ca and /fr footer, computed by rule, so they never
 * need a yearly update. Source: canada.ca (instalment due dates, important
 * dates for individuals).
 *
 *   Instalments for year Y:        Mar 15, Jun 15, Sep 15, Dec 15 of Y.
 *   Balance owing for tax year Y-1: Apr 30 of Y.
 *   Self-employed return for Y-1:   Jun 15 of Y.
 *
 * A payment or return due on a Saturday, Sunday or CRA public holiday is on
 * time if received by the next business day. No CRA public holiday ever falls
 * on Mar 15, Apr 30, Jun 15, Sep 15 or Dec 15 (they are all fixed or
 * weekday-anchored holidays on other dates), so only the weekend shift is
 * needed and there is no holiday list:
 * https://www.canada.ca/en/revenue-agency/services/tax/public-holidays.html
 *
 * All date math is on date-only "YYYY-MM-DD" values via UTC year/month/day,
 * never local-time Date arithmetic, so the server's time zone cannot shift a
 * day. "Today" is the server's clock at render (passed in from the route
 * loader), read on Pacific time so a deadline stays listed until its day is
 * over everywhere in Canada.
 *
 * No React imports -- pure functions, so tests can load it.
 */
import type { Lang } from "@/lib/locales";

export type CraDeadlineKind = "instalment" | "balance" | "return";

export interface CraDeadline {
  kind: CraDeadlineKind;
  /** 1-4 for instalments. */
  quarter?: 1 | 2 | 3 | 4;
  /** The date CRA publishes, YYYY-MM-DD. */
  officialDate: string;
  /** The last on-time day after the weekend shift, YYYY-MM-DD. */
  effectiveDate: string;
  /** The tax year the deadline relates to (Y for instalments, Y-1 otherwise). */
  taxYear: number;
  shifted: boolean;
}

/** Deadlines sharing an official date, shown as one row (Jun 15: return + Q2). */
export interface CraDeadlineRow {
  officialDate: string;
  effectiveDate: string;
  shifted: boolean;
  deadlines: CraDeadline[];
}

/** Pacific time: the last Canadian zone to finish a day. */
export const CRA_TIME_ZONE = "America/Vancouver";

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const toUtc = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const fromUtc = (dt: Date) => ymd(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());

/** Saturday -> Monday (+2), Sunday -> Monday (+1), weekdays unchanged. */
export function weekendShift(date: string): string {
  const dt = toUtc(date);
  const dow = dt.getUTCDay();
  const add = dow === 6 ? 2 : dow === 0 ? 1 : 0;
  if (add) dt.setUTCDate(dt.getUTCDate() + add);
  return fromUtc(dt);
}

function deadline(
  kind: CraDeadlineKind,
  officialDate: string,
  taxYear: number,
  quarter?: 1 | 2 | 3 | 4,
): CraDeadline {
  const effectiveDate = weekendShift(officialDate);
  return {
    kind,
    ...(quarter ? { quarter } : {}),
    officialDate,
    effectiveDate,
    taxYear,
    shifted: effectiveDate !== officialDate,
  };
}

/** Every CRA deadline that falls in calendar year `year`, in date order. */
export function craDeadlinesForYear(year: number): CraDeadline[] {
  return [
    deadline("instalment", ymd(year, 3, 15), year, 1),
    deadline("balance", ymd(year, 4, 30), year - 1),
    deadline("return", ymd(year, 6, 15), year - 1),
    deadline("instalment", ymd(year, 6, 15), year, 2),
    deadline("instalment", ymd(year, 9, 15), year, 3),
    deadline("instalment", ymd(year, 12, 15), year, 4),
  ];
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

/**
 * The next `count` deadline rows on or after `today` (YYYY-MM-DD). A deadline
 * stays listed through its effective (last on-time) date. Rows are sorted by
 * official date, and deadlines sharing an official date are merged.
 */
export function getUpcomingCraDeadlines(today: string, count = 4): CraDeadlineRow[] {
  const year = Number(today.slice(0, 4));
  const upcoming = [...craDeadlinesForYear(year), ...craDeadlinesForYear(year + 1)]
    .filter((d) => d.effectiveDate >= today)
    .sort((a, b) =>
      a.officialDate < b.officialDate ? -1 : a.officialDate > b.officialDate ? 1 : 0,
    );
  const rows: CraDeadlineRow[] = [];
  for (const d of upcoming) {
    const row = rows.at(-1);
    if (row && row.officialDate === d.officialDate) {
      row.deadlines.push(d);
      if (d.effectiveDate > row.effectiveDate) row.effectiveDate = d.effectiveDate;
      row.shifted ||= d.shifted;
    } else {
      rows.push({
        officialDate: d.officialDate,
        effectiveDate: d.effectiveDate,
        shifted: d.shifted,
        deadlines: [d],
      });
    }
  }
  return rows.slice(0, count);
}

/* --------------------------------- Labels --------------------------------- */

const ORDINAL_FR = { 1: "1er", 2: "2e", 3: "3e", 4: "4e" } as const;

export function craDeadlineLabel(d: CraDeadline, lang: Lang): string {
  if (lang === "fr") {
    if (d.kind === "instalment")
      return `Acompte provisionnel du ${ORDINAL_FR[d.quarter!]} trimestre`;
    if (d.kind === "balance") return `Payer le solde de ${d.taxYear}`;
    return `Produire la déclaration ${d.taxYear} (travailleurs autonomes)`;
  }
  if (d.kind === "instalment") return `Q${d.quarter} instalment`;
  if (d.kind === "balance") return `Pay ${d.taxYear} balance owing`;
  return `File ${d.taxYear} self-employed return`;
}

export function craRowLabel(row: CraDeadlineRow, lang: Lang): string {
  return row.deadlines.map((d) => craDeadlineLabel(d, lang)).join(" · ");
}

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

/** The official date: "Dec 15, 2026" / "15 déc. 2026" -- fixed tables, so server and client agree. */
export function formatDeadlineDate(date: string, lang: Lang): string {
  const [y, m, d] = date.split("-").map(Number);
  const month = MONTHS[lang][m - 1];
  return lang === "fr" ? `${d} ${month} ${y}` : `${month} ${d}, ${y}`;
}

/** Note under a shifted date: "on time until Mon, Jun 16" / "à temps jusqu'au lun. 16 juin". */
export function formatOnTimeUntil(date: string, lang: Lang): string {
  const fmt = new Intl.DateTimeFormat(lang === "fr" ? "fr-CA" : "en-CA", {
    timeZone: "UTC",
    weekday: "short",
    month: lang === "fr" ? "long" : "short",
    day: "numeric",
  }).format(toUtc(date));
  return lang === "fr" ? `à temps jusqu'au ${fmt}` : `on time until ${fmt}`;
}
