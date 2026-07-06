-- Fixes votes_count silently failing to increment for pending_review
-- ideas (e.g. the creator's own auto-vote on submit).
--
-- Root cause, confirmed live: Postgres requires a row to pass the
-- table's SELECT policy, not just the applicable UPDATE policy's USING
-- clause, to be a valid UPDATE target. recompute_idea_votes() runs as
-- SECURITY INVOKER (the default), so when anon votes on a pending_review
-- idea, its `UPDATE feature_ideas SET votes_count = votes_count + 1`
-- executes as anon -- and pending_review rows fail anon's SELECT policy
-- (added in the moderation-gate migration), so the UPDATE silently
-- matches zero rows. No error, just no-op, exactly like the original
-- "0 votes" bug from before that migration, for the same underlying
-- reason applied to a new case.
--
-- Fix: make the trigger function SECURITY DEFINER so it runs with its
-- owner's privileges (postgres, which has BYPASSRLS) instead of the
-- calling role's -- this is vote-count bookkeeping, not a user-facing
-- row edit, so it should never have depended on the caller's own RLS
-- visibility into the row to begin with.
ALTER FUNCTION public.recompute_idea_votes() SECURITY DEFINER;

-- anon/authenticated no longer need direct UPDATE access at all -- only
-- this (now-privileged) trigger ever changes votes_count. Removing it
-- also closes a previously-flagged gap: a direct API call could
-- otherwise set votes_count to any non-negative value directly, since
-- the only prior safeguard was `votes_count >= 0` in WITH CHECK.
REVOKE UPDATE ON public.feature_ideas FROM anon, authenticated;
DROP POLICY "Anyone can update vote count" ON public.feature_ideas;
