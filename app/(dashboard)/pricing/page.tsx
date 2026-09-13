"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [seats, setSeats] = useState("1 seat");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [regionData, setRegionData] = useState(null);
  
  // Country specific states
  const [country, setCountry] = useState("US");
  
  useEffect(() => {
    // Read the cookie set by middleware
    const match = document.cookie.match(/(^| )x-periscope-country=([^;]+)/);
    if (match) {
      setCountry(match[2]);
    }
  }, []);

  useEffect(() => {
    fetch('/api/pricing/regions')
      .then(res => res.json())
      .then(data => setRegionData(data))
      .catch(console.error);
  }, []);

  // Pricing logic based on country
  let currencySymbol = "$";
  let starterPrice = isAnnual ? 7 : 9;
  let teamPrice = isAnnual ? 19 : 24;
  let businessPrice = isAnnual ? 47 : 59;
  let formatPrice = (p: number) => `${currencySymbol}${p}`;

  if (country === "CA") {
    currencySymbol = "CA$";
    starterPrice = isAnnual ? 9 : 12; // Example CA prices
    teamPrice = isAnnual ? 26 : 32;
    businessPrice = isAnnual ? 63 : 79;
    formatPrice = (p: number) => `${currencySymbol}${p}`;
  } else if (country === "DE") {
    currencySymbol = "€";
    starterPrice = isAnnual ? 7.99 : 9.99;
    teamPrice = isAnnual ? 19.99 : 24.99;
    businessPrice = isAnnual ? 47.99 : 59.99;
    formatPrice = (p: number) => `${p.toString().replace('.', ',')} ${currencySymbol}`;
  }

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [cookieConsent, setCookieConsent] = useState(country === "DE");
  const acceptCookies = () => setCookieConsent(false);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {cookieConsent && country === "DE" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Cookie-Zustimmung</h2>
            <p className="mb-4">Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={acceptCookies}>Alle akzeptieren</Button>
              <Button variant="outline" onClick={acceptCookies}>Ablehnen</Button>
            </div>
          </div>
        </div>
      )}

      {/* When cookie consent is required and not given, block interaction visually (it is physically blocked by the overlay above) */}
      <div className={cookieConsent ? "pointer-events-none opacity-50" : ""}>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className={!isAnnual ? "font-bold" : ""}>Monthly</span>
            <button 
              className={`w-14 h-7 rounded-full relative transition-colors ${isAnnual ? 'bg-blue-600' : 'bg-gray-300'}`}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${isAnnual ? 'translate-x-7' : ''}`} />
            </button>
            <span className={isAnnual ? "font-bold" : ""}>Annual</span>
          </div>
          
          {isAnnual && (
            <p className="text-green-600 font-medium mb-4">
              Annual plans include priority support and a dedicated onboarding call.
            </p>
          )}

          <select 
            value={seats} 
            onChange={(e) => setSeats(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="1 seat">1 seat</option>
            <option value="5 seats">5 seats</option>
            <option value="25 seats">25 seats</option>
            <option value="100+ seats (contact us)">100+ seats (contact us)</option>
          </select>

          {seats === "100+ seats (contact us)" && (
            <p className="text-blue-600 mt-2">
              Volume pricing from $39 per user per month for 100 seats or more.
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* Starter */}
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-medium mb-2">Starter</h2>
            <p className="text-4xl font-medium mb-6">
              {formatPrice(starterPrice)}{' '}
              <span className="text-xl font-normal text-gray-600">
                {country === 'DE' ? 'pro Nutzer und Monat' : 'per user per month'}
              </span>
            </p>
            {isAnnual && <p className="text-sm text-gray-500 mb-4">Billed annually</p>}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <span>Basic features</span>
              </li>
            </ul>
            <Button className="w-full">Choose Starter</Button>
          </div>

          {/* Team */}
          <div className="border rounded-lg p-6 shadow-sm border-blue-500 relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm rounded-bl-lg rounded-tr-lg">Most Popular</div>
            <h2 className="text-2xl font-medium mb-2">Team</h2>
            <p className="text-4xl font-medium mb-6">
              {formatPrice(teamPrice)}{' '}
              <span className="text-xl font-normal text-gray-600">
                {country === 'DE' ? 'pro Nutzer und Monat' : 'per user per month'}
              </span>
            </p>
            {isAnnual && <p className="text-sm text-gray-500 mb-4">Billed annually</p>}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <span>Team collaboration</span>
              </li>
            </ul>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Team</Button>
          </div>

          {/* Business */}
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-medium mb-2">Business</h2>
            <p className="text-4xl font-medium mb-6">
              {formatPrice(businessPrice)}{' '}
              <span className="text-xl font-normal text-gray-600">
                {country === 'DE' ? 'pro Nutzer und Monat' : 'per user per month'}
              </span>
            </p>
            {isAnnual && <p className="text-sm text-gray-500 mb-4">Billed annually</p>}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <span>Advanced security</span>
              </li>
            </ul>
            <Button className="w-full">Choose Business</Button>
          </div>
        </div>

        <div className="text-center mb-8">
          <Link href="/contact" className="text-blue-600 hover:underline">Contact sales</Link>
        </div>

        {country === "CA" && (
          <p className="text-center text-sm text-gray-600 mb-4">Canadian customers: GST/HST added at checkout.</p>
        )}
        {country === "DE" && (
          <p className="text-center text-sm text-gray-600 mb-4">Preise inkl. MwSt.</p>
        )}

        {isMobile && (
          <p className="text-center text-sm text-blue-600 font-medium mb-4">Get the Helix Ledger app on iOS and Android.</p>
        )}

        <div className="max-w-3xl mx-auto mb-12">
          <button 
            className="w-full text-left font-semibold text-lg flex justify-between items-center border p-4 rounded-lg bg-gray-50"
            onClick={() => setShowCompare(!showCompare)}
          >
            Compare plans
            <span>{showCompare ? '-' : '+'}</span>
          </button>
          
          {showCompare && (
            <div className="border border-t-0 p-4 rounded-b-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Feature</th>
                    <th className="py-2">Starter</th>
                    <th className="py-2">Team</th>
                    <th className="py-2">Business</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Bank connections</td>
                    <td className="py-2">2</td>
                    <td className="py-2">10</td>
                    <td className="py-2">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Audit log retention</td>
                    <td className="py-2">30 days</td>
                    <td className="py-2">1 year</td>
                    <td className="py-2">7 years</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">SSO</td>
                    <td className="py-2">No</td>
                    <td className="py-2">No</td>
                    <td className="py-2">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">API access</td>
                    <td className="py-2">No</td>
                    <td className="py-2">Yes</td>
                    <td className="py-2">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Seats included</td>
                    <td className="py-2">1</td>
                    <td className="py-2">5</td>
                    <td className="py-2">25</td>
                  </tr>
                  <tr>
                    <td className="py-2">Export formats</td>
                    <td className="py-2">CSV</td>
                    <td className="py-2">CSV, XLSX</td>
                    <td className="py-2">CSV, XLSX, PDF</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center mb-8 relative">
          <span 
            className="cursor-help border-b border-dashed border-gray-400"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-describedby="fair-use-tooltip"
          >
            Fair use limits
          </span>
          {showTooltip && (
            <div id="fair-use-tooltip" className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-2 bg-black text-white text-sm rounded whitespace-nowrap z-10">
              Fair use means 5,000 transactions per month per workspace.
            </div>
          )}
        </div>

        <div className="text-center mb-12">
          {!showMore ? (
            <Button variant="outline" onClick={() => setShowMore(true)}>Show more</Button>
          ) : (
            <div className="mt-4 p-4 border rounded bg-gray-50 max-w-2xl mx-auto">
              <p className="mb-4">
                Helix Ledger goes above and beyond to secure your financial data. We perform daily backups, encrypt data at rest using AES-256, and maintain strict access controls. Read more in our detailed security whitepaper.
              </p>
              <a href="/docs/helix-ledger-security-whitepaper.pdf" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Download Security Whitepaper
              </a>
            </div>
          )}
        </div>

        <div className="mb-12 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-center">Cost Calculator</h3>
          <div className="border rounded overflow-hidden">
            <iframe src="/embed/calculator" className="w-full h-32" title="Calculator Embed" />
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500">
          Prices shown for your region.
        </footer>
      </div>
    </main>
  );
}
