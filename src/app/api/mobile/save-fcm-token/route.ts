import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * POST /api/mobile/save-fcm-token
 * Saves FCM token inside user document (DEDUPED)
 */

type FcmTokenEntry = {
  token: string;
  platform: "android" | "ios";
  updatedAt?: number;
};

export async function POST(req: Request) {
  try {
    const { userId, token, platform } = await req.json();

    if (!userId || !token || !platform) {
      return NextResponse.json(
        { message: "Missing userId, token or platform" },
        { status: 400 }
      );
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    const tokenPayload = {
      token,
      platform,
      updatedAt: Date.now(), // client-safe timestamp
    };

    if (!userSnap.exists()) {
      // 🆕 Create user doc with token
      await setDoc(userRef, {
        fcmTokens: [tokenPayload],
        updatedAt: serverTimestamp(),
      });
    } else {
      const data = userSnap.data() || {};
      const existingTokens: FcmTokenEntry[] = Array.isArray(data.fcmTokens)
        ? (data.fcmTokens as FcmTokenEntry[])
        : [];

      const dedupedTokens = existingTokens.filter((t) => t.token !== token);

      // ✅ add latest token
      dedupedTokens.push(tokenPayload);

      await updateDoc(userRef, {
        fcmTokens: dedupedTokens,
        updatedAt: serverTimestamp(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "FCM token saved successfully",
    });
  } catch (error) {
    console.error("SAVE_FCM_TOKEN_ERROR", error);
    return NextResponse.json(
      { message: "Failed to save FCM token", error: String(error) },
      { status: 500 }
    );
  }
}
