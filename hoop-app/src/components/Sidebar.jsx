import React from 'react';
import { NAVY, FONT, RADIUS, TYPE } from '../theme';

const SIDEBAR_W = 72;

// Inline SVG icons
const CameraIcon    = ({ color, sw }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const PackageIcon   = ({ color, sw }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const BarChartIcon  = ({ color, sw }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const UserIcon      = ({ color, sw }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogOutIcon    = ({ color })     => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const MoonIcon      = ({ color })     => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const SunIcon       = ({ color })     => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;

const NAV_ITEMS = [
  { key: 'scan',      Icon: CameraIcon,   title: 'Scan paket'  },
  { key: 'produk',    Icon: PackageIcon,  title: 'List produk' },
  { key: 'dashboard', Icon: BarChartIcon, title: 'Dashboard'   },
  { key: 'profile',   Icon: UserIcon,     title: 'Profile'     },
];

const Sidebar = ({ user, page, theme, onNavigate, onToggleTheme, onLogout }) => (
  <aside style={{
    position: 'fixed', top: 0, bottom: 0, left: 0, width: SIDEBAR_W,
    backgroundColor: NAVY[900],
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    zIndex: 1000, fontFamily: FONT,
    borderRight: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '16px',
  }}>
    {/* Logo */}
    <div style={{
      width: '40px', height: '40px', borderRadius: '11px',
      background: NAVY[800],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '20px 0 24px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', flexShrink: 0,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    </div>

    <div style={{ width: '36px', height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '12px' }} />

    {/* Nav items */}
    <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, width: '100%' }}>
      {NAV_ITEMS.map(({ key, Icon, title }) => {
        const active = page === key;
        return (
          <div key={key} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            {active && (
              <div style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                width: '3px', height: '22px', background: NAVY[600], borderRadius: '0 3px 3px 0',
              }} />
            )}
            <button
              onClick={() => onNavigate(key)}
              title={title}
              style={{
                width: '44px', height: '44px', borderRadius: RADIUS.sm, border: 'none',
                background: active ? 'rgba(59,130,196,0.15)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background .15s',
              }}
            >
              <Icon
                color={active ? NAVY[600] : 'rgba(255,255,255,0.35)'}
                sw={active ? 2.2 : 1.8}
              />
            </button>
          </div>
        );
      })}
    </nav>

    {/* Bottom actions */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={onToggleTheme}
        title={theme === 'light' ? 'Dark mode' : 'Light mode'}
        style={{
          width: '36px', height: '36px', borderRadius: RADIUS.sm,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {theme === 'light'
          ? <MoonIcon color="rgba(255,255,255,0.4)" />
          : <SunIcon  color="rgba(255,255,255,0.4)" />}
      </button>

      <div
        title={`${user?.name} · ${user?.role}`}
        style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: NAVY[800], border: '2px solid rgba(91,155,213,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: TYPE.xs, fontWeight: '700', color: NAVY[400],
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
          background: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <LogOutIcon color="rgba(252,165,165,0.7)" />
      </button>
    </div>
  </aside>
);

export const SIDEBAR_WIDTH = SIDEBAR_W;
export default Sidebar;
