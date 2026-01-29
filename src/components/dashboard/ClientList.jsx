import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Icons } from '../ui/Icons';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import './ClientList.css';

const ClientList = () => {
  const { user } = useAuth();
  const { t } = useTheme();
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, client: null });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    fetchClients();
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;

    try {
      const clientsRef = collection(db, 'clients');
      const q = query(clientsRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      
      // Trier par nom
      data.sort((a, b) => a.name.localeCompare(b.name));
      setClients(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      city: client.city || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    try {
      if (editingClient) {
        // Mise à jour
        await updateDoc(doc(db, 'clients', editingClient.id), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        
        setClients(clients.map(c => 
          c.id === editingClient.id ? { ...c, ...formData } : c
        ));
      } else {
        // Création
        const docRef = await addDoc(collection(db, 'clients'), {
          ...formData,
          userId: user.uid,
          createdAt: new Date().toISOString()
        });
        
        setClients([...clients, { id: docRef.id, ...formData }].sort((a, b) => 
          a.name.localeCompare(b.name)
        ));
      }
      
      setModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.client) return;

    try {
      await deleteDoc(doc(db, 'clients', deleteModal.client.id));
      setClients(clients.filter(c => c.id !== deleteModal.client.id));
      setDeleteModal({ open: false, client: null });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email?.toLowerCase().includes(search.toLowerCase()) ||
    client.phone?.includes(search)
  );

  if (loading) {
    return (
      <div className="list-loading">
        <Icons.loader className="spinner" width={40} height={40} />
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="client-list-page">
      <div className="list-header">
        <div>
          <h1>{t('clients')}</h1>
          <p className="text-muted">{clients.length} client(s)</p>
        </div>
        <Button icon="plus" onClick={openAddModal}>
          Ajouter un client
        </Button>
      </div>

      {/* Recherche */}
      {clients.length > 0 && (
        <div className="search-bar">
          <Icons.users width={20} height={20} />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Liste */}
      {clients.length === 0 ? (
        <div className="empty-state card">
          <Icons.users width={48} height={48} />
          <h3>{t('noClients')}</h3>
          <p>Ajoutez vos clients pour les retrouver facilement</p>
          <Button icon="plus" onClick={openAddModal}>
            Ajouter un client
          </Button>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="empty-state card">
          <Icons.users width={48} height={48} />
          <h3>Aucun résultat</h3>
          <p>Aucun client ne correspond à votre recherche</p>
        </div>
      ) : (
        <div className="clients-grid">
          {filteredClients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-avatar">
                {client.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="client-info">
                <h3>{client.name}</h3>
                {client.email && (
                  <p className="client-email">{client.email}</p>
                )}
                {client.phone && (
                  <p className="client-phone">{client.phone}</p>
                )}
                {client.city && (
                  <p className="client-city">{client.city}</p>
                )}
              </div>
              
              <div className="client-actions">
                <button 
                  className="action-btn"
                  onClick={() => openEditModal(client)}
                  title={t('edit')}
                >
                  <Icons.edit width={18} height={18} />
                </button>
                <button 
                  className="action-btn danger"
                  onClick={() => setDeleteModal({ open: true, client })}
                  title={t('delete')}
                >
                  <Icons.trash width={18} height={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ajout/Edition */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingClient ? 'Modifier le client' : 'Ajouter un client'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="client-form">
          <Input
            label={t('clientName')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nom ou raison sociale"
            required
          />
          
          <Input
            label={t('email')}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="client@email.com"
          />
          
          <Input
            label={t('phone')}
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+226 70 00 00 00"
          />
          
          <Input
            label={t('address')}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Adresse complète"
          />
          
          <Input
            label={t('city')}
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Ville"
          />
          
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit">
              {editingClient ? t('save') : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Suppression */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, client: null })}
        title={t('delete')}
        size="sm"
      >
        <div className="delete-modal-content">
          <p>Supprimer le client <strong>{deleteModal.client?.name}</strong> ?</p>
          <p className="text-muted">Cette action est irréversible.</p>
          
          <div className="delete-modal-actions">
            <Button 
              variant="secondary" 
              onClick={() => setDeleteModal({ open: false, client: null })}
            >
              {t('cancel')}
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              {t('delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientList;