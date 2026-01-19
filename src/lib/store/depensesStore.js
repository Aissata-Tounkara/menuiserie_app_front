/**
 * Store Zustand pour la gestion des dépenses
 * Gère l'état global de la liste des dépenses et statistiques
 */

import { create } from 'zustand';
import { depensesService } from '../services/depenses.service';
import { MESSAGES } from '../utils/constants';

export const useDepensesStore = create((set, get) => ({
    // ============ État ============
    depenses: [],
    currentDepense: null,
    depensesLoading: false,
    depensesError: null,
    depensesPagination: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    },
    depensesFilters: {
        search: '',
        categorie: '',
        statut: '',
        sortBy: 'date',
        sortDir: 'desc',
    },
    depensesStats: null,

    // ============ ACTIONS ============

    /**
     * Récupérer la liste des dépenses
     */
    fetchDépenses: async (page = 1) => {
        set({ depensesLoading: true, depensesError: null });
        try {
            const { depensesFilters } = get();
            const params = {};

            // Ajouter uniquement les paramètres qui ont une valeur réelle
            if (depensesFilters.search && depensesFilters.search.trim()) {
                params.search = depensesFilters.search;
            }
            if (depensesFilters.categorie && depensesFilters.categorie !== '') {
                params.categorie = depensesFilters.categorie;
            }
            if (depensesFilters.statut && depensesFilters.statut !== '') {
                params.statut = depensesFilters.statut;
            }

            const response = await depensesService.getDépenses(params);
            
            set({
                depenses: response.data || response,
                depensesPagination: response.meta || {
                    total: (response.data || response).length,
                    per_page: 10,
                    current_page: 1,
                    last_page: 1,
                },
                depensesLoading: false,
            });
        } catch (error) {
            set({
                depensesError: error.message || MESSAGES.ERROR.SERVER,
                depensesLoading: false,
            });
        }
    },

    /**
     * Récupérer une dépense spécifique
     */
    fetchDépenseById: async (id) => {
        set({ depensesLoading: true, depensesError: null });
        try {
            const depense = await depensesService.getDépense(id);
            set({ currentDepense: depense, depensesLoading: false });
            return depense;
        } catch (error) {
            set({
                depensesError: error.message || MESSAGES.ERROR.SERVER,
                depensesLoading: false,
            });
            throw error;
        }
    },

    /**
     * Créer une nouvelle dépense
     */
    createDépense: async (data) => {
        set({ depensesLoading: true, depensesError: null });
        try {
            const newDepense = await depensesService.createDépense(data);
            
            set((state) => ({
                depenses: [newDepense, ...state.depenses],
                depensesLoading: false,
            }));

            return newDepense;
        } catch (error) {
            set({
                depensesError: error.message || MESSAGES.ERROR.SERVER,
                depensesLoading: false,
            });
            throw error;
        }
    },

    /**
     * Mettre à jour une dépense
     */
    updateDépense: async (id, data) => {
        set({ depensesLoading: true, depensesError: null });
        try {
            const updatedDepense = await depensesService.updateDépense(id, data);
            
            set((state) => ({
                depenses: state.depenses.map((depense) =>
                    depense.id === id ? updatedDepense : depense
                ),
                currentDepense:
                    state.currentDepense?.id === id ? updatedDepense : state.currentDepense,
                depensesLoading: false,
            }));

            return updatedDepense;
        } catch (error) {
            set({
                depensesError: error.message || MESSAGES.ERROR.SERVER,
                depensesLoading: false,
            });
            throw error;
        }
    },

    /**
     * Supprimer une dépense
     */
    deleteDépense: async (id) => {
        set({ depensesLoading: true, depensesError: null });
        try {
            await depensesService.deleteDépense(id);
            
            set((state) => ({
                depenses: state.depenses.filter((depense) => depense.id !== id),
                currentDepense: state.currentDepense?.id === id ? null : state.currentDepense,
                depensesLoading: false,
            }));
        } catch (error) {
            set({
                depensesError: error.message || MESSAGES.ERROR.SERVER,
                depensesLoading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les statistiques des dépenses
     */
    fetchDépensesStats: async () => {
        set({ depensesLoading: true, depensesError: null });
        try {
            const stats = await depensesService.getDépensesStats();
            set({ depensesStats: stats, depensesLoading: false });
            return stats;
        } catch (error) {
            set({
                depensesError: error.message || MESSAGES.ERROR.SERVER,
                depensesLoading: false,
            });
        }
    },

    /**
     * Rechercher les dépenses
     */
    searchDépenses: async (query) => {
        if (!query || query.trim() === '') {
            set((state) => ({
                depensesFilters: { ...state.depensesFilters, search: '' },
            }));
            get().fetchDépenses(1);
            return;
        }

        set({ depensesLoading: true, depensesError: null });
        try {
            const results = await depensesService.searchDépenses(query);
            set((state) => ({
                depenses: results.data || results,
                depensesFilters: { ...state.depensesFilters, search: query },
                depensesLoading: false,
            }));
        } catch (error) {
            set({
                depensesError: error.message || MESSAGES.ERROR.SERVER,
                depensesLoading: false,
            });
        }
    },

    /**
     * Filtrer par catégorie
     */
    filterByCategorie: async (categorie) => {
        set({ depensesLoading: true, depensesError: null });
        try {
            const results = await depensesService.filterDépensesByCategorie(categorie);
            set((state) => ({
                depenses: results.data || results,
                depensesFilters: { ...state.depensesFilters, categorie },
                depensesLoading: false,
            }));
        } catch (error) {
            set({
                depensesError: error.message || MESSAGES.ERROR.SERVER,
                depensesLoading: false,
            });
        }
    },

    /**
     * Filtrer par période
     */
    filterByPeriod: async (dateDebut, dateFin) => {
        set({ depensesLoading: true, depensesError: null });
        try {
            const results = await depensesService.filterDépensesByPeriod(dateDebut, dateFin);
            set({
                depenses: results.data || results,
                depensesLoading: false,
            });
        } catch (error) {
            set({
                depensesError: error.message || MESSAGES.ERROR.SERVER,
                depensesLoading: false,
            });
        }
    },

    /**
     * Filtrer par statut
     */
    filterByStatut: async (statut) => {
        set({ depensesLoading: true, depensesError: null });
        try {
            const results = await depensesService.getDépensesByStatut(statut);
            set((state) => ({
                depenses: results.data || results,
                depensesFilters: { ...state.depensesFilters, statut },
                depensesLoading: false,
            }));
        } catch (error) {
            set({
                depensesError: error.message || MESSAGES.ERROR.SERVER,
                depensesLoading: false,
            });
        }
    },

    // ============ UTILITAIRES ============

    /**
     * Mettre à jour les filtres
     */
    setDepensesFilters: (newFilters) => {
        set((state) => ({
            depensesFilters: { ...state.depensesFilters, ...newFilters },
        }));
        get().fetchDépenses(1);
    },

    /**
     * Changer de page
     */
    setDepensesPage: (page) => {
        get().fetchDépenses(page);
    },

    /**
     * Réinitialiser le store
     */
    reset: () => {
        set({
            depenses: [],
            currentDepense: null,
            depensesLoading: false,
            depensesError: null,
            depensesPagination: {
                total: 0,
                per_page: 10,
                current_page: 1,
                last_page: 1,
            },
            depensesFilters: {
                search: '',
                categorie: '',
                statut: '',
                sortBy: 'date',
                sortDir: 'desc',
            },
            depensesStats: null,
        });
    },

    /**
     * Réinitialiser les erreurs
     */
    clearErrors: () => {
        set({
            depensesError: null,
        });
    },
}));
