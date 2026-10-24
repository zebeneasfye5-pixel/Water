import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface InstallResult {
  outcome: 'accepted' | 'dismissed' | 'manual_guide';
  handled: boolean;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isChrome, setIsChrome] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed or running as standalone app)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect device & browser types
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    const isAndroidDevice = /android/.test(ua);
    const isChromeBrowser = /chrome|crios/.test(ua) && !/edg|opr|opera|brave/i.test(ua);
    const inApp = /fban|fbav|instagram|linkedin|telegram|snapchat|line|micromessenger|wv|version\/[0-9.]+\s+chrome/i.test(ua);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsChrome(isChromeBrowser);
    setIsInAppBrowser(inApp);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<InstallResult> => {
    // If native prompt is available (Chromium when conditions met)
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          return { outcome: 'accepted', handled: true };
        }
        return { outcome: 'dismissed', handled: true };
      } catch (err) {
        console.warn('PWA prompt execution error:', err);
      }
    }

    // In-app browser, Safari, or beforeinstallprompt pending: route to guided installation
    return { outcome: 'manual_guide', handled: false };
  };

  return {
    isInstallable: !!deferredPrompt,
    hasPrompt: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isChrome,
    isInAppBrowser,
    install,
  };
}
