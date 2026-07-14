/**
 * All data access for the /helpdesk admin dashboard, both reads and
 * writes, for both tables. Every export here is a TanStack Start server
 * function gated by requireHelpdeskAdmin (Supabase JWT + ADMIN_USER_IDS
 * allowlist, checked server-side on every call) and reads/writes through
 * supabaseAdmin (service role) -- never the browser client.
 *
 * support_requests has no SELECT/UPDATE grant for anon/authenticated, so
 * this module is the only way this app can read or change it at all.
 * feature_ideas is publicly readable, but status changes here still need
 * to go through the service role, since giving anyone an UPDATE grant
 * would let any visitor rewrite the public roadmap.
 */
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireHelpdeskAdmin } from "@/integrations/supabase/auth-middleware";
import type { Tables } from "@/integrations/supabase/types";
import { createResendClient, sanitizeEmailHeaderValue } from "@/integrations/resend/client.server";
import { escapeHtml } from "@/lib/html-escape";

export type FeatureIdea = Tables<"feature_ideas">;
export type SupportRequest = Tables<"support_requests">;
export type SupportReply = Tables<"support_replies">;

export const FEATURE_IDEA_STATUSES = [
  "pending_review",
  "under_review",
  "planned",
  "coming_soon",
  "published",
] as const;
export type FeatureIdeaStatus = (typeof FEATURE_IDEA_STATUSES)[number];

export const SUPPORT_REQUEST_STATUSES = ["new", "in_progress", "resolved"] as const;
export type SupportRequestStatus = (typeof SUPPORT_REQUEST_STATUSES)[number];

/** Every status except pending_review is visible on the public roadmap. */
export function isPubliclyVisible(status: FeatureIdeaStatus): boolean {
  return status !== "pending_review";
}

/**
 * PostgrestError carries message/code/details/hint -- reading only
 * `.message` throws a textless Error whenever the actual cause lives in
 * `code`/`details`/`hint` instead. `label` identifies which query
 * failed, since a bare error/message alone doesn't say which of several
 * parallel queries in a Promise.all it came from. Logs the untouched
 * raw error object server-side before throwing a clean, readable
 * message built from whatever fields are actually populated.
 */
function failIfError(
  error: { message: string; code?: string; details?: string; hint?: string } | null,
  label: string,
): void {
  if (!error) return;
  console.error(`[helpdesk.server] ${label} failed:`, error);
  const segments = [
    error.code ? `[${error.code}]` : null,
    error.message ? error.message : null,
    error.details ? `details: ${error.details}` : null,
    error.hint ? `hint: ${error.hint}` : null,
  ].filter((s): s is string => Boolean(s));
  const text =
    segments.length > 0 ? segments.join(" — ") : `empty error object: ${JSON.stringify(error)}`;
  throw new Error(`[${label}] ${text}`);
}

/** Logs unexpected failures server-side before rethrowing, so Vercel's function logs always show what actually happened. */
function logAndRethrow(fnName: string, e: unknown): never {
  console.error(`[helpdesk.server:${fnName}] failed:`, e);
  throw e;
}

// ---------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------

export type HelpdeskOverview = {
  stats: {
    pendingReviewCount: number;
    totalIdeasCount: number;
    openSupportCount: number;
    totalVotesCount: number;
  };
  pendingIdeas: FeatureIdea[];
  latestSupportRequests: SupportRequest[];
};

/**
 * One combined call for the Overview page -- stats, the pending_review
 * queue, and the latest support requests. Also doubles as the "is this
 * session actually an admin" check the layout runs once on sign-in,
 * since it exercises requireHelpdeskAdmin exactly like every other call.
 */
