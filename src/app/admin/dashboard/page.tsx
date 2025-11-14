"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataPointUsers {
  date: string;
  users: number;
}

interface ChartDataPointDuration {
  date: string;
  duration: number;
}

interface LatestRelease {
  version: string;
  createdAt: string;
}

interface DashboardData {
  activeUsers: number;
  newUsers: number;
  avgEngagementDuration: number;
  screenPageViews: number;
  totalUsers: number;
  userActivityOverTime: ChartDataPointUsers[];
  engagementDurationOverTime: ChartDataPointDuration[];
  latestRelease?: LatestRelease;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    activeUsers: 0,
    newUsers: 0,
    avgEngagementDuration: 0,
    screenPageViews: 0,
    totalUsers: 0,
    userActivityOverTime: [],
    engagementDurationOverTime: [],
    latestRelease: undefined,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/admin/stats");
      const result: DashboardData = await res.json();
      setData(result);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading)
    return <div className="p-6 text-gray-600">Loading dashboard...</div>;

  const userActivityChartData = {
    labels: (data?.userActivityOverTime ?? []).map((d: ChartDataPointUsers) =>
      d.date.length === 8
        ? `${d.date.slice(6, 8)}/${d.date.slice(4, 6)}/${d.date.slice(0, 4)}`
        : d.date
    ),
    datasets: [
      {
        label: "Active Users",
        data: (data?.userActivityOverTime ?? []).map(
          (d: ChartDataPointUsers) => d.users
        ),
        borderColor: "#FC7000",
        backgroundColor: "rgba(252,112,0,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const engagementDurationChartData = {
    labels: (data?.engagementDurationOverTime ?? []).map((d) =>
      d.date.length === 8
        ? `${d.date.slice(6, 8)}/${d.date.slice(4, 6)}/${d.date.slice(0, 4)}`
        : d.date
    ),
    datasets: [
      {
        label: "Avg Engagement Duration (mins)",
        data: (data?.engagementDurationOverTime ?? []).map(
          (d: ChartDataPointDuration) => d.duration
        ),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-[#FC7000]">Admin Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white shadow rounded-lg p-5 text-center">
          <h2 className="text-sm text-gray-500">Active Users</h2>
          <p className="text-3xl font-bold text-green-600">
            {data?.activeUsers ?? "No data available"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5 text-center">
          <h2 className="text-sm text-gray-500">New Users</h2>
          <p className="text-3xl font-bold text-blue-600">
            {data?.newUsers ?? "No data available"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5 text-center">
          <h2 className="text-sm text-gray-500">User Engagement Duration</h2>
          <p className="text-3xl font-bold text-purple-600">
            {data?.avgEngagementDuration != null
              ? `${data.avgEngagementDuration} mins`
              : "No data available"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5 text-center">
          <h2 className="text-sm text-gray-500">Screen Page Views</h2>
          <p className="text-3xl font-bold text-indigo-600">
            {data?.screenPageViews ?? "No data available"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5 text-center">
          <h2 className="text-sm text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold text-[#FC7000]">
            {data?.totalUsers ?? "No data available"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            User Activity (Weekly)
          </h3>
          {userActivityChartData.labels.length > 0 ? (
            <Line data={userActivityChartData} />
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Engagement Duration Trends
          </h3>
          {engagementDurationChartData.labels.length > 0 ? (
            <Line data={engagementDurationChartData} />
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-5 text-center">
        <h2 className="text-sm text-gray-500">Latest App Release</h2>
        <p className="text-md font-semibold text-gray-800">
          {data?.latestRelease?.version || "No data"}
        </p>
        <p className="text-xs text-gray-500">
          {data?.latestRelease?.createdAt
            ? new Date(data.latestRelease.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : ""}
        </p>
      </div>
    </div>
  );
}
