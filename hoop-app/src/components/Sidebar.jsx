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
const HoopLogo = () => (
  <img src="data:image/png;base64,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" width="48" height="48" style={{borderRadius:"14px",display:"block"}} alt="Packer" />
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
      <HoopLogo />
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
