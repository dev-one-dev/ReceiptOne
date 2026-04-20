import beaverReceipt from "@/assets/figma/beaver-receipt.png";

/**
 * TopBanner — pixel-mapped from Figma node 29:26474
 * Centered hero: H1 (Inter Tight 64/64, -1 tracking), subhead, CTA, beaver hero image,
 * decorative dashed loop + script caption "7 days free trial available",
 * social-proof avatar stack at the bottom.
 */
export function TopBanner() {
  return (
    <section className="relative w-full px-8 pt-[120px]">
      <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center gap-12">
        {/* Headline + sub + CTA */}
        <div className="relative flex w-full flex-col items-center gap-4">
          <h1 className="text-center font-display text-[64px] font-semibold leading-[64px] tracking-[-0.01em] text-black">
            Track expenses, store receipts, and generate tax-ready reports –
            all in one place
          </h1>

          <p className="w-[402px] max-w-full text-center font-display text-[20px] leading-7 tracking-[-0.02em] text-[#9192a1]">
            Built for freelancers, self-employed, and small businesses in
            Canada
          </p>

          {/* Decorative dashed loop + script caption — absolute, pinned to the left of the CTA */}
          <DashedLoop className="pointer-events-none absolute left-1/2 top-[160px] hidden -translate-x-[340px] md:block" />
          <p className="pointer-events-none absolute left-1/2 top-[230px] hidden w-[160px] -translate-x-[395px] -rotate-[6deg] text-center font-script text-[20px] leading-5 tracking-[-0.02em] text-[#9192a1] md:block">
            7 days free trial available
          </p>

          <button
            type="button"
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-black px-12 py-[18px] font-display text-base font-semibold leading-5 text-white transition-opacity hover:opacity-90"
          >
            Claim your free trial
          </button>
        </div>

        {/* Hero image (beaver) */}
        <div className="relative w-full">
          <img
            src={beaverReceipt}
            alt="Beaver mascot reading a paper receipt"
            className="mx-auto block w-full max-w-[640px] mix-blend-darken"
            loading="eager"
          />
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-[9px]">
          <div className="flex items-center pr-6">
            <Avatar gradient="from-amber-200 to-orange-400" initial="J" />
            <Avatar gradient="from-rose-200 to-rose-400" initial="M" offset />
            <Avatar gradient="from-sky-200 to-sky-400" initial="A" offset />
            <Avatar gradient="from-emerald-200 to-emerald-400" initial="L" offset />
          </div>
          <div className="flex w-36 flex-col">
            <span className="font-display text-base font-semibold leading-5 text-black">
              More 3.000 users
            </span>
            <span className="font-display text-base leading-6 text-[#9192a1]">
              keeping their money
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Helpers --- */

function Avatar({
  gradient,
  initial,
  offset = false,
}: {
  gradient: string;
  initial: string;
  offset?: boolean;
}) {
  return (
    <div
      className={`relative size-12 overflow-hidden rounded-full border-[3px] border-white bg-gradient-to-br ${gradient} ${
        offset ? "-ml-6" : ""
      }`}
    >
      <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-semibold text-white/90">
        {initial}
      </span>
    </div>
  );
}

function DashedLoop({ className }: { className?: string }) {
  // Hand-drawn-ish open loop pointing toward the CTA
  return (
    <svg
      viewBox="0 0 220 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={220}
      height={140}
      aria-hidden="true"
    >
      <path
        d="M210 130 C 110 150, 10 110, 30 60 C 45 20, 110 10, 130 50 C 145 80, 110 100, 80 80"
        stroke="#9192a1"
        strokeWidth="1.2"
        strokeDasharray="4 5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
