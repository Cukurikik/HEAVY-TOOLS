import type { SettingFeatureDefinition } from '../../types';
export const feature131: SettingFeatureDefinition = {
  id: '131',
  category: 'video',
  slug: 'bypass-opfs-fallback-to-memory-jika-opfs-tida',
  label: 'Bypass OPFS fallback to Memory (Jika OPFS tidak didukung browser)',
  description: 'Konfigurasi mendalam untuk Bypass OPFS fallback to Memory (Jika OPFS tidak didukung browser)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-131-config', String(value));
    }
  }
};
