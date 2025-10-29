"use client";
// ...existing code...
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PRIMARY = "#FC7000";
const GRADIENT = "linear-gradient(90deg, #F7931E, #FF6B35)";

import { Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Parse JWT payload without external deps (handles base64url)
  const parseJwt = (token: string) => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
      const json = atob(padded);
      return JSON.parse(json);
    } catch (err) {
      console.warn('Failed to parse JWT:', err);
      return null;
    }
  };

  // On mount, check for existing token and validate expiry -> redirect if valid
  useEffect(() => {
    try {
      const token = localStorage.getItem("mico_token");
      if (!token) {
        setCheckingSession(false);
        return;
      }

      interface JWTPayload {
        exp: number;
        [key: string]: unknown;
      }
      const payload = parseJwt(token) as JWTPayload | null;
      if (payload && payload.exp) {
        const expMs = payload.exp * 1000;
        if (expMs > Date.now()) {
          // still valid
          router.push("/admin/dashboard");
          return;
        }
      }

      // invalid/expired
      localStorage.removeItem("mico_token");
    } catch (err) {
      console.error('Failed to check session:', err);
    } finally {
      setCheckingSession(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // store token and redirect
      if (data?.token) {
        try {
          localStorage.setItem("mico_token", data.token);
        } catch (err) {
          console.error('Failed to store token:', err);
        }
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6 py-12 text-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-300 mb-4" />
          <div className="text-sm text-slate-600">Checking session...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-12 text-slate-900">
      <motion.div
        initial="hidden"
        animate="show"
        variants={cardVariants}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div
            className="inline-block text-2xl font-semibold rounded-md px-3 py-1"
            style={{ color: PRIMARY }}
          >
            Mico Admin
          </div>
        </div>
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
          style={{ boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}
        >
          <h2 className="text-xl font-semibold mb-2 text-slate-900">
            Admin login
          </h2>
          <p className="text-sm text-slate-700 mb-6">
            Sign in to access the admin dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200/60 focus:border-orange-300"
                placeholder="you@company.com"
                aria-label="Email"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-800 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200/60 focus:border-orange-300"
                placeholder="••••••••"
                aria-label="Password"
                disabled={loading}
                required
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex items-center justify-between mt-1">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-white font-semibold shadow-md disabled:opacity-70"
                style={{
                  background: GRADIENT,
                }}
                aria-label="Login"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </motion.button>

              <a
                href="#"
                className="text-sm text-slate-700 hover:underline ml-4"
                onClick={(e) => {
                  e.preventDefault();
                  // Placeholder - could open forgot flow
                  alert("Forgot password flow (mock)");
                }}
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </motion.div>

        <div className="text-center text-xs text-slate-500 mt-4">
          © {new Date().getFullYear()} Mico Portal — Admin
        </div>
      </motion.div>
    </main>
  );
}
