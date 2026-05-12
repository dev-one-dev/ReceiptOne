import beaverHeroVideo from "@/assets/figma/hero-beaver-hq.mp4";
import beaverHeroPoster from "@/assets/figma/hero-beaver-poster.png";
import avatar1 from "@/assets/figma/avatar-1.webp";
import avatar2 from "@/assets/figma/avatar-2.webp";
import avatar3 from "@/assets/figma/avatar-3.webp";
import avatar4 from "@/assets/figma/avatar-4.webp";
import { Avatar } from "@/components/site/TopBannerShared";
import type { CSSProperties } from "react";
import { useEffect } from "react";

const APP_STORE_URL = "https://apps.apple.com/app/receiptone/id0000000000";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.receiptone.app";

const LOOP_VB_W = 239;
const LOOP_VB_H = 106;
const ARROW_TIP_X = 3;
const ARROW_TIP_Y = 103;
const ARROW_ANCHOR_X = 238;
const ARROW_ANCHOR_Y = 103;
const LOOP_ASPECT = LOOP_VB_W / LOOP_VB_H;
const TIP_DX_RATIO = (ARROW_TIP_X - ARROW_ANCHOR_X) / LOOP_VB_W;
const TIP_DY_RATIO = (ARROW_TIP_Y - ARROW_ANCHOR_Y) / LOOP_VB_W;

const topBannerCaVars = {
  "--tb-anchor-x-ratio": `${ARROW_ANCHOR_X / LOOP_VB_W}`,
  "--tb-anchor-y-ratio": `${ARROW_ANCHOR_Y / LOOP_VB_H}`,
  "--tb-tip-dx-ratio": `${TIP_DX_RATIO}`,
  "--tb-tip-dy-ratio": `${TIP_DY_RATIO}`,
} as CSSProperties;

const TOP_BANNER_CA_LOOP_CSS = `
[data-tb-ca-loop] {
  --tb-arrow-w: 140px;
  --tb-arrow-dx: 0px;
  --tb-arrow-dy: 0px;
  --tb-trial-w: 86px;
  --tb-trial-dx: 0px;
  --tb-trial-dy: 0px;
}
@media (min-width: 768px) {
  [data-tb-ca-loop] {
    --tb-arrow-w: 180px;
    --tb-trial-w: 96px;
  }
}
@media (min-width: 1024px) {
  [data-tb-ca-loop] {
    --tb-arrow-w: 239px;
    --tb-trial-w: 118px;
  }
}
`;

