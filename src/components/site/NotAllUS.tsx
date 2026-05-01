import { useEffect, useRef, useState } from "react";
import testimonialRowUs from "@/assets/figma/testimonial-row-us.svg";
import testimonialRowUs2 from "@/assets/figma/testimonial-row-us-2.svg";

/**
 * Each SVG row contains 3 cards baked together. We overlay 3 invisible "tile"
 * hotspots above each row so every card gets its own modern micro-interaction:
 *   - magnetic tilt that follows the cursor
 *   - radial spotlight glow that tracks the pointer
 *   - lift + soft shadow on hover
 *   - staggered reveal-on-scroll
 */

const rowOneTiles = [
  "Build expense reports that make you look pro",
  "Earn more from every mile you drive",
  "Turn your home office into real deductions",
];
const rowTwoTiles = [
  "Turn organized receipts into audit-ready reports",
  "Invite your accountant for max efficiency",
  "Plug ReceiptOne into your workflow",
];

/**
 * Detect environment capabilities once per mount.
 *  - hasFinePointer: enables 3D tilt + spotlight (mouse users only)
 *  - prefersReducedMotion: disables tilt/float/spotlight, keeps a static fade
 */
function useMotionCapabilities() {
  const [caps, setCaps] = useState({ hasFinePointer: false, prefersReducedMotion: false });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setCaps({ hasFinePointer: fine.matches, prefersReducedMotion: reduce.matches });
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);
  return caps;
}

function Tile({
  label,
  index,
  hasFinePointer,
  prefersReducedMotion,
}: {
  label: string;
  index: number;
  hasFinePointer: boolean;
  prefersReducedMotion: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!hasFinePointer || prefersReducedMotion) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const rx = ((y - 50) / 50) * -4;
    const ry = ((x - 50) / 50) * 4;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  };

  const handleLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!hasFinePointer || prefersReducedMotion) return;
    const el = e.currentTarget;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  const triggerActive = () => {
    setActive(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setActive(false), 700);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  // Conditional class composition for capabilities
  const tiltStyle =
    hasFinePointer && !prefersReducedMotion
      ? {
          transform:
            "perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0)",
          transformStyle: "preserve-3d" as const,
        }
      : undefined;

  // Coarse-pointer (mobile/tablet): subtle floating animation, staggered
  const floatClass =
    !hasFinePointer && !prefersReducedMotion
      ? "animate-[notall-float_6s_ease-in-out_infinite]"
      : "";

  return (
    <button
      ref={ref}
      type="button"
      data-reveal
      role="button"
      aria-label={label}
      aria-pressed={active}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={triggerActive}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          triggerActive();
        }
      }}
      className={`group pointer-events-auto relative cursor-pointer rounded-[28px] bg-transparent text-left transition-[transform,box-shadow] duration-500 ease-out hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-4 focus-visible:ring-offset-white motion-reduce:transition-none ${
        active ? "shadow-[0_24px_60px_-18px_rgba(59,130,246,0.45)]" : ""
      } ${floatClass}`}
      style={{
        ...tiltStyle,
        transitionDelay: `${index * 60}ms`,
        animationDelay: floatClass ? `${index * 350}ms` : undefined,
      }}
    >
      {/* Spotlight glow — fine pointer only, suppressed when reduced motion */}
      {hasFinePointer && !prefersReducedMotion && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(280px circle at var(--mx,50%) var(--my,50%), rgba(59,130,246,0.18), transparent 60%)",
          }}
        />
      )}

      {/* Gradient border — appears on hover, on focus, and on active click */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[28px] transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        style={{
          padding: "1px",
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.55), rgba(168,85,247,0.45), rgba(236,72,153,0.4))",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Active click ripple/pulse */}
      {active && !prefersReducedMotion && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[28px] animate-[notall-pulse_700ms_ease-out]"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.22), transparent 65%)",
          }}
        />
      )}
    </button>
  );
}

function TileRow({ src, alt, tiles }: { src: string; alt: string; tiles: string[] }) {
  const { hasFinePointer, prefersReducedMotion } = useMotionCapabilities();

  return (
    <div
      className="relative grid grid-cols-3 gap-2"
      style={{ perspective: "1200px" }}
      role="group"
      aria-label={alt}
    >
      <img
        src={src}
        alt={alt}
        className="pointer-events-none col-span-3 block h-auto w-full"
      />
      {/* Per-card hotspots overlayed on top of the SVG */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-[2.5%] px-[1%]">
        {tiles.map((label, i) => (
          <Tile
            key={label}
            label={label}
            index={i}
            hasFinePointer={hasFinePointer}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

export function NotAllUS() {
  return (
    <section className="mx-auto w-full max-w-[960px] px-4 pt-12 pb-20 sm:px-6 sm:pt-[78px] sm:pb-[132px]">
      <div className="mb-10 flex items-center gap-4 sm:mb-[78px]">
        <div className="h-px flex-1 bg-black/15" />
        <h2 className="font-display text-[15px] font-medium tracking-wide text-[#7e8890]">
          And this is not all
        </h2>
        <div className="h-px flex-1 bg-black/15" />
      </div>

      <TileRow
        src={testimonialRowUs}
        alt="Build expense reports, earn more from every mile you drive, turn your home office into real deductions"
        tiles={rowOneTiles}
      />

      <div className="mt-[60px]">
        <TileRow
          src={testimonialRowUs2}
          alt="Turn organized receipts into audit-ready reports, invite your accountant, plug ReceiptOne into your workflow"
          tiles={rowTwoTiles}
        />
      </div>
    </section>
  );
}