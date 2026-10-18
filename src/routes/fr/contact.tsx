import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { pageSEO, breadcrumbJsonLd, regionHreflang } from "@/lib/seo";

export const Route = createFileRoute("/fr/contact")({
  head: () => {
    const seo = pageSEO({
      path: "/fr/contact",
      title: "Nous joindre | ReceiptOne",
      description:
        "Communiquez avec l'équipe ReceiptOne — questions, commentaires ou demandes d'assistance pour les travailleurs autonomes et les petites entreprises du Canada.",
      hreflang: regionHreflang("/contact"),
    });

    const breadcrumb = breadcrumbJsonLd([
      { name: "Accueil", path: "/fr" },
      { name: "Nous joindre", path: "/fr/contact" },
    ]);

    return {
      meta: [...seo.meta, { property: "og:locale", content: "fr_CA" }],
      links: seo.links,
      scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumb) }],
    };
  },
  component: FrenchContactPage,
});

function FrenchContactPage() {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-4 text-center">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-0">
          <p className="eyebrow">Nous joindre</p>
          <h1 className="mt-3 text-ink">Écrivez-nous</h1>
          <p className="mx-auto mt-3 max-w-lg font-sans text-body text-ink-60">
            Une question, un commentaire ou quelque chose qui ne fonctionne pas? Nous répondons sous
            1 à 2 jours ouvrables.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-[600px] px-4 sm:px-6 lg:px-0">
          <ContactForm region="ca" />
          <p className="mt-4 text-center text-sm text-ink-60">
            Vous préférez le courriel? Écrivez-nous à{" "}
            <a
              href="mailto:support@receipt-one.com"
              className="font-medium text-ink underline underline-offset-2 hover:underline-offset-4"
            >
              support@receipt-one.com
            </a>
            .
          </p>
        </div>
      </section>

      <Footer region="ca" />
    </main>
  );
}
