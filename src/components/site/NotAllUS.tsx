import { useRef } from "react";
import testimonialRowUs from "@/assets/figma/testimonial-row-us.svg";
import testimonialRowUs2 from "@/assets/figma/testimonial-row-us-2.svg";

/**
 * Each SVG row contains 3 cards baked together. We overlay 3 invisible "tile"
 * hotspots above each row so every card gets its own modern micro-interaction:
 *   - magnetic tilt that follows the cursor
 *   - radial spotlight glow that tracks the pointer
 *   - lift + soft shadow on hover
 *   - staggered reveal-on-scroll
 */

const rowOneTiles = [
  "Build expense reports that make you look pro",
  "Earn more from every mile you drive",
  "Turn your home office into real deductions",
];
const rowTwoTiles = [
  "Turn organized receipts into audit-ready reports",
  "Invite your accountant for max efficiency",
  "Plug ReceiptOne into your workflow",
];

function TileRow({ src, alt, tiles }: { src: string; alt: string; tiles: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const rx = ((y - 50) / 50) * -4;
    const ry = ((x - 50) / 50) * 4;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  };
  const handleLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div ref={wrapRef} className="relative grid grid-cols-3 gap-2" style={{ perspective: "1200px" }}>
      <img
        src={src}
        alt={alt}
        className="pointer-events-none col-span-3 block h-auto w-full"
      />
      {/* Per-card hover hotspots overlayed on top of the SVG */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-[2.5%] px-[1%]">
        {tiles.map((label, i) => (
          <div
            key={label}
            data-reveal
            aria-label={label}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            className="group pointer-events-auto relative rounded-[28px] transition-[transform,box-shadow] duration-500 ease-out hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.28)] motion-reduce:transition-none"
            style={{
              transform:
                "perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0)",
              transformStyle: "preserve-3d",
              transitionDelay: `${i * 60}ms`,
            }}
          >
            {/* Spotlight glow */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(280px circle at var(--mx,50%) var(--my,50%), rgba(59,130,246,0.18), transparent 60%)",
              }}
            />
            {/* Gradient border on hover */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                padding: "1px",
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.55), rgba(168,85,247,0.45), rgba(236,72,153,0.4))",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotAllUS() {
  return (
    <section className="mx-auto w-full max-w-[960px] px-6 pt-[78px] pb-[132px]">
      <div className="mb-[78px] flex items-center gap-4">
        <div className="h-px flex-1 bg-black/15" />
        <h2 className="font-display text-[15px] font-medium tracking-wide text-[#7e8890]">
          And this is not all
        </h2>
        <div className="h-px flex-1 bg-black/15" />
      </div>

      <TileRow
        src={testimonialRowUs}
        alt="Build expense reports, earn more from every mile you drive, turn your home office into real deductions"
        tiles={rowOneTiles}
      />

      <div className="mt-[60px]">
        <TileRow
          src={testimonialRowUs2}
          alt="Turn organized receipts into audit-ready reports, invite your accountant, plug ReceiptOne into your workflow"
          tiles={rowTwoTiles}
        />
      </div>
    </section>
  );
}