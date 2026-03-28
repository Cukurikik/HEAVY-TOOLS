import type { SettingFeatureDefinition } from '../../types';
export const feature294: SettingFeatureDefinition = {
  id: '294',
  category: 'converter',
  slug: 'setup-webrtc-stun-turn-servers-list-untuk-col',
  label: 'Setup WebRTC Stun/Turn servers list untuk colaborasi',
  description: 'Konfigurasi mendalam untuk Setup WebRTC Stun/Turn servers list untuk colaborasi',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-294');
      } else {
        document.body.classList.remove('omni-engine-active-294');
      }
      localStorage.setItem('omni-toggle-294', String(!!value));
    }
  }
};
