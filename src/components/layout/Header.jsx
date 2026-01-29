import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const { userData, logout } = useAuth();
  const { t, language, changeLanguage } = useTheme();

  const toggleLanguage = () => {
    changeLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <Icons.menu width={24} height={24} />
        </button>
        
        <div className="header-brand">
          <Icons.fileText width={28} height={28} />
          <span className="brand-name">MaFacture</span>
        </div>
      </div>

      <div className="header-right">
        <button 
          className="header-btn lang-toggle" 
          onClick={toggleLanguage}
          title={t('language')}
        >
          <Icons.globe width={20} height={20} />
          <span>{language.toUpperCase()}</span>
        </button>

        <div className="header-user">
          <div className="user-avatar">
            {userData?.companyName?.charAt(0) || 'U'}
          </div>
          <span className="user-name">{userData?.companyName || 'Utilisateur'}</span>
        </div>

        <button 
          className="header-btn logout-btn" 
          onClick={logout}
          title={t('logout')}
        >
          <Icons.logout width={20} height={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;