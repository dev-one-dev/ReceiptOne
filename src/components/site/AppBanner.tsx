import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerUsSvg from "@/assets/figma/app-banner-us.svg";

export function AppBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const src = region === "us" ? appBannerUsSvg : appBannerSvg;
  const showPhoneOverlay = region === "ca";
  const caPhonePlaceholderStyle = {
    left: "31.6667%",
    top: "72.1429%",
    width: "8.3333%",
    height: "7.1429%",
    transform: "translate(-50%, -50%)",
  } as const;

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
            className="pointer-events-none absolute inline-flex items-center justify-center leading-none"
            style={{
              ...caPhonePlaceholderStyle,
              fontSize: "clamp(18px,2.2vw,30px)",
              borderRadius: "clamp(6px,0.65vw,10px)",
              backgroundColor: "#000",
            }}
          >
            📱
          </span>
        ) : null}
      </div>
    </section>
  );
}