export const fetchHelpdeskOverview = createServerFn({ method: "POST" })
  .middleware([requireHelpdeskAdmin])
  .handler(async (): Promise<HelpdeskOverview> => {
    try {
      // No `head: true` here -- a HEAD request has no response body, and
      // this runtime's fetch/Supabase client combination hands back a
      // degenerate, code-less `{ message: "" }` error when it tries to
      // parse one anyway. `.select("id", { count: "exact" })` gets a
      // real (tiny) body to parse instead. pendingReviewCount needs no
      // query of its own at all -- pendingIdeas below already fetches
      // every pending_review row in full, so its length IS the count.
      const [totalIdeas, openSupport, totalVotes, pendingIdeas, latestSupportRequests] =
        await Promise.all([
          supabaseAdmin.from("feature_ideas").select("id", { count: "exact" }),
          supabaseAdmin
            .from("support_requests")
            .select("id", { count: "exact" })
            .neq("status", "resolved"),
          supabaseAdmin.from("feature_votes").select("id", { count: "exact" }),
          supabaseAdmin
            .from("feature_ideas")
            .select("*")
            .eq("status", "pending_review")
            .order("created_at", { ascending: false }),
          supabaseAdmin
            .from("support_requests")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

      failIfError(totalIdeas.error, "totalIdeas count (feature_ideas)");
      failIfError(openSupport.error, "openSupport count (support_requests, status!=resolved)");
      failIfError(totalVotes.error, "totalVotes count (feature_votes)");
      failIfError(pendingIdeas.error, "pendingIdeas rows (feature_ideas, status=pending_review)");
      failIfError(latestSupportRequests.error, "latestSupportRequests rows (support_requests)");

      const pendingIdeaRows = pendingIdeas.data ?? [];

      return {
        stats: {
          pendingReviewCount: pendingIdeaRows.length,
          totalIdeasCount: totalIdeas.count ?? 0,
          openSupportCount: openSupport.count ?? 0,
          totalVotesCount: totalVotes.count ?? 0,
        },
        pendingIdeas: pendingIdeaRows,
        latestSupportRequests: latestSupportRequests.data ?? [],
      };
    } catch (e) {
      logAndRethrow("fetchHelpdeskOverview", e);
    }
  });

// ---------------------------------------------------------------------
// Feature ideas
// ---------------------------------------------------------------------

/** All ideas, newest first -- /helpdesk/ideas does search/sort/filter client-side over this. */
export const fetchAllIdeas = createServerFn({ method: "POST" })
  .middleware([requireHelpdeskAdmin])
  .handler(async (): Promise<FeatureIdea[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("feature_ideas")
        .select("*")
        .order("created_at", { ascending: false });
      failIfError(error, "fetchAllIdeas");
      return data ?? [];
    } catch (e) {
      logAndRethrow("fetchAllIdeas", e);
    }
  });

const updateIdeaStatusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(FEATURE_IDEA_STATUSES),
});

export const updateIdeaStatus = createServerFn({ method: "POST" })
  .middleware([requireHelpdeskAdmin])
  .inputValidator(updateIdeaStatusInput)
  .handler(async ({ data }): Promise<FeatureIdea> => {
    try {
      const { data: row, error } = await supabaseAdmin
        .from("feature_ideas")
        .update({ status: data.status, updated_at: new Date().toISOString() })
        .eq("id", data.id)
        .select("*")
        .single();
      failIfError(error, "updateIdeaStatus");
      if (!row) throw new Error("Idea not found.");
      return row;
    } catch (e) {
      logAndRethrow("updateIdeaStatus", e);
    }
  });

const idInput = z.object({ id: z.string().uuid() });

/** A real, permanent hard delete -- used for spam. Callers must confirm with the admin first. */
export const deleteIdea = createServerFn({ method: "POST" })
  .middleware([requireHelpdeskAdmin])
  .inputValidator(idInput)
  .handler(async ({ data }): Promise<void> => {
    try {
      const { error } = await supabaseAdmin.from("feature_ideas").delete().eq("id", data.id);
      failIfError(error, "deleteIdea");
    } catch (e) {
      logAndRethrow("deleteIdea", e);
    }
  });

// ---------------------------------------------------------------------
// Support requests
// ---------------------------------------------------------------------

/** All support requests, newest first -- /helpdesk/support does search/filter client-side over this. */
export const fetchAllSupportRequests = createServerFn({ method: "POST" })
  .middleware([requireHelpdeskAdmin])
  .handler(async (): Promise<SupportRequest[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("support_requests")
        .select("*")
        .order("created_at", { ascending: false });
      failIfError(error, "fetchAllSupportRequests");
      return data ?? [];
    } catch (e) {
      logAndRethrow("fetchAllSupportRequests", e);
    }
  });

const updateSupportStatusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(SUPPORT_REQUEST_STATUSES),
});

export const updateSupportRequestStatus = createServerFn({ method: "POST" })
  .middleware([requireHelpdeskAdmin])
  .inputValidator(updateSupportStatusInput)
  .handler(async ({ data }): Promise<SupportRequest> => {
    try {
      const { data: row, error } = await supabaseAdmin
        .from("support_requests")
        .update({ status: data.status, updated_at: new Date().toISOString() })
        .eq("id", data.id)
        .select("*")
        .single();
      failIfError(error, "updateSupportRequestStatus");
      if (!row) throw new Error("Support request not found.");
      return row;
    } catch (e) {
      logAndRethrow("updateSupportRequestStatus", e);
    }
  });

