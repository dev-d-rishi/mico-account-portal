'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

type Coupon = {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  maxDiscount?: number;
  minAmount?: number;
  expiry?: string;
  active: boolean;
};

const emptyCoupon: Coupon = {
  id: '',
  code: '',
  type: 'percentage',
  value: 0,
  maxDiscount: undefined,
  minAmount: undefined,
  expiry: '',
  active: true,
};

export default function AdminCouponPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCoupons = async () => {
    const snap = await getDocs(collection(db, 'coupons'));
    const list = snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<Coupon, 'id'>),
    }));
    setCoupons(list);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const saveCoupon = async () => {
    if (!editing) return;
    if (!editing.code || editing.value <= 0) return;

    setLoading(true);

    const id = editing.id || Date.now().toString();

    await setDoc(doc(db, 'coupons', id), {
      ...editing,
      id,
      code: editing.code.toUpperCase(),
      updatedAt: new Date().toISOString(),
      createdAt: editing.id ? undefined : new Date().toISOString(),
    });

    setEditing(null);
    setLoading(false);
    loadCoupons();
  };

  const removeCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await deleteDoc(doc(db, 'coupons', id));
    loadCoupons();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <button
          className="px-4 py-2 bg-[#FC7000] text-white rounded"
          onClick={() => setEditing({ ...emptyCoupon })}
        >
          + Add Coupon
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(c => (
          <div
            key={c.id}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-[#FC7000]">
                  {c.code}
                </h3>
                <p className="text-sm text-gray-500">
                  {c.type === 'percentage'
                    ? `${c.value}% off`
                    : `₹${c.value} flat off`}
                </p>
              </div>

              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  c.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {c.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="text-gray-500">Max Discount:</span>{' '}
                {c.maxDiscount ? `₹${c.maxDiscount}` : '—'}
              </p>
              <p>
                <span className="text-gray-500">Min Order:</span>{' '}
                {c.minAmount ? `₹${c.minAmount}` : '—'}
              </p>
              <p>
                <span className="text-gray-500">Expiry:</span>{' '}
                {c.expiry || 'No expiry'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="text-blue-600 text-sm font-medium hover:underline"
                onClick={() => setEditing(c)}
              >
                Edit
              </button>
              <button
                className="text-red-600 text-sm font-medium hover:underline"
                onClick={() => removeCoupon(c.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {coupons.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No coupons found
          </div>
        )}
      </div>

      {/* MODAL */}
      {editing && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-white p-6 rounded w-[420px]"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              {editing.id ? 'Edit Coupon' : 'Create Coupon'}
            </h2>

            <div className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Coupon Code"
                value={editing.code}
                onChange={e =>
                  setEditing({ ...editing, code: e.target.value })
                }
              />

              <select
                className="w-full border p-2 rounded"
                value={editing.type}
                onChange={e =>
                  setEditing({
                    ...editing,
                    type: e.target.value as 'percentage' | 'flat',
                  })
                }
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>

              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Value"
                value={editing.value}
                onChange={e =>
                  setEditing({
                    ...editing,
                    value: Number(e.target.value),
                  })
                }
              />

              {editing.type === 'percentage' && (
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  placeholder="Max Discount (₹)"
                  value={editing.maxDiscount ?? ''}
                  onChange={e =>
                    setEditing({
                      ...editing,
                      maxDiscount: Number(e.target.value),
                    })
                  }
                />
              )}

              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Min Order Amount (₹)"
                value={editing.minAmount ?? ''}
                onChange={e =>
                  setEditing({
                    ...editing,
                    minAmount: Number(e.target.value),
                  })
                }
              />

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={editing.expiry}
                onChange={e =>
                  setEditing({ ...editing, expiry: e.target.value })
                }
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={e =>
                    setEditing({ ...editing, active: e.target.checked })
                  }
                />
                Active
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#FC7000] text-white rounded "
                onClick={saveCoupon}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
