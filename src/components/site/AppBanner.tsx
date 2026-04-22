import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerCaSvg from "@/assets/figma/app-banner-ca.svg";
import appBannerUsSvg from "@/assets/figma/app-banner-us.svg";

export function AppBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const src = region === "us" ? appBannerUsSvg : appBannerCaSvg || appBannerSvg;
  const isCanada = region === "ca";

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
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inline-flex items-center justify-center leading-none"
            style={{
              left: "26.55%",
              top: "32.85%",
              width: "2.6%",
              height: "7.5%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(10px, 1.55vw, 25px)",
            }}
          >
            📱
          </span>
        ) : null}
      </div>
    </section>
  );
}
