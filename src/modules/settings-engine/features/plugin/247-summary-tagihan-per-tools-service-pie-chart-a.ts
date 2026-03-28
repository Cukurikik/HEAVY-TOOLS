import type { SettingFeatureDefinition } from '../../types';
export const feature247: SettingFeatureDefinition = {
  id: '247',
  category: 'plugin',
  slug: 'summary-tagihan-per-tools-service-pie-chart-a',
  label: 'Summary Tagihan per Tools/Service (Pie Chart Analytics)',
  description: 'Konfigurasi mendalam untuk Summary Tagihan per Tools/Service (Pie Chart Analytics)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-247');
      } else {
        document.body.classList.remove('omni-engine-active-247');
      }
      localStorage.setItem('omni-toggle-247', String(!!value));
    }
  }
};
