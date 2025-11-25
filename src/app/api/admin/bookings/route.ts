import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Query,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { status, date } = body; // optional filters

    let q: Query | null = null;

    const bookingsRef = collection(db, "bookings");

    // Build queries dynamically
    if (status && date) {
      q = query(
        bookingsRef,
        where("status", "==", status),
        where("date", "==", date),
        orderBy("createdAt", "desc"
            
        )
      );
    } else if (status) {
      q = query(
        bookingsRef,
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );
    } else if (date) {
      q = query(
        bookingsRef,
        where("date", "==", date),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(bookingsRef, orderBy("createdAt", "desc"));
    }

    interface BookingData {
      id: string;
      [key: string]: unknown;
    }
    const results: BookingData[] = [];

    const snapshot = await getDocs(q);
    snapshot.forEach((doc) =>
      results.push({
        id: doc.id,
        ...(doc.data() || {}),
      })
    );

    return NextResponse.json({
      success: true,
      bookings: results,
    });
  } catch (error: unknown) {
    console.error("ADMIN BOOKINGS ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
