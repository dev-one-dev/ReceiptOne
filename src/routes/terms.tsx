import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronsDownUp, ChevronsUpDown, ListTree, X } from "lucide-react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";
import {
  AnchorButton,
  LegalSummary,
  PrintButton,
  RegionParagraph,
  RegionSwitcher,
  RegionTag,
  useLegalUIState,
  type SummaryItem,
  type Region,
} from "@/components/site/legal/shared";

type SectionEntry = {
  number?: string;
  title: string;
  /** Which jurisdictions the section is relevant to. Empty/undefined = both. */
  regions?: Region[];
  content: (region: Region) => ReactNode;
};

type PartEntry = {
  id: string;
  label: string;
  title: string;
  sections: SectionEntry[];
};

const sectionId = (s: SectionEntry) => (s.number ? `section-${s.number}` : `section-${slug(s.title)}`);
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const isApplicable = (s: SectionEntry, region: Region) => {
  if (region === "all" || !s.regions || s.regions.length === 0) return true;
  return s.regions.includes(region);
};

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "ReceiptOne — Terms of Use" },
      {
        name: "description",
        content:
          "ReceiptOne Terms of Use, Privacy & Data Protection, and Final Provisions for users in the United States and Canada.",
      },
      { property: "og:title", content: "ReceiptOne — Terms of Use" },
      {
        property: "og:description",
        content:
          "Legally binding Terms of Use governing access to ReceiptOne, including privacy, billing, dispute resolution, and contact information.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TermsPage,
});

/* ----------------------------- Content model ----------------------------- */

const TERMS_SUMMARY: SummaryItem[] = [
  {
    title: "Who can use it",
    body: "Self-employed individuals, contractors, and small businesses. You must be of legal age and accept these Terms.",
  },
  {
    title: "Your account",
    body: "Keep credentials secure. You're responsible for activity on your account and the accuracy of data you upload.",
  },
  {
    title: "Subscriptions & billing",
    body: "Paid plans are billed via Apple App Store or Google Play. Renewals, refunds, and cancellations follow each store's policies.",
  },
  {
    title: "Acceptable use",
    body: "No misuse, reverse engineering, scraping, or uploading unlawful content. We may suspend accounts that violate the Terms.",
  },
  {
    title: "AI & OCR outputs",
    body: "OCR/AI assist with classification and extraction. Always review outputs — you are responsible for tax and accounting decisions.",
  },
  {
    title: "Not professional advice",
    body: "ReceiptOne is a recordkeeping tool, not legal, tax, or accounting advice. Consult a professional for your situation.",
  },
  {
    title: "Liability",
    body: "Services are provided 'as is'. Liability is limited to the maximum extent permitted by applicable law.",
    region: "all",
  },
  {
    title: "Canada — governing law",
    body: "Quebec residents retain mandatory consumer protections. Disputes governed by the laws of the applicable Canadian province.",
    region: "ca",
  },
  {
    title: "United States — arbitration",
    body: "Disputes are resolved by binding individual arbitration with a class-action waiver, except where prohibited by law.",
    region: "us",
  },
  {
    title: "Changes & termination",
    body: "We may update the Terms; material changes will be notified. You may stop using the Services at any time.",
  },
];

