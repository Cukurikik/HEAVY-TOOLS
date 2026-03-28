import type { SettingFeatureDefinition } from '../../types';
export const feature117: SettingFeatureDefinition = {
  id: '117',
  category: 'notifikasi',
  slug: 'default-folder-ekspor-lokal-browser-permissio',
  label: 'Default Folder Ekspor Lokal (Browser permission API untuk akses folder PC native)',
  description: 'Konfigurasi mendalam untuk Default Folder Ekspor Lokal (Browser permission API untuk akses folder PC native)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-117-config', String(value));
    }
  }
};
