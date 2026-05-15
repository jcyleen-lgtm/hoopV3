import React, { useState, useEffect, useRef } from 'react';

const HoopLogo = () => (
  <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="8" width="6" height="20" rx="3" fill="white" opacity="0.92"/>
    <rect x="15" y="8" width="6" height="20" rx="3" fill="white" opacity="0.92"/>
    <rect x="26" y="8" width="6" height="20" rx="3" fill="white" opacity="0.92"/>
    <rect x="4" y="16" width="28" height="5" rx="2.5" fill="white" opacity="0.38"/>
    <circle cx="18" cy="18.5" r="4" fill="#38BDF8"/>
  </svg>
);

const STATUS_LINES = [
  '> SYSTEM ONLINE',
  '> INVENTORY LINKED',
  '> AI PACKING READY',
  '> NODE STATUS : STABLE',
  '> WAREHOUSE INTELLIGENCE : ACTIVE',
];

const AUTH_LINES = [
  'AUTHENTICATING...',
  'VERIFYING CREDENTIALS...',
  'ACCESS GRANTED',
  'LOADING WORKSPACE...',
];

const isNewDay = () => {
  const last = localStorage.getItem('hoop_last_visit');
  const today = new Date().toDateString();
  localStorage.setItem('hoop_last_visit', today);
  return last !== today;
};

