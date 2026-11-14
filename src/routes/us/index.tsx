import { createFileRoute } from "@tanstack/react-router";
import { getRoadmap, ROADMAP_STALE_TIME_MS } from "@/lib/roadmap.functions";
import { announcementFor, roadmapCacheControl, type RoadmapData } from "@/lib/roadmap";
import { Header } from "@/components/site/Header";
import { TopBanner } from "@/components/site/TopBanner";
import { HowItWorks } from "@/components/site/HowItWorks";
import { InfoCards } from "@/components/site/InfoCards";
import { NotAll } from "@/components/site/NotAll";
import { Testimonials } from "@/components/site/Testimonials";
import { Trust } from "@/components/site/Trust";
import { Pricing } from "@/components/site/Pricing";
import { Faq, faqItemsUS } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import {
  pageSEO,
  regionHreflang,
  softwareApplicationJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { priceSummary } from "@/lib/pricing";

export const Route = (createFileRoute as any)("/us/")({
  // Roadmap data for the hero pill. On /us it only shows for an item whose
  // region is not Canada-specific; items carry no region today, so none shows.
  loader: () => getRoadmap(),
  staleTime: ROADMAP_STALE_TIME_MS,
  headers: ({ loaderData }: { loaderData?: RoadmapData | null }) => ({
    "Cache-Control": roadmapCacheControl(loaderData),
  }),
  head: () => {
    const seo = pageSEO({
      path: "/us",
      title: "IRS-Ready Receipt & Mileage Tracker for Americans | ReceiptOne",
      description: `Snap receipts, track mileage and sales tax, and export IRS-ready reports for your Schedule C. For US freelancers and contractors. ${priceSummary("us")}`,
      ogTitle: "ReceiptOne US | Receipt, Expense & Mileage Tracker",
      ogDescription:
        "Track receipts, expenses, mileage, and export tax-ready reports for US freelancers, contractors, and small businesses.",
      hreflang: regionHreflang("/ca"),
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(softwareApplicationJsonLd("us")) },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "United States", path: "/us" },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(faqItemsUS)) },
      ],
    };
  },
  component: USAPage,
});

function USAPage() {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />
      <TopBanner region="us" announcement={announcementFor(Route.useLoaderData(), "us")} />
      <HowItWorks region="us" />
      <InfoCards region="us" />
      <NotAll region="us" />
      <Testimonials region="us" />
      <Trust region="us" />
      <Pricing region="us" />
      <Faq items={faqItemsUS} helpCenterPath="/us/faq" />
      <Footer region="us" />
    </main>
  );
}
