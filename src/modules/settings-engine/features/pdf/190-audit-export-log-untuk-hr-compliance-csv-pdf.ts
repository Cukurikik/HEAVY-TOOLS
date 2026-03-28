import type { SettingFeatureDefinition } from '../../types';
export const feature190: SettingFeatureDefinition = {
  id: '190',
  category: 'pdf',
  slug: 'audit-export-log-untuk-hr-compliance-csv-pdf',
  label: 'Audit Export Log untuk HR / Compliance (CSV/PDF)',
  description: 'Konfigurasi mendalam untuk Audit Export Log untuk HR / Compliance (CSV/PDF)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-190');
      } else {
        document.body.classList.remove('omni-engine-active-190');
      }
      localStorage.setItem('omni-toggle-190', String(!!value));
    }
  }
};