const PARTS: PartEntry[] = [
  {
    id: "part-a",
    label: "Part A",
    title: "General Terms of Use",
    sections: [
      {
        number: "1",
        title: "Acceptance and Scope",
        content: () => (
          <>
            <p>
              These Terms apply to your access to and use of ReceiptOne and all related features, content, support
              tools, and associated services that we make available from time to time (collectively, the
              &quot;Services&quot;). By creating an account, clicking to accept, downloading, installing, accessing,
              or using the Services, you agree to be bound by these Terms and our Privacy &amp; Data Protection
              provisions in Part B.
            </p>
            <p>If you do not agree to these Terms, you must not access or use the Services.</p>
          </>
        ),
      },
      {
        number: "2",
        title: "Company Information",
        content: () => (
          <BulletList
            items={[
              "Legal entity: [INSERT FULL LEGAL ENTITY NAME].",
              "Jurisdiction of organization: [INSERT STATE/PROVINCE AND COUNTRY OF INCORPORATION OR ORGANIZATION].",
              "Mailing address for legal notices: [INSERT FULL BUSINESS ADDRESS].",
              "General support: support@receipt-one.com.",
              "Privacy requests: privacy@receipt-one.com.",
              "Legal notices: legal@receipt-one.com.",
            ]}
          />
        ),
      },
      {
        number: "3",
        title: "Eligibility and Geographic Scope",
        content: () => (
          <>
            <p>You must be at least 18 years old to use the Services.</p>
            <p>
              The Services are intended only for users located in the United States and Canada. We do not actively
              offer the Services in the European Economic Area, the United Kingdom, or Switzerland. If you access
              the Services from another jurisdiction, you do so at your own risk and are responsible for compliance
              with local law to the extent applicable.
            </p>
            <p>
              You represent and warrant that you are legally capable of entering into a binding agreement and that
              your use of the Services does not violate any applicable law or contractual restriction.
            </p>
          </>
        ),
      },
      {
        number: "4",
        title: "Description of the Services",
        content: () => (
          <>
            <p>
              ReceiptOne is a general-purpose expense tracking and reporting platform. Depending on your plan and
              product version, the Services may include receipt scanning, OCR-based text extraction, expense
              categorization and tagging, mileage tracking, home office allocation tools, analytics, bulk upload
              tools, referral functionality, and report generation and export in formats such as PDF or CSV.
            </p>
            <p>
              The Services are productivity and record-organization tools only. They are not a substitute for
              professional advice or independent review of your records.
            </p>
          </>
        ),
      },
      {
        number: "5",
        title: "No Tax, Accounting, Legal, or Financial Advice",
        content: () => (
          <>
            <p>
              ReceiptOne is not a tax preparer, accounting firm, law firm, bookkeeping service, payroll provider,
              investment adviser, or financial adviser.
            </p>
            <p>
              The Services do not provide tax, accounting, legal, or financial advice; do not guarantee compliance
              with IRS, CRA, or other authority requirements; and do not guarantee that any deduction, expense
              classification, tax position, report, or estimate is correct, complete, or legally available to you.
            </p>
            <p>
              All OCR outputs, AI-generated categorizations, classifications, rate applications, calculations,
              recommendations, and reports are estimates only and may contain errors, omissions, outdated
              assumptions, or inaccurate interpretations of user-provided information.
            </p>
            <p>
              You are solely responsible for reviewing the Services output, validating all data, deciding whether a
              deduction or credit applies, determining how to characterize any expense, meeting filing and
              recordkeeping obligations, and consulting a licensed accountant, tax preparer, lawyer, or other
              qualified adviser where appropriate.
            </p>
          </>
        ),
      },
      {
        number: "6",
        title: "User Accounts and Security",
        content: () => (
          <>
            <p>
              You are responsible for maintaining the confidentiality of your credentials and for all activities
              that occur under your account. You must promptly notify us if you believe your account has been
              compromised or used without authorization.
            </p>
            <p>
              You agree to provide accurate, current, and complete information and to keep your account details
              reasonably up to date.
            </p>
          </>
        ),
      },
      {
        number: "7",
        title: "User Content; License to Operate the Services",
        content: () => (
          <>
            <p>
              You retain ownership of the content you upload, submit, store, or generate through the Services,
              including receipt images, expense data, mileage records, files, and notes (&quot;User Content&quot;).
            </p>
            <p>
              You grant ReceiptOne a limited, non-exclusive, revocable, worldwide license to host, store,
              reproduce, transmit, process, analyze, and display User Content solely as reasonably necessary to
              provide, secure, maintain, support, troubleshoot, and improve the Services for you, to comply with
              law, and to enforce these Terms.
            </p>
            <p>Except as described in these Terms, ReceiptOne does not claim ownership of your User Content.</p>
          </>
        ),
      },
      {
        number: "8",
        title: "AI and Machine Learning Data Use Limitation",
        content: () => (
          <>
            <p>
              ReceiptOne may use automated tools, including OCR, rules-based systems, and AI-assisted
              classification, to operate the Services.
            </p>
            <p>
              We do not use your User Content to train or fine-tune public or shared third-party foundation models
              for general use. When we use third-party processors to provide OCR or AI-enabled features, we
              configure those services for service delivery purposes and contractual processing on our behalf,
              subject to applicable provider terms and data protection controls.
            </p>
            <p>
              We may use service telemetry, de-identified or aggregated information, and operational performance
              data to debug, secure, maintain, measure, and improve the Services, provided that such use does not
              materially change the ownership of your User Content.
            </p>
          </>
        ),
      },
      {
        number: "9",
        title: "Acceptable Use; Prohibited Conduct",
        content: () => (
          <>
            <p>
              You agree not to use the Services for unlawful, fraudulent, deceptive, infringing, or abusive
              purposes.
            </p>
            <p>
              You must not upload false, fabricated, altered, or misleading records for the purpose of
              misrepresentation, evading taxes, or defrauding another person or authority.
            </p>
            <p>
              You must not reverse engineer, interfere with, disable, overburden, scrape, probe, exploit, or
              attempt to bypass the security or technical protections of the Services, except to the limited
              extent such restriction is prohibited by applicable law.
            </p>
            <p>
              You may not use the Services in a manner that would require ReceiptOne to become subject to HIPAA,
              GLBA, FISMA, PCI DSS, or other industry-specific regulatory obligations that the Services are not
              designed to satisfy.
            </p>
          </>
        ),
      },
      {
        number: "10",
        title: "Subscriptions, Billing, Auto-Renewal, and Refunds",
        content: () => (
          <>
            <p>
              Certain features require a paid subscription. If you purchase through the Apple App Store or Google
              Play Store, billing, cancellation, refund handling, and payment method management are governed
              primarily by the applicable storefront terms and policies.
            </p>
            <p>
              Unless otherwise disclosed at purchase, subscriptions automatically renew at the end of each billing
              cycle until cancelled. Cancellation generally takes effect at the end of the current paid period,
              unless the applicable storefront or law provides otherwise.
            </p>
            <p>
              ReceiptOne does not receive, store, or process your full payment card details when purchases are
              made through Apple or Google. We may receive limited subscription metadata such as plan type,
              renewal status, transaction identifiers, country, and subscription state necessary to provide
              access, detect fraud, and support billing-related service logic.
            </p>
            <p>
              Except where required by law, by the relevant app marketplace, or expressly stated in an offer, fees
              are non-refundable.
            </p>
          </>
        ),
      },
      {
        number: "11",
        title: "Promotional Credits and Referral Rewards",
        content: () => (
          <>
            <p>
              If ReceiptOne offers referral rewards, promotional credits, bonus days, discounts, trials, or
              similar incentives, those offers are subject to additional program-specific terms that may appear
              in-app or on the website.
            </p>
            <p>
              Unless expressly stated otherwise, promotional rewards: (a) have no cash value; (b) are
              non-transferable; (c) may be revoked in cases of fraud, abuse, chargeback, refund, duplicate account
              activity, self-referral, or violation of program rules; and (d) may be modified, suspended, or
              discontinued at any time to the extent permitted by law.
            </p>
            <p>
              Where a referral program applies a benefit to a future renewal period rather than the current paid
              term, that future application timing will control.
            </p>
          </>
        ),
      },
      {
        number: "12",
        title: "Intellectual Property",
        content: () => (
          <>
            <p>
              Except for User Content, the Services and all related software, code, databases, interfaces,
              designs, text, graphics, logos, trademarks, service marks, compilations, and other materials are
              owned by ReceiptOne or its licensors and are protected by intellectual property and other laws.
            </p>
            <p>
              Subject to your compliance with these Terms, ReceiptOne grants you a limited, non-exclusive,
              non-transferable, revocable right to use the Services for your internal personal or business
              record-management purposes.
            </p>
          </>
        ),
      },
      {
        number: "13",
        title: "Third-Party Services and Integrations",
        content: () => (
          <>
            <p>
              The Services may interoperate with or depend on third-party services, platforms, hosting providers,
              analytics tools, app marketplaces, mapping or OCR providers, AI providers, storage providers, or
              other integrations. ReceiptOne is not responsible for third-party services, and your use of
              third-party functionality may also be governed by separate third-party terms and privacy notices.
            </p>
            <p>
              We are not responsible for outages, errors, delays, unavailability, price changes, policy changes,
              or data handling practices of third-party platforms, except to the extent required by applicable
              law.
            </p>
          </>
        ),
      },
      {
        number: "14",
        title: "Disclaimer of Warranties",
        content: () => (
          <>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS
              AVAILABLE,&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
            </p>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RECEIPTONE DISCLAIMS ALL IMPLIED WARRANTIES, INCLUDING
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, QUIET ENJOYMENT,
              ACCURACY, COMPLETENESS, AND ANY WARRANTY ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.
            </p>
            <p>
              Without limiting the foregoing, ReceiptOne does not warrant that the Services will be uninterrupted,
              error-free, secure, current, or suitable for any tax, accounting, audit, financing, legal, or
              regulatory purpose.
            </p>
          </>
        ),
      },
      {
        number: "15",
        title: "Limitation of Liability",
        content: (region) => (
          <>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RECEIPTONE AND ITS AFFILIATES, OFFICERS, DIRECTORS,
              EMPLOYEES, CONTRACTORS, LICENSORS, AND SERVICE PROVIDERS SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, EXEMPLARY, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS,
              REVENUE, DATA, GOODWILL, TAX BENEFITS, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATING TO THE
              SERVICES OR THESE TERMS.
            </p>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RECEIPTONE SHALL NOT BE LIABLE FOR TAX PENALTIES, MISSED
              DEDUCTIONS, COMPLIANCE FAILURES, AUDIT OUTCOMES, USER FILING DECISIONS, OR RELIANCE ON OCR, AI,
              CATEGORIZATION, ESTIMATES, OR REPORT OUTPUTS.
            </p>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RECEIPTONE&apos;S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS
              ARISING OUT OF OR RELATING TO THE SERVICES OR THESE TERMS SHALL NOT EXCEED THE GREATER OF: (A) THE
              AMOUNT YOU PAID TO RECEIPTONE FOR THE SERVICES IN THE 12 MONTHS PRECEDING THE EVENT GIVING RISE TO
              THE CLAIM; OR (B){" "}
              <RegionInline region={region} us="USD $100" ca="the CAD equivalent of USD $100" both="USD $100 (or the CAD equivalent)" />
              .
            </p>
            <p>
              Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or limited,
              including liability for gross negligence, willful misconduct, fraud, or death or personal injury
              caused by negligence where such exclusion is prohibited.
            </p>
          </>
        ),
      },
      {
        number: "16",
        title: "Suspension and Termination",
        content: () => (
          <>
            <p>
              ReceiptOne may suspend or terminate your access to the Services, in whole or in part, immediately or
              at a later time, if we reasonably believe that you have violated these Terms, created risk for
              ReceiptOne or others, engaged in fraud or abuse, or if we are required to do so by law or by a
              third-party platform on which the Services depend.
            </p>
            <p>
              You may stop using the Services at any time. If a self-service delete function is available in the
              product, you may also request deletion through the account settings or by contacting us using the
              details in these Terms.
            </p>
            <p>
              Terms that by their nature should survive termination will survive, including provisions relating to
              ownership, disclaimers, limitation of liability, dispute resolution, accrued payment obligations,
              and data retention required by law.
            </p>
          </>
        ),
      },
      {
        number: "17",
        title: "Dispute Resolution; Arbitration; Class Action Waiver (United States)",
        regions: ["us"],
        content: () => (
          <>
            <p>
              If you are located in the United States, any dispute, claim, or controversy arising out of or
              relating to these Terms or the Services will be resolved by final and binding individual
              arbitration, except that either party may bring an eligible claim in small claims court and either
              party may seek injunctive or equitable relief for misuse of intellectual property, confidential
              information, or unauthorized access to systems.
            </p>
            <p>
              Arbitration will be administered by the American Arbitration Association under its Consumer
              Arbitration Rules. Arbitration may occur remotely, in the county of your residence, or in another
              mutually agreed location.
            </p>
            <p>
              You and ReceiptOne waive any right to participate in a class action, class arbitration, mass
              arbitration to the fullest extent permitted by law, or representative proceeding.
            </p>
            <p>
              You may opt out of arbitration within 30 days of first accepting these Terms by sending an email to
              support@receipt-one.com with the subject line &quot;Arbitration Opt-Out&quot; and your account email
              address. If any portion of this section is found unenforceable, the unenforceable portion will be
              severed and the remainder enforced to the maximum extent permitted by law.
            </p>
          </>
        ),
      },
      {
        number: "18",
        title: "Governing Law",
        content: (region) => (
          <div className="space-y-4">
            {(region === "all" || region === "us") && (
              <RegionParagraph active={region === "us"} label="United States">
                For users located in the United States, these Terms are governed by the federal laws of the United
                States and the laws of the State of Delaware, excluding conflict-of-law rules, except to the
                extent non-waivable consumer protection laws of your state of residence apply.
              </RegionParagraph>
            )}
            {(region === "all" || region === "ca") && (
              <RegionParagraph active={region === "ca"} label="Canada">
                For users located in Canada, these Terms are governed by the federal laws of Canada and the laws
                of the Province of Ontario, excluding conflict-of-law rules, except to the extent non-waivable
                consumer protection laws of your province or territory apply.
              </RegionParagraph>
            )}
          </div>
        ),
      },
      {
        number: "19",
        title: "Changes to the Terms",
        content: () => (
          <>
            <p>
              We may revise these Terms from time to time. If we make material changes, we will provide notice by
              reasonable means, such as in-app notice, email, or another prominent communication, before the
              changes take effect when required by law.
            </p>
            <p>
              Unless otherwise required by law, your continued use of the Services after the effective date of
              revised Terms constitutes acceptance of the revised Terms. If you do not agree to the revised Terms,
              you must stop using the Services and cancel any subscription before the revised Terms become
              effective.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "part-b",
    label: "Part B",
    title: "Privacy & Data Protection",
    sections: [
      {
        number: "20",
        title: "Scope of the Privacy Notice",
        content: () => (
          <p>
            This Part B describes how ReceiptOne collects, uses, discloses, stores, and protects personal
            information in connection with the Services. It is intended to support disclosure expectations for
            users in the United States and Canada and should be supplemented if product features, integrations, or
            target geographies materially change.
          </p>
        ),
      },
      {
        number: "21",
        title: "Categories of Information We Collect",
        content: () => (
          <>
            <p>
              <strong>Identifiers and profile information:</strong> such as name, email address, account ID,
              country, province/state, and account preferences.
            </p>
            <p>
              <strong>Financial and records information:</strong> such as receipt images, OCR text outputs,
              merchant information, dates, expense categories, mileage records, reports, uploaded files, and
              related user-entered notes or metadata.
            </p>
            <p>
              <strong>Technical and device information:</strong> such as IP address, device identifiers, app
              identifiers, browser type, operating system, crash logs, diagnostics, telemetry, authentication
              events, and usage logs.
            </p>
            <p>
              <strong>Subscription and transaction metadata:</strong> such as plan type, storefront status,
              renewal state, purchase tokens or transaction references, and related billing events from Apple or
              Google.
            </p>
            <p>
              <strong>Support and communications data:</strong> such as messages you send to support, feedback,
              survey responses, and troubleshooting information.
            </p>
          </>
        ),
      },
      {
        number: "22",
        title: "Sources of Information",
        content: () => (
          <p>
            We collect information directly from you, automatically from your use of the Services and your device,
            from app marketplace providers in connection with subscription status, and from service providers or
            integrations you use through the Services.
          </p>
        ),
      },
      {
        number: "23",
        title: "Purposes for Which We Process Information",
        content: () => (
          <>
            <p>
              We process personal information to provide, operate, authenticate, secure, maintain, support,
              troubleshoot, and improve the Services; perform OCR and AI-assisted categorization; generate reports
              requested by users; administer subscriptions and account status; detect fraud and abuse; communicate
              with users; comply with law; enforce our Terms; and establish, exercise, or defend legal claims.
            </p>
            <p>
              Where required by law, we will seek consent for particular processing activities or provide
              additional notices and choices.
            </p>
          </>
        ),
      },
      {
        number: "24",
        title: "Disclosure of Personal Information",
        content: () => (
          <>
            <p>
              We may disclose personal information to service providers and processors that perform services on
              our behalf, such as hosting, authentication, storage, OCR, AI processing, diagnostics, customer
              support, analytics, communications, and security monitoring.
            </p>
            <p>
              We may also disclose information: (a) if required by law, subpoena, court order, or lawful request;
              (b) in connection with a merger, acquisition, financing, reorganization, sale of assets, bankruptcy,
              or similar transaction; (c) to protect rights, property, safety, or security; or (d) with your
              direction or consent.
            </p>
            <p>
              ReceiptOne does not sell personal information for money. ReceiptOne also does not share personal
              information for cross-context behavioral advertising based on the current product scope unless and
              until we provide a specific notice and any legally required opt-out mechanism.
            </p>
          </>
        ),
      },
      {
        number: "25",
        title: "Third-Party Processors and Subprocessors",
        content: () => (
          <>
            <p>
              As of the effective date of these Terms, ReceiptOne may use the following categories of
              subprocessors: authentication and backend providers (such as Firebase/Google Cloud), OCR and
              machine-learning providers (such as Google Cloud Vision and Vertex AI), AI-assisted classification
              providers (such as OpenAI), and logo or content display utilities (such as Logo.dev), together with
              infrastructure, logging, monitoring, and communication vendors reasonably necessary to operate the
              Services.
            </p>
            <p>
              Personal information processed by such providers may include receipt images, OCR text, merchant
              names, amounts, dates, usage logs, identifiers, and subscription metadata, depending on the specific
              function being performed.
            </p>
            <p>
              We require service providers acting on our behalf to process information under contractual or
              platform controls appropriate to their role.
            </p>
          </>
        ),
      },
      {
        number: "26",
        title: "International and Cross-Border Processing",
        content: () => (
          <>
            <p>
              Your personal information may be stored or processed in the United States and, depending on service
              configuration, may also be processed in Canada or other jurisdictions where our service providers or
              their infrastructure operate. Those jurisdictions may have different privacy laws than the place
              where you reside.
            </p>
            <p>
              By using the Services, you understand that your information may be transferred to and processed in
              countries outside your home jurisdiction, subject to applicable legal safeguards and the contractual
              arrangements we use with service providers where required.
            </p>
          </>
        ),
      },
      {
        number: "27",
        title: "Retention of Personal Information",
        content: () => (
          <>
            <p>
              We retain personal information for as long as reasonably necessary for the purposes described in
              these Terms, including to maintain your account, provide the Services, meet legal and tax retention
              obligations, resolve disputes, enforce agreements, and support legitimate business records
              management.
            </p>
            <p>
              Where operationally feasible, account deletion requests will trigger deletion or anonymization of
              personal information within a commercially reasonable period. Some information may be retained
              longer in backups, logs, legal holds, fraud-prevention records, tax records, or where required or
              permitted by law.
            </p>
          </>
        ),
      },
      {
        number: "28",
        title: "Privacy Rights and Choices",
        content: () => (
          <>
            <p>
              Depending on your jurisdiction, you may have rights to request access to, correction of, deletion
              of, or information about the personal information we hold about you, and to withdraw consent where
              consent is the legal basis for processing, subject to legal and contractual limitations.
            </p>
            <p>
              Users in certain United States jurisdictions may have additional rights concerning categories of
              information, categories of recipients, and non-discrimination for exercising privacy rights.
              California residents may also have rights regarding sharing or sale if those concepts become
              applicable to ReceiptOne in the future.
            </p>
            <p>
              To exercise privacy rights, contact{" "}
              <a className="font-medium text-foreground underline underline-offset-4" href="mailto:privacy@receipt-one.com">
                privacy@receipt-one.com
              </a>{" "}
              or use any in-app privacy request mechanism we make available. We may need to verify your identity
              before fulfilling a request. Authorized agents may be required to provide proof of authority where
              applicable.
            </p>
          </>
        ),
      },
      {
        number: "29",
        title: "Security",
        content: () => (
          <p>
            ReceiptOne uses reasonable administrative, technical, and organizational safeguards designed to
            protect personal information, including encryption in transit, access controls, logging, and role-based
            restrictions. No method of transmission or storage is completely secure, and we cannot guarantee
            absolute security.
          </p>
        ),
      },
      {
        number: "30",
        title: "Incident and Breach Notifications",
        content: () => (
          <p>
            If ReceiptOne confirms a security incident involving personal information for which notice is required
            by applicable law, we will provide notice to affected individuals and regulators as required by
            applicable law and within the timeframes that law requires. Any specific notice period stated in a
            policy or support communication is subject to the facts of the incident, required investigation time,
            and legal obligations.
          </p>
        ),
      },
      {
        number: "31",
        title: "Children's Privacy",
        content: () => (
          <p>
            The Services are not intended for individuals under 18 years of age, and we do not knowingly collect
            personal information from children. If we learn that a child has provided personal information in
            violation of these Terms, we will take commercially reasonable steps to delete it.
          </p>
        ),
      },
      {
        number: "32",
        title: "Changes to Privacy Disclosures",
        content: () => (
          <p>
            We may update the privacy disclosures in these Terms from time to time to reflect changes in the
            Services, legal obligations, or our processing practices. Material changes will be communicated as
            required by law.
          </p>
        ),
      },
    ],
  },
  {
    id: "part-c",
    label: "Part C",
    title: "Final Provisions",
    sections: [
      {
        number: "33",
        title: "Entire Agreement; Severability; No Waiver",
        content: () => (
          <>
            <p>
              These Terms constitute the entire agreement between you and ReceiptOne regarding the Services and
              supersede prior or contemporaneous understandings on the same subject matter, except for any
              additional terms expressly incorporated by reference or presented for a specific feature.
            </p>
            <p>
              If any provision of these Terms is found unenforceable, that provision will be enforced to the
              maximum extent permissible and the remaining provisions will remain in full force and effect.
            </p>
            <p>Failure to enforce any provision is not a waiver of future enforcement.</p>
          </>
        ),
      },
      {
        number: "34",
        title: "Contact Information",
        content: (region) => (
          <>
            <BulletList
              items={[
                "General support: support@receipt-one.com.",
                "Privacy requests: privacy@receipt-one.com.",
                "Legal notices: legal@receipt-one.com.",
              ]}
            />
            {(region === "all" || region === "us") && (
              <p>
                Arbitration opt-out (U.S. only): support@receipt-one.com, subject line: &quot;Arbitration
                Opt-Out&quot;.
              </p>
            )}
            <BulletList items={["Mailing address: [INSERT FULL LEGAL NOTICE ADDRESS BEFORE PUBLIC RELEASE]."]} />
          </>
        ),
      },
      {
        title: "Execution Note",
        content: () => (
          <p>
            Before publishing this document in the mobile app, web app, Apple App Store, or Google Play listing,
            replace all bracketed placeholders with final company details, confirm that the listed processors and
            data flows match the deployed architecture, and separately prepare any program-specific terms for
            referrals, promotions, or team/business plans if those features are enabled.
          </p>
        ),
      },
      {
        title: "Appendix — Practical Drafting Notes for Internal Use",
        content: () => (
          <>
            <p>
              This appendix is optional and should be removed before public release if you want a cleaner
              customer-facing version. It is included here because the request was to produce a stronger final
              draft based on legal review findings.
            </p>
            <BulletList
              items={[
                "Confirm the exact legal entity name and address before release.",
                "Decide whether data may be processed outside the United States and Canada, and update Section 26 to match the real deployment.",
                "If referral rewards launch, publish a separate Referral Terms page and cross-reference it from Section 11.",
                "If team, accountant, admin, or support masked-access roles launch, add a separate Business/Team Terms addendum.",
                "If you later enable analytics advertising cookies, add cookie/SDK disclosures and any required opt-out mechanisms.",
              ]}
            />
          </>
        ),
      },
    ],
  },
];

/* --------------------------------- Page --------------------------------- */

function TermsPage() {
  const allPartIds = useMemo(() => PARTS.map((p) => p.id), []);
  const {
    region,
    setRegion,
    openParts,
    openSections,
    setOpenParts,
    setOpenSections,
    toggleSection,
    togglePart,
  } = useLegalUIState("legal:terms", allPartIds);
  const [tocOpen, setTocOpen] = useState(false);
  const printRestoreRef = useRef<{ parts: Set<string>; sections: Set<string> } | null>(null);

  const allSectionIds = useMemo(
    () => PARTS.flatMap((p) => p.sections.map((s) => sectionId(s))),
    [],
  );

  const expandAll = () => {
    setOpenSections(new Set(allSectionIds));
    setOpenParts(new Set(PARTS.map((p) => p.id)));
  };
  const collapseAll = () => {
    setOpenSections(new Set());
  };

  const handleBeforePrint = () => {
    printRestoreRef.current = {
      parts: new Set(openParts),
      sections: new Set(openSections),
    };
    // Open every applicable section/part for the active region.
    setOpenParts(new Set(PARTS.map((p) => p.id)));
    setOpenSections(
      new Set(
        PARTS.flatMap((p) =>
          p.sections.filter((s) => isApplicable(s, region)).map((s) => sectionId(s)),
        ),
      ),
    );
  };
  const handleAfterPrint = () => {
    const snap = printRestoreRef.current;
    if (snap) {
      setOpenParts(snap.parts);
      setOpenSections(snap.sections);
      printRestoreRef.current = null;
    }
  };

  const scrollToId = (id: string) => {
    // Open the section + its part before scrolling.
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const part = PARTS.find((p) => p.sections.some((s) => sectionId(s) === id));
    if (part) {
      setOpenParts((prev) => {
        const next = new Set(prev);
        next.add(part.id);
        return next;
      });
    }
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
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/ca" className="flex items-center gap-2">
              <img src={logoMark} alt="" aria-hidden className="block size-10" />
              <img src={logoWordmark} alt="ReceiptOne" className="block h-6 w-auto" />
            </Link>
            <p className="hidden text-sm text-muted-foreground sm:block">Terms of Use</p>
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
          <p className="text-sm font-medium text-muted-foreground">
            Last updated: April 23, 2026 · Effective date: April 23, 2026
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-normal sm:text-5xl">
            ReceiptOne — Terms of Use
          </h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              These Legal Terms (&quot;Terms&quot;) form a legally binding agreement between you and ReceiptOne
              governing your access to and use of the ReceiptOne mobile application, web application, and related
              services. These Terms are intended for a United States and Canada launch and are drafted to reduce
              product, privacy, and consumer-law risk for the current scope of the Services. Company-identifying
              details marked for completion must be finalized before public release.
            </p>
          </div>

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
              <TableOfContents region={region} onJump={scrollToId} />
            </div>
          </aside>

          <div className="space-y-6">
            {PARTS.map((part) => (
              <PartBlock
                key={part.id}
                part={part}
                region={region}
                isOpen={openParts.has(part.id)}
                onToggle={() => togglePart(part.id)}
                openSections={openSections}
                onToggleSection={toggleSection}
              />
            ))}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
              <LegalSummary
                subtitle="Terms of Use"
                items={TERMS_SUMMARY}
                region={region}
              />
            </div>
          </aside>
        </div>
      </article>

      {/* Mobile TOC drawer */}
      {tocOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
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
            <TableOfContents region={region} onJump={scrollToId} />
          </div>
        </div>
      )}
    </main>
  );
}

/* --------------------------- Table of contents --------------------------- */

function TableOfContents({ region, onJump }: { region: Region; onJump: (id: string) => void }) {
  return (
    <nav aria-label="Table of contents" className="space-y-5 text-sm">
      {PARTS.map((part) => {
        const visible = part.sections.filter((s) => isApplicable(s, region));
        return (
          <div key={part.id}>
            <div className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => onJump(part.id)}
                className="flex-1 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                {part.label} — {part.title}
              </button>
              <AnchorButton hash={part.id} region={region} label={`Copy link to ${part.label}`} />
            </div>
            <ul className="mt-2 space-y-1 border-l border-border pl-3">
              {visible.map((s) => {
                const id = sectionId(s);
                return (
                  <li key={id}>
                    <div className="group flex items-start gap-1">
                      <button
                        type="button"
                        onClick={() => onJump(id)}
                        className="flex-1 text-left leading-snug text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {s.number ? <span className="mr-1 text-foreground/70">{s.number}.</span> : null}
                        {s.title}
                      </button>
                      <AnchorButton hash={id} region={region} label={`Copy link to section ${s.number ?? s.title}`} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------- Part block ------------------------------ */

function PartBlock({
  part,
  region,
  isOpen,
  onToggle,
  openSections,
  onToggleSection,
}: {
  part: PartEntry;
  region: Region;
  isOpen: boolean;
  onToggle: () => void;
  openSections: Set<string>;
  onToggleSection: (id: string) => void;
}) {
  const visible = part.sections.filter((s) => isApplicable(s, region));
  const headingRef = useRef<HTMLDivElement>(null);

  return (
    <section id={part.id} className="rounded-2xl border border-border bg-card/50 scroll-mt-24">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 rounded-2xl bg-muted/30 px-5 py-4 text-left transition-colors hover:bg-muted/50"
      >
        <div ref={headingRef}>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{part.label}</p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-normal sm:text-2xl">{part.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {visible.length} section{visible.length === 1 ? "" : "s"}
          </p>
        </div>
        <ChevronDown
          className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className="space-y-3 px-3 pb-5 pt-3 sm:px-5">
          {visible.map((s) => {
            const id = sectionId(s);
            return (
              <SectionAccordion
                key={id}
                id={id}
                section={s}
                region={region}
                isOpen={openSections.has(id)}
                onToggle={() => onToggleSection(id)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

/* --------------------------- Section accordion --------------------------- */

function SectionAccordion({
  id,
  section,
  region,
  isOpen,
  onToggle,
}: {
  id: string;
  section: SectionEntry;
  region: Region;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const onlyUS = section.regions?.length === 1 && section.regions[0] === "us";
  const onlyCA = section.regions?.length === 1 && section.regions[0] === "ca";

  return (
    <div id={id} className="group/section overflow-hidden rounded-xl border border-border bg-background scroll-mt-24">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40 sm:px-5 sm:py-4"
      >
        <div className="flex flex-1 items-baseline gap-3">
          {section.number && (
            <span className="font-mono text-xs font-semibold text-muted-foreground sm:text-sm">
              {section.number.padStart(2, "0")}
            </span>
          )}
          <h3 className="font-display text-base font-semibold tracking-normal sm:text-lg">{section.title}</h3>
          {onlyUS && <RegionTag tone="us">US</RegionTag>}
          {onlyCA && <RegionTag tone="ca">CA</RegionTag>}
        </div>
        <div className="flex items-center gap-1">
          <span className="group">
            <AnchorButton
              hash={id}
              region={region}
              label={`Copy link to ${section.title}`}
              className="opacity-0 group-hover/section:opacity-100"
            />
          </span>
          <ChevronDown
            className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </div>
      </button>
      {isOpen && (
        <div
          id={`${id}-panel`}
          className="space-y-4 border-t border-border bg-background px-4 py-4 text-base leading-7 text-muted-foreground sm:px-5 sm:py-5"
        >
          {section.content(region)}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Helpers --------------------------------- */

function RegionInline({
  region,
  us,
  ca,
  both,
}: {
  region: Region;
  us: string;
  ca: string;
  both: string;
}) {
  if (region === "us") return <>{us}</>;
  if (region === "ca") return <>{ca}</>;
  return <>{both}</>;
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