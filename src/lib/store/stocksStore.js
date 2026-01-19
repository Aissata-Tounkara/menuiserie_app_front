/**
 * Store Zustand pour la gestion des stocks (articles et mouvements)
 * Gère l'état global de la liste des articles, mouvements et statistiques
 */

import { create } from 'zustand';
import { stocksService } from '../services/stocks.service';
import { MESSAGES } from '../utils/constants';

export const useStocksStore = create((set, get) => ({
    // ============ État Articles ============
    articles: [],
    currentArticle: null,
    articlesLoading: false,
    articlesError: null,
    articlesPagination: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    },
    articlesFilters: {
        search: '',
        category: '',
        sortBy: 'nom',
        sortDir: 'asc',
    },
    articlesStats: null,
    stockAlerts: [],

    // ============ État Mouvements ============
    movements: [],
    currentMovement: null,
    movementsLoading: false,
    movementsError: null,
    movementsPagination: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    },
    movementsFilters: {
        search: '',
        type: '',
        article_id: '',
        sortBy: 'date_mouvement',
        sortDir: 'desc',
    },
    movementsStats: null,

    // ============ ACTIONS ARTICLES ============

    /**
     * Récupérer la liste des articles
     */
    fetchArticles: async (page = 1) => {
        set({ articlesLoading: true, articlesError: null });
        try {
            const { articlesFilters } = get();
            const params = {};

            // Ajouter uniquement les paramètres qui ont une valeur réelle
            if (articlesFilters.search && articlesFilters.search.trim()) {
                params.search = articlesFilters.search;
            }
            if (articlesFilters.category && articlesFilters.category !== '') {
                params.category = articlesFilters.category;
            }

            const response = await stocksService.getArticles(params);
            
            set({
                articles: response.data || response,
                articlesPagination: response.meta || {
                    total: (response.data || response).length,
                    per_page: 10,
                    current_page: 1,
                    last_page: 1,
                },
                articlesLoading: false,
            });
        } catch (error) {
            set({
                articlesError: error.message || MESSAGES.ERROR.SERVER,
                articlesLoading: false,
            });
        }
    },

    /**
     * Récupérer un article spécifique
     */
    fetchArticleById: async (id) => {
        set({ articlesLoading: true, articlesError: null });
        try {
            const article = await stocksService.getArticle(id);
            set({ currentArticle: article, articlesLoading: false });
            return article;
        } catch (error) {
            set({
                articlesError: error.message || MESSAGES.ERROR.SERVER,
                articlesLoading: false,
            });
            throw error;
        }
    },

    /**
     * Créer un nouvel article
     */
    createArticle: async (data) => {
        set({ articlesLoading: true, articlesError: null });
        try {
            const newArticle = await stocksService.createArticle(data);
            
            set((state) => ({
                articles: [newArticle, ...state.articles],
                articlesLoading: false,
            }));

            return newArticle;
        } catch (error) {
            set({
                articlesError: error.message || MESSAGES.ERROR.SERVER,
                articlesLoading: false,
            });
            throw error;
        }
    },

    /**
     * Mettre à jour un article
     */
    updateArticle: async (id, data) => {
        set({ articlesLoading: true, articlesError: null });
        try {
            const updatedArticle = await stocksService.updateArticle(id, data);
            
            set((state) => ({
                articles: state.articles.map((article) =>
                    article.id === id ? updatedArticle : article
                ),
                currentArticle:
                    state.currentArticle?.id === id ? updatedArticle : state.currentArticle,
                articlesLoading: false,
            }));

            return updatedArticle;
        } catch (error) {
            set({
                articlesError: error.message || MESSAGES.ERROR.SERVER,
                articlesLoading: false,
            });
            throw error;
        }
    },

    /**
     * Supprimer un article
     */
    deleteArticle: async (id) => {
        set({ articlesLoading: true, articlesError: null });
        try {
            await stocksService.deleteArticle(id);
            
            set((state) => ({
                articles: state.articles.filter((article) => article.id !== id),
                currentArticle: state.currentArticle?.id === id ? null : state.currentArticle,
                articlesLoading: false,
            }));
        } catch (error) {
            set({
                articlesError: error.message || MESSAGES.ERROR.SERVER,
                articlesLoading: false,
            });
            throw error;
        }
    },

    /**
     * Ajuster le stock d'un article
     */
    adjustStock: async (articleId, quantity, type = 'entree', notes = '') => {
        set({ articlesLoading: true, articlesError: null });
        try {
            const result = await stocksService.adjustStock(articleId, {
                quantite: quantity,
                type: type,
                notes: notes
            });
            
            // Mettre à jour l'article dans la liste
            set((state) => ({
                articles: state.articles.map((article) =>
                    article.id === articleId ? result : article
                ),
                currentArticle:
                    state.currentArticle?.id === articleId ? result : state.currentArticle,
                articlesLoading: false,
            }));

            return result;
        } catch (error) {
            set({
                articlesError: error.message || MESSAGES.ERROR.SERVER,
                articlesLoading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les alertes de stock
     */
    fetchStockAlerts: async () => {
        set({ articlesLoading: true, articlesError: null });
        try {
            const alerts = await stocksService.getStockAlerts();
            set({ stockAlerts: alerts.data || alerts, articlesLoading: false });
            return alerts;
        } catch (error) {
            set({
                articlesError: error.message || MESSAGES.ERROR.SERVER,
                articlesLoading: false,
            });
        }
    },

    /**
     * Récupérer les statistiques des articles
     */
    fetchArticlesStats: async () => {
        set({ articlesLoading: true, articlesError: null });
        try {
            const stats = await stocksService.getArticlesStats();
            set({ articlesStats: stats, articlesLoading: false });
            return stats;
        } catch (error) {
            set({
                articlesError: error.message || MESSAGES.ERROR.SERVER,
                articlesLoading: false,
            });
        }
    },

    /**
     * Rechercher les articles
     */
    searchArticles: async (query) => {
        if (!query || query.trim() === '') {
            set((state) => ({
                articlesFilters: { ...state.articlesFilters, search: '' },
            }));
            get().fetchArticles(1);
            return;
        }

        set({ articlesLoading: true, articlesError: null });
        try {
            const results = await stocksService.searchArticles(query);
            set((state) => ({
                articles: results.data || results,
                articlesFilters: { ...state.articlesFilters, search: query },
                articlesLoading: false,
            }));
        } catch (error) {
            set({
                articlesError: error.message || MESSAGES.ERROR.SERVER,
                articlesLoading: false,
            });
        }
    },

    // ============ ACTIONS MOUVEMENTS ============

    /**
     * Récupérer la liste des mouvements
     */
    /**
     * Récupérer la liste des mouvements
     */
    fetchMovements: async (page = 1) => {
        set({ movementsLoading: true, movementsError: null });
        try {
            const { movementsFilters } = get();
            const params = {};

            // Ajouter uniquement les paramètres qui ont une valeur réelle
            if (movementsFilters.search && movementsFilters.search.trim()) {
                params.search = movementsFilters.search;
            }
            if (movementsFilters.type && movementsFilters.type !== '') {
                params.type = movementsFilters.type;
            }
            if (movementsFilters.article_id && movementsFilters.article_id !== '') {
                params.article_id = movementsFilters.article_id;
            }

            const response = await stocksService.getMovements(params);
            
            set({
                movements: response.data || response,
                movementsPagination: response.meta || {
                    total: (response.data || response).length,
                    per_page: 10,
                    current_page: 1,
                    last_page: 1,
                },
                movementsLoading: false,
            });
        } catch (error) {
            set({
                movementsError: error.message || MESSAGES.ERROR.SERVER,
                movementsLoading: false,
            });
        }
    },

    /**
     * Récupérer un mouvement spécifique
     */
    fetchMovementById: async (id) => {
        set({ movementsLoading: true, movementsError: null });
        try {
            const movement = await stocksService.getMovement(id);
            set({ currentMovement: movement, movementsLoading: false });
            return movement;
        } catch (error) {
            set({
                movementsError: error.message || MESSAGES.ERROR.SERVER,
                movementsLoading: false,
            });
            throw error;
        }
    },

    /**
     * Créer un mouvement de stock
     */
    createMovement: async (data) => {
        set({ movementsLoading: true, movementsError: null });
        try {
            const newMovement = await stocksService.createMovement(data);
            
            set((state) => ({
                movements: [newMovement, ...state.movements],
                movementsLoading: false,
            }));

            return newMovement;
        } catch (error) {
            set({
                movementsError: error.message || MESSAGES.ERROR.SERVER,
                movementsLoading: false,
            });
            throw error;
        }
    },

    /**
     * Supprimer un mouvement
     */
    deleteMovement: async (id) => {
        set({ movementsLoading: true, movementsError: null });
        try {
            await stocksService.deleteMovement(id);
            
            set((state) => ({
                movements: state.movements.filter((movement) => movement.id !== id),
                currentMovement: state.currentMovement?.id === id ? null : state.currentMovement,
                movementsLoading: false,
            }));
        } catch (error) {
            set({
                movementsError: error.message || MESSAGES.ERROR.SERVER,
                movementsLoading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer l'historique des mouvements d'un article
     */
    fetchArticleMovementHistory: async (articleId) => {
        set({ movementsLoading: true, movementsError: null });
        try {
            const history = await stocksService.getMovementHistory(articleId);
            set({
                movements: history.data || history,
                movementsLoading: false,
            });
            return history;
        } catch (error) {
            set({
                movementsError: error.message || MESSAGES.ERROR.SERVER,
                movementsLoading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les statistiques des mouvements
     */
    fetchMovementsStats: async () => {
        set({ movementsLoading: true, movementsError: null });
        try {
            const stats = await stocksService.getMovementsStats();
            set({ movementsStats: stats, movementsLoading: false });
            return stats;
        } catch (error) {
            set({
                movementsError: error.message || MESSAGES.ERROR.SERVER,
                movementsLoading: false,
            });
        }
    },

    /**
     * Rechercher les mouvements
     */
    searchMovements: async (query) => {
        if (!query || query.trim() === '') {
            set((state) => ({
                movementsFilters: { ...state.movementsFilters, search: '' },
            }));
            get().fetchMovements(1);
            return;
        }

        set({ movementsLoading: true, movementsError: null });
        try {
            const results = await stocksService.searchMovements(query);
            set((state) => ({
                movements: results.data || results,
                movementsFilters: { ...state.movementsFilters, search: query },
                movementsLoading: false,
            }));
        } catch (error) {
            set({
                movementsError: error.message || MESSAGES.ERROR.SERVER,
                movementsLoading: false,
            });
        }
    },

    // ============ UTILITAIRES ============

    /**
     * Mettre à jour les filtres des articles
     */
    setArticlesFilters: (newFilters) => {
        set((state) => ({
            articlesFilters: { ...state.articlesFilters, ...newFilters },
        }));
        get().fetchArticles(1);
    },

    /**
     * Mettre à jour les filtres des mouvements
     */
    setMovementsFilters: (newFilters) => {
        set((state) => ({
            movementsFilters: { ...state.movementsFilters, ...newFilters },
        }));
        get().fetchMovements(1);
    },

    /**
     * Changer de page pour les articles
     */
    setArticlesPage: (page) => {
        get().fetchArticles(page);
    },

    /**
     * Changer de page pour les mouvements
     */
    setMovementsPage: (page) => {
        get().fetchMovements(page);
    },

    /**
     * Réinitialiser le store
     */
    reset: () => {
        set({
            articles: [],
            currentArticle: null,
            articlesLoading: false,
            articlesError: null,
            articlesPagination: {
                total: 0,
                per_page: 10,
                current_page: 1,
                last_page: 1,
            },
            articlesFilters: {
                search: '',
                category: '',
                sortBy: 'nom',
                sortDir: 'asc',
            },
            articlesStats: null,
            stockAlerts: [],
            movements: [],
            currentMovement: null,
            movementsLoading: false,
            movementsError: null,
            movementsPagination: {
                total: 0,
                per_page: 10,
                current_page: 1,
                last_page: 1,
            },
            movementsFilters: {
                search: '',
                type: '',
                article_id: '',
                sortBy: 'date_mouvement',
                sortDir: 'desc',
            },
            movementsStats: null,
        });
    },

    /**
     * Réinitialiser les erreurs
     */
    clearErrors: () => {
        set({
            articlesError: null,
            movementsError: null,
        });
    },
}));
