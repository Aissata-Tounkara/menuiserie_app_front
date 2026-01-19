/**
 * Store Zustand pour la gestion des factures
 * Gère l'état global de la liste des factures, pagination, filtrage
 */

import { create } from 'zustand';
import { facturesService } from '../services/factures.Service';
import { MESSAGES } from '../utils/constants';

export const useFacturesStore = create((set, get) => ({
    // ============ État ============
    factures: [],
    currentFacture: null,
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
        sortBy: 'date_facture',
        sortDir: 'desc',
    },
    stats: null,

    // ============ Actions ============

    /**
     * Récupérer la liste des factures
     */
    fetchFactures: async (page = 1) => {
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

            const response = await facturesService.getFactures(params);
            
            set({
                factures: response.data || response,
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
     * Récupérer une facture spécifique par ID
     */
    fetchFactureById: async (id) => {
        set({ loading: true, error: null });
        try {
            const facture = await facturesService.getFacture(id);
            set({ currentFacture: facture, loading: false });
            return facture;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Créer une nouvelle facture
     */
    createFacture: async (data) => {
        set({ loading: true, error: null });
        try {
            const newFacture = await facturesService.createFacture(data);
            
            // Ajouter à la liste
            set((state) => ({
                factures: [newFacture, ...state.factures],
                loading: false,
            }));

            return newFacture;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Mettre à jour une facture
     */
    updateFacture: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedFacture = await facturesService.updateFacture(id, data);
            
            // Mettre à jour dans la liste
            set((state) => ({
                factures: state.factures.map((facture) =>
                    facture.id === id ? updatedFacture : facture
                ),
                currentFacture:
                    state.currentFacture?.id === id ? updatedFacture : state.currentFacture,
                loading: false,
            }));

            return updatedFacture;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Supprimer une facture
     */
    deleteFacture: async (id) => {
        set({ loading: true, error: null });
        try {
            await facturesService.deleteFacture(id);
            
            // Supprimer de la liste
            set((state) => ({
                factures: state.factures.filter((facture) => facture.id !== id),
                currentFacture: state.currentFacture?.id === id ? null : state.currentFacture,
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
     * Marquer une facture comme payée
     */
    markAsPaid: async (id, data = {}) => {
        set({ loading: true, error: null });
        try {
            const result = await facturesService.markAsPaid(id, data);
            
            // Marquer la facture comme payée dans la liste
            set((state) => ({
                factures: state.factures.map((facture) =>
                    facture.id === id ? { ...facture, statut: 'Payée' } : facture
                ),
                currentFacture:
                    state.currentFacture?.id === id 
                        ? { ...state.currentFacture, statut: 'Payée' } 
                        : state.currentFacture,
                loading: false,
            }));

            return result;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Rechercher les factures
     */
    searchFactures: async (query) => {
        if (!query || query.trim() === '') {
            set((state) => ({
                filters: { ...state.filters, search: '' },
            }));
            get().fetchFactures(1);
            return;
        }

        set({ loading: true, error: null });
        try {
            const results = await facturesService.searchFactures(query);
            set((state) => ({
                factures: results.data || results,
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
     * Filtrer les factures par statut
     */
    filterByStatut: async (statut) => {
        set({ loading: true, error: null });
        try {
            const results = await facturesService.getFacturesByStatut(statut);
            set((state) => ({
                factures: results.data || results,
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
     * Obtenir les factures d'un client
     */
    getFacturesByClient: async (clientId) => {
        set({ loading: true, error: null });
        try {
            const results = await facturesService.getFacturesByClient(clientId);
            set((state) => ({
                factures: results.data || results,
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
     * Récupérer les statistiques des factures
     */
    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const stats = await facturesService.getFacturesStats();
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
     * Exporter une facture en PDF
     */
    exportFacturePDF: async (id) => {
        set({ loading: true, error: null });
        try {
            const blob = await facturesService.exportPDF(id);
            set({ loading: false });
            
            // Créer un lien de téléchargement
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `facture-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            return blob;
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
        get().fetchFactures(1);
    },

    /**
     * Changer de page
     */
    setPage: (page) => {
        get().fetchFactures(page);
    },

    /**
     * Réinitialiser le store
     */
    reset: () => {
        set({
            factures: [],
            currentFacture: null,
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
                sortBy: 'date_facture',
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
