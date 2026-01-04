import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";

/**
 * POST /api/mobile/verify-otp
 * Marks user as OTP verified and sends welcome bonus notification (first time only)
 */
export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { message: "Invalid phone number" },
        { status: 400 }
      );
    }

    const userRef = doc(db, "users", phone);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const userData = userSnap.data();

    const isFirstVerification = userData?.otpVerified !== true;

    /* ------------------------------------------------------------------ */
    /* 🔔 SEND WELCOME BONUS NOTIFICATION (FIRST TIME ONLY)                */
    /* ------------------------------------------------------------------ */
    if (
      isFirstVerification &&
      userData?.discount?.percentage === 15 &&
      userData?.discount?.redeemed === false
    ) {
      const notificationsRef = collection(
        db,
        "users",
        phone,
        "notifications"
      );

      await addDoc(notificationsRef, {
        title: "Welcome Bonus 🎉",
        message:
          "You’ve received a 15% welcome discount. Book your first service now!",
        type: "WELCOME_BONUS",
        read: false,
        createdAt: serverTimestamp(),
      });
    }

    /* ------------------------------------------------------------------ */
    /* ✅ MARK OTP VERIFIED                                                */
    /* ------------------------------------------------------------------ */
    await updateDoc(userRef, {
      otpVerified: true,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userSnap.id,
        ...userData,
        otpVerified: true,
      },
    });
  } catch (error) {
    console.error("VERIFY_OTP_ERROR", error);
    return NextResponse.json(
      { message: "Failed to verify OTP", error: String(error) },
      { status: 500 }
    );
  }
}