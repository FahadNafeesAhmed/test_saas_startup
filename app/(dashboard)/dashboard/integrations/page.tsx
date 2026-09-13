"use client";

import { useState } from 'react';

export default function IntegrationsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const integrations = [
    { name: 'Stripe', status: 'Active', capabilities: 'Real-time payment sync, automatic invoice matching, refund tracking, dispute alerts. Syncs every 15 minutes. Supports Stripe Connect for marketplace payouts.' },
    { name: 'PayPal', status: 'Active', capabilities: 'Transaction import, multi-currency conversion at mid-market rate, mass payout reconciliation. Syncs every 30 minutes. Supports PayPal Business and PayPal Commerce Platform.' },
    { name: 'Square', status: 'Active', capabilities: 'POS transaction sync, inventory cost tracking, tip and tax breakdowns. Syncs hourly. Supports Square Online, Square Terminal, and Square Invoices.' },
    { name: 'Shopify', status: 'Active', capabilities: 'Order-level revenue recognition, shipping cost allocation, gift card liability tracking. Syncs every 2 hours. Supports Shopify Plus multi-store consolidation.' },
    { name: 'Slack', status: 'Active', capabilities: 'Real-time notifications for transactions over configurable thresholds, daily cash position summaries, approval request routing. Supports Slack Connect for external accountant channels.' },
    { name: 'Mailchimp', status: 'Active', capabilities: 'Campaign cost tracking, subscriber LTV calculations, marketing spend attribution by channel. Syncs daily. Maps campaign costs to GL marketing expense accounts automatically.' },
    { name: 'QuickBooks sync', badge: 'Beta', capabilities: 'Bi-directional sync of chart of accounts, journal entries, and vendor bills. Conflict resolution favors Helix Ledger as source of truth. Currently supports QuickBooks Online only; Desktop support planned for Q1.' },
    { name: 'Xero', badge: 'Coming soon', capabilities: 'Planned support for bank feed sync, invoice mirroring, and contact list merge. Expected to support Xero Projects and Xero Expenses add-ons at launch.' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Integrations</h2>
      <div className="space-y-2">
        {integrations.map((integration, idx) => (
          <div key={idx} className="border rounded bg-white">
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <span className="font-medium">{integration.name}</span>
              <div className="flex items-center gap-2">
                {integration.badge ? (
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                    {integration.badge}
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                    {integration.status}
                  </span>
                )}
                <span className="text-gray-400 text-sm">{expanded === idx ? '▲' : '▼'}</span>
              </div>
            </button>
            {expanded === idx && (
              <div className="px-4 pb-4 border-t">
                <p className="text-sm text-gray-600 mt-3">{integration.capabilities}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
