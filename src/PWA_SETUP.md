# BookMyTemple - Progressive Web App Setup Guide

## Overview
BookMyTemple is now configured as a Progressive Web App (PWA), allowing users to install it on their devices for a native app-like experience.

## Features Implemented

### 1. **App Manifest** (`/public/manifest.json`)
- App name and branding
- Custom theme colors (Saffron #FF7A00)
- Multiple icon sizes for all devices
- Standalone display mode
- Mobile-first orientation

### 2. **Service Worker** (`/public/service-worker.js`)
- Offline caching strategy
- Runtime caching for dynamic content
- Network-first for API calls
- Cache-first for static assets
- Push notification support
- Background sync capability

### 3. **PWA Components**

#### `PWAInstallPrompt`
- Smart install banner
- Auto-shows after 3 seconds
- Dismissible per session
- Branded with app colors

#### `OfflineIndicator`
- Real-time connection status
- Fixed top banner when offline
- Clear visual feedback

#### `UpdateNotification`
- Automatic update detection
- User-friendly update prompt
- One-click update activation

### 4. **PWA Utilities** (`/utils/pwa-utils.ts`)
Comprehensive helper functions:
- Installation detection
- Notification management
- Cache management
- Sharing capabilities
- Offline data handling
- Network status monitoring

### 5. **Hooks**

#### `useOnlineStatus`
Custom React hook for monitoring network connectivity.

## Installation Instructions

### For Users

#### **Android Devices:**
1. Open BookMyTemple in Chrome browser
2. Tap the install banner when it appears, OR
3. Tap the menu (⋮) → "Add to Home Screen"
4. Tap "Install" in the dialog

#### **iOS Devices:**
1. Open BookMyTemple in Safari
2. Tap the Share button (□↑)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top-right corner

#### **Desktop (Chrome/Edge):**
1. Open BookMyTemple in browser
2. Click the install icon (⊕) in the address bar, OR
3. Menu → "Install BookMyTemple"

### For Developers

#### **Setup Requirements:**
```bash
# Ensure all PWA files are in place:
/public/manifest.json
/public/service-worker.js
/public/browserconfig.xml
/public/offline.html
/index.html
```

#### **Icons Required:**
Create app icons in `/public/icons/` with these sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

Use tools like [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) to create icons from a single source image.

#### **Testing PWA:**

1. **Local Testing:**
```bash
# PWAs require HTTPS (or localhost)
npm run dev
# Open in browser and check DevTools → Application → Manifest
```

2. **Lighthouse Audit:**
- Open Chrome DevTools
- Go to "Lighthouse" tab
- Check "Progressive Web App"
- Click "Generate report"

3. **Service Worker Testing:**
```javascript
// In DevTools Console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log(registrations);
});
```

4. **Offline Testing:**
- DevTools → Network tab
- Check "Offline" checkbox
- Test app functionality

## PWA Capabilities

### ✅ Implemented Features

1. **Installability**
   - Add to home screen
   - Standalone app experience
   - Custom splash screen

2. **Offline Support**
   - Cached static assets
   - Offline page fallback
   - Runtime caching

3. **Performance**
   - Fast loading
   - Smooth animations
   - Optimized caching

4. **Engagement**
   - Push notifications (setup ready)
   - Background sync (setup ready)
   - Share API integration

5. **Responsive**
   - Mobile-first design (360×800)
   - Tablet support
   - Desktop support

### 🔄 Future Enhancements

1. **Push Notifications**
   - Booking confirmations
   - Darshan reminders
   - Prasadam delivery updates

2. **Background Sync**
   - Offline booking queue
   - Auto-sync when online

3. **Advanced Caching**
   - Temple images pre-caching
   - Smart cache invalidation

4. **Web Share Target**
   - Share temples with friends
   - Share booking confirmations

## Configuration

### Customize Theme Colors
Edit `/public/manifest.json`:
```json
{
  "theme_color": "#FF7A00",
  "background_color": "#FFF8F0"
}
```

### Adjust Cache Strategy
Edit `/public/service-worker.js`:
```javascript
const CACHE_NAME = 'bookmytemple-v1'; // Update version for cache refresh
```

### Update App Metadata
Edit `/index.html` head section for SEO and PWA metadata.

## Troubleshooting

### Install Banner Not Showing
- Check that manifest.json is accessible
- Verify service worker is registered
- Ensure HTTPS (or localhost)
- Check Chrome DevTools → Application → Manifest

### Service Worker Not Updating
```javascript
// Force update
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.update());
});
```

### Offline Mode Not Working
- Check service worker registration
- Verify cache names match
- Check DevTools → Application → Cache Storage

### Icons Not Showing
- Verify icon paths in manifest.json
- Check icon file sizes
- Ensure icons are in /public/icons/

## Browser Support

| Browser | Install | Offline | Notifications | Background Sync |
|---------|---------|---------|---------------|-----------------|
| Chrome (Android) | ✅ | ✅ | ✅ | ✅ |
| Safari (iOS) | ✅ | ✅ | ⚠️ | ❌ |
| Edge (Desktop) | ✅ | ✅ | ✅ | ✅ |
| Firefox (Android) | ✅ | ✅ | ✅ | ❌ |
| Samsung Internet | ✅ | ✅ | ✅ | ✅ |

✅ Full support | ⚠️ Partial support | ❌ Not supported

## Security Considerations

1. **HTTPS Required**
   - PWAs only work on HTTPS
   - Use localhost for development

2. **Content Security Policy**
   - Configure CSP headers for production
   - Restrict script sources

3. **Data Privacy**
   - Clear sensitive data from cache
   - Implement secure storage for user data

## Performance Metrics

Target PWA scores (Lighthouse):
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 100

## Additional Resources

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox (Advanced Service Workers)](https://developers.google.com/web/tools/workbox)

## Deployment Checklist

- [ ] Generate all required icon sizes
- [ ] Test on multiple devices (Android, iOS, Desktop)
- [ ] Run Lighthouse audit
- [ ] Test offline functionality
- [ ] Verify manifest.json is accessible
- [ ] Ensure HTTPS certificate is valid
- [ ] Test install flow on each platform
- [ ] Verify update mechanism works
- [ ] Test share functionality
- [ ] Monitor service worker errors in production

## Support

For issues or questions about PWA implementation:
1. Check browser console for errors
2. Review DevTools → Application tab
3. Test with Lighthouse
4. Verify manifest validation at web.dev/manifest

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Maintained by:** BookMyTemple Development Team
