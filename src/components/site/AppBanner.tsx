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
              className="absolute rounded-lg bg-foreground sm:rounded-xl lg:rounded-2xl"
              style={{
                left: "clamp(9%, 15vw, 19.15%)",
                top: "clamp(14%, 17vw, 20.4%)",
                width: "clamp(36%, 34vw, 25.4%)",
                height: "clamp(28%, 18vw, 31.2%)",
              }}
            />
            <div
              className="absolute text-background"
              style={{
                left: "clamp(11%, 16vw, 20.05%)",
                top: "clamp(17%, 18vw, 22.05%)",
                width: "clamp(31%, 29vw, 22.9%)",
              }}
            >
              <p className="font-display text-[clamp(9px,2.3vw,39px)] font-semibold leading-[0.96] tracking-normal">
                <span className="block">Get your personal</span>
                <span className="block">receipt manager in</span>
                <span className="block">your 📱phone</span>
              </p>
              <p
                className="font-sans text-[clamp(5px,0.86vw,14px)] leading-[1.45] tracking-normal opacity-80"
                style={{ marginTop: "clamp(4px, 1vw, 14px)", maxWidth: "96%" }}
              >
                Snap receipts, auto-categorize expenses, track mileage,
                <br />
                and export accountant-ready reports in seconds.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
