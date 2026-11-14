import { Header } from "@/components/site/Header";
import { PrimaryCta } from "@/components/site/PrimaryCta";
import { Footer } from "@/components/site/Footer";
import type { Lang } from "@/lib/locales";
import {
  CRA_TIME_ZONE,
  craDeadlineDetails,
  dateInZone,
  formatDeadlineDate,
  formatOnTimeUntil,
  getCraDeadlinesNext12Months,
} from "@/lib/tax-deadlines";
import { ctaHref, SOURCES, taxDeadlinesCopy } from "@/lib/tax-deadlines-page";

const CARD = "rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]";
const SECTION = "w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10";

/**
 * /ca/tax-deadlines and /fr/echeances-fiscales. `now` is the server's clock
 * from the route loader (dehydrated to the client), so the server render and
 * hydration compute the same rows -- no client-side recompute of "today".
 * Layout and spacing follow /ca/drivers.
 */
export function TaxDeadlinesPage({ lang, now }: { lang: Lang; now: string }) {
  const today = dateInZone(now, CRA_TIME_ZONE);
  const t = taxDeadlinesCopy(lang, today);
  const rows = getCraDeadlinesNext12Months(today);

  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      {/* Hero */}
      <section className="w-full px-4 pt-24 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-3xl">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="mt-1 text-ink">{t.h1}</h1>
            <p className="mt-2 max-w-2xl text-lead text-ink-60">{t.lead}</p>
          </div>
        </div>
      </section>

      {/* Next 12 months */}
      <section aria-labelledby="next-12-months" className={SECTION}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-4">
            <p className="eyebrow">{t.next12.eyebrow}</p>
            <h2 id="next-12-months" className="mt-1 text-ink">
              {t.next12.h2}
            </h2>
          </div>
          <div className={CARD}>
            <div
              aria-hidden
              className="hidden border-b border-hairline px-5 py-3 font-mono text-label uppercase tracking-mono text-ink-40 md:grid md:grid-cols-[180px_1fr_1fr] md:gap-6"
            >
              <span>{t.next12.date}</span>
              <span>{t.next12.what}</span>
              <span>{t.next12.who}</span>
            </div>
            <ol className="divide-y divide-hairline">
              {rows.map((row) => (
                <li
                  key={row.officialDate}
                  className="grid gap-2 p-4 sm:p-5 md:grid-cols-[180px_1fr] md:gap-6"
                >
                  <div>
                    <time
                      dateTime={row.officialDate}
                      className="block font-mono text-label uppercase tracking-mono text-ink"
                    >
                      {formatDeadlineDate(row.officialDate, lang)}
                    </time>
                    {row.shifted && (
                      <time
                        dateTime={row.effectiveDate}
                        className="mt-0.5 block text-sm text-ink-60"
                      >
                        {formatOnTimeUntil(row.effectiveDate, lang)}
                      </time>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {row.deadlines.map((d) => {
                      const { what, who } = craDeadlineDetails(d, lang);
                      return (
                        <li
                          key={`${d.kind}-${d.quarter ?? ""}`}
                          className="grid gap-1 md:grid-cols-2 md:gap-6"
                        >
                          <span className="text-body font-medium text-ink">{what}</span>
                          <span className="text-sm text-ink-60">{who}</span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* How the deadlines work */}
      <section aria-labelledby="how-deadlines-work" className={SECTION}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-4">
            <p className="eyebrow">{t.rules.eyebrow}</p>
            <h2 id="how-deadlines-work" className="mt-1 text-ink">
              {t.rules.h2}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {t.rules.blocks.map((block) => (
              <div key={block.h3} className={`${CARD} p-4 sm:p-5`}>
                <h3 className="text-lead tracking-body text-ink">{block.h3}</h3>
                {block.paragraphs.map((p, i) => (
                  <p key={i} className={`${i === 0 ? "mt-1.5" : "mt-2"} text-body text-ink-60`}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ: the same strings as the FAQPage JSON-LD in the route head */}
      <section aria-labelledby="tax-deadlines-faq" className={SECTION}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-4">
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2 id="tax-deadlines-faq" className="mt-1 text-ink">
              {t.faq.h2}
            </h2>
          </div>
          <div className="grid gap-3">
            {t.faq.items.map((item) => (
              <div key={item.q} className={`${CARD} p-4 sm:p-5`}>
                <h3 className="text-lead tracking-body text-ink">{item.q}</h3>
                <p className="mt-1.5 text-body text-ink-60">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: dark strip */}
      <section data-cta-location="final_cta" className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div
          data-surface="void"
          className="mx-auto w-full max-w-[1200px] rounded-card bg-ink px-6 py-6 text-center sm:px-10 sm:py-8"
        >
          <h2 className="mx-auto max-w-3xl text-paper">{t.cta.h2}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-body text-paper-80">{t.cta.body}</p>
          <div className="mt-4 flex justify-center">
            <PrimaryCta href={ctaHref(lang)} surface="void">
              {t.cta.button}
            </PrimaryCta>
          </div>
        </div>
      </section>

      {/* Disclaimer and sources */}
      <div className="w-full px-4 pb-6 sm:px-6 lg:px-8">
        <p className="mx-auto w-full max-w-[1200px] text-sm text-ink-60">{t.disclaimer}</p>
        <div className="mx-auto mt-2 w-full max-w-[1200px] text-sm text-ink-60">
          <p>{t.sourcesLabel}</p>
          <ul className="mt-1 space-y-1">
            {SOURCES[lang].map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="underline underline-offset-2 hover:text-ink"
                >
                  {s.label}
                  <span className="sr-only"> {t.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer region="ca" now={now} />
    </main>
  );
}
