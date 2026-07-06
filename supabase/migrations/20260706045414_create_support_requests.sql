-- Contact/support form submissions.
--
-- Unlike feature_ideas, these are not public: support requests may contain
-- personal information, so there is deliberately no SELECT/UPDATE/DELETE
-- grant or policy for anon/authenticated. Only service_role (which
-- bypasses RLS entirely) can read or manage these -- e.g. a future admin
-- dashboard using the service-role key server-side.
--
-- The RLS INSERT policy's WITH CHECK mirrors the table's own CHECK
-- constraints exactly, on purpose: feature_ideas had these two drift out
-- of sync across separate migrations, and a value that passed one but not
-- the other silently failed inserts. Keep these numerically identical if
-- either is ever changed.
CREATE TYPE public.support_request_status AS ENUM ('new', 'in_progress', 'resolved');

CREATE TABLE public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) > 0 AND char_length(name) <= 120),
  email TEXT NOT NULL CHECK (
    char_length(email) > 0 AND char_length(email) <= 254
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  subject TEXT NOT NULL CHECK (char_length(subject) > 0 AND char_length(subject) <= 200),
  message TEXT NOT NULL CHECK (char_length(message) > 0 AND char_length(message) <= 2000),
  status public.support_request_status NOT NULL DEFAULT 'new',
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_support_requests_status ON public.support_requests (status);
CREATE INDEX idx_support_requests_created ON public.support_requests (created_at DESC);

ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a support request"
  ON public.support_requests
  FOR INSERT
  TO public
  WITH CHECK (
    char_length(name) > 0 AND char_length(name) <= 120
    AND char_length(email) > 0 AND char_length(email) <= 254
    AND char_length(subject) > 0 AND char_length(subject) <= 200
    AND char_length(message) > 0 AND char_length(message) <= 2000
  );

GRANT INSERT ON public.support_requests TO anon, authenticated;

-- Reuses the existing update_updated_at_column() trigger function --
-- already generic, not tied to feature_ideas.
CREATE TRIGGER update_support_requests_updated_at
  BEFORE UPDATE ON public.support_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
