import pricingSvg from "@/assets/figma/pricing.svg";

export function Pricing() {
  return (
    <section className="mx-auto w-full max-w-[1238px] px-6">
      {/* Crop bottom whitespace baked into the SVG (1238x1106 viewBox, content ends ~y=620) */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1238 / 640" }}
      >
        <img
          src={pricingSvg}
          alt="Pricing — Week CAD 4.99, Month CAD 9.99 (Most Popular), Year CAD 99.99 (Save 18%)"
          className="absolute inset-x-0 top-0 block w-full"
        />
      </div>
    </section>
  );
}
