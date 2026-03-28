import type { SettingFeatureDefinition } from '../../types';
export const feature178: SettingFeatureDefinition = {
  id: '178',
  category: 'pdf',
  slug: 'activity-log-workspace-siapa-convert-apa-jam',
  label: 'Activity Log Workspace (Siapa convert apa jam berapa)',
  description: 'Konfigurasi mendalam untuk Activity Log Workspace (Siapa convert apa jam berapa)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-178');
      } else {
        document.body.classList.remove('omni-engine-active-178');
      }
      localStorage.setItem('omni-toggle-178', String(!!value));
    }
  }
};
