// src/components/invoices/InvoicePrintView.jsx
import React from 'react';
import { Calendar, CheckCircle, CreditCard } from 'lucide-react';

const InvoicePrintView = ({ facture }) => {
  // Fonction utilitaire pour formater les dates (au cas où)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr; // format déjà dd/mm/yyyy
  };

  // Calcul du statut actuel
  const getActualStatus = () => {
    if (facture.montantPaye >= facture.montantTTC) return 'Payée';
    const [jour, mois, annee] = facture.dateEcheance.split('/');
    const echeanceDate = new Date(annee, mois - 1, jour);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    echeanceDate.setHours(0, 0, 0, 0);
    return echeanceDate < today ? 'En retard' : 'En attente';
  };

  const status = getActualStatus();

  // Couleurs par statut
  const getStatusColor = (statut) => {
    switch(statut) {
      case 'Payée': return 'text-green-600 bg-green-50 border-green-200';
      case 'En attente': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'En retard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="invoice-print max-w-4xl mx-auto p-8 bg-white">
      {/* EN-TÊTE NOIR COMME SUR LA PHOTO */}
      <div className="bg-gray-900 text-white rounded-t-xl p-6 flex justify-between items-start">
        {/* Logo + Nom entreprise */}
        <div className="flex items-center gap-3">
          {/* Logo carré vert avec "T" */}
          <div className="bg-teal-500 w-12 h-12 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">TOUARA</h1>
            <p className="text-teal-300 text-sm">Menuiserie Aluminium</p>
          </div>
        </div>

        {/* FACTURE + Date */}
        <div className="text-right">
          <h2 className="text-3xl font-extrabold mb-2">FACTURE</h2>
          <div className="bg-gray-800 rounded-md px-4 py-2 inline-block">
            <div className="text-xs text-teal-300">Date d'émission</div>
            <div className="font-semibold">{formatDate(facture.dateEmission)}</div>
          </div>
        </div>
      </div>

      {/* Informations de l'entreprise (sous l'en-tête noir) */}
      <div className="border-b border-gray-200 pb-6 pt-4">
        <div className="text-sm space-y-1">
          <div><strong>Chez Moussa TOUNKARA</strong></div>
          <div>COMMERÇANT – FAUTEUILLE BUREAUTIQUE – ALUMINIUM ALTRADE, BRONZE, CHAMPAGNE – LAC BLANC – FER – BOIS & DIVERS</div>
          <div>HIPPODROME Rue 224 — Tél : 79 06 44 89 — NIF : 0822099M</div>
          <div>Bamako – République du Mali</div>
        </div>
      </div>

      {/* Informations client et facture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Informations Client</h3>
          <div className="space-y-1">
            <div><strong>Nom :</strong> {facture.client.nom}</div>
            <div><strong>Téléphone :</strong> {facture.client.tel}</div>
            <div><strong>Email :</strong> {facture.client.email}</div>
            <div><strong>Adresse :</strong> {facture.client.adresse}</div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Détails de la Facture</h3>
          <div className="space-y-1">
            <div><strong>Numéro :</strong> {facture.numeroFacture}</div>
            <div><strong>Commande :</strong> {facture.commande}</div>
            <div><strong>Date émission :</strong> {formatDate(facture.dateEmission)}</div>
            <div><strong>Date d’échéance :</strong> {formatDate(facture.dateEcheance)}</div>
            <div><strong>Statut :</strong> 
              <span className={`px-3 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des articles */}
      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-3">Articles</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Désignation</th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-gray-600">Qté</th>
              <th className="text-right py-2 px-3 text-sm font-semibold text-gray-600">Prix unit.</th>
              <th className="text-right py-2 px-3 text-sm font-semibold text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {facture.articles.map((article, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-2 px-3 text-sm">{article.designation}</td>
                <td className="py-2 px-3 text-sm text-center">{article.quantite}</td>
                <td className="py-2 px-3 text-sm text-right">{article.prixUnitaire.toLocaleString()} Fcfa</td>
                <td className="py-2 px-3 text-sm font-semibold text-right">{article.total.toLocaleString()} Fcfa</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Récapitulatif des totaux */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Sous-total HT:</span>
            <span>{facture.montantHT.toLocaleString()} Fcfa</span>
          </div>
          <div className="flex justify-between">
            <span>TVA (0%):</span>
            <span>{facture.tva.toLocaleString()} Fcfa</span>
          </div>
          <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-lg">
            <span>Total TTC:</span>
            <span className="text-blue-600">{facture.montantTTC.toLocaleString()} Fcfa</span>
          </div>
          {facture.montantPaye > 0 && (
            <>
              <div className="flex justify-between text-green-600">
                <span>Montant payé:</span>
                <span>{facture.montantPaye.toLocaleString()} Fcfa</span>
              </div>
              {facture.montantTTC - facture.montantPaye > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Reste à payer:</span>
                  <span>{(facture.montantTTC - facture.montantPaye).toLocaleString()} Fcfa</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Paiement (si payé) */}
      {status === 'Payée' && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Paiement effectué</h4>
          </div>
          <div className="text-sm text-green-800 space-y-1 ml-8">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Mode: {facture.modePaiement}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date: {formatDate(facture.datePaiement)}
            </div>
          </div>
        </div>
      )}

      {/* Pied de page */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>Merci de votre confiance • Garantie 2 ans • Livraison incluse</p>
        <p>RCCM : MA-BKO-XXXXXX • NIF : 0822099M • CNSS : XXXXXXX</p>
      </div>
    </div>
  );
};

export default InvoicePrintView;