import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";

/**
 * POST /api/mobile/send-otp
 * Creates or updates user document before OTP verification
 * Also stores FCM token if provided
 */
export async function POST(req: Request) {
  try {
    const { phone, name, isWhatsAppUpdateEnabled, fcmToken, platform } =
      await req.json();

    if (!phone || phone.length !== 10 || !name) {
      return NextResponse.json(
        { message: "Invalid phone or name" },
        { status: 400 }
      );
    }

    const userRef = doc(db, "users", phone);
    const userSnap = await getDoc(userRef);

    const basePayload: any = {
      name,
      phone,
      whatsAppOptIn: Boolean(isWhatsAppUpdateEnabled),
      updatedAt: new Date().toISOString()
    };

    // 🔔 Prepare FCM token payload (if present)
    const fcmPayload =
      fcmToken && platform
        ? {
            token: fcmToken,
            platform,
          }
        : null;

    if (!userSnap.exists()) {
      // 🆕 New user
      await setDoc(userRef, {
        ...basePayload,
        discounts: {
          percentage: 15,
          redeemed: false,
        },
        ...(fcmPayload && { fcmTokens: [fcmPayload] }),
        createdAt: new Date().toISOString()
      });
    } else {
      // 🔁 Existing user (DEDUPE FCM TOKENS)
      const existingData = userSnap.data() || {};
      const existingTokens = Array.isArray(existingData.fcmTokens)
        ? existingData.fcmTokens
        : [];

      let updatedTokens = existingTokens;

      if (fcmPayload) {
        // ❌ remove duplicates
        updatedTokens = existingTokens.filter(
          (t: any) => t.token !== fcmPayload.token
        );

        // ✅ add latest token
        updatedTokens.push(fcmPayload);
      }

      await updateDoc(userRef, {
        ...basePayload,
        ...(fcmPayload && { fcmTokens: updatedTokens }),
      });
    }

    return NextResponse.json({
      success: true,
      message: "User prepared for OTP verification",
    });
  } catch (error) {
    console.error("SEND_OTP_ERROR", error);
    return NextResponse.json(
      { message: "Failed to process send-otp", error: String(error) },
      { status: 500 }
    );
  }
}
