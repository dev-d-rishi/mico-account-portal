import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * POST /api/mobile/edit-profile
 * Updates user profile details
 */
export async function POST(req: Request) {
  try {
    const {
      phone,
      name,
      email,
      alternatePhone,
      gender,
    } = await req.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { message: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Build update object safely (partial updates)
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (alternatePhone) updateData.alternatePhone = alternatePhone;
    if (gender) updateData.gender = gender;

    if (Object.keys(updateData).length === 1) {
      return NextResponse.json(
        { message: "No data provided to update" },
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

    if (userSnap.data()?.deleted === true) {
      return NextResponse.json(
        { message: "Account is deleted" },
        { status: 403 }
      );
    }

    await updateDoc(userRef, updateData);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("EDIT_PROFILE_ERROR", error);
    return NextResponse.json(
      { message: "Failed to update profile", error: String(error) },
      { status: 500 }
    );
  }
}