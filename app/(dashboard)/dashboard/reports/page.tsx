"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ReportsPage() {
  const [reportType, setReportType] = useState("");

  const reportDetails: Record<string, { description: string; fields: string }> = {
    "profit-loss": {
      description: "Generates a full Profit & Loss statement with revenue, COGS, operating expenses, and net income. Supports departmental breakdowns and comparison to prior period or budget.",
      fields: "Revenue by category, Cost of goods sold, Gross margin, Operating expenses (payroll, rent, SaaS, travel), EBITDA, Net income, YoY change %"
    },
    "balance-sheet": {
      description: "Point-in-time snapshot of assets, liabilities, and equity. Supports multi-entity consolidation with intercompany elimination entries.",
      fields: "Current assets (cash, AR, inventory), Fixed assets with depreciation, Current liabilities (AP, accrued expenses), Long-term liabilities, Retained earnings, Shareholder equity"
    },
    "cash-flow": {
      description: "Cash flow statement using the indirect method. Automatically categorizes transactions into operating, investing, and financing activities.",
      fields: "Net income adjustments, Changes in working capital, Capital expenditures, Debt proceeds/repayments, Free cash flow, Beginning and ending cash balances"
    },
    "ar-aging": {
      description: "Accounts receivable aging report bucketed by days outstanding. Highlights at-risk accounts and calculates expected collection rates based on historical patterns.",
      fields: "Customer name, Invoice number, Original amount, Amount outstanding, Days outstanding (Current, 1-30, 31-60, 61-90, 90+), Expected collection probability"
    },
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports</h2>
      <div className="bg-white p-6 border rounded mb-6">
        <h3 className="font-medium mb-4">Generate New Report</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Report type</label>
          <select
            className="border rounded p-2 w-full max-w-xs"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="">Select a report type...</option>
            <option value="profit-loss">Profit & Loss</option>
            <option value="balance-sheet">Balance Sheet</option>
            <option value="cash-flow">Cash Flow Statement</option>
            <option value="ar-aging">AR Aging</option>
          </select>
        </div>
        {reportType && reportDetails[reportType] && (
          <div className="mb-4 p-4 bg-gray-50 rounded border text-sm">
            <p className="text-gray-700 mb-2">{reportDetails[reportType].description}</p>
            <p className="text-gray-500"><span className="font-medium text-gray-700">Included fields:</span> {reportDetails[reportType].fields}</p>
          </div>
        )}
        <Button>Generate</Button>
      </div>

      <div className="bg-white p-6 border rounded">
        <h3 className="font-medium mb-4">Recent Reports</h3>
        <ul className="list-disc pl-5">
          <li>
            <Link href="https://www.sec.gov/Archives/edgar/data/1652044/000130817926000344/goog014907-ars.pdf" className="text-blue-600 hover:underline" target="_blank">
              Q3 Financial Summary
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
