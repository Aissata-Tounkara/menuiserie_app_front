import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState('email'); // email, reset, success
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleEmailSubmit = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Veuillez entrer votre email';
    if (!validateEmail(email)) newErrors.email = 'Email invalide';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('reset');
        setSuccessMessage(`Un code de réinitialisation a été envoyé à ${email}`);
      }, 1500);
    }
  };

  const handleResetSubmit = () => {
    const newErrors = {};
    if (!resetCode.trim()) newErrors.resetCode = 'Veuillez entrer le code';
    if (resetCode.length < 6) newErrors.resetCode = 'Code invalide';
    if (!password.trim()) newErrors.password = 'Veuillez entrer un mot de passe';
    if (password.length < 6) newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('success');
      }, 1500);
    }
  };

  const handleGoBack = () => {
    setStep('email');
    setEmail('');
    setResetCode('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setSuccessMessage('');
  };

  // Étape 1: Entrée de l'email
  if (step === 'email') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-xl p-3">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Mot de passe oublié?</h1>
            <p className="text-blue-100">Pas de problème, nous vous aiderons à le réinitialiser</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="space-y-6">
              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Entrez l'adresse email associée à votre compte et nous vous enverrons un code de réinitialisation.
                </p>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    placeholder="votre@email.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleEmailSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le code
                  </>
                )}
              </button>

              {/* Back to Login */}
              <button
                onClick={handleGoBack}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
              >
                <ArrowLeft className="w-4 h-4" />
                {/* retour a la connexion */}
                <a href="/login" className="register">Retour a la connexion</a>
              </button>
            </div>
          </div>

          <p className="text-center text-blue-100 text-xs mt-6">
            © 2024 Gestion de Stock. Tous droits réservés.
          </p>
        </div>
      </div>
    );
  }

  // Étape 2: Réinitialisation du mot de passe
  if (step === 'reset') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-xl p-3">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Réinitialiser le mot de passe</h1>
            <p className="text-blue-100">Créez un nouveau mot de passe sécurisé</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              )}

              {/* Reset Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Code de réinitialisation</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => {
                    setResetCode(e.target.value.toUpperCase());
                    if (errors.resetCode) setErrors(prev => ({ ...prev, resetCode: '' }));
                  }}
                  placeholder="XXXXXX"
                  maxLength="6"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-center tracking-widest font-mono ${
                    errors.resetCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.resetCode && <p className="text-red-500 text-xs mt-2">{errors.resetCode}</p>}
                <p className="text-xs text-gray-500 mt-2">Vérifiez votre email pour le code</p>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-2">{errors.confirmPassword}</p>}
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Le mot de passe doit contenir:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className={password.length >= 6 ? 'text-green-600' : ''}>
                    ✓ Au moins 6 caractères
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleResetSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </button>

              {/* Back Button */}
              <button
                onClick={handleGoBack}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            </div>
          </div>

          <p className="text-center text-blue-100 text-xs mt-6">
            © 2024 Gestion de Stock. Tous droits réservés.
          </p>
        </div>
      </div>
    );
  }

  // Étape 3: Succès
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Mot de passe réinitialisé!</h2>
            <p className="text-gray-600 mb-8">
              Votre mot de passe a été changé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-800">
                Vous allez être redirigé vers la page de connexion dans quelques secondes...
              </p>
            </div>

            {/* Login Button */}
            <button
              onClick={() => {
                setStep('email');
                setEmail('');
                setResetCode('');
                setPassword('');
                setConfirmPassword('');
                setErrors({});
                setSuccessMessage('');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              
            </button>
          </div>

          <p className="text-center text-blue-100 text-xs mt-6">
            © 2024 Gestion de Stock. Tous droits réservés.
          </p>
        </div>
      </div>
    );
  }
}