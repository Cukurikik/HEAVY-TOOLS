import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { idbStorage } from '@/lib/idb-storage';

// ═══════════════════════════════════════════════════
// Types (Mapped to Blueprint)
// ═══════════════════════════════════════════════════

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMTask {
  id: string;
  model: 'gpt-4o' | 'claude-3-5-sonnet' | 'gemini-1.5-pro' | 'llama-3.1';
  systemPrompt?: string;
  userMessage: string;
  context: LLMMessage[];
  temperature: number;
  maxTokens: number;
  status: 'idle' | 'streaming' | 'success' | 'error';
  response?: string;
  error?: string;
}

interface LlmStore {
  task: LLMTask;
  setField: <K extends keyof LLMTask>(field: K, value: LLMTask[K]) => void;
  appendContext: (message: LLMMessage) => void;
  clearContext: () => void;
  processPrompt: () => Promise<void>;
  reset: () => void;
}

const initialTask: LLMTask = {
  id: '',
  model: 'gemini-1.5-pro',
  userMessage: '',
  context: [],
  temperature: 0.7,
  maxTokens: 4096,
  status: 'idle',
};

// ═══════════════════════════════════════════════════
// Zustand Store (with IDB Persist)
// ═══════════════════════════════════════════════════

export const useLlmStore = create<LlmStore>()(
  persist(
    immer((set, get) => ({
      task: { ...initialTask },

      setField: (field, value) =>
        set((state) => {
          state.task[field] = value;
          if (field === 'userMessage' && state.task.status === 'success') {
             state.task.status = 'idle'; // Reset status if user starts typing a new message
          }
        }),

      appendContext: (message) =>
        set((state) => {
          state.task.context.push(message);
        }),

      clearContext: () =>
        set((state) => {
          state.task.context = [];
          state.task.response = undefined;
          state.task.userMessage = '';
          state.task.status = 'idle';
        }),

      processPrompt: async () => {
        const { task } = get();
        if (!task.userMessage.trim()) return;

        set((state) => {
          state.task.id = crypto.randomUUID();
          state.task.status = 'streaming';
          state.task.error = undefined;
          state.task.response = ''; // Reset active response buffer
          
          // Append the user's message to the context immediately optimistic UI
          state.task.context.push({ role: 'user', content: task.userMessage });
        });

        try {
          // Genuine LLM streaming fetch connecting locally to the App Router API endpoint
          const response = await fetch(`/api/llm/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: task.model,
              systemPrompt: task.systemPrompt,
              messages: [
                ...task.context,
                { role: 'user', content: task.userMessage }
              ],
              temperature: task.temperature,
              maxTokens: task.maxTokens,
            })
          });

          if (!response.ok) {
            let errorMsg = response.statusText;
            try {
              const errorData = await response.json();
              if (errorData?.error) {
                errorMsg = errorData.error;
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
            throw new Error(errorMsg);
          }

          if (!response.body) {
            throw new Error('LLM Engine returned empty stream context.');
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let done = false;

          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              set((state) => {
                state.task.response = (state.task.response || '') + chunk;
              });
            }
          }

          set((state) => {
            state.task.status = 'success';
            state.task.context.push({ role: 'assistant', content: state.task.response || '' });
            state.task.userMessage = ''; // Clear input field upon absolute success
          });

        } catch (error) {
          console.error('LLM orchestrator error:', error);
          set((state) => {
            state.task.status = 'error';
            state.task.error = error instanceof Error ? error.message : 'LLM inference failure.';
          });
        }
      },

      reset: () =>
        set((state) => {
          state.task = { ...initialTask };
        }),
    })),
    {
      name: 'llm-store',
      storage: createJSONStorage(() => idbStorage),
      // State is mostly strings/arrays so it perfectly hydrates into IDB
      partialize: (state) => ({ task: state.task }),
    }
  )
);

// ═══════════════════════════════════════════════════
// BroadcastChannel: Cross-Tab Synchronization
// ═══════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('omni-llm-store-sync');
  
  let isApplyingRemoteState = false;

  useLlmStore.subscribe((state) => {
    if (!isApplyingRemoteState) {
      channel.postMessage({
        type: 'SYNC',
        payload: { task: state.task },
      });
    }
  });

  channel.onmessage = (event) => {
    if (event.data?.type === 'SYNC') {
      isApplyingRemoteState = true;
      useLlmStore.setState(event.data.payload, false);
      queueMicrotask(() => {
        isApplyingRemoteState = false;
      });
    }
  };
}
