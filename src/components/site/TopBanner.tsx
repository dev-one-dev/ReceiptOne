import beaverHeroVideo from "@/assets/figma/hero-beaver-hq.mp4";
import beaverHeroPoster from "@/assets/figma/hero-beaver-poster.png";
import eagleHeroVideo from "@/assets/figma/hero-eagle-hq.mp4";
import eagleHeroPoster from "@/assets/figma/hero-eagle-poster.png";
import avatar1 from "@/assets/figma/avatar-1.webp";
import avatar2 from "@/assets/figma/avatar-2.webp";
import avatar3 from "@/assets/figma/avatar-3.webp";
import avatar4 from "@/assets/figma/avatar-4.webp";
import { Avatar } from "@/components/site/TopBannerShared";
import { StoreBadge } from "@/components/site/StoreBadge";

const CA_STATS = [
  { value: "4.8", label: "Average rating" },
  { value: "150K+", label: "Kilometres tracked" },
  { value: "12K+", label: "Reports generated" },
  { value: "100K+", label: "Receipts scanned" },
  { value: "$4.2M+", label: "Deductions tracked" },
];

const US_STATS = [
  { value: "4.8", label: "Average rating" },
  { value: "150K+", label: "Miles tracked" },
  { value: "12K+", label: "Reports generated" },
  { value: "100K+", label: "Receipts scanned" },
  { value: "$4.2M+", label: "Deductions tracked" },
];

export function TopBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const heroVideo = region === "us" ? eagleHeroVideo : beaverHeroVideo;
  const heroPoster = region === "us" ? eagleHeroPoster : beaverHeroPoster;
  const STATS = region === "us" ? US_STATS : CA_STATS;
  return (
    <section className="relative w-full overflow-visible px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* H1 */}
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.06] tracking-tight text-black">
              {region === "us"
                ? <>Turn receipts into IRS-ready reports — automatically<span className="text-[#f97316]">.</span></>
                : <>Turn receipts into CRA-ready reports — automatically<span className="text-[#f97316]">.</span></>}
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
              poster={heroPoster}
              aria-label={region === "us" ? "Eagle mascot wearing a USA cap, reading a receipt" : "Beaver mascot wearing a Canadian cap, reading a receipt"}
            >
              <source src={heroVideo} type="video/mp4" />
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

