import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-white px-4 py-3 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-center gap-2">
        <WifiOff className="w-5 h-5" />
        <span className="font-medium">You're offline</span>
        <span className="text-sm opacity-90">- Some features may be limited</span>
      </div>
    </div>
  );
}
