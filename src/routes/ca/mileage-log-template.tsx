import { createFileRoute } from "@tanstack/react-router";
import { MileageLogTemplatePage } from "@/components/site/MileageLogTemplatePage";
import { getServerNow } from "@/lib/server-time.functions";
import { MILEAGE_TEMPLATE_SEO, mileageTemplateCopy } from "@/lib/mileage-log-template";
import { pageSEO, breadcrumbJsonLd, faqJsonLd, regionHreflang } from "@/lib/seo";

/** Free CRA mileage log template (XLSX and PDF). French twin: /fr/modele-registre-kilometrage. */
export const Route = createFileRoute("/ca/mileage-log-template")({
  // The server's clock, for the footer's upcoming tax deadlines.
  loader: async () => ({ now: await getServerNow() }),
  head: () => {
    const copy = mileageTemplateCopy("en");
    const seo = pageSEO({
      path: "/ca/mileage-log-template",
      title: MILEAGE_TEMPLATE_SEO.en.title,
      description: MILEAGE_TEMPLATE_SEO.en.description,
      hreflang: regionHreflang("/ca/mileage-log-template"),
    });
    return {
      meta: seo.meta,
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
  component: MileageLogTemplateRouteEn,
});

function MileageLogTemplateRouteEn() {
  return <MileageLogTemplatePage lang="en" now={Route.useLoaderData().now} />;
}
