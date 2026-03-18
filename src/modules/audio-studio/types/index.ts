export interface AudioTask {
  id: string;
  file: File | null;
  operation: "master" | "split" | "pitch" | "export" | "idle";
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  error?: string;
}
