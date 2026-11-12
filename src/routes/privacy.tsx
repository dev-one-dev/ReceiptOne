import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BulletList,
  DataTable,
  PrivacyDocument,
  Section,
  SubSection,
  type PrivacySectionMeta,
} from "@/components/site/legal/PrivacyDocument";
import type { SummaryItem } from "@/components/site/legal/shared";
import { pageSEO, breadcrumbJsonLd, regionHreflang } from "@/lib/seo";
import { openConsentSettings } from "@/lib/consent";

/* ----------------------------- Section catalog ---------------------------- */

/**
 * Lightweight catalog so the TOC, accordion, region filtering, and Print
 * features work without restructuring the inline section text below.
 * `region` flags subsections that apply only to one jurisdiction.
 * The French twin (routes/fr/privacy.tsx) keeps the same numbering.
 */
const SECTIONS: PrivacySectionMeta[] = [
  { number: "1", title: "Scope" },
  {
    number: "2",
    title: "Information We Collect",
    subsections: [
      { id: "2.1", title: "2.1 Information You Provide Directly" },
      { id: "2.2", title: "2.2 Receipt, Expense, and Tax-Related Data" },
      { id: "2.3", title: "2.3 Payment Information" },
      { id: "2.4", title: "2.4 Automatically Collected Information" },
      { id: "2.5", title: "2.5 Device Permissions" },
      { id: "2.6", title: "2.6 Location Information and Background Location" },
      {
        id: "2.7",
        title: "2.7 Categories of Personal Information for California Residents",
        region: "us",
      },
    ],
  },
  { number: "3", title: "How We Use Personal Information" },
  { number: "4", title: "AI-Assisted and Automated Processing" },
  { number: "5", title: "How We Share Personal Information" },
  { number: "6", title: "International and Cross-Border Processing" },
  { number: "7", title: "Data Retention" },
  {
    number: "8",
    title: "Your Privacy Rights",
    subsections: [
      { id: "8.1", title: "8.1 Canada (PIPEDA and Quebec Law 25)", region: "ca" },
      { id: "8.2", title: "8.2 United States (California and other states)", region: "us" },
      { id: "8.3", title: "8.3 How to Submit Requests" },
      { id: "8.4", title: "8.4 Verification and Appeals" },
    ],
  },
  {
    number: "9",
    title: "Consent",
    subsections: [
      { id: "9.1", title: "9.1 General Consent" },
      {
        id: "9.2",
        title: "9.2 Express Consent for Quebec Residents and Sensitive Information",
        region: "ca",
      },
      { id: "9.3", title: "9.3 Withdrawal of Consent" },
    ],
  },
  { number: "10", title: "Security Safeguards" },
  { number: "11", title: "Children's Privacy" },
  { number: "12", title: "Changes to This Privacy Policy" },
  { number: "13", title: "Contact Information" },
];

const PRIVACY_SUMMARY: SummaryItem[] = [
  {
    title: "What we collect",
    body: "Account info, receipts/expenses you upload, OCR-extracted data, device location while you record a trip, device & usage diagnostics, and limited subscription metadata from Apple/Google.",
  },
  {
    title: "Location",
    body: "Collected only while a trip is recording, including in the background, and used only for your mileage records. Never sold or used for advertising.",
  },
  {
    title: "How we use it",
    body: "To run the Services, process receipts via OCR/AI, generate reports, secure accounts, and comply with the law. No selling of personal info.",
  },
  {
    title: "AI processing",
    body: "OCR and AI-assisted features extract and classify data on your behalf. You can review and correct outputs.",
  },
  {
    title: "Sharing",
    body: "Limited to the service providers listed in Section 5 (hosting, AI processing, maps, subscriptions, email, messaging), most of them in the United States, plus legal/compliance disclosures when required.",
  },
  {
    title: "Your rights",
    body: "Access, correction, deletion, portability, and the right to withdraw consent. Submit requests to support@receipt-one.com.",
    region: "all",
  },
  {
    title: "Quebec & PIPEDA rights",
    body: "Includes data portability, the right to be informed of automated decisions, and the right to file a complaint with the OPC or CAI.",
    region: "ca",
  },
  {
    title: "California (CCPA/CPRA)",
    body: "Right to know, delete, correct, and limit use of sensitive personal info. We do not sell or share for cross-context advertising.",
    region: "us",
  },
  {
    title: "Retention & security",
    body: "Retained only as long as needed for the Services and legal obligations. Encrypted in transit and at rest with access controls.",
  },
  {
    title: "Contact",
    body: "Privacy Officer, Flutter Horizon: support@receipt-one.com or the contact form at receipt-one.com/contact.",
  },
];

