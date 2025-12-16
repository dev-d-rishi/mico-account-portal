"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Wrench,
  DollarSign,
  MessageSquare,
  FileText,
  LogOut,
  Clock,
  Settings,
} from "lucide-react";

const sections = [
  {
    title: "Main Sections",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Time Slots", href: "/admin/time-slots", icon: Clock  },
      { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Customers", href: "/admin/users", icon: Users },
      { label: "Workers", href: "/admin/workers", icon: Wrench },
      { label: "Services", href: "/admin/services", icon: Settings },
      { label: "Add-ons", href: "/admin/addons", icon: Settings },
      { label: "Revenue", href: "/admin/revenue", icon: DollarSign },
      { label: "Feedback", href: "/admin/feedback", icon: MessageSquare },
    ],
  },
  {
    title: "Management & Settings",
    items: [
      // {
      //   label: "Promotions / Discounts",
      //   href: "/admin/promotions",
      //   icon: Gift,
      // },
      { label: "Survey Responses", href: "/admin/surveys", icon: FileText },
      // { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Logout", href: "/logout", isLogout: true, icon: LogOut },
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
    <nav
      aria-label="Admin sidebar"
      className="group transition-all duration-300 bg-white border-r border-slate-100
            md:w-20 md:hover:w-64 lg:block"
    >
      <div className="h-full sticky top-16 p-3 space-y-6 overflow-x-visible overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            {/* Hide section titles in collapsed view */}
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold hidden md:group-hover:block">
              {section.title}
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const baseClasses =
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all";

                if (item.isLogout) {
                  return (
                    <li key={item.label}>
                      <a
                        href="#logout"
                        onClick={handleLogout}
                        className={`${baseClasses} text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-orange-300`}
                      >
                        <Icon size={18} />
                        <span className="hidden md:group-hover:inline">
                          {item.label}
                        </span>
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${baseClasses} ${
                        active
                          ? "bg-orange-50 text-orange-600 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={18} />
                      <span className="hidden md:group-hover:inline">
                        {item.label}
                      </span>
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
