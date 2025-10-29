"use client";

import React from "react";
import { motion } from "framer-motion";

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: string;
  gradient?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, delta, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500">{title}</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1">{value}</div>
        </div>
        {delta && (
          <div
            className="text-sm font-medium px-3 py-1 rounded-full text-white"
            style={{ background: gradient || "#FC7000" }}
          >
            {delta}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default KpiCard;
