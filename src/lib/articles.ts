/**
 * Articles data + helpers for the ReceiptOne knowledge base.
 * No React imports — pure TypeScript data layer.
 */
import { LOGO_URL, SITE_URL } from "@/lib/seo";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] };

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
    title: "CRA Receipt Rules: What to Keep and for How Long (2026)",
    excerpt:
      "What the CRA requires on a business receipt for 2026, when scans can replace paper, the six-year retention rule, and the $100 and $500 GST/HST ITC tiers.",
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
    slug: "digital-receipts-canada-are-they-valid",
    title: "Are Digital Receipts Valid for the CRA? (2026 Guide)",
    excerpt:
      "When the CRA accepts photos, scans and emailed receipts, when you must still keep the paper, and how to store, back up and hand over electronic records.",
    category: "Tax Compliance",
    publishedAt: "2026-10-04",
    updatedAt: "2026-10-04",
    imageUrl: "https://picsum.photos/seed/digital-receipts-canada-are-they-valid/600/400",
    imageAlt: "Person photographing a paper receipt with a smartphone",
    tags: ["digital receipts", "CRA", "email receipts", "photo receipts", "compliance"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: ["cra-receipt-rules-canada", "cra-audit-proof-expenses"],
    body: [
      {
        type: "p",
        text: "Yes: the CRA accepts electronic records, and a receipt that reached you electronically is a valid record in its own right. A photo of a paper receipt is a different case. The CRA's general rule is that you keep the paper original, and you may destroy it only if your imaging meets the national standard the CRA points to.",
      },
      {
        type: "p",
        text: "This guide covers what that means in practice for the 2026 tax year. It treats three kinds of digital receipt separately, sets out what makes an image acceptable, and explains how to store, back up and hand over electronic records. For what a receipt must show and how long to keep it, see our CRA receipt rules guide. Everything below comes from canada.ca and CRA publications, chiefly Information Circular IC05-1R1, Electronic Record Keeping.",
      },
      {
        type: "h2",
        text: "Three Kinds of Digital Receipt, Three Sets of Rules",
      },
      {
        type: "ul",
        items: [
          "Born-digital receipts: emailed receipts, PDF invoices, online order confirmations. These were created or received electronically, so the CRA requires you to keep them electronically. A printout does not replace the file.",
          "Paper receipts you photograph or scan: the image is a copy. The paper is still the record unless your imaging meets the national standard, CAN/CGSB 72.34, Electronic Records as Documentary Evidence.",
          "Receipts held by an app, bookkeeper or other service: you remain responsible for keeping them, keeping them readable and producing them, wherever the provider stores them.",
        ],
      },
      {
        type: "h2",
        text: "Emailed and Online Receipts",
      },
      {
        type: "p",
        text: 'IC05-1R1 lists the source documents a business must keep, including purchase invoices, cash register receipts, credit card receipts and bank statements. Where relevant, emails and other correspondence count too. It adds that where any of these documents are "initially created, transmitted or received electronically", they "must also be retained electronically". The Income Tax Act says the same thing about records kept electronically: they must be kept in an electronically readable format for the full retention period, even when a paper copy exists.',
      },
      {
        type: "p",
        text: "For online purchases, the circular notes that emails used as part of the transaction, such as invoices and confirmations, can be an important part of the audit trail. In practice, save the receipt itself as a file you control, rather than relying on an inbox you might lose access to, and keep it in a format that opens without the vendor's account.",
      },
      {
        type: "h2",
        text: "Photos and Scans of Paper Receipts",
      },
      {
        type: "p",
        text: 'The CRA\'s keeping-records pages say: "Generally, you must keep originals of your paper documents. However, you can produce electronic images of these documents, known as imaging." For any image to stand in for the paper, it must:',
      },
      {
        type: "ul",
        items: [
          "Be an accurate reproduction made with the intention of taking the place of the paper document",
          "Give the same information as the paper document",
          "Not have significant details obscured by limits of resolution, tone or hue",
        ],
      },
      {
        type: "p",
        text: 'Destroying the paper is where the standard comes in. If you have imaged your paper records and supporting documents according to the CGSB standard, "the images become the permanent records" and you can destroy the paper. If you cannot meet the standard, the CRA says you have to keep the originals, and it advises getting legal advice if you are in any doubt. Businesses using commercial software for small-scale scanning are expected to check that their scans follow the same standard.',
      },
      {
        type: "p",
        text: "IC05-1R1 describes what an acceptable imaging program involves:",
      },
      {
        type: "ul",
        items: [
          "A person in authority confirms in writing that imaging is part of the business's usual and ordinary activity",
          "The systems and procedures are established and documented",
          "A logbook records the date of imaging, who authorized and performed it, a description of the records imaged, and whether and when each source document was destroyed",
          "The software keeps an index so any record can be found immediately, and records the imaging date and the person who did it",
          "Images are of commercial quality, legible on screen and on paper",
          "Inspection and quality control keep the above in place, and equipment is available to view or print the images",
        ],
      },
      {
        type: "p",
        text: "Hypothetical example: a freelance designer photographs every receipt on the day of purchase, files the images by month, and drops the paper into one envelope per year. That approach keeps the originals, so the photos can be used day to day without having to meet the imaging standard. If the designer later wants to shred the paper, the bar is the documented program above, not simply having a clear photo.",
      },
      {
        type: "h2",
        text: "Formats, Conversions and Backups",
      },
      {
        type: "p",
        text: 'The CRA\'s test for an electronic record is whether it can produce an accessible and usable copy. That means a copy in an electronically readable format that CRA auditors can process and analyse with CRA software, in a "non-proprietary, commonly used data interchange format". Files kept in an encrypted or proprietary backup format must be restorable later to an accessible, usable state. If you convert records from one format to another, the conversion must not lose, destroy or alter information relevant to your taxes.',
      },
      {
        type: "p",
        text: "On backups, the CRA encourages keeping a backup at a site other than your business location and recommends that it be in Canada. IC05-1R1 also sets out good backup practice:",
      },
      {
        type: "ul",
        items: [
          "Make sure backed-up files can be restored in a format the CRA can access and use",
          "Check that the intended data is actually being written to the backup",
          "Don't let a backup overwrite earlier periods' backups",
          "Label each backup and keep a log of what it holds and how long it must be kept",
          "Note the software name and version used to create the records",
          "Test periodically that backups can be restored",
        ],
      },
      {
        type: "p",
        text: "If electronic records you are required to keep are lost, destroyed or damaged, you must report it to the CRA and recreate the files within a reasonable time. The CRA's number for this is 1-800-959-5525. Before you change systems, make sure you will still be able to access and retrieve your existing records.",
      },
      {
        type: "h2",
        text: "Apps, Bookkeepers and Cloud Storage",
      },
      {
        type: "p",
        text: "Using a third party does not shift the responsibility. IC05-1R1 is explicit that contracting out record keeping to a bookkeeper, accountant, application service provider or similar does not relieve you of record keeping, readability, retention or access duties. The CRA suggests, as good practice, having the provider give you an acceptable copy of the information in an electronically readable format. You must keep meeting the requirements through software changes, a provider's bankruptcy, or a move to or from a provider.",
      },
      {
        type: "p",
        text: 'Location matters as well. Records must be kept at your place of business or residence in Canada unless the CRA gives written permission otherwise. "Records kept outside Canada and accessed electronically from Canada are not considered to be records in Canada." Where records are held electronically outside Canada, the CRA may accept a copy made available in Canada in a readable, usable format with enough detail to support your returns.',
      },
      {
        type: "callout",
        text: "These rules apply to a receipt app like any other provider. ReceiptOne can export your records as PDF or CSV, which gives you a copy you hold yourself. Our privacy policy explains that its data may be stored outside Canada, so keep that exported copy in Canada.",
      },
      {
        type: "h2",
        text: "Handing Electronic Records to the CRA",
      },
      {
        type: "p",
        text: "If the CRA reviews your return and asks for documents, you can send scanned copies through My Account or Represent a Client. The service lets you keep your original receipts. Accepted formats include .pdf, .jpg, .jpeg, .tif, .tiff, .doc, .docx, .xls, .xlsx, .rtf, .txt and .xps. A submission can be up to 150 MB and up to 10 files per session, each file needs a unique name, and the CRA suggests including the return line number in the file name. If documents are unavailable, include a written explanation or call the number on the CRA's letter.",
      },
      {
        type: "p",
        text: "In an audit, the CRA says you must make all relevant records available, paper and electronic, and that failing to provide required books and records is an offence. Auditors may copy your electronic records. They are not allowed to receive records by email, because it may not be secure, so your auditor will explain the CRA's secure options. If you keep your accounting records on a computer, you must keep them in an electronically readable format even if you also keep paper.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "p",
        text: "Is a photo of a receipt as good as the original? It can be used as a copy, and it must be an accurate, legible reproduction. Whether you can discard the paper depends on meeting the CAN/CGSB 72.34 imaging standard; if you don't, the CRA says to keep the original.",
      },
      {
        type: "p",
        text: "Can I just print my email receipts and delete the emails? No. A record received electronically has to be kept electronically, even if you also have a paper copy.",
      },
      {
        type: "p",
        text: "Does my receipt app keep my records for me? It can hold copies, but the responsibility to keep, produce and keep readable your records stays with you. Exporting a copy you control, and keeping it in Canada, covers the most common gaps.",
      },
      {
        type: "p",
        text: "What file format should I save receipts in? The CRA asks for records in a non-proprietary, commonly used format that its software can read. For sending documents in a review, it lists .pdf and .jpg among the accepted formats.",
      },
      {
        type: "p",
        text: "My laptop died and took my receipts with it. What now? Report the loss to the CRA and recreate the records within a reasonable time, for example by asking suppliers and your bank for copies. A tested backup kept off-site in Canada is what the CRA recommends to avoid this.",
      },
      {
        type: "p",
        text: "Can I email my receipts to a CRA auditor? No. Auditors are not allowed to receive records by email; they will tell you how to send documents through the CRA's secure services.",
      },
    ],
  },

  {
    slug: "cra-audit-proof-expenses",
    title: "How to Document Expenses for a CRA Review (2026)",
    excerpt:
      "How to support expense claims in a 2026 CRA review: the general tests, rules for meals, home office, vehicle and family wages, and missing receipts.",
    category: "Tax Compliance",
    publishedAt: "2026-10-04",
    updatedAt: "2026-10-04",
    imageUrl: "https://picsum.photos/seed/cra-audit-proof-expenses/600/400",
    imageAlt: "Organized financial folders and tax documents for CRA audit preparation",
    tags: ["CRA audit", "expense documentation", "self-employed", "record keeping", "compliance"],
    clusterPillar: "cra-receipt-rules-canada",
    clusterName: "CRA Receipt Rules",
    relatedSlugs: ["cra-receipt-rules-canada", "digital-receipts-canada-are-they-valid"],
    body: [
      {
        type: "p",
        text: "An expense holds up when you can show three things: you incurred it to earn business income, the amount is reasonable, and a document supports it. No expense is audit-proof in the sense of being beyond question. The CRA can review any claim, and what decides the outcome is whether your records answer its questions.",
      },
      {
        type: "p",
        text: "This guide covers the 2026 tax year and looks at the expense side of a self-employed return. It explains what the CRA examines, the general tests every expense must pass, the categories with their own documentation rules, and what to do when something is missing. What a receipt must show and how long to keep it are covered in our CRA receipt rules guide. Everything here comes from canada.ca and CRA publications.",
      },
      {
        type: "h2",
        text: "How the CRA Checks Expense Claims",
      },
      {
        type: "p",
        text: 'Most contact starts as a review. The CRA runs several review programs, some before your notice of assessment is issued and some after, that check deductions and credits "to make sure that amounts are reported correctly and that they are properly supported". It first tries to verify a claim from information it already has. If it needs more, it contacts you or your representative and asks for receipts or other documents by a set deadline.',
      },
      {
        type: "p",
        text: "An audit goes further. The CRA chooses files for audit based on a risk assessment, considering factors such as the likelihood of errors and indications of non-compliance. It may also compare your file with similar ones. According to the CRA's guide to audits (RC4188), an auditor can examine:",
      },
      {
        type: "ul",
        items: [
          "Information the CRA already has, such as filed returns, credit history and property details",
          "Business records: ledgers, journals, invoices, receipts, contracts and bank statements",
          "Personal records: bank statements, mortgage documents and credit card statements",
          "Records of related people and entities, such as a spouse or common-law partner, family members, corporations, partnerships or trusts",
          "Adjustments your bookkeeper or accountant made for tax purposes",
        ],
      },
      {
        type: "p",
        text: "If the auditor proposes changes, you get a proposal letter and 30 days to agree or disagree. If you disagree, you can explain why and provide more documents, and if the issue is not resolved you can contact the auditor's team leader. Good records shorten an audit; missing records are one of the delays the CRA names.",
      },
      {
        type: "h2",
        text: "The Tests Every Expense Must Pass",
      },
      {
        type: "p",
        text: "Guide T4002 sets the baseline. As a rule, you can deduct any reasonable current expense you incur to earn income. Four consequences follow for your records:",
      },
      {
        type: "ul",
        items: [
          "Business part only. You cannot deduct personal expenses, so where something is used both ways you enter only the business part. Your records need to show how you worked out that share.",
          "Current, not capital. You cannot deduct the cost of capital property as an expense; it goes through capital cost allowance. A cost that gives a lasting benefit, or improves property beyond its original condition, is generally capital. One that restores it or recurs after a short period is generally current. Keep a record of property you buy and sell: who sold it, the cost and the date.",
          "Net of tax credits. If you claim an input tax credit for the GST/HST on an expense, reduce the expense by that credit. Subtract any rebate, grant or assistance in the same way.",
          "Right year. On the cash method you deduct only what you paid in the year, and you cannot deduct a prepaid amount (other than for inventory) that relates to a tax year two or more years after the year you paid it. On the accrual method, you deduct a prepaid expense in the year or years you get the benefit.",
        ],
      },
      {
        type: "p",
        text: "In practice, a defensible expense file pairs the receipt or invoice with proof of payment and a note of what the expense was for. The proof of payment is usually a bank or card statement, both on the CRA's list of records. The note is our suggestion rather than a CRA rule, but T4002 does tell you to write a description on any receipt that lacks one, such as a cash register tape.",
      },
      {
        type: "callout",
        text: "ReceiptOne lets you mark each receipt as business or personal and add a comment to it. The comment is a natural place for a one-line business purpose, written when you still remember it.",
      },
      {
        type: "h2",
        text: "Expenses With Their Own Documentation Rules",
      },
      {
        type: "p",
        text: "Meals and entertainment (line 8523). The most you can claim is 50% of the lesser of what you spent and an amount that is reasonable in the circumstances. The same limits apply to meals while travelling or at a convention. The limit does not apply in some listed cases, including when you bill the client for the meal and show it on the bill. Keep the receipt, and for the 50% exceptions keep whatever shows the exception applies, such as the invoice to the client.",
      },
      {
        type: "p",
        text: "Business use of home (line 9945, Part 7 of Form T2125). You qualify only if the workspace is your principal place of business, or you use it only to earn business income and regularly meet clients, customers or patients there. You deduct part of costs such as heating, electricity, insurance, maintenance, property taxes and mortgage interest, or rent if you rent. The share has to be on a reasonable basis, such as workspace area divided by total area. For a room also used personally, multiply that area share by the hours of business use divided by 24. The deduction cannot create or increase a business loss; the excess carries forward. Keep the bills, your measurements and your calculation.",
      },
      {
        type: "p",
        text: "Hypothetical example: a consultant's office is 15 m² of a 120 m² rented apartment, used only for the business, and it is their principal place of business. That is 12.5%. If the year's rent, utilities and tenant insurance total $27,300, the business share is $3,412.50, deductible up to the business's net income before this deduction.",
      },
      {
        type: "p",
        text: "Motor vehicle (line 9281). If you use a vehicle for business and personal trips, you must keep accurate records showing the business share of the kilometres you drove. In practice that means a logbook. Our mileage deduction guide covers the logbook rules and the 2026 limits in detail.",
      },
      {
        type: "p",
        text: "Salary to your child, spouse or common-law partner. You can deduct it if the work is necessary to earn the business income and the pay is reasonable, meaning what you would pay someone else (for a child, also considering their age). Keep documents to support it: a cancelled cheque if you pay by cheque, or a receipt signed by the person if you pay cash. Report the salary on a T4 slip as for any other employee.",
      },
      {
        type: "h2",
        text: "When a Record Is Missing",
      },
      {
        type: "p",
        text: "If you no longer have a record, the CRA's guidance is to try to get a copy from whoever created it, such as your bank or the supplier. If you can't, you can discuss it with the auditor or the auditor's team leader, who will work with you on other ways to confirm the amounts on your return. In a review, if receipts are unavailable, include a written explanation or call the number on the CRA's letter.",
      },
      {
        type: "p",
        text: "The consequences of inadequate records are set out in T4002. The CRA may determine your income by other methods and may disallow expenses you cannot support. There are penalties for not keeping adequate records, for not giving the CRA access to them, and for not giving information when asked. If the CRA finds your books inadequate, IC05-1R1 says it will ordinarily ask for a written agreement to keep them as required, and follow up within a reasonable time.",
      },
      {
        type: "h2",
        text: "If You Disagree With the Result",
      },
      {
        type: "p",
        text: "You have the right to object to a reassessment. For individuals, the deadline is the later of one year after the filing deadline for the return and 90 days after the date of the notice of assessment. If you miss it, you can apply for an extension no later than one year after the objection deadline. While any objection or appeal is open, keep the related records until it is resolved and the time for any further appeal has passed, even if that is longer than six years.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "p",
        text: "How long do I have to respond during an audit? If the auditor sends a proposal letter, you have 30 days to agree or disagree. For a review letter, reply within the time frame the letter gives, and call the number on it if you need more time.",
      },
      {
        type: "p",
        text: "Can the CRA look at my personal bank account? Yes. RC4188 lists your personal records, including bank and credit card statements, among the records an auditor can examine, along with records of family members and related entities.",
      },
      {
        type: "p",
        text: "Is a bank statement enough to support an expense? It is a record, and it proves payment, but it does not show what you bought. Keep the receipt or invoice with it; for GST/HST input tax credits, the CRA's documentary requirements apply on top.",
      },
      {
        type: "p",
        text: "Can I deduct the full cost of a client lunch? Generally no: the claim is limited to 50% of the lesser of the cost and a reasonable amount. One exception is when you bill the client for the meal and show it on the bill.",
      },
      {
        type: "p",
        text: "Can I claim my home office if I also work at a client's site? Only if you meet one of the two conditions: the home workspace is your principal place of business, or you use it only for the business and regularly meet clients there.",
      },
      {
        type: "p",
        text: "What happens if I can't find a receipt the CRA asks for? Ask the supplier or your bank for a copy. If that fails, explain in writing (in a review) or discuss alternatives with the auditor (in an audit). If an expense cannot be supported, the CRA may disallow it.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 2 — EXPENSE TRACKING
     Pillar: expense-tracking-canada-freelancers
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "expense-tracking-canada-freelancers",
    title: "Expense Tracking System for Canadian Freelancers",
    excerpt:
      "An end-to-end expense tracking system for Canadian freelancers and contractors, from capturing receipts daily to CRA-ready reports at filing time.",
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
    title: "Business Expense Categories for Self-Employed Canadians",
    excerpt:
      "The CRA's business expense categories on Form T2125: what each line includes, what's excluded, and how to categorize common freelancer expenses.",
    category: "Expense Tracking",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "Form T2125 has a separate line for each main type of business expense. Using the right one for each expense isn't just about organization — wrong categorization can trigger questions during a review. Here's how to correctly classify the most common freelancer expenses.",
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
          "Deducting 100% of meals when the claim is generally limited to 50% of the lesser of the cost and a reasonable amount",
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
      "Simple receipt organization systems that keep your records in order all year and make tax season a review — not a recovery mission.",
    category: "Expense Tracking",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
          "Top level: one folder per tax year (e.g., '2026 Business Receipts')",
          "Subfolders by month: 01-January through 12-December",
          "Or subfolders by category: matching your T2125 expense lines",
          "Naming convention: YYYY-MM-DD_Vendor_Amount.pdf (sortable, searchable)",
          "Back up to at least two locations — cloud + local external drive",
        ],
      },
      {
        type: "callout",
        text: "Apps like ReceiptOne eliminate manual folder management entirely: scan, extract, categorize automatically, and export a CRA-ready report at any time. A manual folder system can work well when you have only a few receipts; the more you collect, the more an app saves you from naming and filing each one by hand.",
      },
    ],
  },

  {
    slug: "self-employed-expense-report-template-canada",
    title: "How to Create an Expense Report as a Self-Employed Canadian",
    excerpt:
      "A step-by-step guide to expense reports for your accountant, clients and the CRA: what to include, how to format it, and how to automate it.",
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
    updatedAt: "2026-10-05",
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
          "The CRA's answer turns on whether you incurred the expense as your client's agent (GST/HST Info Sheet GI-197, Out-of-Pocket Expenses)",
          "Not incurred as agent: if you're GST/HST-registered and bill the client for the cost, the amount is additional consideration for your service, and GST/HST applies to it in the same way and at the same rate as it applies to your service",
          "Incurred as agent: the client is treated as the recipient of the supply, so the amount you pass on is not additional consideration for your service and you don't charge GST/HST on it",
          "Whether you acted as agent depends on the facts; the CRA's policy statement P-182R, Agency, sets out the tests. Get advice if your reimbursements are significant",
        ],
      },
    ],
  },

  {
    slug: "home-office-vs-coworking-expense-canada",
    regions: ["all"],
    title: "Home Office vs. Co-working: Which Wins at Tax Time?",
    excerpt:
      "Comparing the real after-tax cost of a home office deduction versus a co-working membership for Canadian freelancers — the math might surprise you.",
    category: "Expense Tracking",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "If your workspace qualifies and is 10% of your home's area, you deduct 10% of costs such as rent, utilities, insurance and property taxes. Hypothetical example: rent of $2,400 a month and utilities of $200 a month come to $31,200 a year, so the business share is $3,120 — before internet and any workspace-specific costs. The deduction can't create or increase a business loss; any excess carries forward. The deduction scales with home cost, so owners with mortgages, high property taxes, and large homes benefit most.",
      },
      {
        type: "h2",
        text: "Co-working Space: The Math",
      },
      {
        type: "p",
        text: "Hypothetically, a co-working membership at $300–$600 a month is $3,600–$7,200 a year, deductible as a business expense on your T2125 — which can be more or less than a home office claim, depending on your housing costs. The trade-off is that you're paying for the co-working space on top of your home costs, so the net cost is higher even accounting for the tax savings.",
      },
      {
        type: "callout",
        text: "Using a co-working space doesn't automatically rule out a home office claim, but the home workspace still has to meet one of the CRA's two conditions: it is your principal place of business, or you use it only for the business and regularly meet clients there. Co-working fees are a separate business expense. Keep a record of where you actually work.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 3 — GST/HST TRACKING
     Pillar: gst-hst-expense-tracking-canada
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "gst-hst-expense-tracking-canada",
    title: "GST/HST Expense Tracking for Canadian Freelancers (2026)",
    excerpt:
      "GST/HST for self-employed Canadians in 2026: when to register, rates by province, the $100 and $500 ITC receipt tiers, and choosing a filing period.",
    category: "GST / HST",
    publishedAt: "2026-10-05",
    updatedAt: "2026-10-05",
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
        text: "GST/HST touches a self-employed business in two directions: you charge it on your sales once you are registered, and you recover the GST/HST you pay on business expenses through input tax credits (ITCs). Getting it right comes down to knowing when registration starts, tracking the tax on every purchase, and keeping receipts that meet the CRA's documentation rules. This guide gives the overview; the figures come from canada.ca and Guide RC4022.",
      },
      {
        type: "h2",
        text: "When You Must Register for GST/HST",
      },
      {
        type: "p",
        text: "You are a small supplier, and don't have to register, while your revenue from worldwide taxable supplies (with your associates') is $30,000 or less in a single calendar quarter and over the last four consecutive calendar quarters. If you go over $30,000 in a single quarter, you are a registrant from the day of the sale that put you over and must register within 29 days of that day. If you go over across four quarters but not in any one, you stay a small supplier for those quarters and the following month. Registration then takes effect on your first sale after that, with 29 days from that day to register.",
      },
      {
        type: "h2",
        text: "The ITC Advantage: Getting Your GST/HST Back",
      },
      {
        type: "p",
        text: "Once registered, you claim back the GST/HST you paid on business expenses as input tax credits. These credits offset the GST/HST you collect from clients. If your ITCs exceed the tax you collect, the CRA refunds the difference. A small supplier can also choose to register voluntarily. The effective date is then usually the date you applied, though the CRA will accept an earlier date within 30 days of receiving the application.",
      },
      {
        type: "h2",
        text: "GST/HST Rates by Province",
      },
      {
        type: "ul",
        items: [
          "5% GST only: Alberta, Northwest Territories, Nunavut, Yukon",
          "5% GST plus provincial sales tax: British Columbia (7% PST), Manitoba (7% RST), Saskatchewan (6% PST), Quebec (9.975% QST)",
          "13% HST: Ontario",
          "14% HST: Nova Scotia (since April 1, 2025; previously 15%)",
          "15% HST: New Brunswick, Newfoundland and Labrador, Prince Edward Island",
          "PST and RST are not recovered through ITCs on your GST/HST return; QST is administered by Revenu Québec",
        ],
      },
      {
        type: "h2",
        text: "ITC Documentation Requirements by Purchase Amount",
      },
      {
        type: "ul",
        items: [
          "Under $100: supplier's business or trading name, the invoice date (or date the tax was paid or payable), and the total amount",
          "$100 to $499.99: add the GST/HST charged (or that the price includes it), the status of each supply if taxable and exempt items are mixed, and the supplier's GST/HST registration number",
          "$500 or more: add the buyer's name or trading name, a brief description of the goods or services, and the terms of payment",
          "These tiers replaced the earlier $30 and $150 thresholds as of April 20, 2021",
        ],
      },
      {
        type: "callout",
        text: "The Quick Method of accounting lets eligible small businesses remit a set percentage of their GST/HST-included sales instead of claiming ITCs on most operating expenses. Whether it costs or saves you money depends on your mix of sales and expenses, so compare both methods before electing it.",
      },
      {
        type: "h2",
        text: "Choosing Your Filing Period",
      },
      {
        type: "p",
        text: "Your assigned reporting period follows your revenue from taxable supplies. $1,500,000 or less is annual, more than $1,500,000 up to $6,000,000 is quarterly, and more than $6,000,000 is monthly. You can elect to file more often, which can help cash flow if you regularly receive refunds, at the cost of more frequent returns. A sole proprietor with an annual period and a calendar fiscal year generally files by June 15 and pays any balance by April 30.",
      },
    ],
  },

  {
    slug: "track-gst-hst-business-expenses",
    title: "How to Track GST/HST on Your Business Expenses (2026)",
    excerpt:
      "When to register for GST/HST, 2026 rates by province, what a receipt needs for an input tax credit at each tier, and how to file as a sole proprietor.",
    category: "GST / HST",
    publishedAt: "2026-10-05",
    updatedAt: "2026-10-05",
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
        text: "Once you are registered for GST/HST, you can recover the GST/HST you pay on business purchases by claiming input tax credits (ITCs) on your return. To do that, you need to track the tax on every eligible expense and keep a receipt that meets the CRA's documentation tier for its amount. This guide covers when registration becomes mandatory, the rates you will see on receipts, what each receipt must show, and how often you file. Every rule and figure comes from canada.ca and Guide RC4022, General Information for GST/HST Registrants.",
      },
      {
        type: "h2",
        text: "When Registration Becomes Mandatory",
      },
      {
        type: "p",
        text: "You don't have to register while you are a small supplier. RC4022 defines that as revenue from worldwide taxable supplies, together with your associates', of $30,000 or less in a single calendar quarter and over the last four consecutive calendar quarters. The calculation leaves out sales of goodwill, financial services and sales of capital property. You stop being a small supplier, and must register, once you go over $30,000 in either test. The two tests have different effective dates:",
      },
      {
        type: "ul",
        items: [
          "Over $30,000 in a single calendar quarter: you are a registrant immediately. Your effective date of registration is the day of the sale that took you over the threshold, you must collect GST/HST on that sale, and you must register within 29 days of that day.",
          "Over $30,000 across four consecutive calendar quarters, but not in any one quarter: you are still a small supplier for those quarters and for the month after them. Your effective date is the day of your first sale after you stop being a small supplier, and you have 29 days from that day to register.",
        ],
      },
      {
        type: "p",
        text: "RC4022's own examples show the difference. In the first, a sale on September 23 pushed one quarter's revenue past $30,000, so tax applied to that sale and registration was due by October 22. In the second, four quarters ending March 31, 2025 totalled $32,000 with no single quarter over the threshold. The business stopped being a small supplier at the end of April 2025 and had to start collecting GST/HST in May 2025.",
      },
      {
        type: "h2",
        text: "GST/HST Rates by Province",
      },
      {
        type: "p",
        text: "The rate on a receipt depends on where the supply is made. Current rates, from the CRA's GST/HST rates page:",
      },
      {
        type: "ul",
        items: [
          "13% HST: Ontario",
          "14% HST: Nova Scotia (down from 15% on April 1, 2025)",
          "15% HST: New Brunswick, Newfoundland and Labrador, Prince Edward Island",
          "5% GST: Alberta, British Columbia, Manitoba, Saskatchewan, Quebec, Northwest Territories, Nunavut, Yukon",
          "Provincial sales tax charged separately: British Columbia 7% PST, Manitoba 7% RST, Saskatchewan 6% PST, Quebec 9.975% QST",
        ],
      },
      {
        type: "p",
        text: "Only GST and HST are recovered through ITCs on your GST/HST return. Keep PST and RST separate in your records; they are not part of the GST/HST you can claim back. Quebec's QST is administered by Revenu Québec under its own rules.",
      },
      {
        type: "h2",
        text: "What a Receipt Needs for an ITC",
      },
      {
        type: "p",
        text: "You must have sufficient documentary evidence before you claim an ITC, and what counts depends on the total of the sale:",
      },
      {
        type: "ul",
        items: [
          "Under $100: the supplier's (or intermediary's) business or trading name, the invoice date (or the date GST/HST was paid or payable), and the total amount paid or payable.",
          "$100 to $499.99: all of the above, plus the GST/HST charged (or a statement that the price includes it at the applicable rate), the status of each supply if taxable and exempt items are mixed, and the supplier's or intermediary's GST/HST registration number.",
          "$500 or more: all of the above, plus your name or trading name (or your authorized agent's), a brief description of the goods or services, and the terms of payment.",
        ],
      },
      {
        type: "p",
        text: "These tiers replaced the earlier $30 and $150 thresholds as of April 20, 2021. Hypothetical example: a $240 printer from an Ontario retailer qualifies only if the receipt shows the HST (or says it is included) and the retailer's registration number. You can confirm a number with the CRA's free GST/HST Registry before you claim.",
      },
      {
        type: "callout",
        text: "Meals and entertainment follow the income tax limit. Where the deduction is limited to 50% of the cost, RC4022 says you can claim 50% of the GST/HST you paid on those expenses as ITCs.",
      },
      {
        type: "h2",
        text: "Reporting Periods and Due Dates",
      },
      {
        type: "p",
        text: "The CRA assigns your reporting period from your revenue from taxable supplies. If it is $1,500,000 or less you have an annual period. More than $1,500,000 up to $6,000,000 means quarterly, and more than $6,000,000 means monthly. You can elect to file more often than assigned.",
      },
      {
        type: "ul",
        items: [
          "Annual filers usually file and pay within three months after the end of the fiscal year.",
          "A sole proprietor with an annual reporting period and a calendar fiscal year generally files by June 15 of the following year, but must pay by April 30.",
          "Annual filers whose net tax was $3,000 or more in both the previous and current fiscal year must pay quarterly GST/HST instalments.",
          "ITCs not claimed in the period you incurred them can usually be claimed later. For most registrants the deadline is the due date of the return for the last reporting period ending within four years after the period in which the ITC could first have been claimed.",
        ],
      },
      {
        type: "h2",
        text: "A Tracking Routine That Supports Your Claims",
      },
      {
        type: "ul",
        items: [
          "Record GST/HST, PST and QST as separate amounts on every expense, not one combined tax figure",
          "Check receipts of $100 or more for the supplier's registration number when you file them, while you can still ask for a corrected receipt",
          "Keep receipts for at least six years after the end of the last year they relate to",
          "Before each return, reconcile the ITCs you are claiming against the receipts behind them",
        ],
      },
    ],
  },

  {
    slug: "input-tax-credits-canada-guide",
    title: "Input Tax Credits (ITCs) in Canada: A Freelancer's Guide",
    excerpt:
      "Input tax credits let GST/HST registrants recover the sales tax they pay on business expenses. How ITCs work, what qualifies, and how to claim them.",
    category: "GST / HST",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
          "Software subscriptions where GST/HST was charged by a supplier registered under the normal GST/HST rules, wherever the supplier is based. GST/HST charged by a supplier registered only under the simplified regime for non-resident digital businesses generally can't be claimed as an ITC; give such suppliers your GST/HST number so they don't charge it",
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
    title: "When Must Freelancers Register for GST/HST in Canada?",
    excerpt:
      "The $30,000 threshold, what counts toward it, when the clock starts, and why some freelancers should register voluntarily even before they're required to.",
    category: "GST / HST",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "Register through CRA My Business Account online — you'll typically receive your GST/HST registration number within minutes for online applications, or a few days by mail. If you have to register because you went over the threshold, you must charge GST/HST from your effective date of registration, even if you have not registered yet. RC4022's example: a sale that took one quarter over $30,000 on September 23 had to include GST/HST, and registration was due by October 22.",
      },
    ],
  },

  {
    slug: "pst-qst-freelancers-canada",
    title: "PST and QST for Canadian Freelancers: What You Can Claim",
    excerpt:
      "PST in BC, Manitoba and Saskatchewan and QST in Quebec are often confused with GST/HST, but they follow different rules for self-employed workers.",
    category: "GST / HST",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
          "QST registration is a Quebec rule, administered by Revenu Québec rather than the CRA. Revenu Québec treats you as a small supplier while your worldwide taxable supplies, with your associates', are $30,000 or less in a calendar quarter and over the four preceding quarters; above that, if you carry on business in Québec, you must register for both the GST/HST and the QST",
          "For most businesses based in Québec, Revenu Québec administers the GST as well as the QST, so you can file a combined GST/HST-QST return",
          "QST-registered businesses recover the QST they paid on inputs by claiming input tax refunds (ITRs), alongside ITCs for the GST",
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
    title: "Mileage Deduction for Canadian Freelancers (2026 Guide)",
    excerpt:
      "How self-employed Canadians deduct vehicle costs for 2026: business-use percentage, CRA logbook rules, 2026 limits, and T2125 lines 9281, 9936 and 9943.",
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
    title: "Mileage Tracking for Self-Employed Canadians (2026 Guide)",
    excerpt:
      "The day-to-day habit of mileage tracking for self-employed Canadians: what to log in the moment, GPS vs. manual logging, and keeping a logbook audit-ready.",
    category: "Mileage & Auto",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "Knowing that mileage is deductible is the easy part — the deduction actually falls apart at the tracking stage. Most self-employed drivers who lose a vehicle-expense claim don't lose it because the trip wasn't legitimate business driving; they lose it because the logbook wasn't kept the way the CRA expects. This guide is about the day-to-day habit of tracking, not the deduction rules themselves — for what's deductible, the current expense limits, and the simplified logbook method's math, see our complete mileage deduction guide.",
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
        text: "Manual logging works if you're disciplined about it, but it fails in a predictable way: short trips get skipped in the moment and \"added later from memory,\" which is a weaker record than one kept as you go. The CRA calls an accurate logbook of business travel maintained for the entire year the best evidence of business use. A paper or spreadsheet logbook also can't prove when an entry was actually written, which matters if your claim is ever questioned.",
      },
      {
        type: "p",
        text: "GPS or address-based tracking removes both problems. The app timestamps the entry automatically, calculates the distance for you instead of relying on an odometer estimate, and creates a record at the time of the trip. The tradeoff is that you still have to categorize each trip as business or personal — automation handles the distance and the timestamp, not your judgment about why you made the trip.",
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
        text: "ReceiptOne's Mileage tool is built around that low-friction habit. Log Trip lets you enter a start and end address and it works out the route and distance for you — no odometer math, no estimating. Each trip is saved with its date, and your logged business kilometres add up as you go. Once you enter your odometer total for the year, ReceiptOne divides your business kilometres by it to give your business-use percentage.",
      },
    ],
  },

  {
    slug: "cra-mileage-logbook-requirements",
    title: "CRA Mileage Logbook Requirements: What Every Trip Needs",
    excerpt:
      "What a CRA mileage logbook should record for each business trip, the odometer readings you need, and how to work out your business-use percentage.",
    category: "Mileage & Auto",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "A mileage logbook is your primary evidence for vehicle expense claims. The CRA lists what to record for each business trip: the date, destination, purpose and number of kilometres driven. Here's what every logbook entry needs.",
      },
      {
        type: "h2",
        text: "Required Fields for Every Logbook Entry",
      },
      {
        type: "ul",
        items: [
          "Date of the trip",
          "Destination (city or address) — recording where you started is not on the CRA's list, but it makes each entry easier to verify",
          "Purpose of the trip — specific enough to verify it's a business trip",
          "Kilometres driven for that trip",
          "Odometer reading at the start and end of the year (to determine total kilometres driven)",
        ],
      },
      {
        type: "h2",
        text: "Keep It for the Whole Year",
      },
      {
        type: "p",
        text: "The CRA says the best evidence to support the use of a vehicle is an accurate logbook of business travel maintained for the entire year. It doesn't prescribe a format, but a log kept as you go is easier to show is accurate than one rebuilt at year-end from memory. After one full year of logbook records, you can keep a three-month sample logbook in later years, as long as business use stays within 10% of that base year.",
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
        text: "In ReceiptOne you log a trip by entering its start and end addresses; the app works out the distance and saves the trip with its date and your note on the purpose. Once you enter your odometer total for the year, it divides your business kilometres by that total to give your business-use percentage.",
      },
    ],
  },

  {
    slug: "vehicle-expense-deductions-canada",
    title: "Vehicle Expense Deductions for Self-Employed Canadians",
    excerpt:
      "Every vehicle expense category open to Canadian freelancers and contractors, with the 2026 CRA limits and the documentation each one needs.",
    category: "Mileage & Auto",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
          "Lease payments: deductible leasing costs for a passenger vehicle are capped at $1,100 a month before tax for new leases entered into in 2025 or 2026, worked out in Chart C of Form T2125.",
          "Auto loan interest: for a passenger vehicle, deductible interest is capped at $350 a month for loans entered into in 2025 or 2026, prorated by days ($350 ÷ 30 × days) in Chart B of Form T2125. Interest above the cap is not deductible.",
          "Capital Cost Allowance (CCA): a purchased vehicle goes in Class 10 (30%), or in its own Class 10.1 (30%) if it is a passenger vehicle costing more than the ceiling for its year: $38,000 before tax for vehicles acquired in 2025 and $39,000 for those acquired on or after January 1, 2026. Claim it on line 9936, reduced to your business-use share.",
        ],
      },
      {
        type: "callout",
        text: "Zero-emission vehicles go in Class 54 (30%) or Class 55 (40%). The enhanced first-year CCA has been reinstated for zero-emission vehicles acquired and available for use on or after January 1, 2025: 100% before 2030, 75% in 2030 and 2031, and 55% in 2032 and 2033. The capital cost of a Class 54 zero-emission passenger vehicle is capped at $61,000 before tax.",
      },
    ],
  },

  {
    slug: "mileage-tracking-apps-canada",
    title: "Best Mileage Tracking Apps for Canadian Freelancers (2026)",
    excerpt:
      "What the CRA expects a mileage logbook to show, what to look for in a mileage tracking app, and how to choose the right one for your situation.",
    category: "Mileage & Auto",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "The CRA doesn't prescribe a logbook format, but it calls an accurate logbook of business travel maintained for the entire year the best evidence of business use. For each business trip it lists the date, destination, purpose and kilometres driven, plus odometer readings at the start and end of the year. A paper logbook or spreadsheet can meet that standard; an app's advantage is that it makes recording each trip at the time easier, so there's less to fill in later.",
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
          "Record your odometer readings at the start and end of the year, so total kilometres can be worked out",
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
    title: "Canadian Freelancer Taxes: How to File as Self-Employed",
    excerpt:
      "How Canadian freelancers and contractors file taxes, from reporting income correctly to claiming every deduction you're entitled to.",
    category: "Tax Fundamentals",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "As a self-employed Canadian, you pay both the employee and employer portions of CPP on your net self-employment income. For 2026, that is 11.9% of earnings between the $3,500 basic exemption and the maximum pensionable earnings of $74,600 (a maximum of $8,460.90), plus second additional contributions (CPP2) of 8% on earnings between $74,600 and $85,000 (a maximum of $832). For 2025 the ceilings were $71,300 and $81,200. Half of your base contributions earns a non-refundable tax credit; the other half, plus the first and second additional contributions, is deducted from income.",
      },
      {
        type: "h2",
        text: "Tax Instalment Payments",
      },
      {
        type: "p",
        text: "You have to pay quarterly instalments if your net tax owing is more than $3,000 ($1,800 in Quebec) in the current year and in either of the two previous years. They are due March 15, June 15, September 15, and December 15. Missing instalments triggers interest charges at the prescribed rate. The easiest method: pay one-quarter of your prior year's net tax owing each quarter.",
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
          "June 15 / April 30: GST/HST return and payment for annual filers who are sole proprietors with a calendar fiscal year",
          "End of February (next year): T4A slips from businesses that paid you more than $500 for services in the calendar year (box 048)",
        ],
      },
      {
        type: "h2",
        text: "The Self-Employed Tax Advantage",
      },
      {
        type: "p",
        text: "Despite the extra complexity, self-employed Canadians have access to a broader range of deductions than employees. Home office, vehicle expenses, professional development, business meals, equipment, software, and more — all reduce your taxable income dollar for dollar. Hypothetical example: a freelancer with $80,000 of business income and $20,000 of legitimate expenses has net business income of $60,000, not $80,000. Building a solid expense-tracking system is the single highest-ROI financial habit a freelancer can develop.",
      },
      {
        type: "callout",
        text: "The RRSP advantage: self-employed Canadians have no workplace pension, but RRSP deduction room grows each year by the lesser of 18% of your previous year's earned income and the annual RRSP dollar limit ($33,810 for 2026), less any pension adjustment. Maxing your RRSP is often the largest single deduction available to a high-earning freelancer.",
      },
    ],
  },

  {
    slug: "top-tax-deductions-canadian-self-employed-2025",
    title: "Top Tax Deductions for Self-Employed Canadians (2026)",
    excerpt:
      "The business expenses self-employed Canadians can deduct in 2026, which ones apply to you, and how to claim them correctly to lower your tax bill.",
    category: "Tax Deductions",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
    imageUrl: "https://picsum.photos/seed/top-tax-deductions-canadian-self-employed-2025/600/400",
    imageAlt: "Person working on a laptop with financial documents visible",
    tags: ["deductions", "self-employed", "freelancer", "tax savings", "2026"],
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
        text: "When you work for yourself in Canada, you report your business income and expenses on Form T2125 (Statement of Business or Professional Activities). The CRA allows you to deduct any expense that was incurred to earn business income — as long as it's reasonable in amount and supported by documentation. Here are the most valuable deductions for Canadian freelancers in 2026.",
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
        text: "If you work from home regularly and your home workspace is your principal place of business (or you use it only for the business and regularly meet clients there), you can deduct a proportional share of home expenses. The calculation is based on the percentage of your home used for business — typically square footage of the workspace divided by total square footage. Eligible expenses include rent or mortgage interest, utilities, internet, property taxes, and maintenance costs.",
      },
      {
        type: "h2",
        text: "Technology and Equipment",
      },
      {
        type: "p",
        text: "Computers, phones, cameras, and other equipment used for business can be deducted, but generally through the Capital Cost Allowance (CCA) system rather than as a full immediate deduction. Most computer equipment falls under Class 10 (30% declining balance) or Class 50 (55% declining balance for general-purpose computing equipment). The temporary immediate expensing incentive (up to $1.5 million a year) applied to unincorporated businesses only for eligible property acquired after 2021 that became available for use before 2025, so it does not cover equipment you put into use in 2025 or later.",
      },
      {
        type: "callout",
        text: "For 2026, the federal basic personal amount is $16,452 if your net income is $181,440 or less. It is a non-refundable credit that applies to everyone; your business expenses are deducted separately, in calculating your net business income on Form T2125.",
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
          "Keep your phone bills for six years from the end of the tax year they relate to, so you can show how you worked out the business share",
        ],
      },
    ],
  },

  {
    slug: "home-office-deduction-canadian-freelancers",
    title: "Home Office Deduction: What Canadian Freelancers Can Claim",
    excerpt:
      "The home office deduction is widely misunderstood: some freelancers claim too little, others claim what they can't. Here's the accurate 2026 breakdown.",
    category: "Tax Deductions",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "The home office deduction (technically called 'workspace in the home expenses' on Form T2125) allows self-employed Canadians to deduct a proportional share of their home costs when part of their home is their principal place of business, or is used only for the business and regularly to meet clients. Unlike employees who briefly used a flat-rate method during the pandemic, self-employed individuals have always used the detailed method — and it's more generous than most people realize.",
      },
      {
        type: "h2",
        text: "Eligibility: When Can You Claim?",
      },
      {
        type: "p",
        text: "To claim home office expenses as a self-employed individual, your home workspace must meet at least one of two conditions: it is your principal place of business, OR you use the space only to earn your business income and on a regular and ongoing basis to meet clients, customers, or patients. The CRA doesn't set an hours test for 'principal'; its folio on business-use-of-home expenses says the word is generally understood to mean your chief or main place of business, and that a workspace that meets this condition doesn't have to be used only for the business. Meeting either condition qualifies you — you don't need to meet both.",
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
    title: "Form T2125 Explained: Line-by-Line Guide (2026)",
    excerpt:
      "A line-by-line guide to CRA Form T2125 for 2026: income, cost of goods sold, each expense line, business-use-of-home, CCA and the vehicle charts.",
    category: "Tax Fundamentals",
    publishedAt: "2026-10-05",
    updatedAt: "2026-10-05",
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
        text: "Form T2125, Statement of Business or Professional Activities, is the CRA form where you work out your self-employment business, professional or commission income and the expenses you deduct from it. You file it with your income tax return if you are a sole proprietor or a partner in a business or professional partnership, and you use a separate T2125 for each business.",
      },
      {
        type: "p",
        text: "Farmers use Form T2042 and fishers use Form T2121 instead. Corporations and trusts use none of them. Line numbers, rules and dollar figures below come from canada.ca: Guide T4002, the form itself and Finance Canada's 2026 automobile limits. The sources are listed at the end. Examples are hypothetical.",
      },
      {
        type: "callout",
        text: "As of October 5, 2026, the newest T2125 and Guide T4002 on canada.ca are the 2025 editions. The 2026 versions are not published yet, so every line number below is from the 2025 form. Check the 2026 form before you file.",
      },
      {
        type: "h2",
        text: "Part 1: Identification",
      },
      {
        type: "p",
        text: "Part 1 asks for your name and SIN, plus your business name, number and address. It also asks for your fiscal period, whether this was your last year of business, and your main product or service. Most self-employed individuals must use a December 31 year-end. If you are eligible for a different year-end, you also file Form T1139.",
      },
      {
        type: "ul",
        items: [
          "Industry code: the six-digit NAICS Canada 2022 code for your main activity. If you file electronically, use the codes in your tax software.",
          "Accounting method: on the form this applies to commission income only. T4002 lets farmers, fishers and self-employed commission agents use the cash method. All other self-employment income must use the accrual method, which reports income when it is earned and expenses when they are incurred.",
          "Partners: enter your partnership percentage and the partnership's business number.",
        ],
      },
      {
        type: "p",
        text: "Part 2 asks how many web pages and websites you earn income from, including third-party platforms, and what share of your gross income they produce.",
      },
      {
        type: "h2",
        text: "Part 3: Income (Lines 8000, 8290, 8230, 8299)",
      },
      {
        type: "p",
        text: "Use Part 3A for business income, which includes commission income, and Part 3B for professional income. If you have both, fill in a separate form for each. Amount 3A is gross sales, including GST/HST collected or collectible. Amount 3B takes out the GST/HST, PST, returns, allowances and discounts. Quick-method GST/HST filers adjust the total at amounts 3D to 3F. In Part 3B, professionals also include work in progress in their fees.",
      },
      {
        type: "ul",
        items: [
          "Line 8000 – Adjusted gross sales (amount 3G) or adjusted professional fees (amount 3N).",
          "Line 8290 – Reserves deducted last year, added back to this year's income.",
          "Line 8230 – Other income, such as recovered bad debts, prizes earned through the business, and grants you cannot apply against a specific expense or asset. Quick-method filers report the 1% credit (maximum $300) here.",
          "Line 8299 – Gross income: line 8000 plus lines 8290 and 8230. It goes on line 13499, 13699 or 13899 of your return.",
        ],
      },
      {
        type: "h2",
        text: "Part 3D: Cost of Goods Sold and Gross Profit",
      },
      {
        type: "p",
        text: "On the form, cost of goods sold is Part 3D, not Part 4. Fill it in only if you buy goods to resell or make goods to sell. Enter opening inventory on line 8300, which must equal last year's closing inventory. Purchases go on line 8320, net of discounts and including freight, minus anything you took for personal use. Then come direct wage costs (8340), subcontracts (8360) and other costs (8450). Closing inventory goes on line 8500. Value it either all at fair market value or at the lower of cost and fair market value, and use the same method every year. Line 8518 is cost of goods sold and line 8519 is gross profit.",
      },
      {
        type: "h2",
        text: "Part 4: Expenses, Line by Line",
      },
      {
        type: "p",
        text: "Part 4 starts from line 8299, or from line 8519 if you sell goods. Three rules apply to every line. Enter only the business part. Don't deduct capital purchases here, because they go through capital cost allowance (CCA). If you claim input tax credits, leave out the GST/HST you recover.",
      },
      {
        type: "p",
        text: "Line 8521 – Advertising: ads in Canadian media, plus finder's fees. Canadian content or ownership rules apply, but not to ads on foreign websites. An ad in a periodical aimed at Canadians is fully deductible if at least 80% of the issue's non-advertising content is original editorial, and 50% deductible otherwise.",
      },
      {
        type: "p",
        text: "Line 8523 – Meals and entertainment: you can claim at most 50% of the lesser of the amount you spent and a reasonable amount, and you enter only that allowable part. The limit does not apply to meals you bill to a client and show on the invoice, or to up to six all-employee events a year. Long-haul truck drivers can deduct 80% of food and drink during eligible travel.",
      },
      {
        type: "callout",
        text: "Hypothetical example: you spend $800 on reasonable client meals during 2026 and don't bill them back. You enter $400 on line 8523.",
      },
      {
        type: "p",
        text: "Line 8690 – Insurance: commercial premiums on business buildings, machinery and equipment. Vehicle insurance goes in Chart A and home insurance goes in Part 7. Life insurance premiums are generally not deductible.",
      },
      {
        type: "p",
        text: "Line 8710 – Interest and bank charges: interest on money borrowed for the business. Fees to get a loan to buy or improve business property are deducted at 20% a year over five years. Vehicle loan interest goes in Chart A, and mortgage interest on a home workspace goes in Part 7.",
      },
      {
        type: "p",
        text: "Line 8760 – Business taxes, licences and memberships: annual licence fees, some business taxes, trade association dues and subscriptions to publications. Dues for clubs whose main purpose is dining, recreation or sport are not deductible.",
      },
      {
        type: "p",
        text: "Line 8810 – Office expenses: small items such as pens, stationery and stamps. A desk, chair or filing cabinet is a capital item and goes through CCA. Supplies you use to deliver your service go on line 8811.",
      },
      {
        type: "p",
        text: "Line 8860 – Professional fees: outside advice, accounting and legal fees, and the cost of preparing your income tax and GST/HST returns. Legal fees for buying capital property are added to its cost.",
      },
      {
        type: "p",
        text: "Line 9060 – Salaries, wages and benefits: employees' pay and your employer share of CPP or QPP contributions, EI premiums and workers' compensation. A salary to your child or spouse is deductible if the work is necessary, the pay is reasonable and you actually pay it. Your own drawings are not deductible.",
      },
      {
        type: "p",
        text: "Line 9180 – Property taxes: for land and buildings where the business is located. Tax on a home workspace goes in Part 7.",
      },
      {
        type: "p",
        text: "Line 9200 – Travel expenses: transportation fares, hotels and meals on business travel. The 50% meal limit generally still applies.",
      },
      {
        type: "p",
        text: "Line 9220 – Utilities: telephone, gas, electricity, water and cable used to earn income, plus the business share of cellphone airtime. You can't deduct the basic monthly rate of your home phone, but you can deduct business long-distance calls or a separate business line. Home utilities go in Part 7.",
      },
      {
        type: "p",
        text: "Line 9224 – Fuel costs (except for motor vehicles): fuel and lubricants for business equipment. Vehicle fuel goes in Chart A.",
      },
      {
        type: "p",
        text: "Line 9281 – Motor vehicle expenses: amount 16 from Chart A. Line 9936 – CCA: amount ii from Area A, minus personal use and any CCA you claim in Part 7.",
      },
      {
        type: "p",
        text: "Line 9270 – Other expenses: anything not covered by an earlier line, listed on the form. Examples include leases on business property, up to two conventions a year and disability-related building modifications. If a convention fee includes meals that aren't broken out, treat $50 a day as a meal, so the 50% limit applies to it.",
      },
      {
        type: "p",
        text: "Part 4 also has lines for bad debts (8590), management fees (8871), rent (8910), repairs (8960) and delivery (9275). Line 9368 totals the expenses, and line 9369 is net income before adjustments.",
      },
      {
        type: "callout",
        text: "ReceiptOne's year-end export gives you a PDF or CSV of your organized records: expenses grouped by category, GST/HST totals by type, and a mileage summary. You or your accountant use it to fill in Part 4. It does not cover your income, and ReceiptOne does not prepare or file T2125.",
      },
      {
        type: "h2",
        text: "Part 5: Net Income, Including Line 9945",
      },
      {
        type: "p",
        text: "Line 9945 is not a Part 4 expense line. Part 5 starts from your share of line 9369 (amount 5A). Partners may add amount 5B and line 9974 and subtract their own deductible amounts on line 9943. The result is net income after adjustments (amount 5D). Business-use-of-home from Part 7 comes off on line 9945. The result is line 9946, your net income, which goes on line 13500, 13700 or 13900 of your return.",
      },
      {
        type: "h2",
        text: "Part 7: Business-Use-of-Home, Loss Rule and Carry-Forward",
      },
      {
        type: "p",
        text: "You can claim a home workspace if it is your principal place of business. You can also claim it if you use it only for the business and regularly meet clients there. Split the costs on a reasonable basis, usually floor area. If you also live in the room, adjust for the hours it is used for business. Renters claim part of their rent. Owners can claim part of their mortgage interest (not principal), property taxes and CCA. T4002 warns that claiming CCA on your home brings the capital gains and recapture rules into play when you sell.",
      },
      {
        type: "p",
        text: "Amounts 7A to 7G list heat, electricity, insurance, maintenance, mortgage interest, property taxes and other costs. Amount 7I removes the personal part, 7K adds business CCA and 7L brings in last year's carry-forward. Amount 7N is your net income after adjustments, or 0 if it is negative. The claim (7P) is the lesser of 7M and 7N, so home costs cannot create or increase a business loss. The unused amount (7O) carries forward to next year.",
      },
      {
        type: "table",
        caption: "Hypothetical example: a workspace covering 12.5% of the home, in a low-income year.",
        headers: ["Amount", "What it holds", "Value"],
        rows: [
          ["7A–7G", "Total home costs", "$16,800"],
          ["7I", "Personal part (87.5%)", "$14,700"],
          ["7M", "Business part plus carry-forward ($0)", "$2,100"],
          ["7N", "Net income after adjustments", "$1,500"],
          ["7P", "Claim on line 9945 (lesser of 7M and 7N)", "$1,500"],
          ["7O", "Carried forward to 2027", "$600"],
        ],
      },
      {
        type: "h2",
        text: "Areas A–C: Capital Cost Allowance",
      },
      {
        type: "p",
        text: "Use Area B for equipment (including vehicles) and Area C for buildings you bought or improved in the year. Their totals feed column 3 of Area A, where you calculate CCA by class. Areas D and E record disposals and Area F records land, which gets no CCA. Fill in the areas even if you don't claim CCA.",
      },
      {
        type: "ul",
        items: [
          "Half-year rule: in the year you add property, CCA is generally limited to half the net addition. Most small tools in Class 12 are exempt.",
          "Classes: Class 8 (20%) for furniture and equipment, Class 10 (30%) for vehicles, Class 10.1 (30%) for passenger vehicles over the cost ceiling, Class 12 (100%) for tools under $500, and Class 50 (55%) for computers.",
          "Under proposed changes, Class 50 property bought after April 15, 2024 and available for use before 2027 gets a 100% first-year deduction.",
          "Immediate expensing for individuals covered property available for use before 2025, so it does not apply in 2026.",
          "You can claim any amount from zero up to the maximum. Prorate the claim if your fiscal period is shorter than 365 days.",
        ],
      },
      {
        type: "h2",
        text: "Charts A–C: Motor Vehicle Expenses",
      },
      {
        type: "p",
        text: "In Chart A, enter business and total kilometres and the year's fuel, interest, insurance, licence, repairs, leasing and EV electricity costs. Multiply the total by business kilometres divided by total kilometres. Then add business parking and supplementary business insurance in full, and the result goes on line 9281. CCA on the vehicle goes through Areas B and A instead.",
      },
      {
        type: "callout",
        text: "Hypothetical example: 8,000 business km out of 20,000 total is 40%. Of $6,000 in operating costs, 40% is $2,400. Add $150 of business parking, and line 9281 is $2,550.",
      },
      {
        type: "p",
        text: "Chart B caps passenger-vehicle loan interest at $350 a month for vehicles bought after 2023. Chart C caps lease costs. For 2026, Finance Canada raised the Class 10.1 ceiling to $39,000 before tax for vehicles bought on or after January 1, 2026. The zero-emission passenger vehicle ceiling stays at $61,000, leasing at $1,100 a month and interest at $350 a month. Keep a logbook with each trip's date, destination, purpose and kilometres, plus odometer readings at the start and end of the year.",
      },
      {
        type: "h2",
        text: "Common Mistakes",
      },
      {
        type: "ul",
        items: [
          "Putting home rent, utilities or property tax on lines 8910, 9220 or 9180 instead of Part 7.",
          "Entering the full cost of meals instead of the 50% allowable part.",
          "Expensing a computer or desk on line 8810 instead of claiming CCA.",
          "Leaving GST/HST in expenses after claiming it back as input tax credits.",
          "Using home costs to create a loss, or forgetting to carry amount 7O forward.",
          "Deducting your own drawings on line 9060.",
          "Claiming vehicle costs without a logbook.",
        ],
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "p",
        text: "Is the 2026 Form T2125 available yet? Not as of October 5, 2026. The newest form and Guide T4002 on canada.ca are the 2025 editions.",
      },
      {
        type: "p",
        text: "When is my 2026 T2125 due? It goes in with your return. For 2025 returns, T4002 sets a June 15, 2026 filing date for self-employed people, with any balance owing due April 30. The same rule points to June 15, 2027 for 2026 returns, but confirm it in the 2026 guide.",
      },
      {
        type: "p",
        text: "Do I need a separate T2125 for each business? Yes. You also need separate forms if you have both business and professional income.",
      },
      {
        type: "p",
        text: "Can I ever deduct 100% of a meal? Yes, in some cases, such as meals you bill to a client and show on the invoice, or up to six all-employee events a year.",
      },
      {
        type: "p",
        text: "What happens to home office costs I can't deduct this year? They carry forward as amount 7O. You can claim them in a later year when your business income is high enough, as long as you still meet one of the workspace conditions.",
      },
      {
        type: "p",
        text: "Where does depreciation on my car go? Add the car in Area B, calculate CCA in Area A and claim it on line 9936. Chart A covers operating costs only.",
      },
      {
        type: "h2",
        text: "Sources",
      },
      {
        type: "p",
        text: "Read on October 5, 2026: Guide T4002, 2025 edition (canada.ca/en/revenue-agency/services/forms-publications/publications/t4002.html); Form T2125, 2025 (canada.ca/en/revenue-agency/services/forms-publications/forms/t2125.html); Finance Canada, 2026 automobile deduction limits, January 14, 2026 (canada.ca/en/department-finance/news/2026/01/government-announces-the-2026-automobile-deduction-limits-and-expense-benefit-rates-for-businesses.html). This is general information, not tax advice.",
      },
    ],
  },

  {
    slug: "tax-instalment-payments-canada-self-employed",
    title: "Tax Instalments for Self-Employed Canadians: How They Work",
    excerpt:
      "If your net tax owing is over $3,000 this year and in either of the two previous years, the CRA requires quarterly instalments. Here's how they work.",
    category: "Tax Fundamentals",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "The CRA requires quarterly instalment payments if your net tax owing (federal + provincial, after credits) is more than $3,000 in the current year AND was also more than $3,000 in either of the two preceding years. If this year's net tax owing will be $3,000 or less, you don't have to pay instalments, even if the CRA sends you reminders. In Quebec, the threshold is $1,800. The due dates are: March 15, June 15, September 15, and December 15.",
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
          "No-calculation method: pay the amounts on the instalment reminders the CRA sends you, which it works out from your latest assessed return",
        ],
      },
      {
        type: "callout",
        text: "If you have a strong quarter, pay more than your minimum instalment. The CRA calculates interest on the shortfall daily — overpaying early costs nothing, while underpaying costs you the prescribed rate on the shortfall. The rate is set every quarter; for October 1 to December 31, 2026 it is 7% on overdue taxes.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 6 — COMPARISONS
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "receipt-scanner-apps-canada-comparison",
    title: "Best Receipt Scanner Apps in Canada (2026): Prices Compared",
    excerpt:
      "Six receipt apps compared for self-employed Canadians in 2026: prices, free tiers, GST/HST/PST capture, mileage and CRA-ready exports.",
    category: "Tools & Apps",
    publishedAt: "2026-10-05",
    updatedAt: "2026-10-05",
    imageUrl: "https://picsum.photos/seed/receipt-scanner-apps-canada-comparison/600/400",
    imageAlt: "Comparison of receipt scanning apps on smartphone for Canadian freelancers",
    tags: [
      "receipt scanner",
      "app comparison",
      "GST/HST",
      "mileage",
      "T2125",
      "expense tracking",
      "Canada",
    ],
    relatedSlugs: [
      "quickbooks-vs-receiptone-canada",
      "expense-tracking-canada-freelancers",
      "excel-vs-expense-app-canada",
    ],
    body: [
      {
        type: "p",
        text: "If you are self-employed in Canada, a receipt app has three jobs: keep a readable copy of every receipt for the CRA, pull out the sales tax so you can claim GST/HST input tax credits, and give you totals you can carry to Form T2125 at tax time. A mileage log and a way to get records to your accountant are close behind. This comparison looks at six apps that sell to Canadians against those jobs.",
      },
      {
        type: "p",
        text: "We make ReceiptOne, which is one of the six. To keep this fair, every price and feature below comes from each vendor's own pricing or feature pages, read on October 5, 2026. Where a vendor does not publish something, the table says \"not stated\" rather than guessing. That does not mean the app lacks the feature, only that we could not confirm it from the vendor. Prices change often, so check the vendor's page before you buy.",
      },
      {
        type: "h2",
        text: "The Comparison at a Glance",
      },
      {
        type: "table",
        caption:
          "Prices and features as published by each vendor on October 5, 2026, before sales tax. CA$ means the vendor lists the price in Canadian dollars; US$ means it lists US dollars.",
        headers: [
          "App",
          "Price",
          "Free tier",
          "GST/HST/PST capture",
          "Mileage",
          "T2125 or CRA-ready export",
          "Platforms",
        ],
        rows: [
          [
            "SparkReceipt",
            "Pro CA$9.90/mo or CA$99/yr (50 documents a month); Elite CA$17.90/mo or CA$179/yr",
            "No; 7-day free trial",
            "Yes: extracts GST, HST and PST from each receipt",
            "Yes: GPS or manual trips",
            "Says tax amounts are kept in reports \"ready for Input Tax Credit claims or your T2125\"; PDF, Excel, CSV exports",
            "iOS, Android, web",
          ],
          [
            "Foreceipt",
            "Individual US$6.25/mo, or US$5/mo billed yearly (200 receipts a month); Business US$15/mo, or US$12/mo billed yearly",
            "Yes: up to 100 receipts, kept 12 months, 10 reports",
            "Yes: GST, PST, QST and HST tracked separately once enabled in settings",
            "Not stated",
            "Canadian expense categories for the year-end summary; Excel and PDF reports",
            "iOS, Android, web",
          ],
          [
            "Expensify",
            "Free for individuals; Collect plan $5 per member per month (no currency shown; CAD price not stated)",
            "Yes, for individuals; monthly scan limit not stated on the pages we read",
            "Not stated",
            "Yes: distance tracking (method not stated)",
            "Not stated",
            "iOS, Android, web",
          ],
          [
            "QuickBooks Lite",
            "$20/mo on Intuit's Canadian site, with a promo from $2/mo (promo length not stated)",
            "No; 30-day free trial",
            "Yes: tracks GST, HST and PST",
            "Yes: automatic kilometre tracking",
            "Tax summary, tax detail, mileage log and receipt summary reports; T2125 export not stated",
            "Web and mobile app",
          ],
          [
            "Wave",
            "Starter free; Receipts CA$11/mo or CA$96/yr; Pro CA$25/mo or CA$250/yr with unlimited receipts",
            "Starter is free, but receipt capture is a paid add-on",
            "Not stated for receipts",
            "Not stated",
            "Not stated",
            "iOS, Android, web",
          ],
          [
            "ReceiptOne",
            "CA$4.99/wk, CA$9.99/mo or CA$129.99/yr; unlimited receipts",
            "No; 7-day free trial",
            "Yes: labels each tax line GST, HST, PST or QST; editable",
            "Manual: enter start and end addresses, distance calculated; no automatic trip detection",
            "PDF and CSV reports, including a T2125 report",
            "iOS, Android, web",
          ],
        ],
      },
      {
        type: "p",
        text: "Two things the table cannot show. First, \"GST/HST/PST capture\" means the vendor says it records the tax lines separately; none of these apps can tell you whether a purchase qualifies for an input tax credit, and none checks the supplier's GST/HST registration number for you. Second, the CRA does not certify receipt apps. \"CRA-ready\" is a vendor's description of its reports, not an approval.",
      },
      {
        type: "h2",
        text: "SparkReceipt",
      },
      {
        type: "p",
        text: "SparkReceipt publishes a Canadian pricing page in Canadian dollars and states that it extracts GST, HST and PST from receipts, keeping the amounts in reports for input tax credits and T2125. Both plans also include automatic import from a connected email inbox, a live bank feed, bank statement matching, and a mileage tracker that records trips by GPS or by hand.",
      },
      {
        type: "p",
        text: "Who it suits: a sole proprietor who gets many receipts by email and wants them pulled in without forwarding each one. Where it falls short: the Pro plan caps you at 50 documents a month, receipts and invoices together, so a busy month pushes you to Elite at CA$179 a year. There is no free tier, only a 7-day trial, and the Schedule C export on its US page is a US tax form, not a Canadian one.",
      },
      {
        type: "h2",
        text: "Foreceipt",
      },
      {
        type: "p",
        text: "Foreceipt has a free plan for receipt scanning: up to 100 receipts, kept for 12 months. Its FAQ says Canadian users can track GST, PST, QST and HST separately on each receipt after turning on sub-taxes in settings, and its expense categories are set up for both Canada and the US. Receipts can come in by phone, by a personal forwarding email address, or through the web portal, and bank transactions can be imported from CSV or PDF statements.",
      },
      {
        type: "p",
        text: "Who it suits: someone with a modest number of receipts who wants to try a Canadian-aware app before paying. Where it falls short: prices are in US dollars, so what you pay moves with the exchange rate. The free plan only keeps receipts for 12 months, far short of the six years the CRA generally expects, so it is a trial rather than a long-term record. Its pages do not mention mileage tracking.",
      },
      {
        type: "h2",
        text: "Expensify",
      },
      {
        type: "p",
        text: "Expensify is built around teams: approvals, reimbursements, company cards and accounting sync. For a solo user, its self-employed page says it is free for individuals and freelancers, with SmartScan receipt scanning, distance tracking and expense reports. You can snap a receipt in the app or email it to receipts@expensify.com.",
      },
      {
        type: "p",
        text: "Who it suits: a freelancer who already uses Expensify with a client, or who expects to hire and wants room to grow. Where it falls short for Canadians: the pages we read say nothing about GST/HST/PST capture or a T2125 export, the self-employed page cites IRS rules, and text-message receipt capture is limited to US numbers. Its plan price appears with a dollar sign but no currency, and we could not find a published CAD price.",
      },
      {
        type: "h2",
        text: "QuickBooks Lite",
      },
      {
        type: "p",
        text: "QuickBooks Lite is a one-user plan on Intuit's Canadian site. Its page lists automatic GST, HST and PST tracking, automatic kilometre tracking, receipt photos matched to bank transactions, up to two bank connections, invoicing, and five report templates, among them a tax summary, a mileage log and a receipt summary. It also has a built-in tax centre with workpapers you can share.",
      },
      {
        type: "p",
        text: "Who it suits: a freelancer who invoices clients and wants bank feeds, automatic mileage and sales tax in one bookkeeping tool. Where it falls short: Lite is limited to one user with no accountant access, which matters if someone else does your books. The pricing page shows $20 a month with a $2 promotional price, but we could not see how long the promotion lasts, so budget for the regular price. It is accounting software first, so it asks more of you than a scan-and-file app.",
      },
      {
        type: "h2",
        text: "Wave",
      },
      {
        type: "p",
        text: "Wave's Starter plan is free and covers invoicing, estimates and bookkeeping records. Receipt capture is not part of it: Wave sells receipts as an add-on at CA$11 a month or CA$96 a year, or includes unlimited receipts in its Pro plan at CA$25 a month or CA$250 a year, which also adds automatic bank import and categorization. You can scan with the iOS or Android app or forward receipts to your Wave email address.",
      },
      {
        type: "p",
        text: "Who it suits: a freelancer who already invoices through Wave and wants receipts in the same books. Where it falls short: its receipts page does not say whether it separates GST/HST from PST on a scanned receipt, and we found no mileage tracking or T2125 report on the pages we read. If receipts are all you need, the add-on costs more per month than several dedicated apps.",
      },
      {
        type: "h2",
        text: "ReceiptOne",
      },
      {
        type: "p",
        text: "ReceiptOne reads the merchant, date, total and tax lines from a receipt photo or PDF, labels each tax line GST, HST, PST or QST, and splits the tax by your province's rates when a receipt shows only a total. You can correct anything it reads wrongly. Mileage, home office and receipts sit in one app, and exports come as PDF or CSV, including a T2125 report. Receipt scanning is unlimited on every plan.",
      },
      {
        type: "p",
        text: "Who it suits: a sole proprietor who mainly needs receipts, sales tax and a mileage log in shape for T2125 and for their accountant. Where it falls short, and this matters: there is no automatic trip detection, so you log each trip by entering its start and end addresses. There is no bank sync, so it will not match receipts to card transactions. Email forwarding is not available yet; receipts come in by camera, photo upload, or our Telegram bot. There is no free plan, only a 7-day trial.",
      },
      {
        type: "h2",
        text: "How to Choose",
      },
      {
        type: "p",
        text: "Start from where your receipts come from and what you hand over at tax time, not from the feature list.",
      },
      {
        type: "ul",
        items: [
          "Mostly paper receipts and you file T2125 yourself or through an accountant: a dedicated scanner that separates GST/HST from PST and exports a report is enough. SparkReceipt, Foreceipt and ReceiptOne all state Canadian tax capture.",
          "Most receipts arrive by email: pick an app that imports from your inbox or gives you a forwarding address. SparkReceipt connects an inbox; Foreceipt, Expensify and Wave publish forwarding addresses. ReceiptOne does not offer this yet.",
          "You drive a lot for work: automatic tracking saves you remembering to log each trip. SparkReceipt (GPS) and QuickBooks Lite (automatic) say they record trips for you; ReceiptOne needs each trip entered.",
          "You invoice clients and want bank feeds: QuickBooks Lite or Wave Pro do bookkeeping as well as receipts, at a higher price and with more to learn.",
          "You want to try before paying: Foreceipt and Expensify have free plans, and Wave's free plan works for invoicing. Check how long a free plan keeps your receipts against the CRA's six-year rule.",
          "You pay in Canadian dollars: SparkReceipt, Wave, QuickBooks and ReceiptOne publish Canadian prices; Foreceipt prices in US dollars.",
        ],
      },
      {
        type: "p",
        text: "A hypothetical example: a photographer in Ontario with a few dozen paper receipts a month and regular drives to shoots. Their must-haves are HST capture and a mileage log. If they would rather not log trips by hand, SparkReceipt or QuickBooks Lite fits better than ReceiptOne. If they mostly want receipts and HST organised for their accountant, with a short weekly habit of entering trips, a dedicated scanner such as ReceiptOne or Foreceipt costs less and asks less of them.",
      },
      {
        type: "p",
        text: "Whichever app you choose, three checks apply. Make sure you can export your receipt images and data, because the records are yours and the CRA can ask for them for six years. Check the tax amounts the app reads against the receipt, especially on receipts of $100 or more where the supplier's GST/HST number matters for your input tax credit. And keep a copy of your year-end export somewhere you control.",
      },
      {
        type: "callout",
        text: "Sources: vendor pages read on October 5, 2026 — sparkreceipt.com/en-ca/pricing, foreceipt.com/pricing and foreceipt.com/faq, use.expensify.com/self-employed-expense-tracking, quickbooks.intuit.com/ca/pricing and quickbooks.intuit.com/ca/online/lite, waveapps.com/pricing and waveapps.com/receipts. ReceiptOne details are from our own pricing and help pages. Tell us if a vendor has changed something and we'll update this page.",
      },
    ],
  },

  {
    slug: "quickbooks-vs-receiptone-canada",
    title: "QuickBooks vs ReceiptOne for Canadian Freelancers (2026)",
    excerpt:
      "QuickBooks and ReceiptOne solve different problems. Here's an honest look at when each tool makes sense for self-employed Canadians.",
    category: "Tools & Apps",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "QuickBooks and ReceiptOne are both used by Canadian freelancers for expense tracking — but they're optimized for different use cases. Intuit says QuickBooks Self-Employed is still supported in Canada, but its newest plan for the self-employed is QuickBooks Lite, launched in July 2026. QuickBooks is a full accounting platform; ReceiptOne is a focused receipt and expense capture tool. The best choice depends on your business complexity and what you actually need day-to-day.",
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
          "Canadian freelancers who want each receipt's GST, HST, PST or QST read and labelled separately, with the option to correct it",
          "Users who want mileage tracking and receipt scanning in one place",
          "Freelancers with simpler finances who find full accounting software overkill",
        ],
      },
      {
        type: "callout",
        text: "You can also use both: ReceiptOne for day-to-day receipt capture and mileage logging, with an annual CSV export that their accountant imports into their preferred accounting system at year-end. This gives you the best capture experience without paying for accounting features you don't need.",
      },
    ],
  },

  {
    slug: "manual-vs-automated-expense-tracking-canada",
    regions: ["all"],
    title: "Manual vs. Automated Expense Tracking in Canada",
    excerpt:
      "Spreadsheets are free. Automated apps cost money. Here's when the manual approach is good enough — and when automation pays for itself.",
    category: "Tools & Apps",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
          "A small number of business expenses each month, so entering them by hand stays manageable",
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
          "A high volume of receipts — scanning reads the merchant, date, amount and tax for you instead of you typing each one",
          "Significant mileage claims — the CRA accepts any accurate logbook, paper or electronic, but an app makes it easier to record every trip as it happens",
          "Multiple projects or clients requiring separate expense tracking",
          "You've ever lost a receipt or missed a deduction because of poor organization",
        ],
      },
      {
        type: "callout",
        text: "The hidden cost of manual tracking isn't the time — it's the missed deductions. Income you could have offset with a deduction is taxed at your marginal rate instead. As an illustration only: at a combined federal and provincial marginal rate of 30%, $5,000 of unclaimed expenses would mean about $1,500 more income tax, before any extra CPP contributions on the higher net income. Your own rate depends on your income and province.",
      },
    ],
  },

  {
    slug: "excel-vs-expense-app-canada",
    regions: ["all"],
    title: "Excel vs. Expense Tracking App for Canadian Freelancers",
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
    updatedAt: "2026-10-05",
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
        text: "The freelancers who dread tax season are the ones who treat it as a once-a-year event. Those who keep their records up as they go have far less to do at filing time. Here's a simple weekly, monthly and quarterly routine.",
      },
      {
        type: "h2",
        text: "Weekly",
      },
      {
        type: "ul",
        items: [
          "Photograph any paper receipts from the week — they go into your expense app or designated folder immediately",
          "Forward any email receipts to your designated expense email or save as PDF",
          "Log any business trips from the week that you haven't recorded yet",
        ],
      },
      {
        type: "h2",
        text: "Monthly",
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
        text: "Quarterly",
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
        text: "The year-end benefit: when receipts, mileage and reconciliations are kept up month by month, preparing your filing information is a review of records you already have, not a reconstruction from bank statements and memory.",
      },
    ],
  },

  {
    slug: "freelancer-tax-mistakes-canada",
    title: "7 Common Tax Mistakes Canadian Freelancers Make",
    excerpt:
      "Seven mistakes that cost Canadian freelancers money through missed deductions, CRA interest charges and denied claims, and how to avoid each one.",
    category: "Tax Strategy",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
        text: "Most of the mistakes below have nothing to do with fraud. They come from misreading a rule or not keeping the record that proves a claim. Here are seven that cost self-employed Canadians money, with the CRA rule behind each one.",
      },
      {
        type: "h2",
        text: "1. Deducting 100% of Meals and Entertainment",
      },
      {
        type: "p",
        text: "The deduction for food, beverages and entertainment is generally limited to 50% of the lesser of what you spent and an amount that is reasonable in the circumstances, even when the meal was entirely for business. Guide T4002 lists exceptions, such as meals you bill to a client and show on the invoice.",
      },
      {
        type: "h2",
        text: "2. Not Keeping Contemporaneous Mileage Records",
      },
      {
        type: "p",
        text: "Reconstructing a mileage logbook from memory or calendar entries at year-end is not a contemporaneous record. The CRA calls an accurate logbook kept for the entire year the best evidence of business use, and it can disallow expenses you cannot support. Record each trip as you make it.",
      },
      {
        type: "h2",
        text: "3. Missing the Tax Instalment Deadlines",
      },
      {
        type: "p",
        text: "If your net tax owing is more than $3,000 ($1,800 in Quebec) this year and in either of the two previous years, quarterly instalments are required. Late or missed instalments are charged interest at the prescribed rate, which is set every quarter; for October 1 to December 31, 2026 it is 7%. The CRA sends instalment reminders, but you're responsible for paying whether or not the reminder arrives.",
      },
      {
        type: "h2",
        text: "More Common Mistakes",
      },
      {
        type: "ul",
        items: [
          "Claiming personal expenses as business (e.g., gym membership without a demonstrable business necessity)",
          "Counting the GST/HST you collected as business income: on Form T2125 you include it in gross sales at amount 3A, then subtract it at amount 3B (the Quick Method works differently)",
          "Claiming home office expenses that exceed net business income (not allowed — they carry forward)",
          "Missing the GST/HST registration point: once your taxable revenue goes over $30,000 in one calendar quarter or over four consecutive quarters, you must charge GST/HST from your effective date of registration, even before you have registered",
        ],
      },
    ],
  },

  {
    slug: "tax-season-stress-freelancers-canada",
    title: "Stress-Free Tax Season: A Canadian Year-End Checklist",
    excerpt:
      "A year-end checklist that gets Canadian freelancers ready to file: receipts, income summaries, GST/HST, CPP, and what to hand off to your accountant.",
    category: "Tax Strategy",
    publishedAt: "2026-05-10",
    updatedAt: "2026-10-05",
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
          "T4A slips from businesses that paid you more than $500 for services in the year (box 048) — check them against your invoices",
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
          "Confirm your GST/HST return is filed: annual filers who are sole proprietors with a calendar fiscal year generally file by June 15 and pay by April 30; quarterly filers file one month after each quarter",
        ],
      },
      {
        type: "callout",
        text: "ReceiptOne's year-end export gives you a PDF or CSV of your organized records: expenses grouped by category, GST/HST totals by type, and a mileage summary. It covers the expense side of this checklist, not your income or the GST/HST you collected. You or your accountant use it when filling in T2125; ReceiptOne does not prepare or file the form for you.",
      },
    ],
  },

  {
    slug: "cra-audit-guide-self-employed-canada",
    title: "CRA Reviews and Audits for the Self-Employed (2026 Guide)",
    excerpt:
      "What to do when the CRA reviews or audits your return: verifying the contact, how reviews and audits work, representatives, your rights and objections.",
    category: "Tax Strategy",
    publishedAt: "2026-10-05",
    updatedAt: "2026-10-05",
    imageUrl: "https://picsum.photos/seed/cra-audit-guide-self-employed-canada/600/400",
    imageAlt: "Canadian freelancer preparing documentation for CRA audit review",
    tags: ["CRA audit", "self-employed", "review", "reassessment", "record keeping", "compliance"],
    relatedSlugs: ["cra-audit-proof-expenses", "cra-receipt-rules-canada"],
    body: [
      {
        type: "p",
        text: "When the CRA contacts you about a return, first confirm it is really the CRA. Then find out whether it is a review, which asks you to support specific claims, or an audit, which examines your books and records more broadly, and respond by the deadline it gives you.",
      },
      {
        type: "p",
        text: "This guide covers the process from first contact to a final decision for the 2026 tax year: the CRA's review programs, the stages of an audit, getting a representative, your rights, and what to do if you disagree or find a mistake yourself. For how to document expenses so they hold up, see our companion guide. Everything here comes from canada.ca and CRA publications, including RC4188, What You Should Know About Audits.",
      },
      {
        type: "h2",
        text: "First, Check That It Is Really the CRA",
      },
      {
        type: "p",
        text: "The CRA may contact you by letter or phone when it is reviewing your return. If your correspondence preference is electronic, it emails you to say a letter is waiting in your CRA account. If a caller says they are from the CRA and you are unsure, the CRA's advice is to:",
      },
      {
        type: "ul",
        items: [
          "Tell the caller you want to verify their identity first, and note their name, phone number and office location",
          "End the call and contact the CRA yourself before giving any information: 1-800-959-8281 for individuals in the provinces, 1-866-426-1527 in the territories, or 1-800-959-5525 for businesses",
          "Call the employee back only once you have confirmed who they are",
        ],
      },
      {
        type: "p",
        text: "The CRA lists red flags for a scam. The caller gives no proof of working for the CRA. They pressure you to act now, use aggressive language or threaten arrest. They ask for payment by prepaid credit card, gift card or cryptocurrency, or for information you would not put on your return, such as a credit card number. For a letter, you can sign in to your CRA account to check whether it was issued.",
      },
      {
        type: "h2",
        text: "Review or Audit: Which One Is This?",
      },
      {
        type: "p",
        text: 'Most contact about an individual return comes from a review program. These check income amounts, deductions and credits "to make sure that amounts are reported correctly and that they are properly supported". Among them:',
      },
      {
        type: "ul",
        items: [
          "Pre-assessment Review Program: before your notice of assessment is issued",
          "Processing Review Program: similar, but after the notice of assessment",
          "Request Verification Program: reviews a change you asked for, before a notice of reassessment",
          "Matching Program: compares your return with information from third parties such as employers or financial institutions",
          "Supplementary Examination Program: income, losses and deductions that need a more detailed look, before or after assessment",
        ],
      },
      {
        type: "p",
        text: "An audit is a closer examination of your books and records to confirm you are meeting your obligations. The CRA chooses files for audit based on a risk assessment. It looks at factors such as the likelihood of errors or signs of non-compliance, and may compare your file with similar ones or use information from other audits.",
      },
      {
        type: "h2",
        text: "Responding to a Review Letter",
      },
      {
        type: "p",
        text: "The CRA first tries to verify your claim from information it already has, and contacts you only if it needs more. When it does:",
      },
      {
        type: "ul",
        items: [
          "Reply within the time frame in the letter, to the address in the letter",
          "Include the reference number from the upper right corner of the letter",
          "Send all the receipts and documents requested that apply to you; scanned copies can be uploaded through My Account or Represent a Client",
          "If a document is not available, include a written explanation or call the number at the bottom of the letter",
          "If you need more time, call that same number",
        ],
      },
      {
        type: "p",
        text: "If your claim is changed after a review and you later find more supporting documents, the CRA says it will accept new submissions and review the claim again.",
      },
      {
        type: "h2",
        text: "What Happens in an Audit",
      },
      {
        type: "p",
        text: "An auditor contacts you by mail, phone or both to set the date, time and place. On-site audits normally take place at your home, your place of business or your representative's office, and the auditor shows a valid identification card on arrival. Otherwise the audit is done at a CRA office, possibly by an auditor in another region, who will ask you to bring or send the documents.",
      },
      {
        type: "p",
        text: "The auditor may copy your electronic records or borrow documents, giving you a detailed receipt for anything borrowed. Auditors are not allowed to receive records by email; they will explain the CRA's secure options. You must make all relevant records available, paper and electronic, and the CRA notes that failing to provide required records is an offence.",
      },
      {
        type: "p",
        text: "At the end, one of three things happens. If your assessment is correct, you get a completion letter. If changes are needed, you get a proposal letter explaining them and have 30 days to agree or disagree. If you disagree, contact the auditor with your reasons and any further documents. If that doesn't resolve it, you can contact the auditor's team leader, whose details are in the auditor's letters. A final letter then confirms no change, more tax owing or a refund. If you will owe more, the auditor can estimate the amount before the reassessment so you can pay early and limit interest.",
      },
      {
        type: "p",
        text: "How long an audit takes depends on factors such as the state of your records, the scope of the audit, delays from missing records, and consultation with other CRA specialists. The CRA says good records and co-operation shorten it, and missing records cause delays. If you no longer have a record, try to get a copy from whoever created it, such as your bank or a supplier. If you can't, the auditor or team leader will work with you on other ways to confirm the amount.",
      },
      {
        type: "h2",
        text: "Getting Help: Authorizing a Representative",
      },
      {
        type: "p",
        text: 'You have the right to be represented by a person of your choice. A representative only gets access once you authorize them. The fastest way is through My Account, by adding them under "Authorized representative(s)" in your profile. A representative with a RepID can also send a request through Represent a Client for you to confirm in My Account. The slowest way is Form AUT-01, which gives offline access only, by phone, mail, fax and in person, with a separate signed form for each representative.',
      },
      {
        type: "h2",
        text: "Your Rights During a Review or Audit",
      },
      {
        type: "p",
        text: "The Taxpayer Bill of Rights sets out 16 rights in your dealings with the CRA, plus a Commitment to Small Business. Several matter most when your return is being examined:",
      },
      {
        type: "ul",
        items: [
          "The right to pay no more and no less than what is required by law",
          "The right to a formal review and a subsequent appeal",
          "The right, unless otherwise provided by law, not to pay income tax amounts in dispute before you have had an impartial review",
          "The right to relief from penalties and interest because of extraordinary circumstances",
          "The right to be represented by a person of your choice",
          "The right to lodge a service complaint, and to request a formal review, without fear of reprisal",
        ],
      },
      {
        type: "h2",
        text: "If You Disagree With the Outcome",
      },
      {
        type: "p",
        text: "You can object to a reassessment. For individuals (other than trusts), the deadline is the later of one year after the filing deadline for the return and 90 days after the date of the notice of assessment. If you miss it, you can apply for an extension, as soon as possible and no later than one year after the objection deadline. After the CRA decides your objection, an appeal to the Tax Court of Canada must be received within 90 days of the date the CRA sends its decision.",
      },
      {
        type: "p",
        text: "Separately, if events beyond your control kept you from meeting your obligations, you can ask the CRA to cancel or waive penalties and interest. At the time of writing, the CRA's page put the average processing time for these requests at about 16 months.",
      },
      {
        type: "h2",
        text: "If You Find a Mistake Before the CRA Does",
      },
      {
        type: "p",
        text: "The Voluntary Disclosures Program lets you correct past errors or omissions. Since October 1, 2025, unprompted applications normally receive general relief of 75% of the applicable interest and 100% of penalties. Applications prompted by a CRA communication, such as an education letter, are now eligible too, normally for partial relief of 25% of interest and up to 100% of penalties. Eligibility remains restricted for anyone already under audit or investigation.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "p",
        text: "How do I know a CRA call is genuine? Take the caller's name, number and office location, hang up, and confirm through the CRA's own enquiry lines before sharing anything. Demands for gift cards or cryptocurrency, or threats of arrest, are scam red flags.",
      },
      {
        type: "p",
        text: "What is the difference between a review and an audit? A review checks that specific amounts on your return are supported, usually by asking for documents. An audit examines your books and records more broadly, may happen on-site, and ends with a proposal letter if changes are needed.",
      },
      {
        type: "p",
        text: "How long do I have to respond? For a review, the time frame is in the letter, and you can call the number on it to ask for more time. For an audit proposal letter, you have 30 days to agree or disagree.",
      },
      {
        type: "p",
        text: "Can my accountant deal with the CRA for me? Yes, once you authorize them, most quickly through My Account. Authorizing a representative does not remove your own responsibility for your records.",
      },
      {
        type: "p",
        text: "Do I have to pay a reassessment I am objecting to? The Taxpayer Bill of Rights says you have the right not to pay income tax amounts in dispute before an impartial review, unless the law provides otherwise.",
      },
      {
        type: "p",
        text: "Can I still use the Voluntary Disclosures Program if the CRA has written to me? Since October 1, 2025, applications prompted by a CRA communication can be accepted, normally with partial relief. It is restricted once you are under audit or investigation.",
      },
    ],
  },
];

