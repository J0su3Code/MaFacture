import React from 'react';
import { formatAmount, formatDate } from '../../../utils/formatters';
import SignatureZone from './SignatureZone';
import './TemplateCorporate.css';

const TemplateCorporate = ({ invoice, company, themeColor, paperFormat = 'A4', lang = 'fr' }) => {
  const primaryColor = themeColor || '#1e3a5f';
  
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
      invoiceNumber: 'N° Facture',
      date: 'Date d\'émission',
      dueDate: 'Date d\'échéance',
      billTo: 'FACTURÉ À',
      from: 'DE',
      item: '#',
      description: 'Description',
      qty: 'Qté',
      unitPrice: 'Prix unitaire',
      total: 'Total',
      subtotal: 'Sous-total HT',
      tax: 'TVA',
      discount: 'Remise',
      grandTotal: 'TOTAL TTC',
      paymentInfo: 'Informations de paiement',
      paymentMethod: 'Mode de paiement',
      bankTransfer: 'Virement bancaire',
      bank: 'Banque',
      attachments: 'Pièces jointes',
      terms: 'Conditions & Notes',
      thanks: 'Merci pour votre confiance !',
      phone: 'Téléphone',
      email: 'Email',
      address: 'Adresse',
      taxId: 'N° Contribuable',
      status: {
        draft: 'Brouillon',
        pending: 'En attente',
        paid: 'Payée',
        overdue: 'En retard',
        cancelled: 'Annulée'
      }
    },
    en: {
      invoice: 'INVOICE',
      invoiceNumber: 'Invoice #',
      date: 'Issue Date',
      dueDate: 'Due Date',
      billTo: 'BILL TO',
      from: 'FROM',
      item: '#',
      description: 'Description',
      qty: 'Qty',
      unitPrice: 'Unit Price',
      total: 'Total',
      subtotal: 'Subtotal',
      tax: 'Tax',
      discount: 'Discount',
      grandTotal: 'TOTAL DUE',
      paymentInfo: 'Payment Information',
      paymentMethod: 'Payment Method',
      bankTransfer: 'Bank Transfer',
      bank: 'Bank',
      attachments: 'Attachments',
      terms: 'Terms & Notes',
      thanks: 'Thank you for your business!',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      taxId: 'Tax ID',
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
    pending: { color: '#d97706', bg: '#fef3c7' },
    paid: { color: '#059669', bg: '#d1fae5' },
    overdue: { color: '#dc2626', bg: '#fee2e2' },
    cancelled: { color: '#6b7280', bg: '#f3f4f6' }
  };

  const status = invoice.status || 'pending';
  const statusStyle = statusConfig[status] || statusConfig.pending;
  const statusLabel = t.status[status] || t.status.pending;

  // Génération des variantes de couleur HSL
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
    '--primary-light': `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(hsl.l + 15, 85)}%)`,
    '--primary-dark': `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(hsl.l - 10, 15)}%)`,
    '--primary-bg': `hsl(${hsl.h}, ${hsl.s}%, 97%)`,
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
      className="template-corporate"
      data-format={paperFormat}
      style={cssVariables}
    >
      {/* ===== EN-TÊTE ===== */}
      <header className="corp-header">
        <div className="header-brand">
          {company?.logo ? (
            <img 
              src={company.logo} 
              alt={company.name || 'Logo'} 
              className="company-logo" 
            />
          ) : (
            <div className="logo-fallback">
              <span>{(company?.name || 'E').charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div className="company-info">
            <h2 className="company-name">{company?.name || 'Votre Entreprise'}</h2>
            <div className="company-details">
              {company?.address && <span>{company.address}</span>}
              {company?.city && <span>{company.city}</span>}
              {company?.phone && <span>{t.phone}: {company.phone}</span>}
              {company?.email && <span>{company.email}</span>}
            </div>
          </div>
        </div>

        <div className="header-invoice">
          <div className="invoice-badge">
            <h1 className="invoice-title">{t.invoice}</h1>
            <div className="invoice-status">
              <span className="status-indicator"></span>
              <span className="status-text">{statusLabel}</span>
            </div>
          </div>
          
          <div className="invoice-details">
            <div className="detail-row">
              <span className="detail-label">{t.invoiceNumber}</span>
              <span className="detail-value">{invoice.number || '---'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t.date}</span>
              <span className="detail-value">{formatDate(invoice.date, 'long')}</span>
            </div>
            {invoice.dueDate && (
              <div className="detail-row highlight">
                <span className="detail-label">{t.dueDate}</span>
                <span className="detail-value">{formatDate(invoice.dueDate, 'long')}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== PARTIES ===== */}
      <section className="corp-parties">
        <div className="party-card party-from">
          <span className="party-label">{t.from}</span>
          <h3 className="party-name">{company?.name || 'Votre Entreprise'}</h3>
          <div className="party-details">
            {company?.address && <p>{company.address}</p>}
            {company?.city && <p>{company.city}</p>}
            {company?.taxId && <p>{t.taxId}: {company.taxId}</p>}
          </div>
        </div>

        <div className="party-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>

        <div className="party-card party-to">
          <span className="party-label">{t.billTo}</span>
          <h3 className="party-name">{invoice.client?.name || 'Client'}</h3>
          <div className="party-details">
            {invoice.client?.address && <p>{invoice.client.address}</p>}
            {invoice.client?.city && <p>{invoice.client.city}</p>}
            {invoice.client?.email && <p>{invoice.client.email}</p>}
            {invoice.client?.phone && <p>{invoice.client.phone}</p>}
          </div>
        </div>
      </section>

      {/* ===== TABLEAU DES ITEMS ===== */}
      <section className="corp-items">
        <table className="items-table">
          <thead>
            <tr>
              <th className="col-num">{t.item}</th>
              <th className="col-desc">{t.description}</th>
              <th className="col-qty">{t.qty}</th>
              <th className="col-price">{t.unitPrice}</th>
              <th className="col-total">{t.total}</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, index) => (
              <tr key={item.id || index}>
                <td className="col-num">
                  <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
                </td>
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

      {/* ===== RÉSUMÉ & PAIEMENT ===== */}
      <section className="corp-summary">
        <div className="summary-payment">
          <h4 className="section-title">{t.paymentInfo}</h4>
          <div className="payment-box">
            <div className="payment-row">
              <span className="payment-label">{t.paymentMethod}</span>
              <span className="payment-value">{t.bankTransfer}</span>
            </div>
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
                <span className="payment-label">BIC/SWIFT</span>
                <span className="payment-value mono">{company.bic}</span>
              </div>
            )}
          </div>
        </div>

        <div className="summary-totals">
          <div className="totals-box">
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

      {/* ===== PIÈCES JOINTES ===== */}
      {invoice.images && invoice.images.length > 0 && (
        <section className="corp-attachments no-break">
          <h4 className="section-title">{t.attachments}</h4>
          <div className="attachments-grid">
            {invoice.images.map((image, index) => (
              <figure key={index} className="attachment-item">
                <img src={image.data || image} alt={`${t.attachments} ${index + 1}`} />
                <figcaption>{index + 1}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ===== NOTES ===== */}
      {invoice.notes && (
        <section className="corp-notes no-break">
          <h4 className="section-title">{t.terms}</h4>
          <div className="notes-content">
            <p>{invoice.notes}</p>
          </div>
        </section>
      )}

      {/* ===== SIGNATURES ===== */}
      <section className="corp-signatures no-break">
        <SignatureZone
          invoice={invoice}
          company={company}
          type={getSignatureType()}
          lang={lang}
        />
      </section>

      {/* ===== ESPACE FLEXIBLE ===== */}
      <div className="corp-spacer"></div>

      {/* ===== PIED DE PAGE ===== */}
      <footer className="corp-footer">
        <div className="footer-message">{t.thanks}</div>
        
        <div className="footer-contacts">
          {company?.phone && (
            <div className="footer-contact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <span>{company.phone}</span>
            </div>
          )}
          
          {company?.email && (
            <div className="footer-contact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>{company.email}</span>
            </div>
          )}
          
          {(company?.address || company?.city) && (
            <div className="footer-contact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{[company?.address, company?.city].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        {company?.taxId && (
          <div className="footer-legal">
            {t.taxId}: {company.taxId}
          </div>
        )}
      </footer>
    </div>
  );
};

export default TemplateCorporate;