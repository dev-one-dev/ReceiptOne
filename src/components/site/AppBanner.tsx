import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerCaSvg from "@/assets/figma/app-banner-ca-replacement.svg";
import appBannerUsSvg from "@/assets/figma/app-banner-us.svg";

const APP_STORE_URL = "https://apps.apple.com/app/receiptone/id0000000000";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.receiptone.app";

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

export function AppBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const src = region === "us" ? appBannerUsSvg : appBannerCaSvg || appBannerSvg;

  const [platform, setPlatform] = useState<Platform>("other");
  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const qrUrl = platform === "ios" ? APP_STORE_URL : GOOGLE_PLAY_URL;
  const qrLabel =
    platform === "ios"
      ? "Scan to download on the App Store"
      : "Scan to download on Google Play";

  return (
    <section id="apps" className="w-full scroll-mt-28">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1440 / 560" }}>
        <img
          src={src}
          alt="Get your personal receipt manager in your phone — download on the App Store or Google Play"
          className="block h-full w-full"
          loading="lazy"
        />
        {/* QR overlay — positioned over the placeholder QR in the SVG. */}
        <a
          href={qrUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={qrLabel}
          className="absolute flex items-center justify-center bg-white shadow-sm transition-transform hover:scale-[1.03]"
          style={{
            left: `${(288 / 1440) * 100}%`,
            top: `${(348 / 560) * 100}%`,
            width: `${(84 / 1440) * 100}%`,
            height: `${(84 / 560) * 100}%`,
          }}
        >
          <QRCodeSVG
            value={qrUrl}
            level="M"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#000000"
            style={{ width: "100%", height: "100%" }}
          />
        </a>
      </div>
    </section>
  );
}
