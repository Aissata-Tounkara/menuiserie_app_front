import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, AlertTriangle, TrendingDown, TrendingUp, Package, Box, Layers, Filter, Download, RefreshCw, X, Save } from 'lucide-react';
import { Link } from "react-router-dom";
export default function GestionStock() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedArticle, setSelectedArticle] = useState(null);
   const [showLinks, setShowLinks] = useState(false);
  const [articles, setArticles] = useState([
    {
      id: 1,
      nom: 'Profilé aluminium coulissant',
      reference: 'PRO-COU-001',
      categorie: 'Profilés aluminium',
      quantite: 45,
      unite: 'barre (6m)',
      seuilAlerte: 20,
      prixAchat: 8500,
      fournisseur: 'AlumPro Algérie',
      emplacement: 'Zone A - Rack 1',
      derniereEntree: '05/11/2024',
      derniereSortie: '08/11/2024'
    },
    {
      id: 2,
      nom: 'Profilé aluminium battant',
      reference: 'PRO-BAT-002',
      categorie: 'Profilés aluminium',
      quantite: 8,
      unite: 'barre (6m)',
      seuilAlerte: 15,
      prixAchat: 7800,
      fournisseur: 'AlumPro Algérie',
      emplacement: 'Zone A - Rack 1',
      derniereEntree: '01/11/2024',
      derniereSortie: '09/11/2024'
    },
    {
      id: 3,
      nom: 'Double vitrage 4/16/4',
      reference: 'VIT-DOU-001',
      categorie: 'Vitrage',
      quantite: 28,
      unite: 'm²',
      seuilAlerte: 15,
      prixAchat: 4500,
      fournisseur: 'Vitralux',
      emplacement: 'Zone B - Stockage vertical',
      derniereEntree: '06/11/2024',
      derniereSortie: '08/11/2024'
    },
    {
      id: 4,
      nom: 'Poignée fenêtre chromée',
      reference: 'QUI-POI-001',
      categorie: 'Quincaillerie',
      quantite: 125,
      unite: 'unité',
      seuilAlerte: 50,
      prixAchat: 850,
      fournisseur: 'QuincaBat',
      emplacement: 'Zone C - Étagère 3',
      derniereEntree: '03/11/2024',
      derniereSortie: '10/11/2024'
    },
    {
      id: 5,
      nom: 'Serrure 3 points',
      reference: 'QUI-SER-002',
      categorie: 'Quincaillerie',
      quantite: 18,
      unite: 'unité',
      seuilAlerte: 10,
      prixAchat: 12500,
      fournisseur: 'QuincaBat',
      emplacement: 'Zone C - Étagère 2',
      derniereEntree: '07/11/2024',
      derniereSortie: '09/11/2024'
    }
  ]);

  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    reference: '',
    quantite: 0,
    unite: 'unité',
    seuilAlerte: 10,
    prixAchat: 0,
    fournisseur: '',
    emplacement: ''
  });

  const categories = ['Tous', 'Profilés aluminium', 'Vitrage', 'Quincaillerie', 'Joints et étanchéité', 'Accessoires', 'Outils'];

  const filteredArticles = articles.filter(article => {
    const matchCategory = selectedCategory === 'Tous' || article.categorie === selectedCategory;
    const matchSearch = article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       article.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getStockStatus = (quantite, seuilAlerte) => {
    const ratio = quantite / seuilAlerte;
    if (ratio <= 0.5) return { label: 'Critique', color: 'bg-red-100 text-red-800 border-red-300', icon: AlertTriangle };
    if (ratio <= 1) return { label: 'Faible', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: TrendingDown };
    if (ratio <= 2) return { label: 'Moyen', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Package };
    return { label: 'Bon', color: 'bg-green-100 text-green-800 border-green-300', icon: TrendingUp };
  };

  const calculateTotalValue = () => {
    return articles.reduce((sum, article) => sum + (article.quantite * article.prixAchat), 0);
  };

  const getAlerteCount = () => {
    return articles.filter(a => a.quantite <= a.seuilAlerte).length;
  };

  const getCritiqueCount = () => {
    return articles.filter(a => a.quantite <= a.seuilAlerte * 0.5).length;
  };

  const statsCards = [
    { label: 'Total articles', value: articles.length, icon: Box, color: 'bg-blue-500' },
    { label: 'Valeur du stock', value: `${calculateTotalValue().toLocaleString()} DA`, icon: Package, color: 'bg-green-500' },
    { label: 'Alertes de stock', value: getAlerteCount(), icon: AlertTriangle, color: 'bg-orange-500' },
    { label: 'Stock critique', value: getCritiqueCount(), icon: TrendingDown, color: 'bg-red-500' }
  ];

  const openModal = (mode, article = null) => {
    setModalMode(mode);
    setSelectedArticle(article);
    if (article && mode === 'edit') {
      setFormData({
        nom: article.nom,
        categorie: article.categorie,
        reference: article.reference,
        quantite: article.quantite,
        unite: article.unite,
        seuilAlerte: article.seuilAlerte,
        prixAchat: article.prixAchat,
        fournisseur: article.fournisseur,
        emplacement: article.emplacement
      });
    } else if (mode === 'add') {
      setFormData({
        nom: '',
        categorie: '',
        reference: '',
        quantite: 0,
        unite: 'unité',
        seuilAlerte: 10,
        prixAchat: 0,
        fournisseur: '',
        emplacement: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.reference || !formData.categorie || !formData.quantite || !formData.prixAchat) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (modalMode === 'add') {
      const newArticle = {
        id: Math.max(...articles.map(a => a.id), 0) + 1,
        ...formData,
        quantite: parseInt(formData.quantite),
        prixAchat: parseFloat(formData.prixAchat),
        seuilAlerte: parseInt(formData.seuilAlerte),
        derniereEntree: new Date().toLocaleDateString('fr-FR'),
        derniereSortie: new Date().toLocaleDateString('fr-FR')
      };
      setArticles([...articles, newArticle]);
    } else if (modalMode === 'edit' && selectedArticle) {
      setArticles(articles.map(a => 
        a.id === selectedArticle.id 
          ? { ...a, ...formData, quantite: parseInt(formData.quantite), prixAchat: parseFloat(formData.prixAchat) }
          : a
      ));
    }
    closeModal();
  };

  const deleteArticle = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article?')) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

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
                 
        <div className={`${ showLinks ? "grid grid-cols-2 gap-2" : "hidden"
                         } sm:flex sm:items-center sm:justify-between sm:gap-2`}
         >
           <Link to="/dashboard" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200" >
              Dashboard
           </Link>
           <Link to="/gestion-clients" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200" >
               Gestion clients
           </Link>
           <Link to="/gestion-commandes" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200" >
                Gestion des Commandes
           </Link>
           <Link to="/gestion-devis" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200" >
              Gestion des devis
            </Link>
            <Link to="/gestion-de-facture" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">
              Gestion des factures
            </Link>
            <Link to="/gestion-depenses" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">
              Gestion des dépenses
            </Link>
         </div>


          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion du Stock</h1>
              <p className="text-sm text-gray-500 mt-1">{filteredArticles.length} articles en stock</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exporter
              </button>
              <button 
                onClick={() => openModal('add')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvel article
              </button>
            </div>
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

        {/* Alerts */}
        {getAlerteCount() > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900">Attention : Articles en stock faible</h3>
              <p className="text-sm text-orange-800 mt-1">
                {getAlerteCount()} article(s) nécessitent un réapprovisionnement dont {getCritiqueCount()} en stock critique.
              </p>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
              Voir la liste
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou référence..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtres avancés
            </button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
                {cat !== 'Tous' && (
                  <span className="ml-2 text-xs">
                    ({articles.filter(a => a.categorie === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Article</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Catégorie</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Quantité</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Seuil alerte</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prix achat</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Valeur totale</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Emplacement</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => {
                  const status = getStockStatus(article.quantite, article.seuilAlerte);
                  const StatusIcon = status.icon;
                  return (
                    <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{article.nom}</div>
                        <div className="text-xs text-gray-500">{article.reference}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {article.categorie}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900 text-lg">{article.quantite}</div>
                        <div className="text-xs text-gray-500">{article.unite}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-700">{article.seuilAlerte} {article.unite}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-semibold text-gray-900">{article.prixAchat.toLocaleString()} DA</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-bold text-green-600">
                          {(article.quantite * article.prixAchat).toLocaleString()} DA
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-700">{article.emplacement}</div>
                        <div className="text-xs text-gray-500">{article.fournisseur}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 justify-end">
                          <button 
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                            title="Ajuster stock"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openModal('edit', article)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteArticle(article.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" 
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {modalMode === 'add' ? 'Nouvel Article' : 'Modifier Article'}
                  </h2>
                  {selectedArticle && modalMode === 'edit' && (
                    <p className="text-sm text-gray-500 mt-1">
                      Référence : {selectedArticle.reference}
                    </p>
                  )}
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'article *</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Profilé aluminium..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Référence *</label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: PRO-COU-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                    <select
                      name="categorie"
                      value={formData.categorie}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {categories.filter(c => c !== 'Tous').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fournisseur</label>
                    <input
                      type="text"
                      name="fournisseur"
                      value={formData.fournisseur}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: AlumPro Algérie"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantité *</label>
                    <input
                      type="number"
                      name="quantite"
                      value={formData.quantite}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unité *</label>
                    <select
                      name="unite"
                      value={formData.unite}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="unité">unité</option>
                      <option value="barre (6m)">barre (6m)</option>
                      <option value="barre (3m)">barre (3m)</option>
                      <option value="m²">m²</option>
                      <option value="mètre linéaire">mètre linéaire</option>
                      <option value="cartouche">cartouche</option>
                      <option value="kg">kg</option>
                      <option value="litre">litre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seuil d'alerte *</label>
                    <input
                      type="number"
                      name="seuilAlerte"
                      value={formData.seuilAlerte}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix d'achat (DA) *</label>
                    <input
                      type="number"
                      name="prixAchat"
                      value={formData.prixAchat}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emplacement</label>
                    <input
                      type="text"
                      name="emplacement"
                      value={formData.emplacement}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Zone A - Rack 1"
                    />
                  </div>
                </div>

                {formData.quantite > 0 && formData.prixAchat > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700 font-medium">Valeur totale en stock:</span>
                      <span className="text-xl font-bold text-blue-900">
                        {(formData.quantite * formData.prixAchat).toLocaleString()} DA
                      </span>
                    </div>
                  </div>
                )}

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
                    {modalMode === 'add' ? 'Ajouter' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}