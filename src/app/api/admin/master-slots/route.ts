import { NextResponse } from "next/server";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

const masterSlotsRef = collection(db, "masterSlots");

export async function GET() {
  const snapshot = await getDocs(masterSlotsRef);
  const slots = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(slots);
}

export async function POST(req: Request) {
  const { time } = await req.json();

  if (!time) return NextResponse.json({ error: "Time required" }, { status: 400 });

  await addDoc(masterSlotsRef, {
    time,
    active: true,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const { id, active } = await req.json();
  const ref = doc(db, "masterSlots", id);
  await updateDoc(ref, { active });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const ref = doc(db, "masterSlots", id);

  await deleteDoc(ref);
  return NextResponse.json({ success: true });
}