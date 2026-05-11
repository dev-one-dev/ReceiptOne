import abScreenReceipts from "@/assets/figma/feat-receipts.png";
import abScreenMileage from "@/assets/figma/feat-mileage.png";
import icPhoneReports from "@/assets/figma/feat-reports.png";
import icPhoneExport from "@/assets/figma/feat-export.png";
import icPhoneHomeOffice from "@/assets/figma/feat-home-office.png";
import provinceText from "@/assets/figma/province-text.svg";
import provinceArrow from "@/assets/figma/province-arrow.svg";

const FEATURES = [
  {
    label: "Receipts",
    title: "All your receipts, captured and organized",
    desc: "Every purchase captured, categorized, and organized automatically. Snap a photo, forward an email, or upload a PDF — no manual entry, no lost paper trails.",
    img: abScreenReceipts,
    alt: "ReceiptOne app showing receipts list with CAD amounts",
  },
  {
    label: "Reports",
    title: "Create reports anytime, anywhere",
    desc: "Generate expense reports in seconds. Export to PDF or CSV with totals, categories, and receipt links — exactly how your accountant wants them.",
    img: icPhoneReports,
    alt: "ReceiptOne app showing reports list",
  },
  {
    label: "Export",
    title: "Scan on mobile. Manage on desktop.",
    desc: "Capture receipts on your phone and manage everything from your computer. Your data syncs instantly so you're always working with the full picture.",
    img: icPhoneExport,
    alt: "ReceiptOne app showing CSV export screen",
  },
  {
    label: "Mileage",
    title: "Mileage tracking, right on your phone",
    desc: "Log every business trip and apply the CRA per-kilometre rate in one tap. Never lose a deduction because you forgot to note the odometer.",
    img: abScreenMileage,
    alt: "ReceiptOne app showing mileage map tracking",
  },
  {
    label: "Home office",
    title: "Track your home office expenses",
    desc: "Calculate your home office deduction in minutes. ReceiptOne tracks utilities, internet, and workspace costs, then applies the CRA deduction formula automatically.",
    img: icPhoneHomeOffice,
    alt: "ReceiptOne app showing home office deduction results",
  },
];

export function InfoCards() {
  return (
    <section id="benefits" className="w-full bg-[#0d0d14] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Header */}
        <div className="relative mb-14 text-center sm:mb-16">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-white/35">
            Features
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Turn receipts chaos into tax{" "}
            <span className="relative inline-block">
              gold
              {/* Province callout — anchored to the right edge of "gold", desktop only */}
              <span
                className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 hidden -translate-y-full md:flex md:flex-col"
                aria-hidden="true"
              >
                <img
                  src={provinceText}
                  alt=""
                  draggable={false}
                  className="w-[78px] self-start"
                />
                <img
                  src={provinceArrow}
                  alt=""
                  draggable={false}
                  className="-mt-2 w-[108px]"
                />
              </span>
            </span>
          </h2>
        </div>

        {/* Feature rows */}
        <div className="flex flex-col gap-20 sm:gap-24">
          {FEATURES.map((f, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={f.title}
                className={`flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16 ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Text */}
                <div className="flex-1 text-center lg:text-left">
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#f97316]">
                    {f.label}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
                    {f.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-white/55">
                    {f.desc}
                  </p>
                </div>

                {/* Phone mockup */}
                <div className="flex flex-shrink-0 justify-center lg:w-[340px]">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-[2.5rem] bg-[#f97316]/10 blur-2xl" />
                    <img
                      src={f.img}
                      alt={f.alt}
                      className="relative h-auto w-[260px] rounded-[2rem] shadow-[0_24px_64px_rgba(0,0,0,0.5)] sm:w-[300px]"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

