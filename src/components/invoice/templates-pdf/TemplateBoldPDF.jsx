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
    number: 'N°',
    date: 'Date',
    dueDate: 'Échéance',
    from: 'De',
    to: 'Facturer à',
    description: 'Description',
    qty: 'Qté',
    price: 'Prix',
    amount: 'Montant',
    subtotal: 'Sous-total',
    tax: 'TVA',
    discount: 'Remise',
    total: 'TOTAL',
    notes: 'Notes',
    attachments: 'Pièces jointes',
    thanks: 'Merci !',
    contact: 'Contact',
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
    number: 'N°',
    date: 'Date',
    dueDate: 'Due',
    from: 'From',
    to: 'Bill To',
    description: 'Description',
    qty: 'Qty',
    price: 'Price',
    amount: 'Amount',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    total: 'TOTAL',
    notes: 'Notes',
    attachments: 'Attachments',
    thanks: 'Thank you!',
    contact: 'Contact',
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
  draft: { color: '#ffffff', bg: 'rgba(255,255,255,0.15)' },
  pending: { color: '#ffffff', bg: 'rgba(255,255,255,0.15)' },
  paid: { color: '#ffffff', bg: '#22c55e' },
  overdue: { color: '#ffffff', bg: '#ef4444' },
  cancelled: { color: '#ffffff', bg: 'rgba(255,255,255,0.15)' }
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

// Créer les styles
const createStyles = (primaryColor) => StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
  },

  // ===== SIDEBAR =====
  sidebar: {
    width: 156, // ~55mm
    backgroundColor: primaryColor,
    padding: '22 14',
    flexDirection: 'column',
    gap: 17,
  },

  // Logo
  sidebarLogo: {
    alignItems: 'center',
    marginBottom: 6,
  },
  logoImage: {
    maxWidth: 100,
    maxHeight: 70,
    objectFit: 'contain',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 6,
    borderRadius: 6,
  },
  logoLetter: {
    width: 50,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetterText: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: primaryColor,
  },

  // Invoice number
  sidebarInvoice: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  invoiceLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 2,
    opacity: 0.8,
    marginBottom: 3,
  },
  invoiceNumber: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },

  // Status
  sidebarStatus: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  statusText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Dates
  sidebarDates: {
    gap: 9,
  },
  dateBlock: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.7,
  },
  dateValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // Total
  sidebarTotal: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // Company
  sidebarCompany: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  companyName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  companyText: {
    fontSize: 7,
    color: '#ffffff',
    opacity: 0.85,
    lineHeight: 1.6,
  },
  taxId: {
    fontSize: 6,
    fontFamily: 'Courier',
    color: '#ffffff',
    opacity: 0.7,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },

  // ===== MAIN CONTENT =====
  main: {
    flex: 1,
    padding: 28,
    flexDirection: 'column',
    gap: 17,
  },

  // Client
  clientSection: {
    padding: 14,
    backgroundColor: '#fafafa',
    borderLeftWidth: 4,
    borderLeftColor: primaryColor,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  clientLabel: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  clientName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#18181b',
    marginBottom: 6,
  },
  clientInfo: {
    gap: 1,
  },
  clientInfoText: {
    fontSize: 8,
    color: '#52525b',
    lineHeight: 1.6,
  },

  // Table
  tableSection: {
    flex: 1,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    paddingVertical: 9,
    paddingHorizontal: 9,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  colDesc: {
    flex: 1,
  },
  colQty: {
    width: 45,
    textAlign: 'right',
  },
  colPrice: {
    width: 62,
    textAlign: 'right',
  },
  colAmount: {
    width: 62,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  itemDescContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  itemIndex: {
    width: 17,
    height: 17,
    backgroundColor: primaryColor,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIndexText: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  itemText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#27272a',
  },
  cellQty: {
    fontSize: 8.5,
    color: '#71717a',
    textAlign: 'right',
  },
  cellPrice: {
    fontSize: 8.5,
    color: '#71717a',
    textAlign: 'right',
  },
  cellAmount: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#18181b',
    textAlign: 'right',
  },

  // Summary
  summarySection: {
    alignItems: 'flex-end',
    paddingTop: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 170,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  summaryLabel: {
    fontSize: 8.5,
    color: '#71717a',
  },
  summaryValue: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#27272a',
  },
  summaryValueDiscount: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#22c55e',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 170,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: primaryColor,
    borderRadius: 6,
    marginTop: 6,
  },
  summaryTotalLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  summaryTotalValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // Images
  imagesSection: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#52525b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 9,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  imageItem: {
    width: 79,
    height: 79,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    overflow: 'hidden',
    position: 'relative',
  },
  imageContent: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 14,
    height: 14,
    backgroundColor: primaryColor,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBadgeText: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },

  // Notes
  notesSection: {
    padding: 12,
    backgroundColor: '#fef9c3',
    borderLeftWidth: 3,
    borderLeftColor: '#eab308',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  notesTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#a16207',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 8,
    color: '#854d0e',
    lineHeight: 1.6,
  },

  // Signatures
  signaturesSection: {
    paddingTop: 17,
    marginTop: 17,
    borderTopWidth: 3,
    borderTopColor: primaryColor,
  },
  signaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },
  signatureBox: {
    flex: 1,
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: primaryColor,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 35,
  },
  signatureLine: {
    width: '100%',
    height: 2,
    backgroundColor: primaryColor,
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

  // Footer
  footer: {
    marginTop: 'auto',
    paddingTop: 12,
    alignItems: 'center',
  },
  footerThanks: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: primaryColor,
    marginBottom: 9,
  },
  footerLine: {
    width: '100%',
    height: 3,
    backgroundColor: primaryColor,
    opacity: 0.3,
    borderRadius: 2,
  },
});

