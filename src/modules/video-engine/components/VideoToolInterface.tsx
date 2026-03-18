"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Play, 
  CheckCircle, 
  Loader2, 
  Download, 
  RefreshCcw, 
  FileVideo,
  Settings2,
  ChevronLeft
} from "lucide-react";
import { useVideoStore } from "../store/useVideoStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { VideoOperation } from "../types";

interface VideoToolInterfaceProps {
  toolId: VideoOperation;
  title: string;
  description: string;
  options?: React.ReactNode;
}

export function VideoToolInterface({ toolId, title, description, options }: VideoToolInterfaceProps) {
  const { task, setFile, setOperation, processVideo, reset } = useVideoStore();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setOperation(toolId);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOperation(toolId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <Link 
            href="/video"
            className="group p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all backdrop-blur-xl shadow-xl"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="space-y-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-white tracking-tight"
            >
              {title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 font-medium"
            >
              {description}
            </motion.p>
          </div>
        </div>

        {task.file && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={reset}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all font-bold text-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Reset Tool</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Upload & Preview */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "relative aspect-video rounded-[2.5rem] border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-2xl shadow-2xl",
              dragActive ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-white/10 hover:border-white/20",
              task.file ? "border-emerald-500/20" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !task.file && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleChange}
            />

            <AnimatePresence mode="wait">
              {!task.file ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center space-y-6 p-12 text-center cursor-pointer group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full group-hover:bg-indigo-500/40 transition-all" />
                    <div className="relative w-24 h-24 rounded-3xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Upload className="w-10 h-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-white">Drop your video here</p>
                    <p className="text-slate-500 font-medium">MP4, MKV, AVI or MOV up to 500MB</p>
                  </div>
                  <div className="px-8 py-3 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                    Select File
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col group"
                >
                  <div className="flex-1 flex items-center justify-center bg-black/60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                    <FileVideo className="w-32 h-32 text-indigo-400 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                    
                    {/* File Info Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl backdrop-blur-xl">
                          <FileVideo className="w-8 h-8" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-lg font-bold text-white truncate max-w-[300px]">
                            {task.file.name}
                          </p>
                          <p className="text-sm text-emerald-400/80 font-bold uppercase tracking-widest">
                            {(task.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="wait">
              {task.status === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 shadow-2xl backdrop-blur-xl space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Processing Engine</h3>
                        <p className="text-indigo-400/60 text-sm font-medium">Executing FFmpeg commands...</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-indigo-400">{task.progress}%</span>
                    </div>
                  </div>
                  <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden p-1">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ type: "spring", stiffness: 50 }}
                    />
                  </div>
                </motion.div>
              )}

              {task.status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8"
                >
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/40 blur-2xl rounded-full animate-pulse" />
                      <div className="relative w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">MISSION SUCCESS!</h3>
                      <p className="text-emerald-400/80 font-medium">Your file has been transmuted successfully.</p>
                    </div>
                  </div>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={task.resultUrl} 
                    download={`processed_${task.file?.name || 'video.mp4'}`}
                    className="w-full md:w-auto flex items-center justify-center space-x-3 px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/20 transition-all"
                  >
                    <Download className="w-6 h-6" />
                    <span>DOWNLOAD NOW</span>
                  </motion.a>
                </motion.div>
              )}

              {task.status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 shadow-2xl backdrop-blur-xl flex items-center space-x-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-xl">
                    <RefreshCcw className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">ENGINE FAILURE</h3>
                    <p className="text-red-400/80 font-medium">{task.error || "An unexpected error occurred during processing."}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Options & Action */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-2xl shadow-2xl space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-white">
                <Settings2 className="w-6 h-6 text-indigo-400" />
                <h2 className="text-xl font-black tracking-tight">CONFIGURATION</h2>
              </div>
              <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                Advanced
              </div>
            </div>
            
            <div className="space-y-6">
              {options || (
                <div className="p-6 rounded-2xl bg-slate-800/30 border border-white/5 text-slate-500 text-sm text-center italic font-medium">
                  No additional parameters required for this operation.
                </div>
              )}
            </div>

            <motion.button
              whileHover={task.file && task.status !== "processing" ? { scale: 1.02, y: -4 } : {}}
              whileTap={task.file && task.status !== "processing" ? { scale: 0.98 } : {}}
              onClick={processVideo}
              disabled={!task.file || task.status === "processing"}
              className={cn(
                "w-full flex items-center justify-center space-x-4 py-6 rounded-[1.5rem] font-black text-xl transition-all shadow-2xl",
                !task.file || task.status === "processing"
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25"
              )}
            >
              {task.status === "processing" ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <Play className="w-7 h-7 fill-current" />
              )}
              <span>{task.status === "processing" ? "PROCESSING..." : "START ENGINE"}</span>
            </motion.button>
          </motion.div>

          {/* Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/10 relative overflow-hidden group"
          >
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-all duration-1000" />
            <h3 className="text-emerald-400 font-black text-sm mb-3 uppercase tracking-widest">Security Protocol</h3>
            <p className="text-sm text-emerald-300/60 leading-relaxed font-medium">
              Processing executes via <span className="text-emerald-400 font-bold">Client-Side WASM</span>. Your data remains local, encrypted by browser sandbox isolation. No server-side uploads required.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
