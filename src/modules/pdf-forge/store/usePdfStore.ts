import { create } from "zustand";
import { PdfTask } from "../types";

interface PdfStore {
  task: PdfTask;
  setFile: (file: File) => void;
  setOperation: (operation: PdfTask["operation"]) => void;
  processPdf: () => Promise<void>;
  reset: () => void;
}

export const usePdfStore = create<PdfStore>((set, get) => ({
  task: {
    id: "",
    file: null,
    operation: "idle",
    status: "idle",
    progress: 0,
  },
  setFile: (file) =>
    set((state) => ({
      task: { ...state.task, file, id: crypto.randomUUID() },
    })),
  setOperation: (operation) =>
    set((state) => ({
      task: { ...state.task, operation },
    })),
  processPdf: async () => {
    const { task } = get();
    if (!task.file || task.operation === "idle") return;

    set((state) => ({
      task: { ...state.task, status: "processing", progress: 0 },
    }));

    // Simulate processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      set((state) => ({
        task: { ...state.task, progress: i },
      }));
    }

    set((state) => ({
      task: { ...state.task, status: "success", progress: 100 },
    }));
  },
  reset: () =>
    set({
      task: {
        id: "",
        file: null,
        operation: "idle",
        status: "idle",
        progress: 0,
      },
    }),
}));
