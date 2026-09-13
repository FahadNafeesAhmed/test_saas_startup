import { Button } from '@/components/ui/button';

export default function BillingPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Billing</h2>
      
      <div className="bg-white p-6 border rounded mb-6 max-w-xl">
        <h3 className="font-medium mb-4">Current Plan</h3>
        <p className="mb-4">You are currently on the Team plan.</p>
        
        <h3 className="font-medium mb-4 pt-4 border-t">Payment Method</h3>
        <div className="flex items-center mb-4">
          <div className="w-12 h-8 bg-gray-200 rounded mr-4 flex items-center justify-center font-bold text-gray-500 border">VISA</div>
          <div>
            <p className="font-medium">Card ending 4242</p>
            <p className="text-sm text-gray-500">Expires 12/2028</p>
          </div>
        </div>
        
        <Button>Update payment method</Button>
      </div>
    </div>
  );
}
