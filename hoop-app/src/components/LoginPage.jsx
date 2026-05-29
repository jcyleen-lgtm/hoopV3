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
