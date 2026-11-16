import { Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CorrectionLine } from "@/components/site/CorrectionLine";
import type { Lang } from "@/lib/locales";
import {
  MILEAGE_TEMPLATE_PATH,
  SOURCES,
  TEMPLATE_FILES,
  TEMPLATE_LABELS,
  mileageTemplateCopy,
  templateHref,
  type TemplateFormat,
} from "@/lib/mileage-log-template";

const CARD = "rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]";
const SECTION = "w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10";
const BUTTON =
  "group inline-flex h-11 w-full items-center justify-center gap-2 rounded-card px-5 font-display text-body font-semibold transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto";
const BUTTON_STYLE: Record<TemplateFormat, string> = {
  xlsx: "bg-ink text-paper",
  pdf: "border border-ink bg-white text-ink",
};

/**
 * /ca/mileage-log-template and /fr/modele-registre-kilometrage: the free
 * mileage logbook downloads, the CRA's logbook rules and the business-use
 * arithmetic. Layout and spacing follow TaxDeadlinesPage. Download links are
 * plain <a download> to /downloads/; GA4 Enhanced measurement logs their
 * file_download itself, so the site sends no download event of its own.
 */
export function MileageLogTemplatePage({ lang, now }: { lang: Lang; now: string }) {
  const t = mileageTemplateCopy(lang);
  const labels = TEMPLATE_LABELS[lang];

  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      {/* Hero + downloads */}
      <section className="w-full px-4 pt-24 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-3xl">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="mt-1 text-ink">{t.h1}</h1>
            <p className="mt-2 max-w-2xl text-lead text-ink-60">{t.lead}</p>
          </div>
          <div data-downloads className={`${CARD} mt-4 p-4 sm:p-5`}>
            <div className="grid gap-3 md:grid-cols-2">
              {(["xlsx", "pdf"] as const).map((format) => (
                <div key={format} className="flex flex-col gap-2">
                  <a
                    href={templateHref(lang, format)}
                    download={TEMPLATE_FILES[lang][format]}
                    className={`${BUTTON} ${BUTTON_STYLE[format]}`}
                  >
                    <Download className="size-4" aria-hidden />
                    {t.download[format].label}
                  </a>
                  <p className="text-sm text-ink-60">{t.download[format].note}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-hairline pt-3">
              <p className="eyebrow">{t.download.columnsLabel}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {labels.columns.map((c) => (
                  <li
                    key={c}
                    className="rounded-pill border border-hairline bg-paper px-3 py-1 text-sm text-ink-80"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What the CRA expects */}
      <section aria-labelledby="cra-logbook" className={SECTION}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-4">
            <p className="eyebrow">{t.cra.eyebrow}</p>
            <h2 id="cra-logbook" className="mt-1 text-ink">
              {t.cra.h2}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {t.cra.blocks.map((block) => (
              <div key={block.h3} className={`${CARD} p-4 sm:p-5`}>
                <h3 className="text-lead tracking-body text-ink">{block.h3}</h3>
                <p className="mt-1.5 text-body text-ink-60">{block.paragraphs[0]}</p>
                {block.items && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-body text-ink-80">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {block.paragraphs.slice(1).map((p, i) => (
                  <p key={i} className="mt-2 text-body text-ink-60">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business-use percentage */}
      <section aria-labelledby="business-use" className={SECTION}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-4">
            <p className="eyebrow">{t.calc.eyebrow}</p>
            <h2 id="business-use" className="mt-1 text-ink">
              {t.calc.h2}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <ol className="grid gap-3">
              {t.calc.steps.map((step, i) => (
                <li key={step} className={`${CARD} flex gap-3 p-4 sm:p-5`}>
                  <span
                    className="font-mono text-label font-normal tracking-mono text-ink-40"
                    aria-hidden
                  >
                    0{i + 1}
                  </span>
                  <p className="text-body text-ink-80">{step}</p>
                </li>
              ))}
            </ol>
            <div className={`${CARD} p-4 sm:p-5`}>
              <h3 className="text-lead tracking-body text-ink">{t.calc.example.h3}</h3>
              <dl className="mt-2 divide-y divide-hairline">
                {t.calc.example.rows.map(([label, value], i) => (
                  <div
                    key={label}
                    className={`flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-2 ${
                      i === t.calc.example.rows.length - 1 ? "font-medium text-ink" : ""
                    }`}
                  >
                    <dt className="text-body text-ink-80">{label}</dt>
                    <dd className="text-body text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-sm text-ink-60">{t.calc.example.after}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prefer not to fill it in by hand? */}
      <section aria-labelledby="mileage-app" className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div
          data-surface="void"
          className="mx-auto w-full max-w-[1200px] rounded-card bg-ink px-6 py-6 sm:px-10 sm:py-8"
        >
          <h2 id="mileage-app" className="max-w-3xl text-paper">
            {t.app.h2}
          </h2>
          {t.app.body.map((p, i) => (
            <p key={i} className="mt-2 max-w-3xl text-body text-paper-80">
              {p}
            </p>
          ))}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {t.app.links.map((l, i) => (
              <Link
                key={l.href}
                to={l.href}
                className={`${BUTTON} ${
                  i === 0 ? "bg-paper text-ink" : "border border-hairline-void text-paper"
                }`}
              >
                {l.label}
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ: the same strings as the FAQPage JSON-LD in the route head */}
      <section aria-labelledby="mileage-template-faq" className={SECTION}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-4">
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2 id="mileage-template-faq" className="mt-1 text-ink">
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

      {/* Disclaimer and sources */}
      <div className="w-full px-4 pb-6 sm:px-6 lg:px-8">
        <p className="mx-auto w-full max-w-[1200px] text-sm text-ink-60">{t.disclaimer}</p>
        <CorrectionLine
          lang={lang}
          title={t.h1}
          path={MILEAGE_TEMPLATE_PATH[lang]}
          className="mx-auto mt-2 w-full max-w-[1200px]"
        />
        <div className="mx-auto mt-2 w-full max-w-[1200px] text-sm text-ink-60">
          <p>{t.sourcesLabel}</p>
          <ul data-sources className="mt-1 space-y-1">
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
