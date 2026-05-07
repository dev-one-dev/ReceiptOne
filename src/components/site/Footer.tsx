import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import footerSvg from "@/assets/figma/footer.webp";
import footerUsSvg from "@/assets/figma/footer-us.webp";
import { ROUTES } from "@/lib/routes";

type FooterProps = {
  region?: "ca" | "us";
};

export function Footer({ region = "ca" }: FooterProps) {
  const [topActive, setTopActive] = useState(false);
  const topTimeoutRef = useRef<number | null>(null);
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

const footerAsset = region === "us" ? footerUsSvg : footerSvg;
  const hotspotClassName =
    "absolute z-10 block rounded-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-white";

  return (
    <footer className="relative w-full overflow-hidden">
      <img
        src={footerAsset}
        alt="Claim your free trial now — ReceiptOne"
        className="relative z-[1] block h-auto w-full"
        loading="lazy"
        decoding="async"
        width={1440}
        height={772}
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
        to={ROUTES.terms}
        aria-label="Terms of Use"
        className="absolute left-[42.5%] top-[88.5%] z-10 h-[5%] w-[8%] rounded-md transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:hover:scale-100"
      />

      <Link
        to={ROUTES.login}
        aria-label="Log in"
        className={`${hotspotClassName} left-[38%] top-[64%] h-[10%] w-[11.5%]`}
      />

      <Link
        to={ROUTES.signup}
        aria-label="Join now"
        className={`${hotspotClassName} left-[50.5%] top-[64%] h-[10%] w-[11.5%]`}
      />

      <Link
        to={ROUTES.privacy}
        aria-label="Privacy Policy"
        className="absolute left-[51%] top-[88.5%] z-10 h-[5%] w-[9%] rounded-md transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:hover:scale-100"
      />
    </footer>
  );
}
