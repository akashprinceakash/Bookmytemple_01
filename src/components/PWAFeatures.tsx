import { Smartphone, Wifi, Bell, Download, Share2 } from 'lucide-react';
import { isPWA, isOnline, shareContent, requestNotificationPermission } from '../utils/pwa-utils';
import { useState, useEffect } from 'react';

export function PWAFeatures() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setIsInstalled(isPWA());
    setIsConnected(isOnline());
    setNotificationPermission(Notification.permission);
  }, []);

  const handleShare = async () => {
    const shared = await shareContent({
      title: 'BookMyTemple',
      text: 'Book temple sevas and watch live darshan',
      url: window.location.href,
    });
    
    if (!shared) {
      alert('Sharing not supported on this device');
    }
  };

  const handleNotifications = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      alert('Notifications enabled! You\'ll receive booking updates.');
    }
  };

  const features = [
    {
      icon: Smartphone,
      title: 'App Installed',
      description: isInstalled ? 'Running as installed app' : 'Install for better experience',
      status: isInstalled,
      color: '#FF7A00',
    },
    {
      icon: Wifi,
      title: 'Offline Support',
      description: isConnected ? 'Online and synced' : 'Offline mode active',
      status: isConnected,
      color: '#641220',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: notificationPermission === 'granted' ? 'Enabled' : 'Enable for updates',
      status: notificationPermission === 'granted',
      color: '#F4C430',
      action: notificationPermission !== 'granted' ? handleNotifications : undefined,
    },
    {
      icon: Share2,
      title: 'Share App',
      description: 'Share with friends and family',
      status: true,
      color: '#FF7A00',
      action: handleShare,
    },
  ];

  return (
    <div className="px-4 py-6">
      <h3 className="font-semibold text-[#641220] mb-4">App Features</h3>
      
      <div className="space-y-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-100 flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
              
              {feature.action && (
                <button
                  onClick={feature.action}
                  className="px-4 py-2 bg-[#FF7A00] text-white rounded-lg text-sm font-medium hover:bg-[#E66D00] transition-colors flex-shrink-0"
                >
                  Enable
                </button>
              )}
              
              {!feature.action && (
                <div className="flex-shrink-0">
                  {feature.status ? (
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {!isInstalled && (
        <div className="mt-4 p-4 bg-gradient-to-r from-[#FF7A00] to-[#641220] rounded-lg text-white">
          <div className="flex items-start gap-3">
            <Download className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Install BookMyTemple</h4>
              <p className="text-sm opacity-90 mb-3">
                Get quick access and offline support by installing our app
              </p>
              <p className="text-xs opacity-75">
                Tap your browser's menu and select "Add to Home Screen"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
