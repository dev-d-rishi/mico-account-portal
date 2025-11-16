"use client";

import React, { useEffect, useState } from "react";

interface Slot {
  id: string;
  time: string;
  active: boolean;
}

interface BlockedDay {
  id: string;
  date: string;
  reason: string;
}

export default function TimeSlotsAdminPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [newTime, setNewTime] = useState("");
  const [newBlockedDate, setNewBlockedDate] = useState("");

  // Fetch all data
  const loadData = async () => {
    const s = await fetch("/api/admin/master-slots").then((r) => r.json());
    const b = await fetch("/api/admin/blocked-days").then((r) => r.json());

    setSlots(s);
    setBlockedDays(b);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add Slot
  const addSlot = async () => {
    if (!newTime) return;

    await fetch("/api/admin/master-slots", {
      method: "POST",
      body: JSON.stringify({ time: newTime }),
    });

    setNewTime("");
    loadData();
  };

  // Toggle slot active
  const toggleSlot = async (id: string, active: boolean) => {
    await fetch("/api/admin/master-slots", {
      method: "PATCH",
      body: JSON.stringify({ id, active }),
    });
    loadData();
  };

  // Delete slot
  const deleteSlot = async (id: string) => {
    await fetch("/api/admin/master-slots", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  // Add blocked day
  const addBlockedDay = async () => {
    if (!newBlockedDate) return;

    await fetch("/api/admin/blocked-days", {
      method: "POST",
      body: JSON.stringify({ date: newBlockedDate, reason: "Holiday" }),
    });

    setNewBlockedDate("");
    loadData();
  };

  // Delete blocked day
  const deleteBlockedDay = async (id: string) => {
    await fetch("/api/admin/blocked-days", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold text-orange-600">Time Slot Settings</h1>

      {/* MASTER SLOTS */}
      <div className="bg-white shadow p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Master Slots</h2>

        {/* Add Slot */}
        <div className="flex gap-4">
          <input
            className="border rounded px-3 py-2 text-gray-800"
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <button
            onClick={addSlot}
            className="bg-orange-600 text-white px-4 rounded"
          >
            Add Slot
          </button>
        </div>

        <div className="space-y-2">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <span className="font-medium text-gray-800">{slot.time}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => toggleSlot(slot.id, !slot.active)}
                  className={`px-3 py-1 rounded ${
                    slot.active ? "bg-green-500" : "bg-gray-400"
                  } text-white`}
                >
                  {slot.active ? "Active" : "Inactive"}
                </button>

                <button
                  onClick={() => deleteSlot(slot.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCKED DAYS */}
      <div className="bg-white shadow p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Blocked / Holiday Dates
        </h2>

        <div className="flex gap-4">
          <input
            type="date"
            className="border rounded px-3 py-2 text-gray-800"
            value={newBlockedDate}
            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
            onChange={(e) => setNewBlockedDate(e.target.value)}
          />
          <button
            onClick={addBlockedDay}
            className="bg-orange-600 text-white px-4 rounded"
          >
            Add Blocked Day
          </button>
        </div>

        <div className="space-y-2">
          {blockedDays.map((day) => (
            <div
              key={day.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <span className="font-medium text-gray-800">
                {new Date(day.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={() => deleteBlockedDay(day.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
