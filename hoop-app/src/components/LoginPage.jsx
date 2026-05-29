import React, { useState, useEffect, useRef } from 'react';

const HoopLogo = () => (
  <img src="data:image/png;base64,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" width="56" height="56" style={{borderRadius:"16px",display:"block"}} alt="Packer" />
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
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  // ── Floating sparkle particles ───────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r:  Math.random() * 1.3 + 0.3,
      a:  Math.random() * 0.35 + 0.08,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulse = p.a * (0.5 + 0.5 * Math.sin(t + p.phase));
        const glowR = p.r * 4;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grad.addColorStop(0, `rgba(56,189,248,${pulse})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();

        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,235,255,${Math.min(pulse * 2.5, 0.9)})`;
        ctx.fill();

        if (p.r > 1) {
          ctx.strokeStyle = `rgba(56,189,248,${pulse * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x - p.r * 3.5, p.y); ctx.lineTo(p.x + p.r * 3.5, p.y);
          ctx.moveTo(p.x, p.y - p.r * 3.5); ctx.lineTo(p.x, p.y + p.r * 3.5);
          ctx.stroke();
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafRef.current); };
  }, []);

  // FIX: Welcome delay dikurangi dari 2000ms → 800ms, fallback dari 600ms → 0ms
  useEffect(() => {
    if (phase !== 'welcome') return;
    const t = setTimeout(() => setPhase('login'), showWelcome ? 800 : 0);
    return () => clearTimeout(t);
  }, [phase, showWelcome]);

  // FIX: Hapus artificial auth animation delay — langsung panggil onLogin
  const handleSubmit = () => {
    if (!username.trim() || !password.trim() || isLoading) return;
    onLogin(username.trim(), password.trim());
  };

  return (
    <div style={{ minHeight:'100dvh', background:'#020914', overflow:'auto', fontFamily:"'Inter',system-ui,-apple-system,sans-serif", position:'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp   {from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
        @keyframes blink    {0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin     {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes topGlow  {0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes logoPulse{0%,100%{box-shadow:0 0 22px rgba(56,189,248,0.28),0 0 44px rgba(56,189,248,0.1)}50%{box-shadow:0 0 40px rgba(56,189,248,0.5),0 0 80px rgba(56,189,248,0.2)}}
        @keyframes cardGlow {0%,100%{box-shadow:0 0 40px rgba(56,189,248,0.07),0 32px 64px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.08)}50%{box-shadow:0 0 70px rgba(56,189,248,0.16),0 32px 64px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.12)}}
        @keyframes dotPulse {0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}
        .hi{width:100%;height:50px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:11px;padding:0 16px 0 44px;color:#fff;font-size:14px;font-weight:400;outline:none;transition:all 0.2s;backdrop-filter:blur(8px);font-family:'Inter',sans-serif;}
        .hi::placeholder{color:rgba(255,255,255,0.28);}
        .hi:focus{border-color:rgba(56,189,248,0.45);background:rgba(56,189,248,0.05);box-shadow:0 0 0 3px rgba(56,189,248,0.07);}
        .hb{width:100%;height:50px;border:1px solid rgba(56,189,248,0.45);border-radius:11px;cursor:pointer;font-size:14px;font-weight:600;font-family:'Inter',sans-serif;letter-spacing:0.04em;color:#fff;background:linear-gradient(135deg,rgba(14,55,140,0.7),rgba(56,189,248,0.45));box-shadow:0 0 20px rgba(56,189,248,0.22),inset 0 1px 0 rgba(255,255,255,0.1);transition:all 0.2s;}
        .hb:hover:not(:disabled){box-shadow:0 0 36px rgba(56,189,248,0.38);transform:translateY(-1px);}
        .hb:disabled{opacity:0.35;cursor:not-allowed;}
      `}</style>

      {/* Canvas sparkles */}
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />

      {/* Ambient glows */}
      <div style={{ position:'fixed', top:'-15%', left:'50%', transform:'translateX(-50%)', width:'650px', height:'460px', borderRadius:'50%', background:'radial-gradient(circle,rgba(14,55,150,0.4) 0%,rgba(56,189,248,0.05) 45%,transparent 70%)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-18%', right:'-8%', width:'400px', height:'340px', borderRadius:'50%', background:'radial-gradient(circle,rgba(14,55,150,0.18) 0%,transparent 65%)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'fixed', top:'30%', left:'-8%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(56,189,248,0.05) 0%,transparent 65%)', zIndex:0, pointerEvents:'none' }} />

      {/* ── WELCOME ── */}
      {phase === 'welcome' && (
        <div style={{ position:'relative', zIndex:10, minHeight:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'fadeIn 0.5s ease' }}>
          <div style={{ width:'80px', height:'80px', borderRadius:'24px', background:'rgba(8,20,50,0.5)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', animation:'logoPulse 2.5s ease-in-out infinite' }}>
            <HoopLogo />
          </div>
          <h1 style={{ fontSize:'32px', fontWeight:'800', color:'#fff', letterSpacing:'-0.5px', margin:'0 0 6px', textShadow:'0 0 30px rgba(56,189,248,0.3)' }}>
            {showWelcome ? 'Welcome to Packer' : 'Packer'}
          </h1>
          <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.4)', margin:0 }}>Warehouse Packing System</p>
          {showWelcome && (
            <div style={{ marginTop:'20px', display:'flex', alignItems:'center', gap:'7px', background:'rgba(56,189,248,0.06)', border:'1px solid rgba(56,189,248,0.14)', borderRadius:'20px', padding:'6px 16px' }}>
              <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#38BDF8', boxShadow:'0 0 6px #38BDF8', animation:'dotPulse 1.6s ease-in-out infinite' }} />
              <span style={{ fontSize:'12px', fontWeight:'500', color:'rgba(56,189,248,0.65)', letterSpacing:'0.06em' }}>System Online<span style={{ animation:'blink 1s step-end infinite' }}>_</span></span>
            </div>
          )}
        </div>
      )}

      {/* ── LOGIN ── */}
      {phase === 'login' && (
        <div style={{ position:'relative', zIndex:10, minHeight:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px', animation:'fadeUp 0.5s ease' }}>
          <div style={{ position:'relative', width:'100%', maxWidth:'400px' }}>
            <div style={{ position:'absolute', top:'-2px', left:'50%', transform:'translateX(-50%)', width:'150px', height:'2px', background:'linear-gradient(90deg,transparent,rgba(56,189,248,0.85),transparent)', boxShadow:'0 0 16px rgba(56,189,248,0.6),0 0 32px rgba(56,189,248,0.25)', borderRadius:'2px', animation:'topGlow 3.5s ease-in-out infinite', zIndex:2 }} />
            <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(48px)', WebkitBackdropFilter:'blur(48px)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'22px', padding:'34px 26px 28px', animation:'cardGlow 4s ease-in-out infinite', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:'12%', right:'12%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', bottom:0, left:'22%', right:'22%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(56,189,248,0.35),transparent)', boxShadow:'0 0 8px rgba(56,189,248,0.2)', pointerEvents:'none' }} />
              <div style={{ textAlign:'center', marginBottom:'22px' }}>
                <div style={{ width:'56px', height:'56px', borderRadius:'18px', background:'rgba(6,18,48,0.7)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', animation:'logoPulse 3s ease-in-out infinite' }}>
                  <HoopLogo />
                </div>
                <h1 style={{ fontSize:'24px', fontWeight:'700', color:'#fff', letterSpacing:'-0.3px', margin:'0 0 5px', textShadow:'0 0 24px rgba(56,189,248,0.2)' }}>Welcome</h1>
                <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.38)', margin:'0 0 14px', fontWeight:'400' }}>Sign in to your warehouse account</p>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:'rgba(56,189,248,0.06)', border:'1px solid rgba(56,189,248,0.12)', borderRadius:'20px', padding:'4px 12px' }}>
                  <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#38BDF8', boxShadow:'0 0 6px #38BDF8', animation:'dotPulse 1.8s ease-in-out infinite' }} />
                  <span style={{ fontSize:'11px', fontWeight:'600', color:'rgba(56,189,248,0.6)', letterSpacing:'0.08em' }}>SYSTEM ONLINE</span>
                </div>
              </div>
              <div style={{ position:'relative', marginBottom:'10px' }}>
                <div style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input className="hi" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} disabled={isLoading} autoComplete="off" />
              </div>
              <div style={{ position:'relative', marginBottom:'22px' }}>
                <div style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input className="hi" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} disabled={isLoading} />
              </div>

              {/* FIX: Button sekarang menampilkan loading spinner dari isLoading prop (dari App.jsx) */}
              <button className="hb" onClick={handleSubmit} disabled={isLoading || !username.trim() || !password.trim()}>
                {isLoading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      style={{ animation:'spin 0.8s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Masuk...
                  </span>
                ) : 'Masuk →'}
              </button>
            </div>
          </div>
          <p style={{ marginTop:'16px', fontSize:'11px', color:'rgba(255,255,255,0.14)', letterSpacing:'0.05em' }}>Packer © {new Date().getFullYear()} · Warehouse Intelligence</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
