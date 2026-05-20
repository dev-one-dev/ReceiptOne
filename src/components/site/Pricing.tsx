import phoneReceiptsImg from "@/assets/figma/phone-receipts-3.webp";
import beaverMonthImg from "@/assets/figma/pr-beaver-month.webp";
import phoneReportsImg from "@/assets/figma/phone-reports.webp";

type Region = "ca" | "us";

interface Plan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  currency: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

const CA_PLANS: Plan[] = [
  {
    id: "week",
    name: "Weekly",
    price: "4.99",
    originalPrice: "6.49",
    period: "/ week",
    currency: "CAD",
    features: [
      "Unlimited receipt scanning",
      "Expense & mileage tracking",
      "GST / HST / PST tracking",
      "CRA-ready expense reports",
      "iOS & Android apps",
    ],
  },
  {
    id: "month",
    name: "Monthly",
    price: "12.99",
    originalPrice: "15.99",
    period: "/ month",
    currency: "CAD",
    popular: true,
    features: [
      "Everything in Weekly",
      "Unlimited cloud storage",
      "Multi-device sync",
      "Accountant report sharing",
      "Priority support",
    ],
  },
  {
    id: "year",
    name: "Annual",
    price: "129.99",
    originalPrice: "149.99",
    period: "/ year",
    currency: "CAD",
    badge: "Best Deal",
    features: [
      "Everything in Monthly",
      "Save 13%",
      "Best value for long-term tracking",
    ],
  },
];

const US_PLANS: Plan[] = [
  {
    id: "week",
    name: "Weekly",
    price: "3.99",
    period: "/ week",
    currency: "USD",
    features: [
      "Unlimited receipt scanning",
      "Expense & mileage tracking",
      "Sales tax tracking",
      "IRS-ready expense reports",
      "iOS & Android apps",
    ],
  },
  {
    id: "month",
    name: "Monthly",
    price: "7.99",
    period: "/ month",
    currency: "USD",
    popular: true,
    features: [
      "Everything in Weekly",
      "Unlimited cloud storage",
      "Multi-device sync",
      "Accountant report sharing",
      "Priority support",
    ],
  },
  {
    id: "year",
    name: "Annual",
    price: "79.99",
    period: "/ year",
    currency: "USD",
    badge: "Save 17%",
    features: [
      "Everything in Monthly",
      "2 months free vs monthly",
      "Unlimited cloud storage",
      "Multi-device sync",
      "Priority support",
    ],
  },
];

/** Asset mapped by plan id — used for every region. */
const PLAN_IMAGES: Record<string, { src: string; alt: string }> = {
  week: { src: phoneReceiptsImg, alt: "" },
  month: { src: beaverMonthImg, alt: "" },
  year: { src: phoneReportsImg, alt: "" },
};

function scrollToApps(e: React.MouseEvent) {
  e.preventDefault();
  const url = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    ? "https://apps.apple.com/app/receiptone/id0000000000"
    : "https://play.google.com/store/apps/details?id=com.receiptone.app";
  window.open(url, "_blank", "noopener,noreferrer");
}

export function Pricing({ region = "ca" }: { region?: Region }) {
  const plans = region === "us" ? US_PLANS : CA_PLANS;

  return (
    <section
      id="pricing"
      className="w-full scroll-mt-28 px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/35">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]">
            Simple pricing. Cancel anytime.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-black/55 sm:text-lg">
            Try it free for 7 days — no credit card required.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <p className="mt-8 text-center font-sans text-sm text-black/35">
          All plans include a 7-day free trial · Cancel anytime · Prices in {plans[0].currency}
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const isPopular = plan.popular === true;
  const hasBadge = isPopular || !!plan.badge;
  const image = PLAN_IMAGES[plan.id];

  return (
    /*
     * Outer wrapper — provides vertical clearance for the badge that sits
     * above the card. It must NOT have overflow-hidden so the badge is visible.
     */
    <div className="relative pt-4">

      {/* Most Popular badge */}
      {isPopular && (
        <span className="absolute top-0 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[#f97316] px-4 py-1 font-sans text-xs font-semibold text-white shadow-[0_4px_12px_rgba(249,115,22,0.4)]">
          Most Popular
        </span>
      )}

      {/* Best Deal / custom badge */}
      {plan.badge && !isPopular && (
        <span className="absolute top-0 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#fed7aa] px-4 py-1 font-sans text-xs font-semibold text-black shadow-[0_4px_12px_rgba(0,0,0,0.10)]">
          {plan.badge}
        </span>
      )}

      {/*
       * Card — overflow-hidden crops the peeking image at card edges.
       * position:relative creates the stacking context for z-index layers.
       */}
      <div
        className={[
          "relative flex h-full flex-col overflow-hidden rounded-3xl p-7",
          hasBadge ? "pt-10" : "",
          isPopular
            ? "bg-black text-white ring-2 ring-black"
            : "border border-black/[0.07] bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
        ].join(" ")}
      >
        {/*
         * Peek-a-boo asset — z-0, sits behind the z-10 content layer.
         * Anchored to bottom-right; overflow-hidden on the card crops it.
         */}
        {image && (
          <img
            src={image.src}
            alt={image.alt}
            aria-hidden
            loading="eager"
            decoding="async"
            className="pointer-events-none absolute bottom-0 -right-36 z-0 w-[34rem] select-none object-contain sm:-right-40 sm:w-[36rem]"
          />
        )}

        {/* Content layer — z-10 keeps text and CTA above the asset */}
        <div className="relative z-10 flex flex-1 flex-col">

          {/* Plan name */}
          <p
            className={[
              "font-sans text-sm font-semibold uppercase tracking-widest",
              isPopular ? "text-white/50" : "text-black/40",
            ].join(" ")}
          >
            {plan.name}
          </p>

          {/* Current price */}
          <div className="mt-3 flex items-baseline gap-1.5">
            <span
              className={[
                "font-display text-4xl font-bold tracking-tight",
                isPopular ? "text-white" : "text-black",
              ].join(" ")}
            >
              ${plan.price}
            </span>
            <span
              className={[
                "font-sans text-sm",
                isPopular ? "text-white/50" : "text-black/40",
              ].join(" ")}
            >
              {plan.currency} {plan.period}
            </span>
          </div>

          {/* Original price — strikethrough */}
          {plan.originalPrice && (
            <p className={["mt-1 font-sans text-sm line-through", isPopular ? "text-white/30" : "text-black/25"].join(" ")}>
              ${plan.originalPrice} {plan.currency} {plan.period}
            </p>
          )}

          {/* Divider */}
          <div
            className={[
              "my-6 h-px",
              isPopular ? "bg-white/10" : "bg-black/[0.07]",
            ].join(" ")}
          />

          {/* Features */}
          <ul className="flex flex-1 flex-col gap-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <span
                  className={[
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                    isPopular ? "bg-white/15" : "bg-black/[0.06]",
                  ].join(" ")}
                  aria-hidden
                >
                  <CheckIcon isPopular={isPopular} />
                </span>
                <span
                  className={[
                    "font-sans text-sm leading-snug",
                    isPopular ? "text-white/80" : "text-black/65",
                  ].join(" ")}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#"
            onClick={scrollToApps}
            className={[
              "mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 font-display text-sm font-semibold transition-all hover:scale-[1.02]",
              isPopular
                ? "bg-white text-black hover:opacity-90"
                : "bg-black text-white hover:opacity-90",
            ].join(" ")}
          >
            Start free trial
          </a>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ isPopular }: { isPopular: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isPopular ? "white" : "black"}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
