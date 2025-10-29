"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChartCardProps {
  data: number[];
  title?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ data, title }) => {
  const max = Math.max(...data, 1);
  const width = 300;
  const height = 120;
  const stepX = width / Math.max(1, data.length - 1);

  const points = data
    .map((d, i) => `${i * stepX},${height - (d / max) * height}`)
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-medium text-slate-800">{title || "Revenue Summary"}</div>
          <div className="text-xs text-slate-500">Last 7 days</div>
        </div>
  <div className="text-sm text-slate-600">INR</div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#F7931E" />
              <stop offset="100%" stopColor="#FF6B35" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#g1)"
            strokeWidth={3}
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default ChartCard;
