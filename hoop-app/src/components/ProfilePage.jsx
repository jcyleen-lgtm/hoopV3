import React from 'react';
import { NAVY, FONT, RADIUS, TYPE, glassCard } from '../theme';

const MoonIcon   = ({ color }) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const SunIcon    = ({ color }) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const LogOutIcon = ({ color }) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const initials = (name = '') =>
  name.split(' ').map(w => w[0] ?? '').slice(0, 2).join('').toUpperCase();

const ProfilePage = ({ user, theme, colors, onToggleTheme, onLogout }) => {
  const isLight = theme === 'light';
  const card = glassCard(theme);
  const errCard = {
    ...glassCard(theme, '239,68,68'),
    border: `1px solid rgba(${isLight ? '220,38,38' : '239,68,68'},0.18)`,
  };

  return (
    <div style={{ padding: '32px 20px 24px', maxWidth: '480px', margin: '0 auto', fontFamily: FONT, position: 'relative' }}>

      {/* Ambient orbs */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '300px', height: '300px', top: '-80px', left: '-60px', borderRadius: '50%', background: `radial-gradient(circle,rgba(59,130,196,${isLight ? '0.12' : '0.1'}) 0%,transparent 65%)` }} />
        <div style={{ position: 'absolute', width: '200px', height: '200px', bottom: '100px', right: '-40px', borderRadius: '50%', background: `radial-gradient(circle,rgba(168,85,247,${isLight ? '0.08' : '0.07'}) 0%,transparent 65%)` }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Avatar + name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
          <div style={{
            width: '76px', height: '76px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E3A6E, #3B82C4)',
            border: isLight ? '2.5px solid rgba(255,255,255,0.9)' : '2.5px solid rgba(59,130,196,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: '700', color: '#fff', letterSpacing: '.02em',
            boxShadow: isLight
              ? '0 4px 20px rgba(59,130,196,0.3), 0 0 0 1px rgba(59,130,196,0.15)'
              : '0 0 28px rgba(59,130,196,0.4), 0 0 56px rgba(59,130,196,0.15)',
          }}>
            {initials(user?.name)}
          </div>
          <div style={{ fontSize: TYPE.lg, fontWeight: '700', color: colors.text, textAlign: 'center', letterSpacing: '-.3px' }}>
            {user?.name}
          </div>
          <div style={{ fontSize: TYPE.sm, color: colors.subText }}>{user?.role}</div>
          {/* Online badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: isLight ? 'rgba(255,255,255,0.6)' : 'rgba(34,197,94,0.08)',
            backdropFilter: isLight ? 'blur(10px)' : 'none',
            border: `1px solid rgba(${isLight ? '22,163,74' : '34,197,94'},0.2)`,
            borderRadius: '20px', padding: '4px 12px',
            boxShadow: `0 0 10px rgba(${isLight ? '22,163,74' : '34,197,94'},0.1)${isLight ? ', inset 0 1px 0 rgba(255,255,255,0.9)' : ''}`,
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.success, boxShadow: `0 0 6px ${colors.success}` }} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: colors.success }}>Online</span>
          </div>
        </div>

        {/* Settings card */}
        <div style={{
          ...card,
          borderRadius: RADIUS.lg,
          overflow: 'hidden',
          backdropFilter: isLight ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isLight ? 'blur(20px)' : 'none',
          marginBottom: '12px',
        }}>
          {/* Accent top line */}
          <div style={{ height: '1.5px', background: 'linear-gradient(90deg,rgba(59,130,196,0.6),rgba(59,130,196,0))', borderRadius: `${RADIUS.lg} ${RADIUS.lg} 0 0` }} />

          {/* Theme toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {theme === 'light'
                ? <SunIcon  color={colors.subText} />
                : <MoonIcon color={colors.subText} />}
              <span style={{ fontSize: TYPE.base, color: colors.text }}>
                {theme === 'light' ? 'Light mode' : 'Dark mode'}
              </span>
            </div>
            <button
              onClick={onToggleTheme}
              style={{
                width: '44px', height: '26px', borderRadius: '999px', border: 'none',
                background: theme === 'dark'
                  ? 'linear-gradient(135deg,#1A3A5C,#3B82C4)'
                  : 'rgba(200,210,225,0.3)',
                cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0,
                boxShadow: theme === 'dark' ? '0 0 12px rgba(59,130,196,0.4)' : 'none',
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: theme === 'dark' ? '21px' : '3px',
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>

          <div style={{ height: '1px', background: colors.borderSub, margin: '0 18px' }} />

          {/* Versi */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
            <span style={{ fontSize: TYPE.sm, color: colors.subText }}>Versi</span>
            <span style={{
              fontSize: TYPE.xs, fontWeight: '700', color: colors.brand,
              background: isLight ? 'rgba(59,130,196,0.08)' : 'rgba(59,130,196,0.12)',
              border: `1px solid rgba(59,130,196,${isLight ? '0.15' : '0.2'})`,
              borderRadius: '20px', padding: '2px 10px',
              boxShadow: `0 0 8px rgba(59,130,196,${isLight ? '0.1' : '0.15'})`,
            }}>v3.0</span>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            width: '100%', padding: '16px 18px',
            ...errCard,
            borderRadius: RADIUS.lg,
            backdropFilter: isLight ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: isLight ? 'blur(16px)' : 'none',
            border: `1px solid rgba(${isLight ? '220,38,38' : '239,68,68'},0.18)`,
            cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
            boxShadow: `0 0 16px rgba(${isLight ? '220,38,38' : '239,68,68'},0.08)${isLight ? ', inset 0 1px 0 rgba(255,255,255,0.9)' : ''}`,
          }}
        >
          <LogOutIcon color={colors.error} />
          <span style={{ fontSize: TYPE.base, color: colors.error, fontWeight: '600' }}>Sign out</span>
        </button>

        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: TYPE.xs, color: colors.subText, letterSpacing: '.04em' }}>
          Hoop · v3
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
