/**
 * Store Zustand pour la gestion des commandes
 * Gère l'état global de la liste des commandes, pagination, filtrage
 */

import { create } from 'zustand';
import { commandesService } from '../services/commandes.service';
import { MESSAGES } from '../utils/constants';

export const useCommandesStore = create((set, get) => ({
    // ============ État ============
    commandes: [],
    currentCommande: null,
    loading: false,
    error: null,
    pagination: {
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    },
    filters: {
        search: '',
        statut: '',
        client_id: '',
        sortBy: 'date_commande',
        sortDir: 'desc',
    },
    stats: null,

    // ============ Actions ============

    /**
     * Récupérer la liste des commandes
     */
    fetchCommandes: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            const { filters, pagination } = get();
            const params = {
                page,
                per_page: pagination.per_page,
                search: filters.search,
                statut: filters.statut,
                client_id: filters.client_id,
                sort_by: filters.sortBy,
                sort_dir: filters.sortDir,
            };

            // Nettoyer les paramètres vides
            Object.keys(params).forEach(
                (key) => params[key] === '' && delete params[key]
            );

            const response = await commandesService.getCommandes(params);
            
            set({
                commandes: response.data || response,
                pagination: response.meta || {
                    total: response.length,
                    per_page: pagination.per_page,
                    current_page: page,
                    last_page: 1,
                },
                loading: false,
            });
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
        }
    },

    /**
     * Récupérer une commande spécifique
     */
    fetchCommande: async (id) => {
        set({ loading: true, error: null });
        try {
            const commande = await commandesService.getCommande(id);
            set({ currentCommande: commande, loading: false });
            return commande;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Créer une nouvelle commande
     */
    createCommande: async (data) => {
        set({ loading: true, error: null });
        try {
            const newCommande = await commandesService.createCommande(data);
            
            // Ajouter à la liste
            set((state) => ({
                commandes: [newCommande, ...state.commandes],
                loading: false,
            }));

            return newCommande;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Mettre à jour une commande
     */
    updateCommande: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedCommande = await commandesService.updateCommande(id, data);
            
            // Mettre à jour dans la liste
            set((state) => ({
                commandes: state.commandes.map((commande) =>
                    commande.id === id ? updatedCommande : commande
                ),
                currentCommande:
                    state.currentCommande?.id === id ? updatedCommande : state.currentCommande,
                loading: false,
            }));

            return updatedCommande;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Supprimer une commande
     */
    deleteCommande: async (id) => {
        set({ loading: true, error: null });
        try {
            await commandesService.deleteCommande(id);
            
            // Supprimer de la liste
            set((state) => ({
                commandes: state.commandes.filter((commande) => commande.id !== id),
                currentCommande: state.currentCommande?.id === id ? null : state.currentCommande,
                loading: false,
            }));
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Mettre à jour le statut d'une commande
     */
    updateCommandeStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
            const updatedCommande = await commandesService.updateCommandeStatus(id, status);
            
            set((state) => ({
                commandes: state.commandes.map((commande) =>
                    commande.id === id ? { ...commande, statut: status } : commande
                ),
                currentCommande:
                    state.currentCommande?.id === id 
                        ? { ...state.currentCommande, statut: status } 
                        : state.currentCommande,
                loading: false,
            }));

            return updatedCommande;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les statistiques des commandes
     */
    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const stats = await commandesService.getCommandeStats();
            set({ stats, loading: false });
            return stats;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
        }
    },

    /**
     * Rechercher les commandes
     */
    searchCommandes: async (query) => {
        if (!query || query.trim() === '') {
            set((state) => ({
                filters: { ...state.filters, search: '' },
            }));
            get().fetchCommandes(1);
            return;
        }

        set({ loading: true, error: null });
        try {
            const results = await commandesService.searchCommandes(query);
            set((state) => ({
                commandes: results.data || results,
                filters: { ...state.filters, search: query },
                loading: false,
            }));
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
        }
    },

    /**
     * Filtrer les commandes par statut
     */
    filterByStatut: async (statut) => {
        set({ loading: true, error: null });
        try {
            const results = await commandesService.getCommandesByStatut(statut);
            set((state) => ({
                commandes: results.data || results,
                filters: { ...state.filters, statut },
                loading: false,
            }));
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
        }
    },

    /**
     * Obtenir les commandes d'un client
     */
    getCommandesByClient: async (clientId) => {
        set({ loading: true, error: null });
        try {
            const results = await commandesService.getCommandesByClient(clientId);
            set((state) => ({
                commandes: results.data || results,
                filters: { ...state.filters, client_id: clientId },
                loading: false,
            }));
            return results;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Mettre à jour les filtres et récupérer les données
     */
    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        }));
        // Réinitialiser à la page 1
        get().fetchCommandes(1);
    },

    /**
     * Changer de page
     */
    setPage: (page) => {
        get().fetchCommandes(page);
    },

    /**
     * Réinitialiser le store
     */
    reset: () => {
        set({
            commandes: [],
            currentCommande: null,
            loading: false,
            error: null,
            pagination: {
                total: 0,
                per_page: 10,
                current_page: 1,
                last_page: 1,
            },
            filters: {
                search: '',
                statut: '',
                client_id: '',
                sortBy: 'date_commande',
                sortDir: 'desc',
            },
            stats: null,
        });
    },

    /**
     * Réinitialiser les erreurs
     */
    clearError: () => set({ error: null }),
}));
