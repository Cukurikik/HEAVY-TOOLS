import type { SettingFeatureDefinition } from '../../types';
export const feature192: SettingFeatureDefinition = {
  id: '192',
  category: 'pdf',
  slug: 'webhook-event-on-task-started',
  label: 'Webhook Event: `on_task_started`',
  description: 'Konfigurasi mendalam untuk Webhook Event: `on_task_started`',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-192-config', String(value));
    }
  }
};
