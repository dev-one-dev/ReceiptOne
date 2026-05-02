import infoCardsSvg from "@/assets/figma/info-cards.svg";

/**
 * InfoCards — pixel-mapped from Figma 03-InfoCards.svg (1440x2976)
 * Rendered as a single SVG to match the design exactly.
 */
export function InfoCards() {
  return (
    <section id="benefits" className="w-full">
      <div className="mx-auto w-full max-w-[1440px]">
        <img
          src={infoCardsSvg}
          alt="Turn Receipt Chaos Into Tax Gold — benefits"
          className="block h-auto w-full"
        />
      </div>
    </section>
  );
}
