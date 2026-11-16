import appQr from "@/assets/app-qr.svg";
import type { Lang } from "@/lib/locales";

/**
 * "Scan to get the app": the QR code for the smart app link (/app), in the
 * footer, desktop only (lg and up). On a phone the store badges are the way in, so
 * below lg nothing renders. The SVG is static (scripts/generate-app-qr.mjs);
 * its own quiet zone is white, so the white rounded tile is the image itself.
 * No extra tracking: the UTMs in the encoded URL identify QR installs in the
 * store consoles.
 */
const LABEL: Record<Lang, string> = {
  en: "Scan to get the app",
  fr: "Numérisez pour obtenir l'application",
};

export const APP_QR_ALT = "QR code to download the ReceiptOne app";

export function AppQr({
  lang,
  variant,
  className = "",
}: {
  lang: Lang;
  /** light = on paper/white; dark = on the ink footer. */
  variant: "light" | "dark";
  className?: string;
}) {
  return (
    <div data-app-qr className={`hidden items-center gap-3 lg:flex ${className}`}>
      <img
        src={appQr}
        alt={APP_QR_ALT}
        width={112}
        height={112}
        loading="lazy"
        decoding="async"
        className={`size-28 shrink-0 rounded-card border bg-white ${
          variant === "dark" ? "border-hairline-void" : "border-hairline"
        }`}
      />
      <p className={`text-sm ${variant === "dark" ? "text-paper-60" : "text-ink-60"}`}>
        {LABEL[lang]}
      </p>
    </div>
  );
}
