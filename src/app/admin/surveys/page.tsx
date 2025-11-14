"use client";

import React, { useEffect, useState } from "react";

interface Survey {
  id: string;
  userName: string;
  phone: string;
  interest: string;
  serviceViewed: string;
  addOns: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const res = await fetch("/api/admin/surveys");
        if (!res.ok) throw new Error("Failed to fetch surveys");
        const data = await res.json();
        setSurveys(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSurveys();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-6 w-6 border-t-2 border-gray-400 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow text-gray-700">
      <h1 className="text-2xl font-semibold mb-4">Surveys</h1>
      {surveys.length === 0 ? (
        <p className="text-gray-600">No surveys found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Interest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Service Viewed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Add-Ons
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {surveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                    {survey.userName}
                  </td>
                  <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                    {survey.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {survey.interest === "interested" ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                        Interested
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                        Not Interested
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                    {survey.serviceViewed}
                  </td>
                  <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                    <ul className="list-disc list-inside">
                      {survey.addOns.map((addOn, idx) => (
                        <li key={idx}>{addOn}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                    {new Date(survey.updatedAt).toLocaleString("en-GB", {
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
    </div>
  );
}
