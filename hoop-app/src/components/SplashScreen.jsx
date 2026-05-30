import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState('enter'); // enter → show → exit

  useEffect(() => {
    // Phase 1: elemen muncul (pop in)
    const t1 = setTimeout(() => setPhase('show'), 50);
    // Phase 2: mulai fade out setelah 2.2 detik
    const t2 = setTimeout(() => setPhase('exit'), 2200);
    // Phase 3: panggil onDone setelah animasi exit selesai (600ms)
    const t3 = setTimeout(onDone, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const visible = phase === 'show';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #020914 0%, #061428 55%, #0A1F3A 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      // Soft fade out keseluruhan
      opacity: phase === 'exit' ? 0 : 1,
      transition: phase === 'exit' ? 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
    }}>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(59,130,196,0.15) 0%, transparent 70%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }} />

      {/* Logo — soft pop */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.72) translateY(16px)',
        transition: visible
          ? 'opacity 0.55s cubic-bezier(0.34,1.4,0.64,1), transform 0.55s cubic-bezier(0.34,1.4,0.64,1)'
          : 'none',
        marginBottom: '22px',
        filter: visible ? 'drop-shadow(0 0 40px rgba(59,130,196,0.55))' : 'none',
      }}>
        <img
          src="/logo-128.png"
          width="100" height="100"
          style={{ borderRadius: '26px', display: 'block' }}
          alt="Packer"
        />
      </div>

      {/* App name — slight delay untuk stagger effect */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: visible
          ? 'opacity 0.5s ease 0.12s, transform 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.12s'
          : 'none',
        fontSize: '30px', fontWeight: '800',
        color: '#fff', letterSpacing: '0.06em',
        fontFamily: "'Inter', system-ui, sans-serif",
        marginBottom: '8px',
      }}>
        Packer
      </div>

      {/* Subtitle */}
      <div style={{
        opacity: visible ? 0.38 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: visible
          ? 'opacity 0.5s ease 0.22s, transform 0.5s ease 0.22s'
          : 'none',
        fontSize: '11px', fontWeight: '500',
        color: 'rgba(148,185,230,0.9)',
        letterSpacing: '0.22em', textTransform: 'uppercase',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        Warehouse Intelligence
      </div>
    </div>
  );
};

export default SplashScreen;
