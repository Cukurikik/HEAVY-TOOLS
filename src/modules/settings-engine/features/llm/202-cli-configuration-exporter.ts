import type { SettingFeatureDefinition } from '../../types';
export const feature202: SettingFeatureDefinition = {
  id: '202',
  category: 'llm',
  slug: 'cli-configuration-exporter',
  label: 'CLI Configuration Exporter',
  description: 'Konfigurasi mendalam untuk CLI Configuration Exporter',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-202');
      } else {
        document.body.classList.remove('omni-engine-active-202');
      }
      localStorage.setItem('omni-toggle-202', String(!!value));
    }
  }
};
