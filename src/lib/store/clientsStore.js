/**
 * Store Zustand pour la gestion des clients
 * Gère l'état global de la liste des clients, pagination, filtrage
 */

import { create } from 'zustand';
import { clientsService } from '../services/clients.service';
import { MESSAGES } from '../utils/constants';

export const useClientsStore = create((set, get) => ({
    // ============ État ============
    clients: [],
    currentClient: null,
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
        status: '',
        sortBy: 'nom',
        sortDir: 'asc',
    },
    stats: null,

    // ============ Actions ============

    /**
     * Récupérer la liste des clients
     */
    fetchClients: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            const { filters, pagination } = get();
            const params = {
                page,
                per_page: pagination.per_page,
                search: filters.search,
                status: filters.status,
                sort_by: filters.sortBy,
                sort_dir: filters.sortDir,
            };

            // Nettoyer les paramètres vides
            Object.keys(params).forEach(
                (key) => params[key] === '' && delete params[key]
            );

            const response = await clientsService.getClients(params);
            
            set({
                clients: response.data || response,
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
     * Récupérer un client spécifique
     */
    fetchClient: async (id) => {
        set({ loading: true, error: null });
        try {
            const client = await clientsService.getClient(id);
            set({ currentClient: client, loading: false });
            return client;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Créer un nouveau client
     */
    createClient: async (data) => {
        set({ loading: true, error: null });
        try {
            const newClient = await clientsService.createClient(data);
            
            await get().fetchClients(1); // Recharge la liste
            await get().fetchStats();    // ← Ajouté
            set({ loading: false });

            return newClient;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Mettre à jour un client
     */
    updateClient: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const updatedClient = await clientsService.updateClient(id, data);
            
            // Mettre à jour dans la liste
            await get().fetchClients(get().pagination.current_page); // Garde la page courante
            await get().fetchStats(); // ← Ajouté
            set({ loading: false });

            return updatedClient;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Supprimer un client
     */
    deleteClient: async (id) => {
        set({ loading: true, error: null });
        try {
            await clientsService.deleteClient(id);
            
                    // Recalcule la page après suppression (éviter page vide)
            const { pagination } = get();
            let page = pagination.current_page;
            if (pagination.current_page > 1 && get().clients.length === 1) {
            page = pagination.current_page - 1;
            }

            await get().fetchClients(page);
            await get().fetchStats(); // ← Ajouté
            set({ loading: false });
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Mettre à jour le statut d'un client
     */
    updateClientStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
            const updatedClient = await clientsService.updateClientStatus(id, status);
            
            set((state) => ({
                clients: state.clients.map((client) =>
                    client.id === id ? { ...client, statut: status } : client
                ),
                currentClient:
                    state.currentClient?.id === id 
                        ? { ...state.currentClient, statut: status } 
                        : state.currentClient,
                loading: false,
            }));

            return updatedClient;
        } catch (error) {
            set({
                error: error.message || MESSAGES.ERROR.SERVER,
                loading: false,
            });
            throw error;
        }
    },

    /**
     * Récupérer les statistiques des clients
     */
    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const stats = await clientsService.getClientStats();
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
     * Rechercher les clients
     */
    searchClients: async (query) => {
        if (!query || query.trim() === '') {
            set((state) => ({
                filters: { ...state.filters, search: '' },
            }));
            get().fetchClients(1);
            return;
        }

        set({ loading: true, error: null });
        try {
            const results = await clientsService.searchClients(query);
            set((state) => ({
                clients: results.data || results,
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
     * Mettre à jour les filtres et récupérer les données
     */
    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        }));
        // Réinitialiser à la page 1
        get().fetchClients(1);
    },

    /**
     * Changer de page
     */
    setPage: (page) => {
        get().fetchClients(page);
    },

    /**
     * Réinitialiser le store
     */
    reset: () => {
        set({
            clients: [],
            currentClient: null,
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
                status: '',
                sortBy: 'nom',
                sortDir: 'asc',
            },
            stats: null,
        });
    },

    /**
     * Réinitialiser les erreurs
     */
    clearError: () => set({ error: null }),
}));
