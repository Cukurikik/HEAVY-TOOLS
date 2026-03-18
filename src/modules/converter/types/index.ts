export interface ConverterTask {
  id: string;
  file: File | null;
  operation: "video" | "audio" | "image" | "document" | "idle";
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  error?: string;
}
