import React, { useState } from 'react';
import { NAVY, FONT, RADIUS, TYPE } from '../theme';

// ── Inline SVG Icons ──────────────────────────────────────────────
const UserIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const LockIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const ArrowRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const BoxIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

// ── Field component ────────────────────────────────────────────────
const Field = ({ icon: Icon, placeholder, type = 'text', value, onChange, onKeyDown, disabled }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.10)',
    borderRadius: RADIUS.md, padding: '0 16px',
    height: '52px', marginBottom: '12px',
    transition: 'border-color 0.2s',
  }}
    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(91,155,213,0.5)'}
    onBlur={(e)  => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'}
  >
    <Icon size={17} />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      autoComplete="off"
      style={{
        flex: 1, background: 'none', border: 'none', outline: 'none',
        fontSize: TYPE.base, color: '#fff', fontFamily: FONT,
        '::placeholder': { color: 'rgba(255,255,255,0.3)' },
      }}
    />
  </div>
);

// ── Main Login Page ────────────────────────────────────────────────
const LoginPage = ({ onLogin, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!isLoading && username.trim() && password.trim()) {
      onLogin(username.trim(), password.trim());
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 20% 50%, #0D2137 0%, ${NAVY[950]} 60%)`,
      display: 'flex', fontFamily: FONT, overflow: 'hidden', position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(255,255,255,0.3) !important; }
        @keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.08);opacity:0.15} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .login-card { animation: fadeUp 0.5s ease forwards; }
        .logo-float { animation: float 5s ease-in-out infinite; }
        .login-btn { transition: all 0.2s ease; }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,196,0.4) !important; }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        border: '1px solid rgba(91,155,213,0.08)',
        animation: 'pulse-ring 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,196,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '300px', height: '300px', borderRadius: '50%',
        border: '1px solid rgba(91,155,213,0.05)', pointerEvents: 'none',
      }} />

      {/* Left branding panel (desktop only) */}
      <div style={{
        display: 'none',
        flex: '1',
        padding: '60px',
        flexDirection: 'column',
        justifyContent: 'center',
      }} className="left-panel">
        {/* mobile hides this via className */}
      </div>

      {/* Center login box */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '24px 20px',
      }}>
        <div className="login-card" style={{ width: '100%', maxWidth: '400px' }}>

          {/* Logo */}
          <div className="logo-float" style={{
            width: '68px', height: '68px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3B82C4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px', boxShadow: '0 12px 40px rgba(59,130,196,0.3)',
            color: '#fff',
          }}>
            <BoxIcon size={30} />
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '26px', fontWeight: '900', color: '#fff',
              letterSpacing: '-0.5px', marginBottom: '6px',
            }}>
              HOOP<span style={{ color: '#3B82C4' }}>V3</span>
            </h1>
            <p style={{ fontSize: TYPE.sm, color: 'rgba(255,255,255,0.38)' }}>
              Warehouse Packing System
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.09)',
            borderRadius: '20px',
            padding: '32px 28px',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
          }}>
            <p style={{
              fontSize: TYPE.xs, fontWeight: '700', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
              marginBottom: '20px',
            }}>
              Sign in to your account
            </p>

            <Field
              icon={UserIcon}
              placeholder="Username"
              value={username}
              onChange={setUsername}
              disabled={isLoading}
            />
            <Field
              icon={LockIcon}
              placeholder="Password"
              type="password"
              value={password}
              onChange={setPassword}
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />

            <button
              onClick={handleSubmit}
              disabled={isLoading || !username.trim() || !password.trim()}
              className="login-btn"
              style={{
                width: '100%', height: '52px', marginTop: '8px',
                background: isLoading ? 'rgba(59,130,196,0.4)' : 'linear-gradient(135deg, #2D5A8E 0%, #3B82C4 100%)',
                color: '#fff', border: 'none', borderRadius: RADIUS.md,
                fontSize: TYPE.md, fontWeight: '700', fontFamily: FONT,
                cursor: isLoading || !username.trim() || !password.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                opacity: !username.trim() || !password.trim() ? 0.5 : 1,
              }}
            >
              {isLoading ? (
                <span style={{ opacity: 0.8 }}>Signing in…</span>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          <p style={{
            textAlign: 'center', marginTop: '20px',
            fontSize: TYPE.xs, color: 'rgba(255,255,255,0.2)',
          }}>
            HoopV3 © {new Date().getFullYear()} · Warehouse Analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
