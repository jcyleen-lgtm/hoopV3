import React, { useState, useEffect, useRef } from 'react';

const PackerLogo = () => (
  <img src="/logo-128.png" width="56" height="56" style={{borderRadius:"16px",display:"block",imageRendering:"auto"}} alt="Packer" />
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
            <PackerLogo />
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
                  <PackerLogo />
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
