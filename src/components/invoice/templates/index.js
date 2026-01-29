// src/components/invoice/templates/index.js

// Export de tous les templates
export { default as TemplateCorporate } from './TemplateCorporate';
export { default as TemplateModern } from './TemplateModern';
export { default as TemplateClassic } from './TemplateClassic';
export { default as TemplateBold } from './TemplateBold';
export { default as TemplateMinimal } from './TemplateMinimal';
export { default as TemplateElegance } from './TemplateElegance';

// Icônes SVG
const icons = {
  corporate: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="24" height="20" rx="2" stroke="currentColor" stroke-width="2"/>
    <rect x="12" y="8" width="16" height="6" rx="1" fill="currentColor" opacity="0.3"/>
    <rect x="12" y="18" width="6" height="4" rx="1" fill="currentColor"/>
    <rect x="22" y="18" width="6" height="4" rx="1" fill="currentColor"/>
    <rect x="12" y="25" width="6" height="4" rx="1" fill="currentColor"/>
    <rect x="22" y="25" width="6" height="4" rx="1" fill="currentColor"/>
  </svg>`,
  
  modern: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="12" r="4" fill="currentColor"/>
    <rect x="8" y="20" width="24" height="2" rx="1" fill="currentColor"/>
    <rect x="8" y="25" width="18" height="2" rx="1" fill="currentColor" opacity="0.5"/>
    <rect x="8" y="30" width="24" height="2" rx="1" fill="currentColor" opacity="0.3"/>
  </svg>`,
  
  classic: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="24" height="28" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="10" y="8" width="20" height="24" rx="1" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>
    <line x1="14" y1="14" x2="26" y2="14" stroke="currentColor" stroke-width="2"/>
    <line x1="14" y1="19" x2="26" y2="19" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
    <line x1="14" y1="23" x2="26" y2="23" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
    <line x1="14" y1="27" x2="22" y2="27" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
  </svg>`,
  
  bold: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="8,8 32,8 32,32 8,32" fill="currentColor" opacity="0.1"/>
    <polygon points="8,8 20,8 8,20" fill="currentColor"/>
    <polygon points="32,32 20,32 32,20" fill="currentColor"/>
    <rect x="14" y="16" width="12" height="2" rx="1" fill="currentColor"/>
    <rect x="14" y="21" width="12" height="2" rx="1" fill="currentColor" opacity="0.6"/>
  </svg>`,
  
  minimal: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="8" width="8" height="3" rx="1.5" fill="currentColor"/>
    <rect x="10" y="14" width="20" height="1" rx="0.5" fill="currentColor" opacity="0.2"/>
    <rect x="10" y="18" width="20" height="1" rx="0.5" fill="currentColor" opacity="0.2"/>
    <rect x="10" y="22" width="20" height="1" rx="0.5" fill="currentColor" opacity="0.2"/>
    <rect x="22" y="28" width="8" height="4" rx="1" fill="currentColor"/>
  </svg>`,
  
  elegance: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="28" height="28" rx="1" stroke="currentColor" stroke-width="1" opacity="0.3"/>
    <rect x="8" y="8" width="24" height="24" rx="1" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 8L12 8L8 12L8 8Z" fill="currentColor"/>
    <path d="M32 32L28 32L32 28L32 32Z" fill="currentColor"/>
    <line x1="14" y1="16" x2="26" y2="16" stroke="currentColor" stroke-width="1.5"/>
    <line x1="14" y1="20" x2="26" y2="20" stroke="currentColor" stroke-width="1" opacity="0.4"/>
    <line x1="14" y1="24" x2="22" y2="24" stroke="currentColor" stroke-width="1" opacity="0.4"/>
    <circle cx="20" cy="12" r="1.5" fill="currentColor"/>
  </svg>`
};

// Liste des templates
export const templateList = [
  {
    id: 'corporate',
    name: 'Corporate Pro',
    description: 'Professionnel avec blocs colorés',
    icon: icons.corporate,
    category: 'professional'
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Épuré avec accents de couleur',
    icon: icons.modern,
    category: 'professional'
  },
  {
    id: 'classic',
    name: 'Classic Elegant',
    description: 'Traditionnel avec bordures décoratives',
    icon: icons.classic,
    category: 'professional'
  },
  {
    id: 'bold',
    name: 'Bold Creative',
    description: 'Moderne avec formes géométriques',
    icon: icons.bold,
    category: 'creative'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Ultra épuré, beaucoup d\'espace blanc',
    icon: icons.minimal,
    category: 'professional'
  },
  {
    id: 'elegance',
    name: 'Elegance',
    description: 'Luxueux avec motifs raffinés',
    icon: icons.elegance,
    category: 'premium'
  }
];