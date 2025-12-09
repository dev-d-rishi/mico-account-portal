import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "services"));
    const list = snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() }));
    return NextResponse.json({ services: list });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to load services" }, { status: 500 });
  }
}