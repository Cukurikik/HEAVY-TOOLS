import type { SettingFeatureDefinition } from '../../types';
export const feature224: SettingFeatureDefinition = {
  id: '224',
  category: 'llm',
  slug: 'default-payment-method-untuk-store-plugin',
  label: 'Default Payment Method untuk Store Plugin',
  description: 'Konfigurasi mendalam untuk Default Payment Method untuk Store Plugin',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-224');
      } else {
        document.body.classList.remove('omni-engine-active-224');
      }
      localStorage.setItem('omni-toggle-224', String(!!value));
    }
  }
};
