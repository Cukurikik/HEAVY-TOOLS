export interface PdfTask {
  id: string;
  file: File | null;
  operation: "merge" | "split" | "compress" | "sign" | "idle";
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  error?: string;
}
