import axios from "axios";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = body?.phone && String(body.phone);
    const otp = body?.otp && String(body.otp);
    const requestId = body?.requestId && String(body.requestId);

    if (!phone || !otp) return NextResponse.json({ error: "Missing phone or otp" }, { status: 400 });

    const authKey = process.env.MSG91_AUTH_KEY;
    if (!authKey) return NextResponse.json({ error: "MSG91 auth key not configured" }, { status: 501 });

    // Proxy verify OTP to MSG91 control API
    const url = "https://control.msg91.com/api/v5/otp/verify";
    const payload: Record<string, unknown> = {
      mobile: phone.replace(/^\+?/, ""),
      otp,
    };
    if (requestId) payload["requestId"] = requestId;

    const response = await axios.post(url, payload, {
      headers: { authkey: authKey, "Content-Type": "application/json" },
      timeout: 10000,
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error("MSG91 verify error:", err);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
