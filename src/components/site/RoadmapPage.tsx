import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  localized,
  roadmapView,
  type Lang,
  type RoadmapData,
  type RoadmapItem,
} from "@/lib/roadmap";

const COPY = {
  en: {
    eyebrow: "Product updates",
    h1: "Roadmap & changelog",
    intro: "What we've shipped in ReceiptOne over the past year, and what we're building next.",
    shipped: "Shipped",
    nothingShipped: "Nothing shipped in the last 12 months.",
    next: "Coming next",
    inProgress: "In progress",
    planned: "Planned",
    unavailable: "Our changelog is being updated — check back soon.",
  },
  fr: {
    eyebrow: "Mises à jour du produit",
    h1: "Feuille de route et nouveautés",
    intro:
      "Ce que nous avons livré dans ReceiptOne au cours de la dernière année, et ce que nous préparons ensuite.",
    shipped: "Livré",
    nothingShipped: "Rien n'a été livré au cours des 12 derniers mois.",
    next: "À venir",
    inProgress: "En cours",
    planned: "Prévu",
    unavailable: "Notre journal des nouveautés est en cours de mise à jour — revenez bientôt.",
  },
} as const;

const CARD =
  "rounded-card border border-hairline bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]";
const PILL = "rounded-pill px-2.5 py-1 font-mono text-label uppercase tracking-mono";

/** Region in small mono text, only when the data carries one (it does not today). */
function RegionTag({ region }: { region: string | null }) {
  if (!region) return null;
  return <span className="font-mono text-nav uppercase tracking-mono text-ink-40">{region}</span>;
}

function ShippedItem({ item, lang }: { item: RoadmapItem; lang: Lang }) {
  const { title, description } = localized(item, lang);
  return (
    <li className={CARD}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <p className="text-body font-medium text-ink">{title}</p>
        <RegionTag region={item.region} />
      </div>
      {description && <p className="mt-1.5 text-sm text-ink-60">{description}</p>}
    </li>
  );
}

/**
 * The /roadmap and /fr/roadmap page body. `data` comes from the route loader
 * (server-rendered); null means the portal was unreachable, and the page
 * keeps its shell with one line instead of the lists (still HTTP 200).
 */
export function RoadmapPage({ lang, data }: { lang: Lang; data: RoadmapData | null }) {
  const t = COPY[lang];
  const view = roadmapView(data, lang);

  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      {/* Page hero */}
      <section className="pt-24 pb-4">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-2 text-ink">{t.h1}</h1>
          <p className="mt-2 max-w-2xl text-body text-ink-60 sm:text-lead">{t.intro}</p>
        </div>
      </section>

      {view.kind === "unavailable" ? (
        <section className="py-6 sm:py-8 lg:py-10">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <p className="text-body text-ink-80">{t.unavailable}</p>
          </div>
        </section>
      ) : (
        <>
          {/* Shipped */}
          <section aria-labelledby="shipped" className="py-6 sm:py-8 lg:py-10">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
              <h2 id="shipped" className="mb-4 text-ink">
                {t.shipped}
              </h2>
              {view.shipped.length === 0 ? (
                <p className="text-body text-ink-60">{t.nothingShipped}</p>
              ) : (
                <div className="space-y-6">
                  {view.shipped.map((month) => (
                    <div key={month.key} className="grid gap-3 lg:grid-cols-[220px_1fr]">
                      <h3 className="text-lead tracking-body text-ink first-letter:uppercase">
                        <time dateTime={month.key}>{month.label}</time>
                      </h3>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {month.items.map((item) => (
                          <ShippedItem key={item.id} item={item} lang={lang} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Coming next */}
          {view.comingNext.length > 0 && (
            <section aria-labelledby="coming-next" className="pb-6 sm:pb-8 lg:pb-10">
              <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
                <h2 id="coming-next" className="mb-4 text-ink">
                  {t.next}
                </h2>
                <ul className="grid gap-3 sm:grid-cols-3">
                  {view.comingNext.map((item) => {
                    const { title, description } = localized(item, lang);
                    const active = item.status === "in_progress";
                    return (
                      <li key={item.id} className={`${CARD} flex flex-col`}>
                        <span
                          className={`self-start ${PILL} ${active ? "bg-ember text-ink" : "bg-ink-05 text-ink-60"}`}
                        >
                          {active ? t.inProgress : t.planned}
                        </span>
                        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <p className="text-body font-medium text-ink">{title}</p>
                          <RegionTag region={item.region} />
                        </div>
                        {description && <p className="mt-1.5 text-sm text-ink-60">{description}</p>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </main>
  );
}
