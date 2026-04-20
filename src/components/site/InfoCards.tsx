import widgetReceipts from "@/assets/figma/widget-receipts.svg";
import phoneReports from "@/assets/figma/ic-phone-reports.webp";
import phoneExport from "@/assets/figma/ic-phone-export.webp";
import phoneHomeOffice from "@/assets/figma/ic-phone-home-office.webp";
import receiptPhoto from "@/assets/figma/ic-receipt-photo.webp";
import mapImg from "@/assets/figma/ic-map.webp";
import carImg from "@/assets/figma/ic-car.webp";
import doodleBg from "@/assets/figma/doodle-bg.jpg";

/**
 * InfoCards — pixel-mapped from Figma node 29:26476
 * Header (BENEFITS pill + H2 with "Gold" accent + sub) and 5 alternating feature rows.
 */
export function InfoCards() {
  return (
    <section id="benefits" className="w-full px-8 pt-20 pb-10">
      <div className="mx-auto w-full max-w-[1240px]">
        {/* --- Header --- */}
        <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-4 pb-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-white">
            <BoltIcon /> BENEFITS
          </span>
          <h2 className="font-display text-[56px] font-semibold leading-[60px] tracking-[-0.02em] text-black">
            Turn Receipt Chaos<br />
            Into Tax <span className="text-[#fb9130]">Gold</span>
          </h2>
          <p className="max-w-[560px] font-display text-base leading-6 text-[#7e8890]">
            Stop losing money on missed deductions. Our AI finds every dollar
            you're entitled to — automatically, accurately, instantly.
          </p>

          {/* Decorative script + dashed loop top-right */}
          <div className="pointer-events-none absolute right-0 top-0 hidden w-[160px] flex-col items-end gap-2 md:flex">
            <p className="rotate-[6deg] text-right font-script text-[20px] leading-5 tracking-[-0.02em] text-[#9192a1]">
              Works in all<br />50 states &amp;<br />13 provinces
            </p>
            <DashedCurve className="-mt-2" />
          </div>
        </div>

        {/* --- Feature rows --- */}
        <div className="flex flex-col gap-8">
          <FeatureRow
            imageSide="left"
            visual={<ReceiptStackVisual />}
            title="Your receipts and expenses are under complete control"
            body="ReceiptOne instantly recognizes receipts and sorts them by category. Don't miss out on deductions for home office and gas expenses. The app will automatically collect evidence for the tax office while you're on vacation."
          />
          <FeatureRow
            imageSide="right"
            visual={<PhoneVisual src={phoneReports} alt="Reports list on a phone" />}
            title="Create reports anytime"
            body="If you need to prepare a report for a month or a year, for a specific seller, category, amount, or payment method — you can do it in just a couple of clicks in the app or web version."
          />
          <FeatureRow
            imageSide="left"
            visual={<ScanVisual />}
            title="Scan on mobile. Run everything on desktop."
            body="Snap a receipt with your phone and move on — ReceiptOne takes care of the rest. AI extracts the data, categorizes expenses, and fills in missing details automatically. Back at your desk, you can search, filter, and turn everything into polished expense reports in one click."
          />
          <FeatureRow
            imageSide="right"
            visual={<MileageVisual />}
            title="Mileage tracker right on your phone"
            body="Record the miles or kilometres you've covered directly on your smartphone. On any day, you can add new distance travelled. Soon, we will add the ability to track distance in real-time at the push of a button."
          />
          <FeatureRow
            imageSide="left"
            visual={<HomeOfficeVisual />}
            title="Track your expenses for the Home Office"
            body="After setting up your workspace in your flat or house, you may be able to reclaim some of the costs incurred. A portion of your rent and utility bills may also be reclaimable. Find out what amount is available to you."
          />
        </div>
      </div>
    </section>
  );
}

/* ----------------- Layout primitives ----------------- */

function FeatureRow({
  visual,
  title,
  body,
}: {
  imageSide?: "left" | "right";
  visual: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-10 overflow-hidden rounded-[32px] bg-white p-6 md:p-8">
      <div className="flex justify-center">{visual}</div>
      <div className="flex max-w-[560px] flex-col gap-4 px-2 md:px-4">
        <h3 className="font-display text-[40px] font-semibold leading-[44px] tracking-[-0.02em] text-black">
          {title}
        </h3>
        <p className="font-display text-base leading-6 text-[#7e8890]">{body}</p>
      </div>
    </div>
  );
}

/* ----------------- Visuals ----------------- */

function ReceiptStackVisual() {
  return (
    <img
      src={widgetReceipts}
      alt="Receipts auto-categorized by ReceiptOne"
      className="h-auto w-full max-w-[960px]"
    />
  );
}

