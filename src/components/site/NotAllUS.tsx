import testimonialRowUs from "@/assets/figma/testimonial-row-us.webp";
import testimonialRowUs2 from "@/assets/figma/testimonial-row-us-2.webp";

function TileRow({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative"
      role="group"
      aria-label={alt}
    >
      <img
        src={src}
        alt={alt}
        className="pointer-events-none block h-auto w-full"
        loading="lazy"
        decoding="async"
        width={960}
        height={560}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0"
        style={{ top: "49.6%", height: "1.6%", background: "#ffffff" }}
      />
    </div>
  );
}

export function NotAllUS() {
  return (
    <section className="mx-auto w-full max-w-[960px] -mt-4 px-4 pt-0 pb-20 sm:-mt-8 sm:px-6 sm:pb-[132px]">
      <div className="mb-10 flex items-center gap-4 sm:mb-[78px]">
        <div className="h-px flex-1 bg-black/15" />
        <h2 className="font-display text-[15px] font-medium tracking-wide text-[#7e8890]">
          And this is not all
        </h2>
        <div className="h-px flex-1 bg-black/15" />
      </div>

      <TileRow
        src={testimonialRowUs}
        alt="Build expense reports, earn more from every mile you drive, turn your home office into real deductions"
      />

      <div className="mt-[60px]">
        <TileRow
          src={testimonialRowUs2}
          alt="Turn organized receipts into audit-ready reports, invite your accountant, plug ReceiptOne into your workflow"
        />
      </div>
    </section>
  );
}
