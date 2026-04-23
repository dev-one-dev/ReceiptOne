-- Status enum
CREATE TYPE public.feature_idea_status AS ENUM ('under_review', 'planned', 'coming_soon', 'published');

-- Ideas table
CREATE TABLE public.feature_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) > 0 AND char_length(title) <= 80),
  description TEXT NOT NULL CHECK (char_length(description) > 0 AND char_length(description) <= 220),
  status public.feature_idea_status NOT NULL DEFAULT 'under_review',
  votes_count INTEGER NOT NULL DEFAULT 0,
  device_id TEXT NOT NULL,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_feature_ideas_votes ON public.feature_ideas (votes_count DESC);
CREATE INDEX idx_feature_ideas_created ON public.feature_ideas (created_at DESC);
CREATE INDEX idx_feature_ideas_status ON public.feature_ideas (status);

-- Votes table
CREATE TABLE public.feature_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.feature_ideas(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (idea_id, device_id)
);

CREATE INDEX idx_feature_votes_device ON public.feature_votes (device_id);

-- Enable RLS
ALTER TABLE public.feature_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read
CREATE POLICY "Anyone can view ideas"
  ON public.feature_ideas FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create ideas"
  ON public.feature_ideas FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view votes"
  ON public.feature_votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create votes"
  ON public.feature_votes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete own votes"
  ON public.feature_votes FOR DELETE
  USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_feature_ideas_updated_at
  BEFORE UPDATE ON public.feature_ideas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Recompute votes_count
CREATE OR REPLACE FUNCTION public.recompute_idea_votes()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feature_ideas
      SET votes_count = votes_count + 1
      WHERE id = NEW.idea_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feature_ideas
      SET votes_count = GREATEST(votes_count - 1, 0)
      WHERE id = OLD.idea_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER feature_votes_count_trigger
  AFTER INSERT OR DELETE ON public.feature_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.recompute_idea_votes();