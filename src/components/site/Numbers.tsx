/**
 * Numbers — static SVG from Figma (02-Numbers.svg).
 */
import numbersSvg from "@/assets/figma/numbers.svg";

export function Numbers() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1440px]">
        <img
          src={numbersSvg}
          alt="Key product statistics"
          className="block h-auto w-full"
        />
      </div>
    </section>
  );
}
