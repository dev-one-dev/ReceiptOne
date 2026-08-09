import { useLayoutEffect, useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import caWeeklyImg from "@/assets/figma/mileage-auto/Graphic-Small.webp";
import caMonthlyImg from "@/assets/figma/mileage-auto/Graphic-Small2.webp";
import caAnnualImg from "@/assets/figma/mileage-auto/Graphic-Small3.webp";
import usWeeklyImg from "@/assets/figma/mileage-auto/US/2.webp";
import usMonthlyImg from "@/assets/figma/mileage-auto/US/3-removebg-preview.webp";
import usAnnualImg from "@/assets/figma/mileage-auto/US/1.webp";
import { StoreBadge } from "@/components/site/StoreBadge";
import { cn } from "@/lib/utils";

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
  discountLabel?: string;
  popular?: boolean;
}

/**
 * All billing durations grant the same single "premium" RevenueCat
 * entitlement (see src/integrations/entitlement.ts) — Weekly, Monthly,
 * and Yearly are identical in features. Only price, period, and discount
 * differ, so the feature list is shared and shown once regardless of the
 * selected period.
 */
const CA_FEATURES = [
  "Unlimited receipt scanning",
  "Expense & mileage tracking",
  "GST / HST / PST tracking",
  "CRA-ready expense reports",
  "Multi-device sync",
  "In-app support",
  "iOS & Android apps",
];

const US_FEATURES = [
  "Unlimited receipt scanning",
  "Expense & mileage tracking",
  "Sales tax tracking",
  "IRS-ready expense reports",
  "Multi-device sync",
  "In-app support",
  "iOS & Android apps",
];

const CA_PLANS: Plan[] = [
  {
    id: "week",
    name: "Weekly",
    price: "4.99",
    originalPrice: "6.49",
    period: "/ week",
    currency: "CAD",
  },
  {
    id: "month",
    name: "Monthly",
    price: "12.99",
    originalPrice: "15.99",
    period: "/ month",
    currency: "CAD",
    popular: true,
  },
  {
    id: "year",
    name: "Yearly",
    price: "129.99",
    originalPrice: "149.99",
    period: "/ year",
    currency: "CAD",
    badge: "Best Deal",
    discountLabel: "Save 13%",
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
  },
  {
    id: "month",
    name: "Monthly",
    price: "9.99",
    originalPrice: "12.99",
    period: "/ month",
    currency: "USD",
    popular: true,
  },
  {
    id: "year",
    name: "Yearly",
    price: "99.99",
    originalPrice: "129.99",
    period: "/ year",
    currency: "USD",
    badge: "Best Deal",
    discountLabel: "Save 17%",
  },
];

const CA_PLAN_IMAGES: Record<string, string> = {
  week: caWeeklyImg,
  month: caMonthlyImg,
  year: caAnnualImg,
};

const US_PLAN_IMAGES: Record<string, string> = {
  week: usWeeklyImg,
  month: usMonthlyImg,
  year: usAnnualImg,
};

function formatPrice(plan: Plan, price: string) {
  return plan.currency === "CAD" ? `CAD ${price}` : `$${price}`;
}

/**
 * % saved by choosing Monthly over paying Weekly for the same stretch of
 * days, computed live from the real listed prices (not hardcoded) so it
 * can't drift if either price changes.
 */
function monthlySavingsPct(weekly: Plan, monthly: Plan): number {
  const weeklyAsMonthly = parseFloat(weekly.price) * (52 / 12);
  return Math.round((1 - parseFloat(monthly.price) / weeklyAsMonthly) * 100);
}

