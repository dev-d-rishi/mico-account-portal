"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import {
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Edit, Trash } from "lucide-react";

type Service = {
  id: string;
  service_name: string;
  description: string;
  image_url: string;
  services: string[];
  car_pricing: {
    Hatchback: { price: string; time: string };
    "Premium Hatchbacks": { price: string; time: string };
    Sedan: { price: string; time: string };
    "SUV/MPV": { price: string; time: string };
    Premium: { price: string; time: string };
    bike: { price: string; time: string};
  };
  allowed_addons: string[];
};

type Addon = {
  id: string;
  name: string;
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [addons, setAddons] = useState<Addon[]>([]);

  const availableItems = [
    "Hand Wash",
    "Tyre Wash",
    "Dirt & Dusting (Interior)",
    "Presure Wash (Exterior)+Coatings",
    "Foam Wash (Interior)",
    "Dashboard Clean",
    "Dashboard Polish",
    "Vacuum (Floor)",
    "Vaccum (Seats)",
    "Roof Clean",
    "Dicky Clean Vaccum",
    "Dry Clean (Seats)",
    "Dry Clean (Dicky)",
    "Engine bay Wash",
    "Glass Care (Polish)",
    "Tyre Polish",
    "UnderBody Wash",
    "Wheel Detailing",
    "Odour Blaster",
    "Air Freshner",
    "Tissue Box",
    "Dustbin",
    "Paper Mat",
  ];

  useEffect(() => {
    fetchServices();
    fetchAddons();
  }, []);

  const fetchServices = async () => {
    const services = await fetch("/api/admin/services").then((res) => res.json()).then(data => data.services);
    
    if(!Array.isArray(services)) return;

    setServices(services);
  };

  const fetchAddons = async () => {
    const res = await fetch('/api/admin/addons');
    const data = await res.json();
    if (Array.isArray(data.addons)) {
      setAddons(data.addons);
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    // VALIDATIONS
    if (!editing.image_url || editing.image_url.trim() === "") {
      alert("Please upload an image.");
      return;
    }

    if (!editing.service_name.trim()) {
      alert("Service name is required.");
      return;
    }

    if (!editing.description.trim()) {
      alert("Description is required.");
      return;
    }

    if (editing.services.length === 0) {
      alert("Select at least one service item.");
      return;
    }

    // Validate at least one car type has both price & time
    const hasPricing = Object.values(editing.car_pricing).some(
      (v) => v.price.trim() !== "" && v.time.trim() !== ""
    );

    if (!hasPricing) {
      alert("Please fill price & time for at least one car type.");
      return;
    }

    if (!editing.allowed_addons) {
      editing.allowed_addons = [];
    }

    const form = new FormData();
    form.append("id", editing.id);
    form.append("service_name", editing.service_name);
    form.append("description", editing.description);
    form.append("car_pricing", JSON.stringify(editing.car_pricing));
    form.append("services", JSON.stringify(editing.services));
    form.append(
      "allowed_addons",
      JSON.stringify(editing.allowed_addons)
    );

    // If image_url is Blob URL → send file
    const imageInput = document.querySelector("#service-image-input") as HTMLInputElement;
    if (imageInput?.files?.[0]) {
      form.append("image", imageInput.files[0]);
    } else {
      form.append("image_url", editing.image_url);
    }

    const res = await fetch("/api/admin/services", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!data.success) {
      alert("Failed to save service.");
      return;
    }

    alert("Service saved successfully!");
    setEditing(null);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const res = await fetch("/api/admin/services", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!data.success) {
      alert("Failed to delete service.");
      return;
    }

    alert("Service deleted successfully!");
    fetchServices();
  };

  const toggleItem = (item: string) => {
    if (!editing) return;

    const exists = editing.services.includes(item);
    const newList = exists
      ? editing.services.filter((s) => s !== item)
      : [...editing.services, item];

    setEditing({ ...editing, services: newList });
  };

  const toggleAddon = (addonId: string) => {
    if (!editing) return;

    const current = Array.isArray(editing.allowed_addons)
      ? editing.allowed_addons
      : [];

    const exists = current.includes(addonId);
    const updated = exists
      ? current.filter(id => id !== addonId)
      : [...current, addonId];

    setEditing({ ...editing, allowed_addons: updated });
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl font-bold text-[#FC7000] mb-6">
        Services Manager
      </h1>

      <button
        className="bg-[#FC7000] text-white px-4 py-2 rounded mb-4"
        onClick={() =>
          setEditing({
            id: crypto.randomUUID(),
            service_name: "",
            description: "",
            image_url: "",
            services: [],
            car_pricing: {
              Hatchback: { price: "", time: "" },
              "Premium Hatchbacks": { price: "", time: "" },
              Sedan: { price: "", time: "" },
              "SUV/MPV": { price: "", time: "" },
              Premium: { price: "", time: "" },
              bike: { price: "", time: "" },
            },
            allowed_addons: [],
          })
        }
      >
        + Add Service
      </button>

      {/* SERVICES TABLE */}
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left uppercase text-xs text-gray-700">
              Name
            </th>
            {/* <th className="px-6 py-3 text-left uppercase text-xs text-gray-700">
              Image
            </th> */}
            <th className="px-6 py-3 text-left uppercase text-xs text-gray-700">
              Description
            </th>
            <th className="px-6 py-3 text-left uppercase text-xs text-gray-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {services.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 border-t">
              <td className="p-3 font-semibold">{s.service_name}</td>
              <td className="p-3">
                <img
                  src={s.image_url}
                  className="h-16 w-28 object-cover rounded shadow"
                />
              </td>
              <td className="p-3 text-gray-600 text-sm">
                {s.description.substring(0, 80)}...
              </td>
              <td className="p-3">
                <button
                  className="text-blue-600 hover:text-blue-800 mr-3"
                  onClick={() =>
                    setEditing({
                      ...s,
                      allowed_addons: Array.isArray(s.allowed_addons) ? s.allowed_addons : [],
                    })
                  }
                  title="Edit"
                >
                  <Edit />
                </button>

                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(s.id)}
                  title="Delete"
                >
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-[900px] max-h-[90vh] overflow-y-auto">
            {/* TOP IMAGE UPLOAD FULL-WIDTH */}
            <label className="font-semibold">Service Image</label>

            <div className="relative border rounded w-full h-48 mt-3 flex items-center justify-center bg-gray-100 overflow-hidden">
              {!editing.image_url && (
                <input
                  id="service-image-input"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setEditing({
                      ...editing,
                      image_url: file ? URL.createObjectURL(file) : "",
                    });
                  }}
                />
              )}

              {editing.image_url ? (
                <>
                  <img
                    src={editing.image_url}
                    className="w-full h-full object-cover"
                  />

                  <button
                    onClick={() => setEditing({ ...editing, image_url: "" })}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-red-700"
                  >
                    ✕
                  </button>

                  <input
                    id="service-image-input"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setEditing({
                        ...editing,
                        image_url: file
                          ? URL.createObjectURL(file)
                          : editing.image_url,
                      });
                    }}
                  />
                </>
              ) : (
                <p className="text-gray-500">
                  Click to upload image (16:9 recommended)
                </p>
              )}
            </div>

            {/* MAIN CONTENT SECTIONS */}
            <div className="space-y-10 mt-8">
              {/* BASIC INFO */}
              <div>
                <h3 className="text-xl font-bold text-[#FC7000] mb-3">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-semibold">Service Name</label>
                    <input
                      className="border p-2 w-full rounded"
                      value={editing.service_name}
                      onChange={(e) =>
                        setEditing({ ...editing, service_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-semibold">Description</label>
                    <textarea
                      className="border p-2 w-full rounded h-24"
                      value={editing.description}
                      onChange={(e) =>
                        setEditing({ ...editing, description: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* CAR PRICING */}
              <div>
                <h3 className="text-xl font-bold text-[#FC7000] mb-3">
                  Car Type Pricing & Time
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(editing.car_pricing).map(([type, value]) => (
                    <div
                      key={type}
                      className="border p-4 rounded-lg bg-gray-50 shadow"
                    >
                      <p className="font-semibold mb-2">{type}</p>

                      <label>Price</label>
                      <input
                        className="border p-2 w-full rounded mb-2"
                        value={value.price}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            car_pricing: {
                              ...editing.car_pricing,
                              [type]: { ...value, price: e.target.value },
                            },
                          })
                        }
                      />

                      <label>Time</label>
                      <input
                        className="border p-2 w-full rounded"
                        value={value.time}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            car_pricing: {
                              ...editing.car_pricing,
                              [type]: { ...value, time: e.target.value },
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SERVICE ITEMS */}
              <div>
                <h3 className="text-xl font-bold text-[#FC7000] mb-3">
                  Select Service Items
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableItems.map((item) => (
                    <div
                      key={item}
                      className={`p-2 border rounded cursor-pointer ${
                        editing.services.includes(item)
                          ? "bg-green-200 border-green-600"
                          : "bg-gray-100"
                      }`}
                      onClick={() => toggleItem(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* ADDONS */}
              <div>
                <h3 className="text-xl font-bold text-[#FC7000] mb-3">
                  Select Available Addons
                </h3>

                {addons.length === 0 ? (
                  <p className="text-gray-500">No addons created yet</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {addons.map(addon => (
                      <div
                        key={addon.id}
                        className={`p-2 border rounded cursor-pointer ${
                          editing?.allowed_addons?.includes(addon.id)
                            ? 'bg-blue-200 border-blue-600'
                            : 'bg-gray-100'
                        }`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        {addon.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end mt-6">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded ml-3 hover:bg-red-600"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
