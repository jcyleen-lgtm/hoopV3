import React from 'react';
import { NAVY, FONT, RADIUS, TYPE } from '../theme';

const MoonIcon   = ({ color }) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const SunIcon    = ({ color }) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const LogOutIcon = ({ color }) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const initials = (name = '') =>
  name.split(' ').map(w => w[0] ?? '').slice(0, 2).join('').toUpperCase();

const ProfilePage = ({ user, theme, colors, onToggleTheme, onLogout }) => (
  <div style={{ padding: '32px 20px 24px', maxWidth: '480px', margin: '0 auto', fontFamily: FONT }}>

    {/* Avatar + name */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
      <div style={{
        width: '76px', height: '76px', borderRadius: '50%',
        background: NAVY[50], border: `2px solid ${NAVY[300]}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', fontWeight: '700', color: NAVY[800], letterSpacing: '.02em',
      }}>
        {initials(user?.name)}
      </div>
      <div style={{ fontSize: TYPE.lg, fontWeight: '700', color: colors.text, textAlign: 'center', letterSpacing: '-.3px' }}>
        {user?.name}
      </div>
      <div style={{ fontSize: TYPE.sm, color: colors.subText }}>{user?.role}</div>
    </div>

    {/* Settings card */}
    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: RADIUS.lg, overflow: 'hidden' }}>

      {/* Theme toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {theme === 'light'
            ? <MoonIcon color={colors.subText} />
            : <SunIcon  color={colors.subText} />}
          <span style={{ fontSize: TYPE.base, color: colors.text }}>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </span>
        </div>
        <button
          onClick={onToggleTheme}
          style={{
            width: '44px', height: '26px', borderRadius: '999px', border: 'none',
            background: theme === 'dark' ? NAVY[600] : '#D1D5DB',
            cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0,
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

      <div style={{ height: '1px', background: colors.border }} />

      {/* Sign out */}
      <button
        onClick={onLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          width: '100%', padding: '16px 18px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', fontFamily: FONT,
        }}
      >
        <LogOutIcon color="#EF4444" />
        <span style={{ fontSize: TYPE.base, color: '#EF4444', fontWeight: '500' }}>Sign out</span>
      </button>
    </div>

    <div style={{ textAlign: 'center', marginTop: '32px', fontSize: TYPE.xs, color: colors.subText, letterSpacing: '.04em' }}>
      Hoop · v3.0
    </div>
  </div>
);

export default ProfilePage;
