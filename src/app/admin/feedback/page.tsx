"use client";

import React, { useEffect, useState } from "react";

interface Feedback {
  id?: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  feedback: string[];
  user: {
    name: string;
    phone: string;
  };
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        // 👇 Replace this with your actual API endpoint
        const res = await fetch("/api/admin/feedback");
        const data = await res.json();
        setFeedbacks(data.feedbacks || []);
        console.log("Fetched feedback:", data);
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-6 w-6 border-t-2 border-gray-400 rounded-full"></div>
      </div>
    );
  }

  return (
    <main className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h1 className="text-xl font-semibold text-slate-800 mb-6">
        User Feedback
      </h1>

      {feedbacks.length === 0 ? (
        <p className="text-slate-500 text-sm">No feedback found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Feedback</th>
                <th className="px-4 py-3 text-left font-medium">Comment</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Updated</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {feedbacks.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {f.user?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {f.user?.phone || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {f.feedback && f.feedback.length > 0
                      ? f.feedback.join(", ")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {f.comment || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(f.updatedAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
