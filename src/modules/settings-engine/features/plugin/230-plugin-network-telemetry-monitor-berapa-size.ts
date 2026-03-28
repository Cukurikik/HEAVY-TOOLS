import type { SettingFeatureDefinition } from '../../types';
export const feature230: SettingFeatureDefinition = {
  id: '230',
  category: 'plugin',
  slug: 'plugin-network-telemetry-monitor-berapa-size',
  label: 'Plugin Network Telemetry Monitor (Berapa size payload yang dikirim plugin)',
  description: 'Konfigurasi mendalam untuk Plugin Network Telemetry Monitor (Berapa size payload yang dikirim plugin)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-230');
      } else {
        document.body.classList.remove('omni-engine-active-230');
      }
      localStorage.setItem('omni-toggle-230', String(!!value));
    }
  }
};
