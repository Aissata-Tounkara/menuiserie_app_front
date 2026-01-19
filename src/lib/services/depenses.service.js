/**
 * Service pour la gestion des dépenses
 * Centralise toutes les requêtes liées aux dépenses
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const depensesService = {
    /**
     * Récupérer la liste des dépenses
     * @param {Object} options - Paramètres de pagination/filtrage
     * @returns {Promise<Object>} Liste des dépenses
     */
    async getDépenses(options = {}) {
        const queryParams = new URLSearchParams(options).toString();
        const endpoint = queryParams ? `${ENDPOINTS.EXPENSES.LIST}?${queryParams}` : ENDPOINTS.EXPENSES.LIST;
        return await apiClient.get(endpoint);
    },

    /**
     * Récupérer une dépense spécifique
     * @param {number} id - ID de la dépense
     * @returns {Promise<Object>} Détails de la dépense
     */
    async getDépense(id) {
        if (!id) throw new Error('L\'ID de la dépense est requis');
        return await apiClient.get(ENDPOINTS.EXPENSES.DETAIL(id));
    },

    /**
     * Créer une nouvelle dépense
     * @param {Object} data - Données de la dépense
     * @returns {Promise<Object>} Dépense créée
     */
    async createDépense(data) {
        if (!data.description || !data.montant) {
            throw new Error('La description et le montant sont requis');
        }
        const response = await apiClient.post(ENDPOINTS.EXPENSES.CREATE, data);
        return response;
    },

    /**
     * Mettre à jour une dépense
     * @param {number} id - ID de la dépense
     * @param {Object} data - Données à mettre à jour
     * @returns {Promise<Object>} Dépense mise à jour
     */
    async updateDépense(id, data) {
        if (!id) throw new Error('L\'ID de la dépense est requis');
        return await apiClient.put(ENDPOINTS.EXPENSES.UPDATE(id), data);
    },

    /**
     * Supprimer une dépense
     * @param {number} id - ID de la dépense
     * @returns {Promise<Object>} Résultat de la suppression
     */
    async deleteDépense(id) {
        if (!id) throw new Error('L\'ID de la dépense est requis');
        return await apiClient.delete(ENDPOINTS.EXPENSES.DELETE(id));
    },

    /**
     * Récupérer les statistiques des dépenses
     * @returns {Promise<Object>} Statistiques
     */
    async getDépensesStats() {
        return await apiClient.get(ENDPOINTS.EXPENSES.STATS);
    },

    /**
     * Rechercher les dépenses
     * @param {string} query - Terme de recherche
     * @returns {Promise<Object>} Résultats de recherche
     */
    async searchDépenses(query) {
        if (!query || query.trim() === '') {
            throw new Error('La requête de recherche est vide');
        }
        return await apiClient.get(`${ENDPOINTS.EXPENSES.LIST}?search=${encodeURIComponent(query)}`);
    },

    /**
     * Filtrer les dépenses par catégorie
     * @param {string} categorie - Catégorie à filtrer
     * @returns {Promise<Object>} Dépenses filtrées
     */
    async filterDépensesByCategorie(categorie) {
        if (!categorie) throw new Error('La catégorie est requise');
        return await apiClient.get(`${ENDPOINTS.EXPENSES.LIST}?categorie=${encodeURIComponent(categorie)}`);
    },

    /**
     * Filtrer les dépenses par période
     * @param {string} dateDebut - Date de début (YYYY-MM-DD)
     * @param {string} dateFin - Date de fin (YYYY-MM-DD)
     * @returns {Promise<Object>} Dépenses filtrées
     */
    async filterDépensesByPeriod(dateDebut, dateFin) {
        if (!dateDebut || !dateFin) throw new Error('Les dates de début et fin sont requises');
        return await apiClient.get(
            `${ENDPOINTS.EXPENSES.LIST}?date_debut=${dateDebut}&date_fin=${dateFin}`
        );
    },

    /**
     * Récupérer les dépenses par statut
     * @param {string} statut - Statut (ex: "payée", "en attente")
     * @returns {Promise<Object>} Dépenses filtrées
     */
    async getDépensesByStatut(statut) {
        if (!statut) throw new Error('Le statut est requis');
        return await apiClient.get(`${ENDPOINTS.EXPENSES.LIST}?statut=${encodeURIComponent(statut)}`);
    },
};
