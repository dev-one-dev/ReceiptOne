import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerCaSvg from "@/assets/figma/app-banner-ca.svg";
import appBannerUsSvg from "@/assets/figma/app-banner-us.svg";

export function AppBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const isCanada = region === "ca";
  const src = region === "us" ? appBannerUsSvg : appBannerCaSvg || appBannerSvg;

  return (
    <section id="apps" className="w-full scroll-mt-28">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1440 / 560" }}>
        <img
          src={src}
          alt="Get your personal receipt manager in your phone — download on the App Store or Google Play"
          className="block h-full w-full"
          loading="lazy"
        />
        {isCanada ? (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bg-foreground"
              style={{ left: "24.15%", top: "30.9%", width: "4.55%", height: "12.7%" }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute flex items-center justify-center"
              style={{ left: "24.95%", top: "32.05%", width: "2.9%", height: "7.8%" }}
            >
              <span className="leading-none" style={{ fontSize: "clamp(12px, 1.85vw, 30px)" }}>
                📱
              </span>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
