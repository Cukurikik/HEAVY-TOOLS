import type { SettingFeatureDefinition } from '../../types';
export const feature194: SettingFeatureDefinition = {
  id: '194',
  category: 'pdf',
  slug: 'webhook-event-on-task-failed',
  label: 'Webhook Event: `on_task_failed`',
  description: 'Konfigurasi mendalam untuk Webhook Event: `on_task_failed`',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-194-config', String(value));
    }
  }
};
