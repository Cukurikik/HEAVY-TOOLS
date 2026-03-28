import type { SettingFeatureDefinition } from '../../types';
export const feature300: SettingFeatureDefinition = {
  id: '300',
  category: 'converter',
  slug: 'destruct-sequence-one-click-destroy-and-rebui',
  label: 'Destruct Sequence / One-Click Destroy and Rebuild Infra Script Trigger',
  description: 'Konfigurasi mendalam untuk Destruct Sequence / One-Click Destroy and Rebuild Infra Script Trigger',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-300');
      } else {
        document.body.classList.remove('omni-engine-active-300');
      }
      localStorage.setItem('omni-toggle-300', String(!!value));
    }
  }
};
