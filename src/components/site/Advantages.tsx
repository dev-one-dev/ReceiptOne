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

function AdvantageTile({
  tile,
  index,
  hasFinePointer,
  prefersReducedMotion,
}: {
  tile: (typeof TILES)[number];
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
    const rx = ((y - 50) / 50) * -5;
    const ry = ((x - 50) / 50) * 5;
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
      role="button"
      aria-label={tile.label}
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
      className={`group absolute cursor-pointer rounded-[32px] bg-transparent p-0 text-left transition-[transform,box-shadow] duration-500 ease-out hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-4 focus-visible:ring-offset-white motion-reduce:transition-none ${
        active ? "shadow-[0_24px_60px_-18px_rgba(59,130,246,0.45)]" : ""
      } ${floatClass}`}
      style={{
        left: `${(tile.x / VB_W) * 100}%`,
        top: `${(tile.y / VB_H) * 100}%`,
        width: `${(tile.w / VB_W) * 100}%`,
        height: `${(tile.h / VB_H) * 100}%`,
        ...tiltStyle,
        transitionDelay: `${index * 80}ms`,
        animationDelay: floatClass ? `${index * 350}ms` : undefined,
      }}
    >
      {hasFinePointer && !prefersReducedMotion && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[32px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(59,130,246,0.18), transparent 60%)",
          }}
        />
      )}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-[32px] transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 ${
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
          className="pointer-events-none absolute inset-0 rounded-[32px] animate-[notall-pulse_700ms_ease-out]"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.22), transparent 65%)",
          }}
        />
      )}
    </button>
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
        />

        {TILES.map((tile, i) => (
          <AdvantageTile
            key={tile.label}
            tile={tile}
            index={i}
            hasFinePointer={hasFinePointer}
            prefersReducedMotion={prefersReducedMotion}
          />
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
