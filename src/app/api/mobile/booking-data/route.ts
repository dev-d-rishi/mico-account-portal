import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

const masterRef = collection(db, "masterSlots");
const blockedRef = collection(db, "blockedDays");
const bookingsRef = collection(db, "bookings");

export async function GET() {
  const today = new Date();
  const next5 = [...Array(5)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  // Fetch master slots (active only)
  const masterSnap = await getDocs(masterRef);
  const masterSlots = masterSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((s: any) => s.active)
    .sort((a: any, b: any) => a.time.localeCompare(b.time));

  // Fetch blocked days only for next 5
  const blockedSnap = await getDocs(blockedRef);
  const blockedDays = blockedSnap.docs
    .map((d) => d.data().date)
    .filter((date: string) => next5.includes(date));

  // Fetch already booked slots for next 5
  const bookedSlots: any = {};

  const bookingsSnap = await getDocs(bookingsRef);
  bookingsSnap.forEach((d) => {
    const booking = d.data();
    if (next5.includes(booking.date)) {
      if (!bookedSlots[booking.date]) bookedSlots[booking.date] = [];
      bookedSlots[booking.date].push(booking.slotId);
    }
  });

  return NextResponse.json({
    masterSlots,
    blockedDays,
    bookedSlots,
    next5,
  });
}