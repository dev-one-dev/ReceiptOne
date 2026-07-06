import { createFileRoute } from "@tanstack/react-router";
import { GitCommitHorizontal, Milestone, Rocket } from "lucide-react";

export const Route = createFileRoute("/dashboard/roadmap")({
  component: RoadmapPage,
});

type RoadmapStatus = "Under review" | "Planned" | "In progress" | "Shipped";

type RoadmapItem = {
  title: string;
  description: string;
  status: RoadmapStatus;
};

const ROADMAP: RoadmapItem[] = [
  { title: "QuickBooks sync", description: "Two-way sync with QuickBooks Online.", status: "Planned" },
  { title: "Bulk receipt categorization", description: "Select multiple receipts and recategorize at once.", status: "In progress" },
  { title: "Accountant dashboard", description: "A shared view your accountant can access directly.", status: "Under review" },
  { title: "Mileage auto-tracking", description: "Background GPS tracking for automatic trip logging.", status: "Shipped" },
];

const STATUS_STYLE: Record<RoadmapStatus, string> = {
  "Under review": "bg-black/[0.05] text-black/60",
  Planned: "bg-[#f97316]/10 text-[#c2410c]",
  "In progress": "bg-[#f97316]/15 text-[#c2410c]",
  Shipped: "bg-black text-white",
};

type ChangelogEntry = {
  date: string;
  title: string;
  description: string;
};

const CHANGELOG: ChangelogEntry[] = [
  { date: "Jul 2026", title: "Mileage auto-tracking", description: "Trips are now logged automatically in the background." },
  { date: "Jun 2026", title: "Faster receipt scanning", description: "Receipt OCR now processes in under 2 seconds on average." },
  { date: "May 2026", title: "New expense categories", description: "Added Software, Meals, and Office Rent as default categories." },
  { date: "Apr 2026", title: "CSV export", description: "Reports can now be exported as CSV in addition to PDF." },
  { date: "Mar 2026", title: "Bulk delete", description: "Select multiple receipts to delete them in one action." },
];

function RoadmapPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Roadmap & Changelog</h1>
        <p className="mt-1 text-sm text-black/55">See what's planned next and what's already shipped.</p>
      </div>

      {/* Roadmap */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <Milestone className="size-4 text-black/40" aria-hidden />
          <h2 className="text-sm font-semibold text-black">Roadmap</h2>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROADMAP.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-black">{item.title}</h3>
                <span className={["shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", STATUS_STYLE[item.status]].join(" ")}>
                  {item.status}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-black/55">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Changelog */}
      <div className="mt-8">
        <div className="flex items-center gap-2">
          <Rocket className="size-4 text-black/40" aria-hidden />
          <h2 className="text-sm font-semibold text-black">Changelog</h2>
        </div>
        <div className="mt-3 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <ul>
            {CHANGELOG.map((entry, i) => (
              <li
                key={entry.date + entry.title}
                className={["flex gap-4 px-5 py-4", i !== 0 ? "border-t border-black/[0.05]" : ""].join(" ")}
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-black/40">
                  <GitCommitHorizontal className="size-3.5" aria-hidden />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-black">{entry.title}</span>
                    <span className="text-xs text-black/40">{entry.date}</span>
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-black/55">{entry.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
