import React from 'react';
import { formatAmount, formatDate } from '../../../utils/formatters';
import SignatureZone from './SignatureZone';
import './TemplateModern.css';

const TemplateModern = ({ invoice, company, themeColor, paperFormat = 'A4', lang = 'fr' }) => {
  const primaryColor = themeColor || '#6366f1';
  
  // Dimensions selon le format papier
  const paperSizes = {
    'A4': { width: '210mm', minHeight: '297mm' },
    'Letter': { width: '215.9mm', minHeight: '279.4mm' },
    'Legal': { width: '215.9mm', minHeight: '355.6mm' }
  };
  
  const paperSize = paperSizes[paperFormat] || paperSizes['A4'];

  // Statut de la facture
  const getStatusInfo = (status) => {
    const statusMap = {
      draft: { label: 'Brouillon', color: '#6b7280' },
      pending: { label: 'En attente', color: '#f59e0b' },
      paid: { label: 'Payée', color: '#10b981' },
      overdue: { label: 'En retard', color: '#ef4444' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const statusInfo = getStatusInfo(invoice.status);

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
      className="template-modern" 
      style={{ 
        '--primary': primaryColor,
        '--paper-width': paperSize.width,
        '--paper-min-height': paperSize.minHeight
      }}
    >
      {/* ===== BANDE ACCENT HAUT ===== */}
      <div className="modern-accent-top"></div>
      
      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="modern-content">
        
        {/* ===== EN-TÊTE ===== */}
        <header className="modern-header">
          <div className="header-main">
            {/* Bloc Entreprise */}
            <div className="company-block">
              {company?.logo ? (
                <img src={company.logo} alt="Logo" className="company-logo" />
              ) : (
                <div className="company-logo-placeholder">
                  <span>{company?.name?.charAt(0) || 'E'}</span>
                </div>
              )}
              <div className="company-info">
                <h1 className="company-name">{company?.name || 'Votre Entreprise'}</h1>
                <div className="company-details">
                  {company?.address && <p>{company.address}</p>}
                  {company?.city && <p>{company.city}</p>}
                  {(company?.phone || company?.email) && (
                    <p className="company-contact">
                      {company?.phone && <span>Tél: {company.phone}</span>}
                      {company?.phone && company?.email && <span className="separator"> | </span>}
                      {company?.email && <span>{company.email}</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bloc Facture */}
            <div className="invoice-block">
              <div className="invoice-type">FACTURE</div>
              <div className="invoice-number">{invoice.number}</div>
              <div 
                className="invoice-status"
                style={{ '--status-color': statusInfo.color }}
              >
                <span className="status-dot"></span>
                {statusInfo.label}
              </div>
            </div>
          </div>

          {/* Dates et Montant */}
          <div className="header-meta">
            <div className="meta-card">
              <span className="meta-label">Date d'émission</span>
              <span className="meta-value">{formatDate(invoice.date, 'long')}</span>
            </div>
            
            {invoice.dueDate && (
              <div className="meta-card">
                <span className="meta-label">Date d'échéance</span>
                <span className="meta-value">{formatDate(invoice.dueDate, 'long')}</span>
              </div>
            )}
            
            <div className="meta-card highlight">
              <span className="meta-label">Montant Total</span>
              <span className="meta-value big">{formatAmount(invoice.total)}</span>
            </div>
          </div>
        </header>

        {/* ===== SECTION CLIENT ===== */}
        <section className="modern-client">
          <div className="section-header">
            <span className="section-line"></span>
            <h2 className="section-title">Facturé à</h2>
            <span className="section-line"></span>
          </div>
          
          <div className="client-card">
            <div className="client-avatar">
              {invoice.client?.name?.charAt(0) || 'C'}
            </div>
            <div className="client-details">
              <h3 className="client-name">{invoice.client?.name || 'Client'}</h3>
              {invoice.client?.address && (
                <p>{invoice.client.address}</p>
              )}
              {invoice.client?.city && (
                <p>{invoice.client.city}</p>
              )}
              {(invoice.client?.phone || invoice.client?.email) && (
                <p className="client-contact">
                  {invoice.client?.phone && <span>Tél: {invoice.client.phone}</span>}
                  {invoice.client?.phone && invoice.client?.email && <span className="separator"> | </span>}
                  {invoice.client?.email && <span>{invoice.client.email}</span>}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ===== TABLEAU DES PRESTATIONS ===== */}
        <section className="modern-items">
          <div className="section-header">
            <span className="section-line"></span>
            <h2 className="section-title">Détails</h2>
            <span className="section-line"></span>
          </div>
          
          <div className="items-table-wrapper">
            <table className="items-table">
              <thead>
                <tr>
                  <th className="col-description">Description</th>
                  <th className="col-quantity">Qté</th>
                  <th className="col-price">Prix unitaire</th>
                  <th className="col-total">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'row-striped' : ''}>
                    <td className="col-description">{item.description || '-'}</td>
                    <td className="col-quantity">{item.quantity}</td>
                    <td className="col-price">{formatAmount(item.unitPrice)}</td>
                    <td className="col-total">{formatAmount(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="totals-section">
            <div className="totals-box">
              <div className="totals-row">
                <span className="totals-label">Sous-total</span>
                <span className="totals-value">{formatAmount(invoice.subtotal)}</span>
              </div>
              
              {invoice.taxRate > 0 && (
                <div className="totals-row">
                  <span className="totals-label">TVA ({invoice.taxRate}%)</span>
                  <span className="totals-value">{formatAmount(invoice.tax)}</span>
                </div>
              )}
              
              {invoice.discount > 0 && (
                <div className="totals-row discount">
                  <span className="totals-label">Remise</span>
                  <span className="totals-value">- {formatAmount(invoice.discount)}</span>
                </div>
              )}
              
              <div className="totals-row grand-total">
                <span className="totals-label">Total TTC</span>
                <span className="totals-value">{formatAmount(invoice.total)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== IMAGES / ANNEXES ===== */}
        {invoice.images && invoice.images.length > 0 && (
          <section className="modern-images">
            <div className="section-header">
              <span className="section-line"></span>
              <h2 className="section-title">Annexes</h2>
              <span className="section-line"></span>
            </div>
            
            <div className="images-grid">
              {invoice.images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image.data} alt={`Annexe ${index + 1}`} />
                  <span className="image-number">{index + 1}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== NOTES ===== */}
        {invoice.notes && (
          <section className="modern-notes">
            <div className="notes-card">
              <div className="notes-header">Notes</div>
              <p className="notes-text">{invoice.notes}</p>
            </div>
          </section>
        )}

        {/* ===== SIGNATURES ===== */}
        <section className="modern-signatures no-break">
          <SignatureZone
            invoice={invoice}
            company={company}
            type={getSignatureType()}
            lang={lang}
          />
        </section>

        {/* ===== SPACER pour pousser le footer en bas ===== */}
        <div className="modern-spacer"></div>

        {/* ===== PIED DE PAGE ===== */}
        <footer className="modern-footer">
          <div className="footer-thanks">Merci pour votre confiance</div>
          <div className="footer-divider"></div>
          <div className="footer-contact">
            {company?.phone && <span>Tél: {company.phone}</span>}
            {company?.email && <span>{company.email}</span>}
            {company?.city && <span>{company.city}</span>}
          </div>
          {company?.taxId && (
            <div className="footer-legal">N° contribuable: {company.taxId}</div>
          )}
        </footer>
      </div>
      
      {/* ===== BANDE ACCENT BAS ===== */}
      <div className="modern-accent-bottom"></div>
    </div>
  );
};

export default TemplateModern;