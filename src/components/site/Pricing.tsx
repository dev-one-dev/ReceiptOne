import pricingSvg from "@/assets/figma/pricing.svg";

export function Pricing() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6">
      <img
        src={pricingSvg}
        alt="Pricing — Week CAD 4.99, Month CAD 9.99 (Most Popular), Year CAD 99.99 (Save 18%)"
        className="block h-auto w-full"
      />
    </section>
  );
}
