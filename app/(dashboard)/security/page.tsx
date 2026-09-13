export default function SecurityPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Security</h1>
      <p className="mb-4">We take your security seriously.</p>
      <ul className="list-disc pl-5">
        <li><a href="/docs/helix-ledger-security-whitepaper.pdf" className="text-blue-600 hover:underline">Security Whitepaper (PDF)</a></li>
        <li><a href="/docs/security-audit.docx" className="text-blue-600 hover:underline">Security Audit (DOCX)</a></li>
      </ul>
    </main>
  );
}
