# CAHIER DES CHARGES - SYSTÈME DE GESTION MENUISERIE ALUMINIUM

---

## 1. SPÉCIFICATIONS GÉNÉRALES DU PROJET

### 1.1 Contexte et Problématique

#### **Contexte**
L'entreprise **Menuiserie Aluminium du nom de TOUARA** (basée à Bamako, Mali) opère dans le secteur de la fabrication et pose de menuiserie aluminium (fenêtres et  portes, ). Actuellement, l'entreprise gère ses opérations de manière partiellement manualisée, ce qui entraîne des inefficacités opérationnelles et une perte de visibilité globale.

**Données contextuelles clés :**
- **Localisation** : Bamako, Mali (Hippodrome rue:224)
- **Secteur d'activité** : Menuiserie aluminium, fabrication et pose
- **Nombre de clients** : ~8 clients actifs (actuellement) ; potentiel de croissance
- **Gamme de produits** : Fenêtres, Portes, 
- **Modes de commande** : Formats standards + commandes personnalisées
- **Monnaie** : fcfa Malien
- **Équipe** : Petite structure (gérante : Aissata Tounkara)

#### **Problématique Identifiée**

Sans système informatisé, l'entreprise rencontre les défis suivants :

| Problème | Impact |
|----------|---------|
| **Gestion manuelle des devis** | Temps perdus, risque d'erreurs de calcul, délai de réponse client augmenté |
| **Suivi des commandes non centralisé** | Perte d'informations, confusion sur les statuts (production/prête/livrée) |
| **Inventaire non optimisé** | Ruptures de stock imprévisibles, sur-stockage de certains articles |
| **Facturation manuelle** | Erreurs, délais de paiement non respectés, suivi de trésorerie faible |
| **Absence de relation client (CRM)** | Pas de historique client, informations fragmentées |
| **Pas de tableau de bord** | Pas de visibilité sur KPIs : chiffre d'affaires, commandes en cours, efficacité |
| **Gestion des dépenses ad hoc** | Pas de suivi budgétaire, écarts mal maîtrisés |

**Conséquences métier** :
- ❌ Diminution de la productivité
- ❌ Satisfaction client réduite
- ❌ Difficultés à prendre des décisions stratégiques
- ❌ Croissance limitée faute de visibilité

---

### 1.2 Objectifs du Projet (SMART)

#### **Vision Générale**
Déployer une **plateforme de gestion intégrée** (ERP léger) pour centraliser tous les processus de l'entreprise (ventes, production, facturation, stock) et fournir une visibilité complète en temps réel.

#### **Objectifs SMART Détaillés**

| # | Objectif | Spécifique | Mesurable | Atteignable | Réaliste | Temporel |
|---|----------|-----------|-----------|------------|----------|----------|
| **O1** | **Accélérer le cycle devis-commande** | Création & validation devis en ligne  | Calcul de prix automatisé + conversion devis→commande | 1 jour estimé | Fin mois 1 |
| **O2** | **Centraliser la gestion clients** | Base de données clients unique avec historique complet | Accès instantané aux 100% des infos client (contacts, commandes, achats) | Formulaires de saisie + recherche | 8 clients actuels, scalable | Fin semaine 1 |
| **O3** | **Optimiser le suivi de production** | Tableau de bord commandes avec statuts visuels | 0 commandes "oubliées" ; 100% traçabilité | Dashboard + notifications d'alertes | Clair à implémenter | Fin mois 1 |
| **O4** | **Améliorer la gestion d'inventaire** | Alertes automatiques stock faible + rupture de stock | Réduction ruptures de 70% ; alertes en temps réel | Seuils configurables par article | Faisable avec localStorage | Fin semaine 2 |
| **O5** | **Fiabiliser la facturation** | Génération factures automatiques depuis commandes | 100% des factures conformes ; 0 erreur de montants | Calcul , HT/TTC, remises automatisées | Calcul bien défini | Fin mois 1 |
| **O6** | **Augmenter la visibilité financière** | Tableau de bord avec KPIs (CA, réalisations, dépenses) | Accès quotidien à : CA mois, % réalisation, dépenses vs budget | Dashboard 4 cartes stats + graphiques | Pour démo client | Fin mois 1 |
| **O7** | **Suivi dépenses centralisé** | Enregistrement & catégorisation automatiques des dépenses | Comparaison budget vs réel ; rapports par catégorie | CRUD complet + export CSV | MVP simple | Fin semaine 2 |
| **O8** | **Faciliter l'authentification sécurisée** | Connexion utilisateur avec récupération mot de passe | Accès limité aux données sensibles ; sécurité basique | Formulaires avec validation + mock backend | Pour démo/prototype | Fin semaine 1 |

