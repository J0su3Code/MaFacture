import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import './InvoiceList.css';

const InvoiceList = () => {
  const { user } = useAuth();
  const { t } = useTheme();
  const navigate = useNavigate();
  
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, invoice: null });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const fetchInvoices = async () => {
    if (!user) return;

    try {
      const invoicesRef = collection(db, 'invoices');
      const q = query(
        invoicesRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      
      setInvoices(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.invoice) return;

    try {
      await deleteDoc(doc(db, 'invoices', deleteModal.invoice.id));
      setInvoices(invoices.filter(inv => inv.id !== deleteModal.invoice.id));
      setDeleteModal({ open: false, invoice: null });
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount || 0) + ' FCFA';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'pending': return 'status-pending';
      case 'overdue': return 'status-overdue';
      default: return 'status-draft';
    }
  };

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter);

  if (loading) {
    return (
      <div className="list-loading">
        <Icons.loader className="spinner" width={40} height={40} />
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="invoice-list-page">
      <div className="list-header">
        <div>
          <h1>{t('invoices')}</h1>
          <p className="text-muted">{invoices.length} facture(s)</p>
        </div>
        <Link to="/invoices/new">
          <Button icon="plus">{t('newInvoice')}</Button>
        </Link>
      </div>

      {/* Filtres */}
      <div className="list-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes
        </button>
        <button 
          className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
          onClick={() => setFilter('draft')}
        >
          Brouillons
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          En attente
        </button>
        <button 
          className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
          onClick={() => setFilter('paid')}
        >
          Payées
        </button>
      </div>

      {/* Liste */}
      {filteredInvoices.length === 0 ? (
        <div className="empty-state card">
          <Icons.fileText width={48} height={48} />
          <h3>{t('noInvoices')}</h3>
          <p>{t('createFirst')}</p>
          <Link to="/invoices/new">
            <Button icon="plus">{t('newInvoice')}</Button>
          </Link>
        </div>
      ) : (
        <div className="invoices-grid">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="invoice-card">
              <div className="invoice-card-header">
                <span className="invoice-number">{invoice.number}</span>
                <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                  {t(invoice.status || 'draft')}
                </span>
              </div>
              
              <div className="invoice-card-body">
                <p className="client-name">{invoice.client?.name || 'Client non défini'}</p>
                <p className="invoice-date">{formatDate(invoice.date)}</p>
              </div>
              
              <div className="invoice-card-footer">
                <span className="invoice-amount">{formatAmount(invoice.total)}</span>
                
                <div className="invoice-actions">
                  <button 
                    className="action-btn"
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                    title={t('preview')}
                  >
                    <Icons.eye width={18} height={18} />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                    title={t('edit')}
                  >
                    <Icons.edit width={18} height={18} />
                  </button>
                  <button 
                    className="action-btn danger"
                    onClick={() => setDeleteModal({ open: true, invoice })}
                    title={t('delete')}
                  >
                    <Icons.trash width={18} height={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, invoice: null })}
        title={t('delete')}
        size="sm"
      >
        <div className="delete-modal-content">
          <p>Êtes-vous sûr de vouloir supprimer la facture <strong>{deleteModal.invoice?.number}</strong> ?</p>
          <p className="text-muted">Cette action est irréversible.</p>
          
          <div className="delete-modal-actions">
            <Button 
              variant="secondary" 
              onClick={() => setDeleteModal({ open: false, invoice: null })}
            >
              {t('cancel')}
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete}
            >
              {t('delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceList;