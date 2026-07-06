-- Fix votes_count never incrementing: feature_ideas had no RLS UPDATE
-- policy at all. RLS enabled + no matching policy means Postgres silently
-- matches zero rows for that command (no error) -- exactly what
-- recompute_idea_votes()'s trigger-driven `UPDATE feature_ideas SET
-- votes_count = votes_count + 1` was hitting on every vote, despite the
-- feature_votes row itself inserting successfully.
--
-- Also tightens the previous migration's blanket UPDATE grant: that
-- granted UPDATE on every column, which combined with a permissive RLS
-- policy would let anon/authenticated rewrite title/description/status
-- directly through the REST API, not just votes_count. Narrowing to a
-- column-scoped grant so only votes_count is writable at all, regardless
-- of how permissive the row-level policy is.
REVOKE UPDATE ON public.feature_ideas FROM anon, authenticated;
GRANT UPDATE (votes_count) ON public.feature_ideas TO anon, authenticated;

CREATE POLICY "Anyone can update vote count"
  ON public.feature_ideas
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (votes_count >= 0);
