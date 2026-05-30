import React, { useState, useEffect, useRef } from 'react';

const PackerLogo = () => (
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
