import type { SettingFeatureDefinition } from '../../types';
export const feature039: SettingFeatureDefinition = {
  id: '039',
  category: 'keamanan',
  slug: 'login-activity-log-ip-waktu-lokasi-gagal-suks',
  label: 'Login Activity Log (IP, Waktu, Lokasi, Gagal/Sukses)',
  description: 'Konfigurasi mendalam untuk Login Activity Log (IP, Waktu, Lokasi, Gagal/Sukses)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-039');
      } else {
        document.body.classList.remove('omni-engine-active-039');
      }
      localStorage.setItem('omni-toggle-039', String(!!value));
    }
  }
};
