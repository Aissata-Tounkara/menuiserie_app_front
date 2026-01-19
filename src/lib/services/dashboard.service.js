/**
 * Service pour le dashboard
 * Centralise toutes les requêtes liées aux statistiques et données du dashboard
 */

import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const dashboardService = {
    /**
     * Récupérer les statistiques du dashboard
     * @returns {Promise<Object>} Statistiques globales
     */
    async getStats() {
        return await apiClient.get(ENDPOINTS.DASHBOARD.STATS);
    },

    /**
     * Récupérer les données pour les graphiques
     * @param {Object} options - Paramètres (période, type, etc.)
     * @returns {Promise<Object>} Données pour les graphiques
     */
    async getChartData(options = {}) {
        const queryParams = new URLSearchParams(options).toString();
        const endpoint = queryParams 
            ? `${ENDPOINTS.DASHBOARD.CHART_DATA}?${queryParams}` 
            : ENDPOINTS.DASHBOARD.CHART_DATA;
        return await apiClient.get(endpoint);
    },

    /**
     * Récupérer les statistiques par période
     * @param {string} period - Période (jour, semaine, mois, année)
     * @returns {Promise<Object>} Statistiques de la période
     */
    async getStatsByPeriod(period = 'month') {
        return await apiClient.get(`${ENDPOINTS.DASHBOARD.STATS}?period=${period}`);
    },

    /**
     * Récupérer les données de revenus
     * @returns {Promise<Object>} Données de revenus
     */
    async getRevenueData() {
        return await apiClient.get(`${ENDPOINTS.DASHBOARD.CHART_DATA}?type=revenue`);
    },

    /**
     * Récupérer les données de dépenses
     * @returns {Promise<Object>} Données de dépenses
     */
    async getExpensesData() {
        return await apiClient.get(`${ENDPOINTS.DASHBOARD.CHART_DATA}?type=expenses`);
    },

    /**
     * Récupérer les données de stocks
     * @returns {Promise<Object>} Données de stocks
     */
    async getStockData() {
        return await apiClient.get(`${ENDPOINTS.DASHBOARD.CHART_DATA}?type=stock`);
    },

    /**
     * Récupérer les données de commandes
     * @returns {Promise<Object>} Données de commandes
     */
    async getOrdersData() {
        return await apiClient.get(`${ENDPOINTS.DASHBOARD.CHART_DATA}?type=orders`);
    },
};
