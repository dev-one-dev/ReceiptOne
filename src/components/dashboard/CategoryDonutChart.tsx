import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Receipt } from "@/integrations/firebase/receipts";
import { formatCurrency } from "@/lib/dashboard-format";

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

  return (
    <div className="mt-3 rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <h2 className="text-sm font-semibold text-black">Spending by category</h2>
      <p className="mt-1 text-xs text-black/50">For {year}</p>

      {loading ? (
        <div className="flex h-[220px] items-center justify-center text-sm text-black/45">
          Loading…
        </div>
      ) : slices.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center text-sm text-black/45">
          No expenses yet for {year}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-[220px] w-full shrink-0 sm:w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {slices.map((slice) => (
                    <Cell key={slice.category} fill={slice.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _name, item) => [
                    formatCurrency(value, currency),
                    item.payload.category,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full flex-1 space-y-2">
            {slices.map((slice) => (
              <div key={slice.category} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.color }}
                    aria-hidden
                  />
                  <span className="truncate text-black/70">{slice.category}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2 tabular-nums">
                  <span className="font-medium text-black">
                    {formatCurrency(slice.amount, currency)}
                  </span>
                  <span className="text-xs text-black/40">{slice.percentage.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
