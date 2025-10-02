export default function RefundPolicy() {
  return (
    <div className="px-4 sm:px-8 lg:px-20 py-10 text-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          Refund & Return Policy
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          At <span className="font-semibold">SpecsVue</span>, customer satisfaction is our priority.  
          Please read our refund & return policies carefully before placing an order.
        </p>

        {/* Section 1: Eligibility */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Eligibility for Refunds</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Products must be returned in their original condition (unused, unworn, and undamaged).</li>
            <li>Prescription and customized lenses are non-refundable once processed.</li>
            <li>Frames can only be refunded if they are defective, damaged on delivery, or incorrect.</li>
            <li>Return requests must be initiated within <strong>7 days of delivery</strong>.</li>
          </ul>
        </section>

        {/* Section 2: Refund Process */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Refund Process</h2>
          <p className="mb-4">
            Once your return is approved, refunds will be initiated to your original payment method.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Refunds are processed <strong>within 7 business days after cancellation</strong>.</li>
            <li>You will receive an email confirmation once the refund has been processed.</li>
            <li>Depending on your bank/payment provider, it may take additional 2–5 working days for the amount to reflect.</li>
          </ul>
        </section>

        {/* Section 3: Non-Refundable Items */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Non-Refundable Items</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Customized prescription lenses once manufactured.</li>
            <li>Products damaged due to misuse, mishandling, or improper care.</li>
            <li>Gift cards, coupons, or promotional vouchers.</li>
          </ul>
        </section>

        {/* Section 4: Exchange Policy */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Exchange Policy</h2>
          <p>
            If you wish to exchange your frames for a different model or color, you may request an 
            exchange within 7 days of delivery. Exchanges are subject to stock availability. 
            Price differences (if any) will be adjusted accordingly.
          </p>
        </section>

        {/* Section 5: Contact */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Contact Us</h2>
          <p>
            For refund or return requests, please contact our support team at{" "}
            <a href="mailto:specsvue@gmail.com" className="text-blue-600 hover:underline">
              specsvue@gmail.com
            </a>.
          </p>
        </section>

        {/* Footer note */}
        <div className="mt-10 p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
          <p>Note: SpecsVue reserves the right to update or modify this policy at any time without prior notice.</p>
        </div>
      </div>
    </div>
  );
}
