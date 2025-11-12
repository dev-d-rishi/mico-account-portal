import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  doc,
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

    // Check if the user already gave feedback before
    const q = query(feedbackRef, where("user.phone", "==", phone), limit(1));
    const existingSnapshot = await getDocs(q);

    const payload = {
      user: { name, phone },
      feedback,
      comment: comment || "",
      updatedAt: new Date().toISOString(),
    };

    if (!existingSnapshot.empty) {
      // Update existing feedback
      const existingDoc = existingSnapshot.docs[0];
      const existingDocRef = doc(db, "serviceFeedback", existingDoc.id);
      await updateDoc(existingDocRef, payload);

      return NextResponse.json({
        success: true,
        message: "Feedback updated successfully",
      });
    }

    // Create new feedback record
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