/* ----------------------------- Helpers ------------------------------------ */

const WORDS_PER_MINUTE = 200;

/** Words in the article body: paragraphs, headings, list items, callouts and table cells. */
export function articleWordCount(article: Article): number {
  let words = 0;
  for (const block of article.body) {
    const texts =
      block.type === "ul"
        ? block.items
        : block.type === "table"
          ? [block.caption, ...block.headers, ...block.rows.flat()]
          : [block.text];
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

const FAQ_HEADING = "Frequently Asked Questions";

/**
 * Q&A pairs from an article's FAQ section: the paragraphs after the
 * "Frequently Asked Questions" h2, up to the next h2. Each paragraph is
 * rendered as "Question? Answer", so it is split at the first "?". Empty when
 * the article has no FAQ section.
 */
export function articleFaq(article: Article): { q: string; a: string }[] {
  const start = article.body.findIndex((b) => b.type === "h2" && b.text === FAQ_HEADING);
  if (start === -1) return [];
  const items: { q: string; a: string }[] = [];
  for (const block of article.body.slice(start + 1)) {
    if (block.type === "h2") break;
    if (block.type !== "p") continue;
    const end = block.text.indexOf("?");
    if (end === -1) continue;
    items.push({ q: block.text.slice(0, end + 1), a: block.text.slice(end + 1).trim() });
  }
  return items;
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
