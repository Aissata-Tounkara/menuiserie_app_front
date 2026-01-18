/**
 * Service pour la gestion des devis
 * Centralise toutes les requêtes liées aux devis
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { MESSAGES } from '../utils/constants';

export const devisService = {
    /**
     * Récupérer la liste des devis
     * @param {Object} options - Paramètres de pagination/filtrage
     * @returns {Promise<Object>} Liste des devis
     */
    async getDevis(options = {}) {
        const queryParams = new URLSearchParams(options).toString();
        const endpoint = queryParams ? `${ENDPOINTS.QUOTES.LIST}?${queryParams}` : ENDPOINTS.QUOTES.LIST;
        return await apiClient.get(endpoint);
    },

    /**
     * Récupérer un devis spécifique
     * @param {number} id - ID du devis
     * @returns {Promise<Object>} Détails du devis
     */
    async getDevis(id) {
        if (!id) throw new Error('L\'ID du devis est requis');
        return await apiClient.get(ENDPOINTS.QUOTES.DETAIL(id));
    },

    /**
     * Créer un nouveau devis
     * @param {Object} data - Données du devis
     * @returns {Promise<Object>} Devis créé
     */
    async createDevis(data) {
        if (!data.client_id || !data.lignes || data.lignes.length === 0) {
        throw new Error('Client et articles sont requis');
        }
        const response = await apiClient.post(ENDPOINTS.QUOTES.CREATE, data);
        return response;
    },

    /**
     * Mettre à jour un devis
     * @param {number} id - ID du devis
     * @param {Object} data - Données à mettre à jour
     * @returns {Promise<Object>} Devis mis à jour
     */
    async updateDevis(id, data) {
        if (!id) throw new Error('L\'ID du devis est requis');
        return await apiClient.put(ENDPOINTS.QUOTES.UPDATE(id), data);
    },

    /**
     * Supprimer un devis
     * @param {number} id - ID du devis
     * @returns {Promise<Object>} Réponse du serveur
     */
    async deleteDevis(id) {
        if (!id) throw new Error('L\'ID du devis est requis');
        return await apiClient.delete(ENDPOINTS.QUOTES.DELETE(id));
    },

    /**
     * Valider un devis et créer une facture/commande
     * @param {number} id - ID du devis
     * @param {Object} data - Données additionnelles (optionnel)
     * @returns {Promise<Object>} Facture/Commande créée
     */
    async validateAndInvoice(id, data = {}) {
        if (!id) throw new Error('L\'ID du devis est requis');
        return await apiClient.post(ENDPOINTS.QUOTES.VALIDATE_AND_INVOICE(id), data);
    },

    /**
     * Rechercher les devis (par numéro, client, statut)
     * @param {string} query - Terme de recherche
     * @returns {Promise<Array>} Résultats de recherche
     */
    async searchDevis(query) {
        if (!query || query.trim() === '') {
            return [];
        }
        return await apiClient.get(`${ENDPOINTS.QUOTES.LIST}?search=${encodeURIComponent(query)}`);
    },

    /**
     * Obtenir les devis par statut
     * @param {string} statut - Statut à filtrer (Brouillon, Envoyé, Accepté, Rejeté, Expiré)
     * @returns {Promise<Array>} Devis filtrés
     */
    async getDevisByStatut(statut) {
        if (!statut) throw new Error('Le statut est requis');
        return await apiClient.get(`${ENDPOINTS.QUOTES.LIST}?statut=${encodeURIComponent(statut)}`);
    },

    /**
     * Obtenir les devis d'un client
     * @param {number} clientId - ID du client
     * @returns {Promise<Array>} Devis du client
     */
    async getDevisByClient(clientId) {
        if (!clientId) throw new Error('L\'ID du client est requis');
        return await apiClient.get(`${ENDPOINTS.QUOTES.LIST}?client_id=${clientId}`);
    },

    /**
     * Exporter un devis en PDF
     * @param {number} id - ID du devis
     * @returns {Promise<Blob>} Fichier PDF
     */
    async exportPDF(id) {
        if (!id) throw new Error('L\'ID du devis est requis');
        return await apiClient.download(`${ENDPOINTS.QUOTES.DETAIL(id)}/export-pdf`);
    },
};
