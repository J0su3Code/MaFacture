import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Svg, Path } from '@react-pdf/renderer';

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
    invoiceNumber: 'Facture N°',
    date: "Date d'émission",
    dueDate: "Date d'échéance",
    billTo: 'Adressé à',
    from: 'Émetteur',
    description: 'Désignation',
    qty: 'Qté',
    unitPrice: 'Prix unitaire',
    total: 'Montant',
    subtotal: 'Sous-total HT',
    tax: 'TVA',
    discount: 'Remise',
    grandTotal: 'Total TTC',
    paymentInfo: 'Informations bancaires',
    bank: 'Banque',
    notes: 'Conditions & Mentions',
    thanks: 'Nous vous remercions de votre confiance',
    attachments: 'Pièces jointes',
    signatureCompany: 'Signature entreprise',
    signatureClient: 'Signature client',
    status: {
      draft: 'Brouillon',
      pending: 'En attente',
      paid: 'Acquittée',
      overdue: 'Échue',
      cancelled: 'Annulée'
    }
  },
  en: {
    invoice: 'INVOICE',
    quote: 'QUOTE',
    invoiceNumber: 'Invoice No.',
    date: 'Issue Date',
    dueDate: 'Due Date',
    billTo: 'Bill To',
    from: 'From',
    description: 'Description',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    total: 'Amount',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    grandTotal: 'Total Due',
    paymentInfo: 'Bank Details',
    bank: 'Bank',
    notes: 'Terms & Conditions',
    thanks: 'Thank you for your business',
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
  draft: { color: '#6b7280', bg: '#f3f4f6' },
  pending: { color: '#b45309', bg: '#fef3c7' },
  paid: { color: '#047857', bg: '#d1fae5' },
  overdue: { color: '#b91c1c', bg: '#fee2e2' },
  cancelled: { color: '#6b7280', bg: '#f3f4f6' }
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

// Formatage des dates
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
    primaryDark: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 8)),
    primaryLight: hslToHex(hsl.h, Math.max(hsl.s - 20, 10), Math.min(hsl.l + 30, 92)),
    primaryBg: hslToHex(hsl.h, Math.max(hsl.s - 35, 5), 97),
    accent: hslToHex((hsl.h + 30) % 360, Math.max(hsl.s - 10, 20), Math.min(hsl.l + 10, 45)),
  };
};

