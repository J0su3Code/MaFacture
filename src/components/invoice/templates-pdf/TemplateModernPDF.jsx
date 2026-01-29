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
    invoiceNumber: 'N°',
    issueDate: "Date d'émission",
    dueDate: "Date d'échéance",
    totalAmount: 'Montant Total',
    billTo: 'Facturé à',
    details: 'Détails',
    description: 'Description',
    qty: 'Qté',
    unitPrice: 'Prix unitaire',
    total: 'Total',
    subtotal: 'Sous-total',
    tax: 'TVA',
    discount: 'Remise',
    grandTotal: 'Total TTC',
    attachments: 'Annexes',
    notes: 'Notes',
    thanks: 'Merci pour votre confiance',
    phone: 'Tél',
    taxId: 'N° contribuable',
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
    invoiceNumber: '#',
    issueDate: 'Issue Date',
    dueDate: 'Due Date',
    totalAmount: 'Total Amount',
    billTo: 'Bill To',
    details: 'Details',
    description: 'Description',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    grandTotal: 'Total Due',
    attachments: 'Attachments',
    notes: 'Notes',
    thanks: 'Thank you for your business',
    phone: 'Phone',
    taxId: 'Tax ID',
    signatureCompany: 'Company Signature',
    signatureClient: 'Client Signature',
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
  pending: { color: '#f59e0b', bg: '#fef3c7' },
  paid: { color: '#10b981', bg: '#d1fae5' },
  overdue: { color: '#ef4444', bg: '#fee2e2' },
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

// Couleurs de base
const colors = {
  textDark: '#111827',
  textBase: '#374151',
  textMuted: '#6b7280',
  bgWhite: '#ffffff',
  bgLight: '#f9fafb',
  borderLight: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  notesBg: '#fefce8',
  notesBorder: '#f59e0b',
  notesText: '#713f12',
  notesHeader: '#a16207',
};

// Créer les styles dynamiques
const createStyles = (primaryColor) => StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: colors.bgWhite,
    color: colors.textBase,
    display: 'flex',
    flexDirection: 'column',
  },

  // ===== ACCENT BANDS =====
  accentTop: {
    height: 22,
    backgroundColor: primaryColor,
  },
  accentBottom: {
    height: 14,
    backgroundColor: primaryColor,
  },

  // ===== MAIN CONTENT =====
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 34,
    paddingTop: 22,
    paddingBottom: 17,
  },

  // ===== HEADER =====
  header: {
    marginBottom: 22,
  },
  headerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 17,
  },

  // Company Block
  companyBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  companyLogo: {
    width: 70,
    height: 70,
    objectFit: 'contain',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    padding: 4,
    backgroundColor: colors.bgWhite,
  },
  companyLogoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogoText: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  companyInfo: {
    paddingTop: 3,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  companyDetailText: {
    fontSize: 8,
    color: colors.textMuted,
    lineHeight: 1.4,
  },
  companyContact: {
    marginTop: 3,
  },

  // Invoice Block
  invoiceBlock: {
    backgroundColor: colors.bgLight,
    padding: '12 14',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'flex-end',
    minWidth: 140,
  },
  invoiceType: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    marginBottom: 3,
  },
  invoiceNumber: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    marginBottom: 6,
  },
  invoiceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },

  // ===== META CARDS =====
  headerMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  metaCard: {
    flex: 1,
    padding: '8 12',
    backgroundColor: colors.bgLight,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  metaCardHighlight: {
    flex: 1,
    padding: '8 12',
    borderRadius: 6,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  metaLabelLight: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
  },
  metaValueLight: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  metaValueBig: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // ===== SECTION HEADER =====
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ===== CLIENT SECTION =====
  clientSection: {
    marginBottom: 17,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12 14',
    backgroundColor: colors.bgLight,
    borderRadius: 6,
    borderLeftWidth: 3,
  },
  clientAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientAvatarText: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    marginBottom: 3,
  },
  clientDetailText: {
    fontSize: 8,
    color: colors.textMuted,
    lineHeight: 1.4,
  },
  clientContact: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    
  },
  clientContactText: {
    fontSize: 8,
    color: colors.textBase,
  },

  // ===== ITEMS TABLE =====
  itemsSection: {
    marginBottom: 17,
  },
  tableWrapper: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  colDescription: {
    flex: 1,
  },
  colQuantity: {
    width: 40,
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
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableRowStriped: {
    backgroundColor: colors.bgLight,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCellDescription: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
  },
  tableCellQty: {
    width: 40,
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'right',
  },
  tableCellPrice: {
    width: 80,
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'right',
  },
  tableCellTotal: {
    width: 80,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
    textAlign: 'right',
  },

  // ===== TOTALS =====
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsBox: {
    width: 200,
    backgroundColor: colors.bgLight,
    borderRadius: 6,
    padding: '8 12',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    
  },
  totalsRowLast: {
    borderBottomWidth: 0,
  },
  totalsLabel: {
    fontSize: 8,
    color: colors.textMuted,
  },
  totalsValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
  },
  totalsValueDiscount: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.success,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 2,
  },
  grandTotalLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },

  // ===== IMAGES =====
  imagesSection: {
    marginBottom: 17,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageItem: {
    width: 90,
    height: 90,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    position: 'relative',
  },
  imageContent: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageNumber: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNumberText: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // ===== NOTES =====
  notesSection: {
    marginBottom: 17,
  },
  notesCard: {
    padding: 12,
    backgroundColor: colors.notesBg,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.notesBorder,
  },
  notesHeader: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: colors.notesHeader,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 8,
    color: colors.notesText,
    lineHeight: 1.5,
  },

  // ===== SIGNATURES =====
  signaturesSection: {
    marginBottom: 17,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    
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
    color: colors.textMuted,
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
    minHeight: 17,
  },

  // ===== FOOTER =====
  footer: {
    backgroundColor: colors.bgLight,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerThanks: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  footerDivider: {
    width: '60%',
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 8,
  },
  footerContact: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerContactText: {
    fontSize: 8,
    color: colors.textMuted,
  },
  footerContactDot: {
    fontSize: 8,
    marginHorizontal: 4,
  },
  footerLegal: {
    marginTop: 6,
    fontSize: 7,
    color: colors.textMuted,
  },
});

