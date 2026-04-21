import appBannerSvg from "@/assets/figma/app-banner.svg";
import appBannerUsSvg from "@/assets/figma/app-banner-us.svg";

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
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(24px,4.5vw,64px)] leading-none"
          style={{
            // Position over the white square that appears before the word "phone"
            // Tuned visually against the SVG banner artwork
            transform: "translate(-360%, -120%)",
          }}
        >
          📱
        </span>
      </div>
    </section>
  );
}
