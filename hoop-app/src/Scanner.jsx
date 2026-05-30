import React, { useState, useEffect, useRef, useMemo } from 'react';

// Import Internal
import { makeColors, NAVY, FONT, RADIUS, TYPE } from './theme';
import Sidebar, { SIDEBAR_WIDTH } from './components/Sidebar';
import BottomNav       from './components/BottomNav';
import ScannerCamera   from './components/ScannerCamera';
import ProductList     from './components/ProductList';
import ProfilePage     from './components/ProfilePage';
import AdminDashboard  from './AdminDashboard';
import HomePage        from './components/HomePage';

// Inline SVG icons (no lucide-react)
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

// Props: user, onLogout, theme, toggleTheme — all from App.jsx
const Scanner = ({ user, onLogout, theme, toggleTheme }) => {
  const [page, setPage]         = useState('home');
  const [transitioning, setTransitioning] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth >= 768);

  // FIX: Gunakan ref untuk target navigasi supaya tidak ada race condition
  const pendingNav = useRef(null);
  // FIX: Debounce ref untuk resize
  const resizeTimer = useRef(null);

  // FIX: useMemo — colors hanya dibuat ulang saat theme berubah, bukan tiap render
  const colors = useMemo(() => makeColors(theme), [theme]);

  useEffect(() => {
    // FIX: Debounce resize listener — cegah setState puluhan kali saat rotate/resize
    const handleResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        setDesktop(window.innerWidth >= 768);
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer.current);
    };
  }, []);

  const navigate = (p) => {
    // FIX: Guard double-click dan navigasi saat sedang transitioning
    if (p === page || transitioning) return;

    if (page === 'scan') {
      // Dari scan: stop kamera dulu, baru pindah halaman
      pendingNav.current = p;
      setTransitioning(true);

      try {
        const videos = document.querySelectorAll('video');
        videos.forEach(v => {
          if (v.srcObject) {
            v.srcObject.getTracks().forEach(t => t.stop());
            v.srcObject = null;
          }
        });
        // Hapus reader element
        const reader = document.getElementById('reader');
        if (reader) reader.innerHTML = '';
      } catch (_) {}

      // FIX: Delay 500ms — kasih waktu kamera release di iOS & HP budget
      setTimeout(() => {
        const target = pendingNav.current;
        pendingNav.current = null;
        setPage(target);
        setTransitioning(false);
        window.scrollTo(0, 0);
      }, 500);
    } else {
      setPage(p);
      window.scrollTo(0, 0);
    }
  };

  const contentPad = () => {
    if (page === 'dashboard' || page === 'home') return '0';
    if (isDesktop) return '28px 36px';
    return '16px 16px 80px';
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: colors.bgGrad || colors.bg, color: colors.text, fontFamily: FONT, paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <GlobalStyles colors={colors} />

      {/* Sidebar - Desktop Only */}
      {isDesktop && (
        <Sidebar
          user={user}
          page={page}
          theme={theme}
          onNavigate={navigate}
          onToggleTheme={toggleTheme}
          onLogout={onLogout}
        />
      )}

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        marginLeft: isDesktop ? SIDEBAR_WIDTH : 0,
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left .25s ease',
      }}>
        {/* TopBar (hidden on dashboard — it has its own header) */}
        {page !== 'dashboard' && page !== 'home' && (
          <TopBar
            isDesktop={isDesktop}
            user={user}
            theme={theme}
            colors={colors}
            onToggleTheme={toggleTheme}
            MoonIcon={MoonIcon}
            SunIcon={SunIcon}
          />
        )}

        {/* Dynamic Page Content */}
        <div style={{ flex: 1, padding: contentPad() }}>
          {page === 'home' && (
            <HomePage user={user} isDesktop={isDesktop} onNavigate={navigate} theme={theme} />
          )}
          {/* FIX: Render ScannerCamera hanya kalau tidak sedang transitioning */}
          {page === 'scan' && !transitioning && (
            <ScannerCamera user={user} active={page === 'scan'} colors={colors} isDesktop={isDesktop} theme={theme} />
          )}
          {/* FIX: Tampilkan loading indicator saat keluar dari scanner */}
          {page === 'scan' && transitioning && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', flexDirection:'column', gap:'16px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.accent || '#3B82C4'} strokeWidth="2" strokeLinecap="round"
                style={{ animation:'spin 0.8s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <span style={{ fontSize:'13px', color: colors.textMuted || 'rgba(255,255,255,0.4)' }}>Melepas kamera...</span>
            </div>
          )}
          {page === 'produk' && (
            <ProductList colors={colors} isDesktop={isDesktop} />
          )}
          {page === 'dashboard' && (
            <AdminDashboard colors={colors} user={user} isDesktop={isDesktop} theme={theme} />
          )}
          {page === 'profile' && (
            <ProfilePage
              user={user}
              theme={theme}
              colors={colors}
              onToggleTheme={toggleTheme}
              onLogout={onLogout}
            />
          )}
        </div>

        {/* Bottom Navigation - Mobile Only */}
        {!isDesktop && (
          <BottomNav page={page} colors={colors} onNavigate={navigate} theme={theme} />
        )}
      </main>
    </div>
  );
};

