'use client';
import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Download, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { usePdfStore } from '../store/usePdfStore';

interface PdfToolInterfaceProps {
  title: string;
  description: string;
  gradient: string;
  acceptMultiple?: boolean;
  children?: React.ReactNode;
}

export default function PdfToolInterface({ title, description, gradient, acceptMultiple = false, children }: PdfToolInterfaceProps) {
  const { task, setFiles, processPdf, reset } = usePdfStore();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const pdfs = Array.from(fileList);
    if (pdfs.length > 0) setFiles(pdfs);
  }, [setFiles]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className={`bg-gradient-to-r ${gradient} p-6 rounded-2xl`}>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-white/80 mt-2">{description}</p>
        </div>

        {/* Upload Zone */}
        {task.files.length === 0 ? (
          <motion.div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              dragOver ? 'border-blue-400 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'
            }`}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-300 text-lg">Drop PDF file{acceptMultiple ? 's' : ''} here</p>
            <p className="text-gray-500 text-sm mt-2">or click to browse</p>
            <input ref={inputRef} type="file" accept=".pdf,image/*" multiple={acceptMultiple} className="hidden"
              onChange={(e) => handleFiles(e.target.files)} />
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* File List */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-2">
              {task.files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <FileText className="h-5 w-5 text-red-400" />
                  <span className="flex-1 truncate">{f.name}</span>
                  <span className="text-gray-500 text-sm">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
              <button onClick={reset} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 mt-2">
                <X className="h-4 w-4" /> Remove all
              </button>
            </div>

            {/* Options */}
            {children && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Options</h3>
                {children}
              </div>
            )}

            {/* Progress */}
            <AnimatePresence>
              {task.status === 'processing' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                    <span className="text-white">Processing... {Math.round(task.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <motion.div className={`bg-gradient-to-r ${gradient} h-3 rounded-full`}
                      animate={{ width: `${task.progress}%` }} transition={{ duration: 0.3 }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            {task.status === 'success' && task.resultUrl && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                  <span className="text-green-300 font-semibold flex-1">Processing complete!</span>
                  <a href={task.resultUrl} download={`output_${task.operation}.pdf`}
                    className={`bg-gradient-to-r ${gradient} text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:opacity-90`}>
                    <Download className="h-4 w-4" /> Download
                  </a>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {task.status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <span className="text-red-300">{task.error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button onClick={processPdf} disabled={task.status === 'processing'}
                className={`flex-1 bg-gradient-to-r ${gradient} text-white py-3 rounded-xl font-semibold
                  hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2`}>
                {task.status === 'processing' ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</> : 'Process PDF'}
              </button>
              <button onClick={reset} className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700">Reset</button>
            </div>
          </div>
        )}

        {/* Page Info */}
        {task.pages.length > 0 && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">{task.pages.length} pages · {task.pages[0]?.width}×{task.pages[0]?.height}pt</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
