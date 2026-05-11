import beaverHeroVideo from "@/assets/figma/hero-beaver.mp4";
import beaverHeroVideoTransparent from "@/assets/figma/hero-beaver-alpha.webm";
import beaverHeroPoster from "@/assets/figma/hero-beaver-poster.png";
import avatar1 from "@/assets/figma/avatar-1.webp";
import avatar2 from "@/assets/figma/avatar-2.webp";
import avatar3 from "@/assets/figma/avatar-3.webp";
import avatar4 from "@/assets/figma/avatar-4.webp";
import { Avatar } from "@/components/site/TopBannerShared";

function scrollToApps(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("apps")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function TopBanner() {
  return (
    <section className="relative w-full px-4 pt-28 sm:px-6 sm:pt-36 lg:px-8 lg:pt-44">
      <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center gap-8 text-center">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 shadow-sm">
          <span className="size-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
          <span className="font-sans text-sm text-black/70">
            Trusted by 3,000+ Canadian freelancers
          </span>
        </div>

        {/* H1 */}
        <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.06] tracking-tight text-black">
          Turn receipts into{" "}
          <mark className="rounded bg-[#fed7aa] px-0.5 text-inherit [background:none] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] [background-color:#fed7aa]">
            CRA-ready reports
          </mark>
          {" "}— automatically.
        </h1>

        {/* Subheadline */}
        <p className="max-w-[600px] font-sans text-lg leading-relaxed text-black/55 sm:text-xl">
          Snap receipts, log mileage, organize expenses, and export
          audit-ready reports. Built for Canadian freelancers, contractors,
          and small businesses.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col items-center gap-3">
          <a
            href="#apps"
            onClick={scrollToApps}
            className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 font-display text-base font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all hover:scale-[1.02] hover:opacity-90"
          >
            Start your free 7-day trial
            <ArrowRightIcon />
          </a>
          <p className="font-sans text-sm text-black/40">
            No credit card required · Cancel anytime
          </p>
        </div>

        {/* Trust micro-badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {TRUST_BADGES.map((b) => (
            <span
              key={b.text}
              className="flex items-center gap-1.5 font-sans text-sm text-black/45"
            >
              <b.Icon />
              {b.text}
            </span>
          ))}
        </div>

        {/* Product visual — beaver mascot */}
        <div className="w-full">
          <video
            style={{ background: "transparent" }}
            className="mx-auto block w-full max-w-[1200px] bg-transparent object-contain"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={beaverHeroPoster}
            aria-label="Beaver mascot wearing a Canadian cap, reading a receipt"
          >
            <source src={beaverHeroVideoTransparent} type="video/webm" />
            <source src={beaverHeroVideo} type="video/mp4" />
          </video>
        </div>

        {/* Social proof */}
        <div className="group/users relative mx-auto flex w-fit cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-3 py-2 transition-[background-color,box-shadow,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-black/[0.03] hover:shadow-[0_10px_30px_-14px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center sm:gap-[14px]">
          <div className="flex items-center justify-center">
            <Avatar src={avatar1} alt="User 1" />
            <Avatar src={avatar2} alt="User 2" offset />
            <Avatar src={avatar3} alt="User 3" offset />
            <Avatar src={avatar4} alt="User 4" offset />
          </div>
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="font-display text-base font-semibold leading-5 text-black transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:-translate-y-px">
              More{" "}
              <span className="relative inline-block">
                <span className="relative z-10 transition-colors duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:text-[#f97316]">
                  3,000
                </span>
                <span className="absolute inset-x-0 bottom-0.5 h-1.5 origin-left scale-x-0 bg-[#fed7aa] transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:scale-x-100" />
              </span>{" "}
              users
            </span>
            <span className="font-display text-base leading-6 text-[#9192a1] transition-colors duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:text-black">
              keeping their money
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

const TRUST_BADGES = [
  { text: "CRA compliant", Icon: ShieldCheckIcon },
  { text: "Secure cloud backup", Icon: CloudIcon },
] as const;

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}
