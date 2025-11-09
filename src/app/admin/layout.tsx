"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkToken = () => {
    const token = localStorage.getItem("mico_token");
    setIsLoggedIn(!!token);
    return !!token;
  };

  useEffect(() => {
    const hasToken = checkToken();
    setChecking(false);

    // 🚨 Redirect if no token and not already on login page
    if (!hasToken && pathname !== "/admin/login") {
      router.push("/admin/login");
    }

    if (pathname === "/admin" && hasToken) {
      router.push("/admin/dashboard");
    }
    if (pathname === "/admin" && !hasToken) {
      router.push("/admin/login");
    }

    // 👇 Listen for login/logout token changes (cross-tab + same-tab)
    const handleStorage = () => {
      const valid = checkToken();
      if (!valid && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("mico_token_changed", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("mico_token_changed", handleStorage);
    };
  }, [pathname, router]);

  if (checking) return null;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {isLoggedIn && <Sidebar />}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
