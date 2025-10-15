const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.mico.in";

export async function sendOtp(phone: string) {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) throw new Error("Failed to send OTP");
  return res.json();
}

export async function verifyAndDelete(phone: string, otp: string) {
  const res = await fetch(`${API_BASE}/auth/delete-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });
  if (!res.ok) throw new Error("Failed to delete account");
  return res.json();
}