import { db } from "@/lib/firebaseClient";
import { NextResponse } from "next/server";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { bookingId, status } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const ref = doc(db, "bookings", bookingId);

    await updateDoc(ref, {
      status,
      updatedAt: new Date().toISOString(),
    });

    const snap = await getDoc(ref);
    const updated = snap.data();

    return NextResponse.json(
      { message: "Slot updated successfully", booking: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating slot:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
