type Region = "ca" | "us";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  period: string;
  currency: string;
  popular?: boolean;
  bestDeal?: boolean;
}

const CA_PLANS: Plan[] = [
  {
    id: "week",
    name: "Week",
    description: "Start saving on taxes today — try it risk-free. Test drive for one week.",
    price: "4.99",
    originalPrice: "6.49",
    period: "/ week",
    currency: "CAD",
  },
  {
    id: "month",
    name: "Month",
    description: "Track expenses year-round. Flexible monthly plan.",
    price: "12.99",
    originalPrice: "15.99",
    period: "/ month",
    currency: "CAD",
    popular: true,
  },
  {
    id: "year",
    name: "Year",
    description: "Best value plan. Save 18% with annual billing.",
    price: "129.99",
    originalPrice: "149.99",
    period: "/ year",
    currency: "CAD",
    bestDeal: true,
  },
];

const US_PLANS: Plan[] = [
  {
    id: "week",
    name: "Week",
    description: "Start saving on taxes today — try it risk-free. Test drive for one week.",
    price: "3.99",
    originalPrice: "4.99",
    period: "/ week",
    currency: "USD",
  },
  {
    id: "month",
    name: "Month",
    description: "Track expenses year-round. Flexible monthly plan.",
    price: "7.99",
    originalPrice: "9.99",
    period: "/ month",
    currency: "USD",
    popular: true,
  },
  {
    id: "year",
    name: "Year",
    description: "Best value plan. Save 17% with annual billing.",
    price: "79.99",
    originalPrice: "99.99",
    period: "/ year",
    currency: "USD",
    bestDeal: true,
  },
];

function scrollToApps(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("apps")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Pricing({ region = "ca" }: { region?: Region }) {
  const plans = region === "us" ? US_PLANS : CA_PLANS;

  return (
    <section
      id="pricing"
      className="w-full scroll-mt-28 px-4 pt-5 pb-12 sm:px-6 sm:pt-7 sm:pb-16 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/35">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-base leading-relaxed text-black/55 sm:text-lg">
            Start free for 7 days. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <p className="mt-8 text-center font-sans text-sm text-black/35">
          All plans include a 7-day free trial · Prices in {plans[0].currency}
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const isPopular = plan.popular === true;
  const isBestDeal = plan.bestDeal === true;
  const hasBadge = isPopular || isBestDeal;

  return (
    <div
      className={[
        "relative flex flex-col rounded-3xl p-7",
        hasBadge ? "pt-10" : "",
        isPopular
          ? "bg-black text-white ring-2 ring-black"
          : isBestDeal
          ? "border-2 border-green-500 bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          : "border border-black/[0.07] bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
      ].join(" ")}
    >
      {/* Most Popular badge */}
      {isPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#f97316] px-4 py-1 font-script text-sm text-white shadow-[0_4px_12px_rgba(249,115,22,0.4)]">
          Most Popular
        </span>
      )}

      {/* Best Deal badge */}
      {isBestDeal && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-500 px-4 py-1 font-script text-sm text-white shadow-[0_4px_12px_rgba(34,197,94,0.4)]">
          Best Deal
        </span>
      )}

      {/* Plan name */}
      <p
        className={[
          "font-sans text-sm font-semibold uppercase tracking-widest",
          isPopular ? "text-white/50" : "text-black/40",
        ].join(" ")}
      >
        {plan.name}
      </p>

      {/* Description */}
      <p
        className={[
          "mt-2 font-sans text-sm leading-relaxed",
          isPopular ? "text-white/60" : "text-black/50",
        ].join(" ")}
      >
        {plan.description}
      </p>

      {/* Price block */}
      <div className="mt-5">
        <div className="flex items-baseline gap-1.5">
          <span
            className={[
              "font-display text-5xl font-bold tracking-tight",
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
            {plan.period}
          </span>
        </div>
        <p
          className={[
            "mt-1 font-sans text-sm line-through",
            isPopular ? "text-white/30" : "text-black/25",
          ].join(" ")}
        >
          ${plan.originalPrice} {plan.period}
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA */}
      <a
        href="#apps"
        onClick={scrollToApps}
        className={[
          "mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 font-display text-sm font-semibold transition-all hover:scale-[1.02]",
          isPopular
            ? "bg-white text-black hover:opacity-90"
            : isBestDeal
            ? "bg-green-500 text-white hover:opacity-90"
            : "bg-black text-white hover:opacity-90",
        ].join(" ")}
      >
        Start free trial
      </a>
    </div>
  );
}
