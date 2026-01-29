/**
 * Formater un montant en FCFA
 */
export const formatAmount = (amount, currency = 'FCFA') => {
  const num = Number(amount) || 0;
  const formatted = new Intl.NumberFormat('fr-FR').format(num);
  return `${formatted} ${currency}`;
};

/**
 * Formater une date
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  
  if (format === 'long') {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
  
  if (format === 'iso') {
    return date.toISOString().split('T')[0];
  }
  
  return date.toLocaleDateString('fr-FR');
};

/**
 * Générer un numéro de facture
 */
export const generateInvoiceNumber = (lastNumber) => {
  const year = new Date().getFullYear();
  
  if (!lastNumber) {
    return `FAC-${year}-0001`;
  }
  
  // Extraire le numéro de la dernière facture
  const parts = lastNumber.split('-');
  const lastNum = parseInt(parts[parts.length - 1]) || 0;
  const nextNum = String(lastNum + 1).padStart(4, '0');
  
  return `FAC-${year}-${nextNum}`;
};

/**
 * Calculer le sous-total d'une facture
 */
export const calculateSubtotal = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  
  return items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return sum + (quantity * unitPrice);
  }, 0);
};

/**
 * Calculer la taxe
 */
export const calculateTax = (subtotal, taxRate = 0) => {
  return subtotal * (taxRate / 100);
};

/**
 * Calculer le total
 */
export const calculateTotal = (items, taxRate = 0, discount = 0) => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax - discount;
};

/**
 * Convertir une image en base64
 */
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Valider un email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valider un numéro de téléphone Burkina Faso
 */
export const isValidPhone = (phone) => {
  // Format: +226 XX XX XX XX ou 0X XX XX XX XX
  const cleaned = phone.replace(/\s/g, '');
  const regex = /^(\+226|00226)?[0-9]{8}$/;
  return regex.test(cleaned);
};

/**
 * Formater un numéro de téléphone
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\s/g, '').replace(/^\+226/, '').replace(/^00226/, '');
  
  if (cleaned.length === 8) {
    return `+226 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)}`;
  }
  
  return phone;
};