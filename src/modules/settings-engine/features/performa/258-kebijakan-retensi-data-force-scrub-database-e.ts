import type { SettingFeatureDefinition } from '../../types';
export const feature258: SettingFeatureDefinition = {
  id: '258',
  category: 'performa',
  slug: 'kebijakan-retensi-data-force-scrub-database-e',
  label: 'Kebijakan Retensi Data (Force scrub database entries tiap 30 hari)',
  description: 'Konfigurasi mendalam untuk Kebijakan Retensi Data (Force scrub database entries tiap 30 hari)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-258');
      } else {
        document.body.classList.remove('omni-engine-active-258');
      }
      localStorage.setItem('omni-toggle-258', String(!!value));
    }
  }
};
