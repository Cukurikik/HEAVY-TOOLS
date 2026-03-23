"use client";
export function VoiceRecorderOptions() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <h4 className="text-red-400 font-bold mb-1">Microphone Recording</h4>
        <p className="text-xs text-red-200/60 leading-relaxed font-medium">
          Click the Record button in the left panel to begin capturing voice audio from your primary microphone directly in the browser. High quality WebM/Opus output.
        </p>
      </div>
    </div>
  );
}
