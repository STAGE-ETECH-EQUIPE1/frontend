import { PrinterIcon } from 'lucide-react'

export default function PaymentResume() {
  return (<>
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="receipt-container bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">

        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Payment Receipt</h1>
              <p className="text-blue-100">Transaction Successful</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100">Receipt #</p>
              <p className="font-semibold">INV-2023-00142</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">From</h2>
              <p className="font-medium">Your Company Name</p>
              <p className="text-gray-600">123 Business Street</p>
              <p className="text-gray-600">City, State 10001</p>
              <p className="text-gray-600">contact@company.com</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">To</h2>
              <p className="font-medium">John Doe</p>
              <p className="text-gray-600">123 Customer Avenue</p>
              <p className="text-gray-600">Customer City, ST 20002</p>
              <p className="text-gray-600">john.doe@email.com</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-500 text-sm">Date</p>
              <p className="font-medium">May 15, 2023</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Payment Method</p>
              <p className="font-medium">Credit Card</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Transaction ID</p>
              <p className="font-medium">TXN-78945612</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <p className="text-green-600 font-medium">Completed</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-2 text-gray-700 font-semibold">Description</th>
                <th className="pb-2 text-gray-700 font-semibold text-right">Quantity</th>
                <th className="pb-2 text-gray-700 font-semibold text-right">Unit Price</th>
                <th className="pb-2 text-gray-700 font-semibold text-right">Amount</th>
              </tr>
              </thead>
              <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4">Premium Subscription</td>
                <td className="py-4 text-right">1</td>
                <td className="py-4 text-right">$99.00</td>
                <td className="py-4 text-right">$99.00</td>
              </tr>
              <tr>
                <td className="py-4">Tax</td>
                <td className="py-4 text-right"></td>
                <td className="py-4 text-right"></td>
                <td className="py-4 text-right">$8.91</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="flex justify-end">
            <div className="w-full md:w-1/3">
              <div className="flex justify-between py-2">
                <span className="font-semibold">Subtotal:</span>
                <span>$99.00</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">Tax (9%):</span>
                <span>$8.91</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold border-t border-gray-200 mt-2 pt-2">
                <span>Total:</span>
                <span>$107.91</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-100 text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
          <p className="mt-1">For any questions, please contact support@company.com</p>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 no-print">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full shadow-lg flex items-center transition-all">
          <PrinterIcon className="mr-2" />
          Print Receipt
        </button>
      </div>
    </div>
  </>);
}