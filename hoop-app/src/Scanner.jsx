import React, { useState, useEffect } from 'react';

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
// Scanner no longer manages its own auth state.
const Scanner = ({ user, onLogout, theme, toggleTheme }) => {
  const [page, setPage]         = useState('home');
  const [prevPage, setPrevPage] = useState('home');
  const [transitioning, setTransitioning] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth >= 768);

  const colors = makeColors(theme);

  useEffect(() => {
    const handleResize = () => setDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = (p) => {
    if (p === page) return;
    
    if (page === 'scan') {
      // Dari scan: stop kamera dulu, baru pindah halaman
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
      
      // Delay 200ms supaya iOS sempat release kamera sebelum render halaman baru
      setTimeout(() => {
        setPage(p);
        setTransitioning(false);
        window.scrollTo(0, 0);
      }, 200);
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
          {page === 'scan' && !transitioning && (
            <ScannerCamera user={user} active={page === 'scan'} colors={colors} isDesktop={isDesktop} theme={theme} />
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

// ── Hoop Logo (same as sidebar) ────────────────────────────────────────────────
const HoopLogoSVG = () => (
  <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="8" width="6" height="20" rx="3" fill="white" opacity="0.9"/>
    <rect x="15" y="8" width="6" height="20" rx="3" fill="white" opacity="0.9"/>
    <rect x="26" y="8" width="6" height="20" rx="3" fill="white" opacity="0.9"/>
    <rect x="4" y="16" width="28" height="5" rx="2.5" fill="white" opacity="0.5"/>
    <circle cx="18" cy="18.5" r="3.5" fill="#60A5FA" opacity="0.95"/>
  </svg>
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
        <HoopLogoSVG />
      </div>
      <span style={{ fontSize: TYPE.md, fontWeight: '700', color: theme === 'light' ? '#0D1F40' : '#fff', letterSpacing: '0.12em', fontFamily: "'Inter', system-ui, sans-serif" }}>Hoop</span>
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
