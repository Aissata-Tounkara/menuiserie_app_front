import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Imports depuis lib/
import { useAuthStore } from './lib/store/authStore';
import { validateEmail, validatePassword } from './lib/utils/validation';
import { MESSAGES, ROUTES } from './lib/utils/constants';

export default function PageConnexion() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Zustand store
  const { login } = useAuthStore();


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validation email avec la fonction du utils
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message;
    }
    
    // Validation password avec la fonction du utils
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);
  setApiError('');

  try {
    // Appel au store pour la connexion
    const response = await login({
      email: formData.email,
      password: formData.password,
      remember: formData.rememberMe
    });

    // Succès
    setShowSuccess(true);

    // Redirection après un délai
    setTimeout(() => {
      setShowSuccess(false);
      navigate(ROUTES.DASHBOARD);
    }, 1500);

  } catch (error) {
    setIsLoading(false);
    
    // Gestion des erreurs
    if (error.code === 'UNAUTHORIZED') {
      setApiError(MESSAGES.ERROR.LOGIN);
    } else {
      setApiError(error.message || MESSAGES.ERROR.SERVER);
    }
    
    console.error('Erreur de connexion:', error);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Connexion réussie !</span>
        </div>
      )}

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-white shadow-2xl">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4">
                <span className="text-4xl">🪟</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Menuiserie Aluminium</h1>
              <p className="text-blue-100 text-lg">
                Système de gestion complet pour votre entreprise de menuiserie
              </p>
            </div>

            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Gestion des commandes</h3>
                  <p className="text-blue-100 text-sm">Suivez vos commandes de A à Z en temps réel</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Catalogue produits</h3>
                  <p className="text-blue-100 text-sm">Gérez facilement votre inventaire et vos prix</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Facturation automatique</h3>
                  <p className="text-blue-100 text-sm">Générez vos devis et factures en quelques clics</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-blue-500">
              <p className="text-blue-100 text-sm">
                "Une solution complète qui a transformé notre gestion quotidienne"
              </p>
              <p className="text-white font-semibold mt-2">— Aissata Tounkara., Gérante</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🪟</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Menuiserie Aluminium</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue !</h2>
              <p className="text-gray-600">Connectez-vous à votre compte pour continuer</p>
            </div>

    <div className="space-y-6">
              {/* Affichage des erreurs API */}
              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{apiError}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="votre@email.dz"
                  />
                </div>
                {errors.email && (
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">

                  {/* changement du message mot de passe oublié en lien vers la page mot de passe oulié */}
                  <p className="forgot"><a href="/forgot-password">Mot de passe oublier</a></p>
                  
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>

              {/* Demo Credentials */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-900 mb-2">Identifiants de démonstration :</p>
                <div className="text-xs text-blue-800 space-y-1">
                  <p>📧 Email: <span className="font-mono bg-white px-2 py-1 rounded">admin@menuiserie.dz</span></p>
                  <p>🔒 Mot de passe: <span className="font-mono bg-white px-2 py-1 rounded">demo123</span></p>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                {/* <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Nouveau sur la plateforme ?</span>
                </div> */}
              </div>

              {/* Sign Up Link */}
              {/* <button className="w-full py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                <a href="Inscription" className="register">Creer un compte</a>
      
              </button> */}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                En vous connectant, vous acceptez nos{' '}
                <a href="#" className="text-blue-600 hover:underline">Conditions d'utilisation</a>
                {' '}et notre{' '}
                <a href="#" className="text-blue-600 hover:underline">Politique de confidentialité</a>
              </p>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Besoin d'aide ? <a href="#" className="text-blue-600 hover:underline font-medium">Contactez le support</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}