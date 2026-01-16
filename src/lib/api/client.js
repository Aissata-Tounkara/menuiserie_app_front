/**
 * Client API centralisé avec fetch
 * Gère :
 * - Requêtes JSON (GET, POST, PUT, DELETE)
 * - Uploads de fichiers (images, PDF, etc.)
 * - Téléchargements de fichiers binaires (PDF, images)
 */

import { API_URL, STORAGE_KEYS, MESSAGES } from '@/lib/utils/constants';

class ApiClient {
    constructor() {
        this.baseURL = API_URL;
    }

    /**
     * Récupérer le token depuis localStorage (client-side only)
     */
    getToken() {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    }

    /**
     * Headers par défaut pour requêtes JSON
     */
    getJsonHeaders(customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...customHeaders,
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    /**
     * Headers pour FormData (upload)
     * Ne PAS définir Content-Type (géré auto par le navigateur)
     */
    getFormHeaders(customHeaders = {}) {
        const headers = { ...customHeaders };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    /**
     * Gestion centralisée des réponses JSON/texte
     */
    async handleJsonResponse(response) {
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        let data;
        try {
            data = isJson ? await response.json() : await response.text();
        } catch {
            data = null;
        }

        if (!response.ok) {
            const error = {
                status: response.status,
                message: MESSAGES.ERROR.SERVER,
                errors: {},
            };

            if (isJson && data && typeof data === 'object') {
                error.message = data.message || error.message;
                error.errors = data.errors || {};
            }

            switch (response.status) {
                case 401:
                    error.message = MESSAGES.ERROR.UNAUTHORIZED;
                    error.code = 'UNAUTHORIZED';
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem(STORAGE_KEYS.TOKEN);
                        localStorage.removeItem(STORAGE_KEYS.USER);
                    }
                    break;
                case 403:
                    error.message = MESSAGES.ERROR.FORBIDDEN;
                    error.code = 'FORBIDDEN';
                    break;
                case 422:
                    error.message = MESSAGES.ERROR.VALIDATION;
                    error.code = 'VALIDATION_ERROR';
                    break;
                case 500:
                    error.message = MESSAGES.ERROR.SERVER;
                    error.code = 'SERVER_ERROR';
                    break;
            }

            throw error;
        }

        return data;
    }

    // ==============
    // Méthodes JSON
    // ==============

    async get(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getJsonHeaders(options.headers),
                ...options,
            });
            return await this.handleJsonResponse(response);
        } catch (error) {
            if (error.status) throw error;
            throw { message: MESSAGES.ERROR.NETWORK, isNetworkError: true };
        }
    }

    async post(endpoint, data, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getJsonHeaders(options.headers),
                body: JSON.stringify(data),
                ...options,
            });
            return await this.handleJsonResponse(response);
        } catch (error) {
            if (error.status) throw error;
            throw { message: MESSAGES.ERROR.NETWORK, isNetworkError: true };
        }
    }

    async put(endpoint, data, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getJsonHeaders(options.headers),
                body: JSON.stringify(data),
                ...options,
            });
            return await this.handleJsonResponse(response);
        } catch (error) {
            if (error.status) throw error;
            throw { message: MESSAGES.ERROR.NETWORK, isNetworkError: true };
        }
    }

    async delete(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getJsonHeaders(options.headers),
                ...options,
            });
            return await this.handleJsonResponse(response);
        } catch (error) {
            if (error.status) throw error;
            throw { message: MESSAGES.ERROR.NETWORK, isNetworkError: true };
        }
    }

    // ================
    // Upload de fichiers
    // ================

    async upload(endpoint, formData, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getFormHeaders(options.headers),
                body: formData,
                ...options,
            });
            return await this.handleJsonResponse(response); // Laravel renvoie du JSON après upload
        } catch (error) {
            if (error.status) throw error;
            throw { message: MESSAGES.ERROR.NETWORK, isNetworkError: true };
        }
    }

    // ===================
    // Téléchargement de fichiers (PDF, images, etc.)
    // ===================

    /**
     * Télécharge un fichier binaire (ne retourne PAS du JSON)
     * @returns {Promise<Blob>}
     */
    async download(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getJsonHeaders(options.headers), // Le token est souvent requis
                ...options,
            });

            if (!response.ok) {
                // Essayer de lire l'erreur en JSON si possible
                let message = 'Échec du téléchargement';
                try {
                    const errorData = await response.json();
                    message = errorData.message || message;
                } catch {
                    // Ignorer si pas du JSON
                }
                throw { status: response.status, message };
            }

            return await response.blob();
        } catch (error) {
            if (error.status) throw error;
            throw { message: MESSAGES.ERROR.NETWORK, isNetworkError: true };
        }
    }
}

// Export singleton
export const apiClient = new ApiClient();