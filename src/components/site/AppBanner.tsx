import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerUsSvg from "@/assets/figma/app-banner-us.svg";
import { Smartphone } from "lucide-react";

export function AppBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const src = region === "us" ? appBannerUsSvg : appBannerSvg;
  return (
    <section id="apps" className="w-full scroll-mt-28">
      <div className="relative w-full">
        <img
          src={src}
          alt="Get your personal receipt manager in your phone — download on the App Store or Google Play"
          className="block h-auto w-full"
        />
        {/*
          Overlay smartphone icon on top of the white placeholder square in the
          headline ("Get your personal receipt manager in your □ phone").
          Square sits at SVG coords (380, 208) → 25×39 units in a 1440×560 viewBox.
          Normalized: left 26.39%, top 37.14%, width 1.74%, height 6.96%.
          We draw a slightly larger black rect to mask the white square, then
          place a lucide Smartphone icon (white) centered over it.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute bg-black"
          style={{
            left: "26.0%",
            top: "36.6%",
            width: "2.4%",
            height: "8.0%",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute flex items-center justify-center"
          style={{
            left: "25.6%",
            top: "35.5%",
            width: "3.2%",
            height: "10%",
          }}
        >
          <Smartphone
            className="h-full w-full text-white"
            strokeWidth={2.25}
          />
        </div>
      </div>
    </section>
  );
}
