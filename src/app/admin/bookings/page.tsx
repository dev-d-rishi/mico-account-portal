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
  address?: {
    house: string;
    street: string;
    landmark: string;
    pincode: string;
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
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);

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

  // const handleAssignWorker = async (bookingId: string) => {
  //   try {
  //     await fetch("/api/admin/assign-worker", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ bookingId }),
  //     });
  //     fetchBookings();
  //   } catch (err) {
  //     console.error("Failed to assign worker:", err);
  //   }
  // };

  const fetchAvailableWorkers = async (date?: string, time?: string) => {
    try {
      const response = await fetch("/api/admin/available-workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time }),
      });
      const data = await response.json();
      setWorkers(data.workers || []);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter, fetchBookings]);
  useEffect(() => {
    fetchAvailableWorkers();
  }, []);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Edit
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
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Update Worker (Assigned to {b.assignedTo?.workerName})
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                        }}
                        className="bg-[#FC7000] text-white px-3 py-1 rounded"
                      >
                        Assign Worker
                      </button>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setShowBookingModal(true);
                      }}
                      className="text-blue-600 text-lg"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[450px] max-h-[85vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

            <div className="space-y-3 text-gray-800">
              <p>
                <strong>User:</strong> {selectedBooking.userName} (
                {selectedBooking.userPhone})
              </p>
              <p>
                <strong>Vehicle:</strong> {selectedBooking.vehicle?.brand}{" "}
                {selectedBooking.vehicle?.name} —{" "}
                {selectedBooking.vehicle?.size}
              </p>
              <p>
                <strong>Service:</strong>{" "}
                {selectedBooking.service?.service_name}
              </p>
              <p>
                <strong>Date:</strong> {selectedBooking.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedBooking.time}
              </p>
              <p>
                <strong>Status:</strong> {selectedBooking.status}
              </p>
              <p>
                <strong>Address:</strong> {selectedBooking.address?.house},{" "}
                {selectedBooking.address?.street},{" "}
                {selectedBooking.address?.landmark},{" "}
                {selectedBooking.address?.pincode}
              </p>

              <hr className="my-4" />

              <h3 className="text-xl font-semibold mb-2">
                Assign / Update Worker
              </h3>
              {selectedBooking.assignedTo?.workerId && (
                <p className="mb-2 text-gray-700">
                  <strong>Assigned Worker:</strong>{" "}
                  {selectedBooking.assignedTo.workerName}
                </p>
              )}
              <button
                className="w-full bg-blue-600 text-white p-2 rounded"
                onClick={async () => {
                  setAssignLoading(true);

                  // If already selected → hit assign-worker directly
                  if (selectedBooking.assignedTo?.workerId) {
                    await fetch("/api/admin/assign-worker", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        bookingId: selectedBooking.id,
                        workerId: selectedBooking.assignedTo.workerId,
                        workerName: selectedBooking.assignedTo.workerName,
                      }),
                    });
                    fetchBookings();
                    setShowBookingModal(false);
                  }
                  setAssignLoading(false);
                }}
              >
                {assignLoading
                  ? "Processing..."
                  : selectedBooking.assignedTo?.workerId
                  ? "Update Worker"
                  : "Assign Worker"}
              </button>
              {workers.length > 0 && (
                <select
                  className="border p-2 rounded w-full mt-3"
                  onChange={async (e) => {
                    // setAssignLoading(true);
                    const workerId = e.target.value;
                    const workerName =
                      workers.find((w) => w.id === workerId)?.name || "";

                    setSelectedBooking({
                      ...selectedBooking,
                      assignedTo: { workerId, workerName },
                    });

                    // Hit assign-worker API immediately when selecting worker
                    // await fetch("/api/admin/assign-worker", {
                    //   method: "POST",
                    //   headers: { "Content-Type": "application/json" },
                    //   body: JSON.stringify({
                    //     bookingId: selectedBooking.id,
                    //     workerId,
                    //     workerName,
                    //   }),
                    // });

                    // fetchBookings();
                    // setShowBookingModal(false);
                    // setAssignLoading(false);
                  }}
                  value={selectedBooking.assignedTo?.workerId || ""}
                >
                  <option value="">Select Worker</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} — {w.phone}
                    </option>
                  ))}
                </select>
              )}

              <hr className="my-4" />

              <h3 className="text-xl font-semibold mb-2">Update Slot Timing</h3>

              <input
                type="date"
                className="border p-2 rounded w-full"
                defaultValue={selectedBooking.date}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    date: e.target.value,
                  })
                }
              />

              <input
                type="text"
                className="border p-2 rounded w-full mt-2"
                defaultValue={selectedBooking.time}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    time: e.target.value,
                  })
                }
              />

              <button
                className="w-full bg-green-600 text-white p-2 rounded mt-3"
                onClick={async () => {
                  setSlotLoading(true);
                  await fetch("/api/admin/update-slot", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      bookingId: selectedBooking.id,
                      date: selectedBooking.date,
                      time: selectedBooking.time,
                      workerId: selectedBooking.assignedTo?.workerId || null,
                      workerName:
                        selectedBooking.assignedTo?.workerName || null,
                    }),
                  });
                  fetchBookings();
                  setShowBookingModal(false);
                  setSlotLoading(false);
                }}
              >
                {slotLoading ? "Saving..." : "Save Slot Update"}
              </button>
            </div>

            <button
              onClick={() => setShowBookingModal(false)}
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
