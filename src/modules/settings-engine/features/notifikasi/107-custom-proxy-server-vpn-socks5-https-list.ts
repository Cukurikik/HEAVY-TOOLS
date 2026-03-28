import type { SettingFeatureDefinition } from '../../types';
export const feature107: SettingFeatureDefinition = {
  id: '107',
  category: 'notifikasi',
  slug: 'custom-proxy-server-vpn-socks5-https-list',
  label: 'Custom Proxy Server / VPN (Socks5/HTTPS) List',
  description: 'Konfigurasi mendalam untuk Custom Proxy Server / VPN (Socks5/HTTPS) List',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-107-config', String(value));
    }
  }
};
