import type { SettingFeatureDefinition } from '../../types';
export const feature096: SettingFeatureDefinition = {
  id: '096',
  category: 'storage',
  slug: 'custom-webgpu-model-checkpoint-url',
  label: 'Custom WebGPU Model Checkpoint URL',
  description: 'Konfigurasi mendalam untuk Custom WebGPU Model Checkpoint URL',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-096-config', String(value));
    }
  }
};
