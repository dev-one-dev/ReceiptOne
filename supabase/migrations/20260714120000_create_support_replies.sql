-- Reply history for support_requests -- every in-app reply the admin
-- sends from /helpdesk (via Resend, see
-- src/integrations/supabase/helpdesk.server.ts's sendSupportReply) gets
-- a row here so the ticket keeps its conversation thread.
--
-- Nobody but service_role ever touches this table: no anon/authenticated
-- grant, no RLS policy for either role (service_role bypasses RLS
-- entirely regardless). The GRANT below is deliberately explicit --
-- this project's database lost its service_role grants once before
-- during a post-incident rebuild, which cost hours of debugging because
-- that access had been assumed to be inherited rather than granted.
-- Never assume again; state it here so it survives a rebuild.
CREATE TABLE public.support_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  support_request_id UUID NOT NULL REFERENCES public.support_requests(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_by TEXT
);

CREATE INDEX idx_support_replies_support_request ON public.support_replies (support_request_id, sent_at);

ALTER TABLE public.support_replies ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies for anon/authenticated -- service_role
-- bypasses RLS entirely, and nothing else should ever read or write
-- this table.

GRANT SELECT, INSERT ON public.support_replies TO service_role;
