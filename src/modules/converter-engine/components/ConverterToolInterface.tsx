'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FileIcon, UploadCloud, Settings2, Play, AlertCircle, CheckCircle2, RefreshCw, Download, FileJson, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FileDropzone from '@/components/common/FileDropzone';
import { ConverterOperation } from '../types';
import { getEngineTypeForConverter } from '../core/command-matrix';
import { useConverterStore } from '../store/useConverterStore';
import { useVideoStore } from '@/modules/video-engine/store/useVideoStore';
import { useImageStore } from '@/modules/image-engine/store/useImageStore';
import { useAudioStore } from '@/modules/audio-studio/store/useAudioStore';

// Note: Ensure `downloadFile` helper exists or we use a basic anchor fallback
import { downloadFile } from '@/lib/download';

interface ConverterToolInterfaceProps {
  toolId: ConverterOperation;
  title: string;
  description: string;
  isMultiFile?: boolean;
}

export function ConverterToolInterface({
  toolId, title, description, isMultiFile = false
}: ConverterToolInterfaceProps) {
  
  // 1. Facade Stores Initialization
  const converterStore = useConverterStore();
  const videoStore = useVideoStore();
  const imageStore = useImageStore();
  const audioStore = useAudioStore();

  // 2. Resolve target Engine
  const engineType = getEngineTypeForConverter(toolId);

  // 3. Normalize heterogeneous store schemas into unified adapters
  let file: File | null = null;
  let status: 'idle' | 'loading' | 'processing' | 'success' | 'error' = 'idle';
  let progress: number = 0;
  let error: string | null = null;
  let resultUrls: string[] = [];
  let metadata: Record<string, any> = {};

  let handleSetFile = (f: File) => {};
  let handleProcess = () => {};
  let handleReset = () => {};

  if (engineType === "js-worker") {
    file = converterStore.currentTask?.file || null;
    status = converterStore.status;
    progress = converterStore.progress;
    error = converterStore.error;
    resultUrls = converterStore.currentTask?.resultUrls || [];
    metadata = converterStore.currentTask?.metadata || {};
    handleSetFile = converterStore.setFile;
    handleReset = converterStore.reset;
    handleProcess = () => {
      if (file) converterStore.processConversion({ toolSlug: toolId, file, options: converterStore.currentTask?.options });
    };
  } else if (engineType === "video-engine") {
    // Fallback normalization:
    file = (videoStore as any).currentTask?.file || (videoStore as any).task?.file || null;
    status = (videoStore as any).status;
    progress = (videoStore as any).progress;
    error = (videoStore as any).error;
    resultUrls = (videoStore as any).currentTask?.resultUrl ? [(videoStore as any).currentTask.resultUrl] : [];
    handleSetFile = (videoStore as any).setFile;
    handleReset = (videoStore as any).reset;
    handleProcess = () => {
      (videoStore as any).setOperation?.(toolId);
      if (file) (videoStore as any).processVideo();
    };
  } else if (engineType === "image-engine") {
    file = (imageStore as any).task?.file || null;
    status = (imageStore as any).task?.status || 'idle';
    progress = (imageStore as any).task?.progress || 0;
    error = (imageStore as any).task?.error || null;
    resultUrls = (imageStore as any).task?.resultUrl ? [(imageStore as any).task.resultUrl] : [];
    handleSetFile = (imageStore as any).setFile;
    handleReset = (imageStore as any).reset;
    handleProcess = () => {
      (imageStore as any).setOperation?.(toolId);
      if (file) (imageStore as any).processImage();
    };
  } else if (engineType === "audio-engine") {
    file = (audioStore as any).currentTask?.file || (audioStore as any).task?.file || null;
    status = (audioStore as any).status;
    progress = (audioStore as any).progress;
    error = (audioStore as any).error;
    resultUrls = (audioStore as any).currentTask?.resultUrls || ((audioStore as any).currentTask?.resultUrl ? [(audioStore as any).currentTask.resultUrl] : []);
    handleSetFile = (audioStore as any).setFile;
    handleReset = (audioStore as any).reset;
    handleProcess = () => {
      (audioStore as any).setOperation?.(toolId);
      if (file) (audioStore as any).processAudio();
    };
  } else {
    // UI-Only Mock
    handleSetFile = converterStore.setFile;
    handleProcess = () => alert("UI-Only Tool executed (Mock).");
  }

  const activeFile = file;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleSetFile(acceptedFiles[0]); // Simple fallback to 1 file for now
    }
  }, [handleSetFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        
        {/* Header Block */}
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              {title}
            </span>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase">
              {engineType}
            </div>
          </h2>
          <p className="text-slate-400 mt-2 text-lg leading-relaxed">{description}</p>
        </div>

        {/* Premium Universal Upload Zone */}
        <FileDropzone 
          onFilesAccepted={(files) => handleSetFile(files[0])}
          activeFiles={activeFile ? [activeFile] : []}
          onClearFiles={handleReset}
          isOPFSEnabled={true}
          title="Drag & Drop Target Matrix"
          subtitle="Tarik file GB-tier langsung memori lokal Browser. 100% Client-Side Private."
        />

        {/* Execution & Validation Bound */}
        <AnimatePresence mode="popLayout">
          {(status === 'processing' || status === 'loading') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-6 border-slate-800 bg-slate-900/80 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                    <span className="text-white font-medium">Native ArrayBuffer Threads Running...</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </Card>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <Card className="p-5 border-red-500/30 bg-red-500/10 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-semibold">Parser Matrix Failure</h4>
                  <p className="text-red-300/80 text-sm mt-1">{error}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {status === 'success' && resultUrls && resultUrls.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <Card className="p-6 border-emerald-500/30 bg-emerald-500/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-emerald-400 font-bold text-lg">Konversi Berhasil Mutlak</h4>
                      <p className="text-emerald-500/80 text-sm">Target parser mengeksekusi buffer sempurna.</p>
                      
                      {metadata.hash && (
                        <div className="mt-3 flex items-center gap-2 bg-slate-900 rounded p-2 border border-slate-800">
                          <Hash className="w-4 h-4 text-cyan-400" />
                          <span className="font-mono text-cyan-400 text-xs w-64 truncate select-all">{metadata.hash}</span>
                        </div>
                      )}
                      
                      {metadata.inferredFormat && (
                        <div className="mt-3 bg-slate-900 rounded p-3 border border-slate-800 max-h-32 overflow-y-auto">
                          <p className="text-xs text-slate-400">Magic Bytes Inferred Format:</p>
                          <p className="font-bold text-emerald-400">{metadata.inferredFormat}</p>
                          <p className="font-mono text-xs text-slate-500 mt-1 break-all">{metadata.hexDump}</p>
                        </div>
                      )}

                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleReset} className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                      <RefreshCw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                    {/* Exclude Hash/MagicByte metadata-only downloads */}
                    {!metadata.hash && !metadata.inferredFormat && (
                       <Button onClick={() => downloadFile(resultUrls[0], `omni_${activeFile?.name}` || "omni_converted_output")} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                         <Download className="w-4 h-4 mr-2" /> Direct DL
                       </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Side Control Panel */}
      <div className="space-y-6">
        <Card className="p-6 border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <Settings2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Parser Options</h3>
          </div>
          
          <div className="text-sm text-slate-400 italic mb-6">
            Parameter konfigurasi akan masuk ke Native Worker thread.
          </div>

          <Button 
            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-xl shadow-emerald-500/20 disabled:opacity-50 transition-all active:scale-[0.98]"
            disabled={!activeFile || status === 'processing' || status === 'loading'}
            onClick={handleProcess}
          >
            {status === 'processing' || status === 'loading' ? (
              <span className="flex items-center"><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> EXECUTING...</span>
            ) : (
              <span className="flex items-center"><Play className="w-5 h-5 mr-2 fill-current" /> EXECUTE NATIVE</span>
            )}
          </Button>
        </Card>
        
        {/* Memory Stats Panel */}
        <Card className="p-6 border-slate-800 bg-slate-900/50 backdrop-blur-xl">
            <h3 className="font-semibold text-slate-200 mb-4 text-sm flex items-center gap-2">
               <FileJson className="w-4 h-4 text-slate-400" /> V8 Memory Thread
            </h3>
            <div className="space-y-3">
               <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Active Isolates</span>
                  <span className="text-emerald-400 font-mono">1 </span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-slate-400">ArrayBuffer Proxy</span>
                  <span className="text-emerald-400 font-mono">OPFS Ready</span>
               </div>
               <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 w-1/4 h-full" />
               </div>
            </div>
        </Card>
      </div>
    </div>
  );
}