// ── Packer Logo ─────────────────────────────────────────────────────────────────
const PackerLogo = () => (
  <img src="data:image/png;base64,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" width="44" height="44" style={{borderRadius:"13px",display:"block"}} alt="Packer" />
);

// ── Sub-Component: TopBar ──────────────────────────────────────────────────────
const TopBar = ({ isDesktop, user, theme, colors, onToggleTheme, MoonIcon, SunIcon }) => (
  <header style={{
    height: '64px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: isDesktop ? '0 36px' : '0 16px',
    background: theme === 'light' ? 'rgba(238,243,252,0.85)' : 'rgba(4,8,20,0.88)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: theme === 'light' ? '1px solid rgba(255,255,255,0.75)' : '1px solid rgba(59,130,196,0.1)',
    boxShadow: theme === 'light'
      ? 'inset 0 -1px 0 rgba(255,255,255,0.5), 0 4px 20px rgba(100,140,220,0.06)'
      : '0 4px 24px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(59,130,196,0.06)',
    position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '11px',
        background: 'linear-gradient(135deg, #0A1929 0%, #1A3A5C 50%, #3B82C4 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 14px rgba(59,130,196,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
        border: '1px solid rgba(96,165,250,0.2)',
      }}>
        <PackerLogo />
      </div>
      <span style={{ fontSize: TYPE.md, fontWeight: '700', color: theme === 'light' ? '#0D1F40' : '#fff', letterSpacing: '0.12em', fontFamily: "'Inter', system-ui, sans-serif" }}>Packer</span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {isDesktop && (
        <span style={{ fontSize: TYPE.sm, fontWeight: '600', color: colors.text }}>{user?.name}</span>
      )}
      <button
        onClick={onToggleTheme}
        style={{
          background: theme === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
          border: theme === 'light' ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(96,165,250,0.15)',
          borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer',
          color: theme === 'light' ? 'rgba(30,60,120,0.7)' : 'rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: theme === 'light' ? 'inset 0 1px 0 rgba(255,255,255,0.9)' : '0 0 10px rgba(59,130,196,0.1)',
        }}
      >
        {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
      </button>
    </div>
  </header>
);

const GlobalStyles = ({ colors }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      height: 100%;
      overflow: hidden;
    }
    #root {
      height: 100%;
    }
    body {
      background: ${colors.bgGrad || colors.bg};
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      letter-spacing: 0.02em;
    }
    /* FIX: Hapus delay tap 300ms di semua button & link */
    button, a, [role="button"] {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    @keyframes hpBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
    #reader video { border-radius: 14px !important; object-fit: cover; }
    #reader { border-radius: 14px !important; overflow: hidden !important; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    #reader video { border-radius: 12px !important; }
    #reader { overflow: hidden !important; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
  `}</style>
);

export default Scanner;
