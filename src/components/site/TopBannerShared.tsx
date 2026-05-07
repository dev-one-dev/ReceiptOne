/** Shared Avatar sub-component used by TopBanner (CA) and TopBannerUS (US). */

export function Avatar({
  src,
  alt,
  offset = false,
  delay = 0,
}: {
  src: string;
  alt: string;
  offset?: boolean;
  delay?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`size-11 rounded-full border-[3px] border-white object-cover shadow-sm transition-[transform,box-shadow] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover/users:-translate-y-1 group-hover/users:shadow-lg hover:!translate-y-[-8px] hover:!scale-110 hover:z-20 hover:ring-2 hover:ring-black/10 ${offset ? "-ml-3" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      loading="lazy"
    />
  );
}
