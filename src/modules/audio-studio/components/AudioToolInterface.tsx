"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Play, CheckCircle, Loader2, Download,
  RefreshCcw, Music, Settings2, ChevronLeft, Plus, X,
} from "lucide-react";
import { useAudioStore } from "../store/useAudioStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AudioOperation } from "../types";

interface AudioToolInterfaceProps {
  toolId: AudioOperation;
  title: string;
  description: string;
  options?: React.ReactNode;
  isRecorder?: boolean;
  isMultiFile?: boolean;
  isAnalyzer?: boolean;
}

export function AudioToolInterface({
  toolId, title, description, options,
  isRecorder = false, isMultiFile = false, isAnalyzer = false,
}: AudioToolInterfaceProps) {
  const { task, setFile, addFiles, setOperation, processAudio, reset } = useAudioStore();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const audioPreviewUrl = useMemo(() => {
    if (task.file) return URL.createObjectURL(task.file);
    return null;
  }, [task.file]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (isMultiFile) { addFiles(files); } else if (files[0]) { setFile(files[0]); }
    setOperation(toolId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (isMultiFile) { addFiles(files); } else if (files[0]) { setFile(files[0]); }
    setOperation(toolId);
  };

  const handleProcess = () => {
    if (isRecorder) setOperation(toolId);
    processAudio();
  };

  const canProcess = isRecorder || (task.file && task.status !== "processing");

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <Link href="/audio" className="group p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all backdrop-blur-xl shadow-xl">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="space-y-1">
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-black text-white tracking-tight">{title}</motion.h1>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 font-medium">{description}</motion.p>
          </div>
        </div>
        {(task.file || task.files.length > 0) && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={reset} className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all font-bold text-sm">
            <RefreshCcw className="w-4 h-4" /><span>Reset Tool</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Upload & Preview */}
        <div className="lg:col-span-8 space-y-8">
          {!isRecorder ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={cn(
                "relative rounded-[2.5rem] border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-2xl shadow-2xl min-h-[320px]",
                dragActive ? "border-violet-500 bg-violet-500/10 scale-[1.02]" : "border-white/10 hover:border-white/20",
                task.file ? "border-emerald-500/20" : ""
              )}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => !task.file && fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="audio/*" multiple={isMultiFile} className="hidden" onChange={handleChange} />
              <AnimatePresence mode="wait">
                {!task.file ? (
                  <motion.div key="upload" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center space-y-6 p-12 text-center cursor-pointer group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full group-hover:bg-violet-500/40 transition-all" />
                      <div className="relative w-24 h-24 rounded-3xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-all duration-500">
                        <Upload className="w-10 h-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-white">{isMultiFile ? "Drop your audio files here" : "Drop your audio here"}</p>
                      <p className="text-slate-500 font-medium">MP3, WAV, OGG, FLAC or AAC</p>
                    </div>
                    <div className="px-8 py-3 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                      {isMultiFile ? "Select Files" : "Select File"}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full p-8 space-y-6">
                    {audioPreviewUrl && (
                      <audio src={audioPreviewUrl} controls className="w-full" preload="metadata" />
                    )}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl">
                        <Music className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-white truncate">{task.file.name}</p>
                        <p className="text-sm text-emerald-400/80 font-bold uppercase tracking-widest">{(task.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="relative rounded-[2.5rem] border-2 border-dashed border-red-500/20 overflow-hidden flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-2xl shadow-2xl min-h-[320px]"
            >
              <div className="flex flex-col items-center space-y-6 p-12 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
                  <div className="relative w-24 h-24 rounded-3xl bg-slate-800/80 border border-red-500/20 flex items-center justify-center text-red-400">
                    <Music className="w-10 h-10" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{isAnalyzer ? "Audio Analyzer" : "Audio Recorder"}</p>
                <p className="text-slate-500 font-medium">Click START ENGINE to begin</p>
                {task.status === "processing" && (
                  <div className="flex items-center space-x-2 text-red-400 animate-pulse">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-bold text-sm uppercase tracking-widest">Recording...</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Multi-file list */}
          {isMultiFile && task.files.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 backdrop-blur-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-black text-sm uppercase tracking-widest">{task.files.length} Files Loaded</h3>
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold hover:bg-violet-500/20 transition-all">
                  <Plus className="w-3 h-3" /><span>Add More</span>
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {task.files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5">
                    <div className="flex items-center space-x-3 min-w-0">
                      <Music className="w-5 h-5 text-violet-400 shrink-0" />
                      <span className="text-white text-sm font-medium truncate">{f.name}</span>
                    </div>
                    <span className="text-slate-500 text-xs font-bold shrink-0 ml-2">{(f.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Status Cards */}
          <AnimatePresence mode="wait">
            {task.status === "processing" && (
              <motion.div key="processing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-8 rounded-[2rem] bg-violet-500/10 border border-violet-500/20 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center"><Loader2 className="w-6 h-6 text-violet-400 animate-spin" /></div>
                    <div><h3 className="text-xl font-bold text-white">Audio Engine</h3><p className="text-violet-400/60 text-sm font-medium">Processing audio...</p></div>
                  </div>
                  <span className="text-3xl font-black text-violet-400">{task.progress}%</span>
                </div>
                <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden p-1">
                  <motion.div className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)]" initial={{ width: 0 }} animate={{ width: `${task.progress}%` }} transition={{ type: "spring", stiffness: 50 }} />
                </div>
              </motion.div>
            )}
            {task.status === "success" && (
              <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center space-x-6">
                  <div className="relative"><div className="absolute inset-0 bg-emerald-500/40 blur-2xl rounded-full animate-pulse" /><div className="relative w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl"><CheckCircle className="w-10 h-10" /></div></div>
                  <div><h3 className="text-2xl font-black text-white">MISI SELESAI!</h3><p className="text-emerald-400/80 font-medium">Audio berhasil diproses.</p></div>
                </div>
                <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={task.resultUrl} download={`processed_${task.file?.name || "output.mp3"}`}
                  className="w-full md:w-auto flex items-center justify-center space-x-3 px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/20 transition-all">
                  <Download className="w-6 h-6" /><span>DOWNLOAD NOW</span>
                </motion.a>
              </motion.div>
            )}
            {task.status === "error" && (
              <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 shadow-2xl backdrop-blur-xl flex items-center space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-xl shrink-0"><X className="w-10 h-10" /></div>
                <div><h3 className="text-2xl font-black text-white">ENGINE FAILURE</h3><p className="text-red-400/80 font-medium">{task.error || "An unexpected error occurred."}</p></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Options & Action */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-2xl shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-white"><Settings2 className="w-6 h-6 text-violet-400" /><h2 className="text-xl font-black tracking-tight">CONFIGURATION</h2></div>
              <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest">Studio</div>
            </div>
            <div className="space-y-6">
              {options || <div className="p-6 rounded-2xl bg-slate-800/30 border border-white/5 text-slate-500 text-sm text-center italic font-medium">No additional parameters required.</div>}
            </div>
            <motion.button whileHover={canProcess && task.status !== "processing" ? { scale: 1.02, y: -4 } : {}}
              whileTap={canProcess && task.status !== "processing" ? { scale: 0.98 } : {}}
              onClick={handleProcess} disabled={!canProcess || task.status === "processing"}
              className={cn(
                "w-full flex items-center justify-center space-x-4 py-6 rounded-[1.5rem] font-black text-xl transition-all shadow-2xl",
                !canProcess || task.status === "processing"
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-violet-500/25"
              )}>
              {task.status === "processing" ? <Loader2 className="w-7 h-7 animate-spin" /> : <Play className="w-7 h-7 fill-current" />}
              <span>{task.status === "processing" ? "PROCESSING..." : "START ENGINE"}</span>
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/10 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full group-hover:bg-violet-500/20 transition-all duration-1000" />
            <h3 className="text-violet-400 font-black text-sm mb-3 uppercase tracking-widest">Audio Engine</h3>
            <p className="text-sm text-violet-300/60 leading-relaxed font-medium">
              Powered by <span className="text-violet-400 font-bold">FFmpeg WASM + Web Audio API</span>. All processing runs client-side. Your audio stays private.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
