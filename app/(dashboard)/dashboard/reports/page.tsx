import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ReportsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports</h2>
      <div className="bg-white p-6 border rounded mb-6">
        <h3 className="font-medium mb-4">Generate New Report</h3>
        <Button>Generate</Button>
      </div>
      
      <div className="bg-white p-6 border rounded">
        <h3 className="font-medium mb-4">Recent Reports</h3>
        <ul className="list-disc pl-5">
          <li>
            <Link href="/dashboard/reports/q3.pdf" className="text-blue-600 hover:underline" target="_blank">
              Q3 Financial Summary
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
