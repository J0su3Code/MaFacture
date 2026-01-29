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
    invoice: 'FACTURE',
    quote: 'DEVIS',
    number: 'Facture N°',
    date: 'Date',
    dueDate: 'Échéance',
    from: 'Émetteur',
    to: 'Destinataire',
    description: 'Désignation',
    qty: 'Quantité',
    unitPrice: 'Prix Unitaire',
    amount: 'Montant',
    subtotal: 'Sous-total',
    tax: 'TVA',
    discount: 'Remise',
    total: 'Net à Payer',
    notes: 'Conditions Générales',
    attachments: 'Pièces Jointes',
    signatureCompany: 'Signature & Cachet',
    signatureClient: 'Signature Client',
    thanks: 'Nous vous remercions de votre confiance',
    taxId: 'N° Contribuable',
    phone: 'Tél',
    status: {
      draft: 'BROUILLON',
      pending: 'EN ATTENTE',
      paid: 'PAYÉE',
      overdue: 'IMPAYÉE',
      cancelled: 'ANNULÉE'
    }
  },
  en: {
    invoice: 'INVOICE',
    quote: 'QUOTE',
    number: 'Invoice No.',
    date: 'Date',
    dueDate: 'Due Date',
    from: 'From',
    to: 'Bill To',
    description: 'Description',
    qty: 'Quantity',
    unitPrice: 'Unit Price',
    amount: 'Amount',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    total: 'Total Due',
    notes: 'Terms & Conditions',
    attachments: 'Attachments',
    signatureCompany: 'Authorized Signature',
    signatureClient: 'Client Signature',
    thanks: 'Thank you for your business',
    taxId: 'Tax ID',
    phone: 'Phone',
    status: {
      draft: 'DRAFT',
      pending: 'PENDING',
      paid: 'PAID',
      overdue: 'OVERDUE',
      cancelled: 'CANCELLED'
    }
  }
};

// Configuration des statuts
const statusConfig = {
  draft: { color: '#737373' },
  pending: { color: '#b8860b' },
  paid: { color: '#166534' },
  overdue: { color: '#991b1b' },
  cancelled: { color: '#737373' }
};

// ============================================
// FONCTION DE FORMATAGE CORRIGÉE
// ============================================
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

// ============================================
// FONCTION DE DATE CORRIGÉE
// ============================================
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

// Couleurs
const colors = {
  cream: '#fdfcf9',
  white: '#ffffff',
  black: '#000000',
  gold: '#b8860b',
  gray100: '#f7f7f7',
  gray200: '#e5e5e5',
  gray300: '#d4d4d4',
  gray400: '#a3a3a3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  success: '#166534',
  error: '#991b1b',
};

