-- Adds the pending_review status ahead of the moderation-gate migration
-- that follows. Kept as its own migration: ALTER TYPE ... ADD VALUE has
-- had transaction-safety restrictions across Postgres versions when the
-- new value is used later in the same transaction as the ADD VALUE
-- itself -- splitting into two migration files sidesteps that entirely
-- rather than relying on the current server's exact version behavior.
ALTER TYPE public.feature_idea_status ADD VALUE 'pending_review';
