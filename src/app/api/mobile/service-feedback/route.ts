import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  addDoc,
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { phone, name, feedback, comment } = await req.json();

    if (!phone || !feedback) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const feedbackRef = collection(db, "serviceFeedback");

    const payload = {
      user: { name, phone },
      feedback,
      comment: comment || "",
      updatedAt: new Date().toISOString(),
    };

    // Always create a NEW feedback document
    await addDoc(feedbackRef, {
      ...payload,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("serviceFeedbackController error:", error);
    return NextResponse.json(
      { message: "Failed to submit feedback", error: String(error) },
      { status: 500 }
    );
  }
}
