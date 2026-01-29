import React from 'react';
import { formatAmount, formatDate } from '../../../utils/formatters';
import SignatureZone from './SignatureZone';
import './TemplateElegance.css';

const TemplateElegance = ({ invoice, company, themeColor, paperFormat = 'A4', lang = 'fr' }) => {
  const primaryColor = themeColor || '#1a1a2e';
  
  // Configuration des formats papier
  const paperConfig = {
    'A4': { width: '210mm', height: '297mm' },
    'Letter': { width: '215.9mm', height: '279.4mm' },
    'Legal': { width: '215.9mm', height: '355.6mm' }
  };
  
  const paper = paperConfig[paperFormat] || paperConfig['A4'];

  // Traductions
  const translations = {
    fr: {
      invoice: 'FACTURE',
      invoiceNumber: 'Facture N°',
      date: 'Date d\'émission',
      dueDate: 'Date d\'échéance',
      billTo: 'Adressé à',
      from: 'Émetteur',
      description: 'Désignation',
      qty: 'Qté',
      unitPrice: 'Prix unitaire',
      total: 'Montant',
      subtotal: 'Sous-total HT',
      tax: 'TVA',
      discount: 'Remise',
      grandTotal: 'Total TTC',
      paymentInfo: 'Informations bancaires',
      bank: 'Banque',
      notes: 'Conditions & Mentions',
      thanks: 'Nous vous remercions de votre confiance',
      page: 'Page',
      status: {
        draft: 'Brouillon',
        pending: 'En attente',
        paid: 'Acquittée',
        overdue: 'Échue',
        cancelled: 'Annulée'
      }
    },
    en: {
      invoice: 'INVOICE',
      invoiceNumber: 'Invoice No.',
      date: 'Issue Date',
      dueDate: 'Due Date',
      billTo: 'Bill To',
      from: 'From',
      description: 'Description',
      qty: 'Qty',
      unitPrice: 'Unit Price',
      total: 'Amount',
      subtotal: 'Subtotal',
      tax: 'Tax',
      discount: 'Discount',
      grandTotal: 'Total Due',
      paymentInfo: 'Bank Details',
      bank: 'Bank',
      notes: 'Terms & Conditions',
      thanks: 'Thank you for your business',
      page: 'Page',
      status: {
        draft: 'Draft',
        pending: 'Pending',
        paid: 'Paid',
        overdue: 'Overdue',
        cancelled: 'Cancelled'
      }
    }
  };

  const t = translations[lang] || translations.fr;

  // Configuration des statuts
  const statusConfig = {
    draft: { color: '#6b7280', bg: '#f3f4f6' },
    pending: { color: '#b45309', bg: '#fef3c7' },
    paid: { color: '#047857', bg: '#d1fae5' },
    overdue: { color: '#b91c1c', bg: '#fee2e2' },
    cancelled: { color: '#6b7280', bg: '#f3f4f6' }
  };

  const status = invoice.status || 'pending';
  const statusStyle = statusConfig[status] || statusConfig.pending;
  const statusLabel = t.status[status] || t.status.pending;

  // Conversion Hex vers HSL
  const hexToHSL = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
        default: h = 0;
      }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hsl = hexToHSL(primaryColor);

  // Variables CSS
  const cssVariables = {
    '--primary': primaryColor,
    '--primary-light': `hsl(${hsl.h}, ${Math.max(hsl.s - 20, 10)}%, ${Math.min(hsl.l + 30, 92)}%)`,
    '--primary-dark': `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(hsl.l - 15, 8)}%)`,
    '--primary-bg': `hsl(${hsl.h}, ${Math.max(hsl.s - 35, 5)}%, 97%)`,
    '--accent': `hsl(${hsl.h + 30}, ${Math.max(hsl.s - 10, 20)}%, ${Math.min(hsl.l + 10, 45)}%)`,
    '--paper-width': paper.width,
    '--paper-height': paper.height,
    '--status-color': statusStyle.color,
    '--status-bg': statusStyle.bg
  };

  // Déterminer le type de signature à afficher
  const getSignatureType = () => {
    if (!invoice.signatureSettings) return 'company';
    const { showCompanySignature, showClientSignature } = invoice.signatureSettings;
    if (showCompanySignature && showClientSignature) return 'both';
    if (showClientSignature) return 'client';
    return 'company';
  };

  return (
    <div 
      className="template-elegance"
      data-format={paperFormat}
      style={cssVariables}
    >
      {/* Motif de fond */}
      <div className="elegance-pattern"></div>

      {/* Bordure décorative */}
      <div className="elegance-border">
        <div className="border-corner border-tl"></div>
        <div className="border-corner border-tr"></div>
        <div className="border-corner border-bl"></div>
        <div className="border-corner border-br"></div>
      </div>

      {/* ===== EN-TÊTE ===== */}
      <header className="elegance-header">
        <div className="header-brand">
          {company?.logo ? (
            <img 
              src={company.logo} 
              alt={company.name || 'Logo'} 
              className="elegance-logo" 
            />
          ) : (
            <div className="elegance-logo-text">
              {(company?.name || 'E').charAt(0)}
            </div>
          )}
          <div className="brand-info">
            <h1 className="brand-name">{company?.name || 'Votre Entreprise'}</h1>
            {company?.tagline && <span className="brand-tagline">{company.tagline}</span>}
          </div>
        </div>

        <div className="header-title">
          <span className="title-label">{t.invoice}</span>
          <span className="title-number">{invoice.number || '---'}</span>
          <div className="title-status">
            <span className="status-dot"></span>
            <span className="status-text">{statusLabel}</span>
          </div>
        </div>
      </header>

      {/* ===== LIGNE DÉCORATIVE ===== */}
      <div className="elegance-divider">
        <span className="divider-line"></span>
        <span className="divider-diamond"></span>
        <span className="divider-line"></span>
      </div>

      {/* ===== INFORMATIONS ===== */}
      <section className="elegance-info">
        <div className="info-dates">
          <div className="info-item">
            <span className="info-label">{t.date}</span>
            <span className="info-value">{formatDate(invoice.date, 'long')}</span>
          </div>
          {invoice.dueDate && (
            <div className="info-item">
              <span className="info-label">{t.dueDate}</span>
              <span className="info-value">{formatDate(invoice.dueDate, 'long')}</span>
            </div>
          )}
        </div>

        <div className="info-parties">
          <div className="party-box party-from">
            <span className="party-label">{t.from}</span>
            <div className="party-content">
              <strong>{company?.name || 'Votre Entreprise'}</strong>
              {company?.address && <span>{company.address}</span>}
              {company?.city && <span>{company.city}</span>}
              {company?.phone && <span>{company.phone}</span>}
              {company?.email && <span>{company.email}</span>}
              {company?.taxId && <span className="tax-number">{company.taxId}</span>}
            </div>
          </div>

          <div className="party-separator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
            </svg>
          </div>

          <div className="party-box party-to">
            <span className="party-label">{t.billTo}</span>
            <div className="party-content">
              <strong>{invoice.client?.name || 'Client'}</strong>
              {invoice.client?.company && <span>{invoice.client.company}</span>}
              {invoice.client?.address && <span>{invoice.client.address}</span>}
              {invoice.client?.city && <span>{invoice.client.city}</span>}
              {invoice.client?.email && <span>{invoice.client.email}</span>}
              {invoice.client?.phone && <span>{invoice.client.phone}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TABLEAU DES ITEMS ===== */}
      <section className="elegance-items">
        <table className="items-table">
          <thead>
            <tr>
              <th className="col-desc">{t.description}</th>
              <th className="col-qty">{t.qty}</th>
              <th className="col-price">{t.unitPrice}</th>
              <th className="col-total">{t.total}</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, index) => (
              <tr key={item.id || index}>
                <td className="col-desc">
                  <span className="item-name">{item.description || '—'}</span>
                  {item.details && <span className="item-details">{item.details}</span>}
                </td>
                <td className="col-qty">{item.quantity || 0}</td>
                <td className="col-price">{formatAmount(item.unitPrice || 0)}</td>
                <td className="col-total">{formatAmount((item.quantity || 0) * (item.unitPrice || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ===== TOTAUX ===== */}
      <section className="elegance-totals">
        <div className="totals-decoration">
          <span className="deco-line"></span>
        </div>
        
        <div className="totals-content">
          <div className="totals-breakdown">
            <div className="total-row">
              <span className="total-label">{t.subtotal}</span>
              <span className="total-value">{formatAmount(invoice.subtotal || 0)}</span>
            </div>
            
            {(invoice.taxRate > 0) && (
              <div className="total-row">
                <span className="total-label">{t.tax} ({invoice.taxRate}%)</span>
                <span className="total-value">{formatAmount(invoice.tax || 0)}</span>
              </div>
            )}
            
            {(invoice.discount > 0) && (
              <div className="total-row discount">
                <span className="total-label">{t.discount}</span>
                <span className="total-value">−{formatAmount(invoice.discount)}</span>
              </div>
            )}
          </div>

          <div className="grand-total">
            <span className="grand-label">{t.grandTotal}</span>
            <span className="grand-value">{formatAmount(invoice.total || 0)}</span>
          </div>
        </div>
      </section>

      {/* ===== PAIEMENT & NOTES ===== */}
      <section className="elegance-footer-info">
        {(company?.iban || company?.bankName) && (
          <div className="footer-block payment-block">
            <h4>{t.paymentInfo}</h4>
            <div className="block-content">
              {company?.bankName && (
                <div className="payment-row">
                  <span className="payment-label">{t.bank}</span>
                  <span className="payment-value">{company.bankName}</span>
                </div>
              )}
              {company?.iban && (
                <div className="payment-row">
                  <span className="payment-label">IBAN</span>
                  <span className="payment-value mono">{company.iban}</span>
                </div>
              )}
              {company?.bic && (
                <div className="payment-row">
                  <span className="payment-label">BIC</span>
                  <span className="payment-value mono">{company.bic}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {invoice.notes && (
          <div className="footer-block notes-block">
            <h4>{t.notes}</h4>
            <div className="block-content">
              <p>{invoice.notes}</p>
            </div>
          </div>
        )}
      </section>

      {/* ===== PIÈCES JOINTES ===== */}
      {invoice.images && invoice.images.length > 0 && (
        <section className="elegance-attachments no-break">
          <div className="attachments-grid">
            {invoice.images.map((image, index) => (
              <figure key={index} className="attachment-item">
                <img src={image.data || image} alt={`Attachment ${index + 1}`} />
                <figcaption>{index + 1}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ===== SIGNATURES ===== */}
      <section className="elegance-signatures no-break">
        <SignatureZone
          invoice={invoice}
          company={company}
          type={getSignatureType()}
          lang={lang}
        />
      </section>

      {/* ===== SPACER ===== */}
      <div className="elegance-spacer"></div>

      {/* ===== PIED DE PAGE ===== */}
      <footer className="elegance-footer">
        <div className="footer-thanks">{t.thanks}</div>
        <div className="footer-contacts">
          {company?.phone && <span>{company.phone}</span>}
          {company?.phone && company?.email && <span className="separator">•</span>}
          {company?.email && <span>{company.email}</span>}
        </div>
        {company?.website && (
          <div className="footer-website">{company.website}</div>
        )}
      </footer>
    </div>
  );
};

export default TemplateElegance;