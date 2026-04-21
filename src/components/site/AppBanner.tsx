import titleIcon from "@/assets/figma/app-banner-title-icon.svg";
import phoneFrame from "@/assets/figma/ab-frame-iphone.webp";
import beaverPhone from "@/assets/figma/beaver-phone.webp";

export function AppBanner() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-10 md:py-16">
      <div className="relative overflow-hidden rounded-[32px] bg-black px-8 py-12 md:px-16 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-center">
          {/* Left: heading + sub */}
          <div className="max-w-[640px]">
            <h2 className="font-display text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-white md:text-[56px]">
              Get your personal
              <br />
              receipt manager in
              <br />
              your{" "}
              <img
                src={titleIcon}
                alt=""
                aria-hidden="true"
                className="inline-block h-[0.9em] w-auto align-[-0.12em]"
              />{" "}
              phone
            </h2>
            <p className="mt-6 max-w-[520px] font-display text-[16px] leading-[1.5] text-white/70 md:text-[18px]">
              Snap receipts, auto-categorize expenses, track mileage, and export
              tax-ready reports — all from your pocket.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-display text-[15px] font-semibold text-black transition hover:bg-white/90"
              >
                App Store
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent px-6 py-3 font-display text-[15px] font-semibold text-white transition hover:bg-white/10"
              >
                Google Play
              </a>
            </div>
          </div>

          {/* Right: phone illustration */}
          <div className="relative hidden md:block">
            <img
              src={phoneFrame}
              alt="ReceiptOne mobile app"
              className="h-auto w-[280px] select-none object-contain"
              draggable={false}
            />
            <img
              src={beaverPhone}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -right-10 h-auto w-[180px] select-none object-contain"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
