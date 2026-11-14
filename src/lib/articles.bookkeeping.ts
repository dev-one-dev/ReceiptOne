/**
 * Bookkeeping cluster (CA only): five practical guides for sole proprietors.
 * Appended to ARTICLES in src/lib/articles.ts. Every CRA rule and number below
 * was read on the canada.ca pages listed in each article's sources block on
 * November 14, 2026. Examples are hypothetical and labelled that way.
 */
import type { Article } from "@/lib/articles";

const CRA = "https://www.canada.ca/en/revenue-agency";
const SRC = {
  businessRecords: {
    label: "Business records",
    href: `${CRA}/services/tax/businesses/topics/sole-proprietorships-partnerships/business-records.html`,
  },
  retention: {
    label: "How long to keep records",
    href: `${CRA}/services/tax/businesses/topics/keeping-records/where-keep-your-records-long-request-permission-destroy-them-early.html`,
  },
  format: {
    label: "Acceptable format and imaging",
    href: `${CRA}/services/tax/businesses/topics/keeping-records/acceptable-format-imaging-paper-documents-backing-electronic-files.html`,
  },
  gstRecords: {
    label: "GST/HST records",
    href: `${CRA}/services/tax/businesses/topics/keeping-records/gst-hst-payroll-records.html`,
  },
  vehicleRecords: {
    label: "Motor vehicle records",
    href: `${CRA}/services/tax/businesses/topics/sole-proprietorships-partnerships/business-expenses/motor-vehicle-expenses/motor-vehicle-records.html`,
  },
  t4002Expenses: {
    label: "T4002, Chapter 3 – Expenses",
    href: `${CRA}/services/forms-publications/publications/t4002/t4002-5.html`,
  },
  t4002Cca: {
    label: "T4002, Chapter 4 – CCA",
    href: `${CRA}/services/forms-publications/publications/t4002/t4002-6.html`,
  },
  homeOffice: {
    label: "Business-use-of-home expenses",
    href: `${CRA}/services/tax/businesses/topics/sole-proprietorships-partnerships/report-business-income-expenses/completing-form-t2125/business-use-home-expenses.html`,
  },
  gstRegister: {
    label: "When to register for GST/HST",
    href: `${CRA}/services/tax/businesses/topics/gst-hst-businesses/when-register-charge.html`,
  },
  gstDeadlines: {
    label: "GST/HST filing deadlines",
    href: `${CRA}/services/tax/businesses/topics/gst-hst-businesses/file-gst-hst-return/reporting-requirements-deadlines.html`,
  },
  instalmentsWho: {
    label: "Instalments: who has to pay",
    href: `${CRA}/services/payments/payments-cra/individual-payments/income-tax-instalments/who-pays-instalments.html`,
  },
  instalmentDates: {
    label: "Instalment due dates",
    href: `${CRA}/services/payments/payments-cra/individual-payments/income-tax-instalments/due-dates.html`,
  },
  importantDates: {
    label: "Important dates for individuals",
    href: `${CRA}/services/tax/individuals/topics/important-dates-individuals.html`,
  },
  feesForService: {
    label: "Reporting fees for service",
    href: `${CRA}/programs/about-canada-revenue-agency-cra/compliance/reporting-fees-for-service.html`,
  },
};

const CHECKED =
  "All read on canada.ca on November 14, 2026. Guide T4002 is the 2025 edition, the newest published. This is general information, not tax advice.";

/** The closing call to action inside each "How ReceiptOne helps" box. */
const CTA = { label: "See how ReceiptOne works.", href: "/ca" };

const article = (slug: string) => `/articles/${slug}`;
const DEADLINES = "/ca/tax-deadlines";

