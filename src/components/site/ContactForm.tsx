import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { errorMessage } from "@/lib/utils";
import { toast } from "sonner";
import caBeaverPeekImg from "@/assets/figma/mileage-auto/Graphic-Small2.webp";

type Region = "ca" | "us";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ region }: { region: Region }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    const subj = subject.trim();
    const msg = message.trim();

    if (n.length < 2) {
      toast.error("Please enter your name.");
      return;
    }
    if (!EMAIL_RE.test(em)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (subj.length < 3) {
      toast.error("Please add a short subject.");
      return;
    }
    if (msg.length < 10) {
      toast.error("Please add a bit more detail to your message.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("support_requests").insert({
        name: n.slice(0, 120),
        email: em.slice(0, 254),
        subject: subj.slice(0, 200),
        message: msg.slice(0, 2000),
        region,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      toast.error(errorMessage(err, "Failed to send your message"));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-black/[0.07] bg-white p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-black text-white">
          <CheckIcon />
        </div>
        <p className="mt-5 font-display text-lg font-semibold text-black">Message sent</p>
        <p className="mt-2 font-sans text-sm text-black/60">
          Thanks for reaching out — we reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-8"
    >
      {/*
       * Regional mascot, peeking in from the left edge — restrained per
       * DESIGN.md's mascot principle: a large but secondary visual, cropped
       * by the card's own edge, sitting behind (z-0) the actual form fields.
       * CA-specific; /us/contact gets its own regional treatment separately.
       */}
      {region === "ca" && (
        <img
          src={caBeaverPeekImg}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute -left-9 top-1/2 z-0 w-28 -translate-y-1/2 rotate-[14deg] select-none object-contain sm:-left-11 sm:w-36"
        />
      )}

      <div className="relative z-10 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="block font-sans text-xs font-medium text-black/70">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 120))}
              placeholder="Jane Doe"
              className="block w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm leading-5 text-black outline-none transition-colors placeholder:text-black/55 focus:border-black/40"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="block font-sans text-xs font-medium text-black/70">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.slice(0, 254))}
              placeholder="you@example.com"
              className="block w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm leading-5 text-black outline-none transition-colors placeholder:text-black/55 focus:border-black/40"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className="block font-sans text-xs font-medium text-black/70">
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value.slice(0, 200))}
            placeholder="What's this about?"
            className="block w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm leading-5 text-black outline-none transition-colors placeholder:text-black/55 focus:border-black/40"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="block font-sans text-xs font-medium text-black/70">
            Message
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
            placeholder="How can we help?"
            rows={5}
            className="block w-full resize-none rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm leading-5 text-black outline-none transition-colors placeholder:text-black/55 focus:border-black/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
