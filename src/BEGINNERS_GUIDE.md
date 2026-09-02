# 🎬 Complete Beginner's Guide - Like Watching a Tutorial

## Introduction

Hi! This guide will walk you through setting up BookMyTemple on your laptop **step-by-step**, as if I'm sitting next to you. No technical knowledge required!

---

## 🎯 What We'll Do Today

1. Install the tools you need
2. Copy the code to your laptop
3. Run the app locally
4. See it working in your browser!

**Total Time:** About 15-20 minutes

---

## Part 1: Installing Node.js (5 minutes)

### What is Node.js?
It's a free program that lets you run JavaScript code on your computer. We need it to run the app.

### Step-by-Step:

**1. Open your web browser** (Chrome, Firefox, Safari, etc.)

**2. Go to:** https://nodejs.org/

**3. You'll see two big green buttons:**
   - One says "LTS" (Recommended)
   - One says "Current"
   
   **Click the "LTS" button** (left one)

**4. The download will start** (around 50-100 MB)

**5. Once downloaded:**
   - **Windows:** Double-click the `.msi` file
   - **Mac:** Double-click the `.pkg` file
   - **Linux:** Follow your distro's package manager

**6. Installation wizard will open:**
   - Click "Next"
   - Accept the license agreement
   - Click "Next" for default settings
   - Click "Install"
   - Enter your password if asked
   - Wait for installation (2-3 minutes)
   - Click "Finish"

**7. Verify it worked:**
   
   **Windows:**
   - Press `Win + R`
   - Type `cmd` and press Enter
   - Type: `node --version` and press Enter
   - You should see: `v18.x.x` or higher ✅
   
   **Mac:**
   - Press `Cmd + Space`
   - Type "Terminal" and press Enter
   - Type: `node --version` and press Enter
   - You should see: `v18.x.x` or higher ✅

**Great! Node.js is installed! 🎉**

---

## Part 2: Creating Your Project Folder (2 minutes)

### Step-by-Step:

**Windows Users:**

1. **Open File Explorer**
   - Press `Win + E`

2. **Go to your Desktop**
   - Click "Desktop" in the left sidebar

3. **Create a new folder**
   - Right-click in empty space
   - Select "New" → "Folder"
   - Name it: `BookMyTemple`
   - Press Enter

**Mac Users:**

1. **Open Finder**
   - Click the Finder icon in Dock

2. **Go to Desktop**
   - Click "Desktop" in the left sidebar

3. **Create a new folder**
   - Right-click in empty space
   - Select "New Folder"
   - Name it: `BookMyTemple`
   - Press Enter

**Perfect! You have a folder ready! 📁**

---

## Part 3: Getting the Code Files (5 minutes)

Now we need to copy all the code files from Figma Make to your new folder.

### Method 1: Download from Figma Make (Easiest)

If Figma Make has an export/download feature:

1. **In Figma Make interface:**
   - Look for "Export" or "Download" button
   - Click it
   - Select "Download as ZIP" or similar
   - Save the ZIP file

2. **Extract the ZIP:**
   - Find the downloaded ZIP file
   - Right-click it
   - Select "Extract All" (Windows) or double-click (Mac)
   - Extract to your Desktop

3. **Copy contents:**
   - Open the extracted folder
   - Select all files inside (Ctrl+A or Cmd+A)
   - Copy them (Ctrl+C or Cmd+C)
   - Open your `BookMyTemple` folder
   - Paste (Ctrl+V or Cmd+V)

### Method 2: Manual Copy (File by File)

If you need to copy files manually:

**For each file in Figma Make:**

1. Click on the file in Figma Make
2. You'll see the code
3. Press `Ctrl+A` (or `Cmd+A` on Mac) to select all
4. Press `Ctrl+C` (or `Cmd+C`) to copy
5. Open a text editor (Notepad on Windows, TextEdit on Mac)
6. Paste the code
7. Save with the exact same name and location:
   - Example: Save `App.tsx` in `BookMyTemple/App.tsx`
   - Example: Save `Home.tsx` in `BookMyTemple/pages/Home.tsx`

**Important Files to Copy** (see FILE_COPY_GUIDE.md for complete list)

**Awesome! Your code is ready! 📝**

---

## Part 4: Installing Dependencies (3 minutes)

Dependencies are like the building blocks our app needs to work.

### Step-by-Step:

**Windows Users:**

1. **Open Command Prompt:**
   - Press `Win + R`
   - Type: `cmd`
   - Press Enter
   - A black window opens

2. **Navigate to your folder:**
   - Type: `cd Desktop\BookMyTemple`
   - Press Enter
   - You should see: `C:\Users\YourName\Desktop\BookMyTemple>`

