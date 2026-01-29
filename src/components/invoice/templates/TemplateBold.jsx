import React from 'react';
import { formatAmount, formatDate } from '../../../utils/formatters';
import SignatureZone from './SignatureZone';
import './TemplateBold.css';

const TemplateBold = ({ invoice, company, themeColor, paperFormat = 'A4', lang = 'fr' }) => {
  const primaryColor = themeColor || '#dc2626';
  
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
    number: 'N°',
    date: 'Date',
    dueDate: 'Due',
    from: 'From',
    to: 'Bill To',
    description: 'Description',
    qty: 'Qty',
    price: 'Price',
    amount: 'Amount',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    total: 'TOTAL',
    notes: 'Notes',
    attachments: 'Attachments',
    thanks: 'Thank you!',
    contact: 'Contact',
    status: { draft: 'Draft', pending: 'Pending', paid: 'Paid', overdue: 'Overdue' }
  } : {
    invoice: 'FACTURE',
    number: 'N°',
    date: 'Date',
    dueDate: 'Échéance',
    from: 'De',
    to: 'Facturer à',
    description: 'Description',
    qty: 'Qté',
    price: 'Prix',
    amount: 'Montant',
    subtotal: 'Sous-total',
    tax: 'TVA',
    discount: 'Remise',
    total: 'TOTAL',
    notes: 'Notes',
    attachments: 'Pièces jointes',
    thanks: 'Merci !',
    contact: 'Contact',
    status: { draft: 'Brouillon', pending: 'En attente', paid: 'Payée', overdue: 'En retard' }
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
      className="template-bold"
      data-format={paperFormat}
      style={{
        '--primary': primaryColor,
        '--paper-width': paper.width,
        '--paper-height': paper.height
      }}
    >
      {/* ===== SIDEBAR GAUCHE ===== */}
      <aside className="bold-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          {company?.logo ? (
            <img src={company.logo} alt={company.name || 'Logo'} />
          ) : (
            <div className="logo-letter">{(company?.name || 'E').charAt(0)}</div>
          )}
        </div>

        {/* Numéro facture - GRAND */}
        <div className="sidebar-invoice">
          <span className="invoice-label">{t.invoice}</span>
          <span className="invoice-number">{invoice.number || '0001'}</span>
        </div>

        {/* Statut */}
        <div className="sidebar-status" data-status={status}>
          {statusLabel}
        </div>

        {/* Infos dates */}
        <div className="sidebar-dates">
          <div className="date-block">
            <span className="date-label">{t.date}</span>
            <span className="date-value">{formatDate(invoice.date, 'short')}</span>
          </div>
          {invoice.dueDate && (
            <div className="date-block">
              <span className="date-label">{t.dueDate}</span>
              <span className="date-value">{formatDate(invoice.dueDate, 'short')}</span>
            </div>
          )}
        </div>

        {/* Total - ÉNORME */}
        <div className="sidebar-total">
          <span className="total-label">{t.total}</span>
          <span className="total-value">{formatAmount(invoice.total || 0)}</span>
        </div>

        {/* Entreprise */}
        <div className="sidebar-company">
          <h2>{company?.name || 'Entreprise'}</h2>
          {company?.address && <p>{company.address}</p>}
          {company?.city && <p>{company.city}</p>}
          {company?.phone && <p>{company.phone}</p>}
          {company?.email && <p>{company.email}</p>}
          {company?.taxId && <p className="tax-id">{company.taxId}</p>}
        </div>
      </aside>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <main className="bold-main">
        
        {/* CLIENT */}
        <section className="bold-client">
          <div className="client-label">{t.to}</div>
          <h3 className="client-name">{invoice.client?.name || 'Client'}</h3>
          <div className="client-info">
            {invoice.client?.address && <p>{invoice.client.address}</p>}
            {invoice.client?.city && <p>{invoice.client.city}</p>}
            {invoice.client?.phone && <p>{invoice.client.phone}</p>}
            {invoice.client?.email && <p>{invoice.client.email}</p>}
          </div>
        </section>

        {/* TABLEAU */}
        <section className="bold-table">
          <table>
            <thead>
              <tr>
                <th className="col-desc">{t.description}</th>
                <th className="col-qty">{t.qty}</th>
                <th className="col-price">{t.price}</th>
                <th className="col-amount">{t.amount}</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((item, index) => (
                <tr key={item.id || index}>
                  <td className="col-desc">
                    <span className="item-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="item-text">{item.description || '—'}</span>
                  </td>
                  <td className="col-qty">{item.quantity || 0}</td>
                  <td className="col-price">{formatAmount(item.unitPrice || 0)}</td>
                  <td className="col-amount">{formatAmount((item.quantity || 0) * (item.unitPrice || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* RÉSUMÉ */}
        <section className="bold-summary">
          <div className="summary-row">
            <span>{t.subtotal}</span>
            <span>{formatAmount(invoice.subtotal || 0)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="summary-row">
              <span>{t.tax} ({invoice.taxRate}%)</span>
              <span>{formatAmount(invoice.tax || 0)}</span>
            </div>
          )}
          {invoice.discount > 0 && (
            <div className="summary-row discount">
              <span>{t.discount}</span>
              <span>−{formatAmount(invoice.discount)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>{t.total}</span>
            <span>{formatAmount(invoice.total || 0)}</span>
          </div>
        </section>

        {/* IMAGES */}
        {invoice.images && invoice.images.length > 0 && (
          <section className="bold-images">
            <h4>{t.attachments}</h4>
            <div className="images-grid">
              {invoice.images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image.data || image} alt={`${index + 1}`} />
                  <span className="image-num">{index + 1}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* NOTES */}
        {invoice.notes && (
          <section className="bold-notes">
            <h4>{t.notes}</h4>
            <p>{invoice.notes}</p>
          </section>
        )}

        {/* SIGNATURES */}
        <section className="bold-signatures no-break">
          <SignatureZone
            invoice={invoice}
            company={company}
            type={getSignatureType()}
            lang={lang}
          />
        </section>

        {/* FOOTER */}
        <footer className="bold-footer">
          <div className="footer-thanks">{t.thanks}</div>
          <div className="footer-line"></div>
        </footer>
      </main>
    </div>
  );
};

export default TemplateBold;