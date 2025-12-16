'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type VehiclePricing = {
  price: string;
};

type Addon = {
  id: string;
  name: string;
  description: string;
  time: string;
  price: {
    Hatchback: VehiclePricing;
    'Premium Hatchbacks': VehiclePricing;
    Sedan: VehiclePricing;
    'SUV/MPV': VehiclePricing;
    Premium: VehiclePricing;
    bike: VehiclePricing;
  };
};

const emptyAddon: Addon = {
  id: '',
  name: '',
  description: '',
  time: '',
  price: {
    Hatchback: { price: '' },
    'Premium Hatchbacks': { price: '' },
    Sedan: { price: '' },
    'SUV/MPV': { price: '' },
    Premium: { price: '' },
    bike: { price: '' },
  },
};

const VEHICLE_KEYS = [
  'Hatchback',
  'Premium Hatchbacks',
  'Sedan',
  'SUV/MPV',
  'Premium',
  'bike',
] as const;

export default function AddonsPage() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Addon | null>(null);
  const [form, setForm] = useState(emptyAddon);

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    try {
      const res = await fetch('/api/admin/addons');
      const data = await res.json();
      setAddons(data.addons || []);
    } catch (err) {
      console.error('Failed to load addons', err);
    }
  };

  return (
    <div className="p-6 space-y-6 text-black">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#FC7000]">Addons</h1>

        <button
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
          onClick={() => {
            setEditing(null);
            setForm(emptyAddon);
            setIsOpen(true);
          }}
        >
          <Plus size={16} />
          Add Addon
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left uppercase text-xs text-gray-700">
              Name
            </th>
            <th className="px-6 py-3 text-left uppercase text-xs text-gray-700">
              Description
            </th>
            <th className="px-6 py-3 text-left uppercase text-xs text-gray-700">
              Actions
            </th>
          </tr>
        </thead>

          <tbody>
            {addons.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No addons created yet
                </td>
              </tr>
            ) : (
              addons.map(addon => (
                <tr
                  key={addon.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {addon.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {addon.description}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button
                        className="rounded-md border p-2 hover:bg-gray-100"
                        onClick={() => {
                          setEditing(addon);
                          setForm(addon);
                          setIsOpen(true);
                        }}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="rounded-md border p-2 text-red-600 hover:bg-red-50"
                        onClick={async () => {
                          if (!confirm('Delete this addon?')) return;

                          try {
                            await fetch('/api/admin/addons', {
                              method: 'DELETE',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: addon.id }),
                            });

                            fetchAddons();
                          } catch (err) {
                            console.error('Failed to delete addon', err);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              {editing ? 'Edit Addon' : 'Add Addon'}
            </h2>

            <div className="space-y-3">
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Addon name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />

              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />

              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Addon base time (e.g. 10 mins)"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
              />

              <div className="space-y-3 pt-3">
                <p className="text-sm font-semibold">Vehicle-wise Pricing</p>

                {VEHICLE_KEYS.map(key => (
                  <div
                    key={key}
                    className="grid grid-cols-3 gap-2 items-center"
                  >
                    <span className="text-xs font-medium">{key}</span>

                    <input
                      className="rounded-md border px-2 py-1 text-xs"
                      placeholder="Price"
                      value={form.price[key].price}
                      onChange={e =>
                        setForm({
                          ...form,
                          price: {
                            ...form.price,
                            [key]: {
                              price: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="rounded-md border px-4 py-2 text-sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>

              <button
                className="rounded-md bg-black px-4 py-2 text-sm text-white"
                onClick={async () => {
                  if (!form.name.trim()) return;

                  const payload = {
                    ...form,
                    id: editing?.id || Date.now().toString(),
                  };

                  try {
                    await fetch('/api/admin/addons', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    });

                    setIsOpen(false);
                    setEditing(null);
                    setForm(emptyAddon);
                    fetchAddons();
                  } catch (err) {
                    console.error('Failed to save addon', err);
                  }
                }}
              >
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}