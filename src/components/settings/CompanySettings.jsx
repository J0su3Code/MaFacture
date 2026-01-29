import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import Input, { Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { imageToBase64 } from '../../utils/formatters';
import './CompanySettings.css';

const CompanySettings = () => {
  const { userData, updateUserData } = useAuth();
  const { t } = useTheme();
  
  const logoInputRef = useRef(null);
  const headerInputRef = useRef(null);
  const footerInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [company, setCompany] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    ifu: '',
    rccm: '',
    logo: null,
    header: null,
    footer: null
  });

  useEffect(() => {
    if (userData?.company) {
      setCompany(prev => ({
        ...prev,
        ...userData.company
      }));
    }
  }, [userData]);

  const handleChange = (field, value) => {
    setCompany(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleImageUpload = async (field, file) => {
    if (!file) return;

    // Vérifier la taille (max 1MB pour logo, 2MB pour header/footer)
    const maxSize = field === 'logo' ? 1 : 2;
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Image trop volumineuse (max ${maxSize}MB)`);
      return;
    }

    try {
      const base64 = await imageToBase64(file);
      handleChange(field, base64);
    } catch (error) {
      console.error('Erreur upload:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      await updateUserData({ company });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="company-settings">
      <div className="settings-header">
        <div>
          <h1>{t('companySettings')}</h1>
          <p className="text-muted">Informations qui apparaîtront sur vos factures</p>
        </div>
        <Button 
          icon={saved ? 'check' : 'check'} 
          onClick={handleSave}
          loading={saving}
        >
          {saved ? 'Enregistré !' : t('save')}
        </Button>
      </div>

      <div className="settings-grid">
        {/* Logo & Images */}
        <section className="settings-section card">
          <h2>Logo & Images</h2>

          {/* Logo */}
          <div className="image-upload-group">
            <label>Logo de l'entreprise</label>
            <p className="text-sm text-muted">Recommandé: 200x100px, PNG ou JPG</p>
            
            <div 
              className="image-upload-zone"
              onClick={() => logoInputRef.current?.click()}
            >
              {company.logo ? (
                <div className="image-preview">
                  <img src={company.logo} alt="Logo" />
                  <button 
                    className="image-remove"
                    onClick={(e) => { e.stopPropagation(); handleChange('logo', null); }}
                  >
                    <Icons.x width={16} height={16} />
                  </button>
                </div>
              ) : (
                <div className="image-placeholder">
                  <Icons.image width={32} height={32} />
                  <span>Cliquez pour ajouter</span>
                </div>
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('logo', e.target.files[0])}
              style={{ display: 'none' }}
            />
          </div>

          {/* En-tête personnalisée */}
          <div className="image-upload-group">
            <label>En-tête personnalisée (optionnel)</label>
            <p className="text-sm text-muted">Remplace l'en-tête par défaut. Format: 210mm de large</p>
            
            <div 
              className="image-upload-zone header-zone"
              onClick={() => headerInputRef.current?.click()}
            >
              {company.header ? (
                <div className="image-preview">
                  <img src={company.header} alt="En-tête" />
                  <button 
                    className="image-remove"
                    onClick={(e) => { e.stopPropagation(); handleChange('header', null); }}
                  >
                    <Icons.x width={16} height={16} />
                  </button>
                </div>
              ) : (
                <div className="image-placeholder">
                  <Icons.upload width={24} height={24} />
                  <span>Ajouter une en-tête</span>
                </div>
              )}
            </div>
            <input
              ref={headerInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('header', e.target.files[0])}
              style={{ display: 'none' }}
            />
          </div>

          {/* Pied de page personnalisé */}
          <div className="image-upload-group">
            <label>Pied de page personnalisé (optionnel)</label>
            <p className="text-sm text-muted">Remplace le pied de page par défaut</p>
            
            <div 
              className="image-upload-zone footer-zone"
              onClick={() => footerInputRef.current?.click()}
            >
              {company.footer ? (
                <div className="image-preview">
                  <img src={company.footer} alt="Pied de page" />
                  <button 
                    className="image-remove"
                    onClick={(e) => { e.stopPropagation(); handleChange('footer', null); }}
                  >
                    <Icons.x width={16} height={16} />
                  </button>
                </div>
              ) : (
                <div className="image-placeholder">
                  <Icons.upload width={24} height={24} />
                  <span>Ajouter un pied de page</span>
                </div>
              )}
            </div>
            <input
              ref={footerInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('footer', e.target.files[0])}
              style={{ display: 'none' }}
            />
          </div>
        </section>

        {/* Informations */}
        <section className="settings-section card">
          <h2>Informations de l'entreprise</h2>

          <Input
            label={t('companyName')}
            value={company.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nom de votre entreprise"
          />

          <Input
            label={t('email')}
            type="email"
            value={company.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="contact@entreprise.com"
          />

          <Input
            label={t('phone')}
            value={company.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+226 70 00 00 00"
          />

          <Input
            label={t('address')}
            value={company.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Adresse complète"
          />

          <Input
            label={t('city')}
            value={company.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Ouagadougou, Burkina Faso"
          />

          <div className="form-row">
            <Input
              label={t('ifu')}
              value={company.ifu}
              onChange={(e) => handleChange('ifu', e.target.value)}
              placeholder="Numéro IFU (optionnel)"
              helper="Identifiant Fiscal Unique"
            />

            <Input
              label={t('rccm')}
              value={company.rccm}
              onChange={(e) => handleChange('rccm', e.target.value)}
              placeholder="RCCM (optionnel)"
              helper="Registre du Commerce"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default CompanySettings;