import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, Edit2, Download, Package, Truck, AlertCircle, XCircle, Calendar, User, Phone, MapPin, Plus
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Composants réutilisables
import Header from './components/layout/Header';
import StatCard from './components/ui/Cards';
import DataTable from './components/tables/DataTable';
import FilterBar from './components/ui/FilterBar';
import Modal from './components/ui/Modal';
import TableSearch from './components/tables/TableSearch';

// Import du store et utils
import { useCommandesStore } from './lib/store/commandesStore';
import { MESSAGES } from './lib/utils/constants';

export default function GestionCommandes() {
  // --- ZUSTAND STORE ---
  const { 
    commandes, 
    loading, 
    error,
    pagination,
    stats,
    fetchCommandes, 
    fetchCommande,
    updateCommandeStatus,
    fetchStats,
    searchCommandes,
    filterByStatut,
    clearError
  } = useCommandesStore();

  // --- ÉTATS LOCAUX ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const location = useLocation();
  const [highlightedId, setHighlightedId] = useState(null);

  // --- EFFET: Charger les données au montage ---
  useEffect(() => {
    fetchCommandes(1);
    fetchStats();
  }, [fetchCommandes, fetchStats]);

  // Effet pour surligner une commande depuis un devis
  useEffect(() => {
    if (location.state?.createdFromDevis) {
      const id = location.state.createdFromDevis;
      setHighlightedId(id);
      setSearchTerm(id);
    }
  }, [location]);
    
    // ... (ajoute les autres commandes ici, mais avec format plat : clientNom, clientTel, etc.)
    
  

  // Données filtrées
  // Données filtrées
  const filteredCommandes = useMemo(() => {
    if (!commandes || commandes.length === 0) return [];
    
    return commandes.filter(cmd => {
      const matchStatus = selectedStatus === 'all' || cmd.statut === selectedStatus;
      
      // Sécurisation ici : on transforme l'ID ou le Numéro en String
      const commandeId = String(cmd.numero || cmd.id || '');
      const clientNom = String(cmd.client?.nom || cmd.clientNom || '');
      const searchLower = searchTerm.toLowerCase();

      const matchSearch = 
        commandeId.toLowerCase().includes(searchLower) ||
        clientNom.toLowerCase().includes(searchLower) ||
        (cmd.client?.telephone || cmd.clientTel || '').includes(searchTerm);
        
      return matchStatus && matchSearch;
    });
  }, [searchTerm, selectedStatus, commandes]);

  // Stats
  const statsCards = [
    { label: 'Total commandes', value: commandes.length || 0, color: 'bg-blue-500', icon: Package },
    { label: 'En production', value: commandes.filter(c => c.statut === 'En production').length || 0, color: 'bg-purple-500', icon: Package },
    { label: 'Prêtes', value: commandes.filter(c => c.statut === 'Prête').length || 0, color: 'bg-orange-500', icon: AlertCircle },
    { label: 'Livrées', value: stats?.deliveredCount || 0, color: 'bg-green-500', icon: Truck }
  ];

  // Filtres dynamiques - avec compteurs dynamiques
  const statusOptions = useMemo(() => [
    { label: 'Tous', value: 'all', count: commandes.length },
    { label: 'En production', value: 'En production', count: commandes.filter(c => c.statut === 'En production').length },
    { label: 'Prête', value: 'Prête', count: commandes.filter(c => c.statut === 'Prête').length },
    { label: 'Livrée', value: 'Livrée', count: commandes.filter(c => c.statut === 'Livrée').length },
    { label: 'Annulée', value: 'Annulée', count: commandes.filter(c => c.statut === 'Annulée').length }
  ], [commandes]);

 

  // Actions du tableau
  const actions = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => {
        setSelectedCommande(row);
        setShowModal(true);
      },
      className: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    },
  ];

  // Colonnes du DataTable
  const columns = [
    {
      header: 'Commande',
      key: 'id',
      render: (_, row) => {
        // Si le backend n'envoie pas le préfixe, on peut le simuler ici
        const rawId = row.numero || row.id;
        const displayId = typeof rawId === 'number' 
          ? `CMD-2026-${String(rawId).padStart(3, '0')}` 
          : rawId;

        return (
          <div>
            <div className={`font-semibold ${rawId === highlightedId ? 'text-yellow-600' : 'text-blue-600'}`}>
              {displayId}
            </div>
            <div className="text-xs text-gray-500">{(row.articles || []).length} article(s)</div>
          </div>
        );
      }
    },
    {
      header: 'Client',
      key: 'client_id',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.client?.nom || row.client_id}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {row.client?.telephone || row.clientTel}
          </div>
        </div>
      )
    },
    
    {
      header: 'Date commande',
      key: 'dateCommande',
      render: (_, row) => (
        <div className="text-sm text-gray-700 flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          {row.date_commande || row.dateCommande}
        </div>
      )
    },
    {
      header: 'Livraison prévue',
      key: 'dateLivraison',
      render: (_, row) => (
        <div className="text-sm font-medium text-gray-900">{row.date_livraison || row.dateLivraison}</div>
      )
    },
    {
      header: 'Articles',
      key: 'articles',
      render: (_, row) => {
        const arts = (row.articles || []).slice(0, 2);
        return (
          <div className="text-sm text-gray-700">
            {arts.map((art, i) => (
              <div key={i} className="text-xs">• {art.produit || art.nom}</div>
            ))}
            {(row.articles || []).length > 2 && (
              <div className="text-xs text-blue-600">+{(row.articles || []).length - 2} autre(s)</div>
            )}
          </div>
        );
      }
    },
    {
      header: 'Montant TTC',
      key: 'montantTTC',
      render: (_, row) => (
        <div>
          <div className="font-bold text-gray-900">{Number(row.montant_ttc || row.montantTTC || 0).toLocaleString()} DA</div>
          <div className="text-xs text-gray-500">HT: {Number(row.montant_ht || row.montantHT || 0).toLocaleString()} DA</div>
        </div>
      )
    },
    {
      header: 'Statut',
      key: 'statut',
      type: 'badge' // géré par getStatusStyle dans DataTable
    }
  ];

  // Fonctions modales
  const closeModal = () => {
    setShowModal(false);
    setSelectedCommande(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedCommande) {
      setSubmitLoading(true);
      try {
        await updateCommandeStatus(selectedCommande.id, newStatus);
        setSelectedCommande({ ...selectedCommande, statut: newStatus });
      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim()) {
      searchCommandes(value);
    } else {
      fetchCommandes(1);
    }
  };

  const handleFilterStatus = async (status) => {
    setSelectedStatus(status);
    clearError();
    if (status === 'all') {
      fetchCommandes(1);
    } else {
      await filterByStatut(status);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <Header
        title="Gestion des Commandes"
        subtitle={`${filteredCommandes.length} commandes`}
        navigationLinks={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Gestion clients', href: '/gestion-clients' },
          { label: 'Gestion des devis', href: '/gestion-devis' },
          { label: 'Gestion des stocks', href: '/gestion-de-stock' },
          { label: 'Gestion des factures', href: '/gestion-de-facture' },
          { label: 'Gestion des dépenses', href: '/gestion-depenses' }
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

        {/* FILTRES + RECHERCHE */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <TableSearch
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Rechercher par numéro, client..."
                disabled={loading}
              />
            </div>
          </div>

          <FilterBar
            filters={statusOptions}
            onFilterChange={handleFilterStatus}
            showSearch={false}
          />
        </div>

        {/* TABLEAU */}
        {loading && !searchTerm ? (
          <div className="bg-white p-8 rounded-xl text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="mt-4 text-gray-500">Chargement des commandes...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredCommandes}
            actions={actions}
            itemsPerPage={10}
          />
        )}
      </main>

      {/* MODAL DÉTAILS */}
      {showModal && selectedCommande && (
        <Modal isOpen={true} title={`Détails - ${selectedCommande.numero || selectedCommande.id}`} onClose={closeModal}>
          <div className="space-y-6 text-sm">
            {/* Client */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><User className="w-4 h-4" /> Client</h3>
              <p><strong>{selectedCommande.client?.nom || selectedCommande.clientNom}</strong></p>
              <p className="flex items-center gap-1"><Phone className="w-4 h-4" /> {selectedCommande.client?.telephone || selectedCommande.clientTel}</p>
              <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedCommande.client?.adresse || selectedCommande.clientAdresse}</p>
            </div>

            {/* Articles */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Package className="w-4 h-4" /> Articles</h3>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedCommande.articles || []).map((a, i) => (
                  <li key={i}>{a.quantite}x {a.produit || a.nom} {a.dimensions ? `(${a.dimensions})` : ''} — {(a.prix || 0).toLocaleString()} DA</li>
                ))}
              </ul>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div>Total HT : {Number(selectedCommande.montant_ht || selectedCommande.montantHT || 0).toLocaleString()} DA</div>
              <div>Total TTC : {Number(selectedCommande.montant_ttc || selectedCommande.montantTTC || 0).toLocaleString()} DA</div>
            </div>

            {/* Dates */}
            <div className="flex gap-4">
              <div><Calendar className="inline w-4 h-4 mr-1" /> Commande : {selectedCommande.date_commande || selectedCommande.dateCommande}</div>
              <div><Truck className="inline w-4 h-4 mr-1" /> Livraison : {selectedCommande.date_livraison || selectedCommande.dateLivraison}</div>
            </div>

            {/* Notes */}
            {(selectedCommande.notes || selectedCommande.remarques) && (
              <div>
                <h3 className="font-semibold mb-1">Notes</h3>
                <p className="bg-yellow-50 p-2 rounded text-yellow-800">{selectedCommande.notes || selectedCommande.remarques}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <select 
                value={selectedCommande.statut || 'En production'}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={submitLoading}
                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
              >
                <option value="En production">En production</option>
                <option value="Prête">Prête</option>
                <option value="Livrée">Livrée</option>
                <option value="Annulée">Annulée</option>
              </select>
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">Télécharger PDF</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}