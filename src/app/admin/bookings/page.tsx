"use client";

import React, { useCallback, useEffect, useState } from "react";

type Booking = {
  id: string;
  userName: string;
  userPhone: string;
  vehicle?: {
    brand: string;
    name: string;
    size: string;
  };
  service?: {
    service_name: string;
  };
  assignedTo?: {
    workerId: string | null;
    workerName: string | null;
  };
  date: string;
  time: string;
  status: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  type Worker = {
    id: string;
    name: string;
    phone: string;
  };

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusFilter || undefined,
          date: dateFilter || undefined,
        }),
      });

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter]);

  const handleAssignWorker = async (bookingId: string) => {
    try {
      await fetch("/api/admin/assign-worker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      fetchBookings();
    } catch (err) {
      console.error("Failed to assign worker:", err);
    }
  };

  const fetchAvailableWorkers = async (date: string, time: string) => {
    try {
      const response = await fetch("/api/admin/available-workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time }),
      });
      const data = await response.json();
      setWorkers(data.workers || []);
      setShowWorkerModal(true);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter, fetchBookings]);

  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl font-bold text-[#FC7000] mb-6">
        Admin Booking Dashboard
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rescheduled">Rescheduled</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        <button
          onClick={fetchBookings}
          className="bg-[#FC7000] text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">
                    <div className="font-semibold">{b.userName}</div>
                    <div className="text-sm text-gray-500">{b.userPhone}</div>
                  </td>

                  <td className="p-3">
                    <div>
                      {b.vehicle?.brand} {b.vehicle?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {b.vehicle?.size}
                    </div>
                  </td>

                  <td className="p-3">{b.service?.service_name}</td>

                  <td className="p-3">
                    {(() => {
                      const [y, m, d] = b.date.split("-");
                      return `${d}-${m}-${y}`;
                    })()}
                  </td>

                  <td className="p-3">{b.time}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded text-white 
                        ${
                          b.status === "pending"
                            ? "bg-yellow-500"
                            : b.status === "confirmed"
                            ? "bg-green-600"
                            : b.status === "cancelled"
                            ? "bg-red-600"
                            : b.status === "completed"
                            ? "bg-blue-600"
                            : "bg-gray-500"
                        }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {b.assignedTo?.workerId ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
                        Assigned to {b.assignedTo?.workerName}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          fetchAvailableWorkers(b.date, b.time);
                        }}
                        className="bg-[#FC7000] text-white px-3 py-1 rounded"
                      >
                        Assign Worker
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showWorkerModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Select Worker</h2>

            {workers.length === 0 ? (
              <p className="text-gray-600">
                No workers available for this slot.
              </p>
            ) : (
              <div className="space-y-3">
                {workers.map((w) => (
                  <button
                    key={w.id}
                    className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded text-left"
                    onClick={() => {
                      handleAssignWorker(selectedBooking!.id);
                      setShowWorkerModal(false);
                    }}
                  >
                    <div className="font-semibold">{w.name}</div>
                    <div className="text-sm text-gray-600">{w.phone}</div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowWorkerModal(false)}
              className="mt-4 w-full bg-red-500 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
