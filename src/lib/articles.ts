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
  /** One FAQ entry, under the "Frequently Asked Questions" h2. Each is one FAQPage Question. */
  | { type: "faq"; q: string; a: string }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] }
  /** Linked sources under a table: one link per vendor, then a checked-on line. */
  | { type: "sources"; links: { label: string; href: string }[]; checked: string };

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
        type: "faq",
        q: "Is a credit card or bank statement enough on its own?",
        a: "Bank statements and statements of account are on the CRA's list of records, but a statement does not show what you bought, who the buyer was or how much GST/HST was charged. T4002 asks for those details on receipts, and the ITC chart requires them from $100 upward. Keep the receipt or invoice as well.",
      },
      {
        type: "faq",
        q: "Can I throw away paper receipts once I've photographed them?",
        a: "Only if your imaging meets the CAN/CGSB 72.34 standard. Then the images become the permanent records. If it doesn't, the CRA says to keep the paper originals, and to get legal advice if you're unsure.",
      },
      {
        type: "faq",
        q: "When can I shred my 2020 business receipts?",
        a: "Six years from the end of 2020 is December 31, 2026. After that, you can generally dispose of them if your 2020 return was filed on time, is not under objection or appeal, and the receipts don't support a later year, as with capital property.",
      },
      {
        type: "faq",
        q: "Do I send receipts with my tax return?",
        a: "No. T4002 says not to send your records with your income tax return, but to keep them in case the CRA asks to see them. GST/HST registrants likewise don't submit ITC documents with their return.",
      },
      {
        type: "faq",
        q: "Can I keep my records in a cloud service?",
        a: "The CRA requires records to be kept at your place of business or residence in Canada unless it gives written permission otherwise. Records kept outside Canada and accessed electronically from Canada are not considered kept in Canada. Find out where your provider stores data, and keep a copy in Canada.",
      },
      {
        type: "faq",
        q: "What if my receipts were lost in a fire or flood?",
        a: "For lost or damaged electronic records, the CRA asks you to report them missing at 1-800-959-5525 and recreate them within a reasonable time. For disasters, it points to its page on support for those affected.",
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
        type: "faq",
        q: "Is a photo of a receipt as good as the original?",
        a: "It can be used as a copy, and it must be an accurate, legible reproduction. Whether you can discard the paper depends on meeting the CAN/CGSB 72.34 imaging standard; if you don't, the CRA says to keep the original.",
      },
      {
        type: "faq",
        q: "Can I just print my email receipts and delete the emails?",
        a: "No. A record received electronically has to be kept electronically, even if you also have a paper copy.",
      },
      {
        type: "faq",
        q: "Does my receipt app keep my records for me?",
        a: "It can hold copies, but the responsibility to keep, produce and keep readable your records stays with you. Exporting a copy you control, and keeping it in Canada, covers the most common gaps.",
      },
      {
        type: "faq",
        q: "What file format should I save receipts in?",
        a: "The CRA asks for records in a non-proprietary, commonly used format that its software can read. For sending documents in a review, it lists .pdf and .jpg among the accepted formats.",
      },
      {
        type: "faq",
        q: "My laptop died and took my receipts with it. What now?",
        a: "Report the loss to the CRA and recreate the records within a reasonable time, for example by asking suppliers and your bank for copies. A tested backup kept off-site in Canada is what the CRA recommends to avoid this.",
      },
      {
        type: "faq",
        q: "Can I email my receipts to a CRA auditor?",
        a: "No. Auditors are not allowed to receive records by email; they will tell you how to send documents through the CRA's secure services.",
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
        type: "faq",
        q: "How long do I have to respond during an audit?",
        a: "If the auditor sends a proposal letter, you have 30 days to agree or disagree. For a review letter, reply within the time frame the letter gives, and call the number on it if you need more time.",
      },
      {
        type: "faq",
        q: "Can the CRA look at my personal bank account?",
        a: "Yes. RC4188 lists your personal records, including bank and credit card statements, among the records an auditor can examine, along with records of family members and related entities.",
      },
      {
        type: "faq",
        q: "Is a bank statement enough to support an expense?",
        a: "It is a record, and it proves payment, but it does not show what you bought. Keep the receipt or invoice with it; for GST/HST input tax credits, the CRA's documentary requirements apply on top.",
      },
      {
        type: "faq",
        q: "Can I deduct the full cost of a client lunch?",
        a: "Generally no: the claim is limited to 50% of the lesser of the cost and a reasonable amount. One exception is when you bill the client for the meal and show it on the bill.",
      },
      {
        type: "faq",
        q: "Can I claim my home office if I also work at a client's site?",
        a: "Only if you meet one of the two conditions: the home workspace is your principal place of business, or you use it only for the business and regularly meet clients there.",
      },
      {
        type: "faq",
        q: "What happens if I can't find a receipt the CRA asks for?",
        a: "Ask the supplier or your bank for a copy. If that fails, explain in writing (in a review) or discuss alternatives with the auditor (in an audit). If an expense cannot be supported, the CRA may disallow it.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 2 — EXPENSE TRACKING
     Pillar: expense-tracking-canada-freelancers
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "expense-tracking-canada-freelancers",
    title: "Expense Tracking for Canadian Freelancers (2026 Guide)",
    excerpt:
      "A year-round expense system for Canadian freelancers: capture receipts, sort them by T2125 line, reconcile monthly and build a year-end report.",
    category: "Expense Tracking",
    publishedAt: "2026-10-06",
    updatedAt: "2026-10-06",
    imageUrl: "https://picsum.photos/seed/expense-tracking-canada-freelancers/600/400",
    imageAlt: "Freelancer tracking business expenses on a laptop with receipts",
    tags: [
      "expense tracking",
      "freelancer",
      "self-employed",
      "receipts",
      "T2125",
      "bookkeeping",
      "tax preparation",
      "expense report",
    ],
    clusterName: "Expense Tracking",
    relatedSlugs: [
      "cra-receipt-rules-canada",
      "business-expense-categories-canada",
      "t2125-form-guide-canada",
      "reimbursable-expenses-canada-freelancers",
    ],
    body: [
      {
        type: "p",
        text: "Guide T4002 says you are required by law to keep records of all your transactions so you can support your income and expense claims, and to keep a record of your daily income and expenses. The CRA does not prescribe a system. The one you choose decides whether filing time is a review of records you already have or a reconstruction from bank statements and memory.",
      },
      {
        type: "p",
        text: "This guide sets out one system for the 2026 tax year: capture, categories, a routine, year-end reconciliation and the final report. Every rule and figure comes from canada.ca (sources at the end), and examples are hypothetical. What a receipt must show and how long to keep it are in our guide CRA Receipt Rules: What to Keep and for How Long.",
      },
      {
        type: "h2",
        text: "Step 1: Capture Every Receipt When It Happens",
      },
      {
        type: "p",
        text: "Receipt systems usually fail right after a purchase, when filing feels like effort. So make capture the only step that cannot wait: before you put your wallet away or close the browser tab. Categorizing and matching to your bank statement can happen later, in batches. A receipt that was never captured cannot be categorized at all.",
      },
      {
        type: "ul",
        items: [
          "Paper receipts: photograph them on the spot. Whether you can then discard the paper depends on CRA imaging rules, which the receipt rules guide covers.",
          "Emailed receipts and invoices: forward them to one address or save the PDF to one folder. These are electronic originals, so keep them in electronic form.",
          "Subscriptions and online purchases: download the invoice from the account page each billing cycle. Card statements show the charge, not what was bought.",
          "No description on the receipt: T4002 says to write what the item is on the receipt or in your expense records, as with a cash register tape.",
          "Business driving: log each trip with its date, destination, purpose and kilometres. T4002 lists those four details for every trip.",
        ],
      },
      {
        type: "p",
        text: "Add context while you remember it: who was at a meal and why, which client will repay a cost, and the business share of a mixed-use purchase.",
      },
      {
        type: "callout",
        text: "ReceiptOne keeps a photo of each receipt and reads the merchant, date, total and sales-tax amounts from it. It does not check a supplier's GST/HST registration number, so look for one yourself on purchases of $100 or more.",
      },
      {
        type: "h2",
        text: "Step 2: Keep Business and Personal Apart",
      },
      {
        type: "p",
        text: "T4002 says that since you cannot deduct personal expenses, you enter only the business part of an expense on Form T2125. A dedicated business account and card are not required, but they make that rule easier: every line on the statement is a business transaction. For genuinely mixed expenses, record how you worked out the business part:",
      },
      {
        type: "ul",
        items: [
          "Cellphone: T4002 lets you deduct the business percentage of airtime. You cannot deduct the basic monthly rate of a home landline, but you can deduct business long-distance calls on it, or the full basic rate of a separate business-only line.",
          "Vehicle: your claim follows business kilometres as a share of total kilometres, so the logbook is the record. After one full-year logbook sets a base year, T4002 allows a three-month sample logbook in later years, as long as business use stays within 10% of the base year.",
          "Home workspace: deductible only if it is your principal place of business, or you use it only for the business and regularly meet clients there. Split costs on a reasonable basis, such as the workspace's floor area over the home's total area.",
          "Meals and entertainment: the claim is generally limited to 50% of the lesser of what you spent and a reasonable amount, so record the full cost and let the category apply the limit.",
        ],
      },
      {
        type: "h2",
        text: "Step 3: Organize by T2125 Line",
      },
      {
        type: "p",
        text: "Use the expense lines on Form T2125 as your categories from day one, so the year-end totals go straight onto the form. The line numbers below are from the 2025 form and Guide T4002, the newest on canada.ca as of October 6, 2026; check them against the 2026 form.",
      },
      {
        type: "table",
        caption: "The T2125 lines most freelancers use, with typical items (2025 form).",
        headers: ["Line", "Category", "Typical freelancer items"],
        rows: [
          ["8521", "Advertising", "Ads, including on foreign websites; finder's fees"],
          ["8523", "Meals and entertainment", "Client meals, at the allowable 50%"],
          ["8710", "Interest and bank charges", "Interest on money borrowed for the business"],
          ["8760", "Business taxes, licences and memberships", "Licence fees, trade association dues"],
          ["8810", "Office expenses", "Pens, stationery, stamps (not furniture)"],
          ["8811", "Office stationery and supplies", "Supplies used to provide your service"],
          ["8860", "Professional fees", "Accountant, lawyer, tax return preparation"],
          ["9200", "Travel expenses", "Fares and hotels on business trips"],
          ["9220", "Utilities", "Business share of cellphone airtime, business line"],
          ["9270", "Other expenses", "Items no earlier line covers, listed on the form"],
          ["9281", "Motor vehicle expenses", "Business share of fuel, insurance, repairs (Chart A)"],
          ["9936", "Capital cost allowance", "Computers, desks and other capital items"],
          ["9945", "Business-use-of-home", "Home workspace costs, worked out in Part 7"],
        ],
      },
      {
        type: "p",
        text: "Two decisions come up at capture. The first is current versus capital. T4002 says a capital expense generally gives a lasting benefit, while a current expense usually recurs after a short period. Pens go on line 8810, but T4002 names calculators, filing cabinets, chairs and a desk as capital items, claimed through capital cost allowance rather than as expenses. The second is GST/HST. If you are a registrant and claim input tax credits, T4002 says to reduce each expense by the credit, so record the GST/HST on every receipt as its own amount, not just the total.",
      },
      {
        type: "p",
        text: "If you keep files yourself, use one folder per tax year with a subfolder per month or per T2125 line, name each file by date, vendor and amount (2026-03-04_Vendor_84.75.pdf), and keep a backup in a second place. For edge cases on any line, see our guides to business expense categories and to Form T2125.",
      },
      {
        type: "h2",
        text: "Step 4: A Weekly, Monthly and Quarterly Routine",
      },
      {
        type: "ul",
        items: [
          "Weekly: capture any receipts you missed during the week, forward or save emailed receipts, and log any trips you have not recorded.",
          "Monthly: match every business transaction on your bank and card statements to a receipt. Request copies of missing receipts while the vendor still has them. Assign a T2125 line to anything uncategorized, split mixed-use items, and total the month's business kilometres.",
          "Quarterly: pay your tax instalment if you are required to (dates below). If you file GST/HST quarterly, file and pay one month after the quarter ends. Compare income to date with your estimate, and back up your records.",
        ],
      },
      {
        type: "p",
        text: "Instalments apply for 2026 if your net tax owing is more than $3,000 ($1,800 in Quebec) in 2026 and in either 2025 or 2024. For business, professional or commission income, the due dates are March 15, June 15, September 15 and December 15. If a date falls on a weekend or public holiday, payment on the next business day is on time. The CRA sends reminders to people likely to owe instalments: in February for the March and June payments, and in August for September and December. Late or insufficient payments can bring instalment interest and penalties.",
      },
      {
        type: "callout",
        text: "Hypothetical example: reconciling April, a designer finds a $64.41 software charge with no receipt captured. The vendor's billing page still has the invoice, so it is downloaded and filed. Found in December, it might be past the vendor's download window.",
      },
      {
        type: "h2",
        text: "Before December 31: What to Reconcile",
      },
      {
        type: "p",
        text: "Most self-employed individuals have a December 31 year-end, and most must use the accrual method, which T4002 defines as reporting income in the fiscal period you earn it, no matter when you receive it, and deducting expenses in the period you incur them, whether or not you have paid. So December is for closing the year's records, not just totalling them:",
      },
      {
        type: "ul",
        items: [
          "Statements: confirm that every business transaction from January to December has a receipt and a T2125 line.",
          "Income: list every invoice issued in 2026, including those unpaid at December 31, and match payments to deposits. Report all your income, whether or not a slip arrives.",
          "T4A slips: payers must report fees for services over $500 in a calendar year, usually in box 048 of a T4A slip. Outside the trucking industry, the CRA still has a moratorium on penalties for not completing box 048, so do not count on a slip from every client. Your invoices are the complete record.",
          "Vehicle: record each vehicle's odometer reading at the end of the fiscal period, as T4002 requires, and total business and overall kilometres.",
          "Prepaid expenses: under the accrual method you deduct a prepaid amount in the year you get the benefit. Annual subscriptions running past December 31 are split.",
          "Capital purchases: for each asset bought or sold, record the seller, cost and date, as T4002 asks, so capital cost allowance can be calculated.",
          "Home workspace: total the year's home costs and confirm the floor-area split.",
          "GST/HST: if you are a registrant, total the tax you collected and the input tax credits you will claim.",
        ],
      },
      {
        type: "p",
        text: "The deadlines that follow: T4002 set April 30, 2026 for paying any 2025 balance and June 15, 2026 for filing a 2025 return with self-employment income. The same rule points to April 30 and June 15, 2027 for 2026, but confirm it in the 2026 guide. An annual GST/HST filer who is a sole proprietor with a December 31 year-end and business income for the year pays by April 30 and files by June 15.",
      },
      {
        type: "h2",
        text: "What an Expense Report or Export Needs to Contain",
      },
      {
        type: "p",
        text: "At year end, the records become a report for whoever fills in T2125: you, your accountant or your tax software. It should contain:",
      },
      {
        type: "ul",
        items: [
          "Your name, business name and the fiscal period covered.",
          "One line per expense: date, vendor, description, T2125 line, amount before tax, GST/HST paid, and the business-use percentage where it is less than 100%.",
          "A reference to the receipt image or file for each line, so any item can be produced if the CRA asks.",
          "Subtotals by T2125 line, with meals shown at both full cost and the allowable 50%.",
          "Total GST/HST paid, kept separate from the expenses if you claim input tax credits.",
          "A vehicle summary: odometer readings at the start and end of the year, total and business kilometres, and operating costs for Chart A.",
          "A list of capital purchases with date, seller and cost, and the home workspace figures for Part 7.",
        ],
      },
      {
        type: "table",
        caption: "Hypothetical example: four lines from an Ontario freelancer's 2026 report (HST at 13%).",
        headers: ["Date", "Vendor", "Description", "T2125 line", "Before tax", "HST", "Business use"],
        rows: [
          ["2026-02-11", "Office supply store", "Printer paper, pens", "8810", "$42.00", "$5.46", "100%"],
          ["2026-03-04", "Restaurant", "Lunch with client, project scope", "8523", "$75.00", "$9.75", "100% (50% claimable)"],
          ["2026-05-20", "Mobile carrier", "May cellphone bill", "9220", "$65.00", "$8.45", "60%"],
          ["2026-09-02", "Electronics retailer", "Laptop", "9936 (capital)", "$1,400.00", "$182.00", "100%"],
        ],
      },
      {
        type: "p",
        text: "A client reimbursement report is narrower: the project or contract, then each expense's date, description, amount and whether tax is included, with the receipt attached and the total requested. If one document covers several clients, keep each client's expenses separate. How reimbursements affect your own income and expenses is covered in our guide to tracking reimbursable expenses.",
      },
      {
        type: "p",
        text: "A report summarizes your records. It does not replace them. T4002 says not to send your records with your return but to keep them in case the CRA asks to see them. It may disallow expenses you cannot support, and a total is not support.",
      },
      {
        type: "callout",
        text: "ReceiptOne's year-end export gives you a PDF or CSV of your organized records: expenses grouped by category, GST/HST totals by type, and a mileage summary. It covers the expense side of this guide, not your income or the GST/HST you collected. You or your accountant use it to fill in T2125; ReceiptOne does not prepare or file the form.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "Does the CRA require a specific bookkeeping system or app?",
        a: "No. T4002 says the CRA does not issue record books or suggest any type of book or set of books. Computerized records must be clear and easy to read, and you keep separate records for each business you run.",
      },
      {
        type: "faq",
        q: "Do I need a separate business bank account?",
        a: "T4002 does not require one. It does require you to deduct only the business part of each expense and to support your claims, and a separate account makes both easier.",
      },
      {
        type: "faq",
        q: "What if I find a missing receipt at year end?",
        a: "Ask the vendor for a copy or download it from your account. A card statement shows the charge but not what you bought or the GST/HST, so it is weak support on its own. The receipt rules guide explains what a receipt must show.",
      },
      {
        type: "faq",
        q: "When are tax instalments due in 2026?",
        a: "March 15, June 15, September 15 and December 15 for business, professional or commission income, if your net tax owing is over $3,000 ($1,800 in Quebec) in 2026 and in either 2025 or 2024.",
      },
      {
        type: "faq",
        q: "What should I hand my accountant?",
        a: "The year-end report described above, the receipts behind it, your vehicle logbook, home workspace figures, every invoice you issued, any T4A slips and, if you are registered, your GST/HST totals.",
      },
      {
        type: "sources",
        links: [
          {
            label: "T4002, Chapter 1",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4002/t4002-3.html",
          },
          {
            label: "T4002, Chapter 3",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4002/t4002-5.html",
          },
          {
            label: "Instalments: who has to pay",
            href: "https://www.canada.ca/en/revenue-agency/services/payments/payments-cra/individual-payments/income-tax-instalments/who-pays-instalments.html",
          },
          {
            label: "Instalment due dates",
            href: "https://www.canada.ca/en/revenue-agency/services/payments/payments-cra/individual-payments/income-tax-instalments/due-dates.html",
          },
          {
            label: "GST/HST deadlines",
            href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/file-gst-hst-return/reporting-requirements-deadlines.html",
          },
          {
            label: "Reporting fees for service",
            href: "https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/compliance/reporting-fees-for-service.html",
          },
        ],
        checked:
          "All read on canada.ca on October 6, 2026. Guide T4002 is the 2025 edition, the newest published. This is general information, not tax advice.",
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
      "business-expense-categories-canada",
      "cra-receipt-rules-canada",
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
     Pillar: track-gst-hst-business-expenses
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "track-gst-hst-business-expenses",
    title: "GST/HST for Self-Employed Canadians (2026 Guide)",
    excerpt:
      "When to register for GST/HST, which rate to charge, input tax credits and receipt tiers, PST and QST, the quick method, and 2026 filing deadlines.",
    category: "GST / HST",
    publishedAt: "2026-10-06",
    updatedAt: "2026-10-06",
    imageUrl: "https://picsum.photos/seed/track-gst-hst-business-expenses/600/400",
    imageAlt: "Person reviewing financial spreadsheets and tax documents",
    tags: [
      "GST",
      "HST",
      "PST",
      "QST",
      "input tax credits",
      "ITC",
      "quick method",
      "GST registration",
      "self-employed",
    ],
    clusterName: "GST/HST Tracking",
    relatedSlugs: [
      "cra-receipt-rules-canada",
      "t2125-form-guide-canada",
      "freelancer-taxes-canada-guide",
      "business-expense-categories-canada",
    ],
    body: [
      {
        type: "p",
        text: "GST/HST reaches a self-employed business in two directions. Once you are registered, you charge it on your sales and send it to the CRA, and you recover the GST/HST you pay on business purchases by claiming input tax credits (ITCs). Getting it right comes down to four things: knowing when registration starts, charging the rate for the place the sale is made, keeping receipts that meet the CRA's documentation tiers, and filing on time.",
      },
      {
        type: "p",
        text: "This guide is written for sole proprietors. Every rule comes from canada.ca, mainly Guide RC4022, and the QST rules from Revenu Québec (sources at the end). Examples are hypothetical.",
      },
      {
        type: "h2",
        text: "When You Must Register: The Small-Supplier Test",
      },
      {
        type: "p",
        text: "You don't have to register while you are a small supplier. For a sole proprietor, that means your revenue from worldwide taxable supplies, from all your businesses and those of your associates, is $30,000 or less in a single calendar quarter and over the last four consecutive calendar quarters. It is revenue before expenses, and it includes zero-rated supplies such as most exports. It leaves out financial services, sales of capital property and goodwill from the sale of a business. Calendar quarters start on January 1, April 1, July 1 and October 1.",
      },
      {
        type: "p",
        text: "Going over $30,000 in either test ends small-supplier status, but the two tests start registration at different times:",
      },
      {
        type: "ul",
        items: [
          "Over $30,000 in a single calendar quarter: you stop being a small supplier immediately. Your effective date of registration is no later than the day of the sale that took you over, and you charge GST/HST on that sale.",
          "Over $30,000 across four consecutive quarters, but not in any one: you stay a small supplier until the end of the month after the quarter in which you went over. Your effective date is no later than the day of your first sale after that, and you charge GST/HST from then on.",
          "Either way, you have 29 days from your effective date to register.",
        ],
      },
      {
        type: "p",
        text: "In the CRA's examples, a consultant whose third quarter reached $38,000 registered effective the sale that crossed $30,000, and charged tax on it. A seller whose four quarters to March 31 totalled $32,000, none over the line alone, stopped being a small supplier on April 30 and started charging on its next sale, May 2.",
      },
      {
        type: "p",
        text: "Taxi and commercial ride-sharing drivers must register even as small suppliers.",
      },
      {
        type: "h2",
        text: "Registering Voluntarily",
      },
      {
        type: "p",
        text: "A small supplier can register voluntarily if it makes taxable sales in Canada; you generally cannot register if you make only exempt supplies. Your effective date is usually the day you request your GST/HST account, and it can be up to 30 days before that. Once registered you must charge, collect and remit GST/HST on your taxable supplies, file returns for every reporting period, and stay registered for at least one year before you can cancel, unless you stop your commercial activities.",
      },
      {
        type: "p",
        text: "In return you can claim ITCs. As a new registrant you may also be able to claim ITCs for GST/HST paid on property you have on hand on the day you register, such as equipment. The trade-off depends on your clients: registered businesses recover the GST/HST you charge, but consumers cannot, so for them your price rises by the tax.",
      },
      {
        type: "h2",
        text: "Charging the Right Rate by Province",
      },
      {
        type: "p",
        text: "The rate depends on where the sale is made, not where you live. For most services, the general rule in RC4022 is that the supply is made in the province of the client's home or business address that you obtain in the ordinary course of business. RC4022's example: a Calgary accounting firm whose only address for its client is in London, Ontario charges 13% HST, not 5% GST. Personal services, services related to real property and some others have their own rules.",
      },
      {
        type: "table",
        caption: "Rates from the CRA's rates page. Nova Scotia's 14% applies from April 1, 2025.",
        headers: ["Province or territory", "GST/HST you charge", "Separate provincial tax"],
        rows: [
          ["Ontario", "13% HST", "None"],
          ["Nova Scotia", "14% HST", "None"],
          ["New Brunswick, Newfoundland and Labrador, Prince Edward Island", "15% HST", "None"],
          ["Alberta, Northwest Territories, Nunavut, Yukon", "5% GST", "None"],
          ["British Columbia", "5% GST", "7% PST"],
          ["Manitoba", "5% GST", "7% RST"],
          ["Saskatchewan", "5% GST", "6% PST"],
          ["Quebec", "5% GST", "9.975% QST"],
        ],
      },
      {
        type: "p",
        text: "Where GST and a provincial tax both apply, the GST is calculated on the price before the provincial tax. Services you perform wholly outside Canada are generally not subject to GST/HST, and certain advisory, professional or consulting services supplied to a non-resident are zero-rated: taxable at 0%, so you charge nothing but can still claim ITCs on the costs of making them.",
      },
      {
        type: "h2",
        text: "Input Tax Credits: What You Can Claim",
      },
      {
        type: "p",
        text: "An ITC recovers the GST/HST paid or payable on purchases you use in your commercial activities. You can claim only to the extent a purchase is for use in those activities, and it must be reasonable in quality, nature and cost for your business. If 90% or more of an operating expense is for commercial use, you claim 100% of the tax on it. If an expense is shared, the business share must come from a fair and reasonable allocation used consistently all year. If your ITCs for a period exceed the GST/HST you collected, the CRA refunds the difference.",
      },
      {
        type: "p",
        text: "You cannot claim ITCs for:",
      },
      {
        type: "ul",
        items: [
          "Purchases for personal use, or the personal share of a mixed-use expense",
          "Purchases used to make exempt supplies",
          "Membership fees or dues to a club whose main purpose is recreation, dining or sport, such as a fitness or golf club",
          "Certain capital property (RC4022 sets out separate rules for capital property)",
          "Exempt and zero-rated purchases, because no GST/HST was charged",
          "Provincial sales taxes: PST and RST are never part of an ITC",
          "GST/HST charged by a supplier registered only under the simplified regime for digital-economy businesses. Give such suppliers your GST/HST number so they do not charge it.",
        ],
      },
      {
        type: "p",
        text: "You normally claim an ITC on the return for the period you made the purchase, but you can catch up later. For most registrants, the deadline is the due date of the return for the last reporting period ending within four years after the period in which the ITC could first have been claimed.",
      },
      {
        type: "h2",
        text: "What a Receipt Must Show: The $100 and $500 Tiers",
      },
      {
        type: "p",
        text: "You need sufficient documentary evidence before you claim an ITC, and what counts depends on the total sale. These tiers replaced the earlier $30 and $150 thresholds on April 20, 2021:",
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
        text: "Hypothetical example: a $240 printer from an Ontario retailer supports an ITC only if the receipt shows the HST (or says it is included) and the retailer's registration number. You can check a number with the CRA's free GST/HST Registry before you claim, and ask for a corrected receipt while the purchase is recent.",
      },
      {
        type: "h2",
        text: "Meals and Entertainment: The 50% Restriction",
      },
      {
        type: "p",
        text: "The ITC follows the income tax limit. Where your deduction for meals and entertainment is limited to 50% of the cost, you can claim 50% of the GST/HST you paid on them as ITCs. RC4022 gives two ways to do it: claim 50% of the actual tax in each reporting period, with no year-end adjustment, or claim 100% during the year and add back the excess. Annual filers make that adjustment on the same year's return; monthly and quarterly filers on the first return of the next fiscal year.",
      },
      {
        type: "h2",
        text: "How ITCs Reduce Your T2125 Expenses",
      },
      {
        type: "p",
        text: "You cannot recover the same tax twice. Guide T4002 says that when you claim GST/HST as an ITC, you reduce the business expense on Form T2125 by the amount of the credit, at the time the tax was paid or became payable, whichever is earlier, and enter the net figure. An ITC on depreciable property reduces its capital cost for capital cost allowance. If you are not registered, the GST/HST you pay is simply part of each expense.",
      },
      {
        type: "callout",
        text: "Hypothetical example, Ontario (13% HST): a registered freelancer buys $1,000 of software plus $130 HST. They claim a $130 ITC and deduct $1,000 on T2125. An unregistered freelancer deducts $1,130 and recovers nothing. For a $200 client lunch plus $26 HST, the registered freelancer claims a $13 ITC (50% of the tax), leaving a $213 cost, of which 50%, $106.50, is deductible.",
      },
      {
        type: "h2",
        text: "PST: A Provincial Matter",
      },
      {
        type: "p",
        text: "British Columbia (7% PST), Manitoba (7% RST) and Saskatchewan (6% PST) run their own sales taxes beside the 5% GST. The CRA does not administer them: whether you must register to collect a provincial sales tax, and what it applies to, is set by each province, and RC4022 tells you to contact your provincial sales tax office. Ontario and the Atlantic provinces have no separate PST because it is built into the HST.",
      },
      {
        type: "p",
        text: "On the cost side, PST you pay on business purchases is not recovered through an ITC on your GST/HST return, so it stays part of the expense you deduct on T2125. Record GST/HST and PST as separate amounts on every receipt. One combined tax figure makes it impossible to claim the right ITC.",
      },
      {
        type: "h2",
        text: "QST: Revenu Québec's Own System",
      },
      {
        type: "p",
        text: "Quebec Sales Tax is administered by Revenu Québec, not the CRA, and if your business is physically located in Quebec, Revenu Québec generally administers your GST/HST too, so you file with it on its forms. Per Revenu Québec:",
      },
      {
        type: "ul",
        items: [
          "As a rule, you must register for the GST and QST if you carry on commercial activities in Québec and your worldwide taxable supplies, with your associates', exceed $30,000 in a calendar quarter or in the four preceding calendar quarters. The small-supplier timing mirrors the federal test.",
          "A business that carries on commercial activity in Québec and registers for the QST must also register for the GST/HST, and must stay registered for at least one year.",
          "Taxi businesses must register for both regardless of revenue.",
          "The QST rate is 9.975%, calculated on the sale price, not on the price plus GST. Together the two come to 14.975%.",
          "Registrants recover QST paid on business inputs by claiming input tax refunds (ITRs), Quebec's counterpart to ITCs, with similar exclusions such as personal-use purchases.",
          "You cannot claim an ITR for QST paid to a supplier outside Québec registered under the special regime (an \"NR\" number). Give them your QST number, which begins with \"TQ\", before the sale so they do not charge it.",
        ],
      },
      {
        type: "h2",
        text: "The Quick Method",
      },
      {
        type: "p",
        text: "The quick method is an optional way to calculate what you remit. You still charge GST/HST at the normal rate, but instead of tracking the tax on every expense you remit a fixed percentage of your GST/HST-included sales. In exchange you give up ITCs on operating expenses; you can still claim them on capital assets such as computers and vehicles. You also get a 1% credit on the first $30,000 of eligible GST/HST-included sales each fiscal year.",
      },
      {
        type: "ul",
        items: [
          "Eligibility: annual worldwide taxable supplies, including GST/HST and your associates', of $400,000 or less, and a permanent establishment in Canada.",
          "Excluded: anyone providing bookkeeping, financial consulting, tax consulting or tax-return preparation services, and legal, accounting or actuarial professionals.",
          "Service-business rates by where your permanent establishment is: 3.6% if your establishment and the sale are both in a 5% GST province; 8.8% if both are in Ontario; 9.4% for Nova Scotia; 10.0% for a 15% HST province. Other combinations have their own rates in Guide RC4058.",
          "How to elect: through My Business Account or Form GST74. Annual filers must elect by the first day of their second fiscal quarter.",
        ],
      },
      {
        type: "callout",
        text: "Hypothetical example: an Alberta graphic designer bills $50,000 plus $2,500 GST, and pays $400 of GST on operating expenses. Regular method: $2,500 − $400 = $2,100 remitted. Quick method: $52,500 × 3.6% = $1,890, minus the 1% credit on $30,000 ($300), so $1,590. Before income tax, the quick method wins for this designer unless ITCs on operating expenses exceed $910. Under T4002, the GST/HST collected minus the quick method amount is added to income on T2125.",
      },
      {
        type: "h2",
        text: "Filing and Payment Deadlines",
      },
      {
        type: "p",
        text: "The CRA assigns your reporting period from your annual revenue from taxable supplies: $1,500,000 or less is annual, more than $1,500,000 up to $6,000,000 is quarterly, and above that is monthly. You can elect to file more often.",
      },
      {
        type: "ul",
        items: [
          "Monthly and quarterly filers file and pay one month after the end of each period.",
          "Most annual filers file and pay three months after their fiscal year-end.",
          "A sole proprietor with a December 31 year-end and business income for the year pays by April 30 and files by June 15. For the 2026 year that means paying by April 30, 2027 and filing by June 15, 2027.",
          "If your net tax was $3,000 or more in both the previous and current fiscal year, an annual filer pays quarterly instalments, each due one month after the end of a fiscal quarter.",
          "File a return for every period, including a nil return when there is nothing to report.",
          "Returns for periods ending in 2024 and later must be filed electronically, except by charities and selected listed financial institutions; a paper return draws a penalty.",
        ],
      },
      {
        type: "h2",
        text: "What to Keep",
      },
      {
        type: "ul",
        items: [
          "Every sales invoice you issued, showing the GST/HST you charged",
          "Every purchase receipt or invoice, meeting the documentary tier for its amount",
          "GST/HST, PST and QST recorded as separate amounts for each expense",
          "Your filed returns, registration confirmation and any quick method election",
        ],
      },
      {
        type: "p",
        text: "Keep GST/HST records for six years from the end of the year they relate to. The CRA may ask you to keep them longer, and to destroy them sooner you need its written permission.",
      },
      {
        type: "callout",
        text: "ReceiptOne reads the GST/HST and PST amounts from each receipt you scan and keeps them as separate fields, with PST marked as non-refundable, so the tax you can claim as an ITC never gets mixed with tax you can't. Check what it read against the receipt, and keep the original until the six years are up.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "Do sales to clients outside Canada count toward the $30,000 threshold?",
        a: "Yes. The small-supplier test counts revenue from worldwide taxable supplies, including zero-rated supplies such as most exported services. A freelancer with mostly foreign clients can therefore have to register even though they charge little or no GST/HST.",
      },
      {
        type: "faq",
        q: "Should I register voluntarily before I reach $30,000?",
        a: "It can pay off if you have significant business expenses or mostly registered business clients, since you recover GST/HST through ITCs and your clients recover what you charge them. If your clients are consumers, your price rises by the tax for them. Voluntary registration also means filing returns and staying registered for at least a year.",
      },
      {
        type: "faq",
        q: "I live in Alberta. Do I charge HST to a client in Ontario?",
        a: "Generally yes. For most services the sale is made in the province of the client's address you obtain in the ordinary course of business, so a client with an Ontario business address is charged 13% HST. Personal services and services related to real property follow other rules.",
      },
      {
        type: "faq",
        q: "Can I claim PST or QST as an input tax credit?",
        a: "No. ITCs cover only GST and HST. PST and RST are not recoverable on your GST/HST return and stay part of the expense. QST is recovered separately, through input tax refunds claimed with Revenu Québec, if you are registered for the QST.",
      },
      {
        type: "faq",
        q: "I forgot to claim ITCs last year. Have I lost them?",
        a: "Usually not. Most registrants can claim an ITC up to the due date of the return for the last reporting period ending within four years after the period in which it could first have been claimed, as long as you have receipts that meet the documentary requirements.",
      },
      {
        type: "faq",
        q: "Can a bookkeeper or tax preparer use the quick method?",
        a: "No. Persons who provide bookkeeping, financial consulting, tax consulting or tax-return preparation services, and legal, accounting or actuarial professionals, cannot use the quick method. They calculate net tax the regular way, with ITCs.",
      },
      {
        type: "sources",
        links: [
          {
            label: "When to register and start charging",
            href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-charge.html",
          },
          {
            label: "Register voluntarily",
            href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/account-register-voluntarily.html",
          },
          {
            label: "GST/HST rates",
            href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html",
          },
          {
            label: "Guide RC4022",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4022/general-information-gst-hst-registrants.html",
          },
          {
            label: "Excise and GST/HST News No. 118",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/news118/news118-excise-gst-hst-news-no-118.html",
          },
          {
            label: "Notice 322 (simplified regime)",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/notice322/recovery-gst-hst-under-digital-economy-measures.html",
          },
          {
            label: "Guide RC4058, Quick Method",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4058/quick-method-accounting-gst-hst.html",
          },
          {
            label: "GST/HST deadlines",
            href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/file-gst-hst-return/reporting-requirements-deadlines.html",
          },
          {
            label: "T4002, Chapter 2",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4002/t4002-4.html",
          },
          {
            label: "T4002, Chapter 3",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4002/t4002-5.html",
          },
          {
            label: "GST/HST Registry",
            href: "https://www.canada.ca/en/revenue-agency/services/e-services/e-services-businesses/confirming-a-gst-hst-account-number.html",
          },
          {
            label: "Revenu Québec: registering for the GST and QST",
            href: "https://www.revenuquebec.ca/en/businesses/consumption-taxes/gsthst-and-qst/registering-for-the-gst-and-qst/",
          },
          {
            label: "Revenu Québec: small suppliers",
            href: "https://www.revenuquebec.ca/en/citizens/consumption-taxes/taxable-zero-rated-or-tax-exempt-goods-and-services/gst-and-qst/other-situations/small-suppliers/",
          },
          {
            label: "Revenu Québec: ITCs and ITRs",
            href: "https://www.revenuquebec.ca/en/businesses/consumption-taxes/gsthst-and-qst/itcs-and-itrs/",
          },
          {
            label: "Revenu Québec: calculating the taxes",
            href: "https://www.revenuquebec.ca/en/businesses/consumption-taxes/gsthst-and-qst/collecting-gst-and-qst/calculating-the-taxes/",
          },
        ],
        checked:
          "canada.ca and revenuquebec.ca pages all read on October 6, 2026. Guides RC4022 and RC4058 are revision 25. This is general information, not tax advice.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     CLUSTER 4 — MILEAGE & VEHICLE DEDUCTIONS
     Pillar: mileage-deduction-canada-freelancers
     ═══════════════════════════════════════════════════════════════ */

  {
    slug: "mileage-deduction-canada-freelancers",
    title: "Mileage and Vehicle Deductions in Canada (2026 Guide)",
    excerpt:
      "How self-employed Canadians deduct vehicle costs for 2026: the CRA logbook, Chart A, interest and lease caps, CCA classes 10 and 10.1, and business use.",
    category: "Mileage & Auto",
    publishedAt: "2026-10-06",
    updatedAt: "2026-10-06",
    imageUrl: "https://picsum.photos/seed/mileage-deduction-canada-freelancers/600/400",
    imageAlt: "Canadian freelancer tracking business mileage for CRA deduction",
    tags: [
      "mileage",
      "vehicle expenses",
      "automobile deduction",
      "logbook",
      "CCA",
      "lease",
      "T2125",
      "CRA",
      "self-employed",
    ],
    clusterName: "Mileage & Vehicle Deductions",
    relatedSlugs: [
      "mileage-tracking-apps-canada",
      "t2125-form-guide-canada",
      "expense-tracking-canada-freelancers",
      "business-expense-categories-canada",
    ],
    body: [
      {
        type: "p",
        text: "If you are self-employed in Canada and use your own vehicle for work, you deduct the business share of what the vehicle actually costs you to run: business kilometres divided by total kilometres, multiplied by your eligible expenses, claimed on Form T2125. The per-kilometre figure you may have heard quoted (73 cents for the first 5,000 km in 2026) is not that deduction. It is the limit on tax-free allowances that employers pay employees, and it only becomes relevant to you if someone, such as your own corporation, is paying you an allowance.",
      },
      {
        type: "p",
        text: "This guide covers the 2026 tax year: deductible costs, Chart A, the interest and lease caps, capital cost allowance (CCA), the CRA logbook and the business-use percentage. Every rule and figure comes from canada.ca (sources at the end); the newest Guide T4002 and Form T2125 are the 2025 editions, so we flag 2026 figures not yet published. Examples are hypothetical.",
      },
      {
        type: "h2",
        text: "The 2026 Rates and Limits",
      },
      {
        type: "p",
        text: "The Department of Finance announced the 2026 automobile limits on January 14, 2026. They apply from January 1, 2026:",
      },
      {
        type: "ul",
        items: [
          "Per-kilometre allowance limit, provinces: 73¢ for the first 5,000 km and 67¢ for each additional kilometre (2025: 72¢ and 66¢)",
          "Per-kilometre allowance limit, territories: 77¢ for the first 5,000 km and 71¢ for each additional kilometre (2025: 76¢ and 70¢)",
          "Capital cost ceiling for Class 10.1 passenger vehicles: $39,000 before tax (up from $38,000 in 2025)",
          "Capital cost ceiling for Class 54 zero-emission passenger vehicles: $61,000 before tax (unchanged)",
          "Deductible leasing costs: $1,100 per month before tax for new leases entered into on or after January 1, 2026 (unchanged)",
          "Deductible interest: $350 per month for new automobile loans entered into on or after January 1, 2026 (unchanged)",
        ],
      },
      {
        type: "p",
        text: 'The leasing, interest and capital cost ceilings apply only to "passenger vehicles": vehicles you own (other than zero-emission vehicles) or lease that are designed mainly to carry people and seat a driver and no more than eight passengers. The CRA\'s Type of vehicle chart sorts pickups, vans and SUVs by use: a pickup used more than 50% to transport goods or equipment, for example, is not a passenger vehicle.',
      },
      {
        type: "h2",
        text: "Two Methods: Actual Expenses vs. the Per-Kilometre Allowance",
      },
      {
        type: "p",
        text: "Actual expenses is the only vehicle method on Form T2125: total what the vehicle cost you in the year, then claim the business-use share. CCA on a vehicle you own is claimed separately, at the same percentage.",
      },
      {
        type: "p",
        text: "The per-kilometre allowance is an employment rule: an employer pays an employee a set amount per business kilometre, tax-free if it is based only on business kilometres and the rate is reasonable. If your own corporation pays you one, this is the method that applies. A sole proprietor filing a T2125 cannot choose it.",
      },
      {
        type: "h2",
        text: "Which Vehicle Costs Are Deductible",
      },
      {
        type: "p",
        text: "T4002 lists the expenses you can deduct to run a motor vehicle you use to earn business income. Each one is reduced to your business-use percentage, and the CRA allows them only when they are reasonable and you have receipts to support them:",
      },
      {
        type: "ul",
        items: [
          "Fuel and oil, with every receipt, not just the card statement",
          "Electricity for a zero-emission vehicle",
          "Insurance",
          "Licence and registration fees",
          "Maintenance and repairs, with each invoice",
          "Interest on money borrowed to buy the vehicle, capped for passenger vehicles (Chart B)",
          "Leasing costs, capped for passenger vehicles (Chart C). Keep the lease: it shows the list price.",
        ],
      },
      {
        type: "p",
        text: "Two costs are not reduced by the business-use percentage. The CRA lets you deduct the full amount of parking fees related to your business activities and supplementary business insurance for the vehicle. The purchase price of a vehicle you own is never deducted as an expense. It goes through CCA, covered below.",
      },
      {
        type: "h2",
        text: "How Chart A Works",
      },
      {
        type: "p",
        text: "Chart A, Motor vehicle expenses, is part of Form T2125. Its numbered amounts on the 2025 form run in this order:",
      },
      {
        type: "ul",
        items: [
          "Amounts 1 and 2: kilometres driven in the fiscal period to earn business income, and total kilometres driven. Both come from your logbook and odometer readings.",
          "Amounts 3 to 11: fuel and oil, interest (from Chart B), insurance, licence and registration, maintenance and repairs, leasing (from Chart C), electricity for zero-emission vehicles, and other expenses you name.",
          "Amount 12: the total of amounts 3 to 11.",
          "Amount 13, the business-use part: amount 1 ÷ amount 2 × amount 12.",
          "Amounts 14 and 15: business parking fees and supplementary business insurance, added in full.",
          "Amount 16: amounts 13 to 15 added together. This is the figure you enter on line 9281, Motor vehicle expenses (not including CCA).",
        ],
      },
      {
        type: "p",
        text: "The capped figures feed in, not what you paid: Chart B's result goes into amount 4 and Chart C's into amount 8. CCA on the vehicle is calculated in Area A of the form and goes on line 9936. Partners who use a personal vehicle for partnership business claim on line 9943 instead. If you use more than one vehicle for business, keep a separate record for each and calculate each vehicle's expenses separately.",
      },
      {
        type: "h2",
        text: "The Interest Cap: Chart B",
      },
      {
        type: "p",
        text: "If you borrowed to buy a passenger vehicle or a zero-emission passenger vehicle, Chart B limits the interest that enters Chart A. Available interest is the lesser of the interest payable (accrual method) or paid (cash method) in the fiscal period, and $350 ÷ 30 × the number of days in the period for which interest was payable or paid. For a full 365-day year that works out to $4,258. The 2025 form sets the $350 figure for passenger vehicles bought after 2023, and $300 for those bought after 2000 and before 2024. Interest above the cap is not deductible, and the capped amount is still reduced to your business-use share in Chart A.",
      },
      {
        type: "h2",
        text: "The Lease Cap: Chart C",
      },
      {
        type: "p",
        text: "Chart C, Eligible leasing cost for passenger vehicles, applies the $1,100 monthly limit and a second limit tied to the vehicle's list price, then takes the lesser of the two. On the 2025 form:",
      },
      {
        type: "ul",
        items: [
          "Amount 20: lease charges incurred for the vehicle in the current fiscal period.",
          "Amount 21: lease payments deducted for it in earlier fiscal periods.",
          "Amount 22: total days the vehicle was leased in the current and earlier fiscal periods.",
          "Amount 23: the manufacturer's list price.",
          "Amount 24: amount 23 or $44,706 plus sales tax, whichever is more, × 85%.",
          "Amount 25: ($1,100 plus sales tax) × amount 22 ÷ 30. Amount 26 is amount 25 minus amount 21.",
          "Amount 27: ($38,000 plus sales tax) × amount 20 ÷ amount 24.",
          "Amount 28, the eligible leasing cost: amount 26 or 27, whichever is less. It goes into amount 8 of Chart A.",
        ],
      },
      {
        type: "p",
        text: "The $44,706 and $38,000 figures follow the 2025 Class 10.1 ceiling ($38,000 × 100 ÷ 85 = $44,706), so check the 2026 form's figures before you fill it in. If you have a repayment owing to you under the lease, or imputed interest from refundable deposits over $1,000, the CRA says you cannot use the chart as printed.",
      },
      {
        type: "callout",
        text: "Hypothetical example, using the 2025 form's figures: an Ontario freelancer (HST 13%) leases a car with a $60,000 list price from January 1 and pays $12,000 in lease charges in the year. Amount 24 is $60,000 × 85% = $51,000, because $60,000 is more than $44,706 + HST ($50,517.78). Amount 26 is $1,243 × 365 ÷ 30 = $15,123.17. Amount 27 is $42,940 × $12,000 ÷ $51,000 = $10,103.53. The eligible leasing cost is the lesser, $10,103.53. That, not $12,000, goes into Chart A.",
      },
      {
        type: "h2",
        text: "Capital Cost Allowance: Classes 10 and 10.1",
      },
      {
        type: "p",
        text: "If you own the vehicle, you recover its cost through CCA rather than as an expense. Class 10 has a 30% rate and covers motor vehicles and some passenger vehicles. You use the declining balance method: each year's CCA is a percentage of the class's remaining balance, so the claim shrinks over time. A passenger vehicle that costs more than the ceiling for the year you acquired it goes into Class 10.1 instead, also at 30%, but with its own rules:",
      },
      {
        type: "ul",
        items: [
          "Capped cost: the capital cost is limited to the ceiling plus GST/HST or PST on it. The ceilings are $30,000 for vehicles acquired before 2022, $34,000 in 2022, $36,000 in 2023, $37,000 in 2024, $38,000 in 2025 and $39,000 from January 1, 2026.",
          "One class per vehicle: each Class 10.1 vehicle is listed separately, not pooled.",
          "Year of sale: if you owned the vehicle at the end of the previous year, you may be able to claim 50% of the year's CCA in the year you sell it.",
          "No recapture or terminal loss: those rules do not apply to Class 10.1 passenger vehicles unless they were designated immediate expensing property.",
        ],
      },
      {
        type: "p",
        text: "In the year you acquire property, the half-year rule usually limits CCA to half the net addition. The accelerated investment incentive suspends that rule for eligible property acquired after November 20, 2018, and available for use before 2028: for property available for use from 2024 to 2027, the CRA puts the first-year allowance at two times the normal first-year deduction. The 2025 T4002 also describes a proposed reaccelerated incentive for property acquired after 2024, so confirm your vehicle's first-year treatment in the 2026 guide.",
      },
      {
        type: "p",
        text: "Zero-emission vehicles have their own classes: Class 54 (30%) for those that would otherwise be in Class 10 or 10.1, and Class 55 (40%) for those otherwise in Class 16. Each Class 54 zero-emission passenger vehicle has a capital cost limit of $61,000 plus sales tax.",
      },
      {
        type: "p",
        text: "In every class, CCA on a vehicle you also drive personally is reduced to the business-use share: in T4002's example, 12,000 of 18,000 km on $3,000 of CCA gives $2,000.",
      },
      {
        type: "callout",
        text: "Hypothetical example: an Ontario freelancer buys a $45,000 passenger vehicle in 2026. It goes into its own Class 10.1, and its capital cost is capped at $39,000 + 13% HST = $44,070. A full year of CCA at 30% on that would be $13,221, and at 40% business use the claim would be $5,288.40. The first-year amount depends on which first-year rule applies, as above.",
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
          "Total (amount 12): $6,950 × 40% = $2,780",
          "Business parking: $240, deducted in full rather than at 40%",
          "Amount on line 9281: $3,020",
        ],
      },
      {
        type: "p",
        text: "CCA on the vehicle goes on line 9936, also reduced to 40%. For comparison, an employer allowance for the same 8,000 business kilometres at the 2026 provincial rates could be at most 5,000 × $0.73 + 3,000 × $0.67 = $5,660. That is a tax-free payment from an employer, useful if you are deciding whether your corporation should reimburse you, but not a deduction a sole proprietor can claim.",
      },
      {
        type: "h2",
        text: "The Logbook the CRA Expects",
      },
      {
        type: "p",
        text: 'The CRA calls an accurate logbook of business travel kept for the entire year "the best evidence" to support the use of a vehicle. For each business trip, record:',
      },
      {
        type: "ul",
        items: [
          "The date",
          "The destination",
          "The purpose",
          "The number of kilometres driven",
        ],
      },
      {
        type: "p",
        text: "Also record each vehicle's odometer reading at the start and end of your fiscal period, and, if you buy, sell or trade a vehicle during the year, its reading on that date. The two readings give total kilometres, the denominator of your business-use percentage. Where you started is not on the CRA's list, but recording it makes each entry easier to check.",
      },
      {
        type: "p",
        text: 'Make the purpose specific: "site visit, kitchen renovation quote" ties a trip to the business in a way "client meeting" does not. Log trips when they happen rather than from memory at month end, include short trips, and if a business trip includes a personal errand, log only the business kilometres.',
      },
      {
        type: "h2",
        text: "The Base Year and the Three-Month Sample",
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
          "The sample stands in for the year only if the result is within 10 percentage points of the base year, and the base year still reflects how you normally use the vehicle.",
          "If the result moves by more than 10 points, the sample covers only its own three months. For the rest of the year you need an actual record of travel, and the CRA suggests starting a new 12-month base year.",
        ],
      },
      {
        type: "p",
        text: "The CRA's own example: a base year with 49% annual business use, and 46% for April to June. A later year's April-to-June sample shows 51%. Calculated use is (51% ÷ 46%) × 49% = 54%. That is within the 39% to 59% band, so the CRA would accept 54% in the absence of contradictory evidence. Pick the sample months in advance. Because the base year keeps doing work in later years, its logbook must be kept for six years from the end of the last tax year it is used to support. All other records follow the usual rule of six years from the end of the tax year they relate to.",
      },
      {
        type: "h2",
        text: "How to Calculate Your Business-Use Percentage",
      },
      {
        type: "p",
        text: "The formula is business kilometres ÷ total kilometres. At year end, your logbook should give you:",
      },
      {
        type: "ul",
        items: [
          "Total kilometres driven: the end-of-year odometer reading minus the start-of-year reading.",
          "Business kilometres: the sum of all logged business trips.",
          "Business-use percentage: business kilometres ÷ total kilometres × 100.",
        ],
      },
      {
        type: "p",
        text: "That percentage applies to every Chart A expense and to the vehicle's CCA. The CRA's published example: 27,000 business kilometres out of 30,000 total, with $5,400 of expenses, gives 27,000 ÷ 30,000 × $5,400 = $4,860. Adding $40 of parking and $100 of supplementary business insurance in full brings the claim to $5,000.",
      },
      {
        type: "p",
        text: "The judgment call is which trips count as business. The CRA's longstanding position, set out in the archived Interpretation Bulletin IT-521R, is that driving between your home and your place of business is personal unless your home is the base of your business operations. If you have an office or other fixed workplace elsewhere, your home normally does not qualify. If you run the business from home and drive out to clients or job sites, those trips can be business travel. Travel between different premises of the same business is deductible.",
      },
      {
        type: "callout",
        text: "ReceiptOne's Log Trip feature records each trip's date and route distance from the start and end addresses you enter, with your note on the purpose. Tag each trip business or personal, and the T2125 report shows business kilometres divided by all the kilometres you've logged in the app. It does not use your odometer readings, so that percentage is only accurate if you log personal trips too. Keep your start- and end-of-year odometer readings yourself.",
      },
      {
        type: "h2",
        text: "Deadlines for the 2026 Tax Year",
      },
      {
        type: "p",
        text: "Self-employed individuals file by June 15, but any balance owing is due by April 30. For 2025 returns those dates were April 30 and June 15, 2026. The same rules put them at April 30 and June 15, 2027 for 2026, but the CRA had not published its dated 2026 calendar when this was written, so confirm before you file.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "Can I just claim the 73-cents-per-kilometre rate on my T2125?",
        a: "No. That rate is the limit on tax-free allowances employers pay employees. A sole proprietor claims the business share of actual vehicle costs through Chart A and line 9281, plus CCA on line 9936.",
      },
      {
        type: "faq",
        q: "Is driving from home to a client's office deductible?",
        a: "It depends where your business is based. If your home is the base of your business operations and you have no office elsewhere, trips out to clients can count as business travel. If you have an office or other fixed workplace, travel between home and that workplace is personal.",
      },
      {
        type: "faq",
        q: "Do I have to keep a logbook every year?",
        a: "You need one full 12-month logbook to set a base year. After that, a three-month sample logbook each year is enough, as long as the calculated annual business use stays within 10 percentage points of the base year.",
      },
      {
        type: "faq",
        q: "Are parking costs reduced by my business-use percentage?",
        a: "No. The CRA lets you deduct the full amount of parking fees related to your business, and supplementary business insurance, without prorating them.",
      },
      {
        type: "faq",
        q: "Can I deduct my full lease payment?",
        a: "Not always. For a passenger vehicle, Chart C caps the eligible leasing cost at the lesser of a $1,100-a-month limit and a limit tied to the manufacturer's list price. The capped amount is then reduced to your business-use share.",
      },
      {
        type: "faq",
        q: "I bought a car in 2026 for $45,000. What can I claim?",
        a: "If it is a passenger vehicle, it goes into its own Class 10.1 and its capital cost is capped at $39,000 plus GST/HST or PST on that amount. CCA is claimed at 30% on the capped amount, subject to the first-year rules in Guide T4002, and reduced to your business-use share. A zero-emission passenger vehicle goes into Class 54 instead, with a $61,000 ceiling.",
      },
      {
        type: "faq",
        q: "I'm an employee, not self-employed. Do these rules apply?",
        a: "Partly. Employees claim on line 22900 using Form T777, and only if the CRA's conditions are met, including a Form T2200 signed by the employer and no non-taxable vehicle allowance. The logbook and business-use rules are the same.",
      },
      {
        type: "sources",
        links: [
          {
            label: "2026 automobile limits",
            href: "https://www.canada.ca/en/department-finance/news/2026/01/government-announces-the-2026-automobile-deduction-limits-and-expense-benefit-rates-for-businesses.html",
          },
          {
            label: "T4002, Chapter 3 (line 9281)",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4002/t4002-5.html",
          },
          {
            label: "T4002, Chapter 4 (CCA)",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4002/t4002-6.html",
          },
          {
            label: "Form T2125 (2025)",
            href: "https://www.canada.ca/content/dam/cra-arc/formspubs/pbg/t2125/t2125-25e.pdf",
          },
          {
            label: "Motor vehicle records",
            href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/sole-proprietorships-partnerships/business-expenses/motor-vehicle-expenses/motor-vehicle-records.html",
          },
          {
            label: "Type of vehicle",
            href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/sole-proprietorships-partnerships/business-expenses/motor-vehicle-expenses/type-vehicle.html",
          },
          {
            label: "Calculating motor vehicle expenses",
            href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/sole-proprietorships-partnerships/report-business-income-expenses/completing-form-t2125/calculating-motor-vehicle-expenses.html",
          },
          {
            label: "Leasing costs",
            href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/sole-proprietorships-partnerships/business-expenses/motor-vehicle-expenses/deductible-expenses/motor-vehicle-leasing-costs.html",
          },
          {
            label: "Accelerated investment incentive",
            href: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/sole-proprietorships-partnerships/report-business-income-expenses/claiming-capital-cost-allowance/accelerated-investment-incentive.html",
          },
          {
            label: "IT-521R (archived)",
            href: "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/it521r/archived-motor-vehicle-expenses-claimed-self-employed-individuals.html",
          },
        ],
        checked:
          "All read on canada.ca on October 6, 2026. Guide T4002 and Form T2125 are the 2025 editions, the newest published. This is general information, not tax advice.",
      },
    ],
  },

  {
    slug: "mileage-tracking-apps-canada",
    title: "Best Mileage Tracking Apps for Canadian Freelancers (2026)",
    excerpt:
      "What self-employed Canadians need from a mileage app, five 2026 options compared: prices, free tiers, auto-tracking, and why 73¢/km isn't your deduction.",
    category: "Mileage & Auto",
    publishedAt: "2026-10-05",
    updatedAt: "2026-10-06",
    imageUrl: "https://picsum.photos/seed/mileage-tracking-apps-canada/600/400",
    imageAlt: "Mileage tracking app on smartphone for Canadian freelancer CRA compliance",
    tags: [
      "mileage tracking app",
      "app comparison",
      "logbook",
      "business-use percentage",
      "T2125",
      "CRA",
      "self-employed",
    ],
    clusterPillar: "mileage-deduction-canada-freelancers",
    clusterName: "Mileage & Vehicle Deductions",
    relatedSlugs: [
      "mileage-deduction-canada-freelancers",
      "t2125-form-guide-canada",
      "receipt-scanner-apps-canada-comparison",
    ],
    body: [
      {
        type: "p",
        text: "If you are self-employed in Canada and drive for work, a mileage app has one job at tax time: give you a logbook that holds up if the CRA asks, and from it, the share of your driving that was for business. That share, your business-use percentage, is what you apply to your actual vehicle costs on Form T2125. This guide sets out what a Canadian sole proprietor actually needs from a mileage app, then measures five apps that sell to Canadians against those needs.",
      },
      {
        type: "p",
        text: "We make ReceiptOne, and it is not part of this comparison. Every price and feature below comes from each vendor's own pages, read on October 5, 2026. Where a vendor does not publish something, or its help centre would not load for us, the table says \"not stated\". That does not mean the feature is missing, only that we could not confirm it. Check the vendor's page before you buy.",
      },
      {
        type: "h2",
        text: "What a Mileage App Can and Cannot Give You",
      },
      {
        type: "p",
        text: "For a sole proprietor there is no per-kilometre deduction. The CRA's motor vehicle expenses page gives one method: business kilometres divided by total kilometres, multiplied by your total vehicle expenses. You work it out in Chart A of Form T2125 and the result goes on line 9281. The expenses are what the vehicle actually cost you: fuel, insurance, registration, repairs, and interest or leasing within the CRA limits. Capital cost allowance is calculated separately, and the business-use percentage applies to it too.",
      },
      {
        type: "p",
        text: "The per-kilometre figures quoted everywhere, 73 cents for the first 5,000 km and 67 cents after that in the provinces for 2026, are something else. The Department of Finance announcement of January 14, 2026 calls them \"the limit on the deduction of tax-exempt allowances paid by employers to employees who use their personal vehicle for business purposes.\" They cap what an employer can pay an employee tax-free. They are not a deduction method for someone filing a T2125.",
      },
      {
        type: "callout",
        text: "If an app tells a self-employed Canadian to multiply business kilometres by the CRA rate and claim the result, it is describing the employee allowance, not your deduction. What a mileage app gives you is a logbook and a business-use percentage. The deduction comes from your receipts.",
      },
      {
        type: "p",
        text: "The Canadian guides from MileIQ, Driversnote, Everlance and TripLog all say this correctly. The risk is in the reports: some apps put a dollar value on each trip using a per-kilometre rate, and Driversnote's homepage demo shows a rate multiplied by distance. That figure is not your line 9281 amount. TripLog's Canadian guide also lists 72 and 66 cents as the 2026 rates; those are the 2025 figures.",
      },
      {
        type: "h2",
        text: "What You Need From a Mileage App",
      },
      {
        type: "p",
        text: "Three things decide whether an app is useful to a sole proprietor at tax time. Features beyond them, such as maps, team dashboards or reimbursement workflows, are built for employers and mostly do not matter to you.",
      },
      {
        type: "h2",
        text: "1. The Logbook Fields the CRA Asks For",
      },
      {
        type: "p",
        text: "The CRA's motor vehicle records page asks for each business trip's date, destination, purpose and kilometres, plus each vehicle's odometer reading at the start and end of the fiscal period. After one full year of logbook (the base year), you can keep a three-month sample logbook in later years if the result stays within 10% of the base year.",
      },
      {
        type: "p",
        text: "Most apps capture date, addresses and distance on their own. Purpose is the field that goes missing: an app can tell where you drove, not why, so check that it lets you add a purpose to each trip and that the purpose appears in the report. \"Client meeting, Smith renovation\" is a purpose; \"business\" is only a category. Then check where the odometer readings live. If the app has no place for them, write them down on the first and last day of your fiscal period and keep them with your logbook.",
      },
      {
        type: "h2",
        text: "2. A Real Business and Personal Split",
      },
      {
        type: "p",
        text: "The odometer readings give you total kilometres, the bottom half of the fraction. An app only knows the trips it recorded. Unless it records every personal drive too, a percentage built from logged trips alone will come out too high.",
      },
      {
        type: "p",
        text: "Apps that detect drives automatically record personal trips as a by-product, which helps, but only while the phone is with you and tracking is on. A drive taken by your partner, or one where your battery died, is in the odometer but not the app. Treat the app's own percentage as a check, and calculate the figure you file from business kilometres in the app over total kilometres from the odometer.",
      },
      {
        type: "h2",
        text: "3. An Export That Supports Chart A",
      },
      {
        type: "p",
        text: "Chart A of Form T2125 needs two numbers from your logbook: kilometres driven for business during the fiscal period and total kilometres driven. Everything else in the chart comes from your receipts. A useful export gives you a full-year trip list with every logbook field, a business kilometre total, and ideally the odometer readings, in a format you or your accountant can open: PDF to keep, CSV or Excel to check the totals.",
      },
      {
        type: "p",
        text: "What a Chart A export should not do is hand you a dollar figure built from a per-kilometre rate. If the report shows one, ignore that column and take only the kilometres.",
      },
      {
        type: "h2",
        text: "Five Apps at a Glance",
      },
      {
        type: "table",
        caption:
          "As published by each vendor on October 5, 2026, before sales tax. CA$ means the vendor lists Canadian dollars; \"currency not stated\" means a dollar sign with no currency and no CAD price we could find.",
        headers: [
          "App",
          "Price",
          "Free tier",
          "Automatic trip detection",
          "CRA logbook fields",
          "Export",
          "Platforms",
        ],
        rows: [
          [
            "MileIQ",
            "Unlimited $13.99/mo, or $11.66/mo billed yearly (currency not stated)",
            "40 drives a month",
            "Yes",
            "Business or personal by swipe; other fields not stated on pages we could read",
            "Not stated on pages we could read",
            "iOS, Android",
          ],
          [
            "Everlance",
            "Starter $8.99/mo or $69.99/yr; Professional $99.99/yr (currency not stated)",
            "30 automatic trips a month, unlimited manual",
            "Yes",
            "Not stated on pages we could read",
            "CSV, PDF",
            "iOS, Android, web",
          ],
          [
            "Driversnote",
            "Pro CA$16/mo (billing period not stated)",
            "15 trips a month",
            "Yes: phone motion sensors; optional iBeacon",
            "Claims \"CRA-compliant vehicle logs\"; demo shows date, addresses, distance, category. Purpose, odometer not stated",
            "PDF, Excel",
            "iOS, Android, web",
          ],
          [
            "TripLog",
            "Premium $4.99/mo, billed yearly as $59.99; CAD option offered, amount not confirmed",
            "Yes, with automatic GPS tracking; annual report is Premium",
            "Yes: GPS; optional Drive and Beacon devices",
            "Not stated",
            "Not stated",
            "iOS, Android; web on Premium",
          ],
          [
            "QuickBooks Lite",
            "From $2/mo promo on Intuit's Canadian site; regular price not shown on the Lite page",
            "No; 30-day trial",
            "Yes: GPS, or manual",
            "Category, business purpose, vehicle; odometer not stated",
            "Mileage log report; tax summary PDF",
            "iOS, Android, web",
          ],
        ],
      },
      {
        type: "sources",
        links: [
          { label: "MileIQ pricing", href: "https://mileiq.com/pricing" },
          { label: "Everlance pricing", href: "https://www.everlance.com/pricing" },
          { label: "Driversnote pricing", href: "https://www.driversnote.ca/pricing" },
          { label: "TripLog pricing", href: "https://triplog.net/pricing" },
          { label: "QuickBooks Lite", href: "https://quickbooks.intuit.com/ca/online/lite" },
        ],
        checked: "Prices checked October 2026",
      },
      {
        type: "p",
        text: "The CRA does not certify mileage apps. \"CRA-compliant\" is a vendor's own description. What makes a log stand up is that it was kept through the year, covers every business trip with the four details above, and is backed by odometer readings.",
      },
      {
        type: "h2",
        text: "MileIQ",
      },
      {
        type: "p",
        text: "MileIQ detects drives automatically and lets you swipe each one to business or personal. Its Canadian rates guide says it \"tracks every kilometre automatically\" and states that the per-kilometre rates do not apply to the self-employed. Suits: someone with many short drives who wants no tapping. Falls short: no currency on the pricing page, and its Canadian report help article was blocked when we tried to read it, so report fields and formats are unconfirmed.",
      },
      {
        type: "h2",
        text: "Everlance",
      },
      {
        type: "p",
        text: "Everlance's free plan detects up to 30 trips a month, with unlimited manual trips, and every plan exports CSV and PDF. Its CRA guide tells self-employed readers they \"cannot multiply your kilometers by $0.73/km\". Suits: a light driver who wants a usable free tier. Falls short: no currency or CAD price on the pricing page, which measures in miles, and its Canadian help article would not load for us.",
      },
      {
        type: "h2",
        text: "Driversnote",
      },
      {
        type: "p",
        text: "Driversnote has a Canadian site priced in CAD, PDF and Excel reports, and automatic detection by the phone's motion sensors or an optional iBeacon in the car. Its CRA guide correctly points the self-employed to actual expenses. Suits: someone who wants CAD pricing and automatic tracking without hardware. Falls short: 15 free trips a month, no billing period shown for CA$16, and a demo that prices each trip at a per-distance rate.",
      },
      {
        type: "h2",
        text: "TripLog",
      },
      {
        type: "p",
        text: "TripLog's free plan includes unlimited automatic GPS tracking, which is generous; downloading an annual report needs Premium. Suits: a heavy driver who wants automatic detection without paying during the year. Falls short: its Canadian guide quotes last year's rates as 2026's, and the pages we read did not state logbook fields or export format.",
      },
      {
        type: "h2",
        text: "QuickBooks Lite",
      },
      {
        type: "p",
        text: "In QuickBooks, mileage is part of the accounting software. Intuit's Canadian Lite page lists automatic kilometre tracking and a mileage log report, and its help article covers adding a business purpose and vehicle to each trip. Suits: a freelancer who also wants invoicing and bank feeds. Falls short: one user, no accountant access, and the Lite page shows only a promotional price.",
      },
      {
        type: "h2",
        text: "How to Choose",
      },
      {
        type: "ul",
        items: [
          "You forget to log trips: pick automatic detection. All five apps here state it.",
          "You want to pay nothing during the year: TripLog's free plan tracks automatically without a cap; Everlance and MileIQ cap free automatic trips at 30 and 40 a month.",
          "You want CAD pricing: Driversnote publishes it, TripLog offers a CAD option, QuickBooks prices on its Canadian site. MileIQ and Everlance show no currency.",
          "You keep your books in QuickBooks: its built-in tracker saves a second app.",
          "Before you pay: use the free tier or trial for a few weeks, then export a report and check it shows a purpose for each trip and a business kilometre total you can carry to Chart A.",
          "Whatever you choose: record your odometer on the first and last day of your fiscal period and keep your vehicle receipts.",
        ],
      },
      {
        type: "p",
        text: "A hypothetical example: a self-employed electrician in Manitoba drives 18,000 km in 2026, 7,200 of them for business. Business use is 40%. Fuel, insurance, registration and repairs total $8,500, so $3,400 goes on line 9281, before capital cost allowance. An app pricing 7,200 km at 73 and 67 cents would show about $5,124, which is the employee allowance cap, not a deduction. Claiming it would overstate their expenses by more than $1,700.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "Can I deduct 73 cents a kilometre as a self-employed Canadian?",
        a: "No. That rate caps tax-free allowances employers pay employees. A sole proprietor deducts actual vehicle expenses multiplied by business-use percentage, using Chart A of Form T2125, on line 9281.",
      },
      {
        type: "faq",
        q: "Do I need a mileage app to claim vehicle expenses?",
        a: "No. A paper logbook or spreadsheet with each business trip's date, destination, purpose and kilometres, plus start and end odometer readings, meets the CRA's description. An app makes it easier to record trips as they happen.",
      },
      {
        type: "faq",
        q: "Does the CRA certify mileage apps?",
        a: "No. \"CRA-compliant\" is the vendor's own description. What counts is a complete log backed by odometer readings.",
      },
      {
        type: "faq",
        q: "Do I have to keep a full logbook every year?",
        a: "No. After one full base year, the CRA accepts a three-month sample logbook in later years, as long as business use stays within 10% of the base year.",
      },
      {
        type: "faq",
        q: "Why does my business-use percentage need odometer readings?",
        a: "The percentage is business kilometres over total kilometres, and the odometer is the reliable record of the total. An app that logged only business trips does not know it.",
      },
      {
        type: "faq",
        q: "Is automatic trip detection worth paying for?",
        a: "If you make many short business drives, usually yes, because missed trips are the usual gap in a logbook. You still classify each trip and add its purpose. A few client visits a week can be entered by hand.",
      },
      {
        type: "callout",
        text: "Sources, read on October 5, 2026: canada.ca motor vehicle expenses (canada.ca/en/revenue-agency/services/tax/businesses/small-businesses-self-employed-income/business-income-tax-reporting/business-expenses/motor-vehicle-expenses.html), motor vehicle records (canada.ca/en/revenue-agency/services/tax/businesses/topics/sole-proprietorships-partnerships/business-expenses/motor-vehicle-expenses/motor-vehicle-records.html), Guide T4002 chapter 3 (canada.ca/en/revenue-agency/services/forms-publications/publications/t4002/t4002-5.html), Department of Finance 2026 rates (canada.ca/en/department-finance/news/2026/01/government-announces-the-2026-automobile-deduction-limits-and-expense-benefit-rates-for-businesses.html). Vendors: mileiq.com/pricing, mileiq.com/mileage-guide/current-mileage-rates-for-canada-2026, everlance.com/pricing, everlance.com/business-mileage-hub/cra-mileage-rate, driversnote.ca, driversnote.ca/pricing, driversnote.ca/cra-mileage-guide, triplog.net/pricing, triplog.net/blog/how-to-claim-cra-approved-vehicle-expenses-in-canada, quickbooks.intuit.com/ca/online/lite, quickbooks.intuit.com/ca/mileage-tracker, and Intuit's Canadian help article on automatic mileage tracking. Tell us if a vendor has changed something and we'll update this page.",
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
        type: "faq",
        q: "Is the 2026 Form T2125 available yet?",
        a: "Not as of October 5, 2026. The newest form and Guide T4002 on canada.ca are the 2025 editions.",
      },
      {
        type: "faq",
        q: "When is my 2026 T2125 due?",
        a: "It goes in with your return. For 2025 returns, T4002 sets a June 15, 2026 filing date for self-employed people, with any balance owing due April 30. The same rule points to June 15, 2027 for 2026 returns, but confirm it in the 2026 guide.",
      },
      {
        type: "faq",
        q: "Do I need a separate T2125 for each business?",
        a: "Yes. You also need separate forms if you have both business and professional income.",
      },
      {
        type: "faq",
        q: "Can I ever deduct 100% of a meal?",
        a: "Yes, in some cases, such as meals you bill to a client and show on the invoice, or up to six all-employee events a year.",
      },
      {
        type: "faq",
        q: "What happens to home office costs I can't deduct this year?",
        a: "They carry forward as amount 7O. You can claim them in a later year when your business income is high enough, as long as you still meet one of the workspace conditions.",
      },
      {
        type: "faq",
        q: "Where does depreciation on my car go?",
        a: "Add the car in Area B, calculate CCA in Area A and claim it on line 9936. Chart A covers operating costs only.",
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
    updatedAt: "2026-10-06",
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
            "Pro CA$9.90/mo or CA$99/yr (50 documents a month); Elite CA$17.90/mo or CA$179/yr (unlimited documents, fair use); Founder pack CA$729 first year (CA$550 one-time setup plus Elite at CA$179/yr; yearly only)",
            "No; 7-day free trial on Pro and Elite, none on the Founder pack",
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
        type: "sources",
        links: [
          { label: "SparkReceipt pricing", href: "https://sparkreceipt.com/en-ca/pricing" },
          { label: "Foreceipt pricing", href: "https://foreceipt.com/pricing" },
          { label: "Expensify pricing", href: "https://www.expensify.com/pricing" },
          { label: "QuickBooks Canada pricing", href: "https://quickbooks.intuit.com/ca/pricing" },
          { label: "Wave pricing", href: "https://www.waveapps.com/pricing" },
          { label: "ReceiptOne pricing", href: "/ca#pricing" },
        ],
        checked: "Prices checked October 2026",
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
        text: "SparkReceipt publishes a Canadian pricing page in Canadian dollars with three tiers: Pro, Elite, and a Founder pack, which is Elite plus a one-time CA$550 hands-on setup, billed yearly with no trial. Its US page lists Pro and Elite in US dollars instead (US$6.90 and US$12.90 a month, billed monthly), so a SparkReceipt price quoted elsewhere may not be the Canadian one. It states that it extracts GST, HST and PST from receipts, keeping the amounts in reports for input tax credits and T2125. Pro and Elite also include automatic import from a connected email inbox, a live bank feed, bank statement matching, and a mileage tracker that records trips by GPS or by hand.",
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
      "QuickBooks Lite vs ReceiptOne for self-employed Canadians in 2026: prices in CAD, invoicing, bank sync, mileage, GST/HST/PST and exports.",
    category: "Tools & Apps",
    publishedAt: "2026-10-05",
    updatedAt: "2026-10-06",
    imageUrl: "https://picsum.photos/seed/quickbooks-vs-receiptone-canada/600/400",
    imageAlt: "Canadian freelancer comparing accounting software options on laptop",
    tags: [
      "QuickBooks",
      "QuickBooks Lite",
      "ReceiptOne",
      "accounting software",
      "GST/HST",
      "mileage",
      "freelancer",
      "Canada",
    ],
    relatedSlugs: [
      "receipt-scanner-apps-canada-comparison",
      "expense-tracking-canada-freelancers",
      "manual-vs-automated-expense-tracking-canada",
    ],
    body: [
      {
        type: "p",
        text: "The short answer: QuickBooks Lite is bookkeeping software. It sends invoices, pulls in your bank transactions, and tracks income and expenses together, so it suits a freelancer who bills clients and wants one set of books. ReceiptOne is a receipt and expense app. It captures receipts, separates the sales tax on each one, keeps a mileage log, and exports the totals, so it suits a sole proprietor whose main job at tax time is getting expenses in order for Form T2125 or for an accountant. They overlap on receipts and mileage, and they differ on almost everything else.",
      },
      {
        type: "p",
        text: "We make ReceiptOne, so treat this page with that in mind. Every QuickBooks price and feature below comes from Intuit's own Canadian pages, read on October 5, 2026. Where Intuit does not say something, we write \"not stated\" rather than guess. That does not mean QuickBooks lacks the feature, only that we could not confirm it from Intuit. Prices change often, so check Intuit's page before you buy.",
      },
      {
        type: "h2",
        text: "Which QuickBooks Plan This Compares",
      },
      {
        type: "p",
        text: "Intuit says QuickBooks Lite launched in Canada in July 2026 for freelancers, contractors and solopreneurs, and calls it its newest option for a business of one. It is built on QuickBooks Online. Intuit also says QuickBooks Self-Employed is still supported, but its pages do not say whether new customers can still sign up for it, so this comparison uses Lite.",
      },
      {
        type: "p",
        text: "On price: Intuit's Canadian pricing page shows Lite at $20 a month, struck through, with $2 a month beside it. No currency is printed next to either figure; because it is Intuit's Canadian site, we read them as Canadian dollars, but Intuit does not say so on the page. The $2 figure is a promotion. The same page carries a banner for \"90% off QuickBooks + Payroll for 6 months\" with an asterisk, and $2 is 90% off $20, but the terms behind the asterisk sit in a pop-up we could not read, so we cannot confirm that Lite's discount lasts six months. Intuit also says its larger discounts apply only if you choose Buy Now, not the free trial. Budget for $20 a month, before sales tax.",
      },
      {
        type: "h2",
        text: "The Comparison at a Glance",
      },
      {
        type: "table",
        caption:
          "QuickBooks Lite as published on Intuit's Canadian pages on October 5, 2026; ReceiptOne from our own pricing and help pages. Prices are before sales tax. Intuit prints no currency label; we read its figures as CAD.",
        headers: ["", "QuickBooks Lite", "ReceiptOne"],
        rows: [
          [
            "Price",
            "$20/mo regular; promotional $2/mo (no currency shown; promo length not confirmed). 30-day free trial, but the promo price requires skipping the trial",
            "CA$4.99/wk, CA$9.99/mo or CA$129.99/yr. 7-day free trial. No free plan",
          ],
          [
            "What it does",
            "Bookkeeping for one person: income, expenses, invoices, bank transactions, reconciliation, balance sheet",
            "Expense records only: receipts, sales tax per receipt, mileage, home office",
          ],
          [
            "Users",
            "1 user, no accountant access",
            "One account; you share exports with your accountant",
          ],
          [
            "Invoicing",
            "Yes: unlimited invoices and estimates; card and bank-transfer payments",
            "No",
          ],
          [
            "Bank sync",
            "Yes: up to 2 bank connections with automatic transaction import",
            "No",
          ],
          [
            "Mileage",
            "Automatic kilometre tracking with trip categories",
            "Manual: enter start and end addresses and the distance is calculated; no automatic trip detection",
          ],
          [
            "Sales tax",
            "GST, HST and PST calculated and tracked on sales; tax centre",
            "GST, HST, PST or QST labelled on each expense receipt and editable; tax you collect is not tracked",
          ],
          [
            "Receipts",
            "Photo upload, matched to bank transactions",
            "Camera, photo or PDF upload, or our Telegram bot; unlimited. Email forwarding not available yet",
          ],
          [
            "Reports and exports",
            "5 report templates: profit and loss, tax summary, tax details, mileage log, receipts summary. T2125 export not stated",
            "PDF and CSV reports, including a T2125 report you or your accountant use when filling the form",
          ],
          [
            "Platforms",
            "Web; iOS and Android apps",
            "iOS, Android and web",
          ],
        ],
      },
      {
        type: "sources",
        links: [
          { label: "QuickBooks Canada pricing", href: "https://quickbooks.intuit.com/ca/pricing" },
          { label: "ReceiptOne pricing", href: "/ca#pricing" },
        ],
        checked: "Prices checked October 2026",
      },
      {
        type: "p",
        text: "Neither product files your return. QuickBooks' pages do not say it produces a T2125, and ReceiptOne's T2125 report is a summary of your expenses by category that you or your accountant copy into the form; it does not prepare or file it.",
      },
      {
        type: "h2",
        text: "What QuickBooks Does That ReceiptOne Does Not",
      },
      {
        type: "p",
        text: "Most of the difference is that QuickBooks keeps books and ReceiptOne keeps expense records. Specifically:",
      },
      {
        type: "ul",
        items: [
          "An accounting ledger. Lite gives you a preset chart of accounts, account reconciliation and a balance sheet. ReceiptOne has categories for expenses but no ledger, no reconciliation and no balance sheet.",
          "Invoicing. Lite sends unlimited invoices and estimates and lets clients pay by card or bank transfer. ReceiptOne does not invoice.",
          "Bank feeds. Lite connects up to two bank accounts, imports transactions and matches receipt photos to them. ReceiptOne has no bank connection, so it will not catch a card charge you forgot to photograph.",
          "Income tracking. Lite records what you earn alongside what you spend, so its profit and loss report shows your net business income. ReceiptOne tracks expenses only: no income, and no GST/HST you collect from clients.",
          "Sales tax on what you sell. Lite calculates GST, HST and PST on your invoices and tracks it in a tax centre. If you are registered for GST/HST, you need a record of the tax you collect as well as the tax you paid, and ReceiptOne only covers the second half.",
          "Automatic mileage. Lite says it tracks kilometres automatically. In ReceiptOne you add each trip yourself.",
        ],
      },
      {
        type: "p",
        text: "If you invoice clients, file GST/HST returns, or want your income and expenses to reconcile against your bank, those features are the reason to pick bookkeeping software. ReceiptOne does not replace it.",
      },
      {
        type: "h2",
        text: "What ReceiptOne Does More Simply",
      },
      {
        type: "p",
        text: "ReceiptOne does less, and that is the point of it. If your books are simple, or someone else keeps them, the expense side is often the part that slips, and that is the part ReceiptOne covers.",
      },
      {
        type: "ul",
        items: [
          "Receipt capture. Photograph a receipt or upload a photo or PDF, and ReceiptOne reads the merchant, date, total and tax lines. Scanning is unlimited on every plan. You do not need a bank connection for a receipt to be recorded.",
          "GST/HST/PST per receipt. Each tax line on a receipt is labelled GST, HST, PST or QST, and when a receipt shows only a total, ReceiptOne splits the tax using your province's rates. You can correct anything it reads wrongly. Lite's pages describe sales tax tracking but do not say whether it reads the tax lines from a receipt photo.",
          "Mileage logbook. You enter a trip's start and end addresses and ReceiptOne works out the distance, building a log with dates, distances and purposes. It takes a minute per trip, which some people prefer to reviewing trips an automatic tracker recorded, and others will find tedious.",
          "Expense export. A PDF or CSV of your expenses by category, plus mileage and home office, ready to hand to an accountant or to use when you fill T2125. There is no ledger to learn first.",
        ],
      },
      {
        type: "p",
        text: "What ReceiptOne will not do: it has no bank sync, no automatic trip detection, no income tracking, no invoicing, and no free plan, only a 7-day trial. Email forwarding of receipts has not shipped yet.",
      },
      {
        type: "h2",
        text: "How to Choose",
      },
      {
        type: "p",
        text: "Start from what you do with your money each month, not from the feature list.",
      },
      {
        type: "ul",
        items: [
          "You invoice clients and want income, expenses and bank in one place: QuickBooks Lite. Remember Lite has no accountant access, so if someone else does your books, check whether you need a higher QuickBooks plan.",
          "You are registered for GST/HST and file returns yourself: you need a record of the tax you collect. QuickBooks tracks it; ReceiptOne does not.",
          "You mostly need receipts, sales tax on purchases and a mileage log for T2125 or for your accountant: ReceiptOne asks less of you and has no ledger to maintain.",
          "You drive a lot and do not want to log trips: Lite's automatic tracking saves the habit ReceiptOne needs.",
          "Your clients pay you through a platform that already gives you an income summary: an expense app may be all you are missing.",
        ],
      },
      {
        type: "h2",
        text: "The Case for Using Both",
      },
      {
        type: "p",
        text: "Some people use both: QuickBooks for invoicing, income and bank reconciliation, and ReceiptOne for capturing receipts and logging trips through the year. That costs more than either alone, so it only makes sense if ReceiptOne's receipt capture or per-receipt tax labels save you real time. If you go that way, decide which tool is the record for expenses, so the same receipt is not entered twice, and export ReceiptOne's CSV for your bookkeeper or accountant to bring across.",
      },
      {
        type: "p",
        text: "A hypothetical example: a web designer in Nova Scotia invoices a handful of clients each month and is registered for HST. They need to bill clients and track the HST they charge, so bookkeeping software such as QuickBooks Lite covers the core of their business. A second hypothetical: a delivery driver in Alberta who is paid through an app that reports their earnings, has no invoices to send, and buys fuel and phone plans. Their gap is receipts and a mileage log for T2125, which an expense app covers without a ledger.",
      },
      {
        type: "p",
        text: "Whichever you choose, keep your receipt images and a copy of your year-end export somewhere you control. The CRA generally expects you to keep records for six years.",
      },
      {
        type: "callout",
        text: "Sources: Intuit pages read on October 5, 2026 — quickbooks.intuit.com/ca/pricing, quickbooks.intuit.com/ca/online/lite, and quickbooks.intuit.com/ca/resources/running-a-business/quickbooks-plans-for-self-employed. Not stated by Intuit: the currency of its prices, how long the $2 promotion lasts, whether Lite produces a T2125, and whether it reads tax lines from receipt photos. ReceiptOne details are from our own pricing and help pages. Tell us if something has changed and we'll update this page.",
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
        type: "faq",
        q: "How do I know a CRA call is genuine?",
        a: "Take the caller's name, number and office location, hang up, and confirm through the CRA's own enquiry lines before sharing anything. Demands for gift cards or cryptocurrency, or threats of arrest, are scam red flags.",
      },
      {
        type: "faq",
        q: "What is the difference between a review and an audit?",
        a: "A review checks that specific amounts on your return are supported, usually by asking for documents. An audit examines your books and records more broadly, may happen on-site, and ends with a proposal letter if changes are needed.",
      },
      {
        type: "faq",
        q: "How long do I have to respond?",
        a: "For a review, the time frame is in the letter, and you can call the number on it to ask for more time. For an audit proposal letter, you have 30 days to agree or disagree.",
      },
      {
        type: "faq",
        q: "Can my accountant deal with the CRA for me?",
        a: "Yes, once you authorize them, most quickly through My Account. Authorizing a representative does not remove your own responsibility for your records.",
      },
      {
        type: "faq",
        q: "Do I have to pay a reassessment I am objecting to?",
        a: "The Taxpayer Bill of Rights says you have the right not to pay income tax amounts in dispute before an impartial review, unless the law provides otherwise.",
      },
      {
        type: "faq",
        q: "Can I still use the Voluntary Disclosures Program if the CRA has written to me?",
        a: "Since October 1, 2025, applications prompted by a CRA communication can be accepted, normally with partial relief. It is restricted once you are under audit or investigation.",
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
          : block.type === "sources"
            ? [...block.links.map((l) => l.label), block.checked]
            : block.type === "faq"
              ? [block.q, block.a]
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

export const FAQ_HEADING = "Frequently Asked Questions";

/**
 * Q&A pairs for the FAQPage schema: the article's faq blocks, in order. The
 * question and answer are separate fields, so a "?" in either cannot change
 * the split. scripts/check-articles.mjs fails the build if a faq block sits
 * outside the FAQ section or anything else is rendered inside it.
 */
export function articleFaq(article: Article): { q: string; a: string }[] {
  return article.body.flatMap((b) => (b.type === "faq" ? [{ q: b.q, a: b.a }] : []));
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
