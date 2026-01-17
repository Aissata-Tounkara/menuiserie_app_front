import React, { useState, useMemo } from 'react';
import { 
  Plus, User, TrendingUp, ShoppingCart, 
  Phone, Mail, MapPin, Search, Eye, Edit2, Trash2 
} from 'lucide-react';

// Import de vos composants réutilisables
import Header from './components/layout/Header';
import StatCard from './components/ui/Cards';
import DataTable from './components/tables/DataTable'; 
import Modal from './components/ui/Modal';
import Form from './components/ui/Form';
import Button from './components/ui/Button';

const GestionClients = () => {
  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedClient, setSelectedClient] = useState(null);
  
  const [formData, setFormData] = useState({
    nom: '', prenom: '', telephone: '', email: '',
    adresse: '', ville: '', typeClient: 'Particulier'
  });

  // --- DONNÉES (Simulées) ---
  const [clients] = useState([
    {
      id: 1, nom: 'Benali', prenom: 'Ahmed', telephone: '0555 123 456',
      email: 'ahmed.benali@email.dz', adresse: '15 Rue des Martyrs',
      ville: 'Oran', typeClient: 'Particulier', dateInscription: '15/03/2024',
      nombreCommandes: 8, totalAchats: 485000, statut: 'Actif'
    },
    {
      id: 2, nom: 'Meziane', prenom: 'Karim', telephone: '0770 345 678',
      email: 'karim.meziane@email.dz', adresse: '8 Blvd de la Liberté',
      ville: 'Oran', typeClient: 'Entreprise', dateInscription: '10/01/2024',
      nombreCommandes: 15, totalAchats: 1250000, statut: 'Actif'
    },
    {
      id: 3, nom: 'SARL Construction', prenom: 'Direction', telephone: '0550 11 22 33',
      email: 'contact@sarl-c.dz', adresse: 'Zone Industrielle',
      ville: 'Arzew', typeClient: 'Entreprise', dateInscription: '05/11/2023',
      nombreCommandes: 25, totalAchats: 3500000, statut: 'Actif'
    }
  ]);

  // --- ACTIONS POUR LE TABLEAU ---
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
      onClick: (row) => {
        if (window.confirm(`Confirmer la suppression de ${row.prenom} ${row.nom} ?`)) {
          // Logique de suppression ici (API, etc.)
          console.log('Supprimer client:', row.id);
        }
      },
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
      header: 'Total Achats',
      key: 'totalAchats',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.totalAchats.toLocaleString()} FCFA</div>
          <div className="text-xs text-gray-500">{row.nombreCommandes} commandes</div>
        </div>
      )
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
    { name: 'adresse', label: 'Adresse complète' },
    { name: 'ville', label: 'Ville' },
    { 
      name: 'typeClient', 
      label: 'Type de Client', 
      type: 'select', 
      options: [
        { label: 'Particulier', value: 'Particulier' },
        { label: 'Entreprise', value: 'Entreprise' }
      ] 
    }
  ];

  // --- LOGIQUE FILTRAGE ---
  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      `${c.nom} ${c.prenom} ${c.email} ${c.ville}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, clients]);

  // --- HANDLERS ---
  const handleOpenModal = (mode, client = null) => {
    setModalMode(mode);
    setSelectedClient(client);
    if (client && (mode === 'edit' || mode === 'view')) {
      setFormData({ ...client });
    } else {
      setFormData({ nom: '', prenom: '', telephone: '', email: '', adresse: '', ville: '', typeClient: 'Particulier' });
    }
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Données soumises:", formData);
    // Ici, appel API POST/PUT
    setShowModal(false);
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
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Clients" value={clients.length} icon={User} iconColor="bg-blue-600" />
          <StatCard label="Commandes" value="48" icon={ShoppingCart} iconColor="bg-orange-500" />
          <StatCard label="Chiffre d'affaires" value="5.2M Fcfa" icon={TrendingUp} iconColor="bg-green-600" />
          <StatCard label="Nouveaux (30j)" value="+5" icon={Plus} iconColor="bg-purple-600" />
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLEAU */}
        <DataTable 
          columns={columns}
          data={filteredClients}
          actions={actions}
          itemsPerPage={5}
        />
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
                {selectedClient?.prenom.charAt(0)}{selectedClient?.nom.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedClient?.prenom} {selectedClient?.nom}</h3>
                <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">{selectedClient?.typeClient}</p>
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
          />
        )}
      </Modal>
    </div>
  );
};

export default GestionClients;