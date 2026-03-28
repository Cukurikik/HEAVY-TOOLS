import type { SettingFeatureDefinition } from '../../types';
export const feature189: SettingFeatureDefinition = {
  id: '189',
  category: 'pdf',
  slug: 'internal-workspace-chat-webhook-configuration',
  label: 'Internal Workspace Chat Webhook Configurations',
  description: 'Konfigurasi mendalam untuk Internal Workspace Chat Webhook Configurations',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-189-config', String(value));
    }
  }
};
