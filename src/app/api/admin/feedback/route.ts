import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const feedbackCol = collection(db, "serviceFeedback");
    const snapshot = await getDocs(feedbackCol);

    const feedbacks = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        comment: data.comment || "",
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
        feedback: data.feedback || [],
        user: {
          name: data.user?.name || "Unknown",
          phone: data.user?.phone || "-",
        },
      };
    });

    // Optional: sort by newest first
    feedbacks.sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });

    return NextResponse.json({ feedbacks });
  } catch (err) {
    console.error("Error fetching feedback:", err);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
