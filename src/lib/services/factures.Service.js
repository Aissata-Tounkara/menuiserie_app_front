/**
 * Service pour la gestion des factures
 * Centralise toutes les requêtes liées aux factures
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const facturesService = {
    /**
     * Récupérer la liste des factures
     * @param {Object} options - Paramètres de pagination/filtrage
     * @returns {Promise<Object>} Liste des factures
     */
    async getFactures(options = {}) {
        const queryParams = new URLSearchParams(options).toString();
        const endpoint = queryParams ? `${ENDPOINTS.INVOICES.LIST}?${queryParams}` : ENDPOINTS.INVOICES.LIST;
        return await apiClient.get(endpoint);
    },

    /**
     * Récupérer une facture spécifique
     * @param {number} id - ID de la facture
     * @returns {Promise<Object>} Détails de la facture
     */
    async getFacture(id) {
        if (!id) throw new Error('L\'ID de la facture est requis');
        return await apiClient.get(ENDPOINTS.INVOICES.DETAIL(id));
    },

    /**
     * Créer une nouvelle facture
     * @param {Object} data - Données de la facture
     * @returns {Promise<Object>} Facture créée
     */
    async createFacture(data) {
        if (!data.commande_id || !data.client_id) {
            throw new Error('Commande et client sont requis');
        }
        const response = await apiClient.post(ENDPOINTS.INVOICES.CREATE, data);
        return response;
    },

    /**
     * Mettre à jour une facture
     * @param {number} id - ID de la facture
     * @param {Object} data - Données à mettre à jour
     * @returns {Promise<Object>} Facture mise à jour
     */
    async updateFacture(id, data) {
        if (!id) throw new Error('L\'ID de la facture est requis');
        return await apiClient.put(ENDPOINTS.INVOICES.UPDATE(id), data);
    },

    /**
     * Supprimer une facture
     * @param {number} id - ID de la facture
     * @returns {Promise<Object>} Réponse du serveur
     */
    async deleteFacture(id) {
        if (!id) throw new Error('L\'ID de la facture est requis');
        return await apiClient.delete(ENDPOINTS.INVOICES.DELETE(id));
    },

    /**
     * Marquer une facture comme payée
     * @param {number} id - ID de la facture
     * @param {Object} data - Données de paiement
     * @returns {Promise<Object>} Facture mise à jour
     */
    async markAsPaid(id, data = {}) {
        if (!id) throw new Error('L\'ID de la facture est requis');
        return await apiClient.post(ENDPOINTS.INVOICES.MARK_AS_PAID(id), data);
    },

    /**
     * Récupérer les statistiques des factures
     * @returns {Promise<Object>} Statistiques
     */
    async getFacturesStats() {
        return await apiClient.get(ENDPOINTS.INVOICES.STATS);
    },

    /**
     * Rechercher les factures (par numéro, client, statut)
     * @param {string} query - Terme de recherche
     * @returns {Promise<Array>} Résultats de recherche
     */
    async searchFactures(query) {
        if (!query || query.trim() === '') {
            return [];
        }
        return await apiClient.get(`${ENDPOINTS.INVOICES.LIST}?search=${encodeURIComponent(query)}`);
    },

    /**
     * Obtenir les factures par statut
     * @param {string} statut - Statut à filtrer (Brouillon, Envoyée, Payée, Impayée)
     * @returns {Promise<Array>} Factures filtrées
     */
    async getFacturesByStatut(statut) {
        if (!statut) throw new Error('Le statut est requis');
        return await apiClient.get(`${ENDPOINTS.INVOICES.LIST}?statut=${encodeURIComponent(statut)}`);
    },

    /**
     * Obtenir les factures d'un client
     * @param {number} clientId - ID du client
     * @returns {Promise<Array>} Factures du client
     */
    async getFacturesByClient(clientId) {
        if (!clientId) throw new Error('L\'ID du client est requis');
        return await apiClient.get(`${ENDPOINTS.INVOICES.LIST}?client_id=${clientId}`);
    },

    /**
     * Exporter une facture en PDF
     * @param {number} id - ID de la facture
     * @returns {Promise<Blob>} Fichier PDF
     */
    async exportPDF(id) {
        if (!id) throw new Error('L\'ID de la facture est requis');
        return await apiClient.download(`${ENDPOINTS.INVOICES.DETAIL(id)}/telecharger-pdf`);
    },

        /**
     * Exporter une facture en PDF
     * @param {number} id - ID de la facture
     * @returns {Promise<Blob>} Fichier PDF
     */
    async exportPDF(id) {
        if (!id) throw new Error('L\'ID de la facture est requis');
        return await apiClient.download(`${ENDPOINTS.INVOICES.DETAIL(id)}/telecharger-pdf`);
    },

    // ============ 🆕 MÉTHODES PAIEMENTS ============

    /**
     * Ajouter un paiement à une facture
     * POST /api/factures/{id}/paiements
     * @param {number} factureId - ID de la facture
     * @param {Object} paymentData - { montant, date_paiement, mode_paiement, reference?, notes? }
     * @returns {Promise<Object>} Réponse avec paiement et facture mise à jour
     */
    async addPayment(factureId, paymentData) {
        if (!factureId) throw new Error('L\'ID de la facture est requis');
        if (!paymentData?.montant || paymentData.montant <= 0) {
            throw new Error('Le montant du paiement est requis et doit être > 0');
        }
        if (!paymentData?.date_paiement) {
            throw new Error('La date de paiement est requise');
        }
        if (!paymentData?.mode_paiement) {
            throw new Error('Le mode de paiement est requis');
        }
        
        return await apiClient.post(
            ENDPOINTS.INVOICES.PAIEMENTS.CREATE(factureId), 
            paymentData
        );
    },

    /**
     * Récupérer la liste des paiements d'une facture
     * GET /api/factures/{id}/paiements
     * @param {number} factureId - ID de la facture
     * @param {Object} options - Pagination et filtres
     * @returns {Promise<Object>} Liste paginée des paiements
     */
    async getPaiements(factureId, options = {}) {
        if (!factureId) throw new Error('L\'ID de la facture est requis');
        
        const queryParams = new URLSearchParams(options).toString();
        const endpoint = queryParams 
            ? `${ENDPOINTS.INVOICES.PAIEMENTS.LIST(factureId)}?${queryParams}`
            : ENDPOINTS.INVOICES.PAIEMENTS.LIST(factureId);
            
        return await apiClient.get(endpoint);
    },

    /**
     * Récupérer un paiement spécifique
     * GET /api/factures/{factureId}/paiements/{paiementId}
     * @param {number} factureId - ID de la facture
     * @param {number} paiementId - ID du paiement
     * @returns {Promise<Object>} Détails du paiement
     */
    async getPaiement(factureId, paiementId) {
        if (!factureId) throw new Error('L\'ID de la facture est requis');
        if (!paiementId) throw new Error('L\'ID du paiement est requis');
        
        return await apiClient.get(
            ENDPOINTS.INVOICES.PAIEMENTS.DETAIL(factureId, paiementId)
        );
    },

    /**
     * Mettre à jour un paiement existant
     * PUT /api/factures/{factureId}/paiements/{paiementId}
     * @param {number} factureId - ID de la facture
     * @param {number} paiementId - ID du paiement
     * @param {Object} paymentData - Données à mettre à jour
     * @returns {Promise<Object>} Paiement mis à jour
     */
    async updatePayment(factureId, paiementId, paymentData) {
        if (!factureId) throw new Error('L\'ID de la facture est requis');
        if (!paiementId) throw new Error('L\'ID du paiement est requis');
        
        return await apiClient.put(
            ENDPOINTS.INVOICES.PAIEMENTS.UPDATE(factureId, paiementId),
            paymentData
        );
    },

    /**
     * Supprimer un paiement
     * DELETE /api/factures/{factureId}/paiements/{paiementId}
     * @param {number} factureId - ID de la facture
     * @param {number} paiementId - ID du paiement
     * @returns {Promise<Object>} Réponse du serveur
     */
    async deletePayment(factureId, paiementId) {
        if (!factureId) throw new Error('L\'ID de la facture est requis');
        if (!paiementId) throw new Error('L\'ID du paiement est requis');
        
        return await apiClient.delete(
            ENDPOINTS.INVOICES.PAIEMENTS.DELETE(factureId, paiementId)
        );
    },
};