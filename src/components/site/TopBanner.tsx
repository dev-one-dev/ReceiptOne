import beaverHeroVideo from "@/assets/figma/hero-beaver.mp4";
import beaverHeroVideoTransparent from "@/assets/figma/hero-beaver-transparent.webm";
import avatar1 from "@/assets/figma/avatar-1.webp";
import avatar2 from "@/assets/figma/avatar-2.webp";
import avatar3 from "@/assets/figma/avatar-3.webp";
import avatar4 from "@/assets/figma/avatar-4.webp";
import containerCa from "@/assets/figma/topbanner-container-ca.svg";
import trialCa from "@/assets/figma/topbanner-trial-ca.svg";
import { useReplayOnVisible } from "@/hooks/use-replay-on-visible";
import type { CSSProperties } from "react";

/**
 * Button geometry inside the Figma container SVG (viewBox 960×364).
 * Top-left corner of the "Claim your free trial" button rect: (356, 308).
 * We expose tweakable CSS vars so the arrow can be aligned without code edits.
 */
const CONTAINER_VB_W = 960;
const CONTAINER_VB_H = 364;
const BTN_X = 356;
const BTN_Y = 308;

// Loop SVG (viewBox 239×106) — coordinates of the arrow tip (drawing endpoint).
const ARROW_TIP_X = 3; // arrowhead tip lands near left edge of svg
const ARROW_TIP_Y = 103;
// Coordinates of the loop's "anchor" end (start of the curve, near button corner).
const ARROW_ANCHOR_X = 238;
const ARROW_ANCHOR_Y = 103;

const topBannerVars = {
  // Button anchor as % of container, derived from the SVG.
  "--tb-btn-x": `${(BTN_X / CONTAINER_VB_W) * 100}%`,
  "--tb-btn-y": `${(BTN_Y / CONTAINER_VB_H) * 100}%`,
  // Arrow loop sizing — scales with container so the anchor stays glued to the button.
  "--tb-arrow-w": "clamp(140px, 24.9%, 239px)",
  "--tb-arrow-tip-x": `${(ARROW_TIP_X / 239) * 100}%`,
  "--tb-arrow-tip-y": `${(ARROW_TIP_Y / 106) * 100}%`,
  "--tb-arrow-anchor-x": `${(ARROW_ANCHOR_X / 239) * 100}%`,
  "--tb-arrow-anchor-y": `${(ARROW_ANCHOR_Y / 106) * 100}%`,
  // Pixel nudges (override here to fine-tune without touching JSX).
  "--tb-arrow-dx": "0px",
  "--tb-arrow-dy": "0px",
  "--tb-trial-w": "clamp(78px, 12.3%, 118px)",
  "--tb-trial-dx": "-12px",
  "--tb-trial-dy": "-4px",
} as CSSProperties;

/**
 * TopBanner — pixel-mapped from Figma node 29:26474
 */
