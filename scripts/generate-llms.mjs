#!/usr/bin/env node
/**
 * Generates public/llms.txt (https://llmstxt.org) so prices and store links
 * come from the same modules the site renders -- src/lib/pricing.ts and
 * src/lib/stores.ts -- rather than a second hand-kept copy. Runs in
 * `prebuild`.
 *
 * Keep the prose to statements the site itself makes (Pricing, FAQ).
 */
import { writeFileSync } from "node:fs";
import { loadTs } from "./lib/load-ts.mjs";

const ORIGIN = process.env.SITE_ORIGIN || "https://receipt-one.com";
const OUTPUT = "public/llms.txt";

const { regions, appStore, playStore, trialDays } = await loadTs(`
  import { getPlans, getPlanFeatures, TRIAL_DAYS } from "@/lib/pricing";
  import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/stores";
  const region = (r) => ({
    plans: getPlans(r).map((p) => ({ name: p.name, price: p.currency + " " + p.price, period: p.period })),
    features: getPlanFeatures(r),
  });
  export const regions = { ca: region("ca"), us: region("us") };
  export const appStore = APP_STORE_URL;
  export const playStore = PLAY_STORE_URL;
  export const trialDays = TRIAL_DAYS;
`);

const plansLine = ({ plans }) =>
  plans.map((p) => `${p.name} ${p.price} ${p.period.replace("/ ", "per ")}`).join("; ");

const regionSection = (heading, page, r, notes) => `## ${heading}

- [Landing page](${ORIGIN}${page}): ${notes}
- Prices: ${plansLine(r)}. All plans include a ${trialDays}-day free trial and the same features.
- Included: ${r.features.join(", ")}.
`;

const txt = `# ReceiptOne

> ReceiptOne is a receipt, expense and mileage tracker for freelancers, contractors and small businesses in Canada and the United States. Scan a receipt and it reads the merchant, date, total and tax amounts; log trips for mileage; and export PDF or CSV expense reports for your accountant or your own filing.

ReceiptOne organizes records; it is not a tax filing service and does not calculate tax refunds. Subscriptions can be cancelled in the app at any time.

${regionSection("Canada", "/ca", regions.ca, "GST/HST/PST tracking and CRA-ready expense reports.")}
${regionSection("United States", "/us", regions.us, "sales tax tracking and IRS-ready expense reports.")}
## Apps

- [App Store (Canada)](${appStore.ca})
- [App Store (United States)](${appStore.us})
- [Google Play](${playStore})

## Docs

- [Tax guides for Canadian freelancers](${ORIGIN}/articles): CRA receipt rules, GST/HST, mileage and deductions
- [Tax guides for US freelancers](${ORIGIN}/us/articles): IRS expense rules, Schedule C, mileage and deductions
- [Help Center (Canada)](${ORIGIN}/faq): frequently asked questions
- [Help Center (US)](${ORIGIN}/us/faq): frequently asked questions
- [Contact (Canada)](${ORIGIN}/contact)
- [Contact (US)](${ORIGIN}/us/contact)
`;

writeFileSync(OUTPUT, txt);
console.log(`✓ wrote ${OUTPUT}`);
