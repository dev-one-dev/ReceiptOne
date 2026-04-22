import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerUsSvg from "@/assets/figma/app-banner-us.svg";

export function AppBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const src = region === "us" ? appBannerUsSvg : appBannerSvg;
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
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bg-foreground"
              style={{
                left: "19.4%",
                top: "20.45%",
                width: "29.15%",
                height: "39.6%",
              }}
            />
            <div
              className="pointer-events-none absolute text-background"
              style={{
                left: "22.1%",
                top: "24.9%",
                width: "22.4%",
              }}
            >
              <p
                className="m-0 max-w-full font-sans font-semibold leading-[0.96]"
                style={{ fontSize: "clamp(11px, 2vw, 38px)" }}
              >
                <span className="block">Get your personal</span>
                <span className="block">receipt manager in</span>
                <span className="block whitespace-nowrap">
                  your{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block leading-none"
                    style={{ fontSize: "0.9em", transform: "translateY(0.04em)" }}
                  >
                    📱
                  </span>
                  phone
                </span>
              </p>
              <p
                className="mt-[0.52em] max-w-full font-sans font-normal text-background/70"
                style={{ fontSize: "clamp(6px, 0.94vw, 16px)", lineHeight: 1.35 }}
              >
                Snap receipts, auto-categorize expenses, track mileage,
                <br />
                and export accountant-ready reports in seconds.
              </p>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
