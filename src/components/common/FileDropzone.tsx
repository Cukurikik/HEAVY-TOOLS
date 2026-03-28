import React, { useCallback, useState } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File as FileIcon, X, Check, ServerCog, HardDrive } from 'lucide-react';
import { useOmniSetting } from '@/hooks/useOmniSetting';

interface PremiumDropzoneProps extends Omit<DropzoneOptions, 'onDrop'> {
  onFilesAccepted: (files: File[]) => void;
  activeFiles?: File[];
  title?: string;
  subtitle?: string;
  isOPFSEnabled?: boolean; // Toggles visual indicator that file routes to Origin Private File System
  onClearFiles?: () => void;
  className?: string;
}

const byteToMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);

export default function FileDropzone({
  onFilesAccepted,
  activeFiles = [],
  title = "Drag & Drop Data Payload",
  subtitle = "Secure local-first processing. No server uploads.",
  isOPFSEnabled = false,
  onClearFiles,
  className = "",
  ...dropzoneProps
}: PremiumDropzoneProps) {
  
  const [isHovering, setIsHovering] = useState(false);

  // Read Global Settings Reatively
  const isGlassmorphismEnabled = useOmniSetting('efek-blur-glassmorphism-toggle-meningkatkan-f_enabled', true);
  const isAnimationDisabled = useOmniSetting('toggle-animasi-ui-framer-motion-gsap-disable_enabled', false);

  // Dynamically compute visual classes based on engine settings
  const glassClasses = isGlassmorphismEnabled
    ? "backdrop-blur-xl bg-slate-900/40"
    : "bg-slate-900";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    ...dropzoneProps
  });

  const rootProps = getRootProps();
  const { onAnimationStart, onDragStart, onDragEnd, onDrag, ...restRootProps } = rootProps as any;

  return (
    <div className={`relative w-full ${className}`}>
      <motion.div
        {...restRootProps}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        animate={{
          scale: isDragActive ? 0.98 : 1,
          borderColor: isDragReject 
            ? "rgba(239, 68, 68, 0.5)" 
            : isDragActive 
              ? "rgba(16, 185, 129, 0.7)" 
              : isHovering 
                ? "rgba(56, 189, 248, 0.5)" 
                : "rgba(51, 65, 85, 0.4)",
          backgroundColor: isDragReject
            ? (isGlassmorphismEnabled ? "rgba(239, 68, 68, 0.05)" : "rgb(239, 68, 68)")
            : isDragActive
              ? (isGlassmorphismEnabled ? "rgba(16, 185, 129, 0.05)" : "rgba(16, 185, 129, 0.4)")
              : isHovering 
                ? (isGlassmorphismEnabled ? "rgba(15, 23, 42, 0.6)" : "rgba(30, 41, 59, 1)")
                : (isGlassmorphismEnabled ? "rgba(15, 23, 42, 0.4)" : "rgba(15, 23, 42, 1)")
        }}
        transition={{ 
          type: "spring", stiffness: 300, damping: 25,
          duration: isAnimationDisabled ? 0 : undefined
        }}
        className={`relative flex flex-col items-center justify-center w-full min-h-[320px] 
                   border-2 border-dashed rounded-3xl overflow-hidden cursor-pointer
                   shadow-2xl transition-all duration-500 ease-out ${glassClasses}`}
      >
        <input {...getInputProps()} />

        {/* Ambient Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <motion.div 
            animate={{ 
              opacity: isDragActive ? [0.4, 0.8, 0.4] : 0,
              scale: isDragActive ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: isAnimationDisabled ? 0 : 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"
          />
        </div>

        <AnimatePresence mode="wait">
          {activeFiles.length > 0 ? (
            <motion.div
              key="active-state"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="flex flex-col items-center text-center p-8 z-10 w-full"
              onClick={(e) => {
                // Prevent opening file dialog if clicking just to clear
                if ((e.target as HTMLElement).closest('.clear-btn')) {
                  e.stopPropagation();
                }
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {activeFiles.slice(0, 3).map((file, idx) => (
                  <motion.div 
                    key={`${file.name}-${idx}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: isAnimationDisabled ? 0 : idx * 0.1 }}
                    className={`flex flex-col items-center border border-slate-700/50 
                               rounded-2xl p-4 shadow-xl group hover:border-emerald-500/50 transition-colors
                               ${isGlassmorphismEnabled ? 'bg-slate-900/80 backdrop-blur-md' : 'bg-slate-800'}`}
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 
                                    flex items-center justify-center mb-3 shadow-inner">
                      <FileIcon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className="text-slate-200 font-semibold mb-1 w-full truncate px-2">{file.name}</p>
                    <p className="text-slate-400 text-xs font-mono">{byteToMB(file.size)} MB • {file.type || "Raw File"}</p>
                  </motion.div>
                ))}
                {activeFiles.length > 3 && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center justify-center bg-slate-800/50 border border-slate-700/30 rounded-2xl p-4"
                  >
                    <span className="text-slate-400 font-bold text-lg">+{activeFiles.length - 3} More</span>
                  </motion.div>
                )}
              </div>

              {onClearFiles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); onClearFiles(); }}
                  className="clear-btn mt-8 flex items-center gap-2 px-6 py-2 rounded-full 
                             bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 
                             text-red-400 text-sm font-semibold transition-colors"
                >
                  <X className="w-4 h-4" /> Clear Files
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center p-8 text-center z-10"
            >
              <div className="relative mb-6">
                <motion.div
                  animate={{ y: isDragActive ? -10 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 
                             flex items-center justify-center shadow-2xl border border-slate-600/50"
                >
                  <UploadCloud className={`w-10 h-10 transition-colors duration-300 ${isDragActive ? "text-emerald-400" : isHovering ? "text-cyan-400" : "text-slate-400"}`} />
                </motion.div>
                
                {isHovering && !isDragActive && (
                  <motion.div 
                   initial={{ opacity: 0, scale: 0 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-900 p-1.5 rounded-full shadow-lg"
                  >
                    <Check className="w-4 h-4 font-bold" />
                  </motion.div>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                {title}
              </h2>
              <p className="text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                {isDragActive ? (
                  <span className="text-emerald-400">Release payload into the Web Worker matrix...</span>
                ) : (
                  subtitle
                )}
              </p>

              {/* OPFS Indicator Tag */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700/50">
                   <ServerCog className="w-4 h-4 text-cyan-500" />
                   <span className="text-xs font-bold text-slate-300">WASM Ready</span>
                </div>
                {isOPFSEnabled && (
                  <div className="flex items-center gap-2 bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-500/20">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">OPFS Direct Tunneling</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
