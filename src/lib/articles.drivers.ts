/**
 * Rideshare and delivery drivers (CA only): one guide in the Mileage & Auto
 * category, added 2026-11-16. Appended to ARTICLES in src/lib/articles.ts.
 * Every CRA rule and number below was read on the canada.ca pages listed in
 * its sources block on November 16, 2026. Examples are hypothetical and
 * labelled that way, except the fare example, which is the CRA's own.
 */
import type { Article } from "@/lib/articles";

const CRA = "https://www.canada.ca/en/revenue-agency";
const PLATFORM = `${CRA}/programs/about-canada-revenue-agency-cra/compliance/platform-economy`;
const GST = `${CRA}/services/tax/businesses/topics/gst-hst-businesses`;
const SOLE = `${CRA}/services/tax/businesses/topics/sole-proprietorships-partnerships`;
const INSTAL = `${CRA}/services/payments/payments-cra/individual-payments/income-tax-instalments`;

const SRC = {
  sharing: {
    label: "Sharing economy (commercial ridesharing)",
    href: `${PLATFORM}/sharing-economy.html`,
  },
  gig: { label: "Gig economy", href: `${PLATFORM}/gig-economy.html` },
  taxi: {
    label: "GST/HST for taxi operators and commercial ride-sharing drivers",
    href: `${GST}/charge-collect-specific-situations/taxi-ride-sharing-drivers.html`,
  },
  gi196: {
    label: "GST/HST Info Sheet GI-196, Commercial Ride-sharing Services",
    href: `${CRA}/services/forms-publications/publications/gi-196/gst-hst-commercial-ride-sharing-services.html`,
  },
  register: {
    label: "Register as a rideshare driver or taxi operator",
    href: `${CRA}/services/tax/businesses/topics/business-registration/business-number-program-account/register-rideshare-taxi.html`,
  },
  smallSupplier: {
    label: "When to register for GST/HST",
    href: `${GST}/when-register-charge.html`,
  },
  gstDeadlines: {
    label: "GST/HST filing deadlines",
    href: `${GST}/file-gst-hst-return/reporting-requirements-deadlines.html`,
  },
  vehicleBusinessUse: {
    label: "Motor vehicle expenses (not including CCA)",
    href: `${SOLE}/report-business-income-expenses/completing-form-t2125/motor-vehicle-expenses-including.html`,
  },
  vehicleRecords: {
    label: "Motor vehicle records",
    href: `${SOLE}/business-expenses/motor-vehicle-expenses/motor-vehicle-records.html`,
  },
  t4002Expenses: {
    label: "T4002, Chapter 3 – Expenses",
    href: `${CRA}/services/forms-publications/publications/t4002/t4002-5.html`,
  },
  t4002Cca: {
    label: "T4002, Chapter 4 – CCA",
    href: `${CRA}/services/forms-publications/publications/t4002/t4002-6.html`,
  },
  retention: {
    label: "How long to keep records",
    href: `${CRA}/services/tax/businesses/topics/keeping-records/where-keep-your-records-long-request-permission-destroy-them-early.html`,
  },
  instalmentsWho: {
    label: "Instalments: who has to pay",
    href: `${INSTAL}/who-pays-instalments.html`,
  },
  instalmentDates: { label: "Instalment due dates", href: `${INSTAL}/due-dates.html` },
  importantDates: {
    label: "Important dates for individuals",
    href: `${CRA}/services/tax/individuals/topics/important-dates-individuals.html`,
  },
};

const CHECKED =
  "All read on canada.ca on November 16, 2026. Guide T4002 is the 2025 edition, the newest published. This is general information, not tax advice.";

const article = (slug: string) => `/articles/${slug}`;