const TemplateBoldPDF = ({ 
  invoice, 
  company, 
  themeColor = '#dc2626', 
  paperFormat = 'A4', 
  lang = 'fr' 
}) => {
  const styles = createStyles(themeColor);
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
        
        {/* ===== SIDEBAR ===== */}
        <View style={styles.sidebar}>
          
          {/* Logo */}
          <View style={styles.sidebarLogo}>
            {company?.logo ? (
              <Image src={company.logo} style={styles.logoImage} />
            ) : (
              <View style={styles.logoLetter}>
                <Text style={[styles.logoLetterText, { color: themeColor }]}>
                  {(company?.name || 'E').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Invoice Number */}
          <View style={styles.sidebarInvoice}>
            <Text style={styles.invoiceLabel}>{isQuote ? t.quote : t.invoice}</Text>
            <Text style={styles.invoiceNumber}>{invoice.number || '0001'}</Text>
          </View>

          {/* Status */}
          <View style={[styles.sidebarStatus, { backgroundColor: statusStyle.bg }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>

          {/* Dates */}
          <View style={styles.sidebarDates}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>{t.date}</Text>
              <Text style={styles.dateValue}>{formatDate(invoice.date, lang)}</Text>
            </View>
            {invoice.dueDate && (
              <View style={styles.dateBlock}>
                <Text style={styles.dateLabel}>{t.dueDate}</Text>
                <Text style={styles.dateValue}>{formatDate(invoice.dueDate, lang)}</Text>
              </View>
            )}
          </View>

          {/* Total */}
          <View style={styles.sidebarTotal}>
            <Text style={styles.totalLabel}>{t.total}</Text>
            <Text style={styles.totalValue}>{formatAmount(total, currency, lang)}</Text>
          </View>

          {/* Company */}
          <View style={styles.sidebarCompany}>
            <Text style={styles.companyName}>{company?.name || 'Entreprise'}</Text>
            {company?.address && <Text style={styles.companyText}>{company.address}</Text>}
            {company?.city && <Text style={styles.companyText}>{company.city}</Text>}
            {company?.phone && <Text style={styles.companyText}>{company.phone}</Text>}
            {company?.email && <Text style={styles.companyText}>{company.email}</Text>}
            {company?.taxId && <Text style={styles.taxId}>{company.taxId}</Text>}
          </View>
        </View>

        {/* ===== MAIN CONTENT ===== */}
        <View style={styles.main}>
          
          {/* Client */}
          <View style={styles.clientSection}>
            <Text style={styles.clientLabel}>{t.to}</Text>
            <Text style={styles.clientName}>{invoice.client?.name || 'Client'}</Text>
            <View style={styles.clientInfo}>
              {invoice.client?.address && (
                <Text style={styles.clientInfoText}>{invoice.client.address}</Text>
              )}
              {invoice.client?.city && (
                <Text style={styles.clientInfoText}>{invoice.client.city}</Text>
              )}
              {invoice.client?.phone && (
                <Text style={styles.clientInfoText}>{invoice.client.phone}</Text>
              )}
              {invoice.client?.email && (
                <Text style={styles.clientInfoText}>{invoice.client.email}</Text>
              )}
            </View>
          </View>

          {/* Table */}
          <View style={styles.tableSection}>
            <View style={styles.table}>
              {/* Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.colDesc]}>{t.description}</Text>
                <Text style={[styles.tableHeaderCell, styles.colQty]}>{t.qty}</Text>
                <Text style={[styles.tableHeaderCell, styles.colPrice]}>{t.price}</Text>
                <Text style={[styles.tableHeaderCell, styles.colAmount]}>{t.amount}</Text>
              </View>
              
              {/* Rows */}
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
                    <View style={styles.itemDescContainer}>
                      <View style={styles.itemIndex}>
                        <Text style={styles.itemIndexText}>
                          {String(index + 1).padStart(2, '0')}
                        </Text>
                      </View>
                      <Text style={styles.itemText}>{item.description || '—'}</Text>
                    </View>
                    <Text style={[styles.cellQty, styles.colQty]}>{item.quantity || 0}</Text>
                    <Text style={[styles.cellPrice, styles.colPrice]}>
                      {formatAmount(item.unitPrice || 0, currency, lang)}
                    </Text>
                    <Text style={[styles.cellAmount, styles.colAmount]}>
                      {formatAmount(lineTotal, currency, lang)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t.subtotal}</Text>
              <Text style={styles.summaryValue}>{formatAmount(subtotal, currency, lang)}</Text>
            </View>
            
            {taxRate > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.tax} ({taxRate}%)</Text>
                <Text style={styles.summaryValue}>{formatAmount(taxAmount, currency, lang)}</Text>
              </View>
            )}
            
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.discount}</Text>
                <Text style={styles.summaryValueDiscount}>-{formatAmount(discount, currency, lang)}</Text>
              </View>
            )}

            <View style={styles.summaryTotal}>
              <Text style={styles.summaryTotalLabel}>{t.total}</Text>
              <Text style={styles.summaryTotalValue}>{formatAmount(total, currency, lang)}</Text>
            </View>
          </View>

          {/* Images */}
          {invoice.images && invoice.images.length > 0 && (
            <View style={styles.imagesSection}>
              <Text style={styles.sectionTitle}>{t.attachments}</Text>
              <View style={styles.imagesGrid}>
                {invoice.images.map((image, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image src={image.data || image} style={styles.imageContent} />
                    <View style={styles.imageBadge}>
                      <Text style={styles.imageBadgeText}>{index + 1}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Notes */}
          {invoice.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>{t.notes}</Text>
              <Text style={styles.notesText}>{invoice.notes}</Text>
            </View>
          )}

          {/* Signatures */}
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

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerThanks, { color: themeColor }]}>{t.thanks}</Text>
            <View style={[styles.footerLine, { backgroundColor: themeColor }]} />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TemplateBoldPDF;