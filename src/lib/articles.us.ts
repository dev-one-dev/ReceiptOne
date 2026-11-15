/**
 * US-specific knowledge base articles.
 * Imported by help-center.ts to populate US_HELP_CENTER.articles.
 */
import { FAQ_HEADING, type Article } from "@/lib/articles";

/**
 * Whether search engines may index /us/articles. While false the index page
 * emits noindex, follow and is left out of public/sitemap.xml and llms.txt.
 * Each article has its own `indexable` flag below.
 */
export const US_ARTICLES_INDEX_INDEXABLE = false;

/** Closing line of every US article, the US counterpart of the CA "not tax advice" line. */
export const US_ARTICLE_DISCLAIMER =
  "This article is general information, not tax advice. Tax rules and amounts change; check IRS.gov or a tax professional for your situation.";

/* ─────────────── Rewritten guides (2026-11-14): shared sources ───────────────
 * Every IRS rule, rate, threshold and form or line reference in the three
 * rewritten guides below (irs-mileage-rate-self-employed,
 * quarterly-estimated-taxes-us-freelancers, self-employed-tax-deductions-us)
 * was read on these irs.gov pages on November 14, 2026. Worked examples are
 * hypothetical and labelled that way. */
const IRS = "https://www.irs.gov";
const IRS_SRC = {
  mileageRates: {
    label: "Standard mileage rates",
    href: `${IRS}/tax-professionals/standard-mileage-rates`,
  },
  ir2025128: {
    label: "IR-2025-128 (2026 rate from January 1)",
    href: `${IRS}/newsroom/irs-sets-2026-business-standard-mileage-rate-at-725-cents-per-mile-up-25-cents`,
  },
  ann202611: { label: "Announcement 2026-11 (IRB 2026-29)", href: `${IRS}/irb/2026-29_irb` },
  topic510: { label: "Topic 510, Business use of car", href: `${IRS}/taxtopics/tc510` },
  p463: { label: "Publication 463", href: `${IRS}/publications/p463` },
  schC: { label: "Instructions for Schedule C", href: `${IRS}/instructions/i1040sc` },
  howLong: {
    label: "How long should I keep records?",
    href: `${IRS}/businesses/small-businesses-self-employed/how-long-should-i-keep-records`,
  },
  records: {
    label: "What kind of records should I keep",
    href: `${IRS}/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep`,
  },
  estimated: {
    label: "Estimated taxes",
    href: `${IRS}/businesses/small-businesses-self-employed/estimated-taxes`,
  },
  p505: { label: "Publication 505", href: `${IRS}/publications/p505` },
  f1040es: { label: "Form 1040-ES", href: `${IRS}/forms-pubs/about-form-1040-es` },
  penalty: {
    label: "Underpayment of estimated tax penalty",
    href: `${IRS}/payments/underpayment-of-estimated-tax-by-individuals-penalty`,
  },
  seTax: {
    label: "Self-employment tax",
    href: `${IRS}/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes`,
  },
  onlineAccount: {
    label: "Online account for individuals",
    href: `${IRS}/payments/online-account-for-individuals`,
  },
  directPay: { label: "Direct Pay", href: `${IRS}/payments/direct-pay-with-bank-account` },
  eftps: {
    label: "EFTPS",
    href: `${IRS}/payments/eftps-the-electronic-federal-tax-payment-system`,
  },
  homeOffice: {
    label: "Home office deduction",
    href: `${IRS}/businesses/small-businesses-self-employed/home-office-deduction`,
  },
  simplified: {
    label: "Simplified option for home office deduction",
    href: `${IRS}/businesses/small-businesses-self-employed/simplified-option-for-home-office-deduction`,
  },
  p334: { label: "Publication 334", href: `${IRS}/publications/p334` },
  i7206: { label: "Instructions for Form 7206", href: `${IRS}/instructions/i7206` },
  cola: {
    label: "Retirement plan limits (COLA)",
    href: `${IRS}/retirement-plans/cola-increases-for-dollar-limitations-on-benefits-and-contributions`,
  },
  p560: { label: "Publication 560", href: `${IRS}/publications/p560` },
  qbi: {
    label: "Qualified business income deduction",
    href: `${IRS}/newsroom/qualified-business-income-deduction`,
  },
};

/** Closing "checked" line of a rewritten guide's sources, ending with the US disclaimer. */
const irsChecked = (editions: string) =>
  `All read on irs.gov on November 14, 2026. ${editions} ${US_ARTICLE_DISCLAIMER}`;

/** The closing call to action inside each "How ReceiptOne helps" box. */
const US_CTA = { label: "See how ReceiptOne works.", href: "/us" };

const MILEAGE_GUIDE = "/us/articles/irs-mileage-rate-self-employed";
const ESTIMATED_GUIDE = "/us/articles/quarterly-estimated-taxes-us-freelancers";
const DEDUCTIONS_GUIDE = "/us/articles/self-employed-tax-deductions-us";

