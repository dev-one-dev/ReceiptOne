import { createFileRoute } from "@tanstack/react-router";
import { TaxDeadlinesPage } from "@/components/site/TaxDeadlinesPage";
import { getServerNow } from "@/lib/server-time.functions";
import { ROADMAP_CACHE_CONTROL } from "@/lib/roadmap";
import { CRA_TIME_ZONE, dateInZone } from "@/lib/tax-deadlines";
import { TAX_DEADLINES_SEO, taxDeadlinesCopy } from "@/lib/tax-deadlines-page";
import { pageSEO, breadcrumbJsonLd, faqJsonLd, regionHreflang } from "@/lib/seo";

/** French twin of /ca/tax-deadlines: same computed dates, French texts. */
export const Route = createFileRoute("/fr/echeances-fiscales")({
  // The server's clock: the page's dates, FAQ years and footer strip all
  // derive from it, server-side (see TaxDeadlinesPage).
  loader: async () => ({ now: await getServerNow() }),
  // Same edge caching as the landing pages.
  headers: () => ({ "Cache-Control": ROADMAP_CACHE_CONTROL }),
  head: ({ loaderData }) => {
    const today = dateInZone(loaderData?.now ?? new Date(), CRA_TIME_ZONE);
    const copy = taxDeadlinesCopy("fr", today);
    const seo = pageSEO({
      path: "/fr/echeances-fiscales",
      title: TAX_DEADLINES_SEO.fr.title,
      description: TAX_DEADLINES_SEO.fr.description,
      hreflang: regionHreflang("/ca/tax-deadlines"),
    });
    return {
      meta: [...seo.meta, { property: "og:locale", content: "fr_CA" }],
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd(copy.breadcrumb)),
        },
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(copy.faq.items)) },
      ],
    };
  },
  component: TaxDeadlinesRouteFr,
});

function TaxDeadlinesRouteFr() {
  return <TaxDeadlinesPage lang="fr" now={Route.useLoaderData().now} />;
}
