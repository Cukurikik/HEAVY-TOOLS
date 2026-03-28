import type { SettingFeatureDefinition } from '../../types';
export const feature036: SettingFeatureDefinition = {
  id: '036',
  category: 'keamanan',
  slug: 'autentikasi-biometrik-webauthn-passkeys-via-y',
  label: 'Autentikasi Biometrik (WebAuthn / Passkeys via YubiKey / Fingerprint)',
  description: 'Konfigurasi mendalam untuk Autentikasi Biometrik (WebAuthn / Passkeys via YubiKey / Fingerprint)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-036-config', String(value));
    }
  }
};
