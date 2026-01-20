import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, User, TrendingUp, ShoppingCart, 
  Phone, Mail, MapPin, Search, Eye, Edit2, Trash2, AlertCircle
} from 'lucide-react';

// Import de vos composants réutilisables
import Header from './components/layout/Header';
import StatCard from './components/ui/Cards';
import DataTable from './components/tables/DataTable'; 
import Modal from './components/ui/Modal';
import Form from './components/ui/Form';
import Button from './components/ui/Button';

// Import du store et utils
import { useClientsStore } from './lib/store/clientsStore';
import { MESSAGES } from './lib/utils/constants';

const GestionClients = () => {
  // --- ZUSTAND STORE ---
  const { 
    clients, 
    loading, 
    error,
    pagination,
    stats,
    fetchClients, 
    fetchClient,
    createClient, 
    updateClient, 
    deleteClient,
    fetchStats,
    searchClients,
    clearError
  } = useClientsStore();

  // --- ÉTATS LOCAUX ---
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedClient, setSelectedClient] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  
// Initialisation complète pour éviter l'erreur "uncontrolled"
  const initialFormState = {
    nom: '', 
    prenom: '', 
    telephone: '', 
    email: '',
    adresse: '', 
    ville: '', 
    code_postal: '', // Ajouté
    type_client: 'Particulier', // Valeur par défaut de la migration
    statut: 'Actif', // Valeur par défaut de la migration
    date_inscription: new Date().toISOString().split('T')[0] // Requis par la migration (non nullable)
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- EFFET: Charger les données au montage ---
  useEffect(() => {
    fetchClients(1);
    fetchStats();
  }, [fetchClients, fetchStats]);

  // --- GESTION DES ACTIONS DU TABLEAU ---
  const actions = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => handleOpenModal('view', row),
      className: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    },
    {
      icon: <Edit2 className="w-4 h-4" />,
      onClick: (row) => handleOpenModal('edit', row),
      className: 'bg-green-100 text-green-600 hover:bg-green-200'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => handleDeleteClient(row),
      className: 'bg-red-100 text-red-600 hover:bg-red-200'
    }
  ];

  // --- CONFIGURATION DU TABLEAU (DataTable) ---
  const columns = [
    {
      header: 'Client',
      key: 'nom',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.prenom} {row.nom}</div>
          <div className="text-xs text-gray-500">Inscrit le {row.dateInscription}</div>
        </div>
      )
    },
    {
      header: 'Contact',
      key: 'telephone',
      render: (_, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{row.telephone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Localisation',
      key: 'adresse',
      render: (_, row) => (
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{row.adresse}, {row.ville}</span>
        </div>
      )
    },
    {
      header: 'Type',
      key: 'typeClient',
      type: 'badge' // géré par getStatusStyle
    },
    
  {
  header: 'Commandes',
  key: 'nombre_commandes', // Vérifiez bien que c'est nombre_commandes
  render: (_, row) => {
    // Le problème vient souvent d'ici : essayez de lire les deux variantes au cas où
    const nb = row.nombre_commandes ?? row.nombreCommandes ?? 0;
    
    return (
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
          {nb}
        </span>
        <span className="text-xs text-gray-500">cmd(s)</span>
      </div>
    );
  }
},
    
{
  header: 'Total Achats',
  key: 'total_achats',
  render: (_, row) => {
    // Force la conversion en nombre pour éviter les erreurs d'affichage
    const total = parseFloat(row.total_achats || 0);
    const nbCommandes = parseInt(row.nombre_commandes || 0); // Notez le nombre_commandes (snake_case)

    return (
      <div>
        <div className="font-semibold text-gray-900">
          {total.toLocaleString('fr-FR')} FCFA
        </div>
        <div className="text-xs text-gray-500">
          {nbCommandes} {nbCommandes > 1 ? 'commandes' : 'commande'}
        </div>
      </div>
    );
  }
},
    {
      header: 'Statut',
      key: 'statut',
      type: 'badge'
    }
  ];

  // --- CONFIGURATION DU FORMULAIRE ---
const formFields = [
  { name: 'nom', label: 'Nom', required: true },
  { name: 'prenom', label: 'Prénom', required: true },
  { name: 'telephone', label: 'Téléphone', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'adresse', label: 'Adresse complète', required: true },
  { name: 'ville', label: 'Ville', required: true },
  { 
    name: 'code_postal', 
    label: 'Boîte Postale (ex: BP 1234)', 
    placeholder: 'BP 0000',
    required: true 
  },
  { 
    name: 'type_client', 
    label: 'Type de client', 
    type: 'select', 
    required: true,
    options: [
      { label: 'Particulier', value: 'Particulier' },
      { label: 'Professionnel', value: 'Professionnel' }
    ] 
  },
  { 
    name: 'statut', 
    label: 'Statut', 
    type: 'select', 
    options: [
      { label: 'Actif', value: 'Actif' },
      { label: 'Inactif', value: 'Inactif' },
      { label: 'VIP', value: 'VIP' }
    ] 
  }
];

  // --- LOGIQUE FILTRAGE ---
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) {
      return clients;
    }
    return clients.filter(c => 
      `${c.nom || ''} ${c.prenom || ''} ${c.email || ''} ${c.ville || ''}`.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, clients]);

  // --- HANDLERS ---
  const handleOpenModal = (mode, client = null) => {
    setModalMode(mode);
    setSelectedClient(client);
    if (client && (mode === 'edit' || mode === 'view')) {
      setFormData({ 
        nom: client.nom || '', 
        prenom: client.prenom || '', 
        telephone: client.telephone || '', 
        email: client.email || '', 
        adresse: client.adresse || '', 
        ville: client.ville || '', 
        code_postal: client.codePostal || '', // Ajouté
        type_client: client.typeClient || 'Particulier', // Ajouté
        statut: client.statut || 'Actif',
        date_inscription: client.date_inscription || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData(initialFormState); // Utiliser l'objet complet définit plus haut
    }
    clearError();
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
  e.preventDefault();
  setSubmitLoading(true);

  try {
    if (modalMode === 'add') {
      await createClient(formData);
    } else if (modalMode === 'edit') {
      await updateClient(selectedClient.id, formData);
    }
    
    setShowModal(false);

    // 🔥 ACTIONS DE SYNCHRONISATION CRUCIALES
    await fetchClients(1); // Recharge la liste
    await fetchStats();    // Recharge les compteurs du haut (Chiffre d'affaires, etc.)
    
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err);
  } finally {
    setSubmitLoading(false);
  }
};

  const handleDeleteClient = async (client) => {
    if (window.confirm(`Confirmer la suppression de ${client.prenom} ${client.nom} ?`)) {
      try {
        await deleteClient(client.id);
        // Recharger la liste
        fetchClients(1);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.trim()) {
      searchClients(query);
    } else {
      fetchClients(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* HEADER */}
      <Header 
        title="Gestion des Clients"
        subtitle={`${clients.length} clients dans votre base`}
        navigationLinks={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Gestion des Commandes', href: '/gestion-commandes' },
          { label: 'Gestion des devis', href: '/gestion-devis' },
          { label: 'Gestion des stocks', href: '/gestion-de-stock' },
          { label: 'Gestion des dépenses', href: '/gestion-depenses' },
          { label: 'Gestion des factures', href: '/gestion-de-facture' }
        ]}
        actions={[
          { 
            label: 'Ajouter un Client', 
            icon: <Plus className="w-4 h-4" />, 
            onClick: () => handleOpenModal('add'),
            variant: 'primary'
          }
        ]}
      />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* AFFICHAGE DES ERREURS API */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-700 font-medium">Erreur</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Clients" 
          value={stats?.total_clients || 0} 
          icon={User} 
          iconColor="bg-blue-600" 
        />
        <StatCard 
          label="Commandes" 
          value={stats?.total_commandes || 0} 
          icon={ShoppingCart} 
          iconColor="bg-orange-500" 
        />
        <StatCard 
          label="Chiffre d'affaires" 
          value={`${Number(stats?.total_achats || 0).toLocaleString()} FCFA`} 
          icon={TrendingUp} 
          iconColor="bg-green-600" 
        />
        <StatCard 
          label="Nouveaux (30j)" 
          value={stats?.newClientsMonth || 0} 
          icon={Plus} 
          iconColor="bg-purple-600" 
        />
      </div>

        {/* BARRE DE RECHERCHE */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Rechercher par nom, email ou ville..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={handleSearch}
              disabled={loading}
            />
          </div>
        </div>
        
       

        {/* TABLEAU */}
        {loading && !searchTerm ? (
          <div className="bg-white p-8 rounded-xl text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="mt-4 text-gray-500">Chargement des clients...</p>
          </div>
        ) : (
          <DataTable 
            columns={columns}
            data={filteredClients}
            actions={actions}
            itemsPerPage={10}
          />
        )}
      </main>

      {/* MODAL (Ajout / Modification / Vue) */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'add' ? "Nouveau Client" : 
          modalMode === 'edit' ? "Modifier le Client" : "Fiche Client"
        }
      >
        {modalMode === 'view' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedClient?.prenom?.charAt(0)}{selectedClient?.nom?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedClient?.prenom} {selectedClient?.nom}</h3>
                <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">{selectedClient?.statut || 'Actif'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-semibold uppercase">Coordonnées</p>
                <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4" /> {selectedClient?.telephone}</div>
                <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4" /> {selectedClient?.email}</div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-semibold uppercase">Adresse</p>
                <div className="flex items-start gap-2 text-gray-700"><MapPin className="w-4 h-4 mt-1" /> 
                  <span>{selectedClient?.adresse}, {selectedClient?.ville}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
            </div>
          </div>
        ) : (
          <Form 
            fields={formFields}
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowModal(false)}
            submitLabel={modalMode === 'add' ? "Créer le client" : "Mettre à jour"}
            isLoading={submitLoading}
          />
        )}
      </Modal>
    </div>
  );
};

export default GestionClients;