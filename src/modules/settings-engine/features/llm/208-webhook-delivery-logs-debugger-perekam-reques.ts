import type { SettingFeatureDefinition } from '../../types';
export const feature208: SettingFeatureDefinition = {
  id: '208',
  category: 'llm',
  slug: 'webhook-delivery-logs-debugger-perekam-reques',
  label: 'Webhook Delivery Logs Debugger (Perekam request/response payload webhooks)',
  description: 'Konfigurasi mendalam untuk Webhook Delivery Logs Debugger (Perekam request/response payload webhooks)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-208-config', String(value));
    }
  }
};
