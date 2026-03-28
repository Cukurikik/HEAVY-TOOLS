import type { SettingFeatureDefinition } from '../../types';
export const feature080: SettingFeatureDefinition = {
  id: '080',
  category: 'storage',
  slug: 'github-personal-access-token-pat-untuk-auto-p',
  label: 'GitHub Personal Access Token (PAT) untuk Auto-Push hasil code/text',
  description: 'Konfigurasi mendalam untuk GitHub Personal Access Token (PAT) untuk Auto-Push hasil code/text',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-080-config', String(value));
    }
  }
};
