import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import CompanySettings from './CompanySettings';
import ThemeSelector from './ThemeSelector';
import PaperSettings from './PaperSettings';
import { Select } from '../ui/Input';
import './Settings.css';

const Settings = () => {
  const { t, language, changeLanguage } = useTheme();
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: t('companySettings'), icon: 'users' },
    { id: 'appearance', label: t('appearance'), icon: 'palette' },
  ];

  return (
    <div className="settings-page">
      {/* Tabs navigation */}
      <div className="settings-tabs">
        {tabs.map((tab) => {
          const IconComponent = Icons[tab.icon];
          return (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent width={20} height={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="settings-content">
        {activeTab === 'company' && <CompanySettings />}

        {activeTab === 'appearance' && (
          <div className="appearance-settings">
            <div className="settings-header">
              <div>
                <h1>{t('appearance')}</h1>
                <p className="text-muted">Personnalisez l'apparence de vos factures</p>
              </div>
            </div>

            <div className="appearance-grid">
              {/* Langue */}
              <section className="settings-section card">
                <h2>
                  <Icons.globe width={20} height={20} />
                  {t('language')}
                </h2>
                <p className="text-muted text-sm">Langue de l'interface et des factures</p>
                
                <div className="language-options">
                  <button
                    className={`lang-option ${language === 'fr' ? 'active' : ''}`}
                    onClick={() => changeLanguage('fr')}
                  >
                    <span className="lang-flag">🇫🇷</span>
                    <span>Français</span>
                    {language === 'fr' && <Icons.check width={18} height={18} />}
                  </button>
                  
                  <button
                    className={`lang-option ${language === 'en' ? 'active' : ''}`}
                    onClick={() => changeLanguage('en')}
                  >
                    <span className="lang-flag">🇬🇧</span>
                    <span>English</span>
                    {language === 'en' && <Icons.check width={18} height={18} />}
                  </button>
                </div>
              </section>

              {/* Thème couleur */}
              <section className="settings-section card">
                <h2>
                  <Icons.palette width={20} height={20} />
                  {t('theme')}
                </h2>
                <p className="text-muted text-sm">Couleur principale de vos factures</p>
                
                <ThemeSelector />
              </section>

              {/* Format papier */}
              <section className="settings-section card">
                <h2>
                  <Icons.fileText width={20} height={20} />
                  {t('paperSize')}
                </h2>
                <p className="text-muted text-sm">Format de papier pour l'impression et le PDF</p>
                
                <PaperSettings />
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;