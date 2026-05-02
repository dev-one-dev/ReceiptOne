import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import appBannerCaArt from "@/assets/figma/app-banner-ca.webp";
import appBannerUsArt from "@/assets/figma/app-banner-us.webp";

const APP_STORE_URL = "https://apps.apple.com/app/receiptone/id0000000000";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.receiptone.app";

/** Full Figma artboard 1440×560; card is 960×400 at x=240 y=80 */
const ART_W = 1440;
const ART_H = 560;
const CARD_X = 240;
const CARD_Y = 80;
const CARD_W = 960;
const CARD_H = 400;
/** Left column ~half of card per layout */
const LEFT_COL_W = CARD_W / 2;

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

/** Google Play mark (approximation of brand colors) for light badge backgrounds */
/** Rounded phone + pill — headline mark on /ca and /us */
function SmartphoneModernIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="6.75"
        y="3"
        width="10.5"
        height="18"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect x="9.25" y="4.85" width="5.5" height="1.85" rx="0.925" fill="currentColor" />
    </svg>
  );
}

function GooglePlayMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 29.4 32" fill="none" aria-hidden>
      <path
        fill="#00D9FF"
        d="M13.3 15.1 1.1 2.9C.4 3.6 0 4.6 0 5.7v20.7c0 1 .4 2 1.1 2.7l12.2-12.2v-.8Z"
      />
      <path fill="#FFD23D" d="m27.5 13.8-5.1-3L14.3 15v2l8.1 4.7 5.1-3c1.6-.9 1.6-3.1 0-4Z" />
      <path
        fill="#FF3A44"
        d="M14.3 17v2L2.1 31.2c.7.7 1.7 1.1 2.8 1.1.6 0 1.2-.1 1.7-.4l12.2-7V17h-4.5Z"
      />
      <path fill="#00F076" d="M14.3 15 4.8.8C4.3.4 3.7.2 3.1.2 2 .2 1 .6.3 1.3L14.3 15Z" />
    </svg>
  );
}

function pctX(px: number) {
  return `${(px / ART_W) * 100}%`;
}

function pctY(px: number) {
  return `${(px / ART_H) * 100}%`;
}

function BannerCopyAndCtas({ qrUrl, qrLabel }: { qrUrl: string; qrLabel: string }) {
  const phoneMark = (
    <SmartphoneModernIcon className="inline-block h-[0.95em] w-[0.95em] shrink-0 translate-y-[0.06em] text-white [vertical-align:-0.12em]" />
  );

  return (
    <>
      <div className="flex flex-col gap-2 text-white">
        <h2
          id="app-banner-heading"
          className="font-display text-[clamp(22px,4.2vw,40px)] font-semibold leading-tight tracking-[-0.025em] lg:text-[40px] lg:leading-[44px] lg:tracking-[-0.4px]"
        >
          <span className="block">Get your personal</span>
          <span className="block">receipt manager in</span>
          <span className="block">your {phoneMark} phone</span>
        </h2>
        <p className="max-w-[520px] font-display text-base font-normal leading-6 text-[#A1A1A1]">
          Snap receipts, auto-categorize expenses, track mileage, and export accountant-ready
          reports in seconds.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        <a
          href={qrUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={qrLabel}
          className="inline-flex w-fit shrink-0 rounded-2xl bg-white p-2 shadow-sm transition-transform hover:scale-[1.03]"
        >
          <QRCodeSVG
            value={qrUrl}
            level="M"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#000000"
            size={84}
          />
        </a>

        <div className="flex min-w-0 flex-col gap-2">
          <p className="font-display text-sm font-semibold leading-5 text-white/40">
            Download app now
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
              className="inline-flex h-10 w-[120px] shrink-0 flex-col items-center justify-center gap-0 rounded-lg border border-white/25 bg-black px-1.5 py-0.5 font-display text-white shadow-sm transition-transform hover:scale-[1.02]"
            >
              <span className="text-[8px] font-normal leading-tight text-white/90">
                Download on the
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold leading-none sm:text-[12px]">
                <AppleGlyph className="h-4 w-4 shrink-0 text-white" />
                App&nbsp;Store
              </span>
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
              className="inline-flex h-10 w-[135px] shrink-0 flex-col items-center justify-center gap-0 rounded-lg border border-black/12 bg-white px-1.5 py-0.5 font-display text-black shadow-sm transition-transform hover:scale-[1.02]"
            >
              <span className="text-[8px] font-normal leading-tight text-black/70">GET IT ON</span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold leading-none sm:text-[12px]">
                <GooglePlayMark className="h-[18px] w-[18px] shrink-0" />
                Google&nbsp;Play
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export function AppBanner({ region = "ca" }: { region?: "ca" | "us" }) {
  const [platform, setPlatform] = useState<Platform>("other");
  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const qrUrl = platform === "ios" ? APP_STORE_URL : GOOGLE_PLAY_URL;
  const qrLabel =
    platform === "ios" ? "Scan to download on the App Store" : "Scan to download on Google Play";

  const artSrc = region === "ca" ? appBannerCaArt : appBannerUsArt;

  return (
    <section
      id="apps"
      data-region={region}
      className="w-full scroll-mt-28"
      aria-labelledby="app-banner-heading"
    >
      <div className="mx-auto flex w-full max-w-[1440px] justify-center px-4 py-10 md:px-8 md:py-[80px]">
        <div className="relative w-full" style={{ aspectRatio: `${ART_W} / ${ART_H}` }}>
          {region === "us" || region === "ca" ? (
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={qrLabel}
              className="absolute inset-0 block"
            >
              <h2 id="app-banner-heading" className="sr-only">
                Get your personal receipt manager in your phone
              </h2>
              <img
                src={artSrc}
                alt="Get your personal receipt manager in your phone — download ReceiptOne on the App Store or Google Play"
                className="absolute inset-0 h-full w-full object-contain"
                width={ART_W}
                height={ART_H}
                loading="lazy"
                decoding="async"
              />
            </a>
          ) : (
            <>
              <img
                src={artSrc}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                width={ART_W}
                height={ART_H}
                loading="lazy"
                decoding="async"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute z-[1] bg-black"
                style={{
                  left: pctX(CARD_X),
                  top: pctY(CARD_Y),
                  width: pctX(LEFT_COL_W),
                  height: pctY(CARD_H),
                  borderTopLeftRadius: 32,
                  borderBottomLeftRadius: 32,
                }}
                aria-hidden
              />
              <div
                className="absolute z-[2] flex flex-col justify-center gap-6 px-5 py-8 sm:gap-8 sm:px-8 sm:py-10 md:gap-8 md:px-10 md:py-12"
                style={{
                  left: pctX(CARD_X),
                  top: pctY(CARD_Y),
                  width: pctX(LEFT_COL_W),
                  height: pctY(CARD_H),
                }}
              >
                <BannerCopyAndCtas qrUrl={qrUrl} qrLabel={qrLabel} />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
