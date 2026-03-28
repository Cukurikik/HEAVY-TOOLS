import type { SettingFeatureDefinition } from '../../types';
export const feature193: SettingFeatureDefinition = {
  id: '193',
  category: 'pdf',
  slug: 'webhook-event-on-task-completed',
  label: 'Webhook Event: `on_task_completed`',
  description: 'Konfigurasi mendalam untuk Webhook Event: `on_task_completed`',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-193-config', String(value));
    }
  }
};
