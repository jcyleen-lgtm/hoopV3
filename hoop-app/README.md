# Hoop V3 — Bug Fix Summary & Deploy Guide

## Root Cause: Blank Screen After Login

The blank screen after login was caused by **conflicting auth state** between `App.jsx` and `Scanner.jsx`.

### What was happening:
1. `App.jsx` managed `user` state and rendered `<Scanner>` when logged in ✓
2. But `Scanner.jsx` *also* managed its own `user` state from `localStorage` — **independently**
3. Scanner also had its own `page` state initialized to `'login'` when `user` was null
4. Scanner had an internal login gate: `if (!user || page === 'login') return <LoginPage />`
5. So even after App set the user and mounted Scanner, Scanner's internal `page` was still `'login'`, showing LoginPage inside Scanner

**Fix:** `Scanner.jsx` now receives `user` and `onLogout` purely as props from `App.jsx`. No internal auth state, no login gate, no duplicate `LoginPage` import inside Scanner.

---

## All Bugs Fixed

| File | Bug | Fix |
|------|-----|-----|
| `Scanner.jsx` | Managed own auth state, had internal login gate | Removed — receives `user`/`onLogout` as props |
| `Scanner.jsx` | Imported `Moon`/`Sun` from lucide-react | Replaced with inline SVGs |
| `App.jsx` | Passed `handleLogout` as `setUser` prop (misleading) | Renamed to `onLogout` |
| `AdminDashboard.jsx` | Imported lucide icons (`RefreshCw`, `AlertCircle`, `Package`, `Users`, `Trophy`) | Replaced with inline SVGs |
| `AdminDashboard.jsx` | Never passed `dateInpStyle`/`navyBtnStyle` to FilterBar | Now computed and passed |
| `KpiCard.jsx` | Accepted lucide icon component as prop — caused hook crash | Changed to icon name string (`"package"`, `"users"`, `"trophy"`) with built-in inline SVGs |
| `BottomNav.jsx` | Imported 4 lucide icons | Replaced with inline SVGs |
| `Sidebar.jsx` | Imported 7 lucide icons | Replaced with inline SVGs |
| `ProfilePage.jsx` | Imported `Moon`, `Sun`, `LogOut` from lucide | Replaced with inline SVGs |
| `FilterBar.jsx` | Imported 6 lucide icons | Replaced with inline SVGs |
| `ScannerCamera.jsx` | Imported 6 lucide icons | Replaced with inline SVGs |
| `ProductList.jsx` | Used `axios` without importing it | Added `import axios from 'axios'` |

---

## Project Structure

```
hoop/
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml          ← SPA redirect rule for Netlify
└── src/
    ├── main.jsx
    ├── App.jsx           ← Auth owner (single source of truth)
    ├── Scanner.jsx       ← Main shell, receives user as prop
    ├── AdminDashboard.jsx
    ├── theme.js
    ├── api.js
    ├── components/
    │   ├── LoginPage.jsx
    │   ├── BottomNav.jsx
    │   ├── Sidebar.jsx
    │   ├── ScannerCamera.jsx
    │   ├── ProductList.jsx
    │   ├── ProfilePage.jsx
    │   ├── KpiCard.jsx
    │   ├── ChartCard.jsx
    │   ├── RankCard.jsx
    │   └── FilterBar.jsx
    └── hooks/
        └── useScanner.js
```

---

## Deploy to Netlify

### Option A — Netlify CLI
```bash
npm install
npm run build
npx netlify deploy --prod --dir=dist
```

### Option B — Netlify Git Integration
1. Push this folder to a GitHub repo
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy — the `netlify.toml` handles SPA routing automatically

### Environment note
The Google Apps Script URL is hardcoded in multiple files. If you need to change it, search for:
```
AKfycbyrk91DSCO3exG4DzaS4BpNdX_sQvQT04o8LowrjnU
```
And replace across: `App.jsx`, `AdminDashboard.jsx`, `ProductList.jsx`, `hooks/useScanner.js`, `api.js`

Consider moving it to a `.env` file:
```env
VITE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
```
Then use `import.meta.env.VITE_SCRIPT_URL` in your files.
