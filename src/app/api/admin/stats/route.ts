import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export async function GET() {
  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    });

    // Firestore: total users count
    const usersSnap = await getDocs(collection(db, "users"));
    const totalUsers = usersSnap.size;

    // Google Analytics: multiple metrics
    const [report] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA_PROPERTY_ID}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "userEngagementDuration" },
        { name: "screenPageViews" },
      ],
      dimensions: [{ name: "date" }],
    });

    const userActivityOverTime = report.rows?.map((row) => ({
      date: row.dimensionValues?.[0]?.value,
      users: parseInt(row.metricValues?.[0]?.value || "0"),
    }));

    const engagementDurationOverTime = report.rows?.map((row) => ({
      date: row.dimensionValues?.[0]?.value,
      duration: Math.round(
        parseInt(row.metricValues?.[2]?.value || "0") /
          (parseInt(row.metricValues?.[0]?.value || "1") * 60)
      ), // minutes per user
    }));

    // Last data point (latest day)
    const latest = report.rows?.at(-1)?.metricValues || [];

    const activeUsers = parseInt(latest?.[0]?.value || "0");
    const newUsers = parseInt(latest?.[1]?.value || "0");
    const avgEngagementDuration = Math.round(
      parseInt(latest?.[2]?.value || "0") / 60
    );
    const screenPageViews = parseInt(latest?.[3]?.value || "0");

    // Mock latest app release (replace with your own collection if exists)
    const latestRelease = {
      version: "v1.0.3",
      createdAt: new Date().toISOString(),
    };
    console.log("Latest Release:", {
        totalUsers,
      activeUsers,
      newUsers,
      avgEngagementDuration,
      screenPageViews,
      userActivityOverTime,
      engagementDurationOverTime,
      latestRelease,
    });

    // --- Firestore: Scan Counter Analytics ---
    interface ScanEvent {
      date: string;
      count: number;
    }

    const overviewRef = collection(db, "analytics");
    const overviewSnap = await getDocs(overviewRef);

    let scanAnalytics = {
      totalCount: 0,
      analyticsEvents: [],
      todayCount: 0,
      yesterdayCount: 0,
      last7Days: [],
      last30Days: [],
    };

    const overviewDoc = overviewSnap.docs.find((d) => d.id === "overview");

    if (overviewDoc) {
      const data = overviewDoc.data() || {};
      const events = data.analyticsEvents || [];
      const totalCount = data.totalCount || 0;

      events.sort((a: ScanEvent, b: ScanEvent) => a.date.localeCompare(b.date));

      const todayStr = new Date().toISOString().split("T")[0];
      const yesterdayStr = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      const todayRecord = events.find((d: ScanEvent) => d.date === todayStr);
      const yesterdayRecord = events.find((d: ScanEvent) => d.date === yesterdayStr);

      const last7DaysDate = new Date();
      last7DaysDate.setDate(last7DaysDate.getDate() - 7);

      const last30DaysDate = new Date();
      last30DaysDate.setDate(last30DaysDate.getDate() - 30);

      scanAnalytics = {
        totalCount,
        analyticsEvents: events,
        todayCount: todayRecord?.count || 0,
        yesterdayCount: yesterdayRecord?.count || 0,
        last7Days: events.filter((d: ScanEvent) => new Date(d.date) >= last7DaysDate),
        last30Days: events.filter((d: ScanEvent) => new Date(d.date) >= last30DaysDate),
      };
    }

    return NextResponse.json({
      totalUsers,
      activeUsers,
      newUsers,
      avgEngagementDuration,
      screenPageViews,
      userActivityOverTime,
      engagementDurationOverTime,
      latestRelease,
      scanAnalytics,
    });
  } catch (error: unknown) {
    console.error("🔥 GA4 Analytics Route Error:");
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    } else {
      console.error("Unknown error", error);
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}