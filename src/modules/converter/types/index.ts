export type ExecutionType = "client" | "server" | "hybrid";

export interface ConverterToolDef {
  id: string;
  name: string;
  description: string;
  icon: any;        // Lucide icon
  gradient: string; 
  engine: string;   
  executionType: ExecutionType;
  route: string;
  acceptsMultiple?: boolean;
}

export interface ConverterTask {
  id: string;
  files: File[];
  operation: string; 
  options: Record<string, unknown>;
  outputFormat: string;
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  outputUrls: string[];
  outputName?: string;
  error?: string;
  createdAt: Date;
}
