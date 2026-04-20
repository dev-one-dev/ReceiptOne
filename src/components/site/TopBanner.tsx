import beaverHero from "@/assets/figma/hero-beaver.webp";
import avatar1 from "@/assets/figma/avatar-1.webp";
import avatar2 from "@/assets/figma/avatar-2.webp";
import avatar3 from "@/assets/figma/avatar-3.webp";
import avatar4 from "@/assets/figma/avatar-4.webp";

/**
 * TopBanner — pixel-mapped from Figma node 29:26474
 */
export function TopBanner() {
  return (
    <section className="relative w-full px-8 pt-[120px]">
      <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center gap-12">
        <div className="relative flex w-full flex-col items-center gap-4">
          <h1 className="text-center font-display text-[64px] font-semibold leading-[64px] tracking-[-0.01em] text-black">
            Track expenses, store receipts, and generate tax-ready reports –
            all in one place
          </h1>

          <p className="w-[402px] max-w-full text-center font-display text-[20px] leading-7 tracking-[-0.02em] text-[#9192a1]">
            Built for freelancers, self-employed, and small businesses in the
            US &amp; Canada
          </p>

          <DashedLoop className="pointer-events-none absolute left-1/2 top-[180px] hidden -translate-x-[340px] md:block" />
          <p className="pointer-events-none absolute left-1/2 top-[260px] hidden w-[160px] -translate-x-[460px] -rotate-[6deg] text-center font-script text-[20px] leading-5 tracking-[-0.02em] text-[#9192a1] md:block">
            7 days free trial available
          </p>

          <button
            type="button"
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-black px-12 py-[18px] font-display text-base font-semibold leading-5 text-white transition-opacity hover:opacity-90"
          >
            Claim your free trial
          </button>
        </div>

        <div className="relative w-full">
          <img
            src={beaverHero}
            alt="Beaver mascot wearing a Canadian cap, reading a receipt"
            className="mx-auto block w-full max-w-[720px] mix-blend-darken"
            loading="eager"
          />
        </div>

        <div className="flex items-center gap-[9px]">
          <div className="flex items-center pr-6">
            <Avatar src={avatar1} alt="User 1" />
            <Avatar src={avatar2} alt="User 2" offset />
            <Avatar src={avatar3} alt="User 3" offset />
            <Avatar src={avatar4} alt="User 4" offset />
          </div>
          <div className="flex w-36 flex-col">
            <span className="font-display text-base font-semibold leading-5 text-black">
              More 3.000 users
            </span>
            <span className="font-display text-base leading-6 text-[#9192a1]">
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
}: {
  src: string;
  alt: string;
  offset?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`size-12 rounded-full border-[3px] border-white object-cover ${offset ? "-ml-6" : ""}`}
      loading="lazy"
    />
  );
}

function DashedLoop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={220}
      height={140}
      aria-hidden="true"
    >
      <path
        d="M210 130 C 110 150, 10 110, 30 60 C 45 20, 110 10, 130 50 C 145 80, 110 100, 80 80"
        stroke="#9192a1"
        strokeWidth="1.2"
        strokeDasharray="4 5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
