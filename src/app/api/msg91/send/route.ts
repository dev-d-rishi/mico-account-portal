import axios from "axios";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = body?.phone && String(body.phone);
    if (!phone)
      return NextResponse.json({ error: "Missing phone" }, { status: 400 });

    const authKey = "474472TaWj7rgi68f7f2beP1";
    const templateId = "356a75737a48323139373332"; // ✅ use your approved MSG91 template_id

    const url = "https://control.msg91.com/api/v5/otp";
    const payload = {
      template_id: templateId, // ✅ correct key
      mobile: phone.replace(/^\+?/, ""),
      otp_length: 6,
    };

    const response = await axios.post(url, payload, {
      headers: {
        authkey: authKey,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error("MSG91 send error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}