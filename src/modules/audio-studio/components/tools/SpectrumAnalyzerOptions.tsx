"use client";
export function SpectrumAnalyzerOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <h4 className="text-cyan-400 font-bold mb-1">Real-Time FFT Analyzer</h4>
        <p className="text-xs text-cyan-200/60 leading-relaxed font-medium">
          Upload and play a file to see a real-time reactive 3D visualizer showing frequency distribution and peak levels. Zero configuration needed.
        </p>
      </div>
    </div>
  );
}
