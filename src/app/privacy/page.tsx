export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Mico Privacy Policy
        </h1>

        <p className="text-gray-400 mt-4 mb-8">
          Last updated: October 16, 2025
        </p>

        <section className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            Welcome to Mico. Your privacy is important to us. This policy
            describes how we collect, use, and protect your data.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-orange-400">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-6">
              <li>Account details like phone number or email.</li>
              <li>Booking and usage data to improve service.</li>
              <li>Device and location data for performance optimization.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-orange-400">
              2. How We Use Your Data
            </h2>
            <p>
              Data is used to provide car wash services, send updates, and
              improve user experience. We do not sell your data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-orange-400">
              3. Contact Us
            </h2>
            <p>
              For privacy questions or concerns, email us at{" "}
              <span className="text-orange-400">support@micoapp.in</span>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}