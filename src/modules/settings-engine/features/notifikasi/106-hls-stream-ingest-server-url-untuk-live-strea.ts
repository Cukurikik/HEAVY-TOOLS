import type { SettingFeatureDefinition } from '../../types';
export const feature106: SettingFeatureDefinition = {
  id: '106',
  category: 'notifikasi',
  slug: 'hls-stream-ingest-server-url-untuk-live-strea',
  label: 'HLS Stream Ingest Server URL (Untuk live stream screen recorder)',
  description: 'Konfigurasi mendalam untuk HLS Stream Ingest Server URL (Untuk live stream screen recorder)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-106-config', String(value));
    }
  }
};
