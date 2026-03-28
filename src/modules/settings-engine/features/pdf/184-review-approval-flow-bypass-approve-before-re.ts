import type { SettingFeatureDefinition } from '../../types';
export const feature184: SettingFeatureDefinition = {
  id: '184',
  category: 'pdf',
  slug: 'review-approval-flow-bypass-approve-before-re',
  label: 'Review/Approval Flow Bypass (Approve before render using cloud API)',
  description: 'Konfigurasi mendalam untuk Review/Approval Flow Bypass (Approve before render using cloud API)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-184-config', String(value));
    }
  }
};
