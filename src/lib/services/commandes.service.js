/**
 * Service pour la gestion des commandes
 * Centralise toutes les requêtes liées aux commandes
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { MESSAGES } from '../utils/constants';

export const commandesService = {
    /**
     * Récupérer la liste des commandes
     * @param {Object} options - Paramètres de pagination/filtrage
     * @returns {Promise<Object>} Liste des commandes
     */
    async getCommandes(options = {}) {
        const queryParams = new URLSearchParams(options).toString();
        const endpoint = queryParams ? `${ENDPOINTS.ORDERS.LIST}?${queryParams}` : ENDPOINTS.ORDERS.LIST;
        return await apiClient.get(endpoint);
    },

    /**
     * Récupérer une commande spécifique
     * @param {number} id - ID de la commande
     * @returns {Promise<Object>} Détails de la commande
     */
    async getCommande(id) {
        if (!id) throw new Error('L\'ID de la commande est requis');
        return await apiClient.get(ENDPOINTS.ORDERS.DETAIL(id));
    },

    /**
     * Créer une nouvelle commande
     * @param {Object} data - Données de la commande
     * @returns {Promise<Object>} Commande créée
     */
    async createCommande(data) {
        if (!data.client_id || !data.articles) {
            throw new Error('Client et articles sont requis');
        }
        const response = await apiClient.post(ENDPOINTS.ORDERS.CREATE, data);
        return response;
    },

    /**
     * Mettre à jour une commande
     * @param {number} id - ID de la commande
     * @param {Object} data - Données à mettre à jour
     * @returns {Promise<Object>} Commande mise à jour
     */
    async updateCommande(id, data) {
        if (!id) throw new Error('L\'ID de la commande est requis');
        return await apiClient.put(ENDPOINTS.ORDERS.UPDATE(id), data);
    },

    /**
     * Supprimer une commande
     * @param {number} id - ID de la commande
     * @returns {Promise<Object>} Réponse du serveur
     */
    async deleteCommande(id) {
        if (!id) throw new Error('L\'ID de la commande est requis');
        return await apiClient.delete(ENDPOINTS.ORDERS.DELETE(id));
    },

    /**
     * Mettre à jour le statut d'une commande
     * @param {number} id - ID de la commande
     * @param {string} status - Nouveau statut
     * @returns {Promise<Object>} Commande mise à jour
     */
    async updateCommandeStatus(id, status) {
        if (!id || !status) {
            throw new Error('ID et statut sont requis');
        }
        return await apiClient.post(ENDPOINTS.ORDERS.UPDATE_STATUS(id), { statut: status });
    },

    /**
     * Récupérer les statistiques des commandes
     * @returns {Promise<Object>} Statistiques
     */
    async getCommandeStats() {
        return await apiClient.get(ENDPOINTS.ORDERS.STATS);
    },

    /**
     * Rechercher les commandes (par numéro, client, statut)
     * @param {string} query - Terme de recherche
     * @returns {Promise<Array>} Résultats de recherche
     */
    async searchCommandes(query) {
        if (!query || query.trim() === '') {
            return [];
        }
        return await apiClient.get(`${ENDPOINTS.ORDERS.LIST}?search=${encodeURIComponent(query)}`);
    },

    /**
     * Obtenir les commandes par statut
     * @param {string} statut - Statut à filtrer
     * @returns {Promise<Array>} Commandes filtrées
     */
    async getCommandesByStatut(statut) {
        if (!statut) throw new Error('Le statut est requis');
        return await apiClient.get(`${ENDPOINTS.ORDERS.LIST}?statut=${encodeURIComponent(statut)}`);
    },

    /**
     * Obtenir les commandes d'un client
     * @param {number} clientId - ID du client
     * @returns {Promise<Array>} Commandes du client
     */
    async getCommandesByClient(clientId) {
        if (!clientId) throw new Error('L\'ID du client est requis');
        return await apiClient.get(`${ENDPOINTS.ORDERS.LIST}?client_id=${clientId}`);
    },
};
