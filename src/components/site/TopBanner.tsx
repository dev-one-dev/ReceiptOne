import beaverHeroVideo from "@/assets/figma/hero-beaver-hq.mp4";
import beaverHeroPoster from "@/assets/figma/hero-beaver-poster.png";
import eagleHeroVideo from "@/assets/figma/hero-eagle-hq.mp4";
import eagleHeroPoster from "@/assets/figma/hero-eagle-poster.png";
import { StoreBadge } from "@/components/site/StoreBadge";

export function TopBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const heroVideo = region === "us" ? eagleHeroVideo : beaverHeroVideo;
  const heroPoster = region === "us" ? eagleHeroPoster : beaverHeroPoster;
  return (
    <section className="relative w-full overflow-visible px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* H1 */}
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.06] tracking-tight text-black">
              {region === "us" ? (
                <>
                  Turn receipts into IRS-ready reports — automatically
                  <span className="text-[#f97316]">.</span>
                </>
              ) : (
                <>
                  Turn receipts into CRA-ready reports — automatically
                  <span className="text-[#f97316]">.</span>
                </>
              )}
            </h1>

            {/* Subheadline — both paragraphs same size and color */}
            <div className="mt-5 max-w-[500px] font-sans">
              <p className="text-lg leading-relaxed text-black/55 sm:text-xl">
                Snap receipts &amp; mileage, organize expenses, and export audit-ready reports.
              </p>
              <p className="mt-2 text-lg leading-relaxed text-black/55 sm:text-xl">
                {region === "us"
                  ? "Built for US freelancers, contractors, and small businesses."
                  : "Built for Canadian freelancers, contractors, and small businesses."}
              </p>
            </div>

            {/* Store badges — single horizontal line */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="font-sans text-sm text-black/55">Available on:</span>
              <StoreBadge platform="apple" />
              <StoreBadge platform="google" />
            </div>
          </div>

          {/* ── RIGHT COLUMN — Mascot ── */}
          <div className="relative flex items-center justify-center overflow-visible">
            {/* Radial glow */}
            <div
              className="pointer-events-none absolute inset-0 scale-110 rounded-full bg-[#f97316]/[0.08] blur-[80px]"
              aria-hidden
            />
            {/* Ground shadow */}
            <div
              className="pointer-events-none absolute bottom-[3%] left-1/2 h-10 w-4/5 -translate-x-1/2 rounded-full bg-black/[0.13] blur-3xl"
              aria-hidden
            />
            {/* Mascot — dominates right side */}
            <video
              style={{ filter: "brightness(1.15) contrast(1.08)" }}
              className="relative w-[190%] max-w-none object-contain mix-blend-multiply"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={heroPoster}
              aria-label={
                region === "us"
                  ? "Eagle mascot wearing a USA cap, reading a receipt"
                  : "Beaver mascot wearing a Canadian cap, reading a receipt"
              }
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
