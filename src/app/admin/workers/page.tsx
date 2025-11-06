"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Trash2, Pencil } from "lucide-react";

interface Worker {
  id: string;
  name: string;
  phone: string;
  createdAt?: Date;
}

interface WorkerData {
  name: string;
  phone: string;
  createdAt?: Date;
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const workersRef = collection(db, "workers");

  const fetchWorkers = useCallback(async () => {
    const snapshot = await getDocs(workersRef);
    const data: Worker[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as WorkerData),
    }));
    setWorkers(data);
  }, [workersRef]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleAddOrUpdate = async () => {
    if (!name.trim() || !phone.trim()) return alert("Please fill all fields");
    setLoading(true);

    try {
      if (editingId) {
        const workerDoc = doc(db, "workers", editingId);
        await updateDoc(workerDoc, { name, phone });
        setEditingId(null);
      } else {
        await addDoc(workersRef, {
          name,
          phone,
          createdAt: new Date(),
        });
      }

      setName("");
      setPhone("");
      setIsModalOpen(false);
      await fetchWorkers();
    } catch (err) {
      console.error("Error saving worker:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (worker: Worker) => {
    setEditingId(worker.id);
    setName(worker.name);
    setPhone(worker.phone);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this serviceman?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "workers", id));
      await fetchWorkers();
    } catch (err) {
      console.error("Error deleting worker:", err);
    } finally {
      setDeleting(null);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setPhone("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName("");
    setPhone("");
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold text-black">
          Servicemen Management
        </h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#FF5F00] text-white rounded hover:bg-[#cc4c00]"
        >
          Add Serviceman
        </button>
      </div>
      {/* Workers List */}
      {workers.length === 0 ? (
        <p className="text-black">No servicemen added yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {workers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-black whitespace-nowrap">
                    {worker.name}
                  </td>
                  <td className="px-6 py-4 text-black whitespace-nowrap">
                    {worker.phone}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(worker)}
                      className="p-1 text-[#FF5F00] hover:text-[#cc4c00]"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(worker.id)}
                      disabled={deleting === worker.id}
                      className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {deleting === worker.id ? (
                        <Trash2 size={16} className="animate-pulse" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium mb-4 text-black">
              {editingId ? "Edit Serviceman" : "Add New Serviceman"}
            </h2>
            <div className="flex flex-col gap-4 mb-6">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2 w-full text-black"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded px-3 py-2 w-full text-black"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdate}
                disabled={loading}
                className="px-4 py-2 bg-[#FF5F00] text-white rounded hover:bg-[#cc4c00] disabled:opacity-50"
              >
                {loading ? "Saving..." : editingId ? "Save" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
