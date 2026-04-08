import { useEffect, useState } from 'react';
import {
  getInstallAvailabilityEventName,
  isIosDevice,
  markInstallPromptDismissed,
  shouldShowInstallPrompt,
  triggerInstallPrompt,
} from '../../lib/pwa/installManager';

export default function AppInstallPrompt({ isAuthenticated }) {
  const [open, setOpen] = useState(false);
  const [installing, setInstalling] = useState(false);
  const ios = isIosDevice();

  useEffect(() => {
    if (!isAuthenticated) {
      setOpen(false);
      return;
    }

    if (shouldShowInstallPrompt()) {
      setOpen(true);
    }

    const eventName = getInstallAvailabilityEventName();
    const handleAvailable = () => {
      if (isAuthenticated && shouldShowInstallPrompt()) {
        setOpen(true);
      }
    };

    window.addEventListener(eventName, handleAvailable);

    return () => {
      window.removeEventListener(eventName, handleAvailable);
    };
  }, [isAuthenticated]);

  if (!open || !isAuthenticated) {
    return null;
  }

  const handleClose = () => {
    markInstallPromptDismissed();
    setOpen(false);
  };

  const handleInstall = async () => {
    if (ios) {
      return;
    }

    setInstalling(true);

    try {
      const result = await triggerInstallPrompt();

      if (result.outcome !== 'accepted') {
        markInstallPromptDismissed();
      }

      setOpen(false);
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Installer l'application</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Voulez-vous ajouter l'icone de l'application sur votre appareil pour y acceder plus vite ?
          </p>
        </div>

        {ios ? (
          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            Sur iPhone ou iPad, touchez le bouton Partager de Safari puis choisissez
            {' '}<strong>Sur l'ecran d'accueil</strong>.
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            Si vous acceptez, le navigateur installera l'application avec son icone sur l'appareil.
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Non
          </button>
          <button
            type="button"
            onClick={ios ? handleClose : handleInstall}
            disabled={installing}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {ios ? "J'ai compris" : installing ? 'Installation...' : 'Oui, installer'}
          </button>
        </div>
      </div>
    </div>
  );
}
