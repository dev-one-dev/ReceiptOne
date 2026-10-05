/**
 * Articles data + helpers for the ReceiptOne knowledge base.
 * No React imports — pure TypeScript data layer.
 */
import { LOGO_URL, SITE_URL } from "@/lib/seo";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export type Region = "ca" | "us";

export interface Article {
  slug: string;
  /** Omitting this field defaults the article to CA-only. */
  regions?: (Region | "all")[];
  title: string;
  excerpt: string;
  category: string;
  /** Date the article was first committed to this repo (YYYY-MM-DD). */
  publishedAt: string;
  /** Date of the article's last content change in this repo (YYYY-MM-DD). */
  updatedAt: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  body: ContentBlock[];
  clusterPillar?: string;
  clusterName?: string;
  relatedSlugs?: string[];
}

/** Byline on every article — written by the team, not a named individual. */
export const ARTICLE_BYLINE = "ReceiptOne Team";

export const ARTICLES: Article[] = [
  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 1 — CRA RECEIPT RULES
     Pillar: cra-receipt-rules-canada
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "cra-receipt-rules-canada",
    title: "CRA Receipt Rules in Canada: What to Keep and for How Long (2026 Guide)",
    excerpt:
      "What the CRA requires on a business receipt for 2026, when scanned copies can replace paper, the six-year retention rule, and the $100 and $500 GST/HST ITC tiers.",
    category: "Tax Compliance",
    publishedAt: "2026-10-04",
    updatedAt: "2026-10-04",
    imageUrl: "https://picsum.photos/seed/cra-receipt-rules-canada/600/400",
    imageAlt: "Canadian freelancer organizing receipts and tax documents",
    tags: ["CRA", "receipts", "compliance", "self-employed", "audit", "record keeping"],
    clusterName: "CRA Receipt Rules",
    relatedSlugs: ["digital-receipts-canada-are-they-valid", "cra-audit-proof-expenses"],
    body: [
      {
        type: "p",
        text: "If you are self-employed in Canada, the CRA expects a receipt or other document behind every business expense you claim, and you generally have to keep it for six years from the end of the last tax year it relates to. For your 2026 tax year, that means the receipts stay with you until at least the end of 2032, longer in the cases covered below.",
      },
      {
        type: "p",
        text: "This guide covers the 2026 tax year. Every requirement and dollar figure comes from canada.ca. Examples are hypothetical and are labelled that way.",
      },
      {
        type: "h2",
        text: "What the CRA Accepts as a Receipt",
      },
      {
        type: "p",
        text: "The law requires you to keep records of all your transactions so you can support your income and expense claims. Guide T4002 says to always get a receipt or other voucher when you buy something for your business, and that the receipt has to show:",
      },
      {
        type: "ul",
        items: [
          "The date of the purchase",
          "The name and address of the seller or supplier",
          "The name and address of the buyer",
          "A full description of the goods or services",
          "The vendor's business number, if they are a GST/HST registrant and the purchase price is $100 or more before tax",
        ],
      },
      {
        type: "p",
        text: '"Record" is defined broadly. The CRA\'s list of records includes sales invoices, purchase receipts, vouchers, contracts, bank deposit slips, bank statements, cancelled cheques, cash register slips, credit card receipts, logbooks and emails. All records must be reliable and complete, supported by documents, and kept in English, French or both.',
      },
      {
        type: "p",
        text: "Where a receipt falls short, fix it at the time. If there is no description, as with a cash register tape, T4002 says to write what the item was on the receipt or in your expense records. If a supplier won't give you a receipt, T4002 warns that transactions may be denied without proper documentation.",
      },
      {
        type: "p",
        text: "What does not work: a scanned image where resolution, tone or colour hides significant details, and records kept outside Canada, unless the CRA has given written permission. Records stored outside Canada and accessed electronically from Canada are not considered kept in Canada.",
      },
      {
        type: "h2",
        text: "Scanned and Electronic Copies: Do You Need the Original?",
      },
      {
        type: "p",
        text: "The CRA accepts records kept on paper and later converted to an accessible, readable electronic format, as well as records that were electronic from the start. The rules differ for each:",
      },
      {
        type: "ul",
        items: [
          'Paper originals: "Generally, you must keep originals of your paper documents." You can keep electronic images instead, but you may destroy the paper only if the imaging follows the national standard, CAN/CGSB 72.34, Electronic Records as Documentary Evidence. Then the images become the permanent record.',
          "If your imaging does not meet that standard, the CRA says you have to keep the original documents. If you are in any doubt about destroying paper, it advises getting legal advice first.",
          "Electronic originals, such as emailed invoices and PDF receipts, must be kept in an electronic readable format even if you also print them.",
          "Any image must be an accurate reproduction intended to take the place of the paper, give the same information, and keep significant details legible.",
        ],
      },
      {
        type: "p",
        text: "Electronic records must stay accessible to CRA officials and readable by CRA software, including after you change systems. Keep backup copies, preferably at a site in Canada other than your business location. If electronic records are lost, destroyed or damaged, the CRA asks you to report them missing at 1-800-959-5525 and recreate them within a reasonable time.",
      },
      {
        type: "callout",
        text: "ReceiptOne keeps a photo of each receipt, reads the merchant, date, total and sales-tax amounts from it, and exports your records as PDF or CSV. It does not check a supplier's GST/HST registration number, so look for one yourself on purchases of $100 or more. Our privacy policy explains that data may be stored outside Canada, so keep your exported copy in Canada.",
      },
      {
        type: "h2",
        text: "The Six-Year Rule and When It Starts",
      },
      {
        type: "p",
        text: "The general rule is six years from the end of the last tax year the records relate to. For individuals, the tax year is the calendar year, so the clock starts on December 31, not on the date printed on the receipt. The same retention rules apply under the Excise Tax Act, so your GST/HST records follow them too. Several situations change the period:",
      },
      {
        type: "ul",
        items: [
          "Late-filed return: keep the records for six years from the date you file that return.",
          "Objection or appeal: keep the records until the latest of these: the objection or appeal is resolved, the time for any further appeal has passed, or the six-year period has passed.",
          "Long-term acquisitions and disposals of property, and other history that would affect a sale or wind-up of the business: keep them indefinitely.",
          "Business that ends: an unincorporated business keeps its records for six years from the end of the tax year in which it ended.",
          "If the CRA wants you to keep records longer, an official will tell you in person or by registered mail.",
        ],
      },
      {
        type: "p",
        text: "Hypothetical example: a receipt dated March 10, 2026 for a business purchase relates to your 2026 tax year. Filed on time, it must be kept until at least December 31, 2032. If the same 2026 return were filed late, on a date in 2027, the six years would run from that filing date instead. Some records relate to more than one year, such as the receipt for equipment you claim capital cost allowance on over several years. For those, the clock runs from the last year they support.",
      },
      {
        type: "p",
        text: "To destroy records before the period ends, you need written permission from the CRA, using Form T137, Request for Destruction of Records, or a letter to your tax services office. The CRA states that destroying paper or electronic records without its permission can lead to prosecution.",
      },
      {
        type: "h2",
        text: "What Happens at an Audit When Records Are Missing",
      },
      {
        type: "p",
        text: "You must make your records available to the CRA when it asks, and let officials copy what they need. Guide T4002 sets out the consequences of not keeping adequate records:",
      },
      {
        type: "ul",
        items: [
          "If you do not have the necessary information and no other proof, the CRA may determine your income using other methods.",
          "The CRA may disallow expenses you deducted if you cannot support them.",
          "There are penalties for not keeping adequate records, for not giving the CRA access to your records, and for not giving information to CRA officials when asked.",
        ],
      },
      {
        type: "p",
        text: "The CRA's record-keeping pages make the same point. If auditors cannot determine your income or taxable revenues from your records, they have to use other methods, which costs you time. If your records do not support your claims, those claims could be disallowed. If your records were destroyed by a disaster, the CRA has a separate support page for affected taxpayers.",
      },
      {
        type: "h2",
        text: "GST/HST Input Tax Credits: Documents and Dollar Tiers",
      },
      {
        type: "p",
        text: 'If you are a GST/HST registrant, the receipt does a second job: it supports the input tax credit (ITC) you claim on line 106 of your return. The CRA\'s eligibility conditions include obtaining "sufficient documentary evidence to substantiate the ITC prior to making the claim". You keep the documents rather than filing them, and what they must show depends on the total of the sale:',
      },
      {
        type: "ul",
        items: [
          "Under $100: the supplier's (or intermediary's) business or trading name, the invoice date (or the date the GST/HST was paid or payable if there is no invoice), and the total amount paid or payable.",
          "$100 to $499.99: all of the above, plus the GST/HST charged (or an indication that the price includes it at the applicable rate), the status of each supply if taxable and exempt items are mixed, and the supplier's or intermediary's GST/HST registration number.",
          "$500 or more: all of the above, plus the buyer's name or trading name (or their authorized agent's), a brief description of the property or services, and the terms of payment.",
        ],
      },
      {
        type: "p",
        text: "These $100 and $500 tiers replaced the earlier $30 and $150 thresholds as of April 20, 2021. Guide RC4022 (Rev. 25) shows them as current. Hypothetical example: a $60 purchase of office supplies needs only the vendor's name, the date and the total. A $240 order needs the GST/HST amount and the vendor's registration number as well. A $1,130 laptop invoice must also show your name or trading name, describe the laptop, and state the payment terms.",
      },
      {
        type: "p",
        text: "A registration number on a receipt is worth checking. The CRA's free GST/HST Registry confirms whether the business charging you GST/HST is registered. You enter the first nine digits of the number (no letters), the supplier's name as shown on the receipt, and the transaction date, then print the Search Details screen for your records. If a supplier won't give you its number, the CRA's business enquiries line (1-800-959-5525) can confirm whether it is registered.",
      },
      {
        type: "p",
        text: "Timing matters too. For most registrants, an ITC must be claimed by the due date of the return for the last reporting period ending within four years after the period in which it could first have been claimed. The documents must be in hand before you claim.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "p",
        text: "Is a credit card or bank statement enough on its own? Bank statements and statements of account are on the CRA's list of records, but a statement does not show what you bought, who the buyer was or how much GST/HST was charged. T4002 asks for those details on receipts, and the ITC chart requires them from $100 upward. Keep the receipt or invoice as well.",
      },
      {
        type: "p",
        text: "Can I throw away paper receipts once I've photographed them? Only if your imaging meets the CAN/CGSB 72.34 standard. Then the images become the permanent records. If it doesn't, the CRA says to keep the paper originals, and to get legal advice if you're unsure.",
      },
      {
        type: "p",
        text: "When can I shred my 2020 business receipts? Six years from the end of 2020 is December 31, 2026. After that, you can generally dispose of them if your 2020 return was filed on time, is not under objection or appeal, and the receipts don't support a later year, as with capital property.",
      },
      {
        type: "p",
        text: "Do I send receipts with my tax return? No. T4002 says not to send your records with your income tax return, but to keep them in case the CRA asks to see them. GST/HST registrants likewise don't submit ITC documents with their return.",
      },
      {
        type: "p",
        text: "Can I keep my records in a cloud service? The CRA requires records to be kept at your place of business or residence in Canada unless it gives written permission otherwise. Records kept outside Canada and accessed electronically from Canada are not considered kept in Canada. Find out where your provider stores data, and keep a copy in Canada.",
      },
      {
        type: "p",
        text: "What if my receipts were lost in a fire or flood? For lost or damaged electronic records, the CRA asks you to report them missing at 1-800-959-5525 and recreate them within a reasonable time. For disasters, it points to its page on support for those affected.",
      },
    ],
  },

  {
    slug: "what-receipts-do-i-need-for-taxes-canada",
    title: "What Receipts Do You Need for Taxes in Canada?",
    excerpt:
      "Not every piece of paper qualifies as a valid CRA receipt. Here's exactly what documentation Canadian freelancers and contractors need to support their business expense claims.",
    category: "Tax Compliance",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/what-receipts-do-i-need-for-taxes-canada/600/400",
    imageAlt: "Stack of receipts organized for Canadian tax filing",
    tags: ["CRA", "receipts", "taxes", "freelancer", "documentation"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: ["cra-receipt-rules-canada"],
    body: [
      {
        type: "p",
        text: "Canadian tax law doesn't define a single document type called 'a receipt' — it requires supporting documentation that proves a business expense was incurred. In practice, that means different things for different purchases. A $4 coffee requires far less paperwork than a $2,000 laptop claim.",
      },
      {
        type: "h2",
        text: "Receipts by Purchase Type",
      },
      {
        type: "ul",
        items: [
          "Under $30: vendor name, date, and total are sufficient — no GST number required",
          "$30–$149.99: add the vendor's GST/HST registration number",
          "$150 and over: also include the buyer's name or business name",
          "Cash purchases: same requirements — a handwritten receipt from the vendor still qualifies",
          "Online purchases: email order confirmations and invoices are valid if they include all required fields",
          "Subscriptions: monthly invoices or annual receipts from the software/service provider",
        ],
      },
      {
        type: "h2",
        text: "What Does NOT Count as a Receipt",
      },
      {
        type: "ul",
        items: [
          "Bank or credit card statements — they confirm payment but not what was purchased",
          "Quotes or estimates — these show a potential expense, not an actual one",
          "Partial screenshots that cut off the vendor name, total, or tax details",
          "Receipts in a currency other than CAD without a conversion record",
        ],
      },
      {
        type: "callout",
        text: "If you have a receipt that's missing a required field (like the GST number), try contacting the vendor to request a corrected copy. Many vendors will re-issue a proper receipt if asked promptly.",
      },
    ],
  },

  {
    slug: "digital-receipts-canada-are-they-valid",
    title: "Are Digital Receipts Valid for the CRA? Email and Photo Receipts Explained",
    excerpt:
      "Wondering whether an email receipt or a phone photo of a paper receipt will hold up with the CRA? The answer is yes — with a few important conditions.",
    category: "Tax Compliance",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/digital-receipts-canada-are-they-valid/600/400",
    imageAlt: "Person photographing a paper receipt with a smartphone",
    tags: ["digital receipts", "CRA", "email receipts", "photo receipts", "compliance"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: ["cra-receipt-rules-canada", "cra-audit-proof-expenses"],
    body: [
      {
        type: "p",
        text: "The CRA officially accepts digital images of receipts as valid business records. This policy has been in place since 2007 and applies to smartphone photos, scanned PDFs, and email receipts from vendors. You are not required to keep paper originals once you have a clear digital copy — but the digital copy must meet specific standards.",
      },
      {
        type: "h2",
        text: "Requirements for a Valid Digital Receipt",
      },
      {
        type: "ul",
        items: [
          "Must be a complete, unaltered image — no cropping that removes any required field",
          "All required information must be legible: vendor name, date, total, GST/HST number",
          "Must be in a stable format — PDF or JPEG are preferred over editable formats like .docx",
          "Stored in at least two locations (e.g., cloud backup + local drive) for durability",
          "Metadata should ideally reflect when the image was captured (most phone cameras preserve this automatically)",
        ],
      },
      {
        type: "callout",
        text: "The CRA's guidance (Information Circular IC05-1R1) states that electronic records must be 'accessible, readable and printable' on request. If you store receipts in an app, make sure you can export them in a standard format.",
      },
      {
        type: "h2",
        text: "Email Receipts from Vendors",
      },
      {
        type: "p",
        text: "Email receipts directly from vendors are fully valid CRA documents — provided they include all required information. Save them as PDF files rather than leaving them in an email inbox. Email services change, accounts get deleted, and corporate email is sometimes wiped on departure. A downloaded PDF in cloud storage is far more durable than an email in a live inbox.",
      },
    ],
  },

  {
    slug: "cra-audit-proof-expenses",
    title: "How to Audit-Proof Your Business Expenses in Canada",
    excerpt:
      "A CRA audit doesn't have to be frightening if your records are solid. Here's the documentation system that makes freelancers and contractors untouchable at audit time.",
    category: "Tax Compliance",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/cra-audit-proof-expenses/600/400",
    imageAlt: "Organized financial folders and tax documents for CRA audit preparation",
    tags: ["CRA audit", "expense documentation", "self-employed", "record keeping", "compliance"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: ["cra-receipt-rules-canada", "digital-receipts-canada-are-they-valid"],
    body: [
      {
        type: "p",
        text: "Being audit-proofed doesn't mean hiding expenses — it means having documentation so complete and organized that a CRA auditor can verify every claim without ambiguity. Self-employed Canadians are audited at higher rates than employees, making a systematic records approach essential rather than optional.",
      },
      {
        type: "h2",
        text: "The Four Elements of an Audit-Proof Expense",
      },
      {
        type: "ul",
        items: [
          "Receipt or invoice that meets CRA requirements (date, vendor, total, GST/HST number for $30+ claims)",
          "Business purpose notation — a single line explaining why the expense was incurred for business",
          "Payment method record — bank statement or credit card record that corroborates the receipt",
          "Category tag — linking the expense to the correct line on your T2125 form",
        ],
      },
      {
        type: "h2",
        text: "The Biggest Audit Red Flags for Self-Employed Canadians",
      },
      {
        type: "ul",
        items: [
          "Unusually high meals and entertainment claims relative to business income",
          "Vehicle expenses that imply near-100% business use of a personal vehicle",
          "Large home office claims without a clear workspace proportion calculation",
          "Round-number estimates instead of actual tracked expenses",
          "Expenses that don't match the nature of your declared business",
        ],
      },
      {
        type: "callout",
        text: "If the CRA selects you for a review, you typically have 30 days to respond with supporting documentation. A cloud-based receipt system means you can produce a complete, organized expense report within hours — not weeks of frantic searching.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 2 — EXPENSE TRACKING
     Pillar: expense-tracking-canada-freelancers
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "expense-tracking-canada-freelancers",
    title: "Expense Tracking for Canadian Freelancers: The Complete System",
    excerpt:
      "A practical, end-to-end expense tracking system for Canadian freelancers and contractors — from capturing receipts daily to producing CRA-ready reports at filing time.",
    category: "Expense Tracking",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/expense-tracking-canada-freelancers/600/400",
    imageAlt: "Freelancer tracking business expenses on a laptop with receipts",
    tags: ["expense tracking", "freelancer", "self-employed", "receipts", "CRA", "bookkeeping"],
    clusterName: "Expense Tracking",
    relatedSlugs: [
      "business-expense-categories-canada",
      "receipt-organization-tips-canada",
      "reimbursable-expenses-canada-freelancers",
      "self-employed-expense-report-template-canada",
    ],
    body: [
      {
        type: "p",
        text: "Most Canadian freelancers treat expense tracking as a once-a-year scramble before tax filing. The result: missed deductions, stress, and records that don't survive CRA scrutiny. A consistent tracking system — one that takes minutes per week rather than hours per year — changes this completely. Here's how to build one.",
      },
      {
        type: "h2",
        text: "The Three Pillars of Freelancer Expense Tracking",
      },
      {
        type: "ul",
        items: [
          "Capture: photograph or save every business receipt the moment you incur the expense",
          "Categorize: tag each expense with the correct CRA expense category (meals, office supplies, professional fees, etc.)",
          "Reconcile: match your receipts against your bank and credit card statements monthly",
        ],
      },
      {
        type: "h2",
        text: "Setting Up Your Expense Categories",
      },
      {
        type: "p",
        text: "Your expense categories should map directly to the lines on CRA Form T2125 (Statement of Business or Professional Activities). The main categories are: advertising, meals and entertainment (50% deductible), office expenses, professional fees, rent, repairs and maintenance, salaries, telephone and utilities, travel, and vehicle expenses. Setting these up correctly from day one means your year-end categorization is already done.",
      },
      {
        type: "h2",
        text: "The Monthly Reconciliation Habit",
      },
      {
        type: "p",
        text: "Once per month, spend 20 minutes reconciling: check that every business transaction on your bank and credit card statements has a corresponding receipt in your tracking system. Flag anything missing. This monthly habit means you're never more than 30 days behind on documentation — making tax season a review, not a rescue operation.",
      },
      {
        type: "h2",
        text: "Separating Business and Personal Finances",
      },
      {
        type: "p",
        text: "A dedicated business bank account and credit card are the single biggest time-savers for freelancer bookkeeping. When all your business transactions flow through a single account, reconciliation is straightforward. When business and personal are mixed, every statement review requires judgment calls about each line — multiplying your bookkeeping time significantly.",
      },
      {
        type: "callout",
        text: "CRA rule of thumb: if an expense has both a personal and business component, you can only deduct the business portion — and you must be able to document that calculation. A 60/40 business/personal phone split, for example, should be supported by records of how you determined that ratio.",
      },
      {
        type: "h2",
        text: "What to Do With Mixed-Use Expenses",
      },
      {
        type: "ul",
        items: [
          "Phone bills: track business call time vs. total usage for at least one representative month",
          "Vehicle: keep a mileage logbook to establish the business-use percentage",
          "Home office: calculate workspace square footage as a percentage of total home area",
          "Meals: note the client name and business purpose on the receipt at the time of the meal",
          "Travel: document which portion was for business if the trip had personal components",
        ],
      },
    ],
  },

  {
    slug: "business-expense-categories-canada",
    title: "Business Expense Categories for Canadian Self-Employed Workers",
    excerpt:
      "A complete guide to the CRA's business expense categories on Form T2125 — what each line includes, what's excluded, and how to categorize common freelancer expenses correctly.",
    category: "Expense Tracking",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/business-expense-categories-canada/600/400",
    imageAlt: "Expense category spreadsheet for Canadian self-employed tax filing",
    tags: ["expense categories", "T2125", "deductions", "self-employed", "CRA"],
    clusterPillar: "expense-tracking-canada-freelancers",
    clusterName: "Expense Tracking",
    relatedSlugs: [
      "expense-tracking-canada-freelancers",
      "top-tax-deductions-canadian-self-employed-2025",
      "t2125-form-guide-canada",
    ],
    body: [
      {
        type: "p",
        text: "CRA Form T2125 has 22 expense lines. Using the right one for each expense isn't just about organization — wrong categorization can trigger questions during a review. Here's how to correctly classify the most common freelancer expenses.",
      },
      {
        type: "h2",
        text: "Key T2125 Expense Lines Explained",
      },
      {
        type: "ul",
        items: [
          "Advertising: website ads, social media campaigns, business cards, print advertising",
          "Meals and entertainment: 50% of client meals, networking events — must note business purpose",
          "Office expenses: stationery, printer ink, postage, small office supplies (not furniture)",
          "Professional fees: accountant, lawyer, consultant fees directly related to your business",
          "Telephone and utilities: business-use portion of your phone and internet bills",
          "Travel: flights, hotels, ground transport for business trips (not commuting)",
          "Other expenses: software subscriptions, cloud storage, professional development, dues",
        ],
      },
      {
        type: "h2",
        text: "Common Categorization Mistakes",
      },
      {
        type: "ul",
        items: [
          "Putting software subscriptions under 'Office expenses' instead of 'Other expenses' — both work, but be consistent",
          "Deducting 100% of meals when only 50% is allowable (the most common CRA adjustment)",
          "Mixing equipment purchases (which belong in Capital Cost Allowance) with operating expenses",
          "Claiming personal travel as business travel without documentation of the business purpose",
        ],
      },
      {
        type: "callout",
        text: "The CRA publishes the T2125 guide (T4002) each tax year with updated descriptions of what belongs in each line. When in doubt, read the guide or ask your accountant — consistency year over year matters more than minor categorization variations.",
      },
    ],
  },

  {
    slug: "receipt-organization-tips-canada",
    title: "How to Organize Receipts for Tax Season in Canada",
    excerpt:
      "Simple, CRA-compliant receipt organization systems that take 5 minutes per week and make tax season a review — not a recovery mission.",
    category: "Expense Tracking",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/receipt-organization-tips-canada/600/400",
    imageAlt: "Organized filing system for business receipts and tax documents",
    tags: ["receipt organization", "tax season", "record keeping", "freelancer", "CRA"],
    clusterPillar: "expense-tracking-canada-freelancers",
    clusterName: "Expense Tracking",
    relatedSlugs: [
      "expense-tracking-canada-freelancers",
      "digital-receipts-canada-are-they-valid",
      "cra-receipt-rules-canada",
    ],
    body: [
      {
        type: "p",
        text: "Receipt organization fails for one reason: the system requires too much effort at the moment you're least motivated — right after a purchase. The solution is to make the default action automatic, not effortful.",
      },
      {
        type: "h2",
        text: "The Capture-First System",
      },
      {
        type: "p",
        text: "The only rule that matters: photograph or save every business receipt immediately. Don't wait until you're back at your desk. The photo goes into your receipt app, email folder, or designated album before you put your wallet away. Everything else — categorization, amount entry, GST extraction — can wait. The critical thing is that the receipt is captured before it's lost.",
      },
      {
        type: "h2",
        text: "Folder Structure for Digital Receipt Archives",
      },
      {
        type: "ul",
        items: [
          "Top level: one folder per tax year (e.g., '2025 Business Receipts')",
          "Subfolders by month: 01-January through 12-December",
          "Or subfolders by category: matching your T2125 expense lines",
          "Naming convention: YYYY-MM-DD_Vendor_Amount.pdf (sortable, searchable)",
          "Back up to at least two locations — cloud + local external drive",
        ],
      },
      {
        type: "callout",
        text: "Apps like ReceiptOne eliminate manual folder management entirely: scan, extract, categorize automatically, and export a CRA-ready report at any time. The manual folder approach works fine for lower volumes (under ~30 receipts/month); above that, an app saves significant time.",
      },
    ],
  },

  {
    slug: "self-employed-expense-report-template-canada",
    title: "How to Create an Expense Report as a Self-Employed Canadian",
    excerpt:
      "A step-by-step guide to creating expense reports for your accountant, clients, and CRA — what to include, how to format it, and how to automate the process.",
    category: "Expense Tracking",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/self-employed-expense-report-template-canada/600/400",
    imageAlt: "Self-employed Canadian creating an expense report on a laptop",
    tags: ["expense report", "self-employed", "freelancer", "accountant", "CRA"],
    clusterPillar: "expense-tracking-canada-freelancers",
    clusterName: "Expense Tracking",
    relatedSlugs: [
      "expense-tracking-canada-freelancers",
      "business-expense-categories-canada",
      "reimbursable-expenses-canada-freelancers",
    ],
    body: [
      {
        type: "p",
        text: "As a self-employed Canadian, you need expense reports for two audiences: the CRA (to support your T2125 filing) and clients or employers (for reimbursement). Both require the same underlying data, but formatted differently.",
      },
      {
        type: "h2",
        text: "What a CRA-Ready Expense Report Must Include",
      },
      {
        type: "ul",
        items: [
          "Your name and business name",
          "Tax year the report covers",
          "Each expense: date, vendor, description, category, amount, GST/HST amount",
          "Subtotals by T2125 category",
          "Total GST/HST paid (for ITC calculation)",
          "Note of any partially deductible expenses and the percentage claimed",
        ],
      },
      {
        type: "h2",
        text: "Client Reimbursement Reports",
      },
      {
        type: "p",
        text: "For client reimbursement, include: project or contract name, expense date, description, receipt attached or reference number, and total requested. Most clients want a PDF with receipts as attachments. Clearly separate reimbursable from non-reimbursable expenses if you're reporting both in one document.",
      },
      {
        type: "callout",
        text: "ReceiptOne exports both formats: a category-summary CSV for your accountant's T2125 prep, and a per-expense PDF with attached receipt images for clients. This eliminates re-formatting the same data for two different audiences.",
      },
    ],
  },

  {
    slug: "reimbursable-expenses-canada-freelancers",
    regions: ["all"],
    title: "Tracking Reimbursable Expenses as a Canadian Freelancer",
    excerpt:
      "When clients owe you money for out-of-pocket expenses, your tracking system determines how fast you get paid — and whether the amount is correct.",
    category: "Expense Tracking",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/reimbursable-expenses-canada-freelancers/600/400",
    imageAlt: "Freelancer submitting a client expense reimbursement report",
    tags: [
      "reimbursable expenses",
      "client billing",
      "freelancer",
      "invoicing",
      "expense tracking",
    ],
    clusterPillar: "expense-tracking-canada-freelancers",
    clusterName: "Expense Tracking",
    relatedSlugs: [
      "expense-tracking-canada-freelancers",
      "self-employed-expense-report-template-canada",
      "business-expense-categories-canada",
    ],
    body: [
      {
        type: "p",
        text: "Reimbursable expenses are costs you pay on a client's behalf that the client has agreed to cover. The tax treatment differs from pure business expenses: if a client reimburses you exactly, the reimbursement and expense cancel out — no net deduction, but also no net income. If you're reimbursed less than you spent, the shortfall is your business expense.",
      },
      {
        type: "h2",
        text: "The Key Rule: Tag Reimbursables at the Point of Purchase",
      },
      {
        type: "p",
        text: "Mark every reimbursable expense as such the moment you capture the receipt. Trying to identify reimbursables from memory at billing time means some will be missed — which is money lost. The expense note should include: the client name, the project, and whether the full amount or a percentage is reimbursable.",
      },
      {
        type: "h2",
        text: "GST/HST on Reimbursable Expenses",
      },
      {
        type: "ul",
        items: [
          "If you're GST/HST-registered and the expense is reimbursed, you may need to charge GST/HST on the reimbursement as part of your supply",
          "Whether reimbursements attract GST/HST depends on whether the expense is considered a 'disbursement' (passthrough) or a 'supply' (your service)",
          "True disbursements — where you act purely as a payment agent — generally don't attract additional GST/HST",
          "Consult a tax professional if your reimbursements are significant — the rules are fact-specific",
        ],
      },
    ],
  },

  {
    slug: "home-office-vs-coworking-expense-canada",
    regions: ["all"],
    title: "Home Office vs. Co-working Space: Which Expense Wins at Tax Time?",
    excerpt:
      "Comparing the real after-tax cost of a home office deduction versus a co-working membership for Canadian freelancers — the math might surprise you.",
    category: "Expense Tracking",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-20",
    imageUrl: "https://picsum.photos/seed/home-office-vs-coworking-expense-canada/600/400",
    imageAlt: "Freelancer working in a co-working space compared to home office",
    tags: ["home office", "co-working", "deductions", "freelancer", "workspace expenses"],
    clusterPillar: "expense-tracking-canada-freelancers",
    clusterName: "Expense Tracking",
    relatedSlugs: [
      "home-office-deduction-canadian-freelancers",
      "expense-tracking-canada-freelancers",
      "top-tax-deductions-canadian-self-employed-2025",
    ],
    body: [
      {
        type: "p",
        text: "A co-working membership is 100% deductible as a business expense. A home office deduction gives you a percentage of your home costs based on your workspace proportion. The question is: which produces a larger actual deduction — and which one reflects your real working situation?",
      },
      {
        type: "h2",
        text: "Home Office: The Math",
      },
      {
        type: "p",
        text: "If your office is 10% of your home's square footage, you can deduct 10% of rent, utilities, insurance, and property taxes. For a freelancer paying $2,400/month rent with $200/month in utilities, that's roughly $312/year in deductions — before you factor in internet and any workspace-specific costs. The deduction scales with home cost, so owners with mortgages, high property taxes, and large homes benefit most.",
      },
      {
        type: "h2",
        text: "Co-working Space: The Math",
      },
      {
        type: "p",
        text: "A co-working membership at $300–$600/month is fully deductible as rent on your T2125. That's $3,600–$7,200/year in deductions — far larger than most home office calculations. The trade-off is that you're paying for the co-working space on top of your home costs, so the net cost is higher even accounting for the tax savings.",
      },
      {
        type: "callout",
        text: "The home office deduction is not an either/or choice with co-working. If you use both — working from home most days and the co-working space occasionally — you can potentially claim both, proportionally to actual usage. Document which days you use each location.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 3 — GST/HST TRACKING
     Pillar: gst-hst-expense-tracking-canada
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "gst-hst-expense-tracking-canada",
    title: "GST/HST for Canadian Freelancers: The Complete Expense Tracking Guide",
    excerpt:
      "Everything self-employed Canadians need to know about tracking GST/HST on expenses — from input tax credits to filing periods to the provincial rules that trip people up.",
    category: "GST / HST",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/gst-hst-expense-tracking-canada/600/400",
    imageAlt: "Canadian freelancer tracking GST/HST on business expense receipts",
    tags: ["GST", "HST", "input tax credits", "ITC", "self-employed", "CRA", "PST"],
    clusterName: "GST/HST Tracking",
    relatedSlugs: [
      "track-gst-hst-business-expenses",
      "input-tax-credits-canada-guide",
      "gst-hst-registration-threshold-canada",
      "pst-qst-freelancers-canada",
    ],
    body: [
      {
        type: "p",
        text: "GST/HST is one of the most valuable — and most misunderstood — aspects of running a self-employed business in Canada. Get it right and you recover hundreds or thousands in input tax credits each year. Get it wrong and you either leave money on the table or face reassessment. This guide covers the complete picture: registration thresholds, ITC claims, provincial variations, and filing mechanics.",
      },
      {
        type: "h2",
        text: "When You Must Register for GST/HST",
      },
      {
        type: "p",
        text: "GST/HST registration becomes mandatory once your taxable supplies exceed $30,000 in any single calendar quarter, or in the last four consecutive quarters. This threshold is per individual, not per client. Once crossed, you must register within 29 days of the quarter-end in which you exceeded the threshold.",
      },
      {
        type: "h2",
        text: "The ITC Advantage: Getting Your GST/HST Back",
      },
      {
        type: "p",
        text: "Once registered, you claim back the GST/HST you paid on business expenses as input tax credits (ITCs). These credits offset the GST/HST you collect from clients. If your ITCs exceed the tax you collect (common for new businesses with high startup costs), the CRA issues a refund. This is why some freelancers choose to register voluntarily before hitting the $30,000 threshold — particularly those with significant startup expenses.",
      },
      {
        type: "h2",
        text: "Provincial GST/HST Rates (2025)",
      },
      {
        type: "ul",
        items: [
          "5% GST only: Alberta, British Columbia, Manitoba, Saskatchewan, Northwest Territories, Nunavut, Yukon",
          "13% HST: Ontario",
          "15% HST: New Brunswick, Newfoundland & Labrador, Nova Scotia, Prince Edward Island",
          "5% GST + 9.975% QST: Quebec (QST is claimed separately through Revenu Québec)",
          "Note: BC, Manitoba, and Saskatchewan also charge PST (7–8%), which is NOT recoverable as an ITC",
        ],
      },
      {
        type: "h2",
        text: "ITC Documentation Requirements by Purchase Amount",
      },
      {
        type: "ul",
        items: [
          "Under $30: vendor name, date, total — no GST number required",
          "$30–$149.99: add vendor's GST/HST registration number and total tax",
          "$150+: add buyer's name or trade name",
        ],
      },
      {
        type: "callout",
        text: "The Quick Method of accounting for GST/HST lets eligible small businesses remit a flat percentage of sales instead of tracking every ITC individually. It simplifies filing but often results in paying more net GST/HST than the detailed method. Run the numbers with your accountant before electing it.",
      },
      {
        type: "h2",
        text: "Choosing Your Filing Period",
      },
      {
        type: "p",
        text: "Annual filers (under $1.5M in taxable supplies) file once per year. Quarterly or monthly filing is also available by election and can help cash flow if you regularly receive large ITC refunds. The downside is more frequent filing. Most sole proprietors earning under $500,000 per year do well on annual filing unless they have seasonal expense spikes that would otherwise create cash flow gaps.",
      },
    ],
  },

  {
    slug: "track-gst-hst-business-expenses",
    title: "How to Track GST/HST on Your Business Expenses",
    excerpt:
      "Claiming input tax credits (ITCs) is one of the most valuable tax advantages for self-employed Canadians. Here's how to track GST/HST correctly so you never leave money on the table.",
    category: "GST / HST",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/track-gst-hst-business-expenses/600/400",
    imageAlt: "Person reviewing financial spreadsheets and tax documents",
    tags: ["GST", "HST", "input tax credits", "ITC", "self-employed"],
    clusterPillar: "gst-hst-expense-tracking-canada",
    clusterName: "GST/HST Tracking",
    relatedSlugs: [
      "gst-hst-expense-tracking-canada",
      "input-tax-credits-canada-guide",
      "gst-hst-registration-threshold-canada",
    ],
    body: [
      {
        type: "p",
        text: "If you're registered for GST/HST (which is mandatory once your revenue exceeds $30,000 in any 12-month period), you're entitled to claim input tax credits (ITCs) for the GST/HST you paid on business expenses. This effectively means the government refunds you the sales tax on legitimate business purchases — a significant benefit worth hundreds or thousands of dollars annually.",
      },
      {
        type: "h2",
        text: "Understanding GST vs. HST by Province",
      },
      {
        type: "ul",
        items: [
          "Ontario, New Brunswick, Nova Scotia, PEI, Newfoundland & Labrador: 15% HST",
          "British Columbia, Manitoba, Saskatchewan: 5% GST + provincial sales tax (PST) — PST is NOT recoverable as an ITC",
          "Alberta, Yukon, NWT, Nunavut: 5% GST only — no provincial sales tax",
          "Quebec: 5% GST + 9.975% QST — QST is claimed separately through Revenu Québec",
        ],
      },
      {
        type: "h2",
        text: "What You Need on a Receipt to Claim an ITC",
      },
      {
        type: "p",
        text: "The CRA has tiered documentation requirements based on the purchase amount. For purchases under $30, a simplified receipt showing the vendor name, date, and total is sufficient. For purchases between $30 and $149.99, the vendor's GST/HST registration number must also be present. For purchases of $150 or more, you also need the buyer's name or trade name, and a description of the goods or services.",
      },
      {
        type: "callout",
        text: "Important: PST paid in BC, Manitoba, or Saskatchewan cannot be claimed as an input tax credit — only the federal GST portion is recoverable. Quebec's QST must be claimed separately on your QST return with Revenu Québec.",
      },
      {
        type: "h2",
        text: "Filing Period: Annual vs. Quarterly vs. Monthly",
      },
      {
        type: "p",
        text: "When you register for GST/HST, the CRA assigns you a reporting period based on your revenue. Businesses with under $1.5 million in taxable supplies generally file annually. Between $1.5 million and $6 million, quarterly filing applies. Over $6 million requires monthly filing. You can elect to file more frequently if it helps your cash flow — particularly useful if you often receive large refunds.",
      },
      {
        type: "ul",
        items: [
          "Annual filers: return due June 15 (for calendar-year reporters), payment due April 30",
          "Quarterly filers: return and payment due one month after each quarter ends",
          "Keep all GST/HST-eligible receipts in a dedicated folder or app category",
          "Reconcile your ITC claims against your expense records before each filing",
        ],
      },
    ],
  },

  {
    slug: "input-tax-credits-canada-guide",
    title: "Input Tax Credits (ITCs) in Canada: A Freelancer's Guide",
    excerpt:
      "Input tax credits let GST/HST-registered freelancers recover the sales tax they pay on business expenses. Here's how ITCs work, what qualifies, and how to maximize your claims.",
    category: "GST / HST",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/input-tax-credits-canada-guide/600/400",
    imageAlt: "Canadian freelancer calculating input tax credits on GST/HST return",
    tags: ["ITC", "input tax credits", "GST", "HST", "self-employed", "CRA"],
    clusterPillar: "gst-hst-expense-tracking-canada",
    clusterName: "GST/HST Tracking",
    relatedSlugs: [
      "gst-hst-expense-tracking-canada",
      "track-gst-hst-business-expenses",
      "cra-receipt-rules-canada",
    ],
    body: [
      {
        type: "p",
        text: "An input tax credit (ITC) is the mechanism that lets GST/HST-registered businesses recover the sales tax they paid on business expenses. In practice, it works like this: you collect GST/HST from clients, you pay GST/HST to suppliers, and on your GST/HST return you remit only the net amount. If your ITCs exceed your collections, the CRA owes you a refund.",
      },
      {
        type: "h2",
        text: "Which Expenses Qualify for ITCs?",
      },
      {
        type: "ul",
        items: [
          "Any business expense where GST/HST was charged by the supplier",
          "Equipment, technology, and capital assets used in your business",
          "Professional services: accountant, lawyer, consultant fees (if they charged HST/GST)",
          "Software subscriptions billed from Canadian companies",
          "Vehicle operating costs (proportional to business use)",
          "Office supplies, rent, utilities attributable to your business",
        ],
      },
      {
        type: "h2",
        text: "What Does NOT Qualify for an ITC",
      },
      {
        type: "ul",
        items: [
          "Expenses where no GST/HST was charged (zero-rated or exempt supplies)",
          "Personal portions of mixed-use expenses — only the business percentage qualifies",
          "Meals and entertainment — only 50% of the GST/HST paid is claimable as an ITC, matching the 50% expense deduction limit",
          "PST or QST — only federal GST and HST generate recoverable ITCs federally",
        ],
      },
      {
        type: "callout",
        text: "ITC timing: you can claim ITCs in the reporting period when the expense was incurred, or in any later period within four years. If you missed claiming ITCs in a prior period, you can still claim them — as long as you have the supporting receipts.",
      },
    ],
  },

  {
    slug: "gst-hst-registration-threshold-canada",
    title: "GST/HST Registration in Canada: When Freelancers Must Register",
    excerpt:
      "The $30,000 threshold, what counts toward it, when the clock starts, and why some freelancers should register voluntarily even before they're required to.",
    category: "GST / HST",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/gst-hst-registration-threshold-canada/600/400",
    imageAlt: "Canadian freelancer registering for GST/HST with CRA My Business Account",
    tags: ["GST registration", "HST", "small supplier", "self-employed", "$30,000 threshold"],
    clusterPillar: "gst-hst-expense-tracking-canada",
    clusterName: "GST/HST Tracking",
    relatedSlugs: [
      "gst-hst-expense-tracking-canada",
      "track-gst-hst-business-expenses",
      "input-tax-credits-canada-guide",
    ],
    body: [
      {
        type: "p",
        text: "You become a 'small supplier' under the Excise Tax Act — and are exempt from mandatory GST/HST registration — as long as your taxable revenues stay at or below $30,000 in any single calendar quarter AND in all four consecutive quarters combined. The moment either threshold is crossed, registration is required.",
      },
      {
        type: "h2",
        text: "What Counts Toward the $30,000 Threshold",
      },
      {
        type: "ul",
        items: [
          "All taxable supplies you make in Canada — services billed to Canadian clients",
          "Revenue from all your self-employment activities combined (not just one client or project)",
          "Zero-rated supplies (exports to non-Canadian clients) — these count toward the threshold but at 0% tax",
          "Does NOT include: employment income, income from exempt supplies, investment income",
        ],
      },
      {
        type: "h2",
        text: "Voluntary Registration: When It Makes Sense",
      },
      {
        type: "p",
        text: "Registering before you hit $30,000 lets you claim ITCs immediately — recovering GST/HST on startup costs like equipment, software, and professional services. If you have significant early expenses, early registration can generate a meaningful refund in your first year. The trade-off is that you must now charge GST/HST on your invoices, which slightly complicates billing for clients who aren't registered (they can't recover it).",
      },
      {
        type: "callout",
        text: "Register through CRA My Business Account online — you'll typically receive your GST/HST registration number within minutes for online applications, or a few days by mail. You cannot charge GST/HST or claim ITCs until you have your registration number.",
      },
    ],
  },

  {
    slug: "pst-qst-freelancers-canada",
    title: "PST and QST for Canadian Freelancers: What You Can and Can't Claim",
    excerpt:
      "Provincial sales taxes in BC, Manitoba, Saskatchewan, and Quebec are often confused with GST/HST — but they follow entirely different rules for self-employed workers.",
    category: "GST / HST",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/pst-qst-freelancers-canada/600/400",
    imageAlt: "Map of Canadian provinces with PST and QST tax rules for freelancers",
    tags: ["PST", "QST", "provincial sales tax", "Quebec", "British Columbia", "self-employed"],
    clusterPillar: "gst-hst-expense-tracking-canada",
    clusterName: "GST/HST Tracking",
    relatedSlugs: [
      "gst-hst-expense-tracking-canada",
      "track-gst-hst-business-expenses",
      "cra-receipt-rules-canada",
    ],
    body: [
      {
        type: "p",
        text: "Four Canadian provinces charge a provincial sales tax that operates separately from federal GST: British Columbia (PST 7%), Manitoba (RST 7%), Saskatchewan (PST 6%), and Quebec (QST 9.975%). Unlike HST, these provincial taxes are generally not recoverable as input tax credits on your federal GST/HST return — which affects how you should categorize and report them.",
      },
      {
        type: "h2",
        text: "PST in BC, Manitoba, and Saskatchewan",
      },
      {
        type: "p",
        text: "PST in these provinces is a cost of doing business — you pay it on purchases and cannot recover it. This means the full GST + PST amount you pay on a business purchase becomes your deductible expense, but only the GST portion generates an ITC. When entering expenses in your bookkeeping system, record the total purchase amount (including PST) as the expense, but only the GST portion as a recoverable ITC.",
      },
      {
        type: "h2",
        text: "QST in Quebec",
      },
      {
        type: "ul",
        items: [
          "Quebec collects QST (9.975%) separately from federal GST (5%) — total 14.975%",
          "If your QST-taxable supplies in Quebec exceed $30,000, you must also register for QST with Revenu Québec",
          "QST ITCs are claimed on your Quebec QST return, not your federal GST return",
          "Quebec freelancers effectively file two separate sales tax returns: one with CRA (GST) and one with Revenu Québec (QST)",
          "QST-registered businesses can recover the QST they paid on inputs through the QST ITC system",
        ],
      },
      {
        type: "callout",
        text: "ReceiptOne flags PST separately from GST/HST on your expense records. This ensures your ITC calculations stay accurate — PST is recorded as an expense cost, not as a recoverable credit.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 4 — MILEAGE & VEHICLE DEDUCTIONS
     Pillar: mileage-deduction-canada-freelancers
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "mileage-deduction-canada-freelancers",
    title: "Mileage Deduction for Canadian Freelancers: The 2026 Tax-Year Guide",
    excerpt:
      "How self-employed Canadians deduct vehicle costs for 2026: the business-use percentage, CRA logbook rules, the 2026 limits, and T2125 lines 9281, 9936 and 9943.",
    category: "Mileage & Auto",
    publishedAt: "2026-10-04",
    updatedAt: "2026-10-04",
    imageUrl: "https://picsum.photos/seed/mileage-deduction-canada-freelancers/600/400",
    imageAlt: "Canadian freelancer tracking business mileage for CRA deduction",
    tags: [
      "mileage",
      "vehicle expenses",
      "automobile deduction",
      "logbook",
      "CRA",
      "self-employed",
    ],
    clusterName: "Mileage & Vehicle Deductions",
    relatedSlugs: [
      "mileage-tracking-self-employed-2025-guide",
      "cra-mileage-logbook-requirements",
      "vehicle-expense-deductions-canada",
      "mileage-tracking-apps-canada",
    ],
    body: [
      {
        type: "p",
        text: "If you are self-employed in Canada and use your own vehicle for work, you deduct the business share of what the vehicle actually costs you to run: business kilometres divided by total kilometres, multiplied by your eligible expenses, claimed on Form T2125. The per-kilometre figure you may have heard quoted (73 cents for the first 5,000 km in 2026) is not that deduction. It is the CRA's limit on tax-free allowances that employers pay employees, and it only becomes relevant to you if someone, such as your own corporation, is paying you an allowance.",
      },
      {
        type: "p",
        text: "This guide covers the 2026 tax year, which self-employed individuals file in 2027. Every figure below comes from canada.ca. Where a 2026 figure had not been published when this was written, we say so and give the latest published one.",
      },
      {
        type: "h2",
        text: "The 2026 Rates and Limits",
      },
      {
        type: "p",
        text: "The Department of Finance announced the 2026 automobile limits on January 14, 2026. They apply to vehicles bought, leased or financed on or after January 1, 2026:",
      },
      {
        type: "ul",
        items: [
          "Per-kilometre allowance limit, provinces: 73¢ for the first 5,000 km and 67¢ for each additional kilometre (2025: 72¢ and 66¢)",
          "Per-kilometre allowance limit, territories: 77¢ for the first 5,000 km and 71¢ for each additional kilometre (2025: 76¢ and 70¢)",
          "Capital cost ceiling for Class 10.1 passenger vehicles: $39,000 before tax (up from $38,000 in 2025)",
          "Capital cost ceiling for Class 54 zero-emission passenger vehicles: $61,000 before tax (unchanged)",
          "Deductible leasing costs: $1,100 per month before tax for new leases (unchanged)",
          "Deductible interest on a vehicle loan: $350 per month for new loans (unchanged)",
        ],
      },
      {
        type: "p",
        text: 'The leasing, interest and capital cost ceilings apply to "passenger vehicles" as the Income Tax Act defines them. They are prorated by days, not applied as flat annual amounts. The CRA\'s own interest example works it out as $350 ÷ 30 × 365 days = $4,258 for a full year, and you deduct the lesser of that and the interest you actually paid. Leases use the same pattern in Chart C of Form T2125.',
      },
      {
        type: "h2",
        text: "Two Methods: Actual Expenses vs. the Per-Kilometre Allowance",
      },
      {
        type: "p",
        text: "Actual expenses is the method the CRA's T2125 guidance describes for sole proprietors, and it is the only vehicle method on that form. You total what you spent on the vehicle in the year, then claim the business-use share. Eligible costs listed by the CRA are licence and registration fees, fuel and oil, electricity for zero-emission vehicles, insurance, interest on money borrowed to buy the vehicle, maintenance and repairs, and leasing costs. Capital cost allowance (CCA) on a vehicle you own is claimed separately, at the same business-use percentage.",
      },
      {
        type: "p",
        text: "The per-kilometre allowance is an employment rule. An employer can pay an employee a set amount per business kilometre, and the CRA treats it as non-taxable when it is based only on business kilometres and the rate is reasonable. The prescribed rates above are what the CRA considers reasonable, because they are the maximum the employer can deduct. If you have incorporated and your company pays you an allowance for driving your own car, this is the method that applies. If you are a sole proprietor filing a T2125, it is not.",
      },
      {
        type: "h2",
        text: "Worked Example in CAD",
      },
      {
        type: "p",
        text: "The figures below are hypothetical, chosen to show the arithmetic. Suppose a sole proprietor with a December 31 year-end drives 20,000 km in 2026, of which 8,000 km are business trips recorded in a logbook. Business use is 8,000 ÷ 20,000 = 40%. The year's vehicle costs are:",
      },
      {
        type: "ul",
        items: [
          "Fuel: $2,600",
          "Insurance: $1,800",
          "Maintenance and repairs: $900",
          "Licence and registration: $150",
          "Loan interest: $1,500, below the full-year limit of $4,258, so all of it counts",
          "Total: $6,950 × 40% = $2,780",
          "Business parking: $240, deducted in full rather than at 40%",
          "Amount on line 9281: $3,020",
        ],
      },
      {
        type: "p",
        text: "CCA on the vehicle goes on line 9936, also reduced to 40%. Now compare the allowance method. If an employer paid an allowance for the same 8,000 business kilometres at the 2026 provincial rates, the most that could be treated as reasonable is 5,000 × $0.73 + 3,000 × $0.67 = $3,650 + $2,010 = $5,660. That money would be a tax-free payment from an employer, not a deduction on your own T2125. It is useful to know the number if you are deciding whether your corporation should reimburse you, but a sole proprietor cannot choose it.",
      },
      {
        type: "h2",
        text: "What Records the CRA Expects",
      },
      {
        type: "p",
        text: 'The CRA calls an accurate logbook kept for the entire year "the best evidence" of business use. For each business trip, record:',
      },
      {
        type: "ul",
        items: ["Date", "Destination", "Purpose", "Number of kilometres driven"],
      },
      {
        type: "p",
        text: "Also record the odometer reading at the start and end of your fiscal period. If you buy, sell or trade a vehicle during the year, note the date and the odometer reading at that point. If you use more than one vehicle for business, keep a separate record for each one and calculate each vehicle's expenses separately. Keep the receipts too: the CRA allows motor vehicle expenses only when they are reasonable and supported by receipts.",
      },
      {
        type: "p",
        text: "You do not have to log every trip forever. The CRA's simplified logbook rule works like this:",
      },
      {
        type: "ul",
        items: [
          "Keep a full logbook for one complete 12-month period. This is your base year.",
          "In later years, keep a logbook for a three-month sample period instead.",
          "Calculate annual business use as (sample period % ÷ base-year % for the same months) × base-year annual %.",
          "The sample stands in for the year only if the result is within 10 percentage points of the base year. The CRA's example has a 49% base year, so 39% to 59% is acceptable.",
          "If the result moves by more than 10 points, the sample covers only its own three months. For the rest of the year you need an actual record of travel, and the CRA suggests starting a new 12-month base year.",
        ],
      },
      {
        type: "p",
        text: "The CRA's own example: a base year with 49% annual business use, and 46% for April to June. A later year's April-to-June sample shows 51%. Calculated use is (51% ÷ 46%) × 49% = 54%. That is within the 39% to 59% band, so the CRA would accept 54% in the absence of contradictory evidence. Because the base year keeps doing work in later years, its logbook must be kept for six years from the end of the last tax year it is used to support. All other records follow the usual rule of six years from the end of the tax year they relate to.",
      },
      {
        type: "h2",
        text: "How to Calculate Your Business-Use Percentage",
      },
      {
        type: "p",
        text: "The formula is business kilometres ÷ total kilometres. Your total kilometres come from the two odometer readings, and your business kilometres come from adding up the logbook. The CRA's published example: 27,000 business kilometres out of 30,000 total, with $5,400 of expenses, gives 27,000 ÷ 30,000 × $5,400 = $4,860.",
      },
      {
        type: "p",
        text: "The judgment call is which trips count as business. The CRA's longstanding position, set out in the archived Interpretation Bulletin IT-521R, is that driving between your home and your place of business is personal unless your home is the base of your business operations. If you have an office or other fixed workplace elsewhere, your home normally does not qualify. If you run the business from home and drive out to clients or job sites, those trips can be business travel. Travel between different locations of the same business is deductible.",
      },
      {
        type: "callout",
        text: "The arithmetic is easy. The hard part is having a trip-by-trip record of business kilometres when you need it. ReceiptOne's Log Trip feature records each trip's date and route distance from the start and end addresses you enter, which builds the business-kilometre side of the calculation as the year goes. You still need your odometer readings for total kilometres.",
      },
      {
        type: "h2",
        text: "Which T2125 Lines Are Involved",
      },
      {
        type: "ul",
        items: [
          "Chart A, Motor vehicle expenses: where you list the year's costs and apply the business-use percentage",
          "Chart B, Available interest expense for passenger vehicles: caps loan interest at the $350-per-month limit, prorated by days",
          "Chart C, Eligible leasing cost for passenger vehicles: caps lease payments at the $1,100-per-month limit",
          "Line 9281, Motor vehicle expenses (not including CCA): the result of Chart A, plus full business parking and supplementary business insurance",
          "Line 9936, Capital cost allowance: CCA on the vehicle (Class 10 or 10.1 at 30%, or Class 54 for a zero-emission passenger vehicle), reduced to the business-use share",
          "Line 9943, Other amounts deductible from your share of the net partnership income (loss): partners who use their personal vehicle for partnership business claim those costs here",
        ],
      },
      {
        type: "p",
        text: "A passenger vehicle that costs more than the ceiling for its year goes into its own Class 10.1, with a separate class for each vehicle. That means $38,000 before tax for vehicles acquired in 2025 and $39,000 for those acquired on or after January 1, 2026. The capital cost is capped at the ceiling plus GST/HST or PST on it. Recapture and terminal loss rules do not apply to Class 10.1 vehicles.",
      },
      {
        type: "h2",
        text: "Deadlines for the 2026 Tax Year",
      },
      {
        type: "p",
        text: "The CRA's filing deadline is June 15 for self-employed individuals and their spouses or common-law partners, but any balance owing is due by April 30. For 2025 returns those dates were April 30 and June 15, 2026. At the time of writing, the CRA had not yet published its dated calendar for 2026 returns. The same rules put them at April 30, 2027 for payment and June 15, 2027 for filing. Confirm against the CRA's due-dates page before you file.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "p",
        text: "Can I just claim the 73-cents-per-kilometre rate on my T2125? No. That rate is the limit on tax-free allowances employers pay employees. A sole proprietor claims the business share of actual vehicle costs through Chart A and line 9281, plus CCA on line 9936.",
      },
      {
        type: "p",
        text: "Is driving from home to a client's office deductible? It depends where your business is based. If your home is the base of your business operations and you have no office elsewhere, trips out to clients can count as business travel. If you have an office or other fixed workplace, travel between home and that workplace is personal.",
      },
      {
        type: "p",
        text: "Do I have to keep a logbook every year? You need one full 12-month logbook to set a base year. After that, a three-month sample logbook each year is enough, as long as the calculated annual business use stays within 10 percentage points of the base year.",
      },
      {
        type: "p",
        text: "Are parking costs reduced by my business-use percentage? No. The CRA lets you deduct the full amount of parking fees related to your business, and supplementary business insurance, without prorating them.",
      },
      {
        type: "p",
        text: "I bought a car in 2026 for $45,000. What can I claim? If it is a passenger vehicle, it goes into Class 10.1 and its capital cost is capped at $39,000 plus GST/HST or PST on that amount. CCA is claimed at 30% on the capped amount (subject to the first-year rules in Guide T4002), reduced to your business-use share. A zero-emission passenger vehicle goes into Class 54 instead, with a $61,000 ceiling.",
      },
      {
        type: "p",
        text: "I'm an employee, not self-employed. Do these rules apply? Partly. Employees claim on line 22900 using Form T777, and only if all of the CRA's conditions are met. You must normally be required to work away from your employer's place of business or in different places, and have to pay your own vehicle expenses under your employment contract. You must also not receive a non-taxable vehicle allowance, and must keep a Form T2200 signed by your employer. The logbook and business-use rules are the same.",
      },
    ],
  },

  {
    slug: "mileage-tracking-self-employed-2025-guide",
    title: "Mileage Tracking for Self-Employed Workers: The Complete 2025 Guide",
    excerpt:
      "The practical, day-to-day discipline of mileage tracking for self-employed Canadians — what to log in the moment, GPS vs. manual logging, and the habits that keep a logbook audit-ready all year.",
    category: "Mileage & Auto",
    publishedAt: "2026-05-10",
    updatedAt: "2026-08-06",
    imageUrl: "https://picsum.photos/seed/mileage-tracking-self-employed-2025-guide/600/400",
    imageAlt: "CRA mileage tracking for Canadian self-employed drivers",
    tags: ["mileage", "automobile", "logbook", "CRA", "vehicle expenses"],
    clusterPillar: "mileage-deduction-canada-freelancers",
    clusterName: "Mileage & Vehicle Deductions",
    relatedSlugs: [
      "mileage-deduction-canada-freelancers",
      "cra-mileage-logbook-requirements",
      "vehicle-expense-deductions-canada",
    ],
    body: [
      {
        type: "p",
        text: "Knowing that mileage is deductible is the easy part — the deduction actually falls apart at the tracking stage. Most self-employed drivers who lose a vehicle-expense claim don't lose it because the trip wasn't legitimate business driving; they lose it because the logbook wasn't kept the way the CRA expects. This guide is about the day-to-day habit of tracking, not the deduction rules themselves — for what's deductible, the 2025 expense limits, and the simplified logbook method's math, see our complete mileage deduction guide.",
      },
      {
        type: "h2",
        text: "What to Capture the Moment You Start Driving",
      },
      {
        type: "p",
        text: 'A trip logged well takes seconds. Before you pull out of the driveway (or right after you park), get into the habit of capturing five things: the date, your starting point, your destination, why you\'re making the trip, and the kilometres involved. The specific business purpose is the field people skimp on most — "client meeting" is weaker evidence than "site visit, 45 Elm St. — kitchen renovation quote," and a vague purpose is exactly what an auditor will push back on first.',
      },
      {
        type: "p",
        text: "Odometer readings matter more than most people realize. You need a start-of-year and end-of-year reading to establish total kilometres driven, which is the denominator in your business-use percentage. Missing either reading means you're stuck estimating your total annual mileage after the fact — never a strong position if the CRA asks for support.",
      },
      {
        type: "h2",
        text: "GPS Tracking vs. Manual Logging",
      },
      {
        type: "p",
        text: "Manual logging works if you're disciplined about it, but it fails in a predictable way: short trips get skipped in the moment and \"added later from memory,\" which is precisely the kind of reconstruction the CRA doesn't accept as contemporaneous. A paper or spreadsheet logbook also can't prove when an entry was actually written, which matters if your claim is ever questioned.",
      },
      {
        type: "p",
        text: "GPS or address-based tracking removes both problems. The app timestamps the entry automatically, calculates the distance for you instead of relying on an odometer estimate, and creates a record that's inherently contemporaneous because it's generated at the time of the trip. The tradeoff is that you still have to categorize each trip as business or personal — automation handles the distance and the timestamp, not your judgment about why you made the trip.",
      },
      {
        type: "h2",
        text: "Common Mileage-Tracking Mistakes That Cost You the Deduction",
      },
      {
        type: "ul",
        items: [
          "Batching entries at the end of the week or month from memory instead of logging as you go",
          "Recording only the destination, not a specific enough business purpose to justify it",
          "Never resetting or checking odometer readings at year start and year end",
          "Rounding trip distances instead of using actual figures",
          'Skipping short trips because they "don\'t add up to much" — they do, over a year',
          "Mixing personal errands into a trip without splitting out the business-only portion",
        ],
      },
      {
        type: "h2",
        text: "How to Stay Consistent All Year",
      },
      {
        type: "p",
        text: "The habit that actually survives twelve months is the one with the least friction. Log the trip when it happens, not at tax time — a 10-second entry beats a January reconstruction project every time. If you're on the CRA's simplified method, mark your calendar for the 3-month sample window in advance so it doesn't quietly slide past you. And do a quick monthly review of your logged trips rather than waiting until year-end to notice a gap; catching a missing week in February is a five-minute fix, catching it in December is a guess.",
      },
      {
        type: "callout",
        text: "ReceiptOne's Mileage tool is built around that low-friction habit. Log Trip lets you enter a start and end address and it works out the route and distance for you — no odometer math, no estimating. Every trip is timestamped the moment you save it, and your business-use percentage updates automatically as you go, so there's no year-end scramble to total up a spreadsheet.",
      },
    ],
  },

  {
    slug: "cra-mileage-logbook-requirements",
    title: "CRA Mileage Logbook Requirements: What You Must Record for Every Trip",
    excerpt:
      "The CRA is specific about what a valid mileage logbook must contain. Missing even one required field can invalidate an entire year's vehicle deduction claim.",
    category: "Mileage & Auto",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/cra-mileage-logbook-requirements/600/400",
    imageAlt: "Mileage logbook with CRA-required fields for Canadian freelancers",
    tags: ["mileage logbook", "CRA requirements", "vehicle deduction", "logbook", "self-employed"],
    clusterPillar: "mileage-deduction-canada-freelancers",
    clusterName: "Mileage & Vehicle Deductions",
    relatedSlugs: [
      "mileage-deduction-canada-freelancers",
      "mileage-tracking-self-employed-2025-guide",
      "vehicle-expense-deductions-canada",
    ],
    body: [
      {
        type: "p",
        text: "A mileage logbook is your primary evidence for vehicle expense claims. The CRA specifies exactly what it must contain — and 'approximately correct' doesn't pass an audit. Here's what every logbook entry needs.",
      },
      {
        type: "h2",
        text: "Required Fields for Every Logbook Entry",
      },
      {
        type: "ul",
        items: [
          "Date of the trip",
          "Starting location (city or address)",
          "Destination (city or address)",
          "Purpose of the trip — specific enough to verify it's a business trip",
          "Kilometres driven for that trip",
          "Odometer reading at the start and end of the year (to determine total kilometres driven)",
        ],
      },
      {
        type: "h2",
        text: "What 'Contemporaneous' Means — and Why It Matters",
      },
      {
        type: "p",
        text: "The CRA requires logbooks to be maintained contemporaneously — meaning entries are recorded at or near the time of the trip, not reconstructed later from memory. A logbook filled in at year-end all at once is not considered contemporaneous and will be rejected in an audit. App-based tracking that timestamps entries automatically solves this completely.",
      },
      {
        type: "h2",
        text: "The Year-End Summary Your Logbook Must Support",
      },
      {
        type: "ul",
        items: [
          "Total kilometres driven in the year (odometer end − odometer start)",
          "Total business kilometres (sum of all logged business trips)",
          "Business-use percentage (business km ÷ total km × 100)",
          "This percentage then applies to all vehicle expense receipts for the year",
        ],
      },
      {
        type: "callout",
        text: "ReceiptOne's mileage tracker automatically records start/end locations, timestamps each trip, and calculates your business-use percentage in real time — eliminating the end-of-year scramble to reconstruct your logbook.",
      },
    ],
  },

  {
    slug: "vehicle-expense-deductions-canada",
    title: "Vehicle Expense Deductions for Self-Employed Canadians: What to Claim",
    excerpt:
      "A detailed look at every vehicle expense category available to Canadian freelancers and contractors — with 2025 CRA limits and the documentation needed for each.",
    category: "Mileage & Auto",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/vehicle-expense-deductions-canada/600/400",
    imageAlt: "Self-employed Canadian calculating vehicle deduction expenses for CRA",
    tags: ["vehicle expenses", "automobile deduction", "CCA", "lease", "self-employed"],
    clusterPillar: "mileage-deduction-canada-freelancers",
    clusterName: "Mileage & Vehicle Deductions",
    relatedSlugs: [
      "mileage-deduction-canada-freelancers",
      "mileage-tracking-self-employed-2025-guide",
      "cra-mileage-logbook-requirements",
    ],
    body: [
      {
        type: "p",
        text: "Vehicle expense deductions for self-employed Canadians go far beyond fuel. Once you establish your business-use percentage via a logbook, that percentage applies to the full range of operating and ownership costs — each with its own documentation requirements and CRA limits.",
      },
      {
        type: "h2",
        text: "Operating Expenses (Apply Business-Use % Directly)",
      },
      {
        type: "ul",
        items: [
          "Fuel and oil — keep all gas receipts, including the date and odometer if possible",
          "Insurance premiums — keep annual policy documents and payment receipts",
          "Repairs and maintenance — keep invoices from mechanics and service shops",
          "License and registration fees — keep renewal notices and payment confirmations",
          "Car washes, if the vehicle is used for client-facing business",
        ],
      },
      {
        type: "h2",
        text: "Ownership Costs — CRA Limits Apply",
      },
      {
        type: "ul",
        items: [
          "Lease payments: 2025 deduction limit = $1,100/month (before tax). If your lease payment exceeds this, the excess is not deductible.",
          "Auto loan interest: 2025 limit = $10/day. Interest beyond this daily cap is non-deductible.",
          "Capital Cost Allowance (CCA): for purchased vehicles, claim CCA using Class 10 (30% declining balance) or Class 10.1 (30%) for vehicles over $37,000. The 2025 prescribed cost limit for Class 10.1 is $37,000 before taxes.",
        ],
      },
      {
        type: "callout",
        text: "Zero-emission vehicles: electric and plug-in hybrid vehicles placed in service after March 18, 2019 may qualify for Class 54 (100% CCA in year one on a net cost of up to $61,000) or Class 55 — check the CRA's current guidance, as these rules are subject to annual updates.",
      },
    ],
  },

  {
    slug: "mileage-tracking-apps-canada",
    title: "Best Mileage Tracking Apps for Canadian Freelancers in 2025",
    excerpt:
      "Manual mileage logbooks are a CRA compliance risk. Here's what to look for in a mileage tracking app — and how to choose the right one for your situation.",
    category: "Mileage & Auto",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/mileage-tracking-apps-canada/600/400",
    imageAlt: "Mileage tracking app on smartphone for Canadian freelancer CRA compliance",
    tags: ["mileage tracking app", "logbook app", "CRA", "freelancer", "vehicle deduction"],
    clusterPillar: "mileage-deduction-canada-freelancers",
    clusterName: "Mileage & Vehicle Deductions",
    relatedSlugs: [
      "mileage-deduction-canada-freelancers",
      "cra-mileage-logbook-requirements",
      "mileage-tracking-self-employed-2025-guide",
    ],
    body: [
      {
        type: "p",
        text: "The CRA requires mileage logbooks to be contemporaneous — recorded at the time of each trip, not reconstructed later. This single requirement makes a dedicated mileage tracking app vastly superior to a paper logbook or spreadsheet: every entry is automatically timestamped, location data is GPS-verified, and there's no temptation to 'fill it in later.'",
      },
      {
        type: "h2",
        text: "What a CRA-Compliant Mileage App Must Do",
      },
      {
        type: "ul",
        items: [
          "Record date, start location, end location, and distance for every trip",
          "Allow you to add a business purpose for each trip",
          "Automatically record odometer readings or calculate total kilometres accurately",
          "Export a complete logbook report in PDF or CSV format",
          "Timestamp entries so it's clear they were recorded at trip time, not reconstructed",
        ],
      },
      {
        type: "h2",
        text: "Manual vs. Automatic Trip Detection",
      },
      {
        type: "p",
        text: "Apps with automatic trip detection (via GPS and accelerometer) start and stop tracking without you touching your phone. This is the most accurate method and eliminates missed trips. The trade-off is battery usage and occasional false positives (e.g., a long walk). Semi-automatic apps prompt you when they detect you're in a vehicle. Manual apps require you to tap 'Start trip' — lowest battery impact, highest risk of forgetting.",
      },
      {
        type: "callout",
        text: "ReceiptOne includes mileage tracking built into the same app as your receipt scanning — so your vehicle logbook and expense receipts are in one place when you prepare your T2125.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 5 — FREELANCER TAX FUNDAMENTALS
     Pillar: freelancer-taxes-canada-guide
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "freelancer-taxes-canada-guide",
    title: "Canadian Freelancer Taxes: The Complete Guide to Filing as Self-Employed",
    excerpt:
      "A comprehensive walkthrough of how Canadian freelancers and contractors file taxes — from reporting income correctly to claiming every deduction you're entitled to.",
    category: "Tax Fundamentals",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/freelancer-taxes-canada-guide/600/400",
    imageAlt: "Canadian freelancer filing self-employed taxes with CRA forms",
    tags: ["freelancer taxes", "self-employed", "T2125", "CRA", "tax filing", "deductions"],
    clusterName: "Freelancer Tax Fundamentals",
    relatedSlugs: [
      "top-tax-deductions-canadian-self-employed-2025",
      "home-office-deduction-canadian-freelancers",
      "t2125-form-guide-canada",
      "tax-instalment-payments-canada-self-employed",
    ],
    body: [
      {
        type: "p",
        text: "Filing taxes as a self-employed Canadian is fundamentally different from filing as an employee. You report business income and expenses on Form T2125, pay both your own and the 'employer' portion of CPP contributions, and manage your own tax instalment payments. The good news: the deductions available to you are significantly more expansive than those available to employees. This guide walks you through the full picture.",
      },
      {
        type: "h2",
        text: "Reporting Self-Employment Income",
      },
      {
        type: "p",
        text: "All income earned from freelancing, contracting, or operating a business goes on Form T2125 (Statement of Business or Professional Activities), which is filed with your T1 personal return. You report gross income (total invoiced), then subtract eligible business expenses to arrive at net business income — the amount that's actually taxed. If you have multiple businesses or professional practices, you file a separate T2125 for each.",
      },
      {
        type: "h2",
        text: "CPP Contributions for Self-Employed Workers",
      },
      {
        type: "p",
        text: "As a self-employed Canadian, you pay both the employee and employer portions of CPP on your net self-employment income. For 2025, the combined CPP1 rate is 11.9% (up to the maximum pensionable earnings of $71,300), and CPP2 contributions apply on earnings between $71,300 and $81,900. This is a significant cost — roughly $6,000–$7,000 for a freelancer at maximum earnings — but the full employee-portion is claimed as a tax deduction, and the employer portion is eligible for a federal tax credit.",
      },
      {
        type: "h2",
        text: "Tax Instalment Payments",
      },
      {
        type: "p",
        text: "If your net tax owing exceeds $3,000 (or $1,800 in Quebec) in either the current or previous tax year, the CRA requires quarterly tax instalment payments: March 15, June 15, September 15, and December 15. Missing instalments triggers interest charges at the prescribed rate. The easiest method: pay one-quarter of your prior year's net tax owing each quarter.",
      },
      {
        type: "h2",
        text: "Key Tax Deadlines for Self-Employed Canadians",
      },
      {
        type: "ul",
        items: [
          "April 30: balance owing due (even though filing deadline is June 15)",
          "June 15: T1 filing deadline for self-employed individuals and their spouses",
          "March 15, June 15, Sept 15, Dec 15: quarterly instalment due dates",
          "April 30 or 3 months after year-end: GST/HST annual return due",
          "February 28 (next year): T4A slips due from clients who paid you $500+ for services",
        ],
      },
      {
        type: "h2",
        text: "The Self-Employed Tax Advantage",
      },
      {
        type: "p",
        text: "Despite the extra complexity, self-employed Canadians have access to a broader range of deductions than employees. Home office, vehicle expenses, professional development, business meals, equipment, software, and more — all reduce your taxable income dollar for dollar. A freelancer earning $80,000 with $20,000 in legitimate deductions pays tax on $60,000, not $80,000. Building a solid expense-tracking system is the single highest-ROI financial habit a freelancer can develop.",
      },
      {
        type: "callout",
        text: "The RRSP advantage: self-employed Canadians have no workplace pension, but 18% of net income (up to the annual limit — $31,560 for 2024) can be contributed to an RRSP and deducted from income. Maxing your RRSP is often the largest single deduction available to a high-earning freelancer.",
      },
    ],
  },

  {
    slug: "top-tax-deductions-canadian-self-employed-2025",
    title: "Top Tax Deductions for Canadian Self-Employed Workers in 2025",
    excerpt:
      "Self-employed Canadians can deduct a wide range of legitimate business expenses. Knowing which ones apply to you — and how to claim them correctly — can dramatically reduce your tax bill.",
    category: "Tax Deductions",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/top-tax-deductions-canadian-self-employed-2025/600/400",
    imageAlt: "Person working on a laptop with financial documents visible",
    tags: ["deductions", "self-employed", "freelancer", "tax savings", "2025"],
    clusterPillar: "freelancer-taxes-canada-guide",
    clusterName: "Freelancer Tax Fundamentals",
    relatedSlugs: [
      "freelancer-taxes-canada-guide",
      "home-office-deduction-canadian-freelancers",
      "t2125-form-guide-canada",
    ],
    body: [
      {
        type: "p",
        text: "When you work for yourself in Canada, you report your business income and expenses on Form T2125 (Statement of Business or Professional Activities). The CRA allows you to deduct any expense that was incurred to earn business income — as long as it's reasonable in amount and supported by documentation. Here are the most valuable deductions for Canadian freelancers in 2025.",
      },
      {
        type: "h2",
        text: "Core Business Expense Deductions",
      },
      {
        type: "ul",
        items: [
          "Software subscriptions (project management, accounting, design tools)",
          "Professional development — courses, conferences, industry books",
          "Professional dues and memberships (associations, unions, licensing fees)",
          "Advertising and marketing — social media ads, website hosting, SEO tools",
          "Business insurance premiums",
          "Bank charges and merchant fees for business accounts",
          "Legal and accounting fees related to your business",
          "Office supplies and postage",
        ],
      },
      {
        type: "h2",
        text: "Home Office Deductions",
      },
      {
        type: "p",
        text: "If you work from home regularly and your home workspace is your principal place of business (or you use it exclusively to meet clients), you can deduct a proportional share of home expenses. The calculation is based on the percentage of your home used for business — typically square footage of the workspace divided by total square footage. Eligible expenses include rent or mortgage interest, utilities, internet, property taxes, and maintenance costs.",
      },
      {
        type: "h2",
        text: "Technology and Equipment",
      },
      {
        type: "p",
        text: "Computers, phones, cameras, and other equipment used for business can be deducted, but generally through the Capital Cost Allowance (CCA) system rather than as a full immediate deduction. Most computer equipment falls under Class 10 (30% declining balance) or Class 50 (55% declining balance for general-purpose computing equipment). The Immediate Expensing Incentive allows eligible small businesses to fully deduct up to $1.5 million in capital purchases per year — check with your accountant for eligibility.",
      },
      {
        type: "callout",
        text: "For 2025, the federal basic personal amount is $16,129. Combined with the self-employment deductions above, many freelancers earning under $60,000 pay significantly less tax than employees at the same income level once all legitimate deductions are applied.",
      },
      {
        type: "h2",
        text: "Phone and Internet",
      },
      {
        type: "ul",
        items: [
          "Claim the business-use percentage of your phone bill (e.g., 70% if used mostly for work)",
          "Home internet can be partially deducted if used for business",
          "A dedicated business phone line is 100% deductible",
          "Keep your phone bills for 6 years — the CRA frequently reviews these claims",
        ],
      },
    ],
  },

  {
    slug: "home-office-deduction-canadian-freelancers",
    title: "The Home Office Deduction: What Canadian Freelancers Can Actually Claim",
    excerpt:
      "The home office deduction is widely misunderstood — many freelancers claim too little, and some claim expenses they're not entitled to. Here's the accurate 2025 breakdown.",
    category: "Tax Deductions",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/home-office-deduction-canadian-freelancers/600/400",
    imageAlt: "Modern home office setup with computer and organized workspace",
    tags: ["home office", "deductions", "workspace", "freelancer", "CRA"],
    clusterPillar: "freelancer-taxes-canada-guide",
    clusterName: "Freelancer Tax Fundamentals",
    relatedSlugs: [
      "freelancer-taxes-canada-guide",
      "home-office-vs-coworking-expense-canada",
      "top-tax-deductions-canadian-self-employed-2025",
    ],
    body: [
      {
        type: "p",
        text: "The home office deduction (technically called 'workspace in the home expenses' on Form T2125) allows self-employed Canadians to deduct a proportional share of their home costs when they use part of their home exclusively for their business. Unlike employees who briefly used a flat-rate method during the pandemic, self-employed individuals have always used the detailed method — and it's more generous than most people realize.",
      },
      {
        type: "h2",
        text: "Eligibility: When Can You Claim?",
      },
      {
        type: "p",
        text: "To claim home office expenses as a self-employed individual, your home workspace must meet at least one of two conditions: it must be where you principally perform your work (more than 50% of your working hours), OR it must be used exclusively on a regular and continuous basis to meet clients, customers, or patients. Meeting either condition qualifies you — you don't need to meet both.",
      },
      {
        type: "h2",
        text: "How to Calculate the Business-Use Percentage",
      },
      {
        type: "ul",
        items: [
          "Measure the square footage of your dedicated workspace",
          "Divide by the total finished square footage of your home",
          "Multiply the result by 100 to get your business-use percentage",
          "Example: 120 sq ft office in a 1,200 sq ft home = 10% business use",
          "If you use common areas part-time, the CRA accepts a reasonable estimate based on hours of use",
        ],
      },
      {
        type: "h2",
        text: "What Expenses Can You Deduct?",
      },
      {
        type: "p",
        text: "Apply your business-use percentage to the following home expenses to calculate your deductible amount. For renters, the full rent is the base; for homeowners, mortgage interest, not the principal repayment, is deductible.",
      },
      {
        type: "ul",
        items: [
          "Rent (if renting) — applies full business-use percentage",
          "Mortgage interest (not principal) — applies business-use percentage",
          "Home insurance premiums",
          "Property taxes",
          "Utilities: heat, electricity, water",
          "Internet service (business-use portion — often claimed separately)",
          "Maintenance and minor repairs attributable to the workspace",
          "Capital Cost Allowance on the home portion (use with caution — can affect principal residence exemption)",
        ],
      },
      {
        type: "callout",
        text: "Important limitation: Your home office deduction cannot create or increase a business loss. If your business expenses excluding home office already exceed your income, you cannot use home office expenses to deepen the loss — the excess carries forward to a future year when you have sufficient business income.",
      },
    ],
  },

  {
    slug: "t2125-form-guide-canada",
    title: "Form T2125 Explained: A Step-by-Step Guide for Canadian Freelancers",
    excerpt:
      "Form T2125 is how self-employed Canadians report business income and expenses to the CRA. Here's a line-by-line walkthrough so you don't miss a deduction.",
    category: "Tax Fundamentals",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/t2125-form-guide-canada/600/400",
    imageAlt: "Canadian freelancer completing Form T2125 for CRA tax filing",
    tags: ["T2125", "business income", "self-employed", "CRA", "tax form", "deductions"],
    clusterPillar: "freelancer-taxes-canada-guide",
    clusterName: "Freelancer Tax Fundamentals",
    relatedSlugs: [
      "freelancer-taxes-canada-guide",
      "business-expense-categories-canada",
      "top-tax-deductions-canadian-self-employed-2025",
    ],
    body: [
      {
        type: "p",
        text: "Form T2125 (Statement of Business or Professional Activities) is the core CRA form for self-employed income. It's where you report gross revenue, subtract business expenses, and arrive at net business income — the number that flows onto your T1 personal tax return and determines your tax and CPP owing.",
      },
      {
        type: "h2",
        text: "Part 1: Identification and Business Info",
      },
      {
        type: "p",
        text: "Enter your name, SIN, and business details: the name of your business (or your own name if you're a sole proprietor without a trade name), the main product or service you provide, your industry code (found in the T4002 guide), your fiscal year-end (usually December 31 for individuals), and your business address.",
      },
      {
        type: "h2",
        text: "Part 2: Business Income",
      },
      {
        type: "ul",
        items: [
          "Line 8000: Gross professional fees or business revenues — all invoices issued, regardless of whether they've been paid",
          "Line 8230: Reserve for professional fees from prior year (if applicable)",
          "Line 8290: Subtracted amounts — returns, discounts",
          "The result is your 'net sales' — this is your starting point for calculating net business income",
        ],
      },
      {
        type: "h2",
        text: "Part 4: Business Expenses",
      },
      {
        type: "p",
        text: "Part 4 has 22 expense lines. The most commonly used by freelancers: advertising (8520), meals and entertainment at 50% (8523), office expenses (8810), professional fees (8860), telephone and utilities (9220), travel (9200), and other expenses (9270). Vehicle expenses have their own section in Part 7 and are calculated separately based on your business-use percentage.",
      },
      {
        type: "callout",
        text: "Meals and entertainment: enter the full gross amount on line 8523 — the form automatically applies the 50% deductibility limit. Don't pre-calculate the 50% yourself or you'll get half the deduction you're entitled to.",
      },
      {
        type: "h2",
        text: "Capital Cost Allowance (Part 8)",
      },
      {
        type: "p",
        text: "Capital purchases (computers, equipment, vehicles) are not deducted all at once. They go in the CCA schedule in Part 8, where the declining balance method applies based on asset class. Class 10 for most vehicles (30%), Class 10.1 for luxury vehicles (30%), Class 50 for computers (55%), Class 8 for other equipment (20%). You claim CCA against your Class UCC (undepreciated capital cost) at year-end.",
      },
    ],
  },

  {
    slug: "tax-instalment-payments-canada-self-employed",
    title: "Tax Instalment Payments for Self-Employed Canadians: How They Work",
    excerpt:
      "If you owe more than $3,000 in taxes, the CRA requires you to pay in quarterly instalments. Here's how to calculate the right amount and avoid interest charges.",
    category: "Tax Fundamentals",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/tax-instalment-payments-canada-self-employed/600/400",
    imageAlt: "Calendar showing Canadian tax instalment due dates for self-employed workers",
    tags: ["tax instalments", "quarterly payments", "self-employed", "CRA", "cash flow"],
    clusterPillar: "freelancer-taxes-canada-guide",
    clusterName: "Freelancer Tax Fundamentals",
    relatedSlugs: [
      "freelancer-taxes-canada-guide",
      "top-tax-deductions-canadian-self-employed-2025",
      "freelancer-tax-mistakes-canada",
    ],
    body: [
      {
        type: "p",
        text: "Unlike employees whose tax is withheld at source, self-employed Canadians receive income with no tax deducted. The CRA's response is quarterly tax instalment payments — essentially paying next year's tax bill in advance, in four equal instalments. Failing to pay instalments on time triggers interest, even if you eventually pay the full amount owing.",
      },
      {
        type: "h2",
        text: "When Instalments Are Required",
      },
      {
        type: "p",
        text: "The CRA requires quarterly instalment payments if your net tax owing (federal + provincial, after credits) exceeds $3,000 in either the current year OR either of the two preceding years. In Quebec, the threshold is $1,800. The due dates are: March 15, June 15, September 15, and December 15.",
      },
      {
        type: "h2",
        text: "Three Ways to Calculate Your Instalments",
      },
      {
        type: "ul",
        items: [
          "Prior-year method: pay one-quarter of your previous year's net tax owing each quarter — simplest, avoids interest if income stays similar",
          "Current-year method: estimate this year's taxes, pay one-quarter each quarter — risky if you underestimate",
          "No-calculation method: use the instalment amounts the CRA sends you in their instalment reminders — based on two years prior, not current income",
        ],
      },
      {
        type: "callout",
        text: "If you have a strong quarter, pay more than your minimum instalment. The CRA calculates interest on the shortfall daily — overpaying early costs nothing, while underpaying costs you the prescribed rate (currently 9% annually) on the shortfall.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 6 — COMPARISONS
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "receipt-scanner-apps-canada-comparison",
    title: "Best Receipt Scanner Apps for Canadians in 2025: Complete Comparison",
    excerpt:
      "A practical comparison of the top receipt scanning apps available to Canadian freelancers and small business owners — including GST/HST extraction and CRA compliance features.",
    category: "Tools & Apps",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/receipt-scanner-apps-canada-comparison/600/400",
    imageAlt: "Comparison of receipt scanning apps on smartphone for Canadian freelancers",
    tags: ["receipt scanner", "app comparison", "GST/HST", "expense tracking", "Canada"],
    relatedSlugs: [
      "expense-tracking-canada-freelancers",
      "manual-vs-automated-expense-tracking-canada",
      "excel-vs-expense-app-canada",
    ],
    body: [
      {
        type: "p",
        text: "The right receipt scanning app can save a Canadian freelancer 5–10 hours per year in bookkeeping time and prevent CRA-audit-triggering gaps in documentation. The wrong one creates a false sense of security while failing to capture the information you actually need. Here's what to look for.",
      },
      {
        type: "h2",
        text: "Must-Have Features for Canadian Freelancers",
      },
      {
        type: "ul",
        items: [
          "GST/HST extraction: automatically identifies and separates GST and HST amounts for ITC tracking",
          "PST handling: correctly categorizes PST as a non-recoverable expense in applicable provinces",
          "CRA-compliant export: produces a report that maps to T2125 expense categories",
          "Cloud backup: receipts stored securely for the full 6-year CRA retention period",
          "Mileage tracking: ideally built into the same app so vehicle logs and expense receipts are in one place",
        ],
      },
      {
        type: "h2",
        text: "What Most Generic Apps Miss",
      },
      {
        type: "p",
        text: "Most global expense apps treat tax as a single field — 'tax amount.' For Canadian freelancers, this is inadequate. You need GST/HST separated from PST, because only GST/HST generates input tax credits. An app that lumps all taxes together makes it impossible to calculate your ITC entitlement accurately without manually re-entering amounts.",
      },
      {
        type: "callout",
        text: "ReceiptOne is built specifically for the Canadian market. It automatically distinguishes GST, HST, PST, and QST on every receipt — so your ITC totals are accurate without any manual correction.",
      },
    ],
  },

  {
    slug: "quickbooks-vs-receiptone-canada",
    title: "QuickBooks vs. ReceiptOne for Canadian Freelancers: Which Is Right for You?",
    excerpt:
      "QuickBooks and ReceiptOne solve different problems. Here's an honest look at when each tool makes sense for self-employed Canadians.",
    category: "Tools & Apps",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/quickbooks-vs-receiptone-canada/600/400",
    imageAlt: "Canadian freelancer comparing accounting software options on laptop",
    tags: ["QuickBooks", "ReceiptOne", "accounting software", "freelancer", "Canada"],
    relatedSlugs: [
      "receipt-scanner-apps-canada-comparison",
      "expense-tracking-canada-freelancers",
      "manual-vs-automated-expense-tracking-canada",
    ],
    body: [
      {
        type: "p",
        text: "QuickBooks Self-Employed and ReceiptOne are both used by Canadian freelancers for expense tracking — but they're optimized for different use cases. QuickBooks is a full accounting platform; ReceiptOne is a focused receipt and expense capture tool. The best choice depends on your business complexity and what you actually need day-to-day.",
      },
      {
        type: "h2",
        text: "QuickBooks: Better For",
      },
      {
        type: "ul",
        items: [
          "Freelancers who invoice clients directly and need AR tracking",
          "Businesses with employees and payroll requirements",
          "Situations requiring double-entry bookkeeping for incorporation or audit purposes",
          "Clients or accountants who require QuickBooks files specifically",
        ],
      },
      {
        type: "h2",
        text: "ReceiptOne: Better For",
      },
      {
        type: "ul",
        items: [
          "Sole proprietors who primarily need receipt capture and CRA-ready expense reports",
          "Canadian freelancers who want automatic GST/HST/PST extraction built for Canadian tax rules",
          "Users who want mileage tracking and receipt scanning in one place",
          "Freelancers with simpler finances who find full accounting software overkill",
        ],
      },
      {
        type: "callout",
        text: "Many freelancers use both: ReceiptOne for day-to-day receipt capture and mileage logging, with an annual CSV export that their accountant imports into their preferred accounting system at year-end. This gives you the best capture experience without paying for accounting features you don't need.",
      },
    ],
  },

  {
    slug: "manual-vs-automated-expense-tracking-canada",
    regions: ["all"],
    title: "Manual vs. Automated Expense Tracking for Canadian Freelancers",
    excerpt:
      "Spreadsheets are free. Automated apps cost money. Here's when the manual approach is good enough — and when automation pays for itself.",
    category: "Tools & Apps",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-20",
    imageUrl: "https://picsum.photos/seed/manual-vs-automated-expense-tracking-canada/600/400",
    imageAlt: "Canadian freelancer comparing manual spreadsheet vs automated expense tracking",
    tags: ["expense tracking", "automation", "spreadsheet", "freelancer", "bookkeeping"],
    relatedSlugs: [
      "expense-tracking-canada-freelancers",
      "excel-vs-expense-app-canada",
      "receipt-scanner-apps-canada-comparison",
    ],
    body: [
      {
        type: "p",
        text: "There's a break-even point where automated expense tracking stops being an optional convenience and becomes economically obvious. The question is where that point is for your situation.",
      },
      {
        type: "h2",
        text: "When Manual Tracking Is Fine",
      },
      {
        type: "ul",
        items: [
          "Under 20 business expenses per month — manual entry takes under 30 minutes",
          "Expenses that are highly regular and predictable (same vendors, same amounts)",
          "A single bank account with no mixed personal/business spending",
          "Your accountant already does the categorization at year-end",
        ],
      },
      {
        type: "h2",
        text: "When Automation Pays for Itself",
      },
      {
        type: "ul",
        items: [
          "30+ receipts per month — OCR extraction saves 2–4 minutes per receipt",
          "Significant mileage claims — automatic logbooks eliminate the risk of a CRA-rejected paper logbook",
          "Multiple projects or clients requiring separate expense tracking",
          "You've ever lost a receipt or missed a deduction because of poor organization",
        ],
      },
      {
        type: "callout",
        text: "The hidden cost of manual tracking isn't the time — it's the missed deductions. A freelancer with $50,000 in revenue who misses $5,000 in deductions due to poor record-keeping pays roughly $1,500–$2,000 extra in tax. Most expense apps cost under $200/year.",
      },
    ],
  },

  {
    slug: "excel-vs-expense-app-canada",
    regions: ["all"],
    title: "Excel vs. Expense Tracking App: Which Should Canadian Freelancers Use?",
    excerpt:
      "Excel is powerful and free. Expense apps are convenient and automated. For Canadian freelancers filing T2125, here's the honest comparison.",
    category: "Tools & Apps",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-20",
    imageUrl: "https://picsum.photos/seed/excel-vs-expense-app-canada/600/400",
    imageAlt: "Canadian freelancer using Excel spreadsheet versus expense tracking app",
    tags: ["Excel", "spreadsheet", "expense app", "freelancer", "bookkeeping", "T2125"],
    relatedSlugs: [
      "manual-vs-automated-expense-tracking-canada",
      "expense-tracking-canada-freelancers",
      "receipt-scanner-apps-canada-comparison",
    ],
    body: [
      {
        type: "p",
        text: "Excel can absolutely handle freelancer expense tracking — many accountants and bookkeepers still prefer CSV exports over proprietary app formats. The question isn't whether Excel is capable; it's whether your Excel setup captures everything the CRA needs and survives the friction of daily use.",
      },
      {
        type: "h2",
        text: "What a CRA-Ready Excel Tracker Must Include",
      },
      {
        type: "ul",
        items: [
          "Date, vendor, description, and total for every expense",
          "Separate columns for GST, HST, and PST amounts (not a single 'tax' column)",
          "Category column mapping to T2125 lines",
          "A receipt reference or filename for every row",
          "Mileage log as a separate tab if you have vehicle claims",
          "Year-end summary totals by T2125 category",
        ],
      },
      {
        type: "h2",
        text: "Where Excel Falls Short",
      },
      {
        type: "p",
        text: "Excel doesn't capture receipts — it just records numbers. The actual receipt documentation still needs to exist somewhere. Freelancers who track in Excel but store receipts in a physical folder (or worse, don't store them at all) have an organization system that looks complete until an audit reveals missing backup. An expense app that scans and links receipts to expense lines eliminates this gap entirely.",
      },
      {
        type: "callout",
        text: "Best of both worlds: use ReceiptOne to scan and auto-extract receipt data, then export to CSV for your accountant's Excel-based workflow. You get automated capture with the flexibility your accountant expects.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 7 — TAX STRATEGY & MINDSET
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "year-round-tax-prep-canada",
    title: "Year-Round Tax Preparation for Canadian Freelancers",
    excerpt:
      "Tax season isn't a season — it's a year-round habit. Here's the monthly system that keeps Canadian freelancers CRA-ready without the April panic.",
    category: "Tax Strategy",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/year-round-tax-prep-canada/600/400",
    imageAlt: "Canadian freelancer maintaining year-round tax preparation system",
    tags: ["tax preparation", "year-round", "freelancer", "CRA", "tax season", "organization"],
    relatedSlugs: [
      "freelancer-taxes-canada-guide",
      "expense-tracking-canada-freelancers",
      "freelancer-tax-mistakes-canada",
    ],
    body: [
      {
        type: "p",
        text: "The freelancers who dread tax season are the ones who treat it as a once-a-year event. Those who approach it as a continuous 15-minute-per-week habit find filing almost stress-free. Here's the system.",
      },
      {
        type: "h2",
        text: "Weekly (5 minutes)",
      },
      {
        type: "ul",
        items: [
          "Photograph any paper receipts from the week — they go into your expense app or designated folder immediately",
          "Forward any email receipts to your designated expense email or save as PDF",
          "Log any business mileage you forgot to track automatically",
        ],
      },
      {
        type: "h2",
        text: "Monthly (20 minutes)",
      },
      {
        type: "ul",
        items: [
          "Reconcile your bank and credit card statements against your expense records — every business transaction should have a receipt",
          "Categorize any uncategorized expenses",
          "Record your mileage total for the month",
          "Note any large upcoming business purchases that could affect your instalment payments",
        ],
      },
      {
        type: "h2",
        text: "Quarterly (1 hour)",
      },
      {
        type: "ul",
        items: [
          "Pay your tax instalment by the due date (March 15, June 15, Sept 15, Dec 15)",
          "File your GST/HST return if you're a quarterly filer",
          "Review your income-to-expense ratio — are your estimated taxes still accurate?",
          "Assess whether any capital purchases before year-end would benefit this year's CCA claim",
        ],
      },
      {
        type: "callout",
        text: "The year-end benefit: freelancers who follow a monthly system typically spend 2–3 hours preparing their tax filing information, versus 15–20 hours for those who do it all in April. That's a 12-hour time saving — worth far more than any accountant's fee for last-minute rescue work.",
      },
    ],
  },

  {
    slug: "freelancer-tax-mistakes-canada",
    title: "7 Common Tax Mistakes Canadian Freelancers Make (and How to Avoid Them)",
    excerpt:
      "These seven mistakes cost Canadian freelancers real money every year — through missed deductions, CRA interest charges, and denied claims. Here's how to avoid each one.",
    category: "Tax Strategy",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/freelancer-tax-mistakes-canada/600/400",
    imageAlt: "Canadian freelancer reviewing tax mistakes and corrections",
    tags: ["tax mistakes", "freelancer", "CRA", "deductions", "self-employed", "common errors"],
    relatedSlugs: [
      "freelancer-taxes-canada-guide",
      "cra-audit-proof-expenses",
      "tax-instalment-payments-canada-self-employed",
    ],
    body: [
      {
        type: "p",
        text: "The CRA reassesses hundreds of thousands of self-employed returns every year. Most adjustments are not the result of fraud — they're the result of common, avoidable mistakes. Here are the seven that show up most frequently in audits and reviews.",
      },
      {
        type: "h2",
        text: "1. Deducting 100% of Meals and Entertainment",
      },
      {
        type: "p",
        text: "Only 50% of meals and entertainment expenses are deductible under the Income Tax Act — even when the meal is 100% business-related. This is one of the most common audit adjustments. The CRA routinely reduces 100% claims to 50%.",
      },
      {
        type: "h2",
        text: "2. Not Keeping Contemporaneous Mileage Records",
      },
      {
        type: "p",
        text: "Reconstructing a mileage logbook from memory or calendar entries at year-end is not a contemporaneous record. The CRA can reject reconstructed logbooks and disallow the entire vehicle expense claim. Track mileage in real time — an app that timestamps each trip automatically is the safest approach.",
      },
      {
        type: "h2",
        text: "3. Missing the Tax Instalment Deadlines",
      },
      {
        type: "p",
        text: "If your net tax owing exceeds $3,000, quarterly instalments are required. Missing them triggers daily interest at the prescribed rate — currently 9% annually. The CRA sends instalment reminders, but you're responsible for paying whether or not the reminder arrives.",
      },
      {
        type: "h2",
        text: "More Common Mistakes",
      },
      {
        type: "ul",
        items: [
          "Claiming personal expenses as business (e.g., gym membership without a demonstrable business necessity)",
          "Forgetting to include GST/HST collected as income — it's not yours to keep",
          "Claiming home office expenses that exceed net business income (not allowed — they carry forward)",
          "Missing the GST/HST ITC registration: not registering when revenue hits $30,000 means you owe back-taxes and penalties",
        ],
      },
    ],
  },

  {
    slug: "tax-season-stress-freelancers-canada",
    title: "Stress-Free Tax Season for Canadian Freelancers: A Year-End Checklist",
    excerpt:
      "A practical year-end checklist that gets Canadian freelancers ready to file — covering receipts, income summaries, GST/HST, CPP, and what to hand off to your accountant.",
    category: "Tax Strategy",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-11",
    imageUrl: "https://picsum.photos/seed/tax-season-stress-freelancers-canada/600/400",
    imageAlt: "Canadian freelancer completing year-end tax checklist at desk",
    tags: ["tax season", "checklist", "year-end", "freelancer", "CRA", "filing"],
    relatedSlugs: [
      "year-round-tax-prep-canada",
      "freelancer-taxes-canada-guide",
      "freelancer-tax-mistakes-canada",
    ],
    body: [
      {
        type: "p",
        text: "January is the best time to prepare for April filing. Here's a structured checklist organized by what you need to gather, calculate, and confirm before handing anything to an accountant or entering data into tax software.",
      },
      {
        type: "h2",
        text: "Income Records",
      },
      {
        type: "ul",
        items: [
          "All client invoices issued in the tax year — gross amounts, not net of expenses",
          "T4A slips received from clients who paid you $500+ (check against your invoices)",
          "Any other income: interest, dividends, rental income (goes on different T1 schedules)",
          "Foreign income converted to CAD at the Bank of Canada exchange rate for the date received",
        ],
      },
      {
        type: "h2",
        text: "Expense Records",
      },
      {
        type: "ul",
        items: [
          "Complete expense report from your tracking app or spreadsheet, categorized by T2125 line",
          "GST/HST totals paid on business expenses (for ITC calculation)",
          "Vehicle logbook with total km, business km, and business-use percentage",
          "Home office calculation: workspace square footage as % of total home area",
          "Capital purchases: receipts for any equipment or asset purchases",
        ],
      },
      {
        type: "h2",
        text: "GST/HST Records",
      },
      {
        type: "ul",
        items: [
          "Total GST/HST collected from clients during the year",
          "Total ITCs claimed on business expenses",
          "Net amount owing or refund expected",
          "Confirm your GST/HST return is filed (due April 30 for annual filers, or quarterly)",
        ],
      },
      {
        type: "callout",
        text: "ReceiptOne's year-end export produces a single PDF or CSV covering all of the above: categorized expenses, GST/HST totals by type, and mileage summary. This is what you hand to your accountant — the T2125 prep is essentially done.",
      },
    ],
  },

  {
    slug: "cra-audit-guide-self-employed-canada",
    title: "CRA Audit Guide for Self-Employed Canadians: What to Expect and How to Prepare",
    excerpt:
      "A CRA audit of a self-employed return doesn't have to be catastrophic. Here's what actually happens, what they look for, and how strong documentation protects you.",
    category: "Tax Strategy",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-20",
    imageUrl: "https://picsum.photos/seed/cra-audit-guide-self-employed-canada/600/400",
    imageAlt: "Canadian freelancer preparing documentation for CRA audit review",
    tags: ["CRA audit", "self-employed", "review", "reassessment", "record keeping", "compliance"],
    relatedSlugs: [
      "cra-audit-proof-expenses",
      "cra-receipt-rules-canada",
      "freelancer-tax-mistakes-canada",
    ],
    body: [
      {
        type: "p",
        text: "Self-employed Canadians are audited at roughly twice the rate of employees. Most 'audits' are actually desk reviews — a CRA officer asks for documentation on specific claims. Full field audits (where an officer visits your business) are less common and typically reserved for higher-income businesses or multiple years of inconsistency.",
      },
      {
        type: "h2",
        text: "What Triggers a CRA Review",
      },
      {
        type: "ul",
        items: [
          "Expense-to-income ratios that differ significantly from industry norms",
          "Large year-over-year swings in income or expense categories",
          "Vehicle expense claims implying near-100% business use",
          "Home office claims in excess of 20% of home costs (attracts scrutiny, not automatically wrong)",
          "Repeated net business losses — the CRA may question whether it's a genuine business",
          "Third-party information (T4A slips from clients) that doesn't match your reported income",
        ],
      },
      {
        type: "h2",
        text: "What the CRA Actually Asks For",
      },
      {
        type: "p",
        text: "A typical desk review requests: bank statements for the year, credit card statements showing business purchases, receipts for specific expense claims (often the largest ones or entire categories), mileage logbooks, and home office calculations. You typically have 30 days to respond.",
      },
      {
        type: "h2",
        text: "How to Respond Effectively",
      },
      {
        type: "ul",
        items: [
          "Respond by the deadline — extensions are available but must be requested proactively",
          "Provide exactly what was requested, organized and clearly labelled",
          "Don't volunteer information beyond what's requested",
          "If a specific receipt is missing, provide the best available substitute: bank record + vendor confirmation",
          "Consider engaging a tax professional for any audit involving more than $10,000 in disputed deductions",
        ],
      },
      {
        type: "callout",
        text: "The best audit preparation happens 12 months before any contact arrives. A digital archive of all receipts, a proper mileage logbook, and a reconciled expense report means a 30-day response deadline is manageable — not a crisis.",
      },
    ],
  },
];

/* ----------------------------- Helpers ------------------------------------ */

const WORDS_PER_MINUTE = 200;

/** Words in the article body: paragraphs, headings, list items and callouts. */
export function articleWordCount(article: Article): number {
  let words = 0;
  for (const block of article.body) {
    const texts = block.type === "ul" ? block.items : [block.text];
    for (const text of texts) words += text.split(/\s+/).filter(Boolean).length;
  }
  return words;
}

/** Reading time in whole minutes: body words / 200 wpm, rounded up, minimum 1. */
export function readingMinutes(article: Article): number {
  return Math.max(1, Math.ceil(articleWordCount(article) / WORDS_PER_MINUTE));
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articleBelongsToRegion(article: Article, region: Region): boolean {
  const r = article.regions ?? ["ca"];
  return r.includes(region) || r.includes("all");
}

export function getArticlesByRegion(articles: Article[], region: Region): Article[] {
  return articles.filter((a) => articleBelongsToRegion(a, region));
}

export function getRelatedArticles(slug: string, count = 3): Article[] {
  const article = getArticle(slug);
  if (!article) return ARTICLES.slice(0, count);

  // Use explicit relatedSlugs when present
  if (article.relatedSlugs && article.relatedSlugs.length > 0) {
    const results: Article[] = [];
    for (const relSlug of article.relatedSlugs) {
      const rel = getArticle(relSlug);
      if (rel && results.length < count) results.push(rel);
    }
    if (results.length >= count) return results;
    // top up with category matches if relatedSlugs came up short
    const relSlugs = new Set(article.relatedSlugs);
    relSlugs.add(slug);
    const others = ARTICLES.filter((a) => !relSlugs.has(a.slug));
    const byCategory = others.filter((a) => a.category === article.category);
    for (const a of byCategory) {
      if (results.length >= count) break;
      results.push(a);
    }
    return results;
  }

  // Fallback: score by category + tag overlap
  const others = ARTICLES.filter((a) => a.slug !== slug);
  const scored = others.map((a) => {
    let score = 0;
    if (a.category === article.category) score += 10;
    if (a.clusterName && a.clusterName === article.clusterName) score += 8;
    for (const tag of article.tags) {
      if (a.tags.includes(tag)) score += 2;
    }
    return { article: a, score };
  });
  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, count).map((s) => s.article);
}

export function articleJsonLd(article: Article, path = `/articles/${article.slug}`): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: "ReceiptOne",
      url: "https://receipt-one.com",
    },
    publisher: {
      "@type": "Organization",
      name: "ReceiptOne",
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${path}`,
    },
    keywords: article.tags.join(", "),
  };
}
