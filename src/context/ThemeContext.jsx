import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fr } from '../locales/fr';
import { en } from '../locales/en';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Thèmes de couleurs disponibles
export const themes = {
  blue: {
    name: 'themeBlue',
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    primaryLight: '#3b82f6',
    accent: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)'
  },
  green: {
    name: 'themeGreen',
    primary: '#16a34a',
    primaryDark: '#15803d',
    primaryLight: '#22c55e',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #10b981 100%)'
  },
  red: {
    name: 'themeRed',
    primary: '#dc2626',
    primaryDark: '#b91c1c',
    primaryLight: '#ef4444',
    accent: '#f97316',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)'
  },
  orange: {
    name: 'themeOrange',
    primary: '#ea580c',
    primaryDark: '#c2410c',
    primaryLight: '#f97316',
    accent: '#fbbf24',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #fbbf24 100%)'
  },
  purple: {
    name: 'themePurple',
    primary: '#7c3aed',
    primaryDark: '#6d28d9',
    primaryLight: '#8b5cf6',
    accent: '#a855f7',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
  },
  neutral: {
    name: 'themeNeutral',
    primary: '#475569',
    primaryDark: '#334155',
    primaryLight: '#64748b',
    accent: '#94a3b8',
    gradient: 'linear-gradient(135deg, #475569 0%, #64748b 100%)'
  }
};

// Formats de papier
export const paperSizes = {
  A4: { width: '210mm', height: '297mm', name: 'paperA4' },
  A5: { width: '148mm', height: '210mm', name: 'paperA5' },
  Letter: { width: '216mm', height: '279mm', name: 'paperLetter' }
};

export const ThemeProvider = ({ children }) => {
  const { userData, updateUserData } = useAuth() || {};
  
  const [theme, setTheme] = useState('blue');
  const [language, setLanguage] = useState('fr');
  const [paperSize, setPaperSize] = useState('A4');

  // Charger les préférences utilisateur
  useEffect(() => {
    if (userData?.settings) {
      setTheme(userData.settings.theme || 'blue');
      setLanguage(userData.settings.language || 'fr');
      setPaperSize(userData.settings.paperSize || 'A4');
    }
  }, [userData]);

  // Appliquer les variables CSS du thème
  useEffect(() => {
    const currentTheme = themes[theme];
    document.documentElement.style.setProperty('--primary', currentTheme.primary);
    document.documentElement.style.setProperty('--primary-dark', currentTheme.primaryDark);
    document.documentElement.style.setProperty('--primary-light', currentTheme.primaryLight);
    document.documentElement.style.setProperty('--accent', currentTheme.accent);
    document.documentElement.style.setProperty('--gradient', currentTheme.gradient);
  }, [theme]);

  const t = (key) => {
    const translations = language === 'fr' ? fr : en;
    return translations[key] || key;
  };

  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    if (updateUserData) {
      await updateUserData({ 'settings.theme': newTheme });
    }
  };

  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    if (updateUserData) {
      await updateUserData({ 'settings.language': newLang });
    }
  };

  const changePaperSize = async (newSize) => {
    setPaperSize(newSize);
    if (updateUserData) {
      await updateUserData({ 'settings.paperSize': newSize });
    }
  };

  const value = {
    theme,
    themes,
    changeTheme,
    language,
    changeLanguage,
    paperSize,
    paperSizes,
    changePaperSize,
    t,
    currentTheme: themes[theme],
    currentPaper: paperSizes[paperSize]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};