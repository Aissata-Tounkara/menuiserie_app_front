/**
 * Service d'authentification
 * Centralise toutes les requêtes auth
 */

import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { STORAGE_KEYS } from '@/lib/utils/constants';

export const authService = {
    /**
     * Connexion
     */
    async login(credentials) {
        // On envoie tout (même si "remember" est présent, on l'ignore)
        const { remember, ...loginData } = credentials;

        const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, loginData);

        if (!response?.token || !response?.user) {
            throw new Error('Réponse invalide du serveur');
        }

        // Stocker token et utilisateur (toujours dans localStorage → session persistante)
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

        return response;
    },

    /**
     * Déconnexion
     */
    async logout() {
        try {
            await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.warn('Erreur lors de la déconnexion API:', error.message);
        } finally {
            // Nettoyer toute la session
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
    },

    /**
     * Récupérer l'utilisateur connecté
     */
    async me() {
        return await apiClient.get(ENDPOINTS.AUTH.ME);
    },

    /**
     * Vérifier si l'utilisateur est connecté
     */
    isAuthenticated() {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    /**
     * Récupérer l'utilisateur depuis localStorage
     */
    getUser() {
        if (typeof window === 'undefined') return null;
        try {
            const user = localStorage.getItem(STORAGE_KEYS.USER);
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },

    /**
     * Nettoyer la session locale
     */
    clearSession() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    },
};