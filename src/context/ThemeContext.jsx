// context/ThemeContext.js
import { createContext, useContext, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [storedTheme, setStoredTheme] = useLocalStorage('theme', 'light');
  const [theme, setTheme] = useState(storedTheme);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      setStoredTheme(newTheme);
      return newTheme;
    });
  }, [setStoredTheme]);

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Export nommé obligatoire
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Export par défaut optionnel
export default ThemeContext;