import { Chip } from "@/components/site/Chip";
import naBeaverPeace from "@/assets/figma/na-beaver-peace.webp";
import naBeaverWheel from "@/assets/figma/na-beaver-wheel.webp";
import naBeaverLaptop from "@/assets/figma/na-beaver-laptop.webp";
import naBeaverPhoneFolders from "@/assets/figma/na-beaver-phone-folders.webp";
import naBeaverThinking from "@/assets/figma/na-beaver-thinking.webp";
import usGraphic1 from "@/assets/figma/mileage-auto/US/Graphic-Small1.png";
import usGraphic2 from "@/assets/figma/mileage-auto/US/Graphic-Small2.png";
import usGraphic from "@/assets/figma/mileage-auto/US/Graphic-Small.png";
import usGraphic4 from "@/assets/figma/mileage-auto/US/Graphic-Small4.png";
import usGraphic6 from "@/assets/figma/mileage-auto/US/Graphic-Small6.png";

const CA_FEATURES = [
  {
    title: "Build Expense Reports That Make You Look Good",
    desc: "ReceiptOne turns messy receipts into neat reports, ready to export to PDF or Excel.",
    img: naBeaverPeace,
    alt: "Beaver giving a peace sign",
  },
  {
    title: "Log Every Kilometer You Drive",
    desc: "Quickly log trips and set custom mileage rates for accurate claims — no spreadsheets needed.",
    img: naBeaverWheel,
    alt: "Beaver at the steering wheel",
  },
  {
    title: "Turn Your Home Office Into Deduction-Ready Records",
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
    title: "Plug ReceiptOne Into Your Workflow",
    desc: "ReceiptOne will soon connect with QuickBooks and Google Drive, so syncing and reporting take care of themselves.",
    img: naBeaverThinking,
    alt: "Beaver thinking",
    comingSoon: true,
  },
] as const;

const US_FEATURES = [
  {
    title: "Build Expense Reports That Make You Look Good",
    desc: "ReceiptOne turns messy receipts into neat reports, ready to export to PDF or Excel.",
    img: usGraphic1,
    alt: "Eagle building expense reports",
  },
  {
    title: "Log Every Kilometer You Drive",
    desc: "Quickly log trips and set custom mileage rates for accurate claims — no spreadsheets needed.",
    img: usGraphic2,
    alt: "Eagle tracking mileage",
  },
  {
    title: "Turn Your Home Office Into Deduction-Ready Records",
    desc: "ReceiptOne helps you quickly track and organize home office expenses for confident claims.",
    img: usGraphic,
    alt: "Eagle working from home office",
  },
  {
    title: "Turn Organized Receipts into Audit-Ready Reports",
    desc: "Export structured reports in PDF or Excel, complete with totals and receipt links for your accountant.",
    img: usGraphic4,
    alt: "Eagle with audit-ready reports",
  },
  {
    title: "Plug ReceiptOne Into Your Workflow",
    desc: "ReceiptOne will soon connect with QuickBooks and Google Drive, so syncing and reporting take care of themselves.",
    img: usGraphic6,
    alt: "Eagle plugging into workflow",
    comingSoon: true,
  },
] as const;

export function NotAll({ region = "ca" }: { region?: "ca" | "us" }) {
  const FEATURES = region === "us" ? US_FEATURES : CA_FEATURES;
  return (
    <section className="w-full px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4 sm:mb-12">
          <div className="h-px flex-1 bg-ink-10" />
          <h2 className="eyebrow">And this is not all</h2>
          <div className="h-px flex-1 bg-ink-10" />
        </div>

        {/* Cards. A grid with auto-rows-fr so EVERY row takes the tallest
            card's height -- the second row (two cards) is exactly as tall as
            the first, which flex-wrap could not guarantee (each flex line
            sizes itself). Columns are doubled (4 on sm, 6 on lg) with each
            card spanning two, so the incomplete last row can still centre
            itself: card 4 starts at column 2 on lg, card 5 at column 2 on sm. */}
        <div className="grid grid-cols-1 auto-rows-fr items-stretch gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={[
                "relative col-span-1 sm:col-span-2",
                i === 3 && "lg:col-start-2",
                i === 4 && "sm:col-start-2 lg:col-start-auto",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {"comingSoon" in f && f.comingSoon && (
                <Chip className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                  Coming soon
                </Chip>
              )}
              <div className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
                <div className="p-6 sm:p-8">
                  <h3 className="text-lead tracking-body text-ink">{f.title}</h3>
                  <p className="mt-3 text-sm text-ink-60">{f.desc}</p>
                </div>
                {/* Fixed-height mascot box, identical on all five cards; the
                    image fills it bottom-aligned so shorter artwork never
                    shortens the card. */}
                <div className="mt-auto flex h-48 items-end justify-center px-6 pt-2 sm:h-52">
                  <img
                    src={f.img}
                    alt={f.alt}
                    className="h-full w-auto max-w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.04]"
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
