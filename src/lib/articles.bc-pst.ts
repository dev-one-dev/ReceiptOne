/**
 * B.C. PST for the self-employed (CA only): one guide in the GST / HST
 * category, added 2026-11-16. Appended to ARTICLES in src/lib/articles.ts.
 * Every rate, threshold and rule below was read on November 16, 2026 on
 * www2.gov.bc.ca (pages and PST bulletins) or, for the GST side, canada.ca.
 * No other site was used.
 *
 * Professional services: the B.C. PST pages (last updated September 21 and
 * October 1, 2026) say the expansion of PST to accounting, architectural,
 * engineering, geoscience, non-residential real estate and security services
 * is paused. Bulletin PST 003 (revised July 2026) still describes those
 * services as eligible from October 1, 2026; the article follows the newer
 * web pages and does not repeat the bulletin's list.
 */
import type { Article } from "@/lib/articles";

const BC = "https://www2.gov.bc.ca";
const PST = `${BC}/gov/content/taxes/sales-taxes/pst`;
const PUB = `${BC}/assets/gov/taxes/sales-taxes/publications`;
const RPC = `${PST}/charge-collect/pst-real-property-contractors`;
const CRA = "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses";

const SRC = {
  pst: { label: "B.C. provincial sales tax (PST)", href: PST },
  register: { label: "B.C.: Register to collect PST", href: `${PST}/register` },
  guide: {
    label: "B.C.: Small business guide to PST",
    href: `${PST}/publications/small-business-guide`,
  },
  smallSellers: {
    label: "B.C. Bulletin PST 003, Small Sellers",
    href: `${PUB}/pst-003-small-sellers.pdf`,
  },
  registering: {
    label: "B.C. Bulletin PST 001, Registering to Collect PST",
    href: `${PUB}/pst-001-registering-to-collect-pst.pdf`,
  },
  related: {
    label: "B.C. Bulletin PST 301, Related Services",
    href: `${PUB}/pst-301-related-services.pdf`,
  },
  legal: {
    label: "B.C. Bulletin PST 106, Legal Services",
    href: `${PUB}/pst-106-legal-services.pdf`,
  },
  software: { label: "B.C.: Software", href: `${PST}/publications/software` },
  telecom: {
    label: "B.C.: Telecommunication services",
    href: `${PST}/publications/telecommunication-services`,
  },
  contractorsPay: {
    label: "B.C.: Paying PST on the purchase of goods used in contracts",
    href: `${RPC}/contractors-paying-pst`,
  },
  contractorsCharge: {
    label: "B.C.: Charging and collecting PST for contractors",
    href: `${RPC}/contractors-charging-pst`,
  },
  professional: {
    label: "B.C. Notice 2026-001, Notice to providers of professional services",
    href: `${PST}/publications/notice-professional-services`,
  },
  reportPay: { label: "B.C.: Reporting and paying PST", href: `${PST}/report-pay` },
  craRates: {
    label: "CRA: GST/HST calculator (and rates)",
    href: `${CRA}/charge-collect-which-rate/calculator.html`,
  },
  craCharge: {
    label: "CRA: Charge and collect the GST/HST",
    href: `${CRA}/charge-collect-which-rate.html`,
  },
  craRegister: {
    label: "CRA: When to register for and start charging the GST/HST",
    href: `${CRA}/when-register-charge.html`,
  },
};

/** Every source URL, for the allowed-domain test and the 200 check. */
export const BC_PST_SOURCES = Object.values(SRC);

const CHECKED =
  "All read on November 16, 2026, on the Government of British Columbia's site (www2.gov.bc.ca) and canada.ca. This is general information, not tax advice.";

const article = (slug: string) => `/articles/${slug}`;

