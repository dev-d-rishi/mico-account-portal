"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderClient() {
  const pathname = usePathname() || "/";
  const showAdmin = pathname.startsWith("/admin");

  return <Header showAdminLinks={showAdmin} />;
}