3. **Install dependencies:**
   - Type: `npm install`
   - Press Enter
   - Wait 2-3 minutes (you'll see lots of text scrolling)
   - When done, you'll see: "added 250 packages" (or similar)

**Mac/Linux Users:**

1. **Open Terminal:**
   - Press `Cmd + Space`
   - Type: "Terminal"
   - Press Enter

2. **Navigate to your folder:**
   - Type: `cd Desktop/BookMyTemple`
   - Press Enter

3. **Install dependencies:**
   - Type: `npm install`
   - Press Enter
   - Wait 2-3 minutes
   - When done, you'll see: "added 250 packages"

**Excellent! Everything is installed! ⚙️**

---

## Part 5: Running the App! (1 minute)

This is the exciting part!

### Step-by-Step:

**In the same terminal/command prompt window:**

1. **Type:** `npm run dev`
2. **Press Enter**
3. **Wait a few seconds**

**You'll see something like:**
```
VITE v5.1.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**4. Open your web browser**

**5. In the address bar, type:** `http://localhost:5173/`

**6. Press Enter**

**🎉 YOUR APP IS RUNNING! 🎉**

You should see the BookMyTemple splash screen!

---

## Part 6: Exploring Your Running App

### What You'll See:

**1. Splash Screen** (loads first)
   - BookMyTemple logo
   - Automatically moves to next screen

**2. Onboarding Screens**
   - Swipe or click "Next"
   - Shows app features
   - Click "Get Started"

**3. Login Screen**
   - Phone number input
   - For now, you can enter any 10-digit number
   - Click continue

**4. OTP Screen**
   - Enter any 6 digits
   - Click verify

**5. Home Screen** - This is the main page!
   - Search bar at top
   - Four colorful buttons:
     * Book Seva
     * Special Darshan
     * Book Classes
     * Book Special Pujas & Homas
     * Book Pandit (Coming Soon)
   - Featured temples below
   - Beautiful gallery at the bottom

**Try clicking around!** Everything is interactive.

---

## Part 7: Making Your First Change

Let's change something and see it update instantly!

### Edit the Home Page:

**1. Open your project folder** (`BookMyTemple`)

**2. Navigate to:** `pages/Home.tsx`

**3. Open it with:**
   - VS Code (if installed)
   - Notepad (Windows)
   - TextEdit (Mac)
   - Any text editor

**4. Find this line** (around line 169):
```typescript
<h3 className="text-white mb-2">Maha Shivaratri</h3>
```

**5. Change it to:**
```typescript
<h3 className="text-white mb-2">My Awesome Festival</h3>
```

**6. Save the file** (Ctrl+S or Cmd+S)

**7. Look at your browser** - It updated automatically! 🎊

The festival name changed without refreshing!

---

## Part 8: Stopping the App

When you're done working:

**In the terminal/command prompt:**
- Press `Ctrl + C`
- Confirm if asked (type `Y` and Enter)
- The server stops

**Your files are safe!** Nothing is deleted.

**To start again later:**
- Open terminal/command prompt
- Navigate to folder: `cd Desktop/BookMyTemple`
- Run: `npm run dev`

---

## 🎓 Congratulations! You Did It!

You now have:
- ✅ Node.js installed
- ✅ Project set up
- ✅ App running locally
- ✅ Made your first edit!

---

## 🚀 What's Next?

### Learn More:
1. Explore all the pages in the app
2. Try editing different files
3. Change colors, text, images
4. Add new features

### Helpful Files:
- `README_LOCAL.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup help
- `QUICK_START_VISUAL.md` - Visual guide

### Common Tasks:

**Start the app:**
```bash
npm run dev
```

**Stop the app:**
```
Ctrl + C
```

**Build for production:**
```bash
npm run build
```

---

## 🆘 Help! Something Went Wrong

### "Command not found" or "npm is not recognized"

**Problem:** Node.js isn't installed properly

**Fix:**
1. Close terminal/command prompt
2. Re-install Node.js from nodejs.org
3. Restart your computer
4. Try again

---

### "Port 5173 is already in use"

**Problem:** The port is busy

**Fix:**
```bash
npm run dev -- --port 3000
```
Then open: `http://localhost:3000/`

---

### "Cannot find module"

**Problem:** Dependencies not installed

**Fix:**
```bash
npm install
```

---

### Nothing happens when I save

**Problem:** Dev server might have stopped

**Fix:**
1. Check terminal - is it still running?
2. If not, run `npm run dev` again
3. Refresh your browser

---

### Page is blank or broken

**Problem:** JavaScript error

**Fix:**
1. Press F12 in your browser
2. Check the "Console" tab
3. Look for red error messages
4. Most common: file path is wrong or typo in code

---

## 💡 Pro Tips for Beginners

1. **Keep the terminal window open** while working
2. **Save your files often** - changes show immediately
3. **Don't edit files in `node_modules/`** - these are auto-generated
4. **Use Ctrl+Z** (Undo) if you break something
5. **Make backups** of files before big changes

---

## 🎉 You're Now a Developer!

You've successfully:
- Set up a development environment
- Run a React application
- Made code changes
- Seen them update in real-time

**That's amazing!** Keep exploring and learning!

---

## 📚 Resources for Learning

- **React:** https://react.dev/learn
- **TypeScript:** https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**Happy Coding! You've got this! 🚀✨**
