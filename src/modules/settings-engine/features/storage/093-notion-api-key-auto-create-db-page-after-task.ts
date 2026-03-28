import type { SettingFeatureDefinition } from '../../types';
export const feature093: SettingFeatureDefinition = {
  id: '093',
  category: 'storage',
  slug: 'notion-api-key-auto-create-db-page-after-task',
  label: 'Notion API Key (Auto create db page after task)',
  description: 'Konfigurasi mendalam untuk Notion API Key (Auto create db page after task)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-093-config', String(value));
    }
  }
};
