import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface SettingsState {
  // ⚡ Omni-Tool Settings Brain: Dynamic dictionary containing all 300 configuration flags
  settings: Record<string, any>;

  // Legacy fallback struct
  uiPreferences: { theme: 'light' | 'dark' | 'system'; fontSize: string; reduceMotion: boolean };
  securityConfig: { twoFactorAuth: boolean; sessionTimeout: string };
  apiKeysVault: Record<string, string>;
  storageConfig: { opfsLimitGB: number; autoDeleteDays: number };
  processingConfig: { maxWasmMemoryMB: number; useWebGpu: boolean };
  workspaceConfig: { defaultTeam: string };
  notificationConfig: { emailAlerts: boolean };
  telemetryPrivacy: { analyticsConsent: boolean };
  
  // Transient state
  isLoading: boolean;
  isSyncing: boolean;

  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (category: keyof Omit<SettingsState, 'isLoading' | 'isSyncing' | 'fetchSettings' | 'updateSettings' | 'settings' | 'setSetting'>, payload: any) => void;
  
  // ⚡ Engine actions
  setSetting: (slug: string, value: any) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    immer((set, get) => ({
      settings: {}, // Initialized empty; hydrated from /api/settings on root mount

      uiPreferences: { theme: 'system', fontSize: 'md', reduceMotion: false },
      securityConfig: { twoFactorAuth: false, sessionTimeout: '24h' },
      apiKeysVault: {},
      storageConfig: { opfsLimitGB: 5, autoDeleteDays: 30 },
      processingConfig: { maxWasmMemoryMB: 1024, useWebGpu: true },
      workspaceConfig: { defaultTeam: 'Personal' },
      notificationConfig: { emailAlerts: true },
      telemetryPrivacy: { analyticsConsent: false },
      
      isLoading: false,
      isSyncing: false,

      fetchSettings: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/settings');
          if (res.ok) {
            const data = await res.json();
            set((state) => {
              // 🔥 Populate the new global settings dictionary
              state.settings = data;
              
              // Maintain legacy behavior just in case
              Object.assign(state, data);
              state.isLoading = false;
            });
            console.log("⚡ [Omni-Store] Hydrated Brain with settings data.");
          } else {
            set({ isLoading: false });
          }
        } catch (e) {
          console.error("⚡ [Omni-Store] Failed to fetch settings:", e);
          set({ isLoading: false });
        }
      },

      setSetting: (slug, value) => {
        set((state) => {
          // Immediately impact any React component observing `useSettingsStore(s => s.settings[slug])`
          state.settings[slug] = value;
          
          // Fallback legacy assignment (temporary bridge)
          (state as any)[slug] = value;
        });
      },

      updateSettings: async (category, payload) => {
        set((state) => {
          (state as any)[category] = { ...(state as any)[category], ...payload };
          state.isSyncing = true;
        });

        try {
          await fetch('/api/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [category]: payload }),
          });
        } catch (error) {
          console.error("Failed to sync settings", error);
        } finally {
          set({ isSyncing: false });
        }
      }
    })),
    { 
      name: 'omni-tool-settings',
      partialize: (state) => ({
        settings: state.settings,
        uiPreferences: state.uiPreferences,
        processingConfig: state.processingConfig,
        storageConfig: state.storageConfig,
      }) 
    }
  )
);