// Créer les styles - ✅ CORRIGÉ : utilise "colors" partout
const createStyles = (colors) => {
  return StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 9,
      backgroundColor: '#ffffff',
      color: '#404040',
      padding: 40,
      position: 'relative',
    },

    // ===== BORDURE DÉCORATIVE =====
    borderFrame: {
      position: 'absolute',
      top: 22,
      left: 22,
      right: 22,
      bottom: 22,
      borderWidth: 1,
      borderColor: colors.primaryLight,
    },
    cornerTL: {
      position: 'absolute',
      top: -1,
      left: -1,
      width: 20,
      height: 20,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderTopColor: colors.primary,
      borderLeftColor: colors.primary,
    },
    cornerTR: {
      position: 'absolute',
      top: -1,
      right: -1,
      width: 20,
      height: 20,
      borderTopWidth: 2,
      borderRightWidth: 2,
      borderTopColor: colors.primary,
      borderRightColor: colors.primary,
    },
    cornerBL: {
      position: 'absolute',
      bottom: -1,
      left: -1,
      width: 20,
      height: 20,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderBottomColor: colors.primary,
      borderLeftColor: colors.primary,
    },
    cornerBR: {
      position: 'absolute',
      bottom: -1,
      right: -1,
      width: 20,
      height: 20,
      borderBottomWidth: 2,
      borderRightWidth: 2,
      borderBottomColor: colors.primary,
      borderRightColor: colors.primary,
    },

    // ===== HEADER =====
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 17,
      paddingHorizontal: 22,
    },
    headerBrand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    logo: {
      height: 50,
      maxWidth: 125,
      objectFit: 'contain',
    },
    logoText: {
      width: 45,
      height: 45,
      backgroundColor: colors.primary,
      borderRadius: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoTextLetter: {
      fontSize: 24,
      fontFamily: 'Times-Bold',
      color: '#ffffff',
    },
    brandInfo: {
      gap: 3,
    },
    brandName: {
      fontSize: 18,
      fontFamily: 'Times-Bold',
      color: colors.primary,
      letterSpacing: 0.3,
    },
    brandTagline: {
      fontSize: 8,
      fontFamily: 'Times-Italic',
      color: '#737373',
      letterSpacing: 0.5,
    },
    headerTitle: {
      alignItems: 'flex-end',
      gap: 6,
    },
    titleLabel: {
      fontSize: 10,
      fontFamily: 'Times-Roman',
      color: '#a3a3a3',
      letterSpacing: 3,
      textTransform: 'uppercase',
    },
    titleNumber: {
      fontSize: 20,
      fontFamily: 'Times-Bold',
      color: colors.primary,
      letterSpacing: 0.3,
    },
    titleStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 10,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusText: {
      fontSize: 7,
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // ===== DIVIDER =====
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 12,
      marginHorizontal: 22,
      gap: 12,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.primaryLight,
    },
    dividerDiamond: {
      width: 8,
      height: 8,
      backgroundColor: colors.primary,
      transform: 'rotate(45deg)',
    },

    // ===== INFO SECTION =====
    infoSection: {
      paddingHorizontal: 22,
      marginBottom: 22,
    },
    infoDates: {
      flexDirection: 'row',
      gap: 28,
      marginBottom: 17,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e5e5',
    },
    infoItem: {
      gap: 3,
    },
    infoLabel: {
      fontSize: 7,
      fontFamily: 'Helvetica-Bold',
      color: '#a3a3a3',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    infoValue: {
      fontSize: 10,
      fontFamily: 'Helvetica-Bold',
      color: '#262626',
    },

    // ===== PARTIES =====
    partiesContainer: {
      flexDirection: 'row',
      gap: 17,
      alignItems: 'flex-start',
    },
    partyBox: {
      flex: 1,
      gap: 6,
    },
    partyLabel: {
      fontSize: 8,
      fontFamily: 'Times-Bold',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
      alignSelf: 'flex-start',
    },
    partyContent: {
      gap: 2,
    },
    partyName: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      color: '#262626',
      marginBottom: 3,
    },
    partyNameHighlight: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      marginBottom: 3,
    },
    partyDetailText: {
      fontSize: 8.5,
      color: '#525252',
      lineHeight: 1.5,
    },
    taxNumber: {
      fontSize: 7.5,
      fontFamily: 'Courier',
      color: '#a3a3a3',
      marginTop: 3,
    },
    partySeparator: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 28,
    },

    // ===== ITEMS TABLE =====
    itemsSection: {
      paddingHorizontal: 22,
      marginBottom: 17,
    },
    table: {
      width: '100%',
    },
    tableHeader: {
      flexDirection: 'row',
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
      paddingBottom: 9,
    },
    tableHeaderCell: {
      fontSize: 8,
      fontFamily: 'Times-Bold',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    colDesc: {
      flex: 1,
    },
    colQty: {
      width: 42,
      textAlign: 'right',
    },
    colPrice: {
      width: 75,
      textAlign: 'right',
    },
    colTotal: {
      width: 75,
      textAlign: 'right',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f5f5f5',
      alignItems: 'center',
    },
    tableRowLast: {
      borderBottomWidth: 0,
    },
    itemName: {
      fontSize: 9,
      fontFamily: 'Helvetica',
      color: '#262626',
    },
    itemDetails: {
      fontSize: 7.5,
      fontFamily: 'Times-Italic',
      color: '#a3a3a3',
      marginTop: 2,
    },
    cellQty: {
      fontSize: 9,
      color: '#737373',
      textAlign: 'right',
    },
    cellPrice: {
      fontSize: 9,
      color: '#525252',
      textAlign: 'right',
    },
    cellTotal: {
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      color: '#262626',
      textAlign: 'right',
    },

    // ===== TOTALS =====
    totalsSection: {
      paddingHorizontal: 22,
      marginBottom: 22,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    totalsContent: {
      width: 200,
    },
    totalsBreakdown: {
      gap: 6,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#d4d4d4',
      marginBottom: 12,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    totalLabel: {
      fontSize: 8.5,
      color: '#737373',
    },
    totalValue: {
      fontSize: 8.5,
      fontFamily: 'Helvetica-Bold',
      color: '#404040',
    },
    totalValueDiscount: {
      fontSize: 8.5,
      fontFamily: 'Helvetica-Bold',
      color: '#059669',
    },
    grandTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      borderRadius: 2,
    },
    grandLabel: {
      fontSize: 8,
      fontFamily: 'Times-Bold',
      color: 'rgba(255,255,255,0.8)',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    grandValue: {
      fontSize: 18,
      fontFamily: 'Times-Bold',
      color: '#ffffff',
      letterSpacing: 0.3,
    },

    // ===== FOOTER INFO =====
    footerInfo: {
      flexDirection: 'row',
      paddingHorizontal: 22,
      gap: 22,
      marginBottom: 17,
    },
    footerBlock: {
      flex: 1,
      gap: 6,
    },
    blockTitle: {
      fontSize: 8,
      fontFamily: 'Times-Bold',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      paddingBottom: 6,
      borderBottomWidth: 1,
      marginBottom: 6,
    },
    blockContent: {
      gap: 4,
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 3,
    },
    paymentLabel: {
      fontSize: 8,
      color: '#a3a3a3',
    },
    paymentValue: {
      fontSize: 8,
      fontFamily: 'Helvetica-Bold',
      color: '#404040',
    },
    paymentValueMono: {
      fontSize: 7.5,
      fontFamily: 'Courier',
      color: '#404040',
      letterSpacing: 0.3,
    },
    notesText: {
      fontSize: 8,
      color: '#525252',
      lineHeight: 1.6,
    },

    // ===== ATTACHMENTS =====
    attachmentsSection: {
      paddingHorizontal: 22,
      marginBottom: 17,
    },
    attachmentsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 9,
    },
    attachmentItem: {
      width: 68,
      height: 68,
      borderWidth: 1,
      borderColor: '#e5e5e5',
      borderRadius: 2,
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
      bottom: 3,
      right: 3,
      width: 12,
      height: 12,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    attachmentBadgeText: {
      fontSize: 6,
      fontFamily: 'Helvetica-Bold',
      color: '#ffffff',
    },

    // ===== SIGNATURES =====
    signaturesSection: {
      paddingHorizontal: 22,
      paddingTop: 17,
      borderTopWidth: 2,
      borderTopColor: colors.primary,
    },
    signaturesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 50,
    },
    signatureBox: {
      flex: 1,
      alignItems: 'center',
    },
    signatureLabel: {
      fontSize: 7,
      fontFamily: 'Times-Bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 35,
    },
    signatureLine: {
      width: '100%',
      height: 1,
      marginBottom: 6,
    },
    signatureText: {
      fontSize: 7,
      fontFamily: 'Times-Italic',
      color: '#737373',
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
      minHeight: 22,
    },

    // ===== FOOTER =====
    footer: {
      textAlign: 'center',
      paddingHorizontal: 22,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#e5e5e5',
      marginTop: 'auto',
    },
    footerThanks: {
      fontSize: 13,
      fontFamily: 'Times-Italic',
      marginBottom: 9,
    },
    footerContacts: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
      marginBottom: 6,
    },
    footerContactText: {
      fontSize: 8,
      color: '#737373',
    },
    footerSeparator: {
      fontSize: 8,
      color: '#d4d4d4',
    },
    footerWebsite: {
      fontSize: 8,
      fontFamily: 'Helvetica-Bold',
    },
  });
};