export const BOOKKEEPING_ARTICLES: Article[] = [
  /* ─────────────────────────────── 1 ─────────────────────────────── */
  {
    slug: "bookkeeping-self-employed-canada",
    title: "Bookkeeping for Self-Employed Canadians: A Plain-English Guide",
    excerpt:
      "What bookkeeping means for a Canadian sole proprietor: what to record, how long to keep it, a simple habit-based system, and how it feeds Form T2125.",
    category: "Bookkeeping",
    publishedAt: "2026-11-14",
    updatedAt: "2026-11-14",
    image: {
      path: "/articles/bookkeeping-self-employed-canada.webp",
      width: 1280,
      height: 720,
      alt: "Three small succulents in white pots behind a phone and an open notebook with a pen on a white desk",
    },
    tags: ["bookkeeping", "self-employed", "sole proprietor", "CRA", "record keeping", "T2125"],
    clusterName: "Bookkeeping Basics",
    relatedSlugs: [
      "daily-receipt-routine",
      "month-end-bookkeeping-checklist-canada",
      "year-end-checklist-accountant-canada",
    ],
    quickAnswer:
      "Bookkeeping for a sole proprietor means keeping a record of every dollar your business earns and spends, with a document behind each entry. The CRA requires records that support your income and expense claims, kept for six years from the end of the tax year they relate to. A short daily habit and a monthly check keep the job small, and at year end your totals go onto Form T2125.",
    receiptOneHelps: {
      items: [
        "Photograph a paper receipt, upload an image or PDF, or forward an e-mail receipt to your own ReceiptOne address, and ReceiptOne reads the details for you to check.",
        "Bulk upload a batch of photos or PDFs if you are catching up; ReceiptOne sorts them into categories and flags duplicates.",
        "Turn on trip tracking and the app records your work trips by GPS in the background, building a mileage logbook you can export.",
        "Export your records as a CRA-ready PDF or CSV report at year end, or type /report to the Telegram bot to get your annual tax report in the chat.",
      ],
      link: CTA,
    },
    body: [
      {
        type: "p",
        text: "If you work for yourself in Canada and have not set up a company, you are a sole proprietor. You and the business are the same taxpayer, and the business's income and expenses go on your own return through Form T2125, Statement of Business or Professional Activities. Bookkeeping is the work of keeping the records behind that form.",
      },
      {
        type: "p",
        text: "This guide explains what to record, a habit-based way to keep up with it, and what the CRA says about keeping records. Every rule comes from canada.ca, and the pages are listed at the end.",
      },
      {
        type: "h2",
        text: "What Bookkeeping Means When You Work for Yourself",
      },
      {
        type: "p",
        text: "The CRA's business records page says you are required by law to keep records of all your transactions so you can support your income and expense claims. A record is defined broadly: invoices, vouchers, statements, images, letters and any other proof containing information, in writing or in any other form.",
      },
      {
        type: "p",
        text: "The CRA does not issue record books and does not suggest any particular book or system. It says you can use a book with columns and separate pages for income and expenses, and that computerized records must be clear and easy to read. If you run more than one business, keep separate records for each one.",
      },
      {
        type: "p",
        text: "So bookkeeping does not have to be complicated. What matters is that every amount you report can be traced back to a document, and that you can find that document if the CRA asks. The same page reminds you not to send your records with your return, but to keep them in case the CRA asks to see them later.",
      },
      {
        type: "h2",
        text: "What to Record",
      },
      {
        type: "h3",
        text: "Income",
      },
      {
        type: "p",
        text: "Keep track of your gross income, which is your total income before any expenses. The CRA says each income record must include the date, the amount and the source, and that you record income whether you were paid in cash, property or services. Support each entry with original documents, such as:",
      },
      {
        type: "ul",
        items: [
          "Sales invoices you issued",
          "Cash register tapes and receipts",
          "Bank deposit slips",
          "Fee statements",
          "Contracts",
        ],
      },
      {
        type: "h3",
        text: "Expenses and receipts",
      },
      {
        type: "p",
        text: "Always get a receipt or other voucher when you buy something for the business. The CRA lists what the receipt has to show: the date, the seller's name and address, your name and address, a full description of the goods or services, and the vendor's business number if they are a GST/HST registrant and the purchase is $100 or more before tax.",
      },
      {
        type: "p",
        text: "When a receipt has no description, as with a cash register tape, write the description on the receipt or in your expense journal. When a seller gives you no receipt at all, write the seller's name and address, the amount, the date and the details of the purchase in your expense journal.",
        link: {
          label: "Read our guide to CRA receipt rules.",
          href: article("cra-receipt-rules-canada"),
        },
      },
      {
        type: "h3",
        text: "Kilometres",
      },
      {
        type: "p",
        text: "If you use a vehicle for work, the kilometres are a record too. The CRA asks you to keep a log of each business trip with the date, destination, purpose and number of kilometres, and to record the odometer reading at the start and end of your fiscal period. Without that log, the business share of your vehicle costs is hard to support.",
        link: {
          label: "See our mileage deduction guide.",
          href: article("mileage-deduction-canada-freelancers"),
        },
      },
      {
        type: "h3",
        text: "Bank records",
      },
      {
        type: "p",
        text: "Keep your duplicate deposit slips, bank statements and cancelled cheques. A statement on its own is not a receipt, because it shows that you paid but not what you bought, but it is how you check that every business transaction has a document behind it.",
      },
      {
        type: "h2",
        text: "A Simple System Built on Habits",
      },
      {
        type: "p",
        text: "Bookkeeping goes wrong when it waits. A system that runs on small, regular habits is easier to keep than one big session in spring. Here is a rhythm that works for a one-person business:",
      },
      {
        type: "ul",
        items: [
          "Daily, a few minutes: capture the day's receipts, forward e-mail receipts, and note what each purchase was for.",
          "As it happens: log business trips, and issue and save every invoice.",
          "Monthly: match receipts to your bank and card statements, find what is missing, review categories and set money aside for tax.",
          "Yearly: total everything by category and put together what you or your accountant need for your return.",
        ],
      },
      {
        type: "p",
        text: "Each step has its own guide. The daily step takes about five minutes once it is a habit.",
        link: {
          label: "Start with the daily receipt routine.",
          href: article("daily-receipt-routine"),
        },
      },
      {
        type: "p",
        text: "Once a month, a short review catches problems while they are still easy to fix.",
        link: {
          label: "Use our month-end checklist.",
          href: article("month-end-bookkeeping-checklist-canada"),
        },
      },
      {
        type: "h3",
        text: "Keep everything in one place",
      },
      {
        type: "p",
        text: "Choose one home for your records, whether that is a folder, a spreadsheet or an app, and use it every time. If you scan paper receipts, the CRA says the image must be an accurate reproduction that gives the same information as the paper, with no significant details hidden by limits of resolution, tone or colour. Paper originals generally have to be kept unless your imaging follows the national standard. Documents that started out electronic, like e-mailed receipts, must be kept in an electronic readable format even if you print them.",
        link: {
          label: "Read whether digital receipts are valid.",
          href: article("digital-receipts-canada-are-they-valid"),
        },
      },
      {
        type: "h3",
        text: "Keep business and personal money apart",
      },
      {
        type: "p",
        text: "You cannot deduct personal expenses, and for anything used both ways you claim only the business part. Running business money through its own account and card makes that line much easier to draw.",
        link: {
          label: "See how to separate business and personal finances.",
          href: article("separate-business-personal-finances-canada"),
        },
      },
      {
        type: "h2",
        text: "How Your Records Feed Form T2125",
      },
      {
        type: "p",
        text: "At year end, your bookkeeping becomes Form T2125. Your income records give you gross income in Part 3. Your expense records, grouped by category, fill the expense lines in Part 4. Your vehicle log and costs go into Chart A, and your home workspace costs go into Part 7.",
      },
      {
        type: "p",
        text: "Guide T4002 sets two rules that shape those totals. Enter only the business part of each expense, since personal expenses are not deductible. And if you claim the GST/HST you paid as input tax credits, reduce the expense by that amount. Capital purchases, such as a computer, do not go on an expense line; they are claimed through capital cost allowance instead.",
        link: {
          label: "Read our line-by-line T2125 guide.",
          href: article("t2125-form-guide-canada"),
        },
      },
      {
        type: "h2",
        text: "What Happens If You Leave It Until April",
      },
      {
        type: "p",
        text: "You can rebuild a year of records from bank statements, e-mails and a shoebox, but some things are hard to recover. Printing on paper receipts can fade. You may not remember which lunch was with a client or why you drove across town in March. Kilometres you never logged cannot be measured after the fact, and the CRA's vehicle page asks for a record of each trip.",
      },
      {
        type: "p",
        text: "Time is the other problem. Self-employed individuals have until June 15 to file, but any balance owing is due by April 30, so you need your numbers before the end of April even though the return itself can wait. For 2025 returns those dates were April 30 and June 15, 2026.",
        link: {
          label: "Check the current CRA deadlines.",
          href: DEADLINES,
        },
      },
      {
        type: "p",
        text: "If the CRA reviews a claim and you cannot support it, it may disallow the expense. Records you kept as you went are the simplest answer to a review letter.",
      },
      {
        type: "h2",
        text: "How Long to Keep Your Records",
      },
      {
        type: "p",
        text: "The CRA's general rule is six years from the end of the last tax year the records relate to. For individuals the tax year is the calendar year, so the clock starts on December 31, not on the date of the receipt. If you file a return late, keep the records for six years from the date you file it. The same retention rules apply to GST/HST records.",
      },
      {
        type: "p",
        text: "Hypothetical example: a receipt dated March 3, 2026 relates to your 2026 tax year. If you file that return on time, keep the receipt until at least December 31, 2032.",
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "Do I need bookkeeping software to meet CRA requirements?",
        a: "No. The CRA does not issue record books or suggest any type of book or system. Computerized records must be clear and easy to read, and every entry should be supported by a document.",
      },
      {
        type: "faq",
        q: "What does a sole proprietor need to record?",
        a: "Every amount of income with its date, amount and source, every business expense with a receipt or other voucher, kilometres driven for business, and bank records such as statements and deposit slips.",
      },
      {
        type: "faq",
        q: "How long do I have to keep my business records?",
        a: "Generally six years from the end of the last tax year they relate to. For individuals the tax year is the calendar year. If you file late, it is six years from the date you file.",
      },
      {
        type: "faq",
        q: "Do I send my receipts with my tax return?",
        a: "No. The CRA says not to send your records with your return, but to keep them in case it asks to see them later.",
      },
      {
        type: "faq",
        q: "Can I catch up on a year of bookkeeping in April?",
        a: "You can, but receipts may have faded, business purposes are harder to remember, and unlogged trips cannot be measured afterwards. Any balance owing is also due by April 30, before the June 15 filing date.",
      },
      {
        type: "sources",
        links: [
          SRC.businessRecords,
          SRC.retention,
          SRC.format,
          SRC.vehicleRecords,
          SRC.t4002Expenses,
          SRC.importantDates,
        ],
        checked: CHECKED,
      },
    ],
  },

  /* ─────────────────────────────── 2 ─────────────────────────────── */
  {
    slug: "daily-receipt-routine",
    title: "The 5-Minute Daily Receipt Routine for Self-Employed Canadians",
    excerpt:
      "A five-minute end-of-day receipt habit: capture paper receipts, forward e-mail ones, note the business purpose, check the category, and why same-day matters.",
    category: "Bookkeeping",
    publishedAt: "2026-11-14",
    updatedAt: "2026-11-14",
    image: {
      path: "/articles/daily-receipt-routine.webp",
      width: 1280,
      height: 720,
      alt: "Desk seen from above with a hand writing beside a kraft envelope, a blank card, a notebook and glasses",
    },
    tags: ["receipts", "bookkeeping", "self-employed", "record keeping", "CRA", "habits"],
    clusterName: "Bookkeeping Basics",
    clusterPillar: "bookkeeping-self-employed-canada",
    relatedSlugs: [
      "bookkeeping-self-employed-canada",
      "month-end-bookkeeping-checklist-canada",
      "cra-receipt-rules-canada",
    ],
    quickAnswer:
      "At the end of each working day, spend about five minutes on receipts: capture the day's paper receipts, forward any e-mail receipts, note the business purpose of each purchase, and check its category. Doing it the same day means the receipt is still legible and you still remember why you bought it. A few minutes a day replaces a long, uncertain catch-up at tax time.",
    receiptOneHelps: {
      items: [
        "Photograph a paper receipt with your phone and ReceiptOne reads the merchant, date, total and GST/HST amounts for you to check.",
        "Forward e-mail receipts to your own ReceiptOne address so they land beside the ones you photographed.",
        "Snap a receipt in Telegram and the bot saves it to your account, which helps when you are away from the app.",
        "Mark an expense as reimbursable when a client should pay you back, then filter and export those for billing.",
      ],
      link: CTA,
    },
    body: [
      {
        type: "p",
        text: "Most receipt problems start small: a slip left in a jacket pocket, an e-mailed invoice buried under newsletters, a purchase you cannot explain a few months later. A short routine at the end of each working day stops those small gaps from turning into a missing-records problem in spring.",
      },
      {
        type: "p",
        text: "This guide sets out a five-step routine you can finish in about five minutes, explains why doing it the same day matters, and covers what to do when a receipt is missing or incomplete. The CRA rules come from canada.ca; the pages are listed at the end.",
      },
      {
        type: "h2",
        text: "Why the Same Day Matters",
      },
      {
        type: "h3",
        text: "Paper fades",
      },
      {
        type: "p",
        text: "Many till receipts are printed on heat-sensitive paper, and that printing can fade with heat, light and time. The CRA says an image of a paper document must not have significant details obscured by limits of resolution, tone or colour. A clear photo taken on day one meets that test far more easily than a photo of a faded slip months later.",
      },
      {
        type: "h3",
        text: "Memory fades",
      },
      {
        type: "p",
        text: "Guide T4002 lets you deduct reasonable expenses you incur to earn business income, and not personal expenses. The receipt shows what you bought. It rarely shows why. Today you know that the coffee meeting was with a client about a new project; in April you may not. A one-line note made the same day is what connects the purchase to the business.",
      },
      {
        type: "h3",
        text: "Small gaps are easier to fix",
      },
      {
        type: "p",
        text: "If a receipt is missing today, you can ask the store or check your e-mail while the purchase is fresh. At year end, the same gap means searching through months of statements and contacting vendors who may no longer have a copy.",
      },
      {
        type: "h2",
        text: "The Routine, Step by Step",
      },
      {
        type: "p",
        text: "Pick a fixed moment, such as when you close your laptop or park the car for the night. Then work through these five steps.",
      },
      {
        type: "h3",
        text: "Step 1: Gather today's paper receipts",
      },
      {
        type: "p",
        text: "Empty your wallet, pockets, bag and car. Keep one envelope or tray where paper receipts go as soon as you get home, so step 1 is one place, not five.",
      },
      {
        type: "h3",
        text: "Step 2: Capture each one",
      },
      {
        type: "p",
        text: "Photograph or scan each receipt while it is still crisp. A quick checklist for a usable image:",
      },
      {
        type: "ul",
        items: [
          "Lay the receipt flat in good light, with the whole slip in the frame.",
          "Check that the date, the seller's name, the description, the total and the GST/HST amount are readable.",
          "Make sure the vendor's GST/HST business number is visible on purchases of $100 or more before tax.",
          "Zoom in on the photo before you move on; retake it if anything is blurred.",
        ],
      },
      {
        type: "p",
        text: "Then decide what happens to the paper. The CRA says you generally must keep originals of paper documents, and you may destroy them only if your imaging follows the national standard; if you are in doubt, get legal advice first.",
        link: {
          label: "Read whether digital receipts are valid.",
          href: "/articles/digital-receipts-canada-are-they-valid",
        },
      },
      {
        type: "h3",
        text: "Step 3: Forward today's e-mail receipts",
      },
      {
        type: "p",
        text: "Online orders, software subscriptions, ride receipts and supplier invoices often arrive by e-mail. Move them into your records the same day. The CRA says records that were electronic from the start must be kept in an electronic readable format, even if you also print them, so keep the e-mail or PDF itself, not only a printout.",
      },
      {
        type: "h3",
        text: "Step 4: Note the business purpose",
      },
      {
        type: "p",
        text: "Add a short note to each expense: who it was with, which client or project, or what it was used for. Keep it factual and specific, such as “printer ink for client proposals” rather than “supplies”. If a receipt has no description, as with a cash register tape, the CRA says to write the description on the receipt or in your expense journal.",
      },
      {
        type: "h3",
        text: "Step 5: Check the category",
      },
      {
        type: "p",
        text: "Confirm each expense sits in the right category, because those categories become the expense lines on Form T2125. While you are there, flag anything that needs special handling:",
      },
      {
        type: "ul",
        items: [
          "Mixed-use items, such as a phone bill, where only the business part is deductible.",
          "Capital purchases, such as a laptop, which are claimed through capital cost allowance rather than as an expense.",
          "Expenses a client will pay you back for, so they do not get lost at billing time.",
        ],
      },
      {
        type: "p",
        text: "That is the whole routine. On a quiet day it takes a minute; on a busy one, five.",
      },
      {
        type: "h3",
        text: "A sample day",
      },
      {
        type: "p",
        text: "Hypothetical example: a self-employed photographer in Halifax finishes a shoot at 5 p.m. In the car she has a fuel receipt and a parking slip; in her inbox there is an e-mailed invoice for a memory card. She photographs the two paper slips, checks that the HST amount is readable on each, and forwards the e-mail. She notes “client shoot, Dartmouth” on the fuel and parking, “spare card for weddings” on the memory card, and confirms all three sit in the right categories. She logs the trip with its kilometres and purpose. Total time: about four minutes.",
      },
      {
        type: "h2",
        text: "What a Usable Receipt Shows",
      },
      {
        type: "p",
        text: "The CRA's business records page lists what a receipt for a business purchase has to show:",
      },
      {
        type: "ul",
        items: [
          "The date of the purchase",
          "The name and address of the seller or supplier",
          "The name and address of the buyer",
          "A full description of the goods or services",
          "The vendor's business number, if they are a GST/HST registrant and the purchase is $100 or more before tax",
        ],
      },
      {
        type: "p",
        text: "If you are registered for GST/HST and claim input tax credits, the CRA also says to keep copies of the purchase invoices or receipts that support them.",
        link: {
          label: "Read our full guide to CRA receipt rules.",
          href: "/articles/cra-receipt-rules-canada",
        },
      },
      {
        type: "h2",
        text: "When Something Goes Wrong",
      },
      {
        type: "ul",
        items: [
          "No receipt at all: the CRA says to write the seller's name and address, the amount, the date and the details of the purchase in your expense journal.",
          "A receipt with no description: write what you bought on the receipt or in your expense journal.",
          "A lost receipt: ask the vendor for a copy, or download one from your online account with them, the same day you notice.",
          "A faded receipt: capture it now, as clearly as you can, and add a note with the details you can still confirm.",
        ],
      },
      {
        type: "h2",
        text: "Fitting the Routine Into Your Week",
      },
      {
        type: "p",
        text: "Habits stick when they hang off something you already do. Tie the routine to the end of your working day, set a phone reminder for the first few weeks, and keep the envelope for paper receipts by the door. If you drive for work, log the day's trips at the same moment; the CRA asks for the date, destination, purpose and kilometres of each business trip.",
        link: {
          label: "See our mileage deduction guide.",
          href: "/articles/mileage-deduction-canada-freelancers",
        },
      },
      {
        type: "p",
        text: "The daily routine keeps receipts in order. Once a month, a slightly longer review matches them against your statements and catches anything that slipped through.",
        link: {
          label: "Use the month-end bookkeeping checklist.",
          href: "/articles/month-end-bookkeeping-checklist-canada",
        },
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "Can I throw away a paper receipt after I photograph it?",
        a: "The CRA says you generally must keep paper originals. You may destroy them only if your imaging follows the national standard, and it suggests getting legal advice first if you are in doubt.",
      },
      {
        type: "faq",
        q: "Do I need to keep e-mail receipts if I print them?",
        a: "Yes. Records that were electronic from the start must be kept in an electronic readable format, even if you also have paper printouts.",
      },
      {
        type: "faq",
        q: "What should my note on a receipt say?",
        a: "Enough to show why the purchase was for the business: the client, project or use. If the receipt has no description, the CRA says to write one on the receipt or in your expense journal.",
      },
      {
        type: "faq",
        q: "What if a store will not give me a receipt?",
        a: "Write the seller's name and address, the amount, the date and the details of the purchase in your expense journal, as the CRA's business records page describes.",
      },
      {
        type: "faq",
        q: "Why not just do all my receipts once a month?",
        a: "You can, but printing on paper receipts can fade and the business purpose is easier to forget. A daily capture plus a monthly review keeps both problems small.",
      },
      {
        type: "sources",
        links: [
          SRC.businessRecords,
          SRC.format,
          SRC.gstRecords,
          SRC.t4002Expenses,
          SRC.vehicleRecords,
        ],
        checked: CHECKED,
      },
    ],
  },

  /* ─────────────────────────────── 3 ─────────────────────────────── */
  {
    slug: "month-end-bookkeeping-checklist-canada",
    title: "Month-End Bookkeeping Checklist for the Self-Employed",
    excerpt:
      "A month-end checklist for sole proprietors: match receipts to statements, find missing ones, check mileage, and set money aside for income tax and GST/HST.",
    category: "Bookkeeping",
    publishedAt: "2026-11-14",
    updatedAt: "2026-11-14",
    image: {
      path: "/articles/month-end-bookkeeping-checklist-canada.webp",
      width: 1280,
      height: 720,
      alt: "Hand ticking off a handwritten checklist in a grid-paper notebook with a black pen",
    },
    tags: ["bookkeeping", "month end", "checklist", "self-employed", "GST/HST", "instalments"],
    clusterName: "Bookkeeping Basics",
    clusterPillar: "bookkeeping-self-employed-canada",
    relatedSlugs: [
      "bookkeeping-self-employed-canada",
      "daily-receipt-routine",
      "year-end-checklist-accountant-canada",
    ],
    quickAnswer:
      "Once a month, match your receipts to your bank and card statements, chase down anything missing, review categories and business-use percentages, check your mileage log, and flag reimbursable expenses. Then set money aside for income tax and any GST/HST you collected, and look at the CRA dates coming up. A regular monthly review keeps the year-end job small.",
    receiptOneHelps: {
      items: [
        "Ask the built-in assistant questions like how much you spent on fuel this year, and get the answer from your own receipts.",
        "Bulk upload a batch of receipt photos or PDFs you missed; ReceiptOne reads them, sorts them into categories and flags duplicates.",
        "Check the mileage logbook the app builds from GPS trip tracking, and tag each trip business or personal.",
        "Filter expenses you marked as reimbursable and export them as a PDF or CSV for your client.",
      ],
      link: CTA,
    },
    body: [
      {
        type: "p",
        text: "A daily receipt habit gets documents into your records. A monthly review checks that the records are complete and correct, while the month is still fresh enough to fix. This checklist is written for sole proprietors in Canada and takes you through seven steps, in the order they are easiest to do.",
      },
      {
        type: "p",
        text: "The CRA rules and dates come from canada.ca and are listed at the end. Examples are hypothetical.",
      },
      {
        type: "h2",
        text: "The Checklist at a Glance",
      },
      {
        type: "ul",
        items: [
          "Match receipts to your bank and card statements.",
          "Find and replace missing receipts.",
          "Review categories and business-use percentages.",
          "Check your mileage log.",
          "Mark reimbursable expenses.",
          "Set money aside for income tax and GST/HST.",
          "Check the CRA dates coming up.",
        ],
      },
      {
        type: "h2",
        text: "1. Match Receipts to Your Statements",
      },
      {
        type: "p",
        text: "Download last month's statements for every account and card you use for the business. Go down each statement line by line and tick off the transactions that have a receipt in your records. The CRA's business records page tells you to keep bank statements, deposit slips and cancelled cheques, and this is where they earn their keep.",
      },
      {
        type: "ul",
        items: [
          "Every business charge should match a receipt or invoice.",
          "Every deposit should match an invoice or other income record with its date, amount and source.",
          "Personal charges on a business card should be noted, so they are not claimed by mistake.",
        ],
      },
      {
        type: "p",
        text: "Hypothetical example: a web designer's October card statement has 23 charges. Twenty match receipts already in her records. Of the other three, one is a software renewal whose receipt is still in her inbox, one is a lunch she paid for personally, and one is a $140 purchase from an office supply store she cannot place. She forwards the software receipt, marks the lunch as personal, and puts the office supply charge on her list for step 2.",
      },
      {
        type: "h2",
        text: "2. Find Missing Receipts",
      },
      {
        type: "p",
        text: "Unticked business charges are your missing receipts. Look in your e-mail and in your online accounts with the vendor first; many keep copies. If a seller never gave you a receipt, the CRA says to write the seller's name and address, the amount, the date and the details of the purchase in your expense journal.",
      },
      {
        type: "p",
        text: "A statement line is not a substitute for a receipt. It shows that you paid, but not what you bought or the GST/HST, which are details the CRA expects a receipt to show.",
        link: {
          label: "Read our guide to CRA receipt rules.",
          href: "/articles/cra-receipt-rules-canada",
        },
      },
      {
        type: "h2",
        text: "3. Review Categories and Business-Use Percentages",
      },
      {
        type: "p",
        text: "Scan the month's expenses by category. Each category maps to a line on Form T2125, so fixing a miscategorized expense now saves a correction later. Guide T4002 says personal expenses are not deductible and to enter only the business part of each expense.",
      },
      {
        type: "h3",
        text: "Things to look for",
      },
      {
        type: "ul",
        items: [
          "Mixed-use bills, such as a cellphone plan, where only the business percentage counts.",
          "Home costs, which belong in the business-use-of-home calculation, not on other expense lines.",
          "Capital purchases, such as equipment, which are claimed through capital cost allowance rather than as expenses.",
          "Vague notes you can still improve while you remember the purchase.",
        ],
      },
      {
        type: "p",
        text: "Not sure which expenses count, or where they go?",
        link: {
          label: "See our guide to self-employed tax deductions.",
          href: "/articles/self-employed-tax-deductions-canada",
        },
      },
      {
        type: "h2",
        text: "4. Check Your Mileage Log",
      },
      {
        type: "p",
        text: "If you drive for work, open your log and look for gaps. The CRA asks you to record, for each business trip, the date, destination, purpose and kilometres driven. It also asks for the odometer reading at the start and end of your fiscal period, and the dates and readings whenever you change vehicles.",
      },
      {
        type: "p",
        text: "If you have already kept a full logbook for one complete year, the CRA allows a simplified logbook: a three-month sample in later years, as long as business use stays within 10% of the base year. Keep the base-year logbook for six years from the end of the last year you use it to establish business use.",
        link: {
          label: "Read our mileage deduction guide.",
          href: "/articles/mileage-deduction-canada-freelancers",
        },
      },
      {
        type: "h2",
        text: "5. Mark Reimbursable Expenses",
      },
      {
        type: "p",
        text: "Some costs you pay on behalf of a client, such as materials or travel, will be billed back. Flag them at month end and check they made it onto the client's invoice. Leaving this until year end is how reimbursable costs end up unbilled, or claimed twice.",
      },
      {
        type: "h2",
        text: "6. Set Money Aside for Income Tax and GST/HST",
      },
      {
        type: "h3",
        text: "Income tax",
      },
      {
        type: "p",
        text: "As a sole proprietor, no one withholds tax from your business income. Set aside part of each month's profit in a separate savings account so the April bill is not a surprise. There is no CRA percentage for this; your accountant or last year's return is a better guide than a rule of thumb.",
      },
      {
        type: "p",
        text: "You may also have to pay during the year. The CRA says you must pay instalments for 2026 if your net tax owing is more than $3,000 ($1,800 in Quebec) in 2026 and was also more than that in either 2025 or 2024. The CRA sends instalment reminders to people who will likely have to pay.",
      },
      {
        type: "h3",
        text: "GST/HST",
      },
      {
        type: "p",
        text: "If you are registered, the GST/HST you charge clients is not yours to spend. Move it to the savings account when you are paid. If you are not registered yet, keep an eye on your revenue: under the CRA's small supplier rule, you stop being a small supplier once your taxable supplies exceed $30,000 in a single calendar quarter or over four consecutive calendar quarters.",
        link: {
          label: "See our guide to tracking GST/HST.",
          href: "/articles/track-gst-hst-business-expenses",
        },
      },
      {
        type: "h2",
        text: "7. Check the CRA Dates Coming Up",
      },
      {
        type: "p",
        text: "End the review by looking a month or two ahead. The dates that matter most to a sole proprietor:",
      },
      {
        type: "ul",
        items: [
          "Income tax instalments, if you pay them: March 15, June 15, September 15 and December 15. A payment due on a weekend or public holiday is on time if received the next business day.",
          "GST/HST returns: quarterly filers file and pay one month after the quarter ends, so a quarter ending March 31 is due April 30.",
          "Annual GST/HST filers who are sole proprietors with a December 31 year-end and business income for the year: pay by April 30 and file by June 15.",
          "Your income tax return: self-employed individuals file by June 15, but any balance owing is due by April 30.",
        ],
      },
      {
        type: "p",
        text: "Dates shift when they fall on a weekend or holiday.",
        link: {
          label: "See the current CRA deadlines.",
          href: "/ca/tax-deadlines",
        },
      },
      {
        type: "h2",
        text: "A Note on Timing",
      },
      {
        type: "p",
        text: "Do the review in the first week of the new month, once statements are out. Block the time in your calendar like a client meeting. If you also follow a daily receipt routine, most months will be a quick tick-through rather than a hunt.",
        link: {
          label: "Read the 5-minute daily receipt routine.",
          href: "/articles/daily-receipt-routine",
        },
      },
      {
        type: "p",
        text: "Twelve monthly reviews add up to most of your year-end work. What is left is totalling the year and handing it over.",
        link: {
          label: "See the year-end checklist for your accountant.",
          href: "/articles/year-end-checklist-accountant-canada",
        },
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "Is a bank statement enough if I lose a receipt?",
        a: "Not on its own. It shows the payment, but not what you bought or the GST/HST. Look for a copy from the vendor, and if there was never a receipt, record the seller, amount, date and details in your expense journal.",
      },
      {
        type: "faq",
        q: "Do I have to pay tax instalments?",
        a: "For 2026, you must if your net tax owing is more than $3,000 ($1,800 in Quebec) in 2026 and was also more than that in either 2025 or 2024.",
      },
      {
        type: "faq",
        q: "When are instalment payments due?",
        a: "March 15, June 15, September 15 and December 15 for most individuals. A payment due on a weekend or public holiday is on time if received the next business day.",
      },
      {
        type: "faq",
        q: "When do I have to register for GST/HST?",
        a: "You stop being a small supplier once your taxable supplies exceed $30,000 in a single calendar quarter or over four consecutive calendar quarters. The CRA's registration page explains when registration takes effect.",
      },
      {
        type: "faq",
        q: "How much should I set aside for tax each month?",
        a: "The CRA does not set a percentage. Base it on last year's return or ask your accountant, and keep the GST/HST you collect separate, since it is owed to the CRA.",
      },
      {
        type: "sources",
        links: [
          SRC.businessRecords,
          SRC.t4002Expenses,
          SRC.vehicleRecords,
          SRC.instalmentsWho,
          SRC.instalmentDates,
          SRC.gstRegister,
          SRC.gstDeadlines,
          SRC.importantDates,
        ],
        checked: CHECKED,
      },
    ],
  },

  /* ─────────────────────────────── 4 ─────────────────────────────── */
  {
    slug: "separate-business-personal-finances-canada",
    title: "How to Separate Business and Personal Finances as a Sole Proprietor",
    excerpt:
      "Why a sole proprietor should separate business and personal money, how to set it up, how to split a vehicle, phone or home office, and how to pay yourself.",
    category: "Bookkeeping",
    publishedAt: "2026-11-14",
    updatedAt: "2026-11-14",
    image: {
      path: "/articles/separate-business-personal-finances-canada.webp",
      width: 1280,
      height: 720,
      alt: "Two dark drawers stacked one above the other, each with a brass handle and a blank label holder",
    },
    tags: [
      "bookkeeping",
      "sole proprietor",
      "business account",
      "drawings",
      "mixed-use expenses",
      "CRA",
    ],
    clusterName: "Bookkeeping Basics",
    clusterPillar: "bookkeeping-self-employed-canada",
    relatedSlugs: [
      "bookkeeping-self-employed-canada",
      "home-office-deduction-canadian-freelancers",
      "mileage-deduction-canada-freelancers",
    ],
    quickAnswer:
      "Run your business money through its own bank account and card, pay business costs from it, and move money to yourself as owner's drawings rather than a salary. For things you use both ways, such as a vehicle, phone or home office, claim only the business part, worked out on a reasonable basis like kilometres or floor area. The CRA pages cited here do not require a separate account, but it makes the records they do require much easier to keep.",
    receiptOneHelps: {
      items: [
        "Photograph business receipts or forward e-mail receipts to your own ReceiptOne address, so business purchases live in one place, apart from personal ones.",
        "Turn on trip tracking and tag each trip business or personal; the T2125 report fills in business kilometres, total kilometres and the business-use percentage for Chart A.",
        "Mark expenses as reimbursable when a client or employer should pay you back, and export them separately.",
        "Export a CRA-ready PDF or CSV report of your business expenses by category at year end.",
      ],
      link: CTA,
    },
    body: [
      {
        type: "p",
        text: "As a sole proprietor, there is no legal wall between you and your business. The money in your pocket and the money the business earns belong to the same person, and both end up on your personal return. That is exactly why keeping them apart in practice is worth the effort.",
      },
      {
        type: "p",
        text: "This guide covers why separation helps, how to set it up, how to handle expenses that are part business and part personal, and how paying yourself works. The CRA rules come from canada.ca; the pages are listed at the end. Examples are hypothetical.",
      },
      {
        type: "h2",
        text: "Why Separation Helps",
      },
      {
        type: "h3",
        text: "Cleaner records",
      },
      {
        type: "p",
        text: "The CRA's business records page asks you to keep records of all your transactions and to keep your bank statements, deposit slips and cancelled cheques. When the business has its own account, its statement is a ready-made list of business transactions. When everything runs through one personal account, you have to sort groceries from supplies every month before you can even start.",
      },
      {
        type: "h3",
        text: "An easier CRA review",
      },
      {
        type: "p",
        text: "Guide T4002 says you cannot deduct personal expenses and should enter only the business part of each expense. If the CRA asks you to support a claim, a separate account lets you show the business transactions without walking through your personal spending line by line. It also makes it harder to miss income or to claim a personal purchase by mistake.",
      },
      {
        type: "h3",
        text: "A clearer picture of the business",
      },
      {
        type: "p",
        text: "With its own balance, you can see at a glance what the business has earned, what it has spent and what is set aside for tax. That is hard to judge when the same account also pays rent and groceries.",
      },
      {
        type: "h2",
        text: "Set Up a Separate Account and Card",
      },
      {
        type: "p",
        text: "You do not need a corporation to have a business account. A practical setup for a sole proprietor:",
      },
      {
        type: "ul",
        items: [
          "One chequing account for the business: client payments go in, business costs go out.",
          "One card used only for business purchases.",
          "A savings account for money set aside for income tax and any GST/HST you collect.",
          "A regular transfer from the business account to your personal account when you pay yourself.",
        ],
      },
      {
        type: "h3",
        text: "If you use the wrong card",
      },
      {
        type: "p",
        text: "It will happen. If you pay for a business expense personally, keep the receipt and record the expense like any other; it is still a business expense. If you put a personal purchase on the business card, note it as personal so it is not claimed, and treat it as money you took out of the business. Either way, make the note the same day.",
      },
      {
        type: "h2",
        text: "Mixed-Use Expenses: Claim the Business Part",
      },
      {
        type: "p",
        text: "Some things are both business and personal no matter how many accounts you have. For those, Guide T4002 asks you to claim only the business part, worked out on a reasonable basis. The three most common are a vehicle, a phone and a home office.",
      },
      {
        type: "h3",
        text: "Vehicle",
      },
      {
        type: "p",
        text: "If you use your vehicle regularly for both business and personal trips, T4002 says you can claim part of its total operating expenses, and you must keep records showing the part of the total kilometres you drove for business. The business part is business kilometres divided by total kilometres. The CRA asks for a log of each business trip with the date, destination, purpose and kilometres, plus the odometer reading at the start and end of the fiscal period.",
      },
      {
        type: "p",
        text: "Hypothetical example: you drive 20,000 km in the year, 8,000 of them for business. Business use is 40%, so 40% of your fuel, insurance, licence and repair costs is the business part. Guide T4002 applies the same kind of ratio to capital cost allowance on a vehicle used both ways.",
        link: {
          label: "Read our mileage deduction guide.",
          href: "/articles/mileage-deduction-canada-freelancers",
        },
      },
      {
        type: "h3",
        text: "Phone",
      },
      {
        type: "p",
        text: "T4002 sets specific rules for phones. You cannot deduct the basic monthly rate of your home telephone, but you can deduct long-distance calls you made on it for business. If you have a separate line for business calls only, you can deduct its basic monthly rate. For a cellphone you use to earn business income, you can deduct the percentage of airtime expenses that relates to the business.",
      },
      {
        type: "p",
        text: "To support a cellphone percentage, keep a note of how you worked it out, for example by reviewing a typical month's call and data use. Recheck it if the way you use the phone changes.",
      },
      {
        type: "h3",
        text: "Home office",
      },
      {
        type: "p",
        text: "You can claim a workspace in your home only if it is your principal place of business, or if you use it only for the business and on a regular and ongoing basis to meet clients, customers or patients. The CRA says to use a reasonable basis, such as the area of the workspace divided by the total area of the home. If the room is also used for personal living, multiply by the share of the day it is used for business. Home office expenses cannot create or increase a business loss, but any unused amount carries forward to the next year.",
        link: {
          label: "See our home office deduction guide.",
          href: "/articles/home-office-deduction-canadian-freelancers",
        },
      },
      {
        type: "h3",
        text: "Write your percentages down",
      },
      {
        type: "p",
        text: "For each mixed-use item, keep a short note of the percentage you used and how you got it: the logbook totals, the floor measurements, the phone review. Keep the note with the year's records, so the numbers on your return can be explained years later if needed.",
      },
      {
        type: "h2",
        text: "Paying Yourself as a Sole Proprietor",
      },
      {
        type: "p",
        text: "A sole proprietor does not pay themselves a salary in the tax sense. Guide T4002 defines a drawing as any withdrawal of cash, including amounts you call a salary, or other assets or services of the business by the proprietor. It also covers using business assets or services for personal purposes. Drawings are recorded in the equity section of Form T2125, not as an expense.",
      },
      {
        type: "p",
        text: "On the line for salaries and wages, T4002 says not to deduct salaries or drawings paid or payable to yourself. Your income tax is based on the business's net income on T2125, whatever you withdrew during the year.",
      },
      {
        type: "h3",
        text: "A simple way to pay yourself",
      },
      {
        type: "ul",
        items: [
          "Pick a regular day, such as the first of the month, to transfer money to your personal account.",
          "Before you transfer, top up the tax savings account and set aside any GST/HST you collected.",
          "Record each transfer as a drawing, not as an expense.",
        ],
      },
      {
        type: "p",
        text: "Leaving tax money in the business matters because nothing is withheld for you. The CRA says you must pay instalments for 2026 if your net tax owing is more than $3,000 ($1,800 in Quebec) in 2026 and was also more than that in either 2025 or 2024.",
        link: {
          label: "See the current CRA deadlines.",
          href: "/ca/tax-deadlines",
        },
      },
      {
        type: "h2",
        text: "Putting It Together",
      },
      {
        type: "p",
        text: "Separation is a set-up job you do once, followed by small habits: business purchases on the business card, receipts captured the same day, percentages noted for mixed-use items, and regular drawings after tax money is set aside.",
        link: {
          label: "Read our plain-English bookkeeping guide.",
          href: "/articles/bookkeeping-self-employed-canada",
        },
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "Do I need a separate bank account as a sole proprietor?",
        a: "The CRA pages cited here do not require one. They do require records that support your claims and that you deduct only the business part of expenses, and a separate account makes both much easier.",
      },
      {
        type: "faq",
        q: "Can I pay myself a salary from my sole proprietorship?",
        a: "Not in the tax sense. Money you take out, even if you call it a salary, is a drawing. Guide T4002 says not to deduct salaries or drawings paid to yourself.",
      },
      {
        type: "faq",
        q: "How do I work out the business part of my vehicle costs?",
        a: "Divide business kilometres by total kilometres for the year and apply that share to your operating costs. Keep a logbook of each business trip and your odometer readings at the start and end of the year.",
      },
      {
        type: "faq",
        q: "Can I deduct my cellphone bill?",
        a: "You can deduct the percentage of airtime expenses that relates to earning business income. For a home landline, the basic monthly rate is not deductible, but business long-distance calls are.",
      },
      {
        type: "faq",
        q: "What if I pay for a business expense with my personal card?",
        a: "Keep the receipt and record it as a business expense; how you paid does not change what it was for. A separate business card just makes these cases rarer.",
      },
      {
        type: "sources",
        links: [
          SRC.businessRecords,
          SRC.t4002Expenses,
          SRC.t4002Cca,
          SRC.vehicleRecords,
          SRC.homeOffice,
          SRC.instalmentsWho,
        ],
        checked: CHECKED,
      },
    ],
  },

  /* ─────────────────────────────── 5 ─────────────────────────────── */
  {
    slug: "year-end-checklist-accountant-canada",
    title: "Year-End Checklist: What to Give Your Accountant",
    excerpt:
      "What to hand your accountant at year end: income and slips, expenses by category, receipts, mileage logbook, home office, GST/HST figures and instalments.",
    category: "Bookkeeping",
    publishedAt: "2026-11-14",
    updatedAt: "2026-11-14",
    image: {
      path: "/articles/year-end-checklist-accountant-canada.webp",
      width: 1280,
      height: 720,
      alt: "Open wooden drawer of index cards with numbered divider tabs",
    },
    tags: ["year end", "accountant", "checklist", "self-employed", "T2125", "GST/HST"],
    clusterName: "Bookkeeping Basics",
    clusterPillar: "bookkeeping-self-employed-canada",
    relatedSlugs: [
      "bookkeeping-self-employed-canada",
      "t2125-form-guide-canada",
      "month-end-bookkeeping-checklist-canada",
    ],
    quickAnswer:
      "Give your accountant your income records and any slips, an expense summary by category with the receipts behind it, your mileage logbook, your home office figures, your GST/HST totals if you are registered, and the instalments you paid. Self-employed individuals have until June 15 to file, but any balance owing is due April 30, so aim to hand everything over well before April.",
    receiptOneHelps: {
      items: [
        "Export your expenses as a CRA-ready PDF or CSV report, with totals, categories and receipt links, to send to your accountant.",
        "Export a trip-by-trip mileage logbook as PDF or CSV, with the date, distance and purpose of every business trip.",
        "Type /report to the Telegram bot to get your annual tax report as a file in the chat.",
        "Bulk upload any receipts you still have on paper or in a folder, so the year is complete before you export.",
      ],
      link: CTA,
    },
    body: [
      {
        type: "p",
        text: "An accountant can only work with what you give them. A complete, organized package means fewer follow-up questions, a faster return and less chance of a missed deduction. This checklist covers what a sole proprietor in Canada should gather once the year closes, in the order it maps onto Form T2125.",
      },
      {
        type: "p",
        text: "The CRA rules and dates come from canada.ca; the pages are listed at the end. If you do your own return, the same checklist tells you what you need before you start.",
      },
      {
        type: "h2",
        text: "The Checklist at a Glance",
      },
      {
        type: "ul",
        items: [
          "Income records and any slips you received",
          "An expense summary by category",
          "The receipts behind the summary",
          "Your mileage logbook and vehicle costs",
          "Home office details",
          "GST/HST figures, if you are registered",
          "Instalments you paid during the year",
          "Notes on anything that changed",
        ],
      },
      {
        type: "h2",
        text: "1. Income Records and Slips",
      },
      {
        type: "p",
        text: "Your accountant needs your gross income for the year: every invoice, payment and sale. The CRA says income records must show the date, amount and source of each item, supported by original documents such as sales invoices, receipts, deposit slips, fee statements and contracts. A list of invoices issued, with the amount and date paid, is the most useful format.",
      },
      {
        type: "p",
        text: "Include any information slips you received. Businesses that pay more than $500 in a calendar year to other businesses for services are required to report those fees to the CRA, usually on a T4A slip. Use the slips as a check against your own records rather than as your income total, since your records should cover everything you earned.",
      },
      {
        type: "h2",
        text: "2. Expense Summary by Category",
      },
      {
        type: "p",
        text: "Total your business expenses by category, ideally matching the expense lines on Form T2125. Your accountant will regroup them if needed, but a categorized summary is far quicker to work from than a pile of receipts.",
      },
      {
        type: "ul",
        items: [
          "Show only the business part of mixed-use expenses, with a note of the percentage and how you worked it out.",
          "List capital purchases, such as computers or equipment, separately with the date, seller and cost; these are claimed through capital cost allowance, not as expenses.",
          "If you claim input tax credits, show the GST/HST you paid separately from the expense amounts.",
          "Keep reimbursable expenses a client paid back clearly marked.",
        ],
      },
      {
        type: "p",
        text: "Not sure where an expense goes?",
        link: {
          label: "Read our line-by-line T2125 guide.",
          href: "/articles/t2125-form-guide-canada",
        },
      },
      {
        type: "h2",
        text: "3. The Receipts Behind the Summary",
      },
      {
        type: "p",
        text: "The summary is what goes on the return; the receipts are what support it. You do not send receipts to the CRA with your return, but you keep them in case it asks. Your accountant may want to see some, especially for large or unusual items.",
      },
      {
        type: "p",
        text: "Keep the year's records for six years from the end of the tax year they relate to, which for an individual is the calendar year. So your 2026 records stay with you until at least the end of 2032, longer if you file late.",
        link: {
          label: "See our guide to CRA receipt rules.",
          href: "/articles/cra-receipt-rules-canada",
        },
      },
      {
        type: "h2",
        text: "4. Mileage Logbook and Vehicle Costs",
      },
      {
        type: "p",
        text: "If you use a vehicle for the business, bring:",
      },
      {
        type: "ul",
        items: [
          "Your logbook, with the date, destination, purpose and kilometres of each business trip",
          "Odometer readings at the start and end of the year",
          "If you changed vehicles, the dates and odometer readings when you bought, sold or traded",
          "Total kilometres and business kilometres for each vehicle, kept separately for each one",
          "The year's operating costs: fuel, insurance, licence and registration, repairs, interest or lease payments",
          "The purchase details if you bought a vehicle during the year",
        ],
      },
      {
        type: "p",
        text: "If you use a simplified three-month logbook, include the base-year logbook too; the CRA asks you to keep it for six years from the end of the last year you use it.",
        link: {
          label: "Read our mileage deduction guide.",
          href: "/articles/mileage-deduction-canada-freelancers",
        },
      },
      {
        type: "h2",
        text: "5. Home Office Details",
      },
      {
        type: "p",
        text: "If you work from home, your accountant first needs to know which condition you meet: the workspace is your principal place of business, or you use it only for the business and regularly meet clients there. Then bring:",
      },
      {
        type: "ul",
        items: [
          "The area of the workspace and the total area of your home",
          "Whether the space is also used for personal living, and the hours it is used for business",
          "Rent, or for owners, mortgage interest and property taxes",
          "Heating, electricity, home insurance and maintenance costs",
          "Any business-use-of-home amount carried forward from last year",
        ],
      },
      {
        type: "p",
        text: "Home office expenses cannot create or increase a business loss; anything you cannot use carries forward.",
        link: {
          label: "See our home office deduction guide.",
          href: "/articles/home-office-deduction-canadian-freelancers",
        },
      },
      {
        type: "h2",
        text: "6. GST/HST Figures, If You Are Registered",
      },
      {
        type: "p",
        text: "If you are a GST/HST registrant, bring the GST/HST you charged on your sales, the GST/HST you paid on business purchases that you claim as input tax credits, and copies of the returns you filed during the year. The CRA says to keep copies of the purchase invoices or receipts that support your input tax credits.",
      },
      {
        type: "p",
        text: "If you file annually and you are a sole proprietor with a December 31 year-end and business income for the year, your GST/HST payment is due April 30 and your return is due June 15. If you are not registered, mention your total revenue; the CRA's small supplier limit is $30,000 in taxable supplies in a single calendar quarter or over four consecutive calendar quarters.",
        link: {
          label: "Read our GST/HST tracking guide.",
          href: "/articles/track-gst-hst-business-expenses",
        },
      },
      {
        type: "h2",
        text: "7. Instalments You Paid",
      },
      {
        type: "p",
        text: "List each income tax instalment you paid during the year, with the date and amount. Instalments are credited against the tax on your return, so missing one can make it look as if you owe more than you do. For 2026, the CRA says you must pay instalments if your net tax owing is more than $3,000 ($1,800 in Quebec) in 2026 and was also more than that in either 2025 or 2024. The usual due dates are March 15, June 15, September 15 and December 15.",
      },
      {
        type: "h2",
        text: "8. Notes on What Changed",
      },
      {
        type: "p",
        text: "A short note saves your accountant from guessing. Mention anything new or unusual this year: you started or stopped the business, changed vehicles, moved, began working from home, registered for GST/HST, took on a large contract, or made a big equipment purchase.",
      },
      {
        type: "h2",
        text: "Key Dates",
      },
      {
        type: "p",
        text: "Self-employed individuals have until June 15 to file their return, but any balance owing is due by April 30. For 2025 returns, those dates were April 30 and June 15, 2026. Because the payment comes first, your accountant needs your package early enough to work out what you owe before April 30, not just before June 15.",
        link: {
          label: "See the current CRA deadlines.",
          href: "/ca/tax-deadlines",
        },
      },
      {
        type: "p",
        text: "If you kept up with a monthly review through the year, most of this checklist is already done.",
        link: {
          label: "Use the month-end bookkeeping checklist.",
          href: "/articles/month-end-bookkeeping-checklist-canada",
        },
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "When should I give my records to my accountant?",
        a: "Well before April 30. Self-employed individuals file by June 15, but any balance owing is due by April 30, so your accountant needs time to work out the amount first.",
      },
      {
        type: "faq",
        q: "Do I need to give my accountant every receipt?",
        a: "Usually a categorized summary is enough to prepare the return, with receipts available for anything they ask about. Keep all receipts for six years from the end of the tax year they relate to.",
      },
      {
        type: "faq",
        q: "What if I did not receive a T4A slip from a client?",
        a: "Report the income anyway from your own records. Slips are a cross-check; your income records should cover everything the business earned.",
      },
      {
        type: "faq",
        q: "What mileage records does my accountant need?",
        a: "Your logbook of business trips with date, destination, purpose and kilometres, your odometer readings at the start and end of the year, and your vehicle operating costs.",
      },
      {
        type: "faq",
        q: "When is my GST/HST return due if I file annually?",
        a: "If you are a sole proprietor with a December 31 year-end and business income for the year, the payment is due April 30 and the return is due June 15. Otherwise it is three months after your fiscal year-end.",
      },
      {
        type: "sources",
        links: [
          SRC.businessRecords,
          SRC.feesForService,
          SRC.retention,
          SRC.vehicleRecords,
          SRC.homeOffice,
          SRC.gstRecords,
          SRC.gstRegister,
          SRC.gstDeadlines,
          SRC.instalmentsWho,
          SRC.instalmentDates,
          SRC.importantDates,
        ],
        checked: CHECKED,
      },
    ],
  },
];
