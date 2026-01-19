import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Trash2, Save, X, User, Phone, Mail, MapPin,
  Calculator, FileText, Calendar, Percent, CheckCircle, AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

// Composants réutilisables
import Header from './components/layout/Header';
import Select from './components/ui/Select';
import Input from './components/ui/Input';
import Button from './components/ui/Button';
import Modal from './components/ui/Modal';
import Form from './components/ui/Form';

// Import des stores et utils
import { useDevisStore } from './lib/store/devisStore';
import { useClientsStore } from './lib/store/clientsStore';
import { MESSAGES } from './lib/utils/constants';

export default function CreationDevis() {
  // --- ZUSTAND STORES ---
  const { createDevis, convertToOrder, error: devisError, clearError: clearDevisError } = useDevisStore();
  const { clients, loading: clientsLoading, fetchClients } = useClientsStore();

  // --- ÉTATS LOCAUX ---
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchClient, setSearchClient] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [lignesDevis, setLignesDevis] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [createdDevis, setCreatedDevis] = useState(null); // Stocker le devis créé pour conversion
  const [currentLigne, setCurrentLigne] = useState({
    produit: '',
    categorie: '',
    description: '',
    largeur: '',
    hauteur: '',
    quantite: 1,
    Alluminium: '',
    vitrage: '',
    prixUnitaire: 0
  });

  const navigate = useNavigate();

  // --- EFFET: Charger les clients au montage ---
  useEffect(() => {
    fetchClients(1);
    clearDevisError();
  }, [fetchClients, clearDevisError]);

  const categories = [
    { id: 1, nom: 'Fenêtres', produits: ['Fenêtre Coulisant', 'Fenêtre toilette'] },
    { id: 2, nom: 'Portes', produits: ['Porte-2Battan', 'Porte-1Battan', 'Porte-Toilette'] },
  ];

  const Alluminium = ['Champagne', 'Bronzé', 'Lac blanc', 'Naturel'];
  const vitrages = ['vitre-claire N4', 'vitre-claire N5', 'Vitre anti-eau N4', 'Vitre anti-eau N5'];

  const formatsStandards = [
    // PORTES
    { produit: 'Porte-2Battan', largeur: 1.20, hauteur: 2.10, prix: 147500 },
    { produit: 'Porte-1Battan', largeur: 0.80, hauteur: 2.10, prix: 97500 },
    { produit: 'Porte-Toilette', largeur: 0.70, hauteur: 2.10, prix: 87500 },
    // FENÊTRES
    { produit: 'Fenêtre Coulisant', largeur: 1.20, hauteur: 1.10, prix: 97500 },
    { produit: 'Fenêtre toilette', largeur: 0.60, hauteur: 0.60, prix: 37500 }
  ];

  const PRIX_ALU_M2 = 45000;
  const TAUX_MAJORATION = 0.15;

  const [devisInfo, setDevisInfo] = useState({
    dateEmission: new Date().toISOString().split('T')[0],
    validite: 30,
    remise: 0,
    acompte: 0,
    delaiLivraison: '2-3 semaines',
    conditionsPaiement: 'Paiement à la livraison'
  });

  const [newClientData, setNewClientData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    code_postal: '',
    type_client: 'Particulier',
    statut: 'Actif',
    date_inscription: new Date().toISOString().split('T')[0]
  });
  // === LOGIQUE MÉTIER ===
  const calculatePrix = (produit, largeur, hauteur) => {
    if (!largeur || !hauteur) return 0;
    const L = parseFloat(largeur);
    const H = parseFloat(hauteur);
    const standard = formatsStandards.find(
      f =>
        f.produit === produit &&
        Math.abs(f.largeur - L) < 0.01 &&
        Math.abs(f.hauteur - H) < 0.01
    );
    if (standard) return standard.prix;
    const surface = L * H;
    const prixBase = surface * PRIX_ALU_M2;
    return Math.round(prixBase + prixBase * TAUX_MAJORATION);
  };
  const formatDateToDDMMYYYY = (isoDate) => {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

  const ajouterLigne = () => {
    if (currentLigne.produit && (currentLigne.produit === 'Installation et pose' || (currentLigne.largeur && currentLigne.hauteur))) {
      const prix = calculatePrix(currentLigne.produit, currentLigne.largeur, currentLigne.hauteur);
      const nouvelleLigne = {
        ...currentLigne,
        id: Date.now(),
        prixUnitaire: prix,
        sousTotal: prix * currentLigne.quantite
      };
      setLignesDevis([...lignesDevis, nouvelleLigne]);
      setCurrentLigne({
        produit: '',
        categorie: '',
        description: '',
        largeur: '',
        hauteur: '',
        quantite: 1,
        Alluminium: '',
        vitrage: '',
        prixUnitaire: 0
      });
    }
  };
  //pour la gestion du formulaire du nouveau client
  const handleClientFormChange = (event) => {
  const { name, value } = event.target;
  setNewClientData(prev => ({
    ...prev,
    [name]: value
  }));
};

  const supprimerLigne = (id) => setLignesDevis(lignesDevis.filter(l => l.id !== id));

  const calculerSousTotal = () => lignesDevis.reduce((total, ligne) => total + ligne.sousTotal, 0);
  const calculerRemise = () => Math.round(calculerSousTotal() * (devisInfo.remise / 100));
  const calculerTotalHT = () => calculerSousTotal() - calculerRemise();
  const calculerTVA = () => 0; // Désactivée
  const calculerTotalTTC = () => calculerTotalHT();
  const calculerAcompte = () => Math.round(calculerTotalTTC() * (devisInfo.acompte / 100));

  const getDateValidite = () => {
    const date = new Date(devisInfo.dateEmission);
    date.setDate(date.getDate() + parseInt(devisInfo.validite));
    return date.toLocaleDateString('fr-FR');
  };

  const filteredClients = (clients || []).filter(client =>
    (client.nom || '').toLowerCase().includes(searchClient.toLowerCase()) ||
    (client.telephone || client.tel || '').includes(searchClient)
  );

  // === SAUVEGARDE ===
  const saveDevisAndConvert = async () => {
    if (!selectedClient || lignesDevis.length === 0) return;

    setSubmitLoading(true);

    try {
      // Préparer les données du devis
      const devisData = {
        client_id: selectedClient.id || selectedClient.id,
        date_emission: devisInfo.dateEmission,
        statut: 'Brouillon',
        validite: parseInt(devisInfo.validite),
        delai_livraison: devisInfo.delaiLivraison,
        conditions_paiement: devisInfo.conditionsPaiement,
        remise_pourcentage: devisInfo.remise,
        acompte_pourcentage: devisInfo.acompte,
        lignes: lignesDevis.map(l => ({
        produit: l.produit,
        description: l.description || null,
        largeur: l.largeur ? parseFloat(l.largeur) : null,
        hauteur: l.hauteur ? parseFloat(l.hauteur) : null,
        quantite: parseInt(l.quantite, 10),
        prix_unitaire: parseFloat(l.prixUnitaire),
        alluminium: l.Alluminium || null,
        vitrage: l.vitrage || null
      })),
        montant_ht: calculerTotalHT(),
        montant_ttc: calculerTotalTTC(),
        notes: document.querySelector('textarea')?.value || ''
      };

          // 🔍 Debug : afficher les données envoyées
      console.log('Données envoyées au backend:', devisData);

      // Créer le devis via l'API
      const responseDevis = await createDevis(devisData);

      // Stocker le devis créé pour permettre la conversion en commande
      setCreatedDevis(responseDevis);

      alert(`Devis créé avec succès (ID: ${responseDevis?.id}). Vous pouvez maintenant le convertir en commande.`);
      
      // NE PAS rediriger immédiatement - laisser l'utilisateur convertir en commande
      
      // Réinitialiser le formulaire
      setSelectedClient(null);
      setLignesDevis([]);
      setDevisInfo({
        dateEmission: new Date().toISOString().split('T')[0],
        validite: 30,
        remise: 0,
        acompte: 0,
        delaiLivraison: '2-3 semaines',
        conditionsPaiement: 'Paiement à la livraison'
      });

    }  catch (error) {
  console.error('Erreur complète:', error);

  if (error.response) {
    // Affiche les détails de validation dans la console
    console.error('Réponse d’erreur du serveur:', error.response.data);

    // Affiche un message plus précis à l’utilisateur
    const errors = error.response.data.errors;
    if (errors) {
      const firstField = Object.keys(errors)[0];
      const firstMessage = errors[firstField][0];
      alert(`Erreur de validation : ${firstMessage}`);
    } else {
      alert('Erreur : ' + (error.response.data.message || 'Impossible de créer le devis'));
    }
  } else if (error.request) {
    alert('Erreur réseau : le serveur ne répond pas');
  } else {
    alert('Erreur inattendue : ' + error.message);
  }
} finally {
  setSubmitLoading(false);
} 
  };

  const handleConvertToOrder = async () => {
    if (!createdDevis) {
      alert('Veuillez d\'abord créer un devis');
      return;
    }

    setSubmitLoading(true);
    try {
      // Convertir le devis en commande
      const order = await convertToOrder(createdDevis.id, {
        client_id: selectedClient.id,
        articles: lignesDevis
      });

      alert(`Commande créée avec succès (ID: ${order?.id})`);
      
      // Rediriger vers la gestion des commandes
      navigate('/gestion-commandes', { state: { createdFromDevis: order.id } });
      
      // Réinitialiser le formulaire complet
      setSelectedClient(null);
      setLignesDevis([]);
      setCreatedDevis(null);
      setSearchClient('');
      setDevisInfo({
        dateEmission: new Date().toISOString().split('T')[0],
        validite: 30,
        remise: 0,
        acompte: 0,
        delaiLivraison: '2-3 semaines',
        conditionsPaiement: 'Paiement à la livraison'
      });

    } catch (error) {
      console.error('Erreur lors de la conversion:', error);
      alert('Erreur : ' + (error.message || 'Impossible de convertir le devis en commande'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddNewClient = async () => {
    try {
      setSubmitLoading(true);
      
      // Valider les champs requis (même que GestionClients)
      if (!newClientData.nom || !newClientData.prenom || !newClientData.telephone || !newClientData.email || !newClientData.adresse || !newClientData.ville || !newClientData.code_postal) {
        alert('Veuillez remplir tous les champs requis');
        setSubmitLoading(false);
        return;
      }
      
      // Créer le client via le store
      const createdClient = await useClientsStore.getState().createClient(newClientData);
      
      // 🔥 FIX: Construire l'objet client avec TOUTES les données du formulaire
      const clientToSelect = {
        id: createdClient.id || createdClient.data?.id,
        nom: newClientData.nom,
        prenom: newClientData.prenom,
        telephone: newClientData.telephone,
        email: newClientData.email,
        adresse: newClientData.adresse,
        ville: newClientData.ville,
        code_postal: newClientData.code_postal,
        type_client: newClientData.type_client,
        statut: newClientData.statut,
        // Fusionner avec les données du serveur (au cas où)
        ...createdClient,
        ...createdClient.data
      };
      
      console.log('Client créé et sélectionné:', clientToSelect);
      
      // Sélectionner automatiquement le client créé
      setSelectedClient(clientToSelect);
      
      // Réinitialiser le formulaire
      setNewClientData({ 
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        adresse: '',
        ville: '',
        code_postal: '',
        type_client: 'Particulier',
        statut: 'Actif',
        date_inscription: new Date().toISOString().split('T')[0]
      });
      setShowClientModal(false);
      
      alert('Client créé avec succès !');
    } catch (error) {
      console.error('Erreur complète lors de la création du client:', error);

      // Afficher les erreurs de validation du serveur
      if (error.errors) {
        const firstField = Object.keys(error.errors)[0];
        const firstMessage = error.errors[firstField][0];
        alert(`Erreur de validation : ${firstMessage}`);
      } else {
        alert('Erreur : ' + (error.message || 'Impossible de créer le client'));
      }
    } finally {
      setSubmitLoading(false);
    }
  };
  // === RENDU ===
  return (
    <div className="min-h-screen bg-gray-50">
      {/* AFFICHAGE DES ERREURS API */}
      {devisError && (
        <div className="fixed top-6 right-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 z-50 max-w-md">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">Erreur</p>
            <p className="text-red-600 text-sm">{devisError}</p>
          </div>
        </div>
      )}

      {/* HEADER UNIFIÉ */}
      <Header
        title="Nouveau Devis"
        subtitle="Créer un devis professionnel pour un client"
        navigationLinks={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Gestion clients', href: '/gestion-clients' },
          { label: 'Gestion des Commandes', href: '/gestion-commandes' },
          { label: 'Gestion des stocks', href: '/gestion-de-stock' },
          { label: 'Gestion des factures', href: '/gestion-de-facture' },
          { label: 'Gestion des dépenses', href: '/gestion-depenses' }
        ]}
        actions={[
          {
            label: 'Annuler',
            icon: <X className="w-4 h-4" />,
            onClick: () => navigate('/gestion-devis'),
            variant: 'secondary'
          },
          {
            label: 'Enregistrer le devis',
            icon: <Save className="w-4 h-4" />,
            onClick: saveDevisAndConvert,
            variant: 'primary',
            disabled: !selectedClient || lignesDevis.length === 0 || submitLoading
          }
        ]}
      />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sélection client */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" /> Client
              </h2>
              {!selectedClient ? (
                <div>
                  <Input
                    name="searchClient"
                    placeholder="Rechercher un client par nom ou téléphone..."
                    value={searchClient}
                    onChange={(e) => setSearchClient(e.target.value)}
                    icon={Search}
                    disabled={clientsLoading}
                  />
                  {searchClient && (
                    <div className="mt-3 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                      {clientsLoading ? (
                        <div className="p-4 text-center text-gray-500">Chargement...</div>
                      ) : filteredClients.length > 0 ? (
                        filteredClients.map(client => (
                          <div
                            key={client.id}
                            onClick={() => {
                              setSelectedClient(client);
                              setSearchClient('');
                            }}
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0"
                          >
                            <div className="font-semibold text-gray-900">{client.nom}</div>
                            <div className="text-sm text-gray-600">{client.telephone || client.tel} • {client.email}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">Aucun client trouvé</div>
                      )}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    fullWidth
                    className="mt-3"
                    onClick={() => setShowClientModal(true)}
                  >
                     + Nouveau client
                  </Button>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg mb-2">{selectedClient.nom}</div>
                      <div className="space-y-1 text-sm text-gray-700">
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {selectedClient.telephone || selectedClient.tel}</div>
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {selectedClient.email}</div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {selectedClient.adresse}</div>
                      </div>
                    </div>
                    <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Informations devis */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Informations du devis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="dateEmission"
                  label="Date d'émission"
                  type="date"
                  value={devisInfo.dateEmission}
                  onChange={(e) => setDevisInfo({ ...devisInfo, dateEmission: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Validité (jours)</label>
                  <Input
                    name="validite"
                    type="number"
                    value={devisInfo.validite}
                    onChange={(e) => setDevisInfo({ ...devisInfo, validite: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Valable jusqu'au {getDateValidite()}</p>
                </div>
                <Input
                  name="delaiLivraison"
                  label="Délai de livraison"
                  value={devisInfo.delaiLivraison}
                  onChange={(e) => setDevisInfo({ ...devisInfo, delaiLivraison: e.target.value })}
                />
                <Select
                  label="Conditions de paiement"
                  value={devisInfo.conditionsPaiement}
                  onChange={(val) => setDevisInfo({ ...devisInfo, conditionsPaiement: val })}
                  options={[
                    'Paiement à la livraison',
                    '30% à la commande, solde à la livraison',
                    '50% à la commande, solde à la livraison',
                    'Paiement en 3 fois sans frais'
                  ].map(opt => ({ label: opt, value: opt }))}
                />
              </div>
            </div>

            {/* Ajout article */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Ajouter des articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select
                  label="Catégorie"
                  value={currentLigne.categorie}
                  onChange={(val) => setCurrentLigne({ ...currentLigne, categorie: val, produit: '' })}
                  options={categories.map(cat => ({ label: cat.nom, value: cat.nom }))}
                />
                <Select
                  label="Produit"
                  value={currentLigne.produit}
                  onChange={(val) => setCurrentLigne({ ...currentLigne, produit: val })}
                  disabled={!currentLigne.categorie}
                  options={
                    currentLigne.categorie
                      ? categories.find(c => c.nom === currentLigne.categorie)?.produits.map(p => ({ label: p, value: p })) || []
                      : []
                  }
                />
                <div className="md:col-span-2">
                  <Input
                    name="description"
                    label="Description (optionnelle)"
                    value={currentLigne.description}
                    onChange={(e) => setCurrentLigne({ ...currentLigne, description: e.target.value })}
                  />
                </div>

                {currentLigne.produit !== 'Installation et pose' && (
                  <>
                    <Input
                      name="largeur"
                      label="Largeur (m)"
                      type="number"
                      step="0.01"
                      value={currentLigne.largeur}
                      onChange={(e) => setCurrentLigne({ ...currentLigne, largeur: e.target.value })}
                    />
                    <Input
                      name="hauteur"
                      label="Hauteur (m)"
                      type="number"
                      step="0.01"
                      value={currentLigne.hauteur}
                      onChange={(e) => setCurrentLigne({ ...currentLigne, hauteur: e.target.value })}
                    />
                    <Select
                      label="Alluminium"
                      value={currentLigne.Alluminium}
                      onChange={(val) => setCurrentLigne({ ...currentLigne, Alluminium: val })}
                      options={Alluminium.map(a => ({ label: a, value: a }))}
                    />
                    <Select
                      label="Vitrage"
                      value={currentLigne.vitrage}
                      onChange={(val) => setCurrentLigne({ ...currentLigne, vitrage: val })}
                      options={vitrages.map(v => ({ label: v, value: v }))}
                    />
                  </>
                )}

                <Input
                  name="quantite"
                  label="Quantité"
                  type="number"
                  min="1"
                  value={currentLigne.quantite}
                  onChange={(e) => setCurrentLigne({ ...currentLigne, quantite: parseInt(e.target.value) || 1 })}
                />

                <div className="flex items-end">
                  <Button
                    fullWidth
                    onClick={ajouterLigne}
                    disabled={!currentLigne.produit || (currentLigne.produit !== 'Installation et pose' && (!currentLigne.largeur || !currentLigne.hauteur))}
                  >
                     + Ajouter l'article
                  </Button>
                </div>
              </div>

              {currentLigne.produit && (currentLigne.produit === 'Installation et pose' || (currentLigne.largeur && currentLigne.hauteur)) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-800">Prix unitaire estimé:</span>
                    <span className="text-lg font-bold text-green-900">
                      {calculatePrix(currentLigne.produit, currentLigne.largeur, currentLigne.hauteur).toLocaleString()} Fcfa
                    </span>
                  </div>
                  {formatsStandards.some(
                    f =>
                      f.produit === currentLigne.produit &&
                      Math.abs(f.largeur - parseFloat(currentLigne.largeur)) < 0.01 &&
                      Math.abs(f.hauteur - parseFloat(currentLigne.hauteur)) < 0.01
                  ) ? (
                    <p className="text-xs text-green-600">✓ Prix standard (sans majoration)</p>
                  ) : (
                    <p className="text-xs text-orange-600">⚠ Prix calculé par surface + majoration</p>
                  )}
                </div>
              )}
            </div>

            {/* Lignes du devis */}
            {lignesDevis.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Articles du devis</h2>
                <div className="space-y-3">
                  {lignesDevis.map((ligne) => (
                    <div key={ligne.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">{ligne.produit}</div>
                          {ligne.description && <div className="text-sm text-gray-600 mb-1">{ligne.description}</div>}
                          <div className="text-sm text-gray-600 space-y-1">
                            {ligne.produit !== 'Installation et pose' && (
                              <div>Dimensions: {ligne.largeur}m × {ligne.hauteur}m</div>
                            )}
                            {ligne.Alluminium && <div>Alluminium: {ligne.Alluminium}</div>}
                            {ligne.vitrage && <div>Vitrage: {ligne.vitrage}</div>}
                            <div>Quantité: {ligne.quantite} × {ligne.prixUnitaire.toLocaleString()} Fcfa</div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-gray-900 text-lg mb-2">
                            {ligne.sousTotal.toLocaleString()} Fcfa
                          </div>
                          <button
                            onClick={() => supprimerLigne(ligne.id)}
                            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" /> Récapitulatif
              </h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Articles:</span>
                  <span className="font-semibold">{lignesDevis.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantité totale:</span>
                  <span className="font-semibold">{lignesDevis.reduce((sum, l) => sum + l.quantite, 0)}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Sous-total:</span>
                  <span className="font-semibold text-gray-900">{calculerSousTotal().toLocaleString()} Fcfa</span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Percent className="w-4 h-4" /> Remise
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      name="remise"
                      type="number"
                      min="0"
                      max="100"
                      value={devisInfo.remise}
                      onChange={(e) => setDevisInfo({ ...devisInfo, remise: parseFloat(e.target.value) || 0 })}
                      className="w-20"
                    />
                    <span className="text-gray-600">%</span>
                    <span className="text-red-600 font-semibold ml-auto">- {calculerRemise().toLocaleString()} Fcfa</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Total HT:</span>
                  <span className="font-semibold text-gray-900">{calculerTotalHT().toLocaleString()} Fcfa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">TVA (0%):</span>
                  <span className="font-semibold text-gray-900">{calculerTVA().toLocaleString()} Fcfa</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total TTC:</span>
                  <span className="text-2xl font-bold text-blue-600">{calculerTotalTTC().toLocaleString()} Fcfa</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <label className="text-sm font-medium text-gray-700">Acompte demandé</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    name="acompte"
                    type="number"
                    min="0"
                    max="100"
                    value={devisInfo.acompte}
                    onChange={(e) => setDevisInfo({ ...devisInfo, acompte: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                  <span className="text-gray-600">%</span>
                </div>
                {devisInfo.acompte > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3 text-sm mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-blue-700">Acompte:</span>
                      <span className="font-semibold text-blue-900">{calculerAcompte().toLocaleString()} Fcfa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Solde:</span>
                      <span className="font-semibold text-blue-900">{(calculerTotalTTC() - calculerAcompte()).toLocaleString()} Fcfa</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="primary"
                  onClick={saveDevisAndConvert}
                  disabled={!selectedClient || lignesDevis.length === 0 || submitLoading}
                  className={submitLoading ? 'opacity-70 cursor-not-allowed' : ''}
                >
                  {submitLoading ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Enregistrer le devis
                    </>
                  )}
                </Button>
              
                <Button
                  fullWidth
                  variant="outline"
                  disabled={!createdDevis || !selectedClient || lignesDevis.length === 0 || submitLoading}
                  onClick={handleConvertToOrder}
                  className={submitLoading ? 'opacity-70 cursor-not-allowed' : ''}
                >
                  {submitLoading ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Conversion...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Convertir en commande
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes / Conditions particulières</label>
                <textarea
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Ex: Garantie 10 ans, Installation incluse..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL NOUVEAU CLIENT */}
     <Modal
  isOpen={showClientModal}
  title="Nouveau Client"
  onClose={() => setShowClientModal(false)}
>
  <Form
    fields={[
      { name: 'nom', label: 'Nom', required: true },
      { name: 'prenom', label: 'Prénom', required: true },
      { name: 'telephone', label: 'Téléphone', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'adresse', label: 'Adresse complète', required: true, fullWidth: true },
      { name: 'ville', label: 'Ville', required: true },
      { 
        name: 'code_postal', 
        label: 'Boîte Postale (ex: BP 1234)', 
        placeholder: 'BP 0000',
        required: true 
      },
      { 
        name: 'type_client', 
        label: 'Type de client', 
        type: 'select', 
        required: true,
        options: [
          { label: 'Particulier', value: 'Particulier' },
          { label: 'Professionnel', value: 'Professionnel' }
        ] 
      },
      { 
        name: 'statut', 
        label: 'Statut', 
        type: 'select', 
        options: [
          { label: 'Actif', value: 'Actif' },
          { label: 'Inactif', value: 'Inactif' },
          { label: 'VIP', value: 'VIP' }
        ] 
      }
    ]}
    formData={newClientData}
    onChange={handleClientFormChange}
    onCancel={() => setShowClientModal(false)}
    onSubmit={handleAddNewClient}
    submitLabel="Ajouter le client"
  />
</Modal>
    </div>
  );
}