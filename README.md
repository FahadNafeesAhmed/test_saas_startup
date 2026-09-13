# Helix Ledger (Periscope Test Target)

This repository contains the **Helix Ledger** web application, originally built on top of the [Next.js SaaS Starter](https://github.com/nextjs/saas-starter). 

It has been meticulously modified to serve as a **Controlled Test Target** for the [Periscope](https://github.com/periscope) competitive intelligence parser during the hackathon.

## What is Periscope?
Periscope is a competitive-intelligence "super parser" built on Steel.dev cloud browsers. It reads what a website hides by clicking tabs, toggling accordions, hovering tooltips, and rendering conditional text that a plain fetch tool (HTTP GET) would miss.

## About Helix Ledger
Helix Ledger is a fictional SaaS bookkeeping tool for small teams. It includes various pages specifically designed with hidden content to evaluate and verify Periscope's parsing accuracy across three main demonstration beats:
1. **Side-by-side (Pricing page):** Hidden texts behind UI toggles, dropdowns, and modals to test DOM-interaction visibility.
2. **Borders (Country middleware):** Dynamic pricing and cookie-consent barriers simulating geographic blockades for CA and DE requests.
3. **Past the login (Dashboard):** An ALTCHA-protected login wall ensuring only an authenticated human-to-bot handoff can reach the interior dashboard pages, which are planted with specific target facts.

## Getting Started Locally

### Prerequisites
- Docker (for PostgreSQL database)
- Node.js & pnpm

### Setup Instructions
1. Start the PostgreSQL database:
   ```bash
   docker compose up -d
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run database migrations:
   ```bash
   pnpm db:migrate
   ```
4. Seed the database (creates the default user):
   ```bash
   pnpm db:seed
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

### Test User Credentials
To access the interior dashboard facts, use the following seeded credentials:
- **Email:** `test@test.com`
- **Password:** `admin123`

## Periscope Target Facts Matrix

### Pricing Page (`/pricing`) Hidden Content (18 lines)
| Hidden Content | Trigger Interaction | Line Count |
| --- | --- | --- |
| "Annual plans include priority support and a dedicated onboarding call." | Toggle Monthly/Annual button | 4 (1 line + 3 price lines) |
| Compare plans table (Bank connections, Audit log retention, SSO, API access, Seats included, Export formats) | Click "Compare plans" accordion | 6 |
| "Volume pricing from $39 per user per month for 100 seats or more." | Select "100+ seats (contact us)" in dropdown | 5 (1 line + 4 options) |
| "Fair use means 5,000 transactions per month per workspace." | Hover over "Fair use limits" | 1 |
| Paragraph text + Document link | Click "Show more" button | 1 paragraph + 1 doc link |
| `/api/pricing/regions` | Page Load (`useEffect`) | 1 API URL |
| "Estimated annual cost for 10 seats on Team: $2,280." | Iframe Load (`/embed/calculator`) | 1 |

### Country Middleware Interceptions
- **US (Default)**: Prices in USD ($9, $24, $59).
- **CA**: Prices in CAD (CA$12, CA$32, CA$79) + extra GST/HST line.
- **DE**: Prices in EUR (9,99 €, 24,99 €, 59,99 €) + "Preise inkl. MwSt." line + **Blocking German cookie consent banner**.
- **Mobile view (< 768px)**: "Get the Helix Ledger app on iOS and Android."

### Interior Dashboard Facts (Past the Login)
- `/dashboard`: "Team plan: 25 of 30 seats used." and "Bank connections: 7 of 10."
- `/dashboard/integrations`: 8 integrations. Badge "Beta" on "QuickBooks sync", "Coming soon" on "Xero".
- `/dashboard/reports`: "Generate" button, link to `/dashboard/reports/q3.pdf`.
- `/dashboard/settings`: "Data region" selector showing "EU (Frankfurt)". Note: "SSO available on Business plan only."
- `/dashboard/billing`: "Card ending 4242". "Update payment method" button. Fake Stripe portal.

## Constraints for Periscope Bot
Periscope must **never** press controls matching these words:
`pay`, `buy`, `delete`, `remove`, `send`, `invite`, `publish`, `upgrade`, `subscribe`, `submit`, `checkout`, `billing`, `log out`

---
*Built for the Hackathon. Do not implement production anti-bot protections here (excluding ALTCHA for demo purposes).*
