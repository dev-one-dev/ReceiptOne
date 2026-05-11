/**
 * Articles data + helpers for the ReceiptOne knowledge base.
 * No React imports — pure TypeScript data layer.
 */
import { SITE_URL } from "@/lib/seo";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: string;
  author: { name: string; role: string };
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  body: ContentBlock[];
  clusterPillar?: string;
  clusterName?: string;
  relatedSlugs?: string[];
}

const SARAH = { name: "Sarah Tremblay", role: "CPA, Tax Advisor" };
const MARCUS = { name: "Marcus Chen", role: "Tax Specialist" };


export const ARTICLES: Article[] = [

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 1 — CRA RECEIPT RULES
     Pillar: cra-receipt-rules-canada
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "cra-receipt-rules-canada",
    title: "CRA Receipt Rules in Canada: The Complete Guide for Self-Employed Workers",
    excerpt:
      "Everything the Canada Revenue Agency requires for business receipts — what information must appear, how long to keep records, digital vs. paper rules, and how to build a system that survives an audit.",
    category: "Tax Compliance",
    readTime: 10,
    publishedAt: "2025-01-06",
    author: SARAH,
    imageUrl: "https://picsum.photos/seed/cra-receipt-rules-canada/600/400",
    imageAlt: "Canadian freelancer organizing receipts and tax documents",
    tags: ["CRA", "receipts", "compliance", "self-employed", "audit", "record keeping"],
    clusterName: "CRA Receipt Rules",
    relatedSlugs: [
      "cra-receipt-rules-canadian-freelancer",
      "digital-receipts-canada-are-they-valid",
      "how-long-keep-receipts-canada",
      "cra-audit-proof-expenses",
    ],
    body: [
      {
        type: "p",
        text: "If you're self-employed in Canada, your receipts are your financial foundation. The Canada Revenue Agency (CRA) requires specific information on every business receipt — and if an auditor asks for documentation you can't produce, the result is a denied deduction and potential penalties. This guide covers what must appear on a receipt, how long to keep records, digital-receipt rules, and how to build a system that survives an audit.",
      },
      {
        type: "h2",
        text: "What the CRA Requires on Every Business Receipt",
      },
      {
        type: "ul",
        items: [
          "Vendor name and address (or clear vendor identification)",
          "Date of the transaction",
          "Description of goods or services purchased",
          "Total amount paid including all taxes",
          "GST/HST registration number (mandatory for ITC claims over $30)",
          "GST/HST amount charged separately (for purchases $30–$149.99)",
          "Buyer's name or trade name (for purchases $150 and over)",
        ],
      },
      {
        type: "h2",
        text: "Digital and Email Receipts: What the CRA Accepts",
      },
      {
        type: "p",
        text: "The CRA has accepted digital images of paper receipts since 2007, and email receipts are treated identically to paper originals. A phone photo is valid — provided it is a complete, unaltered copy. Cropping or editing a photo in any way that obscures the vendor name, total, or GST number can invalidate it. Capture the entire receipt in one frame without editing, and store it in a format that preserves the original.",
      },
      {
        type: "h2",
        text: "The Six-Year Retention Rule",
      },
      {
        type: "p",
        text: "The Income Tax Act requires self-employed Canadians to keep all business records for six years from the end of the tax year to which they relate. A receipt from a January 2025 purchase must be kept until at least December 31, 2031. Capital asset records (equipment, vehicles, property) must be kept for six years after disposal — potentially much longer.",
      },
      {
        type: "callout",
        text: "Most CRA audits of self-employed individuals are triggered by unusually high expense-to-income ratios. The best audit defence is a systematic capture habit — photograph every receipt the day you get it, tag it with the business purpose, and store it in a searchable cloud system.",
      },
      {
        type: "h2",
        text: "Common Receipt Mistakes That Cost You Deductions",
      },
      {
        type: "ul",
        items: [
          "Relying on bank or credit card statements alone — they show amounts but not what was purchased",
          "Blurry or partial photos where the GST number or total is unreadable",
          "No documentation for cash purchases — the CRA still expects a record",
          "Missing GST/HST registration numbers on supplier receipts for ITC claims",
          "Mixing personal and business purchases on the same receipt without a clear notation",
        ],
      },
    ],
  },

  {
    slug: "cra-receipt-rules-canadian-freelancer",
    title: "CRA Receipt Rules: What Every Canadian Freelancer Needs to Know",
    excerpt:
      "The CRA has specific requirements for which receipts you must keep and what information they need to include. Getting this wrong can cost you deductions — or worse, trigger a reassessment.",
    category: "Tax Compliance",
    readTime: 7,
    publishedAt: "2025-02-10",
    author: SARAH,
    imageUrl: "https://picsum.photos/seed/cra-receipt-rules-canadian-freelancer/600/400",
    imageAlt: "Freelancer reviewing receipts and financial documents at a desk",
    tags: ["CRA", "receipts", "compliance", "freelancer", "tax rules"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: [
      "cra-receipt-rules-canada",
      "digital-receipts-canada-are-they-valid",
      "how-long-keep-receipts-canada",
    ],
    body: [
      {
        type: "p",
        text: "Every self-employed Canadian knows they need to keep receipts — but far fewer understand exactly what the Canada Revenue Agency (CRA) actually requires. A receipt rejected during an audit can mean a denied deduction, interest charges, and penalties. Getting this right from the start is far less painful than fixing it later.",
      },
      {
        type: "h2",
        text: "What Information Must a Valid Receipt Include?",
      },
      {
        type: "p",
        text: "The CRA requires that a business expense receipt contain enough information to clearly identify the nature of the expense, the amount paid, the date of the transaction, and the name of the vendor. For expenses over $30 that include GST/HST, the receipt must also show the vendor's GST/HST registration number.",
      },
      {
        type: "ul",
        items: [
          "Vendor name and address",
          "Date of transaction",
          "Description of goods or services purchased",
          "Total amount paid, including taxes",
          "GST/HST number (required for claims over $30)",
          "Amount of GST/HST charged (for input tax credit claims)",
        ],
      },
      {
        type: "h2",
        text: "Digital Receipts Are Fully Accepted by the CRA",
      },
      {
        type: "p",
        text: "Good news for modern freelancers: the CRA has accepted digital images of receipts since 2007, and e-receipts directly from vendors are treated identically to paper originals. The key requirement is that the digital copy must be a true, unaltered copy — no cropping, brightening, or editing that could obscure any required information. Apps like ReceiptOne capture receipts in a compliant format automatically.",
      },
      {
        type: "callout",
        text: "CRA tip: If you receive both a paper receipt and an email confirmation for the same purchase, you only need to keep one — but keep whichever shows all the required fields, including the GST/HST number.",
      },
      {
        type: "h2",
        text: "Common Receipt Mistakes That Trigger CRA Scrutiny",
      },
      {
        type: "ul",
        items: [
          "Keeping credit card statements alone — these do not describe what was purchased",
          "Missing GST/HST registration numbers on business purchase receipts",
          "Blurry or cropped photos where the total amount or vendor name is unclear",
          "No records for cash purchases (the CRA expects some form of documentation)",
          "Mixing personal and business purchases on the same receipt without clear notation",
        ],
      },
    ],
  },

  {
    slug: "what-receipts-do-i-need-for-taxes-canada",
    title: "What Receipts Do You Need for Taxes in Canada?",
    excerpt:
      "Not every piece of paper qualifies as a valid CRA receipt. Here's exactly what documentation Canadian freelancers and contractors need to support their business expense claims.",
    category: "Tax Compliance",
    readTime: 5,
    publishedAt: "2025-05-05",
    author: SARAH,
    imageUrl: "https://picsum.photos/seed/what-receipts-do-i-need-for-taxes-canada/600/400",
    imageAlt: "Stack of receipts organized for Canadian tax filing",
    tags: ["CRA", "receipts", "taxes", "freelancer", "documentation"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: [
      "cra-receipt-rules-canada",
      "cra-acceptable-receipt-requirements",
      "how-long-keep-receipts-canada",
    ],
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
    readTime: 4,
    publishedAt: "2025-05-19",
    author: MARCUS,
    imageUrl: "https://picsum.photos/seed/digital-receipts-canada-are-they-valid/600/400",
    imageAlt: "Person photographing a paper receipt with a smartphone",
    tags: ["digital receipts", "CRA", "email receipts", "photo receipts", "compliance"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: [
      "cra-receipt-rules-canada",
      "how-long-keep-receipts-canada",
      "cra-audit-proof-expenses",
    ],
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
    readTime: 6,
    publishedAt: "2025-05-12",
    author: SARAH,
    imageUrl: "https://picsum.photos/seed/cra-audit-proof-expenses/600/400",
    imageAlt: "Organized financial folders and tax documents for CRA audit preparation",
    tags: ["CRA audit", "expense documentation", "self-employed", "record keeping", "compliance"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: [
      "cra-receipt-rules-canada",
      "how-long-keep-receipts-canada",
      "digital-receipts-canada-are-they-valid",
    ],
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

  {
    slug: "cra-acceptable-receipt-requirements",
    title: "CRA-Acceptable Receipt Requirements: What Every Field Must Show",
    excerpt:
      "A detailed breakdown of the CRA's tiered receipt requirements — what's mandatory at each purchase level, and what information you cannot afford to be missing.",
    category: "Tax Compliance",
    readTime: 4,
    publishedAt: "2025-05-26",
    author: MARCUS,
    imageUrl: "https://picsum.photos/seed/cra-acceptable-receipt-requirements/600/400",
    imageAlt: "Receipt with GST number highlighted for CRA compliance",
    tags: ["CRA", "receipt requirements", "GST number", "ITC", "documentation"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: [
      "cra-receipt-rules-canada",
      "what-receipts-do-i-need-for-taxes-canada",
      "track-gst-hst-business-expenses",
    ],
    body: [
      {
        type: "p",
        text: "The CRA uses a three-tier documentation system based on purchase amount. Understanding which tier applies to each expense is the difference between a successful ITC claim and a denied one at audit time.",
      },
      {
        type: "h2",
        text: "Tier 1: Purchases Under $30",
      },
      {
        type: "p",
        text: "For business purchases under $30, a simplified receipt is acceptable. Required fields: the supplier's name, the date, and the total amount paid (including tax). You do not need the vendor's GST/HST number to claim an input tax credit on purchases under $30, though you still need the expense to be a legitimate business cost.",
      },
      {
        type: "h2",
        text: "Tier 2: Purchases $30 to $149.99",
      },
      {
        type: "ul",
        items: [
          "Supplier name",
          "Date of the transaction",
          "Total paid including taxes",
          "GST/HST registration number (RT number — 9-digit BN followed by RT0001 or similar)",
          "Either the total tax charged, or a notation that the amount includes HST/GST",
        ],
      },
      {
        type: "h2",
        text: "Tier 3: Purchases $150 and Over",
      },
      {
        type: "ul",
        items: [
          "All Tier 2 fields",
          "Buyer's name or trading name (your business name or your own name)",
          "Terms of payment (cash, credit, etc.)",
          "Quantity and description sufficient to identify the goods or services",
        ],
      },
      {
        type: "callout",
        text: "GST/HST registration numbers follow the format: 9-digit Business Number + 'RT' + 4-digit account number (e.g., 123456789 RT 0001). If a receipt shows a number that doesn't match this format, verify with the vendor — an invalid number means you can't claim the ITC.",
      },
    ],
  },

  {
    slug: "how-long-keep-receipts-canada",
    title: "How Long Do You Need to Keep Receipts in Canada?",
    excerpt:
      "Knowing exactly how long to keep receipts and tax records protects you during CRA audits while letting you safely dispose of documents you no longer need. The rules are more nuanced than you might think.",
    category: "Record Keeping",
    readTime: 5,
    publishedAt: "2025-04-07",
    author: SARAH,
    imageUrl: "https://picsum.photos/seed/how-long-keep-receipts-canada/600/400",
    imageAlt: "File folders and organised documents for CRA record keeping",
    tags: ["record keeping", "CRA", "receipts", "6 years", "audit"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: [
      "cra-receipt-rules-canada",
      "cra-audit-proof-expenses",
      "digital-receipts-canada-are-they-valid",
    ],
    body: [
      {
        type: "p",
        text: "The standard rule under the Income Tax Act is that self-employed Canadians must keep all records and supporting documents for six years from the end of the last tax year to which they relate. This means receipts from your 2024 business expenses must be kept until at least December 31, 2030. But there are important exceptions and nuances that every freelancer should understand.",
      },
      {
        type: "h2",
        text: "The Six-Year Rule — What It Actually Means",
      },
      {
        type: "p",
        text: "The six-year clock starts from the end of the tax year to which the document relates — not the date of the transaction. For most freelancers who file on a calendar year, a receipt dated March 15, 2024 relates to the 2024 tax year, so it must be kept until December 31, 2030. Records related to your GST/HST filing periods follow the same six-year rule from the end of the reporting period.",
      },
      {
        type: "callout",
        text: "Exception: If you file a return late, the six-year retention period starts from the date you actually filed — not the deadline. If you filed your 2022 return in September 2023, keep those records until September 2029.",
      },
      {
        type: "h2",
        text: "Records You Must Keep Longer Than Six Years",
      },
      {
        type: "ul",
        items: [
          "Capital assets (property, equipment): keep records for as long as you own the asset, plus 6 years after disposal",
          "Vehicle logbooks: keep for 6 years from the end of the year in which the vehicle was sold",
          "Corporate records for incorporated businesses: permanently (minutes, share registry, etc.)",
          "Records related to a loss carryforward: keep until the loss is fully applied plus 6 years",
          "Real property records: keep for 6 years after the property is disposed of",
        ],
      },
      {
        type: "h2",
        text: "What Happens If the CRA Wants Records You've Destroyed?",
      },
      {
        type: "p",
        text: "If you're audited and can't produce required records, the CRA may deny your deductions and reassess your taxes, potentially adding interest and penalties. The burden of proof in a tax dispute lies with the taxpayer — not the CRA. This is why digitizing your receipts with a reliable app is so important. A searchable digital archive is far more audit-proof than a shoebox of faded paper receipts.",
      },
      {
        type: "ul",
        items: [
          "Store digital records in a format that cannot be altered (PDF preferred)",
          "Ensure your backup includes the date the image was captured",
          "Keep digital records in at least two locations (e.g., cloud + local backup)",
          "Export an organized record at the end of each tax year before filing",
        ],
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
    readTime: 9,
    publishedAt: "2025-01-13",
    author: MARCUS,
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
    readTime: 7,
    publishedAt: "2025-06-02",
    author: SARAH,
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
    readTime: 5,
    publishedAt: "2025-06-16",
    author: MARCUS,
    imageUrl: "https://picsum.photos/seed/receipt-organization-tips-canada/600/400",
    imageAlt: "Organized filing system for business receipts and tax documents",
    tags: ["receipt organization", "tax season", "record keeping", "freelancer", "CRA"],
    clusterPillar: "expense-tracking-canada-freelancers",
    clusterName: "Expense Tracking",
    relatedSlugs: [
      "expense-tracking-canada-freelancers",
      "digital-receipts-canada-are-they-valid",
      "how-long-keep-receipts-canada",
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
    readTime: 5,
    publishedAt: "2025-06-09",
    author: SARAH,
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
    title: "Tracking Reimbursable Expenses as a Canadian Freelancer",
    excerpt:
      "When clients owe you money for out-of-pocket expenses, your tracking system determines how fast you get paid — and whether the amount is correct.",
    category: "Expense Tracking",
    readTime: 4,
    publishedAt: "2025-06-23",
    author: MARCUS,
    imageUrl: "https://picsum.photos/seed/reimbursable-expenses-canada-freelancers/600/400",
    imageAlt: "Freelancer submitting a client expense reimbursement report",
    tags: ["reimbursable expenses", "client billing", "freelancer", "invoicing", "expense tracking"],
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
    title: "Home Office vs. Co-working Space: Which Expense Wins at Tax Time?",
    excerpt:
      "Comparing the real after-tax cost of a home office deduction versus a co-working membership for Canadian freelancers — the math might surprise you.",
    category: "Expense Tracking",
    readTime: 5,
    publishedAt: "2025-06-30",
    author: SARAH,
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
    readTime: 10,
    publishedAt: "2025-01-20",
    author: MARCUS,
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
    readTime: 6,
    publishedAt: "2025-02-24",
    author: MARCUS,
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
    readTime: 6,
    publishedAt: "2025-07-07",
    author: SARAH,
    imageUrl: "https://picsum.photos/seed/input-tax-credits-canada-guide/600/400",
    imageAlt: "Canadian freelancer calculating input tax credits on GST/HST return",
    tags: ["ITC", "input tax credits", "GST", "HST", "self-employed", "CRA"],
    clusterPillar: "gst-hst-expense-tracking-canada",
    clusterName: "GST/HST Tracking",
    relatedSlugs: [
      "gst-hst-expense-tracking-canada",
      "track-gst-hst-business-expenses",
      "cra-acceptable-receipt-requirements",
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
    readTime: 5,
    publishedAt: "2025-07-14",
    author: MARCUS,
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
    readTime: 5,
    publishedAt: "2025-07-21",
    author: SARAH,
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
    title: "The Complete Mileage Deduction Guide for Canadian Freelancers (2025)",
    excerpt:
      "Everything self-employed Canadians need to know about deducting vehicle expenses — from the logbook requirement to the maximum deductible costs, with 2025 CRA limits.",
    category: "Mileage & Auto",
    readTime: 10,
    publishedAt: "2025-01-27",
    author: MARCUS,
    imageUrl: "https://picsum.photos/seed/mileage-deduction-canada-freelancers/600/400",
    imageAlt: "Canadian freelancer tracking business mileage for CRA deduction",
    tags: ["mileage", "vehicle expenses", "automobile deduction", "logbook", "CRA", "self-employed"],
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
        text: "Vehicle expenses are one of the largest available deductions for Canadian freelancers who drive for work — and one of the most closely scrutinized by the CRA. Done correctly, you can deduct a proportional share of all vehicle operating costs based on the percentage of kilometres driven for business. This guide covers everything: logbook requirements, eligible expenses, 2025 CRA limits, and what happens if you're audited.",
      },
      {
        type: "h2",
        text: "Business vs. Personal Driving: What Qualifies",
      },
      {
        type: "ul",
        items: [
          "Travel to client sites, job locations, and meetings",
          "Driving to pick up supplies or equipment for your business",
          "Trips to networking events, conferences, and professional development",
          "Visits to your accountant, lawyer, or bank for business purposes",
          "NOT deductible: commuting from home to a regular fixed workplace",
          "Exception: if your home is your principal place of business, trips from home to client sites count as business travel",
        ],
      },
      {
        type: "h2",
        text: "The Logbook Requirement — Non-Negotiable",
      },
      {
        type: "p",
        text: "The CRA requires a contemporaneous mileage logbook. Each entry must record: date, starting location, destination, business purpose, and kilometres driven. At year-end, you calculate total business kilometres ÷ total kilometres driven to get your business-use percentage. That percentage applies to all eligible vehicle expenses.",
      },
      {
        type: "h2",
        text: "Eligible Vehicle Expenses (2025)",
      },
      {
        type: "ul",
        items: [
          "Fuel and oil",
          "Insurance premiums",
          "Repairs and maintenance",
          "License and registration fees",
          "Lease payments — 2025 limit: $1,100/month before tax",
          "Auto loan interest — 2025 limit: $10/day",
          "CCA on vehicle cost — 2025 maximum: $37,000 for Class 10.1 vehicles",
          "Parking fees at business destinations (not parking tickets)",
        ],
      },
      {
        type: "h2",
        text: "The Simplified Logbook Method",
      },
      {
        type: "p",
        text: "After keeping a full logbook for one complete year, the CRA allows a simplified approach: keep a 3-month sample logbook in subsequent years. If your business-use percentage stays within 10% of the base year percentage, the sample is sufficient. This dramatically reduces the ongoing record-keeping burden.",
      },
      {
        type: "callout",
        text: "CRA audit reality: vehicle expense claims are one of the most common audit triggers. A logbook that was clearly prepared all at once (same handwriting, same pen, suspiciously round numbers) rather than contemporaneously is a major red flag. Use an app to timestamp entries automatically.",
      },
    ],
  },

  {
    slug: "mileage-tracking-self-employed-2025-guide",
    title: "Mileage Tracking for Self-Employed Workers: The Complete 2025 Guide",
    excerpt:
      "The CRA's automobile expense deduction can be worth thousands annually — but only if you track your kilometres correctly and maintain a proper logbook. Here's everything you need to know.",
    category: "Mileage & Auto",
    readTime: 7,
    publishedAt: "2025-03-24",
    author: MARCUS,
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
        text: "If you use your personal vehicle for business purposes, you're entitled to deduct a portion of your vehicle operating costs. The CRA allows self-employed individuals to claim actual vehicle expenses — not just a flat per-kilometre rate like employees use. Done correctly, this deduction can be one of the largest available to freelancers who drive regularly for work.",
      },
      {
        type: "h2",
        text: "What Counts as Business Driving?",
      },
      {
        type: "ul",
        items: [
          "Travel to client meetings and job sites",
          "Driving to pick up supplies or equipment for your business",
          "Travel to networking events, conferences, or professional development",
          "Deliveries to customers (if applicable to your business)",
          "Visits to your accountant, lawyer, or bank for business purposes",
        ],
      },
      {
        type: "p",
        text: "Commuting from your home to a regular fixed place of work is NOT deductible — even for self-employed individuals with a home office. However, if your home is your principal place of business, trips from home to client locations count as business travel.",
      },
      {
        type: "h2",
        text: "The Logbook Requirement",
      },
      {
        type: "p",
        text: "The CRA requires a mileage logbook that records every business trip. A complete logbook entry must include the date of the trip, the destination, the business purpose, and the number of kilometres driven. At the end of the year, you calculate the percentage of business use (business km ÷ total km) and apply that percentage to your total vehicle expenses.",
      },
      {
        type: "callout",
        text: "2025 CRA simplified method: Once you've kept a full logbook for one complete year, you can use a sample logbook covering a 3-month period in subsequent years — as long as business use stays within 10% of the base year. This dramatically reduces record-keeping burden after the first year.",
      },
      {
        type: "h2",
        text: "Deductible Vehicle Expenses",
      },
      {
        type: "ul",
        items: [
          "Fuel and oil",
          "Insurance premiums (proportional to business use)",
          "Repairs and maintenance",
          "License and registration fees",
          "Lease payments (subject to limits — 2025 limit: $1,100/month before tax)",
          "Capital Cost Allowance if you own the vehicle (Class 10 or 10.1)",
          "Interest on auto loan (2025 limit: $10/day)",
          "Parking fees at business destinations (but not parking tickets)",
        ],
      },
      {
        type: "p",
        text: "The maximum deductible cost for a purchased vehicle in 2025 is $37,000 (before taxes) for Class 10.1 vehicles. Keep all fuel receipts, insurance renewals, and service records — along with your logbook — for the full 6-year retention period.",
      },
    ],
  },

  {
    slug: "cra-mileage-logbook-requirements",
    title: "CRA Mileage Logbook Requirements: What You Must Record for Every Trip",
    excerpt:
      "The CRA is specific about what a valid mileage logbook must contain. Missing even one required field can invalidate an entire year's vehicle deduction claim.",
    category: "Mileage & Auto",
    readTime: 5,
    publishedAt: "2025-07-28",
    author: SARAH,
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
    readTime: 6,
    publishedAt: "2025-08-04",
    author: MARCUS,
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
    readTime: 5,
    publishedAt: "2025-08-11",
    author: SARAH,
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
    readTime: 12,
    publishedAt: "2025-02-03",
    author: SARAH,
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
    readTime: 8,
    publishedAt: "2025-03-10",
    author: SARAH,
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
    readTime: 6,
    publishedAt: "2025-04-21",
    author: MARCUS,
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
    readTime: 8,
    publishedAt: "2025-08-18",
    author: SARAH,
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
    readTime: 5,
    publishedAt: "2025-08-25",
    author: MARCUS,
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
    readTime: 7,
    publishedAt: "2025-09-01",
    author: MARCUS,
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
    readTime: 5,
    publishedAt: "2025-09-08",
    author: SARAH,
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
    title: "Manual vs. Automated Expense Tracking for Canadian Freelancers",
    excerpt:
      "Spreadsheets are free. Automated apps cost money. Here's when the manual approach is good enough — and when automation pays for itself.",
    category: "Tools & Apps",
    readTime: 5,
    publishedAt: "2025-09-15",
    author: MARCUS,
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
    title: "Excel vs. Expense Tracking App: Which Should Canadian Freelancers Use?",
    excerpt:
      "Excel is powerful and free. Expense apps are convenient and automated. For Canadian freelancers filing T2125, here's the honest comparison.",
    category: "Tools & Apps",
    readTime: 4,
    publishedAt: "2025-09-22",
    author: SARAH,
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
    readTime: 6,
    publishedAt: "2025-10-06",
    author: SARAH,
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
    readTime: 7,
    publishedAt: "2025-10-13",
    author: MARCUS,
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
    readTime: 5,
    publishedAt: "2025-09-29",
    author: SARAH,
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
    readTime: 7,
    publishedAt: "2025-10-20",
    author: MARCUS,
    imageUrl: "https://picsum.photos/seed/cra-audit-guide-self-employed-canada/600/400",
    imageAlt: "Canadian freelancer preparing documentation for CRA audit review",
    tags: ["CRA audit", "self-employed", "review", "reassessment", "record keeping", "compliance"],
    relatedSlugs: [
      "cra-audit-proof-expenses",
      "how-long-keep-receipts-canada",
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

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
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

export function articleJsonLd(article: Article): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "ReceiptOne",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${article.slug}`,
    },
    keywords: article.tags.join(", "),
  };
}
