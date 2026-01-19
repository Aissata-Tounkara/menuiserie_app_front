/**
 * Store Zustand pour le dashboard
 * Gère l'état global des statistiques et données du dashboard
 */

import { create } from 'zustand';
import { dashboardService } from '../services/dashboard.service';
import { MESSAGES } from '../utils/constants';

export const useDashboardStore = create((set, get) => ({
    // ============ État ============
    dashboardStats: null,
    chartData: null,
    dashboardLoading: false,
    dashboardError: null,
    selectedPeriod: 'month',
    
    revenueData: null,
    expensesData: null,
    stockData: null,
    ordersData: null,

    // ============ ACTIONS ============

    /**
     * Récupérer les statistiques du dashboard
     */
    fetchDashboardStats: async () => {
        set({ dashboardLoading: true, dashboardError: null });
        try {
            const stats = await dashboardService.getStats();
            set({ dashboardStats: stats, dashboardLoading: false });
            return stats;
        } catch (error) {
            set({
                dashboardError: error.message || MESSAGES.ERROR.SERVER,
                dashboardLoading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les données pour les graphiques
     */
    fetchChartData: async (options = {}) => {
        set({ dashboardLoading: true, dashboardError: null });
        try {
            const data = await dashboardService.getChartData(options);
            set({ chartData: data, dashboardLoading: false });
            return data;
        } catch (error) {
            set({
                dashboardError: error.message || MESSAGES.ERROR.SERVER,
                dashboardLoading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les statistiques par période
     */
    fetchStatsByPeriod: async (period = 'month') => {
        set({ 
            dashboardLoading: true, 
            dashboardError: null,
            selectedPeriod: period 
        });
        try {
            const stats = await dashboardService.getStatsByPeriod(period);
            set({ dashboardStats: stats, dashboardLoading: false });
            return stats;
        } catch (error) {
            set({
                dashboardError: error.message || MESSAGES.ERROR.SERVER,
                dashboardLoading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les données de revenus
     */
    fetchRevenueData: async () => {
        set({ dashboardLoading: true, dashboardError: null });
        try {
            const data = await dashboardService.getRevenueData();
            set({ revenueData: data, dashboardLoading: false });
            return data;
        } catch (error) {
            set({
                dashboardError: error.message || MESSAGES.ERROR.SERVER,
                dashboardLoading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les données de dépenses
     */
    fetchExpensesData: async () => {
        set({ dashboardLoading: true, dashboardError: null });
        try {
            const data = await dashboardService.getExpensesData();
            set({ expensesData: data, dashboardLoading: false });
            return data;
        } catch (error) {
            set({
                dashboardError: error.message || MESSAGES.ERROR.SERVER,
                dashboardLoading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les données de stocks
     */
    fetchStockData: async () => {
        set({ dashboardLoading: true, dashboardError: null });
        try {
            const data = await dashboardService.getStockData();
            set({ stockData: data, dashboardLoading: false });
            return data;
        } catch (error) {
            set({
                dashboardError: error.message || MESSAGES.ERROR.SERVER,
                dashboardLoading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les données de commandes
     */
    fetchOrdersData: async () => {
        set({ dashboardLoading: true, dashboardError: null });
        try {
            const data = await dashboardService.getOrdersData();
            set({ ordersData: data, dashboardLoading: false });
            return data;
        } catch (error) {
            set({
                dashboardError: error.message || MESSAGES.ERROR.SERVER,
                dashboardLoading: false,
            });
            throw error;
        }
    },

    /**
     * Charger tous les data du dashboard en parallèle
     */
    fetchAllDashboardData: async () => {
        set({ dashboardLoading: true, dashboardError: null });
        try {
            const [stats, chartData, revenueData, expensesData, stockData, ordersData] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getChartData(),
                dashboardService.getRevenueData(),
                dashboardService.getExpensesData(),
                dashboardService.getStockData(),
                dashboardService.getOrdersData(),
            ]);

            set({
                dashboardStats: stats,
                chartData: chartData,
                revenueData: revenueData,
                expensesData: expensesData,
                stockData: stockData,
                ordersData: ordersData,
                dashboardLoading: false,
            });

            return {
                stats,
                chartData,
                revenueData,
                expensesData,
                stockData,
                ordersData,
            };
        } catch (error) {
            set({
                dashboardError: error.message || MESSAGES.ERROR.SERVER,
                dashboardLoading: false,
            });
            throw error;
        }
    },

    /**
     * Changer la période sélectionnée
     */
    setPeriod: (period) => {
        set({ selectedPeriod: period });
    },

    /**
     * Réinitialiser le store
     */
    reset: () => {
        set({
            dashboardStats: null,
            chartData: null,
            dashboardLoading: false,
            dashboardError: null,
            selectedPeriod: 'month',
            revenueData: null,
            expensesData: null,
            stockData: null,
            ordersData: null,
        });
    },

    /**
     * Réinitialiser les erreurs
     */
    clearErrors: () => {
        set({
            dashboardError: null,
        });
    },

    /**
     * Rafraîchir tous les data du dashboard
     */
    refresh: async () => {
        const { fetchAllDashboardData } = get();
        return await fetchAllDashboardData();
    },
}));
