"use client";
import React, { useEffect, useState } from "react";
import { ConverterToolDef } from "../types";
import { useConverterStore } from "../store/useConverterStore";
import dynamic from "next/dynamic";
import FileDropzone from "@/components/common/FileDropzone";
import ProgressBar from "@/components/common/ProgressBar";
import ToastNotification from "@/components/common/ToastNotification";
import { Download, RefreshCw, AlertCircle } from "lucide-react";

// Dynamic map for all 30 options
const OptionComponents: Record<string, React.ComponentType> = {
  // Batch 1
  "image-converter": dynamic(() => import("./tools/ImageConverterOptions").then((m) => m.ImageConverterOptions)),
  "video-converter": dynamic(() => import("./tools/VideoConverterOptions").then((m) => m.VideoConverterOptions)),
  "audio-converter": dynamic(() => import("./tools/AudioConverterOptions").then((m) => m.AudioConverterOptions)),
  "document-converter": dynamic(() => import("./tools/DocumentConverterOptions").then((m) => m.DocumentConverterOptions)),
  "ebook-converter": dynamic(() => import("./tools/EbookConverterOptions").then((m) => m.EbookConverterOptions)),
  // Batch 2
  "json-yaml": dynamic(() => import("./tools/JsonYamlOptions").then((m) => m.JsonYamlOptions)),
  "csv-json": dynamic(() => import("./tools/CsvJsonOptions").then((m) => m.CsvJsonOptions)),
  "xml-json": dynamic(() => import("./tools/XmlJsonOptions").then((m) => m.XmlJsonOptions)),
  "markdown-html": dynamic(() => import("./tools/MarkdownHtmlOptions").then((m) => m.MarkdownHtmlOptions)),
  "base64": dynamic(() => import("./tools/Base64Options").then((m) => m.Base64Options)),
  // Batch 3
  "archive-extractor": dynamic(() => import("./tools/ArchiveExtractorOptions").then((m) => m.ArchiveExtractorOptions)),
  "archive-creator": dynamic(() => import("./tools/ArchiveCreatorOptions").then((m) => m.ArchiveCreatorOptions)),
  "hex-encoder": dynamic(() => import("./tools/HexEncoderOptions").then((m) => m.HexEncoderOptions)),
  "number-system": dynamic(() => import("./tools/NumberSystemOptions").then((m) => m.NumberSystemOptions)),
  "encoding-converter": dynamic(() => import("./tools/EncodingConverterOptions").then((m) => m.EncodingConverterOptions)),
  // Batch 4
  "color-converter": dynamic(() => import("./tools/ColorConverterOptions").then((m) => m.ColorConverterOptions)),
  "unit-converter": dynamic(() => import("./tools/UnitConverterOptions").then((m) => m.UnitConverterOptions)),
  "currency-converter": dynamic(() => import("./tools/CurrencyConverterOptions").then((m) => m.CurrencyConverterOptions)),
  "timezone-converter": dynamic(() => import("./tools/TimezoneConverterOptions").then((m) => m.TimezoneConverterOptions)),
  "hash-generator": dynamic(() => import("./tools/HashGeneratorOptions").then((m) => m.HashGeneratorOptions)),
  // Batch 5
  "heic-converter": dynamic(() => import("./tools/HeicConverterOptions").then((m) => m.HeicConverterOptions)),
  "raw-converter": dynamic(() => import("./tools/RawConverterOptions").then((m) => m.RawConverterOptions)),
  "font-converter": dynamic(() => import("./tools/FontConverterOptions").then((m) => m.FontConverterOptions)),
  "cad-converter": dynamic(() => import("./tools/CadConverterOptions").then((m) => m.CadConverterOptions)),
  "vector-converter": dynamic(() => import("./tools/VectorConverterOptions").then((m) => m.VectorConverterOptions)),
  // Batch 6
  "subtitle-converter": dynamic(() => import("./tools/SubtitleConverterOptions").then((m) => m.SubtitleConverterOptions)),
  "spreadsheet-converter": dynamic(() => import("./tools/SpreadsheetConverterOptions").then((m) => m.SpreadsheetConverterOptions)),
  "qr-generator": dynamic(() => import("./tools/QrGeneratorOptions").then((m) => m.QrGeneratorOptions)),
  "barcode-generator": dynamic(() => import("./tools/BarcodeGeneratorOptions").then((m) => m.BarcodeGeneratorOptions)),
  "magic-byte-detector": dynamic(() => import("./tools/MagicByteDetectorOptions").then((m) => m.MagicByteDetectorOptions)),
};

interface Props {
  tool: ConverterToolDef;
}

export default function ConverterToolInterface({ tool }: Props) {
  const { task, setFiles, setOperation, processConversion, reset } = useConverterStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setOperation(tool.id);
    return () => reset();
  }, [tool.id, setOperation, reset]);

  if (!isMounted) return null;

  const ActiveOptions = OptionComponents[tool.id];

  const handleDownload = () => {
    if (task.outputUrls.length > 0) {
      task.outputUrls.forEach((url: string, i: number) => {
        if (url.startsWith('blob:')) {
            const a = document.createElement("a");
            a.href = url;
            a.download = task.outputName || `converted_file_${i + 1}`;
            a.click();
        } else {
            // Text output fallback
            navigator.clipboard.writeText(url);
            alert("Copied to clipboard!");
        }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className={`p-8 rounded-3xl bg-gradient-to-br ${tool.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl">
            <tool.icon className="w-10 h-10 text-white drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">{tool.name}</h1>
            <p className="text-white/90 font-medium text-lg drop-shadow-sm">{tool.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Dropzone & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-2xl">
            {task.status === "idle" && (
              <FileDropzone 
                onFilesDrop={setFiles} 
                multiple={tool.acceptsMultiple} 
                accept="*" // Specific accept types handled via frontend wrapper ideally, generic for now
              />
            )}

            {task.status === "processing" && (
              <div className="space-y-6 py-12">
                <div className="flex flex-col items-center text-center space-y-4">
                  <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white mb-1">Processing Conversion...</h3>
                    <p className="text-slate-400 font-medium">{task.progress}% Complete</p>
                  </div>
                </div>
                <ProgressBar progress={task.progress} />
              </div>
            )}

            {task.status === "success" && (
              <div className="space-y-6 py-12 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/30">
                  <Download className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-white mb-2">Conversion Complete!</h3>
                <p className="text-slate-400 font-medium mb-8">Your files have been successfully processed.</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDownload}
                    className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/25 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" /> Download / Copy Results
                  </button>
                  <button
                    onClick={reset}
                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-white/10 transition-all active:scale-95 flex items-center gap-2"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {task.status === "error" && (
              <div className="py-12 text-center space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Conversion Failed</h3>
                <p className="text-red-400">{task.error}</p>
                <button
                  onClick={reset}
                  className="mt-6 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all font-bold"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Options */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-6 shadow-2xl sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Configuration
            </h3>
            
            <div className="min-h-[200px]">
              {ActiveOptions ? <ActiveOptions /> : (
                <p className="text-slate-500 text-sm italic">Loading options interface...</p>
              )}
            </div>

            <button
              onClick={processConversion}
              disabled={task.status !== "idle" || (task.files.length === 0 && !task.options.directInput)}
              className="w-full mt-8 py-4 bg-white text-black font-extrabold rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              Start Conversion Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
