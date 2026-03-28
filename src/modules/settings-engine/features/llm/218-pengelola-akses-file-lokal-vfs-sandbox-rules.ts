import type { SettingFeatureDefinition } from '../../types';
export const feature218: SettingFeatureDefinition = {
  id: '218',
  category: 'llm',
  slug: 'pengelola-akses-file-lokal-vfs-sandbox-rules',
  label: 'Pengelola Akses File Lokal / VFS Sandbox Rules',
  description: 'Konfigurasi mendalam untuk Pengelola Akses File Lokal / VFS Sandbox Rules',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-218');
      } else {
        document.body.classList.remove('omni-engine-active-218');
      }
      localStorage.setItem('omni-toggle-218', String(!!value));
    }
  }
};
