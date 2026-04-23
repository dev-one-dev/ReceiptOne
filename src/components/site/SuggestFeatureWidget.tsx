import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Region = "ca" | "us";
type Status = "under_review" | "planned" | "coming_soon" | "published";

interface SimilarIdea {
  id: string;
  title: string;
  description: string;
  votes_count: number;
  status: Status;
}

interface AiPreview {
  title: string;
  description: string;
  similar: SimilarIdea[];
}

const QUICK_OPTIONS = [
  "QuickBooks sync",
  "Better mileage reports",
  "Bulk receipt categorization",
  "Accountant dashboard",
];

const STATUS_LABEL: Record<Status, string> = {
  under_review: "Under review",
  planned: "Planned",
  coming_soon: "Coming soon",
  published: "Published",
};

function getDeviceId(): string {
  if (typeof window === "undefined") return "ssr";
  const KEY = "ro_device_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

function getVotedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem("ro_voted_ideas");
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function persistVotedSet(set: Set<string>) {
  localStorage.setItem("ro_voted_ideas", JSON.stringify(Array.from(set)));
}

type Step = "input" | "preview" | "success";

export function SuggestFeatureWidget({ region }: { region: Region }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<AiPreview | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const deviceId = useMemo(getDeviceId, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // don't auto-close to avoid losing input; require explicit close
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const reset = () => {
    setStep("input");
    setInput("");
    setPreview(null);
    setSuccessMsg("");
  };

  const closeAll = () => {
    setOpen(false);
    setTimeout(reset, 250);
  };

  const generatePreview = async (raw: string) => {
    const text = raw.trim();
    if (text.length < 3) {
      toast.error("Please describe your idea (at least 3 characters).");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("preview-feature-idea", {
        body: { input: text },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      setPreview(data as AiPreview);
      setStep("preview");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to analyze idea";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const submitNew = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const { data: idea, error } = await supabase
        .from("feature_ideas")
        .insert({
          title: preview.title.slice(0, 80),
          description: preview.description.slice(0, 220),
          device_id: deviceId,
          region,
        })
        .select("id")
        .single();
      if (error) throw error;
      // Auto-vote for own idea
      if (idea?.id) {
        await supabase.from("feature_votes").insert({ idea_id: idea.id, device_id: deviceId });
        const voted = getVotedSet();
        voted.add(idea.id);
        persistVotedSet(voted);
      }
      setSuccessMsg("Your idea was submitted");
      setStep("success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to submit";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const voteExisting = async (ideaId: string) => {
    const voted = getVotedSet();
    if (voted.has(ideaId)) {
      setSuccessMsg("You already voted for this idea");
      setStep("success");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("feature_votes")
        .insert({ idea_id: ideaId, device_id: deviceId });
      if (error && !`${error.message}`.toLowerCase().includes("duplicate")) throw error;
      voted.add(ideaId);
      persistVotedSet(voted);
      setSuccessMsg("Your vote was added");
      setStep("success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to vote";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Suggest a feature"
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 font-display text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all hover:scale-[1.02] hover:opacity-90 sm:bottom-8 sm:right-8"
        >
          <SparkIcon />
          Suggest a feature
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Suggest a feature"
          className="fixed bottom-6 right-6 z-40 w-[min(92vw,420px)] overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:bottom-8 sm:right-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 bg-white px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-black text-white">
                <SparkIcon className="size-3.5" />
              </span>
              <span className="font-display text-sm font-semibold text-black">
                {step === "success" ? "Thanks!" : "Suggest a feature"}
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
            {step === "input" && (
              <div className="space-y-4">
                <p className="font-display text-base font-semibold text-black">
                  What feature do you want most?
                </p>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 500))}
                  placeholder="Describe your idea…"
                  rows={3}
                  className="block w-full resize-none rounded-2xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm leading-5 text-black outline-none transition-colors placeholder:text-black/40 focus:border-black/40"
                />
                <div>
                  <p className="mb-2 font-sans text-xs uppercase tracking-wide text-black/50">
                    Quick picks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_OPTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          setInput(q);
                          generatePreview(q);
                        }}
                        className="rounded-full border border-black/15 bg-white px-3 py-1.5 font-sans text-xs text-black transition-colors hover:bg-black hover:text-white"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={loading || input.trim().length < 3}
                  onClick={() => generatePreview(input)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? <Spinner /> : <SparkIcon className="size-3.5" />}
                  {loading ? "Analyzing…" : "Preview with AI"}
                </button>
              </div>
            )}

            {step === "preview" && preview && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-black/10 bg-[#faf9f6] p-4">
                  <p className="mb-1 font-sans text-[11px] uppercase tracking-wide text-black/50">
                    AI preview
                  </p>
                  <p className="font-display text-base font-semibold leading-snug text-black">
                    {preview.title}
                  </p>
                  <p className="mt-1 font-sans text-sm leading-5 text-black/70">
                    {preview.description}
                  </p>
                </div>

                {preview.similar.length > 0 && (
                  <div>
                    <p className="mb-2 font-sans text-[11px] uppercase tracking-wide text-black/50">
                      Existing similar ideas
                    </p>
                    <ul className="space-y-2">
                      {preview.similar.map((s) => (
                        <li
                          key={s.id}
                          className="rounded-2xl border border-black/10 bg-white p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-display text-sm font-semibold text-black">
                                {s.title}
                              </p>
                              <p className="mt-0.5 line-clamp-2 font-sans text-xs leading-4 text-black/60">
                                {s.description}
                              </p>
                              <p className="mt-1 font-sans text-[10px] uppercase tracking-wide text-black/40">
                                {STATUS_LABEL[s.status]} · {s.votes_count} votes
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => voteExisting(s.id)}
                              disabled={loading}
                              className="shrink-0 rounded-full border border-black bg-white px-3 py-1.5 font-display text-xs font-semibold text-black transition-colors hover:bg-black hover:text-white disabled:opacity-40"
                            >
                              ▲ Vote
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep("input")}
                    disabled={loading}
                    className="flex-1 rounded-full border border-black/20 bg-white px-4 py-2.5 font-display text-sm font-semibold text-black transition-colors hover:bg-black/5"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={submitNew}
                    disabled={loading}
                    className="flex-[2] rounded-full bg-black px-4 py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {loading ? "Submitting…" : "Submit as new"}
                  </button>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="space-y-5 py-4 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-black text-white">
                  <CheckIcon />
                </div>
                <p className="font-display text-lg font-semibold text-black">
                  {successMsg}
                </p>
                <p className="font-sans text-sm text-black/60">
                  We review every suggestion. Status will update to Planned or Coming soon
                  when we pick it up.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={reset}
                    className="flex-1 rounded-full border border-black/20 bg-white px-4 py-2.5 font-display text-sm font-semibold text-black transition-colors hover:bg-black/5"
                  >
                    Suggest another
                  </button>
                  <button
                    type="button"
                    onClick={closeAll}
                    className="flex-1 rounded-full bg-black px-4 py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Done
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

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}