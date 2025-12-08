export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl bg-white mx-auto px-6 py-10 text-black leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4">
        Welcome to the MiCo Car Washing App. By using our services, you agree to the following Terms & Conditions. 
        Please read them carefully before booking any service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Service Overview</h2>
      <p className="mb-4">
        MiCo provides doorstep car and bike washing services at the date and time selected by the user.
        The quality of service may vary based on weather, water availability, location access, and vehicle condition.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Booking & Scheduling</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>All bookings must be scheduled through the app.</li>
        <li>Users must provide accurate address and vehicle details.</li>
        <li>MiCo reserves the right to reschedule in case of operational issues or unforeseen circumstances.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Pricing & Payments</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>All prices are displayed clearly before confirming a booking.</li>
        <li>Discounts and promotional offers apply only when eligible and cannot be combined.</li>
        <li>MiCo may modify pricing at any time without prior notice.</li>
        <li>In case of failed payments, MiCo may cancel the booking.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. User Responsibilities</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Ensure vehicle access and availability at the booked time.</li>
        <li>Remove personal belongings before the service.</li>
        <li>Users are responsible for ensuring correct contact and location details.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cancellation & Refund Policy</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Cancellations allowed up to 1 hour before the service time.</li>
        <li>Refunds (if applicable) will be processed based on the payment method used.</li>
        <li>MiCo may cancel a booking due to operational limitations or weather conditions.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Service Limitations</h2>
      <p className="mb-4">
        MiCo is not responsible for:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Pre-existing damages to the vehicle.</li>
        <li>Delays caused by traffic, weather, or restricted access.</li>
        <li>Any loss of personal belongings left inside the vehicle.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. User Conduct</h2>
      <p className="mb-4">
        Users agree to behave respectfully with service workers. Abusive behavior may result in account suspension.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Privacy & Data Usage</h2>
      <p className="mb-4">
        MiCo collects user data such as name, phone number, address, and vehicle details for service delivery.
        We do not share personal data with third parties except for operational needs.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Liability</h2>
      <p className="mb-4">
        MiCo will not be liable for indirect, incidental, or consequential damages resulting from using our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">10. Updates to Terms</h2>
      <p className="mb-4">
        MiCo reserves the right to update these Terms & Conditions at any time. Continued use of the app
        constitutes acceptance of updated terms.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}