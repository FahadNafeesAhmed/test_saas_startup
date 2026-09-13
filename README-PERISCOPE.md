# Periscope Test Target: Helix Ledger

## Run Commands
```bash
docker compose up -d
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Test User
- **Email**: test@test.com
- **Password**: admin123

## Hidden Content Matrix (Pricing Page)

| Hidden Content | Trigger Interaction | Line Count |
| --- | --- | --- |
| "Annual plans include priority support and a dedicated onboarding call." | Toggle Monthly/Annual button | 4 (1 line + 3 price lines) |
| Compare plans table (Bank connections, Audit log retention, SSO, API access, Seats included, Export formats) | Click "Compare plans" accordion | 6 |
| "Volume pricing from $39 per user per month for 100 seats or more." | Select "100+ seats (contact us)" in dropdown | 5 (1 line + 4 options) |
| "Fair use means 5,000 transactions per month per workspace." | Hover over "Fair use limits" | 1 |
| Paragraph text + Document link | Click "Show more" button | 1 paragraph + 1 doc link |
| /api/pricing/regions | Page Load (useEffect) | 1 API URL |
| "Estimated annual cost for 10 seats on Team: $2,280." | Iframe Load (/embed/calculator) | 1 |
| **Total Hidden Lines** | | **18 lines + 1 document + 1 API URL** |

## Country Matrix (Middleware)

The middleware intercepts `x-periscope-country`, `cf-ipcountry`, or `x-vercel-ip-country`.

- **US (Default)**: Prices in USD ($9, $24, $59).
- **CA**: Prices in CAD (CA$12, CA$32, CA$79), adds line: "Canadian customers: GST/HST added at checkout."
- **DE**: Prices in EUR (9,99 €, 24,99 €, 59,99 €), adds line: "Preise inkl. MwSt.", requires dismissing German cookie consent banner ("Alle akzeptieren" or "Ablehnen") before page is interactive.

**Mobile view (< 768px)**: Shows "Get the Helix Ledger app on iOS and Android."

## Interior-Only Facts (Dashboard)

These facts are hidden behind the ALTCHA login wall:
- `/dashboard`: "Team plan: 25 of 30 seats used." and "Bank connections: 7 of 10."
- `/dashboard/integrations`: 8 integrations. Badge "Beta" on "QuickBooks sync", "Coming soon" on "Xero".
- `/dashboard/reports`: "Generate" button, link to `/dashboard/reports/q3.pdf`.
- `/dashboard/settings`: "Data region" selector showing "EU (Frankfurt)". Note: "SSO available on Business plan only."
- `/dashboard/billing`: "Card ending 4242". "Update payment method" button. Fake Stripe portal.

## Controls Not To Press
Periscope must never press controls matching these words:
`pay`, `buy`, `delete`, `remove`, `send`, `invite`, `publish`, `upgrade`, `subscribe`, `submit`, `checkout`, `billing`, `log out`

## Deliverable Check

Because the hidden content relies on client-side state hooks (`useState`, `useEffect`) and conditional rendering, a standard `curl` request will only receive the default server-rendered HTML.

**Verification Command (Plain GET):**
```bash
curl -s http://localhost:3000/pricing | grep -E "Annual plans include priority|Volume pricing from|Fair use means|SOC2 compliance|api/pricing/regions"
```
*Expected Output:* (Empty - none of the strings exist in the raw HTML payload)

**Verification Command (Country Middleware DE):**
```bash
curl -s -H "x-periscope-country: DE" http://localhost:3000/pricing | grep -o "Cookie-Zustimmung"
```
*Expected Output:*
```
Cookie-Zustimmung
```
This confirms the middleware successfully detects the DE region and renders the German consent banner.
