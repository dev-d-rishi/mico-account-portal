import { NextResponse } from "next/server";

export const runtime = "nodejs";

import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

async function getAdminDb() {
  if (!getApps().length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT || "";
    if (serviceAccountJson) {
      const cred = JSON.parse(serviceAccountJson);
      initializeApp({ credential: cert(cred) });
    } else {
      initializeApp();
    }
  }
  return getFirestore();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = body?.phone && String(body.phone);
    if (!phone) return NextResponse.json({ error: "Missing phone" }, { status: 400 });

    const db = await getAdminDb();
    await db.collection("users").doc(phone).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}