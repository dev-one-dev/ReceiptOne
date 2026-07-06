-- Widen feature_ideas' CHECK constraints to match the RLS policy limits.
--
-- The 2026-05-06 migration widened the INSERT policy's allowed lengths to
-- title <= 120 and description <= 500, but never updated the table's own
-- CHECK constraints, which were still enforcing the original 2026-04-23
-- limits (title <= 80, description <= 220). RLS policies and CHECK
-- constraints are independent gates that both must pass, so any insert
-- with a title/description longer than the old limits but within the new
-- one was silently rejected at the database level despite passing RLS.
ALTER TABLE public.feature_ideas
  DROP CONSTRAINT feature_ideas_title_check,
  ADD CONSTRAINT feature_ideas_title_check
    CHECK (char_length(title) > 0 AND char_length(title) <= 120);

ALTER TABLE public.feature_ideas
  DROP CONSTRAINT feature_ideas_description_check,
  ADD CONSTRAINT feature_ideas_description_check
    CHECK (char_length(description) > 0 AND char_length(description) <= 500);
