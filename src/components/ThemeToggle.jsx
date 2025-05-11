import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Composant pour basculer entre les thèmes clair et sombre
 * Nouveau style avec animation et icônes alternatives
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      aria-label={`Passer au mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {theme === 'dark' ? (
            <i className="bi bi-brightness-high-fill"></i>
          ) : (
            <i className="bi bi-moon-stars-fill"></i>
          )}
        </div>
      </div>
      <span className="toggle-label">
        {theme === 'dark' ? 'Mode jour' : 'Mode nuit'}
      </span>
    </button>
  );
}