/**
 * Static, illustrated route preview -- not a live map. Stands in for the
 * mobile app's real Google Maps route visualization until trips carry
 * actual start/end coordinates; same container this will later host a
 * real map in.
 */
export function RouteMap({ origin, destination }: { origin: string; destination: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-[#faf9f6]">
      <svg
        viewBox="0 0 400 220"
        className="block w-full"
        role="img"
        aria-label={`Illustrated route from ${origin} to ${destination}`}
      >
        {/* Subtle city-block grid -- suggests "map surface" without literal street data */}
        <g stroke="#000000" strokeOpacity="0.05" strokeWidth="1">
          <line x1="40" y1="0" x2="40" y2="220" />
          <line x1="90" y1="0" x2="90" y2="220" />
          <line x1="150" y1="0" x2="150" y2="220" />
          <line x1="210" y1="0" x2="210" y2="220" />
          <line x1="270" y1="0" x2="270" y2="220" />
          <line x1="330" y1="0" x2="330" y2="220" />
          <line x1="0" y1="35" x2="400" y2="35" />
          <line x1="0" y1="80" x2="400" y2="80" />
          <line x1="0" y1="125" x2="400" y2="125" />
          <line x1="0" y1="170" x2="400" y2="170" />
        </g>

        {/* Route line */}
        <path
          d="M 70 168 C 130 168, 145 95, 205 90 S 300 60, 332 56"
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeDasharray="1 9"
          strokeLinecap="round"
        />

        {/* Origin pin -- ink */}
        <circle cx="70" cy="168" r="7" fill="#000000" />
        <circle cx="70" cy="168" r="7" fill="none" stroke="#faf9f6" strokeWidth="2.5" />
        <text x="70" y="192" textAnchor="middle" className="fill-black/70 text-[11px] font-medium">
          {origin}
        </text>

        {/* Destination pin -- ember, the accent marks the notable/end point */}
        <circle cx="332" cy="56" r="8" fill="#f97316" />
        <circle cx="332" cy="56" r="8" fill="none" stroke="#faf9f6" strokeWidth="2.5" />
        <text x="332" y="38" textAnchor="middle" className="fill-black/70 text-[11px] font-medium">
          {destination}
        </text>
      </svg>
    </div>
  );
}
