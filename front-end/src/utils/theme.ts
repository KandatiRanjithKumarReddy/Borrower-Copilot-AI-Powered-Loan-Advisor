import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'borrower_copilot_theme';

/**
 * Reads stored theme or defaults to 'light'.
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return 'light';
  } catch {
    return 'light';
  }
}

/**
 * Applies the theme to <html> element and persists to localStorage.
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage quota/security errors
  }
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/**
 * Toggles between light and dark theme.
 */
export function toggleTheme(): Theme {
  const current = getStoredTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

/**
 * React hook for consuming and updating theme state.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    const onThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: Theme }>;
      if (customEvent.detail?.theme) {
        setThemeState(customEvent.detail.theme);
      } else {
        setThemeState(getStoredTheme());
      }
    };

    window.addEventListener('themechange', onThemeChange);
    window.addEventListener('storage', (e) => {
      if (e.key === THEME_STORAGE_KEY) {
        setThemeState(getStoredTheme());
      }
    });

    return () => {
      window.removeEventListener('themechange', onThemeChange);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
    setThemeState(newTheme);
  };

  const toggle = () => {
    const next = toggleTheme();
    setThemeState(next);
  };

  return { theme, isDark: theme === 'dark', setTheme, toggleTheme: toggle };
}
