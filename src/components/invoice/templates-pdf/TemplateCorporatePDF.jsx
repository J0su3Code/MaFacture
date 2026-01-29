import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Svg, Path, Circle } from '@react-pdf/renderer';

// Formats papier
const paperFormats = {
  'A4': [595.28, 841.89],
  'Letter': [612, 792],
  'Legal': [612, 1008]
};

// Traductions
const translations = {
  fr: {
    invoice: 'FACTURE',
    quote: 'DEVIS',
    invoiceNumber: 'N° Facture',
    date: "Date d'émission",
    dueDate: "Date d'échéance",
    from: 'DE',
    billTo: 'FACTURÉ À',
    item: '#',
    description: 'Description',
    qty: 'Qté',
    unitPrice: 'Prix unitaire',
    total: 'Total',
    subtotal: 'Sous-total HT',
    tax: 'TVA',
    discount: 'Remise',
    grandTotal: 'TOTAL TTC',
    paymentInfo: 'Informations de paiement',
    paymentMethod: 'Mode de paiement',
    bankTransfer: 'Virement bancaire',
    bank: 'Banque',
    attachments: 'Pièces jointes',
    terms: 'Conditions & Notes',
    thanks: 'Merci pour votre confiance !',
    phone: 'Téléphone',
    email: 'Email',
    address: 'Adresse',
    taxId: 'N° Contribuable',
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
    invoice: 'INVOICE',
    quote: 'QUOTE',
    invoiceNumber: 'Invoice #',
    date: 'Issue Date',
    dueDate: 'Due Date',
    from: 'FROM',
    billTo: 'BILL TO',
    item: '#',
    description: 'Description',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    grandTotal: 'TOTAL DUE',
    paymentInfo: 'Payment Information',
    paymentMethod: 'Payment Method',
    bankTransfer: 'Bank Transfer',
    bank: 'Bank',
    attachments: 'Attachments',
    terms: 'Terms & Notes',
    thanks: 'Thank you for your business!',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    taxId: 'Tax ID',
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
  draft: { color: '#6b7280', bg: '#f3f4f6' },
  pending: { color: '#d97706', bg: '#fef3c7' },
  paid: { color: '#059669', bg: '#d1fae5' },
  overdue: { color: '#dc2626', bg: '#fee2e2' },
  cancelled: { color: '#6b7280', bg: '#f3f4f6' }
};

// ============================================
// FONCTION DE FORMATAGE CORRIGÉE
// ============================================
const formatAmount = (amount, currency, lang = 'fr') => {
  const num = parseFloat(amount) || 0;
  
  // Formatage manuel pour éviter les problèmes de caractères spéciaux avec react-pdf
  const fixed = num.toFixed(2);
  const parts = fixed.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Ajouter les séparateurs de milliers (espace simple, pas insécable)
  let formattedInteger = '';
  const digits = integerPart.split('').reverse();
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedInteger = ' ' + formattedInteger;
    }
    formattedInteger = digits[i] + formattedInteger;
  }
  
  // Séparateur décimal selon la langue
  const decimalSeparator = lang === 'en' ? '.' : ',';
  
  // Retourner le montant formaté avec la devise
  return `${formattedInteger}${decimalSeparator}${decimalPart} ${currency}`;
};

// Fonction pour formater les dates
const formatDate = (dateString, lang = 'fr') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  const months = {
    fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };
  
  const day = date.getDate();
  const month = months[lang] ? months[lang][date.getMonth()] : months.fr[date.getMonth()];
  const year = date.getFullYear();
  
  if (lang === 'en') {
    return `${month} ${day}, ${year}`;
  }
  return `${day} ${month} ${year}`;
};

// Conversion hex vers HSL pour créer des variantes
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
    primaryDark: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 10, 15)),
    primaryLight: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 85)),
    primaryBg: hslToHex(hsl.h, Math.max(hsl.s - 30, 10), 97),
  };
};

