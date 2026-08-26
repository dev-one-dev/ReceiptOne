import { cn } from "@/lib/utils";

const APP_STORE_URL = "https://apps.apple.com/us/app/receiptone-expense-tracker/id6755740822";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.appfyl.checkapp&pli=1";

type StorePlatform = "apple" | "google";
type StoreBadgeVariant = "light" | "dark";

const FILL_STYLES: Record<StorePlatform, Record<StoreBadgeVariant, string>> = {
  apple: {
    light: "border-hairline bg-ink text-white hover:opacity-80",
    dark: "border-white/15 bg-white/[0.07] text-white hover:bg-white/[0.13]",
  },
  google: {
    light: "border-hairline bg-white text-ink shadow-sm hover:opacity-80",
    dark: "border-white/15 bg-white/[0.07] text-white hover:bg-white/[0.13]",
  },
};

const MICRO_LABEL_STYLES: Record<StorePlatform, Record<StoreBadgeVariant, string>> = {
  apple: { light: "text-white/60", dark: "text-white/45" },
  google: { light: "text-ink-60", dark: "text-white/45" },
};

/**
 * Shared App Store / Google Play badge. Single source for size, icon,
 * two-line label, and both the light-page (TopBanner/Pricing) and
 * dark-footer color treatments — previously hand-duplicated across three
 * files, which is how they drifted to three different heights and
 * micro-label sizes.
 */
export function StoreBadge({
  platform,
  variant = "light",
  className,
}: {
  platform: StorePlatform;
  variant?: StoreBadgeVariant;
  className?: string;
}) {
  const isApple = platform === "apple";
  const href = isApple ? APP_STORE_URL : GOOGLE_PLAY_URL;
  const microLabel = isApple ? "Download on the" : "GET IT ON";
  const name = isApple ? "App Store" : "Google Play";
  const ariaLabel = isApple
    ? "Download ReceiptOne on the App Store"
    : "Get ReceiptOne on Google Play";
  const transitionClass = variant === "dark" ? "transition-colors" : "transition-opacity";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-card border px-3.5 font-display",
        transitionClass,
        FILL_STYLES[platform][variant],
        className,
      )}
    >
      {isApple ? (
        <AppleGlyph className="h-[18px] w-[18px] shrink-0" />
      ) : (
        <GooglePlayMark className="h-[18px] w-[18px] shrink-0" />
      )}
      <span className="flex flex-col items-start">
        <span
          className={cn("text-nav font-normal leading-none", MICRO_LABEL_STYLES[platform][variant])}
        >
          {microLabel}
        </span>
        <span className="text-label font-semibold">{name}</span>
      </span>
    </a>
  );
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
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