// Créer les styles
const createStyles = (primaryColor) => StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 9.5,
    backgroundColor: colors.cream,
    color: colors.gray800,
    padding: 22,
  },

  // ===== FRAME =====
  frame: {
    flex: 1,
    borderWidth: 2,
    borderColor: primaryColor,
    padding: 22,
    position: 'relative',
  },
  frameInner: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderWidth: 1,
    borderColor: primaryColor,
  },

  // ===== HEADER =====
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  headerCompany: {
    alignItems: 'center',
    marginBottom: 14,
  },
  companyLogo: {
    maxWidth: 110,
    maxHeight: 55,
    objectFit: 'contain',
    marginBottom: 8,
  },
  companyMonogram: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderColor: primaryColor,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyMonogramText: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    color: primaryColor,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    color: primaryColor,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  companyAddress: {
    fontSize: 8,
    color: colors.gray600,
    textAlign: 'center',
  },
  companyContact: {
    fontSize: 8,
    color: colors.gray500,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 2,
  },

  // Title
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 12,
  },
  titleOrnament: {
    fontSize: 10,
    color: primaryColor,
    opacity: 0.6,
  },
  invoiceTitle: {
    fontSize: 20,
    fontFamily: 'Times-Roman',
    letterSpacing: 8,
    color: primaryColor,
    textTransform: 'uppercase',
  },

  // Meta
  headerMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  invoiceNumber: {
    fontSize: 13,
    fontFamily: 'Times-Bold',
    color: primaryColor,
    fontFamily: 'Courier-Bold',
    letterSpacing: 1,
  },
  invoiceStatus: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    
  },

  // ===== DIVIDER =====
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerDiamond: {
    fontSize: 8,
    color: primaryColor,
  },

  // ===== PARTIES =====
  parties: {
    flexDirection: 'row',
    gap: 17,
    marginBottom: 17,
  },
  partyBlock: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 12,
  },
  partyBlockCenter: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    
  },
  partyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  partyIcon: {
    fontSize: 6,
    color: primaryColor,
  },
  partyLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: primaryColor,
  },
  partyContent: {
    gap: 1,
  },
  partyName: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: colors.gray900,
    marginBottom: 3,
  },
  partyText: {
    fontSize: 8.5,
    color: colors.gray700,
    lineHeight: 1.5,
  },
  partyTax: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
   
    fontSize: 7,
    fontFamily: 'Courier',
    color: colors.gray500,
  },

  // Info Table
  infoTable: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoLabel: {
    fontSize: 8.5,
    color: colors.gray500,
    textAlign: 'right',
    width: 50,
  },
  infoValue: {
    fontSize: 8.5,
    fontFamily: 'Times-Bold',
    color: colors.gray800,
  },

  // ===== TABLE =====
  table: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: primaryColor,
  },
  tableHeaderCell: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colNum: {
    width: 28,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  colDesc: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  colQty: {
    width: 55,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  colPrice: {
    width: 80,
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  colAmount: {
    width: 80,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tableRowAlt: {
    backgroundColor: colors.gray100,
  },
  tableRowEmpty: {
    minHeight: 22,
  },
  tableCell: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 9,
  },
  tableCellNum: {
    width: 28,
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    color: primaryColor,
  },
  tableCellDesc: {
    flex: 1,
    fontFamily: 'Times-Roman',
  },
  tableCellQty: {
    width: 55,
    textAlign: 'center',
    color: colors.gray600,
  },
  tableCellPrice: {
    width: 80,
    textAlign: 'right',
    fontFamily: 'Courier',
    fontSize: 8.5,
    color: colors.gray600,
  },
  tableCellAmount: {
    width: 80,
    textAlign: 'right',
    fontFamily: 'Courier-Bold',
    fontSize: 8.5,
  },

  // ===== SUMMARY =====
  summary: {
    flexDirection: 'row',
    gap: 28,
    marginBottom: 14,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryRight: {
    width: 200,
  },
  summaryNotes: {
    padding: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderLeftWidth: 3,
    borderLeftColor: primaryColor,
  },
  summaryNotesTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: primaryColor,
    marginBottom: 6,
  },
  summaryNotesText: {
    fontSize: 8,
    color: colors.gray600,
    lineHeight: 1.6,
  },

  // Totals
  totalsTable: {
    gap: 0,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  totalsLabel: {
    fontSize: 9,
    color: colors.gray600,
  },
  totalsValue: {
    fontSize: 9,
    fontFamily: 'Courier-Bold',
    color: colors.gray800,
  },
  totalsValueDiscount: {
    fontSize: 9,
    fontFamily: 'Courier-Bold',
    color: colors.success,
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: primaryColor,
  },
  totalLabelFinal: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    color: colors.white,
  },
  totalValueFinal: {
    fontSize: 12,
    fontFamily: 'Courier-Bold',
    color: colors.white,
  },

  // ===== ATTACHMENTS =====
  attachments: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray300,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.gray600,
  },
  attachmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attachmentFrame: {
    width: 79,
    height: 79,
    borderWidth: 2,
    borderColor: colors.gray300,
    padding: 3,
    backgroundColor: colors.white,
    position: 'relative',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  attachmentNum: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 14,
    height: 14,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentNumText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
  },

  // ===== SIGNATURES =====
  signaturesSection: {
    marginBottom: 14,
    paddingTop: 12,
  },
  signaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 28,
  },
  signatureBox: {
    width: 170,
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.gray500,
    marginBottom: 28,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: colors.gray400,
    marginBottom: 6,
  },
  signatureText: {
    fontSize: 7,
    color: colors.gray500,
  },
  signatureImage: {
    width: 100,
    height: 40,
    objectFit: 'contain',
    marginBottom: 6,
  },

  // ===== FOOTER =====
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  footerOrnament: {
    fontSize: 8,
    color: primaryColor,
    letterSpacing: 8,
    marginBottom: 6,
  },
  footerThanks: {
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.gray700,
    marginBottom: 6,
  },
  footerLegal: {
    fontSize: 7,
    fontFamily: 'Courier',
    color: colors.gray500,
    textAlign: 'center',
  },

  // ===== SPACER =====
  spacer: {
    flex: 1,
    minHeight: 14,
  },
});

