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
                top: "20.5%",
                width: "28.8%",
                height: "58.1%",
              }}
            />
            <div
              className="pointer-events-none absolute text-background"
              style={{
                left: "19.75%",
                top: "21.25%",
                width: "29.5%",
              }}
            >
              <p
                className="m-0 text-balance font-sans font-medium leading-[1.05]"
                style={{ fontSize: "clamp(8px, 1.55vw, 25px)" }}
              >
                <span className="block">Get your personal</span>
                <span className="block">receipt manager</span>
                <span className="block whitespace-nowrap">
                  in your <span aria-hidden="true">📱</span>phone
                </span>
              </p>
            </div>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inline-flex items-center justify-center leading-none"
              style={{
                left: "23.15%",
                top: "69.15%",
                width: "3.8%",
                height: "9.8%",
                transform: "translate(-50%, -50%)",
                fontSize: "clamp(18px, 2vw, 30px)",
              }}
            >
              📱
            </span>
          </>
        ) : null}
      </div>
    </section>
  );
}
