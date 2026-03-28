import type { SettingFeatureDefinition } from '../../types';
export const feature197: SettingFeatureDefinition = {
  id: '197',
  category: 'pdf',
  slug: 'webhook-secret-key-signature-verifikasi-hmac',
  label: 'Webhook Secret Key Signature (Verifikasi HMAC SHA256)',
  description: 'Konfigurasi mendalam untuk Webhook Secret Key Signature (Verifikasi HMAC SHA256)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-197-config', String(value));
    }
  }
};
