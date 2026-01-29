import React from 'react';
import { useTheme, themes } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { theme, changeTheme, t } = useTheme();

  return (
    <div className="theme-selector">
      <div className="theme-grid">
        {Object.entries(themes).map(([key, value]) => (
          <button
            key={key}
            className={`theme-option ${theme === key ? 'active' : ''}`}
            onClick={() => changeTheme(key)}
            style={{ '--option-color': value.primary }}
          >
            <div 
              className="theme-preview"
              style={{ background: value.gradient }}
            >
              {theme === key && (
                <Icons.check width={20} height={20} />
              )}
            </div>
            <span className="theme-name">{t(value.name)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;