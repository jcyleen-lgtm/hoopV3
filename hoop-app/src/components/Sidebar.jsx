import React from 'react';
import { NAVY, FONT, RADIUS, TYPE } from '../theme';

const SIDEBAR_W = 72;

const HomeIcon      = ({ color, sw }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const CameraIcon    = ({ color, sw }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const BarChartIcon  = ({ color, sw }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const UserIcon      = ({ color, sw }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogOutIcon    = ({ color })     => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const MoonIcon      = ({ color })     => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const SunIcon       = ({ color })     => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;

// Packer logo
const PackerLogo = () => (
  <img src="data:image/png;base64,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" width="52" height="52" style={{borderRadius:"15px",display:"block"}} alt="Packer" />
);

const NAV_ITEMS = [
  { key: 'home',      Icon: HomeIcon,     title: 'Home'        },
  { key: 'scan',      Icon: CameraIcon,   title: 'Scan paket'  },
  { key: 'dashboard', Icon: BarChartIcon, title: 'Dashboard'   },
  { key: 'profile',   Icon: UserIcon,     title: 'Profile'     },
];

const Sidebar = ({ user, page, theme, onNavigate, onToggleTheme, onLogout }) => (
  <aside style={{
    position: 'fixed', top: 0, bottom: 0, left: 0, width: SIDEBAR_W,
    background: 'rgba(4,8,20,0.96)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    zIndex: 1000, fontFamily: FONT,
    borderRight: '1px solid rgba(59,130,196,0.12)',
    paddingBottom: '16px',
    boxShadow: '4px 0 32px rgba(0,0,0,0.4), inset -1px 0 0 rgba(59,130,196,0.08)',
  }}>
    {/* Ambient glow top */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '200px', background: 'radial-gradient(ellipse at 50% -20%, rgba(59,130,196,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

    {/* Logo */}
    <div style={{
      width: '42px', height: '42px', borderRadius: '13px',
      background: 'linear-gradient(135deg, #0A1929 0%, #1A3A5C 50%, #3B82C4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '20px 0 24px', flexShrink: 0,
      boxShadow: '0 0 20px rgba(59,130,196,0.4), 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
      border: '1px solid rgba(59,130,196,0.3)',
    }}>
      <PackerLogo />
    </div>

    <div style={{ width: '36px', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(59,130,196,0.3),transparent)', marginBottom: '12px' }} />

    {/* Nav items */}
    <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, width: '100%', position: 'relative', zIndex: 1 }}>
      {NAV_ITEMS.map(({ key, Icon, title }) => {
        const active = page === key;
        return (
          <div key={key} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            {active && (
              <div style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                width: '3px', height: '24px',
                background: 'linear-gradient(180deg,#60A5FA,#3B82C4)',
                borderRadius: '0 3px 3px 0',
                boxShadow: '0 0 12px rgba(96,165,250,0.9), 0 0 24px rgba(59,130,196,0.5)',
              }} />
            )}
            <button
              onClick={() => onNavigate(key)}
              title={title}
              style={{
                width: '46px', height: '46px', borderRadius: RADIUS.sm,
                background: active
                  ? 'linear-gradient(135deg,rgba(59,130,196,0.2),rgba(96,165,250,0.1))'
                  : 'none',
                border: active
                  ? '1px solid rgba(96,165,250,0.25)'
                  : '1px solid transparent',
                boxShadow: active
                  ? '0 0 20px rgba(59,130,196,0.25), 0 0 40px rgba(59,130,196,0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
                  : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              <Icon
                color={active ? '#60A5FA' : 'rgba(255,255,255,0.3)'}
                sw={active ? 2.2 : 1.8}
              />
              {/* Icon glow when active */}
              {active && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: RADIUS.sm,
                  background: 'radial-gradient(circle at center, rgba(96,165,250,0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
              )}
            </button>
          </div>
        );
      })}
    </nav>

    {/* Bottom actions */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
      <button
        onClick={onToggleTheme}
        title={theme === 'light' ? 'Dark mode' : 'Light mode'}
        style={{
          width: '36px', height: '36px', borderRadius: RADIUS.sm,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s',
        }}
      >
        {theme === 'light'
          ? <MoonIcon color="rgba(255,255,255,0.45)" />
          : <SunIcon  color="rgba(255,255,255,0.45)" />}
      </button>

      <div
        title={`${user?.name} · ${user?.role}`}
        style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#1A3A5C,#3B82C4)',
          border: '1.5px solid rgba(96,165,250,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: TYPE.xs, fontWeight: '700', color: '#fff',
          boxShadow: '0 0 12px rgba(59,130,196,0.35)',
        }}
      >
        {(user?.name || 'U').slice(0, 2).toUpperCase()}
      </div>

      <button
        onClick={onLogout}
        title="Sign out"
        style={{
          width: '36px', height: '36px', borderRadius: RADIUS.sm,
          border: '1px solid rgba(239,68,68,0.2)',
          background: 'rgba(239,68,68,0.04)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s',
        }}
      >
        <LogOutIcon color="rgba(252,165,165,0.75)" />
      </button>
    </div>
  </aside>
);

export const SIDEBAR_WIDTH = SIDEBAR_W;
export default Sidebar;
