# BookMyTemple PWA - Local Setup Guide

## Prerequisites

Before you begin, make sure you have the following installed on your laptop:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

4. **Code Editor** (recommended: VS Code)
   - Download from: https://code.visualstudio.com/

---

## Step 1: Create Project Folder

Open your terminal/command prompt and run:

```bash
# Create a new folder for your project
mkdir BookMyTemple
cd BookMyTemple
```

---

## Step 2: Initialize the Project

```bash
# Initialize npm project
npm init -y
```

---

## Step 3: Install Dependencies

```bash
# Install Vite and React
npm install vite@latest react@latest react-dom@latest

# Install TypeScript
npm install --save-dev typescript @types/react @types/react-dom

# Install Tailwind CSS
npm install --save-dev tailwindcss@latest postcss@latest autoprefixer@latest

# Install Vite PWA Plugin
npm install --save-dev vite-plugin-pwa

# Install Lucide React (for icons)
npm install lucide-react

# Install additional UI libraries
npm install recharts react-slick react-responsive-masonry motion
```

---

## Step 4: Create Configuration Files

### 4.1 Create `vite.config.ts`

Create a file named `vite.config.ts` in the root folder with the following content:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'BookMyTemple',
        short_name: 'BMT',
        description: 'Book temple sevas, darshan, and spiritual services',
        theme_color: '#FF7A00',
        background_color: '#FFF8F0',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

### 4.2 Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4.3 Create `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 4.4 Create `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: '#FF7A00',
        maroon: '#641220',
        gold: '#F4C430',
        cream: '#FFF8F0',
      },
    },
  },
  plugins: [],
}
```

### 4.5 Create `postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## Step 5: Update package.json Scripts

Open `package.json` and update the `scripts` section:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## Step 6: Copy Project Files

You need to copy all the files from the Figma Make project to your local folder. Here's the structure:

```
BookMyTemple/
├── index.html
├── App.tsx
├── components/
│   ├── BottomNav.tsx
│   ├── Button.tsx
│   ├── FilterChip.tsx
│   ├── Header.tsx
│   ├── InputField.tsx
│   ├── OfflineIndicator.tsx
│   ├── PWAInstallPrompt.tsx
│   ├── SevaCard.tsx
│   ├── TempleCard.tsx
│   ├── UpdateNotification.tsx
│   └── figma/
│       └── ImageWithFallback.tsx
├── pages/
│   ├── Home.tsx
│   ├── Classes.tsx
│   ├── PujasHomas.tsx
│   ├── (and all other page files)
├── styles/
│   └── globals.css
├── hooks/
│   └── useOnlineStatus.ts
├── utils/
│   └── pwa-utils.ts
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   ├── offline.html
│   └── (icon files when generated)
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Step 7: Run the Development Server

```bash
# Start the development server
npm run dev
```

You should see output like:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Step 8: Open in Browser

1. Open your browser and go to: **http://localhost:5173/**
2. The application should load and display the BookMyTemple app

---

## Step 9: Test on Mobile (Optional)

To test on your mobile device on the same WiFi network:

```bash
# Run with host flag
npm run dev -- --host
```

Then access using your laptop's IP address:
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Open on mobile: `http://YOUR_IP_ADDRESS:5173/`

---

## Step 10: Build for Production

When you're ready to deploy:

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build files will be in the `dist/` folder.

---

## Common Issues & Solutions

### Issue 1: Port 5173 already in use
**Solution:** Kill the process or use a different port:
```bash
npm run dev -- --port 3000
```

### Issue 2: Module not found errors
**Solution:** Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Tailwind styles not loading
**Solution:** Make sure `globals.css` is imported in your main file and contains:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue 4: TypeScript errors
**Solution:** Check that all `.tsx` files are in the correct location and tsconfig paths are correct.

---

## Project Structure Explanation

- **`/components`**: Reusable UI components
- **`/pages`**: Main application pages/screens
- **`/styles`**: Global CSS and Tailwind styles
- **`/hooks`**: Custom React hooks
- **`/utils`**: Utility functions
- **`/public`**: Static assets and PWA files
- **`index.html`**: Entry HTML file
- **`App.tsx`**: Main application component with routing

---

## Next Steps

1. ✅ Run the app locally
2. ✅ Test all features and pages
3. ✅ Generate PWA icons (follow PWA_SETUP.md)
4. ✅ Test PWA installation on mobile
5. ✅ Deploy to hosting (Vercel, Netlify, etc.)

---

## Development Tips

1. **Hot Reload**: Vite provides instant hot reload - changes appear immediately
2. **Browser DevTools**: Press F12 to open DevTools for debugging
3. **Console Logs**: Check console for errors or warnings
4. **Responsive Testing**: Use browser DevTools device toolbar (Ctrl+Shift+M)
5. **PWA Testing**: Use Lighthouse in Chrome DevTools for PWA audit

---

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure Node.js version is 18+
4. Clear browser cache and restart dev server
5. Check file paths and imports are correct

---

**Happy Coding! 🚀**
