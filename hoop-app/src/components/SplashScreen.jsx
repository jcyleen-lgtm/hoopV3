import React, { useEffect, useState } from 'react';

const LOGO_B64 = "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";

const SplashScreen = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('enter'); // enter | loading | exit

  useEffect(() => {
    // Phase 1: logo fade in (400ms)
    const t1 = setTimeout(() => setPhase('loading'), 400);

    // Phase 2: progress bar animates 0→100 over 1200ms
    let start = null;
    let raf;
    const animateProgress = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min((elapsed / 1200) * 100, 100);
      setProgress(Math.round(pct));
      if (pct < 100) {
        raf = requestAnimationFrame(animateProgress);
      } else {
        // Phase 3: fade out then call onDone
        setTimeout(() => setPhase('exit'), 100);
        setTimeout(onDone, 500);
      }
    };
    const t2 = setTimeout(() => {
      raf = requestAnimationFrame(animateProgress);
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(raf);
    };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #020914 0%, #061428 50%, #0A1F3A 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '0',
      opacity: phase === 'exit' ? 0 : 1,
      transition: 'opacity 0.4s ease',
    }}>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,196,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'scale(0.8) translateY(10px)' : 'scale(1) translateY(0)',
        transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        marginBottom: '20px',
      }}>
        <img
          src={`data:image/png;base64,${LOGO_B64}`}
          width="96" height="96"
          style={{ borderRadius: '24px', display: 'block', filter: 'drop-shadow(0 0 32px rgba(59,130,196,0.6))' }}
          alt="Packer"
        />
      </div>

      {/* App name */}
      <div style={{
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'translateY(8px)' : 'translateY(0)',
        transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
        fontSize: '28px', fontWeight: '800',
        color: '#fff', letterSpacing: '0.08em',
        fontFamily: "'Inter', system-ui, sans-serif",
        marginBottom: '6px',
      }}>
        Packer
      </div>

      {/* Subtitle */}
      <div style={{
        opacity: phase === 'enter' ? 0 : 0.4,
        transition: 'opacity 0.5s ease 0.2s',
        fontSize: '12px', fontWeight: '500',
        color: 'rgba(148,185,230,0.7)',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        marginBottom: '48px',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        Warehouse Intelligence
      </div>

      {/* Progress bar */}
      <div style={{
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.4s ease 0.3s',
        width: '180px',
      }}>
        <div style={{
          width: '100%', height: '3px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '999px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #3B82C4, #60A5FA)',
            borderRadius: '999px',
            boxShadow: '0 0 10px rgba(96,165,250,0.8)',
            transition: 'width 0.05s linear',
          }} />
        </div>
        <div style={{
          textAlign: 'center', marginTop: '10px',
          fontSize: '11px', color: 'rgba(148,185,230,0.35)',
          fontFamily: "'Inter', system-ui, sans-serif",
          letterSpacing: '0.05em',
        }}>
          {progress < 100 ? 'Loading...' : 'Ready'}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
