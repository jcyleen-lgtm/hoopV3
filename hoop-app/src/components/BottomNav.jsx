import React from 'react';
import { FONT } from '../theme';

const HomeIcon    = ({ a, isLight }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "white" : isLight ? "rgba(30,60,120,0.4)" : "rgba(181,212,244,0.4)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const CameraIcon  = ({ a, isLight }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? "white" : "none"} stroke={a ? "white" : isLight ? "rgba(30,60,120,0.4)" : "rgba(181,212,244,0.4)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const ChartIcon   = ({ a, isLight }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "white" : isLight ? "rgba(30,60,120,0.4)" : "rgba(181,212,244,0.4)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const UserIcon    = ({ a, isLight }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "white" : isLight ? "rgba(30,60,120,0.4)" : "rgba(181,212,244,0.4)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

const TABS = [
  { key: 'home',      label: 'Home',      Icon: HomeIcon    },
  { key: 'scan',      label: 'Scan',      Icon: CameraIcon  },
  { key: 'dashboard', label: 'Dashboard', Icon: ChartIcon   },
  { key: 'profile',   label: 'Profile',   Icon: UserIcon    },
];

const BottomNav = ({ page, onNavigate, theme }) => {
  const isLight = theme === 'light';
  return (
    <>
      <div style={{ height: '96px', flexShrink: 0 }} />
      <nav style={{
        position: 'fixed', bottom: '20px', left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', maxWidth: '420px',
        height: '68px',
        background: isLight ? 'rgba(255,255,255,0.65)' : 'rgba(4,8,16,0.85)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: isLight ? '1px solid rgba(255,255,255,0.85)' : '1px solid rgba(59,130,196,0.15)',
        borderRadius: '999px',
        display: 'flex', alignItems: 'center',
        padding: '0 6px', zIndex: 500,
        boxShadow: isLight
          ? '0 8px 32px rgba(100,140,220,0.15), inset 0 1px 0 rgba(255,255,255,0.95), 0 0 20px rgba(59,130,196,0.06)'
          : '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 30px rgba(37,99,235,0.08)',
      }}>
        {TABS.map(({ key, label, Icon }) => {
          const active = page === key;
          return (
            <button key={key} onClick={() => onNavigate(key)} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '3px', background: 'none', border: 'none',
              cursor: 'pointer', position: 'relative', padding: '0',
              fontFamily: FONT, height: '100%', borderRadius: '999px',
            }}>
              {active && (
                <div style={{
                  position: 'absolute',
                  width: 'calc(100% - 4px)',
                  height: '54px',
                  borderRadius: '999px',
                  background: isLight
                    ? 'linear-gradient(135deg,rgba(26,58,92,0.85),rgba(59,130,196,0.9))'
                    : 'linear-gradient(135deg,#1A3A5C,#3B82C4)',
                  boxShadow: isLight
                    ? '0 4px 20px rgba(59,130,196,0.35), 0 0 20px rgba(59,130,196,0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
                    : '0 4px 20px rgba(59,130,196,0.5), 0 0 30px rgba(59,130,196,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  zIndex: 0,
                }} />
              )}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <Icon a={active} isLight={isLight} />
                <span style={{
                  fontSize: '10px', fontWeight: active ? '700' : '400',
                  color: active ? '#fff' : isLight ? 'rgba(30,60,120,0.4)' : 'rgba(181,212,244,0.4)',
                  lineHeight: 1,
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
};

export default BottomNav;
