// src/components/InvoicePreview.jsx
import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

function InvoicePreview({ invoice, company, onClose }) {
  const invoiceRef = useRef(null);

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
  };

  const calculateTVA = () => {
    return calculateSubtotal() * (invoice.tvaRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTVA();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const downloadPDF = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 10,
      filename: `${invoice.number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="preview-overlay">
      <div className="preview-modal">
        <div className="preview-header">
          <h2>Aperçu de la facture</h2>
          <div className="preview-actions">
            <button className="btn-download" onClick={downloadPDF}>
              📥 Télécharger PDF
            </button>
            <button className="btn-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="preview-content">
          <div ref={invoiceRef} className="invoice-document">
            {/* En-tête */}
            <div className="invoice-header">
              <div className="company-info">
                {company.logo && (
                  <img src={company.logo} alt="Logo" className="company-logo" />
                )}
                <div className="company-details">
                  <h1>{company.name}</h1>
                  <p>{company.address}</p>
                  <p>{company.city}</p>
                  <p>{company.phone}</p>
                  <p>{company.email}</p>
                </div>
              </div>
              
              <div className="invoice-info">
                <h2>FACTURE</h2>
                <table>
                  <tbody>
                    <tr>
                      <td>Numéro :</td>
                      <td><strong>{invoice.number}</strong></td>
                    </tr>
                    <tr>
                      <td>Date :</td>
                      <td>{formatDate(invoice.date)}</td>
                    </tr>
                    {invoice.dueDate && (
                      <tr>
                        <td>Échéance :</td>
                        <td>{formatDate(invoice.dueDate)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Client */}
            <div className="client-section">
              <h3>Facturé à :</h3>
              <div className="client-info">
                <p><strong>{invoice.client.name}</strong></p>
                <p>{invoice.client.address}</p>
                <p>{invoice.client.city}</p>
                {invoice.client.email && <p>{invoice.client.email}</p>}
              </div>
            </div>

            {/* Tableau des prestations */}
            <table className="items-table-preview">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix unitaire HT</th>
                  <th>Total HT</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td className="center">{item.quantity}</td>
                    <td className="right">{item.unitPrice.toFixed(2)} €</td>
                    <td className="right">{(item.quantity * item.unitPrice).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totaux */}
            <div className="totals-preview">
              <table>
                <tbody>
                  <tr>
                    <td>Sous-total HT</td>
                    <td>{calculateSubtotal().toFixed(2)} €</td>
                  </tr>
                  <tr>
                    <td>TVA ({invoice.tvaRate}%)</td>
                    <td>{calculateTVA().toFixed(2)} €</td>
                  </tr>
                  <tr className="total-row">
                    <td><strong>Total TTC</strong></td>
                    <td><strong>{calculateTotal().toFixed(2)} €</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="notes-section">
                <p>{invoice.notes}</p>
              </div>
            )}

            {/* Pied de page */}
            <div className="invoice-footer">
              <div className="legal-info">
                <p><strong>{company.name}</strong></p>
                <p>SIRET : {company.siret} {company.tva && `• TVA : ${company.tva}`}</p>
                {company.iban && (
                  <p>IBAN : {company.iban} {company.bic && `• BIC : ${company.bic}`}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreview;