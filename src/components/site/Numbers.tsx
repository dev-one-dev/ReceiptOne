import { useState } from "react";

const STATS = [
  { value: "4.8", label: "Average rating" },
  { value: "150K+", label: "Miles tracked" },
  { value: "12K+", label: "Reports generated" },
  { value: "100K+", label: "Receipts scanned" },
  { value: "10K+", label: "Active users" },
] as const;

export function Numbers() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="w-full px-4 py-10 sm:px-6 md:px-8" aria-label="Key product statistics">
      <div className="mx-auto w-full max-w-[1240px]">
        <div
          className="relative overflow-hidden rounded-[40px] bg-card py-8 sm:rounded-[52px] sm:py-10 md:py-[42px]"
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
                className="flex shrink-0 items-center gap-8 px-4 sm:gap-12 sm:px-6 md:gap-16 md:px-8"
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

      <style>{`
        @keyframes numbers-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-[120px] shrink-0 flex-col items-start sm:min-w-[136px] md:min-w-[156px]">
      <p className="font-display text-2xl font-semibold leading-8 tracking-[-0.01em] text-foreground sm:text-[28px] md:text-[32px]">
        {value}
      </p>
      <p className="max-w-[12ch] text-pretty font-display text-sm leading-5 text-muted-foreground md:text-base md:leading-6">
        {label}
      </p>
    </div>
  );
}
