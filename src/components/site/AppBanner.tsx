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
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div
              className="absolute bg-foreground"
              style={{ left: "19.5%", top: "21.2%", width: "25.5%", height: "31.5%" }}
            />
            <p
              className="absolute font-display font-semibold leading-[0.96] text-background"
              style={{ left: "20.5%", top: "22.2%", width: "22.8%", fontSize: "clamp(8px, 1.9vw, 30px)" }}
            >
              <span className="block">Get your personal</span>
              <span className="block">receipt manager in</span>
              <span className="block">your 📱phone</span>
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
