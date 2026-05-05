import eagleHeroVideo from "@/assets/figma/hero-eagle.mp4";
import eagleHeroVideoTransparent from "@/assets/figma/hero-eagle-transparent.webm";
import avatar1 from "@/assets/figma/avatar-1.webp";
import avatar2 from "@/assets/figma/avatar-2.webp";
import avatar3 from "@/assets/figma/avatar-3.webp";
import avatar4 from "@/assets/figma/avatar-4.webp";
import { Avatar, DashedLoop } from "@/components/site/TopBannerShared";

/**
 * TopBannerUS — US variant of the hero banner.
 * Mirrors TopBanner but swaps the beaver mascot for the eagle hero video
 * and uses US-specific copy.
 */
export function TopBannerUS() {
  return (
    <section className="relative w-full px-4 pt-[112px] sm:px-6 sm:pt-[140px] lg:px-8 lg:pt-[200px]">
      <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center gap-6 sm:gap-8">
        <div className="relative flex w-full flex-col items-center gap-3">
          <h1 className="text-center font-display text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-black sm:text-[40px] md:text-[52px] lg:text-[56px] xl:text-[64px]">
            Track expenses, store receipts, and generate tax-ready reports –
            all in one place
          </h1>

          <p className="max-w-full px-1 text-center font-display text-base leading-6 tracking-[-0.02em] text-[#9192a1] sm:text-lg sm:leading-7">
            Built for freelancers, self-employed, and small businesses in the US
          </p>

          <DashedLoop direction="ltr" className="pointer-events-none absolute left-1/2 top-[180px] hidden -translate-x-[340px] md:block" />
          <p className="pointer-events-none absolute left-1/2 top-[300px] hidden w-[160px] -translate-x-[420px] text-center font-script text-[20px] leading-[1.2] tracking-[-0.02em] text-[#9192a1] opacity-0 [animation:loopFadeIn_0.6s_ease-out_1.4s_forwards] md:block">
            7 days free trial available
          </p>

          <a
            href="#apps"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("apps")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="mt-1 inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 font-display text-sm font-semibold leading-5 text-white transition-opacity hover:opacity-90 sm:px-7 sm:py-3.5 sm:text-[15px]"
          >
            Claim your free trial
          </a>
        </div>

        <div className="relative w-full">
          <video
            style={{ background: "transparent" }}
            className="mx-auto block w-full max-w-[1200px] bg-transparent object-contain"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="Eagle mascot wearing a USA cap, reading a receipt"
          >
            <source src={eagleHeroVideoTransparent} type="video/webm" />
            <source src={eagleHeroVideo} type="video/mp4" />
          </video>
        </div>

        <div className="group/users relative flex w-full max-w-md cursor-pointer flex-col items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-500 ease-out hover:bg-black/[0.03] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] sm:max-w-none sm:flex-row sm:gap-[9px]">
          <div className="flex items-center pr-0 sm:pr-6">
            <Avatar src={avatar1} alt="User 1" delay={0} />
            <Avatar src={avatar2} alt="User 2" offset delay={60} />
            <Avatar src={avatar3} alt="User 3" offset delay={120} />
            <Avatar src={avatar4} alt="User 4" offset delay={180} />
          </div>
          <div className="flex w-full flex-col text-center sm:w-36 sm:text-left">
            <span className="font-display text-base font-semibold leading-5 text-black transition-transform duration-500 ease-out group-hover/users:-translate-y-px">
              More{" "}
              <span className="relative inline-block">
                <span className="relative z-10 transition-colors duration-500 group-hover/users:text-[#f97316]">
                  3.000
                </span>
                <span className="absolute inset-x-0 bottom-0.5 h-1.5 origin-left scale-x-0 bg-[#fed7aa] transition-transform duration-500 ease-out group-hover/users:scale-x-100" />
              </span>{" "}
              users
            </span>
            <span className="font-display text-base leading-6 text-[#9192a1] transition-colors duration-500 group-hover/users:text-black">
              keeping their money
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

