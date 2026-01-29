import React from 'react';
import { Icons } from '../ui/Icons';
import './ItemRow.css';

const ItemRow = ({ item, index, onChange, onRemove, canRemove }) => {
  const total = (item.quantity || 0) * (item.unitPrice || 0);

  const formatNumber = (num) => {
    return num.toLocaleString('fr-FR');
  };

  return (
    <div className="item-row">
      <div className="item-field col-desc" data-label="Description">
        <input
          type="text"
          value={item.description}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          placeholder="Nom du produit ou service..."
        />
      </div>
      
      <div className="item-field col-qty" data-label="Quantité">
        <input
          type="number"
          min="1"
          step="1"
          value={item.quantity}
          onChange={(e) => onChange(index, 'quantity', parseFloat(e.target.value) || 0)}
          placeholder="1"
        />
      </div>
      
      <div className="item-field col-price" data-label="Prix unitaire">
        <input
          type="number"
          min="0"
          step="100"
          value={item.unitPrice}
          onChange={(e) => onChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
          placeholder="0"
        />
      </div>
      
      <div className="item-total col-total">
        {formatNumber(total)} F
      </div>
      
      <button
        type="button"
        className="remove-btn"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        title="Supprimer cette ligne"
      >
        <Icons.trash width={16} height={16} />
      </button>
    </div>
  );
};

export default ItemRow;