import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { TopBanner } from "@/components/site/TopBanner";
import { Numbers } from "@/components/site/Numbers";

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
  return (
    <main className="min-h-screen bg-[#f5f4f0] font-sans text-black antialiased">
      <Header />
      <TopBanner />
      <Numbers />
      {/* Sections 3–9 will be added one-by-one via MCP imports. */}
      <div className="mx-auto max-w-[900px] px-8 py-24 text-center text-sm text-black/40">
        Next: InfoCards → Not All → Advantages → App Banner → Pricing → FAQ → Footer.
      </div>
    </main>
  );
}
