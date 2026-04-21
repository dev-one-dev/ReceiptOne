import testimonialRowUs from "@/assets/figma/testimonial-row-us.svg";
import testimonialRowUs2 from "@/assets/figma/testimonial-row-us-2.svg";

export function NotAllUS() {
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

      {/* First three cards as a single static SVG row */}
      <img
        src={testimonialRowUs}
        alt="Build expense reports, earn more from every mile you drive, turn your home office into real deductions"
        className="block h-auto w-full"
      />

      {/* Second three cards as a single static SVG row */}
      <img
        src={testimonialRowUs2}
        alt="Turn organized receipts into audit-ready reports, invite your accountant, plug ReceiptOne into your workflow"
        className="mt-[60px] block h-auto w-full"
      />
    </section>
  );
}