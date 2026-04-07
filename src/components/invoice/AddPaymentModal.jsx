// src/components/invoice/AddPaymentModal.jsx
import React, { useState } from 'react';
import Modal from '../ui/Modal';

export default function AddPaymentModal({ isOpen, onClose, facture, onPaymentAdded }) {
  const [formData, setFormData] = useState({
    montant: '',
    date_paiement: new Date().toISOString().split('T')[0],
    mode_paiement: 'Espèces',
    reference: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const modesPaiement = ['Espèces', 'Virement', 'Mobile Money', 'Chèque', 'Carte'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/factures/${facture.id}/paiements`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  },
  body: JSON.stringify(formData)
});

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || 'Erreur serveur');
      
      onPaymentAdded(result.data);
      onClose();
      
      // Reset form
      setFormData({
        montant: '',
        date_paiement: new Date().toISOString().split('T')[0],
        mode_paiement: 'Espèces',
        reference: '',
        notes: ''
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calcul du montant maximum payable
  const maxPayable = facture?.reste_a_payer || (facture?.montant_ttc - facture?.total_paye) || 0;

  return (
    <Modal isOpen={isOpen} title="Enregistrer un paiement" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}

        {/* Info facture */}
        <div className="bg-blue-50 p-3 rounded text-sm">
          <p><strong>Facture :</strong> {facture?.numero_facture}</p>
          <p><strong>Client :</strong> {facture?.client?.nom}</p>
          <p><strong>Reste à payer :</strong> {maxPayable?.toLocaleString()} FCFA</p>
        </div>

        {/* Montant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant du paiement *
          </label>
          <input
            type="number"
            name="montant"
            value={formData.montant}
            onChange={handleChange}
            min="0.01"
            max={maxPayable}
            step="0.01"
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum: {maxPayable?.toLocaleString()} FCFA
          </p>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de paiement *
          </label>
          <input
            type="date"
            name="date_paiement"
            value={formData.date_paiement}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mode de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mode de paiement *
          </label>
          <select
            name="mode_paiement"
            value={formData.mode_paiement}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {modesPaiement.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>

        {/* Référence (optionnel) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Référence transaction
          </label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            maxLength="100"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: TXN-2024-001"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            maxLength="500"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Informations complémentaires..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !formData.montant}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer le paiement'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}