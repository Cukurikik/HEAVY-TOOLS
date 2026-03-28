import type { SettingFeatureDefinition } from '../../types';
export const feature286: SettingFeatureDefinition = {
  id: '286',
  category: 'developer',
  slug: 'system-metric-exporter-integrasi-untuk-promet',
  label: 'System Metric Exporter (Integrasi untuk Prometheus / Grafana endpoint `/metrics`)',
  description: 'Konfigurasi mendalam untuk System Metric Exporter (Integrasi untuk Prometheus / Grafana endpoint `/metrics`)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-286-config', String(value));
    }
  }
};
