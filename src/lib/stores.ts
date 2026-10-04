/**
 * App store listings. Fixed per app, not per deployment -- hardcoded on
 * purpose. The App Store listing is per storefront, so each region links to
 * its own; Google Play has a single listing.
 */
export type StoreRegion = "ca" | "us";

export const APP_STORE_URL: Record<StoreRegion, string> = {
  ca: "https://apps.apple.com/ca/app/receiptone-expense-tracker/id6755740822",
  us: "https://apps.apple.com/us/app/receiptone-expense-tracker/id6755740822",
};

export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.appfyl.checkapp";
