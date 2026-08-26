import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FaqAccordion, CATEGORIZED_FAQ, faqItems } from "@/components/site/Faq";
import { pageSEO, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const Route = (createFileRoute as any)("/faq")({
  head: () => {
    const seo = pageSEO({
      path: "/faq",
      title: "Help Center — Frequently Asked Questions | ReceiptOne",
      description:
        "Answers to common questions about ReceiptOne — receipt scanning, GST/HST tracking, mileage, exports, pricing, and CRA compliance.",
    });

    const breadcrumb = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Help Center", path: "/faq" },
    ]);

    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(faqItems)) },
      ],
    };
  },
  component: FaqPage,
});

function FaqPage() {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-4 text-center">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-0">
          <p className="eyebrow">Help Center</p>
          <h1 className="mt-3 text-ink">Frequently asked questions</h1>
          <p className="mx-auto mt-3 max-w-lg font-sans text-body text-ink-60">
            Can't find what you're looking for?{" "}
            <Link
              to={"/contact" as any}
              className="font-medium text-ink underline underline-offset-2 transition-colors duration-150 hover:text-ember"
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
            {CATEGORIZED_FAQ.map(({ category, items }) => (
              <div key={category}>
                {/* Category header */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-block rounded-pill bg-ink px-3 py-1 eyebrow text-paper">
                    {category}
                  </span>
                  <div className="h-px flex-1 bg-ink-05" aria-hidden />
                </div>

                <FaqAccordion items={items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section data-surface="void" className="bg-ink py-6 sm:py-8">
        <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6 lg:px-8">
          <p className="eyebrow">Get Started</p>
          <h2 className="mt-2 text-paper">Start managing your receipts in minutes</h2>
          <p className="mx-auto mt-2 max-w-md font-sans text-body text-paper-60">
            Built for Canadian freelancers who want to stay CRA-ready without the paperwork
            headache.
          </p>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to={"/ca" as any}
              hash="pricing"
              className="inline-flex items-center gap-2 rounded-pill bg-ember px-6 py-3 font-sans text-sm font-semibold text-ink transition-all duration-200 hover:bg-ember-hover hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
            >
              See pricing
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to={"/ca" as any}
              className="inline-flex items-center gap-2 rounded-pill border border-hairline-void px-6 py-3 font-sans text-sm font-semibold text-paper transition-all duration-200 hover:border-paper-40 hover:bg-paper-05"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <Footer region="ca" />
    </main>
  );
}
