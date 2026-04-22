import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerUsSvg from "@/assets/figma/app-banner-us.svg";

export function AppBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const src = region === "us" ? appBannerUsSvg : appBannerSvg;
  const showPhoneOverlay = region === "ca";

  return (
    <section id="apps" className="w-full scroll-mt-28">
      <div className="relative w-full">
        <img
          src={src}
          alt="Get your personal receipt manager in your phone — download on the App Store or Google Play"
          className="block h-auto w-full"
        />
        {showPhoneOverlay ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 inline-flex items-center justify-center text-[clamp(24px,4.5vw,64px)] leading-none"
            style={{
              width: "clamp(28px,3.4vw,48px)",
              height: "clamp(28px,3.4vw,48px)",
              transform: "translate(-332%, -118%)",
            }}
          >
            📱
          </span>
        ) : null}
      </div>
    </section>
  );
}
