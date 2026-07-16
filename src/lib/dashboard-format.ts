import type { DateFormat, DistanceUnit } from "@/components/dashboard/DashboardContext";

const KM_PER_MILE = 1.60934;

export function mkDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

export function kmToMi(km: number): number {
  return km / KM_PER_MILE;
}

export function miToKm(mi: number): number {
  return mi * KM_PER_MILE;
}

export function formatDate(date: Date, format: DateFormat): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  switch (format) {
    case "DD/MM/YYYY":
      return `${dd}/${mm}/${yyyy}`;
    case "YYYY-MM-DD":
      return `${yyyy}-${mm}-${dd}`;
    case "MM/DD/YYYY":
    default:
      return `${mm}/${dd}/${yyyy}`;
  }
}

export function formatDistance(valueInSelectedUnit: number, unit: DistanceUnit): string {
  return `${Math.round(valueInSelectedUnit)} ${unit}`;
}

export function distanceInUnit(km: number, unit: DistanceUnit): number {
  return unit === "km" ? km : kmToMi(km);
}

/** Formats a raw number using a specific ISO currency code (e.g. real Firestore records that carry their own `currency` field, or the region-derived fallback from DashboardContext) -- the only money formatter in the app; never assume a bare "$". */
export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}
