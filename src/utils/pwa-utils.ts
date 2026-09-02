/**
 * PWA Utility Functions for BookMyTemple
 */

// Check if app is running in standalone mode (installed as PWA)
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
}

// Check if the device is iOS
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

// Check if service worker is supported
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

// Check if notifications are supported
export function areNotificationsSupported(): boolean {
  return 'Notification' in window;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!areNotificationsSupported()) {
    return 'denied';
  }
  
  return await Notification.requestPermission();
}

// Show a notification (requires permission)
export async function showNotification(title: string, options?: NotificationOptions): Promise<void> {
  if (!areNotificationsSupported()) {
    console.warn('Notifications not supported');
    return;
  }

  const permission = await requestNotificationPermission();
  
  if (permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Use service worker to show notification
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options,
      });
    } else {
      // Fallback to regular notification
      new Notification(title, options);
    }
  }
}

// Check if app can be installed
export function canInstall(): boolean {
  return !isPWA() && isServiceWorkerSupported();
}

// Get install prompt
export function getInstallPrompt(): any {
  return (window as any).deferredPrompt;
}

// Clear app cache (useful for updates)
export async function clearAppCache(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  }
}

// Update service worker
export async function updateServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  }
}

// Check for updates
export async function checkForUpdates(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return registration.waiting !== null;
  }
  return false;
}

// Activate waiting service worker
export function activateUpdate(): void {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
}

// Share API (for sharing bookings, temples, etc.)
export async function shareContent(data: ShareData): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }
  return false;
}

// Background sync for offline data
export async function registerSync(tag: string): Promise<void> {
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await (registration as any).sync.register(tag);
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }
}

// Add to home screen instructions for iOS
export function getIOSInstallInstructions(): string {
  return 'Tap the share button and select "Add to Home Screen"';
}

// Get network information
export function getNetworkInfo(): { type?: string; effectiveType?: string; downlink?: number } {
  const nav = navigator as any;
  if (nav.connection) {
    return {
      type: nav.connection.type,
      effectiveType: nav.connection.effectiveType,
      downlink: nav.connection.downlink,
    };
  }
  return {};
}

// Check if device is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Save booking offline (to be synced later)
export function saveOfflineBooking(booking: any): void {
  const offlineBookings = JSON.parse(localStorage.getItem('offlineBookings') || '[]');
  offlineBookings.push({
    ...booking,
    timestamp: Date.now(),
    synced: false,
  });
  localStorage.setItem('offlineBookings', JSON.stringify(offlineBookings));
}

// Get offline bookings
export function getOfflineBookings(): any[] {
  return JSON.parse(localStorage.getItem('offlineBookings') || '[]');
}

// Clear synced offline bookings
export function clearSyncedBookings(): void {
  const offlineBookings = getOfflineBookings();
  const unsyncedBookings = offlineBookings.filter(b => !b.synced);
  localStorage.setItem('offlineBookings', JSON.stringify(unsyncedBookings));
}
