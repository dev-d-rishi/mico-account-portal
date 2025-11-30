import { db } from "@/lib/firebaseClient";
import { NextResponse } from "next/server";
import { doc, setDoc, increment, serverTimestamp, getDoc } from "firebase/firestore";

export async function GET(req: Request) {
  try {
    // 1. Track total counter
    const ref = doc(db, "linkCounters", "app");

    await setDoc(
      ref,
      {
        count: increment(1),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // 2. Daily analytics + total count storage
    const analyticsRef = doc(db, "analytics", "overview");
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

    interface ScanEvent {
      date: string;
      count: number;
    }

    interface AnalyticsData {
      analyticsEvents?: ScanEvent[];
      totalCount?: number;
    }

    let existingData: AnalyticsData = {};
    try {
      const snap = await getDoc(analyticsRef);
      if (snap.exists()) existingData = snap.data();
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }

    const analyticsEvents: ScanEvent[] = existingData.analyticsEvents || [];
    const totalCount = existingData.totalCount || 0;

    // Update or insert today's record
    const existingIndex = analyticsEvents.findIndex((item: ScanEvent) => item.date === todayStr);

    if (existingIndex !== -1) {
      analyticsEvents[existingIndex].count += 1;
    } else {
      analyticsEvents.push({
        date: todayStr,
        count: 1,
      });
    }

    // Update Firestore
    await setDoc(
      analyticsRef,
      {
        analyticsEvents,
        totalCount: totalCount + 1,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const userAgent = req.headers.get("user-agent") || "";

    let device = "Unknown";
    if (/iPhone|iPad|iPod/i.test(userAgent)) device = "iOS";
    else if (/Android/i.test(userAgent)) device = "Android";
    else if (/Mac|Windows/i.test(userAgent)) device = "Desktop";

    console.log("Next server timestamp (request time):", serverTimestamp());
    // Calculate tomorrow's timestamp locally (Firestore serverTimestamp cannot be future-set)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    console.log("Tomorrow's timestamp (local):", yesterday.toISOString(), tomorrow.toISOString());
    console.log("Tracked app link click for device:", device);
    // 3. Redirect based on device
    let redirectUrl = "https://play.google.com/store/apps/details?id=com.mico.carwash";
    
    if (device === "iPhone" || device === "iPad" || device === "iPod" || device === "iOS") {
      redirectUrl = "https://apps.apple.com/in/app/mico/id6754202822"; // default iOS store
    }

    return NextResponse.redirect(redirectUrl);

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}