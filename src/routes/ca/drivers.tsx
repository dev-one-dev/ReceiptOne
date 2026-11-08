import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { PrimaryCta } from "@/components/site/PrimaryCta";
import { StoreBadge } from "@/components/site/StoreBadge";
import { FeatureCard, CA_MILEAGE_FEATURE } from "@/components/site/InfoCards";
import { Pricing } from "@/components/site/Pricing";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";
import { ROUTES } from "@/lib/routes";
import { pageSEO, breadcrumbJsonLd } from "@/lib/seo";

const CRA_SHARING_ECONOMY_URL =
  "https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/compliance/platform-economy/sharing-economy.html";

/**
 * Landing page for Canadian rideshare and delivery drivers. English only:
 * there is no /fr or /us equivalent, so (like the CA-only articles) it emits
 * no hreflang alternates and is absent from src/lib/locales.ts.
 */
export const Route = createFileRoute("/ca/drivers")({
  head: () => {
    const seo = pageSEO({
      path: "/ca/drivers",
      title: "Mileage Tracker for Uber, Lyft and Delivery Drivers in Canada | ReceiptOne",
      description:
        "GPS mileage tracking for Canadian rideshare and delivery drivers. Log business kilometres automatically, keep fuel and maintenance receipts, and export a CRA-ready report. 7-day free trial.",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Canada", path: "/ca" },
              { name: "Drivers", path: "/ca/drivers" },
            ]),
          ),
        },
      ],
    };
  },
  component: DriversPage,
});

const REASONS = [
  {
    title: "Kilometres are money.",
    body: "GPS trip tracking logs the kilometres you drive for work, right next to your receipts, so both end up in the same year-end report.",
  },
  {
    title: "Thermal receipts fade.",
    body: "Gas station receipts can fade in months. Snap them the day you get them, or forward e-mail receipts to your own ReceiptOne address.",
  },
];

const STEPS = [
  "Snap the receipt or forward the e-mail.",
  "Turn on GPS for work trips.",
  "Export a CRA-ready report for your accountant or your return.",
];

const CARD = "rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]";

function DriversPage() {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      {/* Hero */}
      <section data-cta-location="hero" className="w-full px-4 pt-24 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="max-w-3xl">
            <p className="eyebrow">For rideshare and delivery drivers</p>
            <h1 className="mt-1 text-ink">Every work kilometre, logged.</h1>
            <p className="mt-2 max-w-2xl text-lead text-ink-60">
              ReceiptOne tracks your trips with GPS in the background and splits business from
              personal, so your T2125 gets the right kilometres. Snap your fuel and maintenance
              receipts in the same app.
            </p>
            <div className="mt-4 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <PrimaryCta href={ROUTES.signup}>Start 7-day free trial</PrimaryCta>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <span className="sr-only">Available on:</span>
                <StoreBadge platform="apple" region="ca" />
                <StoreBadge platform="google" region="ca" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why drivers need this */}
      <section className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-4">
            <p className="eyebrow">Why it matters</p>
            <h2 className="mt-1 text-ink">Why drivers need this</h2>
          </div>
          <ol className="grid gap-3 md:grid-cols-2">
            {REASONS.map((reason, i) => (
              <li key={reason.title} className={`${CARD} flex flex-col p-4 sm:p-5`}>
                <span
                  className="font-mono text-label font-normal tracking-mono text-ink-40"
                  aria-hidden
                >
                  0{i + 1}
                </span>
                <h3 className="mt-2 text-lead tracking-body text-ink">{reason.title}</h3>
                <p className="mt-1.5 text-body text-ink-60">{reason.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Mileage: the same card the /ca landing shows in InfoCards */}
      <section className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-[1200px]">
          <FeatureCard feature={CA_MILEAGE_FEATURE} />
        </div>
      </section>

      {/* How it works */}
      <section className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-4">
            <p className="eyebrow">Three steps</p>
            <h2 className="mt-1 text-ink">How it works</h2>
          </div>
          <ol className="grid gap-3 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step} className={`${CARD} flex flex-col p-4 sm:p-5`}>
                <span
                  className="font-mono text-label font-normal tracking-mono text-ink-40"
                  aria-hidden
                >
                  0{i + 1}
                </span>
                <p className="mt-2 text-body text-ink-80">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Pricing region="ca" />
      <FinalCta />

      <div className="w-full px-4 pb-6 sm:px-6 lg:px-8">
        <p className="mx-auto w-full max-w-[1200px] text-sm text-ink-60">
          Driving for Uber or Lyft? The CRA requires rideshare drivers to register for GST/HST from
          their first fare. Source:{" "}
          <a
            href={CRA_SHARING_ECONOMY_URL}
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2 hover:text-ink"
          >
            Canada Revenue Agency
          </a>
        </p>
        <p className="mx-auto mt-2 w-full max-w-[1200px] text-sm text-ink-60">
          ReceiptOne is not affiliated with Uber, Lyft, DoorDash or SkipTheDishes. This page is
          general information, not tax advice.
        </p>
      </div>

      <Footer region="ca" />
    </main>
  );
}
