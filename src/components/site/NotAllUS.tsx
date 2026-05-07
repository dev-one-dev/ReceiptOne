import testimonialRowUs from "@/assets/figma/testimonial-row-us.webp";
import testimonialRowUs2 from "@/assets/figma/testimonial-row-us-2.webp";
import { useReplayOnVisible } from "@/hooks/use-replay-on-visible";

function TileRow({ src, alt }: { src: string; alt: string }) {
  const [rowRef, rowKey] = useReplayOnVisible<HTMLDivElement>(0.25);

  return (
    <div
      ref={rowRef}
      key={rowKey}
      className="notall-row is-visible relative"
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
  const [headerRef, headerKey] = useReplayOnVisible<HTMLDivElement>(0.4);
  return (
    <section className="mx-auto w-full max-w-[960px] px-4 pt-4 pb-20 sm:px-6 sm:pt-8 sm:pb-[132px]">
      <div
        ref={headerRef}
        key={headerKey}
        className="notall-divider is-visible mb-10 flex items-center gap-4 sm:mb-[78px]"
      >
        <div className="notall-line h-px flex-1 bg-black/15" />
        <h2 className="notall-title font-display text-[15px] font-medium tracking-wide text-[#7e8890]">
          And this is not all
        </h2>
        <div className="notall-line right h-px flex-1 bg-black/15" />
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
