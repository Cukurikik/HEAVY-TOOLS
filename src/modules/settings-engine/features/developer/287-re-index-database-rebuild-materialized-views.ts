import type { SettingFeatureDefinition } from '../../types';
export const feature287: SettingFeatureDefinition = {
  id: '287',
  category: 'developer',
  slug: 're-index-database-rebuild-materialized-views',
  label: 'Re-Index Database (Rebuild materialized views & search index)',
  description: 'Konfigurasi mendalam untuk Re-Index Database (Rebuild materialized views & search index)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-287');
      } else {
        document.body.classList.remove('omni-engine-active-287');
      }
      localStorage.setItem('omni-toggle-287', String(!!value));
    }
  }
};
