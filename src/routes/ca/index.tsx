import { createFileRoute } from "@tanstack/react-router";
import { getRoadmap, ROADMAP_STALE_TIME_MS } from "@/lib/roadmap.functions";
import { announcementFor, roadmapCacheControl } from "@/lib/roadmap";
import { Header } from "@/components/site/Header";
import { TopBanner } from "@/components/site/TopBanner";
import { HowItWorks } from "@/components/site/HowItWorks";
import { InfoCards } from "@/components/site/InfoCards";
import { NotAll } from "@/components/site/NotAll";
import { Testimonials } from "@/components/site/Testimonials";
import { Trust } from "@/components/site/Trust";
import { Pricing } from "@/components/site/Pricing";
import { Faq, faqItems } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import {
  pageSEO,
  regionHreflang,
  softwareApplicationJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { priceSummary } from "@/lib/pricing";

export const Route = createFileRoute("/ca/")({
  // Roadmap data for the hero's "New · …" pill (server-rendered).
  loader: () => getRoadmap(),
  staleTime: ROADMAP_STALE_TIME_MS,
  headers: ({ loaderData }) => ({ "Cache-Control": roadmapCacheControl(loaderData) }),
  head: () => {
    const seo = pageSEO({
      path: "/ca",
      title: "CRA-Ready Receipt & Mileage Tracker for Canadians | ReceiptOne",
      description: `Snap receipts, track mileage and GST/HST, and export CRA-ready reports for your T2125. Built for Canadian freelancers. ${priceSummary("ca")}`,
      ogTitle: "ReceiptOne Canada | Receipt, Expense & Mileage Tracker",
      ogDescription:
        "Turn receipts into CRA-ready expense reports automatically. Built for Canadian freelancers, contractors, and small businesses.",
      hreflang: regionHreflang("/ca"),
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(softwareApplicationJsonLd("ca")) },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Canada", path: "/ca" },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(faqItems)) },
      ],
    };
  },
  component: CanadaPage,
});

function CanadaPage() {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />
      <TopBanner announcement={announcementFor(Route.useLoaderData(), "ca")} />
      <HowItWorks region="ca" />
      <InfoCards />
      <NotAll />
      <Testimonials />
      <Trust region="ca" />
      <Pricing region="ca" />
      <Faq />
      <Footer />
    </main>
  );
}
