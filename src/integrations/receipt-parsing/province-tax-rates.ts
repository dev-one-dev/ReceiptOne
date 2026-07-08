/**
 * Ported verbatim from the mobile app's provinceList (custom_functions.dart)
 * -- used only for the state-based tax-name disambiguation step in
 * parse-receipt.ts. isRefundable is deliberately NOT stored here; it's
 * always computed by the shared isRefundableByName() helper at the point
 * of use, matching how mobile derives it rather than hardcoding it per row.
 */
export type ProvinceTaxRate = { taxName: string; taxPercent: number };
export type ProvinceTaxInfo = { region: string; taxes: ProvinceTaxRate[] };

const CA_PROVINCE_TAXES: ProvinceTaxInfo[] = [
  { region: "Ontario", taxes: [{ taxName: "HST", taxPercent: 13 }] },
  { region: "New Brunswick", taxes: [{ taxName: "HST", taxPercent: 15 }] },
  { region: "Nova Scotia", taxes: [{ taxName: "HST", taxPercent: 15 }] },
  { region: "Prince Edward Island", taxes: [{ taxName: "HST", taxPercent: 15 }] },
  { region: "Newfoundland and Labrador", taxes: [{ taxName: "HST", taxPercent: 15 }] },
  {
    region: "British Columbia",
    taxes: [
      { taxName: "GST", taxPercent: 5 },
      { taxName: "PST", taxPercent: 7 },
    ],
  },
  {
    region: "Saskatchewan",
    taxes: [
      { taxName: "GST", taxPercent: 5 },
      { taxName: "PST", taxPercent: 6 },
    ],
  },
  {
    region: "Manitoba",
    taxes: [
      { taxName: "GST", taxPercent: 5 },
      { taxName: "RST", taxPercent: 7 },
    ],
  },
  {
    region: "Quebec",
    taxes: [
      { taxName: "GST", taxPercent: 5 },
      { taxName: "QST", taxPercent: 9.975 },
    ],
  },
  { region: "Alberta", taxes: [{ taxName: "GST", taxPercent: 5 }] },
  { region: "Yukon", taxes: [{ taxName: "GST", taxPercent: 5 }] },
  { region: "Northwest Territories", taxes: [{ taxName: "GST", taxPercent: 5 }] },
  { region: "Nunavut", taxes: [{ taxName: "GST", taxPercent: 5 }] },
];

const US_STATE_TAXES: ProvinceTaxInfo[] = [
  { region: "Alabama", taxes: [{ taxName: "State Sales Tax", taxPercent: 4.0 }] },
  { region: "Alaska", taxes: [{ taxName: "State Sales Tax", taxPercent: 0.0 }] },
  { region: "Arizona", taxes: [{ taxName: "State Sales Tax", taxPercent: 5.6 }] },
  { region: "Arkansas", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.5 }] },
  { region: "California", taxes: [{ taxName: "State Sales Tax", taxPercent: 7.25 }] },
  { region: "Colorado", taxes: [{ taxName: "State Sales Tax", taxPercent: 2.9 }] },
  { region: "Connecticut", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.35 }] },
  { region: "Delaware", taxes: [{ taxName: "State Sales Tax", taxPercent: 0.0 }] },
  { region: "Florida", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.0 }] },
  { region: "Georgia", taxes: [{ taxName: "State Sales Tax", taxPercent: 4.0 }] },
  { region: "Hawaii", taxes: [{ taxName: "State Sales Tax", taxPercent: 4.17 }] },
  { region: "Idaho", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.0 }] },
  { region: "Illinois", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.25 }] },
  { region: "Indiana", taxes: [{ taxName: "State Sales Tax", taxPercent: 7.0 }] },
  { region: "Iowa", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.0 }] },
  { region: "Kansas", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.5 }] },
  { region: "Kentucky", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.0 }] },
  { region: "Louisiana", taxes: [{ taxName: "State Sales Tax", taxPercent: 4.45 }] },
  { region: "Maine", taxes: [{ taxName: "State Sales Tax", taxPercent: 5.5 }] },
  { region: "Maryland", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.0 }] },
  { region: "Massachusetts", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.25 }] },
  { region: "Michigan", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.0 }] },
  { region: "Minnesota", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.88 }] },
  { region: "Mississippi", taxes: [{ taxName: "State Sales Tax", taxPercent: 7.0 }] },
  { region: "Missouri", taxes: [{ taxName: "State Sales Tax", taxPercent: 4.23 }] },
  { region: "Montana", taxes: [{ taxName: "State Sales Tax", taxPercent: 0.0 }] },
  { region: "Nebraska", taxes: [{ taxName: "State Sales Tax", taxPercent: 5.5 }] },
  { region: "Nevada", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.85 }] },
  { region: "New Hampshire", taxes: [{ taxName: "State Sales Tax", taxPercent: 0.0 }] },
  { region: "New Jersey", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.63 }] },
  { region: "New Mexico", taxes: [{ taxName: "State Sales Tax", taxPercent: 5.13 }] },
  { region: "New York", taxes: [{ taxName: "State Sales Tax", taxPercent: 4.0 }] },
  { region: "North Carolina", taxes: [{ taxName: "State Sales Tax", taxPercent: 4.75 }] },
  { region: "North Dakota", taxes: [{ taxName: "State Sales Tax", taxPercent: 5.0 }] },
  { region: "Ohio", taxes: [{ taxName: "State Sales Tax", taxPercent: 5.75 }] },
  { region: "Oklahoma", taxes: [{ taxName: "State Sales Tax", taxPercent: 4.5 }] },
  { region: "Oregon", taxes: [{ taxName: "State Sales Tax", taxPercent: 0.0 }] },
  { region: "Pennsylvania", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.0 }] },
  { region: "Rhode Island", taxes: [{ taxName: "State Sales Tax", taxPercent: 7.0 }] },
  { region: "South Carolina", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.0 }] },
  { region: "South Dakota", taxes: [{ taxName: "State Sales Tax", taxPercent: 4.5 }] },
  { region: "Tennessee", taxes: [{ taxName: "State Sales Tax", taxPercent: 7.0 }] },
  { region: "Texas", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.25 }] },
  { region: "Utah", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.1 }] },
  { region: "Vermont", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.0 }] },
  { region: "Virginia", taxes: [{ taxName: "State Sales Tax", taxPercent: 5.3 }] },
  { region: "Washington", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.5 }] },
  { region: "West Virginia", taxes: [{ taxName: "State Sales Tax", taxPercent: 6.0 }] },
  { region: "Wisconsin", taxes: [{ taxName: "State Sales Tax", taxPercent: 5.0 }] },
  { region: "Wyoming", taxes: [{ taxName: "State Sales Tax", taxPercent: 4.0 }] },
];

export function findProvinceTaxInfo(country: string, region: string): ProvinceTaxInfo | null {
  const list = country.trim().toLowerCase() === "ca" ? CA_PROVINCE_TAXES : US_STATE_TAXES;
  const needle = region.trim().toLowerCase();
  return list.find((p) => p.region.toLowerCase() === needle) ?? null;
}
