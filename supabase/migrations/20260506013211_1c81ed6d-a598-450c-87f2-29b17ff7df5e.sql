-- Remove overly permissive DELETE policy on feature_votes
DROP POLICY IF EXISTS "Anyone can delete own votes" ON public.feature_votes;

-- Tighten INSERT policies to require a non-empty device_id
DROP POLICY IF EXISTS "Anyone can create votes" ON public.feature_votes;
CREATE POLICY "Anyone can create votes"
  ON public.feature_votes
  FOR INSERT
  TO public
  WITH CHECK (device_id IS NOT NULL AND length(device_id) > 0);

DROP POLICY IF EXISTS "Anyone can create ideas" ON public.feature_ideas;
CREATE POLICY "Anyone can create ideas"
  ON public.feature_ideas
  FOR INSERT
  TO public
  WITH CHECK (
    device_id IS NOT NULL AND length(device_id) > 0
    AND length(title) > 0 AND length(title) <= 120
    AND length(description) > 0 AND length(description) <= 500
  );