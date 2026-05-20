/**
 * US-specific knowledge base articles.
 * Imported by help-center.ts to populate US_HELP_CENTER.articles.
 */
import { SITE_URL } from "@/lib/seo";
import type { Article } from "@/lib/articles";
import { getArticlesByRegion, ARTICLES } from "@/lib/articles";

const JENNIFER = { name: "Jennifer Walsh", role: "CPA, Tax Advisor" };
const MICHAEL = { name: "Michael Torres", role: "Tax Specialist" };

export const ARTICLES_US_ONLY: Article[] = [

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 1 — IRS EXPENSE RULES
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "irs-business-expense-deduction-rules",
    regions: ["us"],
    title: "IRS Business Expense Deduction Rules: The Complete Guide for Freelancers",
    excerpt:
      "Everything the IRS requires to deduct a business expense — the ordinary-and-necessary test, documentation standards, record retention rules, and how to build a system that survives an audit.",
    category: "Tax Compliance",
    readTime: 10,
    publishedAt: "2025-01-06",
    author: JENNIFER,
    imageUrl: "https://picsum.photos/seed/irs-business-expense-rules/600/400",
    imageAlt: "US freelancer organizing business receipts and tax documents",
    tags: ["IRS", "business expenses", "deductions", "self-employed", "audit", "record keeping"],
    clusterName: "IRS Expense Rules",
    relatedSlugs: [
      "schedule-c-deductions-guide-us-freelancers",
      "irs-receipt-documentation-requirements",
      "self-employed-tax-deductions-us-2025",
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
          "For meals and entertainment: names of attendees and business relationship",
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
        text: "ReceiptOne stores your receipts for 10+ years and captures merchant name, date, amount, and sales tax automatically — everything you need for an IRS audit, organized without effort.",
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
    ],
  },

  {
    slug: "irs-receipt-documentation-requirements",
    regions: ["us"],
    title: "IRS Receipt Documentation Requirements for Self-Employed Workers",
    excerpt:
      "Exactly what the IRS wants to see on your business receipts, how long to keep them, and whether digital copies are acceptable for audit purposes.",
    category: "Tax Compliance",
    readTime: 6,
    publishedAt: "2025-01-13",
    author: MICHAEL,
    imageUrl: "https://picsum.photos/seed/irs-receipt-documentation/600/400",
    imageAlt: "Freelancer scanning business receipts for IRS documentation",
    tags: ["IRS", "receipts", "documentation", "audit", "self-employed", "record keeping"],
    clusterName: "IRS Expense Rules",
    relatedSlugs: [
      "irs-business-expense-deduction-rules",
      "self-employed-tax-deductions-us-2025",
      "quarterly-estimated-taxes-us-freelancers",
    ],
    body: [
      {
        type: "p",
        text: "The IRS doesn't require receipts for every single expense — but for any expense over $75, and for all travel and entertainment costs regardless of amount, proper documentation is mandatory. Without it, the deduction is at risk.",
      },
      {
        type: "h2",
        text: "The $75 Rule",
      },
      {
        type: "p",
        text: "For most business expenses under $75, a bank or credit card statement showing the amount, vendor, and date is sufficient. For expenses $75 and over, you need a receipt showing the specific items purchased and amounts. Travel and entertainment expenses require receipts regardless of amount.",
      },
      {
        type: "h2",
        text: "Are Digital Receipts Acceptable?",
      },
      {
        type: "p",
        text: "Yes — the IRS accepts digital records under Revenue Procedure 98-25. A photo of a paper receipt taken with your phone qualifies as long as it is legible and shows all required information. Email receipts and PDF invoices are also fully acceptable.",
      },
      {
        type: "callout",
        text: "ReceiptOne captures receipts via camera, email forwarding, or PDF upload and stores them in the cloud for 10+ years — IRS-ready documentation that never fades or gets lost.",
      },
      {
        type: "h2",
        text: "Meal and Entertainment Documentation",
      },
      {
        type: "ul",
        items: [
          "Amount of the expense",
          "Date the meal took place",
          "Name and location of the restaurant",
          "Business purpose of the meeting",
          "Names and business relationship of all attendees",
        ],
      },
      {
        type: "h2",
        text: "Vehicle Mileage Logs",
      },
      {
        type: "p",
        text: "If you deduct vehicle expenses using the standard mileage rate, you must keep a contemporaneous mileage log — recorded at or near the time of each trip. It should include the date, destination, business purpose, and miles driven. Reconstructed logs created at year-end are frequently disallowed.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 2 — SCHEDULE C & DEDUCTIONS
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "schedule-c-deductions-guide-us-freelancers",
    regions: ["us"],
    title: "Schedule C Deductions: The Complete Guide for US Freelancers",
    excerpt:
      "Every deduction available on IRS Schedule C explained — from home office and vehicle expenses to the qualified business income deduction that can cut your tax bill by 20%.",
    category: "Tax Deductions",
    readTime: 12,
    publishedAt: "2025-02-03",
    author: JENNIFER,
    imageUrl: "https://picsum.photos/seed/schedule-c-deductions-us/600/400",
    imageAlt: "US freelancer completing IRS Schedule C tax form",
    tags: ["Schedule C", "deductions", "freelancer", "IRS", "self-employed", "1099"],
    clusterName: "Schedule C & Deductions",
    relatedSlugs: [
      "irs-business-expense-deduction-rules",
      "self-employed-tax-deductions-us-2025",
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
          "Line 11 — Contract labor: amounts paid to subcontractors (issue Form 1099-NEC if over $600)",
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
        text: "The QBI deduction is one of the most valuable available to freelancers — but only if your income is properly documented. ReceiptOne keeps your expense records IRS-ready year-round so your accountant can maximize every deduction.",
      },
      {
        type: "h2",
        text: "Self-Employment Tax Deduction",
      },
      {
        type: "p",
        text: "You pay self-employment tax (15.3%) on your net Schedule C profit. But you can deduct 50% of that SE tax on Schedule 1 — reducing your adjusted gross income before income taxes are calculated. It's automatic but easy to miss if you're filing manually.",
      },
    ],
  },

  {
    slug: "self-employed-tax-deductions-us-2025",
    regions: ["us"],
    title: "Top Tax Deductions for Self-Employed Workers in the US (2025)",
    excerpt:
      "The most valuable deductions available to US freelancers and 1099 contractors in 2025 — including the ones most people miss.",
    category: "Tax Deductions",
    readTime: 9,
    publishedAt: "2025-02-10",
    author: MICHAEL,
    imageUrl: "https://picsum.photos/seed/self-employed-deductions-us-2025/600/400",
    imageAlt: "US freelancer reviewing tax deductions on laptop",
    tags: ["deductions", "freelancer", "1099", "IRS", "self-employed", "2025", "tax savings"],
    clusterName: "Schedule C & Deductions",
    relatedSlugs: [
      "schedule-c-deductions-guide-us-freelancers",
      "home-office-deduction-form-8829-us",
      "irs-mileage-rate-2025-self-employed",
    ],
    body: [
      {
        type: "p",
        text: "The IRS gives self-employed workers significant deductions that employees can't access. Used correctly, these deductions can reduce your effective tax rate substantially — but only if you track your expenses throughout the year. Here are the most valuable deductions for 2025.",
      },
      {
        type: "h2",
        text: "1. Home Office Deduction",
      },
      {
        type: "p",
        text: "If you use a portion of your home exclusively and regularly for business, you can deduct either $5 per square foot (simplified method, up to 300 sq ft) or a percentage of actual home expenses based on the office's share of your home's square footage. The simplified method is easier; actual expenses usually yield a larger deduction.",
      },
      {
        type: "h2",
        text: "2. Vehicle / Mileage",
      },
      {
        type: "p",
        text: "The 2025 IRS standard mileage rate is 70 cents per mile for business travel. Alternatively, you can deduct actual vehicle costs proportional to business use. Keep a mileage log — the IRS requires contemporaneous records.",
      },
      {
        type: "h2",
        text: "3. Health Insurance Premiums",
      },
      {
        type: "p",
        text: "Self-employed individuals can deduct 100% of health insurance premiums for themselves, spouses, and dependents directly on Schedule 1 (not Schedule C), reducing AGI. You cannot deduct more than your net self-employment income.",
      },
      {
        type: "h2",
        text: "4. Retirement Contributions",
      },
      {
        type: "ul",
        items: [
          "SEP-IRA: up to 25% of net self-employment income, max $69,000 (2025)",
          "Solo 401(k): employee contribution up to $23,500 + employer contribution up to 25% of compensation",
          "SIMPLE IRA: up to $16,500 employee contribution",
          "Contributions reduce AGI dollar-for-dollar — one of the most powerful deductions available",
        ],
      },
      {
        type: "h2",
        text: "5. Professional Development & Education",
      },
      {
        type: "p",
        text: "Courses, certifications, books, and conferences that maintain or improve skills required in your current work are fully deductible. Education that qualifies you for a new career is not.",
      },
      {
        type: "h2",
        text: "6. Software and Subscriptions",
      },
      {
        type: "p",
        text: "Business software, project management tools, cloud storage, accounting apps, and professional subscriptions are fully deductible as business expenses under Schedule C Line 27a.",
      },
      {
        type: "callout",
        text: "ReceiptOne automatically captures and categorizes every business expense throughout the year — so when tax time comes, your Schedule C deductions are already organized and IRS-ready.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 3 — 1099 & ESTIMATED TAXES
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "1099-contractor-tax-guide-us",
    regions: ["us"],
    title: "1099 Contractor Tax Guide: What You Owe and How to Pay It",
    excerpt:
      "Everything independent contractors need to know about 1099-NEC income, self-employment tax, quarterly payments, and keeping enough cash aside to avoid surprises in April.",
    category: "Tax Fundamentals",
    readTime: 8,
    publishedAt: "2025-03-03",
    author: JENNIFER,
    imageUrl: "https://picsum.photos/seed/1099-contractor-tax-guide/600/400",
    imageAlt: "Independent contractor reviewing 1099-NEC tax form",
    tags: ["1099", "contractor", "self-employment tax", "quarterly taxes", "freelancer", "IRS"],
    clusterName: "1099 & Estimated Taxes",
    relatedSlugs: [
      "quarterly-estimated-taxes-us-freelancers",
      "schedule-c-deductions-guide-us-freelancers",
      "self-employed-tax-deductions-us-2025",
    ],
    body: [
      {
        type: "p",
        text: "When you work as an independent contractor, clients who pay you $600 or more in a year issue a Form 1099-NEC (Non-Employee Compensation). Unlike W-2 employees, no taxes are withheld from your payments — you owe both income tax and self-employment tax, and you're responsible for paying them yourself throughout the year.",
      },
      {
        type: "h2",
        text: "Self-Employment Tax: The Big Surprise",
      },
      {
        type: "p",
        text: "Self-employment tax is 15.3% on the first $176,100 of net earnings (2025), plus 2.9% Medicare on amounts above that. It covers Social Security and Medicare — taxes that employees split with their employer. As a contractor, you pay the full amount. However, you can deduct 50% of SE tax from your gross income.",
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
          "Combined effective rate for a typical freelancer: 25–35% of net profit",
        ],
      },
      {
        type: "h2",
        text: "The Set-Aside Rule",
      },
      {
        type: "p",
        text: "A practical guideline: set aside 25–30% of every client payment for taxes. For higher earners or those in high-tax states, 35% is safer. Open a separate savings account specifically for this purpose — the money isn't yours until you've filed your return.",
      },
      {
        type: "callout",
        text: "Tracking every business expense reduces your net profit — which reduces both income tax and self-employment tax. ReceiptOne captures deductions you'd otherwise miss, putting money back in your pocket.",
      },
      {
        type: "h2",
        text: "Quarterly Estimated Payments",
      },
      {
        type: "p",
        text: "If you expect to owe $1,000 or more in taxes for the year, the IRS requires quarterly estimated payments. Missing or underpaying these triggers an underpayment penalty — typically small but avoidable. Pay by April 15, June 16, September 15, and January 15.",
      },
    ],
  },

  {
    slug: "quarterly-estimated-taxes-us-freelancers",
    regions: ["us"],
    title: "Quarterly Estimated Taxes for Freelancers: How to Calculate and Pay",
    excerpt:
      "The IRS requires freelancers to pay taxes four times a year. Here's exactly how to calculate what you owe, when to pay, and how to avoid underpayment penalties.",
    category: "Tax Fundamentals",
    readTime: 7,
    publishedAt: "2025-03-10",
    author: MICHAEL,
    imageUrl: "https://picsum.photos/seed/quarterly-taxes-us-freelancers/600/400",
    imageAlt: "Freelancer calculating quarterly estimated tax payments",
    tags: ["quarterly taxes", "estimated payments", "Form 1040-ES", "freelancer", "IRS", "self-employed"],
    clusterName: "1099 & Estimated Taxes",
    relatedSlugs: [
      "1099-contractor-tax-guide-us",
      "self-employed-tax-deductions-us-2025",
      "schedule-c-deductions-guide-us-freelancers",
    ],
    body: [
      {
        type: "p",
        text: "Freelancers don't have an employer withholding taxes from paychecks. Instead, the IRS requires you to pay estimated taxes four times a year using Form 1040-ES. If you skip or underpay, you'll owe a penalty — even if you pay the full amount at tax time in April.",
      },
      {
        type: "h2",
        text: "2025 Payment Deadlines",
      },
      {
        type: "ul",
        items: [
          "Q1 (Jan 1 – Mar 31): due April 15, 2025",
          "Q2 (Apr 1 – May 31): due June 16, 2025",
          "Q3 (Jun 1 – Aug 31): due September 15, 2025",
          "Q4 (Sep 1 – Dec 31): due January 15, 2026",
        ],
      },
      {
        type: "h2",
        text: "The Safe Harbor Rule",
      },
      {
        type: "p",
        text: "You avoid the underpayment penalty if you pay at least 100% of last year's total tax liability (110% if your AGI exceeded $150,000). This is the 'safe harbor' approach — you don't need to estimate this year's income precisely. Pay what you paid last year and you're protected.",
      },
      {
        type: "h2",
        text: "How to Calculate Each Payment",
      },
      {
        type: "ul",
        items: [
          "Estimate your annual net profit (income minus deductions)",
          "Calculate self-employment tax: net profit × 0.9235 × 0.153",
          "Deduct 50% of SE tax from net profit to get adjusted income",
          "Apply your marginal federal income tax rate",
          "Add state income tax if applicable",
          "Divide total annual tax by 4 for each quarterly payment",
        ],
      },
      {
        type: "callout",
        text: "Accurate quarterly payments require accurate expense tracking. ReceiptOne keeps a running total of your deductions all year — so every quarterly estimate reflects your actual tax position, not a guess.",
      },
      {
        type: "h2",
        text: "How to Pay",
      },
      {
        type: "p",
        text: "The easiest method is IRS Direct Pay at irs.gov — free, instant, and no account required. You can also use the IRS2Go app, EFTPS (Electronic Federal Tax Payment System), or mail a check with Form 1040-ES voucher. EFTPS is recommended for freelancers who pay regularly — it allows scheduling payments in advance.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     STANDALONE ARTICLES
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "irs-mileage-rate-2025-self-employed",
    regions: ["us"],
    title: "IRS Standard Mileage Rate 2025: How to Claim Vehicle Deductions",
    excerpt:
      "The 2025 IRS standard mileage rate is 70 cents per mile. Here's how to track qualifying trips, maintain a compliant mileage log, and decide whether the standard rate or actual expenses is better for you.",
    category: "Mileage & Auto",
    readTime: 6,
    publishedAt: "2025-04-07",
    author: JENNIFER,
    imageUrl: "https://picsum.photos/seed/irs-mileage-rate-2025/600/400",
    imageAlt: "Self-employed worker tracking business mileage for IRS deduction",
    tags: ["mileage", "IRS", "vehicle deduction", "standard mileage rate", "self-employed", "2025"],
    relatedSlugs: [
      "self-employed-tax-deductions-us-2025",
      "schedule-c-deductions-guide-us-freelancers",
      "1099-contractor-tax-guide-us",
    ],
    body: [
      {
        type: "p",
        text: "The IRS lets self-employed workers deduct business driving costs using either the standard mileage rate or actual vehicle expenses. For most freelancers, the standard rate is simpler and often yields a comparable or better deduction without requiring detailed fuel, insurance, and maintenance records.",
      },
      {
        type: "h2",
        text: "2025 Standard Mileage Rates",
      },
      {
        type: "ul",
        items: [
          "Business miles: 70 cents per mile",
          "Medical or moving miles: 21 cents per mile",
          "Charitable miles: 14 cents per mile",
        ],
      },
      {
        type: "h2",
        text: "What Counts as a Business Mile",
      },
      {
        type: "ul",
        items: [
          "Driving to meet clients or customers",
          "Travel between two business locations",
          "Driving to a temporary work location",
          "Business errands (post office, bank, supply store)",
          "NOT deductible: your regular commute from home to a fixed office",
        ],
      },
      {
        type: "h2",
        text: "Mileage Log Requirements",
      },
      {
        type: "p",
        text: "The IRS requires a contemporaneous mileage log — meaning you record each trip at or near the time it happens. A log created months later from memory is not acceptable. Required entries: date of trip, starting location, destination, business purpose, and miles driven.",
      },
      {
        type: "callout",
        text: "ReceiptOne's mileage tracker logs trips automatically and applies the current IRS rate — your mileage log is always up to date and IRS-ready without manual entry.",
      },
      {
        type: "h2",
        text: "Standard Rate vs. Actual Expenses",
      },
      {
        type: "p",
        text: "Actual expenses (gas, insurance, registration, depreciation, maintenance — proportional to business use) can exceed the standard rate if you drive a fuel-efficient vehicle or have high fixed costs. However, actual expenses require far more recordkeeping. If you drive a lot of business miles in a high-cost vehicle, run the numbers both ways with your accountant.",
      },
    ],
  },

  {
    slug: "home-office-deduction-form-8829-us",
    regions: ["us"],
    title: "Home Office Deduction for US Freelancers: Form 8829 Explained",
    excerpt:
      "How to claim the home office deduction using Form 8829 or the simplified method — including the exclusive-use rule, what expenses qualify, and how to calculate the deduction correctly.",
    category: "Tax Deductions",
    readTime: 7,
    publishedAt: "2025-04-14",
    author: MICHAEL,
    imageUrl: "https://picsum.photos/seed/home-office-deduction-us/600/400",
    imageAlt: "Freelancer working in dedicated home office space",
    tags: ["home office", "Form 8829", "deductions", "IRS", "self-employed", "freelancer"],
    relatedSlugs: [
      "self-employed-tax-deductions-us-2025",
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
        text: "Home office expenses require careful documentation. ReceiptOne captures utility bills, insurance statements, and repair receipts year-round — so your Form 8829 calculations are accurate and defensible.",
      },
      {
        type: "h2",
        text: "The Income Limitation",
      },
      {
        type: "p",
        text: "The home office deduction cannot exceed your net business income from that business. If you're in a loss year, the excess carries forward to the next year — it isn't lost. This limits the deduction's value in low-income years but makes it fully recoverable when business picks up.",
      },
    ],
  },

  {
    slug: "sales-tax-business-expenses-us",
    regions: ["us"],
    title: "Sales Tax on Business Expenses: What US Freelancers Need to Know",
    excerpt:
      "How sales tax works on your business purchases, whether it's separately deductible, when you might need to collect it from clients, and why tracking it matters for your records.",
    category: "Tax Fundamentals",
    readTime: 5,
    publishedAt: "2025-05-05",
    author: JENNIFER,
    imageUrl: "https://picsum.photos/seed/sales-tax-business-expenses-us/600/400",
    imageAlt: "Business receipt showing sales tax amount for deduction tracking",
    tags: ["sales tax", "business expenses", "deductions", "IRS", "freelancer", "receipts"],
    relatedSlugs: [
      "irs-business-expense-deduction-rules",
      "irs-receipt-documentation-requirements",
      "schedule-c-deductions-guide-us-freelancers",
    ],
    body: [
      {
        type: "p",
        text: "Unlike Canada's GST/HST — which self-employed workers can often recover as an input tax credit — US sales tax paid on business expenses is generally not separately refundable. Instead, the sales tax becomes part of the total cost of the purchase, and the entire amount (including tax) is deductible as a business expense.",
      },
      {
        type: "h2",
        text: "How Sales Tax Affects Your Deductions",
      },
      {
        type: "p",
        text: "When you buy a $200 software license and pay $18 in sales tax, your deductible expense is $218 — the full amount. The IRS doesn't require you to separate the sales tax from the purchase price on Schedule C; the total cost is the deduction.",
      },
      {
        type: "h2",
        text: "State Income Tax Deduction (Sales Tax Alternative)",
      },
      {
        type: "p",
        text: "On Schedule A (if you itemize), you can deduct either state income taxes or state and local sales taxes — not both. For freelancers in no-income-tax states like Texas, Florida, or Washington, tracking cumulative sales tax paid throughout the year can yield a meaningful itemized deduction.",
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
        text: "ReceiptOne records the sales tax amount on every receipt automatically — giving you clean records for your Schedule C deductions and a running total for state tax deduction purposes.",
      },
      {
        type: "h2",
        text: "Nexus and Online Sales",
      },
      {
        type: "p",
        text: "After the 2018 South Dakota v. Wayfair Supreme Court decision, states can require out-of-state sellers to collect sales tax once they meet economic nexus thresholds — typically $100,000 in sales or 200 transactions per year. If you sell products online to customers in multiple states, this affects you regardless of your physical location.",
      },
    ],
  },

];

/** All articles visible on the US Help Center (US-only + universal CA articles). */
export const US_ARTICLES: Article[] = [
  ...ARTICLES_US_ONLY,
  ...getArticlesByRegion(ARTICLES, "us"),
];
