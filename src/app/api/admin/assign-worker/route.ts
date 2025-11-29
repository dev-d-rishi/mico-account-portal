import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Missing bookingId" },
        { status: 400 }
      );
    }

    const ref = doc(db, "bookings", bookingId);

    // TEMP FIX: static worker until worker system is created
    const workerAssignment = {
      workerId: "worker_001",
      workerName: "Default Worker",
    };

    await updateDoc(ref, {
      status: "confirmed",
      assignedTo: workerAssignment,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Worker assigned successfully",
    });
  } catch (error) {
    console.error("ASSIGN WORKER ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to assign worker",
      },
      { status: 500 }
    );
  }
}