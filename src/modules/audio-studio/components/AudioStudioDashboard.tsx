"use client";

import { motion } from "framer-motion";
import { Upload, Play, CheckCircle, Loader2, Music } from "lucide-react";
import { useAudioStore } from "../store/useAudioStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPE = "audio/";

export function AudioStudioDashboard() {
  const { task, setFile, setOperation, processAudio, reset } = useAudioStore();
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
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith(ALLOWED_TYPE) && file.size <= MAX_FILE_SIZE) {
      setFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file && file.type.startsWith(ALLOWED_TYPE) && file.size <= MAX_FILE_SIZE) {
      setFile(file);
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
          <h2 className="text-xl font-semibold text-white mb-4">1. Select Audio</h2>
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
              dragActive ? "border-violet-500 bg-violet-500/10" : "border-slate-700 hover:border-slate-500",
              task.file ? "border-emerald-500 bg-emerald-500/10" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("audio-upload")?.click()}
          >
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
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
                <Music className="w-10 h-10 text-slate-400" />
                <p className="text-slate-300 font-medium">Drag & drop your audio here</p>
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
            {(["master", "split", "pitch", "export"] as const).map((op) => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  task.operation === op
                    ? "border-violet-500 bg-violet-500/20 text-violet-300"
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
          onClick={processAudio}
          disabled={!task.file || task.operation === "idle" || task.status === "processing"}
          className={cn(
            "flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg transition-all",
            !task.file || task.operation === "idle"
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : task.status === "processing"
              ? "bg-violet-600 text-white cursor-wait"
              : task.status === "success"
              ? "bg-emerald-600 text-white"
              : "bg-violet-500 hover:bg-violet-400 text-white hover:scale-105 active:scale-95"
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
              className="bg-violet-500 h-full"
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
            Process another audio
          </button>
        )}
      </motion.div>
    </div>
  );
}
