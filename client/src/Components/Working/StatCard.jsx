import React from "react";
import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function StatCard({ icon, number, label, sublabel }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      className="stat-card bg-[#3a4167] border border-slate-100 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4"
    >
      <motion.img
        src={icon}
        alt={label}
        className="w-12 h-12 mb-2 "
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.8 }}
      />
      <motion.h2
        className="text-4xl font-bold text-orange-400"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {number}
      </motion.h2>
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-wider text-gray-300">
          {label}
        </p>
        <p className="text-sm text-gray-300 tracking-wider">{sublabel}</p>
      </div>
    </motion.div>
  );
}

export default StatCard;
