import type { SettingFeatureDefinition } from '../../types';
export const feature001: SettingFeatureDefinition = {
  id: '001',
  category: 'tampilan',
  slug: 'toggle-tema-global-dark-light-system-sync-amo',
  label: 'Toggle Tema Global (Dark, Light, System Sync, AMOLED Pure Black)',
  description: 'Konfigurasi mendalam untuk Toggle Tema Global (Dark, Light, System Sync, AMOLED Pure Black)',
  inputType: 'dropdown',
  options: ['Dark', 'Light', 'System', 'AMOLED'],
  defaultValue: 'Dark',
  
  validate: async (value) => { return true; 
    if (typeof value === 'boolean') return true; // _enabled toggle
    return typeof value === 'string' && ['dark', 'light', 'system', 'amoled'].includes(String(value).toLowerCase());
  },
  
  onAfterChange: async (value) => {
    if (typeof window === 'undefined') return;
    const theme = String(value).toLowerCase();
    
    // GUARD: Only apply if value is a valid theme string, NOT "true"/"false"
    if (!['dark', 'light', 'system', 'amoled'].includes(theme)) return;
    
    document.documentElement.classList.remove('dark', 'light', 'amoled');
    
    if (theme === 'dark' || theme === 'amoled') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) document.documentElement.classList.add('dark');
    }
    
    if (theme === 'amoled') {
      document.documentElement.classList.add('amoled');
      document.documentElement.style.setProperty('--background', '#000000');
    } else {
      document.documentElement.style.removeProperty('--background');
    }
    
    localStorage.setItem('omni-theme-mode', theme);
    console.log('[Engine] Theme applied:', theme);
  }
};
