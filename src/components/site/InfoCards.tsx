import infocardsHeading from "@/assets/figma/infocards-heading.png";
import infocardsHeadingUS from "@/assets/figma/mileage-auto/US/infocards-heading.png";
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
    desc: "Every purchase captured, categorized, and organized. Snap a photo or upload an image or PDF, and ReceiptOne reads the details for you to check — no lost paper trails.",
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
    desc: "Log each trip by entering its start and end addresses and tag it business or personal. Your T2125 report shows the business-use percentage from the trips you log, so log personal trips too.",
    img: abScreenMileage,
    alt: "ReceiptOne app showing mileage map tracking",
  },
  {
    label: "Home office",
    title: "Track your home office expenses",
    desc: "Enter your home expenses and the size of your workspace and your home. ReceiptOne works out the workspace percentage and applies it to your home costs, ready for your T2125.",
    img: icPhoneHomeOffice,
    alt: "ReceiptOne app showing home office deduction results",
  },
];

const US_FEATURES = CA_FEATURES.map((f) => {
  if (f.label === "Receipts")
    return {
      ...f,
      alt: "ReceiptOne app showing receipts list with USD amounts",
      desc: "Every purchase captured, categorized, and organized. Snap a photo or upload an image or PDF, and ReceiptOne reads the details for you to check — no lost paper trails.",
    };
  if (f.label === "Export")
    return { ...f, img: usExport, alt: "ReceiptOne app showing CSV export screen" };
  if (f.label === "Mileage")
    return {
      ...f,
      img: usMileage,
      alt: "ReceiptOne app showing mileage map tracking",
      desc: "Log a trip by entering its start and end addresses. ReceiptOne calculates the distance and separates business from personal miles, so your mileage log stays organized.",
    };
  if (f.label === "Home office")
    return {
      ...f,
      img: usHomeOffice,
      alt: "ReceiptOne app showing home office deduction results",
      desc: "Enter your home expenses and your office and home square footage. ReceiptOne works out your office percentage of home costs (the regular method) and, on the web app, the simplified method at $5 per sq ft up to 300 sq ft, so you can compare them.",
    };
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
              <div key={f.title} className="rounded-card bg-white p-8 shadow-sm lg:p-12">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                  {/* Text */}
                  <div className="text-center lg:text-left">
                    <p className="eyebrow text-ember-text">{f.label}</p>
                    <h3 className="mt-3 text-ink">{f.title}</h3>
                    <p className="mt-4 text-body text-ink-80">{f.desc}</p>
                  </div>

                  {/* Phone mockup — order-first on odd rows puts image left */}
                  <div className={`flex justify-center ${!isEven ? "lg:order-first" : ""}`}>
                    <div className="relative">
                      {/* rounded-[2.5rem] traces the device body below, not a card.
                          Deliberately outside the two-radius vocabulary -- do not
                          collapse to rounded-card. */}
                      <div className="absolute inset-0 rounded-[2.5rem] bg-ember/10 blur-2xl" />
                      {/* rounded-[2rem] is the phone's own corner radius, not a card
                          radius. Deliberately outside the two-radius vocabulary --
                          collapsing it to 12px makes the mockup read as a bug. */}
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
