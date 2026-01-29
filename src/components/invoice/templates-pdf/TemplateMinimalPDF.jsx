import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

// Formats papier
const paperFormats = {
  'A4': [595.28, 841.89],
  'Letter': [612, 792],
  'Legal': [612, 1008]
};

// Traductions
const translations = {
  fr: {
    invoice: 'Facture',
    quote: 'Devis',
    invoiceNumber: 'N°',
    date: 'Date',
    dueDate: 'Échéance',
    billTo: 'Facturer à',
    from: 'De',
    description: 'Description',
    qty: 'Qté',
    unitPrice: 'Prix',
    total: 'Total',
    subtotal: 'Sous-total',
    tax: 'TVA',
    discount: 'Remise',
    grandTotal: 'Total',
    paymentInfo: 'Paiement',
    bankTransfer: 'Virement bancaire',
    bank: 'Banque',
    notes: 'Notes',
    thanks: 'Merci !',
    attachments: 'Pièces jointes',
    signatureCompany: 'Signature entreprise',
    signatureClient: 'Signature client',
    status: {
      draft: 'Brouillon',
      pending: 'En attente',
      paid: 'Payée',
      overdue: 'En retard',
      cancelled: 'Annulée'
    }
  },
  en: {
    invoice: 'Invoice',
    quote: 'Quote',
    invoiceNumber: 'No.',
    date: 'Date',
    dueDate: 'Due',
    billTo: 'Bill to',
    from: 'From',
    description: 'Description',
    qty: 'Qty',
    unitPrice: 'Price',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    grandTotal: 'Total',
    paymentInfo: 'Payment',
    bankTransfer: 'Bank Transfer',
    bank: 'Bank',
    notes: 'Notes',
    thanks: 'Thank you!',
    attachments: 'Attachments',
    signatureCompany: 'Company signature',
    signatureClient: 'Client signature',
    status: {
      draft: 'Draft',
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled'
    }
  }
};

// Configuration des statuts
const statusConfig = {
  draft: { color: '#64748b', bg: '#f1f5f9' },
  pending: { color: '#f59e0b', bg: '#fef3c7' },
  paid: { color: '#10b981', bg: '#d1fae5' },
  overdue: { color: '#ef4444', bg: '#fee2e2' },
  cancelled: { color: '#64748b', bg: '#f1f5f9' }
};

// Formatage des montants
const formatAmount = (amount, currency, lang = 'fr') => {
  const num = parseFloat(amount) || 0;
  const fixed = num.toFixed(2);
  const parts = fixed.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  let formattedInteger = '';
  const digits = integerPart.split('').reverse();
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedInteger = ' ' + formattedInteger;
    }
    formattedInteger = digits[i] + formattedInteger;
  }
  
  const decimalSeparator = lang === 'en' ? '.' : ',';
  return `${formattedInteger}${decimalSeparator}${decimalPart} ${currency}`;
};

// Formatage des dates (court)
const formatDate = (dateString, lang = 'fr') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  if (lang === 'en') {
    return `${month}/${day}/${year}`;
  }
  return `${day}/${month}/${year}`;
};

// Conversion hex vers HSL
const hexToHSL = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
      default: h = 0;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Créer les couleurs dérivées
const createColors = (primaryColor) => {
  const hsl = hexToHSL(primaryColor);
  return {
    primary: primaryColor,
    primaryLight: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 25, 90)),
    primaryDark: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 10)),
  };
};

