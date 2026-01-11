import React, { useState } from 'react';
import { Search, Plus, Trash2, Save, X, User, Phone, Mail, MapPin, Calculator, FileText, Calendar, Percent, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
export default function CreationDevis() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchClient, setSearchClient] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [lignesDevis, setLignesDevis] = useState([]);
  const [showLinks, setShowLinks] = useState(false);
// Paramètres globaux (facile à modifier plus tard)
const PRIX_ALU_M2 = 65000;      // prix alu unique
const TAUX_MAJORATION = 0.15;  // 15 %

  const [devisInfo, setDevisInfo] = useState({
    dateEmission: new Date().toISOString().split('T')[0],
    validite: 30,
    remise: 0,
    acompte: 0,
    delaiLivraison: '2-3 semaines',
    conditionsPaiement: 'Paiement à la livraison'
  });
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

  const clients = [
    { id: 1, nom: 'Ahmed Benali', tel: '0555 123 456', email: 'ahmed.b@email.dz', adresse: 'Cité 20 Août, Oran' },
    { id: 2, nom: 'Fatima Kader', tel: '0661 234 567', email: 'fatima.k@email.dz', adresse: 'Hai Es-Salam, Oran' },
    { id: 3, nom: 'Karim Meziane', tel: '0770 345 678', email: 'karim.m@email.dz', adresse: 'Les Amandiers, Oran' },
    { id: 4, nom: 'Leila Sahraoui', tel: '0555 456 789', email: 'leila.s@email.dz', adresse: 'Bir El Djir, Oran' }
  ];

  const categories = [
    { id: 1, nom: 'Fenêtres', produits: ['Fenêtre ', 'Fenêtre toilete'] },
    { id: 2, nom: 'Portes', produits: ['Porte-2Battan', 'Porte-1Battan', 'Porte-Toilette'] },
   
  ];

  const Alluminium = ['Champagne', 'Bronzé', 'Lac blanc', 'Naturel'];
  const vitrages = ['vitre-claire N4', 'vitre-claire N5', 'Vitre anti-eau N4', 'Vitre anti-eau N5'];

  const formatsStandards = [
  // PORTES
  { produit: 'Porte-2Battan', largeur: 1.20, hauteur: 2.10, prix: 150000 },
  { produit: 'Porte-1Battan', largeur: 0.80, hauteur: 2.10, prix: 100000 },
  { produit: 'Porte-Toilette', largeur: 0.70, hauteur: 2.10, prix: 85000 },

  // FENÊTRES
  { produit: 'Fenêtre ', largeur: 1.20, hauteur: 1.10, prix: 100000 },
  { produit: 'Fenêtre toilete', largeur: 0.60, hauteur: 0.60, prix: 75000 }
];

