import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import heroEagleVideo from "@/assets/figma/hero-eagle-us.mp4";
import { Numbers } from "@/components/site/Numbers";
import infoCardsUsSvg from "@/assets/figma/info-cards-us.svg";
import { NotAllUS } from "@/components/site/NotAllUS";
import { Advantages } from "@/components/site/Advantages";
import { AppBanner } from "@/components/site/AppBanner";
import pricingUsSvg from "@/assets/figma/pricing-us.svg";
import { Faq } from "@/components/site/Faq";
import footerUsSvg from "@/assets/figma/footer-us.svg";

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
        <div className="relative mx-auto w-full" style={{ aspectRatio: "1440 / 1180" }}>
          <video
            src={heroEagleVideo}
            autoPlay
            loop
            muted
            playsInline
            aria-label="Eagle mascot reading a receipt"
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: "contain" }}
          />
        </div>
      </section>
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
      <section id="pricing" className="mx-auto w-full max-w-[1440px] scroll-mt-28 px-6">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1440 / 1110" }}>
          <img
            src={pricingUsSvg}
            alt="Pricing — Week, Month (Most Popular), Year"
            className="absolute inset-x-0 top-0 block w-full"
          />
        </div>
      </section>
      <Faq />
      <footer className="w-full">
        <img src={footerUsSvg} alt="Claim your free trial now — ReceiptOne" className="block h-auto w-full" />
      </footer>
    </main>
  );
}