export const BC_PST_ARTICLES: Article[] = [
  {
    slug: "bc-pst-self-employed",
    title: "BC PST for the Self-Employed: When to Register and What to Charge (2026 Guide)",
    displayTitle: "BC PST for the Self-Employed: When to Register and What to Charge",
    excerpt:
      "When a B.C. freelancer, contractor or driver has to register for PST, the small seller test, which services are taxable, PST on your own business purchases, and filing through eTaxBC.",
    category: "GST / HST",
    publishedAt: "2026-11-16",
    updatedAt: "2026-11-16",
    image: {
      path: "/articles/bc-pst-self-employed.webp",
      width: 1280,
      height: 720,
      alt: "Downtown Vancouver's towers across False Creek, with the North Shore mountains under low cloud",
    },
    tags: ["PST", "British Columbia", "B.C.", "GST/HST", "sales tax", "eTaxBC", "self-employed"],
    clusterName: "GST/HST Tracking",
    relatedSlugs: [
      "sales-tax-by-province-self-employed-canada",
      "track-gst-hst-business-expenses",
      "cra-receipt-rules-canada",
    ],
    quickAnswer:
      "B.C.'s provincial sales tax (PST) is a separate 7% tax that sits beside the 5% federal GST, which the CRA runs. You must register to collect PST if you are located in B.C. and, in the ordinary course of business, sell or lease taxable goods or provide software or taxable services, unless you qualify as a small seller with $10,000 or less in eligible retail sales. Whether or not you register, you pay PST on taxable goods you buy for your business, and there are no PST input tax credits to get it back.",
    receiptOneHelps: {
      items: [
        "Photograph a paper receipt or upload a photo or PDF, and ReceiptOne reads the merchant, date, total and the GST/HST and PST amounts for you to check.",
        "Estimated refundable taxes keeps a running total of the GST/HST on your receipts, while PST is flagged separately as non-refundable.",
        "If you are registered for GST/HST, the GST/HST returns worksheet fills line 106 from your receipts; you enter your sales and the tax you collected. It does not file anything with the CRA.",
        "The Tax calendar shows your CRA deadlines for the next 12 months, based on your GST/HST filing frequency and instalments.",
        "Export your records as a PDF or CSV for your accountant.",
      ],
      link: { label: "See how ReceiptOne works.", href: "/ca" },
    },
    body: [
      {
        type: "p",
        text: "If you work for yourself in British Columbia, two sales taxes can touch your business: the federal GST and the provincial sales tax (PST), with different rules and different governments behind them. This guide covers the B.C. side for freelancers, contractors, drivers and tradespeople. Every rule comes from the Government of British Columbia's PST pages and bulletins, or canada.ca for the GST; the sources are listed at the end.",
      },
      {
        type: "h2",
        text: "What B.C. PST Is, and How It Sits Beside the GST",
      },
      {
        type: "p",
        text: "B.C. describes PST as a retail sales tax that applies when taxable goods, software or services are acquired in B.C. or brought into B.C. for use in B.C., unless a specific exemption applies. The general rate is 7% on the purchase or lease price. A few items have their own rate, such as liquor at 10% and accommodation at 8%.",
      },
      {
        type: "p",
        text: "The GST is a different tax: B.C.'s small business guide sends GST registration and questions to the Canada Revenue Agency. The CRA's rates table lists British Columbia at 5% GST and 7% PST, and the CRA says that where PST is charged, you calculate the GST on the price without the PST. B.C. gives the same order with an example: on a $100 sale, PST is $7.00 and GST is $5.00, for $112.00 in total.",
      },
      {
        type: "p",
        text: "The registrations are separate too. For the GST/HST, you need not register while you are a small supplier, with $30,000 or less in taxable sales in a single calendar quarter or over four consecutive quarters. PST has its own test, covered next.",
        link: {
          label: "Read our guide to sales tax by province.",
          href: article("sales-tax-by-province-self-employed-canada"),
        },
      },
      {
        type: "h2",
        text: "Who Must Register to Collect PST",
      },
      {
        type: "p",
        text: "You must register to collect PST if you are located in B.C. and, in the ordinary course of your business in B.C., you do any of the following:",
      },
      {
        type: "ul",
        items: [
          "Sell taxable goods, such as building materials, furniture, automotive parts or general merchandise.",
          "Lease taxable goods, such as tools and equipment.",
          "Provide related services, such as repairing, maintaining or installing taxable goods.",
          "Provide legal services, online marketplace services or telecommunication services.",
          "Provide software.",
        ],
      },
      {
        type: "h3",
        text: "The small seller exemption",
      },
      {
        type: "p",
        text: "You do not have to register if you qualify as a small seller. Bulletin PST 003 says you are a small seller only if you meet all of these criteria:",
      },
      {
        type: "ul",
        items: [
          "You are located in B.C., but you do not maintain established business premises and do not regularly make retail sales from established commercial premises.",
          "You sell eligible goods, software or services at retail.",
          "You have $10,000 or less in gross revenue from all retail sales of eligible goods, software and services in the previous 12 months, and you estimate $10,000 or less in the next 12 months.",
          "You have not sold goods at wholesale in the previous 12 months.",
          "You do not sell vehicles, tobacco, vapour products, boats, aircraft or fossil fuel combustion systems in the ordinary course of business, accommodation, cannabis products, or liquor (except under a special event permit or at an auction).",
          "You are not a lessor, an independent sales contractor, a contractor who supplies and installs goods that become part of real property, or an online marketplace facilitator.",
        ],
      },
      {
        type: "p",
        text: "On premises: selling from established commercial premises four or more times in 12 months, or keeping established business premises such as an office in an office building, rules you out even under $10,000. A home office where you also meet clients counts as business premises; one with no storefront or in-person sales does not.",
      },
      {
        type: "p",
        text: "The $10,000 is counted over the previous 12 consecutive months, not a calendar year, and includes taxable and exempt eligible sales, even outside B.C. or Canada. Once it goes over $10,000, you must register. A small seller must not charge PST.",
      },
      {
        type: "h3",
        text: "Businesses located outside B.C.",
      },
      {
        type: "p",
        text: "You may also have to register if you are located outside B.C. and sell to B.C. customers. In one of Bulletin PST 001's scenarios, a business elsewhere in Canada must register if, in the ordinary course of business, it sells taxable goods to B.C. customers, accepts their orders, delivers the goods to B.C. and solicits B.C. customers for orders.",
      },
      {
        type: "h2",
        text: "Common Situations for the Self-Employed",
      },
      {
        type: "h3",
        text: "Services: some are taxable, many are not",
      },
      {
        type: "p",
        text: "B.C. taxes services provided to goods, which it calls related services: repairing, maintaining, assembling or installing taxable goods, for example. Automobile maintenance, repairs and oil changes are on the list, so a driver pays PST on vehicle repairs. Related services do not include services to software, or installing goods that become part of real property.",
      },
      {
        type: "p",
        text: "Legal services are taxable at 7%, and if you provide taxable legal services in B.C., you must register. Telecommunication services, including internet access, mobile and landline phone service and streaming, are taxable when the device is ordinarily situated in B.C. For a self-employed person, that usually means PST on the phone and internet bills you pay, not on what you sell.",
      },
      {
        type: "h3",
        text: "Software, apps and web work",
      },
      {
        type: "p",
        text: "B.C. counts software as a service (SaaS), mobile apps and cloud storage as software, taxable when the device using it is ordinarily situated in B.C. If you sell or provide taxable software in B.C., you must register. Two exceptions matter for developers: custom software developed solely for one client can be bought by that client for their own use exempt from PST, and consulting on a client's software needs is generally not taxable unless you also sell them taxable software or hardware.",
      },
      {
        type: "h3",
        text: "Contractors and materials",
      },
      {
        type: "p",
        text: "For real property contractors, B.C. puts the tax on the contractor's purchases: you pay PST on goods you buy to fulfil a real property contract and on the tools, vehicles and other goods you use to run the business, whether the contract is time and materials or lump sum.",
      },
      {
        type: "p",
        text: "Services to real property, such as house painting, roofing, plumbing and electrical work, are not subject to PST. You only need a PST number if you charge customers PST, for example when you sell goods without installing them.",
      },
      {
        type: "h3",
        text: "The paused expansion to professional services",
      },
      {
        type: "p",
        text: "B.C.'s PST pages, last updated September 21, 2026, state: \"the expansion of PST to accounting, architectural, engineering, geoscience, non-residential real estate and security services is paused.\" Budget 2026 had set the expansion for October 1, 2026. B.C. adds that if you registered for a PST account, you should cancel it through eTaxBC or by phone.",
      },
      {
        type: "h2",
        text: "Paying PST on Your Business Purchases",
      },
      {
        type: "p",
        text: "In the words of B.C.'s small business guide: \"Unlike the GST/HST, there are no PST input tax credits provided on goods purchased by a business.\" You are the end user of taxable goods you buy or lease for your business, so PST is payable unless an exemption applies, such as goods bought for resale.",
      },
      {
        type: "p",
        text: "If a seller does not charge you PST when you owe it, for example on equipment ordered from outside B.C., you must self-assess: on your next PST return if you have a PST number, or otherwise on a Casual Remittance Return (FIN 405) by the last day of the month after the purchase.",
      },
      {
        type: "p",
        text: "Small sellers also pay PST on goods bought for resale. Registering voluntarily lets you buy them exempt, but you then must charge PST on your sales.",
      },
      {
        type: "h2",
        text: "Registering, Filing and Paying",
      },
      {
        type: "p",
        text: "You register online through eTaxBC. B.C. says the application takes about 15 to 25 minutes and up to 21 business days to process. You will need your federal business number (BN) if you have one, and as a sole proprietor your B.C. driver's licence number, B.C. ID number or other government-issued identification.",
      },
      {
        type: "p",
        text: "Once registered, you file a return and pay by the last day of the month after each reporting period, moving to the next business day when that falls on a weekend or B.C. statutory holiday. B.C. assigns the reporting period based on the PST you collect each year:",
      },
      {
        type: "ul",
        items: [
          "More than $12,000: monthly only.",
          "More than $6,000 up to $12,000: monthly or quarterly.",
          "More than $3,000 up to $6,000: quarterly or semi-annual.",
          "$3,000 or less: quarterly, semi-annual or annual.",
        ],
      },
      {
        type: "p",
        text: "If you file and pay on time, you can claim a commission of up to $198 per reporting period. You report all PST you charged, whether or not your customer has paid it, along with PST you owe on purchases for your business.",
      },
      {
        type: "h2",
        text: "Keep Receipts That Show the PST",
      },
      {
        type: "p",
        text: "A registered collector must keep records of all sales, all tax charged, collected and remitted, and all purchases for inventory and own use, for five years; a small seller must keep sales records for at least five years. The CRA has its own rules for the receipts behind GST/HST input tax credits.",
        link: {
          label: "Read our guide to CRA receipt rules.",
          href: article("cra-receipt-rules-canada"),
        },
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "What is the PST rate in B.C.?",
        a: "The general rate is 7% on the purchase or lease price of taxable goods and services. Some items have their own rate, such as liquor at 10% and accommodation at 8%. The 5% GST is a separate federal tax, calculated on the price before PST.",
      },
      {
        type: "faq",
        q: "Do I have to register for PST if I earn under $10,000?",
        a: "Not if you qualify as a small seller, which takes more than the $10,000 test: you must also have no established business premises, not regularly sell from established commercial premises, and meet the other criteria in Bulletin PST 003.",
      },
      {
        type: "faq",
        q: "Can I claim back the PST I pay on business purchases?",
        a: "No. B.C. says that unlike the GST/HST, there are no PST input tax credits on goods purchased by a business. PST is payable on taxable goods you buy for your business unless an exemption applies, such as goods bought for resale.",
      },
      {
        type: "faq",
        q: "Do contractors charge PST on their work?",
        a: "Generally not on services to real property, such as painting, roofing, plumbing or electrical work. Instead, the contractor pays PST on the goods bought to fulfil the contract.",
      },
      {
        type: "faq",
        q: "Is PST now charged on accounting and engineering services?",
        a: "No. B.C.'s PST pages, last updated September 21, 2026, say the expansion of PST to accounting, architectural, engineering, geoscience, non-residential real estate and security services is paused.",
      },
      {
        type: "sources",
        links: [
          SRC.pst,
          SRC.register,
          SRC.guide,
          SRC.smallSellers,
          SRC.registering,
          SRC.related,
          SRC.legal,
          SRC.software,
          SRC.telecom,
          SRC.contractorsPay,
          SRC.contractorsCharge,
          SRC.professional,
          SRC.reportPay,
          SRC.craRates,
          SRC.craCharge,
          SRC.craRegister,
        ],
        checked: CHECKED,
      },
    ],
  },
];
