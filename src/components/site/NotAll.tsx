import notAllCa from "@/assets/figma/not-all-ca.webp";

export function NotAll() {
  const SVG_W = 1440;
  const SVG_H = 1325;
  const cardCols: Array<[number, number]> = [
    [240, 544],
    [568, 872],
    [896, 1200],
  ];
  const dividerYs = [454.5, 1046.5];

  return (
    <section className="mx-auto w-full max-w-[1440px] -mt-8 px-3 pt-0 pb-20 sm:-mt-14 sm:px-6 sm:pb-[132px]">
      <div className="relative">
        <img
          src={notAllCa}
          alt="And this is not all — six ReceiptOne benefit cards for Canadian users"
          className="pointer-events-none block h-auto w-full select-none"
          draggable={false}
          loading="lazy"
          decoding="async"
          width={1440}
          height={1325}
        />
        {dividerYs.map((dy, ri) =>
          cardCols.map(([x0, x1], ci) => (
            <div
              key={`div-${ri}-${ci}`}
              aria-hidden
              className="pointer-events-none absolute"
              style={{
                top: `${((dy - 2) / SVG_H) * 100}%`,
                left: `${((x0 + 1) / SVG_W) * 100}%`,
                width: `${((x1 - x0 - 2) / SVG_W) * 100}%`,
                height: `${(5 / SVG_H) * 100}%`,
                background: "#ffffff",
              }}
            />
          )),
        )}
      </div>
    </section>
  );
}
