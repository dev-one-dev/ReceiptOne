import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { TopBannerUS } from "@/components/site/TopBannerUS";
import { Numbers } from "@/components/site/Numbers";
import infoCardsUsSvg from "@/assets/figma/info-cards-us.svg";
import { NotAllUS } from "@/components/site/NotAllUS";
import { Advantages } from "@/components/site/Advantages";
import { AppBanner } from "@/components/site/AppBanner";
import { Pricing } from "@/components/site/Pricing";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { SuggestFeatureWidget } from "@/components/site/SuggestFeatureWidget";

export const Route = createFileRoute("/us")({
  head: () => ({
    meta: [
      { title: "ReceiptOne USA — Track expenses, store receipts, generate tax-ready reports" },
      {
        name: "description",
        content:
          "Built for freelancers, self-employed, and small businesses in the USA. Track expenses, store receipts and generate tax-ready reports — all in one place.",
      },
      { property: "og:title", content: "ReceiptOne USA" },
      {
        property: "og:description",
        content:
          "Track expenses, store receipts and generate tax-ready reports. Built for US freelancers and small businesses.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: USAPage,
});

function USAPage() {
  return (
    <main className="min-h-screen bg-[#f5f4f0] font-sans text-black antialiased">
      <Header />
      <TopBannerUS />
      <Numbers />
      <section id="benefits" className="w-full">
        <div className="mx-auto w-full max-w-[1440px]">
          <img
            src={infoCardsUsSvg}
            alt="Turn Receipt Chaos Into Tax Gold — benefits"
            className="block h-auto w-full"
          />
        </div>
      </section>
      <NotAllUS />
      <Advantages />
      <AppBanner region="us" />
      <Pricing region="us" />
      <Faq />
      <Footer region="us" />
      <SuggestFeatureWidget region="us" />
    </main>
  );
}