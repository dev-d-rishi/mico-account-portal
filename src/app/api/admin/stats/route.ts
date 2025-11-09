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
    return NextResponse.json({
      totalUsers,
      activeUsers,
      newUsers,
      avgEngagementDuration,
      screenPageViews,
      userActivityOverTime,
      engagementDurationOverTime,
      latestRelease,
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