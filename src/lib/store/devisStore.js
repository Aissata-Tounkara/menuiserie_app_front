/**
 * Store Zustand pour la gestion des devis
 * Gère l'état global de la liste des devis, pagination, filtrage
 */

import { create } from 'zustand';
import { devisService } from '../services/devis.service';
import { MESSAGES } from '../utils/constants';

export const useDevisStore = create((set, get) => ({
    // ============ État ============
    devis: [],
    currentDevis: null,
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
        sortBy: 'date_devis',
        sortDir: 'desc',
    },
    stats: null,

    // ============ Actions ============

    /**
     * Récupérer la liste des devis
     */
    fetchDevis: async (page = 1) => {
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

            const response = await devisService.getDevis(params);
            
            set({
                devis: response.data || response,
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
     * Récupérer un devis spécifique
     */
    fetchDevis: async (id) => {
        set({ loading: true, error: null });
        try {
            const devis = await devisService.getDevis(id);
            set({ currentDevis: devis, loading: false });
            return devis;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Créer un nouveau devis
     */
    createDevis: async (data) => {
        set({ loading: true, error: null });
        try {
            const newDevis = await devisService.createDevis(data);
            
            // Ajouter à la liste
            set((state) => ({
                devis: [newDevis, ...state.devis],
                loading: false,
            }));

            return newDevis;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Mettre à jour un devis
     */
    updateDevis: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedDevis = await devisService.updateDevis(id, data);
            
            // Mettre à jour dans la liste
            set((state) => ({
                devis: state.devis.map((devis) =>
                    devis.id === id ? updatedDevis : devis
                ),
                currentDevis:
                    state.currentDevis?.id === id ? updatedDevis : state.currentDevis,
                loading: false,
            }));

            return updatedDevis;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Supprimer un devis
     */
    deleteDevis: async (id) => {
        set({ loading: true, error: null });
        try {
            await devisService.deleteDevis(id);
            
            // Supprimer de la liste
            set((state) => ({
                devis: state.devis.filter((devis) => devis.id !== id),
                currentDevis: state.currentDevis?.id === id ? null : state.currentDevis,
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
     * Valider un devis et créer une facture
     */
    validateAndInvoice: async (id, data = {}) => {
        set({ loading: true, error: null });
        try {
            const result = await devisService.validateAndInvoice(id, data);
            
            // Marquer le devis comme accepté dans la liste
            set((state) => ({
                devis: state.devis.map((devis) =>
                    devis.id === id ? { ...devis, statut: 'Accepté' } : devis
                ),
                currentDevis:
                    state.currentDevis?.id === id 
                        ? { ...state.currentDevis, statut: 'Accepté' } 
                        : state.currentDevis,
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
     * Rechercher les devis
     */
    searchDevis: async (query) => {
        if (!query || query.trim() === '') {
            set((state) => ({
                filters: { ...state.filters, search: '' },
            }));
            get().fetchDevis(1);
            return;
        }

        set({ loading: true, error: null });
        try {
            const results = await devisService.searchDevis(query);
            set((state) => ({
                devis: results.data || results,
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
     * Filtrer les devis par statut
     */
    filterByStatut: async (statut) => {
        set({ loading: true, error: null });
        try {
            const results = await devisService.getDevisByStatut(statut);
            set((state) => ({
                devis: results.data || results,
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
     * Obtenir les devis d'un client
     */
    getDevisByClient: async (clientId) => {
        set({ loading: true, error: null });
        try {
            const results = await devisService.getDevisByClient(clientId);
            set((state) => ({
                devis: results.data || results,
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
     * Exporter un devis en PDF
     */
    exportDevisPDF: async (id) => {
        set({ loading: true, error: null });
        try {
            const blob = await devisService.exportPDF(id);
            set({ loading: false });
            
            // Créer un lien de téléchargement
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `devis-${id}.pdf`;
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
        get().fetchDevis(1);
    },

    /**
     * Changer de page
     */
    setPage: (page) => {
        get().fetchDevis(page);
    },

    /**
     * Réinitialiser le store
     */
    reset: () => {
        set({
            devis: [],
            currentDevis: null,
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
                sortBy: 'date_devis',
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
