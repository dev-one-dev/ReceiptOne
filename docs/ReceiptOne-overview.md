# ReceiptOne — Product Overview

## What is ReceiptOne?

ReceiptOne is a mobile and web app that helps freelancers, self-employed individuals, and small businesses track expenses, scan receipts, log mileage, and generate tax-ready reports — without spreadsheets.

It is available for Canada and the United States, with region-specific tax handling (GST/HST/PST for Canada, IRS-ready exports for the US).

---

## Who is it for?

- **Freelancers** who need to track client expenses and submit invoices
- **Self-employed individuals** who want to maximize deductions at tax time
- **Small business owners** who need clean records for their accountant
- **Anyone** who gets reimbursed by a client or employer and needs itemized reports

---

## Core Features

### Receipt Scanning
Snap a photo or upload a file. AI automatically extracts the merchant name, date, total amount, and tax breakdown (GST, HST, PST, or sales tax). The receipt is filed and categorized instantly — no manual entry.

### Expense Tracking
All expenses are organized, searchable, and categorizable. Mark individual expenses as reimbursable when a client or employer owes you back, then export them as a dedicated reimbursement report.

### Mileage Tracking
Log trips and set custom mileage rates for accurate deduction claims. No spreadsheets or manual calculations needed.

### Tax-Ready Reports
Export accountant-ready reports as PDF or CSV at any time. Reports include totals, tax breakdowns, and receipt links — ready to hand to an accountant or drop into tax software. ReceiptOne does not file taxes on your behalf; it organizes your data so filing is faster and more accurate.

### Home Office Expenses
Track and organize home office expenses with dedicated categorization, making it easy to calculate deductible portions at tax time.

### Accountant Access
Invite your accountant directly to your ReceiptOne archive. They get read-only access to your organized receipts and reports — no back-and-forth emails of exported files.

### Integrations
- **QuickBooks** sync for bookkeeping workflows
- **Google Drive** for backup and file sharing
- **Email forwarding** — forward receipts directly to your ReceiptOne inbox
- **Bulk upload** for catching up on a backlog of receipts

### Mobile + Web
Real-time sync between the mobile app (iOS and Android) and the web dashboard. Start a report on your phone, review it on desktop.

### Storage
10+ years of receipt storage included. All data is retained long enough to cover standard tax audit windows.

---

## Tax Handling by Region

### Canada (`/ca`)
- Detects and separates **GST/HST** (refundable) from **PST** (non-refundable in most provinces)
- Displays "Estimated Refundable Taxes" as a quick reference — the sum of GST/HST found on receipts
- PST is surfaced separately because it is generally not recoverable for businesses
- Designed with CRA reporting requirements in mind

### United States (`/us`)
- Tracks deductible business expenses in USD
- Exports IRS-compatible expense reports
- Mileage tracking uses IRS standard mileage rates

> **Important:** ReceiptOne is not a tax filing service. It organizes your receipts and expenses so that filing — whether you do it yourself or with an accountant — is faster and more accurate.

---

## Pricing

Three plans are available (weekly, monthly, and yearly billing). A **7-day free trial** is included — no credit card required to start.

Exact plan pricing is managed in the Figma design assets and updated per region. See the live site at `/ca` or `/us` for current pricing.

---

## Key Stats (as of launch)

| Metric | Value |
|---|---|
| Average rating | 4.8 ⭐ |
| Receipts scanned | 100,000+ |
| Miles tracked | 150,000+ |
| Reports generated | 12,000+ |
| Active users | 10,000+ |

---

## Platform

| Platform | Status |
|---|---|
| iOS (iPhone, iPad) | Available — App Store |
| Android | Available — Google Play |
| Web | Available — browser dashboard |

---

## Tech Behind the Product

The marketing site and community feature-voting system are built with TanStack Start (React 19) and Supabase. See [README.md](../README.md) for the full technical stack.

The mobile app itself is a separate codebase (not in this repository).

---

## Roadmap / Community Voting

Users can suggest and vote on features directly from the landing page using the **Suggest a Feature** widget (bottom-right corner). Ideas are normalized by AI (Gemini Flash) and stored with anonymous vote counts so the team can prioritize what to build next.

Current items in the community pipeline include:
- QuickBooks sync
- Better mileage reports
- Bulk receipt categorization

See all open ideas and their status at [github.com/dev-one-dev/figma-craft-39/issues](https://github.com/dev-one-dev/figma-craft-39/issues).
