let deferredInstallPrompt = null;

const INSTALL_EVENT_NAME = 'menuiserie-app-install-available';

export function initializeInstallPrompt() {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    window.dispatchEvent(new CustomEvent(INSTALL_EVENT_NAME));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    window.localStorage.setItem('menuiserie_pwa_installed', 'true');
  });
}

export function getInstallAvailabilityEventName() {
  return INSTALL_EVENT_NAME;
}

export function hasDeferredInstallPrompt() {
  return !!deferredInstallPrompt;
}

export async function triggerInstallPrompt() {
  if (!deferredInstallPrompt) {
    return { supported: false, outcome: 'unavailable' };
  }

  const promptEvent = deferredInstallPrompt;
  deferredInstallPrompt = null;

  await promptEvent.prompt();
  const choice = await promptEvent.userChoice;

  return {
    supported: true,
    outcome: choice?.outcome ?? 'dismissed',
  };
}

export function isIosDevice() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isRunningStandalone() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function shouldShowInstallPrompt() {
  if (typeof window === 'undefined') {
    return false;
  }

  if (isRunningStandalone()) {
    return false;
  }

  const dismissed = window.sessionStorage.getItem('menuiserie_install_prompt_dismissed') === 'true';

  if (dismissed) {
    return false;
  }

  return hasDeferredInstallPrompt() || isIosDevice();
}

export function markInstallPromptDismissed() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem('menuiserie_install_prompt_dismissed', 'true');
}

export function resetInstallPromptSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem('menuiserie_install_prompt_dismissed');
}

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Service worker non enregistré:', error);
    });
  });
}
