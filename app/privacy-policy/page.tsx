// components/PrivacyPolicy.tsx
export default function PrivacyPolicy() {
  const effectiveDate = "October 2, 2025";

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-gray-900">
      {/* JSON-LD for SEO: basic WebPage + Organization */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy - SpecsVue",
            "description":
              "Privacy policy for SpecsVue, an online eyewear store at specsvue.in. Explains what data we collect, how we use it, and how users can contact us.",
            "url": "https://specsvue.in/privacy-policy",
            "publisher": {
              "@type": "Organization",
              "name": "SpecsVue",
              "url": "https://specsvue.in"
            }
          })
        }}
      />

      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-6 text-sm text-gray-600">
        Last updated: <strong>{effectiveDate}</strong>
      </p>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">1. Introduction</h2>
        <p className="text-gray-700">
          Welcome to <strong>SpecsVue</strong> ({" "}
          <a href="https://specsvue.in" className="text-blue-600 underline">specsvue.in</a> ). This Privacy Policy explains
          how we collect, use, share, and protect information when you visit our site or buy eyeglasses, sunglasses,
          lenses, and related products.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">2. Information we collect</h2>
        <ul className="ml-5 list-disc text-gray-700">
          <li>
            <strong>Personal information:</strong> Your name, email, phone number, shipping address, and billing address
            when you place an order or create an account.
          </li>
          <li>
            <strong>Order & payment data:</strong> Items ordered, prescription details you provide, payment method (we do not
            store full card details — payment is handled by our payment partner).
          </li>
          <li>
            <strong>Device & usage data:</strong> IP address, browser type, pages visited, and interactions on our site (for
            analytics and security).
          </li>
          <li>
            <strong>Cookies:</strong> Small files used to remember your preferences and improve your shopping experience.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">3. How we use your information</h2>
        <p className="text-gray-700">
          We use collected information to:
        </p>
        <ul className="ml-5 list-disc text-gray-700">
          <li>Process and deliver your orders.</li>
          <li>Communicate order updates, offers, and important notices.</li>
          <li>Improve our website, services, and product recommendations.</li>
          <li>Prevent fraud and maintain site security.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">4. When we share information</h2>
        <p className="text-gray-700">
          We may share data with:
        </p>
        <ul className="ml-5 list-disc text-gray-700">
          <li>Payment processors to complete payments.</li>
          <li>Shipping providers to deliver your order.</li>
          <li>Third-party services for analytics and site performance.</li>
          <li>Law enforcement or legal requests when required by law.</li>
        </ul>
        <p className="mt-2 text-gray-700">
          We do not sell your personal information to third parties.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">5. Cookies & tracking</h2>
        <p className="text-gray-700">
          We use cookies and similar technologies to remember preferences, keep you logged in, and analyze how people use our
          site. You can control cookies through your browser settings; disabling some cookies may affect site functionality.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">6. Security</h2>
        <p className="text-gray-700">
          We take reasonable steps to protect your information with industry-standard security measures. However, no system
          is 100% secure — if you believe your account has been compromised, contact us immediately.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">7. Children</h2>
        <p className="text-gray-700">
          Our site is meant for adults and does not knowingly collect personal information from children under 13. If a parent
          believes we collected data about a child, please contact us and we will remove it.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">8. Your choices</h2>
        <ul className="ml-5 list-disc text-gray-700">
          <li>You can access and update your account information by signing in.</li>
          <li>Unsubscribe from marketing emails using the unsubscribe link in the email.</li>
          <li>Use your browser settings to manage cookies.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">9. Changes to this policy</h2>
        <p className="text-gray-700">
          We may update this policy from time to time. We will post the updated date at the top of this page. Major changes
          will be communicated by email or a site notice when appropriate.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">10. Contact us</h2>
        <p className="text-gray-700">
          If you have questions about this Privacy Policy or want to exercise your data rights, contact:
        </p>
        <address className="mt-3 not-italic text-gray-700">
          <strong>SpecsVue</strong>
          <br />
          Email:{" "}
          <a href="mailto:specsvue@gmail.com" className="text-blue-600 underline">
            specsvue@gmail.com
          </a>
          <br />
          Website:{" "}
          <a href="https://specsvue.in" className="text-blue-600 underline">
            https://specsvue.in
          </a>
        </address>
      </section>

      <footer className="mt-8 border-t pt-6 text-sm text-gray-600">
        <p>
          By using <strong>specsvue.in</strong>, you agree to the terms of this Privacy Policy.
        </p>
      </footer>
    </main>
  );
}
