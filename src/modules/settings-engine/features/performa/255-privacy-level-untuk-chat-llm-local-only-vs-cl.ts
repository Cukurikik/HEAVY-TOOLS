import type { SettingFeatureDefinition } from '../../types';
export const feature255: SettingFeatureDefinition = {
  id: '255',
  category: 'performa',
  slug: 'privacy-level-untuk-chat-llm-local-only-vs-cl',
  label: 'Privacy Level untuk Chat LLM (Local-only vs Cloud API fallback)',
  description: 'Konfigurasi mendalam untuk Privacy Level untuk Chat LLM (Local-only vs Cloud API fallback)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-255-level', String(value));
      localStorage.setItem('omni-slider-255', String(value));
    }
  }
};
