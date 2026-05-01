import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { TopBanner } from "@/components/site/TopBanner";
import { Numbers } from "@/components/site/Numbers";
import { InfoCards } from "@/components/site/InfoCards";
import { NotAll } from "@/components/site/NotAll";
import { Advantages } from "@/components/site/Advantages";
import { AppBanner } from "@/components/site/AppBanner";
import { Pricing } from "@/components/site/Pricing";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { SuggestFeatureWidget } from "@/components/site/SuggestFeatureWidget";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

export const Route = createFileRoute("/ca")({
  head: () => ({
    meta: [
      { title: "ReceiptOne Canada — Track expenses, store receipts, generate tax-ready reports" },
      {
        name: "description",
        content:
          "Built for freelancers, self-employed, and small businesses in Canada. Track expenses, store receipts and generate tax-ready reports — all in one place.",
      },
      { property: "og:title", content: "ReceiptOne Canada" },
      {
        property: "og:description",
        content:
          "Track expenses, store receipts and generate tax-ready reports. Built for Canadian freelancers and small businesses.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CanadaPage,
});

function CanadaPage() {
  useRevealOnScroll();
  return (
    <main
      data-interactive-page
      data-reveal-root
      className="min-h-screen overflow-x-hidden bg-[#f5f4f0] font-sans text-black antialiased"
    >
      <div data-reveal-skip><Header /></div>
      <div data-reveal><TopBanner /></div>
      <div data-reveal><Numbers /></div>
      <div data-reveal><InfoCards /></div>
      <div data-reveal><NotAll /></div>
      <div data-reveal><Advantages /></div>
      <div data-reveal><AppBanner /></div>
      <div data-reveal><Pricing /></div>
      <div data-reveal><Faq /></div>
      <div data-reveal><Footer /></div>
      <SuggestFeatureWidget region="ca" />
    </main>
  );
}
