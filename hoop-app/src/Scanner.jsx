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
  <img src="data:image/png;base64,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" width="42" height="42" style={{borderRadius:"12px",display:"block"}} alt="Packer" />
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
