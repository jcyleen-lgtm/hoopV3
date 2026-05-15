import React, { useState, useEffect, useRef } from 'react';
import { FONT } from '../theme';

// ── Hoop Logo ────────────────────────────────────────────────────
const HoopLogo = () => (
  <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="8" width="6" height="20" rx="3" fill="white" opacity="0.95"/>
    <rect x="15" y="8" width="6" height="20" rx="3" fill="white" opacity="0.95"/>
    <rect x="26" y="8" width="6" height="20" rx="3" fill="white" opacity="0.95"/>
    <rect x="4" y="16" width="28" height="5" rx="2.5" fill="white" opacity="0.4"/>
    <circle cx="18" cy="18.5" r="4" fill="#38BDF8" opacity="1"/>
  </svg>
);

const AUTH_LINES = [
  'AUTHENTICATING...',
  'VERIFYING CREDENTIALS...',
  'ACCESS GRANTED',
  'LOADING WORKSPACE...',
];

const STATUS_LINES = [
  '> SYSTEM ONLINE',
  '> INVENTORY LINKED',
  '> AI PACKING READY',
  '> NODE STATUS : STABLE',
  '> WAREHOUSE INTELLIGENCE : ACTIVE',
];

const LoginPage = ({ onLogin, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phase, setPhase]       = useState('welcome'); // welcome | login | auth
  const [statusIdx, setStatusIdx] = useState(0);
  const [authStep, setAuthStep] = useState(0);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  // ── Particle canvas ───────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
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

  // ── Welcome → login transition ───────────────────────────────
  useEffect(() => {
    if (phase !== 'welcome') return;
    const t = setTimeout(() => setPhase('login'), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Rotating status text ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'login') return;
    const interval = setInterval(() => setStatusIdx(i => (i + 1) % STATUS_LINES.length), 2200);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Auth animation ────────────────────────────────────────────
  const handleSubmit = () => {
    if (!username.trim() || !password.trim() || isLoading) return;
    setPhase('auth');
    setAuthStep(0);
    const steps = AUTH_LINES.map((_, i) => i);
    steps.forEach((s, i) => setTimeout(() => setAuthStep(s + 1), i * 500));
    setTimeout(() => onLogin(username.trim(), password.trim()), steps.length * 500 + 200);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020914', overflow: 'hidden', fontFamily: "'Rajdhani', 'Orbitron', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');


        @keyframes scanLine { 0%{top:-2px;opacity:0.7} 100%{top:100%;opacity:0} }
        @keyframes pulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.02)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 30px rgba(56,189,248,0.25),0 0 60px rgba(56,189,248,0.1)} 50%{box-shadow:0 0 50px rgba(56,189,248,0.4),0 0 100px rgba(56,189,248,0.2)} }
        @keyframes borderFlow { 0%{border-color:rgba(56,189,248,0.3)} 50%{border-color:rgba(56,189,248,0.7)} 100%{border-color:rgba(56,189,248,0.3)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes authPulse { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.15);opacity:1} }
        @keyframes logoBreathe { 0%,100%{filter:drop-shadow(0 0 12px rgba(56,189,248,0.6))} 50%{filter:drop-shadow(0 0 24px rgba(56,189,248,0.9))} }
        @keyframes statusFade { 0%{opacity:0;transform:translateX(-4px)} 15%,85%{opacity:1;transform:none} 100%{opacity:0} }

        .hoop-input {
          width:100%; height:48px; background:rgba(2,15,35,0.7);
          border:1px solid rgba(56,189,248,0.25); border-radius:8px;
          padding:0 16px 0 44px; color:#E8F4FF;
          font-size:15px; font-family:'Rajdhani',sans-serif; font-weight:500;
          outline:none; transition:all 0.2s; letter-spacing:0.05em;
          backdrop-filter:blur(10px);
        }
        .hoop-input::placeholder { color:rgba(56,189,248,0.3); letter-spacing:0.08em; }
        .hoop-input:focus {
          border-color:rgba(56,189,248,0.7);
          background:rgba(4,20,50,0.8);
          box-shadow:0 0 0 3px rgba(56,189,248,0.08), 0 0 24px rgba(56,189,248,0.12), inset 0 0 20px rgba(56,189,248,0.03);
        }
        .hoop-btn {
          width:100%; height:48px; border:1px solid rgba(56,189,248,0.5);
          border-radius:8px; cursor:pointer; font-size:16px; font-weight:700;
          font-family:'Orbitron',monospace; letter-spacing:0.15em; color:#fff;
          background:linear-gradient(135deg,rgba(2,30,80,0.9),rgba(14,60,150,0.9));
          box-shadow:0 0 24px rgba(56,189,248,0.3),inset 0 1px 0 rgba(255,255,255,0.08);
          transition:all 0.2s; position:relative; overflow:hidden;
        }
        .hoop-btn:hover:not(:disabled) {
          box-shadow:0 0 40px rgba(56,189,248,0.5),inset 0 1px 0 rgba(255,255,255,0.12);
          border-color:rgba(56,189,248,0.8); transform:translateY(-1px);
        }
        .hoop-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .hoop-btn::after { content:''; position:absolute; top:0; left:-100%; width:50%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent); transition:left 0.5s; }
        .hoop-btn:hover:not(:disabled)::after { left:150%; }


      `}</style>

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, zIndex:0, opacity:0.7 }} />

      {/* Dot pattern background */}
      <div style={{
        position:'absolute', inset:0, zIndex:0,
        backgroundImage:'radial-gradient(circle, rgba(56,189,248,0.12) 1px, transparent 1px)',
        backgroundSize:'36px 36px',
        maskImage:'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        WebkitMaskImage:'radial-gradient(ellipse at center, black 30%, transparent 80%)',
      }} />

      {/* Scan line */}
      <div style={{ position:'absolute', left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,rgba(56,189,248,0.15),rgba(56,189,248,0.4),rgba(56,189,248,0.15),transparent)', zIndex:1, animation:'scanLine 5s linear infinite', pointerEvents:'none' }} />

      {/* Ambient glows */}
      <div style={{ position:'absolute', top:'-15%', left:'50%', transform:'translateX(-50%)', width:'700px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(14,60,150,0.4) 0%,rgba(56,189,248,0.08) 40%,transparent 70%)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'30%', left:'-10%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(56,189,248,0.07) 0%,transparent 65%)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'500px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(14,60,150,0.2) 0%,transparent 65%)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'20%', left:'5%', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(56,189,248,0.05) 0%,transparent 65%)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'15%', right:'8%', width:'180px', height:'180px', borderRadius:'50%', background:'radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 65%)', zIndex:0, pointerEvents:'none' }} />

      {/* ── WELCOME PHASE ── */}
      {phase === 'welcome' && (
        <div style={{ position:'relative', zIndex:10, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'fadeUp 0.6s ease' }}>
          <div style={{ width:'90px', height:'90px', borderRadius:'26px', background:'linear-gradient(135deg,#060F20,#0D2040,#1A3A6E)', border:'1px solid rgba(56,189,248,0.3)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px', animation:'glowPulse 2s ease-in-out infinite, logoBreathe 2s ease-in-out infinite' }}>
            <HoopLogo />
          </div>
          <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:'36px', fontWeight:'900', color:'#fff', letterSpacing:'0.25em', margin:'0 0 8px', textShadow:'0 0 40px rgba(56,189,248,0.5)' }}>HOOP</h1>
          <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'13px', color:'rgba(56,189,248,0.5)', letterSpacing:'0.2em', textTransform:'uppercase', margin:'0 0 28px' }}>Warehouse Intelligence System</p>
          <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'16px', fontWeight:'600', color:'rgba(56,189,248,0.7)', letterSpacing:'0.12em' }}>
            Welcome back<span style={{ animation:'blink 1s step-end infinite' }}>_</span>
          </div>
        </div>
      )}

      {/* ── LOGIN PHASE ── */}
      {phase === 'login' && (
        <div style={{ position:'relative', zIndex:10, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'fadeUp 0.5s ease' }}>

          {/* Logo + title */}
          <div style={{ textAlign:'center', marginBottom:'32px' }}>
            <div style={{ width:'80px', height:'80px', borderRadius:'24px', background:'linear-gradient(135deg,#060F20,#0D2040,#1A3A6E)', border:'1px solid rgba(56,189,248,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', animation:'glowPulse 3s ease-in-out infinite, logoBreathe 3s ease-in-out infinite' }}>
              <HoopLogo />
            </div>
            <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:'32px', fontWeight:'900', color:'#fff', letterSpacing:'0.25em', margin:'0 0 6px', textShadow:'0 0 30px rgba(56,189,248,0.35)' }}>HOOP</h1>
            <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'11px', color:'rgba(56,189,248,0.45)', letterSpacing:'0.2em', textTransform:'uppercase', margin:0 }}>Warehouse Packing System</p>
          </div>

          {/* Glass card */}
          <div style={{ position:'relative', width:'100%', maxWidth:'400px', padding:'0 20px' }}>
            {/* Outer glow */}
            <div style={{ position:'absolute', inset:'-1px', borderRadius:'18px', boxShadow:'0 0 50px rgba(56,189,248,0.15),0 0 100px rgba(56,189,248,0.06)', pointerEvents:'none', animation:'glowPulse 4s ease-in-out infinite' }} />

            {/* Bottom edge glow */}
            <div style={{ position:'absolute', bottom:'19px', left:'30%', right:'30%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(56,189,248,0.6),transparent)', boxShadow:'0 0 12px rgba(56,189,248,0.4)', pointerEvents:'none' }} />

            <div style={{
              position:'relative',
              background:'rgba(4,12,30,0.8)',
              backdropFilter:'blur(32px)',
              WebkitBackdropFilter:'blur(32px)',
              border:'1px solid rgba(56,189,248,0.2)',
              borderRadius:'16px',
              padding:'28px 24px',
              boxShadow:'0 0 40px rgba(56,189,248,0.08), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(56,189,248,0.04)',
              animation:'borderFlow 4s ease-in-out infinite',
              overflow:'hidden',
            }}>
              {/* Corner brackets */}
              <div style={{ position:'absolute', top:'10px', left:'10px', width:'14px', height:'14px', borderTop:'1.5px solid rgba(56,189,248,0.5)', borderLeft:'1.5px solid rgba(56,189,248,0.5)' }} />
              <div style={{ position:'absolute', top:'10px', right:'10px', width:'14px', height:'14px', borderTop:'1.5px solid rgba(56,189,248,0.5)', borderRight:'1.5px solid rgba(56,189,248,0.5)' }} />
              <div style={{ position:'absolute', bottom:'10px', left:'10px', width:'14px', height:'14px', borderBottom:'1.5px solid rgba(56,189,248,0.5)', borderLeft:'1.5px solid rgba(56,189,248,0.5)' }} />
              <div style={{ position:'absolute', bottom:'10px', right:'10px', width:'14px', height:'14px', borderBottom:'1.5px solid rgba(56,189,248,0.5)', borderRight:'1.5px solid rgba(56,189,248,0.5)' }} />
              {/* Inner scan line */}
              <div style={{ position:'absolute', left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(56,189,248,0.08),transparent)', animation:'scanLine 4s linear infinite', pointerEvents:'none' }} />

              {/* Status text */}
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'20px' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#38BDF8', boxShadow:'0 0 6px #38BDF8', animation:'pulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontFamily:"'Rajdhani',monospace", fontSize:'11px', color:'rgba(56,189,248,0.6)', letterSpacing:'0.12em', fontWeight:'600', animation:'statusFade 2.2s ease-in-out infinite' }}>
                  {STATUS_LINES[statusIdx]}
                </span>
              </div>

              <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:'10px', fontWeight:'700', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(56,189,248,0.3)', marginBottom:'18px' }}>
                Authentication Required
              </p>

              {/* Username */}
              <div style={{ position:'relative', marginBottom:'10px' }}>
                <div style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(56,189,248,0.45)" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input className="hoop-input" type="text" placeholder="USERNAME"
                  value={username} onChange={e => setUsername(e.target.value)}
                  disabled={isLoading} autoComplete="off" />
              </div>

              {/* Password */}
              <div style={{ position:'relative', marginBottom:'22px' }}>
                <div style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(56,189,248,0.45)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input className="hoop-input" type="password" placeholder="PASSWORD"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  disabled={isLoading} />
              </div>

              <button className="hoop-btn" onClick={handleSubmit}
                disabled={isLoading || !username.trim() || !password.trim()}>
                MASUK →
              </button>
            </div>
          </div>

          <p style={{ marginTop:'20px', fontFamily:"'Rajdhani',monospace", fontSize:'10px', color:'rgba(56,189,248,0.18)', letterSpacing:'0.1em' }}>
            HOOP © {new Date().getFullYear()} · WAREHOUSE INTELLIGENCE
          </p>
        </div>
      )}

      {/* ── AUTH PHASE ── */}
      {phase === 'auth' && (
        <div style={{ position:'relative', zIndex:10, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px', animation:'fadeUp 0.3s ease' }}>
          {/* Spinning ring */}
          <div style={{ position:'relative', width:'100px', height:'100px' }}>
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid rgba(56,189,248,0.1)', boxShadow:'0 0 20px rgba(56,189,248,0.1)' }} />
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid transparent', borderTopColor:'#38BDF8', animation:'spin 0.8s linear infinite', boxShadow:'0 0 16px rgba(56,189,248,0.4)' }} />
            <div style={{ position:'absolute', inset:'12px', borderRadius:'50%', border:'1px solid rgba(56,189,248,0.2)', borderBottomColor:'#38BDF8', animation:'spin 1.2s linear infinite reverse' }} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <HoopLogo />
            </div>
          </div>

          <div style={{ textAlign:'center' }}>
            {AUTH_LINES.slice(0, authStep).map((line, i) => (
              <div key={i} style={{ fontFamily:"'Rajdhani',monospace", fontSize:'13px', fontWeight:'600', letterSpacing:'0.12em', color: i === authStep - 1 ? '#38BDF8' : 'rgba(56,189,248,0.35)', marginBottom:'4px', animation:'fadeUp 0.3s ease' }}>
                {i === authStep - 1 && <span style={{ marginRight:'6px', animation:'blink 0.5s step-end infinite' }}>▶</span>}
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
