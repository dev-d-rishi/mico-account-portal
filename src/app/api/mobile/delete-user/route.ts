import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * POST /api/mobile/delete-user
 * Soft deletes a user account
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

    await updateDoc(userRef, {
      deleted: true,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_USER_ERROR", error);
    return NextResponse.json(
      { message: "Failed to delete user", error: String(error) },
      { status: 500 }
    );
  }
}