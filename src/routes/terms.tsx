import { Link, createFileRoute } from "@tanstack/react-router";
import { PolicySection, BulletList } from "@/components/site/PolicyHelpers";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "ReceiptOne Terms of Service" },
      {
        name: "description",
        content:
          "Read the ReceiptOne Terms of Service covering your rights and obligations when using our receipt, expense, and mileage tracking platform.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/ca" className="flex items-center gap-2">
              <img src={logoMark} alt="" aria-hidden className="block size-10" />
              <img src={logoWordmark} alt="ReceiptOne" className="block h-6 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">Terms of Service</p>
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
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-normal sm:text-5xl">Terms of Service</h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              These Terms of Service ("Terms") govern your access to and use of the ReceiptOne mobile applications (iOS and Android), the ReceiptOne web application, and related services (collectively, the "Services") provided by ReceiptOne ("we," "us," or "our").
            </p>
            <p>
              By creating an account or using the Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.
            </p>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Questions about these Terms:{" "}
            <a className="font-medium text-foreground underline underline-offset-4" href="mailto:support@receipt-one.com">
              support@receipt-one.com
            </a>
          </p>
        </header>

        <div className="space-y-0 py-10">
          <PolicySection number="1" title="Eligibility">
            <p>
              You must be at least 18 years old (or the age of majority in your jurisdiction) to use the Services. By using the Services, you represent that you meet this requirement and that any information you provide is accurate.
            </p>
            <p>
              The Services are intended for individuals, self-employed persons, contractors, and small businesses seeking to track expenses, receipts, and mileage for personal or business purposes.
            </p>
          </PolicySection>

          <PolicySection number="2" title="Account Registration">
            <p>You must create an account to access most features of the Services. You agree to:</p>
            <BulletList items={[
              "Provide accurate, complete, and current registration information",
              "Maintain the security of your account credentials",
              "Notify us immediately at support@receipt-one.com of any unauthorized access to your account",
              "Accept responsibility for all activity that occurs under your account",
            ]} />
            <p>We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe are being used fraudulently or abusively.</p>
          </PolicySection>

          <PolicySection number="3" title="Subscriptions and Billing">
            <p>
              Certain features of the Services require a paid subscription. Subscriptions are offered on a monthly or annual basis and are processed through third-party platforms (Apple App Store or Google Play Store) or directly through our web platform.
            </p>
            <BulletList items={[
              "Subscriptions automatically renew unless cancelled before the renewal date",
              "You may cancel at any time through your device's subscription management settings or through your account settings",
              "Refunds are subject to the refund policy of the applicable platform (Apple, Google) or our own refund policy for web purchases",
              "We may change subscription pricing with reasonable advance notice",
            ]} />
            <p>
              Free trials, where offered, convert to paid subscriptions at the end of the trial period unless cancelled. We will provide notice before any trial period ends.
            </p>
          </PolicySection>

          <PolicySection number="4" title="Acceptable Use">
            <p>You agree to use the Services only for lawful purposes and in accordance with these Terms. You must not:</p>
            <BulletList items={[
              "Use the Services to upload, store, or process content that is illegal, fraudulent, or violates any third party's rights",
              "Attempt to gain unauthorized access to any part of the Services or related systems",
              "Use automated tools (bots, scrapers, crawlers) to access the Services without our written consent",
              "Interfere with or disrupt the integrity or performance of the Services",
              "Reverse engineer, decompile, or disassemble any part of the Services",
              "Resell or sublicense access to the Services without written authorization",
            ]} />
          </PolicySection>

          <PolicySection number="5" title="Your Content">
            <p>
              You retain ownership of all receipts, documents, expense data, and other content you upload or create within the Services ("Your Content"). By using the Services, you grant us a limited, non-exclusive, royalty-free licence to store, process, and display Your Content solely to provide and improve the Services.
            </p>
            <p>
              You are solely responsible for the accuracy, legality, and completeness of Your Content. We do not verify the accuracy of extracted data or AI-generated categorizations — you should review all outputs before relying on them for tax or financial purposes.
            </p>
            <p>
              <strong>Important:</strong> ReceiptOne provides organizational and informational tools only. We do not provide legal, accounting, tax, or financial advice.
            </p>
          </PolicySection>

          <PolicySection number="6" title="Intellectual Property">
            <p>
              The Services, including all software, designs, text, graphics, logos, and other content created by us, are owned by ReceiptOne and protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              These Terms do not grant you any rights to use our trademarks, logos, or brand elements without our prior written consent.
            </p>
          </PolicySection>

          <PolicySection number="7" title="Disclaimers">
            <p>
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that the Services will be uninterrupted, error-free, or free of viruses or other harmful components. OCR and AI-assisted outputs are provided for informational purposes only and may not be accurate.
            </p>
          </PolicySection>

          <PolicySection number="8" title="Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RECEIPTONE AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, REVENUE, OR PROFITS, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.
            </p>
            <p>
              IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNTS PAID BY YOU TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </PolicySection>

          <PolicySection number="9" title="Termination">
            <p>
              You may stop using the Services and close your account at any time through your account settings or by contacting support@receipt-one.com.
            </p>
            <p>
              We may suspend or terminate your access to the Services at any time with or without notice if we determine that you have violated these Terms, engaged in fraudulent or abusive behaviour, or for any other reason at our sole discretion.
            </p>
            <p>
              Upon termination, your right to use the Services immediately ceases. Sections 5–8 and 10–12 survive termination.
            </p>
          </PolicySection>

          <PolicySection number="10" title="Privacy">
            <p>
              Your use of the Services is also governed by our{" "}
              <Link to="/privacy" className="font-medium text-foreground underline underline-offset-4">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
          </PolicySection>

          <PolicySection number="11" title="Governing Law and Dispute Resolution">
            <p>
              These Terms are governed by the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions. If you are located in the United States, you agree that any dispute shall be resolved under applicable federal and state laws of the jurisdiction in which you reside.
            </p>
            <p>
              Before initiating any formal dispute, you agree to contact us at support@receipt-one.com to attempt to resolve the matter informally. If we cannot resolve the dispute within 30 days, either party may pursue available legal remedies.
            </p>
          </PolicySection>

          <PolicySection number="12" title="Changes to These Terms">
            <p>
              We may update these Terms from time to time. We will revise the "Last updated" date and, for material changes, provide additional notice through the Services or by email. Continued use of the Services after changes become effective constitutes your acceptance of the updated Terms.
            </p>
          </PolicySection>

          <PolicySection number="13" title="Contact">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Email</p>
              <a className="mt-1 block font-medium text-foreground underline underline-offset-4" href="mailto:support@receipt-one.com">
                support@receipt-one.com
              </a>
              <p className="mt-4 text-sm text-muted-foreground">Subject line for Terms questions</p>
              <p className="mt-1 font-medium">Terms of Service</p>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 ReceiptOne. All rights reserved.</p>
          </PolicySection>
        </div>
      </article>
    </main>
  );
}

