"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Calculator, FileText, PieChart, Shield, Users } from 'lucide-react';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [featureModal, setFeatureModal] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: Calculator,
      title: "Automated Reconciliation",
      summary: "Match transactions automatically using our smart rules engine.",
      details: "Our reconciliation engine processes up to 50,000 transactions per minute with 99.7% accuracy. Supports rule-based matching, fuzzy date matching (±3 days), and partial amount matching. Integrates with over 10,000 financial institutions via Plaid and MX. Unmatched items are flagged for manual review with suggested matches ranked by confidence score."
    },
    {
      icon: BookOpen,
      title: "General Ledger",
      summary: "Maintain a complete and immutable record of all your financial transactions.",
      details: "Double-entry bookkeeping with support for up to 10 levels of sub-accounts. Chart of accounts follows GAAP and IFRS standards. All entries are append-only with cryptographic hash chaining for tamper evidence. Supports multi-entity consolidation, intercompany eliminations, and real-time trial balance generation."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      summary: "Invite your team and accountants with granular role-based access control.",
      details: "Five built-in roles: Owner, Admin, Accountant, Bookkeeper, and Viewer. Custom roles can define permissions at the field level — e.g., allow editing invoices but not approving payments. Activity log tracks every action with IP address and device fingerprint. External collaborators (CPAs, auditors) get scoped access with automatic expiration."
    },
    {
      icon: PieChart,
      title: "Custom Reporting",
      summary: "Generate powerful financial reports with just a few clicks.",
      details: "Drag-and-drop report builder with 40+ pre-built templates including P&L, balance sheet, cash flow, AR aging, and budget variance. Reports can be scheduled daily, weekly, or monthly with automatic delivery via email or Slack. Supports drill-down from summary to individual transactions. Export to CSV, XLSX, PDF, and QuickBooks IIF format."
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      summary: "Your data is encrypted at rest and in transit with SOC2 compliance.",
      details: "AES-256 encryption at rest, TLS 1.3 in transit. SOC 2 Type II and ISO 27001 certified. Data is stored in region-specific AWS data centers with daily encrypted backups retained for 90 days. Penetration tested quarterly by NCC Group. Bug bounty program with payouts up to $10,000."
    },
    {
      icon: FileText,
      title: "Invoicing",
      summary: "Send professional invoices and track payments effortlessly.",
      details: "Customizable invoice templates with your logo and brand colors. Supports recurring invoices, automatic payment reminders (3, 7, and 14 days overdue), and partial payments. Clients can pay via ACH, credit card, or wire transfer directly from the invoice link. Late fee calculation is automatic and configurable per client."
    },
  ];

  const faqs = [
    {
      question: "How does Helix Ledger handle multi-currency?",
      answer: "Helix Ledger automatically updates exchange rates daily and reconciles your accounts."
    },
    {
      question: "Can I connect my international bank?",
      answer: "We support over 10,000 global financial institutions through our secure integrations."
    },
    {
      question: "Is there an audit trail?",
      answer: "Every transaction, edit, and user login is immutably logged for compliance purposes."
    },
    {
      question: "Do you offer accounting services?",
      answer: "We provide the software, but you can securely invite your CPA to your workspace at no extra cost."
    }
  ];

  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
            Helix Ledger
            <span className="block text-blue-600 mt-2">Bookkeeping for Small Teams</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
            Take control of your finances with modern tools designed specifically for growing startups and small businesses.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" onClick={() => setShowDemoModal(true)}>
              Watch demo
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <button
                  key={idx}
                  className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setFeatureModal(idx)}
                >
                  <Icon className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.summary}</p>
                  <span className="text-blue-600 text-sm mt-3 font-medium">Learn more &rarr;</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <button
                  className="w-full text-left font-semibold text-lg flex justify-between items-center"
                  onClick={() => toggleFaq(idx)}
                >
                  {faq.question}
                  <span>{openFaq === idx ? '-' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="mt-4 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {featureModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-8 rounded-xl max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setFeatureModal(null)}
            >
              Close
            </button>
            {(() => {
              const feature = features[featureModal];
              const Icon = feature.icon;
              return (
                <>
                  <Icon className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-500 mb-4">{feature.summary}</p>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Capabilities</h4>
                    <p className="text-gray-700 leading-relaxed">{feature.details}</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-8 rounded-xl max-w-md w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setShowDemoModal(false)}
            >
              Close
            </button>
            <h3 className="text-2xl font-bold mb-4">Demo Video</h3>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-6">
              <span className="text-gray-500">Video Player Placeholder</span>
            </div>
            <p className="text-gray-700">Thank you for watching the Helix Ledger demo.</p>
            <p className="text-gray-700 mt-2">Our platform is designed to save you hours of manual data entry every week.</p>
          </div>
        </div>
      )}
    </main>
  );
}
