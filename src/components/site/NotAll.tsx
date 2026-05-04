import { useEffect, useRef, useState } from "react";
import notAllCa from "@/assets/figma/not-all-ca.svg";
import { useReplayOnVisible } from "@/hooks/use-replay-on-visible";

/**
 * The CA "And this is not all" section uses a single composite SVG containing
 * all 6 cards. To match the /us interactions exactly, we overlay a 2x3 grid
 * of invisible tile hotspots (same magnetic tilt + spotlight + pulse as
 * NotAllUS) on top of the SVG, and we cover the two baked-in divider lines
 * (between text and beaver) with thin white strips.
 */

const tiles = [
  // Row 1
  "Build expense reports that make you look pro",
  "Earn more from every kilometer you drive",
  "Turn your home office into real deductions",
  // Row 2
  "Turn organized receipts into audit-ready reports",
  "Invite your accountant for max efficiency",
  "Plug ReceiptOne into your workflow",
];

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

  const tiltStyle =
    hasFinePointer && !prefersReducedMotion
      ? {
          transform:
            "perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0)",
          transformStyle: "preserve-3d" as const,
        }
      : undefined;

  const floatClass =
    !hasFinePointer && !prefersReducedMotion
      ? "animate-[notall-float_6s_ease-in-out_infinite]"
      : "";

  return (
    <button
      type="button"
      data-reveal
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

export function NotAll() {
  const { hasFinePointer, prefersReducedMotion } = useMotionCapabilities();
  const [rowRef, rowKey] = useReplayOnVisible<HTMLDivElement>(0.2);

  // Card region within the 1440x1325 SVG (cards start ~y=172, end ~y=1232).
  // Two rows of cards with a gap roughly at y≈760-820. We render the SVG
  // as background and overlay a 2x3 grid aligned to that region.
  const cardsTopPct = 172 / 1325; // ≈ 12.98%
  const cardsBottomPct = 1 - 1232 / 1325; // ≈ 7.02%
  const cardsLeftPct = 240 / 1440; // ≈ 16.67%
  const cardsRightPct = 1 - 1200 / 1440; // ≈ 16.67%

  return (
    <section className="mx-auto w-full max-w-[1440px] px-3 pt-0 pb-20 sm:px-6 sm:pt-2 sm:pb-[132px]">
      <div
        ref={rowRef}
        key={rowKey}
        className="notall-row is-visible relative"
        style={{ perspective: "1200px" }}
      >
        <img
          src={notAllCa}
          alt="And this is not all — six ReceiptOne benefit cards for Canadian users"
          className="pointer-events-none block h-auto w-full select-none"
          draggable={false}
        />
        {/* Cover the baked-in divider lines between text and beaver in each row */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0"
          style={{ top: `${(454 / 1325) * 100}%`, height: "0.4%", background: "#ffffff" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0"
          style={{ top: `${(1046 / 1325) * 100}%`, height: "0.4%", background: "#ffffff" }}
        />
        {/* 2x3 grid of hotspots overlayed on top of the SVG */}
        <div
          className="pointer-events-none absolute grid grid-cols-3 grid-rows-2 gap-x-[2.5%] gap-y-[2%]"
          style={{
            top: `${cardsTopPct * 100}%`,
            bottom: `${cardsBottomPct * 100}%`,
            left: `${cardsLeftPct * 100}%`,
            right: `${cardsRightPct * 100}%`,
          }}
        >
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
    </section>
  );
}