// Créer les styles
const createStyles = (colors) => StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    color: '#374151',
    display: 'flex',
    flexDirection: 'column',
  },

  // ===== HEADER =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '28 34',
    backgroundColor: colors.primary,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  companyLogo: {
    height: 50,
    maxWidth: 110,
    objectFit: 'contain',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    padding: 6,
  },
  logoFallback: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoFallbackText: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  companyInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  companyDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  companyDetailText: {
    fontSize: 7.5,
    color: '#ffffff',
    opacity: 0.85,
  },
  headerInvoice: {
    alignItems: 'flex-end',
    gap: 12,
  },
  invoiceBadge: {
    alignItems: 'flex-end',
    gap: 6,
  },
  invoiceTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  invoiceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  invoiceDetails: {
    gap: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  detailLabel: {
    fontSize: 8,
    color: '#ffffff',
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    minWidth: 85,
    textAlign: 'right',
  },
  detailRowHighlight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 3,
  },

  // ===== PARTIES SECTION =====
  partiesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    paddingHorizontal: 34,
    backgroundColor: '#f0f4f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  partyCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  partyLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  partyName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 6,
  },
  partyNameHighlight: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  partyDetails: {
    gap: 1,
  },
  partyDetailText: {
    fontSize: 8,
    color: '#6b7280',
    lineHeight: 1.6,
  },
  partyArrow: {
    width: 20,
    alignItems: 'center',
  },

  // ===== ITEMS TABLE =====
  itemsSection: {
    paddingVertical: 17,
    paddingHorizontal: 34,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colNum: {
    width: 28,
    textAlign: 'center',
  },
  colDesc: {
    flex: 1,
  },
  colQty: {
    width: 42,
    textAlign: 'center',
  },
  colPrice: {
    width: 80,
    textAlign: 'right',
  },
  colTotal: {
    width: 80,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCell: {
    fontSize: 8.5,
    color: '#374151',
  },
  rowNumberContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowNumber: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
  itemName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#1f2937',
  },
  itemDetails: {
    fontSize: 7.5,
    color: '#6b7280',
    marginTop: 2,
  },
  cellQty: {
    fontSize: 8.5,
    color: '#4b5563',
    textAlign: 'center',
  },
  cellPrice: {
    fontSize: 8.5,
    color: '#4b5563',
    textAlign: 'right',
  },
  cellTotal: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    textAlign: 'right',
  },

  // ===== SUMMARY SECTION =====
  summarySection: {
    flexDirection: 'row',
    paddingVertical: 17,
    paddingHorizontal: 34,
    gap: 24,
  },
  summaryPayment: {
    flex: 1,
  },
  summaryTotals: {
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 9,
    paddingBottom: 6,
    borderBottomWidth: 2,
  },
  paymentBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    
  },
  paymentRowLast: {
    borderBottomWidth: 0,
  },
  paymentLabel: {
    fontSize: 8,
    color: '#6b7280',
  },
  paymentValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
  },
  paymentValueMono: {
    fontSize: 7.5,
    fontFamily: 'Courier',
    color: '#1f2937',
    letterSpacing: 0.3,
  },
  totalsBox: {
    width: 200,
    marginBottom: 9,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    
  },
  totalRowLast: {
    borderBottomWidth: 0,
  },
  totalLabel: {
    fontSize: 8.5,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
  },
  totalValueDiscount: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#059669',
  },
  grandTotal: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  grandLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 0.8,
  },
  grandValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // ===== ATTACHMENTS =====
  attachmentsSection: {
    paddingHorizontal: 34,
    paddingBottom: 17,
  },
  attachmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  attachmentItem: {
    width: 79,
    height: 79,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    position: 'relative',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  attachmentBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentBadgeText: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // ===== NOTES =====
  notesSection: {
    paddingHorizontal: 34,
    paddingBottom: 17,
  },
  notesContent: {
    backgroundColor: '#f0f4f8',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 3,
    borderRadius: 4,
    padding: 12,
  },
  notesText: {
    fontSize: 8,
    color: '#4b5563',
    lineHeight: 1.7,
  },

  // ===== SIGNATURES =====
  signaturesSection: {
    paddingHorizontal: 34,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    
  },
  signaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  signatureBox: {
    flex: 1,
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 30,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    marginBottom: 6,
  },
  signatureText: {
    fontSize: 7,
    color: '#6b7280',
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
    minHeight: 24,
  },

  // ===== FOOTER =====
  footer: {
    backgroundColor: '#f0f4f8',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 14,
    paddingHorizontal: 34,
    marginTop: 'auto',
  },
  footerMessage: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  footerContacts: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 17,
    marginBottom: 9,
  },
  footerContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerContactText: {
    fontSize: 7.5,
    color: '#4b5563',
  },
  footerLegal: {
    textAlign: 'center',
    fontSize: 7,
    color: '#9ca3af',
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    
  },
});

