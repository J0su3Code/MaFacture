// src/components/InvoiceHistory.jsx
import React from 'react';

function InvoiceHistory({ invoices, onLoad, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateTotal = (invoice) => {
    const subtotal = invoice.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    return subtotal * (1 + invoice.tvaRate / 100);
  };

  if (invoices.length === 0) {
    return (
      <div className="history-empty">
        <h2>📋 Historique des factures</h2>
        <p>Aucune facture sauvegardée pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>📋 Historique des factures</h2>
      
      <table className="history-table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Date</th>
            <th>Client</th>
            <th>Montant TTC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((invoice) => (
            <tr key={invoice.id}>
              <td><strong>{invoice.number}</strong></td>
              <td>{formatDate(invoice.date)}</td>
              <td>{invoice.client.name}</td>
              <td>{calculateTotal(invoice).toFixed(2)} €</td>
              <td className="actions">
                <button 
                  className="btn-view"
                  onClick={() => onLoad(invoice)}
                >
                  👁️ Voir
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => {
                    if (window.confirm('Supprimer cette facture ?')) {
                      onDelete(invoice.id);
                    }
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceHistory;