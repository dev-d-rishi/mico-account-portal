import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

const buildServiceDateTime = (date: string, time: string) => {
  // date: 2025-12-31
  // time: 5:00 PM
  const [timePart, meridian] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (meridian === "PM" && hours < 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;

  return new Date(
    `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:00`
  );
};

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
      totalTime,
      payment,
      addOns,
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
      addOns: addOns ?? [],
      date,
      time,

      totalPrice: totalPrice ?? 0,
      totalTime: totalTime ?? 0,
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

    if (userId) {
      const serviceDateTime = buildServiceDateTime(date, time);

      // ⏰ 1 hour before service
      const notifyAt = new Date(serviceDateTime.getTime() - 60 * 60 * 1000);

      // Only schedule if time is in future
      if (notifyAt.getTime() > Date.now()) {
        await addDoc(collection(db, "users", userId, "notifications"), {
          type: "BOOKING_REMINDER",
          title: "Booking Reminder",
          message: `Your car wash is scheduled at ${time}. Please keep your vehicle ready.`,
          bookingId: docRef.id,

          scheduledAt: notifyAt.toISOString(),
          sent: false,

          createdAt: new Date().toISOString(),
        });
      }
    }
    // 🔑 Mark discount as redeemed in DB (one-time)
    if (userId) {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData?.discounts && userData.discounts.redeemed === false) {
          await updateDoc(userRef, {
            discounts: {
              ...userData.discounts,
              redeemed: true,
            },
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: docRef.id,
      data: bookingData,
    });
  } catch (error: unknown) {
    console.error("BOOK SERVICE POST ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    const bookingsRef = collection(db, "bookings");

    // NO orderBy → NO Firestore index required
    const q = query(bookingsRef, where("userId", "==", userId));

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

    // Sort manually instead of Firestore (no index needed)
    results.sort((a, b) => {
      const t1 = new Date(a.createdAt as string).getTime();
      const t2 = new Date(b.createdAt as string).getTime();
      return t2 - t1; // newest first
    });

    return NextResponse.json({
      success: true,
      bookings: results,
    });
  } catch (error: unknown) {
    console.error("BOOK SERVICE GET ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