const calculatePrix = (produit, largeur, hauteur) => {
  if (!largeur || !hauteur) return 0;

  const L = parseFloat(largeur);
  const H = parseFloat(hauteur);

  // 1️⃣ Vérifier si format standard
  const standard = formatsStandards.find(
    f =>
      f.produit === produit &&
      Math.abs(f.largeur - L) < 0.01 &&
      Math.abs(f.hauteur - H) < 0.01
  );

  if (standard) {
    // Prix fixe pour les formats standards — AUCUNE majoration appliquée
    return standard.prix;
  }

  // 2️⃣ Sinon → calcul surface
  const surface = L * H;
  const prixBase = surface * PRIX_ALU_M2;

  // 3️⃣ Majoration automatique
  const prixFinal = prixBase + prixBase * TAUX_MAJORATION;

  return Math.round(prixFinal);
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

  const supprimerLigne = (id) => {
    setLignesDevis(lignesDevis.filter(ligne => ligne.id !== id));
  };

  const calculerSousTotal = () => {
    return lignesDevis.reduce((total, ligne) => total + ligne.sousTotal, 0);
  };

  const calculerRemise = () => {
    return Math.round(calculerSousTotal() * (devisInfo.remise / 100));
  };

  const calculerTotalHT = () => {
    return calculerSousTotal() - calculerRemise();
  };

  const calculerTVA = () => {
    // TVA désactivée selon cahier des charges (pas de TVA)
    return 0;
  };

  const calculerTotalTTC = () => {
    // Sans TVA
    return calculerTotalHT();
  };

  const calculerAcompte = () => {
    return Math.round(calculerTotalTTC() * (devisInfo.acompte / 100));
  };

  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(searchClient.toLowerCase()) ||
    client.tel.includes(searchClient)
  );

  const getDateValidite = () => {
    const date = new Date(devisInfo.dateEmission);
    date.setDate(date.getDate() + parseInt(devisInfo.validite));
    return date.toLocaleDateString('fr-FR');
  };

  // Sauvegarde le devis et le convertit immédiatement en commande (stockage local)
  const saveDevisAndConvert = () => {
    if (!selectedClient || lignesDevis.length === 0) return;

    const id = Date.now();
    const devis = {
      id,
      client: selectedClient,
      info: devisInfo,
      lignes: lignesDevis,
      totals: {
        sousTotal: calculerSousTotal(),
        remise: calculerRemise(),
        totalHT: calculerTotalHT(),
        ttc: calculerTotalTTC(),
        acompte: calculerAcompte()
      },
      dateCreation: new Date().toISOString()
    };

    // Enregistrer le devis en localStorage
    const storedDevis = JSON.parse(localStorage.getItem('devis') || '[]');
    storedDevis.push(devis);
    localStorage.setItem('devis', JSON.stringify(storedDevis));

    // Créer la commande correspondante (format compatible avec GestionCommandes.jsx)
    const articles = lignesDevis.map(l => ({
      produit: l.produit,
      quantite: l.quantite,
      dimensions: l.largeur && l.hauteur ? `${l.largeur}m × ${l.hauteur}m` : l.description || '',
      prix: l.prixUnitaire
    }));

    const commande = {
      id: `CMD-${id}`,
      client: selectedClient,
      dateCommande: devisInfo.dateEmission,
      dateLivraison: getDateValidite(),
      statut: 'En attente',
      montantHT: calculerTotalHT(),
      montantTTC: calculerTotalTTC(),
      articles,
      notes: `Créée depuis devis ${id}`
    };

    const storedCommandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    storedCommandes.push(commande);
    localStorage.setItem('commandes', JSON.stringify(storedCommandes));

    alert(`Devis enregistré (ID: ${id}) et converti en commande (${commande.id}).`);

    // Naviguer vers la page gestion des commandes en passant l'ID créé
    navigate('/gestion-commandes', { state: { createdFromDevis: commande.id } });

    // Réinitialiser l'interface
    setSelectedClient(null);
    setLignesDevis([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 ">
        <div className="px-5 py-4">
          
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
          to="/dashboard"
          className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          Dashboard
        </Link>
        <Link
          to="/gestion-clients"
          className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          Gestion clients
        </Link>
        <Link
          to="/gestion-commandes"
          className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          Gestion des Commandes
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
        <Link
          to="/gestion-depenses"
          className="text-left py-2 px-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          Gestion des dépenses
        </Link>
      </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nouveau Devis</h1>
              <p className="text-sm text-gray-500 mt-1">Créer un devis professionnel pour un client</p>
            </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button
              onClick={saveDevisAndConvert}
              disabled={!selectedClient || lignesDevis.length === 0}
              className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Enregistrer le devis
            </button>
          </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Client
              </h2>
              
              {!selectedClient ? (
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un client par nom ou téléphone..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchClient}
                      onChange={(e) => setSearchClient(e.target.value)}
                    />
                  </div>
                  
                  {searchClient && (
                    <div className="mt-3 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                      {filteredClients.map(client => (
                        <div
                          key={client.id}
                          onClick={() => {
                            setSelectedClient(client);
                            setSearchClient('');
                          }}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0"
                        >
                          <div className="font-semibold text-gray-900">{client.nom}</div>
                          <div className="text-sm text-gray-600">{client.tel} • {client.email}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setShowClientModal(true)}
                    className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nouveau client
                  </button>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg mb-2">{selectedClient.nom}</div>
                      <div className="space-y-1 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedClient.tel}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedClient.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {selectedClient.adresse}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedClient(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Devis Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informations du devis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'émission</label>
                  <input
                    type="date"
                    value={devisInfo.dateEmission}
                    onChange={(e) => setDevisInfo({...devisInfo, dateEmission: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Validité (jours)</label>
                  <input
                    type="number"
                    value={devisInfo.validite}
                    onChange={(e) => setDevisInfo({...devisInfo, validite: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Valable jusqu'au {getDateValidite()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Délai de livraison</label>
                  <input
                    type="text"
                    value={devisInfo.delaiLivraison}
                    onChange={(e) => setDevisInfo({...devisInfo, delaiLivraison: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 2-3 semaines"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conditions de paiement</label>
                  <select
                    value={devisInfo.conditionsPaiement}
                    onChange={(e) => setDevisInfo({...devisInfo, conditionsPaiement: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Paiement à la livraison</option>
                    <option>30% à la commande, solde à la livraison</option>
                    <option>50% à la commande, solde à la livraison</option>
                    <option>Paiement en 3 fois sans frais</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ajouter des articles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={currentLigne.categorie}
                    onChange={(e) => setCurrentLigne({...currentLigne, categorie: e.target.value, produit: ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.nom}>{cat.nom}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produit</label>
                  <select
                    value={currentLigne.produit}
                    onChange={(e) => setCurrentLigne({...currentLigne, produit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!currentLigne.categorie}
                  >
                    <option value="">Sélectionner un produit</option>
                    {currentLigne.categorie && categories
                      .find(cat => cat.nom === currentLigne.categorie)
                      ?.produits.map(prod => (
                        <option key={prod} value={prod}>{prod}</option>
                      ))
                    }
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (optionnelle)</label>
                  <input
                    type="text"
                    value={currentLigne.description}
                    onChange={(e) => setCurrentLigne({...currentLigne, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Avec poignée chromée, double vitrage..."
                  />
                </div>

                {currentLigne.produit !== 'Installation et pose' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Largeur (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={currentLigne.largeur}
                        onChange={(e) => setCurrentLigne({...currentLigne, largeur: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 1.20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hauteur (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={currentLigne.hauteur}
                        onChange={(e) => setCurrentLigne({...currentLigne, hauteur: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 1.50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alluminium</label>
                      <select
                        value={currentLigne.Alluminium}
                        onChange={(e) => setCurrentLigne({...currentLigne, Alluminium: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner</option>
                        {Alluminium.map(alluminium => (
                          <option key={alluminium} value={alluminium}>{alluminium}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vitrage</label>
                      <select
                        value={currentLigne.vitrage}
                        onChange={(e) => setCurrentLigne({...currentLigne, vitrage: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner</option>
                        {vitrages.map(vitrage => (
                          <option key={vitrage} value={vitrage}>{vitrage}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                  <input
                    type="number"
                    min="1"
                    value={currentLigne.quantite}
                    onChange={(e) => setCurrentLigne({...currentLigne, quantite: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={ajouterLigne}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter l'article
                  </button>
                </div>
              </div>

              {currentLigne.produit && (currentLigne.produit === 'Installation et pose' || (currentLigne.largeur && currentLigne.hauteur)) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-800">Prix unitaire estimé:</span>
                    <span className="text-lg font-bold text-green-900">
                      {calculatePrix(currentLigne.produit, currentLigne.largeur, currentLigne.hauteur).toLocaleString()} DA
                    </span>
                  </div>

                  {formatsStandards.some(
                    f =>
                      f.produit === currentLigne.produit &&
                      Math.abs(f.largeur - parseFloat(currentLigne.largeur)) < 0.01 &&
                      Math.abs(f.hauteur - parseFloat(currentLigne.hauteur)) < 0.01
                  ) ? (
                    <p className="text-xs text-green-600">
                      ✓ Prix standard (sans majoration)
                    </p>
                  ) : (
                    <p className="text-xs text-orange-600">
                      ⚠ Prix calculé par surface + majoration
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Devis Lines */}
            {lignesDevis.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Articles du devis</h2>
                <div className="space-y-3">
                  {lignesDevis.map((ligne) => (
                    <div key={ligne.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">{ligne.produit}</div>
                          {ligne.description && (
                            <div className="text-sm text-gray-600 mb-1">{ligne.description}</div>
                          )}
                          <div className="text-sm text-gray-600 space-y-1">
                            {ligne.produit !== 'Installation et pose' && (
                              <div>Dimensions: {ligne.largeur}m × {ligne.hauteur}m</div>
                            )}
                            {ligne.Alluminium && <div>Alluminium: {ligne.Alluminium}</div>}
                            {ligne.vitrage && <div>Vitrage: {ligne.vitrage}</div>}
                            <div>Quantité: {ligne.quantite} × {ligne.prixUnitaire.toLocaleString()} DA</div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-gray-900 text-lg mb-2">
                            {ligne.sousTotal.toLocaleString()} DA
                          </div>
                          <button
                            onClick={() => supprimerLigne(ligne.id)}
                            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Récapitulatif
              </h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Articles:</span>
                  <span className="font-semibold">{lignesDevis.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantité totale:</span>
                  <span className="font-semibold">
                    {lignesDevis.reduce((sum, l) => sum + l.quantite, 0)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Sous-total:</span>
                  <span className="font-semibold text-gray-900">
                    {calculerSousTotal().toLocaleString()} DA
                  </span>
                </div>

                {/* Remise */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Percent className="w-4 h-4" />
                      Remise
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={devisInfo.remise}
                      onChange={(e) => setDevisInfo({...devisInfo, remise: parseFloat(e.target.value) || 0})}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <span className="flex items-center text-gray-600">%</span>
                    <span className="flex items-center text-sm text-red-600 font-semibold ml-auto">
                      - {calculerRemise().toLocaleString()} DA
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Total HT:</span>
                  <span className="font-semibold text-gray-900">
                    {calculerTotalHT().toLocaleString()} DA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">TVA (0%):</span>
                  <span className="font-semibold text-gray-900">
                    {calculerTVA().toLocaleString()} DA
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total TTC:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {calculerTotalTTC().toLocaleString()} DA
                  </span>
                </div>
              </div>

              {/* Acompte */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Acompte demandé</label>
                </div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={devisInfo.acompte}
                    onChange={(e) => setDevisInfo({...devisInfo, acompte: parseFloat(e.target.value) || 0})}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <span className="flex items-center text-gray-600">%</span>
                </div>
                {devisInfo.acompte > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-blue-700">Acompte:</span>
                      <span className="font-semibold text-blue-900">{calculerAcompte().toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Solde:</span>
                      <span className="font-semibold text-blue-900">{(calculerTotalTTC() - calculerAcompte()).toLocaleString()} DA</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={saveDevisAndConvert}
                  disabled={!selectedClient || lignesDevis.length === 0}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer le devis
                </button>
                <button 
                  disabled={!selectedClient || lignesDevis.length === 0}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Aperçu PDF
                </button>
                <button 
                  disabled={!selectedClient || lignesDevis.length === 0}
                  className="w-full px-4 py-3 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 disabled:bg-gray-100 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Convertir en commande
                </button>
              </div>

              {/* Notes */}
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

      {/* Modal Nouveau Client */}
        {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nouveau Client</h2>
                <button 
                    onClick={() => setShowClientModal(false)} 
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>
                </div>

                <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nom du client"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0555 123 456"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="client@email.dz"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Oran"
                    />
                    </div>

                    <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Adresse complète"
                    />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                    onClick={() => setShowClientModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                    >
                    Annuler
                    </button>
                    <button
                    onClick={() => {
                        // Ici vous ajouterez la logique pour sauvegarder le client
                        alert('Fonctionnalité à implémenter avec le backend');
                        setShowClientModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                    >
                    <Save className="w-4 h-4" />
                    Ajouter le client
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}