import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export async function POST(req: Request) {
  try {
    // const { date, time } = await req.json();

    // if (!date || !time) {
    //   return NextResponse.json(
    //     { success: false, workers: [], message: "Missing date or time" },
    //     { status: 400 }
    //   );
    // }

    // TODO: replace with real logic later
    // For now return all workers from "workers" collection
    const workersRef = collection(db, "workers");
    const snapshot = await getDocs(workersRef);

    type Worker = { id: string; [key: string]: unknown };
    const workers: Worker[] = [];
    snapshot.forEach((doc) =>
      workers.push({ id: doc.id, ...doc.data() })
    );

    return NextResponse.json({ success: true, workers });
  } catch (err) {
    console.error("AVAILABLE WORKERS ERROR:", err);
    return NextResponse.json(
      { success: false, workers: [], message: "Internal server error" },
      { status: 500 }
    );
  }
}