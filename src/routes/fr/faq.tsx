import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FaqAccordion } from "@/components/site/Faq";
import { CATEGORIZED_FAQ_FR, faqItemsFR } from "@/lib/faq.fr";
import { pageSEO, breadcrumbJsonLd, faqJsonLd, regionHreflang } from "@/lib/seo";

export const Route = createFileRoute("/fr/faq")({
  head: () => {
    const seo = pageSEO({
      path: "/fr/faq",
      title: "Centre d'aide — Foire aux questions | ReceiptOne",
      description:
        "Réponses aux questions courantes sur ReceiptOne — numérisation des reçus, suivi de la TPS/TVH, kilométrage, exportations, tarifs et conformité avec l'ARC.",
      hreflang: regionHreflang("/faq"),
    });

    const breadcrumb = breadcrumbJsonLd([
      { name: "Accueil", path: "/fr" },
      { name: "Centre d'aide", path: "/fr/faq" },
    ]);

    return {
      meta: [...seo.meta, { property: "og:locale", content: "fr_CA" }],
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(faqItemsFR)) },
      ],
    };
  },
  component: FrenchFaqPage,
});

function FrenchFaqPage() {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-4 text-center">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-0">
          <p className="eyebrow">Centre d'aide</p>
          <h1 className="mt-3 text-ink">Foire aux questions</h1>
          <p className="mx-auto mt-3 max-w-lg font-sans text-body text-ink-60">
            Vous ne trouvez pas ce que vous cherchez?{" "}
            <Link
              to="/fr/contact"
              className="font-medium text-ink underline underline-offset-2 transition-[text-underline-offset] duration-150 hover:underline-offset-4"
            >
              Écrivez à notre équipe
            </Link>{" "}
            — nous répondons sous 1 à 2 jours ouvrables.
          </p>
        </div>
      </section>

      {/* Categorized FAQ */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-0">
          <div className="space-y-10">
            {CATEGORIZED_FAQ_FR.map(({ category, items }) => (
              <div key={category}>
                {/* Category header */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-block rounded-pill bg-ink px-3 py-1 eyebrow text-paper">
                    {category}
                  </span>
                  <div className="h-px flex-1 bg-ink-05" aria-hidden />
                </div>

                <FaqAccordion items={items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section data-surface="void" className="bg-ink py-6 sm:py-8">
        <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6 lg:px-8">
          <p className="eyebrow">Pour commencer</p>
          <h2 className="mt-2 text-paper">Commencez à gérer vos reçus en quelques minutes</h2>
          <p className="mx-auto mt-2 max-w-md font-sans text-body text-paper-60">
            Conçu pour les travailleurs autonomes du Canada qui veulent être prêts pour l'ARC sans
            le casse-tête des papiers.
          </p>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/fr"
              hash="pricing"
              className="inline-flex items-center gap-2 rounded-pill bg-ember px-6 py-3 font-sans text-sm font-semibold text-ink transition-all duration-200 hover:bg-ember-hover hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
            >
              Voir les tarifs
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/fr"
              className="inline-flex items-center gap-2 rounded-pill border border-hairline-void px-6 py-3 font-sans text-sm font-semibold text-paper transition-all duration-200 hover:border-paper-40 hover:bg-paper-05"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      <Footer region="ca" />
    </main>
  );
}
