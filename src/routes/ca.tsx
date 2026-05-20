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

export const Route = createFileRoute("/ca")({
  head: () => {
    const seo = pageSEO({
      path: "/ca",
      title:
        "ReceiptOne Canada — CRA-Ready Receipt & Expense Tracker for Freelancers",
      description:
        "Snap receipts, track mileage, and export CRA-ready expense reports. Built for Canadian freelancers, contractors, and small businesses. Start free for 7 days.",
      ogTitle: "ReceiptOne Canada | Receipt, Expense & Mileage Tracker",
      ogDescription:
        "Turn receipts into CRA-ready expense reports automatically. Built for Canadian freelancers, contractors, and small businesses.",
      hreflang: HREFLANG_US_CA,
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
      className="min-h-screen overflow-x-clip bg-[#f5f4f0] font-sans text-black antialiased"
    >
      <Header />
      <TopBanner />
      <HowItWorks region="ca" />
      <InfoCards />
      <NotAll />
      <Testimonials />
      <Trust region="ca" />
      <Advantages />
      <Pricing region="ca" />
      <Faq />
      <Footer />
      <SuggestFeatureWidget region="ca" />
    </main>
  );
}