function scrollToApps(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function TopBanner() {
  useEffect(() => {
    const id = "top-banner-ca-loop-css";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = TOP_BANNER_CA_LOOP_CSS;
    document.head.appendChild(style);
  }, []);

  return (
    <section className="relative w-full px-4 pt-28 sm:px-6 sm:pt-36 lg:px-8 lg:pt-44">
      <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center gap-8 text-center">

        {/* H1 */}
        <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.06] tracking-tight text-black">
          Turn receipts into{" "}
          <mark className="rounded bg-[#fed7aa] px-0.5 text-inherit [background:none] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] [background-color:#fed7aa]">
            CRA-ready reports
          </mark>
          {" "}— automatically.
        </h1>

        {/* Subheadline */}
        <p className="max-w-[600px] font-sans text-lg leading-relaxed text-black/55 sm:text-xl">
          Snap receipts, log mileage, organize expenses, and export
          audit-ready reports. Built for Canadian freelancers, contractors,
          and small businesses.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col items-center gap-3">
          <div
            data-tb-ca-loop
            className="relative inline-block"
            style={topBannerCaVars}
          >
            <a
              href="#apps"
              onClick={scrollToApps}
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-4 font-display text-base font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all hover:scale-[1.02] hover:opacity-90"
            >
              Claim your free trial
            </a>
            <DashedLoop
              className="pointer-events-none absolute left-0 top-0 hidden md:block"
              style={{
                width: "var(--tb-arrow-w)",
                aspectRatio: `${LOOP_ASPECT}`,
                transform: `translate(calc(-1 * var(--tb-anchor-x-ratio) * var(--tb-arrow-w) + var(--tb-arrow-dx)), calc(-1 * var(--tb-anchor-y-ratio) * var(--tb-arrow-w) / ${LOOP_ASPECT} + var(--tb-arrow-dy)))`,
              }}
            />
            <p
              className="pointer-events-none absolute left-0 top-0 hidden w-[var(--tb-trial-w)] text-right font-script text-[18px] leading-[1.15] tracking-[-0.02em] text-[#9192a1] md:block"
              style={{
                transform: `translate(calc(var(--tb-tip-dx-ratio) * var(--tb-arrow-w) - 100% + var(--tb-trial-dx)), calc(var(--tb-tip-dy-ratio) * var(--tb-arrow-w) - 50% + var(--tb-trial-dy)))`,
              }}
            >
              7 days free trial available
            </p>
          </div>

          {/* Mobile trial label */}
          <p className="font-script text-[17px] text-[#9192a1] md:hidden">
            7 days free trial available
          </p>

          <p className="font-sans text-sm text-black/40">
            Cancel anytime · Secure cloud backup
          </p>

          {/* Store badges */}
          <div className="flex items-center gap-2.5">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download ReceiptOne on the App Store"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/12 bg-black px-3.5 font-display text-white transition-opacity hover:opacity-80"
            >
              <AppleGlyph className="h-[18px] w-[18px] shrink-0" />
              <span className="flex flex-col items-start">
                <span className="text-[8px] font-normal leading-none text-white/60">Download on the</span>
                <span className="text-[12px] font-semibold leading-tight">App Store</span>
              </span>
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get ReceiptOne on Google Play"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/12 bg-white px-3.5 font-display text-black shadow-sm transition-opacity hover:opacity-80"
            >
              <GooglePlayMark className="h-[18px] w-[18px] shrink-0" />
              <span className="flex flex-col items-start">
                <span className="text-[8px] font-normal leading-none text-black/50">GET IT ON</span>
                <span className="text-[12px] font-semibold leading-tight">Google Play</span>
              </span>
            </a>
          </div>
        </div>

        {/* Product visual — beaver mascot */}
        <div className="w-full">
          <video
            style={{ filter: "brightness(1.15) contrast(1.08)" }}
            className="mx-auto block w-full max-w-[1200px] object-contain mix-blend-multiply"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={beaverHeroPoster}
            aria-label="Beaver mascot wearing a Canadian cap, reading a receipt"
          >
            <source src={beaverHeroVideo} type="video/mp4" />
          </video>
        </div>

        {/* Social proof */}
        <div className="group/users relative mx-auto flex w-fit cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-3 py-2 transition-[background-color,box-shadow,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-black/[0.03] hover:shadow-[0_10px_30px_-14px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center sm:gap-[14px]">
          <div className="flex items-center justify-center">
            <Avatar src={avatar1} alt="User 1" />
            <Avatar src={avatar2} alt="User 2" offset />
            <Avatar src={avatar3} alt="User 3" offset />
            <Avatar src={avatar4} alt="User 4" offset />
          </div>
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="font-display text-base font-semibold leading-5 text-black transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:-translate-y-px">
              Over{" "}
              <span className="relative inline-block">
                <span className="relative z-10 transition-colors duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:text-[#f97316]">
                  3,000
                </span>
                <span className="absolute inset-x-0 bottom-0.5 h-1.5 origin-left scale-x-0 bg-[#fed7aa] transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:scale-x-100" />
              </span>{" "}
              users
            </span>
            <span className="font-display text-base leading-6 text-[#9192a1] transition-colors duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:text-black">
              keeping more of what they earn
            </span>
          </div>
        </div>

      </div>
    </section>
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
      <path fill="#00D9FF" d="M13.3 15.1 1.1 2.9C.4 3.6 0 4.6 0 5.7v20.7c0 1 .4 2 1.1 2.7l12.2-12.2v-.8Z" />
      <path fill="#FFD23D" d="m27.5 13.8-5.1-3L14.3 15v2l8.1 4.7 5.1-3c1.6-.9 1.6-3.1 0-4Z" />
      <path fill="#FF3A44" d="M14.3 17v2L2.1 31.2c.7.7 1.7 1.1 2.8 1.1.6 0 1.2-.1 1.7-.4l12.2-7V17h-4.5Z" />
      <path fill="#00F076" d="M14.3 15 4.8.8C4.3.4 3.7.2 3.1.2 2 .2 1 .6.3 1.3L14.3 15Z" />
    </svg>
  );
}

