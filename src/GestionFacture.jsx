import React, { useState } from 'react';
import { Search, Filter, Eye, Download, Send, DollarSign, AlertCircle, CheckCircle, Clock, XCircle, Calendar, User, CreditCard, FileText, Printer, Plus, Trash2 } from 'lucide-react';
import { Hammer, Wrench } from 'lucide-react';

export default function GestionFactures() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [factureToConfirm, setFactureToConfirm] = useState(null);

  const statuses = ['Tous', 'Payée', 'En attente', 'En retard'];

  const [factures, setFactures] = useState([
    {
      id: 'FAC-2024-001',
      numeroFacture: 'F-001/2024',
      commande: 'CMD-2024-001',
      client: { nom: 'Ahmed Benali', tel: '0555 123 456', email: 'ahmed.benali@email.dz', adresse: '15 Rue des Martyrs, Oran' },
      dateEmission: '08/11/2024',
      dateEcheance: '23/11/2024',
      montantHT: 142000,
      tva: 26980,
      montantTTC: 169180,
      montantPaye: 169180,
      statut: 'Non payée',
      modePaiement: 'Virement bancaire',
      datePaiement: '10/11/2024',
      articles: [
        { designation: 'Fenêtre coulissante 1.20m × 1.50m', quantite: 2, prixUnitaire: 15000, total: 30000 },
        { designation: 'Porte d\'entrée 0.90m × 2.15m', quantite: 1, prixUnitaire: 65000, total: 65000 },
        { designation: 'Volet roulant 1.20m × 1.50m', quantite: 2, prixUnitaire: 22000, total: 44000 },
        { designation: 'Installation et pose', quantite: 1, prixUnitaire: 3000, total: 3000 }
      ]
    },
    {
      id: 'FAC-2024-002',
      numeroFacture: 'F-002/2024',
      commande: 'CMD-2024-002',
      client: { nom: 'Fatima Kader', tel: '0661 234 567', email: 'fatima.kader@email.dz', adresse: '32 Cité Es-Salam, Oran' },
      dateEmission: '07/11/2024',
      dateEcheance: '22/11/2024',
      montantHT: 78500,
      tva: 14915,
      montantTTC: 93415,
      montantPaye: 0,
      statut: 'En attente',
      modePaiement: 'Espèces',
      datePaiement: '',
      articles: [
        { designation: 'Porte d\'entrée blindée 0.90m × 2.15m', quantite: 1, prixUnitaire: 78500, total: 78500 }
      ]
    }
  ]);

  const getActualStatus = (facture) => {
    // Si la facture est payée, retourner "Payée"
    if (facture.montantPaye >= facture.montantTTC) {
      return 'Payée';
    }

    // Convertir la dateEcheance au format comparable
    const [jour, mois, annee] = facture.dateEcheance.split('/');
    const echeanceDate = new Date(annee, mois - 1, jour);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    echeanceDate.setHours(0, 0, 0, 0);

    // Si la date d'échéance est passée, c'est "En retard"
    if (echeanceDate < today) {
      return 'En retard';
    }

    // Sinon c'est "En attente"
    return 'En attente';
  };

  const filteredFactures = factures.map(facture => ({
    ...facture,
    statutCalcule: getActualStatus(facture)
  })).filter(facture => {
    const matchStatus = selectedStatus === 'Tous' || facture.statutCalcule === selectedStatus;
    const matchSearch = facture.numeroFacture.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       facture.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusIcon = (statut) => {
    switch(statut) {
      case 'Payée': return CheckCircle;
      case 'En attente': return Clock;
      case 'En retard': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (statut) => {
    switch(statut) {
      case 'Payée': return 'bg-green-100 text-green-800 border-green-300';
      case 'En attente': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'En retard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const calculateTotalCA = () => {
    return factures.filter(f => getActualStatus(f) === 'Payée').reduce((sum, f) => sum + f.montantTTC, 0);
  };

  const calculateTotalEnAttente = () => {
    return factures.filter(f => {
      const status = getActualStatus(f);
      return status === 'En attente' || status === 'En retard';
    }).reduce((sum, f) => sum + (f.montantTTC - f.montantPaye), 0);
  };

  const statsCards = [
    { label: 'Total factures', value: factures.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Chiffre d\'affaires', value: `${calculateTotalCA().toLocaleString()} Fcfa`, icon: DollarSign, color: 'bg-green-500' },
    { label: 'En attente', value: `${calculateTotalEnAttente().toLocaleString()} Fcfa`, icon: Clock, color: 'bg-orange-500' },
    { label: 'Factures payées', value: factures.filter(f => getActualStatus(f) === 'Payée').length, icon: CheckCircle, color: 'bg-purple-500' }
  ];

  const openModal = (facture) => {
    setSelectedFacture(facture);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFacture(null);
  };

  const openConfirmModal = (facture) => {
    if (getActualStatus(facture) !== 'Payée') {
      setFactureToConfirm(facture);
      setShowConfirmModal(true);
    }
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setFactureToConfirm(null);
  };

  const confirmMarkAsPaid = () => {
    if (!factureToConfirm) return;

    const updatedFactures = factures.map(f => {
      if (f.id === factureToConfirm.id) {
        return {
          ...f,
          statut: 'Payée',
          montantPaye: f.montantTTC
        };
      }
      return f;
    });

    setFactures(updatedFactures);
    if (selectedFacture && selectedFacture.id === factureToConfirm.id) {
      const updated = updatedFactures.find(f => f.id === factureToConfirm.id);
      setSelectedFacture(updated);
    }
    closeConfirmModal();
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <button className="sm:hidden mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => setShowLinks(!showLinks)}
          > 
            {showLinks ? "Fermer le menu" : "Afficher le menu"}
          </button>
                  
          <div className={`${showLinks ? "grid grid-cols-2 gap-2" : "hidden"} sm:flex sm:items-center sm:justify-between sm:gap-2`}>
            <a href="/dashboard" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">
              Dashboard
            </a>
            <a href="/gestion-clients" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">
              Gestion clients
            </a>
            <a href="/gestion-commandes" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">
              Gestion des Commandes
            </a>
            <a href="/gestion-de-stock" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">
              Gestion des stocks
            </a>
            <a href="/gestion-devis" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">
              Gestion des devis
            </a>
            <a href="/gestion-de-facture" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">
              Gestion des factures
            </a>
            <a href="/gestion-depenses" className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200">
              Gestion des dépenses
            </a>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Factures</h1>
              <p className="text-sm text-gray-500 mt-1">{filteredFactures.length} factures</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exporter
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par numéro de facture, client..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
                {status !== 'Tous' && (
                  <span className="ml-2 text-xs">
                    ({factures.filter(f => getActualStatus(f) === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Factures Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">N° Facture</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date émission</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Échéance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Montant TTC</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Payé</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFactures.map((facture) => {
                  const StatusIcon = getStatusIcon(facture.statutCalcule);
                  const reste = facture.montantTTC - facture.montantPaye;
                  return (
                    <tr key={facture.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-blue-600">{facture.numeroFacture}</div>
                        <div className="text-xs text-gray-500">{facture.commande}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{facture.client.nom}</div>
                        <div className="text-xs text-gray-500">{facture.client.tel}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-700 flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {facture.dateEmission}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-900">{facture.dateEcheance}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{facture.montantTTC.toLocaleString()} Fcfa</div>
                        <div className="text-xs text-gray-500">HT: {facture.montantHT.toLocaleString()} Fcfa</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-semibold text-green-600">{facture.montantPaye.toLocaleString()} Fcfa</div>
                          {reste > 0 && (
                            <div className="text-xs text-orange-600">Reste: {reste.toLocaleString()} Fcfa</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span 
                          onClick={() => openConfirmModal(facture)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusColor(facture.statutCalcule)} ${facture.statutCalcule !== 'Payée' ? 'cursor-pointer hover:opacity-80' : ''}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {facture.statutCalcule}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openModal(facture)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Télécharger PDF">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Envoyer par email">
                            <Send className="w-4 h-4" />
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

      

      {/* Modal Details Facture */}
      {showModal && selectedFacture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
<div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">

  {/* Ligne 1 : Logo tournevis + Nom entreprise */}
  <div className="flex items-start space-x-4 mb-3">
    {/* Logo tournevis (à la place du marteau) */}
    <div className="bg-teal-500 rounded-lg p-3 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2v4M12 18v4M4 12h4M16 12h4M7.5 7.5l2.5 2.5M14 14l2.5 2.5M16.5 7.5l-2.5 2.5M10 14L7.5 16.5"/>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    </div>
    <div>
      <h1 className="text-2xl font-bold">TOUARA</h1>
      <p className="text-teal-300 text-sm">Menuiserie Aluminium</p>
    </div>
  </div>

  {/* Adresse complète */}
  <div className="text-xs leading-tight mb-6">
    <p><strong>Chez Moussa TOUNKARA</strong></p>
    <p>COMMERÇANT – FAUTEUILLE BUREAUTIQUE – ALUMINIUM ALTRADE, BRONZE, CHAMPAGNE – LAC BLANC – FER – BOIS</p>
    <p>HIPPODROME Rue 224 — Tél : 79 06 44 89 — NIF : 0822099M</p>
    <p>Bamako – République du Mali</p>
  </div>

  {/* Facture + Icônes + Date — alignés à droite */}
  <div className="flex justify-end items-end space-x-4">
    
    <div className="flex flex-col items-end space-y-4">
      {/* FACTURE avec icônes */}
      <div className="flex items-center space-x-2">
        <h2 className="text-3xl font-extrabold">FACTURE</h2>
        
        {/* Icônes rondes */}
        <div className="flex space-x-2">
          {/* Pince universelle (Wrench) */}
          <div className="bg-teal-500 rounded-full p-2 hover:bg-teal-600 transition">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          
          {/* Tournevis (SVG personnalisé) */}
          <div className="bg-teal-500 rounded-full p-2 hover:bg-teal-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2v4M12 18v4M4 12h4M16 12h4M7.5 7.5l2.5 2.5M14 14l2.5 2.5M16.5 7.5l-2.5 2.5M10 14L7.5 16.5"/>
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="bg-gray-700 rounded-md px-4 py-2 text-center">
        <span className="block text-xs text-teal-300">Date d'émission</span>
        <span className="text-sm font-semibold">09/01/2026</span>
      </div>
    </div>

  </div>
</div>


            <div className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <span 
                  onClick={() => openConfirmModal(selectedFacture)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(getActualStatus(selectedFacture))} ${getActualStatus(selectedFacture) !== 'Payée' ? 'cursor-pointer hover:opacity-80' : ''}`}
                >
                  {React.createElement(getStatusIcon(getActualStatus(selectedFacture)), { className: "w-4 h-4" })}
                  {getActualStatus(selectedFacture)}
                </span>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Détails de la facture</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Désignation</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Qté</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Prix unit.</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFacture.articles.map((article, idx) => (
                        <tr key={idx} className="border-t border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{article.designation}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-center">{article.quantite}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">{article.prixUnitaire.toLocaleString()} Fcfa</td>
                          <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">{article.total.toLocaleString()} Fcfa</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total HT:</span>
                    <span className="font-semibold text-gray-900">{selectedFacture.montantHT.toLocaleString()} Fcfa</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">TVA (0%):</span>
                    <span className="font-semibold text-gray-900">{selectedFacture.tva.toLocaleString()} Fcfa</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 flex justify-between text-lg">
                    <span className="font-bold text-gray-900">Total TTC:</span>
                    <span className="font-bold text-blue-600">{selectedFacture.montantTTC.toLocaleString()} Fcfa</span>
                  </div>
                  {selectedFacture.montantPaye > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Montant payé:</span>
                        <span className="font-semibold">{selectedFacture.montantPaye.toLocaleString()} Fcfa</span>
                      </div>
                      {selectedFacture.montantTTC - selectedFacture.montantPaye > 0 && (
                        <div className="flex justify-between text-sm text-orange-600">
                          <span className="font-semibold">Reste à payer:</span>
                          <span className="font-bold">{(selectedFacture.montantTTC - selectedFacture.montantPaye).toLocaleString()} Fcfa</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {getActualStatus(selectedFacture) === 'Payée' && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Paiement effectué</h4>
                  </div>
                  <div className="text-sm text-green-800 space-y-1 ml-8">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Mode: {selectedFacture.modePaiement}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date: {selectedFacture.datePaiement}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Télécharger PDF
                </button>
                <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Envoyer par email
                </button>
                <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Paiement */}
      
      {/* Modal Confirmation */}
      {showConfirmModal && factureToConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
              <h2 className="text-xl font-bold">Confirmation</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-gray-900 font-semibold">Voulez-vous marquer cette facture comme payée ?</p>
                  <p className="text-sm text-gray-500 mt-1">{factureToConfirm.numeroFacture}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Montant TTC:</span>
                  <span className="font-semibold text-gray-900">{factureToConfirm.montantTTC.toLocaleString()} Fcfa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Client:</span>
                  <span className="font-semibold text-gray-900">{factureToConfirm.client.nom}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={confirmMarkAsPaid}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Oui
                </button>
                <button
                  onClick={closeConfirmModal}
                  className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Non
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}