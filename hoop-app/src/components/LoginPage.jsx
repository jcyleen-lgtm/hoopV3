import React, { useState } from 'react';
import { FONT, RADIUS, TYPE } from '../theme';

const HoopLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="8" width="6" height="20" rx="3" fill="white" opacity="0.9"/>
    <rect x="15" y="8" width="6" height="20" rx="3" fill="white" opacity="0.9"/>
    <rect x="26" y="8" width="6" height="20" rx="3" fill="white" opacity="0.9"/>
    <rect x="4" y="16" width="28" height="5" rx="2.5" fill="white" opacity="0.5"/>
    <circle cx="18" cy="18.5" r="3.5" fill="#60A5FA" opacity="0.95"/>
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
      background: '#020810',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-30px) scale(1.05)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-15px,25px) scale(1.03)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes logoPulse { 0%,100%{box-shadow:0 0 24px rgba(59,130,196,0.4),0 0 48px rgba(59,130,196,0.15),inset 0 1px 0 rgba(255,255,255,0.1)} 50%{box-shadow:0 0 36px rgba(96,165,250,0.55),0 0 72px rgba(59,130,196,0.25),inset 0 1px 0 rgba(255,255,255,0.15)} }
        @keyframes borderGlow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes scanLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }

        .login-card { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) forwards; }
        .orb1 { animation: floatOrb1 10s ease-in-out infinite; }
        .orb2 { animation: floatOrb2 13s ease-in-out infinite; }
        .orb3 { animation: floatOrb1 16s ease-in-out infinite reverse; }
        .logo-box { animation: logoPulse 3.5s ease-in-out infinite; }
        .border-glow { animation: borderGlow 3s ease-in-out infinite; }

        .glass-input {
          width: 100%; height: 52px;
          background: rgba(6,18,40,0.5);
          border: 1px solid rgba(96,165,250,0.15);
          border-radius: 14px;
          padding: 0 16px 0 44px;
          color: #E8F4FF; font-size: 14px; font-family: inherit;
          outline: none; transition: all 0.25s;
          backdrop-filter: blur(12px);
        }
        .glass-input::placeholder { color: rgba(148,185,230,0.3); }
        .glass-input:focus {
          border-color: rgba(96,165,250,0.5);
          background: rgba(8,24,52,0.6);
          box-shadow: 0 0 0 3px rgba(96,165,250,0.08), 0 0 20px rgba(59,130,196,0.1), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .login-btn {
          width: 100%; height: 52px; border: none; border-radius: 14px; cursor: pointer;
          font-size: 15px; font-weight: 700; font-family: inherit;
          background: linear-gradient(135deg, #1E3A6E 0%, #2563EB 50%, #3B82F6 100%);
          background-size: 200% auto;
          color: white; letter-spacing: 0.03em;
          box-shadow: 0 0 24px rgba(59,130,196,0.4), 0 4px 20px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: all 0.25s;
          position: relative; overflow: hidden;
        }
        .login-btn::after {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);
          transition: left 0.5s;
        }
        .login-btn:hover:not(:disabled)::after { left:150%; }
        .login-btn:hover:not(:disabled) {
          box-shadow: 0 0 36px rgba(96,165,250,0.55), 0 8px 32px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>

      {/* Deep bg gradient */}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 25% 15%, #0D1F3C 0%, #020810 55%), radial-gradient(ellipse at 80% 85%, #081428 0%, transparent 55%)', pointerEvents:'none' }} />

      {/* Floating ambient orbs */}
      <div className="orb1" style={{ position:'absolute', top:'-15%', left:'-10%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 65%)', pointerEvents:'none' }} />
      <div className="orb2" style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, rgba(30,58,92,0.2) 0%, transparent 60%)', pointerEvents:'none' }} />
      <div className="orb3" style={{ position:'absolute', top:'40%', right:'5%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 65%)', pointerEvents:'none' }} />

      {/* Subtle grid */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(96,165,250,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.025) 1px, transparent 1px)', backgroundSize:'48px 48px' }} />

      <div className="login-card" style={{ width:'100%', maxWidth:'400px', position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <div className="logo-box" style={{
            width:'80px', height:'80px', borderRadius:'26px', margin:'0 auto 20px',
            background:'linear-gradient(135deg, #060F20 0%, #0D2040 50%, #1A3A6E 100%)',
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'1px solid rgba(96,165,250,0.25)',
          }}>
            <HoopLogo />
          </div>
          <h1 style={{ fontSize:'34px', fontWeight:'900', color:'#fff', letterSpacing:'-1px', marginBottom:'6px', textShadow:'0 0 30px rgba(96,165,250,0.25)' }}>
            HOOP
          </h1>
          <p style={{ fontSize:'11px', color:'rgba(148,185,230,0.4)', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:'600' }}>
            Warehouse Packing System
          </p>
        </div>

        {/* Volumetric glass card */}
        <div style={{ position:'relative' }}>

          {/* Outer glow layer */}
          <div className="border-glow" style={{
            position:'absolute', inset:'-1px',
            borderRadius:'26px',
            background:'transparent',
            boxShadow:'0 0 40px rgba(37,99,235,0.18), 0 0 80px rgba(37,99,235,0.08), 0 20px 60px rgba(37,99,235,0.12)',
            pointerEvents:'none',
          }} />

          {/* Bottom edge stronger glow */}
          <div style={{
            position:'absolute', bottom:'-2px', left:'10%', right:'10%', height:'3px',
            background:'linear-gradient(90deg,transparent,rgba(59,130,196,0.5),rgba(96,165,250,0.6),rgba(59,130,196,0.5),transparent)',
            borderRadius:'0 0 4px 4px',
            boxShadow:'0 0 20px rgba(96,165,250,0.4), 0 0 40px rgba(59,130,196,0.2)',
            filter:'blur(0.5px)',
            pointerEvents:'none',
          }} />

          {/* Left edge glow */}
          <div style={{ position:'absolute', left:'-1px', top:'15%', bottom:'15%', width:'1px', background:'linear-gradient(180deg,transparent,rgba(59,130,196,0.35),rgba(96,165,250,0.25),transparent)', pointerEvents:'none' }} />
          {/* Right edge glow */}
          <div style={{ position:'absolute', right:'-1px', top:'15%', bottom:'15%', width:'1px', background:'linear-gradient(180deg,transparent,rgba(59,130,196,0.35),rgba(96,165,250,0.25),transparent)', pointerEvents:'none' }} />

          {/* Glass card body */}
          <div style={{
            background:'rgba(6,14,30,0.65)',
            backdropFilter:'blur(32px)',
            WebkitBackdropFilter:'blur(32px)',
            border:'1px solid rgba(96,165,250,0.12)',
            borderRadius:'24px',
            padding:'32px 28px',
            boxShadow:'0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(59,130,196,0.06)',
            position:'relative', overflow:'hidden',
          }}>

            {/* Subtle scan line */}
            <div className="scan-line" style={{
              position:'absolute', left:0, right:0, height:'1px',
              background:'linear-gradient(90deg,transparent,rgba(96,165,250,0.08),transparent)',
              animation:'scanLine 6s linear infinite',
              pointerEvents:'none',
            }} />

            {/* Inner top reflection */}
            <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)', pointerEvents:'none' }} />

            <p style={{ fontSize:TYPE.xs, fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(148,185,230,0.25)', marginBottom:'22px' }}>
              Sign in to continue
            </p>

            {/* Username */}
            <div style={{ position:'relative', marginBottom:'12px' }}>
              <div style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(96,165,250,0.45)" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <input className="glass-input" type="text" placeholder="Username"
                value={username} onChange={e => setUsername(e.target.value)}
                disabled={isLoading} autoComplete="off" />
            </div>

            {/* Password */}
            <div style={{ position:'relative', marginBottom:'26px' }}>
              <div style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(96,165,250,0.45)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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
        </div>

        <p style={{ textAlign:'center', marginTop:'24px', fontSize:TYPE.xs, color:'rgba(148,185,230,0.15)', letterSpacing:'0.04em' }}>
          Hoop © {new Date().getFullYear()} · Warehouse Intelligence
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
