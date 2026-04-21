import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerUsSvg from "@/assets/figma/app-banner-us.svg";

export function AppBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const src = region === "us" ? appBannerUsSvg : appBannerSvg;
  return (
    <section id="apps" className="w-full scroll-mt-28">
      <div
        className="relative w-full"
        style={{ aspectRatio: "1440 / 560", containerType: "inline-size" }}
      >
        <img
          src={src}
          alt="Get your personal receipt manager in your phone — download on the App Store or Google Play"
          className="absolute inset-0 block h-full w-full"
        />
        {/* Overlay the phone emoji on top of the placeholder square baked into the SVG.
            Position is computed from the SVG viewBox (1440x560): the placeholder square
            is centered around (608, 380). */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute select-none leading-none"
          style={{
            left: `${(209 / 1440) * 100}%`,
            top: `${(210 / 560) * 100}%`,
            transform: "translate(-50%, -50%)",
            fontSize: "4.4cqw",
            fontFamily:
              '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
          }}
        >
          📱
        </span>
      </div>
    </section>
  );
}