#### **Objectifs Secondaires (Nice-to-have)**
- 🔄 Intégration email (devis/factures envoyés automatiquement)
- 📱 Application mobile responsive (consultation commandes en chantier)
- 📊 Rapports PDF (factures, commandes, stocks)
- 🔗 API REST pour intégrations futures (comptabilité, PAO)

---

### 1.3 Portée et Délimitation du Projet

#### **Fonctionnalités INCLUSES (IN SCOPE)**

##### **A. Authentification & Sécurité**
- ✅ Page de connexion avec validation email/mot de passe
- ✅ Récupération de mot de passe (mock email)
- ✅ Inscription utilisateur
- ✅ Déconnexion simple

##### **B. Gestion Clients (CRM)**
- ✅ CRUD clients : création, visualisation, modification, suppression
- ✅ Champs : nom, prénom, téléphone, email, adresse, ville, code postal
- ✅ Classification : Particulier / Professionnel
- ✅ Statut client : Actif / VIP / Inactif
- ✅ Historique : date inscription, nb commandes, total achats, dernière commande
- ✅ Recherche avancée (nom, tel, email, ville)

##### **C. Création & Gestion Devis**
- ✅ Sélection client
- ✅ Ajout articles avec dimensions (largeur/hauteur)
- ✅ Options produit : couleur aluminium, type vitrage
- ✅ **Calcul prix automatisé** :
  - Formats standards : prix fixe
  - Formats custom : surface × 65 000 DA/m² + 15% majoration
- ✅ Remise en % appliquée
- ✅ Acompte en % proposé
- ✅ Validité devis configurable (30j par défaut)
- ✅ Conditions paiement préconfigurées
- ✅ **Conversion automatique devis → commande** avec localStorage

##### **D. Gestion Commandes**
- ✅ Affichage liste commandes avec filtrage
- ✅ Statuts : En production / Prête / Livrée / Annulée
- ✅ Infos détaillées : client, articles, montants HT/TTC, dates
- ✅ Modal détails commandes
- ✅ Persistance localStorage pour commandes créées

##### **E. Facturation**
- ✅ Affichage factures avec statuts automatiques
- ✅ Statuts calulés : Payée / En attente / En retard
- ✅ Détails : montants HT, , TTC, montant payé
- ✅ Marquage comme payée avec confirmation
- ✅ Modal prévisualisation facture (format PDF simulé)
- ✅ Boutons : télécharger PDF, envoyer email, imprimer

##### **F. Gestion Stock**
- ✅ CRUD articles en stock
- ✅ Catégories : Profilés aluminium, Vitrage, Quincaillerie, Joints, Accessoires
- ✅ Champs : nom, référence, catégorie, quantité, unité, seuil alerte, prix achat, fournisseur, emplacement
- ✅ Statuts stock : Bon / Moyen / Faible / Critique (basé sur seuil)
- ✅ Alertes visuelles stock critique / faible
- ✅ Calcul valeur totale stock
- ✅ Export données (CSV)

##### **G. Gestion Dépenses**
- ✅ CRUD dépenses : ajout, modification, suppression
- ✅ Catégories : Achat matériaux, Transport, Électricité, Maintenance, Autre
- ✅ Filtrage par mois
- ✅ Recherche par description/catégorie
- ✅ Export CSV
- ✅ Résumé : total dépenses sélection


##### **I. Dashboard & Tableaux de Bord**
- ✅ 4 cartes statistiques : commandes du mois, revenus, clients actifs, produits
- ✅ Tableau commandes récentes
- ✅ Produits populaires avec graphiques
- ✅ Alertes : stock faible, devis en attente, livraisons du jour
- ✅ Sélecteur de période (semaine/mois/trimestre/année)

##### **J. Interface Utilisateur**
- ✅ Design moderne avec Tailwind CSS
- ✅ Responsive mobile/tablette/desktop
- ✅ Navigation sidebar/header
- ✅ Icônes Lucide React
- ✅ Notifications toast (React Hot Toast)

---

#### **Fonctionnalités EXCLUES (OUT OF SCOPE)**

| Fonctionnalité | Raison |
|---|---|
| ❌ **API REST Backend** | Utilisation localStorage pour MVP |
| ❌ **Base de données réelle** | Pas de serveur (prototype client-side) |
| ❌ **Authentification OAuth** | Trop complexe pour prototype ; mock suffisant |
| ❌ **Envoi email réel** | Mock uniquement (ForgotPassword) |
| ❌ **Génération PDF réelle** | Simulation UI seulement ; intégration possible future |
| ❌ **Application mobile native** | Web responsive uniquement |
| ❌ **Multi-utilisateurs** | Un seul utilisateur (admin) pour MVP |
| ❌ **Gestion fournisseurs complète** | Référence simple seulement |
| ❌ **Planification production** | Suivi seulement, pas de planning |
| ❌ **Comptabilité/Paie** | Hors périmètre |
| ❌ **Analytics avancées** | Dashboard basique seulement |

