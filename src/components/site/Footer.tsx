import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import footerSvg from "@/assets/figma/footer.svg";
import footerUsSvg from "@/assets/figma/footer-us.svg";

type FooterProps = {
  region?: "ca" | "us";
};

export function Footer({ region = "ca" }: FooterProps) {
  const [topActive, setTopActive] = useState(false);
  const topTimeoutRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const scrollToTop = useCallback(() => {
    setTopActive(true);
    if (topTimeoutRef.current) window.clearTimeout(topTimeoutRef.current);
    topTimeoutRef.current = window.setTimeout(() => setTopActive(false), 800);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    return () => {
      if (topTimeoutRef.current) window.clearTimeout(topTimeoutRef.current);
    };
  }, []);

  const handleSectionMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--fmx", `${x}%`);
    el.style.setProperty("--fmy", `${y}%`);
  };

  const footerAsset = region === "us" ? footerUsSvg : footerSvg;
  const hotspotClassName =
    "group absolute z-10 block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-white transition-transform duration-500 ease-out hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100";

  return (
    <footer
      ref={sectionRef}
      onPointerMove={handleSectionMove}
      className="relative w-full overflow-hidden"
    >
      {/* Animated aurora glow that follows the cursor */}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-70 transition-opacity duration-700"
          style={{
            background:
              "radial-gradient(600px circle at var(--fmx,50%) var(--fmy,40%), rgba(59,130,246,0.18), transparent 60%)",
          }}
        />
      )}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(168,85,247,0.6), rgba(236,72,153,0.6), transparent)",
            backgroundSize: "200% 100%",
            animation: "footer-line 6s linear infinite",
          }}
        />
      )}

      <img
        src={footerAsset}
        alt="Claim your free trial now — ReceiptOne"
        className={`relative z-[1] block h-auto w-full ${
          !reduced ? "animate-[footer-float_9s_ease-in-out_infinite]" : ""
        }`}
      />

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        aria-pressed={topActive}
        className={`group absolute left-[16%] top-[86%] z-10 h-[10%] w-[19%] cursor-pointer overflow-hidden rounded-[20px] transition-all duration-500 ease-out hover:scale-[1.04] hover:shadow-[0_18px_40px_-12px_rgba(59,130,246,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-white motion-reduce:transition-none motion-reduce:hover:scale-100 ${
          topActive ? "scale-[0.98]" : ""
        }`}
      >
        {!reduced && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-[claim-shimmer_1.4s_ease-in-out_infinite]"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
            }}
          />
        )}
        {topActive && !reduced && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-[claim-ripple_800ms_ease-out]"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55), transparent 65%)",
            }}
          />
        )}
      </button>

      <Link
        to="/privacy"
        aria-label="Terms of Use"
        className="absolute left-[42.5%] top-[88.5%] z-10 h-[5%] w-[8%] rounded-md transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:hover:scale-100"
      />

      <Link
        to="/login"
        aria-label="Log in"
        className={`${hotspotClassName} left-[38%] top-[64%] h-[10%] w-[11.5%] overflow-hidden !rounded-[40px] hover:shadow-[0_14px_36px_-12px_rgba(59,130,246,0.5)] ${
          !reduced ? "animate-[claim-glow_3.2s_ease-in-out_infinite]" : ""
        }`}
      >
        {!reduced && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-[claim-shimmer_1.4s_ease-in-out_infinite]"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
            }}
          />
        )}
      </Link>

      <Link
        to="/signup"
        aria-label="Join now"
        className={`${hotspotClassName} left-[50.5%] top-[64%] h-[10%] w-[11.5%] overflow-hidden !rounded-[40px] hover:shadow-[0_14px_36px_-12px_rgba(168,85,247,0.55)] ${
          !reduced ? "animate-[claim-glow_3.2s_ease-in-out_infinite]" : ""
        }`}
        style={{ animationDelay: "1.1s" }}
      >
        {!reduced && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-[claim-shimmer_1.4s_ease-in-out_infinite]"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
            }}
          />
        )}
      </Link>

      <Link
        to="/terms"
        aria-label="Privacy Policy"
        className="absolute left-[51%] top-[88.5%] z-10 h-[5%] w-[9%] rounded-md transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:hover:scale-100"
      />
    </footer>
  );
}
