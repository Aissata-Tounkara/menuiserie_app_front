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
- **Équipe** : Petite structure (géran : Moussa Tounkara)

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









 <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-3xl font-bold mb-2">🪟</div>
                  <h2 className="text-2xl font-bold">FACTURE</h2>
                  <p className="text-blue-100 mt-1">Menuiserie Aluminium</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{selectedFacture.numeroFacture}</div>
                  <div className="mt-2 text-blue-100 text-sm">
                    <div>Date: {selectedFacture.dateEmission}</div>
                    <div>Échéance: {selectedFacture.dateEcheance}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="font-semibold mb-2">Entreprise:</div>
                  <div className="text-blue-100">
                    <div>Menuiserie Aluminium</div>
                    <div>Zone Industrielle, Oran</div>
                    <div>Tél: 041 XX XX XX</div>
                    <div>Email: contact@menuiserie.dz</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Facturé à:</div>
                  <div className="text-blue-100">
                    <div className="font-semibold text-white">{selectedFacture.client.nom}</div>
                    <div>{selectedFacture.client.adresse}</div>
                    <div>Tél: {selectedFacture.client.tel}</div>
                    <div>Email: {selectedFacture.client.email}</div>
                  </div>
                </div>
              </div>
            </div>
