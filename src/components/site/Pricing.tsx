import { Check, DollarSign } from "lucide-react";
import beaverWeek from "@/assets/figma/pr-beaver-week.webp";
import beaverMonth from "@/assets/figma/pr-beaver-month.webp";
import beaverYear from "@/assets/figma/pr-beaver-year.webp";

const features = [
  "Mobile & Web Apps with Real-Time Sync",
  "AI-Powered Expense Tracking",
  "Send Receipts via Email",
  "Secure Storage for 10+ Years",
  "Bulk Upload (drag & drop)",
  "Mileage Tracking & Trip Organization",
  "Export Reports (PDF, CSV)",
];

type Plan = {
  name: string;
  desc: string;
  price: string;
  per: string;
  oldPrice: string;
  image: string;
  badge?: { label: string; color: "orange" | "green" };
  ringColor?: string;
};

const plans: Plan[] = [
  {
    name: "Week",
    desc: "Start saving on taxes today — try it risk-free. Test drive for one week.",
    price: "CAD 4.99",
    per: "/week",
    oldPrice: "CAD 6,49 /week",
    image: beaverWeek,
  },
  {
    name: "Month",
    desc: "Track expenses year-round. Flexible monthly plan.",
    price: "CAD 9.99",
    per: "/month",
    oldPrice: "CAD 12,99 /month",
    image: beaverMonth,
    badge: { label: "Most Popular", color: "orange" },
  },
  {
    name: "Year",
    desc: "Best value plan. Save 18% with annual billing.",
    price: "CAD 99.99",
    per: "/year",
    oldPrice: "CAD 129,99 /year",
    image: beaverYear,
    badge: { label: "Save 18%", color: "green" },
    ringColor: "#35ac67",
  },
];

export function Pricing() {
  return (
    <section className="mx-auto w-full max-w-[1100px] px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Pill */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 font-display text-[12px] font-semibold text-white">
          <DollarSign className="h-3.5 w-3.5" strokeWidth={2.5} />
          PRICING
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-5 text-center font-display text-[40px] font-semibold leading-[1] tracking-[-0.02em] text-black md:text-[56px]">
        Start Free.
        <br />
        Save <span className="text-[#fb9130]">Thousands</span>
      </h2>

      {/* Subtitle */}
      <p className="mx-auto mt-4 max-w-[380px] text-center font-display text-[14px] leading-[1.5] text-[#7e8890] md:text-[15px]">
        Built for freelancers, self-employed, and small businesses in the US &
        Canada
      </p>

      {/* What's included */}
      <h3 className="mt-14 text-center font-display text-[18px] font-semibold text-black">
        What's included in your subscription
      </h3>
      <ul className="mx-auto mt-5 grid max-w-[640px] grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 font-display text-[13px] text-black/80"
          >
            <Check
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#35ac67]"
              strokeWidth={2.5}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Plans */}
      <div className="mx-auto mt-12 grid max-w-[720px] grid-cols-1 gap-5 px-1 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((p) => (
          <PlanCard key={p.name} plan={p} />
        ))}
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const ringStyle = plan.ringColor
    ? { boxShadow: `inset 0 0 0 1.5px ${plan.ringColor}` }
    : undefined;

  return (
    <article
      className="relative flex h-[440px] flex-col rounded-[24px] bg-white"
      style={ringStyle}
    >
      {/* Badge */}
      {plan.badge && (
        <span
          className={`absolute -top-2.5 left-4 z-10 inline-flex items-center rounded-full px-2.5 py-1 font-display text-[10px] font-semibold leading-none text-white ${
            plan.badge.color === "orange" ? "bg-[#fb9130]" : "bg-[#35ac67]"
          }`}
        >
          {plan.badge.label}
        </span>
      )}

      <div className="px-5 pt-6 pb-4">
        <h3 className="font-display text-[22px] font-semibold leading-[26px] tracking-[-0.02em] text-black">
          {plan.name}
        </h3>
        <p className="mt-1.5 min-h-[36px] font-display text-[12px] leading-[1.45] text-[#7e8890]">
          {plan.desc}
        </p>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-black">
            {plan.price}
          </span>
          <span className="font-display text-[12px] text-[#7e8890]">
            {plan.per}
          </span>
        </div>
        <div className="mt-1 font-display text-[11px] text-[#9192a1] line-through">
          {plan.oldPrice}
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-full bg-black py-2.5 font-display text-[13px] font-semibold text-white transition hover:bg-black/85"
        >
          Subscribe
        </button>
      </div>

      {/* Beaver */}
      <div className="relative mt-auto flex h-[200px] items-end justify-center overflow-hidden rounded-b-[24px]">
        <img
          src={plan.image}
          alt={`${plan.name} plan beaver`}
          loading="lazy"
          className="block h-[230px] w-auto max-w-none select-none object-contain object-bottom"
          draggable={false}
        />
      </div>
    </article>
  );
}
