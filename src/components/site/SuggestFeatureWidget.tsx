import { useEffect, useRef, useState } from "react";
import {
  IDEA_LIMITS,
  fetchCommunityIdeas,
  submitCommunityIdea,
  voteForIdea,
  type FeatureIdea,
  type FeatureIdeaStatus,
} from "@/integrations/firebase/featureIdeas";
import { callableErrorMessage, isRateLimited } from "@/integrations/firebase/callable-error";
import { toast } from "sonner";

type Region = "ca" | "us";

// Data goes through the portal's Cloud Functions (App Check-only path, no
// account): listPublicFeatureIdeas / submitFeatureIdea / voteFeatureIdea.
// The anonymous voter key (`ro_anon_id` in localStorage) is generated in
// integrations/firebase/featureIdeas.ts and hashed server-side.
type Idea = FeatureIdea;

const QUICK_OPTIONS = [
  "QuickBooks sync",
  "Better mileage reports",
  "Bulk receipt categorization",
  "Accountant dashboard",
];

// Full server enum. The public list only ever contains planned /
// in_progress / done; the other two are here so the type stays exhaustive.
const STATUS_LABEL: Record<FeatureIdeaStatus, string> = {
  pending_review: "Pending review",
  planned: "Planned",
  in_progress: "In progress",
  done: "Done",
  rejected: "Not planned",
};

const REGION_LOCALE: Record<Region, string> = { ca: "en-CA", us: "en-US" };

type Step = "list" | "input" | "success";

