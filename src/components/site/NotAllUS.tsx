import { useEffect, useRef, useState } from "react";
import beaverPeace from "@/assets/figma/na-beaver-peace.webp";
import beaverWheel from "@/assets/figma/na-beaver-wheel.webp";
import beaverLaptop from "@/assets/figma/na-beaver-laptop.webp";
import beaverPhone from "@/assets/figma/na-beaver-phone-folders.webp";
import beaverThinking from "@/assets/figma/na-beaver-thinking.webp";
import beaverGlasses from "@/assets/figma/na-beaver-glasses.webp";

type Card = {
  title: string;
  body: string;
  image: string;
  alt: string;
};

const CARDS: Card[] = [
  {
    title: "Build expense reports that make you look pro",
    body: "ReceiptOne turns messy receipts into neat reports, ready for export to PDF or Excel.",
    image: beaverPeace,
    alt: "Beaver showing victory sign",
  },
  {
    title: "Earn more from every mile you drive",
    body: "Quickly log trips and set custom mileage rates for accurate claims — no spreadsheets needed.",
    image: beaverWheel,
    alt: "Beaver behind a steering wheel",
  },
  {
    title: "Turn your home office into real deductions",
    body: "ReceiptOne helps you quickly track and organize home office expenses for confident claims.",
    image: beaverLaptop,
    alt: "Beaver with headphones working on a laptop",
  },
  {
    title: "Turn organized receipts into audit-ready reports",
    body: "Export structured reports in PDF or Excel, complete with totals and receipt links for your accountant.",
    image: beaverPhone,
    alt: "Beaver holding a phone and folders",
  },
  {
    title: "Invite your accountant for max efficiency",
    body: "ReceiptOne organizes your receipts and gives your accountant free access to your archive, saving time.",
    image: beaverThinking,
    alt: "Beaver holding a sheet of paper",
  },
  {
    title: "Plug ReceiptOne into your workflow",
    body: "Simplify your finances with ReceiptOne. It integrates with QuickBooks and Google Drive for easy syncing and reporting.",
    image: beaverGlasses,
    alt: "Beaver with cool glasses",
  },
];

/**
 * Detect environment capabilities once per mount.
 *  - hasFinePointer: enables 3D tilt + spotlight (mouse users only)
 *  - prefersReducedMotion: disables tilt/float/spotlight, keeps a static fade
 */
function useMotionCapabilities() {
  const [caps, setCaps] = useState({ hasFinePointer: false, prefersReducedMotion: false });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setCaps({ hasFinePointer: fine.matches, prefersReducedMotion: reduce.matches });
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);
  return caps;
}

function NotAllCard({
  card,
  index,
  hasFinePointer,
  prefersReducedMotion,
}: {
  card: Card;
  index: number;
  hasFinePointer: boolean;
  prefersReducedMotion: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!hasFinePointer || prefersReducedMotion) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const rx = ((y - 50) / 50) * -5;
    const ry = ((x - 50) / 50) * 5;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  };

  const handleLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (!hasFinePointer || prefersReducedMotion) return;
    const el = e.currentTarget;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  const tiltStyle =
    hasFinePointer && !prefersReducedMotion
      ? {
          transform:
            "perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
          transformStyle: "preserve-3d" as const,
        }
      : undefined;

  const floatClass =
    !hasFinePointer && !prefersReducedMotion
      ? "animate-[notall-float_6s_ease-in-out_infinite]"
      : "";

  return (
    <article
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`group relative flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_2px_10px_-6px_rgba(0,0,0,0.08)] transition-[transform,box-shadow,opacity] duration-700 ease-out hover:shadow-[0_30px_60px_-24px_rgba(0,0,0,0.22)] motion-reduce:transition-none ${floatClass} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{
        ...tiltStyle,
        transitionDelay: `${index * 80}ms`,
        animationDelay: floatClass ? `${index * 350}ms` : undefined,
      }}
    >
      {hasFinePointer && !prefersReducedMotion && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(220,38,38,0.14), transparent 60%)",
          }}
        />
      )}

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: "1px",
          background:
            "linear-gradient(135deg, rgba(220,38,38,0.55), rgba(244,114,182,0.4), rgba(59,130,246,0.4))",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div className="relative px-6 pt-7 pb-3 sm:px-7 sm:pt-8">
        <h3 className="font-display text-[20px] font-bold leading-[1.15] tracking-tight text-black sm:text-[22px]">
          {card.title}
        </h3>
        <p className="mt-3 text-[13.5px] leading-[1.5] text-[#6b7177] sm:text-[14px]">
          {card.body}
        </p>
      </div>

      <div className="relative mt-auto flex h-[200px] items-end justify-center overflow-hidden sm:h-[230px]">
        <img
          src={card.image}
          alt={card.alt}
          loading="lazy"
          draggable={false}
          className="pointer-events-none h-full w-auto select-none object-contain object-bottom transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04]"
        />
      </div>
    </article>
  );
}

export function NotAllUS() {
  const { hasFinePointer, prefersReducedMotion } = useMotionCapabilities();

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pt-0 pb-20 sm:px-6 sm:pt-2 sm:pb-[132px]">
      <div className="mb-8 flex items-center gap-4 sm:mb-12">
        <div className="h-px flex-1 bg-black/15" />
        <h2 className="font-display text-[15px] font-medium tracking-wide text-[#7e8890]">
          And this is not all
        </h2>
        <div className="h-px flex-1 bg-black/15" />
      </div>

      <div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        style={{ perspective: "1400px" }}
      >
        {CARDS.map((card, i) => (
          <NotAllCard
            key={card.title}
            card={card}
            index={i}
            hasFinePointer={hasFinePointer}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </section>
  );
}