# Packer — Warehouse Intelligence App

Aplikasi warehouse scanning berbasis web (PWA) untuk tracking paket, monitoring staff, dan dashboard operasional real-time.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Inline styles (CSS-in-JS) |
| Backend | Google Apps Script |
| Database | Google Sheets |
| Deploy | Cloudflare Pages |
| Scanner | html5-qrcode |

---

## Project Structure

```
hoop-app/
├── index.html
├── package.json
├── vite.config.js          ← Code splitting (chunks < 600KB)
├── public/
│   ├── manifest.json       ← PWA manifest (nama: Packer)
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── logo-128.png        ← Logo inline (sharp, no blur)
│   └── logo-96.png
└── src/
    ├── main.jsx
    ├── App.jsx             ← Auth owner + SplashScreen trigger
    ├── Scanner.jsx         ← Main shell, receives user sebagai prop
    ├── AdminDashboard.jsx
    ├── theme.js            ← makeColors(theme) — dark/light tokens
    ├── api.js              ← callScript() + fetchWithRetry (2x, 5s timeout)
    ├── offlineQueue.js     ← Offline scan queue
    ├── components/
    │   ├── SplashScreen.jsx   ← Splash screen 2-3 detik (soft pop animation)
    │   ├── LoginPage.jsx
    │   ├── HomePage.jsx       ← KPI cards, staff ranking, live activity feed
    │   ├── BottomNav.jsx      ← Mobile nav (memo, no blur dark mode)
    │   ├── Sidebar.jsx        ← Desktop nav
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

## Fitur

- **Splash Screen** — Logo + animasi soft pop 2-3 detik sebelum login
- **Scanner Barcode** — Kamera real-time, auto-retry, offline queue
- **Homepage Dashboard** — KPI cards, staff performance ranking, live activity feed, tombol refresh manual
- **Admin Dashboard** — Rekapan harian/mingguan, filter by date/staff, chart
- **Dark / Light Mode** — Toggle di sidebar & profile
- **PWA** — Installable di Android/iOS, offline-capable
- **Polling otomatis** — Data refresh tiap 60 detik di homepage

---

## Performance Fixes

| Issue | Fix |
|---|---|
| Bundle 950KB | Code splitting via `vite.config.js` — react, recharts, scanner di-chunk terpisah |
| Tap delay 300ms | `touch-action: manipulation` global di semua button |
| Re-render berlebihan | `React.memo` di semua leaf components |
| Sub-komponen di dalam parent | Dipindah ke luar — cegah unmount/remount tiap polling |
| `makeColors` tiap render | `useMemo(() => makeColors(theme), [theme])` |
| Resize listener spam | Debounce 100ms |
| Logo blur | Pakai `/logo-128.png` dari public, bukan base64 inline |
| Blur GPU overhead | Dark mode BottomNav: solid bg, no `backdropFilter` |
| Scroll lag mobile | `passive: true` pada event listener |

---

## Environment

Buat file `.env` di root `hoop-app/`:

```env
VITE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## Deploy — Cloudflare Pages

1. Push repo ke GitHub
2. Cloudflare Pages → Connect to Git → pilih repo
3. **Build command:** `npm run build`
4. **Build output directory:** `dist`
5. **Root directory:** `hoop-app`
6. Environment variable: `VITE_SCRIPT_URL` = URL GAS
7. Deploy — auto-deploy setiap `git push`

```bash
# Deploy manual
git add . && git commit -m "..." && git push
```

---

## Concurrent Usage

| Layer | Kapasitas |
|---|---|
| Cloudflare CDN | ✅ Unlimited (static files) |
| Google Apps Script | ⚠️ ~30 concurrent requests max |
| Google Sheets | ⚠️ Rawan write conflict jika 10+ user scan bersamaan di detik yang sama |

**Rekomendasi:** Untuk tim > 15 orang aktif scan bersamaan, pertimbangkan migrasi backend ke Supabase (PostgreSQL) untuk menghindari write conflict.

---

## Known Limitations

- GAS execution timeout: 6 menit per request
- Tidak ada real-time WebSocket — polling based (60 detik)
- Google Sheets tidak support concurrent write locking

---

## Changelog

| Versi | Perubahan |
|---|---|
| v3.0 | Rebranding Hoop → Packer, logo baru, splash screen |
| v3.0 | Performance: memo, useMemo, debounce, touch-action, code splitting |
| v3.0 | Homepage: refresh button, layout greeting baru (avatar top-right, refresh + LIVE bottom row) |
| v3.0 | Dark mode: hapus backdropFilter blur di BottomNav |
| v3.0 | Logo: ganti inline base64 → public path `/logo-128.png` |
