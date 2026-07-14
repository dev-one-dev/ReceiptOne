import { createHash, timingSafeEqual } from "node:crypto";
import { defineHandler } from "nitro";
import { createResendClient, sanitizeEmailHeaderValue } from "@/integrations/resend/client.server";
import { escapeHtml } from "@/lib/html-escape";

/**
 * Supabase Database Webhook target for INSERT on public.support_requests --
 * fires an email via Resend the instant a new ticket lands, so it doesn't
 * sit unseen in /helpdesk until someone happens to open the tool.
 *
 * This is NOT gated by requireHelpdeskAdmin/Supabase Auth -- it's called
 * by Supabase's own webhook infrastructure, not a signed-in admin, so it
 * authenticates via a shared secret header instead. It must never become
 * an open email-sending relay: the secret check runs before anything
 * else, responses never echo request data back, and every field pulled
 * from the payload is treated as attacker-controlled text (a support
 * message body is arbitrary user input) and HTML-escaped before it's
 * interpolated into the notification email.
 */

const NOTIFY_URL = "https://www.receipt-one.com/helpdesk/support";
const FROM_ADDRESS = "ReceiptOne Helpdesk <helpdesk@receipt-one.com>";

/** Fixed-length digest comparison so a wrong secret's length is never leaked via timing, on top of being constant-time itself. */
function timingSafeCompare(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

type SupabaseInsertWebhookPayload = {
  type?: unknown;
  table?: unknown;
  schema?: unknown;
  record?: unknown;
  old_record?: unknown;
};

export default defineHandler(async (event) => {
  const providedSecret = event.req.headers.get("x-webhook-secret") ?? "";
  const expectedSecret = process.env.HELPDESK_WEBHOOK_SECRET ?? "";

  if (!expectedSecret || !timingSafeCompare(providedSecret, expectedSecret)) {
    return new Response(null, { status: 401 });
  }

  let payload: SupabaseInsertWebhookPayload;
  try {
    payload = (await event.req.json()) as SupabaseInsertWebhookPayload;
  } catch (e) {
    console.error("[api/helpdesk/notify] couldn't parse request body as JSON:", e);
    return new Response(null, { status: 500 });
  }

  if (payload.type !== "INSERT" || payload.table !== "support_requests") {
    // Not something this endpoint cares about (a different table/event,
    // in case the webhook config ever widens) -- 200 so Supabase doesn't retry.
    return new Response(null, { status: 200 });
  }

  const record = (payload.record ?? {}) as Record<string, unknown>;
  const name = str(record.name);
  const email = str(record.email);
  const region = str(record.region);
  const subject = str(record.subject);
  const message = str(record.message);

  let resend;
  try {
    resend = createResendClient();
  } catch (e) {
    console.error("[api/helpdesk/notify]", e);
    return new Response(null, { status: 500 });
  }

  const recipients = (process.env.HELPDESK_NOTIFY_EMAIL ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
  if (recipients.length === 0) {
    console.error("[api/helpdesk/notify] HELPDESK_NOTIFY_EMAIL is not set or empty.");
    return new Response(null, { status: 500 });
  }

  const html = `
    <h2>New support request</h2>
    <p><strong>Name:</strong> ${escapeHtml(name || "—")}</p>
    <p><strong>Email:</strong> ${escapeHtml(email || "—")}</p>
    <p><strong>Region:</strong> ${escapeHtml(region || "—")}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject || "—")}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${escapeHtml(message || "—")}</p>
    <p><a href="${NOTIFY_URL}">Open in Helpdesk</a></p>
  `;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: recipients,
    subject: `New support request: ${sanitizeEmailHeaderValue(subject) || "(no subject)"}`,
    html,
  });

  if (error) {
    // The receipt-one.com sending domain is still being verified in
    // Resend as of this writing -- log clearly rather than failing
    // silently, and 500 so Supabase's webhook retry can pick it up once
    // it's verified.
    console.error("[api/helpdesk/notify] Resend error:", error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
});
