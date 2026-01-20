import React, { useState, useEffect } from 'react';
import { 
  Users, Package, ShoppingCart, AlertCircle, CheckCircle, Clock, DollarSign, Loader, RefreshCw
} from 'lucide-react';

// Import des composants
import Header from './components/layout/Header';
import StatCard from './components/ui/Cards';
import DataTable from './components/tables/DataTable';

// Store
import { useDashboardStore } from './lib/store/dashboardStore';

export default function Dashboard() {
  // Store hooks
  const {
    dashboardStats,
    dashboardLoading,
    dashboardError,
    selectedPeriod,
    fetchAllDashboardData,
    fetchStatsByPeriod,
    setPeriod,
  } = useDashboardStore();

  // Local state
 

  // Charger les données au montage
  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  // Charger les stats quand la période change
  useEffect(() => {
    if (selectedPeriod !== 'mois') {
      const periodMap = {
        'semaine': 'week',
        'mois': 'month',
        'trimestre': 'quarter',
        'annee': 'year'
      };
      fetchStatsByPeriod(periodMap[selectedPeriod] || 'month');
    }
  }, [selectedPeriod, fetchStatsByPeriod]);

  // Configuration des colonnes — compatible avec le nouveau DataTable
  const columns = [
  { 
    header: 'Commande', 
    key: 'numero_commande',
    render: (_, row) => (
      <div>
        <div className="font-semibold text-gray-900">{row.numero_commande}</div>
        <div className="text-xs text-gray-500">{row.date}</div>
      </div>
    )
  },
  { 
    header: 'Client', 
    key: 'client',
    render: (value) => <span className="text-sm text-gray-700">{value}</span>
  },
  { 
    header: 'Montant', 
    key: 'montant_ttc',
    render: (value) => (
      <span className="text-sm font-semibold text-gray-900">
        {value ? value.toLocaleString('fr-FR') : '0'} FCFA
      </span>
    )
  },
  { 
    header: 'Statut', 
    key: 'statut',
    render: (value) => {
      const getStatutColor = (statut) => {
        switch(statut) {
          case 'Livrée': return 'bg-green-100 text-green-800';
          case 'En production': return 'bg-blue-100 text-blue-800';
          case 'En attente': return 'bg-yellow-100 text-yellow-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      };
      
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(value)}`}>
          {value}
        </span>
      );
    }
  }
];

  const navigationLinks = [
    { label: 'Gestion clients', href: '/gestion-clients' },
    { label: 'Gestion des Commandes', href: '/gestion-commandes' },
    { label: 'Gestion des devis', href: '/gestion-devis' },
    { label: 'Gestion des dépenses', href: '/gestion-depenses' },
    { label: 'Gestion des stocks', href: '/gestion-de-stock' },
    { label: 'Gestion des factures', href: '/gestion-de-facture' }
  ];

  const selectConfig = {
    value: selectedPeriod,
    onChange: (value) => setPeriod(value),
    options: [
      { value: 'semaine', label: 'Cette semaine' },
      { value: 'mois', label: 'Ce mois' },
      { value: 'trimestre', label: 'Ce trimestre' },
      { value: 'annee', label: 'Cette année' }
    ]
  };

  // Données des stats basées sur l'API
  const totalRevenus = dashboardStats?.stats?.revenus || 0;
const totalClients = dashboardStats?.stats?.clients_actifs || 0;
const totalProducts = dashboardStats?.stats?.produits || 0;
const totalOrders = dashboardStats?.stats?.commandes || 0;
// Alertes
const stockAlerts = dashboardStats?.alertes?.stock_faible || 0;
const pendingQuotes = dashboardStats?.alertes?.devis_en_attente || 0;
const readyDeliveries = dashboardStats?.alertes?.livraisons_du_jour || 0;

  const statsData = [
    { icon: ShoppingCart, value: totalOrders, label: 'Commandes du mois', iconColor: 'bg-blue-500' },
    { icon: DollarSign, value: `${totalRevenus.toLocaleString('fr-FR')} Fcfa`, label: 'Revenus', iconColor: 'bg-green-500' },
    { icon: Users, value: totalClients, label: 'Clients actifs', iconColor: 'bg-purple-500' },
    { icon: Package, value: totalProducts, label: 'Produits', iconColor: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Afficher l'erreur si elle existe */}
      {dashboardError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <p className="text-red-700">{dashboardError}</p>
        </div>
      )}

      <Header
        title="Menuiserie Aluminium"
        subtitle={dashboardLoading ? "Chargement..." : "Gestion des commandes et production"}
        navigationLinks={navigationLinks}
        selectAction={selectConfig}
        userAvatar="A"
        userName="Admin"
        actions={[
          {
            label: 'Rafraîchir',
            icon: <RefreshCw className="w-4 h-4" />,
            onClick: () => fetchAllDashboardData(),
            variant: 'secondary'
          }
        ]}
      />

      <div className="p-6">
        {/* Afficher le spinner de chargement */}
        {dashboardLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="flex items-center gap-2">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
              <p className="text-gray-600">Chargement des données du dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {statsData.map((stat, index) => (
                <StatCard
                  key={index}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  iconColor={stat.iconColor}
                />
              ))}
            </div>

            {/* Recent Orders avec DataTable */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Commandes récentes</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Voir tout →</button>
                </div>

                {/* Utilisation directe de DataTable */}
                <DataTable 
                  columns={columns}
                  data={dashboardStats?.commandes_recentes || []}
                  itemsPerPage={5}
                />
                {(!dashboardStats?.commandes_recentes || dashboardStats.commandes_recentes.length === 0) && (
                <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                  Aucune commande récente disponible
                </div>
                )}
              </div>

              {/* Alerts Section */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className={`border rounded-lg p-4 flex items-start gap-3 ${stockAlerts > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${stockAlerts > 0 ? 'text-yellow-600' : 'text-gray-600'}`} />
                    <div>
                      <h3 className={`font-semibold text-sm ${stockAlerts > 0 ? 'text-yellow-900' : 'text-gray-900'}`}>Stock faible</h3>
                      <p className={`text-xs mt-1 ${stockAlerts > 0 ? 'text-yellow-700' : 'text-gray-600'}`}>
                        {stockAlerts} article(s) nécessitent un réapprovisionnement
                      </p>
                    </div>
                  </div>
                  <div className={`border rounded-lg p-4 flex items-start gap-3 ${pendingQuotes > 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <Clock className={`w-5 h-5 mt-0.5 ${pendingQuotes > 0 ? 'text-blue-600' : 'text-gray-600'}`} />
                    <div>
                      <h3 className={`font-semibold text-sm ${pendingQuotes > 0 ? 'text-blue-900' : 'text-gray-900'}`}>Devis en attente</h3>
                      <p className={`text-xs mt-1 ${pendingQuotes > 0 ? 'text-blue-700' : 'text-gray-600'}`}>
                        {pendingQuotes} devis attendent une validation
                      </p>
                    </div>
                  </div>
                  <div className={`border rounded-lg p-4 flex items-start gap-3 ${readyDeliveries > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <CheckCircle className={`w-5 h-5 mt-0.5 ${readyDeliveries > 0 ? 'text-green-600' : 'text-gray-600'}`} />
                    <div>
                      <h3 className={`font-semibold text-sm ${readyDeliveries > 0 ? 'text-green-900' : 'text-gray-900'}`}>Livraisons du jour</h3>
                      <p className={`text-xs mt-1 ${readyDeliveries > 0 ? 'text-green-700' : 'text-gray-600'}`}>
                        {readyDeliveries} commande(s) prête(s) pour livraison
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}