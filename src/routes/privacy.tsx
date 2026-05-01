import React, { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronsDownUp, ChevronsUpDown, ListTree, X } from "lucide-react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";
import {
  AnchorButton,
  LegalSummary,
  PrintButton,
  RegionSwitcher,
  RegionTag,
  useLegalUIState,
  type SummaryItem,
  type Region,
} from "@/components/site/legal/shared";

/* ----------------------------- Section catalog ---------------------------- */

/**
 * Lightweight catalog so the TOC, accordion, region filtering, and Print
 * features work without restructuring the inline section text below.
 * `regions` flags subsections that apply only to one jurisdiction.
 */
type RegionMap = Record<string, "us" | "ca" | "all">;

const SECTIONS: { number: string; title: string; subsections?: { id: string; title: string; region?: "us" | "ca" }[] }[] = [
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
      { id: "2.6", title: "2.6 Categories of Personal Information for California Residents", region: "us" },
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
      { id: "9.2", title: "9.2 Express Consent for Quebec Residents and Sensitive Information", region: "ca" },
      { id: "9.3", title: "9.3 Withdrawal of Consent" },
    ],
  },
  { number: "10", title: "Security Safeguards" },
  { number: "11", title: "Children's Privacy" },
  { number: "12", title: "Changes to This Privacy Policy" },
  { number: "13", title: "Contact Information" },
];

const SUBSECTION_REGIONS: RegionMap = SECTIONS.reduce<RegionMap>((acc, s) => {
  s.subsections?.forEach((ss) => {
    acc[ss.id] = ss.region ?? "all";
  });
  return acc;
}, {});

const sectionAnchorId = (n: string) => `section-${n}`;
const subsectionAnchorId = (id: string) => `section-${id.replace(".", "-")}`;

