import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
