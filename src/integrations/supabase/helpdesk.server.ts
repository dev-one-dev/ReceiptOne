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

export type FeatureIdea = Tables<"feature_ideas">;
export type SupportRequest = Tables<"support_requests">;

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

function failIfError(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

/**
 * TEMPORARY DEBUGGING HELPER -- /helpdesk server functions were failing
 * with an empty {"error":{"message":""}} on the client and nothing in
 * Vercel's function logs, meaning something upstream was swallowing the
 * real error before it ever got logged. Every handler below now wraps
 * its body in try/catch and routes the failure through this so the full
 * message + stack always reach Vercel's logs, regardless of what the
 * framework does with the error afterward. Remove once the underlying
 * bug is found and fixed.
 */
function logAndRethrow(fnName: string, e: unknown): never {
  console.error(`[helpdesk.server:${fnName}] failed:`, e);
  if (e instanceof Error) {
    console.error(`[helpdesk.server:${fnName}] message="${e.message}"`);
    console.error(`[helpdesk.server:${fnName}] stack:`, e.stack);
  } else {
    console.error(`[helpdesk.server:${fnName}] non-Error thrown value, typeof=${typeof e}`, e);
  }
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
      const [
        pendingReview,
        totalIdeas,
        openSupport,
        totalVotes,
        pendingIdeas,
        latestSupportRequests,
      ] = await Promise.all([
        supabaseAdmin
          .from("feature_ideas")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending_review"),
        supabaseAdmin.from("feature_ideas").select("*", { count: "exact", head: true }),
        supabaseAdmin
          .from("support_requests")
          .select("*", { count: "exact", head: true })
          .neq("status", "resolved"),
        supabaseAdmin.from("feature_votes").select("*", { count: "exact", head: true }),
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

      failIfError(pendingReview.error);
      failIfError(totalIdeas.error);
      failIfError(openSupport.error);
      failIfError(totalVotes.error);
      failIfError(pendingIdeas.error);
      failIfError(latestSupportRequests.error);

      return {
        stats: {
          pendingReviewCount: pendingReview.count ?? 0,
          totalIdeasCount: totalIdeas.count ?? 0,
          openSupportCount: openSupport.count ?? 0,
          totalVotesCount: totalVotes.count ?? 0,
        },
        pendingIdeas: pendingIdeas.data ?? [],
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
      failIfError(error);
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
      failIfError(error);
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
      failIfError(error);
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
      failIfError(error);
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
      failIfError(error);
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
      failIfError(error);
    } catch (e) {
      logAndRethrow("deleteSupportRequest", e);
    }
  });
