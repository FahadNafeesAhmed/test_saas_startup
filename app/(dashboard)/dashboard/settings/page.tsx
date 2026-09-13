import { Button } from '@/components/ui/button';

export default function SettingsPage() {
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
      </div>
    </div>
  );
}
