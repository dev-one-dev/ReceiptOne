import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerTitleSvg from "@/assets/figma/app-banner-title.svg";

export function AppBanner() {
  return (
    <section className="w-full">
      <div className="relative w-full">
        <img
          src={appBannerSvg}
          alt="Get your personal receipt manager in your phone — download on the App Store or Google Play"
          className="block h-auto w-full"
        />
        {/* Overlay the new title over the original heading area inside the black card.
            Original SVG viewBox is 1440x560. Title sits inside the black card at
            roughly x:281 y:130 in SVG units, so we position it with percentages. */}
        <img
          src={appBannerTitleSvg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: "19.5%",
            top: "23.2%",
            width: "32.6%",
            height: "auto",
          }}
        />
      </div>
    </section>
  );
}
