/**
 * Articles data + helpers for the ReceiptOne knowledge base.
 * No React imports — pure TypeScript data layer.
 */
import { SITE_URL } from "@/lib/seo";
import beaverPaperUrl from "@/assets/figma/beaver-paper.png";

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
  publishedAt: string; // ISO date
  author: { name: string; role: string };
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  body: ContentBlock[];
}

export const ARTICLES: Article[] = [
  {
    slug: "cra-receipt-rules-canadian-freelancer",
    title: "CRA Receipt Rules: What Every Canadian Freelancer Needs to Know",
    excerpt:
      "The CRA has specific requirements for which receipts you must keep and what information they need to include. Getting this wrong can cost you deductions — or worse, trigger a reassessment.",
    category: "Tax Compliance",
    readTime: 7,
    publishedAt: "2025-02-10",
    author: { name: "Sarah Tremblay", role: "CPA, Tax Advisor" },
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Freelancer reviewing receipts and financial documents at a desk",
    tags: ["CRA", "receipts", "compliance", "freelancer", "tax rules"],
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
      {
        type: "p",
        text: "The safest approach is to photograph or scan every business receipt the moment you receive it, tag it with the business purpose, and store it in a searchable system. The CRA requires you to keep records for six years from the end of the tax year to which they relate — so a receipt from a 2024 expense should be retained until at least the end of 2030.",
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
    author: { name: "Marcus Chen", role: "Tax Specialist" },
    imageUrl:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Person reviewing financial spreadsheets and tax documents",
    tags: ["GST", "HST", "input tax credits", "ITC", "self-employed"],
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
    slug: "top-tax-deductions-canadian-self-employed-2025",
    title: "Top Tax Deductions for Canadian Self-Employed Workers in 2025",
    excerpt:
      "Self-employed Canadians can deduct a wide range of legitimate business expenses. Knowing which ones apply to you — and how to claim them correctly — can dramatically reduce your tax bill.",
    category: "Tax Deductions",
    readTime: 8,
    publishedAt: "2025-03-10",
    author: { name: "Sarah Tremblay", role: "CPA, Tax Advisor" },
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Person working on a laptop with financial documents visible",
    tags: ["deductions", "self-employed", "freelancer", "tax savings", "2025"],
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
    slug: "mileage-tracking-self-employed-2025-guide",
    title: "Mileage Tracking for Self-Employed Workers: The Complete 2025 Guide",
    excerpt:
      "The CRA's automobile expense deduction can be worth thousands annually — but only if you track your kilometres correctly and maintain a proper logbook. Here's everything you need to know.",
    category: "Mileage & Auto",
    readTime: 7,
    publishedAt: "2025-03-24",
    author: { name: "Marcus Chen", role: "Tax Specialist" },
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Vehicle dashboard and steering wheel viewed from the driver's seat",
    tags: ["mileage", "automobile", "logbook", "CRA", "vehicle expenses"],
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
    slug: "how-long-keep-receipts-canada",
    title: "How Long Do You Need to Keep Receipts in Canada?",
    excerpt:
      "Knowing exactly how long to keep receipts and tax records protects you during CRA audits while letting you safely dispose of documents you no longer need. The rules are more nuanced than you might think.",
    category: "Record Keeping",
    readTime: 5,
    publishedAt: "2025-04-07",
    author: { name: "Sarah Tremblay", role: "CPA, Tax Advisor" },
    imageUrl: beaverPaperUrl,
    imageAlt: "Beaver character holding a stack of organised documents",
    tags: ["record keeping", "CRA", "receipts", "6 years", "audit"],
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
  {
    slug: "home-office-deduction-canadian-freelancers",
    title: "The Home Office Deduction: What Canadian Freelancers Can Actually Claim",
    excerpt:
      "The home office deduction is widely misunderstood — many freelancers claim too little, and some claim expenses they're not entitled to. Here's the accurate 2025 breakdown.",
    category: "Tax Deductions",
    readTime: 6,
    publishedAt: "2025-04-21",
    author: { name: "Marcus Chen", role: "Tax Specialist" },
    imageUrl:
      "https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Modern home office setup with computer and organized workspace",
    tags: ["home office", "deductions", "workspace", "freelancer", "CRA"],
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
      {
        type: "p",
        text: "Keep all receipts for utilities, property taxes, insurance, and any repair work. At tax time, calculate your annual totals for each category, apply your business-use percentage, and report the result in the workspace-in-the-home section of Form T2125. If you're unsure about the CCA implications for homeowners, consult a CPA before claiming — it can affect your principal residence exemption on a future sale.",
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

  // Prefer articles in the same category, then by tag overlap
  const others = ARTICLES.filter((a) => a.slug !== slug);
  const scored = others.map((a) => {
    let score = 0;
    if (a.category === article.category) score += 10;
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
