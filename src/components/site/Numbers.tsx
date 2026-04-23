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
    <section className="w-full px-8 py-10" aria-label="Key product statistics">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="group relative overflow-hidden rounded-[70px] bg-white px-10 py-[42px]">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

          <div className="flex w-max items-center gap-20 motion-safe:animate-[numbers-marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-20"
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

      <style>{`
        @keyframes numbers-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-50% - 2.5rem)); }
        }
      `}</style>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex shrink-0 flex-col items-start whitespace-nowrap">
      <p className="font-display text-[32px] font-semibold leading-8 tracking-[-0.01em] text-black">
        {value}
      </p>
      <p className="font-display text-base leading-6 text-[#7e8890]">{label}</p>
    </div>
  );
}
