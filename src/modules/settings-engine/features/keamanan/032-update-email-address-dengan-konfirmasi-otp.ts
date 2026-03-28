import type { SettingFeatureDefinition } from '../../types';
export const feature032: SettingFeatureDefinition = {
  id: '032',
  category: 'keamanan',
  slug: 'update-email-address-dengan-konfirmasi-otp',
  label: 'Update Email Address dengan konfirmasi OTP',
  description: 'Konfigurasi mendalam untuk Update Email Address dengan konfirmasi OTP',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-032-config', String(value));
    }
  }
};
