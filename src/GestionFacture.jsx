import React, { useState, useMemo, useEffect } from 'react';
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

// Import du store et utils
import { useFacturesStore } from './lib/store/facturesStore';
import { MESSAGES } from './lib/utils/constants';

export default function GestionFactures() {
  // --- ZUSTAND STORE ---
  const {
    factures,
    loading,
    error,
    pagination,
    stats,
    fetchFactures,
    fetchFactureById,
    markAsPaid,
    deleteFacture,
    fetchStats,
    searchFactures,
    filterByStatut,
    exportFacturePDF,
    clearError
  } = useFacturesStore();

  // --- ÉTATS LOCAUX ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [factureToConfirm, setFactureToConfirm] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // --- EFFET: Charger les données au montage ---
  useEffect(() => {
    fetchFactures(1);
    fetchStats();
    clearError();
  }, [fetchFactures, fetchStats, clearError]);

  // Fonction utilitaire pour calculer le statut réel
  const getActualStatus = (facture) => {
    if (facture.montant_paye >= facture.montant_ttc) return 'Payée';
    
    // Gérer différents formats de date
    let echeanceDate;
    if (facture.date_echeance) {
      if (facture.date_echeance.includes('/')) {
        const [jour, mois, annee] = facture.date_echeance.split('/');
        echeanceDate = new Date(annee, mois - 1, jour);
      } else {
        echeanceDate = new Date(facture.date_echeance);
      }
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (echeanceDate) {
      echeanceDate.setHours(0, 0, 0, 0);
      return echeanceDate < today ? 'En retard' : 'En attente';
    }
    return 'En attente';
  };

  // Données filtrées
  const filteredFactures = useMemo(() => {
    if (!factures || factures.length === 0) return [];
    
    return factures.map(f => ({ ...f, statutCalcule: getActualStatus(f) }))
      .filter(f => {
        const matchStatus = selectedStatus === 'all' || f.statutCalcule === selectedStatus;
        const numeroFacture = f.numero_facture || f.numero_facture || '';
        const clientNom = f.client?.nom || f.clientNom || '';
        const matchSearch = 
          numeroFacture.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(f.id).toLowerCase().includes(searchTerm.toLowerCase());
        return matchStatus && matchSearch;
      });
  }, [searchTerm, selectedStatus, factures]);

  // Options de filtre
  const filterOptions = useMemo(() => [
    { label: 'Tous', value: 'all', count: factures.length },
    { label: 'Payée', value: 'Payée', count: factures.filter(f => getActualStatus(f) === 'Payée').length },
    { label: 'En attente', value: 'En attente', count: factures.filter(f => getActualStatus(f) === 'En attente').length },
    { label: 'En retard', value: 'En retard', count: factures.filter(f => getActualStatus(f) === 'En retard').length }
  ], [factures]);

// Stats depuis le backend (toujours globales, non filtrées)
const statsCards = useMemo(() => {
  // Extraire les vraies stats depuis stats.data
  const data = stats?.data || {};
  
  const total = data.total ?? 0;
  const chiffreAffaires = data.chiffre_affaires ?? 0;
  const payees = data.payees ?? 0;
  const encours = data.encours ?? 0;

  return [
    {
      label: 'Total factures',
      value: total,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      label: 'Chiffre d\'affaires',
      value: `${Math.round(chiffreAffaires).toLocaleString()} Fcfa`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      label: 'En attente',
      value: `${Math.round(encours).toLocaleString()} Fcfa`,
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      label: 'Factures payées',
      value: payees,
      icon: CheckCircle,
      color: 'bg-purple-500'
    }
  ];
}, [stats]);

  // Colonnes du DataTable
  const columns = [
    {
      header: 'N° Facture',
      key: 'numero_facture',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-blue-600">{row.numero_facture || row.numeroFacture}</div>
          <div className="text-xs text-gray-500">{row.commande_id || row.commande}</div>
        </div>
      )
    },
    {
      header: 'Client',
      key: 'client',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.client?.nom || row.clientNom}</div>
          <div className="text-xs text-gray-500">{row.client?.telephone || row.clientTel}</div>
        </div>
      )
    },
    {
      header: 'Date émission',
      key: 'date_facture',
      render: (_, row) => (
        <div className="text-sm text-gray-700 flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          {row.date_facture || row.dateEmission}
        </div>
      )
    },
    {
      header: 'Échéance',
      key: 'date_echeance',
      render: (_, row) => (
        <div className="text-sm font-medium text-gray-900">{row.date_echeance || row.dateEcheance}</div>
      )
    },
    {
      header: 'Montant TTC',
      key: 'montant_ttc',
      render: (_, row) => (
        <div>
          <div className="font-bold text-gray-900">{(row.montant_ttc || row.montantTTC || 0).toLocaleString()} Fcfa</div>
          <div className="text-xs text-gray-500">HT: {(row.montant_ht || row.montantHT || 0).toLocaleString()} Fcfa</div>
        </div>
      )
    },
    {
      header: 'Payé',
      key: 'montant_paye',
      render: (_, row) => {
        const montantPaye = row.montant_paye || row.montantPaye || 0;
        const montantTTC = row.montant_ttc || row.montantTTC || 0;
        const reste = montantTTC - montantPaye;
        return (
          <div className="text-sm">
            <div className="font-semibold text-green-600">{montantPaye.toLocaleString()} Fcfa</div>
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

  // Actions du tableau
  const actions = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => openModal(row),
      className: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    },
    {
      icon: <Download className="w-4 h-4" />,
      onClick: (row) => handleExportPDF(row),
      className: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => handleDeleteFacture(row),
      className: 'bg-red-50 text-red-600 hover:bg-red-100'
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

  const confirmMarkAsPaid = async () => {
    if (!factureToConfirm) return;
    
    setSubmitLoading(true);
    try {
      await markAsPaid(factureToConfirm.id, {
       montant_paye: factureToConfirm.montant_ttc || factureToConfirm.montantTTC,
      mode_paiement: "Espèces", // ou "Virement", "Mobile Money", etc.
      date_paiement: new Date().toISOString().split('T')[0]
      });
      
      // Recharger la liste
      fetchFactures(1);
      
      // Mettre à jour le sélectionné si c'est le même
      if (selectedFacture && selectedFacture.id === factureToConfirm.id) {
        setSelectedFacture({ 
          ...selectedFacture, 
          montant_paye: selectedFacture.montant_ttc || selectedFacture.montantTTC 
        });
      }
      
      closeConfirmModal();
      alert('Facture marquée comme payée !');
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert('Erreur : ' + (err.message || 'Impossible de marquer la facture comme payée'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleExportPDF = async (facture) => {
    try {
      await exportFacturePDF(facture.id);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      alert('Erreur : Impossible de télécharger la facture');
    }
  };

  const handleDeleteFacture = async (facture) => {
    if (window.confirm(`Confirmer la suppression de ${facture.numero_facture || facture.numeroFacture} ?`)) {
      try {
        await deleteFacture(facture.id);
        fetchFactures(1);
        alert('Facture supprimée !');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur : Impossible de supprimer la facture');
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim()) {
      searchFactures(value);
    } else {
      fetchFactures(1);
    }
  };

  const handleFilterStatus = (status) => {
    setSelectedStatus(status);
    clearError();
    if (status === 'all') {
      fetchFactures(1);
    } else {
      filterByStatut(status);
    }
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
            onChange={handleSearch}
            placeholder="Rechercher par numéro de facture, client..."
            disabled={loading}
          />

          <FilterBar
            filters={filterOptions}
            onFilterChange={handleFilterStatus}
            showSearch={false}
          />
        </div>

        {/* Tableau */}
        {loading && !searchTerm ? (
          <div className="bg-white p-8 rounded-xl text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="mt-4 text-gray-500">Chargement des factures...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredFactures}
            actions={actions}
            itemsPerPage={10}
          />
        )}
      </main>

      {/* MODAL DÉTAILS FACTURE — CORRIGÉ */}
      <Modal
        isOpen={showModal}
        title={`Facture ${selectedFacture?.numero_facture || ''}`}
        onClose={closeModal}
      >
        {selectedFacture && (
          <>
            <InvoicePrintView facture={selectedFacture} />
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
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
                <p className="text-sm text-gray-500 mt-1">{factureToConfirm.numero_facture}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Montant TTC:</span>
                <span className="font-semibold text-gray-900">{factureToConfirm.montant_ttc.toLocaleString()} Fcfa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Client:</span>
                <span className="font-semibold text-gray-900">{factureToConfirm.client.nom}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={confirmMarkAsPaid}
                disabled={submitLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Traitement...' : 'Oui'}
              </button>
              <button
                onClick={closeConfirmModal}
                disabled={submitLoading}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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