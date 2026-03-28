import type { SettingFeatureDefinition } from '../../types';
export const feature225: SettingFeatureDefinition = {
  id: '225',
  category: 'llm',
  slug: 'review-rating-notifikasi-ingatkan-review-sete',
  label: 'Review/Rating Notifikasi (Ingatkan review setelah 3 hari pake)',
  description: 'Konfigurasi mendalam untuk Review/Rating Notifikasi (Ingatkan review setelah 3 hari pake)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-225');
      } else {
        document.body.classList.remove('omni-engine-active-225');
      }
      localStorage.setItem('omni-toggle-225', String(!!value));
    }
  }
};
