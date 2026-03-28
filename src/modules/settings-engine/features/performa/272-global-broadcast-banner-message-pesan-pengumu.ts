import type { SettingFeatureDefinition } from '../../types';
export const feature272: SettingFeatureDefinition = {
  id: '272',
  category: 'performa',
  slug: 'global-broadcast-banner-message-pesan-pengumu',
  label: 'Global Broadcast Banner Message (Pesan pengumuman di atas Navbar semua user)',
  description: 'Konfigurasi mendalam untuk Global Broadcast Banner Message (Pesan pengumuman di atas Navbar semua user)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-272-config', String(value));
    }
  }
};
