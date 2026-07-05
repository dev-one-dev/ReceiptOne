import { useLayoutEffect, useState } from "react";
import caWeeklyImg from "@/assets/figma/mileage-auto/Graphic-Small.webp";
import caMonthlyImg from "@/assets/figma/mileage-auto/Graphic-Small2.webp";
import caAnnualImg from "@/assets/figma/mileage-auto/Graphic-Small3.webp";
import usWeeklyImg from "@/assets/figma/mileage-auto/US/2.webp";
import usMonthlyImg from "@/assets/figma/mileage-auto/US/3-removebg-preview.webp";
import usAnnualImg from "@/assets/figma/mileage-auto/US/1.webp";

const APP_STORE_URL = "https://apps.apple.com/us/app/receiptone-expense-tracker/id6755740822";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.appfyl.checkapp&pli=1";

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

  if (platform === "ios") {
    return (
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download ReceiptOne on the App Store"
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/12 bg-black px-3.5 font-display text-white transition-opacity hover:opacity-80"
      >
        <AppleGlyph className="h-[18px] w-[18px] shrink-0" />
        <span className="flex flex-col items-start">
          <span className="text-[9px] font-normal leading-none text-white/60">Download on the</span>
          <span className="text-[12px] font-semibold leading-tight">App Store</span>
        </span>
      </a>
    );
  }

  if (platform === "android") {
    return (
      <a
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get ReceiptOne on Google Play"
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/12 bg-white px-3.5 font-display text-black shadow-sm transition-opacity hover:opacity-80"
      >
        <GooglePlayMark className="h-[18px] w-[18px] shrink-0" />
        <span className="flex flex-col items-start">
          <span className="text-[9px] font-normal leading-none text-black/60">GET IT ON</span>
          <span className="text-[12px] font-semibold leading-tight">Google Play</span>
        </span>
      </a>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download ReceiptOne on the App Store"
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/12 bg-black px-3.5 font-display text-white transition-opacity hover:opacity-80"
      >
        <AppleGlyph className="h-[18px] w-[18px] shrink-0" />
        <span className="flex flex-col items-start">
          <span className="text-[9px] font-normal leading-none text-white/60">Download on the</span>
          <span className="text-[12px] font-semibold leading-tight">App Store</span>
        </span>
      </a>
      <a
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get ReceiptOne on Google Play"
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/12 bg-white px-3.5 font-display text-black shadow-sm transition-opacity hover:opacity-80"
      >
        <GooglePlayMark className="h-[18px] w-[18px] shrink-0" />
        <span className="flex flex-col items-start">
          <span className="text-[9px] font-normal leading-none text-black/60">GET IT ON</span>
          <span className="text-[12px] font-semibold leading-tight">Google Play</span>
        </span>
      </a>
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
        <span className="absolute top-0 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[#c2410c] px-4 py-1 font-sans text-xs font-semibold text-white shadow-[0_4px_12px_rgba(249,115,22,0.4)]">
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

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 29.4 32" fill="none" aria-hidden>
      <path fill="#00D9FF" d="M13.3 15.1 1.1 2.9C.4 3.6 0 4.6 0 5.7v20.7c0 1 .4 2 1.1 2.7l12.2-12.2v-.8Z" />
      <path fill="#FFD23D" d="m27.5 13.8-5.1-3L14.3 15v2l8.1 4.7 5.1-3c1.6-.9 1.6-3.1 0-4Z" />
      <path fill="#FF3A44" d="M14.3 17v2L2.1 31.2c.7.7 1.7 1.1 2.8 1.1.6 0 1.2-.1 1.7-.4l12.2-7V17h-4.5Z" />
      <path fill="#00F076" d="M14.3 15 4.8.8C4.3.4 3.7.2 3.1.2 2 .2 1 .6.3 1.3L14.3 15Z" />
    </svg>
  );
}
