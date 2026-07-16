import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type HomeOfficeTotals } from "@/integrations/firebase/home-office";
import { formatCurrency } from "@/lib/dashboard-format";

/**
 * Mirrors the mobile app's 6-step Home Office wizard, laid out as one
 * scrolling, sectioned form instead of a paginated wizard (better fit
 * for a wide desktop dialog) -- every section title, field label,
 * instruction, and option text below is copied verbatim from the mobile
 * spec, with one deliberate change: mobile's results text references
 * "T777 line 48" (the EMPLOYMENT-expenses form). This product is for
 * self-employed users, whose home-office deduction goes on T2125 line
 * 9945, so every T777/line-48 reference is replaced with 9945/T2125
 * wording in HomeOfficeSummary below. Nothing else in the copy changed.
 */
export type HomeOfficeForm = {
  forYear: string;
  homeRentType: string;
  workspaceType: string;
  workspaceUnit: string;
  homeSize: string;
  workspaceSize: string;
  startWorkDate: string;
  endWorkDate: string;
  rentExpenses: string;
  electricity: string;
  heat: string;
  insurance: string;
  internet: string;
  maintenance: string;
  propertyTaxes: string;
  other: string;
  otherExpenses: string;
};

export function blankHomeOfficeForm(forYear: string): HomeOfficeForm {
  return {
    forYear,
    homeRentType: "rent",
    workspaceType: "designated",
    workspaceUnit: "m2",
    homeSize: "",
    workspaceSize: "",
    startWorkDate: `${forYear}-01-01`,
    endWorkDate: `${forYear}-12-31`,
    rentExpenses: "0.00",
    electricity: "0.00",
    heat: "0.00",
    insurance: "0.00",
    internet: "0.00",
    maintenance: "0.00",
    propertyTaxes: "0.00",
    other: "0.00",
    otherExpenses: "0.00",
  };
}

function parseFormDate(value: string): Date | null {
  return value ? new Date(`${value}T00:00:00`) : null;
}

/**
 * A renter doesn't pay property tax on the home (their landlord does),
 * and an owner doesn't pay rent -- so each field only ever applies to
 * some housing situations. "changed" covers a mixed year (e.g. rented
 * part of the year, bought partway through), so it shows both.
 */
function rentApplies(homeRentType: string): boolean {
  return homeRentType === "rent" || homeRentType === "changed";
}
function propertyTaxesApply(homeRentType: string): boolean {
  return homeRentType === "own" || homeRentType === "changed";
}

/**
 * Zeroes any field that's inapplicable to the current housing situation
 * regardless of what's still sitting in form state -- the single choke
 * point computeHomeOfficeTotals and the Firestore write both go through,
 * so a hidden field can never silently contribute a stale amount (e.g. a
 * user entered rent, switched to Own, and the rent input disappeared
 * without its value being cleared). This is a backstop on top of
 * HomeOfficeFields' own onChangeField handler, which already zeroes the
 * form field itself the moment it's hidden -- belt and suspenders, since
 * this also covers records loaded from Firestore that might carry a
 * stale value from before this fix.
 */
export function parseHomeOfficeForm(form: HomeOfficeForm) {
  const n = (v: string) => parseFloat(v) || 0;
  return {
    forYear: form.forYear,
    homeRentType: form.homeRentType,
    workspaceType: form.workspaceType,
    workspaceUnit: form.workspaceUnit,
    startWorkDate: parseFormDate(form.startWorkDate),
    endWorkDate: parseFormDate(form.endWorkDate),
    homeSize: n(form.homeSize),
    workspaceSize: n(form.workspaceSize),
    rentExpenses: rentApplies(form.homeRentType) ? n(form.rentExpenses) : 0,
    electricity: n(form.electricity),
    heat: n(form.heat),
    insurance: n(form.insurance),
    internet: n(form.internet),
    maintenance: n(form.maintenance),
    propertyTaxes: propertyTaxesApply(form.homeRentType) ? n(form.propertyTaxes) : 0,
    other: n(form.other),
    otherExpenses: n(form.otherExpenses),
  };
}

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => String(currentYear - i));

const HOME_RENT_TYPE_OPTIONS = [
  { value: "rent", label: "Rent, and have not moved while working from home within the year" },
  { value: "own", label: "Own, and have not moved while working from home within the year" },
  { value: "changed", label: "Changed your residence or work space within the year" },
];

const WORKSPACE_TYPE_OPTIONS = [
  { value: "designated", label: "Designated work space (room)" },
  { value: "common", label: "Common area (not used exclusively for work)" },
];

const WORKSPACE_UNIT_OPTIONS = [
  { value: "m2", label: "Square metres (m²)" },
  { value: "ft2", label: "Square feet (ft²)" },
];

