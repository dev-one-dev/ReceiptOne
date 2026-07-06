import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FaqAccordion, CATEGORIZED_FAQ_US, faqItemsUS } from "@/components/site/Faq";
import { pageSEO, breadcrumbJsonLd, faqJsonLd, HREFLANG_US_CA } from "@/lib/seo";

export const Route = (createFileRoute as any)("/us/faq")({
  head: () => {
    const seo = pageSEO({
      path: "/us/faq",
      title: "Help Center — Frequently Asked Questions | ReceiptOne US",
      description:
        "Answers to common questions about ReceiptOne — receipt scanning, sales tax tracking, mileage, exports, pricing, and IRS compliance.",
      hreflang: HREFLANG_US_CA,
    });

    const breadcrumb = breadcrumbJsonLd([
      { name: "Home", path: "/us" },
      { name: "Help Center", path: "/us/faq" },
    ]);

    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(faqItemsUS)) },
      ],
    };
  },
  component: USFaqPage,
});

function USFaqPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f5f4f0] font-sans text-black antialiased">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-4 text-center">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-0">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/55">
            Help Center
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-3 max-w-lg font-sans text-base leading-relaxed text-black/55">
            Can't find what you're looking for?{" "}
            <Link
              to={"/us/contact" as any}
              className="font-medium text-black underline underline-offset-2 transition-colors duration-150 hover:text-[#f97316]"
            >
              Reach out to our team
            </Link>{" "}
            — we reply within one business day.
          </p>
        </div>
      </section>

      {/* Categorized FAQ */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-0">
          <div className="space-y-10">
            {CATEGORIZED_FAQ_US.map(({ category, items }) => (
              <div key={category}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-block rounded-full bg-black px-3 py-1 font-display text-xs font-semibold uppercase tracking-widest text-white">
                    {category}
                  </span>
                  <div className="h-px flex-1 bg-black/[0.07]" aria-hidden />
                </div>
                <FaqAccordion items={items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-[#0d0d14] py-6 sm:py-8">
        <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6 lg:px-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-white/50">
            Get Started
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Start managing your receipts in minutes
          </h2>
          <p className="mx-auto mt-2 max-w-md font-sans text-base text-white/55">
            Join thousands of US freelancers who use ReceiptOne to stay IRS-ready
            without the paperwork headache.
          </p>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to={"/us" as any}
              hash="pricing"
              className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:bg-[#ea6c0a] hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
            >
              See pricing
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to={"/us" as any}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/5"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <Footer region="us" />
    </main>
  );
}