const PRIVACY_SUMMARY: SummaryItem[] = [
  {
    title: "What we collect",
    body: "Account info, receipts/expenses you upload, OCR-extracted data, device & usage diagnostics, and limited subscription metadata from Apple/Google.",
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
    body: "Limited to service providers (hosting, analytics, payments) under contract, plus legal/compliance disclosures when required.",
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
    body: "Questions or privacy requests: support@receipt-one.com.",
  },
];

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "ReceiptOne — Privacy Policy" },
      {
        name: "description",
        content:
          "ReceiptOne Privacy Policy covering data collection, use, retention, privacy rights, security, and contact details for users in Canada and the United States.",
      },
      { property: "og:title", content: "ReceiptOne — Privacy Policy" },
      {
        property: "og:description",
        content:
          "How ReceiptOne collects, uses, discloses, stores, and protects personal information across PIPEDA, Quebec Law 25, CCPA/CPRA, and other U.S. state privacy laws.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const allPartIds = useMemo(() => ["privacy-all"], []);
  const {
    region,
    setRegion,
    openSections,
    setOpenSections,
    toggleSection,
  } = useLegalUIState("legal:privacy", allPartIds);
  const [tocOpen, setTocOpen] = useState(false);
  const printRestoreRef = useRef<Set<string> | null>(null);

  const allSectionAnchors = useMemo(
    () => SECTIONS.flatMap((s) => [sectionAnchorId(s.number), ...(s.subsections?.map((ss) => subsectionAnchorId(ss.id)) ?? [])]),
    [],
  );

  const expandAll = () => setOpenSections(new Set(allSectionAnchors));
  const collapseAll = () => setOpenSections(new Set());

  const handleBeforePrint = () => {
    printRestoreRef.current = new Set(openSections);
    setOpenSections(new Set(allSectionAnchors));
  };
  const handleAfterPrint = () => {
    if (printRestoreRef.current) {
      setOpenSections(printRestoreRef.current);
      printRestoreRef.current = null;
    }
  };

  const scrollToId = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.add(id);
      // Also open the parent section if `id` is a subsection.
      const parent = SECTIONS.find((s) => s.subsections?.some((ss) => subsectionAnchorId(ss.id) === id));
      if (parent) next.add(sectionAnchorId(parent.number));
      return next;
    });
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    setTocOpen(false);
  };

  // Open section if URL has a hash on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash) scrollToId(hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/ca" className="flex items-center gap-2">
              <img src={logoMark} alt="" aria-hidden className="block size-10" />
              <img src={logoWordmark} alt="ReceiptOne" className="block h-6 w-auto" />
            </Link>
            <p className="hidden text-sm text-muted-foreground sm:block">Privacy Policy</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTocOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
              aria-label="Open table of contents"
            >
              <ListTree className="size-4" />
              Contents
            </button>
            <Link
              to="/ca"
              className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-block"
            >
              Back to site
            </Link>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="border-b border-border pb-8">
          <p className="text-sm font-medium text-muted-foreground">Last updated: April 23, 2026</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-normal sm:text-5xl">
            ReceiptOne — Privacy Policy
          </h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              This Privacy Policy explains how ReceiptOne (&quot;ReceiptOne,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) collects, uses, discloses, stores, and protects personal information when you use the
              ReceiptOne mobile applications (iOS and Android), the ReceiptOne web application, and related services
              (collectively, the &quot;Services&quot;).
            </p>
            <p>ReceiptOne is designed for self-employed individuals, contractors, and small businesses.</p>
            <p>
              This Privacy Policy is intended to comply with applicable privacy laws in Canada and the United States,
              including:
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
            <a className="font-medium text-foreground underline underline-offset-4" href="mailto:support@receipt-one.com">
              support@receipt-one.com
            </a>
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <RegionSwitcher region={region} onChange={setRegion} />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground print:hidden"
              >
                <ChevronsUpDown className="size-4" />
                Expand all
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground print:hidden"
              >
                <ChevronsDownUp className="size-4" />
                Collapse all
              </button>
              <PrintButton onBeforePrint={handleBeforePrint} onAfterPrint={handleAfterPrint} />
            </div>
          </div>
        </header>

        <div className="grid gap-10 py-10 lg:grid-cols-[240px_minmax(0,1fr)_280px] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              <PrivacyTOC region={region} onJump={scrollToId} />
            </div>
          </aside>

          <PrivacyContext.Provider value={{ region, openSections, toggleSection }}>
          <div className="space-y-4">
          <Section number="1" title="Scope">
            <p>This Privacy Policy applies to personal information collected through the Services, including when you:</p>
            <BulletList
              items={[
                "Create an account",
                "Upload receipts, invoices, or other documents",
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
                To provide expense tracking, organization, and reporting functionality, we may collect and process:
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
                <strong>Sensitive personal information:</strong> Receipt images, expense records, and uploaded
                documents may contain financial information and other sensitive business information. We process this
                information only as reasonably necessary to provide, secure, maintain, and improve the Services and
                for other purposes described in this Privacy Policy.
              </p>
            </SubSection>

            <SubSection title="2.3 Payment Information">
              <p>ReceiptOne does not collect or store full payment card numbers through the mobile application.</p>
              <p>
                Payments for mobile subscriptions are processed by third-party platforms such as Apple App Store and
                Google Play Store. We receive limited subscription metadata from those platforms, such as:
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
                If additional web billing or payment processors are introduced in the future, this Privacy Policy will
                be updated accordingly.
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
            </SubSection>

            <SubSection title="2.5 Device Permissions">
              <DataTable
                headers={["Permission", "Purpose", "Can be revoked?"]}
                rows={[
                  ["Camera", "Capture receipt or document images when you initiate a scan", "Yes"],
                  ["Photo Library / Storage", "Select files or images that you choose to upload", "Yes"],
                  ["Push Notifications", "Send service-related reminders, alerts, and updates", "Yes"],
                ]}
              />
              <p>
                You may revoke device permissions through your device settings. If you do so, certain features may be
                limited or unavailable.
              </p>
            </SubSection>

            <SubSection title="2.6 Categories of Personal Information for California Residents">
              <p>For purposes of the CCPA/CPRA, we may collect the following categories of personal information:</p>
              <DataTable
                headers={["Category", "Examples"]}
                rows={[
                  ["Identifiers", "Name, email address, account identifiers, device-related identifiers"],
                  ["Customer records", "Subscription status, service history"],
                  ["Commercial information", "Transaction metadata, subscription plan details"],
                  ["Internet activity", "App usage, diagnostics, interaction data"],
                  ["Approximate geolocation", "Derived from IP address"],
                  [
                    "Sensitive personal information",
                    "Financial or expense-related information contained in receipts, reports, and uploaded documents",
                  ],
                ]}
              />
              <p>
                We do not use sensitive personal information to infer characteristics about individuals. We use it only
                for limited purposes reasonably necessary to provide the Services, maintain security, detect errors or
                fraud, comply with law, and perform other permitted business purposes.
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
              Where permitted by law, we may also use de-identified or aggregated information for analytics, research,
              service improvement, and business operations.
            </p>
            <p>
              <strong>Important:</strong> ReceiptOne provides organizational and informational tools only and does not
              provide legal, accounting, tax, or financial advice.
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
            <p><strong>Limitations of AI processing:</strong></p>
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
                We do not sell personal information. We do not share personal information for cross-context behavioral
                advertising.
              </strong>
            </p>
            <p>
              We may disclose personal information to the following categories of recipients for business or
              operational purposes:
            </p>
            <BulletList
              items={[
                "Cloud hosting and infrastructure providers",
                "Authentication, storage, database, messaging, and platform service providers",
                "OCR, document analysis, and AI service providers",
                "Analytics, diagnostics, logging, and crash reporting providers",
                "Email and customer communication providers",
                "Professional advisors, auditors, insurers, and legal compliance providers where reasonably necessary",
                "Government authorities, courts, regulators, law enforcement, or other third parties where required by law or legal process",
              ]}
            />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Examples of service providers used in connection with the Services:
            </h3>
            <DataTable
              headers={["Provider", "Purpose"]}
              rows={[
                ["Firebase / Google Cloud", "Authentication, storage, database, cloud functions, messaging, remote config"],
                ["Google Cloud Vision API", "OCR processing of receipt images"],
                ["Google Cloud Vertex AI / Gemini", "AI-assisted analysis and processing"],
                ["OpenAI, LLC", "AI-assisted merchant categorization and extraction support"],
                ["Logo.dev (Simple Casual, LLC)", "Retrieval of merchant logo assets based on merchant domain information"],
              ]}
            />
            <p>
              We instruct all service providers to process personal information on our behalf and for limited purposes
              related to providing and supporting the Services, subject to applicable contracts, confidentiality
              obligations, and security requirements.
            </p>
            <p>
              <strong>Corporate transactions:</strong> We may also disclose personal information in connection with a
              merger, financing, acquisition, reorganization, sale of assets, bankruptcy, or similar corporate
              transaction, subject to appropriate safeguards where required by law.
            </p>
          </Section>

          <Section number="6" title="International and Cross-Border Processing">
            <p>
              ReceiptOne uses service providers and cloud-based infrastructure that may process or store personal
              information in:
            </p>
            <BulletList
              items={[
                "Canada",
                "The United States",
                "Other jurisdictions where we or our service providers operate",
              ]}
            />
            <p>
              <strong>Legal implications:</strong> As a result, personal information may be subject to the laws of those
              jurisdictions, including lawful access requests by courts, regulators, or law enforcement authorities (for
              example, under the U.S. CLOUD Act or equivalent Canadian legislation).
            </p>
            <p>
              We use contractual, technical, and organizational safeguards that are appropriate to the sensitivity of
              the information and the nature of the processing, including Standard Contractual Clauses or equivalent
              mechanisms where required by law.
            </p>
          </Section>

          <Section number="7" title="Data Retention">
            <p>
              We retain personal information for as long as reasonably necessary for the purposes described in this
              Privacy Policy, including to provide the Services and comply with legal, accounting, tax, security,
              dispute resolution, and enforcement obligations.
            </p>
            <p><strong>General retention periods:</strong></p>
            <DataTable
              headers={["Data type", "Retention period"]}
              rows={[
                ["Account information", "While account is active + reasonable period thereafter for legal/security purposes"],
                [
                  "Receipts, expenses, mileage, reports, uploaded documents",
                  "Until you delete them, request deletion, or account is deleted (unless longer retention required by law)",
                ],
                ["Support communications", "Reasonable period to manage support history, disputes, and service quality"],
                [
                  "Logs, security records, analytics, diagnostics",
                  "Limited period necessary for troubleshooting, fraud prevention, security, and performance monitoring",
                ],
                ["Backup copies", "Limited period according to backup, disaster recovery, and record management processes"],
              ]}
            />
            <p>
              <strong>Important note regarding service provider caching:</strong> Despite deletion from our active
              systems, our service providers (including Google Cloud and OpenAI) may retain hashed, logged, or cached
              copies of data for a limited period (typically up to 30 days) for security, abuse prevention, and fraud
              detection purposes. This is permitted under their respective terms of service and applicable law. After
              such period, residual copies are deleted or rendered unreadable.
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
                Depending on your state of residence and subject to applicable exceptions, you may have the right to:
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
                Because ReceiptOne does not sell personal information or share personal information for cross-context
                behavioral advertising, we do not offer a &quot;Do Not Sell or Share&quot; mechanism for activities that
                we do not engage in.
              </p>
            </SubSection>

            <SubSection title="8.3 How to Submit Requests">
              <p>You may submit privacy requests by contacting:</p>
              <p>
                <strong>Email:</strong>{" "}
                <a className="font-medium text-foreground underline underline-offset-4" href="mailto:support@receipt-one.com">
                  support@receipt-one.com
                </a>{" "}
                <strong>Subject line:</strong> &quot;Privacy Request&quot;
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
                <strong>Authorized agents:</strong> Where required by law, authorized agents may submit requests on
                behalf of individuals, subject to appropriate verification and written authorization.
              </p>
            </SubSection>

            <SubSection title="8.4 Verification and Appeals">
              <p>
                <strong>Verification process:</strong> To protect your personal information, we will verify your
                identity before fulfilling a request. Verification may include:
              </p>
              <BulletList
                items={[
                  "Confirming access to the email address associated with your account",
                  "Requesting information that matches our records",
                  "Using other reasonable authentication measures",
                ]}
              />
              <p>
                If we cannot verify your identity or authority to act, we may deny or limit the request as permitted by
                law.
              </p>
              <p><strong>Appeals process:</strong> If we deny a request, we will provide you with:</p>
              <BulletList
                items={[
                  "A clear explanation of the basis for denial",
                  "Information about how you may appeal that decision",
                ]}
              />
              <p>
                To appeal, please reply to our denial notice or contact us at support@receipt-one.com with
                &quot;Appeal&quot; in the subject line.
              </p>
              <p>
                <strong>Response timing:</strong> We will respond to verified requests within the timeframes required by
                applicable law (typically 30 days for PIPEDA, 45 days for CCPA/CPRA, with possible extensions where
                permitted).
              </p>
            </SubSection>
          </Section>

          <Section number="9" title="Consent">
            <SubSection title="9.1 General Consent">
              <p>
                By creating an account, uploading receipts or documents, enabling optional features, or otherwise using
                the Services, you consent to the collection, use, and disclosure of personal information as described
                in this Privacy Policy, except where applicable law requires a different form of consent.
              </p>
            </SubSection>

            <SubSection title="9.2 Express Consent for Quebec Residents and Sensitive Information">
              <p>
                <strong>For residents of Quebec (Canada):</strong> Where required by Quebec&apos;s Law 25, we obtain{" "}
                <strong>express consent</strong> before collecting, using, or disclosing your personal information.
              </p>
              <p>
                <strong>For sensitive personal information (all users):</strong> Where required by applicable law
                (including CPRA for sensitive personal information), we obtain <strong>express consent</strong> before
                collecting, using, or disclosing financial or expense-related data contained in receipts, reports, and
                uploaded documents.
              </p>
              <p><strong>How express consent is obtained:</strong> Express consent is obtained when you:</p>
              <BulletList
                items={[
                  "Check a box indicating your agreement during account creation, OR",
                  'Take an affirmative action (such as clicking "I Agree" or "Accept") before using receipt scanning or expense tracking features',
                ]}
              />
              <p>
                You may withdraw express consent at any time by contacting us. If you withdraw consent for processing
                that is necessary to provide the Services, some features or the Services themselves may no longer be
                available.
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
                If you withdraw consent for processing that is necessary to provide the Services, some features or the
                Services themselves may no longer be available.
              </p>
            </SubSection>
          </Section>

          <Section number="10" title="Security Safeguards">
            <p>
              We implement administrative, technical, and organizational safeguards designed to protect personal
              information, including:
            </p>
            <DataTable
              headers={["Measure", "Description"]}
              rows={[
                ["Encryption in transit", "TLS or similar protocols for all data transmitted over networks"],
                ["Access controls", "Least-privilege access, role-based authentication"],
                ["Logging and monitoring", "Audit measures for security-sensitive activity"],
                ["Infrastructure security", "Reasonable steps to secure cloud environments (Firebase, Google Cloud)"],
              ]}
            />
            <p>
              <strong>Limitation:</strong> No method of transmission over the Internet or method of electronic storage
              is completely secure. Accordingly, we cannot guarantee absolute security. In the event of a data breach
              affecting your personal information, we will notify you and relevant authorities as required by
              applicable law.
            </p>
          </Section>

          <Section number="11" title="Children's Privacy">
            <p>
              The Services are intended for adults and business users and are not directed to children under the age of
              18 (or the age of majority in your jurisdiction).
            </p>
            <p>
              We do not knowingly collect personal information from children. If you believe a child has provided
              personal information to us, please contact us immediately so that we can review and delete such
              information.
            </p>
          </Section>

          <Section number="12" title="Changes to This Privacy Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes in:</p>
            <BulletList
              items={["Our practices or technologies", "Legal requirements", "The Services themselves"]}
            />
            <p><strong>Notification of material changes:</strong></p>
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
              <strong>Privacy Contact / Data Protection Officer (DPO) responsibilities</strong> are handled by the
              ReceiptOne privacy team.
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a className="font-medium text-foreground underline underline-offset-4" href="mailto:support@receipt-one.com">
                support@receipt-one.com
              </a>{" "}
              <strong>Subject line for privacy matters:</strong> &quot;Privacy Request&quot;
            </p>
            <div className="space-y-3">
              <p>
                <strong>Regulatory complaints (Canada):</strong> Office of the Privacy Commissioner of Canada{" "}
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
                <strong>Regulatory complaints (Quebec):</strong> Commission d&apos;accès à l&apos;information du Québec
                (CAI){" "}
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
            <p className="text-sm text-muted-foreground">© 2026 ReceiptOne. All rights reserved.</p>
          </Section>
          </div>
          </PrivacyContext.Provider>

          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
              <LegalSummary
                subtitle="Privacy Policy"
                items={PRIVACY_SUMMARY}
                region={region}
              />
            </div>
          </aside>
        </div>
      </article>

      {tocOpen && (
        <div className="fixed inset-0 z-50 lg:hidden print:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60" onClick={() => setTocOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto border-l border-border bg-background p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">Contents</p>
              <button
                type="button"
                onClick={() => setTocOpen(false)}
                className="rounded-full border border-border p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <PrivacyTOC region={region} onJump={scrollToId} />
          </div>
        </div>
      )}
    </main>
  );
}

/* --------------------------------- Context -------------------------------- */

type PrivacyCtx = {
  region: Region;
  openSections: Set<string>;
  toggleSection: (id: string) => void;
};

const PrivacyContext = React.createContext<PrivacyCtx | null>(null);
const usePrivacyCtx = () => {
  const ctx = React.useContext(PrivacyContext);
  if (!ctx) throw new Error("Section/SubSection must be rendered inside PrivacyContext");
  return ctx;
};

/* ----------------------------- Table of contents -------------------------- */

function PrivacyTOC({ region, onJump }: { region: Region; onJump: (id: string) => void }) {
  const visible = (r?: "us" | "ca") => region === "all" || !r || r === region;
  return (
    <nav aria-label="Table of contents" className="space-y-5 text-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Privacy Policy
      </p>
      <ul className="space-y-3 border-l border-border pl-3">
        {SECTIONS.map((s) => {
          const id = sectionAnchorId(s.number);
          const subs = s.subsections?.filter((ss) => visible(ss.region)) ?? [];
          return (
            <li key={s.number}>
              <div className="group flex items-start gap-1">
                <button
                  type="button"
                  onClick={() => onJump(id)}
                  className="flex-1 text-left leading-snug text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="mr-1 text-foreground/70">{s.number}.</span>
                  {s.title}
                </button>
                <AnchorButton hash={id} region={region} label={`Copy link to section ${s.number}`} />
              </div>
              {subs.length > 0 && (
                <ul className="mt-1 space-y-1 border-l border-border/60 pl-3">
                  {subs.map((ss) => {
                    const sid = subsectionAnchorId(ss.id);
                    return (
                      <li key={ss.id}>
                        <div className="group flex items-start gap-1">
                          <button
                            type="button"
                            onClick={() => onJump(sid)}
                            className="flex-1 text-left text-xs leading-snug text-muted-foreground/80 transition-colors hover:text-foreground"
                          >
                            {ss.title}
                            {ss.region === "us" && <RegionTag tone="us">US</RegionTag>}
                            {ss.region === "ca" && <RegionTag tone="ca">CA</RegionTag>}
                          </button>
                          <AnchorButton hash={sid} region={region} label={`Copy link to ${ss.title}`} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ----------------------------- Section accordion -------------------------- */

function Section({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  const { openSections, toggleSection } = usePrivacyCtx();
  const id = sectionAnchorId(number);
  const isOpen = openSections.has(id);
  return (
    <section
      id={id}
      className="group/section overflow-hidden rounded-xl border border-border bg-background scroll-mt-24"
    >
      <div className="relative flex items-center gap-2 pr-3">
        <button
          type="button"
          onClick={() => toggleSection(id)}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          className="flex flex-1 items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40 sm:px-5 sm:py-4"
        >
          <div className="flex flex-1 items-baseline gap-3">
            <span className="font-mono text-xs font-semibold text-muted-foreground sm:text-sm">
              {number.padStart(2, "0")}
            </span>
            <h2 className="font-display text-base font-semibold tracking-normal sm:text-lg">{title}</h2>
          </div>
          <ChevronDown
            className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        <AnchorButton
          hash={id}
          region={usePrivacyCtxRegion()}
          label={`Copy link to section ${number}`}
          className="opacity-0 group-hover/section:opacity-100"
        />
      </div>
      {isOpen && (
        <div
          id={`${id}-panel`}
          className="space-y-4 border-t border-border bg-background px-4 py-4 text-base leading-7 text-muted-foreground sm:px-5 sm:py-5"
        >
          {children}
        </div>
      )}
    </section>
  );
}

const usePrivacyCtxRegion = () => usePrivacyCtx().region;

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  const { region } = usePrivacyCtx();
  // Detect "8.1", "9.2", etc. at the start of the title.
  const idMatch = title.match(/^(\d+\.\d+)/);
  const subId = idMatch ? idMatch[1] : title;
  const anchorId = subsectionAnchorId(subId);
  const subRegion = SUBSECTION_REGIONS[subId];
  const applicable = !subRegion || subRegion === "all" || region === "all" || region === subRegion;

  return (
    <section
      id={anchorId}
      data-region-applicable={applicable ? "true" : "false"}
      className={`group/sub scroll-mt-24 space-y-3 rounded-lg border p-4 transition-all ${
        applicable
          ? "border-border/60 bg-card/40"
          : "border-dashed border-border/40 bg-muted/10 opacity-60 print:opacity-100"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold tracking-normal text-foreground">
          {title}
          {subRegion === "us" && <RegionTag tone="us">US</RegionTag>}
          {subRegion === "ca" && <RegionTag tone="ca">CA</RegionTag>}
        </h3>
        <AnchorButton
          hash={anchorId}
          region={region}
          label={`Copy link to ${title}`}
          className="opacity-0 group-hover/sub:opacity-100"
        />
      </div>
      <div className="space-y-3 text-base leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-5">
      {items.map((item) => (
        <li key={item} className="list-disc marker:text-foreground">
          {item}
        </li>
      ))}
    </ul>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-muted/50 text-foreground">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium sm:px-5">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card text-muted-foreground">
            {rows.map((row) => (
              <tr key={row.join("-")} className="align-top">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3 sm:px-5">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