function StoreCTA() {
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
  const features = region === "us" ? US_FEATURES : CA_FEATURES;
  const planImages = region === "us" ? US_PLAN_IMAGES : CA_PLAN_IMAGES;

  const [selectedId, setSelectedId] = useState<string>("month");
  const selectedPlan = plans.find((p) => p.id === selectedId) ?? plans[0];
  const weekly = plans.find((p) => p.id === "week")!;
  const monthly = plans.find((p) => p.id === "month")!;

  const savingsLabel =
    selectedPlan.id === "month"
      ? `Save ${monthlySavingsPct(weekly, monthly)}% vs Weekly`
      : selectedPlan.id === "year"
        ? selectedPlan.discountLabel
        : undefined;

  return (
    <section
      id="pricing"
      className="w-full scroll-mt-28 px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <div className="mx-auto mb-6 max-w-2xl text-center">
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

        {/*
         * Period toggle — pt-8 on the outer wrapper reserves clearance above
         * the pill for badges to float in, well clear of the tabs below them
         * (fixes the earlier bug where -top-0 + a too-small padding let the
         * badge's own height overlap the tab underneath it).
         */}
        <TabsPrimitive.Root
          value={selectedId}
          onValueChange={setSelectedId}
          className="flex flex-col items-center pt-8"
        >
          <TabsPrimitive.List
            aria-label="Billing period"
            className="flex items-center gap-1 rounded-full border border-black/[0.07] bg-white p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            {plans.map((plan) => {
              const badgeText = plan.popular ? "Most Popular" : plan.badge;
              return (
                <div key={plan.id} className="relative">
                  {/* Floats well above the pill (not just above the tab) so it
                      never touches — let alone visually fuses with — the tab's
                      own background in either active or inactive state. */}
                  {badgeText && (
                    <span
                      className={cn(
                        "absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 font-sans text-[10px] font-semibold",
                        plan.popular
                          ? "bg-[#f97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.4)]"
                          : "bg-[#fed7aa] text-black shadow-[0_4px_12px_rgba(0,0,0,0.10)]",
                      )}
                    >
                      {badgeText}
                    </span>
                  )}
                  <TabsPrimitive.Trigger
                    value={plan.id}
                    className={cn(
                      "block rounded-full px-5 py-2.5 font-sans text-sm font-semibold outline-none transition-colors sm:px-6",
                      plan.id === selectedId
                        ? "bg-black text-white"
                        : "text-black/55 hover:text-black",
                    )}
                  >
                    {plan.name}
                  </TabsPrimitive.Trigger>
                </div>
              );
            })}
          </TabsPrimitive.List>
        </TabsPrimitive.Root>

        {/* Card */}
        <div className="relative mx-auto mt-8 w-full max-w-xl overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-9">
          {/*
           * Peek-a-boo asset — z-0, sits behind the z-10 content layer.
           * Anchored to bottom-right; overflow-hidden on the card crops it.
           * Swaps (with a crossfade, like the price block) to match the
           * selected period, restoring the per-plan mascot variety the
           * three-card layout had.
           */}
          <img
            key={selectedPlan.id}
            src={planImages[selectedPlan.id]}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="animate-in fade-in pointer-events-none absolute bottom-0 -right-36 z-0 w-[28rem] select-none object-contain duration-300 sm:-right-40 sm:w-[30rem]"
          />

          {/* Content layer — z-10 keeps text and CTA above the asset */}
          <div className="relative z-10">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-black/55">
              {selectedPlan.name}
            </h3>

            {/* key remounts this block on toggle change, replaying the fade-in transition */}
            <div key={selectedPlan.id} className="animate-in fade-in duration-300">
              <div className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                <span className="font-display text-4xl font-bold tracking-tight whitespace-nowrap text-black sm:text-5xl">
                  {formatPrice(selectedPlan, selectedPlan.price)}
                </span>
                <span className="font-sans text-base text-black/55">{selectedPlan.period}</span>
              </div>

              {selectedPlan.originalPrice && (
                <p className="mt-1 font-sans text-sm text-black/55 line-through">
                  {formatPrice(selectedPlan, selectedPlan.originalPrice)} {selectedPlan.period}
                </p>
              )}

              {savingsLabel && (
                <span className="mt-2 inline-block w-fit rounded-full bg-[#fed7aa] px-2.5 py-0.5 font-sans text-xs font-semibold text-black">
                  {savingsLabel}
                </span>
              )}
            </div>

            {/* Divider — max-w-[60%] keeps it in the text column, away from the peeking animal image */}
            <div className="my-6 h-px max-w-[60%] bg-black/[0.07]" />

            {/* Features — identical regardless of the selected period */}
            <ul className="flex max-w-[60%] flex-col gap-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-black/[0.06]"
                    aria-hidden
                  >
                    <CheckIcon />
                  </span>
                  <span className="font-sans text-sm leading-snug text-black/65">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <StoreCTA />
            </div>
          </div>
        </div>

        <p className="mt-4 text-center font-sans text-sm text-black/55">
          All plans include a 7-day free trial · Cancel anytime · Prices in {plans[0].currency}
        </p>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
