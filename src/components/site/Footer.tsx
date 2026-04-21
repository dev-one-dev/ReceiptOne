import footerSvg from "@/assets/figma/footer.svg";

export function Footer() {
  return (
    <footer className="relative w-full">
      <img
        src={footerSvg}
        alt="Claim your free trial now — ReceiptOne"
        className="block h-auto w-full"
      />
      {/* Canada flag overlay covering the baked-in USA flag in the footer artwork.
          Position is tuned to the footer SVG layout (flag sits in the language switcher area). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ top: "3.6%", right: "10.2%", width: "1.6%", aspectRatio: "1 / 1" }}
      >
        <svg viewBox="0 0 24 24" className="block h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="footerFlagCircleCa">
              <circle cx="12" cy="12" r="12" />
            </clipPath>
          </defs>
          <g clipPath="url(#footerFlagCircleCa)">
            <rect width="24" height="24" fill="#fff" />
            <rect x="0" y="0" width="6" height="24" fill="#D52B1E" />
            <rect x="18" y="0" width="6" height="24" fill="#D52B1E" />
            <path
              fill="#D52B1E"
              d="M12 5.5l.7 1.7 1.8-.5-.6 1.8 1.7.6-1.4 1.2 1.6 1.5-2.6.2.4 1.7-1.6-.7-1.6.7.4-1.7-2.6-.2 1.6-1.5-1.4-1.2 1.7-.6-.6-1.8 1.8.5z"
            />
            <rect x="11.6" y="11" width="0.8" height="6" fill="#D52B1E" />
          </g>
        </svg>
      </div>
    </footer>
  );
}
