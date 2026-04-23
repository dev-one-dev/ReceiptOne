import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerCaSvg from "@/assets/figma/app-banner-ca-replacement.svg";
import appBannerUsSvg from "@/assets/figma/app-banner-us.svg";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

const APP_STORE_URL = "https://apps.apple.com/app/id000000000";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.receiptone.app";

function detectStoreUrl(): string {
  if (typeof navigator === "undefined") return APP_STORE_URL;
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return PLAY_STORE_URL;
  if (/iPad|iPhone|iPod/.test(ua)) return APP_STORE_URL;
  // Desktop / other — default to App Store
  return APP_STORE_URL;
}

export function AppBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const src = region === "us" ? appBannerUsSvg : appBannerCaSvg || appBannerSvg;
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [storeUrl, setStoreUrl] = useState<string>(APP_STORE_URL);

  useEffect(() => {
    const url = detectStoreUrl();
    setStoreUrl(url);
    QRCode.toDataURL(url, {
      margin: 1,
      width: 320,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, []);

  return (
    <section id="apps" className="w-full scroll-mt-28">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1440 / 560" }}>
        <img
          src={src}
          alt="Get your personal receipt manager in your phone — download on the App Store or Google Play"
          className="block h-full w-full"
          loading="lazy"
        />
        {qrDataUrl && (
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Scan QR code to download the app"
            className="absolute right-[6%] top-1/2 -translate-y-1/2 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 transition-transform hover:scale-105 sm:p-3 md:rounded-3xl md:p-4"
            style={{ width: "clamp(96px, 14vw, 200px)" }}
          >
            <img
              src={qrDataUrl}
              alt="QR code to download on the App Store or Google Play"
              className="block h-auto w-full"
            />
          </a>
        )}
      </div>
    </section>
  );
}
