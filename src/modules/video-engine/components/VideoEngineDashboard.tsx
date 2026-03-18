"use client";

import { motion } from "framer-motion";
import { Upload, Play, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useVideoStore } from "../store/useVideoStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function VideoEngineDashboard() {
  const { task, setFile, setOperation, processVideo, reset } = useVideoStore();
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
          <h2 className="text-xl font-semibold text-white mb-4">1. Select Video</h2>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
              dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 hover:border-slate-500",
              task.file ? "border-emerald-500 bg-emerald-500/10" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("video-upload")?.click()}
          >
            <input
              id="video-upload"
              type="file"
              accept="video/*"
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
                <Upload className="w-10 h-10 text-slate-400" />
                <p className="text-slate-300 font-medium">Drag & drop your video here</p>
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
            {(["trim", "merge", "convert", "stabilize"] as const).map((op) => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  task.operation === op
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
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
          onClick={processVideo}
          disabled={!task.file || task.operation === "idle" || task.status === "processing"}
          className={cn(
            "flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg transition-all",
            !task.file || task.operation === "idle"
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : task.status === "processing"
              ? "bg-indigo-600 text-white cursor-wait"
              : task.status === "success"
              ? "bg-emerald-600 text-white"
              : "bg-indigo-500 hover:bg-indigo-400 text-white hover:scale-105 active:scale-95"
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
              className="bg-indigo-500 h-full"
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
            Process another video
          </button>
        )}
      </motion.div>
    </div>
  );
}
