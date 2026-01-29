import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import Button from '../ui/Button';
import Input, { Textarea, Select } from '../ui/Input';
import ItemRow from './ItemRow';
import ImageUploader from './ImageUploader';
import InvoicePreview from './InvoicePreview';
import { generateInvoiceNumber, calculateSubtotal, calculateTax, calculateTotal, formatDate } from '../../utils/formatters';
import './InvoiceForm.css';

const defaultItem = { description: '', quantity: 1, unitPrice: 0 };

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { t } = useTheme();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [clients, setClients] = useState([]);

  const [invoice, setInvoice] = useState({
    number: '',
    date: formatDate(new Date(), 'iso'),
    dueDate: '',
    status: 'draft',
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: ''
    },
    items: [{ ...defaultItem }],
    taxRate: 0,
    discount: 0,
    notes: '',
    images: [],
    // NOUVELLES OPTIONS DE SIGNATURE
    signatureSettings: {
      mode: 'manual', // 'digital', 'manual', 'both', 'none'
      showCompanySignature: true,
      showClientSignature: false,
      companySignerTitle: userData?.company?.signatureTitle || 'Directeur',
      clientSignerTitle: 'Client'
    }
  });

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);

      try {
        // Charger les clients
        const clientsRef = collection(db, 'clients');
        const clientsQuery = query(clientsRef, where('userId', '==', user.uid));
        const clientsSnapshot = await getDocs(clientsQuery);
        const clientsData = [];
        clientsSnapshot.forEach(doc => {
          clientsData.push({ id: doc.id, ...doc.data() });
        });
        setClients(clientsData);

        if (id) {
          // Mode édition - charger la facture
          const invoiceDoc = await getDoc(doc(db, 'invoices', id));
          if (invoiceDoc.exists()) {
            const invoiceData = invoiceDoc.data();
            // Assurer la compatibilité avec les anciennes factures
            setInvoice({
              ...invoiceData,
              signatureSettings: invoiceData.signatureSettings || {
                mode: 'manual',
                showCompanySignature: true,
                showClientSignature: false,
                companySignerTitle: userData?.company?.signatureTitle || 'Directeur',
                clientSignerTitle: 'Client'
              }
            });
          }
        } else {
          // Mode création - générer le numéro
          const invoicesRef = collection(db, 'invoices');
          const lastInvoiceQuery = query(
            invoicesRef,
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(1)
          );
          const lastInvoiceSnapshot = await getDocs(lastInvoiceQuery);
          
          let lastNumber = null;
          lastInvoiceSnapshot.forEach(doc => {
            lastNumber = doc.data().number;
          });

          setInvoice(prev => ({
            ...prev,
            number: generateInvoiceNumber(lastNumber)
          }));
        }
      } catch (error) {
        console.error('Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, id, userData]);

  // Mettre à jour un champ
  const updateField = (field, value) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  // Mettre à jour les paramètres de signature
  const updateSignatureSettings = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      signatureSettings: { ...prev.signatureSettings, [field]: value }
    }));
  };

  // Mettre à jour le client
  const updateClient = (field, value) => {
    setInvoice(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }));
  };

  // Sélectionner un client existant
  const selectClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setInvoice(prev => ({
        ...prev,
        client: {
          id: client.id,
          name: client.name || '',
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          city: client.city || ''
        }
      }));
    }
  };

  // Gestion des items
  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { ...defaultItem }]
    }));
  };

  const updateItem = (index, field, value) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
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

  // Gestion des images
  const addImage = (imageData) => {
    setInvoice(prev => ({
      ...prev,
      images: [...(prev.images || []), imageData]
    }));
  };

  const removeImage = (index) => {
    setInvoice(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Calculs
  const subtotal = calculateSubtotal(invoice.items);
  const tax = calculateTax(subtotal, invoice.taxRate);
  const total = calculateTotal(invoice.items, invoice.taxRate, invoice.discount);

  // Sauvegarder
  const handleSave = async (status = 'draft') => {
    if (!user) return;

    setSaving(true);

    try {
      const invoiceData = {
        ...invoice,
        status,
        subtotal,
        tax,
        total,
        userId: user.uid,
        updatedAt: new Date().toISOString()
      };

      if (id) {
        // Mise à jour
        await updateDoc(doc(db, 'invoices', id), invoiceData);
      } else {
        // Création
        invoiceData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'invoices'), invoiceData);
      }

      navigate('/invoices');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="form-loading">
        <Icons.loader className="spinner" width={40} height={40} />
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="invoice-form-page">
      <div className="form-header">
        <div>
          <h1>{id ? 'Modifier la facture' : t('newInvoice')}</h1>
          <p className="text-muted">{invoice.number}</p>
        </div>
        <div className="form-header-actions">
          <Button 
            variant="secondary" 
            icon="eye" 
            onClick={() => setShowPreview(true)}
          >
            {t('preview')}
          </Button>
          <Button 
            variant="primary" 
            icon="check" 
            onClick={() => handleSave('pending')}
            loading={saving}
          >
            {t('save')}
          </Button>
        </div>
      </div>

      <div className="form-grid">
        {/* Colonne gauche */}
        <div className="form-main">
          {/* Infos facture */}
          <section className="form-section card">
            <h2>Informations</h2>
            <div className="form-row">
              <Input
                label={t('invoiceNumber')}
                value={invoice.number}
                onChange={(e) => updateField('number', e.target.value)}
                required
              />
              <Input
                label={t('date')}
                type="date"
                value={invoice.date}
                onChange={(e) => updateField('date', e.target.value)}
                required
              />
              <Input
                label={t('dueDate')}
                type="date"
                value={invoice.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
              />
            </div>
          </section>

          {/* Client */}
          <section className="form-section card">
            <h2>{t('billTo')}</h2>
            
            {clients.length > 0 && (
              <div className="client-selector">
                <Select
                  label="Sélectionner un client existant"
                  options={[
                    { value: '', label: '-- Nouveau client --' },
                    ...clients.map(c => ({ value: c.id, label: c.name }))
                  ]}
                  value={invoice.client.id || ''}
                  onChange={(e) => selectClient(e.target.value)}
                />
              </div>
            )}

            <div className="form-row">
              <Input
                label={t('clientName')}
                value={invoice.client.name}
                onChange={(e) => updateClient('name', e.target.value)}
                placeholder="Nom ou raison sociale"
                required
              />
              <Input
                label={t('email')}
                type="email"
                value={invoice.client.email}
                onChange={(e) => updateClient('email', e.target.value)}
                placeholder="client@email.com"
              />
            </div>
            <div className="form-row">
              <Input
                label={t('phone')}
                value={invoice.client.phone}
                onChange={(e) => updateClient('phone', e.target.value)}
                placeholder="+226 70 00 00 00"
              />
              <Input
                label={t('city')}
                value={invoice.client.city}
                onChange={(e) => updateClient('city', e.target.value)}
                placeholder="Ouagadougou"
              />
            </div>
            <Input
              label={t('address')}
              value={invoice.client.address}
              onChange={(e) => updateClient('address', e.target.value)}
              placeholder="Adresse complète"
            />
          </section>

          {/* Items */}
          <section className="form-section card">
            <h2>Prestations / Produits</h2>
            
            <div className="items-list">
              <div className="items-header">
                <span className="col-desc">{t('description')}</span>
                <span className="col-qty">{t('quantity')}</span>
                <span className="col-price">{t('unitPrice')}</span>
                <span className="col-total">{t('total')}</span>
                <span className="col-action"></span>
              </div>

              {invoice.items.map((item, index) => (
                <ItemRow
                  key={index}
                  item={item}
                  index={index}
                  onChange={updateItem}
                  onRemove={removeItem}
                  canRemove={invoice.items.length > 1}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              icon="plus"
              onClick={addItem}
              className="add-item-btn"
            >
              {t('addItem')}
            </Button>
          </section>

          {/* NOUVELLE SECTION : Paramètres de signature */}
          <section className="form-section card">
            <h2>Paramètres de signature</h2>
            
            <div className="form-row">
              <Select
                label="Mode de signature"
                options={[
                  { value: 'none', label: 'Pas de signature' },
                  { value: 'manual', label: 'Ligne pour signature manuelle (impression)' },
                  { value: 'digital', label: 'Signature numérique (nom stylisé)' },
                  { value: 'both', label: 'Numérique à l\'écran, manuelle à l\'impression' }
                ]}
                value={invoice.signatureSettings.mode}
                onChange={(e) => updateSignatureSettings('mode', e.target.value)}
              />
            </div>

            {invoice.signatureSettings.mode !== 'none' && (
              <>
                <div className="signature-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={invoice.signatureSettings.showCompanySignature}
                      onChange={(e) => updateSignatureSettings('showCompanySignature', e.target.checked)}
                    />
                    <span>Signature de l'entreprise</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={invoice.signatureSettings.showClientSignature}
                      onChange={(e) => updateSignatureSettings('showClientSignature', e.target.checked)}
                    />
                    <span>Signature du client</span>
                  </label>
                </div>

                <div className="form-row">
                  {invoice.signatureSettings.showCompanySignature && (
                    <Input
                      label="Titre du signataire (entreprise)"
                      value={invoice.signatureSettings.companySignerTitle}
                      onChange={(e) => updateSignatureSettings('companySignerTitle', e.target.value)}
                      placeholder="Ex: Directeur, Gérant, CEO..."
                    />
                  )}
                  
                  {invoice.signatureSettings.showClientSignature && (
                    <Input
                      label="Titre du signataire (client)"
                      value={invoice.signatureSettings.clientSignerTitle}
                      onChange={(e) => updateSignatureSettings('clientSignerTitle', e.target.value)}
                      placeholder="Ex: Client, Responsable achats..."
                    />
                  )}
                </div>
              </>
            )}
          </section>

          {/* Images */}
          <section className="form-section card">
            <h2>Images (optionnel)</h2>
            <p className="text-muted text-sm">Ajoutez des photos de vos produits ou travaux</p>
            
            <ImageUploader
              images={invoice.images || []}
              onAdd={addImage}
              onRemove={removeImage}
              maxImages={6}
            />
          </section>

          {/* Notes */}
          <section className="form-section card">
            <h2>Notes</h2>
            <Textarea
              value={invoice.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Conditions de paiement, informations complémentaires..."
              rows={3}
            />
          </section>
        </div>

        {/* Colonne droite - Résumé */}
        <div className="form-sidebar">
          <div className="summary-card card">
            <h3>Résumé</h3>
            
            <div className="summary-row">
              <span>{t('subtotal')}</span>
              <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div className="summary-input">
              <label>Taxe (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={invoice.taxRate}
                onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="summary-row">
              <span>{t('tax')}</span>
              <span>{tax.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div className="summary-input">
              <label>{t('discount')} (FCFA)</label>
              <input
                type="number"
                min="0"
                value={invoice.discount}
                onChange={(e) => updateField('discount', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="summary-total">
              <span>{t('totalAmount')}</span>
              <span>{total.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div className="summary-actions">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => handleSave('draft')}
                loading={saving}
              >
                Brouillon
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleSave('pending')}
                loading={saving}
              >
                Enregistrer
              </Button>
            </div>
          </div>

          <div className="status-card card">
            <h3>Statut</h3>
            <Select
              options={[
                { value: 'draft', label: t('draft') },
                { value: 'pending', label: t('pending') },
                { value: 'paid', label: t('paid') },
                { value: 'overdue', label: t('overdue') }
              ]}
              value={invoice.status}
              onChange={(e) => updateField('status', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Modal Aperçu */}
      {showPreview && (
        <InvoicePreview
          invoice={{ ...invoice, subtotal, tax, total }}
          company={userData?.company}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default InvoiceForm;