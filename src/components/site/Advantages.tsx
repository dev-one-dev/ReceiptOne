import advantagesSvg from "@/assets/figma/advantages.webp";

export function Advantages() {
  return (
    <section id="advantages" className="w-full scroll-mt-28">
      <div className="relative w-full" style={{ aspectRatio: "1440 / 1056" }}>
        <img
          src={advantagesSvg}
          alt="What is our advantages — Save 10+ hours, never miss mileage deductions, accountant-ready reports, documentation ready, mobile + web in sync"
          className="pointer-events-none block h-full w-full"
          loading="lazy"
          decoding="async"
          width={1440}
          height={1056}
        />
        <a
          href="#apps"
          aria-label="Claim your free trial"
          className="absolute rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
          style={{
            left: `${(602.5 / 1440) * 100}%`,
            top: `${(920 / 1056) * 100}%`,
            width: `${(240 / 1440) * 100}%`,
            height: `${(56 / 1056) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}
