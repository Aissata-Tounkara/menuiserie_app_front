import React, { useState, useMemo } from 'react';
import {
  Plus, AlertTriangle, TrendingDown, TrendingUp, Package, Box,
  Edit2, Trash2, RefreshCw, Download, Save
} from 'lucide-react';
import { Link } from "react-router-dom";

// Composants réutilisables
import Header from './components/layout/Header';
import StatCard from './components/ui/Cards';
import FilterBar from './components/ui/FilterBar';
import TableSearch from './components/tables/TableSearch';
import DataTable from './components/tables/DataTable';
import Modal from './components/ui/Modal';
import Form from './components/ui/Form'; // 👈 ajouté

export default function GestionStock() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedArticle, setSelectedArticle] = useState(null);

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
    return articles.filter(article => {
      const matchCategory = selectedCategory === 'all' || article.categorie === selectedCategory;
      const matchSearch = 
        article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.reference.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [searchTerm, selectedCategory, articles]);

  const calculateTotalValue = () => articles.reduce((sum, a) => sum + (a.quantite * a.prixAchat), 0);
  const getAlerteCount = () => articles.filter(a => a.quantite <= a.seuilAlerte).length;
  const getCritiqueCount = () => articles.filter(a => a.quantite <= a.seuilAlerte * 0.5).length;

  const statsCards = [
    { label: 'Total articles', value: articles.length, icon: Box, color: 'bg-blue-500' },
    { label: 'Valeur du stock', value: `${calculateTotalValue().toLocaleString()} DA`, icon: Package, color: 'bg-green-500' },
    { label: 'Alertes de stock', value: getAlerteCount(), icon: AlertTriangle, color: 'bg-orange-500' },
    { label: 'Stock critique', value: getCritiqueCount(), icon: TrendingDown, color: 'bg-red-500' }
  ];

  const getStockStatus = (quantite, seuilAlerte) => {
    const ratio = quantite / seuilAlerte;
    if (ratio <= 0.5) return 'Critique';
    if (ratio <= 1) return 'Faible';
    if (ratio <= 2) return 'Moyen';
    return 'Bon';
  };

  const actions = [
    {
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: () => alert('Ajuster stock'),
      className: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    {
      icon: <Edit2 className="w-4 h-4" />,
      onClick: (row) => openModal('edit', row),
      className: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => deleteArticle(row.id),
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
          <div className="text-xs text-gray-500">{row.reference}</div>
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
          <div className="font-bold text-gray-900 text-lg">{row.quantite}</div>
          <div className="text-xs text-gray-500">{row.unite}</div>
        </div>
      )
    },
    {
      header: 'Seuil alerte',
      key: 'seuilAlerte',
      render: (_, row) => (
        <div className="text-sm text-gray-700">{row.seuilAlerte} {row.unite}</div>
      )
    },
    {
      header: 'Prix achat',
      key: 'prixAchat',
      render: (_, row) => (
        <div className="text-sm font-semibold text-gray-900">{row.prixAchat.toLocaleString()} DA</div>
      )
    },
    {
      header: 'Valeur totale',
      key: 'valeurTotale',
      render: (_, row) => (
        <div className="text-sm font-bold text-green-600">
          {(row.quantite * row.prixAchat).toLocaleString()} DA
        </div>
      )
    },
    {
      header: 'Emplacement',
      key: 'emplacement',
      render: (_, row) => (
        <div>
          <div className="text-sm text-gray-700">{row.emplacement}</div>
          <div className="text-xs text-gray-500">{row.fournisseur}</div>
        </div>
      )
    },
    {
      header: 'Statut',
      key: 'statut',
      render: (_, row) => {
        const status = getStockStatus(row.quantite, row.seuilAlerte);
        const getColor = (s) => {
          switch (s) {
            case 'Critique': return 'bg-red-100 text-red-800';
            case 'Faible': return 'bg-orange-100 text-orange-800';
            case 'Moyen': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-green-100 text-green-800';
          }
        };
        const getIcon = (s) => {
          switch (s) {
            case 'Critique': return <AlertTriangle className="w-3 h-3" />;
            case 'Faible': return <TrendingDown className="w-3 h-3" />;
            case 'Moyen': return <Package className="w-3 h-3" />;
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
    { name: 'seuilAlerte', label: 'Seuil d\'alerte', type: 'number', required: true },
    { name: 'prixAchat', label: 'Prix d\'achat (DA)', type: 'number', required: true },
    { name: 'emplacement', label: 'Emplacement' }
  ];

  const openModal = (mode, article = null) => {
    setModalMode(mode);
    setSelectedArticle(article);
    if (article && mode === 'edit') {
      setFormData({ ...article });
    } else {
      setFormData({
        nom: '', categorie: '', reference: '', quantite: 0, unite: 'unité',
        seuilAlerte: 10, prixAchat: 0, fournisseur: '', emplacement: ''
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

  const handleFormSubmit = () => {
    const { nom, reference, categorie, quantite, prixAchat } = formData;
    if (!nom || !reference || !categorie || !quantite || !prixAchat) {
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Gestion du Stock"
        subtitle={`${filteredArticles.length} articles en stock`}
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

        <DataTable
          columns={columns}
          data={filteredArticles}
          actions={actions}
          itemsPerPage={5}
        />
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
        />
      </Modal>
    </div>
  );
}