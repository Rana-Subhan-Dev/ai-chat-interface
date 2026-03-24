/**
 * @file ThemeContext.jsx
 * @description Manages dark/light mode for the entire app.
 *
 *              Strategy:
 *              1. On first load, check localStorage for a saved preference.
 *              2. If no saved preference, fall back to the OS system preference
 *                 via window.matchMedia('(prefers-color-scheme: dark)').
 *              3. When the theme changes, toggle the 'dark' class on <html>.
 *                 Tailwind's darkMode: 'class' picks this up automatically.
 *              4. Persist the choice to localStorage so it survives page reloads.
 */
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Check if user has already chosen a theme
    const saved = localStorage.getItem('ai-chat-theme');
    if (saved) return saved;

    // 2. Fall back to OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const root = document.documentElement; // <html> element

    // Apply or remove the 'dark' class Tailwind watches
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Persist choice
    localStorage.setItem('ai-chat-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook — use this in any component:
 * const { theme, toggleTheme } = useTheme();
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
