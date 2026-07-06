-- Moderation gate for user-submitted feature ideas.
--
-- Previously every submission went straight to `under_review` and was
-- immediately public (the SELECT policy was `USING (true)` with no
-- status filter at all) -- both the widget's list and the dashboard's
-- Roadmap page rely on RLS alone to decide what's visible, so this is
-- the correct place to enforce the gate rather than adding a status
-- filter to every client query.
--
-- New default: submissions land as `pending_review` and stay invisible
-- to SELECT until a moderator changes the status (via Table Editor for
-- now; via the admin dashboard's future service-role client later --
-- both bypass RLS, so no new UPDATE policy is needed for moderation).
ALTER TABLE public.feature_ideas
  ALTER COLUMN status SET DEFAULT 'pending_review';

ALTER POLICY "Anyone can view ideas"
  ON public.feature_ideas
  USING (status != 'pending_review');

-- Also closes a real gap: previously nothing stopped a direct API call
-- (bypassing the widget entirely) from inserting a row with
-- status: 'published' outright. WITH CHECK evaluates against the final
-- row including defaults, so this accepts the widget's normal insert
-- (which omits status and gets the new default) while rejecting any
-- insert that explicitly sets a different status.
ALTER POLICY "Anyone can create ideas"
  ON public.feature_ideas
  WITH CHECK (
    device_id IS NOT NULL AND length(device_id) > 0
    AND length(title) > 0 AND length(title) <= 120
    AND length(description) > 0 AND length(description) <= 500
    AND status = 'pending_review'
  );

-- Basic profanity/spam filter. Deliberately basic, not comprehensive --
-- a first line of defense, not a moderation system. Rejects at the
-- database level (not just client-side) so it can't be bypassed by a
-- direct API call, with a friendly custom message via RAISE EXCEPTION
-- that the widget's existing errorMessage() helper already surfaces.
CREATE OR REPLACE FUNCTION public.filter_flagged_feature_idea()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.title ~* '\y(fuck|shit|bitch|asshole|cunt|nigger|faggot)\y'
     OR NEW.description ~* '\y(fuck|shit|bitch|asshole|cunt|nigger|faggot)\y' THEN
    RAISE EXCEPTION 'Please keep submissions civil — try rephrasing your idea.';
  END IF;

  IF NEW.title ~* '(https?://|www\.)' OR NEW.description ~* '(https?://|www\.)' THEN
    RAISE EXCEPTION 'Links aren''t allowed in submissions.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER feature_ideas_content_filter
  BEFORE INSERT ON public.feature_ideas
  FOR EACH ROW
  EXECUTE FUNCTION public.filter_flagged_feature_idea();
