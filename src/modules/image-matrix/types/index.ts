export interface ImageTask {
  id: string;
  file: File | null;
  operation: "filter" | "upscale" | "convert" | "compress" | "idle";
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  error?: string;
}
