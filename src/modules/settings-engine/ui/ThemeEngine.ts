/**
 * ThemeEngine
 * Central "Brain" for translating User Setting objects into raw DOM, CSS Variable, and attribute mutations.
 */
export class ThemeEngine {
  
  /**
   * Safely resolves the exact color mode and applies the dark/light class
   */
  static applyColorMode(themeValue: 'light' | 'dark' | 'system') {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (themeValue === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(themeValue);
    }
  }

  /**
   * Enforces font sizes via HTML mapping variables 
   */
  static applyTypographyScale(scaleValue: string) {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-fontsize', scaleValue);
    
    // Fallback direct mutation if CSS variables aren't set
    const pxMap: Record<string, string> = {
      'sm': '14px',
      'md': '16px',
      'lg': '18px',
    };
    if (pxMap[scaleValue]) {
      document.body.style.fontSize = pxMap[scaleValue];
    }
  }

  /**
   * Shuts off all CSS transition engines if the user has motion sickness or disabled it
   */
  static applyMotionConstraints(reduceMotion: boolean) {
    if (typeof document === 'undefined') return;
    
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
      // For GSAP integration:
      if ((window as any).gsap) {
        (window as any).gsap.globalTimeline.timeScale(100); // 100x speed forces instant jump
      }
    } else {
      document.documentElement.classList.remove('reduce-motion');
      if ((window as any).gsap) {
        (window as any).gsap.globalTimeline.timeScale(1); // Normal speed
      }
    }
  }

  /**
   * Run the full pipeline 
   */
  static executeFullPipeline(uiPreferences: { theme: 'light' | 'dark' | 'system'; fontSize: string; reduceMotion: boolean }) {
    this.applyColorMode(uiPreferences.theme);
    this.applyTypographyScale(uiPreferences.fontSize);
    this.applyMotionConstraints(uiPreferences.reduceMotion);
  }
}
