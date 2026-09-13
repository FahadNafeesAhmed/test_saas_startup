"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Calculator, FileText, PieChart, Shield, Users } from 'lucide-react';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
              <Calculator className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Automated Reconciliation</h3>
              <p className="text-gray-600">Match transactions automatically using our smart rules engine.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
              <BookOpen className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">General Ledger</h3>
              <p className="text-gray-600">Maintain a complete and immutable record of all your financial transactions.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
              <Users className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">Invite your team and accountants with granular role-based access control.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
              <PieChart className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Custom Reporting</h3>
              <p className="text-gray-600">Generate powerful financial reports with just a few clicks.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
              <Shield className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bank-Grade Security</h3>
              <p className="text-gray-600">Your data is encrypted at rest and in transit with SOC2 compliance.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
              <FileText className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Invoicing</h3>
              <p className="text-gray-600">Send professional invoices and track payments effortlessly.</p>
            </div>
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
