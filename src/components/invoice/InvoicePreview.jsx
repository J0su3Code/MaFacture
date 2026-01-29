import React, { useRef, useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import Button from '../ui/Button';
import TemplateSelector from './TemplateSelector';

// Templates HTML pour l'aperçu
import { 
  TemplateCorporate, 
  TemplateModern, 
  TemplateClassic, 
  TemplateBold,
  TemplateMinimal,
  TemplateElegance
} from './templates';

// Templates PDF pour le téléchargement
import { 
  TemplateCorporatePDF,
  TemplateModernPDF,
  TemplateClassicPDF,
  TemplateBoldPDF,
  TemplateMinimalPDF,
  TemplateElegancePDF
} from './templates-pdf';

import './InvoicePreview.css';

const templatesHTML = {
  corporate: TemplateCorporate,
  modern: TemplateModern,
  classic: TemplateClassic,
  bold: TemplateBold,
  minimal: TemplateMinimal,
  elegance: TemplateElegance
};

const templatesPDF = {
  corporate: TemplateCorporatePDF,
  modern: TemplateModernPDF,
  classic: TemplateClassicPDF,
  bold: TemplateBoldPDF,
  minimal: TemplateMinimalPDF,
  elegance: TemplateElegancePDF
};

const InvoicePreview = ({ invoice, company, onClose }) => {
  const invoiceRef = useRef(null);
  const { t, currentPaper } = useTheme();
  
  const [selectedTemplate, setSelectedTemplate] = useState('corporate');
  const [themeColor, setThemeColor] = useState('#1e3a5f');
  const [showOptions, setShowOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const TemplateHTMLComponent = templatesHTML[selectedTemplate];
  const TemplatePDFComponent = templatesPDF[selectedTemplate];

  // Détecte le changement de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 767;
      setIsMobile(mobile);
      if (!mobile) {
        setOptionsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ferme le panneau mobile si on clique sur le document
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && optionsOpen) {
        const panel = document.querySelector('.preview-options-panel');
        const button = document.querySelector('.preview-actions button');
        if (panel && !panel.contains(e.target) && !button.contains(e.target)) {
          setOptionsOpen(false);
        }
      }
    };

    if (isMobile && showOptions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, optionsOpen, showOptions]);

  // Toggle pour mobile
  const handleOptionsToggle = () => {
    if (isMobile) {
      if (!showOptions) {
        setShowOptions(true);
        setTimeout(() => setOptionsOpen(true), 50);
      } else if (optionsOpen) {
        setOptionsOpen(false);
        setTimeout(() => setShowOptions(false), 300);
      } else {
        setOptionsOpen(true);
      }
    } else {
      setShowOptions(!showOptions);
    }
  };

  // Gestion du swipe/click sur le handle mobile
  const handlePanelClick = (e) => {
    if (isMobile && !optionsOpen) {
      e.stopPropagation();
      setOptionsOpen(true);
    }
  };

  // Génération PDF vectorielle haute qualité
  const handleDownloadPDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
       console.log('🔍 Génération avec template:', selectedTemplate); // AJOUTE CETTE LIGNE
      // Créer le document PDF avec le template vectoriel
      const pdfDocument = (
        <TemplatePDFComponent
          invoice={invoice}
          company={company}
          themeColor={themeColor}
          paperFormat={currentPaper}
          lang={invoice.lang || 'fr'}
        />
      );

      // Générer le blob PDF
      const blob = await pdf(pdfDocument).toBlob();

      // Télécharger le fichier
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.number || 'facture'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!TemplateHTMLComponent) {
    console.warn(`Template "${selectedTemplate}" not found`);
    return null;
  }

  return (
    <div className="preview-overlay">
      <div className="preview-container">
        {/* Header */}
        <div className="preview-header">
          <h2>{t('preview')}</h2>
          <div className="preview-actions">
            <Button 
              variant="ghost" 
              onClick={handleOptionsToggle}
              className={showOptions ? 'active' : ''}
            >
              <Icons.palette width={18} height={18} />
              <span>Style</span>
            </Button>
            <Button variant="secondary" icon="printer" onClick={handlePrint}>
              {t('print')}
            </Button>
            <Button 
              variant="primary" 
              icon="download" 
              onClick={handleDownloadPDF}
              loading={isGenerating}
              disabled={isGenerating}
            >
              {isGenerating ? 'Génération...' : 'PDF'}
            </Button>
            <button className="preview-close" onClick={onClose}>
              <Icons.x width={24} height={24} />
            </button>
          </div>
        </div>

        <div className="preview-body">
          {/* Document Preview - Utilise HTML pour l'aperçu rapide */}
          <div className="preview-scroll">
            <div ref={invoiceRef} className="preview-document">
              <TemplateHTMLComponent
                invoice={invoice}
                company={company}
                themeColor={themeColor}
                paperFormat={currentPaper}
                lang={invoice.lang || 'fr'}
              />
            </div>
          </div>

          {/* Options Panel */}
          {showOptions && (
            <div 
              className={`preview-options-panel ${isMobile && optionsOpen ? 'open' : ''}`}
              onClick={handlePanelClick}
            >
              <TemplateSelector
                selected={selectedTemplate}
                onSelect={setSelectedTemplate}
                themeColor={themeColor}
                onColorChange={setThemeColor}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;