import React, { useState, useEffect } from 'react';

// Import Internal
import { makeColors, NAVY, FONT, RADIUS, TYPE } from './theme';
import Sidebar, { SIDEBAR_WIDTH } from './components/Sidebar';
import BottomNav       from './components/BottomNav';
import ScannerCamera   from './components/ScannerCamera';
import ProductList     from './components/ProductList';
import ProfilePage     from './components/ProfilePage';
import AdminDashboard  from './AdminDashboard';

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
  const [page, setPage]         = useState('scan');
  const [isDesktop, setDesktop] = useState(window.innerWidth >= 768);

  const colors = makeColors(theme);

  useEffect(() => {
    const handleResize = () => setDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const contentPad = () => {
    if (page === 'dashboard') return '0';
    if (isDesktop) return '28px 36px';
    return '16px 16px 80px';
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: colors.bgGrad || colors.bg, color: colors.text, fontFamily: FONT }}>
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
        {page !== 'dashboard' && (
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
          {page === 'scan' && (
            <ScannerCamera user={user} active={page === 'scan'} colors={colors} isDesktop={isDesktop} />
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
          <BottomNav page={page} colors={colors} onNavigate={navigate} />
        )}
      </main>
    </div>
  );
};

// ── Sub-Component: TopBar ──────────────────────────────────────────────────────
const TopBar = ({ isDesktop, user, theme, colors, onToggleTheme, MoonIcon, SunIcon }) => (
  <header style={{
    height: '60px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: isDesktop ? '0 36px' : '0 16px',
    background: 'rgba(9, 18, 30, 0.75)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    position: 'sticky', top: 0, zIndex: 100,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: RADIUS.sm,
        background: 'linear-gradient(135deg, #1E3A5F 0%, #3B82C4 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <span style={{ fontSize: TYPE.md, fontWeight: '800', color: '#fff', letterSpacing: '-0.3px' }}>HoopV3</span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {isDesktop && (
        <span style={{ fontSize: TYPE.sm, fontWeight: '500', color: colors.text }}>{user?.name}</span>
      )}
      <button
        onClick={onToggleTheme}
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(91,155,213,0.2)', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>
    </div>
  </header>
);

const GlobalStyles = ({ colors }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
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
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
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