const TemplateModernPDF = ({
  invoice,
  company,
  themeColor = '#6366f1',
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

  // ============================================
  // DEVISE - Utiliser celle de la facture
  // ============================================
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

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>

        {/* ===== ACCENT TOP ===== */}
        <View style={styles.accentTop} />

        {/* ===== MAIN CONTENT ===== */}
        <View style={styles.content}>

          {/* ===== HEADER ===== */}
          <View style={styles.header}>
            <View style={styles.headerMain}>

              {/* Company Block */}
              <View style={styles.companyBlock}>
                {company?.logo ? (
                  <Image src={company.logo} style={styles.companyLogo} />
                ) : (
                  <View style={[styles.companyLogoPlaceholder, { backgroundColor: themeColor }]}>
                    <Text style={styles.companyLogoText}>
                      {(company?.name || 'E').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{company?.name || 'Votre Entreprise'}</Text>
                  {company?.address && (
                    <Text style={styles.companyDetailText}>{company.address}</Text>
                  )}
                  {company?.city && (
                    <Text style={styles.companyDetailText}>{company.city}</Text>
                  )}
                  {(company?.phone || company?.email) && (
                    <Text style={[styles.companyDetailText, styles.companyContact]}>
                      {company?.phone && `${t.phone}: ${company.phone}`}
                      {company?.phone && company?.email && ' | '}
                      {company?.email}
                    </Text>
                  )}
                </View>
              </View>

              {/* Invoice Block */}
              <View style={styles.invoiceBlock}>
                <Text style={[styles.invoiceType, { color: themeColor }]}>
                  {isQuote ? t.quote : t.invoice}
                </Text>
                <Text style={styles.invoiceNumber}>{invoice.number || '---'}</Text>
// ✅ APRÈS
<View style={[
  styles.invoiceStatus,
  { borderColor: statusStyle.color, borderWidth: 1, backgroundColor: colors.bgWhite }
]}>
                  <View style={[styles.statusDot, { backgroundColor: statusStyle.color }]} />
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>
                    {statusLabel}
                  </Text>
                </View>
              </View>
            </View>

            {/* Meta Cards */}
            <View style={styles.headerMeta}>
              <View style={styles.metaCard}>
                <Text style={styles.metaLabel}>{t.issueDate}</Text>
                <Text style={styles.metaValue}>{formatDate(invoice.date, lang)}</Text>
              </View>

              {invoice.dueDate && (
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>{t.dueDate}</Text>
                  <Text style={styles.metaValue}>{formatDate(invoice.dueDate, lang)}</Text>
                </View>
              )}

              <View style={[styles.metaCardHighlight, { backgroundColor: themeColor }]}>
                <Text style={styles.metaLabelLight}>{t.totalAmount}</Text>
                <Text style={styles.metaValueBig}>{formatAmount(total, currency, lang)}</Text>
              </View>
            </View>
          </View>

          {/* ===== CLIENT SECTION ===== */}
          <View style={styles.clientSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={[styles.sectionTitle, { color: themeColor }]}>{t.billTo}</Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={[styles.clientCard, { borderLeftColor: themeColor }]}>
              <View style={[styles.clientAvatar, { backgroundColor: themeColor }]}>
                <Text style={styles.clientAvatarText}>
                  {(invoice.client?.name || 'C').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.clientDetails}>
                <Text style={styles.clientName}>{invoice.client?.name || 'Client'}</Text>
                {invoice.client?.address && (
                  <Text style={styles.clientDetailText}>{invoice.client.address}</Text>
                )}
                {invoice.client?.city && (
                  <Text style={styles.clientDetailText}>{invoice.client.city}</Text>
                )}
                {(invoice.client?.phone || invoice.client?.email) && (
                  <View style={styles.clientContact}>
                    <Text style={styles.clientContactText}>
                      {invoice.client?.phone && `${t.phone}: ${invoice.client.phone}`}
                      {invoice.client?.phone && invoice.client?.email && ' | '}
                      {invoice.client?.email}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* ===== ITEMS TABLE ===== */}
          <View style={styles.itemsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={[styles.sectionTitle, { color: themeColor }]}>{t.details}</Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.tableWrapper}>
              {/* Table Header */}
              <View style={[styles.tableHeader, { backgroundColor: themeColor }]}>
                <Text style={[styles.tableHeaderCell, styles.colDescription]}>{t.description}</Text>
                <Text style={[styles.tableHeaderCell, styles.colQuantity]}>{t.qty}</Text>
                <Text style={[styles.tableHeaderCell, styles.colPrice]}>{t.unitPrice}</Text>
                <Text style={[styles.tableHeaderCell, styles.colTotal]}>{t.total}</Text>
              </View>

              {/* Table Rows */}
              {items.map((item, index) => {
                const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
                const isStriped = index % 2 === 1;
                const isLast = index === items.length - 1;

                return (
                  <View
                    key={item.id || index}
                    style={[
                      styles.tableRow,
                      isStriped && styles.tableRowStriped,
                      isLast && styles.tableRowLast
                    ]}
                  >
                    <Text style={styles.tableCellDescription}>{item.description || '-'}</Text>
                    <Text style={styles.tableCellQty}>{item.quantity || 0}</Text>
                    <Text style={styles.tableCellPrice}>{formatAmount(item.unitPrice || 0, currency, lang)}</Text>
                    <Text style={styles.tableCellTotal}>{formatAmount(lineTotal, currency, lang)}</Text>
                  </View>
                );
              })}
            </View>

            {/* Totals */}
            <View style={styles.totalsContainer}>
              <View style={styles.totalsBox}>
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
                  <View style={[styles.totalsRow, styles.totalsRowLast]}>
                    <Text style={styles.totalsLabel}>{t.discount}</Text>
                    <Text style={styles.totalsValueDiscount}>- {formatAmount(discount, currency, lang)}</Text>
                  </View>
                )}

                <View style={[styles.grandTotalRow, { borderTopColor: themeColor }]}>
                  <Text style={styles.grandTotalLabel}>{t.grandTotal}</Text>
                  <Text style={[styles.grandTotalValue, { color: themeColor }]}>
                    {formatAmount(total, currency, lang)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ===== IMAGES ===== */}
          {invoice.images && invoice.images.length > 0 && (
            <View style={styles.imagesSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionLine} />
                <Text style={[styles.sectionTitle, { color: themeColor }]}>{t.attachments}</Text>
                <View style={styles.sectionLine} />
              </View>

              <View style={styles.imagesGrid}>
                {invoice.images.map((image, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image src={image.data || image} style={styles.imageContent} />
                    <View style={[styles.imageNumber, { backgroundColor: themeColor }]}>
                      <Text style={styles.imageNumberText}>{index + 1}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ===== NOTES ===== */}
          {invoice.notes && (
            <View style={styles.notesSection}>
              <View style={styles.notesCard}>
                <Text style={styles.notesHeader}>{t.notes}</Text>
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
                    <Text style={[styles.signatureLabel, { color: themeColor }]}>
                      {t.signatureCompany}
                    </Text>
                    {invoice.companySignature ? (
                      <Image src={invoice.companySignature} style={styles.signatureImage} />
                    ) : (
                      <View style={[styles.signatureLine, { backgroundColor: themeColor }]} />
                    )}
                    <Text style={styles.signatureText}>{company?.name || ''}</Text>
                  </View>
                )}

                {showClientSignature && (
                  <View style={styles.signatureBox}>
                    <Text style={[styles.signatureLabel, { color: themeColor }]}>
                      {t.signatureClient}
                    </Text>
                    {invoice.clientSignature ? (
                      <Image src={invoice.clientSignature} style={styles.signatureImage} />
                    ) : (
                      <View style={[styles.signatureLine, { backgroundColor: themeColor }]} />
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
            <Text style={[styles.footerThanks, { color: themeColor }]}>{t.thanks}</Text>
            <View style={styles.footerDivider} />
            <View style={styles.footerContact}>
              {company?.phone && (
                <Text style={styles.footerContactText}>{t.phone}: {company.phone}</Text>
              )}
              {company?.phone && company?.email && (
                <Text style={[styles.footerContactDot, { color: themeColor }]}>•</Text>
              )}
              {company?.email && (
                <Text style={styles.footerContactText}>{company.email}</Text>
              )}
              {company?.email && company?.city && (
                <Text style={[styles.footerContactDot, { color: themeColor }]}>•</Text>
              )}
              {company?.city && (
                <Text style={styles.footerContactText}>{company.city}</Text>
              )}
            </View>
            {company?.taxId && (
              <Text style={styles.footerLegal}>{t.taxId}: {company.taxId}</Text>
            )}
          </View>
        </View>

        {/* ===== ACCENT BOTTOM ===== */}
        <View style={styles.accentBottom} />

      </Page>
    </Document>
  );
};

export default TemplateModernPDF;