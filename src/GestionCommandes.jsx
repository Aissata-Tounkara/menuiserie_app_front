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

export default function GestionCommandes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);

  const location = useLocation();
  const [highlightedId, setHighlightedId] = useState(null);

  // Données simulées
  const initialCommandes = [
    {
      id: 'CMD-2024-001',
      clientNom: 'Ahmed Benali',
      clientTel: '0555 123 456',
      clientAdresse: '15 Rue des Martyrs, Oran',
      dateCommande: '08/11/2024',
      dateLivraison: '15/11/2024',
      statut: 'En production',
      montantHT: 142000,
      montantTTC: 169180,
      articles: [
        { produit: 'Fenêtre coulissante', quantite: 2, dimensions: '1.20m × 1.50m', prix: 30000 },
        { produit: 'Porte d\'entrée', quantite: 1, dimensions: '0.90m × 2.15m', prix: 65000 },
        { produit: 'Volet roulant', quantite: 2, dimensions: '1.20m × 1.50m', prix: 44000 }
      ],
      notes: 'Client demande livraison matinée'
    },
    // ... (ajoute les autres commandes ici, mais avec format plat : clientNom, clientTel, etc.)
    {
      id: 'CMD-2024-002',
      clientNom: 'Fatima Kader',
      clientTel: '0661 234 567',
      clientAdresse: '32 Cité Es-Salam, Oran',
      dateCommande: '07/11/2024',
      dateLivraison: '14/11/2024',
      statut: 'Livrée',
      montantHT: 78500,
      montantTTC: 93415,
      articles: [{ produit: 'Porte d\'entrée blindée', quantite: 1, dimensions: '0.90m × 2.15m', prix: 78500 }],
      notes: ''
    },
    {
      id: 'CMD-2024-005',
      clientNom: 'Rachid Bouabdallah',
      clientTel: '0661 567 890',
      clientAdresse: '12 Rue de la Paix, Oran',
      dateCommande: '04/11/2024',
      dateLivraison: '12/11/2024',
      statut: 'Prête',
      montantHT: 185000,
      montantTTC: 220150,
      articles: [
        { produit: 'Fenêtre oscillo-battante', quantite: 6, dimensions: '0.80m × 1.20m', prix: 99000 },
        { produit: 'Porte-fenêtre', quantite: 2, dimensions: '1.80m × 2.15m', prix: 70000 },
        { produit: 'Garde-corps aluminium', quantite: 2, dimensions: '1.00m × 1.00m', prix: 56000 }
      ],
      notes: 'Prêt pour enlèvement'
    },
    {
      id: 'CMD-2024-008',
      clientNom: 'Nabil Hamidi',
      clientTel: '0555 789 012',
      clientAdresse: '5 Avenue de l\'Indépendance, Es Senia',
      dateCommande: '01/11/2024',
      dateLivraison: '09/11/2024',
      statut: 'Annulée',
      montantHT: 28000,
      montantTTC: 33320,
      articles: [{ produit: 'Volet battant', quantite: 4, dimensions: '0.60m × 1.40m', prix: 28000 }],
      notes: 'Annulée à la demande du client'
    }
  ];

  const [commandes] = useState(initialCommandes);

  // Effet pour surligner une commande depuis un devis
  useEffect(() => {
    if (location.state?.createdFromDevis) {
      const id = location.state.createdFromDevis;
      setHighlightedId(id);
      setSearchTerm(id);
    }
  }, [location]);

  // Filtres dynamiques
  const statusOptions = [
    { label: 'Tous', value: 'all', count: commandes.length },
    { label: 'En production', value: 'En production', count: commandes.filter(c => c.statut === 'En production').length },
    { label: 'Prête', value: 'Prête', count: commandes.filter(c => c.statut === 'Prête').length },
    { label: 'Livrée', value: 'Livrée', count: commandes.filter(c => c.statut === 'Livrée').length },
    { label: 'Annulée', value: 'Annulée', count: commandes.filter(c => c.statut === 'Annulée').length }
  ];

  // Données filtrées
  const filteredCommandes = useMemo(() => {
    return commandes.filter(cmd => {
      const matchStatus = selectedStatus === 'all' || cmd.statut === selectedStatus;
      const matchSearch = 
        cmd.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.clientTel.includes(searchTerm);
      return matchStatus && matchSearch;
    });
  }, [searchTerm, selectedStatus, commandes]);

  // Stats
  const statsCards = [
    { label: 'Total commandes', value: commandes.length, color: 'bg-blue-500', icon: Package },
    { label: 'En production', value: commandes.filter(c => c.statut === 'En production').length, color: 'bg-purple-500', icon: Package },
    { label: 'Prêtes', value: commandes.filter(c => c.statut === 'Prête').length, color: 'bg-orange-500', icon: AlertCircle },
    { label: 'Livrées ce mois', value: commandes.filter(c => c.statut === 'Livrée').length, color: 'bg-green-500', icon: Truck }
  ];

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
      render: (_, row) => (
        <div>
          <div className={`font-semibold ${row.id === highlightedId ? 'text-yellow-600' : 'text-blue-600'}`}>
            {row.id}
          </div>
          <div className="text-xs text-gray-500">{row.articles.length} article(s)</div>
        </div>
      )
    },
    {
      header: 'Client',
      key: 'clientNom',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.clientNom}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {row.clientTel}
          </div>
        </div>
      )
    },

    //  {
    //   header: 'devis',
    //   key: 'id',
    //   render: (_, row) => (
    //     <div>
    //       <div className={`font-semibold ${row.id === highlightedId ? 'text-yellow-600' : 'text-blue-600'}`}>
    //         {row.id}
    //       </div>
    //       <div className="text-xs text-gray-500">{row.devis.length} devis</div>
    //     </div>
    //   )
    // },
    
    
    {
      header: 'Date commande',
      key: 'dateCommande',
      render: (_, row) => (
        <div className="text-sm text-gray-700 flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          {row.dateCommande}
        </div>
      )
    },
    {
      header: 'Livraison prévue',
      key: 'dateLivraison',
      render: (_, row) => (
        <div className="text-sm font-medium text-gray-900">{row.dateLivraison}</div>
      )
    },
    {
      header: 'Articles',
      key: 'articles',
      render: (_, row) => {
        const arts = row.articles.slice(0, 2);
        return (
          <div className="text-sm text-gray-700">
            {arts.map((art, i) => (
              <div key={i} className="text-xs">• {art.produit}</div>
            ))}
            {row.articles.length > 2 && (
              <div className="text-xs text-blue-600">+{row.articles.length - 2} autre(s)</div>
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
          <div className="font-bold text-gray-900">{Number(row.montantTTC).toLocaleString()} DA</div>
          <div className="text-xs text-gray-500">HT: {Number(row.montantHT).toLocaleString()} DA</div>
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
                onChange={setSearchTerm}
                placeholder="Rechercher par numéro, client..."
              />
            </div>
          </div>

          <FilterBar
            filters={statusOptions}
            onFilterChange={setSelectedStatus}
            showSearch={false}
          />
        </div>

        {/* TABLEAU */}
        <DataTable
          columns={columns}
          data={filteredCommandes}
          actions={actions}
          itemsPerPage={10}
        />
      </main>

      {/* MODAL DÉTAILS */}
      {showModal && selectedCommande && (
        <Modal isOpen={true} title={`Détails - ${selectedCommande.id}`} onClose={closeModal}>
          <div className="space-y-6 text-sm">
            {/* Client */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><User className="w-4 h-4" /> Client</h3>
              <p><strong>{selectedCommande.clientNom}</strong></p>
              <p className="flex items-center gap-1"><Phone className="w-4 h-4" /> {selectedCommande.clientTel}</p>
              <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedCommande.clientAdresse}</p>
            </div>

            {/* Articles */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2"><Package className="w-4 h-4" /> Articles</h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedCommande.articles.map((a, i) => (
                  <li key={i}>{a.quantite}x {a.produit} ({a.dimensions}) — {a.prix.toLocaleString()} Fcfa</li>
                ))}
              </ul>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div>Total HT : {selectedCommande.montantHT.toLocaleString()} Fcfa</div>
              <div>Total TTC : {selectedCommande.montantTTC.toLocaleString()} Fcfa</div>
            </div>

            {/* Dates */}
            <div className="flex gap-4">
              <div><Calendar className="inline w-4 h-4 mr-1" /> Commande : {selectedCommande.dateCommande}</div>
              <div><Truck className="inline w-4 h-4 mr-1" /> Livraison : {selectedCommande.dateLivraison}</div>
            </div>

            {/* Notes */}
            {selectedCommande.notes && (
              <div>
                <h3 className="font-semibold mb-1">Notes</h3>
                <p className="bg-yellow-50 p-2 rounded text-yellow-800">{selectedCommande.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Modifier</button>
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">PDF</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}