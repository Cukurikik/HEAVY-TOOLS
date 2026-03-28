"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Play, CheckCircle, Loader2, Download, RefreshCcw, Image as ImageIcon, Settings2, ChevronLeft, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useImageStore } from "../store/useImageStore";

interface ImageToolInterfaceProps {
  toolId: string;
  title: string;
  description: string;
  options?: React.ReactNode;
  isMultiFile?: boolean;
}

export function ImageToolInterface({
  toolId,
  title,
  description,
  options,
  isMultiFile = false,
}: ImageToolInterfaceProps) {
  const { task, setFile, addFiles, setOperation, processImage, reset } = useImageStore();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOperation(toolId);
    return () => reset();
  }, [toolId, setOperation, reset]);

  const MAX_SIZE = 50 * 1024 * 1024; // 50MB per image

  const imagePreviewUrl = useMemo(() => {
    if (task.file) return URL.createObjectURL(task.file);
    return null;
  }, [task.file]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") && f.size <= MAX_SIZE
    );
    if (isMultiFile) {
      if (files.length > 0) addFiles(files);
    } else if (files[0]) {
      setFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = (e.target.files ? Array.from(e.target.files) : []).filter(
      (f) => f.type.startsWith("image/") && f.size <= MAX_SIZE
    );
    if (isMultiFile) {
      if (files.length > 0) addFiles(files);
    } else if (files[0]) {
      setFile(files[0]);
    }
  };

  const canProcess = task.file && task.status !== "processing";

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <Link
            href="/image"
            className="group p-4 rounded-2xl bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all shadow-sm"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="space-y-1">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground font-medium"
            >
              {description}
            </motion.p>
          </div>
        </div>

        {(task.file || task.files.length > 0) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={reset}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all font-bold text-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Reset Workspace</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Upload & Canvas Preview */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "relative aspect-[4/3] rounded-[2.5rem] border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center bg-card/40 backdrop-blur-2xl shadow-xl",
              dragActive
                ? "border-pink-500 bg-pink-500/10 scale-[1.02]"
                : "border-border hover:border-border/80",
              task.file ? "border-emerald-500/30" : ""
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
              accept="image/*"
              multiple={isMultiFile}
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
                    <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full group-hover:bg-pink-500/40 transition-all" />
                    <div className="relative w-24 h-24 rounded-3xl bg-slate-800/80 dark:bg-slate-900 border border-border/50 flex items-center justify-center text-pink-500 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-foreground">
                      {isMultiFile ? "Drop your images here" : "Drop your image here"}
                    </p>
                    <p className="text-muted-foreground font-medium">
                      PNG, JPG, WebP, AVIF up to 50MB
                    </p>
                  </div>
                  <div className="px-8 py-3 bg-pink-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pink-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-500/20">
                    {isMultiFile ? "Select Images" : "Select Image"}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <div className="absolute inset-0 p-4">
                    {imagePreviewUrl && (
                       // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={imagePreviewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain rounded-2xl bg-black/5"
                      />
                    )}
                  </div>
                  
                  {/* File Info Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-12">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl backdrop-blur-xl">
                        <ImageIcon className="w-7 h-7" />
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <p className="text-lg font-bold text-white truncate">
                          {task.file.name}
                        </p>
                        <p className="text-sm text-emerald-400/80 font-bold uppercase tracking-widest">
                          {(task.file.size / (1024 * 1024)).toFixed(2)} MB • RAW
                        </p>
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
                  className="p-8 rounded-[2rem] bg-pink-500/10 border border-pink-500/20 shadow-2xl backdrop-blur-xl space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-pink-500">Compiling Matrix</h3>
                        <p className="text-pink-500/60 text-sm font-medium">
                          Executing WebAssembly Pipeline...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-pink-500">{task.progress}%</span>
                    </div>
                  </div>
                  <div className="relative w-full h-4 bg-card rounded-full overflow-hidden p-1 border border-border/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pink-500 to-orange-400 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)]"
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
                      <h3 className="text-2xl font-black text-foreground">RENDER SUCCESS</h3>
                      <p className="text-emerald-500 font-medium">
                        Image matrix successfully processed locally.
                      </p>
                    </div>
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={task.resultUrl}
                    download={`processed_${task.file?.name || "image.webp"}`}
                    className="w-full md:w-auto flex items-center justify-center space-x-3 px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/30 transition-all hover:bg-emerald-600"
                  >
                    <Download className="w-6 h-6" />
                    <span>DOWNLOAD</span>
                  </motion.a>
                </motion.div>
              )}

              {task.status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-[2rem] bg-destructive/10 border border-destructive/20 shadow-2xl backdrop-blur-xl flex items-center space-x-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-destructive flex items-center justify-center text-white shadow-xl shrink-0">
                    <X className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-destructive">ENGINE FAILURE</h3>
                    <p className="text-destructive/80 font-medium whitespace-pre-wrap">
                      {task.error || "An unexpected error occurred during processing."}
                    </p>
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
            className="p-8 rounded-[2.5rem] bg-card/40 border border-border/50 backdrop-blur-2xl shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-foreground">
                <SlidersHorizontal className="w-6 h-6 text-pink-500" />
                <h2 className="text-xl font-black tracking-tight">PARAMS</h2>
              </div>
            </div>

            <div className="space-y-6">
              {options || (
                <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 text-muted-foreground text-sm text-center italic font-medium">
                  Select an image to process directly without parameters.
                </div>
              )}
            </div>

            <motion.button
              whileHover={canProcess ? { scale: 1.02, y: -4 } : {}}
              whileTap={canProcess ? { scale: 0.98 } : {}}
              onClick={processImage}
              disabled={!canProcess}
              className={cn(
                "w-full flex items-center justify-center space-x-4 py-6 rounded-[1.5rem] font-black text-xl transition-all shadow-2xl",
                !canProcess
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-pink-500/30 hover:shadow-orange-400/30"
              )}
            >
              {task.status === "processing" ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <Play className="w-7 h-7 fill-current" />
              )}
              <span>{task.status === "processing" ? "RENDERING..." : "START ENGINE"}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