---

#### **Délimitations Techniques**

| Aspect | Limite |
|---|---|
| **Backend** | Aucun (localStorage seulement) |
| **Base de données** | localStorage navigateur (5-10 MB max) |
| **Utilisateurs** | 1 utilisateur (admin/gérante) |
| **Navigation** | Mono-page (SPA React) |
| **Scalabilité** | ~100 clients / ~1000 commandes max avec localStorage |
| **Sécurité** | Basique (pas de chiffrement, mock auth) |
| **Intégrations** | Aucune (bloc pours future) |

---

### 1.4 Méthodologie Adoptée

#### **Approche de Développement**

##### **A. Modèle Agile Simplifié (Kanban-Lite)**

L'équipe adopte une approche **Agile itérative légère** adaptée à un petit projet de prototype :

**Cycles de livraison :**
- 📅 **Itération 1** (Semaine 1) : Authentification + Gestion Clients + Dashboard
- 📅 **Itération 2** (Semaine 2) : Devis + Commandes + Stock  
- 📅 **Itération 3** (Semaine 3) : Facturation + Dépenses + Catalogue
- 📅 **Itération 4** (Semaine 4) : Refinements + Tests + Déploiement

**Réunions** :
- ✅ Daily standup : 15 min (si équipe > 1 personne)
- ✅ Review itération : fin de semaine
- ✅ Retrospective : ajustements méthodologiques

---

##### **B. Stack Technologique**

```
Frontend :
├── React 18+              (Framework UI)
├── React Router v6        (Routing SPA)
├── Tailwind CSS           (Styling responsive)
├── Lucide React           (Icons)
└── React Hot Toast        (Notifications)

État & Storage :
├── useState               (State management local)
└── localStorage           (Persistence données)

Outillage :
├── Vite                   (Build tool)
├── Node.js / npm          (Package manager)
├── Git/GitHub             (Version control)
└── VS Code                (IDE)

Déploiement :
├── Production : Vercel / Netlify
├── Environnement staging : localhost dev
└── Données : localStorage (prototype)
```

---

##### **C. Processus de Développement**

**Phase 1 : Conception (2 jours)**
- ✅ Wireframes/mockups UI (Figma ou papier)
- ✅ Architecture composants React
- ✅ Schéma données (localStorage structure)
- ✅ Spécification calculs métier (prix, TVA, etc.)

**Phase 2 : Implémentation (14 jours)**
- ✅ Développement par module fonctionnel (CRUD, logique, UI)
- ✅ Tests manuels au fur et à mesure
- ✅ Intégration localStorage (persistance)
- ✅ Responsive design testing

**Phase 3 : Validation & Déploiement (4 jours)**
- ✅ Tests complets (desktop, mobile, navigateurs multiples)
- ✅ Vérification calculs métier
- ✅ Optimisations performance
- ✅ Déploiement staging/production
- ✅ Documentation utilisateur

---

##### **D. Principes de Codage**

| Principe | Détail |
|----------|--------|
| **DRY** | Réutilisation composants (modales, tables, cartes) |
| **KISS** | Simplicité privilégiée sur complexité inutile |
| **Mobile-First** | Responsive depuis le début |
| **Accessibilité** | Alt text, couleurs contrastées, navigation clavier |
| **Documentation** | Commentaires métier, README clair |

---

##### **E. Gestion des Données**

**Structure localStorage** :
```javascript
// Clés stockées
localStorage.setItem('devis', JSON.stringify([
  { id, client, lignes, totals, dateCreation }
]));

localStorage.setItem('commandes', JSON.stringify([
  { id, client, dateCommande, articles, statut, montantTTC }
]));

localStorage.setItem('factures', JSON.stringify([
  { id, numeroFacture, client, montantTTC, statut, datePaiement }
]));

localStorage.setItem('stock', JSON.stringify([
  { id, nom, categorie, quantite, seuilAlerte, prixAchat }
]));
```

**Avantages** :
- ✅ Pas de backend nécessaire (MVP rapide)
- ✅ Données persistantes dans navigateur
- ✅ Offline-capable

**Limitations** :
- ❌ Pas de sync multi-devices
- ❌ Pas de multi-utilisateurs
- ❌ Limite 5-10 MB

---

##### **F. Qualité & Tests**

**Testing** (Approche manuelle MVP) :
- ✅ **Tests fonctionnels** : chaque CRUD testé
- ✅ **Tests calculs** : prix, TVA, montants vérifiés
- ✅ **Tests responsivité** : mobile (iPhone 12) / tablette / desktop
- ✅ **Tests navigateurs** : Chrome, Firefox, Safari, Edge
- ✅ **Scénarios critiques** : création devis → commande → facture

