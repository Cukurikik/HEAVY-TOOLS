import type { SettingFeatureDefinition } from '../../types';
export const feature094: SettingFeatureDefinition = {
  id: '094',
  category: 'storage',
  slug: 'trello-jira-api-credentials',
  label: 'Trello / Jira API Credentials',
  description: 'Konfigurasi mendalam untuk Trello / Jira API Credentials',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-094-config', String(value));
    }
  }
};
