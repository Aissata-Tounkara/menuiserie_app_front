/**
 * Store Zustand pour l'authentification
 * Source de vérité pour l'état utilisateur
 */

import { create } from 'zustand';
import { authService } from '@/lib/services/auth.service';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    // Initialiser l'état depuis localStorage (au démarrage)
    initialize: () => {
        const isAuth = authService.isAuthenticated();
        const user = authService.getUser();
        set({ user, isAuthenticated: isAuth, loading: false });
    },

    // Action de connexion (centralisée dans le store)
    login: async (credentials) => {
        const response = await authService.login(credentials);
        set({ user: response.user, isAuthenticated: true, loading: false });
        return response;
    },

    // Action de déconnexion
    logout: async () => {
        await authService.logout();
        set({ user: null, isAuthenticated: false });
    },

    // Forcer la mise à jour de l'utilisateur (ex: après édition de profil)
    setUser: (user) => set({ user }),
}));