const LoginPage = ({ onLogin, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phase, setPhase]       = useState('welcome'); // welcome | login | auth
  const [showWelcome]           = useState(() => isNewDay());
  const [statusIdx, setStatusIdx] = useState(0);
  const [authStep, setAuthStep]   = useState(0);
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  // ── Particle canvas ──────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.35 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${p.a})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafRef.current); };
  }, []);

  // ── Welcome → login ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'welcome') return;
    const t = setTimeout(() => setPhase('login'), showWelcome ? 2200 : 800);
    return () => clearTimeout(t);
  }, [phase, showWelcome]);

  // ── Status rotation ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'login') return;
    const interval = setInterval(() => setStatusIdx(i => (i + 1) % STATUS_LINES.length), 2400);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!username.trim() || !password.trim() || isLoading) return;
    setPhase('auth');
    setAuthStep(0);
    AUTH_LINES.forEach((_, i) => setTimeout(() => setAuthStep(i + 1), i * 520));
    setTimeout(() => onLogin(username.trim(), password.trim()), AUTH_LINES.length * 520 + 200);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020914', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes gridMove  { from{background-position:0 0} to{background-position:40px 40px} }
        @keyframes scanLine  { 0%{top:-1px;opacity:0.6} 100%{top:100%;opacity:0} }
        @keyframes scanLine2 { 0%{top:-1px;opacity:0.4} 100%{top:100%;opacity:0} }
        @keyframes glowBreathe {
          0%,100%{box-shadow:0 0 24px rgba(56,189,248,0.28),0 0 48px rgba(56,189,248,0.1),inset 0 0 20px rgba(56,189,248,0.04)}
          50%{box-shadow:0 0 42px rgba(56,189,248,0.48),0 0 80px rgba(56,189,248,0.18),inset 0 0 30px rgba(56,189,248,0.08)}
        }
        @keyframes cardGlow {
          0%,100%{border-color:rgba(56,189,248,0.16);box-shadow:0 0 32px rgba(56,189,248,0.06),inset 0 1px 0 rgba(255,255,255,0.04)}
          50%{border-color:rgba(56,189,248,0.3);box-shadow:0 0 52px rgba(56,189,248,0.12),inset 0 1px 0 rgba(255,255,255,0.06)}
        }
        @keyframes dotPulse  { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.4);opacity:1} }
        @keyframes statusFade{ 0%{opacity:0;transform:translateX(-3px)} 12%,88%{opacity:1;transform:none} 100%{opacity:0} }
        @keyframes welcomeFade{ from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }

        .hoop-input {
          width:100%; height:48px;
          background:rgba(2,15,35,0.65);
          border:1px solid rgba(56,189,248,0.18); border-radius:9px;
          padding:0 14px 0 42px; color:#E8F4FF;
          font-size:14px; font-family:'Inter',sans-serif; font-weight:500;
          outline:none; transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
          backdrop-filter:blur(8px); letter-spacing:0.02em;
        }
        .hoop-input::placeholder { color:rgba(148,185,230,0.35); }
        .hoop-input:focus {
          border-color:rgba(56,189,248,0.55);
          background:rgba(4,20,52,0.75);
          box-shadow:0 0 0 3px rgba(56,189,248,0.07), 0 0 20px rgba(56,189,248,0.1);
        }
        .hoop-btn {
          width:100%; height:48px;
          border:1px solid rgba(56,189,248,0.4); border-radius:9px;
          cursor:pointer; font-size:14px; font-weight:700;
          font-family:'Inter',sans-serif; letter-spacing:0.06em; color:#fff;
          background:linear-gradient(135deg,rgba(2,28,75,0.95),rgba(14,55,140,0.95));
          box-shadow:0 0 20px rgba(56,189,248,0.2), inset 0 1px 0 rgba(255,255,255,0.07);
          transition:all 0.2s; position:relative; overflow:hidden;
        }
        .hoop-btn:hover:not(:disabled) {
          border-color:rgba(56,189,248,0.7);
          box-shadow:0 0 36px rgba(56,189,248,0.38), inset 0 1px 0 rgba(255,255,255,0.1);
          transform:translateY(-1px);
        }
        .hoop-btn:active:not(:disabled) { transform:translateY(0); }
        .hoop-btn:disabled { opacity:0.38; cursor:not-allowed; }
        .hoop-btn::after {
          content:''; position:absolute; top:0; left:-120%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);
          transition:left 0.55s;
        }
        .hoop-btn:hover:not(:disabled)::after { left:150%; }
      `}</style>

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, zIndex:0 }} />

      {/* Moving grid */}
      <div style={{
        position:'absolute', inset:0, zIndex:0,
        backgroundImage:'linear-gradient(rgba(56,189,248,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.028) 1px,transparent 1px)',
        backgroundSize:'40px 40px',
        animation:'gridMove 10s linear infinite',
      }} />

      {/* Dot pattern overlay */}
      <div style={{
        position:'absolute', inset:0, zIndex:0,
        backgroundImage:'radial-gradient(circle,rgba(56,189,248,0.09) 1px,transparent 1px)',
        backgroundSize:'34px 34px',
        maskImage:'radial-gradient(ellipse at 50% 40%,black 25%,transparent 72%)',
        WebkitMaskImage:'radial-gradient(ellipse at 50% 40%,black 25%,transparent 72%)',
      }} />

      {/* Ambient glows */}
      <div style={{ position:'absolute', top:'-18%', left:'50%', transform:'translateX(-50%)', width:'640px', height:'480px', borderRadius:'50%', background:'radial-gradient(circle,rgba(14,55,150,0.42) 0%,rgba(56,189,248,0.07) 45%,transparent 70%)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'30%', left:'-8%', width:'320px', height:'320px', borderRadius:'50%', background:'radial-gradient(circle,rgba(56,189,248,0.05) 0%,transparent 65%)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-18%', right:'-8%', width:'420px', height:'340px', borderRadius:'50%', background:'radial-gradient(circle,rgba(14,55,150,0.18) 0%,transparent 65%)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'12%', right:'6%', width:'160px', height:'160px', borderRadius:'50%', background:'radial-gradient(circle,rgba(56,189,248,0.05) 0%,transparent 65%)', zIndex:0, pointerEvents:'none' }} />

      {/* Global scan line */}
      <div style={{ position:'absolute', left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(56,189,248,0.18),rgba(56,189,248,0.45),rgba(56,189,248,0.18),transparent)', zIndex:1, animation:'scanLine 7s linear infinite', pointerEvents:'none' }} />

      {/* ── WELCOME PHASE ── */}
      {phase === 'welcome' && (
        <div style={{ position:'relative', zIndex:10, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'fadeIn 0.5s ease' }}>
          <div style={{ width:'88px', height:'88px', borderRadius:'26px', background:'linear-gradient(135deg,#060F20,#0D2040,#1A3A6E)', border:'1px solid rgba(56,189,248,0.3)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'22px', animation:'glowBreathe 2.5s ease-in-out infinite' }}>
            <HoopLogo />
          </div>
          <h1 style={{ fontSize:'34px', fontWeight:'900', color:'#fff', letterSpacing:'-0.5px', margin:'0 0 6px', textShadow:'0 0 40px rgba(56,189,248,0.35)' }}>HOOP</h1>
          <p style={{ fontSize:'11px', color:'rgba(56,189,248,0.4)', letterSpacing:'0.14em', textTransform:'uppercase', margin:'0 0 24px' }}>Warehouse Packing System</p>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(56,189,248,0.06)', border:'1px solid rgba(56,189,248,0.14)', borderRadius:'20px', padding:'6px 16px', animation:'welcomeFade 0.5s ease 0.3s both' }}>
            <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#38BDF8', boxShadow:'0 0 6px #38BDF8', animation:'dotPulse 1.6s ease-in-out infinite' }} />
            <span style={{ fontSize:'12px', fontWeight:'600', color:'rgba(56,189,248,0.65)', letterSpacing:'0.07em' }}>
              {showWelcome ? 'Welcome to Hoop' : 'Loading...'}<span style={{ animation:'blink 1s step-end infinite' }}>_</span>
            </span>
          </div>
        </div>
      )}

      {/* ── LOGIN PHASE ── */}
      {phase === 'login' && (
        <div style={{ position:'relative', zIndex:10, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'fadeUp 0.5s ease', padding:'24px 20px' }}>

          {/* Logo + title */}
          <div style={{ textAlign:'center', marginBottom:'26px' }}>
            <div style={{ width:'76px', height:'76px', borderRadius:'24px', background:'linear-gradient(135deg,#060F20,#0D2040,#1A3A6E)', border:'1px solid rgba(56,189,248,0.28)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', animation:'glowBreathe 3s ease-in-out infinite' }}>
              <HoopLogo />
            </div>
            <h1 style={{ fontSize:'30px', fontWeight:'900', color:'#fff', letterSpacing:'-0.5px', margin:'0 0 5px', textShadow:'0 0 32px rgba(56,189,248,0.3)' }}>HOOP</h1>
            <p style={{ fontSize:'11px', color:'rgba(56,189,248,0.38)', letterSpacing:'0.14em', textTransform:'uppercase', margin:0 }}>Warehouse Packing System</p>
          </div>

          {/* Card */}
          <div style={{ position:'relative', width:'100%', maxWidth:'380px' }}>

            {/* Bottom edge glow */}
            <div style={{ position:'absolute', bottom:'-1px', left:'18%', right:'18%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(56,189,248,0.5),transparent)', boxShadow:'0 0 12px rgba(56,189,248,0.3)', borderRadius:'0 0 4px 4px', pointerEvents:'none' }} />

            <div style={{
              background:'rgba(4,12,30,0.8)',
              backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)',
              border:'1px solid rgba(56,189,248,0.18)',
              borderRadius:'16px', padding:'26px 22px',
              animation:'cardGlow 4s ease-in-out infinite',
              position:'relative', overflow:'hidden',
            }}>
              {/* Inner scan line */}
              <div style={{ position:'absolute', left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(56,189,248,0.08),transparent)', animation:'scanLine2 5s linear infinite 1.5s', pointerEvents:'none' }} />
              {/* Top reflection */}
              <div style={{ position:'absolute', top:0, left:'12%', right:'12%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)', pointerEvents:'none' }} />

              {/* Status */}
              <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'14px' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#38BDF8', boxShadow:'0 0 7px #38BDF8', flexShrink:0, animation:'dotPulse 1.8s ease-in-out infinite' }} />
                <span style={{ fontSize:'11px', fontWeight:'600', color:'rgba(56,189,248,0.55)', letterSpacing:'0.1em', animation:'statusFade 2.4s ease-in-out infinite' }}>
                  {STATUS_LINES[statusIdx]}
                </span>
              </div>

              <p style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(56,189,248,0.26)', marginBottom:'16px' }}>
                Sign in to continue
              </p>

              {/* Username */}
              <div style={{ position:'relative', marginBottom:'10px' }}>
                <div style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input className="hoop-input" type="text" placeholder="Username"
                  value={username} onChange={e => setUsername(e.target.value)}
                  disabled={isLoading} autoComplete="off" />
              </div>

              {/* Password */}
              <div style={{ position:'relative', marginBottom:'22px' }}>
                <div style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input className="hoop-input" type="password" placeholder="Password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  disabled={isLoading} />
              </div>

              <button className="hoop-btn" onClick={handleSubmit}
                disabled={isLoading || !username.trim() || !password.trim()}>
                Masuk →
              </button>
            </div>
          </div>

          <p style={{ marginTop:'18px', fontSize:'10px', color:'rgba(56,189,248,0.15)', letterSpacing:'0.06em' }}>
            Hoop © {new Date().getFullYear()} · Warehouse Intelligence
          </p>
        </div>
      )}

      {/* ── AUTH PHASE ── */}
      {phase === 'auth' && (
        <div style={{ position:'relative', zIndex:10, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'24px', animation:'fadeIn 0.3s ease' }}>
          {/* Spinning rings */}
          <div style={{ position:'relative', width:'96px', height:'96px' }}>
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid rgba(56,189,248,0.1)' }} />
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid transparent', borderTopColor:'#38BDF8', animation:'spin 0.9s linear infinite', boxShadow:'0 0 14px rgba(56,189,248,0.4)' }} />
            <div style={{ position:'absolute', inset:'10px', borderRadius:'50%', border:'1px solid transparent', borderBottomColor:'rgba(56,189,248,0.5)', animation:'spin 1.3s linear infinite reverse' }} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <HoopLogo />
            </div>
          </div>

          <div style={{ textAlign:'center' }}>
            {AUTH_LINES.slice(0, authStep).map((line, i) => (
              <div key={i} style={{ fontSize:'12px', fontWeight:'600', letterSpacing:'0.1em', color: i === authStep - 1 ? '#38BDF8' : 'rgba(56,189,248,0.3)', marginBottom:'5px', animation:'fadeUp 0.3s ease', textShadow: i === authStep - 1 ? '0 0 12px rgba(56,189,248,0.5)' : 'none' }}>
                {i === authStep - 1 && <span style={{ marginRight:'6px', animation:'blink 0.6s step-end infinite' }}>▶</span>}
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