// Composant Icône Flèche double
const DoubleArrowIcon = ({ color }) => (
  <Svg width={17} height={17} viewBox="0 0 24 24">
    <Path
      d="M13 5l7 7-7 7M5 5l7 7-7 7"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
    />
  </Svg>
);

const TemplateElegancePDF = ({ 
  invoice, 
  company, 
  themeColor = '#1a1a2e', 
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

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>
        
        {/* ===== BORDURE DÉCORATIVE ===== */}
        <View style={styles.borderFrame} fixed>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View style={styles.headerBrand}>
            {company?.logo ? (
              <Image src={company.logo} style={styles.logo} />
            ) : (
              <View style={styles.logoText}>
                <Text style={styles.logoTextLetter}>
                  {(company?.name || 'E').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.brandInfo}>
              <Text style={styles.brandName}>{company?.name || 'Votre Entreprise'}</Text>
              {company?.tagline && (
                <Text style={styles.brandTagline}>{company.tagline}</Text>
              )}
            </View>
          </View>

          <View style={styles.headerTitle}>
            <Text style={styles.titleLabel}>{isQuote ? t.quote : t.invoice}</Text>
            <Text style={styles.titleNumber}>{invoice.number || '---'}</Text>
            <View style={[styles.titleStatus, { backgroundColor: statusStyle.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: statusStyle.color }]} />
              <Text style={[styles.statusText, { color: statusStyle.color }]}>{statusLabel}</Text>
            </View>
          </View>
        </View>

        {/* ===== DIVIDER ===== */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDiamond} />
          <View style={styles.dividerLine} />
        </View>

        {/* ===== INFO SECTION ===== */}
        <View style={styles.infoSection}>
          <View style={styles.infoDates}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>{t.date}</Text>
              <Text style={styles.infoValue}>{formatDate(invoice.date, lang)}</Text>
            </View>
            {invoice.dueDate && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t.dueDate}</Text>
                <Text style={styles.infoValue}>{formatDate(invoice.dueDate, lang)}</Text>
              </View>
            )}
          </View>

          <View style={styles.partiesContainer}>
            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>{t.from}</Text>
              <View style={styles.partyContent}>
                <Text style={styles.partyName}>{company?.name || 'Votre Entreprise'}</Text>
                {company?.address && <Text style={styles.partyDetailText}>{company.address}</Text>}
                {company?.city && <Text style={styles.partyDetailText}>{company.city}</Text>}
                {company?.phone && <Text style={styles.partyDetailText}>{company.phone}</Text>}
                {company?.email && <Text style={styles.partyDetailText}>{company.email}</Text>}
                {company?.taxId && <Text style={styles.taxNumber}>{company.taxId}</Text>}
              </View>
            </View>

            <View style={styles.partySeparator}>
              <DoubleArrowIcon color="#d4d4d4" />
            </View>

            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>{t.billTo}</Text>
              <View style={styles.partyContent}>
                <Text style={[styles.partyNameHighlight, { color: colors.primary }]}>
                  {invoice.client?.name || 'Client'}
                </Text>
                {invoice.client?.company && <Text style={styles.partyDetailText}>{invoice.client.company}</Text>}
                {invoice.client?.address && <Text style={styles.partyDetailText}>{invoice.client.address}</Text>}
                {invoice.client?.city && <Text style={styles.partyDetailText}>{invoice.client.city}</Text>}
                {invoice.client?.email && <Text style={styles.partyDetailText}>{invoice.client.email}</Text>}
                {invoice.client?.phone && <Text style={styles.partyDetailText}>{invoice.client.phone}</Text>}
              </View>
            </View>
          </View>
        </View>

        {/* ===== ITEMS TABLE ===== */}
        <View style={styles.itemsSection}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>{t.description}</Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>{t.qty}</Text>
              <Text style={[styles.tableHeaderCell, styles.colPrice]}>{t.unitPrice}</Text>
              <Text style={[styles.tableHeaderCell, styles.colTotal]}>{t.total}</Text>
            </View>
            
            {items.map((item, index) => {
              const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
              const isLast = index === items.length - 1;
              
              return (
                <View 
                  key={item.id || index} 
                  style={[styles.tableRow, isLast && styles.tableRowLast]}
                >
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

        {/* ===== TOTALS ===== */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsContent}>
            <View style={styles.totalsBreakdown}>
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
                <View style={styles.totalRow}>
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

        {/* ===== FOOTER INFO ===== */}
        {((company?.iban || company?.bankName) || invoice.notes) && (
          <View style={styles.footerInfo}>
            {(company?.iban || company?.bankName) && (
              <View style={styles.footerBlock}>
                <Text style={[styles.blockTitle, { color: colors.primary, borderBottomColor: colors.primary }]}>
                  {t.paymentInfo}
                </Text>
                <View style={styles.blockContent}>
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
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>BIC</Text>
                      <Text style={styles.paymentValueMono}>{company.bic}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {invoice.notes && (
              <View style={styles.footerBlock}>
                <Text style={[styles.blockTitle, { color: colors.primary, borderBottomColor: colors.primary }]}>
                  {t.notes}
                </Text>
                <View style={styles.blockContent}>
                  <Text style={styles.notesText}>{invoice.notes}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ===== ATTACHMENTS ===== */}
        {invoice.images && invoice.images.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={[styles.blockTitle, { color: colors.primary, borderBottomColor: colors.primary }]}>
              {t.attachments}
            </Text>
            <View style={styles.attachmentsGrid}>
              {invoice.images.map((image, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <Image src={image.data || image} style={styles.attachmentImage} />
                  <View style={[styles.attachmentBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.attachmentBadgeText}>{index + 1}</Text>
                  </View>
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
        <View style={styles.footer}>
          <Text style={[styles.footerThanks, { color: colors.primary }]}>{t.thanks}</Text>
          
          <View style={styles.footerContacts}>
            {company?.phone && (
              <Text style={styles.footerContactText}>{company.phone}</Text>
            )}
            {company?.phone && company?.email && (
              <Text style={styles.footerSeparator}>•</Text>
            )}
            {company?.email && (
              <Text style={styles.footerContactText}>{company.email}</Text>
            )}
          </View>
          
          {company?.website && (
            <Text style={[styles.footerWebsite, { color: colors.primary }]}>{company.website}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default TemplateElegancePDF;