// Créer les styles
const createStyles = (colors) => StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    color: '#3f3f46',
    padding: 42,
    flexDirection: 'column',
  },

  // ===== HEADER =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 34,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 40,
    maxWidth: 140,
    objectFit: 'contain',
  },
  logoText: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  invoiceLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  invoiceNumber: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  statusBadge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // ===== META =====
  metaSection: {
    marginBottom: 28,
  },
  metaDates: {
    flexDirection: 'row',
    gap: 22,
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#27272a',
  },

  // ===== PARTIES =====
  partiesSection: {
    flexDirection: 'row',
    gap: 42,
    marginBottom: 28,
  },
  partyBlock: {
    flex: 1,
    gap: 6,
  },
  partyLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  partyContent: {
    gap: 2,
  },
  partyName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#18181b',
    marginBottom: 3,
  },
  partyNameHighlight: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  partyText: {
    fontSize: 8.5,
    color: '#52525b',
    lineHeight: 1.5,
  },
  taxId: {
    fontSize: 7.5,
    fontFamily: 'Courier',
    color: '#a1a1aa',
    marginTop: 3,
  },

  // ===== DIVIDER =====
  divider: {
    height: 1,
    backgroundColor: '#e4e4e7',
    marginBottom: 22,
  },

  // ===== ITEMS =====
  itemsSection: {
    marginBottom: 22,
  },
  itemsHeader: {
    flexDirection: 'row',
    paddingBottom: 9,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  itemsHeaderCell: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  colDesc: {
    flex: 1,
  },
  colQty: {
    width: 42,
    textAlign: 'right',
  },
  colPrice: {
    width: 80,
    textAlign: 'right',
  },
  colTotal: {
    width: 80,
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
    alignItems: 'center',
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemDescContainer: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#27272a',
  },
  itemDetails: {
    fontSize: 7.5,
    color: '#a1a1aa',
  },
  cellQty: {
    fontSize: 9,
    color: '#71717a',
    textAlign: 'right',
  },
  cellPrice: {
    fontSize: 9,
    color: '#71717a',
    textAlign: 'right',
  },
  cellTotal: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#27272a',
    textAlign: 'right',
  },

  // ===== TOTALS =====
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 28,
  },
  totalsWrapper: {
    width: 200,
  },
  totalsLines: {
    gap: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    marginBottom: 12,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 8.5,
    color: '#71717a',
  },
  totalValue: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#3f3f46',
  },
  totalValueDiscount: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#10b981',
  },
  grandTotalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  grandValue: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.5,
  },

  // ===== FOOTER INFO =====
  footerInfo: {
    flexDirection: 'row',
    gap: 28,
    marginBottom: 22,
  },
  infoBlock: {
    flex: 1,
    gap: 6,
  },
  infoLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoContent: {
    gap: 2,
  },
  infoText: {
    fontSize: 8,
    color: '#52525b',
    lineHeight: 1.5,
  },
  infoTextMono: {
    fontSize: 7.5,
    fontFamily: 'Courier',
    color: '#71717a',
    letterSpacing: 0.2,
  },

  // ===== ATTACHMENTS =====
  attachmentsSection: {
    marginBottom: 22,
  },
  attachmentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  attachmentThumb: {
    width: 62,
    height: 62,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  // ===== SIGNATURES =====
  signaturesSection: {
    paddingTop: 17,
    marginTop: 17,
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
  },
  signaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 56,
  },
  signatureBox: {
    flex: 1,
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 35,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#d4d4d8',
    marginBottom: 6,
  },
  signatureText: {
    fontSize: 7,
    color: '#71717a',
  },
  signatureImage: {
    width: 100,
    height: 40,
    objectFit: 'contain',
    marginBottom: 6,
  },

  // ===== SPACER =====
  spacer: {
    flex: 1,
    minHeight: 28,
  },

  // ===== FOOTER =====
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    marginTop: 'auto',
  },
  footerThanks: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.5,
  },
  footerCompany: {
    fontSize: 8,
    color: '#a1a1aa',
  },
});

