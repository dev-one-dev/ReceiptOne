import avatar1 from "@/assets/figma/avatar-1.webp";
import avatar2 from "@/assets/figma/avatar-2.webp";
import avatar3 from "@/assets/figma/avatar-3.webp";
import avatarDavid from "@/assets/figma/crypto.png";

const TESTIMONIALS = [
  {
    quote:
      "ReceiptOne saved me hours every week. I used to spend Sunday evenings sorting receipts — now I just snap and forget. My accountant loves the export format.",
    name: "Maria Chen",
    role: "Freelance Graphic Designer",
    location: "Vancouver, BC",
    avatar: avatar3,
  },
  {
    quote:
      "Tracking GST/HST used to be a nightmare. Now I know exactly what I can claim back before I even talk to my accountant. Pays for itself every single month.",
    name: "David Okonkwo",
    role: "Independent IT Contractor",
    location: "Toronto, ON",
    avatar: avatarDavid,
  },
  {
    quote:
      "I run a small photography studio and ReceiptOne handles everything — vehicle expenses, equipment, client meals. Tax season is actually stress-free now.",
    name: "Sophie Tremblay",
    role: "Studio Owner",
    location: "Montréal, QC",
    avatar: avatar2,
  },
] as const;

export function Testimonials() {
  return (
    <section className="w-full px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">

        <div className="mb-12 text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/35">
            Testimonials
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]">
            Trusted by Canadian freelancers
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-5 rounded-3xl border border-black/[0.07] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] sm:p-8"
            >
              {/* Stars */}
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              <blockquote className="flex-1 font-sans text-[15px] leading-relaxed text-black/70">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="size-10 shrink-0 rounded-full object-cover"
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <p className="font-display text-sm font-semibold text-black">{t.name}</p>
                  <p className="font-sans text-xs text-black/45">
                    {t.role} · {t.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#f97316]" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
