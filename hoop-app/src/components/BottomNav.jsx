import React from 'react';
import { NAVY, FONT, TYPE } from '../theme';

// Inline SVG icons — no lucide-react
const CameraIcon = ({ color, strokeWidth }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const PackageIcon = ({ color, strokeWidth }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const BarChartIcon = ({ color, strokeWidth }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const UserIcon = ({ color, strokeWidth }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const TABS = [
  { key: 'scan',      label: 'Scan',      Icon: CameraIcon  },
  { key: 'produk',    label: 'Produk',    Icon: PackageIcon },
  { key: 'dashboard', label: 'Dashboard', Icon: BarChartIcon },
  { key: 'profile',   label: 'Profile',   Icon: UserIcon    },
];

const BottomNav = ({ page, colors, onNavigate }) => (
  <>
    <div style={{ height: '68px', flexShrink: 0 }} />
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: '64px', backgroundColor: colors.card,
      borderTop: `1px solid ${colors.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 4px', paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 500, fontFamily: FONT,
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
              gap: '3px', background: 'none', border: 'none',
              cursor: 'pointer', padding: '6px 2px', position: 'relative', fontFamily: FONT,
            }}
          >
            {active && (
              <div style={{
                position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)',
                width: '44px', height: '28px', borderRadius: '999px',
                backgroundColor: NAVY[50], zIndex: 0,
              }} />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Icon
                color={active ? NAVY[700] : colors.subText}
                strokeWidth={active ? 2.2 : 1.8}
              />
            </div>
            <span style={{
              fontSize: '10px', fontWeight: active ? '700' : '400',
              color: active ? NAVY[700] : colors.subText, lineHeight: 1,
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  </>
);

export default BottomNav;