export const DRIVER_ARTICLES: Article[] = [
  {
    slug: "tax-deductions-rideshare-delivery-drivers-canada",
    title: "Tax Deductions for Rideshare and Delivery Drivers in Canada (2026 Guide)",
    displayTitle: "Tax Deductions for Rideshare and Delivery Drivers in Canada",
    excerpt:
      "What Canadian rideshare and delivery drivers report on Form T2125, the GST/HST rule that applies from your first fare, the driving costs you can deduct and the records to keep.",
    category: "Mileage & Auto",
    publishedAt: "2026-11-16",
    updatedAt: "2026-11-16",
    image: {
      path: "/articles/tax-deductions-rideshare-delivery-drivers-canada.webp",
      width: 1280,
      height: 720,
      alt: "Raindrops on a car windshield at dusk with blurred red and white city lights beyond",
    },
    tags: [
      "rideshare",
      "delivery",
      "gig economy",
      "GST/HST",
      "vehicle expenses",
      "logbook",
      "T2125",
      "CRA",
      "self-employed",
    ],
    clusterName: "Mileage & Vehicle Deductions",
    relatedSlugs: [
      "mileage-deduction-canada-freelancers",
      "self-employed-tax-deductions-canada",
      "track-gst-hst-business-expenses",
    ],
    quickAnswer:
      "If you drive for a rideshare or delivery app in Canada, you are usually self-employed and report your earnings, tips included, on Form T2125. Rideshare drivers must register for GST/HST from their first fare, while delivery-only drivers follow the $30,000 small supplier rule. You can deduct the fees the platform keeps and the business share of your vehicle and phone costs, backed by a kilometre logbook and receipts.",
    receiptOneHelps: {
      items: [
        "Turn on trip tracking and the app records your trips by GPS in the background; tag each one business or personal, and log personal trips too so your totals are complete.",
        "Photograph gas, car wash and repair receipts when you pay, upload an image or PDF, or forward an e-mail receipt to your own ReceiptOne address. Bulk upload a batch if you are catching up.",
        "Your T2125 report fills in the kilometres for Chart A: business kilometres, total kilometres and business-use percentage.",
        "If you are registered for GST/HST, the GST/HST returns worksheet fills in your input tax credits from your receipts; you enter your sales and the tax you collected, and ReceiptOne calculates the GST34 lines. It does not file anything with the CRA.",
        "The Tax calendar lists your CRA deadlines based on your GST/HST filing frequency and instalments, and the AI assistant answers questions about your own records, such as your recoverable GST/HST or business-use percentage.",
      ],
      link: { label: "See how ReceiptOne works for drivers.", href: "/ca/drivers" },
    },
    body: [
      {
        type: "p",
        text: "Driving passengers through Uber or Lyft, or delivering orders through Uber Eats, DoorDash, SkipTheDishes or Instacart, is a business in the CRA's eyes when you do it as an independent contractor. That brings two sets of rules: income tax, which works much like any other self-employed work, and GST/HST, where rideshare drivers have a special rule that delivery drivers do not.",
      },
      {
        type: "p",
        text: "This guide covers what is specific to driving for a platform and links to our longer guides for the full vehicle rules. Every rule here comes from canada.ca, and the pages are listed at the end.",
      },
      {
        type: "h2",
        text: "Who This Guide Is For",
      },
      {
        type: "p",
        text: "The CRA's platform economy pages describe gig workers as independent contractors and freelancers, and name Uber Eats and Skip the Dishes among the platforms. Its ridesharing page says that, regardless of how much time you spend driving for fares, you must report the income on your return and complete Form T2125, Statement of Business or Professional Activities.",
      },
      {
        type: "p",
        text: "On T2125, the CRA asks commercial ridesharing drivers to use industry code 485310, Taxi service, or 485320, Limousine service, if you drive a limousine.",
      },
      {
        type: "h2",
        text: "Report All Platform Income, Tips Included",
      },
      {
        type: "p",
        text: "The CRA is direct about this: report all income, including tips, that you earn from driving for commercial ridesharing. The same applies to delivery work, since gig workers resident in Canada must report all their self-employment income. In-app tips and cash tips both count.",
      },
      {
        type: "p",
        text: "Your platform may give you an earnings statement or a yearly tax summary. Layouts differ between platforms and change over time, so use the summary as a starting point and check that you can see fares or delivery pay, tips, and the fees or service charges the platform kept. The CRA's ridesharing page says you may claim expenses for any charges the digital platform keeps, so the fees belong on the expense side rather than being netted out silently.",
      },
      {
        type: "p",
        text: "Before you file, compare the summary's totals with the deposits in your bank account for the year. If a number does not match, find out why.",
      },
      {
        type: "h2",
        text: "GST/HST: Rideshare and Delivery Follow Different Rules",
      },
      {
        type: "h3",
        text: "Rideshare drivers register from the first fare",
      },
      {
        type: "p",
        text: "For GST/HST, the CRA treats commercial ridesharing as a taxi business. Guide GI-196 explains that since July 1, 2017, the definition of a taxi business includes transporting passengers for fares by motor vehicle within a municipality and its environs when the trip is arranged through an electronic platform, such as a mobile app or website. Non-commercial carpooling that involves no taxable supply is not covered.",
      },
      {
        type: "p",
        text: "The small supplier threshold of $30,000 does not apply to this work. You must register for a GST/HST account, and a business number, as soon as you start earning money from commercial ridesharing, whatever the amount. Your effective date of registration is the day you charged your first fare. GI-196 says you must apply before the thirtieth day after that date, and if that date is more than 30 days in the past, the CRA's registration page says you must backdate your registration.",
      },
      {
        type: "p",
        text: "The GST/HST is usually included in the fare, so you work out the tax inside each fare rather than adding it on top. The rate depends on the province where the trip begins. The CRA's own example: a $20 ride-sharing fare in Ontario includes $2.30 of HST ($20 × 13 ÷ 113). In a GST-only province such as Alberta, the tax inside a fare is the fare × 5 ÷ 105. In Quebec, Revenu Québec administers the GST and QST.",
      },
      {
        type: "h3",
        text: "Delivery-only drivers follow the small supplier rule",
      },
      {
        type: "p",
        text: "The CRA treats food delivery separately from ridesharing (see the example below), so the general rule applies. You are a small supplier, and do not have to register, until your taxable sales pass $30,000 in a single calendar quarter or over four consecutive calendar quarters. You may register voluntarily below that amount, which lets you claim input tax credits but also means charging and remitting the tax.",
      },
      {
        type: "h3",
        text: "If you do both",
      },
      {
        type: "p",
        text: "If your combined rideshare and other taxable sales are under $30,000, your mandatory registration generally covers only the rideshare fares unless you ask otherwise. The CRA's example: Abby earns $10,000 driving passengers and $10,000 delivering food, so she charges GST/HST only on the passenger fares. Once the combined total passes $30,000, you charge and remit GST/HST on all of it, delivery included.",
      },
      {
        type: "h3",
        text: "Input tax credits and filing",
      },
      {
        type: "p",
        text: "As a registrant you can generally claim input tax credits for the GST/HST you pay on gas, repairs, maintenance and washes, and vehicle leases and purchases, in proportion to business use. You cannot claim them for insurance or interest, which are not subject to GST/HST. The quick method is another option, but under it you cannot claim ITCs on most purchases.",
      },
      {
        type: "p",
        text: "GI-196 says new rideshare registrants are assigned an annual reporting period unless they choose monthly or quarterly. A sole proprietor who files annually, has a December 31 year-end and has business income pays by April 30 and files by June 15. Monthly and quarterly returns are due one month after the period ends.",
        link: {
          label: "Read our guide to tracking GST/HST on expenses.",
          href: article("track-gst-hst-business-expenses"),
        },
      },
      {
        type: "h2",
        text: "Driving Costs You Can Deduct",
      },
      {
        type: "h3",
        text: "Vehicle expenses, times your business-use share",
      },
      {
        type: "p",
        text: "Line 9281 of T2125 covers licence and registration fees, fuel and oil, electricity for a zero-emission vehicle, insurance, interest on a loan to buy the vehicle, maintenance and repairs, and leasing costs. The CRA's GST/HST page for drivers also lists car washes among their business purchases. Because you also drive the car for yourself, you deduct only the business part, worked out in Chart A from your business and total kilometres.",
      },
      {
        type: "p",
        text: "Hypothetical example: you drive 30,000 km in the year, 18,000 of them for the platforms. Business use is 60%, so $9,000 of running costs becomes a $5,400 deduction, before capital cost allowance.",
      },
      {
        type: "p",
        text: "Two items are not prorated. You can deduct the full amount of parking fees related to your business activities, and the full cost of supplementary business insurance for the vehicle. Parking tickets and traffic fines are different: Guide T4002 lists most fines and penalties imposed under a law of Canada or a province among the amounts you cannot deduct.",
      },
      {
        type: "h3",
        text: "Kilometres between trips and while waiting",
      },
      {
        type: "p",
        text: "What about kilometres driven to a pickup zone, back from a drop-off or while the app is open and you wait? The CRA's vehicle pages do not set out a specific rule for this. Record those kilometres in your logbook as a separate line with a clear purpose, so you can show what they were, and confirm the treatment with the CRA or a tax professional before you claim them.",
        link: {
          label: "Read our full guide to mileage and vehicle deductions.",
          href: article("mileage-deduction-canada-freelancers"),
        },
      },
      {
        type: "h3",
        text: "Platform fees, phone and data",
      },
      {
        type: "p",
        text: "The fees and service charges the platform keeps are a business expense. Your phone runs the app, so the business part of your plan and data is deductible too, but only that part: T4002 excludes the share of any expense that relates to personal use. Keep the monthly bills and note how you arrived at the business share.",
      },
      {
        type: "h3",
        text: "The car itself: capital cost allowance",
      },
      {
        type: "p",
        text: "The purchase price of a car is not an expense. You claim capital cost allowance instead, on line 9936, usually in Class 10 or Class 10.1, and only on the business part. In the year you buy it, the half-year rule generally limits the claim, and passenger vehicles above a set cost go into Class 10.1, which caps the amount you can depreciate.",
        link: {
          label: "See how T2125 handles CCA, line by line.",
          href: article("t2125-form-guide-canada"),
        },
      },
      {
        type: "p",
        text: "Other deductions open to any sole proprietor, such as bank fees or accounting fees, work the same way for drivers.",
        link: {
          label: "Read our guide to self-employed tax deductions.",
          href: article("self-employed-tax-deductions-canada"),
        },
      },
      {
        type: "h2",
        text: "Records to Keep",
      },
      {
        type: "p",
        text: "The CRA says the best evidence of business use is a logbook kept for the whole year, showing for each business trip the date, destination, purpose and kilometres. Record your odometer reading at the start and end of the year, and on the day you buy, sell or trade a vehicle. After one full year of logging, you can keep a three-month sample in later years, as long as the result stays within 10% of the base year.",
      },
      {
        type: "p",
        text: "Keep receipts for every vehicle cost, your phone bills, and the platform statements that show your earnings, tips and fees. Records generally have to be kept for six years from the end of the last tax year they relate to, and the base-year logbook for six years after the last year you use it.",
        link: {
          label: "Download a free CRA mileage log template.",
          href: "/ca/mileage-log-template",
        },
      },
      {
        type: "h2",
        text: "Instalments and Deadlines",
      },
      {
        type: "p",
        text: "You have to pay income tax by instalments if your net tax owing is more than $3,000 ($1,800 in Quebec) this year and in either of the two previous years. Instalments are due March 15, June 15, September 15 and December 15. Self-employed individuals file by June 15, but any balance owing is due by April 30.",
        link: { label: "Check the current CRA deadlines.", href: "/ca/tax-deadlines" },
      },
      {
        type: "h2",
        text: "Frequently Asked Questions",
      },
      {
        type: "faq",
        q: "Do I need a GST/HST number if I only drive for Uber or Lyft part-time?",
        a: "Yes. The $30,000 small supplier threshold does not apply to commercial ridesharing. You must register for a business number and a GST/HST account from the day you charge your first fare, whatever you earn.",
      },
      {
        type: "faq",
        q: "Do food delivery drivers have to register for GST/HST?",
        a: "Not until their taxable sales pass $30,000 in a single calendar quarter or over four consecutive calendar quarters. If you also drive passengers and the combined total passes $30,000, GST/HST applies to your delivery income as well.",
      },
      {
        type: "faq",
        q: "Do I have to report tips from the app?",
        a: "Yes. The CRA says to report all income, including tips, that you earn from commercial ridesharing, and gig workers must report all their self-employment income.",
      },
      {
        type: "faq",
        q: "Can I deduct the fees the platform takes?",
        a: "Yes. The CRA says you may claim expenses for any charges the digital platform keeps. Make sure your income and the fees both appear on Form T2125.",
      },
      {
        type: "faq",
        q: "Can I claim kilometres driven while waiting for a request?",
        a: "The CRA's vehicle pages do not give a specific rule for this. Log those kilometres separately with their purpose, and check with the CRA or a tax professional before you count them as business kilometres.",
      },
      {
        type: "sources",
        links: [
          SRC.sharing,
          SRC.gig,
          SRC.taxi,
          SRC.gi196,
          SRC.register,
          SRC.smallSupplier,
          SRC.gstDeadlines,
          SRC.vehicleBusinessUse,
          SRC.vehicleRecords,
          SRC.t4002Expenses,
          SRC.t4002Cca,
          SRC.retention,
          SRC.instalmentsWho,
          SRC.instalmentDates,
          SRC.importantDates,
        ],
        checked: CHECKED,
      },
    ],
  },
];
