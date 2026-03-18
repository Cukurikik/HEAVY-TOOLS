"use client";

import { motion } from "framer-motion";
import { ConverterDashboard } from "@/modules/converter";

export default function Converter() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-6"
      >
        Universal Converter
      </motion.h1>
      <ConverterDashboard />
    </div>
  );
}
