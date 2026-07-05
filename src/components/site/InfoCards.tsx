import infocardsHeading from "@/assets/figma/infocards-heading.png";
import infocardsHeadingUS from "@/assets/figma/mileage-auto/New-folder/US.png";
import abScreenReceipts from "@/assets/figma/feat-receipts.png";
import abScreenMileage from "@/assets/figma/feat-mileage.png";
import icPhoneReports from "@/assets/figma/feat-reports.png";
import icPhoneExport from "@/assets/figma/feat-export.png";
import icPhoneHomeOffice from "@/assets/figma/feat-home-office.png";
import usExport from "@/assets/figma/mileage-auto/US/Animation.png";
import usMileage from "@/assets/figma/mileage-auto/US/Animation1.png";
import usHomeOffice from "@/assets/figma/mileage-auto/US/Animation2.png";

const CA_FEATURES = [
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

const US_FEATURES = CA_FEATURES.map((f) => {
  if (f.label === "Receipts") return { ...f, alt: "ReceiptOne app showing receipts list with USD amounts" };
  if (f.label === "Export") return { ...f, img: usExport, alt: "ReceiptOne app showing CSV export screen" };
  if (f.label === "Mileage") return { ...f, img: usMileage, alt: "ReceiptOne app showing mileage map tracking", desc: "Log every business trip and apply the IRS per-mile rate in one tap. Never lose a deduction because you forgot to note the odometer." };
  if (f.label === "Home office") return { ...f, img: usHomeOffice, alt: "ReceiptOne app showing home office deduction results", desc: "Calculate your home office deduction in minutes. ReceiptOne tracks utilities, internet, and workspace costs, then applies the IRS deduction formula automatically." };
  return f;
});

export function InfoCards({ region = "ca" }: { region?: "ca" | "us" }) {
  const FEATURES = region === "us" ? US_FEATURES : CA_FEATURES;
  const heading = region === "us" ? infocardsHeadingUS : infocardsHeading;
  return (
    <section id="benefits" className="w-full px-4 pt-16 pb-4 sm:px-6 sm:pt-20 sm:pb-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Header image — negative margins bleed past the content column */}
        <div className="-mx-4 mb-10 sm:-mx-6 sm:mb-14 lg:-mx-8">
          <img
            src={heading}
            alt="Turn Receipt Chaos Into Tax Gold — Stop losing money on missed deductions"
            className="w-full mix-blend-multiply"
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Feature cards */}
        <div className="flex flex-col gap-6">
          {FEATURES.map((f, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={f.title} className="rounded-3xl bg-white p-8 shadow-sm lg:p-12">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

                  {/* Text */}
                  <div className="text-center lg:text-left">
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#c2410c]">
                      {f.label}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                      {f.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-black/70">
                      {f.desc}
                    </p>
                  </div>

                  {/* Phone mockup — order-first on odd rows puts image left */}
                  <div className={`flex justify-center ${!isEven ? "lg:order-first" : ""}`}>
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
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

