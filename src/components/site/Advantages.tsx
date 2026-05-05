import { useEffect, useRef, useState } from "react";
import advantagesSvg from "@/assets/figma/advantages.svg";

/** Tile rectangles in the SVG viewBox (1440×1056) */
const TILES = [
  { x: 240, y: 304, w: 304, h: 260, label: "Save 10+ hours every month" },
  { x: 568, y: 304, w: 304, h: 260, label: "Never miss a mileage deduction" },
  { x: 896, y: 304, w: 304, h: 260, label: "Accountant-ready reports in one click" },
  { x: 404, y: 596, w: 304, h: 260, label: "Documentation ready for any audit" },
  { x: 732, y: 596, w: 304, h: 260, label: "Mobile and web stay perfectly in sync" },
] as const;

const VB_W = 1440;
const VB_H = 1056;

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

function AdvantageTile({ tile }: { tile: (typeof TILES)[number] }) {
  return (
    <div
      aria-label={tile.label}
      className="absolute rounded-[32px]"
      style={{
        left: `${(tile.x / VB_W) * 100}%`,
        top: `${(tile.y / VB_H) * 100}%`,
        width: `${(tile.w / VB_W) * 100}%`,
        height: `${(tile.h / VB_H) * 100}%`,
      }}
    />
  );
}

export function Advantages() {
  const { hasFinePointer, prefersReducedMotion } = useMotionCapabilities();
  const [claimActive, setClaimActive] = useState(false);
  const claimTimeoutRef = useRef<number | null>(null);

  const handleClaim = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setClaimActive(true);
    if (claimTimeoutRef.current) window.clearTimeout(claimTimeoutRef.current);
    claimTimeoutRef.current = window.setTimeout(() => setClaimActive(false), 800);
    const el = document.getElementById("apps");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClaimMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!hasFinePointer || prefersReducedMotion) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--cmx", `${x}%`);
    el.style.setProperty("--cmy", `${y}%`);
  };

  useEffect(() => {
    return () => {
      if (claimTimeoutRef.current) window.clearTimeout(claimTimeoutRef.current);
    };
  }, []);

  return (
    <section id="benefits" className="w-full scroll-mt-28">
      <div className="relative w-full" style={{ aspectRatio: "1440 / 1056", perspective: "1400px" }}>
        <img
          src={advantagesSvg}
          alt="What is our advantages — Save 10+ hours, never miss mileage deductions, accountant-ready reports, documentation ready, mobile + web in sync"
          className="pointer-events-none block h-full w-full"
          loading="lazy"
          decoding="async"
        />

        {TILES.map((tile) => (
          <AdvantageTile key={tile.label} tile={tile} />
        ))}

        <a
          href="#apps"
          onClick={handleClaim}
          onPointerMove={handleClaimMove}
          aria-label="Claim your free trial"
          className={`group absolute overflow-hidden rounded-[16px] transition-all duration-500 ease-out hover:scale-[1.04] hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-4 focus-visible:ring-offset-white motion-reduce:transition-none motion-reduce:hover:scale-100 ${
            !prefersReducedMotion ? "animate-[claim-glow_2.8s_ease-in-out_infinite]" : ""
          } ${claimActive ? "scale-[0.98]" : ""}`}
          style={{
            left: `${(602.5 / 1440) * 100}%`,
            top: `${(920 / 1056) * 100}%`,
            width: `${(240 / 1440) * 100}%`,
            height: `${(56 / 1056) * 100}%`,
          }}
        >
          {/* Shimmer sweep on hover */}
          {!prefersReducedMotion && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-[claim-shimmer_1.4s_ease-in-out_infinite]"
              style={{
                background:
                  "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
              }}
            />
          )}
          {/* Cursor-following spotlight */}
          {hasFinePointer && !prefersReducedMotion && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(180px circle at var(--cmx,50%) var(--cmy,50%), rgba(255,255,255,0.45), transparent 60%)",
              }}
            />
          )}
          {/* Click ripple */}
          {claimActive && !prefersReducedMotion && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-[claim-ripple_800ms_ease-out]"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55), transparent 65%)",
              }}
            />
          )}
        </a>
      </div>
    </section>
  );
}
