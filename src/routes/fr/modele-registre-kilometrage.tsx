import { createFileRoute } from "@tanstack/react-router";
import { MileageLogTemplatePage } from "@/components/site/MileageLogTemplatePage";
import { getServerNow } from "@/lib/server-time.functions";
import { MILEAGE_TEMPLATE_SEO, mileageTemplateCopy } from "@/lib/mileage-log-template";
import { pageSEO, breadcrumbJsonLd, faqJsonLd, regionHreflang } from "@/lib/seo";

/** French twin of /ca/mileage-log-template: the same templates in French. */
export const Route = createFileRoute("/fr/modele-registre-kilometrage")({
  // The server's clock, for the footer's upcoming tax deadlines.
  loader: async () => ({ now: await getServerNow() }),
  head: () => {
    const copy = mileageTemplateCopy("fr");
    const seo = pageSEO({
      path: "/fr/modele-registre-kilometrage",
      title: MILEAGE_TEMPLATE_SEO.fr.title,
      description: MILEAGE_TEMPLATE_SEO.fr.description,
      hreflang: regionHreflang("/ca/mileage-log-template"),
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
  component: MileageLogTemplateRouteFr,
});

function MileageLogTemplateRouteFr() {
  return <MileageLogTemplatePage lang="fr" now={Route.useLoaderData().now} />;
}
