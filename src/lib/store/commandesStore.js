import { create } from 'zustand';
import { commandesService } from '../services/commandes.service';
import { MESSAGES } from '../utils/constants';

// --- UTILITAIRE DE NORMALISATION ---
// Cette fonction transforme les données sales de l'API en données propres pour le Front
const normalizeCommande = (cmd) => ({
    id: cmd.id,
    numero: cmd.numero || `CMD-2026-${String(cmd.id).padStart(3, '0')}`,
    statut: cmd.statut || 'En production',
    // Unification des dates
    dateCommande: cmd.date_commande || cmd.dateCommande,
    dateLivraison: cmd.date_livraison || cmd.dateLivraison,
    // Unification des montants
    montantTTC: Number(cmd.montant_ttc || cmd.montantTTC || 0),
    montantHT: Number(cmd.montant_ht || cmd.montantHT || 0),
    // Unification du client
    client: cmd.client ? {
        nom: cmd.client.nom || cmd.clientNom,
        telephone: cmd.client.telephone || cmd.clientTel,
        adresse: cmd.client.adresse || cmd.clientAdresse
    } : { nom: 'Client inconnu', telephone: '' },
    // Unification des articles
    articles: Array.isArray(cmd.articles) ? cmd.articles.map(a => ({
        produit: a.produit || a.nom,
        quantite: a.quantite,
        prix: a.prix_unitaire || a.prix
    })) : []
});

export const useCommandesStore = create((set, get) => ({
    commandes: [],
    currentCommande: null,
    loading: false,
    error: null,
    pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
    filters: { search: '', statut: '', client_id: '', sortBy: 'date_commande', sortDir: 'desc' },
    stats: null,

    /**
     * Action unique pour charger les commandes (centralisée)
     */
    fetchCommandes: async (page = 1, extraParams = {}) => {
        set({ loading: true, error: null });
        try {
            const { filters, pagination } = get();
            const params = {
                page,
                per_page: pagination.per_page,
                search: filters.search,
                statut: filters.statut,
                ...extraParams // Permet d'écraser les filtres temporairement
            };

            // Nettoyer les paramètres vides
            Object.keys(params).forEach(
                (key) => params[key] === '' && delete params[key]
            );

            const response = await commandesService.getCommandes(params);
            
            // On normalise chaque commande reçue
            const rawData = response.data || response;
            const normalizedData = Array.isArray(rawData) 
                ? rawData.map(normalizeCommande) 
                : [];

            set({
                commandes: normalizedData,
                pagination: response.meta || {
                    total: normalizedData.length,
                    per_page: pagination.per_page,
                    current_page: page,
                    last_page: 1,
                },
                loading: false,
            });
        } catch (error) {
            set({ error: error.message || MESSAGES.ERROR.SERVER, loading: false });
        }
    },

    /**
     * Mise à jour du statut avec mise à jour optimiste
     */
    updateCommandeStatus: async (id, status) => {
        // 1. Mise à jour immédiate dans l'UI (Optimiste)
        const previousCommandes = get().commandes;
        set((state) => ({
            commandes: state.commandes.map(c => c.id === id ? { ...c, statut: status } : c)
        }));

        try {
            await commandesService.updateCommandeStatus(id, status);
            // 2. On rafraîchit les stats en arrière-plan
            get().fetchStats();
        } catch (error) {
            // 3. Rollback en cas d'erreur
            set({ commandes: previousCommandes, error: "Échec de la mise à jour" });
        }
    },

    /**
     * Recherche avec mise à jour des filtres
     */
    searchCommandes: async (query) => {
        set((state) => ({ filters: { ...state.filters, search: query } }));
        // On appelle fetchCommandes qui va utiliser le nouveau filtre search
        get().fetchCommandes(1);
    },

    /**
     * Filtrage par statut
     */
    filterByStatut: async (statut) => {
        const s = statut === 'all' ? '' : statut;
        set((state) => ({ filters: { ...state.filters, statut: s } }));
        get().fetchCommandes(1);
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

    // ... (Garder fetchStats, deleteCommande etc. mais ajouter normalizeCommande si besoin)
    
    clearError: () => set({ error: null }),
    
    reset: () => set({
        commandes: [],
        currentCommande: null,
        loading: false,
        error: null,
        filters: { search: '', statut: '', client_id: '', sortBy: 'date_commande', sortDir: 'desc' }
    })
}));