export const Route = createFileRoute("/privacy")({
  head: () => {
    const seo = pageSEO({
      path: "/privacy",
      hreflang: regionHreflang("/privacy"),
      title: "Privacy Policy | ReceiptOne",
      description:
        "Learn how ReceiptOne collects, uses, protects, and manages personal information for users in the United States and Canada.",
      ogTitle: "Privacy Policy | ReceiptOne",
      ogDescription:
        "How ReceiptOne collects, uses, discloses, stores, and protects personal information for users in the United States and Canada.",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Privacy Policy", path: "/privacy" },
            ]),
          ),
        },
      ],
    };
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PrivacyDocument
      lang="en"
      storageKey="legal:privacy"
      sections={SECTIONS}
      summary={PRIVACY_SUMMARY}
      header={
        <>
          <p className="text-sm font-medium text-muted-foreground">
            Last updated: November 9, 2026
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-normal sm:text-5xl">
            ReceiptOne — Privacy Policy
          </h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              This Privacy Policy explains how Flutter Horizon, a sole proprietorship registered in
              British Columbia, Canada, which operates the ReceiptOne service
              (&quot;ReceiptOne,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;),
              collects, uses, discloses, stores, and protects personal information when you use the
              ReceiptOne mobile applications (iOS and Android), the ReceiptOne web application, and
              related services (collectively, the &quot;Services&quot;).
            </p>
            <p>
              ReceiptOne is designed for self-employed individuals, contractors, and small
              businesses.
            </p>
            <p>
              This Privacy Policy is intended to comply with applicable privacy laws in Canada and
              the United States, including:
            </p>
            <BulletList
              items={[
                "The Personal Information Protection and Electronic Documents Act (PIPEDA) (Canada, federal)",
                "Quebec's Law 25 (amending the Act respecting the protection of personal information in the private sector) (Quebec, Canada)",
                "The California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA) (California, USA)",
                "Other applicable U.S. state privacy laws (Colorado, Connecticut, Utah, Virginia, and others)",
              ]}
            />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <strong className="text-foreground">Privacy requests and questions:</strong>{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="mailto:support@receipt-one.com"
            >
              support@receipt-one.com
            </a>
          </p>
        </>
      }
    >
      <Section number="1" title="Scope">
        <p>
          This Privacy Policy applies to personal information collected through the Services,
          including when you:
        </p>
        <BulletList
          items={[
            "Create an account",
            "Upload receipts, invoices, or other documents",
            "Record or enter mileage trips",
            "Use reporting, analytics, or tax configuration features",
            "Contact support",
            "Otherwise interact with the Services",
          ]}
        />
      </Section>

      <Section number="2" title="Information We Collect">
        <SubSection title="2.1 Information You Provide Directly">
          <BulletList
            items={[
              "Name",
              "Email address",
              "Account credentials",
              "Subscription and billing status information received from app store platforms (Apple App Store, Google Play Store)",
              "App preferences and settings",
              "Country, province/state, and other configuration data relevant to tax logic and reporting",
              "Support requests and communications you send to us",
            ]}
          />
        </SubSection>

        <SubSection title="2.2 Receipt, Expense, and Tax-Related Data">
          <p>
            To provide expense tracking, organization, and reporting functionality, we may collect
            and process:
          </p>
          <BulletList
            items={[
              "Images of receipts and documents uploaded by you",
              "Data extracted from receipts or documents using OCR, such as merchant name, transaction date, amount, taxes, and currency",
              "Manually entered expenses and related notes",
              "Mileage and trip records",
              "Home office information, such as square footage, allocation percentages, and related expense inputs",
              "Tax-related forms, reports, or documents that you upload or generate through the Services",
            ]}
          />
          <p>
            <strong>Sensitive personal information:</strong> Receipt images, expense records, and
            uploaded documents may contain financial information and other sensitive business
            information. We process this information only as reasonably necessary to provide,
            secure, maintain, and improve the Services and for other purposes described in this
            Privacy Policy.
          </p>
        </SubSection>

        <SubSection title="2.3 Payment Information">
          <p>
            ReceiptOne does not collect or store full payment card numbers through the mobile
            application.
          </p>
          <p>
            Payments for mobile subscriptions are processed by third-party platforms such as Apple
            App Store and Google Play Store. We receive limited subscription metadata from those
            platforms, such as:
          </p>
          <BulletList
            items={[
              "Plan type",
              "Renewal status",
              "Country",
              "Transaction identifiers",
              "Subscription status",
            ]}
          />
          <p>
            If additional web billing or payment processors are introduced in the future, this
            Privacy Policy will be updated accordingly.
          </p>
        </SubSection>

        <SubSection title="2.4 Automatically Collected Information">
          <BulletList
            items={[
              "Device type, operating system, and app version",
              "IP address and approximate location derived from IP address",
              "Usage, interaction, and feature activity data",
              "Crash reports, diagnostics, and performance information",
              "Security and log information necessary to detect misuse, fraud, or service errors",
            ]}
          />
          <p>
            <strong>On our website (receipt-one.com) — cookies and similar technologies:</strong>{" "}
            analytics cookies are used only if you accept them in our cookie banner. Until you
            accept, nothing is sent to Google Analytics. You can change your choice at any time with
            the &quot;Cookie settings&quot; link in the website footer or{" "}
            <button
              type="button"
              onClick={openConsentSettings}
              className="font-medium text-foreground underline underline-offset-4"
            >
              here
            </button>
            . Cookies on receipt-one.com may be shared with app.receipt-one.com, our web app. The
            website uses:
          </p>
          <BulletList
            items={[
              'A first-party cookie named "ro_consent", which stores your cookie choice ("granted" or "denied") for 12 months so we don\'t ask again on every visit.',
              'A first-party cookie named "ro_attr", set only when you arrive from a link that carries ad campaign parameters (such as utm_source, utm_campaign, or click IDs like gclid), which stores those parameters, the page you landed on, and the time for 90 days, so we know which campaign brought a visitor and can credit it if you sign up.',
              'Google Analytics cookies named "_ga" and "_ga_<ID>", set only after you accept analytics cookies. Google Analytics (Google LLC) receives your IP address, browser and device information, the pages you view, and the buttons you click (such as sign-up or app-store links), and we use it to measure visits and the performance of our ads. If you later decline, we remove these cookies and Google Analytics stops collecting.',
              "Google reCAPTCHA v3, through Firebase App Check, on every page to protect our contact form and services from automated abuse. reCAPTCHA collects your IP address, browser and device information, and interaction signals, and may set Google cookies.",
              "Google Fonts, which receives your IP address and browser information when the page loads its fonts.",
              'A first-party cookie and local storage entry named "ro_referral", set only when you open a referral link (receipt-one.com/r/...), which stores the referral code for 30 days so a referral is credited if you sign up later.',
              "Local storage in your browser to remember interface preferences, such as which sections of our legal pages you expanded. This information stays on your device.",
            ]}
          />
        </SubSection>

        <SubSection title="2.5 Device Permissions">
          <DataTable
            headers={["Permission", "Purpose", "Can be revoked?"]}
            rows={[
              ["Camera", "Capture receipt or document images when you initiate a scan", "Yes"],
              [
                "Photo Library / Storage",
                "Select files or images that you choose to upload",
                "Yes",
              ],
              ["Push Notifications", "Send service-related reminders, alerts, and updates", "Yes"],
              [
                "Location (while using the app)",
                "Record a trip you start and look up trip addresses (see Section 2.6)",
                "Yes",
              ],
              [
                'Background location ("Allow all the time" on Android, "Always" on iOS)',
                "Keep recording a trip you started while the app is in the background or closed (see Section 2.6)",
                "Yes",
              ],
            ]}
          />
          <p>
            You may revoke device permissions through your device settings. If you do so, certain
            features may be limited or unavailable.
          </p>
        </SubSection>

        <SubSection title="2.6 Location Information and Background Location">
          <p>
            The ReceiptOne mobile app can record a business trip using your device&apos;s location
            so that your mileage log shows the route and distance driven.
          </p>
          <p>
            <strong>What we collect:</strong> while a trip is recording, the app collects your
            device&apos;s precise location (latitude and longitude) with the time of each reading,
            and calculates the trip&apos;s distance from it. We also store the start and end
            addresses and the purpose note saved with the trip.
          </p>
          <p>
            <strong>Collection in the background:</strong> When you turn on trip tracking in the
            mobile app, we collect your device&apos;s location in the background to record your
            trips, either at all times or during the schedule you choose. The app shows a
            notification on your device while a trip is recording.
          </p>
          <p>
            <strong>Why we collect it:</strong> only to create your mileage records, namely the
            trip&apos;s route, distance, and date in your logbook and the business-use figures and
            mileage reports built from it.
          </p>
          <p>
            <strong>What we do not do:</strong> we do not sell location data, use it for advertising
            or to build advertising profiles, or share it with data brokers. It is shared only with
            the service providers that store it and calculate routes and distances on our behalf
            (Google Cloud / Firebase and Google Maps Platform; see Section 5).
          </p>
          <p>
            <strong>How to turn it off:</strong> You can pause trip tracking or turn it off at any
            time in the app&apos;s trip settings, and you can withdraw location permission at any
            time in your device&apos;s settings. When trip tracking is off or paused, we do not
            collect location for trips. To stop background collection altogether, change
            ReceiptOne&apos;s location permission in your device settings (Android: Settings → Apps
            → ReceiptOne → Permissions → Location; iOS: Settings → ReceiptOne → Location) to
            &quot;Allow only while using the app&quot;, &quot;While Using the App&quot;, or
            &quot;Don&apos;t allow&quot;. You can still enter trips manually by typing the start and
            end addresses.
          </p>
          <p>
            <strong>How long we keep it:</strong> location data recorded for a trip is stored with
            that trip and kept until you delete the trip or your account, subject to the retention
            rules in Section 7.
          </p>
        </SubSection>

        <SubSection title="2.7 Categories of Personal Information for California Residents">
          <p>
            For purposes of the CCPA/CPRA, we may collect the following categories of personal
            information:
          </p>
          <DataTable
            headers={["Category", "Examples"]}
            rows={[
              [
                "Identifiers",
                "Name, email address, account identifiers, device-related identifiers",
              ],
              ["Customer records", "Subscription status, service history"],
              ["Commercial information", "Transaction metadata, subscription plan details"],
              ["Internet activity", "App usage, diagnostics, interaction data"],
              ["Approximate geolocation", "Derived from IP address"],
              [
                "Sensitive personal information",
                "Financial or expense-related information contained in receipts, reports, and uploaded documents; precise geolocation recorded while a trip you started is recording",
              ],
            ]}
          />
          <p>
            We do not use sensitive personal information to infer characteristics about individuals.
            We use it only for limited purposes reasonably necessary to provide the Services,
            maintain security, detect errors or fraud, comply with law, and perform other permitted
            business purposes.
          </p>
        </SubSection>
      </Section>

      <Section number="3" title="How We Use Personal Information">
        <p>We use personal information for the following purposes:</p>
        <BulletList
          items={[
            "To create, administer, and secure your account",
            "To provide, operate, maintain, and improve the Services",
            "To process receipt images and documents using OCR and AI-assisted tools",
            "To organize, classify, and summarize expenses and tax-related records",
            "To generate reports, exports, and user-requested outputs",
            "To sync data across devices and supported platforms",
            "To communicate with you about service-related notices, support, updates, and security matters",
            "To detect, investigate, prevent, or respond to fraud, abuse, security incidents, or technical issues",
            "To comply with legal obligations, enforce agreements, and protect rights, safety, and property",
          ]}
        />
        <p>
          Where permitted by law, we may also use de-identified or aggregated information for
          analytics, research, service improvement, and business operations.
        </p>
        <p>
          <strong>Important:</strong> ReceiptOne provides organizational and informational tools
          only and does not provide legal, accounting, tax, or financial advice.
        </p>
      </Section>

      <Section number="4" title="AI-Assisted and Automated Processing">
        <p>ReceiptOne uses automated tools and AI-assisted processing to:</p>
        <BulletList
          items={[
            "Extract structured data from receipt and document images",
            "Suggest merchant or expense categories",
            "Apply country-specific tax logic rules and calculation support",
            "Assist with recognition, normalization, and organization of uploaded content",
          ]}
        />
        <p>
          <strong>Limitations of AI processing:</strong>
        </p>
        <BulletList
          items={[
            "These processes do not make legal, credit, employment, insurance, or similarly significant decisions about individuals",
            "Users may review, edit, override, or delete resulting records within the Services at any time",
            "AI suggestions are for informational purposes only and should not be relied upon as definitive tax or financial advice",
          ]}
        />
      </Section>

      <Section number="5" title="How We Share Personal Information">
        <p>
          <strong>
            We do not sell personal information. We do not share personal information for
            cross-context behavioral advertising.
          </strong>
        </p>
        <p>
          We may disclose personal information to the following categories of recipients for
          business or operational purposes:
        </p>
        <BulletList
          items={[
            "Cloud hosting and infrastructure providers",
            "Authentication, storage, database, messaging, and platform service providers",
            "OCR, document analysis, and AI service providers",
            "Logging, diagnostics, and crash reporting providers",
            "Mapping and address lookup providers",
            "Subscription management providers",
            "Email, messaging, and customer communication providers",
            "Professional advisors, auditors, insurers, and legal compliance providers where reasonably necessary",
            "Government authorities, courts, regulators, law enforcement, or other third parties where required by law or legal process",
          ]}
        />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Service providers (processors) we use
        </h3>
        <p>
          The following service providers process personal information on our behalf. Each receives
          only the information needed for its function. Most of them process information outside
          Canada, mainly in the United States.
        </p>
        <DataTable
          headers={["Provider", "Information received", "Purpose", "Where processed"]}
          rows={[
            [
              "Google Cloud / Firebase (Google LLC): Authentication, Cloud Firestore, Cloud Storage, Cloud Functions, Cloud Messaging",
              "Account details (name, email, sign-in identifiers), receipts and uploaded documents, expense, mileage, trip location, and home office records, support requests, device tokens, and service logs",
              "Hosting, sign-in, database and file storage, server-side processing, and push notifications",
              "United States — outside Canada. Cloud Firestore: nam5 multi-region (Iowa and South Carolina). Cloud Functions: us-central1 (Iowa). Cloud Storage: United States.",
            ],
            [
              "Google Vertex AI — Gemini (Google LLC)",
              "Receipt images and PDFs and the text read from them; for the AI assistant, your questions and the expense records needed to answer them",
              "Receipt recognition and data extraction, and the in-app AI assistant",
              "Google's global endpoint, which may route requests to any Google region, including the United States — outside Canada",
            ],
            [
              "Google Cloud Vision API (Google LLC)",
              "Receipt images captured in the mobile app",
              "Extracting text from receipt images",
              "Google's global endpoint, which may route requests to any Google region, including the United States — outside Canada",
            ],
            [
              "OpenAI, LLC",
              "Merchant names and text read from receipts; if configured as a fallback, receipt content and assistant questions",
              "Identifying merchants in the mobile app, and backup provider for receipt recognition and the AI assistant",
              "United States — outside Canada",
            ],
            [
              "Google Maps Platform (Google LLC)",
              "Addresses and place searches you enter, trip start and end points, your IP address",
              "Address lookup and route and distance calculation for mileage trips",
              "United States and other Google locations — outside Canada",
            ],
            [
              "RevenueCat, Inc.",
              "Your account identifier, app store transaction identifiers, plan, renewal and subscription status, and country",
              "Managing subscriptions and access to paid features",
              "United States — outside Canada",
            ],
            [
              "Telegram (only if you connect the ReceiptOne bot)",
              "Your Telegram user and chat identifiers, the receipt photos, files and messages you send the bot, and our replies",
              "Receiving receipts and support messages through Telegram",
              "Telegram's data centres in several countries — outside Canada",
            ],
            [
              "Resend",
              "Your email address and name, message contents, and any report you choose to email",
              "Sending transactional email, support replies, and emailed reports",
              "United States — outside Canada",
            ],
            [
              "Logo.dev (Simple Casual, LLC)",
              "Merchant names or domains; your IP address and browser information when a logo loads in your browser",
              "Showing merchant logos next to your expenses",
              "United States — outside Canada",
            ],
            [
              "Vercel Inc.",
              "Your IP address, browser information, the pages you request, and information you submit through our website and web app",
              "Hosting receipt-one.com and the ReceiptOne web app",
              "United States and Vercel's global edge network — outside Canada",
            ],
            [
              "Google reCAPTCHA via Firebase App Check (Google LLC)",
              "Your IP address, browser and device information, interaction signals, and Google cookies",
              "Protecting our website, contact form, and services from automated abuse",
              "United States — outside Canada",
            ],
            [
              "Google Analytics (Google LLC) — only if you accept analytics cookies",
              "Your IP address, browser and device information, the pages you view on receipt-one.com, the buttons you click, and Google Analytics cookies",
              "Measuring website visits and the performance of our ads",
              "United States — outside Canada",
            ],
            [
              "Google Fonts (Google LLC)",
              "Your IP address and browser information",
              "Delivering the fonts our website uses",
              "United States — outside Canada",
            ],
            [
              "ExchangeRate-API (open.er-api.com)",
              "Your IP address and browser information; no account or expense data",
              "Currency exchange rates in the web app",
              "Not stated by the provider",
            ],
          ]}
        />
        <p>
          Apple (App Store) and Google (Google Play) process payments for mobile subscriptions under
          their own terms and privacy policies, as described in Section 2.3.
        </p>
        <p>
          We instruct all service providers to process personal information on our behalf and for
          limited purposes related to providing and supporting the Services, subject to applicable
          contracts, confidentiality obligations, and security requirements.
        </p>
        <p>
          <strong>Corporate transactions:</strong> We may also disclose personal information in
          connection with a merger, financing, acquisition, reorganization, sale of assets,
          bankruptcy, or similar corporate transaction, subject to appropriate safeguards where
          required by law.
        </p>
      </Section>

      <Section number="6" title="International and Cross-Border Processing">
        <p>
          <strong>Where your information is stored:</strong> ReceiptOne&apos;s database, files, and
          server-side processing run on Google Cloud / Firebase in the United States:
        </p>
        <BulletList
          items={[
            "Cloud Firestore (account, expense, mileage, and home office records): nam5, a multi-region in the United States (Iowa and South Carolina)",
            "Cloud Storage (receipt images and uploaded documents): United States",
            "Cloud Functions (server-side processing): us-central1 (Iowa, United States)",
          ]}
        />
        <p>
          <strong>
            If you are in Canada, your personal information is stored and processed in the United
            States.
          </strong>{" "}
          Other service providers listed in Section 5 also process personal information outside
          Canada, mainly in the United States; that table shows where each one processes it.
        </p>
        <p>
          <strong>For residents of Quebec:</strong> your personal information is communicated
          outside Quebec, to the United States, for the purposes described in this Privacy Policy.
        </p>
        <p>
          <strong>Legal implications:</strong> As a result, personal information may be subject to
          the laws of those jurisdictions, including lawful access requests by courts, regulators,
          or law enforcement authorities (for example, under the U.S. CLOUD Act or equivalent
          Canadian legislation).
        </p>
        <p>
          We use contractual, technical, and organizational safeguards that are appropriate to the
          sensitivity of the information and the nature of the processing, including Standard
          Contractual Clauses or equivalent mechanisms where required by law.
        </p>
      </Section>

      <Section number="7" title="Data Retention">
        <p>
          We retain personal information for as long as reasonably necessary for the purposes
          described in this Privacy Policy, including to provide the Services and comply with legal,
          accounting, tax, security, dispute resolution, and enforcement obligations.
        </p>
        <p>
          <strong>General retention periods:</strong>
        </p>
        <DataTable
          headers={["Data type", "Retention period"]}
          rows={[
            [
              "Account information",
              "While account is active + reasonable period thereafter for legal/security purposes",
            ],
            [
              "Receipts, expenses, mileage, reports, uploaded documents",
              "Until you delete them, request deletion, or account is deleted (unless longer retention required by law)",
            ],
            [
              "Trip location data",
              "Stored with the trip until you delete the trip or your account",
            ],
            [
              "Support communications",
              "Reasonable period to manage support history, disputes, and service quality",
            ],
            [
              "Logs, security records, analytics, diagnostics",
              "Limited period necessary for troubleshooting, fraud prevention, security, and performance monitoring",
            ],
            [
              "Backup copies",
              "Limited period according to backup, disaster recovery, and record management processes",
            ],
          ]}
        />
        <p>
          <strong>Important note regarding service provider caching:</strong> Despite deletion from
          our active systems, our service providers (including Google Cloud and OpenAI) may retain
          hashed, logged, or cached copies of data for a limited period (typically up to 30 days)
          for security, abuse prevention, and fraud detection purposes. This is permitted under
          their respective terms of service and applicable law. After such period, residual copies
          are deleted or rendered unreadable.
        </p>
      </Section>

      <Section number="8" title="Your Privacy Rights">
        <SubSection title="8.1 Canada (PIPEDA and Quebec Law 25)">
          <p>You have the right to:</p>
          <BulletList
            items={[
              "Access personal information we hold about you",
              "Correct inaccurate or incomplete personal information",
              "Withdraw consent (subject to legal or contractual restrictions and reasonable notice)",
              "Delete your personal information (subject to legal exceptions)",
              "Complain to the Office of the Privacy Commissioner of Canada or, for Quebec residents, the Commission d'accès à l'information du Québec (CAI)",
            ]}
          />
        </SubSection>

        <SubSection title="8.2 United States (California and other states)">
          <p>
            Depending on your state of residence and subject to applicable exceptions, you may have
            the right to:
          </p>
          <BulletList
            items={[
              "Know what categories of personal information we collect, use, disclose, and retain",
              "Access specific pieces of personal information",
              "Delete personal information",
              "Correct inaccurate personal information",
              "Opt out of the sale or sharing of personal information (ReceiptOne does not sell or share for cross-context behavioral advertising)",
              "Limit the use of sensitive personal information (ReceiptOne uses such information only for limited permitted purposes)",
              "Non-discrimination — you will not be discriminated against for exercising your privacy rights",
            ]}
          />
          <p>
            Because ReceiptOne does not sell personal information or share personal information for
            cross-context behavioral advertising, we do not offer a &quot;Do Not Sell or Share&quot;
            mechanism for activities that we do not engage in.
          </p>
        </SubSection>

        <SubSection title="8.3 How to Submit Requests">
          <p>You may submit privacy requests by contacting:</p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="mailto:support@receipt-one.com"
            >
              support@receipt-one.com
            </a>{" "}
            <strong>Subject line:</strong> &quot;Privacy Request&quot;
          </p>
          <p>
            <strong>Contact form:</strong> if you prefer not to use email, submit your request
            through our{" "}
            <Link
              to="/contact"
              className="font-medium text-foreground underline underline-offset-4"
            >
              contact form
            </Link>
            .
          </p>
          <p>
            <strong>Mail:</strong> Privacy Officer, Flutter Horizon, 6555 Bonsor Ave, Burnaby, BC
            V5H 3E9, Canada.
          </p>
          <p>In your request, please include:</p>
          <BulletList
            items={[
              "Your full name",
              "Email address associated with your account",
              "Specific details of your request",
              "Any supporting documentation (if applicable)",
            ]}
          />
          <p>
            <strong>Authorized agents:</strong> Where required by law, authorized agents may submit
            requests on behalf of individuals, subject to appropriate verification and written
            authorization.
          </p>
        </SubSection>

        <SubSection title="8.4 Verification and Appeals">
          <p>
            <strong>Verification process:</strong> To protect your personal information, we will
            verify your identity before fulfilling a request. Verification may include:
          </p>
          <BulletList
            items={[
              "Confirming access to the email address associated with your account",
              "Requesting information that matches our records",
              "Using other reasonable authentication measures",
            ]}
          />
          <p>
            If we cannot verify your identity or authority to act, we may deny or limit the request
            as permitted by law.
          </p>
          <p>
            <strong>Appeals process:</strong> If we deny a request, we will provide you with:
          </p>
          <BulletList
            items={[
              "A clear explanation of the basis for denial",
              "Information about how you may appeal that decision",
            ]}
          />
          <p>
            To appeal, please reply to our denial notice or contact us at support@receipt-one.com
            with &quot;Appeal&quot; in the subject line.
          </p>
          <p>
            <strong>Response timing:</strong> We will respond to verified requests within the
            timeframes required by applicable law (typically 30 days for PIPEDA, 45 days for
            CCPA/CPRA, with possible extensions where permitted).
          </p>
        </SubSection>
      </Section>

      <Section number="9" title="Consent">
        <SubSection title="9.1 General Consent">
          <p>
            By creating an account, uploading receipts or documents, enabling optional features, or
            otherwise using the Services, you consent to the collection, use, and disclosure of
            personal information as described in this Privacy Policy, except where applicable law
            requires a different form of consent.
          </p>
        </SubSection>

        <SubSection title="9.2 Express Consent for Quebec Residents and Sensitive Information">
          <p>
            <strong>For residents of Quebec (Canada):</strong> Where required by Quebec&apos;s Law
            25, we obtain <strong>express consent</strong> before collecting, using, or disclosing
            your personal information.
          </p>
          <p>
            <strong>For sensitive personal information (all users):</strong> Where required by
            applicable law (including CPRA for sensitive personal information), we obtain{" "}
            <strong>express consent</strong> before collecting, using, or disclosing financial or
            expense-related data contained in receipts, reports, and uploaded documents.
          </p>
          <p>
            <strong>How express consent is obtained:</strong> Express consent is obtained when you:
          </p>
          <BulletList
            items={[
              "Check a box indicating your agreement during account creation, OR",
              'Take an affirmative action (such as clicking "I Agree" or "Accept") before using receipt scanning or expense tracking features',
            ]}
          />
          <p>
            You may withdraw express consent at any time by contacting us. If you withdraw consent
            for processing that is necessary to provide the Services, some features or the Services
            themselves may no longer be available.
          </p>
        </SubSection>

        <SubSection title="9.3 Withdrawal of Consent">
          <p>You may withdraw consent for certain processing by:</p>
          <BulletList
            items={[
              "Deleting specific content (receipts, expenses, documents)",
              "Disabling optional device permissions",
              "Deleting your account",
              "Contacting us directly",
            ]}
          />
          <p>
            If you withdraw consent for processing that is necessary to provide the Services, some
            features or the Services themselves may no longer be available.
          </p>
        </SubSection>
      </Section>

      <Section number="10" title="Security Safeguards">
        <p>
          We implement administrative, technical, and organizational safeguards designed to protect
          personal information, including:
        </p>
        <DataTable
          headers={["Measure", "Description"]}
          rows={[
            [
              "Encryption in transit",
              "TLS or similar protocols for all data transmitted over networks",
            ],
            ["Access controls", "Least-privilege access, role-based authentication"],
            ["Logging and monitoring", "Audit measures for security-sensitive activity"],
            [
              "Infrastructure security",
              "Reasonable steps to secure cloud environments (Firebase, Google Cloud)",
            ],
          ]}
        />
        <p>
          <strong>Limitation:</strong> No method of transmission over the Internet or method of
          electronic storage is completely secure. Accordingly, we cannot guarantee absolute
          security. In the event of a data breach affecting your personal information, we will
          notify you and relevant authorities as required by applicable law.
        </p>
      </Section>

      <Section number="11" title="Children's Privacy">
        <p>
          The Services are intended for adults and business users and are not directed to children
          under the age of 18 (or the age of majority in your jurisdiction).
        </p>
        <p>
          We do not knowingly collect personal information from children. If you believe a child has
          provided personal information to us, please contact us immediately so that we can review
          and delete such information.
        </p>
      </Section>

      <Section number="12" title="Changes to This Privacy Policy">
        <p>We may update this Privacy Policy from time to time to reflect changes in:</p>
        <BulletList
          items={["Our practices or technologies", "Legal requirements", "The Services themselves"]}
        />
        <p>
          <strong>Notification of material changes:</strong>
        </p>
        <BulletList
          items={[
            'We will revise the "Last updated" date at the top of this policy',
            "For material changes, we will provide additional notice through the Services (e.g., in-app notification or email)",
            "Continued use of the Services after changes constitutes acceptance of the updated policy, except where applicable law requires explicit re-consent",
          ]}
        />
      </Section>

      <Section number="13" title="Contact Information">
        <p>
          <strong>Person in charge of the protection of personal information</strong> (including for
          the purposes of Quebec&apos;s Law 25): Privacy Officer, Flutter Horizon —{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4"
            href="mailto:support@receipt-one.com"
          >
            support@receipt-one.com
          </a>
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4"
            href="mailto:support@receipt-one.com"
          >
            support@receipt-one.com
          </a>{" "}
          <strong>Subject line for privacy matters:</strong> &quot;Privacy Request&quot;
        </p>
        <p>
          <strong>Contact form:</strong>{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            receipt-one.com/contact
          </Link>
        </p>
        <p>
          <strong>Mail:</strong> Flutter Horizon, 6555 Bonsor Ave, Burnaby, BC V5H 3E9, Canada
        </p>
        <div className="space-y-3">
          <p>
            <strong>Regulatory complaints (Canada):</strong> Office of the Privacy Commissioner of
            Canada{" "}
            <a
              className="underline underline-offset-4"
              href="https://www.priv.gc.ca/en/report-a-concern/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.priv.gc.ca/en/report-a-concern/
            </a>
          </p>
          <p>
            <strong>Regulatory complaints (Quebec):</strong> Commission d&apos;accès à
            l&apos;information du Québec (CAI){" "}
            <a
              className="underline underline-offset-4"
              href="https://www.cai.gouv.qc.ca/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.cai.gouv.qc.ca/
            </a>
          </p>
          <p>
            <strong>Regulatory complaints (California):</strong> California Attorney General{" "}
            <a
              className="underline underline-offset-4"
              href="https://oag.ca.gov/privacy"
              target="_blank"
              rel="noreferrer"
            >
              https://oag.ca.gov/privacy
            </a>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 Flutter Horizon. ReceiptOne is operated by Flutter Horizon. All rights reserved.
        </p>
      </Section>
    </PrivacyDocument>
  );
}
