import type { SettingFeatureDefinition } from '../../types';
export const feature203: SettingFeatureDefinition = {
  id: '203',
  category: 'llm',
  slug: 'cron-job-scheduler-otomatis-jalanin-task-konv',
  label: 'Cron Job Scheduler (Otomatis jalanin task konversi spesifik di jam 00:00)',
  description: 'Konfigurasi mendalam untuk Cron Job Scheduler (Otomatis jalanin task konversi spesifik di jam 00:00)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-203');
      } else {
        document.body.classList.remove('omni-engine-active-203');
      }
      localStorage.setItem('omni-toggle-203', String(!!value));
    }
  }
};
