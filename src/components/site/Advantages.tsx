import advantagesSvg from "@/assets/figma/advantages.svg";

export function Advantages() {
  const handleClaim = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("apps");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="benefits" className="w-full scroll-mt-28">
      <div className="relative w-full" style={{ aspectRatio: "1440 / 1056" }}>
        <img
          src={advantagesSvg}
          alt="What is our advantages — Save 10+ hours, never miss mileage deductions, accountant-ready reports, documentation ready, mobile + web in sync"
          className="block h-full w-full"
        />
        <a
          href="#apps"
          onClick={handleClaim}
          aria-label="Claim your free trial"
          className="absolute rounded-[16px] transition-transform hover:scale-[1.03]"
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
