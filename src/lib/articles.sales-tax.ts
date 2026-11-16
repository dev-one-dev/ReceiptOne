/**
 * Sales tax by province (CA only): one guide in the GST / HST category, added
 * 2026-11-16. Appended to ARTICLES in src/lib/articles.ts. Every rate and rule
 * below was read on November 16, 2026 on an official government site:
 * canada.ca for the GST/HST, gov.bc.ca for B.C. PST, saskatchewan.ca for
 * Saskatchewan PST, gov.mb.ca for Manitoba RST and revenuquebec.ca for the
 * QST. No other site was used. Revenu Québec refused automated requests after
 * its GST/HST and QST page and its Small Suppliers page had been read, so the
 * 9.975% QST rate is cited to the CRA's rates page, which states it.
 */
import type { Article } from "@/lib/articles";

const CRA = "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses";
const BC = "https://www2.gov.bc.ca";
const SK =
  "https://www.saskatchewan.ca/business/taxes-licensing-and-reporting/provincial-taxes-policies-and-bulletins/provincial-sales-tax";
const MB = "https://www.gov.mb.ca/finance/taxation";
const RQ = "https://www.revenuquebec.ca/en/businesses/consumption-taxes/gsthst-and-qst";

const SRC = {
  rates: {
    label: "GST/HST calculator (and rates)",
    href: `${CRA}/charge-collect-which-rate/calculator.html`,
  },
  charge: {
    label: "Charge and collect the GST/HST",
    href: `${CRA}/charge-collect-which-rate.html`,
  },
  placeOfSupply: {
    label: "GST/HST rates and place-of-supply rules",
    href: `${CRA}/charge-collect-place-supply.html`,
  },
  whenRegister: {
    label: "When to register for and start charging the GST/HST",
    href: `${CRA}/when-register-charge.html`,
  },
  voluntary: {
    label: "Register voluntarily for a GST/HST account",
    href: `${CRA}/account-register-voluntarily.html`,
  },
  itc: { label: "Input tax credits", href: `${CRA}/complete-file-input-tax-credit.html` },
  bcPst: {
    label: "B.C. provincial sales tax (PST)",
    href: `${BC}/gov/content/taxes/sales-taxes/pst`,
  },
  bcRegister: {
    label: "B.C.: Register to collect PST",
    href: `${BC}/gov/content/taxes/sales-taxes/pst/register`,
  },
  bcGuide: {
    label: "B.C.: Small business guide to PST",
    href: `${BC}/gov/content/taxes/sales-taxes/pst/publications/small-business-guide`,
  },
  bcSmallSellers: {
    label: "B.C. Bulletin PST 003, Small Sellers",
    href: `${BC}/assets/gov/taxes/sales-taxes/publications/pst-003-small-sellers.pdf`,
  },
  skPst: { label: "Saskatchewan: Provincial Sales Tax (PST)", href: SK },
  skNumber: {
    label: "Saskatchewan: PST Number Application",
    href: `${SK}/apply-for-a-pst-number`,
  },
  skAssets: {
    label: "Saskatchewan: Pay PST on Your Business Assets",
    href: `${SK}/pay-pst-on-your-business-assets`,
  },
  mbRst: { label: "Manitoba: Retail Sales Tax", href: `${MB}/taxes/retail.html` },
  mbNotice: {
    label: "Manitoba Notice RST 24-01, Registration Requirement Eliminated for Small Business",
    href: `${MB}/pubs/bulletins/noticerst2401.pdf`,
  },
  mbRegister: {
    label: "Manitoba: Do I Need To Register?",
    href: `${MB}/pubs/bulletins/register.pdf`,
  },
  mbVendors: {
    label: "Manitoba Bulletin RST 004, Information for Vendors",
    href: `${MB}/pubs/bulletins/004.pdf`,
  },
  rqGstQst: { label: "Revenu Québec: GST/HST and QST", href: `${RQ}/` },
  rqSmall: {
    label: "Revenu Québec: Details Concerning Small Suppliers",
    href: `${RQ}/registering-for-the-gst-and-qst/small-suppliers/`,
  },
};

/** Every source URL, for the allowed-domain test and the 200 check. */
export const SALES_TAX_SOURCES = Object.values(SRC);

const CHECKED =
  "All read on November 16, 2026, on canada.ca and the official sites of British Columbia, Saskatchewan, Manitoba and Revenu Québec. This is general information, not tax advice.";

const article = (slug: string) => `/articles/${slug}`;

