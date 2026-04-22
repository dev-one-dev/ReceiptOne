import type { ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

const scopeItems = [
  "Create an account",
  "Upload receipts, invoices, or other documents",
  "Use reporting, analytics, or tax configuration features",
  "Contact support",
  "Otherwise interact with the Services",
];

const directInformation = [
  "Name",
  "Email address",
  "Account credentials",
  "Subscription and billing status information received from app store platforms (Apple App Store, Google Play Store)",
  "App preferences and settings",
  "Country, province/state, and other configuration data relevant to tax logic and reporting",
  "Support requests and communications you send to us",
];

const taxData = [
  "Images of receipts and documents uploaded by you",
  "Data extracted from receipts or documents using OCR, such as merchant name, transaction date, amount, taxes, and currency",
  "Manually entered expenses and related notes",
  "Mileage and trip records",
  "Home office information, such as square footage, allocation percentages, and related expense inputs",
  "Tax-related forms, reports, or documents that you upload or generate through the Services",
];

const autoCollected = [
  "Device type, operating system, and app version",
  "IP address and approximate location derived from IP address",
  "Usage, interaction, and feature activity data",
  "Crash reports, diagnostics, and performance information",
  "Security and log information necessary to detect misuse, fraud, or service errors",
];

const devicePermissions = [
  ["Camera", "Capture receipt or document images when you initiate a scan", "Yes"],
  ["Photo Library / Storage", "Select files or images that you choose to upload", "Yes"],
  ["Push Notifications", "Send service-related reminders, alerts, and updates", "Yes"],
];

const californiaCategories = [
  ["Identifiers", "Name, email address, account identifiers, device-related identifiers"],
  ["Customer records", "Subscription status, service history"],
  ["Commercial information", "Transaction metadata, subscription plan details"],
  ["Internet activity", "App usage, diagnostics, interaction data"],
  ["Approximate geolocation", "Derived from IP address"],
  [
    "Sensitive personal information",
    "Financial or expense-related information contained in receipts, reports, and uploaded documents",
  ],
];

const usageItems = [
  "To create, administer, and secure your account",
  "To provide, operate, maintain, and improve the Services",
  "To process receipt images and documents using OCR and AI-assisted tools",
  "To organize, classify, and summarize expenses and tax-related records",
  "To generate reports, exports, and user-requested outputs",
  "To sync data across devices and supported platforms",
  "To communicate with you about service-related notices, support, updates, and security matters",
  "To detect, investigate, prevent, or respond to fraud, abuse, security incidents, or technical issues",
  "To comply with legal obligations, enforce agreements, and protect rights, safety, and property",
];

const aiItems = [
  "Extract structured data from receipt and document images",
  "Suggest merchant or expense categories",
  "Apply country-specific tax logic rules and calculation support",
  "Assist with recognition, normalization, and organization of uploaded content",
];

const aiLimitations = [
  "These processes do not make legal, credit, employment, insurance, or similarly significant decisions about individuals",
  "Users may review, edit, override, or delete resulting records within the Services at any time",
  "AI suggestions are for informational purposes only and should not be relied upon as definitive tax or financial advice",
];

const sharingRecipients = [
  "Cloud hosting and infrastructure providers",
  "Authentication, storage, database, messaging, and platform service providers",
  "OCR, document analysis, and AI service providers",
  "Analytics, diagnostics, logging, and crash reporting providers",
  "Email and customer communication providers",
  "Professional advisors, auditors, insurers, and legal compliance providers where reasonably necessary",
  "Government authorities, courts, regulators, law enforcement, or other third parties where required by law or legal process",
];

const providers = [
  ["Firebase / Google Cloud", "Authentication, storage, database, cloud functions, messaging, remote config"],
  ["Google Cloud Vision API", "OCR processing of receipt images"],
  ["Google Cloud Vertex AI / Gemini", "AI-assisted analysis and processing"],
  ["OpenAI, LLC", "AI-assisted merchant categorization and extraction support"],
  ["Logo.dev (Simple Casual, LLC)", "Retrieval of merchant logo assets based on merchant domain information"],
];

const countries = ["Canada", "The United States", "Other jurisdictions where we or our service providers operate"];

const retentionRows = [
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
];

const canadaRights = [
  "Access personal information we hold about you",
  "Correct inaccurate or incomplete personal information",
  "Withdraw consent (subject to legal or contractual restrictions and reasonable notice)",
  "Delete your personal information (subject to legal exceptions)",
  "Complain to the Office of the Privacy Commissioner of Canada or, for Quebec residents, the Commission d'accès à l'information du Québec (CAI)",
];

const usRights = [
  "Know what categories of personal information we collect, use, disclose, and retain",
  "Access specific pieces of personal information",
  "Delete personal information",
  "Correct inaccurate personal information",
  "Opt out of the sale or sharing of personal information (ReceiptOne does not sell or share for cross-context behavioral advertising)",
  "Limit the use of sensitive personal information (ReceiptOne uses such information only for limited permitted purposes)",
  "Non-discrimination — you will not be discriminated against for exercising your privacy rights",
];

const requestItems = [
  "Your full name",
  "Email address associated with your account",
  "Specific details of your request",
  "Any supporting documentation (if applicable)",
];

const verificationItems = [
  "Confirming access to the email address associated with your account",
  "Requesting information that matches our records",
  "Using other reasonable authentication measures",
];

const consentActions = [
  "Check a box indicating your agreement during account creation",
  "Take an affirmative action (such as clicking “I Agree” or “Accept”) before using receipt scanning or expense tracking features",
];

const withdrawalItems = [
  "Deleting specific content (receipts, expenses, documents)",
  "Disabling optional device permissions",
  "Deleting your account",
  "Contacting us directly",
];

const securityRows = [
  ["Encryption in transit", "TLS or similar protocols for all data transmitted over networks"],
  ["Access controls", "Least-privilege access, role-based authentication"],
  ["Logging and monitoring", "Audit measures for security-sensitive activity"],
  ["Infrastructure security", "Reasonable steps to secure cloud environments (Firebase, Google Cloud)"],
];

const changeItems = ["Our practices or technologies", "Legal requirements", "The Services themselves"];

const notificationItems = [
  'We will revise the "Last updated" date at the top of this policy',
  "For material changes, we will provide additional notice through the Services (e.g., in-app notification or email)",
  "Continued use of the Services after changes constitutes acceptance of the updated policy, except where applicable law requires explicit re-consent",
];

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "ReceiptOne Privacy Policy" },
      {
        name: "description",
        content:
          "Read the ReceiptOne Privacy Policy covering data collection, use, retention, privacy rights, security, and contact details.",
      },
      { property: "og:title", content: "ReceiptOne Privacy Policy" },
      {
        property: "og:description",
        content:
          "ReceiptOne Privacy Policy for Canada and the United States, including privacy rights, security safeguards, and contact information.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-display text-lg font-semibold">ReceiptOne</p>
            <p className="text-sm text-muted-foreground">Privacy Policy</p>
          </div>
          <Link
            to="/ca"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Back to site
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="border-b border-border pb-8">
          <p className="text-sm font-medium text-muted-foreground">Last updated: April 23, 2026</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-normal sm:text-5xl">ReceiptOne Privacy Policy</h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              This Privacy Policy explains how ReceiptOne (&quot;ReceiptOne,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects,
              uses, discloses, stores, and protects personal information when you use the ReceiptOne mobile
              applications (iOS and Android), the ReceiptOne web application, and related services (collectively, the
              &quot;Services&quot;).
            </p>
            <p>ReceiptOne is designed for self-employed individuals, contractors, and small businesses.</p>
            <p>
              This Privacy Policy is intended to comply with applicable privacy laws in Canada and the United States,
              including PIPEDA, Quebec&apos;s Law 25, the CCPA/CPRA, and other applicable U.S. state privacy laws.
            </p>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Privacy requests and questions:{" "}
            <a className="font-medium text-foreground underline underline-offset-4" href="mailto:support@receipt-one.com">
              support@receipt-one.com
            </a>
          </p>
        </header>

        <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          <div className="space-y-10">
            <PolicySection number="1" title="Scope">
              <p>
                This Privacy Policy applies to personal information collected through the Services, including when you:
              </p>
              <BulletList items={scopeItems} />
            </PolicySection>

            <PolicySection number="2" title="Information We Collect">
              <SubSection title="2.1 Information You Provide Directly">
                <BulletList items={directInformation} />
              </SubSection>

              <SubSection title="2.2 Receipt, Expense, and Tax-Related Data">
                <p>To provide expense tracking, organization, and reporting functionality, we may collect and process:</p>
                <BulletList items={taxData} />
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
                  Google Play Store. We receive limited subscription metadata from those platforms, such as plan type,
                  renewal status, country, transaction identifiers, and subscription status.
                </p>
                <p>
                  If additional web billing or payment processors are introduced in the future, this Privacy Policy will
                  be updated accordingly.
                </p>
              </SubSection>

              <SubSection title="2.4 Automatically Collected Information">
                <BulletList items={autoCollected} />
              </SubSection>

              <SubSection title="2.5 Device Permissions">
                <DataTable headers={["Permission", "Purpose", "Can be revoked?"]} rows={devicePermissions} />
                <p>You may revoke device permissions through your device settings. If you do so, certain features may be limited or unavailable.</p>
              </SubSection>

              <SubSection title="2.6 Categories of Personal Information for California Residents">
                <p>For purposes of the CCPA/CPRA, we may collect the following categories of personal information:</p>
                <DataTable headers={["Category", "Examples"]} rows={californiaCategories} />
                <p>
                  We do not use sensitive personal information to infer characteristics about individuals. We use it
                  only for limited purposes reasonably necessary to provide the Services, maintain security, detect
                  errors or fraud, comply with law, and perform other permitted business purposes.
                </p>
              </SubSection>
            </PolicySection>

            <PolicySection number="3" title="How We Use Personal Information">
              <p>We use personal information for the following purposes:</p>
              <BulletList items={usageItems} />
              <p>Where permitted by law, we may also use de-identified or aggregated information for analytics, research, service improvement, and business operations.</p>
              <p>
                <strong>Important:</strong> ReceiptOne provides organizational and informational tools only and does not
                provide legal, accounting, tax, or financial advice.
              </p>
            </PolicySection>

            <PolicySection number="4" title="AI-Assisted and Automated Processing">
              <p>ReceiptOne uses automated tools and AI-assisted processing to:</p>
              <BulletList items={aiItems} />
              <p><strong>Limitations of AI processing:</strong></p>
              <BulletList items={aiLimitations} />
            </PolicySection>

            <PolicySection number="5" title="How We Share Personal Information">
              <p>
                <strong>We do not sell personal information. We do not share personal information for cross-context behavioral advertising.</strong>
              </p>
              <p>We may disclose personal information to the following categories of recipients for business or operational purposes:</p>
              <BulletList items={sharingRecipients} />
              <p><strong>Examples of service providers used in connection with the Services:</strong></p>
              <DataTable headers={["Provider", "Purpose"]} rows={providers} />
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
            </PolicySection>

            <PolicySection number="6" title="International and Cross-Border Processing">
              <p>ReceiptOne uses service providers and cloud-based infrastructure that may process or store personal information in:</p>
              <BulletList items={countries} />
              <p>
                <strong>Legal implications:</strong> As a result, personal information may be subject to the laws of
                those jurisdictions, including lawful access requests by courts, regulators, or law enforcement
                authorities.
              </p>
              <p>
                We use contractual, technical, and organizational safeguards that are appropriate to the sensitivity of
                the information and the nature of the processing, including Standard Contractual Clauses or equivalent
                mechanisms where required by law.
              </p>
            </PolicySection>

            <PolicySection number="7" title="Data Retention">
              <p>
                We retain personal information for as long as reasonably necessary for the purposes described in this
                Privacy Policy, including to provide the Services and comply with legal, accounting, tax, security,
                dispute resolution, and enforcement obligations.
              </p>
              <p><strong>General retention periods:</strong></p>
              <DataTable headers={["Data type", "Retention period"]} rows={retentionRows} />
              <p>
                <strong>Important note regarding service provider caching:</strong> Despite deletion from our active
                systems, our service providers (including Google Cloud and OpenAI) may retain hashed, logged, or cached
                copies of data for a limited period (typically up to 30 days) for security, abuse prevention, and fraud
                detection purposes. After such period, residual copies are deleted or rendered unreadable.
              </p>
            </PolicySection>

            <PolicySection number="8" title="Your Privacy Rights">
              <SubSection title="8.1 Canada (PIPEDA and Quebec Law 25)">
                <p>You have the right to:</p>
                <BulletList items={canadaRights} />
              </SubSection>

              <SubSection title="8.2 United States (California and other states)">
                <p>Depending on your state of residence and subject to applicable exceptions, you may have the right to:</p>
                <BulletList items={usRights} />
                <p>
                  Because ReceiptOne does not sell personal information or share personal information for cross-context
                  behavioral advertising, we do not offer a “Do Not Sell or Share” mechanism for activities that we do
                  not engage in.
                </p>
              </SubSection>

              <SubSection title="8.3 How to Submit Requests">
                <p>
                  You may submit privacy requests by contacting <strong>support@receipt-one.com</strong> with the
                  subject line <strong>“Privacy Request”</strong>.
                </p>
                <p>In your request, please include:</p>
                <BulletList items={requestItems} />
                <p>
                  <strong>Authorized agents:</strong> Where required by law, authorized agents may submit requests on
                  behalf of individuals, subject to appropriate verification and written authorization.
                </p>
              </SubSection>

              <SubSection title="8.4 Verification and Appeals">
                <p><strong>Verification process:</strong> To protect your personal information, we will verify your identity before fulfilling a request. Verification may include:</p>
                <BulletList items={verificationItems} />
                <p>If we cannot verify your identity or authority to act, we may deny or limit the request as permitted by law.</p>
                <p><strong>Appeals process:</strong> If we deny a request, we will provide you with a clear explanation of the basis for denial and information about how you may appeal that decision.</p>
                <p>To appeal, please reply to our denial notice or contact us at support@receipt-one.com with “Appeal” in the subject line.</p>
                <p><strong>Response timing:</strong> We will respond to verified requests within the timeframes required by applicable law (typically 30 days for PIPEDA, 45 days for CCPA/CPRA, with possible extensions where permitted).</p>
              </SubSection>
            </PolicySection>

            <PolicySection number="9" title="Consent">
              <SubSection title="9.1 General Consent">
                <p>
                  By creating an account, uploading receipts or documents, enabling optional features, or otherwise
                  using the Services, you consent to the collection, use, and disclosure of personal information as
                  described in this Privacy Policy, except where applicable law requires a different form of consent.
                </p>
              </SubSection>

              <SubSection title="9.2 Express Consent for Quebec Residents and Sensitive Information">
                <p><strong>For residents of Quebec (Canada):</strong> Where required by Quebec&apos;s Law 25, we obtain express consent before collecting, using, or disclosing your personal information.</p>
                <p><strong>For sensitive personal information (all users):</strong> Where required by applicable law, we obtain express consent before collecting, using, or disclosing financial or expense-related data contained in receipts, reports, and uploaded documents.</p>
                <p><strong>How express consent is obtained:</strong></p>
                <BulletList items={consentActions} />
                <p>You may withdraw express consent at any time by contacting us. If you withdraw consent for processing that is necessary to provide the Services, some features or the Services themselves may no longer be available.</p>
              </SubSection>

              <SubSection title="9.3 Withdrawal of Consent">
                <p>You may withdraw consent for certain processing by:</p>
                <BulletList items={withdrawalItems} />
                <p>If you withdraw consent for processing that is necessary to provide the Services, some features or the Services themselves may no longer be available.</p>
              </SubSection>
            </PolicySection>

            <PolicySection number="10" title="Security Safeguards">
              <p>We implement administrative, technical, and organizational safeguards designed to protect personal information, including:</p>
              <DataTable headers={["Measure", "Description"]} rows={securityRows} />
              <p>
                <strong>Limitation:</strong> No method of transmission over the Internet or method of electronic storage
                is completely secure. Accordingly, we cannot guarantee absolute security. In the event of a data breach
                affecting your personal information, we will notify you and relevant authorities as required by
                applicable law.
              </p>
            </PolicySection>

            <PolicySection number="11" title="Children’s Privacy">
              <p>
                The Services are intended for adults and business users and are not directed to children under the age
                of 18 (or the age of majority in your jurisdiction).
              </p>
              <p>
                We do not knowingly collect personal information from children. If you believe a child has provided
                personal information to us, please contact us immediately so that we can review and delete such
                information.
              </p>
            </PolicySection>

            <PolicySection number="12" title="Changes to This Privacy Policy">
              <p>We may update this Privacy Policy from time to time to reflect changes in:</p>
              <BulletList items={changeItems} />
              <p><strong>Notification of material changes:</strong></p>
              <BulletList items={notificationItems} />
            </PolicySection>

            <PolicySection number="13" title="Contact Information">
              <p><strong>Privacy Contact / Data Protection Officer (DPO) responsibilities</strong> are handled by the ReceiptOne privacy team.</p>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Email</p>
                <a className="mt-1 block font-medium text-foreground underline underline-offset-4" href="mailto:support@receipt-one.com">
                  support@receipt-one.com
                </a>
                <p className="mt-4 text-sm text-muted-foreground">Subject line for privacy matters</p>
                <p className="mt-1 font-medium">Privacy Request</p>
              </div>
              <div className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Regulatory complaints (Canada):</strong>{" "}
                  <a className="underline underline-offset-4" href="https://www.priv.gc.ca/en/report-a-concern/" target="_blank" rel="noreferrer">
                    Office of the Privacy Commissioner of Canada
                  </a>
                </p>
                <p>
                  <strong className="text-foreground">Regulatory complaints (Quebec):</strong>{" "}
                  <a className="underline underline-offset-4" href="https://www.cai.gouv.qc.ca/" target="_blank" rel="noreferrer">
                    Commission d&apos;accès à l&apos;information du Québec (CAI)
                  </a>
                </p>
                <p>
                  <strong className="text-foreground">Regulatory complaints (California):</strong>{" "}
                  <a className="underline underline-offset-4" href="https://oag.ca.gov/privacy" target="_blank" rel="noreferrer">
                    California Attorney General
                  </a>
                </p>
              </div>
              <p className="text-sm text-muted-foreground">© 2026 ReceiptOne. All rights reserved.</p>
            </PolicySection>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="font-display text-lg font-semibold">Summary</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
                <p>This page contains the uploaded privacy policy text formatted for the web.</p>
                <p>It covers Canada and U.S. privacy obligations, retention, security, and request handling.</p>
                <p>
                  For privacy requests, email{" "}
                  <a className="font-medium text-foreground underline underline-offset-4" href="mailto:support@receipt-one.com">
                    support@receipt-one.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

function PolicySection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-b border-border/70 pb-10 last:border-b-0 last:pb-0">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Section {number}</p>
        <h2 className="font-display text-2xl font-semibold tracking-normal sm:text-3xl">{title}</h2>
      </div>
      <div className="space-y-4 text-base leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="font-display text-xl font-semibold tracking-normal text-foreground">{title}</h3>
      <div className="space-y-4 text-base leading-7 text-muted-foreground">{children}</div>
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