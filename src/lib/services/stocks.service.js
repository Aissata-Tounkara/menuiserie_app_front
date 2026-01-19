/**
 * Service pour la gestion des stocks (articles et mouvements)
 * Centralise toutes les requêtes liées aux articles et au stock
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const stocksService = {
    // ========================
    // ARTICLES (PRODUITS)
    // ========================

    /**
     * Récupérer la liste des articles
     * @param {Object} options - Paramètres de pagination/filtrage
     * @returns {Promise<Object>} Liste des articles
     */
    async getArticles(options = {}) {
        const queryParams = new URLSearchParams(options).toString();
        const endpoint = queryParams ? `${ENDPOINTS.PRODUCTS.LIST}?${queryParams}` : ENDPOINTS.PRODUCTS.LIST;
        return await apiClient.get(endpoint);
    },

    /**
     * Récupérer un article spécifique
     * @param {number} id - ID de l'article
     * @returns {Promise<Object>} Détails de l'article
     */
    async getArticle(id) {
        if (!id) throw new Error('L\'ID de l\'article est requis');
        return await apiClient.get(ENDPOINTS.PRODUCTS.DETAIL(id));
    },

    /**
     * Créer un nouvel article
     * @param {Object} data - Données de l'article
     * @returns {Promise<Object>} Article créé
     */
    async createArticle(data) {
        if (!data.nom || !data.reference) {
            throw new Error('Le nom et la référence sont requis');
        }
        const response = await apiClient.post(ENDPOINTS.PRODUCTS.CREATE, data);
        return response;
    },

    /**
     * Mettre à jour un article
     * @param {number} id - ID de l'article
     * @param {Object} data - Données à mettre à jour
     * @returns {Promise<Object>} Article mis à jour
     */
    async updateArticle(id, data) {
        if (!id) throw new Error('L\'ID de l\'article est requis');
        return await apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), data);
    },

    /**
     * Supprimer un article
     * @param {number} id - ID de l'article
     * @returns {Promise<Object>} Réponse du serveur
     */
    async deleteArticle(id) {
        if (!id) throw new Error('L\'ID de l\'article est requis');
        return await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id));
    },

    /**
     * Ajuster le stock d'un article
     * @param {number} id - ID de l'article
     * @param {Object} data - Quantité à ajouter/retirer
     * @returns {Promise<Object>} Article mis à jour
     */
    async adjustStock(id, data) {
        if (!id || !data.quantite) {
            throw new Error('ID et quantité sont requis');
        }
        return await apiClient.post(ENDPOINTS.PRODUCTS.ADJUST_STOCK(id), data);
    },

    /**
     * Récupérer les alertes de stock
     * @returns {Promise<Array>} Articles en alerte stock
     */
    async getStockAlerts() {
        return await apiClient.get(ENDPOINTS.PRODUCTS.ALERTS);
    },

    /**
     * Récupérer les statistiques des articles
     * @returns {Promise<Object>} Statistiques
     */
    async getArticlesStats() {
        return await apiClient.get(ENDPOINTS.PRODUCTS.STATS);
    },

    /**
     * Rechercher les articles
     * @param {string} query - Terme de recherche
     * @returns {Promise<Array>} Résultats de recherche
     */
    async searchArticles(query) {
        if (!query || query.trim() === '') {
            return [];
        }
        return await apiClient.get(`${ENDPOINTS.PRODUCTS.LIST}?search=${encodeURIComponent(query)}`);
    },

    // ========================
    // MOUVEMENTS DE STOCK
    // ========================

    /**
     * Récupérer la liste des mouvements de stock
     * @param {Object} options - Paramètres de pagination/filtrage
     * @returns {Promise<Object>} Liste des mouvements
     */
    async getMovements(options = {}) {
        const queryParams = new URLSearchParams(options).toString();
        const endpoint = queryParams ? `${ENDPOINTS.STOCK_MOVEMENTS.LIST}?${queryParams}` : ENDPOINTS.STOCK_MOVEMENTS.LIST;
        return await apiClient.get(endpoint);
    },

    /**
     * Récupérer un mouvement spécifique
     * @param {number} id - ID du mouvement
     * @returns {Promise<Object>} Détails du mouvement
     */
    async getMovement(id) {
        if (!id) throw new Error('L\'ID du mouvement est requis');
        return await apiClient.get(ENDPOINTS.STOCK_MOVEMENTS.DETAIL(id));
    },

    /**
     * Créer un nouveau mouvement de stock
     * @param {Object} data - Données du mouvement
     * @returns {Promise<Object>} Mouvement créé
     */
    async createMovement(data) {
        if (!data.article_id || !data.type) {
            throw new Error('Article et type de mouvement sont requis');
        }
        const response = await apiClient.post(ENDPOINTS.STOCK_MOVEMENTS.CREATE, data);
        return response;
    },

    /**
     * Supprimer un mouvement
     * @param {number} id - ID du mouvement
     * @returns {Promise<Object>} Réponse du serveur
     */
    async deleteMovement(id) {
        if (!id) throw new Error('L\'ID du mouvement est requis');
        return await apiClient.delete(ENDPOINTS.STOCK_MOVEMENTS.DELETE(id));
    },

    /**
     * Récupérer l'historique des mouvements d'un article
     * @param {number} articleId - ID de l'article
     * @returns {Promise<Array>} Historique des mouvements
     */
    async getMovementHistory(articleId) {
        if (!articleId) throw new Error('L\'ID de l\'article est requis');
        return await apiClient.get(ENDPOINTS.STOCK_MOVEMENTS.HISTORY_BY_PRODUCT(articleId));
    },

    /**
     * Récupérer les statistiques des mouvements
     * @returns {Promise<Object>} Statistiques
     */
    async getMovementsStats() {
        return await apiClient.get(ENDPOINTS.STOCK_MOVEMENTS.STATS);
    },

    /**
     * Rechercher les mouvements
     * @param {string} query - Terme de recherche
     * @returns {Promise<Array>} Résultats de recherche
     */
    async searchMovements(query) {
        if (!query || query.trim() === '') {
            return [];
        }
        return await apiClient.get(`${ENDPOINTS.STOCK_MOVEMENTS.LIST}?search=${encodeURIComponent(query)}`);
    },
};
