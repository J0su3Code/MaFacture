// src/components/InvoiceForm.jsx
import React from 'react';

function InvoiceForm({ invoice, setInvoice, onPreview, onSave, companyConfigured }) {
  
  const handleClientChange = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (invoice.items.length > 1) {
      setInvoice(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

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

  if (!companyConfigured) {
    return (
      <div className="warning-box">
        <h3>⚠️ Configuration requise</h3>
        <p>Veuillez d'abord configurer les informations de votre entreprise dans l'onglet "Mon entreprise".</p>
      </div>
    );
  }

  return (
    <div className="invoice-form">
      <h2>📝 Nouvelle Facture</h2>
      
      <div className="form-section">
        <h3>Informations de la facture</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Numéro de facture</label>
            <input
              type="text"
              value={invoice.number}
              onChange={(e) => setInvoice(prev => ({ ...prev, number: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Date de facturation</label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Date d'échéance</label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>👤 Client</h3>
        
        <div className="form-group">
          <label>Nom / Raison sociale *</label>
          <input
            type="text"
            value={invoice.client.name}
            onChange={(e) => handleClientChange('name', e.target.value)}
            placeholder="Nom du client ou de l'entreprise"
          />
        </div>

        <div className="form-group">
          <label>Adresse</label>
          <input
            type="text"
            value={invoice.client.address}
            onChange={(e) => handleClientChange('address', e.target.value)}
            placeholder="Adresse du client"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Code postal et Ville</label>
            <input
              type="text"
              value={invoice.client.city}
              onChange={(e) => handleClientChange('city', e.target.value)}
              placeholder="75001 Paris"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={invoice.client.email}
              onChange={(e) => handleClientChange('email', e.target.value)}
              placeholder="client@email.com"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>📦 Prestations / Produits</h3>
        
        <div className="items-table">
          <div className="items-header">
            <span className="col-desc">Description</span>
            <span className="col-qty">Qté</span>
            <span className="col-price">Prix unitaire HT</span>
            <span className="col-total">Total HT</span>
            <span className="col-action"></span>
          </div>
          
          {invoice.items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                className="col-desc"
                type="text"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                placeholder="Description de la prestation"
              />
              <input
                className="col-qty"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
              />
              <input
                className="col-price"
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
              />
              <span className="col-total">
                {(item.quantity * item.unitPrice).toFixed(2)} €
              </span>
              <button 
                className="col-action btn-remove"
                onClick={() => removeItem(index)}
                disabled={invoice.items.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button className="btn-add-item" onClick={addItem}>
          + Ajouter une ligne
        </button>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label>Taux de TVA (%)</label>
            <select
              value={invoice.tvaRate}
              onChange={(e) => setInvoice(prev => ({ ...prev, tvaRate: parseFloat(e.target.value) }))}
            >
              <option value="0">0% (Exonéré)</option>
              <option value="5.5">5.5%</option>
              <option value="10">10%</option>
              <option value="20">20%</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Notes / Conditions</label>
          <textarea
            value={invoice.notes}
            onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Conditions de paiement, mentions légales..."
            rows={3}
          />
        </div>
      </div>

      <div className="totals-section">
        <div className="total-row">
          <span>Sous-total HT</span>
          <span>{calculateSubtotal().toFixed(2)} €</span>
        </div>
        <div className="total-row">
          <span>TVA ({invoice.tvaRate}%)</span>
          <span>{calculateTVA().toFixed(2)} €</span>
        </div>
        <div className="total-row total-final">
          <span>Total TTC</span>
          <span>{calculateTotal().toFixed(2)} €</span>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-preview" onClick={onPreview}>
          👁️ Aperçu
        </button>
        <button className="btn-save" onClick={onSave}>
          💾 Sauvegarder
        </button>
      </div>
    </div>
  );
}

export default InvoiceForm;