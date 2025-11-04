"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const sections = [
  {
    title: "Main Sections",
    items: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Bookings", href: "/admin/bookings" },
      { label: "Customers", href: "/admin/users" },
      { label: "Servicemen", href: "/admin/servicemen" },
      { label: "Services", href: "/admin/services" },
      { label: "Revenue", href: "/admin/revenue" },
      { label: "Feedback", href: "/admin/feedback" },
    ],
  },
  {
    title: "Management & Settings",
    items: [
      { label: "Promotions / Discounts", href: "/admin/promotions" },
      { label: "Survey Responses", href: "/admin/surveys" },
      { label: "Settings", href: "/admin/settings" },
      { label: "Logout", href: "/logout", isLogout: true },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("mico_token");
    } catch (err) {
      console.warn("Failed to remove token:", err);
    }
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav aria-label="Admin sidebar" className="w-64 hidden lg:block">
      <div className="h-full sticky top-16 p-4 space-y-8 bg-white border-r border-slate-100">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
              {section.title}
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);

                if (item.isLogout) {
                  return (
                    <li key={item.label}>
                      <a
                        href="#logout"
                        onClick={handleLogout}
                        className="block px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        active
                          ? "bg-orange-50 text-orange-600 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}