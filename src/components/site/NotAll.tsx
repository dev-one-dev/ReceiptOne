import naBeaverPeace from "@/assets/figma/na-beaver-peace.webp";
import naBeaverWheel from "@/assets/figma/na-beaver-wheel.webp";
import naBeaverLaptop from "@/assets/figma/na-beaver-laptop.webp";
import naBeaverPhoneFolders from "@/assets/figma/na-beaver-phone-folders.webp";
import naBeaverGlasses from "@/assets/figma/na-beaver-glasses.webp";
import naBeaverThinking from "@/assets/figma/na-beaver-thinking.webp";

const FEATURES = [
  {
    title: "Build Expense Reports That Make You Look Good",
    desc: "ReceiptOne turns messy receipts into neat reports, ready to export to PDF or Excel.",
    img: naBeaverPeace,
    alt: "Beaver giving a peace sign",
  },
  {
    title: "Earn More From Every Kilometer You Drive",
    desc: "Quickly log trips and set custom mileage rates for accurate claims — no spreadsheets needed.",
    img: naBeaverWheel,
    alt: "Beaver at the steering wheel",
  },
  {
    title: "Turn Your Home Office Into Real Deductions",
    desc: "ReceiptOne helps you quickly track and organize home office expenses for confident claims.",
    img: naBeaverLaptop,
    alt: "Beaver with laptop and headphones",
  },
  {
    title: "Turn Organized Receipts into Audit-Ready Reports",
    desc: "Export structured reports in PDF or Excel, complete with totals and receipt links for your accountant.",
    img: naBeaverPhoneFolders,
    alt: "Beaver with phone and folders",
  },
  {
    title: "Invite Your Accountant for Max. Efficiency",
    desc: "ReceiptOne organizes your receipts and gives your accountant free access to your archive, saving time.",
    img: naBeaverGlasses,
    alt: "Beaver with glasses",
  },
  {
    title: "Plug ReceiptOne Into Your Workflow",
    desc: "Simplify your finances with ReceiptOne. It integrates with QuickBooks and Google Drive for easy syncing and reporting.",
    img: naBeaverThinking,
    alt: "Beaver thinking",
    comingSoon: true,
  },
] as const;

export function NotAll() {
  return (
    <section className="w-full px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Header */}
        <div className="mb-10 flex items-center gap-4 sm:mb-12">
          <div className="h-px flex-1 bg-black/10" />
          <h2 className="font-display text-[15px] font-medium tracking-wide text-black/40">
            And this is not all
          </h2>
          <div className="h-px flex-1 bg-black/10" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={"comingSoon" in f && f.comingSoon ? "relative" : ""}
            >
              {"comingSoon" in f && f.comingSoon && (
                <span className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#f97316] px-4 py-1 font-sans text-xs font-semibold text-white shadow-[0_4px_12px_rgba(249,115,22,0.4)]">
                  Coming soon
                </span>
              )}
              <div className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
                <div className="p-6 sm:p-8">
                  <h3 className="font-display text-xl font-semibold leading-snug text-black sm:text-2xl">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/55">
                    {f.desc}
                  </p>
                </div>
                <div className="mt-auto flex justify-center px-6 pt-2">
                  <img
                    src={f.img}
                    alt={f.alt}
                    className="h-48 w-auto object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.04] sm:h-52"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
