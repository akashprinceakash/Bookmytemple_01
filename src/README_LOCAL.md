# 🕉️ BookMyTemple - Local Development Setup

A comprehensive Progressive Web App (PWA) for booking temple sevas, darshan, spiritual classes, and special pujas.

## 🚀 Quick Start (3 Steps)

### Step 1: Download Project Files

You need to download all the project files to your laptop. Create a folder structure like this:

```
BookMyTemple/
├── index.html
├── App.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── components/
├── pages/
├── styles/
├── hooks/
├── utils/
└── public/
```

### Step 2: Install Dependencies

Open terminal/command prompt in the project folder and run:

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Or manually:**
```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

Open **http://localhost:5173/** in your browser! 🎉

---

## 📋 Detailed Instructions

### Prerequisites

1. **Node.js** (v18+) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **Code Editor** (VS Code recommended)

### Installation Steps

#### 1. Verify Prerequisites

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

#### 2. Navigate to Project Folder

```bash
cd path/to/BookMyTemple
```

#### 3. Install All Dependencies

```bash
npm install
```

This will install:
- ✅ React & React DOM
- ✅ TypeScript
- ✅ Vite (build tool)
- ✅ Tailwind CSS
- ✅ Vite PWA Plugin
- ✅ Lucide React (icons)

#### 4. Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

#### 5. Open in Browser

Navigate to: **http://localhost:5173/**

---

## 📱 Testing on Mobile Device

To test the app on your phone (same WiFi network):

1. **Start dev server with host flag:**
   ```bash
   npm run dev -- --host
   ```

2. **Find your laptop's IP address:**
   - **Windows:** Open CMD and run `ipconfig`
   - **Mac/Linux:** Open Terminal and run `ifconfig` or `ip addr`
   - Look for IPv4 address (e.g., 192.168.1.100)

3. **Open on mobile:**
   - Navigate to: `http://YOUR_IP_ADDRESS:5173/`
   - Example: `http://192.168.1.100:5173/`

---

## 🏗️ Build for Production

### Create Production Build

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
BookMyTemple/
│
├── index.html              # Entry HTML file
├── App.tsx                 # Main app component with routing
├── package.json            # Dependencies & scripts
├── vite.config.ts          # Vite & PWA configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
│
├── components/             # Reusable UI components
│   ├── BottomNav.tsx
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── TempleCard.tsx
│   └── ...
│
├── pages/                  # Application pages/screens
│   ├── Home.tsx
│   ├── Classes.tsx
│   ├── PujasHomas.tsx
│   ├── TempleList.tsx
│   └── ...
│
├── styles/                 # Global styles
│   └── globals.css
│
├── hooks/                  # Custom React hooks
│   └── useOnlineStatus.ts
│
├── utils/                  # Utility functions
│   └── pwa-utils.ts
│
└── public/                 # Static assets
    ├── manifest.json       # PWA manifest
    ├── service-worker.js   # Service worker
    └── offline.html        # Offline fallback page
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production (output: `dist/` folder) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run code linting |

---

## 🎨 Design System

The app uses a carefully crafted color scheme:

- **Saffron:** `#FF7A00` - Primary brand color
- **Maroon:** `#641220` - Secondary/accent color
- **Gold:** `#F4C430` - Highlight color
- **Cream:** `#FFF8F0` - Background color

---

## 🔧 Troubleshooting

### Issue: Port 5173 already in use

**Solution:** Use a different port
```bash
npm run dev -- --port 3000
```

### Issue: Dependencies installation failed

**Solution:** Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Tailwind styles not loading

**Solution:** Ensure `styles/globals.css` contains:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: TypeScript errors

**Solution:** Check tsconfig.json is properly configured and all files are in correct locations

### Issue: PWA not working in dev mode

**Solution:** PWA features work best in production build. Try:
```bash
npm run build
npm run preview
```

---

## 📱 PWA Features

The app includes full Progressive Web App capabilities:

- ✅ **Installable** - Add to home screen
- ✅ **Offline Support** - Works without internet
- ✅ **Push Notifications** - Stay updated
- ✅ **Background Sync** - Sync when back online
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Fast Loading** - Optimized performance

---

## 🌐 Browser Support

- ✅ Chrome/Edge (88+)
- ✅ Firefox (78+)
- ✅ Safari (14+)
- ✅ Opera (75+)

---

## 📦 Dependencies

### Core
- React 18.2.0
- React DOM 18.2.0
- TypeScript 5.3.3

### Build Tools
- Vite 5.1.0
- Vite Plugin PWA 0.17.5

### Styling
- Tailwind CSS 3.4.1
- PostCSS 8.4.35
- Autoprefixer 10.4.17

### Icons
- Lucide React 0.344.0

---

## 🚀 Deployment

Once development is complete, you can deploy to:

1. **Vercel** - Recommended for React apps
2. **Netlify** - Easy deployment
3. **GitHub Pages** - Free hosting
4. **Firebase Hosting** - Google's platform
5. **Custom Server** - Your own hosting

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow prompts and your app will be live!

---

## 💡 Development Tips

1. **Hot Reload:** Vite provides instant hot reload - save files to see changes immediately
2. **DevTools:** Press F12 to open browser DevTools for debugging
3. **Responsive Testing:** Use DevTools device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
4. **Console Logs:** Always check browser console for errors
5. **Network Tab:** Monitor API calls and asset loading

---

## 📖 Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [PWA_SETUP.md](PWA_SETUP.md) - PWA configuration guide
- [PWA_FEATURES.md](PWA_FEATURES.md) - PWA features documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions

---

## 🤝 Support

If you encounter issues:

1. Check the console for error messages
2. Verify all files are in correct locations
3. Ensure Node.js version is 18 or higher
4. Try deleting `node_modules` and reinstalling
5. Clear browser cache and restart dev server

---

## 📄 License

This project is created for BookMyTemple.

---

## 🙏 Acknowledgments

Built with:
- React
- Vite
- Tailwind CSS
- TypeScript
- Lucide Icons

---

**Ready to start? Run `npm run dev` and let's go! 🚀**
