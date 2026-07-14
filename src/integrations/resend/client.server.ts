import { Resend } from "resend";

/**
 * Shared Resend client construction -- used by every /helpdesk email
 * path (the Database Webhook receiver at
 * src/server/routes/api/helpdesk/notify.post.ts and sendSupportReply in
 * helpdesk.server.ts) so RESEND_API_KEY is read and the client
 * constructed in exactly one place. Server-only: never imported from
 * client code.
 */
export function createResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set.");
  }
  return new Resend(apiKey);
}

/** Email subject/header values don't tolerate embedded newlines -- strip them even though Resend's JSON API isn't classic SMTP. */
export function sanitizeEmailHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}
