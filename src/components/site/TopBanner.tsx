import beaverHeroVideo from "@/assets/figma/hero-beaver-hq.mp4";
import beaverHeroPoster from "@/assets/figma/hero-beaver-poster.png";
import avatar1 from "@/assets/figma/avatar-1.webp";
import avatar2 from "@/assets/figma/avatar-2.webp";
import avatar3 from "@/assets/figma/avatar-3.webp";
import avatar4 from "@/assets/figma/avatar-4.webp";
import rightArrowSrc from "@/assets/figma/rightarrow.svg";
import trialOfferSrc from "@/assets/figma/topbanner-trial-ca.svg";
import { Avatar } from "@/components/site/TopBannerShared";
import { ArrowRight } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/app/receiptone/id0000000000";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.receiptone.app";

const STATS = [
  { value: "4.8", label: "Average rating" },
  { value: "150K+", label: "Kilometres tracked" },
  { value: "12K+", label: "Reports generated" },
  { value: "100K+", label: "Receipts scanned" },
  { value: "$4.2M+", label: "Deductions tracked" },
];

function scrollToPricing(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function TopBanner() {
  return (
    <section className="relative w-full overflow-visible px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* H1 */}
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.06] tracking-tight text-black">
              Turn receipts into CRA-ready reports — automatically<span className="text-[#f97316]">.</span>
            </h1>

            {/* Subheadline — both paragraphs same size and color */}
            <div className="mt-5 max-w-[500px] font-sans">
              <p className="text-lg leading-relaxed text-black/55 sm:text-xl">
                Snap receipts &amp; mileage, organize expenses, and export audit-ready reports.
              </p>
              <p className="mt-2 text-lg leading-relaxed text-black/55 sm:text-xl">
                Built for Canadian freelancers, contractors, and small businesses.
              </p>
            </div>

            {/* CTA — black */}
            <div className="relative mt-8 inline-block">
              <a
                href="#pricing"
                onClick={scrollToPricing}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 font-display text-base font-semibold text-white shadow-[0_8px_28px_rgba(0,0,0,0.18)] transition-all hover:scale-[1.02] hover:opacity-90"
              >
                Claim your free trial
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>

              {/* Dashed arrow curving right from button to trial-offer label — desktop only */}
              <img
                src={rightArrowSrc}
                alt=""
                aria-hidden
                draggable={false}
                className="pointer-events-none absolute hidden select-none lg:block"
                style={{
                  width: 260,
                  left: "calc(100% + 6px)",
                  top: "50%",
                  transform: "translateY(-98%)",
                }}
              />
              <img
                src={trialOfferSrc}
                alt="7-day free trial"
                draggable={false}
                className="pointer-events-none absolute hidden select-none lg:block"
                style={{
                  width: 130,
                  left: "calc(100% + 264px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>

            {/* Store badges — single horizontal line */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="font-sans text-sm text-black/55">Available on:</span>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download ReceiptOne on the App Store"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/12 bg-black px-3.5 font-display text-white transition-opacity hover:opacity-80"
              >
                <AppleGlyph className="h-[18px] w-[18px] shrink-0" />
                <span className="flex flex-col items-start">
                  <span className="text-[8px] font-normal leading-none text-white/60">Download on the</span>
                  <span className="text-[12px] font-semibold leading-tight">App Store</span>
                </span>
              </a>
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get ReceiptOne on Google Play"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/12 bg-white px-3.5 font-display text-black shadow-sm transition-opacity hover:opacity-80"
              >
                <GooglePlayMark className="h-[18px] w-[18px] shrink-0" />
                <span className="flex flex-col items-start">
                  <span className="text-[8px] font-normal leading-none text-black/50">GET IT ON</span>
                  <span className="text-[12px] font-semibold leading-tight">Google Play</span>
                </span>
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-7 flex items-center gap-2">
              <div className="flex shrink-0 items-center">
                <Avatar src={avatar1} alt="User 1" />
                <Avatar src={avatar2} alt="User 2" offset />
                <Avatar src={avatar3} alt="User 3" offset />
                <Avatar src={avatar4} alt="User 4" offset />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-[13px] w-[13px] text-[#f97316]" />
                  ))}
                </div>
                <p className="font-sans text-sm leading-snug text-black/55">
                  Over <span className="font-semibold text-black">3,000 users</span>{" "}
                  keeping more of what they earn
                </p>
              </div>
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
              poster={beaverHeroPoster}
              aria-label="Beaver mascot wearing a Canadian cap, reading a receipt"
            >
              <source src={beaverHeroVideo} type="video/mp4" />
            </video>
          </div>

        </div>

        {/* ── STATS BAR ── */}
        <div className="mt-10 border-t border-black/[0.08] pt-5 pb-5 sm:mt-12 sm:pt-6 sm:pb-6">
          <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center lg:px-4 ${
                  i > 0 ? "lg:border-l lg:border-black/[0.08]" : ""
                }`}
              >
                <span className="font-display text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-[2rem]">
                  {stat.value}
                </span>
                <span className="mt-1 font-sans text-xs text-black/55 sm:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 1.5l2.633 5.336 5.888.856-4.26 4.152 1.006 5.864L10 14.95l-5.267 2.768 1.006-5.864L1.48 7.692l5.888-.856L10 1.5z" />
    </svg>
  );
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 29.4 32" fill="none" aria-hidden>
      <path fill="#00D9FF" d="M13.3 15.1 1.1 2.9C.4 3.6 0 4.6 0 5.7v20.7c0 1 .4 2 1.1 2.7l12.2-12.2v-.8Z" />
      <path fill="#FFD23D" d="m27.5 13.8-5.1-3L14.3 15v2l8.1 4.7 5.1-3c1.6-.9 1.6-3.1 0-4Z" />
      <path fill="#FF3A44" d="M14.3 17v2L2.1 31.2c.7.7 1.7 1.1 2.8 1.1.6 0 1.2-.1 1.7-.4l12.2-7V17h-4.5Z" />
      <path fill="#00F076" d="M14.3 15 4.8.8C4.3.4 3.7.2 3.1.2 2 .2 1 .6.3 1.3L14.3 15Z" />
    </svg>
  );
}
