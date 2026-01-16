/**
 * Valider un email
 */
export const validateEmail = (email) => {
    if (!email || !email.trim()) {
        return { valid: false, message: 'L\'email est requis' };
    }
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!regex.test(email.trim())) {
        return { valid: false, message: 'Format d\'email invalide' };
    }
    return { valid: true };
};

/**
 * Valider un mot de passe
 * Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
 */
export const validatePassword = (password) => {
    if (!password) {
        return { valid: false, message: 'Le mot de passe est requis' };
    }
    if (password.length < 8) {
        return { valid: false, message: 'Minimum 8 caractères' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Au moins 1 majuscule' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Au moins 1 minuscule' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Au moins 1 chiffre' };
    }
    return { valid: true };
};

/**
 * Nettoyer et valider un numéro de téléphone malien
 */
const cleanPhone = (phone) => {
    return phone.replace(/\D/g, '');
};

export const validatePhone = (phone) => {
    if (!phone) {
        return { valid: false, message: 'Le numéro de téléphone est requis' };
    }
    const cleaned = cleanPhone(phone);

    // Format international (+223 ou 00223 → devient 223...)
    if (cleaned.startsWith('223') && cleaned.length === 11) {
        return /^[223][67]\d{8}$/.test(cleaned)
            ? { valid: true }
            : { valid: false, message: 'Numéro malien invalide' };
    }

    // Format local (8 chiffres, commence par 6 ou 7)
    if (cleaned.length === 8 && /^[67]/.test(cleaned)) {
        return { valid: true };
    }

    return { valid: false, message: 'Format de téléphone non supporté (ex: +223 70 12 34 56)' };
};

/**
 * Valider une URL
 */
export const validateUrl = (url) => {
    if (!url) return { valid: true }; // optionnel
    try {
        new URL(url);
        return { valid: true };
    } catch {
        return { valid: false, message: 'URL invalide' };
    }
};

/**
 * Valider un champ requis
 */
export const validateRequired = (value, label = 'Ce champ') => {
    if (value == null) {
        return { valid: false, message: `${label} est requis` };
    }
    if (typeof value === 'string' && value.trim() === '') {
        return { valid: false, message: `${label} est requis` };
    }
    return { valid: true };
};