import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { appUrl, SITE_URL } from "@/lib/external";

/**
 * Referral landing: /r/:code
 *
 * Persists the code on this origin (localStorage + a 30-day cookie) and
 * forwards to the web app's signup with ?ref= so attribution survives even
 * if the visitor comes back later without the link. The cookie is scoped to
 * the site's registrable domain when we're on it, so app.receipt-one.com
 * can read it too; on previews / localhost it stays host-only.
 */
const REFERRAL_KEY = "ro_referral";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function signupUrl(code: string): string {
  return appUrl(`/signup?ref=${encodeURIComponent(code)}`);
}

function persistReferral(code: string) {
  try {
    window.localStorage.setItem(REFERRAL_KEY, code);
  } catch {
    // Storage can be unavailable (private mode, blocked) -- the cookie and
    // the ?ref= query still carry the code.
  }

  const siteHost = new URL(SITE_URL).hostname;
  const host = window.location.hostname;
  const onSiteDomain = host === siteHost || host.endsWith(`.${siteHost}`);
  const parts = [
    `${REFERRAL_KEY}=${encodeURIComponent(code)}`,
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    "Path=/",
    "SameSite=Lax",
  ];
  if (onSiteDomain) parts.push(`Domain=${siteHost}`);
  if (window.location.protocol === "https:") parts.push("Secure");
  document.cookie = parts.join("; ");
}

export const Route = createFileRoute("/r/$code")({
  head: () => ({
    meta: [{ title: "Redirecting… | ReceiptOne" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ReferralRedirect,
});

function ReferralRedirect() {
  const { code } = Route.useParams();
  const target = signupUrl(code);

  useEffect(() => {
    persistReferral(code);
    window.location.replace(target);
  }, [code, target]);

  return (
    <main
      data-interactive-page
      className="flex min-h-screen items-center justify-center bg-paper px-4 font-sans text-ink antialiased"
    >
      <p className="text-body text-ink-60">
        Taking you to sign up…{" "}
        <a href={target} className="text-ink underline underline-offset-4">
          Continue
        </a>{" "}
        if nothing happens.
      </p>
    </main>
  );
}
