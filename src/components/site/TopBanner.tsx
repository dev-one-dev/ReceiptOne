import beaverHeroVideo from "@/assets/figma/hero-beaver-hq.mp4";
import beaverHeroPoster from "@/assets/figma/hero-beaver-poster.png";
import eagleHeroVideo from "@/assets/figma/hero-eagle-hq.mp4";
import eagleHeroPoster from "@/assets/figma/hero-eagle-poster.png";
import { StoreBadge } from "@/components/site/StoreBadge";
import { PrimaryCta } from "@/components/site/PrimaryCta";
import { ROUTES } from "@/lib/routes";

export function TopBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const heroVideo = region === "us" ? eagleHeroVideo : beaverHeroVideo;
  const heroPoster = region === "us" ? eagleHeroPoster : beaverHeroPoster;
  return (
    <section className="relative w-full overflow-visible px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* TODO(eyebrow): the hero has no label above the h1. Add
                <p className="eyebrow"> with real copy -- deliberately not
                invented here. */}
            {/* H1 */}
            <h1 className="text-ink">
              {region === "us" ? (
                <>
                  Turn receipts into IRS-ready reports — automatically
                  <span className="text-ember">.</span>
                </>
              ) : (
                <>
                  Turn receipts into CRA-ready reports — automatically
                  <span className="text-ember">.</span>
                </>
              )}
            </h1>

            {/* Subheadline — both paragraphs same size and color */}
            <div className="mt-5 max-w-[500px] font-sans">
              <p className="text-lead text-ink-60 sm:text-lead">
                Snap receipts &amp; mileage, organize expenses, and export audit-ready reports.
              </p>
              <p className="mt-2 text-lead text-ink-60 sm:text-lead">
                {region === "us"
                  ? "Built for US freelancers, contractors, and small businesses."
                  : "Built for Canadian freelancers, contractors, and small businesses."}
              </p>
            </div>

            {/* Web CTA + store badges — one 44px row on desktop (12px gaps),
                stacked with the button first on mobile. PrimaryCta and
                StoreBadge share the same height and radius on purpose. */}
            {/* relative z-10: the mascot video below is 190% wide and later in
                DOM order, so without a stacking context it sat on top of the
                Google Play badge at desktop widths and swallowed its clicks. */}
            <div className="relative z-10 mt-6 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <PrimaryCta href={ROUTES.signup}>Start 7-day free trial</PrimaryCta>
              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {/* Kept for screen readers; visually the badges speak for
                    themselves, and the label pushed the row past the column. */}
                <span className="sr-only">Available on:</span>
                <StoreBadge platform="apple" />
                <StoreBadge platform="google" />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Mascot ── */}
          {/* pointer-events-none: purely decorative, and its oversized video
              overlaps the left column's CTA row on desktop. */}
          <div className="pointer-events-none relative flex items-center justify-center overflow-visible">
            {/* Radial glow */}
            <div
              className="pointer-events-none absolute inset-0 scale-110 rounded-pill bg-ember/[0.08] blur-[80px]"
              aria-hidden
            />
            {/* Ground shadow */}
            <div
              className="pointer-events-none absolute bottom-[3%] left-1/2 h-10 w-4/5 -translate-x-1/2 rounded-pill bg-ink-10 blur-3xl"
              aria-hidden
            />
            {/* Mascot — dominates right side */}
            <video
              style={{ filter: "brightness(1.15) contrast(1.08)" }}
              className="pointer-events-none relative w-[190%] max-w-none object-contain mix-blend-multiply"
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
