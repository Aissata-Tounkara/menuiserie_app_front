import React, { useState } from 'react';
import { 
  Users, Package, ShoppingCart, AlertCircle, CheckCircle, Clock, DollarSign 
} from 'lucide-react';

// Import des composants
import Header from './components/layout/Header';
import StatCard from './components/ui/Cards';
import DataTable from './components/tables/DataTable'; // Chemin à adapter si nécessaire

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('mois');

  // Données des commandes récentes
  const recentOrders = [
    { id: 'CMD-001', client: 'Ahmed Benali', produit: 'Fenêtre coulissante', montant: 45000, statut: 'En production', date: '12/01/2026' },
    { id: 'CMD-002', client: 'Ahmed Benali', produit: 'Fenêtre toilette', montant: 37500, statut: 'En production', date: '12/01/2026' },
    { id: 'CMD-003', client: 'Fatima Kader', produit: 'Porte 2Battan', montant: 78500, statut: 'Livrée', date: '13/01/2026' },
    { id: 'CMD-004', client: 'Karim Meziane', produit: 'Porte 1Battan', montant: 32000, statut: 'En attente', date: '06/02/2026' },
    { id: 'CMD-005', client: 'Leila Sahraoui', produit: 'Porte toilette', montant: 95000, statut: 'En production', date: '07/11/2026' },
    { id: 'CMD-006', client: 'Omar Sy', produit: 'Baie Vitrée', montant: 120000, statut: 'En attente', date: '08/02/2026' },
  ];

  const totalRevenus = recentOrders.reduce((total, order) => total + order.montant, 0);

  // Configuration des colonnes — compatible avec le nouveau DataTable
  const columns = [
    { 
      header: 'Commande', 
      key: 'id',
      render: (value, row) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
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
      header: 'Produit', 
      key: 'produit',
      render: (value) => <span className="text-sm text-gray-700">{value}</span>
    },
    { 
      header: 'Montant', 
      key: 'montant',
      render: (value) => <span className="text-sm font-semibold text-gray-900">{value.toLocaleString('fr-FR')} FCFA</span>
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
    onChange: (e) => setSelectedPeriod(e.target.value),
    options: [
      { value: 'semaine', label: 'Cette semaine' },
      { value: 'mois', label: 'Ce mois' },
      { value: 'trimestre', label: 'Ce trimestre' },
      { value: 'annee', label: 'Cette année' }
    ]
  };

  const statsData = [
    { icon: ShoppingCart, value: recentOrders.length, label: 'Commandes du mois', iconColor: 'bg-blue-500' },
    { icon: DollarSign, value: `${totalRevenus.toLocaleString('fr-FR')} FCFA`, label: 'Revenus', iconColor: 'bg-green-500' },
    { icon: Users, value: 128, label: 'Clients actifs', iconColor: 'bg-purple-500' },
    { icon: Package, value: 156, label: 'Produits', iconColor: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Menuiserie Aluminium"
        subtitle="Gestion des commandes et production"
        navigationLinks={navigationLinks}
        selectAction={selectConfig}
        userAvatar="A"
        userName="Admin"
      />

      <div className="p-6">
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
              data={recentOrders}
              itemsPerPage={5} // Affiche 5 commandes par page
            />
          </div>

          {/* Alerts Section */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 text-sm">Stock faible</h3>
                  <p className="text-xs text-yellow-700 mt-1">5 articles nécessitent un réapprovisionnement</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm">Devis en attente</h3>
                  <p className="text-xs text-blue-700 mt-1">12 devis attendent une validation</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 text-sm">Livraisons du jour</h3>
                  <p className="text-xs text-green-700 mt-1">8 commandes prêtes pour livraison</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}