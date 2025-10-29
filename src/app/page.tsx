"use client";
// ...existing code...
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const GRADIENT = "linear-gradient(90deg, #F7931E, #FF6B35)";
const PRIMARY = "#FC7000";

const container = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
};
const fadeUp: any = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Home() {
  return (
    <motion.div
      className="min-h-screen bg-white text-slate-900"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Hero */}
      <motion.section
        variants={fadeUp}
        className="max-w-6xl mx-auto px-6 py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Secure, private account management — built for modern teams.
            </h1>
            <p className="text-slate-600 max-w-lg mb-6">
              Mico Portal gives users complete control over their data with easy
              privacy access, one-click deletion, and a secure admin interface.
              Simple. Transparent. Fast.
            </p>

            <div className="flex gap-4 items-center flex-wrap">
              <Link
                href="/admin/login"
                style={{ background: GRADIENT }}
                className="inline-flex items-center justify-center text-white font-semibold rounded-full px-6 py-3 shadow-md hover:opacity-95 transition-opacity"
                aria-label="Go to Dashboard"
              >
                Go to Dashboard
              </Link>

              <Link
                href="#"
                className="inline-flex items-center justify-center text-sm text-slate-700 border border-slate-200 rounded-full px-4 py-2 hover:bg-slate-50"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div>
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
              style={{ boxShadow: "0 8px 30px rgba(15,23,42,0.06)" }}
            >
              <div className="rounded-lg overflow-hidden bg-linear-to-r from-[#FFF7EE] to-white border border-transparent p-4">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="text-sm font-medium"
                    style={{ color: PRIMARY }}
                  >
                    Welcome to Mico Portal
                  </div>
                  <div className="text-xs text-slate-500">v1.0</div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-slate-700">Quick actions:</div>
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href="/privacy"
                      className="text-sm px-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50"
                    >
                      View Privacy
                    </Link>

                    <Link
                      href="/delete-account"
                      className="text-sm px-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50"
                    >
                      Delete Account
                    </Link>

                    <Link
                      href="/admin/login"
                      className="text-sm px-3 py-1 rounded-full text-white inline-flex items-center justify-center"
                      style={{ background: PRIMARY }}
                    >
                      Admin Portal
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section variants={fadeUp} className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Core features</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            variants={fadeUp}
            className="rounded-xl p-5 bg-white border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ background: GRADIENT }}
                aria-hidden
              >
                PP
              </div>
              <div>
                <h3 className="font-semibold">Privacy Policy Access</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Transparent, easy access to privacy terms and audit logs for
                  every user.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-xl p-5 bg-white border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ background: PRIMARY }}
                aria-hidden
              >
                ✖
              </div>
              <div>
                <h3 className="font-semibold">Account Deletion</h3>
                <p className="text-sm text-slate-600 mt-1">
                  One-click deletion workflows that fully respect user requests
                  and data retention policies.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-xl p-5 bg-white border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{
                  background: "linear-gradient(90deg, #FFB87A, #FF6B35)",
                }}
                aria-hidden
              >
                🔒
              </div>
              <div>
                <h3 className="font-semibold">Secure Admin Portal</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Role-based access, audit trails, and secure integrations for
                  admins and support teams.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={fadeUp}
        className="max-w-6xl mx-auto px-6 py-8 border-t border-slate-100"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Mico Portal. All rights reserved.
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-sm px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-sm px-3 py-2 rounded-md hover:bg-slate-50"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Contact
            </a>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