function ReceiptCard({
  className,
  logo,
  name,
  sub,
  amount,
  tax,
}: {
  className?: string;
  logo: string;
  name: string;
  sub: string;
  amount: string;
  tax: string;
}) {
  return (
    <div
      className={`flex w-[280px] items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] ${className ?? ""}`}
    >
      <img src={logo} alt={name} className="size-10 shrink-0 rounded-md object-cover" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-sm font-semibold text-black">{name}</span>
        <span className="font-display text-xs text-[#9192a1]">{sub}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-display text-sm font-semibold text-black">{amount}</span>
        <span className="font-display text-xs text-[#9192a1]">{tax}</span>
      </div>
    </div>
  );
}

function PhoneVisual({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-[520px] w-full max-w-[480px] overflow-hidden rounded-[32px] bg-[#f5f4f0]">
      <DottedBg />
      <img
        src={src}
        alt={alt}
        className="absolute left-1/2 top-1/2 max-h-[460px] -translate-x-1/2 -translate-y-1/2 rounded-[28px]"
        loading="lazy"
      />
    </div>
  );
}

function ScanVisual() {
  return (
    <div className="relative h-[520px] w-full max-w-[480px] overflow-hidden rounded-[32px] bg-[#f5f4f0]">
      <DottedBg />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-[260px] overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-xl">
          <div className="bg-[#faf3e8] px-4 py-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-display font-semibold">Scan your receipt</span>
              <span className="text-black/40">✕</span>
            </div>
          </div>
          <img
            src={receiptPhoto}
            alt="Receipt being scanned"
            className="block h-[360px] w-full object-cover"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-x-6 top-1/2 h-[2px] bg-[#3a83f1]" />
        </div>
        <span className="absolute -right-4 top-[260px] inline-flex size-10 items-center justify-center rounded-full bg-white shadow-md">
          <CursorIcon />
        </span>
      </div>
    </div>
  );
}

function MileageVisual() {
  return (
    <div className="relative h-[480px] w-full max-w-[480px] overflow-hidden rounded-[32px] bg-[#f5f4f0]">
      <img
        src={mapImg}
        alt="Vancouver map"
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
      />
      <img
        src={carImg}
        alt=""
        aria-hidden="true"
        className="absolute right-6 bottom-12 w-24"
        loading="lazy"
      />
      <MileageBadge className="absolute right-6 top-8" miles="54 miles" cad="+CAD 9.42" label="Yesterday Return" />
      <MileageBadge className="absolute left-12 bottom-6" miles="31 miles" cad="+CAD 4.86" label="Today Return" />
    </div>
  );
}

function MileageBadge({
  className,
  miles,
  cad,
  label,
}: {
  className?: string;
  miles: string;
  cad: string;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-white/95 px-3 py-2 shadow-md backdrop-blur ${className ?? ""}`}
    >
      <span className="font-display text-xs text-[#9192a1]">{label}</span>
      <div className="flex flex-col">
        <span className="font-display text-sm font-semibold text-black">{miles}</span>
        <span className="font-display text-xs text-[#35ac67]">{cad}</span>
      </div>
    </div>
  );
}

function HomeOfficeVisual() {
  return (
    <div className="relative h-[520px] w-full max-w-[480px] overflow-hidden rounded-[32px] bg-[#f5f4f0]">
      <DottedBg />
      <img
        src={phoneHomeOffice}
        alt="Home office expenses screen"
        className="absolute left-1/2 top-1/2 max-h-[460px] -translate-x-1/2 -translate-y-1/2 rounded-[28px]"
        loading="lazy"
      />
      {/* Floating green badges */}
      <Badge className="absolute left-4 top-8" emoji="🏠" title="Rental 2025" cad="+CAD 4,440.00" sub="10% of the annual amount" />
      <Badge className="absolute right-4 top-1/3" emoji="🟠" title="Common exp." cad="+CAD" sub="10% of the annual amount" />
      <Badge className="absolute left-6 bottom-10" emoji="🏠" title="Home office" cad="+CAD 540.00" sub="10% of total amount" />
    </div>
  );
}

function Badge({
  className,
  emoji,
  title,
  cad,
  sub,
}: {
  className?: string;
  emoji: string;
  title: string;
  cad: string;
  sub: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-md ${className ?? ""}`}
    >
      <span className="text-xl">{emoji}</span>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-semibold text-black">{title}</span>
          <span className="font-display text-sm font-semibold text-[#35ac67]">{cad}</span>
        </div>
        <span className="font-display text-xs text-[#9192a1]">{sub}</span>
      </div>
    </div>
  );
}

/* ----------------- Misc icons / bg ----------------- */

function DottedBg() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-50"
      style={{
        backgroundImage: `url(${doodleBg})`,
        backgroundSize: "480px 480px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="black" aria-hidden="true">
      <path d="M5 3l14 7-6 2-2 6-6-15z" />
    </svg>
  );
}

function DashedCurve({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 80"
      width={140}
      height={80}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 70 C 30 80, 90 70, 130 30 C 135 25, 130 10, 110 15"
        stroke="#9192a1"
        strokeWidth="1.2"
        strokeDasharray="4 5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
