import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ImageAdjustments, ImageTask } from '../types';

interface HistorySnapshot {
  imageData: ImageData | null;
  adjustments: ImageAdjustments;
  timestamp: number;
}

interface ImageState {
  tasks: ImageTask[];
  currentTask: ImageTask | null;
  
  // Canvas State
  imageData: ImageData | null;
  outputBlob: Blob | null;
  
  // Active Filter Adjustments
  adjustments: ImageAdjustments;
  
  // Undo/Redo System
  history: HistorySnapshot[];
  undoStack: HistorySnapshot[];
  
  // UI & System State
  status: 'idle' | 'loading' | 'success' | 'error';
  progress: number;
  error: string | null;

  // Actions
  setTask: (task: Partial<ImageTask>) => void;
  setImageData: (data: ImageData | null) => void;
  setOutputBlob: (blob: Blob | null) => void;
  updateAdjustments: (adj: Partial<ImageAdjustments>) => void;
  resetAdjustments: () => void;
  
  // History Actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  
  reset: () => void;
}

const defaultAdjustments: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  blur: 0,
  sharpen: 0
};

export const useImageStore = create<ImageState>()(
  persist(
    immer((set, get) => ({
      tasks: [],
      currentTask: null,
      imageData: null,
      outputBlob: null,
      adjustments: { ...defaultAdjustments },
      history: [],
      undoStack: [],
      status: 'idle',
      progress: 0,
      error: null,

      setTask: (task) =>
        set((state) => {
          state.currentTask = { ...state.currentTask, ...task } as ImageTask;
        }),

      setImageData: (data) =>
        set((state) => {
          state.imageData = data;
        }),

      setOutputBlob: (blob) =>
        set((state) => {
          state.outputBlob = blob;
        }),

      updateAdjustments: (adj) =>
        set((state) => {
          state.adjustments = { ...state.adjustments, ...adj };
        }),

      resetAdjustments: () =>
        set((state) => {
          state.adjustments = { ...defaultAdjustments };
        }),

      pushHistory: () => {
        set((state) => {
          const snapshot: HistorySnapshot = {
            imageData: state.imageData, // Note: storing full ImageData could be memory heavy
            adjustments: { ...state.adjustments },
            timestamp: Date.now()
          };
          
          state.history.push(snapshot);
          
          // Limit history to 20 steps
          if (state.history.length > 20) {
            state.history.shift();
          }
          
          // Clear redo stack on new action
          state.undoStack = [];
        });
      },

      undo: () => {
        set((state) => {
          if (state.history.length === 0) return;
          
          const currentStateSnapshot: HistorySnapshot = {
            imageData: state.imageData,
            adjustments: { ...state.adjustments },
            timestamp: Date.now()
          };
          
          state.undoStack.push(currentStateSnapshot);
          
          const previousState = state.history.pop()!;
          state.imageData = previousState.imageData;
          state.adjustments = previousState.adjustments;
        });
      },

      redo: () => {
        set((state) => {
          if (state.undoStack.length === 0) return;
          
          const currentStateSnapshot: HistorySnapshot = {
            imageData: state.imageData,
            adjustments: { ...state.adjustments },
            timestamp: Date.now()
          };
          
          state.history.push(currentStateSnapshot);
          
          const nextState = state.undoStack.pop()!;
          state.imageData = nextState.imageData;
          state.adjustments = nextState.adjustments;
        });
      },

      reset: () =>
        set((state) => {
          state.status = 'idle';
          state.progress = 0;
          state.error = null;
          state.currentTask = null;
          state.imageData = null;
          state.outputBlob = null;
          state.adjustments = { ...defaultAdjustments };
          state.history = [];
          state.undoStack = [];
        }),
    })),
    {
      name: 'image-store',
      partialize: (state) => ({ tasks: state.tasks }) 
      // Do not persist imageData/Blobs or history to localStorage as it exceeds quota
    }
  )
);
