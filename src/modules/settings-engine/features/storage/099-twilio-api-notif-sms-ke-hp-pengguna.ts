import type { SettingFeatureDefinition } from '../../types';
export const feature099: SettingFeatureDefinition = {
  id: '099',
  category: 'storage',
  slug: 'twilio-api-notif-sms-ke-hp-pengguna',
  label: 'Twilio API (Notif SMS ke HP Pengguna)',
  description: 'Konfigurasi mendalam untuk Twilio API (Notif SMS ke HP Pengguna)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-099');
      } else {
        document.body.classList.remove('omni-engine-active-099');
      }
      localStorage.setItem('omni-toggle-099', String(!!value));
    }
  }
};
