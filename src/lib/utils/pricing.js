// src/lib/utils/pricing.js
// Doit rester IDENTIQUE à PricingService.php

const FORMATS_STANDARD = {
  'Porte-2Battan':      { largeur: 1.20, hauteur: 2.10, prix: 147500 },
  'Porte-1Battan':      { largeur: 0.80, hauteur: 2.10, prix: 97500  },
  'Porte-Toilette':     { largeur: 0.70, hauteur: 2.10, prix: 87500  },
  'Fenêtre Coulisant':  { largeur: 1.20, hauteur: 1.10, prix: 97500  },
  'Fenêtre toilette':   { largeur: 0.60, hauteur: 0.60, prix: 37500  },
};

const PRIX_PORTE_CM2   = 5.8;
const FENETRE_PRIX_CM2 = 8.38;
const PRIX_ALU_CM2     = 9.00;
const TAUX_MAJORATION  = 0;

function estPorte(produit)   { return produit.toLowerCase().includes('porte'); }
function estFenetre(produit) {
  const p = produit.toLowerCase();
  return p.includes('fenêtre') || p.includes('fenetre');
}

export function calculerPrixUnitaire(produit, largeur, hauteur) {
  const L = parseFloat(largeur);
  const H = parseFloat(hauteur);
  if (!produit || isNaN(L) || isNaN(H)) return 0;

  // 1. Format standard ?
  const fmt = FORMATS_STANDARD[produit];
  if (fmt && Math.abs(fmt.largeur - L) < 0.01 && Math.abs(fmt.hauteur - H) < 0.01) {
    return fmt.prix;
  }

  // 2. Dimensions custom
  const surfaceCm2 = (L * 100) * (H * 100);
  let prixBase;
  if (estFenetre(produit))     prixBase = surfaceCm2 * FENETRE_PRIX_CM2;
  else if (estPorte(produit))  prixBase = surfaceCm2 * PRIX_PORTE_CM2;
  else                         prixBase = surfaceCm2 * PRIX_ALU_CM2;

  return Math.round(prixBase * (1 + TAUX_MAJORATION / 100));
}

export function calculerTotaux(lignes, remise = 0, acompte = 0) {
  const sousTotal = lignes.reduce((sum, l) => {
    const pu = calculerPrixUnitaire(l.produit, l.largeur, l.hauteur);
    return sum + pu * (parseInt(l.quantite) || 1);
  }, 0);

  const montantRemise = sousTotal * (remise / 100);
  const totalHT       = sousTotal - montantRemise;
  const tva           = 0; // désactivée
  const totalTTC      = totalHT + tva;
  const montantAcompte = totalTTC * (acompte / 100);
  const solde         = totalTTC - montantAcompte;

  return { sousTotal, montantRemise, totalHT, tva, totalTTC, montantAcompte, solde };
}

export function formaterPrix(montant) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(montant)) + ' Fcfa';
}