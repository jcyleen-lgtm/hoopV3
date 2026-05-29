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
  <img src="data:image/png;base64,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" width="42" height="42" style={{borderRadius:"13px",display:"block"}} alt="Packer" />
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