// Composant Icône Flèche
const ArrowIcon = ({ color }) => (
  <Svg width={17} height={17} viewBox="0 0 24 24">
    <Path
      d="M5 12h14M12 5l7 7-7 7"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

// Composant Icône Téléphone
const PhoneIcon = ({ color }) => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

// Composant Icône Email
const EmailIcon = ({ color }) => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Path
      d="M22 6l-10 7L2 6"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

// Composant Icône Location
const LocationIcon = ({ color }) => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Circle cx={12} cy={10} r={3} stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const TemplateCorporatePDF = ({ 
  invoice, 
  company, 
  themeColor = '#1e3a5f', 
  paperFormat = 'A4', 
  lang = 'fr' 
}) => {
  const colors = createColors(themeColor);
  const styles = createStyles(colors);
  const t = translations[lang] || translations.fr;
  const pageSize = paperFormats[paperFormat] || paperFormats['A4'];
  
  const isQuote = invoice.type === 'quote';
  
  // ============================================
  // DEVISE - Utiliser celle de la facture
  // ============================================
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

  // Déterminer les signatures à afficher
  const showCompanySignature = invoice.signatureSettings?.showCompanySignature !== false;
  const showClientSignature = invoice.signatureSettings?.showClientSignature || false;

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>
        
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View style={styles.headerBrand}>
            {company?.logo ? (
              <Image src={company.logo} style={styles.companyLogo} />
            ) : (
              <View style={styles.logoFallback}>
                <Text style={styles.logoFallbackText}>
                  {(company?.name || 'E').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{company?.name || 'Votre Entreprise'}</Text>
              <View style={styles.companyDetails}>
                {company?.address && (
                  <Text style={styles.companyDetailText}>{company.address}</Text>
                )}
                {company?.city && (
                  <Text style={styles.companyDetailText}>{company.city}</Text>
                )}
                {company?.phone && (
                  <Text style={styles.companyDetailText}>{t.phone}: {company.phone}</Text>
                )}
                {company?.email && (
                  <Text style={styles.companyDetailText}>{company.email}</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.headerInvoice}>
            <View style={styles.invoiceBadge}>
              <Text style={styles.invoiceTitle}>{isQuote ? t.quote : t.invoice}</Text>
              <View style={[styles.invoiceStatus, { backgroundColor: statusStyle.bg }]}>
                <View style={[styles.statusIndicator, { backgroundColor: statusStyle.color }]} />
                <Text style={[styles.statusText, { color: statusStyle.color }]}>{statusLabel}</Text>
              </View>
            </View>
            
            <View style={styles.invoiceDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t.invoiceNumber}</Text>
                <Text style={styles.detailValue}>{invoice.number || '---'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t.date}</Text>
                <Text style={styles.detailValue}>{formatDate(invoice.date, lang)}</Text>
              </View>
              {invoice.dueDate && (
                <View style={styles.detailRowHighlight}>
                  <Text style={styles.detailLabel}>{t.dueDate}</Text>
                  <Text style={styles.detailValue}>{formatDate(invoice.dueDate, lang)}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ===== PARTIES (FROM / TO) ===== */}
        <View style={[styles.partiesSection, { backgroundColor: colors.primaryBg }]}>
          <View style={styles.partyCard}>
            <Text style={styles.partyLabel}>{t.from}</Text>
            <Text style={styles.partyName}>{company?.name || 'Votre Entreprise'}</Text>
            <View style={styles.partyDetails}>
              {company?.address && <Text style={styles.partyDetailText}>{company.address}</Text>}
              {company?.city && <Text style={styles.partyDetailText}>{company.city}</Text>}
              {company?.taxId && <Text style={styles.partyDetailText}>{t.taxId}: {company.taxId}</Text>}
            </View>
          </View>

          <View style={styles.partyArrow}>
            <ArrowIcon color={colors.primary} />
          </View>

          <View style={styles.partyCard}>
            <Text style={styles.partyLabel}>{t.billTo}</Text>
            <Text style={[styles.partyNameHighlight, { color: colors.primary }]}>
              {invoice.client?.name || 'Client'}
            </Text>
            <View style={styles.partyDetails}>
              {invoice.client?.address && <Text style={styles.partyDetailText}>{invoice.client.address}</Text>}
              {invoice.client?.city && <Text style={styles.partyDetailText}>{invoice.client.city}</Text>}
              {invoice.client?.email && <Text style={styles.partyDetailText}>{invoice.client.email}</Text>}
              {invoice.client?.phone && <Text style={styles.partyDetailText}>{invoice.client.phone}</Text>}
            </View>
          </View>
        </View>

        {/* ===== ITEMS TABLE ===== */}
        <View style={styles.itemsSection}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colNum]}>{t.item}</Text>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>{t.description}</Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>{t.qty}</Text>
              <Text style={[styles.tableHeaderCell, styles.colPrice]}>{t.unitPrice}</Text>
              <Text style={[styles.tableHeaderCell, styles.colTotal]}>{t.total}</Text>
            </View>
            
            {/* Table Rows */}
            {items.map((item, index) => {
              const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
              const isLast = index === items.length - 1;
              const isAlt = index % 2 === 1;
              
              return (
                <View 
                  key={item.id || index} 
                  style={[
                    styles.tableRow, 
                    isAlt && styles.tableRowAlt,
                    isLast && styles.tableRowLast
                  ]}
                >
                  <View style={styles.colNum}>
                    <View style={[styles.rowNumberContainer, { backgroundColor: colors.primaryBg }]}>
                      <Text style={[styles.rowNumber, { color: colors.primary }]}>
                        {String(index + 1).padStart(2, '0')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.colDesc}>
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
        </View>

        {/* ===== SUMMARY SECTION ===== */}
        <View style={styles.summarySection}>
          {/* Payment Info */}
          <View style={styles.summaryPayment}>
            <Text style={[styles.sectionTitle, { color: colors.primary, borderBottomColor: colors.primary }]}>
              {t.paymentInfo}
            </Text>
            <View style={styles.paymentBox}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>{t.paymentMethod}</Text>
                <Text style={styles.paymentValue}>{t.bankTransfer}</Text>
              </View>
              {company?.bankName && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>{t.bank}</Text>
                  <Text style={styles.paymentValue}>{company.bankName}</Text>
                </View>
              )}
              {company?.iban && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>IBAN</Text>
                  <Text style={styles.paymentValueMono}>{company.iban}</Text>
                </View>
              )}
              {company?.bic && (
                <View style={[styles.paymentRow, styles.paymentRowLast]}>
                  <Text style={styles.paymentLabel}>BIC/SWIFT</Text>
                  <Text style={styles.paymentValueMono}>{company.bic}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Totals */}
          <View style={styles.summaryTotals}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t.subtotal}</Text>
                <Text style={styles.totalValue}>{formatAmount(subtotal, currency, lang)}</Text>
              </View>
              
              {taxRate > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>{t.tax} ({taxRate}%)</Text>
                  <Text style={styles.totalValue}>{formatAmount(taxAmount, currency, lang)}</Text>
                </View>
              )}
              
              {discount > 0 && (
                <View style={[styles.totalRow, styles.totalRowLast]}>
                  <Text style={styles.totalLabel}>{t.discount}</Text>
                  <Text style={styles.totalValueDiscount}>-{formatAmount(discount, currency, lang)}</Text>
                </View>
              )}
            </View>

            <View style={[styles.grandTotal, { backgroundColor: colors.primary }]}>
              <Text style={styles.grandLabel}>{t.grandTotal}</Text>
              <Text style={styles.grandValue}>{formatAmount(total, currency, lang)}</Text>
            </View>
          </View>
        </View>

        {/* ===== ATTACHMENTS ===== */}
        {invoice.images && invoice.images.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={[styles.sectionTitle, { color: colors.primary, borderBottomColor: colors.primary }]}>
              {t.attachments}
            </Text>
            <View style={styles.attachmentsGrid}>
              {invoice.images.map((image, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <Image 
                    src={image.data || image} 
                    style={styles.attachmentImage} 
                  />
                  <View style={[styles.attachmentBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.attachmentBadgeText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ===== NOTES ===== */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={[styles.sectionTitle, { color: colors.primary, borderBottomColor: colors.primary }]}>
              {t.terms}
            </Text>
            <View style={[styles.notesContent, { borderLeftColor: colors.primary, backgroundColor: colors.primaryBg }]}>
              <Text style={styles.notesText}>{invoice.notes}</Text>
            </View>
          </View>
        )}

        {/* ===== SIGNATURES ===== */}
        {(showCompanySignature || showClientSignature) && (
          <View style={styles.signaturesSection}>
            <View style={styles.signaturesContainer}>
              {showCompanySignature && (
                <View style={styles.signatureBox}>
                  <Text style={[styles.signatureLabel, { color: colors.primary }]}>
                    {t.signatureCompany}
                  </Text>
                  {invoice.companySignature ? (
                    <Image src={invoice.companySignature} style={styles.signatureImage} />
                  ) : (
                    <View style={[styles.signatureLine, { backgroundColor: colors.primary }]} />
                  )}
                  <Text style={styles.signatureText}>{company?.name || ''}</Text>
                </View>
              )}
              
              {showClientSignature && (
                <View style={styles.signatureBox}>
                  <Text style={[styles.signatureLabel, { color: colors.primary }]}>
                    {t.signatureClient}
                  </Text>
                  {invoice.clientSignature ? (
                    <Image src={invoice.clientSignature} style={styles.signatureImage} />
                  ) : (
                    <View style={[styles.signatureLine, { backgroundColor: colors.primary }]} />
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
        <View style={[styles.footer, { backgroundColor: colors.primaryBg }]}>
          <Text style={[styles.footerMessage, { color: colors.primary }]}>{t.thanks}</Text>
          
          <View style={styles.footerContacts}>
            {company?.phone && (
              <View style={styles.footerContact}>
                <PhoneIcon color={colors.primary} />
                <Text style={styles.footerContactText}>{company.phone}</Text>
              </View>
            )}
            
            {company?.email && (
              <View style={styles.footerContact}>
                <EmailIcon color={colors.primary} />
                <Text style={styles.footerContactText}>{company.email}</Text>
              </View>
            )}
            
            {(company?.address || company?.city) && (
              <View style={styles.footerContact}>
                <LocationIcon color={colors.primary} />
                <Text style={styles.footerContactText}>
                  {[company?.address, company?.city].filter(Boolean).join(', ')}
                </Text>
              </View>
            )}
          </View>

          {company?.taxId && (
            <Text style={styles.footerLegal}>{t.taxId}: {company.taxId}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default TemplateCorporatePDF;