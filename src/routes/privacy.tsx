import { Link, createFileRoute } from "@tanstack/react-router";
import { PolicySection, SubSection, BulletList, DataTable } from "@/components/site/PolicyHelpers";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";

const collectedInformation = [
  "Identifiers: name, email address, account ID, country, and province/state",
  "Financial data: receipt images, OCR text, merchant names, dates, amounts, expense categories, mileage records, and reports",
  "Technical data: IP address, device identifiers, app identifiers, crash logs, and usage logs",
  "Subscription data: plan type, renewal status, and purchase tokens received from Apple or Google storefronts",
];

const processingPurposes = [
  "Provide, secure, maintain, and improve the Services",
  "Perform OCR and AI-assisted categorization",
  "Generate reports and outputs requested by you",
  "Administer subscriptions and account status",
  "Detect fraud, abuse, and technical misuse",
  "Comply with law and enforce the Terms",
];

const disclosureCategories = [
  "Hosting, authentication, storage, and backend providers",
  "OCR and AI processing providers",
  "Analytics, diagnostics, and logging providers",
  "Other vendors acting on our behalf to operate the Services",
  "Authorities or third parties when required by law",
];

const processingCountries = [
  "United States (Google Cloud Platform, Firebase, OpenAI, Logo.dev)",
  "Canada (if a Canadian-based processor is added in the future; currently none)",
];

const subprocessors = [
  ["Firebase (Google LLC)", "Authentication, storage, backend"],
  ["Google Cloud Vision API", "OCR text extraction"],
  ["Google Cloud Vertex AI (Gemini)", "Receipt content analysis"],
  ["OpenAI, LLC", "Merchant categorization using limited transaction data"],
  ["Logo.dev", "Merchant logo display"],
];

const usRights = [
  "Know what personal information we collect",
  "Request deletion of your personal information",
  "Opt out of any sale or sharing of personal information (ReceiptOne does not sell or share)",
  "Non-discrimination for exercising your privacy rights",
];

const canadaRights = [
  "Access your personal information",
  "Correct inaccurate or incomplete information",
  "Request deletion of personal information, subject to legal obligations",
  "Withdraw consent where permitted by law",
];

const securityMeasures = [
  "TLS 1.3 encryption in transit",
  "AES-256 encryption at rest",
  "Access controls and role-based permissions",
  "Audit logging and monitoring",
];

const updateTriggers = [
  "Changes in our product or infrastructure",
  "Legal or regulatory requirements",
  "Updates to our privacy practices or processor list",
];

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "ReceiptOne Privacy Policy" },
      {
        name: "description",
        content:
          "ReceiptOne Privacy Policy covering collection, use, disclosure, retention, privacy rights, security, and breach notifications.",
      },
      { property: "og:title", content: "ReceiptOne Privacy Policy" },
      {
        property: "og:description",
        content:
          "Read how ReceiptOne handles personal information in Canada and the United States, including rights, security measures, and processors.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/ca" className="flex items-center gap-2">
              <img src={logoMark} alt="" aria-hidden className="block size-10" />
              <img src={logoWordmark} alt="ReceiptOne" className="block h-6 w-auto" />
            </Link>
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

      <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="border-b border-border pb-8">
          <p className="text-sm font-medium text-muted-foreground">Last updated: April 23, 2026</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-normal sm:text-5xl">ReceiptOne Privacy Policy</h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              This page is the web version of the privacy section from the provided legal document. It explains what
              personal information ReceiptOne collects, how that information is used, where it may be processed, and
              what privacy rights are available to users in the United States and Canada.
            </p>
            <p>
              ReceiptOne does not sell personal information for money and does not share personal information for
              cross-context behavioral advertising.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <a className="font-medium text-foreground underline underline-offset-4" href="mailto:privacy@receipt-one.com">
              privacy@receipt-one.com
            </a>
            <span>•</span>
            <a className="font-medium text-foreground underline underline-offset-4" href="mailto:support@receipt-one.com">
              support@receipt-one.com
            </a>
          </div>
        </header>

        <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
          <div className="space-y-10">
            <PolicySection number="1" title="Information We Collect">
              <BulletList items={collectedInformation} />
            </PolicySection>

            <PolicySection number="2" title="Purposes of Processing">
              <BulletList items={processingPurposes} />
            </PolicySection>

            <PolicySection number="3" title="Disclosure of Personal Information">
              <p>
                We may disclose personal information to service providers that perform services on our behalf.
              </p>
              <BulletList items={disclosureCategories} />
              <p>
                ReceiptOne does <strong className="text-foreground">not</strong> sell personal information for money
                and does <strong className="text-foreground">not</strong> share personal information for cross-context
                behavioral advertising.
              </p>
            </PolicySection>

            <PolicySection number="4" title="Third-Party Processors and Countries of Processing">
              <SubSection title="Countries of processing">
                <BulletList items={processingCountries} />
              </SubSection>
              <SubSection title="Current processor categories">
                <DataTable headers={["Processor", "Purpose"]} rows={subprocessors} />
              </SubSection>
              <p>
                All subprocessors are contractually prohibited from using your data for their own purposes or for model
                training.
              </p>
            </PolicySection>

            <PolicySection number="5" title="Data Retention">
              <p>
                We retain personal information while your account is active. After account deletion, ReceiptOne deletes
                or anonymizes your data within <strong className="text-foreground">90 days</strong>, except where
                longer retention is required by law, such as tax record retention obligations in the United States or
                Canada.
              </p>
            </PolicySection>

            <PolicySection number="6" title="Your Privacy Rights — United States">
              <BulletList items={usRights} />
              <p>
                To exercise your rights, email{" "}
                <a className="font-medium text-foreground underline underline-offset-4" href="mailto:privacy@receipt-one.com">
                  privacy@receipt-one.com
                </a>{" "}
                or use the in-app Settings → Privacy Requests flow.
              </p>
            </PolicySection>

            <PolicySection number="7" title="Your Privacy Rights — Canada">
              <BulletList items={canadaRights} />
              <p>
                Requests can be submitted at{" "}
                <a className="font-medium text-foreground underline underline-offset-4" href="mailto:privacy@receipt-one.com">
                  privacy@receipt-one.com
                </a>
                .
              </p>
            </PolicySection>

            <PolicySection number="8" title="Security Measures">
              <BulletList items={securityMeasures} />
            </PolicySection>

            <PolicySection number="9" title="Data Breach Notification">
              <p>
                In the event of a material data breach involving personal information, ReceiptOne will notify affected
                users within <strong className="text-foreground">72 hours</strong> of confirmation, via email and
                in-app notification, as required by applicable law.
              </p>
            </PolicySection>

            <PolicySection number="10" title="Children's Privacy">
              <p>
                The Services are not intended for individuals under 18. We do not knowingly collect personal
                information from minors. If we learn that we have done so, we will delete it immediately.
              </p>
            </PolicySection>

            <PolicySection number="11" title="Changes to Privacy Disclosures">
              <p>We may update these privacy disclosures in response to:</p>
              <BulletList items={updateTriggers} />
              <p>Material changes will be communicated as required by applicable law.</p>
            </PolicySection>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="font-display text-lg font-semibold">Summary</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
                  <p>This page covers Sections 1–11 from the uploaded legal document.</p>
                <p>It includes data collection, processors, retention, security, and privacy rights.</p>
                <p>
                  Privacy contact:{" "}
                  <a className="font-medium text-foreground underline underline-offset-4" href="mailto:privacy@receipt-one.com">
                    privacy@receipt-one.com
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