const TemplateMinimalPDF = ({ 
  invoice, 
  company, 
  themeColor = '#0f172a', 
  paperFormat = 'A4', 
  lang = 'fr' 
}) => {
  const colors = createColors(themeColor);
  const styles = createStyles(colors);
  const t = translations[lang] || translations.fr;
  const pageSize = paperFormats[paperFormat] || paperFormats['A4'];
  
  const isQuote = invoice.type === 'quote';
  const currency = invoice.currency || 'FCFA';
  
  const status = invoice.status || 'pending';
  const statusStyle = statusConfig[status] || statusConfig.pending;
  const statusLabel = t.status[status] || t.status.pending;
  
  // Calculs
  const items = invoice.items || [];
  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
  }, 0);
  
  const taxRate = parseFloat(invoice.taxRate) || 0;
  const taxAmount = invoice.tax || (subtotal * (taxRate / 100));
  const discount = parseFloat(invoice.discount) || 0;
  const total = invoice.total || (subtotal + taxAmount - discount);

  // Signatures
  const showCompanySignature = invoice.signatureSettings?.showCompanySignature !== false;
  const showClientSignature = invoice.signatureSettings?.showClientSignature || false;

  // Générer initiales pour logo texte
  const getInitials = (name) => {
    return (name || 'Entreprise').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>
        
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {company?.logo ? (
              <Image src={company.logo} style={styles.logo} />
            ) : (
              <Text style={[styles.logoText, { color: colors.primary }]}>
                {getInitials(company?.name)}
              </Text>
            )}
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.invoiceLabel}>{isQuote ? t.quote : t.invoice}</Text>
            <Text style={[styles.invoiceNumber, { color: colors.primary }]}>
              {invoice.number || '---'}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* ===== META (Dates) ===== */}
        <View style={styles.metaSection}>
          <View style={styles.metaDates}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>{t.date}</Text>
              <Text style={styles.metaValue}>{formatDate(invoice.date, lang)}</Text>
            </View>
            {invoice.dueDate && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>{t.dueDate}</Text>
                <Text style={styles.metaValue}>{formatDate(invoice.dueDate, lang)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ===== PARTIES ===== */}
        <View style={styles.partiesSection}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>{t.from}</Text>
            <View style={styles.partyContent}>
              <Text style={styles.partyName}>{company?.name || 'Votre Entreprise'}</Text>
              {company?.address && <Text style={styles.partyText}>{company.address}</Text>}
              {company?.city && <Text style={styles.partyText}>{company.city}</Text>}
              {company?.email && <Text style={styles.partyText}>{company.email}</Text>}
              {company?.phone && <Text style={styles.partyText}>{company.phone}</Text>}
              {company?.taxId && <Text style={styles.taxId}>{company.taxId}</Text>}
            </View>
          </View>

          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>{t.billTo}</Text>
            <View style={styles.partyContent}>
              <Text style={[styles.partyNameHighlight, { color: colors.primary }]}>
                {invoice.client?.name || 'Client'}
              </Text>
              {invoice.client?.address && <Text style={styles.partyText}>{invoice.client.address}</Text>}
              {invoice.client?.city && <Text style={styles.partyText}>{invoice.client.city}</Text>}
              {invoice.client?.email && <Text style={styles.partyText}>{invoice.client.email}</Text>}
              {invoice.client?.phone && <Text style={styles.partyText}>{invoice.client.phone}</Text>}
            </View>
          </View>
        </View>

        {/* ===== DIVIDER ===== */}
        <View style={styles.divider} />

        {/* ===== ITEMS ===== */}
        <View style={styles.itemsSection}>
          {/* Header */}
          <View style={styles.itemsHeader}>
            <Text style={[styles.itemsHeaderCell, styles.colDesc]}>{t.description}</Text>
            <Text style={[styles.itemsHeaderCell, styles.colQty]}>{t.qty}</Text>
            <Text style={[styles.itemsHeaderCell, styles.colPrice]}>{t.unitPrice}</Text>
            <Text style={[styles.itemsHeaderCell, styles.colTotal]}>{t.total}</Text>
          </View>
          
          {/* Rows */}
          {items.map((item, index) => {
            const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
            const isLast = index === items.length - 1;
            
            return (
              <View 
                key={item.id || index} 
                style={[styles.itemRow, isLast && styles.itemRowLast]}
              >
                <View style={styles.itemDescContainer}>
                  <Text style={styles.itemName}>{item.description || '—'}</Text>
                  {item.details && <Text style={styles.itemDetails}>{item.details}</Text>}
                </View>
                <Text style={[styles.cellQty, styles.colQty]}>{item.quantity || 0}</Text>
                <Text style={[styles.cellPrice, styles.colPrice]}>
                  {formatAmount(item.unitPrice || 0, currency, lang)}
                </Text>
                <Text style={[styles.cellTotal, styles.colTotal]}>
                  {formatAmount(lineTotal, currency, lang)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ===== TOTALS ===== */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsWrapper}>
            <View style={styles.totalsLines}>
              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>{t.subtotal}</Text>
                <Text style={styles.totalValue}>{formatAmount(subtotal, currency, lang)}</Text>
              </View>
              
              {taxRate > 0 && (
                <View style={styles.totalLine}>
                  <Text style={styles.totalLabel}>{t.tax} ({taxRate}%)</Text>
                  <Text style={styles.totalValue}>{formatAmount(taxAmount, currency, lang)}</Text>
                </View>
              )}
              
              {discount > 0 && (
                <View style={styles.totalLine}>
                  <Text style={styles.totalLabel}>{t.discount}</Text>
                  <Text style={styles.totalValueDiscount}>-{formatAmount(discount, currency, lang)}</Text>
                </View>
              )}
            </View>

            <View style={styles.grandTotalLine}>
              <Text style={styles.grandLabel}>{t.grandTotal}</Text>
              <Text style={[styles.grandValue, { color: colors.primary }]}>
                {formatAmount(total, currency, lang)}
              </Text>
            </View>
          </View>
        </View>

        {/* ===== FOOTER INFO ===== */}
        {((company?.iban || company?.bankName) || invoice.notes) && (
          <View style={styles.footerInfo}>
            {(company?.iban || company?.bankName) && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>{t.paymentInfo}</Text>
                <View style={styles.infoContent}>
                  {company?.bankName && <Text style={styles.infoText}>{company.bankName}</Text>}
                  {company?.iban && <Text style={styles.infoTextMono}>{company.iban}</Text>}
                  {company?.bic && <Text style={styles.infoTextMono}>{company.bic}</Text>}
                </View>
              </View>
            )}

            {invoice.notes && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>{t.notes}</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoText}>{invoice.notes}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ===== ATTACHMENTS ===== */}
        {invoice.images && invoice.images.length > 0 && (
          <View style={styles.attachmentsSection}>
            <View style={styles.attachmentsRow}>
              {invoice.images.map((image, index) => (
                <View key={index} style={styles.attachmentThumb}>
                  <Image src={image.data || image} style={styles.attachmentImage} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ===== SIGNATURES ===== */}
        {(showCompanySignature || showClientSignature) && (
          <View style={styles.signaturesSection}>
            <View style={styles.signaturesContainer}>
              {showCompanySignature && (
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>{t.signatureCompany}</Text>
                  {invoice.companySignature ? (
                    <Image src={invoice.companySignature} style={styles.signatureImage} />
                  ) : (
                    <View style={styles.signatureLine} />
                  )}
                  <Text style={styles.signatureText}>{company?.name || ''}</Text>
                </View>
              )}
              
              {showClientSignature && (
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>{t.signatureClient}</Text>
                  {invoice.clientSignature ? (
                    <Image src={invoice.clientSignature} style={styles.signatureImage} />
                  ) : (
                    <View style={styles.signatureLine} />
                  )}
                  <Text style={styles.signatureText}>{invoice.client?.name || ''}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ===== SPACER ===== */}
        <View style={styles.spacer} />

        {/* ===== FOOTER ===== */}
        <View style={styles.footer}>
          <Text style={[styles.footerThanks, { color: colors.primary }]}>{t.thanks}</Text>
          <Text style={styles.footerCompany}>{company?.name}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TemplateMinimalPDF;