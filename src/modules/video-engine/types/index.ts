export interface VideoTask {
  id: string;
  file: File | null;
  operation: "trim" | "merge" | "convert" | "stabilize" | "idle";
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  error?: string;
}
