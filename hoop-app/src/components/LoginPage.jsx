import React, { useState, useEffect, useRef } from 'react';

const HoopLogo = () => (
  <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="8" width="6" height="20" rx="3" fill="white" opacity="0.92"/>
    <rect x="15" y="8" width="6" height="20" rx="3" fill="white" opacity="0.92"/>
    <rect x="26" y="8" width="6" height="20" rx="3" fill="white" opacity="0.92"/>
    <rect x="4" y="16" width="28" height="5" rx="2.5" fill="white" opacity="0.32"/>
    <circle cx="18" cy="18.5" r="4" fill="#38BDF8"/>
  </svg>
);

const isNewDay = () => {
  const last = localStorage.getItem('hoop_last_visit');
  const today = new Date().toDateString();
  localStorage.setItem('hoop_last_visit', today);
  return last !== today;
};

const LoginPage = ({ onLogin, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phase, setPhase]       = useState('welcome');
  const [showWelcome]           = useState(() => isNewDay());

  const sparkCanvasRef = useRef(null);
  const rafRef         = useRef(null);

  // ── Sparkle canvas ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = sparkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const sparks = Array.from({ length: 30 }, () => ({
      x:          Math.random(),
      y:          Math.random(),
      size:       Math.random() * 1.4 + 0.3,
      opacity:    0,
      maxOpacity: Math.random() * 0.5 + 0.15,
      phase:      Math.random() * Math.PI * 2,
      speed:      Math.random() * 0.003 + 0.001,
      floatX:     (Math.random() - 0.5) * 0.006,
      floatY:     (Math.random() - 0.5) * 0.006,
      px:         0,
      py:         0,
    }));
    sparks.forEach(s => { s.px = s.x; s.py = s.y; });

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      sparks.forEach(s => {
        s.px += s.floatX;
        s.py += s.floatY;
        if (s.px < 0) s.px = 1;
        if (s.px > 1) s.px = 0;
        if (s.py < 0) s.py = 1;
        if (s.py > 1) s.py = 0;

        s.opacity = s.maxOpacity * (0.5 + 0.5 * Math.sin(t * s.speed * 200 + s.phase));

        const x = s.px * canvas.width;
        const y = s.py * canvas.height;
        const r = s.size;

        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.fillStyle   = '#38BDF8';
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        if (r > 1.2) {
          ctx.strokeStyle = 'rgba(56,189,248,0.5)';
          ctx.lineWidth   = 0.5;
          ctx.shadowBlur  = 4;
          ctx.beginPath();
          ctx.moveTo(x - r * 2.5, y); ctx.lineTo(x + r * 2.5, y);
          ctx.moveTo(x, y - r * 2.5); ctx.lineTo(x, y + r * 2.5);
          ctx.stroke();
        }
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Welcome → login ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'welcome') return;
    const t = setTimeout(() => setPhase('login'), showWelcome ? 2000 : 600);
    return () => clearTimeout(t);
  }, [phase, showWelcome]);

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!username.trim() || !password.trim() || isLoading) return;
    onLogin(username.trim(), password.trim());
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(160deg,#030D1A 0%,#020A14 50%,#040F1E 100%)',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp   {from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
        @keyframes blink    {0%,100%{opacity:1}50%{opacity:0}}
        @keyframes dotPulse {0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}
        @keyframes cardGlow {0%,100%{box-shadow:0 0 40px rgba(56,189,248,0.07),0 32px 64px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.08)}50%{box-shadow:0 0 70px rgba(56,189,248,0.16),0 32px 64px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.12)}}
        @keyframes topGlow  {0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes logoPulse{0%,100%{box-shadow:0 0 22px rgba(56,189,248,0.28),0 0 44px rgba(56,189,248,0.1)}50%{box-shadow:0 0 40px rgba(56,189,248,0.5),0 0 80px rgba(56,189,248,0.2)}}

        .hi{
          width:100%;height:48px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:11px;
          padding:0 14px 0 42px;
          color:#fff;font-size:14px;font-weight:400;
          outline:none;transition:all 0.2s;
          backdrop-filter:blur(8px);
          font-family:'Inter',sans-serif;
        }
        .hi::placeholder{color:rgba(255,255,255,0.28);}
        .hi:focus{border-color:rgba(56,189,248,0.45);background:rgba(56,189,248,0.05);box-shadow:0 0 0 3px rgba(56,189,248,0.07);}
        .hi:disabled{opacity:0.5;cursor:not-allowed;}

        .hb{
          width:100%;height:48px;
          border:1px solid rgba(56,189,248,0.45);
          border-radius:11px;cursor:pointer;
          font-size:14px;font-weight:600;
          font-family:'Inter',sans-serif;letter-spacing:0.04em;
          color:#fff;
          background:linear-gradient(135deg,rgba(14,55,140,0.7),rgba(56,189,248,0.45));
          box-shadow:0 0 20px rgba(56,189,248,0.22),inset 0 1px 0 rgba(255,255,255,0.1);
          transition:all 0.2s;position:relative;overflow:hidden;
        }
        .hb:hover:not(:disabled){box-shadow:0 0 36px rgba(56,189,248,0.38);transform:translateY(-1px);}
        .hb:disabled{opacity:0.35;cursor:not-allowed;}
        .hb::after{content:'';position:absolute;top:0;left:-120%;width:55%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);transition:left 0.5s;}
        .hb:hover:not(:disabled)::after{left:150%;}
      `}</style>

      {/* Sparkle canvas */}
      <canvas
        ref={sparkCanvasRef}
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
      />

      {/* Deep radial glows */}
      <div style={{ position:'absolute', top:'-15%', left:'50%', transform:'translateX(-50%)', width:'700px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(14,60,160,0.38) 0%,rgba(56,189,248,0.05) 45%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'450px', height:'380px', borderRadius:'50%', background:'radial-gradient(circle,rgba(14,50,130,0.22) 0%,transparent 65%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'absolute', top:'30%', left:'-8%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(56,189,248,0.05) 0%,transparent 65%)', pointerEvents:'none', zIndex:0 }} />

      {/* ── WELCOME ── */}
      {phase === 'welcome' && (
        <div style={{ position:'relative', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'fadeIn 0.5s ease' }}>
          <div style={{ width:'80px', height:'80px', borderRadius:'24px', background:'rgba(8,20,50,0.5)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', animation:'logoPulse 2.5s ease-in-out infinite' }}>
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="8" width="6" height="20" rx="3" fill="white" opacity="0.92"/>
              <rect x="15" y="8" width="6" height="20" rx="3" fill="white" opacity="0.92"/>
              <rect x="26" y="8" width="6" height="20" rx="3" fill="white" opacity="0.92"/>
              <rect x="4" y="16" width="28" height="5" rx="2.5" fill="white" opacity="0.35"/>
              <circle cx="18" cy="18.5" r="4" fill="#38BDF8"/>
            </svg>
          </div>
          <h1 style={{ fontSize:'32px', fontWeight:'800', color:'#fff', letterSpacing:'-0.5px', margin:'0 0 6px', textShadow:'0 0 30px rgba(56,189,248,0.3)' }}>
            {showWelcome ? 'Welcome to Hoop' : 'Hoop'}
          </h1>
          <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.4)', margin:0 }}>Warehouse Packing System</p>
          {showWelcome && (
            <div style={{ marginTop:'20px', display:'flex', alignItems:'center', gap:'7px', background:'rgba(56,189,248,0.06)', border:'1px solid rgba(56,189,248,0.14)', borderRadius:'20px', padding:'6px 16px' }}>
              <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#38BDF8', boxShadow:'0 0 6px #38BDF8', animation:'dotPulse 1.6s ease-in-out infinite' }} />
              <span style={{ fontSize:'12px', fontWeight:'500', color:'rgba(56,189,248,0.65)', letterSpacing:'0.06em' }}>
                System Online<span style={{ animation:'blink 1s step-end infinite' }}>_</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── LOGIN ── */}
      {phase === 'login' && (
        <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:'400px', padding:'24px 20px', animation:'fadeUp 0.6s ease' }}>

          {/* Top glow line */}
          <div style={{ position:'absolute', top:22, left:'50%', transform:'translateX(-50%)', width:'150px', height:'2px', background:'linear-gradient(90deg,transparent,rgba(56,189,248,0.85),transparent)', boxShadow:'0 0 16px rgba(56,189,248,0.6),0 0 32px rgba(56,189,248,0.25)', borderRadius:'2px', animation:'topGlow 3.5s ease-in-out infinite', zIndex:2 }} />

          {/* Glass card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(48px)',
            WebkitBackdropFilter: 'blur(48px)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '22px',
            padding: '34px 26px 28px',
            animation: 'cardGlow 4s ease-in-out infinite',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top inner reflection */}
            <div style={{ position:'absolute', top:0, left:'12%', right:'12%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)', pointerEvents:'none' }} />
            {/* Bottom edge glow */}
            <div style={{ position:'absolute', bottom:0, left:'22%', right:'22%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(56,189,248,0.4),transparent)', boxShadow:'0 0 8px rgba(56,189,248,0.2)', pointerEvents:'none' }} />

            {/* Logo + heading */}
            <div style={{ textAlign:'center', marginBottom:'22px' }}>
              <div style={{ width:'54px', height:'54px', borderRadius:'17px', background:'rgba(6,18,48,0.7)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.11)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 15px', animation:'logoPulse 3s ease-in-out infinite' }}>
                <HoopLogo />
              </div>
              <h1 style={{ fontSize:'24px', fontWeight:'700', color:'#fff', letterSpacing:'-0.3px', margin:'0 0 5px' }}>Welcome</h1>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.38)', margin:'0 0 14px', fontWeight:'400' }}>
                Sign in to your warehouse account
              </p>

              {/* System Online pill */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:'rgba(56,189,248,0.06)', border:'1px solid rgba(56,189,248,0.12)', borderRadius:'20px', padding:'4px 12px' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#38BDF8', boxShadow:'0 0 6px #38BDF8', animation:'dotPulse 1.8s ease-in-out infinite' }} />
                <span style={{ fontSize:'11px', fontWeight:'600', color:'rgba(56,189,248,0.6)', letterSpacing:'0.08em' }}>SYSTEM ONLINE</span>
              </div>
            </div>

            {/* Username */}
            <div style={{ position:'relative', marginBottom:'9px' }}>
              <div style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <input
                className="hi"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            {/* Password */}
            <div style={{ position:'relative', marginBottom:'20px' }}>
              <div style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input
                className="hi"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                disabled={isLoading}
              />
            </div>

            <button
              className="hb"
              onClick={handleSubmit}
              disabled={isLoading || !username.trim() || !password.trim()}
            >
              Masuk →
            </button>
          </div>

          <p style={{ textAlign:'center', marginTop:'14px', fontSize:'11px', color:'rgba(255,255,255,0.13)', letterSpacing:'0.05em' }}>
            Hoop © {new Date().getFullYear()} · Warehouse Intelligence
          </p>
        </div>
      )}

    </div>
  );
};
};

export default LoginPage;
