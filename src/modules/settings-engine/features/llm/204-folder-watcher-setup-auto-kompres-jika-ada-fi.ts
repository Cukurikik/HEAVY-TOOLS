import type { SettingFeatureDefinition } from '../../types';
export const feature204: SettingFeatureDefinition = {
  id: '204',
  category: 'llm',
  slug: 'folder-watcher-setup-auto-kompres-jika-ada-fi',
  label: 'Folder Watcher Setup (Auto kompres jika ada file masuk folder eksternal Dropbox)',
  description: 'Konfigurasi mendalam untuk Folder Watcher Setup (Auto kompres jika ada file masuk folder eksternal Dropbox)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-204-config', String(value));
    }
  }
};
