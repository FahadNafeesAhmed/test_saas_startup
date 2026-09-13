"use client";

import { useState } from 'react';

export default function RegulatoryPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Regulatory & Compliance</h1>
      
      <div className="flex space-x-4 mb-6 border-b">
        <div 
          onClick={() => setActiveTab('Overview')} 
          style={{ cursor: 'pointer' }}
          className={`pb-2 px-1 ${activeTab === 'Overview' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
        >
          Overview
        </div>
        <div 
          onClick={() => setActiveTab('Legal')} 
          style={{ cursor: 'pointer' }}
          className={`pb-2 px-1 ${activeTab === 'Legal' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
        >
          Legal
        </div>
        <div 
          onClick={() => setActiveTab('Data Compliance')} 
          style={{ cursor: 'pointer' }}
          className={`pb-2 px-1 ${activeTab === 'Data Compliance' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
        >
          Data Compliance
        </div>
      </div>

      <div>
        {activeTab === 'Overview' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p>Helix Ledger complies with major international regulatory frameworks.</p>
          </div>
        )}
        
        {activeTab === 'Legal' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Legal Documents</h2>
            <ul className="list-disc pl-5">
              <li><a href="/docs/sla.docx" className="text-blue-600 hover:underline">Service Level Agreement</a></li>
              <li><a href="/docs/terms.docx" className="text-blue-600 hover:underline">Terms of Service</a></li>
            </ul>
          </div>
        )}
        
        {activeTab === 'Data Compliance' && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Data Compliance</h2>
            <p>We are fully compliant with GDPR and CCPA requirements.</p>
          </div>
        )}
      </div>
    </main>
  );
}