export function SuggestFeatureWidget({ region }: { region: Region }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("list");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [nearFooter, setNearFooter] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);
  // Seeded from the server on every load (keyed by this browser's anonId),
  // then updated optimistically after a successful vote.
  const [votedIds, setVotedIds] = useState<Set<string>>(() => new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // don't auto-close to avoid losing input; require explicit close
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Hide the floating trigger once the footer (with its own store-badge CTAs)
  // scrolls into view, so this widget never competes with the actual install CTA.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting), {
      rootMargin: "0px 0px -10% 0px",
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const loadIdeas = async () => {
    setIdeasLoading(true);
    try {
      const { ideas: list, votedIdeaIds } = await fetchCommunityIdeas();
      setIdeas(list);
      setVotedIds(votedIdeaIds);
    } catch (e) {
      toast.error(callableErrorMessage(e, "Failed to load ideas. Please try again."));
    } finally {
      setIdeasLoading(false);
    }
  };

  // Load (and refresh) the list every time the panel opens.
  useEffect(() => {
    if (open) loadIdeas();
  }, [open]);

  const reset = () => {
    setStep("list");
    setTitle("");
    setDescription("");
    setSuccessMsg("");
  };

  const closeAll = () => {
    setOpen(false);
    setTimeout(reset, 250);
  };

  const backToList = () => {
    setStep("list");
    loadIdeas();
  };

  const voteOnIdea = async (ideaId: string) => {
    if (votedIds.has(ideaId)) return;
    setVotingId(ideaId);
    try {
      // Idempotent server-side: a repeat vote comes back as alreadyVoted with
      // the unchanged count rather than an error.
      const { votes, alreadyVoted } = await voteForIdea(ideaId);
      setVotedIds((prev) => new Set(prev).add(ideaId));
      setIdeas((prev) =>
        prev.map((idea) => (idea.id === ideaId ? { ...idea, votes_count: votes } : idea)),
      );
      if (!alreadyVoted) toast.success("Vote added");
    } catch (e) {
      toast.error(
        isRateLimited(e)
          ? "Too many votes from your connection right now. Please try again in an hour."
          : callableErrorMessage(e, "Failed to vote. Please try again."),
      );
    } finally {
      setVotingId(null);
    }
  };

  const submitNew = async () => {
    const t = title.trim();
    const d = description.trim();
    if (t.length < IDEA_LIMITS.min) {
      toast.error(`Give your idea a short title (at least ${IDEA_LIMITS.min} characters).`);
      return;
    }
    if (d.length < IDEA_LIMITS.min) {
      toast.error(
        `Add a bit more detail in the description (at least ${IDEA_LIMITS.min} characters).`,
      );
      return;
    }
    setLoading(true);
    try {
      // New ideas land as pending_review and are hidden from the public list
      // (and closed to voting, including by the author) until staff triage
      // them -- so unlike the old Supabase flow there is no auto-vote here.
      await submitCommunityIdea({
        title: t,
        description: d,
        region,
        locale: REGION_LOCALE[region],
      });
      setSuccessMsg("Your idea was submitted");
      setStep("success");
    } catch (e) {
      toast.error(
        isRateLimited(e)
          ? "You've submitted a few ideas recently. Please wait an hour before sending another."
          : callableErrorMessage(e, "Failed to submit. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button — hidden once the footer's own install CTAs are in view */}
      {!open && !nearFooter && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Suggest a feature"
          className="fixed bottom-4 right-4 z-40 inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-black px-4 py-2.5 font-display text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all hover:scale-[1.02] hover:opacity-90 sm:bottom-8 sm:right-8 sm:px-5 sm:py-3"
        >
          <SparkIcon />
          <span className="truncate sm:max-w-none">Suggest a feature</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Suggest a feature"
          className="fixed bottom-4 right-4 z-40 w-[min(calc(100vw-2rem),420px)] overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:bottom-8 sm:right-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 bg-white px-5 py-4">
            <div className="flex items-center gap-2">
              {step === "input" && (
                <button
                  type="button"
                  onClick={backToList}
                  aria-label="Back to ideas"
                  className="rounded-full p-1 text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                >
                  <ArrowLeftIcon />
                </button>
              )}
              <span className="flex size-7 items-center justify-center rounded-full bg-black text-white">
                <SparkIcon className="size-3.5" />
              </span>
              <span className="font-display text-sm font-semibold text-black">
                {step === "success"
                  ? "Thanks!"
                  : step === "input"
                    ? "Suggest a feature"
                    : "Feature ideas"}
              </span>
            </div>
            <button
              type="button"
              onClick={closeAll}
              aria-label="Close"
              className="rounded-full p-1 text-black/60 transition-colors hover:bg-black/5 hover:text-black"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto p-5">
            {step === "list" && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <SparkIcon className="size-3.5" />
                  Suggest new idea
                </button>

                {ideasLoading && (
                  <div className="flex justify-center py-8">
                    <Spinner className="size-6 text-black/30" />
                  </div>
                )}

                {!ideasLoading && ideas.length === 0 && (
                  <p className="py-8 text-center font-sans text-sm text-black/60">
                    No ideas yet — be the first to suggest one.
                  </p>
                )}

                {!ideasLoading && ideas.length > 0 && (
                  <ul className="space-y-2">
                    {ideas.map((idea) => {
                      const voted = votedIds.has(idea.id);
                      return (
                        <li
                          key={idea.id}
                          className="rounded-2xl border border-black/10 bg-white p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-display text-sm font-semibold text-black">
                                {idea.title}
                              </p>
                              <p className="mt-0.5 line-clamp-2 font-sans text-xs leading-4 text-black/60">
                                {idea.description}
                              </p>
                              <p className="mt-1 font-sans text-[10px] uppercase tracking-wide text-black/60">
                                {STATUS_LABEL[idea.status]} · {idea.votes_count} votes
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => voteOnIdea(idea.id)}
                              disabled={voted || votingId === idea.id}
                              className={`shrink-0 rounded-full border px-3 py-1.5 font-display text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
                                voted
                                  ? "border-black/15 bg-black/[0.04] text-black/50"
                                  : "border-black bg-white text-black hover:bg-black hover:text-white disabled:opacity-40"
                              }`}
                            >
                              {voted ? "✓ Voted" : "▲ Vote"}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {step === "input" && (
              <div className="space-y-4">
                <p className="font-display text-base font-semibold text-black">
                  What feature do you want most?
                </p>

                <div className="space-y-1.5">
                  <label
                    htmlFor="feature-title"
                    className="block font-sans text-xs font-medium text-black/70"
                  >
                    Title
                  </label>
                  <input
                    id="feature-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 120))}
                    placeholder="e.g. QuickBooks sync"
                    className="block w-full rounded-2xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm leading-5 text-black outline-none transition-colors placeholder:text-black/55 focus:border-black/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="feature-description"
                    className="block font-sans text-xs font-medium text-black/70"
                  >
                    Description
                  </label>
                  <textarea
                    id="feature-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                    placeholder="What would this feature do, and why do you need it?"
                    rows={3}
                    className="block w-full resize-none rounded-2xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm leading-5 text-black outline-none transition-colors placeholder:text-black/55 focus:border-black/40"
                  />
                </div>

                <div>
                  <p className="mb-2 font-sans text-xs uppercase tracking-wide text-black/60">
                    Quick picks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_OPTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setTitle(q)}
                        className="rounded-full border border-black/15 bg-white px-3 py-1.5 font-sans text-xs text-black transition-colors hover:bg-black hover:text-white"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading || title.trim().length < 3 || description.trim().length < 3}
                  onClick={submitNew}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? <Spinner /> : <SparkIcon className="size-3.5" />}
                  {loading ? "Submitting…" : "Submit"}
                </button>
              </div>
            )}

            {step === "success" && (
              <div className="space-y-5 py-4 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-black text-white">
                  <CheckIcon />
                </div>
                <p className="font-display text-lg font-semibold text-black">{successMsg}</p>
                <p className="font-sans text-sm text-black/60">
                  We review every suggestion. Status will update to Planned or In progress when we
                  pick it up.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={backToList}
                    className="flex-1 rounded-full border border-black/20 bg-white px-4 py-2.5 font-display text-sm font-semibold text-black transition-colors hover:bg-black/5"
                  >
                    Back to ideas
                  </button>
                  <button
                    type="button"
                    onClick={closeAll}
                    className="flex-1 rounded-full bg-black px-4 py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function SparkIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l1.8 4.6L18.4 9.4l-4.6 1.8L12 15.8l-1.8-4.6L5.6 9.4l4.6-1.8L12 3z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
