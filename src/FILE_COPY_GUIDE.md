# 📂 File Copy Checklist

## How to Get Your Code Running Locally

Follow these steps to copy all files from Figma Make to your laptop:

---

## Method 1: Manual Download (Recommended)

### Step 1: Create Project Folder on Your Laptop

1. Create a new folder called `BookMyTemple` on your Desktop or preferred location
2. Open this folder

### Step 2: Download All Files from Figma Make

From Figma Make, download/copy these files to your local `BookMyTemple` folder:

#### Root Files (place in `BookMyTemple/`)
- [ ] `index.html`
- [ ] `App.tsx`
- [ ] `package.json`
- [ ] `vite.config.ts`
- [ ] `tsconfig.json`
- [ ] `tsconfig.node.json`
- [ ] `tailwind.config.js`
- [ ] `postcss.config.js`
- [ ] `setup.sh` (for Mac/Linux)
- [ ] `setup.bat` (for Windows)

#### Components Folder (`BookMyTemple/components/`)
- [ ] `BottomNav.tsx`
- [ ] `Button.tsx`
- [ ] `FilterChip.tsx`
- [ ] `Header.tsx`
- [ ] `InputField.tsx`
- [ ] `OfflineIndicator.tsx`
- [ ] `PWAInstallPrompt.tsx`
- [ ] `SearchBar.tsx`
- [ ] `SevaCard.tsx`
- [ ] `TempleCard.tsx`
- [ ] `UpdateNotification.tsx`
- [ ] `BookingModal.tsx`
- [ ] `PropertyCard.tsx`
- [ ] `PWAFeatures.tsx`
- [ ] `SEOHead.tsx`

#### Components - Figma Subfolder (`BookMyTemple/components/figma/`)
- [ ] `ImageWithFallback.tsx`

#### Pages Folder (`BookMyTemple/pages/`)
- [ ] `Home.tsx`
- [ ] `Classes.tsx`
- [ ] `PujasHomas.tsx`
- [ ] `Splash.tsx`
- [ ] `Onboarding.tsx`
- [ ] `Login.tsx`
- [ ] `OTPVerification.tsx`
- [ ] `TempleList.tsx`
- [ ] `TempleDetail.tsx`
- [ ] `SevaList.tsx`
- [ ] `SevaBooking.tsx`
- [ ] `Payment.tsx`
- [ ] `BookingConfirmation.tsx`
- [ ] `LiveDarshan.tsx`
- [ ] `Prasadam.tsx`
- [ ] `PrasadamTracking.tsx`
- [ ] `MyBookings.tsx`
- [ ] `Profile.tsx`

#### Styles Folder (`BookMyTemple/styles/`)
- [ ] `globals.css`

#### Hooks Folder (`BookMyTemple/hooks/`)
- [ ] `useOnlineStatus.ts`

#### Utils Folder (`BookMyTemple/utils/`)
- [ ] `pwa-utils.ts`

#### Public Folder (`BookMyTemple/public/`)
- [ ] `manifest.json`
- [ ] `service-worker.js`
- [ ] `offline.html`
- [ ] `robots.txt`
- [ ] `sitemap.xml`
- [ ] `browserconfig.xml`

---

## Method 2: Export as ZIP (If Available)

If Figma Make allows exporting the project:

1. Look for an "Export" or "Download" button in Figma Make
2. Export the entire project as a ZIP file
3. Extract the ZIP to your desired location on your laptop
4. Rename the folder to `BookMyTemple` (if needed)

---

## Method 3: Use Git (Advanced)

If you have the code in a Git repository:

```bash
# Clone the repository
git clone <your-repo-url> BookMyTemple
cd BookMyTemple
```

---

## After Copying All Files

### Verify Your Folder Structure

Your `BookMyTemple` folder should look like this:

```
BookMyTemple/
├── index.html
├── App.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── setup.sh
├── setup.bat
├── README_LOCAL.md
├── SETUP_GUIDE.md
│
├── components/
│   ├── BottomNav.tsx
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── ... (all other component files)
│   └── figma/
│       └── ImageWithFallback.tsx
│
├── pages/
│   ├── Home.tsx
│   ├── Classes.tsx
│   ├── PujasHomas.tsx
│   └── ... (all other page files)
│
├── styles/
│   └── globals.css
│
├── hooks/
│   └── useOnlineStatus.ts
│
├── utils/
│   └── pwa-utils.ts
│
└── public/
    ├── manifest.json
    ├── service-worker.js
    ├── offline.html
    └── ... (other public files)
```

---

## Next Steps

Once all files are copied:

### Windows Users:
1. Open Command Prompt or PowerShell
2. Navigate to project folder:
   ```cmd
   cd C:\Users\YourName\Desktop\BookMyTemple
   ```
3. Run setup script:
   ```cmd
   setup.bat
   ```
4. Start development server:
   ```cmd
   npm run dev
   ```

### Mac/Linux Users:
1. Open Terminal
2. Navigate to project folder:
   ```bash
   cd ~/Desktop/BookMyTemple
   ```
3. Make setup script executable:
   ```bash
   chmod +x setup.sh
   ```
4. Run setup script:
   ```bash
   ./setup.sh
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

---

## Alternative: Manual Setup (Without Scripts)

If scripts don't work, run these commands manually:

```bash
# 1. Navigate to project folder
cd path/to/BookMyTemple

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

---

## Verify Installation

After running `npm run dev`, you should see:

```
VITE v5.x.x  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

Open your browser and go to: **http://localhost:5173/**

You should see the BookMyTemple app running! 🎉

---

## Troubleshooting

### Problem: Missing Files

**Solution:** Double-check the checklist above and ensure all files are copied

### Problem: Permission Denied (Mac/Linux)

**Solution:** 
```bash
chmod +x setup.sh
sudo npm install
```

### Problem: Node.js Not Found

**Solution:** Install Node.js from https://nodejs.org/ and restart your terminal

### Problem: Port Already in Use

**Solution:**
```bash
npm run dev -- --port 3000
```

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Stop dev server
Press Ctrl+C (or Cmd+C on Mac)
```

---

## Need Help?

- Check `README_LOCAL.md` for detailed documentation
- Check `SETUP_GUIDE.md` for step-by-step instructions
- Verify Node.js version: `node --version` (should be 18+)
- Clear cache: `npm cache clean --force`

---

**Once everything is set up, you're ready to develop! 🚀**
