// src/components/invoice/templates/SignatureZone.jsx
import React from 'react';
import { formatDate } from '../../../utils/formatters';
import './SignatureZone.css';

const SignatureZone = ({ 
  invoice,
  company,
  type = 'company', // 'company' ou 'client' ou 'both'
  lang = 'fr'
}) => {
  // Si pas de paramètres de signature, ne rien afficher
  if (!invoice?.signatureSettings || invoice.signatureSettings.mode === 'none') {
    return null;
  }

  const { signatureSettings } = invoice;
  
  // Vérifier si on doit afficher cette signature
  if (type === 'company' && !signatureSettings.showCompanySignature) return null;
  if (type === 'client' && !signatureSettings.showClientSignature) return null;

  const translations = {
    fr: {
      signature: 'Signature',
      companySignature: 'Pour l\'entreprise',
      clientSignature: 'Pour le client',
      signedOn: 'Fait le',
      at: 'à',
      goodForAgreement: 'Lu et approuvé'
    },
    en: {
      signature: 'Signature',
      companySignature: 'For the company',
      clientSignature: 'For the client',
      signedOn: 'Signed on',
      at: 'at',
      goodForAgreement: 'Read and approved'
    }
  };

  const t = translations[lang] || translations.fr;

  // Si on affiche les deux signatures
  if (type === 'both' && signatureSettings.showCompanySignature && signatureSettings.showClientSignature) {
    return (
      <section className="signature-zone-container">
        <div className="signature-zone-double">
          {/* Signature Entreprise */}
          <div className="signature-zone">
            <div className="signature-label">{t.companySignature}</div>
            
            {(signatureSettings.mode === 'digital' || signatureSettings.mode === 'both') && (
              <div className="signature-digital-name screen-only">
                {company?.name || 'Entreprise'}
              </div>
            )}
            
            <div className="signature-line print-only"></div>
            
            <div className="signature-info">
              <div className="signer-title">
                {signatureSettings.companySignerTitle || 'Directeur'}
              </div>
              <div className="signature-date">
                {t.signedOn} {formatDate(invoice.date || new Date(), 'short')}
              </div>
            </div>
          </div>

          {/* Signature Client */}
          <div className="signature-zone">
            <div className="signature-label">{t.clientSignature}</div>
            
            {(signatureSettings.mode === 'digital' || signatureSettings.mode === 'both') && (
              <div className="signature-digital-name screen-only">
                {invoice.client?.name || 'Client'}
              </div>
            )}
            
            <div className="signature-line print-only"></div>
            <div className="signature-mention print-only">{t.goodForAgreement}</div>
            
            <div className="signature-info">
              <div className="signer-title">
                {signatureSettings.clientSignerTitle || 'Client'}
              </div>
              <div className="signature-date">
                {t.signedOn} ___________
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Signature unique (entreprise ou client)
  const isCompany = type === 'company';
  const signerName = isCompany ? company?.name : invoice.client?.name;
  const signerTitle = isCompany 
    ? signatureSettings.companySignerTitle 
    : signatureSettings.clientSignerTitle;
  const label = isCompany ? t.companySignature : t.clientSignature;

  return (
    <section className="signature-zone-container">
      <div className="signature-zone signature-single">
        <div className="signature-label">{label}</div>
        
        {(signatureSettings.mode === 'digital' || signatureSettings.mode === 'both') && (
          <div className="signature-digital-name screen-only">
            {signerName || (isCompany ? 'Entreprise' : 'Client')}
          </div>
        )}
        
        <div className="signature-line print-only"></div>
        {!isCompany && <div className="signature-mention print-only">{t.goodForAgreement}</div>}
        
        <div className="signature-info">
          <div className="signer-title">
            {signerTitle || (isCompany ? 'Directeur' : 'Client')}
          </div>
          <div className="signature-date">
            {isCompany 
              ? `${t.signedOn} ${formatDate(invoice.date || new Date(), 'short')}` 
              : `${t.signedOn} ___________`
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureZone;