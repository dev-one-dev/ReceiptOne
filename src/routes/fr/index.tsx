import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { TopBanner } from "@/components/site/TopBanner";
import { HowItWorks } from "@/components/site/HowItWorks";
import { InfoCards } from "@/components/site/InfoCards";
import { NotAll } from "@/components/site/NotAll";
import { Testimonials } from "@/components/site/Testimonials";
import { Trust } from "@/components/site/Trust";
import { Integrations } from "@/components/site/Integrations";
import { Pricing } from "@/components/site/Pricing";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { faqItemsFR } from "@/lib/faq.fr";
import {
  pageSEO,
  regionHreflang,
  softwareApplicationJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { formatPrice, getPlan, TRIAL_DAYS } from "@/lib/pricing";

/** French counterpart of /ca: the same Canadian sections, prices and stores, in fr-CA. */
export const Route = createFileRoute("/fr/")({
  head: () => {
    const seo = pageSEO({
      path: "/fr",
      title: "Suivi des reçus et du kilométrage prêt pour l'ARC | ReceiptOne",
      description: `Photographiez vos reçus, suivez votre kilométrage et la TPS/TVH, et exportez des rapports prêts pour l'ARC pour votre T2125. Conçu pour les travailleurs autonomes du Canada. ${formatPrice(getPlan("ca", "month"))}/mois, ${TRIAL_DAYS} jours gratuits.`,
      ogTitle: "ReceiptOne Canada | Suivi des reçus, des dépenses et du kilométrage",
      ogDescription:
        "Transformez automatiquement vos reçus en rapports de dépenses prêts pour l'ARC. Conçu pour les travailleurs autonomes, les contractuels et les petites entreprises du Canada.",
      hreflang: regionHreflang("/ca"),
    });
    return {
      meta: [...seo.meta, { property: "og:locale", content: "fr_CA" }],
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(softwareApplicationJsonLd("ca", "fr")),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", path: "/" },
              { name: "Canada (français)", path: "/fr" },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(faqItemsFR)) },
      ],
    };
  },
  component: FrenchPage,
});

function FrenchPage() {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />
      <TopBanner />
      <HowItWorks region="ca" />
      <InfoCards />
      <NotAll />
      <Testimonials />
      <Trust region="ca" />
      <Integrations />
      <Pricing region="ca" />
      <Faq items={faqItemsFR} helpCenterPath="/fr/faq" />
      <Footer />
    </main>
  );
}
