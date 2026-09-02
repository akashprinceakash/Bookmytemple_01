import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import logoImg from '../public/assets/logo.png';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;

  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(
      null
    );

  const [showPrompt, setShowPrompt] =
    useState(false);

  const [isInstalled, setIsInstalled] =
    useState(false);

  useEffect(() => {
    const dismissed =
      localStorage.getItem(
        "pwa-prompt-dismissed"
      );

    const standalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||
      (window.navigator as any).standalone;

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    if (dismissed) {
      return;
    }

    const handleBeforeInstallPrompt = (
      e: Event
    ) => {
      e.preventDefault();

      e.stopImmediatePropagation();

      const installEvent =
        e as BeforeInstallPromptEvent;

      setDeferredPrompt(
        installEvent
      );

      setShowPrompt(true);

      return false;
    };

    const handleInstalled = () => {
      setIsInstalled(true);

      setShowPrompt(false);

      setDeferredPrompt(null);

      localStorage.setItem(
        "pwa-prompt-dismissed",
        "true"
      );
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
      { once: true }
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );
    };
  }, []);

  const handleInstallClick =
    async () => {
      if (!deferredPrompt) return;

      await deferredPrompt.prompt();

      const { outcome } =
        await deferredPrompt.userChoice;

      if (
        outcome ===
        "accepted"
      ) {
        localStorage.setItem(
          "pwa-prompt-dismissed",
          "true"
        );
      }

      setShowPrompt(false);

      setDeferredPrompt(null);
    };

  const handleDismiss = () => {
    localStorage.setItem(
      "pwa-prompt-dismissed",
      "true"
    );

    setShowPrompt(false);
  };

  if (
    isInstalled ||
    !showPrompt ||
    !deferredPrompt
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center">

      <div className="panel w-[320px] rounded-2xl border border-gold/20 p-3 shadow-gold">

        <div className="flex items-center gap-3">

          <img
            src= {logoImg}
            alt="Book My Temples"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="flex-1">

            <div className="flex justify-between">

              <div>

                <h3 className="text-sm font-semibold font-display text-foreground">
                  Install BookMyTemples
                </h3>

                <p className="text-[11px] text-muted-foreground mt-1">
                  Faster booking experience
                </p>

              </div>

              <button
                onClick={handleDismiss}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <button
              onClick={
                handleInstallClick
              }
              className="shimmer mt-3 w-full bg-gradient-gold text-primary-foreground py-2 rounded-xl flex items-center justify-center gap-2 text-sm shadow-gold"
            >
              <Download className="w-4 h-4" />
              Install
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}