function DashedLoop({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      width="239"
      height="106"
      viewBox="0 0 239 106"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        opacity="0.6"
        d="M238.437 103.507C238.713 103.494 238.927 103.26 238.914 102.985C238.902 102.709 238.668 102.495 238.392 102.508L238.415 103.007L238.437 103.507ZM3.50409 11.5757L3.07445 11.3199L3.50409 11.5757ZM3.0326 102.836C2.93798 103.095 3.0716 103.382 3.33102 103.477L7.55865 105.019C7.81809 105.113 8.10509 104.98 8.1997 104.72C8.29432 104.461 8.1607 104.174 7.90127 104.079L4.14338 102.709L5.51387 98.951C5.60847 98.6916 5.47486 98.4046 5.21544 98.31C4.956 98.2153 4.669 98.349 4.57439 98.6084L3.0326 102.836ZM238.415 103.007L238.392 102.508C237.047 102.569 235.7 102.623 234.353 102.67L234.371 103.17L234.388 103.669C235.739 103.622 237.088 103.568 238.437 103.507L238.415 103.007ZM226.271 103.371L226.264 102.871C223.568 102.911 220.871 102.924 218.174 102.912L218.172 103.412L218.17 103.912C220.873 103.924 223.576 103.911 226.279 103.871L226.271 103.371ZM210.071 103.296L210.083 102.796C207.386 102.732 204.69 102.642 201.998 102.528L201.977 103.028L201.956 103.527C204.654 103.642 207.356 103.731 210.059 103.796L210.071 103.296ZM193.886 102.611L193.916 102.112C191.219 101.948 188.526 101.76 185.841 101.549L185.802 102.048L185.763 102.546C188.454 102.758 191.152 102.946 193.856 103.11L193.886 102.611ZM177.736 101.342L177.784 100.844C175.092 100.584 172.41 100.302 169.737 99.9972L169.681 100.494L169.624 100.991C172.302 101.296 174.991 101.579 177.688 101.839L177.736 101.342ZM161.633 99.5054L161.699 99.0096C159.015 98.6563 156.345 98.281 153.688 97.8843L153.614 98.3788L153.54 98.8733C156.203 99.2708 158.879 99.647 161.568 100.001L161.633 99.5054ZM145.624 97.115L145.707 96.6218C143.028 96.1743 140.366 95.7055 137.723 95.2162L137.632 95.7078L137.541 96.1995C140.19 96.6898 142.858 97.1597 145.542 97.6081L145.624 97.115ZM129.677 94.1624L129.777 93.6724C127.121 93.1319 124.486 92.5709 121.874 91.9904L121.766 92.4785L121.657 92.9666C124.275 93.5484 126.915 94.1106 129.578 94.6524L129.677 94.1624ZM113.876 90.6484L113.993 90.1624C111.345 89.5223 108.724 88.8622 106.133 88.1831L106.006 88.6668L105.879 89.1505C108.477 89.8311 111.104 90.4928 113.758 91.1344L113.876 90.6484ZM98.1878 86.5361L98.3241 86.055C95.7061 85.3134 93.122 84.5526 90.5743 83.7737L90.4281 84.2518L90.2819 84.73C92.8363 85.511 95.427 86.2737 98.0516 87.0172L98.1878 86.5361ZM82.7272 81.8061L82.8838 81.3312C80.2823 80.4733 77.7239 79.5965 75.2115 78.7021L75.0438 79.1732L74.8761 79.6442C77.3961 80.5413 79.9619 81.4206 82.5706 82.2809L82.7272 81.8061ZM67.4347 76.357L67.6143 75.8904C65.054 74.9052 62.5488 73.9018 60.102 72.8817L59.9096 73.3432L59.7171 73.8046C62.1727 74.8285 64.6866 75.8353 67.2552 76.8237L67.4347 76.357ZM52.48 70.1128L52.6865 69.6574C50.1786 68.5198 47.7431 67.3645 45.3842 66.1934L45.1618 66.6413L44.9395 67.0891C47.3093 68.2656 49.7554 69.4259 52.2734 70.5681L52.48 70.1128ZM37.9782 62.8966L38.2185 62.4581C35.7858 61.1249 33.4531 59.7748 31.2262 58.4107L30.965 58.837L30.7038 59.2634C32.9453 60.6365 35.292 61.9946 37.7379 63.3351L37.9782 62.8966ZM24.1804 54.4088L24.4665 53.9987C22.1719 52.3979 20.0263 50.7825 18.0381 49.1565L17.7215 49.5436L17.405 49.9306C19.4147 51.5742 21.5809 53.2049 23.8943 54.8188L24.1804 54.4088ZM11.7345 44.1396L12.0892 43.7872C10.0733 41.7578 8.31353 39.7209 6.82483 37.6842L6.42118 37.9793L6.0175 38.2743C7.53995 40.3572 9.3336 42.4321 11.3798 44.492L11.7345 44.1396ZM2.38413 31.0016L2.84454 30.8066C1.75471 28.2336 1.13065 25.6783 0.998629 23.1541L0.49932 23.1802L7.11402e-06 23.2063C0.138843 25.8612 0.79446 28.5305 1.92373 31.1966L2.38413 31.0016ZM1.73707 15.2328L2.20536 15.4081C2.6542 14.2087 3.22868 13.0159 3.93373 11.8314L3.50409 11.5757L3.07445 11.3199C2.3405 12.5529 1.73962 13.7994 1.26878 15.0576L1.73707 15.2328ZM3.50409 11.5757L3.93373 11.8314C4.6389 10.6467 5.37331 9.56864 6.1324 8.59257L5.73772 8.28562L5.34303 7.97867C4.5568 8.98964 3.79927 10.1022 3.07445 11.3199L3.50409 11.5757ZM11.5052 2.95632L11.7689 3.38117C14.086 1.94326 16.5178 1.17736 18.9835 0.997351L18.9471 0.498673L18.9107 -5.01741e-06C16.2818 0.191931 13.6943 1.0094 11.2416 2.53148L11.5052 2.95632ZM26.7003 1.70733L26.524 2.17524C28.8132 3.03755 31.069 4.33932 33.2222 6.02212L33.5301 5.62816L33.838 5.2342C31.616 3.49766 29.2727 2.14204 26.8765 1.23942L26.7003 1.70733ZM39.1508 11.167L38.7645 11.4845C40.3606 13.4272 41.8373 15.5952 43.1537 17.9508L43.5902 17.7069L44.0267 17.4629C42.6825 15.0578 41.1726 12.8403 39.5371 10.8496L39.1508 11.167ZM46.8776 24.8896L46.408 25.0614C47.2849 27.4575 48.0018 29.9746 48.5298 32.585L49.0199 32.4859L49.51 32.3868C48.9719 29.7265 48.2411 27.1608 47.3471 24.7177L46.8776 24.8896ZM50.0026 40.3286L49.5032 40.3535C49.6305 42.9109 49.5723 45.5254 49.3056 48.1754L49.8031 48.2255L50.3006 48.2756C50.5724 45.5747 50.6317 42.9101 50.502 40.3037L50.0026 40.3286ZM48.4285 55.9984L47.944 55.875C47.3156 58.3419 46.4946 60.8214 45.4632 63.2971L45.9247 63.4894L46.3863 63.6817C47.4364 61.161 48.2728 58.6354 48.9131 56.1219L48.4285 55.9984ZM42.3814 70.5627L41.9506 70.3089C40.6704 72.4816 39.2119 74.6394 37.5628 76.7708L37.9582 77.0768L38.3536 77.3828C40.0282 75.2186 41.5103 73.026 42.8122 70.8165L42.3814 70.5627ZM32.7748 83.0295L32.4166 82.6807C30.6541 84.4906 28.7371 86.2723 26.6571 88.0179L26.9786 88.4009L27.3 88.7839C29.4049 87.0174 31.3465 85.213 33.133 83.3783L32.7748 83.0295ZM20.7041 93.2028L20.4176 92.7931C18.3445 94.2427 16.1431 95.6598 13.8079 97.0392L14.0622 97.4697L14.3165 97.9002C16.673 96.5083 18.896 95.0774 20.9907 93.6126L20.7041 93.2028ZM7.13482 101.248L6.90988 100.802C5.73255 101.395 4.52653 101.979 3.29131 102.554L3.50233 103.007L3.71336 103.461C4.95776 102.881 6.17306 102.293 7.35976 101.695L7.13482 101.248Z"
        fill="#9192A1"
      />
    </svg>
  );
}
