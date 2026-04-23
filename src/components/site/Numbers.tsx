/**
 * Numbers — Figma SVG rendered as a seamless horizontal marquee.
 * Pauses on hover, respects prefers-reduced-motion.
 */
import numbersSvg from "@/assets/figma/numbers.svg";

export function Numbers() {
  return (
    <section className="w-full overflow-hidden py-6" aria-label="Key product statistics">
      <div
        className="group flex w-max items-center gap-8 motion-safe:animate-[numbers-marquee_45s_linear_infinite] [animation-play-state:running] hover:[animation-play-state:paused]"
      >
        {[0, 1].map((copy) => (
          <img
            key={copy}
            src={numbersSvg}
            alt={copy === 0 ? "Key product statistics" : ""}
            aria-hidden={copy === 1}
            className="block h-auto w-[1440px] max-w-none shrink-0"
            draggable={false}
          />
        ))}
      </div>

      <style>{`
        @keyframes numbers-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-1440px - 2rem)); }
        }
      `}</style>
    </section>
  );
}
