import React, { useState } from 'react';
import { BarChart3, Users, Package, ShoppingCart, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('mois');
 const [showLinks, setShowLinks] = useState(false);
  const stats = [
    { label: 'Commandes du mois', value: '47', change: '+12%', icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Revenus', value: '285,450 DA', change: '+8%', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Clients actifs', value: '128', change: '+5%', icon: Users, color: 'bg-purple-500' },
    { label: 'Produits', value: '156', change: '+2', icon: Package, color: 'bg-orange-500' }
  ];

  const recentOrders = [
    { id: 'CMD-001', client: 'Ahmed Benali', produit: 'Fenêtre coulissante', montant: '45,000 DA', statut: 'En production', date: '08/11/2024' },
    { id: 'CMD-002', client: 'Fatima Kader', produit: 'Porte d\'entrée', montant: '78,500 DA', statut: 'Livrée', date: '07/12/2024' },
    { id: 'CMD-003', client: 'Karim Meziane', produit: 'Volets roulants', montant: '32,000 DA', statut: 'En attente', date: '06/12/2025' },
    { id: 'CMD-004', client: 'Leila Sahraoui', produit: 'Baie vitrée', montant: '95,000 DA', statut: 'En production', date: '05/11/2024' }
  ];

  const topProducts = [
    { nom: 'Fenêtre coulissante', ventes: 23, revenus: '892,000 DA' },
    { nom: 'Porte d\'entrée', ventes: 15, revenus: '1,245,000 DA' },
    { nom: 'Volets roulants', ventes: 18, revenus: '576,000 DA' },
    { nom: 'Baie vitrée', ventes: 12, revenus: '1,140,000 DA' }
  ];

  const getStatutColor = (statut) => {
    switch(statut) {
      case 'Livrée': return 'bg-green-100 text-green-800';
      case 'En production': return 'bg-blue-100 text-blue-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
               
                       <div
                       className={`${
                         showLinks ? "grid grid-cols-2 gap-2" : "hidden"
                       } sm:flex sm:items-center sm:justify-between sm:gap-2`}
                     >
                       <Link
                         to="/gestion-clients"
                         className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
                       >
                         Gestion clients
                       </Link>
                 <Link to="/gestion-commandes" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200" >
                          Gestion des Commandes
                       </Link> 

                       <Link
                         to="/gestion-devis"
                         className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
                       >
                         Gestion des devis
                       </Link>
                       <Link
                         to="/gestion-depenses"
                         className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
                       >
                         Gestion des dépenses
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
                     </div>      
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Menuiserie Aluminium</h1>
              <p className="text-sm text-gray-500 mt-1">Gestion des commandes et production</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
                <option value="trimestre">Ce trimestre</option>
                <option value="annee">Cette année</option>
              </select>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Admin</span>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Commandes récentes</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Voir tout →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Commande</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Produit</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Montant</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{order.id}</div>
                        <div className="text-xs text-gray-500">{order.date}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.client}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{order.produit}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">{order.montant}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(order.statut)}`}>
                          {order.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Produits populaires</h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">{product.nom}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {product.ventes} ventes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(product.ventes / 25) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{product.revenus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
  );
}