import type { SettingFeatureDefinition } from '../../types';
export const feature233: SettingFeatureDefinition = {
  id: '233',
  category: 'plugin',
  slug: 'pengaturan-auto-recharge-otomatis-potong-cc-j',
  label: 'Pengaturan Auto-Recharge (Otomatis potong cc jika credits < 100)',
  description: 'Konfigurasi mendalam untuk Pengaturan Auto-Recharge (Otomatis potong cc jika credits < 100)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-233');
      } else {
        document.body.classList.remove('omni-engine-active-233');
      }
      localStorage.setItem('omni-toggle-233', String(!!value));
    }
  }
};
