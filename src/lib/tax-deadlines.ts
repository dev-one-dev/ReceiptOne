/**
 * CRA deadlines for the /ca and /fr footer and the tax-deadlines page
 * (/ca/tax-deadlines, /fr/echeances-fiscales), computed by rule, so they never
 * need a yearly update. Source: canada.ca (income tax instalment due dates,
 * GST/HST reporting requirements and deadlines).
 *
 *   Income tax instalments for Y:     Mar 15, Jun 15, Sep 15, Dec 15 of Y.
 *   Income tax balance owing for Y-1: Apr 30 of Y.
 *   Self-employed T1 return for Y-1:  Jun 15 of Y.
 *   GST/HST annual filers (individuals with business income, Dec 31
 *   year-end), for Y-1:               payment Apr 30 of Y, return Jun 15 of Y.
 *   GST/HST quarterly filers (calendar quarters of Y), file and pay one month
 *   after each quarter:               Apr 30, Jul 31, Oct 31 of Y, Jan 31 of
 *                                     Y+1. Annual filers whose net tax was
 *                                     $3,000 or more pay GST/HST instalments
 *                                     on the same four dates.
 *
 * A payment or return due on a Saturday, Sunday or CRA public holiday is on
 * time if received by the next business day. No CRA public holiday ever falls
 * on Mar 15, Apr 30, Jun 15, Jul 31, Sep 15, Oct 31, Dec 15 or Jan 31 (they
 * are all fixed or weekday-anchored holidays on other dates), so only the
 * weekend shift is needed and there is no holiday list:
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

export type CraDeadlineKind =
  | "instalment"
  | "balance"
  | "return"
  /** GST/HST annual filer payment (rule D). */
  | "gst-annual-payment"
  /** GST/HST annual filer return (rule D). */
  | "gst-annual-return"
  /** GST/HST quarterly filing and payment, or annual-filer instalment (rule E). */
  | "gst-quarterly";

