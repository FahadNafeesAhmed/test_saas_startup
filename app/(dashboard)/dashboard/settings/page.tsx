"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [autoRecon, setAutoRecon] = useState(true);
  const [webhooks, setWebhooks] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      <div className="bg-white p-6 border rounded mb-6 max-w-xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Data region</label>
          <select className="border rounded p-2 w-full" defaultValue="EU (Frankfurt)">
            <option value="US (N. Virginia)">US (N. Virginia)</option>
            <option value="EU (Frankfurt)">EU (Frankfurt)</option>
            <option value="AP (Tokyo)">AP (Tokyo)</option>
          </select>
        </div>

        <div className="mb-4 pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-1">Single Sign-On (SSO)</label>
          <p className="text-sm text-orange-600">SSO available on Business plan only.</p>
          <Button variant="outline" className="mt-2" disabled>Configure SSO</Button>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Feature toggles</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto-reconciliation</span>
                <button
                  className={`w-11 h-6 rounded-full relative transition-colors ${autoRecon ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={() => setAutoRecon(!autoRecon)}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${autoRecon ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              {autoRecon && (
                <p className="text-xs text-gray-500 mt-1">
                  Transactions are matched automatically every 15 minutes using smart rules. Supports fuzzy date matching (±3 days), partial amount matching, and memo keyword extraction. Unmatched items appear in the review queue.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Webhook notifications</span>
                <button
                  className={`w-11 h-6 rounded-full relative transition-colors ${webhooks ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={() => setWebhooks(!webhooks)}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${webhooks ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              {webhooks && (
                <p className="text-xs text-gray-500 mt-1">
                  Sends HTTPS POST events to your endpoint for transaction.created, transaction.matched, reconciliation.completed, and report.generated events. Payloads are signed with HMAC-SHA256. Retry policy: 3 attempts with exponential backoff (10s, 60s, 300s).
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
