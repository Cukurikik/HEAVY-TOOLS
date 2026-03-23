"use client";
export function AudioRecorderOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/20">
        <h4 className="text-red-500 font-bold mb-1">System Audio Capture</h4>
        <p className="text-xs text-red-200/60 leading-relaxed font-medium">
          Click Record, then select the tab or screen you want to capture audio from. Useful for recording internal system audio or meetings. High quality WebM/Opus output.
        </p>
      </div>
    </div>
  );
}
