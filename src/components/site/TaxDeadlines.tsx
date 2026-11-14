import type { Lang } from "@/lib/locales";
import {
  CRA_TIME_ZONE,
  dateInZone,
  footerRowLabel,
  formatDeadlineDate,
  formatOnTimeUntil,
  getFooterDeadlineRows,
  T2_DATE_TEXT,
} from "@/lib/tax-deadlines";

const COPY: Record<
  Lang,
  { title: string; source: string; url: string; newTab: string; all: string; allHref: string }
> = {
  en: {
    title: "Upcoming CRA deadlines",
    source: "Source: ",
    url: "https://www.canada.ca/en/revenue-agency/services/payments-cra/individual-payments/income-tax-instalments/due-dates.html",
    newTab: "(opens in a new tab)",
    all: "All tax deadlines →",
    allHref: "/ca/tax-deadlines",
  },
  fr: {
    title: "Prochaines échéances de l'ARC",
    source: "Source : ",
    url: "https://www.canada.ca/fr/agence-revenu/services/paiements/paiements-arc/paiements-particuliers/impots-acomptes-provisionnels/dates-limites.html",
    newTab: "(s'ouvre dans un nouvel onglet)",
    all: "Toutes les échéances →",
    allHref: "/fr/echeances-fiscales",
  },
};

/**
 * Renders text unchanged, but keeps words with a hyphen or slash ("YEAR-END",
 * "self-employed", "GST/HST") on one line: browsers may break after those
 * characters, and CSS has no switch for it. Text still wraps between words.
 */
function NoBreak({ text }: { text: string }) {
  // Plain runs stay one text node each, so the SSR markup is
  // "6 months after fiscal <span>year-end</span>", not word-by-word fragments.
  const parts: (string | { word: string })[] = [];
  for (const part of text.split(/(\s+)/)) {
    if (/[-/]/.test(part)) parts.push({ word: part });
    else if (typeof parts.at(-1) === "string") parts[parts.length - 1] += part;
    else if (part) parts.push(part);
  }
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          p
        ) : (
          <span key={i} className="whitespace-nowrap">
            {p.word}
          </span>
        ),
      )}
    </>
  );
}

/**
 * Footer strip (/ca and /fr), on the same 4-column grid as the footer above:
 * one row per deadline type with its next date, computed by rule
 * (src/lib/tax-deadlines.ts), plus the undated T2 rule, with a source link. `now` is the server's clock from the route loader. The link to
 * the full deadlines page is hidden on that page itself (either language).
 */
export function TaxDeadlines({
  lang,
  now,
  pathname,
}: {
  lang: Lang;
  now: string;
  pathname?: string;
}) {
  const rows = getFooterDeadlineRows(dateInZone(now, CRA_TIME_ZONE));
  const t = COPY[lang];
  const path = pathname && pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  const onDeadlinesPage = path === COPY.en.allHref || path === COPY.fr.allHref;

  return (
    <section
      aria-labelledby="tax-deadlines-title"
      className="mt-6 grid gap-3 border-t border-hairline-void pt-4 lg:grid-cols-4 lg:gap-6"
    >
      <div>
        <h2 id="tax-deadlines-title" className="eyebrow">
          {t.title}
        </h2>
        <a
          href={t.url}
          target="_blank"
          rel="noopener"
          className="mt-2 inline-block font-sans text-sm text-paper-40 underline underline-offset-4 transition-colors hover:text-paper"
        >
          {t.source}
          canada.ca
          <span className="sr-only"> {t.newTab}</span>
        </a>
      </div>
      {/* 1 column on phones, 2 at sm, 3 at md (5 rows: 3 + 2), all 5 on one line at lg. */}
      <ul className="grid grid-cols-1 gap-3 hyphens-none sm:grid-cols-2 md:grid-cols-3 lg:col-span-3 lg:grid-cols-5">
        {rows.map((row) => (
          <li key={row.type}>
            {row.type === "t2" ? (
              <span className="block font-mono text-label uppercase tracking-mono text-paper">
                <NoBreak text={T2_DATE_TEXT[lang]} />
              </span>
            ) : (
              <>
                <time
                  dateTime={row.deadline.officialDate}
                  className="block font-mono text-label uppercase tracking-mono text-paper"
                >
                  <NoBreak text={formatDeadlineDate(row.deadline.officialDate, lang)} />
                </time>
                {row.deadline.shifted && (
                  <time
                    dateTime={row.deadline.effectiveDate}
                    className="mt-0.5 block font-sans text-sm text-paper-40"
                  >
                    <NoBreak text={formatOnTimeUntil(row.deadline.effectiveDate, lang)} />
                  </time>
                )}
              </>
            )}
            <span className="mt-1 block font-sans text-sm text-paper-60">
              <NoBreak text={footerRowLabel(row, lang)} />
            </span>
          </li>
        ))}
      </ul>
      {/* Plain <a>, like the footer's other internal links. */}
      {!onDeadlinesPage && (
        <a
          href={t.allHref}
          className="inline-block justify-self-start font-sans text-sm text-paper-40 underline underline-offset-4 transition-colors hover:text-paper lg:col-span-3 lg:col-start-2"
        >
          {t.all}
        </a>
      )}
    </section>
  );
}
