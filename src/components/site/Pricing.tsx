import { useLayoutEffect, useState } from "react";
import caWeeklyImg from "@/assets/figma/mileage-auto/Graphic-Small.webp";
import caMonthlyImg from "@/assets/figma/mileage-auto/Graphic-Small2.webp";
import caAnnualImg from "@/assets/figma/mileage-auto/Graphic-Small3.webp";
import usWeeklyImg from "@/assets/figma/mileage-auto/US/2.webp";
import usMonthlyImg from "@/assets/figma/mileage-auto/US/3-removebg-preview.webp";
import usAnnualImg from "@/assets/figma/mileage-auto/US/1.webp";
import { StoreBadge } from "@/components/site/StoreBadge";

type Platform = "ios" | "android" | "desktop";
type Region = "ca" | "us";

function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>("desktop");
  // useLayoutEffect (not useEffect) so the platform-specific badge commits
  // before the browser paints the hydrated frame, avoiding a visible
  // both-badges-then-one flash on mobile.
  useLayoutEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) setPlatform("ios");
    else if (/Android/i.test(ua)) setPlatform("android");
  }, []);
  return platform;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  currency: string;
  badge?: string;
  imageClassName?: string;
  featuresMaxW?: string;
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
    imageClassName: "pointer-events-none absolute bottom-0 -right-44 z-0 w-[34rem] select-none object-contain sm:-right-48 sm:w-[36rem]",
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
    name: "Yearly",
    price: "129.99",
    originalPrice: "149.99",
    period: "/ year",
    currency: "CAD",
    badge: "Best Deal",
    imageClassName: "pointer-events-none absolute bottom-0 -right-44 z-0 w-[34rem] select-none object-contain sm:-right-48 sm:w-[36rem]",
    featuresMaxW: "max-w-[55%]",
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
    originalPrice: "5.19",
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
    price: "9.99",
    originalPrice: "12.99",
    period: "/ month",
    currency: "USD",
    imageClassName: "pointer-events-none absolute bottom-0 -right-44 z-0 w-[34rem] select-none object-contain sm:-right-48 sm:w-[36rem]",
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
    name: "Yearly",
    price: "99.99",
    originalPrice: "129.99",
    period: "/ year",
    currency: "USD",
    badge: "Best Deal",
    imageClassName: "pointer-events-none absolute bottom-0 -right-44 z-0 w-[34rem] select-none object-contain sm:-right-48 sm:w-[36rem]",
    featuresMaxW: "max-w-[55%]",
    features: [
      "Everything in Monthly",
      "Save 17%",
      "Best value for long-term tracking",
    ],
  },
];

const CA_PLAN_IMAGES: Record<string, { src: string; alt: string }> = {
  week: { src: caWeeklyImg, alt: "" },
  month: { src: caMonthlyImg, alt: "" },
  year: { src: caAnnualImg, alt: "" },
};

const US_PLAN_IMAGES: Record<string, { src: string; alt: string }> = {
  week: { src: usWeeklyImg, alt: "" },
  month: { src: usMonthlyImg, alt: "" },
  year: { src: usAnnualImg, alt: "" },
};

function StoreCTA({ isPopular: _isPopular }: { isPopular: boolean }) {
  const platform = usePlatform();

  if (platform === "ios") return <StoreBadge platform="apple" />;
  if (platform === "android") return <StoreBadge platform="google" />;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <StoreBadge platform="apple" />
      <StoreBadge platform="google" />
    </div>
  );
}

export function Pricing({ region = "ca" }: { region?: Region }) {
  const plans = region === "us" ? US_PLANS : CA_PLANS;
  const planImages = region === "us" ? US_PLAN_IMAGES : CA_PLAN_IMAGES;

  return (
    <section
      id="pricing"
      className="w-full scroll-mt-28 px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/55">
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
            <PlanCard key={plan.id} plan={plan} images={planImages} />
          ))}
        </div>

        {/* Shared store CTA */}
        <div className="mt-8 flex justify-center">
          <StoreCTA isPopular={false} />
        </div>

        <p className="mt-4 text-center font-sans text-sm text-black/55">
          All plans include a 7-day free trial · Cancel anytime · Prices in {plans[0].currency}
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan, images }: { plan: Plan; images: Record<string, { src: string; alt: string }> }) {
  const isPopular = plan.popular === true;
  const hasBadge = isPopular || !!plan.badge;
  const image = images[plan.id];

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
            loading="lazy"
            decoding="async"
            className={plan.imageClassName ?? "pointer-events-none absolute bottom-0 -right-36 z-0 w-[34rem] select-none object-contain sm:-right-40 sm:w-[36rem]"}
          />
        )}

        {/* Content layer — z-10 keeps text and CTA above the asset */}
        <div className="relative z-10 flex flex-1 flex-col">

          {/* Plan name */}
          <h3
            className={[
              "font-sans text-sm font-semibold uppercase tracking-widest",
              isPopular ? "text-white/50" : "text-black/55",
            ].join(" ")}
          >
            {plan.name}
          </h3>

          {/* Current price */}
          <div className="mt-3 flex items-baseline gap-1.5">
            <span
              className={[
                "font-display text-4xl font-bold tracking-tight",
                isPopular ? "text-white" : "text-black",
              ].join(" ")}
            >
              {plan.currency === "CAD" ? `CAD ${plan.price}` : `$${plan.price}`}
            </span>
            <span
              className={[
                "font-sans text-sm",
                isPopular ? "text-white/50" : "text-black/55",
              ].join(" ")}
            >
              {plan.period}
            </span>
          </div>

          {/* Original price — strikethrough */}
          {plan.originalPrice && (
            <p className={["mt-1 font-sans text-sm line-through", isPopular ? "text-white/50" : "text-black/55"].join(" ")}>
              {plan.currency === "CAD" ? `CAD ${plan.originalPrice}` : `$${plan.originalPrice}`} {plan.period}
            </p>
          )}

          {/* Divider — max-w-[60%] keeps it in the text column, away from the peeking animal image */}
          <div
            className={[
              "my-6 h-px max-w-[60%]",
              isPopular ? "bg-white/10" : "bg-black/[0.07]",
            ].join(" ")}
          />

          {/* Features */}
          <ul className={`flex flex-1 flex-col gap-3 ${plan.featuresMaxW ?? ""}`}>
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

