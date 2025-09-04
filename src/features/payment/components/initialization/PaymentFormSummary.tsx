export default function PaymentFormSummary() {
  return (
    <div className="lg:hidden mt-6 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Order Summary
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">$99.99</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">$5.99</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">$8.40</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">$114.38</span>
          </div>
        </div>
      </div>
    </div>
  )
}
