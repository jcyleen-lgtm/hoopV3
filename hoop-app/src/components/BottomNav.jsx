import React from 'react';
import { FONT } from '../theme';

const CameraIcon   = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active?"white":"none"} stroke={active?"white":"rgba(255,255,255,0.45)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const PackageIcon  = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"white":"rgba(255,255,255,0.45)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const ChartIcon    = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"white":"rgba(255,255,255,0.45)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const UserIcon     = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"white":"rgba(255,255,255,0.45)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

const TABS = [
  { key: 'scan',      label: 'Scan',      Icon: CameraIcon  },
  { key: 'produk',    label: 'Produk',    Icon: PackageIcon },
  { key: 'dashboard', label: 'Dashboard', Icon: ChartIcon   },
  { key: 'profile',   label: 'Profile',   Icon: UserIcon    },
];

const BottomNav = ({ page, onNavigate }) => (
  <>
    <div style={{ height: '90px', flexShrink: 0 }} />
    <nav style={{
      position: 'fixed', bottom: '16px', left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: '420px',
      height: '68px',
      background: 'rgba(15, 25, 35, 0.75)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: '999px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 500,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      {TABS.map(({ key, label, Icon }) => {
        const active = page === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px', background: 'none', border: 'none',
              cursor: 'pointer', padding: '0', position: 'relative',
              fontFamily: FONT,
            }}
          >
            {/* Active pill background */}
            {active && (
              <div style={{
                position: 'absolute',
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'rgba(59,130,196,0.9)',
                boxShadow: '0 4px 16px rgba(59,130,196,0.5)',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
              }} />
            )}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <Icon active={active} />
              <span style={{
                fontSize: '10px',
                fontWeight: active ? '700' : '400',
                color: active ? 'white' : 'rgba(255,255,255,0.45)',
                lineHeight: 1, letterSpacing: '0.02em',
              }}>
                {label}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  </>
);

export default BottomNav;
