"use client";

import React, { useEffect, useState } from "react";
import KpiCard from "@/components/admin/KpiCard";
import ChartCard from "@/components/admin/ChartCard";
import FeedbackList from "@/components/admin/FeedbackList";
import { motion } from "framer-motion";

const GRADIENT = "linear-gradient(90deg, #F7931E, #FF6B35)";
const PRIMARY = "#FC7000";

const initialKpiData = [
  { title: "Total Bookings", value: 0, delta: "+0%" },
  { title: "Active Users", value: 0, delta: "+0%" },
  { title: "Total Revenue", value: "₹0", delta: "+0%" },
  { title: "Total Expenses", value: "₹0", delta: "+0%" },
];

const initialChartData = [0, 0, 0, 0, 0, 0, 0];

const initialFeedback: any[] = [];

export default function AdminDashboardPage() {
  const [kpiData, setKpiData] = useState(initialKpiData);
  const [chartData, setChartData] = useState<number[]>(initialChartData);
  const [feedback, setFeedback] = useState<any[]>(initialFeedback);
  const [todayBookings, setTodayBookings] = useState(0);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        if (!mounted) return;

        if (data.kpis) setKpiData(data.kpis);
        if (data.chart) setChartData(data.chart);
        if (data.feedback) setFeedback(data.feedback);
        if (typeof data.todayBookings === "number") setTodayBookings(data.todayBookings);
        if (data.pendingJobs) setPendingJobs(data.pendingJobs);
        if (data.completedJobs) setCompletedJobs(data.completedJobs);
      } catch (err) {
        // ignore and keep defaults
        // console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header row with title + filters */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Overview of system activity</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="date"
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder:text-slate-400"
            />
            <select className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900">
              <option>All servicemen</option>
              <option>John</option>
              <option>Rita</option>
            </select>
            <button
              className="rounded-lg px-4 py-2 text-white font-semibold"
              style={{ background: GRADIENT }}
            >
              Apply
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiData.map((k) => (
            <KpiCard key={k.title} title={k.title} value={k.value} delta={k.delta} gradient={PRIMARY} />
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ChartCard data={chartData} title="Revenue" gradient={GRADIENT} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6"
              >
                <div className="text-sm text-slate-500">Today's Bookings</div>
                <div className="text-3xl font-bold text-slate-900 mt-3">{loading ? "—" : todayBookings}</div>
                <div className="text-sm text-slate-600 mt-2">Compared to 18 yesterday</div>
              </motion.div>

              <motion.div className="md:col-span-2 rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-800">Pending Jobs</div>
                  <div className="text-xs text-slate-500">5 total</div>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="p-2 rounded-md hover:bg-slate-50">Booking #1024 — Plumbing — John</li>
                  <li className="p-2 rounded-md hover:bg-slate-50">Booking #1023 — AC repair — Rita</li>
                  <li className="p-2 rounded-md hover:bg-slate-50">Booking #1019 — Electrical — Sam</li>
                </ul>
              </motion.div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div>
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-800">Recently Completed</div>
                  <div className="text-xs text-slate-500">Today</div>
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="p-2 rounded-md hover:bg-slate-50">#1001 — Delivery — Completed</li>
                  <li className="p-2 rounded-md hover:bg-slate-50">#1000 — Installation — Completed</li>
                </ul>
              </div>
            </motion.div>

            <FeedbackList items={feedback} />
          </div>
        </div>
      </div>
    </div>
  );
}
