import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Phone, Mail, MapPin, Calendar, ShoppingCart, DollarSign, X, Save, User, TrendingUp, FileText } from 'lucide-react';
import { Link } from "react-router-dom";

export default function GestionClients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedClient, setSelectedClient] = useState(null);
   const [showLinks, setShowLinks] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    codePostal: '',
    typeClient: 'Particulier'
  });

  const clients = [
    {
      id: 1,
      nom: 'Benali',
      prenom: 'Ahmed',
      telephone: '0555 123 456',
      email: 'ahmed.benali@email.dz',
      adresse: '15 Rue des Martyrs',
      ville: 'Oran',
      codePostal: '31000',
      typeClient: 'Particulier',
      dateInscription: '15/03/2024',
      nombreCommandes: 8,
      totalAchats: 485000,
      derniereCommande: '05/11/2024',
      statut: 'Actif'
    },
    {
      id: 2,
      nom: 'Kader',
      prenom: 'Fatima',
      telephone: '0661 234 567',
      email: 'fatima.kader@email.dz',
      adresse: '32 Cité Es-Salam',
      ville: 'Oran',
      codePostal: '31000',
      typeClient: 'Particulier',
      dateInscription: '22/04/2024',
      nombreCommandes: 5,
      totalAchats: 325000,
      derniereCommande: '08/11/2024',
      statut: 'Actif'
    },
    {
      id: 3,
      nom: 'Meziane',
      prenom: 'Karim',
      telephone: '0770 345 678',
      email: 'karim.meziane@email.dz',
      adresse: '8 Boulevard de la Liberté',
      ville: 'Oran',
      codePostal: '31000',
      typeClient: 'Professionnel',
      dateInscription: '10/01/2024',
      nombreCommandes: 15,
      totalAchats: 1250000,
      derniereCommande: '10/11/2024',
      statut: 'VIP'
    },
    {
      id: 4,
      nom: 'Sahraoui',
      prenom: 'Leila',
      telephone: '0555 456 789',
      email: 'leila.sahraoui@email.dz',
      adresse: '45 Résidence Les Palmiers',
      ville: 'Bir El Djir',
      codePostal: '31200',
      typeClient: 'Particulier',
      dateInscription: '05/06/2024',
      nombreCommandes: 3,
      totalAchats: 185000,
      derniereCommande: '01/11/2024',
      statut: 'Actif'
    },
    {
      id: 5,
      nom: 'Bouabdallah',
      prenom: 'Rachid',
      telephone: '0661 567 890',
      email: 'rachid.b@email.dz',
      adresse: '12 Rue de la Paix',
      ville: 'Oran',
      codePostal: '31000',
      typeClient: 'Professionnel',
      dateInscription: '18/02/2024',
      nombreCommandes: 12,
      totalAchats: 895000,
      derniereCommande: '07/11/2024',
      statut: 'VIP'
    },
    {
      id: 6,
      nom: 'Brahimi',
      prenom: 'Samira',
      telephone: '0770 678 901',
      email: 'samira.brahimi@email.dz',
      adresse: '27 Cité 20 Août',
      ville: 'Oran',
      codePostal: '31000',
      typeClient: 'Particulier',
      dateInscription: '30/08/2024',
      nombreCommandes: 2,
      totalAchats: 95000,
      derniereCommande: '15/10/2024',
      statut: 'Actif'
    },
    {
      id: 7,
      nom: 'Hamidi',
      prenom: 'Nabil',
      telephone: '0555 789 012',
      email: 'nabil.hamidi@email.dz',
      adresse: '5 Avenue de l\'Indépendance',
      ville: 'Es Senia',
      codePostal: '31100',
      typeClient: 'Particulier',
      dateInscription: '12/09/2023',
      nombreCommandes: 6,
      totalAchats: 420000,
      derniereCommande: '20/09/2024',
      statut: 'Inactif'
    },
    {
      id: 8,
      nom: 'Construction SARL',
      prenom: 'Société',
      telephone: '0770 890 123',
      email: 'contact@construction-sarl.dz',
      adresse: 'Zone Industrielle Hassi Ameur',
      ville: 'Oran',
      codePostal: '31300',
      typeClient: 'Professionnel',
      dateInscription: '05/12/2023',
      nombreCommandes: 25,
      totalAchats: 2850000,
      derniereCommande: '09/11/2024',
      statut: 'VIP'
    }
  ];

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ville.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutColor = (statut) => {
    switch(statut) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Actif': return 'bg-green-100 text-green-800 border-green-300';
      case 'Inactif': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeColor = (type) => {
    return type === 'Professionnel' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800';
  };

  const openModal = (mode, client = null) => {
    setModalMode(mode);
    setSelectedClient(client);
    if (client && mode === 'edit') {
      setFormData({
        nom: client.nom,
        prenom: client.prenom,
        telephone: client.telephone,
        email: client.email,
        adresse: client.adresse,
        ville: client.ville,
        codePostal: client.codePostal,
        typeClient: client.typeClient
      });
    } else if (mode === 'add') {
      setFormData({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        adresse: '',
        ville: '',
        codePostal: '',
        typeClient: 'Particulier'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    // Logique d'enregistrement ici
    console.log('Form data:', formData);
    closeModal();
  };

  const statsCards = [
    { label: 'Total Clients', value: clients.length, icon: User, color: 'bg-blue-500' },
    { label: 'Clients VIP', value: clients.filter(c => c.statut === 'VIP').length, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Nouveaux ce mois', value: '12', icon: Plus, color: 'bg-green-500' },
    { label: 'Commandes totales', value: clients.reduce((sum, c) => sum + c.nombreCommandes, 0), icon: ShoppingCart, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
     {/* Bouton visible seulement sur mobile (<640px) */}
                    <button className="sm:hidden mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() => setShowLinks(!showLinks)}
                  > 
                    {showLinks ? "Fermer le menu" : "Afficher le menu"}
                  </button>
            
                    <div
                    className={`${
                      showLinks ? "grid grid-cols-2 gap-2" : "hidden"
                    } sm:flex sm:items-center sm:justify-between sm:gap-2`}
                  >
                    <Link
                      to="/dashboard"
                      className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/gestion-commandes"
                      className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                      Gestion des Commandes
                    </Link>
                    <Link
                      to="/gestion-devis"
                      className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                      Gestion des devis
                    </Link>
                    <Link
                      to="/gestion-de-stock"
                      className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                      Gestion des stocks
                    </Link>
                    <Link
                      to="/gestion-de-facture"
                      className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                      Gestion des factures
                    </Link>
                    <Link
                      to="/gestion-depenses"
                      className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
                    >
                      Gestion des dépenses
                    </Link>
                  </div>         
         

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
              <p className="text-sm text-gray-500 mt-1">{filteredClients.length} clients enregistrés</p>

            </div>
            <button 
              onClick={() => openModal('add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau client
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone, email ou ville..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Localisation</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Commandes</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Total achats</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {client.nom.charAt(0)}{client.prenom.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{client.prenom} {client.nom}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Inscrit le {client.dateInscription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {client.telephone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <div>{client.adresse}</div>
                          <div className="text-gray-500">{client.ville} {client.codePostal}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(client.typeClient)}`}>
                        {client.typeClient}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{client.nombreCommandes}</div>
                        <div className="text-xs text-gray-500">commandes</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">{client.totalAchats.toLocaleString()} DA</div>
                      <div className="text-xs text-gray-500">Dernière: {client.derniereCommande}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(client.statut)}`}>
                        {client.statut}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openModal('view', client)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', client)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'add' && 'Nouveau Client'}
                  {modalMode === 'edit' && 'Modifier Client'}
                  {modalMode === 'view' && 'Détails Client'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {modalMode === 'view' && selectedClient ? (
                /* View Mode */
                <div className="space-y-6">
                  {/* Client Info */}
                  <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                      {selectedClient.nom.charAt(0)}{selectedClient.prenom.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedClient.prenom} {selectedClient.nom}
                      </h3>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedClient.typeClient)}`}>
                          {selectedClient.typeClient}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(selectedClient.statut)}`}>
                          {selectedClient.statut}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{selectedClient.nombreCommandes}</div>
                      <div className="text-sm text-gray-600">Commandes</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{selectedClient.totalAchats.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total achats (DA)</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">{selectedClient.derniereCommande}</div>
                      <div className="text-sm text-gray-600">Dernière commande</div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Informations de contact</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="text-xs text-gray-500">Téléphone</div>
                          <div className="font-medium text-gray-900">{selectedClient.telephone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="font-medium text-gray-900">{selectedClient.email}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg col-span-2">
                        <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                        <div>
                          <div className="text-xs text-gray-500">Adresse</div>
                          <div className="font-medium text-gray-900">{selectedClient.adresse}</div>
                          <div className="text-sm text-gray-600">{selectedClient.ville} {selectedClient.codePostal}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openModal('edit', selectedClient)}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </button>
                    <button className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      Nouvelle commande
                    </button>
                  </div>
                </div>
              ) : (
                /* Add/Edit Form */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                      <input
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                      <input
                        type="text"
                        name="ville"
                        value={formData.ville}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code Postal</label>
                      <input
                        type="text"
                        name="codePostal"
                        value={formData.codePostal}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type de client *</label>
                      <select
                        name="typeClient"
                        value={formData.typeClient}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Particulier">Particulier</option>
                        <option value="Professionnel">Professionnel</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {modalMode === 'add' ? 'Créer' : 'Enregistrer'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}