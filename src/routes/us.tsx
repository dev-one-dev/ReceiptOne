import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { TopBanner } from "@/components/site/TopBanner";
import { HowItWorks } from "@/components/site/HowItWorks";
import { InfoCards } from "@/components/site/InfoCards";
import { NotAll } from "@/components/site/NotAll";
import { Testimonials } from "@/components/site/Testimonials";
import { Trust } from "@/components/site/Trust";
import { Advantages } from "@/components/site/Advantages";
import { Pricing } from "@/components/site/Pricing";
import { Faq, faqItems } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { SuggestFeatureWidget } from "@/components/site/SuggestFeatureWidget";
import {
  pageSEO,
  HREFLANG_US_CA,
  softwareApplicationJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";

export const Route = createFileRoute("/us")({
  head: () => {
    const seo = pageSEO({
      path: "/us",
      title:
        "ReceiptOne US | Receipt, Expense & Mileage Tracker for Freelancers",
      description:
        "Track receipts, expenses, mileage, and export tax-ready reports for freelancers, contractors, and small businesses in the United States.",
      ogTitle: "ReceiptOne US | Receipt, Expense & Mileage Tracker",
      ogDescription:
        "Track receipts, expenses, mileage, and export tax-ready reports for US freelancers, contractors, and small businesses.",
      hreflang: HREFLANG_US_CA,
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
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(faqItems)) },
      ],
    };
  },
  component: USAPage,
});

function USAPage() {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-[#f5f4f0] font-sans text-black antialiased"
    >
      <Header />
      <TopBanner />
      <HowItWorks region="us" />
      <InfoCards region="us" />
      <NotAll region="us" />
      <Testimonials />
      <Trust region="us" />
      <Advantages />
      <Pricing region="us" />
      <Faq />
      <Footer region="us" />
      <SuggestFeatureWidget region="us" />
    </main>
  );
}