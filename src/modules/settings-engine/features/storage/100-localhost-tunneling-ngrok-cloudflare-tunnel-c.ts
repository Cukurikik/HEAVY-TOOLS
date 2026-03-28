import type { SettingFeatureDefinition } from '../../types';
export const feature100: SettingFeatureDefinition = {
  id: '100',
  category: 'storage',
  slug: 'localhost-tunneling-ngrok-cloudflare-tunnel-c',
  label: 'Localhost Tunneling (Ngrok / Cloudflare Tunnel config)',
  description: 'Konfigurasi mendalam untuk Localhost Tunneling (Ngrok / Cloudflare Tunnel config)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-100');
      } else {
        document.body.classList.remove('omni-engine-active-100');
      }
      localStorage.setItem('omni-toggle-100', String(!!value));
    }
  }
};
