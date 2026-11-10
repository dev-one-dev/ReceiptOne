import { createFileRoute } from "@tanstack/react-router";
import { RoadmapPage } from "@/components/site/RoadmapPage";
import { getRoadmap, ROADMAP_STALE_TIME_MS } from "@/lib/roadmap.functions";
import { roadmapCacheControl } from "@/lib/roadmap";
import { pageSEO, breadcrumbJsonLd, regionHreflang } from "@/lib/seo";

/**
 * Global changelog (English). Server-rendered from the portal's
 * listRoadmapItems; the French twin is /fr/roadmap.
 */
export const Route = createFileRoute("/roadmap")({
  loader: () => getRoadmap(),
  staleTime: ROADMAP_STALE_TIME_MS,
  headers: ({ loaderData }) => ({ "Cache-Control": roadmapCacheControl(loaderData) }),
  head: () => {
    const seo = pageSEO({
      path: "/roadmap",
      title: "Roadmap & Changelog | ReceiptOne",
      description:
        "What's new in ReceiptOne: every feature we've shipped in the past year, month by month, and what we're building next.",
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
              { name: "Home", path: "/" },
              { name: "Roadmap & changelog", path: "/roadmap" },
            ]),
          ),
        },
      ],
    };
  },
  component: RoadmapRoute,
});

function RoadmapRoute() {
  return <RoadmapPage lang="en" data={Route.useLoaderData()} />;
}
