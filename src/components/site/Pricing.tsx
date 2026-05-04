import pricingSvg from "@/assets/figma/pricing-ca.svg";
import pricingUsSvg from "@/assets/figma/pricing-us.svg";

// Card boxes from the Figma SVG (viewBox 1440x1632, displayed crop 1440x1110)
const CARDS = [
  { label: "Week plan", x: 240, btnX: 256, accent: "rgba(0,0,0,0.18)" },
  { label: "Month plan", x: 568, btnX: 584, accent: "rgba(249,115,22,0.35)" },
  { label: "Year plan", x: 896, btnX: 912, accent: "rgba(34,197,94,0.35)" },
] as const;

const CARD_Y = 600;
const CARD_W = 304;
const CARD_H = 544;
const BTN_Y = 776;
const BTN_W = 272;
const BTN_H = 56;
const VB_W = 1440;
const VB_H = 1110;

export function Pricing({ region = "ca" }: { region?: "ca" | "us" }) {
  const src = region === "us" ? pricingUsSvg : pricingSvg;
  const alt =
    region === "us"
      ? "Pricing — Week, Month (Most Popular), Year"
      : "Pricing — Week CAD 4.99, Month CAD 9.99 (Most Popular), Year CAD 99.99 (Save 18%)";
  return (
    <section
      id="pricing"
      className="mx-auto w-full max-w-[1440px] scroll-mt-28 px-3 sm:px-6"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-x-0 top-0 block w-full"
        />
        {CARDS.map((c) => (
          <button
            key={c.label}
            type="button"
            aria-label={c.label}
            className="group absolute cursor-pointer rounded-[32px] bg-transparent transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03]"
            style={{
              left: `${(c.x / VB_W) * 100}%`,
              top: `${(CARD_Y / VB_H) * 100}%`,
              width: `${(CARD_W / VB_W) * 100}%`,
              height: `${(CARD_H / VB_H) * 100}%`,
              boxShadow: "0 0 0 0 rgba(0,0,0,0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 30px 60px -20px ${c.accent}, 0 0 0 1px ${c.accent}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)";
            }}
          />
        ))}
        {CARDS.map((c) => (
          <a
            key={`${c.label}-subscribe`}
            href="#apps"
            aria-label={`${c.label} — Subscribe`}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("apps")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="absolute z-10 rounded-[16px] transition-transform duration-200 hover:scale-[1.04]"
            style={{
              left: `${(c.btnX / VB_W) * 100}%`,
              top: `${(BTN_Y / VB_H) * 100}%`,
              width: `${(BTN_W / VB_W) * 100}%`,
              height: `${(BTN_H / VB_H) * 100}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