const TemplateClassicPDF = ({
  invoice,
  company,
  themeColor = '#1a1a2e',
  paperFormat = 'A4',
  lang = 'fr'
}) => {
  const styles = createStyles(themeColor);
  const t = translations[lang] || translations.fr;
  const pageSize = paperFormats[paperFormat] || paperFormats['A4'];

  const isQuote = invoice.type === 'quote';
  const status = invoice.status || 'pending';
  const statusStyle = statusConfig[status] || statusConfig.pending;
  const statusLabel = t.status[status] || t.status.pending;

  // Devise
  const currency = invoice.currency || 'FCFA';

  // Calculs
  const items = invoice.items || [];
  const subtotal = invoice.subtotal || items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
  }, 0);

  const taxRate = parseFloat(invoice.taxRate) || 0;
  const taxAmount = invoice.tax || (subtotal * (taxRate / 100));
  const discount = parseFloat(invoice.discount) || 0;
  const total = invoice.total || (subtotal + taxAmount - discount);

  // Signatures
  const showCompanySignature = invoice.signatureSettings?.showCompanySignature !== false;
  const showClientSignature = invoice.signatureSettings?.showClientSignature || false;

  // Créer des lignes vides pour remplir le tableau
  const emptyRowsCount = Math.max(0, 5 - items.length);
  const emptyRows = [...Array(emptyRowsCount)];

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>

        {/* ===== FRAME ===== */}
        <View style={styles.frame}>
          {/* Inner border */}
          <View style={styles.frameInner} />

          {/* ===== HEADER ===== */}
          <View style={styles.header}>
            {/* Company */}
            <View style={styles.headerCompany}>
              {company?.logo ? (
                <Image src={company.logo} style={styles.companyLogo} />
              ) : (
                <View style={styles.companyMonogram}>
                  <Text style={styles.companyMonogramText}>
                    {(company?.name || 'E').substring(0, 2).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.companyName}>{company?.name || 'Votre Entreprise'}</Text>
              {(company?.address || company?.city) && (
                <Text style={styles.companyAddress}>
                  {[company?.address, company?.city].filter(Boolean).join(' — ')}
                </Text>
              )}
              {(company?.phone || company?.email) && (
                <Text style={styles.companyContact}>
                  {[company?.phone && `${t.phone}: ${company.phone}`, company?.email].filter(Boolean).join(' • ')}
                </Text>
              )}
            </View>

            {/* Title */}
            <View style={styles.headerTitle}>
              <Text style={styles.titleOrnament}>✦</Text>
              <Text style={styles.invoiceTitle}>{isQuote ? t.quote : t.invoice}</Text>
              <Text style={styles.titleOrnament}>✦</Text>
            </View>

            {/* Meta */}
            <View style={styles.headerMeta}>
              <Text style={styles.invoiceNumber}>{invoice.number || '0001'}</Text>
<View style={[
  styles.invoiceStatus,
  { borderColor: statusStyle.color, borderWidth: 1 }
]}>
  <Text style={{ color: statusStyle.color }}>{statusLabel}</Text>
</View>
            </View>
          </View>

          {/* ===== DIVIDER ===== */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: themeColor, opacity: 0.3 }]} />
            <Text style={styles.dividerDiamond}>◆</Text>
            <View style={[styles.dividerLine, { backgroundColor: themeColor, opacity: 0.3 }]} />
          </View>

          {/* ===== PARTIES ===== */}
          <View style={styles.parties}>
            {/* From */}
            <View style={styles.partyBlock}>
              <View style={styles.partyHeader}>
                <Text style={styles.partyIcon}>◉</Text>
                <Text style={styles.partyLabel}>{t.from}</Text>
              </View>
              <View style={styles.partyContent}>
                <Text style={styles.partyName}>{company?.name || 'Votre Entreprise'}</Text>
                {company?.address && <Text style={styles.partyText}>{company.address}</Text>}
                {company?.city && <Text style={styles.partyText}>{company.city}</Text>}
                {company?.taxId && (
                  <Text style={styles.partyTax}>N° {company.taxId}</Text>
                )}
              </View>
            </View>

            {/* Center - Dates */}
            <View style={styles.partyBlockCenter}>
              <View style={styles.infoTable}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t.date}</Text>
                  <Text style={styles.infoValue}>{formatDate(invoice.date, lang)}</Text>
                </View>
                {invoice.dueDate && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t.dueDate}</Text>
                    <Text style={styles.infoValue}>{formatDate(invoice.dueDate, lang)}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* To */}
            <View style={styles.partyBlock}>
              <View style={styles.partyHeader}>
                <Text style={styles.partyIcon}>◉</Text>
                <Text style={styles.partyLabel}>{t.to}</Text>
              </View>
              <View style={styles.partyContent}>
                <Text style={styles.partyName}>{invoice.client?.name || 'Client'}</Text>
                {invoice.client?.address && <Text style={styles.partyText}>{invoice.client.address}</Text>}
                {invoice.client?.city && <Text style={styles.partyText}>{invoice.client.city}</Text>}
                {invoice.client?.phone && <Text style={styles.partyText}>{t.phone}: {invoice.client.phone}</Text>}
                {invoice.client?.email && <Text style={styles.partyText}>{invoice.client.email}</Text>}
              </View>
            </View>
          </View>

          {/* ===== TABLE ===== */}
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colNum]}>N°</Text>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>{t.description}</Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>{t.qty}</Text>
              <Text style={[styles.tableHeaderCell, styles.colPrice]}>{t.unitPrice}</Text>
              <Text style={[styles.tableHeaderCell, styles.colAmount]}>{t.amount}</Text>
            </View>

            {/* Rows */}
            {items.map((item, index) => {
              const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
              const isAlt = index % 2 === 1;

              return (
                <View key={item.id || index} style={[styles.tableRow, isAlt && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.tableCellNum]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, styles.tableCellDesc]}>{item.description || '—'}</Text>
                  <Text style={[styles.tableCell, styles.tableCellQty]}>{item.quantity || 0}</Text>
                  <Text style={[styles.tableCell, styles.tableCellPrice]}>
                    {formatAmount(item.unitPrice || 0, currency, lang)}
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellAmount]}>
                    {formatAmount(lineTotal, currency, lang)}
                  </Text>
                </View>
              );
            })}

            {/* Empty rows */}
            {emptyRows.map((_, i) => (
              <View key={`empty-${i}`} style={[styles.tableRow, styles.tableRowEmpty, (items.length + i) % 2 === 1 && styles.tableRowAlt]}>
                <Text style={[styles.tableCell, styles.tableCellNum]}></Text>
                <Text style={[styles.tableCell, styles.tableCellDesc]}></Text>
                <Text style={[styles.tableCell, styles.tableCellQty]}></Text>
                <Text style={[styles.tableCell, styles.tableCellPrice]}></Text>
                <Text style={[styles.tableCell, styles.tableCellAmount]}></Text>
              </View>
            ))}
          </View>

          {/* ===== SUMMARY ===== */}
          <View style={styles.summary}>
            {/* Notes */}
            <View style={styles.summaryLeft}>
              {invoice.notes && (
                <View style={styles.summaryNotes}>
                  <Text style={styles.summaryNotesTitle}>{t.notes}</Text>
                  <Text style={styles.summaryNotesText}>{invoice.notes}</Text>
                </View>
              )}
            </View>

            {/* Totals */}
            <View style={styles.summaryRight}>
              <View style={styles.totalsTable}>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>{t.subtotal}</Text>
                  <Text style={styles.totalsValue}>{formatAmount(subtotal, currency, lang)}</Text>
                </View>

                {taxRate > 0 && (
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>{t.tax} ({taxRate}%)</Text>
                    <Text style={styles.totalsValue}>{formatAmount(taxAmount, currency, lang)}</Text>
                  </View>
                )}

                {discount > 0 && (
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>{t.discount}</Text>
                    <Text style={styles.totalsValueDiscount}>-{formatAmount(discount, currency, lang)}</Text>
                  </View>
                )}

                <View style={styles.totalRowFinal}>
                  <Text style={styles.totalLabelFinal}>{t.total}</Text>
                  <Text style={styles.totalValueFinal}>{formatAmount(total, currency, lang)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ===== ATTACHMENTS ===== */}
          {invoice.images && invoice.images.length > 0 && (
            <View style={styles.attachments}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionLine} />
                <Text style={styles.sectionTitle}>{t.attachments}</Text>
                <View style={styles.sectionLine} />
              </View>
              <View style={styles.attachmentsGrid}>
                {invoice.images.map((image, index) => (
                  <View key={index} style={styles.attachmentFrame}>
                    <Image src={image.data || image} style={styles.attachmentImage} />
                    <View style={styles.attachmentNum}>
                      <Text style={styles.attachmentNumText}>{index + 1}</Text>
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
            <Text style={styles.footerOrnament}>✦ ✦ ✦</Text>
            <Text style={styles.footerThanks}>{t.thanks}</Text>
            {(company?.taxId || company?.iban) && (
              <Text style={styles.footerLegal}>
                {[
                  company?.taxId && `${t.taxId}: ${company.taxId}`,
                  company?.iban && `IBAN: ${company.iban}`
                ].filter(Boolean).join(' | ')}
              </Text>
            )}
          </View>

        </View>
      </Page>
    </Document>
  );
};

export default TemplateClassicPDF;