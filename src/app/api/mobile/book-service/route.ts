import { NextResponse } from "next/server";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      userName,
      userPhone,
      vehicle,
      address,
      service,
      date,
      time,
      totalPrice,
      payment,
    } = body;

    if (!userId || !vehicle || !address || !service || !date || !time) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const bookingData = {
      userId,
      userName: userName ?? "",
      userPhone: userPhone ?? "",

      vehicle,
      address,
      service,

      date,
      time,

      totalPrice: totalPrice ?? 0,

      payment: payment ?? {
        method: "UPI",
        status: "pending",
        paymentId: null,
      },

      status: "pending",

      assignedTo: {
        workerId: null,
        workerName: null,
      },

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "bookings"), bookingData);

    return NextResponse.json({
      success: true,
      bookingId: docRef.id,
      data: bookingData,
    });
  } catch (error: unknown) {
    console.error("BOOK SERVICE POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    const bookingsRef = collection(db, "bookings");
    let q;

    if (date) {
      q = query(
        bookingsRef,
        where("userId", "==", userId),
        where("date", "==", date),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        bookingsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
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
        ...doc.data(),
      })
    );

    return NextResponse.json({
      success: true,
      bookings: results,
    });
  } catch (error: unknown) {
    console.error("BOOK SERVICE GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
