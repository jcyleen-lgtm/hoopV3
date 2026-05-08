import React, { useState } from 'react';
import { FONT, RADIUS, TYPE } from '../theme';

const BoxIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

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
      minHeight: '100vh', fontFamily: FONT,
      background: 'radial-gradient(ellipse at 30% 20%, #0D2137 0%, #030B18 55%), radial-gradient(ellipse at 80% 80%, #091525 0%, transparent 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(181,212,244,0.3) !important; }

        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-40px)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,30px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

        .login-card { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) forwards; }
        .orb1 { animation: floatOrb1 8s ease-in-out infinite; }
        .orb2 { animation: floatOrb2 10s ease-in-out infinite; }

        .glass-input {
          width: 100%; height: 52px;
          background: rgba(5,14,28,0.6);
          border: 1px solid rgba(91,155,213,0.2);
          border-radius: 14px;
          padding: 0 16px 0 44px;
          color: #E8F0FA; font-size: 14px; font-family: inherit;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          backdrop-filter: blur(10px);
        }
        .glass-input:focus {
          border-color: rgba(59,130,196,0.6);
          box-shadow: 0 0 0 3px rgba(59,130,196,0.12), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .login-btn {
          width: 100%; height: 52px; border: none; border-radius: 14px; cursor: pointer;
          font-size: 15px; font-weight: 700; font-family: inherit;
          background: linear-gradient(135deg, #1A3A5C 0%, #3B82C4 50%, #2D5A8E 100%);
          background-size: 200% auto;
          color: white; letter-spacing: 0.02em;
          box-shadow: 0 4px 24px rgba(59,130,196,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: all 0.2s;
        }
        .login-btn:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 8px 32px rgba(59,130,196,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* Floating orbs */}
      <div className="orb1" style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,196,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="orb2" style={{
        position: 'absolute', bottom: '-15%', right: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,33,55,0.8) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(59,130,196,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,196,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="login-card" style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '22px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #0D2137 0%, #3B82C4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(91,155,213,0.2), 0 16px 48px rgba(59,130,196,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}>
            <BoxIcon />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            HOOP<span style={{ color: '#3B82C4' }}>V3</span>
          </h1>
          <p style={{ fontSize: TYPE.sm, color: 'rgba(181,212,244,0.45)' }}>Warehouse Packing System</p>
        </div>

        {/* Glass card */}
        <div style={{
          background: 'rgba(10, 25, 41, 0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(91,155,213,0.15)',
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: TYPE.xs, fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(181,212,244,0.3)', marginBottom: '20px' }}>
            Sign in to continue
          </p>

          {/* Username field */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(91,155,213,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <input className="glass-input" type="text" placeholder="Username"
              value={username} onChange={e => setUsername(e.target.value)}
              disabled={isLoading} autoComplete="off" />
          </div>

          {/* Password field */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(91,155,213,0.5)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <input className="glass-input" type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              disabled={isLoading} />
          </div>

          <button className="login-btn" onClick={handleSubmit}
            disabled={isLoading || !username.trim() || !password.trim()}>
            {isLoading ? 'Signing in…' : 'Masuk →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: TYPE.xs, color: 'rgba(181,212,244,0.2)' }}>
          HoopV3 © {new Date().getFullYear()} · Warehouse Analytics
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
