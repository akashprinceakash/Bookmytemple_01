# 🎯 Quick Start - Visual Step-by-Step Guide

## Overview: 3 Simple Steps to Run Locally

```
Step 1: Copy Files → Step 2: Install → Step 3: Run
     5 mins              2-3 mins          Instant!
```

---

## 📥 STEP 1: Copy All Files to Your Laptop

### Option A: From Figma Make Interface

1. **Create a new folder on your laptop:**
   - Windows: `C:\Users\YourName\Desktop\BookMyTemple`
   - Mac: `~/Desktop/BookMyTemple`

2. **In Figma Make, select all files and download them**
   - Use the file browser/tree on the left
   - Download each file or folder
   - Save to your `BookMyTemple` folder

3. **Maintain the folder structure** - Keep components in `components/`, pages in `pages/`, etc.

### Option B: Copy-Paste Method

For each file in Figma Make:
1. Click on the file
2. Select all content (Ctrl+A or Cmd+A)
3. Copy (Ctrl+C or Cmd+C)
4. Create the same file on your laptop
5. Paste (Ctrl+V or Cmd+V)
6. Save

---

## 💾 STEP 2: Install Dependencies

### On Windows:

1. **Open Command Prompt or PowerShell:**
   - Press `Win + R`
   - Type `cmd` and press Enter

2. **Navigate to your project:**
   ```cmd
   cd C:\Users\YourName\Desktop\BookMyTemple
   ```

3. **Run the setup:**
   ```cmd
   setup.bat
   ```
   
   **OR manually:**
   ```cmd
   npm install
   ```

### On Mac/Linux:

1. **Open Terminal:**
   - Press `Cmd + Space`
   - Type "Terminal" and press Enter

2. **Navigate to your project:**
   ```bash
   cd ~/Desktop/BookMyTemple
   ```

3. **Run the setup:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   
   **OR manually:**
   ```bash
   npm install
   ```

---

## 🚀 STEP 3: Start the App

In the same terminal/command prompt:

```bash
npm run dev
```

**You'll see:**
```
VITE v5.1.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Open your browser:** Go to `http://localhost:5173/`

🎉 **Your app is now running!**

---

## 🖼️ Visual Checklist

### Before Starting

```
✅ Node.js installed (v18+)
✅ All files copied to BookMyTemple folder
✅ Folder structure matches the guide
✅ Terminal/Command Prompt open
```

### During Installation

```
⏳ Running npm install...
   - Downloading dependencies
   - Setting up packages
   - Building node_modules
   
✅ Installation complete!
```

### Running the App

```
⚡ Development server starting...
✅ Vite dev server running
🌐 Open http://localhost:5173/
👀 App loads in browser
```

---

## 🎨 What You Should See

### 1. Splash Screen
First you'll see the BookMyTemple splash screen

### 2. Onboarding Screens
Two onboarding slides introducing the app

### 3. Login Screen
Phone number and OTP verification

### 4. Home Screen
Main dashboard with:
- Search bar
- Quick action buttons (Book Seva, Classes, Pujas & Homas, Book Pandit)
- Featured temples
- Upcoming festivals
- Gallery with temple photos

---

## 🔧 Common Issues & Quick Fixes

### Issue 1: "node is not recognized"

**Problem:** Node.js not installed or not in PATH

**Fix:**
1. Download Node.js from https://nodejs.org/
2. Install it
3. Restart your terminal
4. Try again

**Verify:**
```bash
node --version
npm --version
```

---

### Issue 2: "Cannot find package.json"

**Problem:** You're in the wrong folder

**Fix:**
```bash
# Check where you are
pwd          # Mac/Linux
cd           # Windows

# Navigate to correct folder
cd path/to/BookMyTemple
```

---

### Issue 3: "Port 5173 is already in use"

**Problem:** Another app is using port 5173

**Fix:**
```bash
# Use a different port
npm run dev -- --port 3000

# Or find and kill the process using 5173
```

---

### Issue 4: Dependencies installation fails

**Problem:** Network issues or corrupted cache

**Fix:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json   # Mac/Linux
rmdir /s node_modules                   # Windows
del package-lock.json                   # Windows

# Reinstall
npm install
```

---

### Issue 5: Styles not loading

**Problem:** Tailwind not configured properly

**Fix:**
1. Check `styles/globals.css` exists
2. Verify it contains:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Restart dev server

---

## 📱 Test on Mobile

### Same WiFi Network Method

1. **Start with host flag:**
   ```bash
   npm run dev -- --host
   ```

2. **Find your laptop's IP:**
   
   **Windows:**
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)
   
   **Mac/Linux:**
   ```bash
   ifconfig
   ```
   Look for "inet" under your WiFi adapter

3. **On your phone:**
   - Open browser
   - Go to: `http://YOUR_IP:5173/`
   - Example: `http://192.168.1.100:5173/`

---

## 🏁 Success Indicators

You know it's working when you see:

✅ Terminal shows "ready" with a local URL
✅ Browser opens to localhost:5173
✅ No error messages in browser console (F12)
✅ You can see the splash screen
✅ You can navigate through the app
✅ Images load properly
✅ Buttons and interactions work

---

## 📊 Performance Expectations

On a typical laptop:

- **Installation:** 2-5 minutes
- **Startup:** 1-3 seconds
- **Hot Reload:** Instant (< 100ms)
- **Page Load:** < 1 second

---

## 🎓 Learning Resources

### Understanding the Tech Stack

- **React:** UI library - [React Docs](https://react.dev)
- **TypeScript:** Type safety - [TS Docs](https://www.typescriptlang.org/docs/)
- **Vite:** Build tool - [Vite Guide](https://vitejs.dev/guide/)
- **Tailwind:** CSS framework - [Tailwind Docs](https://tailwindcss.com/docs)

### Development Tips

1. **Save files to see changes instantly** (Hot Module Replacement)
2. **Use browser DevTools** (F12) to inspect and debug
3. **Check console for errors** - helps with troubleshooting
4. **Test responsive design** - Use DevTools device mode (Ctrl+Shift+M)

---

## 🎯 Next Steps After Setup

Once running successfully:

1. **Explore the App:**
   - Click through all pages
   - Test all features
   - Check responsive design

2. **Make Changes:**
   - Edit `pages/Home.tsx` to see live updates
   - Change colors in `styles/globals.css`
   - Add new features

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Deploy Online:**
   - Use Vercel, Netlify, or other hosting
   - See DEPLOYMENT.md for instructions

---

## 💡 Pro Tips

1. **Keep Terminal Open:** Don't close it while developing
2. **Save Often:** Changes auto-reload when you save
3. **Check Console:** Open browser console (F12) to catch errors early
4. **Use Extensions:** Install React DevTools for better debugging
5. **Git Version Control:** Use git to track your changes

---

## 🆘 Need Help?

**Check These Files:**
- `README_LOCAL.md` - Comprehensive documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `FILE_COPY_GUIDE.md` - File organization help

**Verify Installation:**
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
npm list react    # Should show react@18.2.0
```

**Start Fresh:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## ✨ You're All Set!

Your development environment is ready. Start building amazing features for BookMyTemple! 🚀

**Remember:** The app auto-reloads when you save changes. Just edit, save, and see results instantly!

Happy Coding! 🎉
