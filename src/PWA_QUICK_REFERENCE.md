# BookMyTemple - PWA Quick Reference Card

## 🎯 At a Glance

Your app is now a **Progressive Web App (PWA)** - installable, offline-capable, and app-like!

## 📦 What Was Added

### Core Files (5)
```
/public/manifest.json          → App configuration
/public/service-worker.js      → Offline & caching
/index.html                    → PWA meta tags
/public/browserconfig.xml      → Windows tiles
/public/offline.html           → Offline fallback
```

### Components (5)
```
/components/PWAInstallPrompt.tsx    → Install banner
/components/OfflineIndicator.tsx    → Network status
/components/UpdateNotification.tsx  → Update alerts
/components/PWAFeatures.tsx         → Feature showcase
/components/SEOHead.tsx             → Dynamic SEO
```

### Utilities (2)
```
/hooks/useOnlineStatus.ts     → Network hook
/utils/pwa-utils.ts           → Helper functions
```

### Documentation (5)
```
/PWA_SETUP.md              → Complete guide
/DEPLOYMENT.md             → Deploy instructions
/PWA_FEATURES.md           → Feature summary
/PWA_QUICK_REFERENCE.md    → This file
/.env.example              → Config template
```

### SEO & Tools (3)
```
/public/robots.txt          → Search engines
/public/sitemap.xml         → SEO sitemap
/scripts/generate-icons.html → Icon generator
```

## ⚡ Quick Commands

### Test PWA Locally
```bash
npm run dev
# Open Chrome DevTools → Application
```

### Check PWA Score
```bash
# Chrome DevTools → Lighthouse → PWA
```

### Generate Icons
```bash
# Open in browser:
open scripts/generate-icons.html
```

### Build for Production
```bash
npm run build
serve -s dist
```

## 🎨 Your Colors
- **Saffron**: `#FF7A00` (Primary)
- **Maroon**: `#641220` (Secondary)
- **Gold**: `#F4C430` (Accent)
- **Cream**: `#FFF8F0` (Background)

## 📱 User Flow

1. **First Visit** → Service worker installs
2. **After 3s** → Install prompt shows
3. **Click Install** → App added to home screen
4. **Open App** → Runs standalone (no browser UI)
5. **Go Offline** → Offline indicator shows
6. **New Update** → Update notification appears

## ✅ Installation Steps

### Before Deploy
- [ ] Generate icons (all 8 sizes)
- [ ] Update manifest.json URLs
- [ ] Test on localhost
- [ ] Run Lighthouse audit

### After Deploy
- [ ] Test install on Android
- [ ] Test install on iOS
- [ ] Test offline mode
- [ ] Verify icons show
- [ ] Check update mechanism

## 🔧 Key Files to Customize

### 1. Manifest (`/public/manifest.json`)
```json
{
  "name": "Your App Name",
  "short_name": "Short",
  "theme_color": "#FF7A00"
}
```

### 2. Service Worker (`/public/service-worker.js`)
```javascript
const CACHE_NAME = 'bookmytemple-v1'; // ← Increment on deploy
```

### 3. Environment (`.env`)
```bash
VITE_APP_NAME=BookMyTemple
VITE_API_BASE_URL=https://api.yourdomain.com
```

## 🐛 Quick Fixes

### Install prompt not showing?
```bash
# Check in DevTools → Application:
- ✅ Manifest exists
- ✅ Service worker registered
- ✅ HTTPS enabled
```

### Service worker not updating?
```javascript
// In service-worker.js:
const CACHE_NAME = 'bookmytemple-v2'; // ← Change version
```

### Icons not appearing?
```bash
# Verify files exist:
/public/icons/icon-72x72.png
/public/icons/icon-96x96.png
# ... through ...
/public/icons/icon-512x512.png
```

## 🎯 PWA Components Usage

### Install Prompt
```tsx
// Already added to App.tsx
<PWAInstallPrompt />
```

### Offline Indicator
```tsx
// Already added to App.tsx
<OfflineIndicator />
```

### Update Notification
```tsx
// Already added to App.tsx
<UpdateNotification />
```

### PWA Features (optional)
```tsx
// Add to Profile page:
import { PWAFeatures } from '../components/PWAFeatures';
<PWAFeatures />
```

## 📊 PWA Utils Examples

```typescript
import { 
  isPWA,           // Check if installed
  isOnline,        // Check connection
  shareContent,    // Share API
  showNotification // Notifications
} from '../utils/pwa-utils';

// Check if running as PWA
if (isPWA()) {
  console.log('Running as installed app!');
}

// Share content
await shareContent({
  title: 'Check out this temple!',
  text: 'Book seva at this temple',
  url: window.location.href
});

// Show notification
await showNotification('Booking Confirmed', {
  body: 'Your seva booking is confirmed',
  icon: '/icons/icon-192x192.png'
});
```

## 🌐 Testing URLs

### Manifest
```
https://yourdomain.com/manifest.json
```

### Service Worker
```
https://yourdomain.com/service-worker.js
```

### Robots
```
https://yourdomain.com/robots.txt
```

## 📱 Device Testing

| Device | Browser | Test |
|--------|---------|------|
| Android | Chrome | Install, Offline |
| iPhone | Safari | Add to Home |
| iPad | Safari | Add to Home |
| Desktop | Chrome | Install |
| Desktop | Edge | Install |

## 🚀 Deploy Checklist

```
Pre-Deploy:
[ ] Icons generated (8 sizes)
[ ] Manifest updated
[ ] Service worker version bumped
[ ] Environment variables set
[ ] Lighthouse score 90+

Post-Deploy:
[ ] HTTPS enabled
[ ] Manifest accessible
[ ] Service worker registered
[ ] Install works
[ ] Offline works
```

## 📚 Quick Links

- **Setup Guide**: `/PWA_SETUP.md`
- **Deploy Guide**: `/DEPLOYMENT.md`
- **Features List**: `/PWA_FEATURES.md`
- **Icon Generator**: `/scripts/generate-icons.html`

## 💡 Pro Tips

1. **Always HTTPS** - PWAs require secure connection
2. **Test offline first** - Simulate poor network
3. **Version your cache** - Easy updates
4. **Monitor service worker** - Check DevTools regularly
5. **Real device testing** - Simulators miss features

## ⚡ One-Liner Tests

```bash
# Check if manifest is valid
curl https://yourdomain.com/manifest.json | jq

# Check service worker
curl https://yourdomain.com/service-worker.js

# Check if HTTPS
curl -I https://yourdomain.com | grep "HTTP/"
```

## 🎉 Success Criteria

Your PWA is ready when:
- ✅ Lighthouse PWA score = 100
- ✅ Installable on Android/iOS/Desktop
- ✅ Works offline
- ✅ Update notifications work
- ✅ Icons display correctly
- ✅ Runs in standalone mode

## 🆘 Need Help?

1. Check DevTools Console
2. Review Application tab
3. Run Lighthouse
4. Read `/PWA_SETUP.md`

---

**Quick Status Check:**
```bash
# Open DevTools → Console
navigator.serviceWorker.controller ? '✅ SW Active' : '❌ No SW'
```

**PWA Ready!** 🚀
