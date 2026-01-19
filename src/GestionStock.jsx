import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, AlertTriangle, TrendingDown, TrendingUp, Package, Box,
  Edit2, Trash2, RefreshCw, Download, Save, Loader
} from 'lucide-react';
import { Link } from "react-router-dom";

// Stores
import { useStocksStore } from './lib/store/stocksStore';

// Composants réutilisables
import Header from './components/layout/Header';
import StatCard from './components/ui/Cards';
import FilterBar from './components/ui/FilterBar';
import TableSearch from './components/tables/TableSearch';
import DataTable from './components/tables/DataTable';
import Modal from './components/ui/Modal';
import Form from './components/ui/Form';

export default function GestionStock() {
  // Store hooks
  const {
    articles,
    articlesLoading,
    articlesError,
    articlesPagination,
    articlesStats,
    stockAlerts,
    fetchArticles,
    fetchArticlesStats,
    fetchStockAlerts,
    createArticle,
    updateArticle,
    deleteArticle,
    searchArticles,
    setArticlesFilters,
  } = useStocksStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    reference: '',
    categorie: '',
    quantite: 0,
    unite: 'unité',
    seuil_alerte: 10,
    prix_achat: 0,
    fournisseur: '',
    emplacement: ''
  });

  // Charger les articles au montage du composant
  useEffect(() => {
    fetchArticles(1);
    fetchArticlesStats();
    fetchStockAlerts();
  }, [fetchArticles, fetchArticlesStats, fetchStockAlerts]);

  // Gérer la recherche
  useEffect(() => {
    if (searchTerm.trim()) {
      searchArticles(searchTerm);
    } else {
      fetchArticles(1);
    }
  }, [searchTerm, searchArticles, fetchArticles]);

  const categories = ['Profilés aluminium', 'Vitrage', 'Quincaillerie', 'Joints et étanchéité', 'Accessoires', 'Outils'];

  const filterOptions = [
    { label: 'Tous', value: 'all', count: articles.length },
    ...categories.map(cat => ({
      label: cat,
      value: cat,
      count: articles.filter(a => a.categorie === cat).length
    }))
  ];

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') {
      return articles;
    }
    return articles.filter(article => article.categorie === selectedCategory);
  }, [selectedCategory, articles]);

  const calculateTotalValue = () => articles.reduce((sum, a) => {
    const quantite = parseInt(a.quantite || 0);
    const prix = parseFloat(a.prix_achat || 0);
    return sum + (quantite * prix);
  }, 0);

  const getAlerteCount = () => articles.filter(a => {
    const quantite = parseInt(a.quantite || 0);
    const seuil = parseInt(a.seuil_alerte || 0);
    return quantite <= seuil;
  }).length;

  const getCritiqueCount = () => articles.filter(a => {
    const quantite = parseInt(a.quantite || 0);
    const seuil = parseInt(a.seuil_alerte || 0);
    return quantite <= seuil * 0.5;
  }).length;

  const statsCards = [
    { label: 'Total articles', value: articles.length, icon: Box, color: 'bg-blue-500' },
    { label: 'Valeur du stock', value: `${calculateTotalValue().toLocaleString()} DA`, icon: Package, color: 'bg-green-500' },
    { label: 'Alertes de stock', value: getAlerteCount(), icon: AlertTriangle, color: 'bg-orange-500' },
    { label: 'Stock critique', value: getCritiqueCount(), icon: TrendingDown, color: 'bg-red-500' }
  ];

  const getStockStatus = (quantite, seuilAlerte) => {
    const q = parseInt(quantite || 0);
    const s = parseInt(seuilAlerte || 0);
    if (s === 0) return 'Bon';
    const ratio = q / s;
    if (ratio <= 0.5) return 'Critique';
    if (ratio <= 1) return 'Faible';
    if (ratio <= 2) return 'Moyen';
    return 'Bon';
  };

  const actions = [
    {
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: () => alert('Ajuster stock - À implémenter'),
      className: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    {
      icon: <Edit2 className="w-4 h-4" />,
      onClick: (row) => openModal('edit', row),
      className: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => handleDeleteArticle(row.id),
      className: 'bg-red-50 text-red-600 hover:bg-red-100'
    }
  ];

  const columns = [
    {
      header: 'Article',
      key: 'nom',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.nom}</div>
          <div className="text-xs text-gray-500">{row.designation || row.reference || '-'}</div>
        </div>
      )
    },
    {
      header: 'Catégorie',
      key: 'categorie',
      type: 'badge'
    },
    {
      header: 'Quantité',
      key: 'quantite',
      render: (_, row) => (
        <div>
          <div className="font-bold text-gray-900 text-lg">{row.quantite || 0}</div>
          <div className="text-xs text-gray-500">{row.unite || 'unité'}</div>
        </div>
      )
    },
    {
      header: 'Seuil alerte',
      key: 'seuil_alerte',
      render: (_, row) => (
        <div className="text-sm text-gray-700">{row.seuil_alerte || '-'} {row.unite || 'unité'}</div>
      )
    },
    {
      header: 'Prix achat',
      key: 'prix_achat',
      render: (_, row) => {
        const prix = parseFloat(row.prix_achat || 0);
        return (
          <div className="text-sm font-semibold text-gray-900">
            {prix ? parseInt(prix).toLocaleString() : '0'} DA
          </div>
        );
      }
    },
    {
      header: 'Valeur totale',
      key: 'valeur_totale',
      render: (_, row) => {
        const quantite = parseInt(row.quantite || 0);
        const prix = parseFloat(row.prix_achat || 0);
        const total = quantite * prix;
        return (
          <div className="text-sm font-bold text-green-600">
            {total.toLocaleString()} DA
          </div>
        );
      }
    },
    {
      header: 'Emplacement',
      key: 'emplacement',
      render: (_, row) => (
        <div>
          <div className="text-sm text-gray-700">{row.emplacement || '-'}</div>
          <div className="text-xs text-gray-500">{row.fournisseur || '-'}</div>
        </div>
      )
    },
    {
      header: 'Statut',
      key: 'statut_stock',
      render: (_, row) => {
        const status = row.statut_stock || getStockStatus(row.quantite || 0, row.seuil_alerte || 0);
        const getColor = (s) => {
          switch (s) {
            case 'Critique': return 'bg-red-100 text-red-800';
            case 'Faible': return 'bg-orange-100 text-orange-800';
            case 'Moyen': return 'bg-yellow-100 text-yellow-800';
            case 'Épuisé': return 'bg-red-100 text-red-800';
            default: return 'bg-green-100 text-green-800';
          }
        };
        const getIcon = (s) => {
          switch (s) {
            case 'Critique': return <AlertTriangle className="w-3 h-3" />;
            case 'Faible': return <TrendingDown className="w-3 h-3" />;
            case 'Moyen': return <Package className="w-3 h-3" />;
            case 'Épuisé': return <AlertTriangle className="w-3 h-3" />;
            default: return <TrendingUp className="w-3 h-3" />;
          }
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getColor(status)}`}>
            {getIcon(status)}
            {status}
          </span>
        );
      }
    }
  ];

  // 🔑 Configuration du formulaire
  const formFields = [
    { name: 'nom', label: 'Nom de l\'article', required: true },
    { name: 'reference', label: 'Référence', required: true },
    {
      name: 'categorie',
      label: 'Catégorie',
      type: 'select',
      required: true,
      options: categories.map(cat => ({ label: cat, value: cat }))
    },
    { name: 'fournisseur', label: 'Fournisseur' },
    { name: 'quantite', label: 'Quantité', type: 'number', required: true },
    {
      name: 'unite',
      label: 'Unité',
      type: 'select',
      options: [
        { label: 'unité', value: 'unité' },
        { label: 'barre (6m)', value: 'barre (6m)' },
        { label: 'm²', value: 'm²' },
        { label: 'mètre linéaire', value: 'mètre linéaire' }
      ]
    },
    { name: 'seuil_alerte', label: 'Seuil d\'alerte', type: 'number', required: true },
    { name: 'prix_achat', label: 'Prix d\'achat (DA)', type: 'number', required: true },
    { name: 'emplacement', label: 'Emplacement' }
  ];

  const openModal = (mode, article = null) => {
    setModalMode(mode);
    setSelectedArticle(article);
    if (article && mode === 'edit') {
      setFormData({ ...article });
    } else {
      setFormData({
        nom: '', reference: '', categorie: '', quantite: 0, unite: 'unité',
        seuil_alerte: 10, prix_achat: 0, fournisseur: '', emplacement: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    const { nom, reference, categorie, quantite, prix_achat } = formData;
    if (!nom || !reference || !categorie || !quantite || !prix_achat) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setFormSubmitting(true);
    try {
      if (modalMode === 'add') {
        await createArticle({
          nom: formData.nom,
          reference: formData.reference,
          categorie: formData.categorie,
          quantite: parseInt(formData.quantite),
          unite: formData.unite,
          seuil_alerte: parseInt(formData.seuil_alerte),
          prix_achat: parseFloat(formData.prix_achat),
          fournisseur: formData.fournisseur,
          emplacement: formData.emplacement,
        });
      } else if (modalMode === 'edit' && selectedArticle) {
        await updateArticle(selectedArticle.id, {
          nom: formData.nom,
          reference: formData.reference,
          categorie: formData.categorie,
          quantite: parseInt(formData.quantite),
          unite: formData.unite,
          seuil_alerte: parseInt(formData.seuil_alerte),
          prix_achat: parseFloat(formData.prix_achat),
          fournisseur: formData.fournisseur,
          emplacement: formData.emplacement,
        });
      }
      closeModal();
      await fetchArticles(1);
      fetchArticlesStats();
      fetchStockAlerts();
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteArticle(id);
        fetchArticlesStats();
        fetchStockAlerts();
      } catch (error) {
        alert(`Erreur: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Afficher l'erreur si elle existe */}
      {articlesError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <p className="text-red-700">{articlesError}</p>
        </div>
      )}

      <Header
        title="Gestion du Stock"
        subtitle={articlesLoading ? 'Chargement...' : `${filteredArticles.length} articles en stock`}
        navigationLinks={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Gestion clients', href: '/gestion-clients' },
          { label: 'Gestion des Commandes', href: '/gestion-commandes' },
          { label: 'Gestion des devis', href: '/gestion-devis' },
          { label: 'Gestion des factures', href: '/gestion-de-facture' },
          { label: 'Gestion des dépenses', href: '/gestion-depenses' }
        ]}
        actions={[
          {
            label: 'Rafraîchir',
            icon: <RefreshCw className="w-4 h-4" />,
            onClick: () => fetchArticles(1),
            variant: 'secondary'
          },
          {
            label: 'Exporter',
            icon: <Download className="w-4 h-4" />,
            onClick: () => alert('Export CSV'),
            variant: 'secondary'
          },
          {
            label: 'Nouvel article',
            icon: <Plus className="w-4 h-4" />,
            onClick: () => openModal('add'),
            variant: 'primary'
          }
        ]}
      />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, i) => (
            <StatCard
              key={i}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              iconColor={stat.color}
            />
          ))}
        </div>

        {getAlerteCount() > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
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

        <div className="space-y-4">
          <TableSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher par nom ou référence..."
          />

          <FilterBar
            filters={filterOptions}
            onFilterChange={setSelectedCategory}
            showSearch={false}
          />
        </div>

        {articlesLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-2">
              <Loader className="w-5 h-5 animate-spin text-blue-500" />
              <p>Chargement des articles...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredArticles}
            actions={actions}
            itemsPerPage={5}
          />
        )}
      </main>

      {/* MODAL avec Form réutilisable */}
      <Modal
        isOpen={showModal}
        title={modalMode === 'add' ? 'Nouvel Article' : 'Modifier Article'}
        onClose={closeModal}
      >
        <Form
          fields={formFields}
          formData={formData}
          onChange={handleFormChange}
          onCancel={closeModal}
          onSubmit={handleFormSubmit}
          submitLabel={modalMode === 'add' ? "Ajouter l'article" : "Enregistrer les modifications"}
          cancelLabel="Annuler"
          isLoading={formSubmitting}
        />
      </Modal>
    </div>
  );
}