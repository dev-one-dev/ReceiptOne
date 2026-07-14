import { TriangleAlert } from "lucide-react";
import {
  daysInPeriod,
  DAILY_INTEREST_LIMIT,
  DAILY_INTEREST_LIMIT_TAX_YEAR,
  type VehicleExpensesTotals,
} from "@/integrations/firebase/vehicle-expenses";
import { formatCurrency } from "@/lib/dashboard-format";

/** String form-state mirror of VehicleExpensesTotalsInput -- shared by the Add and Detail/Edit dialogs, same role ReceiptEditFields plays for receipts. */
export type VehicleExpensesForm = {
  startDate: string;
  endDate: string;
  totalKm: string;
  businessKm: string;
  fuel: string;
  insurance: string;
  maintenance: string;
  licenceRegistration: string;
  interest: string;
  leasing: string;
  parking: string;
  other: string;
};

export function blankVehicleExpensesForm(
  startDate: string,
  endDate: string,
  businessKmHint: number,
): VehicleExpensesForm {
  return {
    startDate,
    endDate,
    totalKm: "",
    businessKm: businessKmHint > 0 ? businessKmHint.toFixed(0) : "",
    fuel: "0.00",
    insurance: "0.00",
    maintenance: "0.00",
    licenceRegistration: "0.00",
    interest: "0.00",
    leasing: "0.00",
    parking: "0.00",
    other: "0.00",
  };
}

function parseFormDate(value: string): Date | null {
  return value ? new Date(`${value}T00:00:00`) : null;
}

export function parseVehicleExpensesForm(form: VehicleExpensesForm) {
  const n = (v: string) => parseFloat(v) || 0;
  return {
    startDate: parseFormDate(form.startDate),
    endDate: parseFormDate(form.endDate),
    totalKm: n(form.totalKm),
    businessKm: n(form.businessKm),
    fuel: n(form.fuel),
    insurance: n(form.insurance),
    maintenance: n(form.maintenance),
    licenceRegistration: n(form.licenceRegistration),
    interest: n(form.interest),
    leasing: n(form.leasing),
    parking: n(form.parking),
    other: n(form.other),
  };
}

const EXPENSE_FIELDS: { key: keyof VehicleExpensesForm; label: string }[] = [
  { key: "fuel", label: "Fuel" },
  { key: "insurance", label: "Insurance" },
  { key: "maintenance", label: "Maintenance and repairs" },
  { key: "licenceRegistration", label: "Licence and registration" },
  { key: "other", label: "Other" },
];

/**
 * Pure fields -- no Firestore calls, no save button -- shared by
 * AddVehicleExpensesDialog and VehicleExpensesDetailDialog's edit mode.
 * `totals` is always computed by the caller via
 * computeVehicleExpensesTotals so both dialogs and the eventual saved
 * record can never disagree on the math.
 */
export function VehicleExpensesFields({
  form,
  onChangeField,
  businessKmHint,
  year,
  currency,
  totals,
}: {
  form: VehicleExpensesForm;
  onChangeField: (patch: Partial<VehicleExpensesForm>) => void;
  businessKmHint: number;
  year: string;
  currency: string;
  totals: VehicleExpensesTotals;
}) {
  const rawInterest = parseFloat(form.interest) || 0;
  const periodDays = daysInPeriod(parseFormDate(form.startDate), parseFormDate(form.endDate));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">Period start</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => onChangeField({ startDate: e.target.value })}
            className="h-9 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">Period end</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => onChangeField({ endDate: e.target.value })}
            className="h-9 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">
            Total km driven (odometer)
          </label>
          <input
            value={form.totalKm}
            onChange={(e) => onChangeField({ totalKm: e.target.value })}
            inputMode="decimal"
            placeholder="18000"
            className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">Business km</label>
          <input
            value={form.businessKm}
            onChange={(e) => onChangeField({ businessKm: e.target.value })}
            inputMode="decimal"
            placeholder="0"
            className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          />
          {businessKmHint > 0 && (
            <p className="text-xs text-black/40">
              Your logbook shows {businessKmHint.toFixed(0)} km for {year}.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {EXPENSE_FIELDS.map(({ key, label }) => (
          <div key={key} className="space-y-1.5">
            <label className="block text-xs font-medium text-black/55">{label}</label>
            <input
              value={form[key]}
              onChange={(e) => onChangeField({ [key]: e.target.value })}
              inputMode="decimal"
              className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
            />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-black/55">Loan interest</label>
        <input
          value={form.interest}
          onChange={(e) => onChangeField({ interest: e.target.value })}
          inputMode="decimal"
          className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
        />
        <p className="text-xs text-black/40">
          CRA caps deductible interest at {formatCurrency(DAILY_INTEREST_LIMIT, currency)}/day for{" "}
          {DAILY_INTEREST_LIMIT_TAX_YEAR}. You entered {formatCurrency(rawInterest, currency)} —{" "}
          {formatCurrency(totals.deductibleInterest, currency)} is deductible ({periodDays} day
          {periodDays === 1 ? "" : "s"}).
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-black/55">Leasing costs</label>
        <input
          value={form.leasing}
          onChange={(e) => onChangeField({ leasing: e.target.value })}
          inputMode="decimal"
          className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
        />
        <p className="flex items-start gap-1.5 text-xs text-[#c2410c]">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Leasing costs are subject to a separate CRA limit (Chart C, based on the vehicle's
          manufacturer's list price) that this app doesn't yet compute. Verify your deductible
          leasing amount before filing.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-black/55">
          Parking (100% deductible — not prorated by business use)
        </label>
        <input
          value={form.parking}
          onChange={(e) => onChangeField({ parking: e.target.value })}
          inputMode="decimal"
          className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
        />
      </div>

      <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3 text-sm">
        <div className="flex items-center justify-between text-xs text-black/55">
          <span>
            Business use ({form.businessKm || "0"} / {form.totalKm || "0"} km)
          </span>
          <span className="font-medium text-black">{totals.businessUsePercent.toFixed(2)}%</span>
        </div>
        <div className="flex items-center justify-between text-xs text-black/55">
          <span>Interest — capped from {formatCurrency(rawInterest, currency)}</span>
          <span className="font-medium text-black">
            {formatCurrency(totals.deductibleInterest, currency)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-black/55">
          <span>
            {formatCurrency(totals.totalVehicleExpenses, currency)} vehicle expenses ×{" "}
            {totals.businessUsePercent.toFixed(2)}%
          </span>
          <span className="font-medium text-black">
            {formatCurrency(
              totals.totalVehicleExpenses * (totals.businessUsePercent / 100),
              currency,
            )}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-black/55">
          <span>+ Parking (100%, not prorated)</span>
          <span className="font-medium text-black">
            {formatCurrency(parseFloat(form.parking) || 0, currency)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-black/[0.07] pt-2 text-sm">
          <span className="font-semibold text-black">Deductible amount (line 9281)</span>
          <span className="font-semibold text-black">
            {formatCurrency(totals.totalDeductible, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
