import type { SettingFeatureDefinition } from '../../types';
export const feature102: SettingFeatureDefinition = {
  id: '102',
  category: 'notifikasi',
  slug: 'datadog-newrelic-sentry-dsn-untuk-developer-y',
  label: 'Datadog / NewRelic / Sentry DSN (Untuk developer yang ingin monitor sendiri)',
  description: 'Konfigurasi mendalam untuk Datadog / NewRelic / Sentry DSN (Untuk developer yang ingin monitor sendiri)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-102-config', String(value));
    }
  }
};
