import type { SettingFeatureDefinition } from '../../types';
export const feature082: SettingFeatureDefinition = {
  id: '082',
  category: 'storage',
  slug: 'slack-webhook-url-kirim-notif-ke-slack-jika-r',
  label: 'Slack Webhook URL (Kirim notif ke Slack jika render video 10GB selesai)',
  description: 'Konfigurasi mendalam untuk Slack Webhook URL (Kirim notif ke Slack jika render video 10GB selesai)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-082-config', String(value));
    }
  }
};
