/**
 * Constantes globales de l'application
 * Centralisées pour éviter la duplication
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL 
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL

// Clés de stockage
export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'auth_user',
};

// Routes
export const ROUTES = {
    // Auth
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',

    // Dashboard
    DASHBOARD: '/dashboard',

    // Gestion
    CLIENTS: '/gestion-clients',
    COMMANDES: '/gestion-commandes',
    STOCK: '/gestion-de-stock',
    FACTURES: '/gestion-de-facture',
    DEPENSES: '/gestion-depenses',
};

// Messages
export const MESSAGES = {
    SUCCESS: {
        LOGIN: 'Connexion réussie !',
        LOGOUT: 'Déconnexion réussie',
        SAVE: 'Enregistré avec succès',
        DELETE: 'Supprimé avec succès',
        UPDATE: 'Mis à jour avec succès',
    },
    ERROR: {
        LOGIN: 'Email ou mot de passe incorrect',
        NETWORK: 'Erreur de connexion au serveur',
        UNAUTHORIZED: 'Vous devez être connecté',
        FORBIDDEN: 'Accès non autorisé',
        SERVER: 'Erreur serveur, veuillez réessayer',
        VALIDATION: 'Veuillez vérifier les champs du formulaire',
    },
};