export default function DashboardOverview() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded bg-white">
          <p className="text-sm text-gray-500">Subscription Usage</p>
          <p className="text-lg">Team plan: 25 of 30 seats used.</p>
        </div>
        <div className="border p-4 rounded bg-white">
          <p className="text-sm text-gray-500">Connections</p>
          <p className="text-lg">Bank connections: 7 of 10.</p>
        </div>
      </div>
    </div>
  );
}
