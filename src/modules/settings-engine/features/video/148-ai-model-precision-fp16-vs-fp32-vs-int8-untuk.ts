import type { SettingFeatureDefinition } from '../../types';
export const feature148: SettingFeatureDefinition = {
  id: '148',
  category: 'video',
  slug: 'ai-model-precision-fp16-vs-fp32-vs-int8-untuk',
  label: 'AI Model Precision (FP16 vs FP32 vs INT8 untuk inferensi ONNX)',
  description: 'Konfigurasi mendalam untuk AI Model Precision (FP16 vs FP32 vs INT8 untuk inferensi ONNX)',
  inputType: 'dropdown',
  options: ['Auto', 'Manual', 'Strict'],
  defaultValue: 'Auto',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-148', String(value));
      localStorage.setItem('omni-dropdown-148', String(value));
    }
  }
};
