import React from 'react';
import { templateList } from './templates';
import { Icons } from '../ui/Icons';
import './TemplateSelector.css';


const TemplateSelector = ({ selected, onSelect, themeColor, onColorChange }) => {
  const colors = [
    { id: 'blue', value: '#2563eb', name: 'Bleu' },
    { id: 'green', value: '#16a34a', name: 'Vert' },
    { id: 'red', value: '#dc2626', name: 'Rouge' },
    { id: 'orange', value: '#ea580c', name: 'Orange' },
    { id: 'purple', value: '#7c3aed', name: 'Violet' },
    { id: 'dark', value: '#1e3a5f', name: 'Marine' },
    { id: 'neutral', value: '#475569', name: 'Gris' },
    { id: 'teal', value: '#0d9488', name: 'Turquoise' },
    { id: 'pink', value: '#db2777', name: 'Rose' },
    { id: 'indigo', value: '#4f46e5', name: 'Indigo' }
  ];

  return (
    <div className="template-selector">
      {/* Sélection du template */}
      <div className="selector-section">
        <h4>Choisir un modèle</h4>
        <div className="templates-grid">
          {templateList.map((template) => (
            <button
              key={template.id}
              className={`template-card ${selected === template.id ? 'active' : ''}`}
              onClick={() => onSelect(template.id)}
            >
              <div 
                className="template-preview"
                style={{ color: themeColor }}
              >
                <div 
                  className="template-icon"
                  dangerouslySetInnerHTML={{ __html: template.icon }}
                />
              </div>
              <div className="template-info">
                <span className="template-name">{template.name}</span>
                <span className="template-desc">{template.description}</span>
              </div>
              {selected === template.id && (
                <div className="template-check">
                  <Icons.check width={16} height={16} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sélection de la couleur */}
      <div className="selector-section">
        <h4>Couleur du thème</h4>
        <div className="colors-grid">
          {colors.map((color) => (
            <button
              key={color.id}
              className={`color-btn ${themeColor === color.value ? 'active' : ''}`}
              style={{ '--color': color.value }}
              onClick={() => onColorChange(color.value)}
              title={color.name}
            >
              {themeColor === color.value && (
                <Icons.check width={14} height={14} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;