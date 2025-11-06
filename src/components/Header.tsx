"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export interface HeaderProps {
  showAdminLinks?: boolean;
}

const PRIMARY = "#FC7000";
const GRADIENT = "linear-gradient(90deg, #F7931E, #FF6B35)";

import { Variants } from "framer-motion";

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export const Header: React.FC<HeaderProps> = ({ showAdminLinks = false }) => {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const defaultLinks = [
    { label: "Home", href: "/" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Delete Account", href: "/delete-account" },
  ];

  const adminLinks = [
    // { label: "Dashboard", href: "/admin/dashboard" },
    // { label: "Manage Services", href: "/admin/services" },
    { label: "Logout", href: "/logout" },
  ];

  const links = showAdminLinks ? adminLinks : defaultLinks;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // handle logout client-side without navigating to /logout route
    if (href === "/logout") {
      e.preventDefault();
      try {
        localStorage.removeItem("mico_token");
      } catch (err) {
        console.warn("Failed to remove token from localStorage:", err);
      }
      setOpen(false);
      router.push("/");
      return;
    }

    setOpen(false);
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="show"
      className="sticky top-0 z-50 bg-white shadow-sm"
    >
      <div
        className={`${
          showAdminLinks ? "w-full px-6" : "max-w-6xl mx-auto px-4 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link
              href={showAdminLinks ? "/admin/dashboard" : "/"}
              className="inline-flex items-center"
            >
              <span
                className="text-lg font-semibold"
                style={{ color: PRIMARY }}
              >
                Mico Portal
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm py-1 px-0 hover:opacity-90 transition-all ${
                  isActive(l.href)
                    ? "font-semibold text-slate-900"
                    : "text-slate-700"
                }`}
                onClick={(e) => handleLinkClick(e, l.href)}
              >
                {l.label}
                {isActive(l.href) && (
                  <span
                    className="absolute left-0 right-0 mx-auto mt-6 h-1 rounded-full"
                    style={{
                      width: 32,
                      background: GRADIENT,
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:bg-slate-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                xmlns="http://www.w3.org/2000/svg"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-slate-100"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block rounded-md px-3 py-2 text-sm ${
                    isActive(l.href)
                      ? "font-semibold text-slate-900"
                      : "text-slate-700"
                  }`}
                  onClick={(e) => handleLinkClick(e, l.href)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