export function TopBanner() {
  const [loopRef, loopKey] = useReplayOnVisible<HTMLDivElement>(0.4);
  return (
    <section className="relative w-full px-4 pt-[112px] sm:px-6 sm:pt-[140px] lg:px-8 lg:pt-[200px]">
      <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center gap-6 sm:gap-8">
        <div ref={loopRef} className="relative flex w-full flex-col items-center" style={topBannerVars}>
          <img
            src={containerCa}
            alt="Track expenses, store receipts, and generate tax-ready reports — built for freelancers, self-employed, and small businesses in the US & Canada"
            className="block h-auto w-full select-none"
            draggable={false}
          />
          <DashedLoopCa
            key={`loop-${loopKey}`}
            className="pointer-events-none absolute hidden lg:block"
            style={{
              left: "var(--tb-btn-x)",
              top: "var(--tb-btn-y)",
              width: "var(--tb-arrow-w)",
              // Aspect ratio of the loop svg (239:106) so width drives height.
              aspectRatio: "239 / 106",
              transform:
                "translate(calc(-1 * var(--tb-arrow-anchor-x) + var(--tb-arrow-dx)), calc(-1 * var(--tb-arrow-anchor-y) + var(--tb-arrow-dy)))",
            }}
          />
          <img
            key={`trial-${loopKey}`}
            src={trialCa}
            alt="7 days free trial available"
            className="pointer-events-none absolute hidden select-none opacity-0 [animation:loopFadeIn_0.6s_ease-out_1.4s_forwards] lg:block"
            style={{
              // Anchor under the arrow tip — slightly left of the button.
              left: "var(--tb-btn-x)",
              top: "var(--tb-btn-y)",
              width: "var(--tb-trial-w)",
              transform:
                "translate(calc(-1 * var(--tb-arrow-w) - 100% + var(--tb-arrow-tip-x) + var(--tb-trial-dx)), calc(-1 * var(--tb-arrow-w) * 106 / 239 + var(--tb-arrow-tip-y) + var(--tb-trial-dy)))",
            }}
            draggable={false}
          />
          <a
            href="#apps"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("apps")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            aria-label="Claim your free trial"
            className="absolute inset-0"
          />
        </div>

        <div className="relative w-full">
          <video
            style={{ background: "transparent" }}
            className="mx-auto block w-full max-w-[1200px] bg-transparent object-contain"
            autoPlay
            loop
            muted
            playsInline
            aria-label="Beaver mascot wearing a Canadian cap, reading a receipt"
          >
            <source src={beaverHeroVideoTransparent} type="video/webm" />
            <source src={beaverHeroVideo} type="video/mp4" />
          </video>
        </div>

        <div className="group/users relative mx-auto flex w-fit cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-3 py-2 transition-[background-color,box-shadow,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-black/[0.03] hover:shadow-[0_10px_30px_-14px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center sm:gap-[14px]">
          <div className="flex items-center justify-center">
            <Avatar src={avatar1} alt="User 1" delay={0} />
            <Avatar src={avatar2} alt="User 2" offset delay={60} />
            <Avatar src={avatar3} alt="User 3" offset delay={120} />
            <Avatar src={avatar4} alt="User 4" offset delay={180} />
          </div>
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="font-display text-base font-semibold leading-5 text-black transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:-translate-y-px">
              More{" "}
              <span className="relative inline-block">
                <span className="relative z-10 transition-colors duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:text-[#f97316]">
                  3.000
                </span>
                <span className="absolute inset-x-0 bottom-0.5 h-1.5 origin-left scale-x-0 bg-[#fed7aa] transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:scale-x-100" />
              </span>{" "}
              users
            </span>
            <span className="font-display text-base leading-6 text-[#9192a1] transition-colors duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/users:text-black">
              keeping their money
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Avatar({
  src,
  alt,
  offset = false,
  delay = 0,
}: {
  src: string;
  alt: string;
  offset?: boolean;
  delay?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`size-11 rounded-full border-[3px] border-white object-cover shadow-sm transition-[transform,box-shadow] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover/users:-translate-y-1 group-hover/users:shadow-lg hover:!translate-y-[-8px] hover:!scale-110 hover:z-20 hover:ring-2 hover:ring-black/10 ${offset ? "-ml-3" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      loading="lazy"
    />
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
        style={{
          animation:
            "loopDraw 1.6s ease-out 0.3s both, loopFloat 4s ease-in-out 2s infinite",
          clipPath: "inset(0 0 0 100%)",
        }}
      />
    </svg>
  );
}

function DashedLoopCa({ className, style }: { className?: string; style?: CSSProperties }) {
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
        fill="#9192A1"
        opacity="0.6"
        d="M238.438 103.507a.501.501 0 0 0-.046-.999l.023.499.023.5ZM3.505 11.576l-.43-.256.43.256Zm-.472 91.26a.5.5 0 0 0 .298.641l4.228 1.542a.5.5 0 0 0 .343-.94l-3.758-1.37 1.37-3.758a.5.5 0 1 0-.94-.343l-1.541 4.228Zm235.382.171-.023-.499c-1.345.061-2.691.115-4.038.162l.017.5.018.499c1.35-.047 2.7-.101 4.049-.162l-.023-.5Zm-12.143.364-.008-.5c-2.695.04-5.392.053-8.089.041l-.003.5-.002.5c2.703.012 5.407-.001 8.109-.041l-.007-.5Zm-16.2-.075.012-.5a434.78 434.78 0 0 1-8.085-.268l-.022.5-.021.499c2.698.115 5.4.204 8.104.269l.012-.5Zm-16.186-.685.031-.499c-2.698-.164-5.39-.352-8.075-.563l-.04.499-.039.498c2.691.212 5.39.4 8.093.564l.03-.499Zm-16.15-1.269.048-.498c-2.691-.26-5.374-.542-8.046-.847l-.057.497-.057.497c2.678.305 5.367.588 8.064.848l.048-.497Zm-16.102-1.837.065-.495a466.663 466.663 0 0 1-8.01-1.126l-.074.495-.074.494c2.662.398 5.339.774 8.028 1.128l.065-.496Zm-16.009-2.39.082-.493c-2.678-.448-5.34-.916-7.983-1.406l-.091.492-.091.492c2.649.49 5.316.96 8 1.408l.083-.493Zm-15.947-2.953.099-.49a448.672 448.672 0 0 1-7.902-1.682l-.109.489-.108.488a450.72 450.72 0 0 0 7.92 1.685l.1-.49Zm-15.802-3.514.118-.486c-2.648-.64-5.269-1.3-7.861-1.979l-.127.484-.126.483a425.32 425.32 0 0 0 7.879 1.984l.117-.486Zm-15.688-4.112.137-.481a391.24 391.24 0 0 1-7.75-2.281l-.147.478-.146.478c2.555.781 5.145 1.544 7.77 2.287l.136-.48Zm-15.46-4.73.156-.475a345.942 345.942 0 0 1-7.672-2.629l-.168.471-.167.471c2.52.897 5.085 1.777 7.694 2.637l.157-.475Zm-15.293-5.449.18-.467a292.765 292.765 0 0 1-7.513-3.008l-.192.461-.192.462a297.212 297.212 0 0 0 7.538 3.019l.18-.467ZM52.48 70.113l.207-.456a231.323 231.323 0 0 1-7.302-3.464l-.223.448-.222.448a232.385 232.385 0 0 0 7.334 3.48l.206-.456Zm-14.5-7.216.24-.439a167.43 167.43 0 0 1-6.992-4.047l-.262.426-.26.426a168.57 168.57 0 0 0 7.033 4.072l.24-.438Zm-13.8-8.488.286-.41a105.61 105.61 0 0 1-6.428-4.843l-.317.388-.317.387a106.6 106.6 0 0 0 6.49 4.888l.286-.41Zm-12.446-10.27.355-.352c-2.016-2.03-3.776-4.066-5.265-6.103l-.403.295-.404.295c1.522 2.083 3.316 4.158 5.362 6.218l.355-.352Zm-9.35-13.137.46-.195c-1.09-2.573-1.714-5.129-1.846-7.653l-.5.026-.499.026c.14 2.655.795 5.325 1.924 7.99l.46-.194Zm-.647-15.77.468.176a22.216 22.216 0 0 1 1.728-3.577l-.43-.255-.43-.256a23.212 23.212 0 0 0-1.805 3.738l.469.175Zm1.767-3.656.43.255a31.579 31.579 0 0 1 2.198-3.238l-.395-.307-.395-.307a32.582 32.582 0 0 0-2.268 3.34l.43.257Zm8-8.62.264.425c2.317-1.438 4.75-2.204 7.215-2.384L18.947.5l-.035-.5c-2.629.192-5.216 1.01-7.669 2.531l.264.425ZM26.7 1.707l-.177.468c2.29.863 4.546 2.164 6.699 3.847l.308-.394.307-.394c-2.222-1.736-4.565-3.092-6.961-3.995l-.176.468Zm12.45 9.46-.386.318a44.016 44.016 0 0 1 4.39 6.466l.436-.244.436-.244a45.021 45.021 0 0 0-4.49-6.613l-.386.317Zm7.727 13.723-.47.171a51.782 51.782 0 0 1 2.122 7.524l.49-.1.49-.098a52.783 52.783 0 0 0-2.162-7.67l-.47.173Zm3.125 15.439-.5.024c.128 2.558.07 5.172-.197 7.822l.498.05.497.05c.272-2.7.331-5.365.201-7.971l-.499.025Zm-1.574 15.67-.485-.124a53.865 53.865 0 0 1-2.48 7.422l.461.192.462.193a54.862 54.862 0 0 0 2.526-7.56l-.484-.124Zm-6.047 14.564-.43-.254a61.957 61.957 0 0 1-4.389 6.462l.396.306.395.306a62.972 62.972 0 0 0 4.459-6.566l-.431-.254Zm-9.607 12.466-.358-.348a78.157 78.157 0 0 1-5.76 5.337l.322.383.321.383a79.148 79.148 0 0 0 5.833-5.406l-.358-.349Zm-12.07 10.174-.287-.41a102.473 102.473 0 0 1-6.61 4.246l.255.43.254.431a103.422 103.422 0 0 0 6.674-4.287l-.286-.41Zm-13.57 8.045-.225-.446a130.052 130.052 0 0 1-3.618 1.752l.21.453.212.454c1.244-.58 2.46-1.168 3.646-1.766l-.225-.447Z"
        style={{
          animation:
            "loopDraw 1.6s ease-out 0.3s both, loopFloat 4s ease-in-out 2s infinite",
          clipPath: "inset(0 0 0 100%)",
        }}
      />
    </svg>
  );
}

