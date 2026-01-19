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
        return await apiClient.download(`${ENDPOINTS.INVOICES.DETAIL(id)}/export-pdf`);
    },
};
