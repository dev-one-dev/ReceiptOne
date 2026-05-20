import { useState } from "react";

const STATS = [
  { value: "4.8", label: "Average rating" },
  { value: "150K+", label: "Kilometres tracked" },
  { value: "12K+", label: "Reports generated" },
  { value: "100K+", label: "Receipts scanned" },
  { value: "$4.2M+", label: "Deductions tracked" },
] as const;

export function Numbers() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="w-full px-4 py-6 sm:px-6 md:px-8" aria-label="Key product statistics">
      <div className="mx-auto w-full max-w-[760px]">
        <div
          className="relative overflow-hidden rounded-[32px] bg-card py-4 sm:rounded-[40px] sm:py-5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-card to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-card to-transparent sm:w-20" />

          <div
            className="flex w-max items-center"
            style={{
              animation: "numbers-marquee 14s linear infinite",
              animationPlayState: paused ? "paused" : "running",
              willChange: "transform",
            }}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-8 px-4 sm:gap-12 sm:px-6"
                aria-hidden={copy === 1}
              >
                {STATS.map((stat) => (
                  <Stat key={`${copy}-${stat.label}`} value={stat.value} label={stat.label} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex shrink-0 flex-col items-start">
      <p className="font-display text-xl font-semibold leading-7 tracking-[-0.01em] text-foreground sm:text-[22px] sm:leading-8">
        {value}
      </p>
      <p className="whitespace-nowrap font-display text-xs leading-4 text-muted-foreground sm:text-sm sm:leading-5">
        {label}
      </p>
    </div>
  );
}
