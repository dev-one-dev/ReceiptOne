/**
 * Numbers — static white pill with a seamless marquee of stats inside.
 * Only the text track moves; the pill itself stays put.
 * Pauses on hover; respects prefers-reduced-motion.
 */

const STATS = [
  { value: "4.8", label: "Average rating" },
  { value: "150K+", label: "Miles tracked" },
  { value: "12K+", label: "Reports generated" },
  { value: "100K+", label: "Receipts scanned" },
  { value: "10K+", label: "Active users" },
] as const;

export function Numbers() {
  return (
    <section className="w-full px-4 py-10 sm:px-6 md:px-8" aria-label="Key product statistics">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="numbers-pill relative overflow-hidden rounded-[40px] bg-white py-8 sm:rounded-[52px] sm:py-10 md:py-[42px]">
          {/* Edge fades — mask cut-off text */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20" />

          <div className="numbers-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="numbers-group"
                aria-hidden={copy === 1}
              >
                {STATS.map((s) => (
                  <Stat key={`${copy}-${s.label}`} value={s.value} label={s.label} />
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
    <div className="flex shrink-0 flex-col items-start whitespace-nowrap">
      <p className="font-display text-2xl font-semibold leading-8 tracking-[-0.01em] text-foreground sm:text-[28px] md:text-[32px]">
        {value}
      </p>
      <p className="font-display text-sm leading-6 text-muted-foreground md:text-base">{label}</p>
    </div>
  );
}
