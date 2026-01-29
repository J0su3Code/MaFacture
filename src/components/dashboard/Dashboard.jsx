import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import Button from '../ui/Button';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTheme();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    pendingAmount: 0,
    clientsCount: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Récupérer les factures
        const invoicesRef = collection(db, 'invoices');
        const q = query(
          invoicesRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        
        let total = 0;
        let pending = 0;
        const invoices = [];
        
        snapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          invoices.push(data);
          total += data.total || 0;
          if (data.status === 'pending') {
            pending += data.total || 0;
          }
        });

        // Récupérer le nombre de clients
        const clientsRef = collection(db, 'clients');
        const clientsQuery = query(clientsRef, where('userId', '==', user.uid));
        const clientsSnapshot = await getDocs(clientsQuery);

        setStats({
          totalInvoices: snapshot.size,
          totalAmount: total,
          pendingAmount: pending,
          clientsCount: clientsSnapshot.size
        });
        setRecentInvoices(invoices);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Icons.loader className="spinner" width={40} height={40} />
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{t('dashboard')}</h1>
          <p className="text-muted">Bienvenue sur votre espace de facturation</p>
        </div>
        <Link to="/invoices/new">
          <Button icon="plus">{t('newInvoice')}</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Icons.fileText width={24} height={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t('invoices')}</span>
            <span className="stat-value">{stats.totalInvoices}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Icons.check width={24} height={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total facturé</span>
            <span className="stat-value">{formatAmount(stats.totalAmount)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Icons.loader width={24} height={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">En attente</span>
            <span className="stat-value">{formatAmount(stats.pendingAmount)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Icons.users width={24} height={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t('clients')}</span>
            <span className="stat-value">{stats.clientsCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Factures récentes</h2>
          <Link to="/invoices" className="link-all">
            Voir tout
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="empty-state">
            <Icons.fileText width={48} height={48} />
            <h3>{t('noInvoices')}</h3>
            <p>{t('createFirst')}</p>
            <Link to="/invoices/new">
              <Button icon="plus">{t('newInvoice')}</Button>
            </Link>
          </div>
        ) : (
          <div className="invoices-table-wrapper">
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>{t('invoiceNumber')}</th>
                  <th>{t('clientName')}</th>
                  <th>{t('date')}</th>
                  <th>{t('total')}</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="invoice-number">{invoice.number}</td>
                    <td>{invoice.client?.name || '-'}</td>
                    <td>{formatDate(invoice.date)}</td>
                    <td className="invoice-total">{formatAmount(invoice.total)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                        {t(invoice.status || 'draft')}
                      </span>
                    </td>
                    <td>
                      <Link to={`/invoices/${invoice.id}`}>
                        <button className="btn-icon">
                          <Icons.eye width={18} height={18} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;