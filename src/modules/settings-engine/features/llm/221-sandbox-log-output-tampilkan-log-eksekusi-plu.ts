import type { SettingFeatureDefinition } from '../../types';
export const feature221: SettingFeatureDefinition = {
  id: '221',
  category: 'llm',
  slug: 'sandbox-log-output-tampilkan-log-eksekusi-plu',
  label: 'Sandbox Log Output (Tampilkan log eksekusi plugin di Dev Console)',
  description: 'Konfigurasi mendalam untuk Sandbox Log Output (Tampilkan log eksekusi plugin di Dev Console)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-221');
      } else {
        document.body.classList.remove('omni-engine-active-221');
      }
      localStorage.setItem('omni-toggle-221', String(!!value));
    }
  }
};