export const ARTICLES_US_ONLY: Article[] = [
  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 1 — IRS EXPENSE RULES
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "irs-business-expense-deduction-rules",
    regions: ["us"],
    indexable: false,
    title: "IRS Business Expense Deduction Rules for Freelancers",
    excerpt:
      "What the IRS requires to deduct a business expense: the ordinary-and-necessary test, documentation, record retention, and a system that survives an audit.",
    category: "Tax Compliance",
    publishedAt: "2026-05-20",
    updatedAt: "2026-10-05",
    image: {
      path: "/articles/irs-business-expense-deduction-rules.webp",
      width: 1280,
      height: 720,
      alt: "Desktop calculator with tax keys and a pen on grid paper",
    },
    tags: ["IRS", "business expenses", "deductions", "self-employed", "audit", "record keeping"],
    clusterName: "IRS Expense Rules",
    relatedSlugs: [
      "schedule-c-deductions-guide-us-freelancers",
      "irs-receipt-documentation-requirements",
      "self-employed-tax-deductions-us",
    ],
    body: [
      {
        type: "p",
        text: "If you're self-employed in the United States, your expense records are your financial foundation. The IRS can disallow deductions that lack proper documentation — resulting in a larger tax bill and potential penalties. This guide explains what makes an expense deductible, what records you need to keep, and how to build a system that holds up under scrutiny.",
      },
      {
        type: "h2",
        text: "The Ordinary-and-Necessary Test",
      },
      {
        type: "p",
        text: "Under IRC Section 162, a business expense must be both 'ordinary' (common and accepted in your industry) and 'necessary' (helpful and appropriate for your business). An expense doesn't have to be indispensable — it just has to be a normal cost of doing business in your field.",
      },
      {
        type: "ul",
        items: [
          "Ordinary: software subscriptions, client meals, professional development, office supplies",
          "Necessary: the cost must serve a clear business purpose",
          "Personal expenses are never deductible — even if used partly for work (see the mixed-use rules)",
          "Lavish or extravagant expenses are not deductible regardless of business purpose",
        ],
      },
      {
        type: "h2",
        text: "What the IRS Requires on Every Business Receipt",
      },
      {
        type: "ul",
        items: [
          "Date of the transaction",
          "Vendor name and address",
          "Amount paid (including any sales tax)",
          "Business purpose of the purchase",
          "For business meals: who attended and their business relationship (entertainment is no longer deductible)",
        ],
      },
      {
        type: "h2",
        text: "How Long to Keep Records",
      },
      {
        type: "p",
        text: "The IRS generally has three years from your return's due date to audit you — but six years if it suspects you underreported income by more than 25%. Keep all business expense records for at least six years to be safe. Digital copies are fully acceptable.",
      },
      {
        type: "callout",
        text: "ReceiptOne keeps your receipts until you delete them or close your account, and reads the merchant name, date, amount and sales tax from each one you scan. Add the business purpose yourself, since the receipt alone won't show it.",
      },
      {
        type: "h2",
        text: "Common Deductible Categories for Freelancers",
      },
      {
        type: "ul",
        items: [
          "Home office (Form 8829 or simplified method)",
          "Business vehicle mileage (IRS standard rate or actual expenses)",
          "Professional development and education",
          "Software, tools, and subscriptions",
          "Business meals (50% deductible with proper documentation)",
          "Health insurance premiums (if self-employed)",
          "Retirement contributions (SEP-IRA, Solo 401k)",
          "Business phone and internet (proportional to business use)",
        ],
      },
      {
        type: "h2",
        text: "Mixed-Use Expenses",
      },
      {
        type: "p",
        text: "When an expense serves both personal and business purposes — your phone, internet, or car — you can only deduct the business-use percentage. Track your usage carefully and be conservative: the IRS scrutinizes mixed-use claims closely.",
      },
      { type: "p", text: US_ARTICLE_DISCLAIMER },
    ],
  },

  {
    slug: "irs-receipt-documentation-requirements",
    regions: ["us"],
    indexable: false,
    title: "IRS Receipt Requirements for Self-Employed Workers",
    excerpt:
      "Exactly what the IRS wants to see on your business receipts, how long to keep them, and whether digital copies are acceptable for audit purposes.",
    category: "Tax Compliance",
    publishedAt: "2026-05-20",
    updatedAt: "2026-10-05",
    image: {
      path: "/articles/irs-receipt-documentation-requirements.webp",
      width: 1280,
      height: 720,
      alt: "Crumpled paper receipts on a desk beside an open laptop in soft light",
    },
    tags: ["IRS", "receipts", "documentation", "audit", "self-employed", "record keeping"],
    clusterName: "IRS Expense Rules",
    relatedSlugs: [
      "irs-business-expense-deduction-rules",
      "self-employed-tax-deductions-us",
      "quarterly-estimated-taxes-us-freelancers",
    ],
    body: [
      {
        type: "p",
        text: "The IRS expects you to support business expenses with records and, generally, documentary evidence such as receipts, canceled checks or bills. For travel, gift and car expenses, Publication 463 sets out when a receipt is not needed — and that is where the often-quoted $75 figure comes from.",
      },
      {
        type: "h2",
        text: "The $75 Rule",
      },
      {
        type: "p",
        text: "Under Publication 463 (Travel, Gift, and Car Expenses), documentary evidence isn't needed if the expense, other than lodging, is less than $75, or if it is a transportation expense for which a receipt isn't readily available. Lodging always needs documentary evidence. You still have to record the elements of each expense, such as amount, date, place and business purpose. Evidence is ordinarily adequate if it shows the amount, date, place and essential character of the expense.",
      },
      {
        type: "h2",
        text: "Are Digital Receipts Acceptable?",
      },
      {
        type: "p",
        text: "Yes, with conditions. Publication 583 says the requirements for paper records also apply to electronic storage systems, including electronic imaging. You may destroy the paper originals once your electronic storage system has been tested to show it reproduces them in line with IRS requirements; the details are in Revenue Procedure 97-22. Revenue Procedure 98-25 covers records kept in computerized form.",
      },
      {
        type: "callout",
        text: "ReceiptOne captures receipts with your phone camera or by uploading an image or PDF, and keeps them in the cloud until you delete them or close your account.",
      },
      {
        type: "h2",
        text: "Business Meal Documentation",
      },
      {
        type: "ul",
        items: [
          "Amount of the expense",
          "Date the meal took place",
          "Name and location of the restaurant",
          "Business purpose of the meeting",
          "Names and business relationship of all attendees",
          "Entertainment itself (such as tickets to events) is no longer deductible; business meals generally remain 50% deductible",
        ],
      },
      {
        type: "h2",
        text: "Vehicle Mileage Logs",
      },
      {
        type: "p",
        text: "If you deduct vehicle expenses using the standard mileage rate, you must keep a contemporaneous mileage log — recorded at or near the time of each trip. It should include the date, destination, business purpose, and miles driven. Publication 463 notes that a timely kept record has more value than a statement prepared later, when accurate recall is usually lacking.",
      },
      { type: "p", text: US_ARTICLE_DISCLAIMER },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 2 — SCHEDULE C & DEDUCTIONS
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "schedule-c-deductions-guide-us-freelancers",
    regions: ["us"],
    indexable: false,
    title: "Schedule C Deductions Guide for US Freelancers",
    excerpt:
      "Every deduction on IRS Schedule C explained, from home office and vehicle expenses to the QBI deduction of up to 20% of qualified business income.",
    category: "Tax Deductions",
    publishedAt: "2026-05-20",
    updatedAt: "2026-10-05",
    image: {
      path: "/articles/schedule-c-deductions-guide-us-freelancers.webp",
      width: 1280,
      height: 720,
      alt: "Tall stack of printed paper documents on a desk",
    },
    tags: ["Schedule C", "deductions", "freelancer", "IRS", "self-employed", "1099"],
    clusterName: "Schedule C & Deductions",
    relatedSlugs: [
      "irs-business-expense-deduction-rules",
      "self-employed-tax-deductions-us",
      "home-office-deduction-form-8829-us",
    ],
    body: [
      {
        type: "p",
        text: "Schedule C (Profit or Loss from Business) is the IRS form where sole proprietors and single-member LLC owners report self-employment income and claim business deductions. Every dollar of legitimate deductions on Schedule C reduces both your income tax and your self-employment tax — a double benefit that makes thorough tracking essential.",
      },
      {
        type: "h2",
        text: "Part II — Expenses: Line by Line",
      },
      {
        type: "ul",
        items: [
          "Line 8 — Advertising: paid ads, website hosting, business cards, promotional materials",
          "Line 9 — Car and truck: either standard mileage rate or actual expenses",
          "Line 11 — Contract labor: amounts paid to subcontractors (Form 1099-NEC is generally required for payments of $2,000 or more made after 2025; $600 before)",
          "Line 13 — Depreciation: deduct large equipment costs over time or use Section 179 to expense upfront",
          "Line 14 — Employee benefit programs: health insurance, retirement plans for employees",
          "Line 15 — Insurance: liability, professional, business property (not health insurance for self)",
          "Line 17 — Legal and professional: accounting fees, legal advice, tax preparation",
          "Line 18 — Office expense: supplies, postage, small equipment under $2,500",
          "Line 22 — Supplies: materials used in providing your service",
          "Line 25 — Utilities: electricity and internet for a dedicated business location",
          "Line 27a — Other expenses: software subscriptions, professional memberships, education",
        ],
      },
      {
        type: "h2",
        text: "The Qualified Business Income (QBI) Deduction",
      },
      {
        type: "p",
        text: "Under Section 199A, most freelancers can deduct up to 20% of their qualified business income from their taxable income. This deduction is separate from Schedule C — it's claimed on Form 8995. Income limits and phase-outs apply for certain 'specified service trades or businesses' (law, health, consulting, etc.) at higher income levels.",
      },
      {
        type: "callout",
        text: "The QBI deduction is one of the most valuable available to freelancers — but it depends on clean income records. ReceiptOne keeps your expenses organized year-round so your accountant can make the most of every deduction.",
      },
      {
        type: "h2",
        text: "Self-Employment Tax Deduction",
      },
      {
        type: "p",
        text: "You pay self-employment tax (15.3%) on your net Schedule C profit. But you can deduct 50% of that SE tax on Schedule 1 — reducing your adjusted gross income before income taxes are calculated. It's automatic but easy to miss if you're filing manually.",
      },
      { type: "p", text: US_ARTICLE_DISCLAIMER },
    ],
  },

  {
    slug: "self-employed-tax-deductions-us",
    regions: ["us"],
    indexable: true,
    title: "Self-Employed Tax Deductions in the US: What to Claim and What to Keep",
    excerpt:
      "The main deductions for US freelancers and 1099 contractors, from home office and vehicle to health insurance, retirement, half of self-employment tax and QBI, with the records each needs.",
    category: "Tax Deductions",
    publishedAt: "2026-05-20",
    updatedAt: "2026-11-14",
    image: {
      path: "/articles/self-employed-tax-deductions-us.webp",
      width: 1280,
      height: 720,
      alt: "White ceramic piggy bank on a light wooden surface",
    },
    tags: ["deductions", "Schedule C", "self-employed", "1099", "IRS", "record keeping"],
    clusterName: "Schedule C & Deductions",
    relatedSlugs: ["irs-mileage-rate-self-employed", "quarterly-estimated-taxes-us-freelancers"],
    quickAnswer:
      "As a sole proprietor you deduct ordinary and necessary business costs on Schedule C, including a home office, the business share of your car, phone and internet, supplies, software, travel and, in most cases, 50% of business meals. Some large deductions sit outside Schedule C: self-employed health insurance, retirement plan contributions and half of your self-employment tax go on Schedule 1, and the qualified business income deduction is figured on Form 8995. Each one needs records that show the amount, the date and the business purpose.",
    receiptOneHelps: {
      items: [
        "Photograph a paper receipt, upload an image or PDF, or forward an e-mail receipt to your own ReceiptOne address, and ReceiptOne reads the details for you to check.",
        "Bulk upload a batch of photos or PDFs if you're catching up on a few months of expenses.",
        "Turn on trip tracking and the app records your work trips by GPS, building the mileage logbook your vehicle deduction depends on.",
        "Mark an expense as reimbursable when a client will pay you back for it, so it stays apart from the costs you deduct.",
        "Export your expense report at year end, or type /report to the Telegram bot to get your report in the chat.",
      ],
      link: US_CTA,
    },
    body: [
      {
        type: "p",
        text: "Every business expense you can support lowers your net profit, and with it the income your income tax and self-employment tax are figured on. The word that matters is support: a deduction is only as good as the record behind it. This guide walks through the main deductions for freelancers and independent contractors, where each one goes on your return, and what to keep for it.",
      },
      { type: "h2", text: "What makes an expense deductible" },
      {
        type: "p",
        text: "Schedule C is for ordinary and necessary business expenses. If an expense is partly for business and partly personal, Publication 334 says to separate the two; the personal part is generally not deductible. For each expense, the IRS says your supporting documents should show the payee, the amount paid, proof of payment, the date, and a description that shows the amount was for your business. It notes that you may need a combination of documents, such as a receipt and a card statement, to cover every element.",
      },
      {
        type: "p",
        text: "Keep those records until the period of limitations for the return runs out: generally three years after you file, or six years if you leave out income that is more than 25% of the gross income shown on your return.",
      },
      { type: "h2", text: "Home office" },
      {
        type: "p",
        text: "You can deduct business use of your home if you use part of it regularly and exclusively for your business and it is your principal place of business. Space you use to meet clients or customers in the normal course of business can also qualify, as can a separate structure such as a studio or garage used regularly and exclusively for the business. Space that is merely appropriate and helpful for your work doesn't. The deduction is open to homeowners and renters alike.",
      },
      { type: "h3", text: "Simplified method" },
      {
        type: "p",
        text: "The simplified option lets you deduct $5 per square foot of the space you use for business, up to 300 square feet, so the most it can give is $1,500. You don't figure depreciation, and home-related itemized deductions such as mortgage interest and real estate taxes stay in full on Schedule A. The deduction can't be more than the gross income from the business use of your home minus your business expenses, and under this method any excess can't be carried over to a later year.",
      },
      { type: "h3", text: "Regular method" },
      {
        type: "p",
        text: "The regular method uses Form 8829. You deduct the business percentage of your actual home expenses, such as mortgage interest, insurance, utilities, repairs and depreciation, based on the share of your home used for business. It takes more records than the simplified method, and an amount over the income limit can be carried over.",
      },
      {
        type: "p",
        text: "Either way the result goes on Schedule C, line 30. Keep a measurement of the office and of the whole home, and for the regular method, the bills for each home expense you claim.",
      },
      { type: "h2", text: "Vehicle" },
      {
        type: "p",
        text: "Car and truck expenses go on Schedule C, line 9. For 2026 the standard mileage rate is 72.5 cents per business mile through June 30 and 76 cents from July 1, or you can deduct the business share of your actual costs instead. Commuting between home and a regular workplace never counts. You need a log with the date, destination, business purpose and miles of each trip, plus your total miles for the year.",
        link: { label: "Read the IRS mileage rate guide.", href: MILEAGE_GUIDE },
      },
      { type: "h2", text: "Phone and internet" },
      {
        type: "p",
        text: "Phone costs go on line 25, Utilities. The Schedule C instructions set one firm rule for a home phone: you can't deduct the base rate, including taxes, of the first phone line into your home, but you can deduct additional business costs above it, and for a second line, the business percentage of its charges. For a cell phone or home internet you also use personally, deduct only the business share, and keep the bills with a note of how you worked out the percentage.",
      },
      { type: "h2", text: "Supplies and software" },
      {
        type: "p",
        text: "Office supplies and postage go on line 18. Materials and supplies go on line 22, and in most cases you deduct them to the extent you used them in your business during the year. Books, professional instruments and equipment you normally use up within a year can also be deducted; items whose usefulness lasts substantially beyond a year generally have to be depreciated.",
      },
      {
        type: "p",
        text: "Technology and software tools that are ordinary and necessary for your business, such as tax preparation software and subscription services you pay for to manage the business, are listed in Part V, Other expenses, which carries to line 27b. The instructions add that this doesn't cover software that must be depreciated or amortized, and that most computer software expenses must be capitalized and depreciated or expensed under section 179. Keep the receipt or invoice for each purchase and each subscription renewal.",
      },
      { type: "h2", text: "Travel and meals" },
      { type: "h3", text: "Travel away from home" },
      {
        type: "p",
        text: "Lodging and transportation for overnight business travel away from your tax home go on line 24a. Your tax home is generally your main place of business. You can't deduct travel costs for a spouse, dependent or anyone else unless that person is your employee, the travel has a bona fide business purpose and the costs would otherwise be deductible by them. For each trip, Publication 463 asks you to record the cost of each expense, the dates you left and returned, the days spent on business, the destination and the business purpose.",
      },
      { type: "h3", text: "Business meals: the 50% rule" },
      {
        type: "p",
        text: "Business meals go on line 24b, and in most cases you can deduct 50% of the cost, including meals while traveling away from home for business. The meal must be ordinary and necessary and not lavish, you must be present, and it must be with a current or potential client, customer, consultant or similar business contact. Entertainment, such as tickets to a game or a show, is generally not deductible at all; food at an entertainment event counts as a meal only if it is bought or billed separately. Record the amount, date, place, business purpose and the business relationship of the people you ate with.",
      },
      { type: "h2", text: "Deductions outside Schedule C" },
      {
        type: "p",
        text: "The deductions in this section don't go on Schedule C. You claim them on Schedule 1 (Form 1040) or a separate form, and they lower the income your income tax is figured on.",
      },
      { type: "h3", text: "Self-employed health insurance" },
      {
        type: "p",
        text: "If you had a net profit on Schedule C, you may be able to deduct medical, dental, vision and qualified long-term care insurance you paid for yourself, your spouse and your dependents, and for a child under 27 at the end of the year. You figure it on Form 7206 and claim it on Schedule 1, line 17. You can't use the premiums for any month you were eligible to take part in a subsidized health plan through an employer, including your spouse's, even if you didn't enroll. Keep the premium statements.",
      },
      { type: "h3", text: "Retirement contributions" },
      {
        type: "p",
        text: "With a SEP-IRA, a self-employed person can contribute for themselves up to 20% of net earnings from self-employment, figured with the rate table in Publication 560. For 2026 the most that can go into a SEP for one person is $72,000. A one-participant 401(k) allows elective deferrals of up to $24,500 for 2026, with total contributions limited to $72,000. Contributions you make for yourself go on Schedule 1, line 16, not on Schedule C. Keep the plan statements showing each contribution.",
      },
      { type: "h3", text: "Half of self-employment tax" },
      {
        type: "p",
        text: "You deduct half of your self-employment tax on Schedule 1, line 15. It reduces your adjusted gross income, and so your income tax, but not the self-employment tax itself. The figure comes from Schedule SE, so it needs no records beyond those behind your Schedule C.",
      },
      { type: "h3", text: "Qualified business income deduction" },
      {
        type: "p",
        text: "The QBI deduction, also called the Section 199A deduction, lets eligible sole proprietors deduct up to 20% of their qualified business income, whether they itemize or take the standard deduction. It is limited by taxable income and, depending on income, by the type of business and the wages it pays. Legislation made it permanent, and beginning in 2026 a minimum deduction of $400 is available if you have at least $1,000 of qualified business income from an active trade or business. You figure it on Form 8995 or Form 8995-A.",
      },
      { type: "h2", text: "Keep the records as you go" },
      {
        type: "p",
        text: "The IRS lets you use any recordkeeping system that clearly shows your income and expenses, including an electronic one, as long as it meets the same basic principles. What counts is that each deduction traces back to a document, such as a receipt, invoice, bill or statement, with a note of the business purpose where the document doesn't show it. Recording expenses through the year also keeps your quarterly estimates close to what you will actually owe.",
        link: { label: "Read the quarterly estimated taxes guide.", href: ESTIMATED_GUIDE },
      },
      { type: "h2", text: FAQ_HEADING },
      {
        type: "faq",
        q: "Can I take the home office deduction if I rent?",
        a: "Yes. The home office deduction is available to homeowners and renters and applies to all types of homes, as long as the space is used regularly and exclusively for business and is your principal place of business.",
      },
      {
        type: "faq",
        q: "How much of a business meal can I deduct?",
        a: "In most cases 50%, if the meal is ordinary and necessary, not lavish, you are present, and it is with a client, customer or similar business contact. Entertainment is generally not deductible.",
      },
      {
        type: "faq",
        q: "Is health insurance a Schedule C expense?",
        a: "No. Self-employed health insurance is figured on Form 7206 and claimed on Schedule 1 (Form 1040), line 17, and you need a net profit from your business to claim it.",
      },
      {
        type: "faq",
        q: "Can I deduct my phone bill?",
        a: "The business share of it. You can't deduct the base rate of the first phone line into your home, but you can deduct business costs above that base rate and the business percentage of a second line. For a cell phone you also use personally, deduct only the business share.",
      },
      {
        type: "faq",
        q: "Do I have to choose between the QBI deduction and itemizing?",
        a: "No. The QBI deduction is available whether you itemize deductions on Schedule A or take the standard deduction.",
      },
      {
        type: "sources",
        links: [
          IRS_SRC.schC,
          IRS_SRC.p334,
          IRS_SRC.records,
          IRS_SRC.howLong,
          IRS_SRC.homeOffice,
          IRS_SRC.simplified,
          IRS_SRC.mileageRates,
          IRS_SRC.p463,
          IRS_SRC.i7206,
          IRS_SRC.cola,
          IRS_SRC.p560,
          IRS_SRC.seTax,
          IRS_SRC.qbi,
        ],
        checked: irsChecked(
          "The Schedule C and Form 7206 instructions and Publications 334, 463 and 560 are the editions for 2025 returns.",
        ),
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 3 — 1099 & ESTIMATED TAXES
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "1099-contractor-tax-guide-us",
    regions: ["us"],
    indexable: false,
    title: "1099 Contractor Tax Guide: What You Owe and How to Pay It",
    excerpt:
      "What independent contractors need to know about 1099-NEC income, self-employment tax, quarterly payments, and setting cash aside to avoid April surprises.",
    category: "Tax Fundamentals",
    publishedAt: "2026-05-20",
    updatedAt: "2026-10-05",
    image: {
      path: "/articles/1099-contractor-tax-guide-us.webp",
      width: 1280,
      height: 720,
      alt: "Laptop and an open notebook with a pen on a wooden desk",
    },
    tags: ["1099", "contractor", "self-employment tax", "quarterly taxes", "freelancer", "IRS"],
    clusterName: "1099 & Estimated Taxes",
    relatedSlugs: [
      "quarterly-estimated-taxes-us-freelancers",
      "schedule-c-deductions-guide-us-freelancers",
      "self-employed-tax-deductions-us",
    ],
    body: [
      {
        type: "p",
        text: "When you work as an independent contractor, a business that pays you for services generally issues a Form 1099-NEC once its payments to you reach the reporting threshold: $600 for payments made through 2025, and $2,000 for payments made after December 31, 2025. Unlike W-2 employees, no taxes are withheld from your payments — you owe both income tax and self-employment tax, and you're responsible for paying them yourself throughout the year.",
      },
      {
        type: "h2",
        text: "Self-Employment Tax: The Big Surprise",
      },
      {
        type: "p",
        text: "Self-employment tax is 15.3% on the first $184,500 of net earnings (2026), plus 2.9% Medicare on amounts above that. It covers Social Security and Medicare — taxes that employees split with their employer. As a contractor, you pay the full amount. However, you can deduct 50% of SE tax from your gross income.",
      },
      {
        type: "h2",
        text: "What You Actually Owe",
      },
      {
        type: "ul",
        items: [
          "Self-employment tax (15.3%): on your net profit after deductions",
          "Federal income tax: marginal rates from 10% to 37% based on taxable income",
          "State income tax: varies by state — nine states have no income tax",
        ],
      },
      {
        type: "h2",
        text: "Setting Money Aside",
      },
      {
        type: "p",
        text: "There is no single right percentage to set aside: it depends on your profit, filing status, deductions and state. A better guide is your own estimate. Work through the Form 1040-ES worksheet, or start from last year's total tax, and move each quarter's share into a separate savings account as client payments come in.",
      },
      {
        type: "callout",
        text: "Every tracked expense reduces your net profit — which lowers both income tax and self-employment tax. ReceiptOne captures deductions you'd otherwise miss.",
      },
      {
        type: "h2",
        text: "Quarterly Estimated Payments",
      },
      {
        type: "p",
        text: "If you expect to owe $1,000 or more in taxes for the year, the IRS requires quarterly estimated payments. Missing or underpaying these triggers an underpayment penalty — typically small but avoidable. For 2026, the payments are due April 15, June 15 and September 15, 2026, and January 15, 2027.",
      },
      { type: "p", text: US_ARTICLE_DISCLAIMER },
    ],
  },

  {
    slug: "quarterly-estimated-taxes-us-freelancers",
    regions: ["us"],
    indexable: true,
    title: "Quarterly Estimated Taxes for Freelancers: Who Pays, When and How Much",
    excerpt:
      "Who has to pay estimated tax, the four due dates, how to figure the amount including self-employment tax, the safe harbors that avoid the underpayment penalty, and how to pay.",
    category: "Tax Fundamentals",
    publishedAt: "2026-05-20",
    updatedAt: "2026-11-14",
    image: {
      path: "/articles/quarterly-estimated-taxes-us-freelancers.webp",
      width: 1280,
      height: 720,
      alt: "Open planner with calendar pages, a binder clip, a pen and a metal ruler on a white desk",
    },
    tags: [
      "quarterly taxes",
      "estimated tax",
      "Form 1040-ES",
      "self-employment tax",
      "IRS",
      "self-employed",
    ],
    clusterName: "1099 & Estimated Taxes",
    relatedSlugs: ["self-employed-tax-deductions-us", "irs-mileage-rate-self-employed"],
    quickAnswer:
      "If you work for yourself and expect to owe $1,000 or more in federal tax when you file, you generally pay estimated tax during the year instead of all at once. The payments are due April 15, June 15, September 15 and January 15, moved to the next day that isn't a Saturday, Sunday or legal holiday when a date falls on one. You avoid the underpayment penalty if you pay at least 90% of this year's tax or 100% of last year's (110% if last year's AGI was over $150,000), whichever is smaller.",
    receiptOneHelps: {
      items: [
        "Photograph receipts, upload images or PDFs, or forward e-mail receipts to your own ReceiptOne address, so expenses are recorded as you go rather than in a rush before a due date.",
        "Bulk upload a batch of photos or PDFs if you're catching up before a payment is due.",
        "Ask the AI assistant questions about the expenses you've recorded when you sit down to refigure an estimate.",
        "Export an expense report at any point in the year, or type /report to the Telegram bot to get your report in the chat.",
      ],
      link: US_CTA,
    },
    body: [
      {
        type: "p",
        text: "When you work for yourself, no employer withholds income tax from your pay. The IRS still expects tax to be paid as you earn the income, so if you're in business for yourself you generally send it in four times a year as estimated tax. Estimated tax covers more than income tax: it is also how you pay self-employment tax, the Social Security and Medicare tax on your own earnings. This guide covers who has to pay, when, how to work out the amount, how to stay clear of the penalty and how to pay.",
      },
      { type: "h2", text: "Who has to pay estimated tax" },
      {
        type: "p",
        text: "According to the IRS, individuals, including sole proprietors, partners and S corporation shareholders, generally have to make estimated tax payments if they expect to owe tax of $1,000 or more when their return is filed. That is the tax left after your withholding and credits.",
      },
      {
        type: "p",
        text: "You don't have to pay estimated tax for the current year if all three of these are true:",
      },
      {
        type: "ul",
        items: [
          "You had no tax liability for the prior year, meaning your total tax was zero or you didn't have to file a return",
          "You were a U.S. citizen or resident alien for the whole year",
          "Your prior tax year covered a 12-month period",
        ],
      },
      {
        type: "p",
        text: "If you also have a job, you can cover the tax on your freelance income by asking your employer to withhold more. File a new Form W-4, which has a line for an additional amount to withhold from each paycheck.",
      },
      { type: "h2", text: "The four due dates" },
      {
        type: "p",
        text: "For estimated tax, the year is divided into four payment periods of uneven length, each with its own due date:",
      },
      {
        type: "ul",
        items: [
          "Income from January 1 to March 31: due April 15",
          "Income from April 1 to May 31: due June 15",
          "Income from June 1 to August 31: due September 15",
          "Income from September 1 to December 31: due January 15 of the following year",
        ],
      },
      { type: "h3", text: "The weekend and holiday rule" },
      {
        type: "p",
        text: "If a due date falls on a Saturday, Sunday or legal holiday, your payment is on time if you make it on the next day that isn't a Saturday, Sunday or holiday. If you mail a payment, the U.S. postmark date counts as the payment date. Publication 505 notes that the postmark may be the date the mail is processed at a postal facility, which may be later than the day you posted it, so leave a margin.",
      },
      { type: "h3", text: "The January exception" },
      {
        type: "p",
        text: "You can skip the January 15 payment if you file your return for the year by January 31 and pay the rest of the tax you owe with it.",
      },
      {
        type: "p",
        text: "You don't have to wait for the due dates either. The IRS says you can pay weekly, every two weeks or monthly, as long as you've paid enough by the end of each period.",
      },
      { type: "h2", text: "How to calculate your estimated tax" },
      {
        type: "p",
        text: "The IRS worksheet for this comes with Form 1040-ES. You estimate your adjusted gross income, taxable income, taxes, deductions and credits for the year. Last year's return is a useful starting point, adjusted for changes in your income and in the tax law. If your estimate turns out too high or too low, fill in a new worksheet and change your remaining payments.",
      },
      { type: "h3", text: "Start with your expected profit" },
      {
        type: "p",
        text: "Your self-employment income is your net profit from Schedule C: what clients pay you minus your business expenses. Every deduction you can support lowers that figure, so a current expense record gives you a more accurate estimate.",
        link: { label: "Read the self-employed deductions guide.", href: DEDUCTIONS_GUIDE },
      },
      {
        type: "p",
        text: "If you drive for work, mileage can be a large part of those expenses, and for 2026 the IRS changed the business rate in the middle of the year.",
        link: { label: "Read the IRS mileage rate guide.", href: MILEAGE_GUIDE },
      },
      { type: "h3", text: "Add self-employment tax" },
      {
        type: "p",
        text: "Self-employment tax is 15.3%: 12.4% for Social Security and 2.9% for Medicare. It applies to your net earnings from self-employment, which the self-employment tax worksheet in Publication 505 figures as 92.35% of your net profit. You owe it if those net earnings are $400 or more. For 2026, the Social Security part applies only to the first $184,500 of your combined wages, tips and net earnings. The Medicare part has no cap, and an additional 0.9% Medicare tax applies above $200,000 for single filers ($250,000 if married filing jointly, $125,000 if married filing separately).",
      },
      {
        type: "p",
        text: "You can deduct half of your self-employment tax when you figure your adjusted gross income, on Schedule 1 (Form 1040), line 15. That lowers your income tax, not the self-employment tax itself.",
      },
      { type: "h3", text: "A worked example (hypothetical)" },
      {
        type: "p",
        text: "Say you expect a net profit of $60,000 for the year and have no wages. Your net earnings from self-employment are $60,000 × 92.35% = $55,410. Self-employment tax is $55,410 × 15.3% = $8,477.73, and half of that, about $4,239, comes off your income before income tax is figured. Add the income tax on what remains, subtract any credits, and divide the total by four if your income arrives evenly through the year.",
      },
      {
        type: "p",
        text: "If your income is uneven, for example a large project paid in the fall, four equal payments may mean paying before you've earned the money. The annualized income installment method, figured on Form 2210, lets you match payments to when you earned the income and can lower or remove a penalty.",
      },
      { type: "h2", text: "Safe harbors: how to avoid the underpayment penalty" },
      {
        type: "p",
        text: "The penalty applies if you don't pay enough tax during the year, or pay it late, and it can apply even if you're due a refund when you file. The IRS figures it from the amount you underpaid, the period it was underpaid, and its published quarterly interest rates for underpayments. You generally avoid it in either of these cases:",
      },
      {
        type: "ul",
        items: [
          "You owe less than $1,000 after subtracting your withholding and credits",
          "You paid at least 90% of the tax for the current year or 100% of the tax shown on your prior-year return, whichever is smaller; the prior-year return must cover all 12 months",
        ],
      },
      { type: "h3", text: "The 110% rule for higher incomes" },
      {
        type: "p",
        text: "If your adjusted gross income for the prior year was more than $150,000 ($75,000 if married filing separately), the prior-year figure becomes 110% instead of 100%. Farmers and fishermen have their own rules.",
      },
      {
        type: "p",
        text: "The prior-year safe harbor is the easier one to plan around, because the number is already on last year's return. Pay a quarter of it on or before each due date and you avoid the penalty even if this year's income turns out higher; you'd still owe the balance when you file.",
      },
      { type: "h3", text: "When the penalty can be waived" },
      {
        type: "p",
        text: "The IRS may waive the penalty if the underpayment was due to a casualty, disaster or other unusual circumstance and imposing it would be inequitable. It may also waive it if you retired after reaching age 62 or became disabled during the tax year or the year before, and the underpayment was due to reasonable cause rather than willful neglect.",
      },
      { type: "h2", text: "How to pay" },
      { type: "p", text: "The IRS lists these ways to pay estimated tax:" },
      {
        type: "ul",
        items: [
          "IRS Online Account: sign in at IRS.gov/account to make a same-day payment or schedule payments up to 365 days ahead from your bank account, and see up to five years of payment history, including estimated tax payments.",
          "IRS Direct Pay: pay estimated tax from your bank account with no sign-in required. It is free, and you can change or cancel a scheduled payment.",
          "By mail with Form 1040-ES, by phone, or from your mobile device using the IRS app.",
          "EFTPS: individuals can no longer enroll, and the IRS says EFTPS is no longer available for individuals to make payments as of November 12, 2026. If you used it before, move your payments to your Online Account or Direct Pay.",
        ],
      },
      {
        type: "p",
        text: "Keep a note of the date and amount of each payment. You report the total of your estimated payments on your return, and your Online Account shows the payments the IRS has on record.",
      },
      { type: "h2", text: "State estimated taxes" },
      {
        type: "p",
        text: "Your state may also expect estimated payments of state income tax, on its own schedule and forms. This guide covers federal tax only, so check your state's tax agency for its rules.",
      },
      { type: "h2", text: FAQ_HEADING },
      {
        type: "faq",
        q: "When are quarterly estimated taxes due?",
        a: "April 15, June 15, September 15 and January 15 of the following year. If a date falls on a Saturday, Sunday or legal holiday, the payment is on time on the next day that isn't one.",
      },
      {
        type: "faq",
        q: "Do I have to pay estimated tax in my first year of freelancing?",
        a: "If you expect to owe $1,000 or more when you file, generally yes. You don't have to if you had no tax liability for the prior year, were a U.S. citizen or resident alien for the whole year, and your prior tax year covered 12 months.",
      },
      {
        type: "faq",
        q: "Does estimated tax include self-employment tax?",
        a: "Yes. Estimated tax pays income tax and other taxes such as self-employment tax, which is 15.3% of your net earnings from self-employment, with the Social Security part limited to the first $184,500 of combined earnings for 2026.",
      },
      {
        type: "faq",
        q: "What if I miss a payment?",
        a: "Pay as soon as you can. The penalty is figured on the amount underpaid and how long it stayed unpaid, at the IRS's quarterly underpayment interest rates, so paying late costs less than not paying at all.",
      },
      {
        type: "faq",
        q: "Can I pay more often than four times a year?",
        a: "Yes. The IRS says you can pay weekly, every two weeks or monthly, as long as you've paid enough by the end of each payment period.",
      },
      {
        type: "sources",
        links: [
          IRS_SRC.estimated,
          IRS_SRC.p505,
          IRS_SRC.f1040es,
          IRS_SRC.penalty,
          IRS_SRC.seTax,
          IRS_SRC.onlineAccount,
          IRS_SRC.directPay,
          IRS_SRC.eftps,
        ],
        checked: irsChecked("Publication 505 is the 2026 edition."),
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     STANDALONE ARTICLES
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "irs-mileage-rate-self-employed",
    regions: ["us"],
    indexable: true,
    title: "IRS Mileage Rate 2026 for the Self-Employed: How to Claim Business Miles",
    displayTitle: "IRS Mileage Rate for the Self-Employed: How to Claim Business Miles",
    excerpt:
      "The 2026 IRS business rate is 72.5 cents a mile to June 30 and 76 cents from July 1. Standard rate or actual costs, which miles count, the log to keep, and Schedule C.",
    category: "Mileage & Auto",
    publishedAt: "2026-05-20",
    updatedAt: "2026-11-14",
    image: {
      path: "/articles/irs-mileage-rate-self-employed.webp",
      width: 1280,
      height: 720,
      alt: "Two-lane desert highway with a double yellow line leading toward red rock formations at sunset",
    },
    tags: [
      "mileage",
      "IRS",
      "standard mileage rate",
      "vehicle expenses",
      "Schedule C",
      "self-employed",
    ],
    relatedSlugs: ["self-employed-tax-deductions-us", "quarterly-estimated-taxes-us-freelancers"],
    quickAnswer:
      "For 2026 the IRS standard mileage rate for business use is 72.5 cents a mile for driving from January 1 to June 30 and 76 cents a mile from July 1 to December 31. You can use that rate or deduct the business share of your actual car costs, but driving between home and a regular workplace is commuting and never counts. Keep a log with the date, destination, business purpose and miles of each trip, and report the deduction on Schedule C, line 9.",
    receiptOneHelps: {
      items: [
        "Turn on trip tracking and the mobile app records your work trips by GPS in the background, building a mileage logbook with the date and distance of each trip.",
        "Or enter a trip's start and end addresses and ReceiptOne works out the route and distance; tag each trip business or personal and add a note on its purpose.",
        "Photograph parking and toll receipts, or forward e-mailed ones to your own ReceiptOne address, so they sit with the rest of your records.",
        "Export your mileage log and expense report at year end, or type /report to the Telegram bot to get your report in the chat.",
      ],
      link: US_CTA,
    },
    body: [
      {
        type: "p",
        text: "If you drive for your business, your miles can be one of the larger deductions you claim as a sole proprietor or independent contractor. The IRS gives you two ways to work out the amount: a flat rate for each business mile, or the business share of what the car actually costs to run. Either way, the deduction stands or falls on your mileage records. This guide covers the current rate, how to choose a method, which trips count, what to write down and where the numbers go on your return.",
      },
      { type: "h2", text: "The IRS standard mileage rate for 2026" },
      {
        type: "p",
        text: "The IRS normally sets one business rate for the whole year, and 2026 is an exception. In December 2025 it set the business rate at 72.5 cents a mile from January 1, 2026, up 2.5 cents from the 2025 rate of 70 cents. Then, in Announcement 2026-11, it raised the rate to 76 cents a mile for driving on or after July 1, 2026, citing recent increases in the price of fuel. So for 2026 you split your business miles at June 30:",
      },
      {
        type: "ul",
        items: [
          "January 1 to June 30, 2026: 72.5 cents per business mile",
          "July 1 to December 31, 2026: 76 cents per business mile",
          "2025, for comparison: 70 cents per business mile",
        ],
      },
      {
        type: "p",
        text: "The rates apply to fully electric and hybrid cars as well as gasoline and diesel ones, and cover a car, van, pickup or panel truck. Because the rate stands in for the cost of running the vehicle, you can't also deduct gas, insurance or depreciation when you use it.",
      },
      { type: "h3", text: "A worked example (hypothetical)" },
      {
        type: "p",
        text: "Say you drove 3,000 business miles between January and June 2026 and 2,000 business miles between July and December. Your standard mileage deduction is 3,000 × $0.725 = $2,175 plus 2,000 × $0.76 = $1,520, for a total of $3,695. Business parking fees and tolls go on top, because they are deductible separately under either method. The mid-year change is one more reason to record the date of every trip: without dates, you can't show which miles belong to which rate.",
      },
      { type: "h2", text: "Standard mileage rate or actual expenses" },
      {
        type: "p",
        text: "The standard rate is simpler: you multiply your business miles by the rate. The actual expense method can give a larger deduction for a car that is expensive to run, but it needs a record of every cost. The IRS suggests that if you qualify for both, you figure your deduction both ways before choosing.",
      },
      { type: "h3", text: "Rules for using the standard rate" },
      {
        type: "p",
        text: "According to IRS Topic 510, you can use the standard mileage rate only if you own or lease the car and:",
      },
      {
        type: "ul",
        items: [
          "You don't operate five or more cars at the same time, as in a fleet operation",
          "You haven't claimed depreciation on the car using any method other than straight-line, and haven't used MACRS",
          "You haven't claimed a Section 179 deduction or the special depreciation allowance on the car",
          "You haven't claimed actual expenses for a car you lease",
        ],
      },
      {
        type: "p",
        text: "Timing matters too. For a car you own, you must choose the standard rate in the first year the car is available for use in your business; in later years you can choose either the standard rate or actual expenses. If you move to actual expenses before the car is fully depreciated, you must use straight-line depreciation over its estimated remaining useful life. For a leased car, choosing the standard rate commits you to it for the entire lease, including renewals.",
      },
      { type: "h3", text: "What actual expenses include" },
      {
        type: "p",
        text: "Under the actual expense method you add up what the car cost to run for the year and deduct the business share. Topic 510 lists gas, oil, repairs, tires, insurance, registration fees, licenses, and depreciation or lease payments. To find the business share, divide your business miles by your total miles for the year: if 6,000 of 15,000 miles were for business, 40% of those costs is deductible (a hypothetical figure). Depreciation on cars has its own annual limits, which Publication 463 sets out.",
      },
      { type: "h2", text: "Which miles count as business miles" },
      {
        type: "p",
        text: "Business miles are trips you make to carry on your business: driving to a client's office, meeting a supplier, picking up materials or delivering work. Personal driving doesn't count, and neither does commuting.",
      },
      { type: "h3", text: "Commuting doesn't count" },
      {
        type: "p",
        text: "Publication 463 treats travel between your home and your regular or main place of work as a personal commuting expense, and lists it as never deductible.",
      },
      {
        type: "p",
        text: "Several exceptions matter to freelancers. If your home is your principal place of business, trips between your home and another work location in the same business are deductible, whether that location is temporary or permanent and regardless of the distance. Trips between your home and a temporary work location are deductible if you have a regular or main place of work elsewhere; Publication 463 defines a temporary work location as one where the work is realistically expected to last, and does last, one year or less. If you have no regular place of business, only temporary work locations outside your metropolitan area qualify. Trips between your main place of work and a temporary work location are always deductible.",
      },
      {
        type: "p",
        text: "Whether your home counts as your principal place of business is the same question the home office deduction asks.",
        link: { label: "Read the self-employed deductions guide.", href: DEDUCTIONS_GUIDE },
      },
      { type: "h2", text: "The mileage log the IRS expects" },
      {
        type: "p",
        text: "The law requires you to back up car expenses with adequate records or sufficient evidence. For each business use of the car, Publication 463 asks you to record:",
      },
      {
        type: "ul",
        items: [
          "The date of the trip",
          "Your business destination",
          "The business purpose of the trip",
          "The miles driven for that business use",
        ],
      },
      {
        type: "p",
        text: "You also need your total miles for the year, since your business miles divided by your total miles is your business-use percentage. Publication 463 also lists the cost of the car and any improvements and the date you started using it for business. If you use actual expenses, keep the receipt for each cost you claim.",
      },
      { type: "h3", text: "Write it down at the time" },
      {
        type: "p",
        text: "A record made at or near the time of the trip carries more weight than one put together later, when recall is unreliable. You don't have to log every trip the same day: Publication 463 accepts a log kept weekly that accounts for the week's driving as a timely kept record. Keep parking and toll receipts alongside the log.",
      },
      { type: "h3", text: "How long to keep it" },
      {
        type: "p",
        text: "Keep the log and receipts until the period of limitations for that return runs out. For most returns that is three years after you file, but it is six years if you leave out income that is more than 25% of the gross income shown on the return.",
      },
      { type: "h2", text: "How the deduction goes on Schedule C" },
      {
        type: "p",
        text: "Self-employed car expenses go on Schedule C (Form 1040), line 9, Car and truck expenses. The Schedule C instructions describe two routes:",
      },
      {
        type: "ul",
        items: [
          "Standard rate: multiply your business miles by the rate, add business parking fees and tolls, and enter the total on line 9. Don't also deduct depreciation, rent or lease payments, or your actual operating expenses.",
          "Actual expenses: enter the business share of gas, oil, repairs, insurance, license plates and similar costs on line 9, depreciation on line 13, and rent or lease payments on line 20a.",
        ],
      },
      {
        type: "p",
        text: "You also report information about the vehicle. Complete Part IV of Schedule C if you claim the standard mileage rate, lease the vehicle, or it is fully depreciated, and you aren't required to file Form 4562 for another reason. If you claim depreciation on the vehicle, complete Form 4562, Part V, instead. If you used more than one vehicle, attach a statement with the Part IV details for each additional one.",
      },
      {
        type: "p",
        text: "A mileage deduction lowers your net profit, and with it the income your income tax and self-employment tax are figured on. If you pay estimated tax, refigure it once you know roughly what your mileage will be.",
        link: { label: "Read the quarterly estimated taxes guide.", href: ESTIMATED_GUIDE },
      },
      { type: "h2", text: FAQ_HEADING },
      {
        type: "faq",
        q: "What is the IRS mileage rate for 2026?",
        a: "For business use it is 72.5 cents a mile for driving from January 1 to June 30, 2026, and 76 cents a mile from July 1 to December 31, 2026. The IRS raised the rate mid-year in Announcement 2026-11. The 2025 rate was 70 cents.",
      },
      {
        type: "faq",
        q: "Can I deduct the drive from home to my office or coworking space?",
        a: "Not if it is your regular or main place of work: Publication 463 treats that drive as commuting, which is never deductible. If your home is your principal place of business, trips from home to other work locations in the same business are deductible.",
      },
      {
        type: "faq",
        q: "Can I switch between the standard rate and actual expenses?",
        a: "For a car you own, only if you used the standard rate in the first year the car was available for business; after that you can choose either method, with straight-line depreciation if you move to actual expenses. For a leased car, the standard rate applies for the entire lease once you choose it.",
      },
      {
        type: "faq",
        q: "Can I deduct parking and tolls as well as the standard rate?",
        a: "Yes. Business parking fees and tolls are deductible separately under either method. Add them to your standard mileage amount on Schedule C, line 9.",
      },
      {
        type: "faq",
        q: "Do I need odometer readings?",
        a: "Publication 463 asks for the miles of each business use and your total miles for the year. Writing down the odometer reading at the start and end of the year is a simple way to show the total.",
      },
      {
        type: "sources",
        links: [
          IRS_SRC.mileageRates,
          IRS_SRC.ir2025128,
          IRS_SRC.ann202611,
          IRS_SRC.topic510,
          IRS_SRC.p463,
          IRS_SRC.schC,
          IRS_SRC.howLong,
        ],
        checked: irsChecked(
          "Publication 463 and the Schedule C instructions are the editions for 2025 returns.",
        ),
      },
    ],
  },

  {
    slug: "home-office-deduction-form-8829-us",
    regions: ["us"],
    indexable: false,
    title: "Home Office Deduction for Freelancers: Form 8829 Explained",
    excerpt:
      "How to claim the home office deduction with Form 8829 or the simplified method: the exclusive-use rule, which expenses qualify, and how to calculate it.",
    category: "Tax Deductions",
    publishedAt: "2026-05-20",
    updatedAt: "2026-05-20",
    image: {
      path: "/articles/home-office-deduction-form-8829-us.webp",
      width: 1280,
      height: 720,
      alt: "Home office with a black glass desk, an adjustable desk lamp, a white chair and shelving",
    },
    tags: ["home office", "Form 8829", "deductions", "IRS", "self-employed", "freelancer"],
    relatedSlugs: [
      "self-employed-tax-deductions-us",
      "schedule-c-deductions-guide-us-freelancers",
      "irs-business-expense-deduction-rules",
    ],
    body: [
      {
        type: "p",
        text: "The home office deduction lets self-employed workers deduct a portion of home expenses — rent, mortgage interest, utilities, insurance, repairs — based on the percentage of the home used for business. It's one of the most valuable deductions for remote freelancers, but also one of the most misunderstood.",
      },
      {
        type: "h2",
        text: "The Exclusive-Use Requirement",
      },
      {
        type: "p",
        text: "The IRS requires that your home office space be used 'regularly and exclusively' for business. This means a dedicated room or clearly defined area — your kitchen table where you also eat dinner doesn't qualify. The exclusive-use rule is strictly enforced; one auditor can disallow the entire deduction if personal use is evident.",
      },
      {
        type: "h2",
        text: "Two Methods for Calculating the Deduction",
      },
      {
        type: "ul",
        items: [
          "Simplified method: $5 per square foot, up to 300 sq ft = max $1,500 deduction",
          "Regular method (Form 8829): office sq ft ÷ total home sq ft × eligible home expenses",
          "Regular method typically yields a larger deduction for larger offices or higher housing costs",
          "You can switch methods from year to year",
        ],
      },
      {
        type: "h2",
        text: "What Expenses Are Included (Regular Method)",
      },
      {
        type: "ul",
        items: [
          "Rent (renters) or mortgage interest + real estate taxes (owners)",
          "Utilities: electricity, gas, water proportional to office use",
          "Homeowner's or renter's insurance",
          "Repairs and maintenance to the home",
          "Depreciation of the home (owners only — triggers recapture on sale)",
        ],
      },
      {
        type: "callout",
        text: "Home office expenses require careful documentation. ReceiptOne captures utility bills, insurance statements, and repair receipts throughout the year — so your Form 8829 is accurate and audit-ready.",
      },
      {
        type: "h2",
        text: "The Income Limitation",
      },
      {
        type: "p",
        text: "The home office deduction cannot exceed your net business income from that business. If you're in a loss year, the excess carries forward to the next year — it isn't lost. This limits the deduction's value in low-income years but makes it fully recoverable when business picks up.",
      },
      { type: "p", text: US_ARTICLE_DISCLAIMER },
    ],
  },

  {
    slug: "sales-tax-business-expenses-us",
    regions: ["us"],
    indexable: false,
    title: "Sales Tax on Business Expenses: A Guide for US Freelancers",
    excerpt:
      "How sales tax works on business purchases, whether it's separately deductible, when you may need to collect it, and why tracking it matters.",
    category: "Tax Fundamentals",
    publishedAt: "2026-05-20",
    updatedAt: "2026-10-05",
    image: {
      path: "/articles/sales-tax-business-expenses-us.webp",
      width: 1280,
      height: 720,
      alt: "Close-up of vintage cash register keys with price numbers and a No Sale key",
    },
    tags: ["sales tax", "business expenses", "deductions", "IRS", "freelancer", "receipts"],
    relatedSlugs: [
      "irs-business-expense-deduction-rules",
      "irs-receipt-documentation-requirements",
      "schedule-c-deductions-guide-us-freelancers",
    ],
    body: [
      {
        type: "p",
        text: "US sales tax on business purchases isn't separately refundable — but it is deductible. The sales tax is treated as part of the total cost of the purchase, so the full amount (including tax) is a legitimate business expense on Schedule C.",
      },
      {
        type: "h2",
        text: "How Sales Tax Affects Your Deductions",
      },
      {
        type: "p",
        text: "For example, using illustrative figures: if you buy a $200 software license and pay $18 in sales tax, your deductible expense is $218 — the full amount. The IRS doesn't require you to separate the sales tax from the purchase price on Schedule C; the total cost is the deduction.",
      },
      {
        type: "h2",
        text: "State Income Tax Deduction (Sales Tax Alternative)",
      },
      {
        type: "p",
        text: "On Schedule A (if you itemize), you can deduct either state income taxes or state and local general sales taxes — not both. Sales tax already deducted as a business expense on Schedule C can't be claimed again here. For freelancers in no-income-tax states like Texas, Florida, or Washington, tracking the sales tax you pay on personal purchases can add to your itemized deductions. The total state and local tax (SALT) deduction is capped: for 2025, $40,000 ($20,000 if married filing separately), reduced when modified AGI is over $500,000 ($250,000 if married filing separately) but not below $10,000 ($5,000). Check the Schedule A instructions for the year you file, and itemize only if your total beats the standard deduction.",
      },
      {
        type: "h2",
        text: "When You May Need to Collect Sales Tax",
      },
      {
        type: "p",
        text: "If you sell taxable products or certain services, you may be required to collect and remit sales tax to your state. Service taxability varies widely by state — digital services, consulting, and SaaS products are taxable in some states but not others. Check your state's revenue department rules or consult a CPA if you're unsure.",
      },
      {
        type: "callout",
        text: "ReceiptOne reads the sales tax line from each receipt you scan and keeps it with the receipt, so the amounts are there when you prepare Schedule C or Schedule A.",
      },
      {
        type: "h2",
        text: "Nexus and Online Sales",
      },
      {
        type: "p",
        text: "After the 2018 South Dakota v. Wayfair Supreme Court decision, states can require out-of-state sellers to collect sales tax once they meet an economic nexus threshold set by each state. The South Dakota law in that case used $100,000 in sales or 200 separate transactions, but South Dakota dropped the transaction test from July 1, 2023 and now uses more than $100,000 in gross sales only. Other states set their own tests, so check each state where you have customers. If you sell taxable products online to customers in multiple states, this can apply to you regardless of your physical location.",
      },
      { type: "p", text: US_ARTICLE_DISCLAIMER },
    ],
  },
];

export const US_ARTICLES: Article[] = ARTICLES_US_ONLY;