export interface CraDeadline {
  kind: CraDeadlineKind;
  /** 1-4 for instalments and GST/HST quarters. */
  quarter?: 1 | 2 | 3 | 4;
  /** The date CRA publishes, YYYY-MM-DD. */
  officialDate: string;
  /** The last on-time day after the weekend shift, YYYY-MM-DD. */
  effectiveDate: string;
  /**
   * The year the deadline relates to: Y for income tax instalments and
   * GST/HST quarters (Jan 31's Q4 relates to the year before), Y-1 for the
   * balance owing and the annual returns and payments.
   */
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

/** Income tax deadlines (rules A-C) that fall in calendar year `year`, in date order. */
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

/** GST/HST annual-filer payment and return for `year - 1` (rule D), due in `year`. */
export function gstAnnualDeadlinesForYear(year: number): CraDeadline[] {
  return [
    deadline("gst-annual-payment", ymd(year, 4, 30), year - 1),
    deadline("gst-annual-return", ymd(year, 6, 15), year - 1),
  ];
}

/**
 * GST/HST quarterly deadlines for the calendar quarters of `year` (rule E):
 * Apr 30, Jul 31 and Oct 31 of `year`, and Jan 31 of `year + 1` for Q4.
 */
export function gstQuarterlyDeadlines(year: number): CraDeadline[] {
  return [
    deadline("gst-quarterly", ymd(year, 4, 30), year, 1),
    deadline("gst-quarterly", ymd(year, 7, 31), year, 2),
    deadline("gst-quarterly", ymd(year, 10, 31), year, 3),
    deadline("gst-quarterly", ymd(year + 1, 1, 31), year, 4),
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
 * Order inside a merged row: returns first, then payments, then instalments.
 * The GST/HST quarterly entry (file and pay, or an annual filer's instalment)
 * counts as a payment; it only ever shares Apr 30 with payments.
 */
const ROW_ORDER: Record<CraDeadlineKind, number> = {
  return: 0,
  "gst-annual-return": 0,
  balance: 1,
  "gst-annual-payment": 1,
  "gst-quarterly": 1,
  instalment: 2,
};

/** Sort by official date (stable) and merge deadlines sharing one into a row. */
function toRows(deadlines: CraDeadline[]): CraDeadlineRow[] {
  const sorted = [...deadlines].sort((a, b) =>
    a.officialDate < b.officialDate ? -1 : a.officialDate > b.officialDate ? 1 : 0,
  );
  const rows: CraDeadlineRow[] = [];
  for (const d of sorted) {
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
  for (const row of rows) row.deadlines.sort((a, b) => ROW_ORDER[a.kind] - ROW_ORDER[b.kind]);
  return rows;
}

/**
 * Footer: the next `count` rows on or after `today` (YYYY-MM-DD) of income tax
 * instalments, Apr 30 and Jun 15 (rules A-D; no GST/HST quarterly rows). A
 * deadline stays listed through its effective (last on-time) date. Rows are
 * sorted by official date, and deadlines sharing an official date are merged.
 */
export function getUpcomingCraDeadlines(today: string, count = 4): CraDeadlineRow[] {
  const year = Number(today.slice(0, 4));
  const candidates = [year, year + 1].flatMap((y) => [
    ...craDeadlinesForYear(y),
    ...gstAnnualDeadlinesForYear(y),
  ]);
  return toRows(candidates.filter((d) => d.effectiveDate >= today)).slice(0, count);
}

/** The same month and day a year after `date` (Feb 29 -> Mar 1). */
function oneYearAfter(date: string): string {
  const dt = toUtc(date);
  dt.setUTCFullYear(dt.getUTCFullYear() + 1);
  return fromUtc(dt);
}

/**
 * Page: every deadline (rules A-E) whose effective date is on or after
 * `today` and whose official date is within the next 12 months (on or before
 * the same day next year), sorted and merged like the footer.
 */
export function getCraDeadlinesNext12Months(today: string): CraDeadlineRow[] {
  const year = Number(today.slice(0, 4));
  const end = oneYearAfter(today);
  const candidates = [
    ...[year, year + 1].flatMap((y) => [
      ...craDeadlinesForYear(y),
      ...gstAnnualDeadlinesForYear(y),
    ]),
    ...[year - 1, year, year + 1].flatMap((y) => gstQuarterlyDeadlines(y)),
  ];
  return toRows(candidates.filter((d) => d.effectiveDate >= today && d.officialDate <= end));
}

/**
 * The filing season the page's examples use: the year whose June 15 return
 * deadline is still ahead (or on time today). Returns are for `year - 1`.
 */
export function currentFilingYear(today: string): number {
  const year = Number(today.slice(0, 4));
  return weekendShift(ymd(year, 6, 15)) >= today ? year : year + 1;
}

/* ------------------------------ Footer labels ------------------------------ */

const ORDINAL_FR = { 1: "1er", 2: "2e", 3: "3e", 4: "4e" } as const;

/** Short footer label for one deadline. */
export function craDeadlineLabel(d: CraDeadline, lang: Lang): string {
  const y = d.taxYear;
  if (lang === "fr") {
    switch (d.kind) {
      case "instalment":
        return `Acompte provisionnel du ${ORDINAL_FR[d.quarter!]} trimestre`;
      case "balance":
        return `Payer le solde d'impôt de ${y}`;
      case "return":
        return `Produire la déclaration ${y} (travailleurs autonomes)`;
      case "gst-annual-payment":
        return `Payer la TPS/TVH de ${y}`;
      case "gst-annual-return":
        return `Produire la déclaration de TPS/TVH ${y}`;
      case "gst-quarterly":
        return `TPS/TVH du ${ORDINAL_FR[d.quarter!]} trimestre ${y}`;
    }
  }
  switch (d.kind) {
    case "instalment":
      return `Q${d.quarter} instalment`;
    case "balance":
      return `Pay ${y} income tax balance`;
    case "return":
      return `File ${y} self-employed return`;
    case "gst-annual-payment":
      return `Pay ${y} GST/HST`;
    case "gst-annual-return":
      return `File ${y} GST/HST return`;
    case "gst-quarterly":
      return `GST/HST for Q${d.quarter} ${y}`;
  }
}

/** Income tax and GST/HST annual deadlines that share a date, said once. */
const COMBINED: Partial<
  Record<CraDeadlineKind, [CraDeadlineKind, Record<Lang, (y: number) => string>]>
> = {
  balance: [
    "gst-annual-payment",
    {
      en: (y) => `Pay ${y} income tax and GST/HST balance`,
      fr: (y) => `Payer le solde ${y} d'impôt et de TPS/TVH`,
    },
  ],
  return: [
    "gst-annual-return",
    {
      en: (y) => `File ${y} self-employed and GST/HST returns`,
      fr: (y) => `Produire les déclarations ${y} (travailleurs autonomes et TPS/TVH)`,
    },
  ],
};

/**
 * Footer row label: the deadlines' labels joined with " · ". The income tax
 * balance and the GST/HST annual payment (Apr 30), and the self-employed and
 * GST/HST annual returns (Jun 15), are combined into one phrase each.
 */
export function craRowLabel(row: CraDeadlineRow, lang: Lang): string {
  const kinds = new Set(row.deadlines.map((d) => d.kind));
  const partners = new Set(
    Object.entries(COMBINED)
      .filter(([kind, [partner]]) => kinds.has(kind as CraDeadlineKind) && kinds.has(partner))
      .map(([, [partner]]) => partner),
  );
  return row.deadlines
    .filter((d) => !partners.has(d.kind))
    .map((d) => {
      const combo = COMBINED[d.kind];
      return combo && kinds.has(combo[0]) ? combo[1][lang](d.taxYear) : craDeadlineLabel(d, lang);
    })
    .join(" · ");
}

/* ------------------------------- Page labels ------------------------------- */

/** What a deadline is and who it applies to, for the tax-deadlines page. */
export function craDeadlineDetails(d: CraDeadline, lang: Lang): { what: string; who: string } {
  const y = d.taxYear;
  if (lang === "fr") {
    const q = d.quarter ? ORDINAL_FR[d.quarter] : "";
    switch (d.kind) {
      case "instalment":
        return {
          what: `Acompte provisionnel d'impôt du ${q} trimestre ${y}`,
          who: "Si votre impôt net à payer dépasse 3 000 $ (1 800 $ au Québec) cette année et l'une des deux années précédentes",
        };
      case "balance":
        return {
          what: `Payer le solde d'impôt sur le revenu de ${y}`,
          who: "Particuliers qui ont un solde à payer, y compris les travailleurs autonomes",
        };
      case "return":
        return {
          what: `Produire la déclaration T1 de ${y}`,
          who: "Travailleurs autonomes",
        };
      case "gst-annual-payment":
        return {
          what: `Payer la TPS/TVH de ${y}`,
          who: "Déclarants annuels de TPS/TVH : particuliers qui ont un revenu d'entreprise et un exercice se terminant le 31 décembre",
        };
      case "gst-annual-return":
        return {
          what: `Produire la déclaration de TPS/TVH de ${y}`,
          who: "Déclarants annuels de TPS/TVH : particuliers qui ont un revenu d'entreprise et un exercice se terminant le 31 décembre",
        };
      case "gst-quarterly":
        return {
          what: `TPS/TVH du ${q} trimestre ${y} : déclaration et paiement trimestriels, ou acompte provisionnel annuel`,
          who: "Déclarants trimestriels (trimestres civils); déclarants annuels dont la taxe nette était de 3 000 $ ou plus (acompte)",
        };
    }
  }
  switch (d.kind) {
    case "instalment":
      return {
        what: `Income tax instalment, Q${d.quarter} ${y}`,
        who: "If your net tax owing is more than $3,000 ($1,800 in Quebec) this year and in either of the two previous years",
      };
    case "balance":
      return {
        what: `Pay ${y} income tax balance owing`,
        who: "Individuals with a balance owing, self-employed included",
      };
    case "return":
      return { what: `File ${y} T1 return`, who: "Self-employed individuals" };
    case "gst-annual-payment":
      return {
        what: `Pay ${y} GST/HST`,
        who: "GST/HST annual filers: individuals with business income and a December 31 fiscal year-end",
      };
    case "gst-annual-return":
      return {
        what: `File ${y} GST/HST return`,
        who: "GST/HST annual filers: individuals with business income and a December 31 fiscal year-end",
      };
    case "gst-quarterly":
      return {
        what: `GST/HST for Q${d.quarter} ${y}: quarterly return and payment, or annual-filer instalment`,
        who: "Quarterly filers (calendar quarters); annual filers whose net tax was $3,000 or more (instalment)",
      };
  }
}

/* ---------------------------------- Dates ---------------------------------- */

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

/** French writes the first of the month as "1er": "1er février", other days as numbers. */
const frDay = (day: number | string) => (Number(day) === 1 ? "1er" : String(day));

/** The official date: "Dec 15, 2026" / "15 déc. 2026" / "1er févr. 2027" -- fixed tables, so server and client agree. */
export function formatDeadlineDate(date: string, lang: Lang): string {
  const [y, m, d] = date.split("-").map(Number);
  const month = MONTHS[lang][m - 1];
  return lang === "fr" ? `${frDay(d)} ${month} ${y}` : `${month} ${d}, ${y}`;
}

/** Intl output, with the French day part as "1er" on the first of the month. */
function formatIntl(date: string, lang: Lang, options: Intl.DateTimeFormatOptions): string {
  const fmt = new Intl.DateTimeFormat(lang === "fr" ? "fr-CA" : "en-CA", {
    timeZone: "UTC",
    ...options,
  });
  if (lang !== "fr") return fmt.format(toUtc(date));
  return fmt
    .formatToParts(toUtc(date))
    .map((p) => (p.type === "day" ? frDay(p.value) : p.value))
    .join("");
}

/** Note under a shifted date: "on time until Mon, Jun 16" / "à temps jusqu'au lun. 16 juin" / "… lun. 1er février". */
export function formatOnTimeUntil(date: string, lang: Lang): string {
  const fmt = formatIntl(date, lang, {
    weekday: "short",
    month: lang === "fr" ? "long" : "short",
    day: "numeric",
  });
  return lang === "fr" ? `à temps jusqu'au ${fmt}` : `on time until ${fmt}`;
}

/** Long date for running text: "Sunday, January 31, 2027" / "dimanche 31 janvier 2027" / "lundi 1er février 2027". */
export function formatLongDate(date: string, lang: Lang, weekday = false): string {
  return formatIntl(date, lang, {
    ...(weekday ? { weekday: "long" as const } : {}),
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
