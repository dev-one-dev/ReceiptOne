import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import topBannerUsSvg from "@/assets/figma/top-banner-us.svg";
import { Numbers } from "@/components/site/Numbers";
import { InfoCards } from "@/components/site/InfoCards";
import { NotAll } from "@/components/site/NotAll";
import { Advantages } from "@/components/site/Advantages";
import { AppBanner } from "@/components/site/AppBanner";
import { Pricing } from "@/components/site/Pricing";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";

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
      <section className="w-full">
        <img
          src={topBannerUsSvg}
          alt="Track expenses, store receipts, and generate tax-ready reports — built for freelancers, self-employed, and small businesses in the US"
          className="block h-auto w-full"
        />
      </section>
      <Numbers />
      <InfoCards />
      <NotAll />
      <Advantages />
      <AppBanner region="us" />
      <Pricing />
      <Faq />
      <Footer />
    </main>
  );
}