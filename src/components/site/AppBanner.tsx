import qrCode from "@/assets/figma/ab-qr.webp";
import screenMileage from "@/assets/figma/ab-screen-mileage.webp";
import frameAndroid from "@/assets/figma/ab-frame-android.webp";
import screenReceipts from "@/assets/figma/ab-screen-receipts.webp";
import frameIphone from "@/assets/figma/ab-frame-iphone.webp";
import { Smartphone, Apple } from "lucide-react";

/**
 * Section 6 — App Banner
 * Dark rounded card with copy + QR + store buttons on the left,
 * two phones (Android + iPhone) showing app screens on the right.
 */
export function AppBanner() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-12 md:py-16">
      <div className="relative overflow-hidden rounded-[40px] bg-[#0d0d0d] text-white">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
          {/* Left: copy + QR + store buttons */}
          <div className="px-8 pt-12 pb-8 md:px-12 md:pt-16 md:pb-12 lg:pb-16">
            <h2 className="font-display text-[34px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[44px] lg:text-[48px]">
              Get your personal
              <br />
              receipt manager in
              <br />
              your{" "}
              <span className="inline-flex h-[0.85em] w-[0.85em] -translate-y-[0.06em] items-center justify-center rounded-[0.18em] bg-white align-middle text-black">
                <Smartphone
                  className="h-[0.6em] w-[0.6em]"
                  strokeWidth={2.5}
                />
              </span>{" "}
              phone
            </h2>

            <p className="mt-5 max-w-[440px] font-display text-[14px] leading-[1.55] text-white/65 md:text-[15px]">
              Snap receipts, auto-categorize expenses, track mileage, and
              export accountant-ready reports in seconds.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* QR */}
              <div className="rounded-[18px] bg-white p-3">
                <img
                  src={qrCode}
                  alt="QR code to download ReceiptOne"
                  className="block h-[92px] w-[92px]"
                />
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-display text-[13px] text-white/70">
                  Download app now
                </span>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 text-black transition hover:bg-white/90"
                    aria-label="Download on the App Store"
                  >
                    <Apple className="h-6 w-6" fill="currentColor" />
                    <span className="flex flex-col leading-tight">
                      <span className="font-display text-[10px] text-black/70">
                        Download on the
                      </span>
                      <span className="font-display text-[15px] font-semibold">
                        App Store
                      </span>
                    </span>
                  </a>

                  <a
                    href="#"
                    className="inline-flex items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 text-black transition hover:bg-white/90"
                    aria-label="Get it on Google Play"
                  >
                    <GooglePlayIcon className="h-6 w-6" />
                    <span className="flex flex-col leading-tight">
                      <span className="font-display text-[10px] text-black/70">
                        GET IT ON
                      </span>
                      <span className="font-display text-[15px] font-semibold">
                        Google Play
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: two phones */}
          <div className="relative h-[360px] sm:h-[420px] lg:h-auto lg:min-h-[440px]">
            {/* Android phone — slightly behind, left */}
            <div className="pointer-events-none absolute bottom-[-40px] left-[6%] w-[55%] max-w-[260px] sm:left-[8%] sm:bottom-[-30px] lg:bottom-[-60px] lg:left-[2%] lg:w-[260px]">
              <PhoneMock frame={frameAndroid} screen={screenMileage} alt="ReceiptOne mileage screen on Android" />
            </div>
            {/* iPhone — front, right */}
            <div className="pointer-events-none absolute bottom-[-50px] right-[4%] w-[58%] max-w-[280px] sm:bottom-[-40px] lg:bottom-[-80px] lg:right-[6%] lg:w-[280px]">
              <PhoneMock frame={frameIphone} screen={screenReceipts} alt="ReceiptOne receipts screen on iPhone" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMock({
  frame,
  screen,
  alt,
}: {
  frame: string;
  screen: string;
  alt: string;
}) {
  return (
    <div className="relative aspect-[353/750]">
      {/* Screen sits inside the frame bezel (~3.5% inset top/sides, ~1% bottom) */}
      <img
        src={screen}
        alt=""
        aria-hidden
        className="absolute inset-x-[4%] top-[2%] bottom-[2%] h-[96%] w-[92%] rounded-[10%] object-cover"
        draggable={false}
      />
      <img
        src={frame}
        alt={alt}
        className="relative block h-full w-full"
        draggable={false}
      />
    </div>
  );
}

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      aria-hidden
    >
      <path
        d="M325.3 234.3 104.7 22l284.3 164-63.7 48.3z"
        fill="#34A853"
      />
      <path
        d="M104.7 22 84 32.7v446.6L104.7 490 325.3 277.7 104.7 22z"
        fill="#FBBC04"
      />
      <path
        d="M325.3 277.7 389 326 84 490c5.4 2.7 12.4 2.4 20.7-2.7L325.3 277.7z"
        fill="#EA4335"
      />
      <path
        d="M325.3 234.3 84 22c-8.3-5.1-15.3-5.4-20.7-2.7l326 306.7 63.7-48.3c20.5-15.6 20.5-43.7 0-59.4l-63.7-48.3-64 64z"
        fill="#4285F4"
      />
    </svg>
  );
}
