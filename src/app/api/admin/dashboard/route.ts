import { NextResponse } from "next/server";

export const runtime = "nodejs";

import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

interface DashboardKPI {
  title: string;
  value: number | string;
  delta: string;
}

interface Booking {
  id: string;
  amount: number;
  createdAt: Timestamp;
}

interface Job {
  id: string;
  title: string;
  status: string;
  assignee?: string;
}

interface Feedback {
  id: string;
  user: string;
  text: string;
  date: string;
}

// Try to load Firebase Admin if available; otherwise fall back to static sample data.
async function fetchFromFirebase() {
  try {
    if (!getApps().length) {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT || "";
      if (serviceAccountJson) {
        const cred = JSON.parse(serviceAccountJson);
        initializeApp({ credential: cert(cred) });
      } else {
        // Try application default credentials
        initializeApp();
      }
    }

    const db = getFirestore();

    // Example collection names - adapt to your schema
    const kpisSnap = await db.collection("dashboard_kpis").get();
    const bookingsSnap = await db.collection("bookings").orderBy("createdAt", "desc").limit(10).get();
    const jobsSnap = await db.collection("jobs").get();
    const feedbackSnap = await db.collection("feedback").orderBy("createdAt", "desc").limit(5).get();

    const kpis = kpisSnap.docs.map(d => d.data() as DashboardKPI);
    const bookings = bookingsSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Booking);
    const jobs = jobsSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Job);
    const feedback = feedbackSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Feedback);

    return {
      kpis,
      chart: bookings.map(b => b.amount || 0).slice(0, 7),
      feedback,
      todayBookings: bookings.filter(b => {
        const d = b.createdAt?.toDate();
        if (!d) return false;
        const now = new Date();
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
      }).length,
      pendingJobs: jobs.filter(j => j.status === "pending"),
      completedJobs: jobs.filter(j => j.status === "completed"),
    };
  } catch (err) {
    // If firebase-admin isn't present or there's an error, return null to let fallback run
    console.error('Firebase fetch failed:', err);
    return null;
  }
}

export async function GET() {
  // First try firebase
  const firebaseData = await fetchFromFirebase();
  if (firebaseData) {
    return NextResponse.json({ success: true, ...firebaseData });
  }

  // Fallback static sample dataset
  const sample = {
    kpis: [
      { title: "Total Bookings", value: 1284, delta: "+5%" },
      { title: "Active Users", value: 342, delta: "+2%" },
      { title: "Total Revenue", value: "₹24,120", delta: "+8%" },
      { title: "Total Expenses", value: "₹6,410", delta: "-1%" },
    ],
    chart: [120, 200, 150, 300, 250, 320, 400],
    feedback: [
      { id: 1, user: "Alice", text: "Great service, quick response!", date: "Oct 28" },
      { id: 2, user: "Bob", text: "Minor delay but resolved quickly.", date: "Oct 27" },
      { id: 3, user: "Charlie", text: "Loved the new booking flow.", date: "Oct 25" },
    ],
    todayBookings: 24,
    pendingJobs: [
      { id: "1024", title: "Plumbing", assignee: "John" },
      { id: "1023", title: "AC repair", assignee: "Rita" },
    ],
    completedJobs: [
      { id: "1001", title: "Delivery" },
      { id: "1000", title: "Installation" },
    ],
  };

  return NextResponse.json({ success: true, ...sample });
}
