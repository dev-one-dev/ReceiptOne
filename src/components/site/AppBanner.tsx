import appBannerSvg from "@/assets/figma/app-banner.svg";

export function AppBanner() {
  return (
    <section id="apps" className="w-full">
      <img
        src={appBannerSvg}
        alt="Get your personal receipt manager in your phone — download on the App Store or Google Play"
        className="block h-auto w-full"
      />
    </section>
  );
}
