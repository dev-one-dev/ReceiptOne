/**
 * Numbers — pixel-mapped from Figma node 29:26475
 * Seamless horizontal marquee inside a white pill banner.
 * Pure CSS animation — no JS, respects prefers-reduced-motion.
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
    <section className="w-full px-8 py-20">
      <div className="mx-auto w-full max-w-[1240px] overflow-hidden rounded-[32px] bg-white py-[42px]">
        <div
          className="flex w-max items-center gap-16 motion-safe:animate-[marquee_40s_linear_infinite]"
          aria-label="Key product statistics"
        >
          {/* Two copies for seamless loop */}
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-16" aria-hidden={copy === 1}>
              {STATS.map((s) => (
                <Stat key={`${copy}-${s.label}`} value={s.value} label={s.label} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Marquee keyframes — scoped via style tag to keep zero-config */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex w-[160px] shrink-0 flex-col items-start">
      <p className="font-display text-[32px] font-semibold leading-8 tracking-[-0.01em] text-black">
        {value}
      </p>
      <p className="font-display text-base leading-6 text-[#7e8890]">{label}</p>
    </div>
  );
}
