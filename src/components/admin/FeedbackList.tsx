"use client";

import React from "react";
import { motion } from "framer-motion";

interface FeedbackItem {
  id: string | number;
  user: string;
  text: string;
  date: string;
}

interface FeedbackListProps {
  items: FeedbackItem[];
}

export const FeedbackList: React.FC<FeedbackListProps> = ({ items }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4"
    >
      <div className="text-sm font-medium text-slate-800 mb-3">Quick Feedback</div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="text-sm">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="text-slate-800 font-medium">{it.user}</div>
                <div className="text-slate-600 text-sm">{it.text}</div>
              </div>
              <div className="text-xs text-slate-400">{it.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default FeedbackList;
