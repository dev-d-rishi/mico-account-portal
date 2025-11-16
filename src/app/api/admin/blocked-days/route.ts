import { NextResponse } from "next/server";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

const blockedDaysRef = collection(db, "blockedDays");

export async function GET() {
  const snapshot = await getDocs(blockedDaysRef);
  const days = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(days);
}

export async function POST(req: Request) {
  const { date, reason } = await req.json();

  if (!date) return NextResponse.json({ error: "Date required" }, { status: 400 });

  await addDoc(blockedDaysRef, {
    date,
    reason: reason || "Holiday",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await deleteDoc(doc(db, "blockedDays", id));
  return NextResponse.json({ success: true });
}