# BookMyTemple - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- HTTPS-enabled hosting (required for PWA)

## Build for Production

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate App Icons
Open `/scripts/generate-icons.html` in your browser and download all icons to `/public/icons/`.

### 3. Update Configuration

#### Update Manifest
Edit `/public/manifest.json`:
- Update `start_url` with your domain
- Verify all paths are correct
- Update `screenshots` if you have actual screenshots

#### Update Service Worker
Edit `/public/service-worker.js`:
- Update `CACHE_NAME` version for each deployment
- Add any additional URLs to `PRECACHE_URLS`

#### Update HTML Meta Tags
Edit `/index.html`:
- Update meta descriptions
- Add Open Graph tags for social sharing
- Update canonical URLs

### 4. Build the App
```bash
npm run build
```

This creates an optimized production build in the `/dist` directory.

### 5. Test the Build Locally
```bash
# Install serve if you haven't
npm install -g serve

# Serve the build
serve -s dist -l 3000

# Open https://localhost:3000
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure**
- Vercel automatically detects Vite
- Add environment variables in Vercel dashboard
- Enable HTTPS (automatic on Vercel)

### Option 2: Netlify

1. **Create `netlify.toml`**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "no-cache"
```

2. **Deploy**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Option 3: Firebase Hosting

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Initialize Firebase**
```bash
firebase init hosting
```

3. **Configure `firebase.json`**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

4. **Deploy**
```bash
firebase deploy
```

### Option 4: AWS S3 + CloudFront

1. **Build the app**
```bash
npm run build
```

2. **Upload to S3**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

3. **Configure CloudFront**
- Enable HTTPS
- Set default root object to `index.html`
- Add error page redirect: 404 → `/index.html` (200)

## Post-Deployment Checklist

### 1. Verify PWA Installation

- [ ] Open your deployed app in Chrome
- [ ] Check DevTools → Application → Manifest
- [ ] Verify all manifest fields are correct
- [ ] Test "Add to Home Screen"

### 2. Test Service Worker

- [ ] Open DevTools → Application → Service Workers
- [ ] Verify service worker is registered
- [ ] Test offline mode (Network tab → Offline)
- [ ] Clear cache and reload

### 3. Run Lighthouse Audit

- [ ] Open Chrome DevTools
- [ ] Go to Lighthouse tab
- [ ] Run audit with all categories
- [ ] Aim for PWA score of 100

### 4. Test on Multiple Devices

- [ ] Android phone (Chrome)
- [ ] iPhone (Safari)
- [ ] iPad (Safari)
- [ ] Desktop (Chrome, Firefox, Edge)

### 5. SEO Verification

- [ ] Verify robots.txt is accessible
- [ ] Verify sitemap.xml is accessible
- [ ] Check meta tags
- [ ] Submit sitemap to Google Search Console

### 6. Performance Optimization

- [ ] Enable gzip/brotli compression
- [ ] Configure CDN
- [ ] Set proper cache headers
- [ ] Optimize images

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Update with your production values:
- API endpoints
- API keys
- Analytics IDs
- Push notification keys

## HTTPS Configuration

PWAs **require** HTTPS. Most modern hosting platforms provide this automatically:

- **Vercel**: Automatic SSL
- **Netlify**: Automatic SSL
- **Firebase**: Automatic SSL
- **Custom domain**: Use Let's Encrypt

## Updating the App

### 1. Make Changes

Edit your code as needed.

### 2. Update Version

Update cache version in `/public/service-worker.js`:
```javascript
const CACHE_NAME = 'bookmytemple-v2'; // Increment version
```

### 3. Build and Deploy

```bash
npm run build
# Deploy using your chosen platform
```

### 4. Users Get Update

Users will see the update notification component and can click to refresh.

## Monitoring

### Analytics Setup

1. Add Google Analytics to `/index.html`
2. Track PWA install events
3. Monitor service worker errors
4. Track offline usage

### Error Tracking

Consider adding error tracking:
- Sentry
- LogRocket
- Rollbar

### Performance Monitoring

- Web Vitals
- Lighthouse CI
- Firebase Performance Monitoring

## Troubleshooting

### Service Worker Not Updating

```javascript
// Force update all clients
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
```

### Icons Not Showing

- Verify icon paths in manifest.json
- Check icon file sizes match manifest
- Clear browser cache
- Check DevTools console for errors

### App Not Installable

- Verify HTTPS is enabled
- Check manifest.json is valid
- Ensure service worker is registered
- Check browser install criteria

### Caching Issues

```bash
# Clear all caches
Application → Storage → Clear site data
```

## Security Headers

Add these headers for better security:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## CDN Configuration

For better performance, serve static assets from CDN:

1. Upload `/icons/` to CDN
2. Update manifest.json with CDN URLs
3. Update service worker to cache CDN resources

## Backup Strategy

1. Version control (Git)
2. Regular database backups (when backend added)
3. Asset backups
4. Configuration backups

## Support

For deployment issues:
1. Check hosting platform documentation
2. Review browser console errors
3. Run Lighthouse diagnostics
4. Check service worker status

---

**Need Help?**
- Check platform-specific docs
- Review PWA_SETUP.md
- Test locally first
- Monitor browser console

**Last Updated:** December 2025