export const SALES_TAX_ARTICLES: Article[] = [
  {
    slug: "sales-tax-by-province-self-employed-canada",
    title: "GST, HST, PST and QST: Sales Tax by Province for the Self-Employed (2026 Guide)",
    displayTitle: "GST, HST, PST and QST: Sales Tax by Province for the Self-Employed",
    excerpt:
      "The GST, HST and provincial sales tax rates in all 13 provinces and territories, when a self-employed person has to register, which provincial taxes you can recover and which rate to charge clients elsewhere.",
    category: "GST / HST",
    publishedAt: "2026-11-16",
    updatedAt: "2026-11-16",
    image: {
      path: "/articles/sales-tax-by-province-self-employed-canada.webp",
      width: 1280,
      height: 720,
      alt: "A black calculator and two coins lit by a low beam of light on a dark table",
    },
    tags: ["GST/HST", "PST", "QST", "RST", "sales tax", "provinces", "CRA", "self-employed"],
    clusterName: "GST/HST Tracking",
    relatedSlugs: [
      "track-gst-hst-business-expenses",
      "cra-receipt-rules-canada",
      "tax-deductions-rideshare-delivery-drivers-canada",
    ],
    quickAnswer:
      "Alberta and the three territories charge 5% GST only; Ontario charges 13% HST, Nova Scotia 14% and New Brunswick, Newfoundland and Labrador and Prince Edward Island 15%; British Columbia, Saskatchewan, Manitoba and Quebec charge 5% GST plus their own provincial tax. As a self-employed person you must register for GST/HST once your taxable sales pass $30,000 in a single calendar quarter or over four consecutive quarters, and each provincial tax has its own registration rules. For most services, the rate you charge is the one for the province of your client's address.",
    receiptOneHelps: {
      items: [
        "Photograph a paper receipt or upload a photo or PDF, and ReceiptOne reads the merchant, date, total and the GST/HST and PST amounts for you to check.",
        "Estimated refundable taxes keeps a running total of the GST/HST and, where it applies, the QST on your receipts, while PST is flagged separately as non-refundable.",
        "If you are registered, the GST/HST returns worksheet fills line 106 from your receipts; you enter your sales and the tax you collected, and it adds the QST lines when QST applies. It does not file anything with the CRA or Revenu Québec.",
        "The Tax calendar shows your CRA deadlines for the next 12 months, based on your GST/HST filing frequency and instalments.",
        "Export your records, or a finished return worksheet, as a PDF or CSV for your accountant.",
      ],
      link: { label: "See how ReceiptOne works.", href: "/ca" },
    },
    body: [
      {
        type: "p",
        text: "Canada's sales taxes come in layers: the federal GST everywhere, a harmonized sales tax (HST) in five provinces, and a separate provincial tax beside the GST in four others. This guide covers the rates, registration, the provincial taxes and which rate to charge clients elsewhere. Federal rules come from canada.ca and each provincial rule from that province's own government site; the sources are listed at the end.",
      },
      {
        type: "h2",
        text: "Sales Tax Rates in Every Province and Territory",
      },
      {
        type: "p",
        text: "The CRA's rates page lists the GST or HST for each province and territory, with any separate provincial tax. The one recent change it notes: Nova Scotia's HST rate decreased to 14% as of April 1, 2025. The rates below are current as stated on the cited pages.",
      },
      {
        type: "table",
        caption:
          "GST, HST and the QST rate: the CRA's GST/HST rates page. Provincial rates: the B.C., Saskatchewan and Manitoba government sites. Read November 16, 2026.",
        headers: ["Province or territory", "Taxes that apply", "GST or HST", "Provincial tax"],
        rows: [
          ["Alberta", "GST only", "5% GST", "None"],
          ["British Columbia", "GST + PST", "5% GST", "7% PST (general rate)"],
          ["Manitoba", "GST + RST", "5% GST", "7% RST (general rate)"],
          ["New Brunswick", "HST", "15% HST", "Part of the HST"],
          ["Newfoundland and Labrador", "HST", "15% HST", "Part of the HST"],
          ["Northwest Territories", "GST only", "5% GST", "None"],
          ["Nova Scotia", "HST", "14% HST, as of April 1, 2025", "Part of the HST"],
          ["Nunavut", "GST only", "5% GST", "None"],
          ["Ontario", "HST", "13% HST", "Part of the HST"],
          ["Prince Edward Island", "HST", "15% HST", "Part of the HST"],
          ["Quebec", "GST + QST", "5% GST", "9.975% QST"],
          ["Saskatchewan", "GST + PST", "5% GST", "6% PST"],
          ["Yukon", "GST only", "5% GST", "None"],
        ],
      },
      {
        type: "p",
        text: "Where a provincial sales tax applies, the CRA says to calculate the GST on the price without it. Where HST applies, your receipt or invoice shows the total HST rate, not the federal and provincial parts.",
      },
      {
        type: "h2",
        text: "GST/HST Registration for the Self-Employed",
      },
      {
        type: "h3",
        text: "The $30,000 small supplier test",
      },
      {
        type: "p",
        text: "You do not have to register for GST/HST while you are a small supplier: your taxable sales have not exceeded $30,000 in a single calendar quarter or over four consecutive calendar quarters. As a sole proprietor, you count the revenue before expenses from your worldwide taxable supplies, from all your businesses and those of your associates. Calendar quarters begin on January 1, April 1, July 1 and October 1.",
      },
      {
        type: "p",
        text: "Going over $30,000 in one quarter ends small supplier status on that sale: your registration is effective no later than that day, and you charge GST/HST on it. Going over across four quarters ends it at the end of the month after the quarter in which you went over, effective no later than your next sale. In the CRA's examples, you then have 29 days from your effective date to register.",
      },
      {
        type: "h3",
        text: "Registering voluntarily",
      },
      {
        type: "p",
        text: "Below the threshold, you may register voluntarily if you make taxable sales in Canada, usually effective the day you request your account or up to 30 days earlier. You then charge, collect and remit the tax, file returns and stay registered for at least one year, unless you stop your commercial activities. If you do not register, you charge no GST/HST and claim no input tax credits.",
      },
      {
        type: "h3",
        text: "Ride-sharing drivers register from the first fare",
      },
      {
        type: "p",
        text: "The threshold does not apply to commercial ride-sharing. A self-employed taxi or ride-sharing driver has to register for GST/HST even as a small supplier, and the effective date of registration is the day you start supplying taxable passenger transportation services.",
        link: {
          label: "Read our tax guide for rideshare and delivery drivers.",
          href: article("tax-deductions-rideshare-delivery-drivers-canada"),
        },
      },
      {
        type: "h3",
        text: "Once you are registered",
      },
      {
        type: "p",
        text: "You charge GST/HST at the rate for the place of supply, hold it in trust until you remit it, and file a return for each reporting period. The invoice date decides which return a sale belongs on, whether or not you have been paid.",
        link: { label: "Check the current CRA deadlines.", href: "/ca/tax-deadlines" },
      },
      {
        type: "p",
        text: "You recover the GST/HST you pay on business purchases by claiming input tax credits (ITCs) on line 106, to the extent they are for your commercial activities. Under the quick method of accounting, you cannot claim ITCs for operating expenses. For most registrants, a missed ITC can be claimed until the due date of the return for the last reporting period ending within four years after the period in which it could first have been claimed.",
        link: {
          label: "Read our guide to tracking GST/HST on business expenses.",
          href: article("track-gst-hst-business-expenses"),
        },
      },
      {
        type: "h2",
        text: "Provincial Sales Taxes: Registration and Recovery",
      },
      {
        type: "h3",
        text: "British Columbia PST",
      },
      {
        type: "p",
        text: "You must register to collect PST if you are located in B.C. and, in the ordinary course of your business there, sell or lease taxable goods, or provide software or taxable services such as repairs to taxable goods or legal services. The general rate is 7%.",
        link: {
          label: "Read our guide to B.C. PST for the self-employed.",
          href: article("bc-pst-self-employed"),
        },
      },
      {
        type: "p",
        text: "A small seller does not have to register: located in B.C., not regularly selling from established commercial premises, with $10,000 or less in gross revenue from retail sales of eligible goods, software and services in the previous 12 months and expected in the next 12. B.C. says this list of conditions is not complete. Its PST pages also state that the planned expansion of PST to accounting, architectural, engineering, geoscience, non-residential real estate and security services is paused.",
      },
      {
        type: "p",
        text: "On recovery, the province is direct: unlike the GST/HST, there are no PST input tax credits on goods purchased by a business. PST applies to taxable goods you buy or lease for use in your business, and if a supplier does not charge it, you must self-assess it.",
      },
      {
        type: "h3",
        text: "Saskatchewan PST",
      },
      {
        type: "p",
        text: "Saskatchewan's PST is a six per cent tax on taxable goods and services consumed or used in the province. Businesses operating there must register for a PST number, either a vendor's licence number or a registered consumer number; the pages we read describe no small seller exception. Businesses pay PST on the assets they buy and self-assess it when a supplier did not collect it.",
      },
      {
        type: "h3",
        text: "Manitoba RST",
      },
      {
        type: "p",
        text: "Manitoba's retail sales tax (RST) applies to the retail sale or rental of most goods and certain services, at a general rate of 7% on the price before GST. Since April 2024, businesses with annual taxable sales under $30,000 do not have to register, unless they use out-of-province suppliers that do not collect Manitoba RST or sell tobacco or liquor. A business that goes over $30,000 has one month to register.",
      },
      {
        type: "p",
        text: "Unregistered small businesses pay RST on what they buy, for their own use and for resale. Registering does not change that for your own purchases: Manitoba says an RST number does not allow the purchase of taxable goods or services without paying RST, unless they are for resale or another exempt purpose.",
      },
      {
        type: "h3",
        text: "Quebec QST",
      },
      {
        type: "p",
        text: "In Quebec, the GST and the Quebec sales tax (QST) are both collected on most property and services. Revenu Québec lists the obligations together: register for the GST and QST, collect the taxes, calculate your input tax credits (ITCs) and input tax refunds (ITRs), and file GST and QST returns. The CRA's rates page gives the QST rate as 9.975%.",
      },
      {
        type: "p",
        text: "The small supplier limit is the same $30,000, over a calendar quarter or the four preceding quarters. A registrant collects the taxes and can claim ITCs and ITRs on purchases made to make taxable supplies, so unlike PST and RST, the QST you pay on business purchases can be recovered. A business that registers for the QST must also register for the GST/HST and stay registered for at least one year.",
      },
      {
        type: "h2",
        text: "Which Rate to Charge Clients in Other Provinces",
      },
      {
        type: "p",
        text: "The rate depends on the place of supply, not where you live. For services, if you obtain your client's home or business address in Canada in the normal course of business, the place of supply is the province of that address. The CRA's example: a supplier working entirely in Quebec designs a website for a company with an Ontario business address, so the HST applies at the Ontario rate.",
      },
      {
        type: "p",
        text: "With no address, it follows where you perform the service: GST only if the Canadian part is not performed primarily (more than 50%) in participating provinces, the ones that charge HST, and otherwise the participating province with the largest share. Personal services, generally those performed 90% or more in the client's presence, have their own rules, as do services related to goods or real property.",
        link: {
          label: "Read the CRA's place-of-supply rules.",
          href: SRC.placeOfSupply.href,
        },
      },
      {
        type: "p",
        text: "These rules decide the GST or HST only. A provincial sales tax has its own reach: B.C., for example, says a business located outside the province that sells to B.C. customers may need to register for its PST.",
      },
      {
        type: "h2",
        text: "Keep Receipts That Show the Tax",
      },
      {
        type: "p",
        text: "To claim an ITC, you need documents that show the tax. For a purchase of $100 to $499.99, the receipt or invoice must show, among other things, the GST/HST charged (or that it is included) and the supplier's GST/HST registration number; from $500, it must also show your name or trading name. You can confirm a GST/HST number with the CRA, and a QST number with Revenu Québec. Keep your records for six years from the end of the last year they relate to.",
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
        q: "Which provinces charge HST?",
        a: "Ontario (13%), Nova Scotia (14% as of April 1, 2025), and New Brunswick, Newfoundland and Labrador and Prince Edward Island (15%). Alberta and the three territories charge 5% GST only, and British Columbia, Saskatchewan, Manitoba and Quebec charge 5% GST plus their own provincial tax.",
      },
      {
        type: "faq",
        q: "Do I have to charge GST/HST if I earn under $30,000?",
        a: "Not while you are a small supplier, unless you drive for a commercial ride-sharing service, which requires registration from the start. You may still register voluntarily, which lets you claim input tax credits but means charging and remitting the tax.",
      },
      {
        type: "faq",
        q: "Can I get back the PST I pay on business purchases?",
        a: "Not the way you recover GST/HST. British Columbia says there are no PST input tax credits on goods a business buys, and Manitoba says an RST number does not let you buy taxable goods or services without paying RST unless they are for resale or another exempt purpose. The QST is different: registrants can claim input tax refunds.",
      },
      {
        type: "faq",
        q: "Which rate do I charge a client in another province?",
        a: "For most services, the rate of the province of your client's home or business address, if you obtain that address in the normal course of business. In the CRA's example, a Quebec supplier designing a website for a company with an Ontario business address charges HST at the Ontario rate.",
      },
      {
        type: "faq",
        q: "Is there a small seller exception for PST?",
        a: "In British Columbia, a small seller with $10,000 or less in eligible retail sales over the previous 12 months, and the same expected for the next 12, does not have to register. In Manitoba, businesses with annual taxable sales under $30,000 generally do not have to register for RST. Saskatchewan says businesses operating there must register.",
      },
      {
        type: "sources",
        links: [
          SRC.rates,
          SRC.charge,
          SRC.placeOfSupply,
          SRC.whenRegister,
          SRC.voluntary,
          SRC.itc,
          SRC.bcPst,
          SRC.bcRegister,
          SRC.bcGuide,
          SRC.bcSmallSellers,
          SRC.skPst,
          SRC.skNumber,
          SRC.skAssets,
          SRC.mbRst,
          SRC.mbNotice,
          SRC.mbRegister,
          SRC.mbVendors,
          SRC.rqGstQst,
          SRC.rqSmall,
        ],
        checked: CHECKED,
      },
    ],
  },
];
