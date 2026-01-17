import React, { useState, useMemo } from 'react';
import {
  Eye, Download, Send, DollarSign, AlertCircle, CheckCircle,
  Clock, FileText, Plus, Trash2, Calendar, User, CreditCard, Mail, Phone
} from 'lucide-react';
import { Link } from "react-router-dom";

// Composants réutilisables
import Header from './components/layout/Header';
import StatCard from './components/ui/Cards';
import FilterBar from './components/ui/FilterBar';
import TableSearch from './components/tables/TableSearch';
import DataTable from './components/tables/DataTable';
import Modal from './components/ui/Modal';

// Composant d'impression
import InvoicePrintView from './components/invoice/InvoicePrintView';

export default function GestionFactures() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [factureToConfirm, setFactureToConfirm] = useState(null);

  const [factures, setFactures] = useState([
    {
      id: 'FAC-2024-001',
      numeroFacture: 'F-001/2024',
      commande: 'CMD-2024-001',
      client: { 
        nom: 'Ahmed Benali', 
        tel: '0555 123 456', 
        email: 'ahmed.benali@email.dz', 
        adresse: '15 Rue des Martyrs, Oran' 
      },
      dateEmission: '08/11/2024',
      dateEcheance: '23/11/2024',
      montantHT: 142000,
      tva: 26980,
      montantTTC: 169180,
      montantPaye: 169180,
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
      client: { 
        nom: 'Fatima Kader', 
        tel: '0661 234 567', 
        email: 'fatima.kader@email.dz', 
        adresse: '32 Cité Es-Salam, Oran' 
      },
      dateEmission: '07/11/2024',
      dateEcheance: '22/11/2024',
      montantHT: 78500,
      tva: 14915,
      montantTTC: 93415,
      montantPaye: 0,
      modePaiement: 'Espèces',
      datePaiement: '',
      articles: [
        { designation: 'Porte d\'entrée blindée 0.90m × 2.15m', quantite: 1, prixUnitaire: 78500, total: 78500 }
      ]
    }
  ]);

  // Fonction utilitaire pour calculer le statut réel
  const getActualStatus = (facture) => {
    if (facture.montantPaye >= facture.montantTTC) return 'Payée';
    const [jour, mois, annee] = facture.dateEcheance.split('/');
    const echeanceDate = new Date(annee, mois - 1, jour);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    echeanceDate.setHours(0, 0, 0, 0);
    return echeanceDate < today ? 'En retard' : 'En attente';
  };

  // Données filtrées
  const filteredFactures = useMemo(() => {
    return factures.map(f => ({ ...f, statutCalcule: getActualStatus(f) }))
      .filter(f => {
        const matchStatus = selectedStatus === 'all' || f.statutCalcule === selectedStatus;
        const matchSearch = 
          f.numeroFacture.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchStatus && matchSearch;
      });
  }, [searchTerm, selectedStatus, factures]);

  // Options de filtre
  const filterOptions = [
    { label: 'Tous', value: 'all', count: factures.length },
    { label: 'Payée', value: 'Payée', count: factures.filter(f => getActualStatus(f) === 'Payée').length },
    { label: 'En attente', value: 'En attente', count: factures.filter(f => getActualStatus(f) === 'En attente').length },
    { label: 'En retard', value: 'En retard', count: factures.filter(f => getActualStatus(f) === 'En retard').length }
  ];

  // Stats
  const calculateTotalCA = () => factures.filter(f => getActualStatus(f) === 'Payée').reduce((sum, f) => sum + f.montantTTC, 0);
  const calculateTotalEnAttente = () => factures
    .filter(f => ['En attente', 'En retard'].includes(getActualStatus(f)))
    .reduce((sum, f) => sum + (f.montantTTC - f.montantPaye), 0);

  const statsCards = [
    { label: 'Total factures', value: factures.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Chiffre d\'affaires', value: `${calculateTotalCA().toLocaleString()} Fcfa`, icon: DollarSign, color: 'bg-green-500' },
    { label: 'En attente', value: `${calculateTotalEnAttente().toLocaleString()} Fcfa`, icon: Clock, color: 'bg-orange-500' },
    { label: 'Factures payées', value: factures.filter(f => getActualStatus(f) === 'Payée').length, icon: CheckCircle, color: 'bg-purple-500' }
  ];

  // Actions du tableau
  const actions = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => openModal(row),
      className: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    },
    {
      icon: <Download className="w-4 h-4" />,
      onClick: () => alert('PDF'),
      className: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    {
      icon: <Send className="w-4 h-4" />,
      onClick: () => alert('Email'),
      className: 'bg-green-50 text-green-600 hover:bg-green-100'
    }
  ];

  // Colonnes du DataTable
  const columns = [
    {
      header: 'N° Facture',
      key: 'numeroFacture',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-blue-600">{row.numeroFacture}</div>
          <div className="text-xs text-gray-500">{row.commande}</div>
        </div>
      )
    },
    {
      header: 'Client',
      key: 'client',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.client.nom}</div>
          <div className="text-xs text-gray-500">{row.client.tel}</div>
        </div>
      )
    },
    {
      header: 'Date émission',
      key: 'dateEmission',
      render: (_, row) => (
        <div className="text-sm text-gray-700 flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          {row.dateEmission}
        </div>
      )
    },
    {
      header: 'Échéance',
      key: 'dateEcheance',
      render: (_, row) => (
        <div className="text-sm font-medium text-gray-900">{row.dateEcheance}</div>
      )
    },
    {
      header: 'Montant TTC',
      key: 'montantTTC',
      render: (_, row) => (
        <div>
          <div className="font-bold text-gray-900">{row.montantTTC.toLocaleString()} Fcfa</div>
          <div className="text-xs text-gray-500">HT: {row.montantHT.toLocaleString()} Fcfa</div>
        </div>
      )
    },
    {
      header: 'Payé',
      key: 'montantPaye',
      render: (_, row) => {
        const reste = row.montantTTC - row.montantPaye;
        return (
          <div className="text-sm">
            <div className="font-semibold text-green-600">{row.montantPaye.toLocaleString()} Fcfa</div>
            {reste > 0 && <div className="text-xs text-orange-600">Reste: {reste.toLocaleString()} Fcfa</div>}
          </div>
        );
      }
    },
    {
      header: 'Statut',
      key: 'statutCalcule',
      render: (_, row) => {
        const status = row.statutCalcule;
        const getColor = (s) => {
          switch(s) {
            case 'Payée': return 'bg-green-100 text-green-800';
            case 'En attente': return 'bg-blue-100 text-blue-800';
            case 'En retard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        const getIcon = (s) => {
          switch(s) {
            case 'Payée': return CheckCircle;
            case 'En attente': return Clock;
            case 'En retard': return AlertCircle;
            default: return Clock;
          }
        };
        const Icon = getIcon(status);
        return (
          <span 
            onClick={() => openConfirmModal(row)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${getColor(status)} ${status !== 'Payée' ? 'cursor-pointer hover:opacity-80' : ''}`}
          >
            <Icon className="w-3 h-3 inline mr-1" />
            {status}
          </span>
        );
      }
    }
  ];

  // Gestion modale
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
    const updatedFactures = factures.map(f => 
      f.id === factureToConfirm.id 
        ? { ...f, montantPaye: f.montantTTC }
        : f
    );
    setFactures(updatedFactures);
    if (selectedFacture && selectedFacture.id === factureToConfirm.id) {
      setSelectedFacture({ ...selectedFacture, montantPaye: selectedFacture.montantTTC });
    }
    closeConfirmModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Gestion des Factures"
        subtitle={`${filteredFactures.length} factures`}
        navigationLinks={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Gestion clients', href: '/gestion-clients' },
          { label: 'Gestion des Commandes', href: '/gestion-commandes' },
          { label: 'Gestion des stocks', href: '/gestion-de-stock' },
          { label: 'Gestion des devis', href: '/gestion-devis' },
          { label: 'Gestion des dépenses', href: '/gestion-depenses' }
        ]}
        actions={[
          {
            label: 'Exporter',
            icon: <Download className="w-4 h-4" />,
            onClick: () => alert('Export CSV'),
            variant: 'secondary'
          }
        ]}
      />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats */}
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

        {/* Recherche + Filtres */}
        <div className="space-y-4">
          <TableSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher par numéro de facture, client..."
          />

          <FilterBar
            filters={filterOptions}
            onFilterChange={setSelectedStatus}
            showSearch={false}
          />
        </div>

        {/* Tableau */}
        <DataTable
          columns={columns}
          data={filteredFactures}
          actions={actions}
          itemsPerPage={5}
        />
      </main>

      {/* MODAL DÉTAILS FACTURE — CORRIGÉ */}
      <Modal
        isOpen={showModal}
        title={`Facture ${selectedFacture?.numeroFacture || ''}`}
        onClose={closeModal}
      >
        {selectedFacture && (
          <>
            <InvoicePrintView facture={selectedFacture} />
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Imprimer cette facture
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* MODAL CONFIRMATION */}
      <Modal
        isOpen={showConfirmModal}
        title="Confirmation"
        onClose={closeConfirmModal}
      >
        {factureToConfirm && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-gray-900 font-semibold">Marquer cette facture comme payée ?</p>
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
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Oui
              </button>
              <button
                onClick={closeConfirmModal}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Non
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}