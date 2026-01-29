import React from 'react';
import { formatAmount, formatDate } from '../../../utils/formatters';
import SignatureZone from './SignatureZone';
import './TemplateClassic.css';

const TemplateClassic = ({ invoice, company, themeColor, paperFormat = 'A4', lang = 'fr' }) => {
  const primaryColor = themeColor || '#1a1a2e';
  
  // Configuration des formats papier
  const paperConfig = {
    'A4': { width: '210mm', height: '297mm' },
    'Letter': { width: '215.9mm', height: '279.4mm' },
    'Legal': { width: '215.9mm', height: '355.6mm' }
  };
  
  const paper = paperConfig[paperFormat] || paperConfig['A4'];

  // Traductions
  const t = lang === 'en' ? {
    invoice: 'INVOICE',
    number: 'Invoice No.',
    date: 'Date',
    dueDate: 'Due Date',
    from: 'From',
    to: 'Bill To',
    description: 'Description',
    qty: 'Quantity',
    unitPrice: 'Unit Price',
    amount: 'Amount',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    total: 'Total Due',
    notes: 'Terms & Conditions',
    attachments: 'Attachments',
    signature: 'Authorized Signature',
    thanks: 'Thank you for your business',
    page: 'Page',
    status: { draft: 'DRAFT', pending: 'PENDING', paid: 'PAID', overdue: 'OVERDUE' }
  } : {
    invoice: 'FACTURE',
    number: 'Facture N°',
    date: 'Date',
    dueDate: 'Échéance',
    from: 'Émetteur',
    to: 'Destinataire',
    description: 'Désignation',
    qty: 'Quantité',
    unitPrice: 'Prix Unitaire',
    amount: 'Montant',
    subtotal: 'Sous-total',
    tax: 'TVA',
    discount: 'Remise',
    total: 'Net à Payer',
    notes: 'Conditions Générales',
    attachments: 'Pièces Jointes',
    signature: 'Signature & Cachet',
    thanks: 'Nous vous remercions de votre confiance',
    page: 'Page',
    status: { draft: 'BROUILLON', pending: 'EN ATTENTE', paid: 'PAYÉE', overdue: 'IMPAYÉE' }
  };

  const status = invoice.status || 'pending';
  const statusLabel = t.status[status] || t.status.pending;

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
      className="template-classic"
      data-format={paperFormat}
      style={{
        '--primary': primaryColor,
        '--paper-width': paper.width,
        '--paper-height': paper.height
      }}
    >
      {/* ===== BORDURE EXTÉRIEURE ===== */}
      <div className="classic-frame">
        <div className="frame-border"></div>
        
        {/* ===== EN-TÊTE ===== */}
        <header className="classic-header">
          {/* Logo & Entreprise */}
          <div className="header-company">
            {company?.logo ? (
              <img src={company.logo} alt={company.name} className="company-logo" />
            ) : (
              <div className="company-monogram">
                <span>{(company?.name || 'E').substring(0, 2).toUpperCase()}</span>
              </div>
            )}
            <div className="company-details">
              <h1 className="company-name">{company?.name || 'Votre Entreprise'}</h1>
              <div className="company-address">
                {company?.address && <span>{company.address}</span>}
                {company?.city && <span>{company.city}</span>}
              </div>
              <div className="company-contact">
                {company?.phone && <span>Tél: {company.phone}</span>}
                {company?.email && <span>{company.email}</span>}
              </div>
            </div>
          </div>

          {/* Titre Facture */}
          <div className="header-title">
            <div className="title-ornament">❖</div>
            <h2 className="invoice-title">{t.invoice}</h2>
            <div className="title-ornament">❖</div>
          </div>

          {/* Numéro & Statut */}
          <div className="header-meta">
            <div className="invoice-number">{invoice.number || '0001'}</div>
            <div className="invoice-status" data-status={status}>{statusLabel}</div>
          </div>
        </header>

        {/* ===== LIGNE DÉCORATIVE ===== */}
        <div className="classic-divider">
          <span className="divider-line"></span>
          <span className="divider-diamond">◆</span>
          <span className="divider-line"></span>
        </div>

        {/* ===== INFOS PARTIES ===== */}
        <section className="classic-parties">
          {/* Émetteur */}
          <div className="party-block">
            <div className="party-header">
              <span className="party-icon">◉</span>
              <span className="party-label">{t.from}</span>
            </div>
            <div className="party-content">
              <p className="party-name">{company?.name || 'Votre Entreprise'}</p>
              {company?.address && <p>{company.address}</p>}
              {company?.city && <p>{company.city}</p>}
              {company?.taxId && <p className="party-tax">N° {company.taxId}</p>}
            </div>
          </div>

          {/* Infos Facture */}
          <div className="party-block center">
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="info-label">{t.date}</td>
                  <td className="info-value">{formatDate(invoice.date, 'long')}</td>
                </tr>
                {invoice.dueDate && (
                  <tr>
                    <td className="info-label">{t.dueDate}</td>
                    <td className="info-value">{formatDate(invoice.dueDate, 'long')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Destinataire */}
          <div className="party-block">
            <div className="party-header">
              <span className="party-icon">◉</span>
              <span className="party-label">{t.to}</span>
            </div>
            <div className="party-content">
              <p className="party-name">{invoice.client?.name || 'Client'}</p>
              {invoice.client?.address && <p>{invoice.client.address}</p>}
              {invoice.client?.city && <p>{invoice.client.city}</p>}
              {invoice.client?.phone && <p>Tél: {invoice.client.phone}</p>}
              {invoice.client?.email && <p>{invoice.client.email}</p>}
            </div>
          </div>
        </section>

        {/* ===== TABLEAU DES ARTICLES ===== */}
        <section className="classic-table">
          <table>
            <thead>
              <tr>
                <th className="col-num">N°</th>
                <th className="col-desc">{t.description}</th>
                <th className="col-qty">{t.qty}</th>
                <th className="col-price">{t.unitPrice}</th>
                <th className="col-amount">{t.amount}</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((item, index) => (
                <tr key={item.id || index}>
                  <td className="col-num">{index + 1}</td>
                  <td className="col-desc">{item.description || '—'}</td>
                  <td className="col-qty">{item.quantity || 0}</td>
                  <td className="col-price">{formatAmount(item.unitPrice || 0)}</td>
                  <td className="col-amount">{formatAmount((item.quantity || 0) * (item.unitPrice || 0))}</td>
                </tr>
              ))}
              {/* Lignes vides pour remplir */}
              {(invoice.items?.length || 0) < 5 && 
                [...Array(5 - (invoice.items?.length || 0))].map((_, i) => (
                  <tr key={`empty-${i}`} className="empty-row">
                    <td className="col-num"></td>
                    <td className="col-desc"></td>
                    <td className="col-qty"></td>
                    <td className="col-price"></td>
                    <td className="col-amount"></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </section>

        {/* ===== RÉSUMÉ ===== */}
        <section className="classic-summary">
          <div className="summary-left">
            {/* Notes */}
            {invoice.notes && (
              <div className="summary-notes">
                <h4>{t.notes}</h4>
                <p>{invoice.notes}</p>
              </div>
            )}
          </div>

          <div className="summary-right">
            <table className="totals-table">
              <tbody>
                <tr>
                  <td className="totals-label">{t.subtotal}</td>
                  <td className="totals-value">{formatAmount(invoice.subtotal || 0)}</td>
                </tr>
                {invoice.taxRate > 0 && (
                  <tr>
                    <td className="totals-label">{t.tax} ({invoice.taxRate}%)</td>
                    <td className="totals-value">{formatAmount(invoice.tax || 0)}</td>
                  </tr>
                )}
                {invoice.discount > 0 && (
                  <tr className="discount-row">
                    <td className="totals-label">{t.discount}</td>
                    <td className="totals-value">−{formatAmount(invoice.discount)}</td>
                  </tr>
                )}
                <tr className="total-row">
                  <td className="totals-label">{t.total}</td>
                  <td className="totals-value">{formatAmount(invoice.total || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== PIÈCES JOINTES ===== */}
        {invoice.images && invoice.images.length > 0 && (
          <section className="classic-attachments">
            <div className="section-header">
              <span className="header-line"></span>
              <h4>{t.attachments}</h4>
              <span className="header-line"></span>
            </div>
            <div className="attachments-grid">
              {invoice.images.map((image, index) => (
                <div key={index} className="attachment-frame">
                  <img src={image.data || image} alt={`${t.attachments} ${index + 1}`} />
                  <span className="attachment-num">{index + 1}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== SIGNATURES ===== */}
        <section className="classic-signatures no-break">
          <SignatureZone
            invoice={invoice}
            company={company}
            type={getSignatureType()}
            lang={lang}
          />
        </section>

        {/* ===== PIED DE PAGE ===== */}
        <footer className="classic-footer">
          <div className="footer-ornament">✦ ✦ ✦</div>
          <p className="footer-thanks">{t.thanks}</p>
          <div className="footer-legal">
            {company?.taxId && <span>N° Contribuable: {company.taxId}</span>}
            {company?.iban && <span>IBAN: {company.iban}</span>}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TemplateClassic;