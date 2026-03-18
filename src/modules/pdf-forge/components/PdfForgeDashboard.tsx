"use client";

import { motion } from "framer-motion";
import { Upload, Play, CheckCircle, Loader2, FileText } from "lucide-react";
import { usePdfStore } from "../store/usePdfStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function PdfForgeDashboard() {
  const { task, setFile, setOperation, processPdf, reset } = usePdfStore();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold text-white mb-4">1. Select PDF</h2>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
              dragActive ? "border-red-500 bg-red-500/10" : "border-slate-700 hover:border-slate-500",
              task.file ? "border-emerald-500 bg-emerald-500/10" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("pdf-upload")?.click()}
          >
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleChange}
            />
            {task.file ? (
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
                <p className="text-emerald-300 font-medium">{task.file.name}</p>
                <p className="text-sm text-emerald-400/70">
                  {(task.file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <FileText className="w-10 h-10 text-slate-400" />
                <p className="text-slate-300 font-medium">Drag & drop your PDF here</p>
                <p className="text-sm text-slate-500">or click to browse files</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold text-white mb-4">2. Select Operation</h2>
          <div className="grid grid-cols-2 gap-4">
            {(["merge", "split", "compress", "sign"] as const).map((op) => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  task.operation === op
                    ? "border-red-500 bg-red-500/20 text-red-300"
                    : "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600"
                )}
              >
                <span className="capitalize font-medium">{op}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center"
      >
        <button
          onClick={processPdf}
          disabled={!task.file || task.operation === "idle" || task.status === "processing"}
          className={cn(
            "flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg transition-all",
            !task.file || task.operation === "idle"
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : task.status === "processing"
              ? "bg-red-600 text-white cursor-wait"
              : task.status === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-500 hover:bg-red-400 text-white hover:scale-105 active:scale-95"
          )}
        >
          {task.status === "processing" ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Processing... {task.progress}%</span>
            </>
          ) : task.status === "success" ? (
            <>
              <CheckCircle className="w-6 h-6" />
              <span>Completed!</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              <span>Start Processing</span>
            </>
          )}
        </button>

        {task.status === "processing" && (
          <div className="w-full max-w-md mt-6 bg-slate-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-red-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${task.progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        )}

        {task.status === "success" && (
          <button
            onClick={reset}
            className="mt-4 text-slate-400 hover:text-white underline text-sm"
          >
            Process another PDF
          </button>
        )}
      </motion.div>
    </div>
  );
}
