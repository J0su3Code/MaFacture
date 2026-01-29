import React from 'react';
import { useTheme, paperSizes } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import './PaperSettings.css';

const PaperSettings = () => {
  const { paperSize, changePaperSize, t } = useTheme();

  return (
    <div className="paper-settings">
      <div className="paper-grid">
        {Object.entries(paperSizes).map(([key, value]) => (
          <button
            key={key}
            className={`paper-option ${paperSize === key ? 'active' : ''}`}
            onClick={() => changePaperSize(key)}
          >
            <div className="paper-preview">
              <div 
                className="paper-icon"
                style={{
                  width: key === 'A5' ? '28px' : '32px',
                  height: key === 'A5' ? '40px' : key === 'Letter' ? '42px' : '45px'
                }}
              >
                {paperSize === key && (
                  <Icons.check width={14} height={14} />
                )}
              </div>
            </div>
            <div className="paper-info">
              <span className="paper-name">{key}</span>
              <span className="paper-size">{t(value.name)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaperSettings;