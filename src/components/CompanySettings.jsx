// src/components/CompanySettings.jsx
import React, { useRef } from 'react';

function CompanySettings({ company, setCompany }) {
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field, value) => {
    setCompany(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="settings-container">
      <h2>⚙️ Paramètres de mon entreprise</h2>
      <p className="subtitle">Ces informations seront sauvegardées automatiquement</p>
      
      <div className="settings-grid">
        <div className="logo-section">
          <label>Logo de l'entreprise</label>
          <div 
            className="logo-upload"
            onClick={() => fileInputRef.current.click()}
          >
            {company.logo ? (
              <img src={company.logo} alt="Logo" className="logo-preview" />
            ) : (
              <div className="logo-placeholder">
                <span>📷</span>
                <p>Cliquez pour ajouter votre logo</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ display: 'none' }}
          />
          {company.logo && (
            <button 
              className="btn-secondary"
              onClick={() => setCompany(prev => ({ ...prev, logo: null }))}
            >
              Supprimer le logo
            </button>
          )}
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Nom de l'entreprise *</label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Mon Agence SARL"
            />
          </div>

          <div className="form-group">
            <label>Adresse *</label>
            <input
              type="text"
              value={company.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Rue de l'Exemple"
            />
          </div>

          <div className="form-group">
            <label>Code postal et Ville *</label>
            <input
              type="text"
              value={company.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="75001 Paris"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                value={company.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="01 23 45 67 89"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={company.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contact@monagence.fr"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>SIRET *</label>
              <input
                type="text"
                value={company.siret}
                onChange={(e) => handleChange('siret', e.target.value)}
                placeholder="123 456 789 00012"
              />
            </div>

            <div className="form-group">
              <label>N° TVA Intracommunautaire</label>
              <input
                type="text"
                value={company.tva}
                onChange={(e) => handleChange('tva', e.target.value)}
                placeholder="FR12345678901"
              />
            </div>
          </div>

          <h3>Coordonnées bancaires</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>IBAN</label>
              <input
                type="text"
                value={company.iban}
                onChange={(e) => handleChange('iban', e.target.value)}
                placeholder="FR76 1234 5678 9012 3456 7890 123"
              />
            </div>

            <div className="form-group">
              <label>BIC</label>
              <input
                type="text"
                value={company.bic}
                onChange={(e) => handleChange('bic', e.target.value)}
                placeholder="BNPAFRPP"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="save-indicator">
        ✅ Les modifications sont sauvegardées automatiquement
      </div>
    </div>
  );
}

export default CompanySettings;