/**
 * Service pour la gestion des clients
 * Centralise toutes les requêtes liées aux clients
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const clientsService = {
    /**
     * Récupérer la liste des clients
     * @param {Object} options - Paramètres de pagination/filtrage
     * @returns {Promise<Object>} Liste des clients
     */
    async getClients(options = {}) {
        const queryParams = new URLSearchParams(options).toString();
        const endpoint = queryParams ? `${ENDPOINTS.CUSTOMERS.LIST}?${queryParams}` : ENDPOINTS.CUSTOMERS.LIST;
        return await apiClient.get(endpoint);
    },

    /**
     * Récupérer un client spécifique
     * @param {number} id - ID du client
     * @returns {Promise<Object>} Détails du client
     */
    async getClient(id) {
        if (!id) throw new Error('L\'ID du client est requis');
        return await apiClient.get(ENDPOINTS.CUSTOMERS.DETAIL(id));
    },

    /**
     * Créer un nouveau client
     * @param {Object} data - Données du client
     * @returns {Promise<Object>} Client créé
     */
    async createClient(data) {
        if (!data.email || !data.nom) {
            throw new Error('Email et nom sont requis');
        }
        const response = await apiClient.post(ENDPOINTS.CUSTOMERS.CREATE, data);
        return response;
    },

    /**
     * Mettre à jour un client
     * @param {number} id - ID du client
     * @param {Object} data - Données à mettre à jour
     * @returns {Promise<Object>} Client mis à jour
     */
    async updateClient(id, data) {
        if (!id) throw new Error('L\'ID du client est requis');
        return await apiClient.put(ENDPOINTS.CUSTOMERS.UPDATE(id), data);
    },

    /**
     * Supprimer un client
     * @param {number} id - ID du client
     * @returns {Promise<Object>} Réponse du serveur
     */
    async deleteClient(id) {
        if (!id) throw new Error('L\'ID du client est requis');
        return await apiClient.delete(ENDPOINTS.CUSTOMERS.DELETE(id));
    },

    /**
     * Mettre à jour le statut d'un client
     * @param {number} id - ID du client
     * @param {string} status - Nouveau statut
     * @returns {Promise<Object>} Client mis à jour
     */
    async updateClientStatus(id, status) {
        if (!id || !status) {
            throw new Error('ID et statut sont requis');
        }
        return await apiClient.patch(ENDPOINTS.CUSTOMERS.UPDATE_STATUS(id), { statut: status });
    },

    /**
     * Récupérer les statistiques des clients
     * @returns {Promise<Object>} Statistiques
     */
    async getClientStats() {
        return await apiClient.get(ENDPOINTS.CUSTOMERS.STATS);
    },

    /**
     * Rechercher les clients (par nom, email, téléphone)
     * @param {string} query - Terme de recherche
     * @returns {Promise<Array>} Résultats de recherche
     */
    async searchClients(query) {
        if (!query || query.trim() === '') {
            return [];
        }
        return await apiClient.get(`${ENDPOINTS.CUSTOMERS.LIST}?search=${encodeURIComponent(query)}`);
    },
};
