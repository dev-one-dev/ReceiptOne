import type { Lang } from "@/lib/locales";
import {
  CRA_TIME_ZONE,
  craRowLabel,
  dateInZone,
  formatDeadlineDate,
  formatOnTimeUntil,
  getUpcomingCraDeadlines,
} from "@/lib/tax-deadlines";

const COPY: Record<Lang, { title: string; source: string; url: string; newTab: string }> = {
  en: {
    title: "Upcoming CRA deadlines",
    source: "Source: ",
    url: "https://www.canada.ca/en/revenue-agency/services/payments-cra/individual-payments/income-tax-instalments/due-dates.html",
    newTab: "(opens in a new tab)",
  },
  fr: {
    title: "Prochaines échéances de l'ARC",
    source: "Source : ",
    url: "https://www.canada.ca/fr/agence-revenu/services/paiements/paiements-arc/paiements-particuliers/impots-acomptes-provisionnels/dates-limites.html",
    newTab: "(s'ouvre dans un nouvel onglet)",
  },
};

/**
 * Footer strip (/ca and /fr), on the same 4-column grid as the footer above:
 * the next CRA deadlines, computed by rule (src/lib/tax-deadlines.ts), with a
 * source link. `now` is the server's clock from the route loader.
 */
export function TaxDeadlines({ lang, now }: { lang: Lang; now: string }) {
  const rows = getUpcomingCraDeadlines(dateInZone(now, CRA_TIME_ZONE));
  if (rows.length === 0) return null;
  const t = COPY[lang];

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
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-4">
        {rows.map((row) => (
          <li key={row.officialDate}>
            <time
              dateTime={row.officialDate}
              className="block font-mono text-label uppercase tracking-mono text-paper"
            >
              {formatDeadlineDate(row.officialDate, lang)}
            </time>
            {row.shifted && (
              <time
                dateTime={row.effectiveDate}
                className="mt-0.5 block font-sans text-sm text-paper-40"
              >
                {formatOnTimeUntil(row.effectiveDate, lang)}
              </time>
            )}
            <span className="mt-1 block font-sans text-sm text-paper-60">
              {craRowLabel(row, lang)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
