import type { SettingFeatureDefinition } from '../../types';
export const feature149: SettingFeatureDefinition = {
  id: '149',
  category: 'video',
  slug: 'auto-download-model-onnx-preload-di-backgroun',
  label: 'Auto-Download Model ONNX (Preload di background saat app dibuka)',
  description: 'Konfigurasi mendalam untuk Auto-Download Model ONNX (Preload di background saat app dibuka)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-149');
      } else {
        document.body.classList.remove('omni-engine-active-149');
      }
      localStorage.setItem('omni-toggle-149', String(!!value));
    }
  }
};