function unitLabel(unit: string): string {
  return unit === "ft2" ? "ft²" : "m²";
}

// Plain amount fields only -- no explanatory note underneath any of
// these, so they can share one clean grid where every input aligns on
// the same baseline (same reasoning as vehicle-expenses' AMOUNT_FIELDS).
// Rent and property taxes are NOT here -- both are conditional on
// housing situation (rentApplies/propertyTaxesApply above) and rendered
// separately below, alongside the logic that zeroes them out on hide.
const EXPENSE_FIELDS: { key: keyof HomeOfficeForm; label: string }[] = [
  { key: "electricity", label: "Electricity" },
  { key: "heat", label: "Heat" },
  { key: "insurance", label: "Insurance" },
  { key: "internet", label: "Internet" },
  { key: "maintenance", label: "Maintenance" },
];

const selectTriggerClass = "h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none";
const inputClass =
  "h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25";
const labelClass = "block text-xs font-medium text-black/55";

export function HomeOfficeFields({
  form,
  onChangeField,
  currency,
  totals,
}: {
  form: HomeOfficeForm;
  onChangeField: (patch: Partial<HomeOfficeForm>) => void;
  currency: string;
  totals: HomeOfficeTotals;
}) {
  const unit = unitLabel(form.workspaceUnit);
  const rentPeriod =
    form.startWorkDate && form.endWorkDate ? `${form.startWorkDate} to ${form.endWorkDate}` : "";

  return (
    <div className="space-y-5">
      {/* Step 1/6 -- Calculate your expenses */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-black">Calculate your expenses</h3>
        <p className="text-xs text-black/50">Before you continue, make sure you have:</p>
        <ul className="list-disc space-y-0.5 pl-4 text-xs text-black/50">
          <li>The tax year you're claiming for</li>
          <li>Your home's total finished area and your workspace's size</li>
          <li>The dates you worked from home during the year</li>
          <li>Your home expense records (rent, utilities, insurance, etc.) for that period</li>
        </ul>
        <div className="space-y-1.5 pt-1">
          <label className={labelClass}>What year are you claiming home office expenses?</label>
          <Select value={form.forYear} onValueChange={(v) => onChangeField({ forYear: v })}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Step 2/6 -- Your flat details */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-black">Your flat details</h3>

        <div className="space-y-1.5">
          <label className={labelClass}>What is your housing situation?</label>
          <Select
            value={form.homeRentType}
            onValueChange={(v) => {
              // Zero whichever of rent/property-taxes is no longer
              // applicable under the new housing situation -- a hidden
              // field must never keep contributing a stale amount to the
              // total once it disappears from the form.
              const patch: Partial<HomeOfficeForm> = { homeRentType: v };
              if (!rentApplies(v)) patch.rentExpenses = "0.00";
              if (!propertyTaxesApply(v)) patch.propertyTaxes = "0.00";
              onChangeField(patch);
            }}
          >
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOME_RENT_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>What type of space do you work from at home?</label>
          <Select
            value={form.workspaceType}
            onValueChange={(v) => onChangeField({ workspaceType: v })}
          >
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WORKSPACE_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Choose your preferred measurement units</label>
          <Select
            value={form.workspaceUnit}
            onValueChange={(v) => onChangeField({ workspaceUnit: v })}
          >
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WORKSPACE_UNIT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelClass}>Total finished area of your home, {unit}</label>
            <input
              value={form.homeSize}
              onChange={(e) => onChangeField({ homeSize: e.target.value })}
              inputMode="decimal"
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Designated work space (room) size, {unit}</label>
            <input
              value={form.workspaceSize}
              onChange={(e) => onChangeField({ workspaceSize: e.target.value })}
              inputMode="decimal"
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Step 3/6 -- Summary of calculated space */}
      <div className="space-y-1.5 rounded-xl bg-black/[0.03] px-4 py-3">
        <h3 className="text-sm font-semibold text-black">Summary of calculated space</h3>
        <p className="text-sm text-black">
          {form.workspaceSize || "0"} {unit} / {form.homeSize || "0"} {unit} ={" "}
          <span className="font-semibold">{totals.workspacePercent.toFixed(2)}%</span>
        </p>
        <p className="text-xs text-black/50">
          of your home used as a workspace and for employment purposes
        </p>
      </div>

      {/* Step 4/6 -- Period of work */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-black">Period of work</h3>
        <p className="text-xs text-black/50">Period of time worked at home within the year</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className={labelClass}>Start date</label>
            <input
              type="date"
              value={form.startWorkDate}
              onChange={(e) => onChangeField({ startWorkDate: e.target.value })}
              className={`${inputClass} appearance-none`}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Finish date</label>
            <input
              type="date"
              value={form.endWorkDate}
              onChange={(e) => onChangeField({ endWorkDate: e.target.value })}
              className={`${inputClass} appearance-none`}
            />
          </div>
        </div>
      </div>

      {/* Step 5/6 -- Work-space-in-the-home expenses */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-black">Work-space-in-the-home expenses</h3>
        <p className="text-xs text-black/50">
          Enter the total amount you paid for an expense for the period(s) you worked from home.
          Enter $0 if you are not claiming the expense.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rentApplies(form.homeRentType) && (
            <div className="space-y-1.5">
              <label className="line-clamp-2 min-h-8 text-xs font-medium leading-4 text-black/55">
                {rentPeriod ? `Total rent you paid from ${rentPeriod}` : "Total rent you paid"}
              </label>
              <input
                value={form.rentExpenses}
                onChange={(e) => onChangeField({ rentExpenses: e.target.value })}
                inputMode="decimal"
                className={inputClass}
              />
            </div>
          )}
          {propertyTaxesApply(form.homeRentType) && (
            <div className="space-y-1.5">
              <label className="line-clamp-2 min-h-8 text-xs font-medium leading-4 text-black/55">
                Property taxes
              </label>
              <input
                value={form.propertyTaxes}
                onChange={(e) => onChangeField({ propertyTaxes: e.target.value })}
                inputMode="decimal"
                className={inputClass}
              />
            </div>
          )}
          {EXPENSE_FIELDS.map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <label className="line-clamp-2 min-h-8 text-xs font-medium leading-4 text-black/55">
                {label}
              </label>
              <input
                value={form[key]}
                onChange={(e) => onChangeField({ [key]: e.target.value })}
                inputMode="decimal"
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step 6/6 -- Maintenance costs */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-black">Maintenance costs</h3>
        <p className="text-xs text-black/50">
          Enter the total amounts you paid for maintenance costs for the period(s) you worked from
          home. Indicate separately the costs of maintenance that affect:
        </p>
        <ul className="list-disc space-y-0.5 pl-4 text-xs text-black/50">
          <li>the entire home (for example, furnace repairs), and</li>
          <li>
            the designated work space (room) only (for example, purchase of light bulbs for the work
            space)
          </li>
        </ul>
        <p className="text-xs text-black/50">Enter $0 if you are not claiming the expense.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="line-clamp-2 min-h-8 text-xs font-medium leading-4 text-black/55">
              Expenses paid for the entire home and work space
            </label>
            <input
              value={form.other}
              onChange={(e) => onChangeField({ other: e.target.value })}
              inputMode="decimal"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="line-clamp-2 min-h-8 text-xs font-medium leading-4 text-black/55">
              Expenses paid for the work space only
            </label>
            <input
              value={form.otherExpenses}
              onChange={(e) => onChangeField({ otherExpenses: e.target.value })}
              inputMode="decimal"
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * "Summary of the employment-use amount" -- mobile's own results-screen
 * heading. Split out from HomeOfficeFields so callers can pin it
 * full-width outside the fields' scroll container, same
 * fixed-header/scrollable-middle/fixed-footer shape used for Vehicle
 * Expenses and the Tax Summary preview.
 */
export function HomeOfficeSummary({
  totals,
  currency,
}: {
  totals: HomeOfficeTotals;
  currency: string;
}) {
  return (
    <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3 text-sm">
      <p className="font-semibold text-black">Summary of the employment-use amount</p>
      <div className="flex items-center justify-between text-xs text-black/55">
        <span>
          {formatCurrency(totals.totalHomeExpenses, currency)} home expenses ×{" "}
          {totals.workspacePercent.toFixed(2)}%
        </span>
        <span className="font-medium text-black">
          {formatCurrency(totals.totalEmploymentHomeExpenses, currency)}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-black/55">
        <span>
          {formatCurrency(totals.totalWorkspaceExpenses, currency)} workspace expenses × 100%
        </span>
        <span className="font-medium text-black">
          {formatCurrency(totals.totalEmploymentWorkspaceExpenses, currency)}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-black/[0.07] pt-2">
        <span className="font-semibold text-black">
          {formatCurrency(totals.totalEmploymentExpenses, currency)} is the employment-use portion
        </span>
      </div>
      <p className="text-xs text-black/50">
        The percentage of your designated work space (room) used for employment-use is{" "}
        {totals.workspacePercent.toFixed(2)}%, that will be used on expenses claimed for the work
        space only (e.g. maintenance).
      </p>
      <p className="text-xs text-black/50">This amount will go on line 9945 of the T2125 form.</p>
      <p className="text-xs text-black/40">
        Print and keep this record. You will need the amounts below when filling out the T2125 form.
        Keep your printed results in case we review your claim later and ask to see your
        calculations.
      </p>
    </div>
  );
}
