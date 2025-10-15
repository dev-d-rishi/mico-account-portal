"use client";
import { useState } from "react";
import { sendOtp, verifyAndDelete } from "@/lib/services/accountService";

export default function DeleteAccountPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "done">("phone");
  const [status, setStatus] = useState("");

  // Simulate sending OTP
  const handleSendOtp = async () => {
    if (!phone) {
      setStatus("Please enter your phone number.");
      return;
    }

    setStatus("Sending OTP...");
    try {
      // TODO: Integrate your OTP API (MSG91 or Twilio)
      //   await new Promise((r) => setTimeout(r, 1500));
      await sendOtp(phone);
      setStatus("✅ OTP sent successfully!");
      setStep("otp");
    } catch {
      setStatus("❌ Failed to send OTP. Try again later.");
    }
  };

  // Simulate verifying OTP and deleting account
  const handleVerifyOtp = async () => {
    if (!otp) {
      setStatus("Please enter the OTP you received.");
      return;
    }

    setStatus("Verifying OTP...");
    try {
      // TODO: Verify OTP via backend API
      //   await new Promise((r) => setTimeout(r, 1500));
      await verifyAndDelete(phone, otp);
      // TODO: Call account deletion endpoint
      // await fetch("/api/delete-account", { method: "POST", body: JSON.stringify({ phone }) });

      setStep("done");
      setStatus("✅ Your account has been deleted successfully.");
    } catch {
      setStatus("❌ Invalid OTP or server error.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
          Delete Your Mico Account
        </h1>
        <p className="text-gray-400 mb-8">
          Verify your phone number using OTP before account deletion.
        </p>

        {step === "phone" && (
          <>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSendOtp}
              className="w-full mt-5 py-3 bg-gradient-to-r from-orange-500 to-orange-700 rounded-md font-semibold hover:opacity-90 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full mt-5 py-3 bg-gradient-to-r from-orange-500 to-orange-700 rounded-md font-semibold hover:opacity-90 transition"
            >
              Verify & Delete
            </button>
          </>
        )}

        {step === "done" && (
          <p className="text-lg text-orange-400 font-medium mt-4">
            Your account has been deleted successfully.
          </p>
        )}

        {status && <p className="mt-4 text-sm text-gray-400">{status}</p>}
      </div>
    </main>
  );
}
