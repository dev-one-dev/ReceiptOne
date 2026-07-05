/** Shared Avatar sub-component used by TopBanner (region-aware, both CA and US). */

export function Avatar({
  src,
  alt,
  offset = false,
}: {
  src: string;
  alt: string;
  offset?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`size-11 rounded-full border-[3px] border-white object-cover shadow-sm${offset ? " -ml-3" : ""}`}
      loading="lazy"
    />
  );
}
