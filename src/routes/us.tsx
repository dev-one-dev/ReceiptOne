import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { TopBannerUS } from "@/components/site/TopBannerUS";
import { Numbers } from "@/components/site/Numbers";
import infoCardsUsImg from "@/assets/figma/info-cards-us.webp";
import { NotAllUS } from "@/components/site/NotAllUS";
import { Advantages } from "@/components/site/Advantages";
import { AppBanner } from "@/components/site/AppBanner";
import { Pricing } from "@/components/site/Pricing";
import { Faq, faqItems } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { SuggestFeatureWidget } from "@/components/site/SuggestFeatureWidget";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
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
  useRevealOnScroll();
  return (
    <main
      data-interactive-page
      data-reveal-root
      className="min-h-screen overflow-x-clip bg-[#f5f4f0] font-sans text-black antialiased"
    >
      <div data-reveal-skip><Header /></div>
      <div data-reveal><TopBannerUS /></div>
      <div data-reveal><Numbers /></div>
      <section id="benefits" data-reveal className="w-full">
        <div className="mx-auto w-full max-w-[1440px]">
          <img
            src={infoCardsUsImg}
            alt="Turn Receipt Chaos Into Tax Gold — benefits"
            className="block h-auto w-full"
            loading="lazy"
            decoding="async"
            width={1440}
            height={2976}
          />
        </div>
      </section>
      <div data-reveal><NotAllUS /></div>
      <div data-reveal><Advantages /></div>
      <div data-reveal><AppBanner region="us" /></div>
      <div data-reveal><Pricing region="us" /></div>
      <div data-reveal><Faq /></div>
      <div data-reveal><Footer region="us" /></div>
      <SuggestFeatureWidget region="us" />
    </main>
  );
}