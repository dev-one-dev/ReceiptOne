import beaverPeace from "@/assets/figma/na-beaver-peace.webp";
import beaverWheel from "@/assets/figma/na-beaver-wheel.webp";
import beaverLaptop from "@/assets/figma/na-beaver-laptop.webp";
import beaverPhoneFolders from "@/assets/figma/na-beaver-phone-folders.webp";
import beaverGlasses from "@/assets/figma/na-beaver-glasses.webp";
import beaverThinking from "@/assets/figma/na-beaver-thinking.webp";

type Card = {
  title: string;
  body: string;
  image: string;
  alt: string;
};

const cards: Card[] = [
  {
    title: "Build Expense Reports That Make You Look Like",
    body: "ReceiptOne turns messy receipts into neat reports, ready for export to PDF or Excel.",
    image: beaverPeace,
    alt: "Beaver giving a peace sign",
  },
  {
    title: "Earn More From Every Kilometer You Drive",
    body: "Quickly log trips and set custom mileage rates for accurate claims—no spreadsheets needed.",
    image: beaverWheel,
    alt: "Beaver holding a steering wheel",
  },
  {
    title: "Turn Your Home Office Into Real Deductions",
    body: "ReceiptOne helps you quickly track and organize home office expenses for confident claims.",
    image: beaverLaptop,
    alt: "Beaver with headphones and a laptop",
  },
  {
    title: "Turn Organized Receipts into Audit-Ready Reports",
    body: "Export structured reports in PDF or Excel, complete with totals and receipt links for your accountant.",
    image: beaverPhoneFolders,
    alt: "Beaver with phone and folders",
  },
  {
    title: "Invite Your Accountant for Max. Efficiency",
    body: "ReceiptOne organizes your receipts and gives your accountant free access to your archive, saving time.",
    image: beaverGlasses,
    alt: "Beaver with glasses holding a sheet",
  },
  {
    title: "Plug ReceiptOne Into Your Workflow",
    body: "Simplify your finances with ReceiptOne. It integrates with QuickBooks and Google Drive for easy syncing and reporting.",
    image: beaverThinking,
    alt: "Beaver thinking",
  },
];

export function NotAll() {
  return (
    <section className="mx-auto w-full max-w-[960px] px-6 pt-[78px] pb-[132px]">
      {/* Section title with side rules */}
      <div className="mb-[78px] flex items-center gap-4">
        <div className="h-px flex-1 bg-black/15" />
        <h2 className="font-display text-[15px] font-medium tracking-wide text-[#7e8890]">
          And this is not all
        </h2>
        <div className="h-px flex-1 bg-black/15" />
      </div>

      {/* 3-column grid (2 on tablet, 1 on mobile) */}
      <div className="grid grid-cols-1 gap-x-[24px] gap-y-[60px] sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <article
            key={c.title}
            className="flex h-[560px] flex-col overflow-hidden rounded-[32px] bg-white"
          >
            <div className="px-[26px] pt-[60px]">
              <h3 className="font-display text-[22px] font-bold leading-[1.15] tracking-[-0.01em] text-black">
                {c.title}
              </h3>
              <p className="mt-[16px] font-display text-[14px] leading-[1.5] text-[#7e8890]">
                {c.body}
              </p>
            </div>
            <div className="mt-auto flex items-end justify-center">
              <img
                src={c.image}
                alt={c.alt}
                loading="lazy"
                className="block h-auto w-full max-w-[280px] select-none object-contain"
                draggable={false}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
