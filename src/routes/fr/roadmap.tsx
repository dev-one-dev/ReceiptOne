import { createFileRoute } from "@tanstack/react-router";
import { RoadmapPage } from "@/components/site/RoadmapPage";
import { getRoadmap, ROADMAP_STALE_TIME_MS } from "@/lib/roadmap.functions";
import { roadmapCacheControl } from "@/lib/roadmap";
import { pageSEO, breadcrumbJsonLd, regionHreflang } from "@/lib/seo";

/** French twin of /roadmap, same data, French texts. */
export const Route = createFileRoute("/fr/roadmap")({
  loader: () => getRoadmap(),
  staleTime: ROADMAP_STALE_TIME_MS,
  headers: ({ loaderData }) => ({ "Cache-Control": roadmapCacheControl(loaderData) }),
  head: () => {
    const seo = pageSEO({
      path: "/fr/roadmap",
      title: "Feuille de route et nouveautés | ReceiptOne",
      description:
        "Les nouveautés de ReceiptOne : chaque fonctionnalité livrée au cours de la dernière année, mois par mois, et ce que nous préparons ensuite.",
      hreflang: regionHreflang("/roadmap"),
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", path: "/fr" },
              { name: "Feuille de route et nouveautés", path: "/fr/roadmap" },
            ]),
          ),
        },
      ],
    };
  },
  component: RoadmapRouteFr,
});

function RoadmapRouteFr() {
  return <RoadmapPage lang="fr" data={Route.useLoaderData()} />;
}
