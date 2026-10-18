import { useState } from "react";
import { CONTACT_LIMITS, submitContactRequest } from "@/integrations/firebase/support";
import { callableErrorMessage, isRateLimited } from "@/integrations/firebase/callable-error";
import { toast } from "sonner";
import { useLang } from "@/lib/use-lang";
import type { Lang } from "@/lib/locales";

type Region = "ca" | "us";

// Sent as the request's `locale` so support can see which storefront and
// language the visitor wrote from: en-CA, en-US, or fr-CA on /fr/contact.
const REGION_LOCALE: Record<Region, string> = { ca: "en-CA", us: "en-US" };

const COPY: Record<Lang, Record<string, string>> = {
  en: {
    errName: "Please enter your name.",
    errEmail: "Please enter a valid email address.",
    errSubject: "Please add a short subject.",
    errMessage: "Please add a bit more detail to your message.",
    errRate: "You've sent a few messages recently. Please wait an hour before sending another.",
    errSend: "Failed to send your message. Please try again.",
    sentTitle: "Message sent",
    sentBody: "Thanks for reaching out — we reply within 1–2 business days.",
    name: "Name",
    namePh: "Jane Doe",
    email: "Email",
    emailPh: "you@example.com",
    subject: "Subject",
    subjectPh: "What's this about?",
    message: "Message",
    messagePh: "How can we help?",
    sending: "Sending…",
    send: "Send message",
  },
  // Response time wording matches the portal's contactSupportPage.fr
  // ("sous 1 à 2 jours ouvrables").
  fr: {
    errName: "Veuillez entrer votre nom.",
    errEmail: "Veuillez entrer une adresse courriel valide.",
    errSubject: "Veuillez ajouter un court objet.",
    errMessage: "Veuillez donner un peu plus de détails dans votre message.",
    errRate:
      "Vous avez envoyé plusieurs messages récemment. Veuillez attendre une heure avant d'en envoyer un autre.",
    errSend: "Impossible d'envoyer votre message. Veuillez réessayer.",
    sentTitle: "Message envoyé",
    sentBody: "Merci de nous avoir écrit — nous répondons sous 1 à 2 jours ouvrables.",
    name: "Nom",
    namePh: "Marie Tremblay",
    email: "Courriel",
    emailPh: "vous@exemple.com",
    subject: "Objet",
    subjectPh: "À quel sujet?",
    message: "Message",
    messagePh: "Comment pouvons-nous vous aider?",
    sending: "Envoi en cours…",
    send: "Envoyer le message",
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ region }: { region: Region }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const lang: Lang = useLang() === "fr" && region === "ca" ? "fr" : "en";
  const t = COPY[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    const subj = subject.trim();
    const msg = message.trim();

    if (n.length < 2) {
      toast.error(t.errName);
      return;
    }
    if (!EMAIL_RE.test(em)) {
      toast.error(t.errEmail);
      return;
    }
    if (subj.length < 3) {
      toast.error(t.errSubject);
      return;
    }
    if (msg.length < 10) {
      toast.error(t.errMessage);
      return;
    }

    setLoading(true);
    try {
      // Callable in the portal's Firebase project; the App Check token is
      // attached automatically (see integrations/firebase/client.ts). The
      // function creates a `supportRequests` doc the portal's Support screens read.
      await submitContactRequest({
        name: n.slice(0, CONTACT_LIMITS.name),
        email: em.slice(0, CONTACT_LIMITS.email),
        subject: subj.slice(0, CONTACT_LIMITS.subject),
        message: msg.slice(0, CONTACT_LIMITS.message),
        locale: lang === "fr" ? "fr-CA" : REGION_LOCALE[region],
        userAgent:
          typeof navigator !== "undefined"
            ? navigator.userAgent.slice(0, CONTACT_LIMITS.userAgent)
            : null,
      });
      setSubmitted(true);
    } catch (err) {
      if (isRateLimited(err)) {
        toast.error(t.errRate);
      } else {
        toast.error(callableErrorMessage(err, t.errSend));
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-card border border-hairline bg-white p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-pill bg-ink text-paper">
          <CheckIcon />
        </div>
        <p className="mt-5 font-display text-lead font-semibold text-ink">{t.sentTitle}</p>
        <p className="mt-2 font-sans text-sm text-ink-60">{t.sentBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-card border border-hairline bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-8"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-name"
            className="block font-sans text-label font-medium text-ink-80"
          >
            {t.name}
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 120))}
            placeholder={t.namePh}
            className="block w-full rounded-card border border-hairline bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-60 focus:border-ink-40"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="block font-sans text-label font-medium text-ink-80"
          >
            {t.email}
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.slice(0, 254))}
            placeholder={t.emailPh}
            className="block w-full rounded-card border border-hairline bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-60 focus:border-ink-40"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contact-subject"
          className="block font-sans text-label font-medium text-ink-80"
        >
          {t.subject}
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value.slice(0, 200))}
          placeholder={t.subjectPh}
          className="block w-full rounded-card border border-hairline bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-60 focus:border-ink-40"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="contact-message"
          className="block font-sans text-label font-medium text-ink-80"
        >
          {t.message}
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
          placeholder={t.messagePh}
          rows={5}
          className="block w-full resize-none rounded-card border border-hairline bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-60 focus:border-ink-40"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-ink px-5 py-3 font-display text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? t.sending : t.send}
      </button>
    </form>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
