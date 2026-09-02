import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is ready
                setShowUpdate(true);
              }
            });
          }
        });
      });

      // Listen for controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="panel bg-surface text-foreground rounded-xl shadow-2xl p-4 flex items-center gap-3 border border-gold/20">
        <RefreshCw className="w-6 h-6 flex-shrink-0 text-gold-soft" />
        <div className="flex-1">
          <p className="font-medium mb-1">New Update Available</p>
          <p className="text-sm text-muted-foreground">Click to refresh and get the latest features</p>
        </div>
        <button
          onClick={handleUpdate}
          className="shimmer bg-gradient-gold text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-gold hover:opacity-90 transition-opacity flex-shrink-0"
        >
          Update
        </button>
      </div>
    </div>
  );
}
