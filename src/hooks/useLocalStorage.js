/**
 * @file useLocalStorage.js
 * @description A drop-in replacement for useState that automatically
 *              syncs its value to localStorage.
 *
 *              Usage:
 *              const [theme, setTheme] = useLocalStorage('theme', 'light');
 *
 *              Why not just use useState + useEffect?
 *              This keeps the sync logic in one place and reusable.
 */
import { useState } from 'react';

/**
 * @hook useLocalStorage
 * @param {string} key - The localStorage key to read/write
 * @param {*} initialValue - Default value if key doesn't exist in storage
 * @returns {[any, Function]} - Tuple of [value, setter] just like useState
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Support functional updates: setValue(prev => prev + 1)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      console.warn(`Failed to save '${key}' to localStorage`);
    }
  };

  return [storedValue, setValue];
}
