export default function IntegrationsPage() {
  const integrations = [
    { name: 'Stripe', status: 'Active' },
    { name: 'PayPal', status: 'Active' },
    { name: 'Square', status: 'Active' },
    { name: 'Shopify', status: 'Active' },
    { name: 'Slack', status: 'Active' },
    { name: 'Mailchimp', status: 'Active' },
    { name: 'QuickBooks sync', badge: 'Beta' },
    { name: 'Xero', badge: 'Coming soon' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Integrations</h2>
      <div className="space-y-2">
        {integrations.map((integration, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 border rounded bg-white">
            <span className="font-medium">{integration.name}</span>
            {integration.badge ? (
              <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                {integration.badge}
              </span>
            ) : (
              <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                {integration.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