/** A real, permanent hard delete. Callers must confirm with the admin first. */
export const deleteSupportRequest = createServerFn({ method: "POST" })
  .middleware([requireHelpdeskAdmin])
  .inputValidator(idInput)
  .handler(async ({ data }): Promise<void> => {
    try {
      const { error } = await supabaseAdmin.from("support_requests").delete().eq("id", data.id);
      failIfError(error, "deleteSupportRequest");
    } catch (e) {
      logAndRethrow("deleteSupportRequest", e);
    }
  });

const supportRequestIdInput = z.object({ supportRequestId: z.string().uuid() });

/** A ticket's reply thread, oldest first (newest last) -- fetched separately from the ticket list, only for whichever ticket the panel has open. */
export const fetchSupportReplies = createServerFn({ method: "POST" })
  .middleware([requireHelpdeskAdmin])
  .inputValidator(supportRequestIdInput)
  .handler(async ({ data }): Promise<SupportReply[]> => {
    try {
      const { data: rows, error } = await supabaseAdmin
        .from("support_replies")
        .select("*")
        .eq("support_request_id", data.supportRequestId)
        .order("sent_at", { ascending: true });
      failIfError(error, "fetchSupportReplies");
      return rows ?? [];
    } catch (e) {
      logAndRethrow("fetchSupportReplies", e);
    }
  });

const sendSupportReplyInput = z.object({
  supportRequestId: z.string().uuid(),
  body: z.string().trim().min(1, "Reply can't be empty."),
});

export type SendSupportReplyResult = {
  reply: SupportReply;
  request: SupportRequest;
};

/**
 * Sends the admin's reply to the requester's real email via Resend, from
 * support@receipt-one.com with reply-to set to the same address -- so
 * the user sees a reply from the company, not a private individual, and
 * their own reply lands in the real support inbox rather than the
 * admin's personal one. Only writes support_replies (and only bumps
 * status new -> in_progress, never auto-resolves) once the email has
 * actually sent -- a reply that wasn't delivered must never look like
 * it was, so a Resend failure never touches the database at all.
 */
export const sendSupportReply = createServerFn({ method: "POST" })
  .middleware([requireHelpdeskAdmin])
  .inputValidator(sendSupportReplyInput)
  .handler(async ({ data, context }): Promise<SendSupportReplyResult> => {
    try {
      const { data: request, error: requestError } = await supabaseAdmin
        .from("support_requests")
        .select("*")
        .eq("id", data.supportRequestId)
        .single();
      failIfError(requestError, "sendSupportReply: load support request");
      if (!request) throw new Error("Support request not found.");

      const resend = createResendClient();

      // The original message is attacker-controlled text (it's the
      // requester's own submission) -- escaped just like the admin's
      // own reply body, both landing in an HTML email.
      const html = `
        <p style="white-space: pre-wrap;">${escapeHtml(data.body)}</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
        <p style="color: #666; font-size: 12px;">You originally wrote:</p>
        <blockquote style="border-left: 3px solid #ddd; margin: 0; padding-left: 12px; color: #666; white-space: pre-wrap;">${escapeHtml(request.message)}</blockquote>
      `;

      const { error: sendError } = await resend.emails.send({
        from: "ReceiptOne Support <support@receipt-one.com>",
        to: request.email,
        replyTo: "support@receipt-one.com",
        subject: `Re: ${sanitizeEmailHeaderValue(request.subject) || "your support request"}`,
        html,
      });

      if (sendError) {
        console.error("[helpdesk.server:sendSupportReply] Resend error:", sendError);
        throw new Error(`Couldn't send the reply email: ${sendError.message}`);
      }

      const { data: replyRow, error: insertError } = await supabaseAdmin
        .from("support_replies")
        .insert({
          support_request_id: data.supportRequestId,
          body: data.body,
          sent_by: context.userId,
        })
        .select("*")
        .single();
      failIfError(insertError, "sendSupportReply: insert reply row");
      if (!replyRow) throw new Error("Reply row not returned after insert.");

      let updatedRequest = request;
      if (request.status === "new") {
        const { data: statusRow, error: statusError } = await supabaseAdmin
          .from("support_requests")
          .update({ status: "in_progress", updated_at: new Date().toISOString() })
          .eq("id", data.supportRequestId)
          .select("*")
          .single();
        failIfError(statusError, "sendSupportReply: bump status to in_progress");
        if (statusRow) updatedRequest = statusRow;
      }

      return { reply: replyRow, request: updatedRequest };
    } catch (e) {
      logAndRethrow("sendSupportReply", e);
    }
  });