**Outils suggérés (future)** :
- Jest + React Testing Library (unit tests)
- Cypress (e2e tests)

---

##### **G. Documentation & Livrables**

**Livrables attendus** :
1. 📦 **Code source** : Repository GitHub
2. 📖 **README.md** : Installation, lancement, utilisation
3. 📋 **Documentation utilisateur** : Guide des modules
4. 📊 **Rapport technique** : Architecture, décisions, futur
5. 🎥 **Demo vidéo** : Walkthrough des fonctionnalités (optionnel)

---

##### **H. Communication & Feedbacks**

**Fréquence feedbacks** :
- 📞 Rencontre client semainale (jeudi) pour validation
- 💬 Slack/email pour questions urgentes
- 📊 Démo live des itérations chaque fin de semaine

**Gestion changements** :
- ⚠️ Changement scope = estimation retard communiquée
- ✅ Priorités établies clairement (MoSCoW : Must/Should/Could/Won't)

---

##### **I. Risques & Mitigation**

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| **localStorage limite (5-10 MB)** | Moyen | Moyen | Réduire données example ou migrer vers IndexedDB |
| **Calculs métier incorrect** | Faible | Haut | Tests exhaustifs prix avec métier |
| **Responsive broken** | Faible | Moyen | Tests sur devices variés + Tailwind breakpoints |
| **Performance UI lente** | Faible | Faible | Optimisation composants (React.memo, useMemo) |
| **Perte données localStorage** | Très faible | Haut | Avertissement avant suppression ; backup manuel |

---

##### **J. Critères d'Acceptation (Definition of Done)**

**Pour chaque itération, acceptation si :**
- ✅ Toutes les user stories termines
- ✅ Code reviewé et merged
- ✅ Tests manuels passés
- ✅ Responsive testée (mobile/desktop)
- ✅ Pas d'erreurs console (navigateur)
- ✅ Documentation mise à jour
- ✅ Démo client validée

---

## 2. RÉSUMÉ EXÉCUTIF

| Aspect | Détail |
|--------|--------|
| **Projet** | Plateforme web intégrée gestion menuiserie |
| **Client** | Menuiserie Aluminium, Oran |
| **Durée** | 4 semaines |
| **Budget** | MVP (prototype sans backend) |
| **Équipe** | 1 développeur full-stack |
| **Technologies** | React, Tailwind, localStorage |
| **Livrables** | Plateforme web + documentation |
| **Succès** | Utilisable en production légère ; foundation pour scale |

---

**Document Version** : 1.0  
**Date** : 11 janvier 2026  
**Auteur** : Équipe Développement  
**Approbation Client** : En attente signature











import React, { useState } from 'react';
import { BarChart3, Users, Package, ShoppingCart, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('mois');
 const [showLinks, setShowLinks] = useState(false);

 const recentOrders = [
  { id: 'CMD-001', client: 'Ahmed Benali', produit: 'Fenêtre coulissante', montant: 45000, statut: 'En production', date: '12/01/2026' },
  { id: 'CMD-002', client: 'Fatima Kader', produit: 'Porte d\'entrée', montant: 78500, statut: 'Livrée', date: '13/01/2026' },
  { id: 'CMD-003', client: 'Karim Meziane', produit: 'Volets roulants', montant: 32000, statut: 'En attente', date: '06/02/2026' },
  { id: 'CMD-004', client: 'Leila Sahraoui', produit: 'Baie vitrée', montant: 95000, statut: 'En production', date: '07/11/2026' }
];
// calule total automatique des revenus
const totalRevenus = recentOrders.reduce((total, order) => total + order.montant, 0);

 const stats = [
  { label: 'Commandes du mois', value: recentOrders.length, change: '+12%', icon: ShoppingCart, color: 'bg-blue-500' },
  { label: 'Revenus', value: totalRevenus.toLocaleString(), change: '+8%', icon: DollarSign, color: 'bg-green-500' },
  { label: 'Clients actifs', value: 128, change: '+5%', icon: Users, color: 'bg-purple-500' },
  { label: 'Produits', value: 156, change: '+2', icon: Package, color: 'bg-orange-500' }
];


  const topProducts = [
    { nom: 'Fenêtre coulissante', ventes: 23, revenus: '892,000 Fcfa' },
    { nom: 'Porte d\'entrée', ventes: 15, revenus: '1,245,000 Fcfa' },
    { nom: 'Volets roulants', ventes: 18, revenus: '576,000 Fcfa' },
    { nom: 'Baie vitrée', ventes: 12, revenus: '1,140,000 Fcfa' }
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