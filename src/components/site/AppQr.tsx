import appQr from "@/assets/app-qr.svg";
import type { Lang } from "@/lib/locales";
import type { StoreRegion } from "@/lib/stores";
import { StoreBadge } from "@/components/site/StoreBadge";

/**
 * The footer's one app-download block, desktop only (lg and up): the QR code
 * for the smart app link (/app) on the left; on its right a "Get the app"
 * label above the App Store and Google Play badges, stacked. Below lg nothing
 * renders here; the footer's badge row (lg:hidden) is the way in on a phone.
 *
 * flex-wrap, not a breakpoint: from ~1150px the badge column fits beside the
 * QR in the brand column (QR 112 + 12 + widest badge 131 = 255 of 269px at
 * 1280+). Between 1024 and ~1150 the column is narrower (222px at 1024), so
 * the badge column wraps under the QR instead of overflowing.
 *
 * The SVG is static (scripts/generate-app-qr.mjs); its own quiet zone is
 * white, so the white rounded tile is the image itself. The QR has no extra
 * tracking: the UTMs in the encoded URL identify QR installs in the store
 * consoles. The badges keep cta_click through the footer's
 * data-cta-location (delegated listener in lib/analytics).
 */
const LABEL: Record<Lang, string> = {
  en: "Get the app",
  fr: "Obtenir l'application",
};

export const APP_QR_ALT = "QR code to download the ReceiptOne app";

/**
 * The QR image alone, 112px on its own white rounded tile. Shared by the
 * footer block below and the landing hero's CTA row (which passes the
 * app-qr-hero.svg variant, utm_campaign=app_qr_hero). width/height are set,
 * so it never shifts layout while loading.
 */
export function AppQrImage({
  src = appQr,
  size = 112,
  variant,
  className = "",
}: {
  src?: string;
  /** Tile size in px: 112 (size-28) by default, 96 (size-24) where space is short. */
  size?: 112 | 96;
  /** light = on paper/white; dark = on the ink footer. */
  variant: "light" | "dark";
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={APP_QR_ALT}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={`${size === 96 ? "size-24" : "size-28"} shrink-0 rounded-card border bg-white ${
        variant === "dark" ? "border-hairline-void" : "border-hairline"
      } ${className}`}
    />
  );
}

export function AppQr({
  lang,
  region,
  variant,
  className = "",
}: {
  lang: Lang;
  region: StoreRegion;
  /** light = on paper/white; dark = on the ink footer. */
  variant: "light" | "dark";
  className?: string;
}) {
  return (
    <div data-app-qr className={`hidden flex-wrap items-center gap-3 lg:flex ${className}`}>
      <AppQrImage variant={variant} />
      <div data-app-badges className="flex flex-col gap-2">
        {/* w-0 min-w-full: the badges set the column's width, not the label.
            "OBTENIR L'APPLICATION" (158px) would otherwise push the column
            past the brand column and wrap the whole block; it breaks onto two
            lines instead. */}
        <p className="eyebrow w-0 min-w-full">{LABEL[lang]}</p>
        <StoreBadge platform="apple" region={region} variant={variant} size="sm" />
        <StoreBadge platform="google" region={region} variant={variant} size="sm" />
      </div>
    </div>
  );
}
