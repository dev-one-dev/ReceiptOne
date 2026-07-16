import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import type { Receipt } from "@/integrations/firebase/receipts";
import { formatCurrency } from "@/lib/dashboard-format";

// Neither is a real, selectable value on the Receipts page's own
// category filter -- "Other" is synthetic (small categories folded
// together here), and "Uncategorized" stands in for a blank
// companyCategory, which that page's own derived category list
// excludes (r.companyCategory, blanks filtered out). Clicking either
// one goes to Receipts unfiltered rather than with a category param
// that could never match anything there.
const UNFILTERABLE_CATEGORIES = new Set(["Other", "Uncategorized"]);

const ACTIVE_OUTER_RADIUS = 92;

// A local, minimal shape instead of reaching into recharts' internal
// (non-exported-from-package-root) PieSectorDataItem type -- the Pie
// component's activeShape prop passes an object with (at least) these
// fields at render time regardless, so this is enough to render Sector.
type ActiveShapeProps = {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
};

function renderActiveShape(props: ActiveShapeProps) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={ACTIVE_OUTER_RADIUS}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      className="outline-none focus:outline-none focus-visible:outline-none"
    />
  );
}

// Deliberately no orange (#f97316 is this app's own brand accent, used
// on every stat card icon) and no black -- a distinct categorical
// palette so a category slice never gets mistaken for a brand element.
const CATEGORY_COLORS = [
  "#2563eb", // blue
  "#0d9488", // teal
  "#7c3aed", // violet
  "#db2777", // pink
  "#16a34a", // green
  "#0891b2", // cyan
  "#4f46e5", // indigo
  "#65a30d", // lime
];
const OTHER_COLOR = "#9ca3af";

// Categories under this share of the total get folded into one "Other"
// slice, so the legend stays readable when an account has many
// distinct receipt categories.
const OTHER_THRESHOLD_PERCENT = 3;

type CategorySlice = { category: string; amount: number; percentage: number; color: string };

/** Same aggregation approach as groupReceiptsByCategory in ReportPreviewDialog.tsx (Expense Summary): sum price per companyCategory, "Uncategorized" for a blank category. */
function buildSlices(receipts: Receipt[]): CategorySlice[] {
  const totals = new Map<string, number>();
  for (const r of receipts) {
    const key = r.companyCategory || "Uncategorized";
    totals.set(key, (totals.get(key) ?? 0) + r.price);
  }

  const total = Array.from(totals.values()).reduce((sum, v) => sum + v, 0);
  if (total <= 0) return [];

  const grouped = Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount, percentage: (amount / total) * 100 }))
    .sort((a, b) => b.amount - a.amount);

  const main: { category: string; amount: number; percentage: number }[] = [];
  let otherAmount = 0;
  for (const g of grouped) {
    if (g.percentage < OTHER_THRESHOLD_PERCENT) {
      otherAmount += g.amount;
    } else {
      main.push(g);
    }
  }
  if (otherAmount > 0) {
    main.push({ category: "Other", amount: otherAmount, percentage: (otherAmount / total) * 100 });
  }

  let colorIndex = 0;
  return main.map((slice) => {
    if (slice.category === "Other") return { ...slice, color: OTHER_COLOR };
    const color = CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length];
    colorIndex += 1;
    return { ...slice, color };
  });
}

/**
 * Read-only, client-side aggregation over receipts the caller already
 * fetched -- no Firestore reads or writes of its own. `receipts` should
 * already be scoped to the selected tax year by the caller.
 */
export function CategoryDonutChart({
  receipts,
  year,
  loading,
}: {
  receipts: Receipt[];
  year: string;
  loading: boolean;
}) {
  const currency = receipts[0]?.currency ?? "CAD";
  const slices = buildSlices(receipts);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const goToCategory = (category: string) => {
    if (UNFILTERABLE_CATEGORIES.has(category)) {
      void navigate({ to: "/dashboard/receipts" });
    } else {
      void navigate({ to: "/dashboard/receipts", search: { category } });
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <h2 className="text-sm font-semibold text-black">Spending by category</h2>
      <p className="mt-1 text-xs text-black/50">For {year}</p>

      {loading ? (
        <div className="flex h-[220px] items-center justify-center text-sm text-black/45">
          Loading…
        </div>
      ) : slices.length === 0 ? (
        <div className="flex h-[220px] flex-col items-center justify-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-black/[0.04] text-black/25">
            <PieChartIcon className="size-5" aria-hidden />
          </span>
          <div className="space-y-1.5">
            <p className="max-w-xs text-sm text-black/45">
              No expenses yet for {year} — scan a receipt to see your spending breakdown.
            </p>
            <button
              type="button"
              onClick={() => void navigate({ to: "/dashboard/receipts" })}
              className="text-xs font-medium text-[#f97316] transition-colors hover:text-[#f97316]/80"
            >
              Go to Receipts
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6 sm:mx-auto sm:w-fit sm:flex-row">
          <div className="h-[200px] w-[200px] shrink-0 outline-none [&_*]:outline-none [&_*]:focus:outline-none [&_*]:focus-visible:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={(_, index) => goToCategory(slices[index].category)}
                  className="outline-none focus:outline-none focus-visible:outline-none"
                >
                  {slices.map((slice, index) => (
                    <Cell
                      key={slice.category}
                      fill={slice.color}
                      stroke="none"
                      className="outline-none focus:outline-none focus-visible:outline-none"
                      style={{
                        opacity: activeIndex === null || activeIndex === index ? 1 : 0.45,
                        transition: "opacity 150ms",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full max-w-xs shrink-0 space-y-2 sm:w-72">
            {slices.map((slice, index) => (
              <div
                key={slice.category}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => goToCategory(slice.category)}
                className={[
                  "flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 text-sm transition-colors",
                  activeIndex === index ? "bg-black/[0.04]" : "",
                ].join(" ")}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-black/70">{slice.category}</span>
                <span className="shrink-0 font-medium tabular-nums text-black">
                  {formatCurrency(slice.amount, currency)}
                </span>
                <span className="w-9 shrink-0 text-right text-xs tabular-nums text-black/40">
                  {slice.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
