import type { Lang } from "@/lib/locales";
import { upcomingTaxDeadlines, type DeadlineRegion } from "@/lib/tax-deadlines";

const NEW_TAB: Record<Lang, string> = {
  en: "(opens in a new tab)",
  fr: "(s'ouvre dans un nouvel onglet)",
};

/**
 * Footer strip, on the same 4-column grid as the footer above: the region's upcoming tax deadlines with a source link.
 * `now` is the server's clock from the route loader; renders nothing when
 * every date has passed (see src/lib/tax-deadlines.ts).
 */
export function TaxDeadlines({
  region,
  lang,
  now,
}: {
  region: DeadlineRegion;
  lang: Lang;
  now: string;
}) {
  const data = upcomingTaxDeadlines(region, lang, now);
  if (!data) return null;
  const fr = data.lang === "fr";

  return (
    <section
      aria-labelledby="tax-deadlines-title"
      className="mt-6 grid gap-3 border-t border-hairline-void pt-4 lg:grid-cols-4 lg:gap-6"
    >
      <div>
        <h2 id="tax-deadlines-title" className="eyebrow">
          {data.title}
        </h2>
        <a
          href={data.sourceUrl}
          target="_blank"
          rel="noopener"
          className="mt-2 inline-block font-sans text-sm text-paper-40 underline underline-offset-4 transition-colors hover:text-paper"
        >
          {fr ? "Source : " : "Source: "}
          {data.sourceHost}
          <span className="sr-only"> {NEW_TAB[data.lang]}</span>
        </a>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-4">
        {data.items.map((d) => (
          <li key={d.date}>
            <time
              dateTime={d.date}
              className="block font-mono text-label uppercase tracking-mono text-paper"
            >
              {d.display}
            </time>
            <span className="mt-1 block font-sans text-sm text-paper-60">{d.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
