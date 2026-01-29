import React from 'react';
import { formatAmount, formatDate } from '../../../utils/formatters';
import SignatureZone from './SignatureZone';
import './TemplateMinimal.css';

const TemplateMinimal = ({ invoice, company, themeColor, paperFormat = 'A4', lang = 'fr' }) => {
  const primaryColor = themeColor || '#0f172a';
  
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
      invoice: 'Facture',
      invoiceNumber: 'N°',
      date: 'Date',
      dueDate: 'Échéance',
      billTo: 'Facturer à',
      from: 'De',
      description: 'Description',
      qty: 'Qté',
      unitPrice: 'Prix',
      total: 'Total',
      subtotal: 'Sous-total',
      tax: 'TVA',
      discount: 'Remise',
      grandTotal: 'Total',
      paymentInfo: 'Paiement',
      bankTransfer: 'Virement bancaire',
      bank: 'Banque',
      notes: 'Notes',
      thanks: 'Merci !',
      page: 'Page',
      status: {
        draft: 'Brouillon',
        pending: 'En attente',
        paid: 'Payée',
        overdue: 'En retard',
        cancelled: 'Annulée'
      }
    },
    en: {
      invoice: 'Invoice',
      invoiceNumber: 'No.',
      date: 'Date',
      dueDate: 'Due',
      billTo: 'Bill to',
      from: 'From',
      description: 'Description',
      qty: 'Qty',
      unitPrice: 'Price',
      total: 'Total',
      subtotal: 'Subtotal',
      tax: 'Tax',
      discount: 'Discount',
      grandTotal: 'Total',
      paymentInfo: 'Payment',
      bankTransfer: 'Bank Transfer',
      bank: 'Bank',
      notes: 'Notes',
      thanks: 'Thank you!',
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
    draft: { color: '#64748b', bg: '#f1f5f9' },
    pending: { color: '#f59e0b', bg: '#fef3c7' },
    paid: { color: '#10b981', bg: '#d1fae5' },
    overdue: { color: '#ef4444', bg: '#fee2e2' },
    cancelled: { color: '#64748b', bg: '#f1f5f9' }
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

  // Variables CSS dynamiques
  const cssVariables = {
    '--primary': primaryColor,
    '--primary-light': `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(hsl.l + 25, 90)}%)`,
    '--primary-dark': `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(hsl.l - 15, 10)}%)`,
    '--primary-bg': `hsl(${hsl.h}, ${Math.max(hsl.s - 30, 10)}%, 98%)`,
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
      className="template-minimal"
      data-format={paperFormat}
      style={cssVariables}
    >
      {/* ===== EN-TÊTE MINIMALISTE ===== */}
      <header className="min-header">
        <div className="header-left">
          {company?.logo ? (
            <img 
              src={company.logo} 
              alt={company.name || 'Logo'} 
              className="min-logo" 
            />
          ) : (
            <div className="min-logo-text">
              {(company?.name || 'Entreprise').split(' ').map(w => w[0]).join('').substring(0, 2)}
            </div>
          )}
        </div>

        <div className="header-right">
          <div className="invoice-label">{t.invoice}</div>
          <div className="invoice-number">{invoice.number || '---'}</div>
          <div className="invoice-status-badge">
            {statusLabel}
          </div>
        </div>
      </header>

      {/* ===== MÉTADONNÉES ===== */}
      <section className="min-meta">
        <div className="meta-dates">
          <div className="meta-item">
            <span className="meta-label">{t.date}</span>
            <span className="meta-value">{formatDate(invoice.date, 'short')}</span>
          </div>
          {invoice.dueDate && (
            <div className="meta-item">
              <span className="meta-label">{t.dueDate}</span>
              <span className="meta-value">{formatDate(invoice.dueDate, 'short')}</span>
            </div>
          )}
        </div>
      </section>

      {/* ===== PARTIES ===== */}
      <section className="min-parties">
        <div className="party-block party-from">
          <span className="party-label">{t.from}</span>
          <div className="party-content">
            <strong className="party-name">{company?.name || 'Votre Entreprise'}</strong>
            {company?.address && <span>{company.address}</span>}
            {company?.city && <span>{company.city}</span>}
            {company?.email && <span>{company.email}</span>}
            {company?.phone && <span>{company.phone}</span>}
            {company?.taxId && <span className="tax-id">{company.taxId}</span>}
          </div>
        </div>

        <div className="party-block party-to">
          <span className="party-label">{t.billTo}</span>
          <div className="party-content">
            <strong className="party-name">{invoice.client?.name || 'Client'}</strong>
            {invoice.client?.address && <span>{invoice.client.address}</span>}
            {invoice.client?.city && <span>{invoice.client.city}</span>}
            {invoice.client?.email && <span>{invoice.client.email}</span>}
            {invoice.client?.phone && <span>{invoice.client.phone}</span>}
          </div>
        </div>
      </section>

      {/* ===== LIGNE DE SÉPARATION ===== */}
      <div className="min-divider"></div>

      {/* ===== TABLEAU MINIMALISTE ===== */}
      <section className="min-items">
        <div className="items-header">
          <span className="col-desc">{t.description}</span>
          <span className="col-qty">{t.qty}</span>
          <span className="col-price">{t.unitPrice}</span>
          <span className="col-total">{t.total}</span>
        </div>
        
        <div className="items-body">
          {(invoice.items || []).map((item, index) => (
            <div className="item-row" key={item.id || index}>
              <span className="col-desc">
                <span className="item-name">{item.description || '—'}</span>
                {item.details && <span className="item-details">{item.details}</span>}
              </span>
              <span className="col-qty">{item.quantity || 0}</span>
              <span className="col-price">{formatAmount(item.unitPrice || 0)}</span>
              <span className="col-total">{formatAmount((item.quantity || 0) * (item.unitPrice || 0))}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TOTAUX ===== */}
      <section className="min-totals">
        <div className="totals-wrapper">
          <div className="totals-lines">
            <div className="total-line">
              <span className="total-label">{t.subtotal}</span>
              <span className="total-value">{formatAmount(invoice.subtotal || 0)}</span>
            </div>
            
            {(invoice.taxRate > 0) && (
              <div className="total-line">
                <span className="total-label">{t.tax} ({invoice.taxRate}%)</span>
                <span className="total-value">{formatAmount(invoice.tax || 0)}</span>
              </div>
            )}
            
            {(invoice.discount > 0) && (
              <div className="total-line discount-line">
                <span className="total-label">{t.discount}</span>
                <span className="total-value">−{formatAmount(invoice.discount)}</span>
              </div>
            )}
          </div>

          <div className="grand-total-line">
            <span className="grand-label">{t.grandTotal}</span>
            <span className="grand-value">{formatAmount(invoice.total || 0)}</span>
          </div>
        </div>
      </section>

      {/* ===== PAIEMENT & NOTES ===== */}
      <section className="min-footer-info">
        {(company?.iban || company?.bankName) && (
          <div className="info-block payment-block">
            <span className="info-label">{t.paymentInfo}</span>
            <div className="info-content">
              {company?.bankName && <span>{company.bankName}</span>}
              {company?.iban && <span className="mono">{company.iban}</span>}
              {company?.bic && <span className="mono">{company.bic}</span>}
            </div>
          </div>
        )}

        {invoice.notes && (
          <div className="info-block notes-block">
            <span className="info-label">{t.notes}</span>
            <div className="info-content">
              <p>{invoice.notes}</p>
            </div>
          </div>
        )}
      </section>

      {/* ===== PIÈCES JOINTES ===== */}
      {invoice.images && invoice.images.length > 0 && (
        <section className="min-attachments no-break">
          <div className="attachments-row">
            {invoice.images.map((image, index) => (
              <div key={index} className="attachment-thumb">
                <img src={image.data || image} alt={`Attachment ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== SIGNATURES ===== */}
      <section className="min-signatures no-break">
        <SignatureZone
          invoice={invoice}
          company={company}
          type={getSignatureType()}
          lang={lang}
        />
      </section>

      {/* ===== SPACER FLEXIBLE ===== */}
      <div className="min-spacer"></div>

      {/* ===== PIED DE PAGE ===== */}
      <footer className="min-footer">
        <span className="footer-thanks">{t.thanks}</span>
        <span className="footer-company">{company?.name}</span>
      </footer>
    </div>
  );
};

export default TemplateMinimal;