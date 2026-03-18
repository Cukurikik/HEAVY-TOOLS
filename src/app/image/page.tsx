"use client";

import { motion } from "framer-motion";
import { ImageMatrixDashboard } from "@/modules/image-matrix";

export default function ImageMatrix() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-6"
      >
        Image Matrix
      </motion.h1>
      <ImageMatrixDashboard />
    </div>
  );
}
