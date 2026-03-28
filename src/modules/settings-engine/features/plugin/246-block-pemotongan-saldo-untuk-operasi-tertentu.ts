import type { SettingFeatureDefinition } from '../../types';
export const feature246: SettingFeatureDefinition = {
  id: '246',
  category: 'plugin',
  slug: 'block-pemotongan-saldo-untuk-operasi-tertentu',
  label: 'Block Pemotongan Saldo untuk Operasi Tertentu (Minta PIN)',
  description: 'Konfigurasi mendalam untuk Block Pemotongan Saldo untuk Operasi Tertentu (Minta PIN)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-246');
      } else {
        document.body.classList.remove('omni-engine-active-246');
      }
      localStorage.setItem('omni-toggle-246', String(!!value));
    }
  }
};
