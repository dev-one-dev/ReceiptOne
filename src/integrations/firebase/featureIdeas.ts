// Community feature ideas -- the `featureIdeas` Firestore collection shared
// with the web portal. The site never touches the collection directly: every
// read and write goes through the portal's callables (Cloud Functions v2,
// us-central1), which accept an App Check-verified caller. Contract:
// ReceiptOne-Web-Portal/functions/src/ideas/*.ts and docs/SUPPORT_AND_IDEAS.md.
//
// Anonymous visitors are identified by `anonId`, an opaque uuid persisted in
// localStorage. The server hashes it into the vote key (never stored raw), so
// a repeat vote from the same browser is a no-op rather than a second vote.
import { httpsCallable } from "firebase/functions";
import { functions } from "@/integrations/firebase/client";

// Lifecycle: pending_review (hidden) → open (approved: public, votable) →
// planned / in_progress / done (on the roadmap: public, voting closed), or
// rejected (hidden). Mirrors IDEA_STATUSES in the portal's functions/src/ideas/types.ts.
export const FEATURE_IDEA_STATUSES = [
  "pending_review",
  "open",
  "planned",
  "in_progress",
  "done",
  "rejected",
] as const;
export type FeatureIdeaStatus = (typeof FEATURE_IDEA_STATUSES)[number];

/** Statuses voteFeatureIdea accepts votes on. */
export function isVotableFeatureIdeaStatus(status: FeatureIdeaStatus): boolean {
  return status === "open";
}

/** Wire shape returned by listPublicFeatureIdeas (`ApiIdea` server-side). */
export interface FeatureIdea {
  id: string;
  title: string;
  description: string;
  status: FeatureIdeaStatus;
  votes_count: number;
  /** ISO timestamp. */
  created_at: string;
}

// Same caps as functions/src/ideas/validateIdea.ts.
export const IDEA_LIMITS = { min: 3, title: 120, description: 500 } as const;

const ANON_ID_KEY = "ro_anon_id";

/** Stable per-browser id for the App Check-only vote path. `null` during SSR. */
export function getAnonId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

interface ListPayload {
  anonId: string | null;
}
interface ListResult {
  ideas: FeatureIdea[];
  votedIdeaIds: string[];
}
interface SubmitPayload {
  title: string;
  description: string;
  source: "website";
  locale: string | null;
  region: string | null;
  /** Keys the author's automatic vote (hashed server-side, like voting). */
  anonId: string | null;
}
interface VotePayload {
  ideaId: string;
  anonId: string | null;
}
export interface VoteResult {
  votes: number;
  alreadyVoted: boolean;
}

const listPublicFeatureIdeas = httpsCallable<ListPayload, ListResult>(
  functions,
  "listPublicFeatureIdeas",
);
const submitFeatureIdea = httpsCallable<SubmitPayload, { id: string }>(
  functions,
  "submitFeatureIdea",
);
const voteFeatureIdea = httpsCallable<VotePayload, VoteResult>(functions, "voteFeatureIdea");

export interface CommunityIdeas {
  ideas: FeatureIdea[];
  /** Ids this browser (by anonId) has already voted for. */
  votedIdeaIds: Set<string>;
}

/** Every publicly-visible idea (open / planned / in_progress / done), most-voted first. */
export async function fetchCommunityIdeas(): Promise<CommunityIdeas> {
  const { data } = await listPublicFeatureIdeas({ anonId: getAnonId() });
  return {
    ideas: Array.isArray(data?.ideas) ? data.ideas : [],
    votedIdeaIds: new Set(Array.isArray(data?.votedIdeaIds) ? data.votedIdeaIds : []),
  };
}

/**
 * Submits a new idea. Lands as `pending_review` and stays out of
 * fetchCommunityIdeas until staff open it for voting. The author's own vote
 * is counted server-side at creation (keyed by this browser's anonId), so
 * the idea starts at 1 vote and this browser cannot vote for it again.
 */
export async function submitCommunityIdea(params: {
  title: string;
  description: string;
  region: string | null;
  locale: string | null;
}): Promise<string> {
  const { data } = await submitFeatureIdea({
    title: params.title.slice(0, IDEA_LIMITS.title),
    description: params.description.slice(0, IDEA_LIMITS.description),
    source: "website",
    locale: params.locale,
    region: params.region,
    anonId: getAnonId(),
  });
  return data.id;
}

/** Idempotent per anonId: a repeat vote returns `alreadyVoted: true`, not an error. */
export async function voteForIdea(ideaId: string): Promise<VoteResult> {
  const { data } = await voteFeatureIdea({ ideaId, anonId: getAnonId() });
  return data;
}
