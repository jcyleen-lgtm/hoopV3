import React, { useState, useRef, useEffect } from 'react';
import { useScanner } from '../hooks/useScanner';
import { NAVY, RADIUS, TYPE, FONT, glassCard } from '../theme';

const ICONS = {
  CheckCircle:   ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  AlertTriangle: ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  XCircle:       ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  Clock:         ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Loader:        ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
  AlertCircle:   ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Camera:        ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Keyboard:      ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6.01" y2="10"/><line x1="10" y1="10" x2="10.01" y2="10"/><line x1="14" y1="10" x2="14.01" y2="10"/><line x1="18" y1="10" x2="18.01" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>,
  Send:          ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
};

const STATUS_MAP = {
  'READY':      { label: 'Siap Scan',  color: '#F59E0B', icon: 'Clock',         bg: 'rgba(245,158,11,0.08)'  },
  'SAVING...':  { label: 'Menyimpan…', color: '#5B9BD5', icon: 'Loader',        bg: 'rgba(91,155,213,0.08)'  },
  'SUCCESS!':   { label: 'Berhasil!',  color: '#22C55E', icon: 'CheckCircle',   bg: 'rgba(34,197,94,0.08)'   },
  'DUPLICATE!': { label: 'Duplicate!', color: '#F59E0B', icon: 'AlertTriangle', bg: 'rgba(245,158,11,0.08)'  },
  'ERROR!':     { label: 'Error',      color: '#EF4444', icon: 'XCircle',       bg: 'rgba(239,68,68,0.08)'   },
  'GAGAL!':     { label: 'Gagal',      color: '#EF4444', icon: 'XCircle',       bg: 'rgba(239,68,68,0.08)'   },
  'QUEUED':     { label: 'Tersimpan lokal', color: '#F59E0B', icon: 'Clock',     bg: 'rgba(245,158,11,0.08)'  },
};
const getCfg = (s) => STATUS_MAP[s] ?? { label: s, color: '#EF4444', icon: 'AlertCircle', bg: 'rgba(239,68,68,0.08)' };

const CAM_OPTIONS = ['CAM 1', 'CAM 2', 'CAM 3', 'CAM 4', 'CAM 5', 'CAM 6'];

const ScannerCamera = ({ user, active, colors, isDesktop, theme }) => {
  const [mode, setMode]         = useState('camera');
  const [cam, setCam]           = useState(() => localStorage.getItem('hoop_cam') || '');
  const [manualInput, setManualInput] = useState('');
  const manualRef = useRef(null);
  const isLight = theme === 'light';

  const { status, lastScan, scanHistory, cameraError, sendScanData, online, pendingCount, syncQueue } =
    useScanner({ user, cam, active, mode });

  useEffect(() => { if (cam) localStorage.setItem('hoop_cam', cam); }, [cam]);
  useEffect(() => {
    if (mode === 'manual') {
      // autofocus lebih cepat
      const t = setTimeout(() => manualRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [mode]);

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    sendScanData(manualInput.trim());
    setManualInput('');
    // autofocus on mount
    const tf = setTimeout(() => manualRef.current?.focus(), 50);
    return () => clearTimeout(tf);
  };

  if (!cam) return <CamPicker colors={colors} onSelect={setCam} isLight={isLight} theme={theme} />;

  const cfg  = getCfg(status);
  const Icon = ICONS[cfg.icon] || ICONS.AlertCircle;
  const busy = status === 'SAVING...';

  if (isDesktop) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        <div>
          <ControlBar cam={cam} setCam={setCam} mode={mode} setMode={setMode} colors={colors} isLight={isLight} theme={theme} online={online} pendingCount={pendingCount} syncQueue={syncQueue} />
          {mode === 'camera'
            ? <CameraBox cameraError={cameraError} colors={colors} isLight={isLight} theme={theme} />
            : <ManualBox value={manualInput} onChange={setManualInput} onKey={(e) => e.key === 'Enter' && handleManualSubmit()} onSubmit={handleManualSubmit} inputRef={manualRef} colors={colors} busy={busy} isLight={isLight} theme={theme} />
          }
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <StatusBanner cfg={cfg} Icon={Icon} lastScan={lastScan} isLight={isLight} theme={theme} />
          <HistoryList history={scanHistory} colors={colors} isLight={isLight} theme={theme} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '480px', margin: '0 auto' }}>
      <ControlBar cam={cam} setCam={setCam} mode={mode} setMode={setMode} colors={colors} isLight={isLight} theme={theme} online={online} pendingCount={pendingCount} syncQueue={syncQueue} />
      <StatusBanner cfg={cfg} Icon={Icon} lastScan={lastScan} compact isLight={isLight} theme={theme} />
      {mode === 'camera'
        ? <CameraBox cameraError={cameraError} colors={colors} compact isLight={isLight} theme={theme} />
        : <ManualBox value={manualInput} onChange={setManualInput} onKey={(e) => e.key === 'Enter' && handleManualSubmit()} onSubmit={handleManualSubmit} inputRef={manualRef} colors={colors} busy={busy} compact isLight={isLight} theme={theme} />
      }
      {scanHistory.length > 0 && <HistoryList history={scanHistory} colors={colors} compact isLight={isLight} theme={theme} />}
    </div>
  );
};

const NetworkBadge = ({ online, pendingCount, syncQueue, colors, isLight }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
    <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'20px',
      background: online ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
      border: `1px solid ${online ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
    }}>
      <div style={{ width:'6px', height:'6px', borderRadius:'50%',
        background: online ? '#22C55E' : '#EF4444',
        boxShadow: `0 0 6px ${online ? '#22C55E' : '#EF4444'}`,
      }} />
      <span style={{ fontSize:'10px', fontWeight:'700', color: online ? '#22C55E' : '#EF4444', letterSpacing:'0.06em' }}>
        {online ? 'ONLINE' : 'OFFLINE'}
      </span>
    </div>
    {pendingCount > 0 && (
      <button onClick={syncQueue} style={{
        display:'flex', alignItems:'center', gap:'4px', padding:'4px 10px', borderRadius:'20px',
        background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)',
        cursor:'pointer', fontFamily:'inherit',
      }}>
        <span style={{ fontSize:'10px', fontWeight:'700', color:'#F59E0B' }}>⏳ {pendingCount} pending</span>
      </button>
    )}
  </div>
);

const ControlBar = ({ cam, setCam, mode, setMode, colors, isLight, theme, online, pendingCount, syncQueue }) => {
  const card = glassCard(theme);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
      <button
        onClick={() => setCam('')}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          ...glassCard(theme, '59,130,196'),
          borderRadius: RADIUS.pill, padding: '6px 14px',
          color: colors.text, fontSize: TYPE.sm, fontWeight: '700',
          cursor: 'pointer', fontFamily: FONT,
          backdropFilter: isLight ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isLight ? 'blur(12px)' : 'none',
        }}
      >
        <ICONS.Camera color={colors.brand} size={13} />
        <span style={{ color: colors.brand }}>{cam}</span>
        <span style={{ opacity: 0.4, fontSize: '10px', color: colors.text }}>▼</span>
      </button>

      <div style={{
        display: 'flex', gap: '3px',
        ...glassCard(theme),
        borderRadius: RADIUS.pill, padding: '3px',
        backdropFilter: isLight ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isLight ? 'blur(12px)' : 'none',
      }}>
        {[{ key: 'camera', Icon: ICONS.Camera, label: 'Kamera' }, { key: 'manual', Icon: ICONS.Keyboard, label: 'Scanner' }].map(({ key, Icon, label }) => {
          const active = mode === key;
          return (
            <button key={key} onClick={() => setMode(key)} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 12px', borderRadius: RADIUS.pill,
              background: active
                ? isLight ? 'rgba(59,130,196,0.15)' : NAVY[800]
                : 'transparent',
              color: active ? colors.brand : colors.subText,
              border: active ? `1px solid rgba(59,130,196,${isLight ? '0.2' : '0.3'})` : '1px solid transparent',
              boxShadow: active ? `0 0 10px rgba(59,130,196,${isLight ? '0.12' : '0.2'})` : 'none',
              cursor: 'pointer',
              fontSize: TYPE.sm, fontWeight: active ? '700' : '500',
              fontFamily: FONT, transition: 'all 0.15s',
            }}>
              <Icon color={active ? colors.brand : colors.subText} size={13} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
    <NetworkBadge online={online} pendingCount={pendingCount} syncQueue={syncQueue} colors={colors} isLight={isLight} />
  );
};

const StatusBanner = ({ cfg, Icon, lastScan, compact, isLight, theme }) => {
  const colorRgb = cfg.color === '#22C55E' ? '34,197,94'
    : cfg.color === '#F59E0B' ? '245,158,11'
    : cfg.color === '#5B9BD5' ? '91,155,213'
    : '239,68,68';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: isLight ? `rgba(255,255,255,0.55)` : cfg.bg,
      backdropFilter: isLight ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: isLight ? 'blur(16px)' : 'none',
      border: `1px solid rgba(${colorRgb},${isLight ? '0.25' : '0.2'})`,
      borderRadius: RADIUS.md,
      padding: compact ? '8px 12px' : '12px 16px',
      borderLeft: `3px solid ${cfg.color}`,
      minHeight: compact ? '44px' : '56px',
      transition: 'all 0.2s ease',
      boxShadow: `0 0 16px rgba(${colorRgb},${isLight ? '0.1' : '0.08'})${isLight ? ', inset 0 1px 0 rgba(255,255,255,0.9)' : ''}`,
    }}>
      <Icon size={compact ? 16 : 20} color={cfg.color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: compact ? TYPE.sm : TYPE.base, fontWeight: '800', color: cfg.color, letterSpacing: '0.05em', textShadow: `0 0 8px rgba(${colorRgb},0.4)` }}>
          {cfg.label.toUpperCase()}
        </div>
        {lastScan && (
          <div style={{ fontSize: TYPE.xs, color: cfg.color, opacity: 0.75, marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lastScan}
          </div>
        )}
      </div>
    </div>
  );
};

const CameraBox = ({ cameraError, colors, compact, isLight, theme }) => (
  <div style={{
    width: '100%', borderRadius: RADIUS.lg, overflow: 'hidden',
    backgroundColor: '#000',
    border: `1px solid rgba(59,130,196,${isLight ? '0.25' : '0.2'})`,
    boxShadow: `0 0 20px rgba(59,130,196,${isLight ? '0.1' : '0.08'})`,
    position: 'relative', minHeight: compact ? '200px' : '260px',
  }}>
    <div id="reader" style={{ width: '100%' }} />
    {cameraError && (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.88)' }}>
        <ICONS.AlertCircle color="#EF4444" size={28} />
        <span style={{ color: '#fff', fontSize: TYPE.sm, textAlign: 'center', padding: '0 20px' }}>{cameraError}</span>
      </div>
    )}
  </div>
);

const ManualBox = ({ value, onChange, onKey, onSubmit, inputRef, colors, busy, compact, isLight, theme }) => (
  <div style={{
    borderRadius: RADIUS.lg,
    ...glassCard(theme, '59,130,196'),
    backdropFilter: isLight ? 'blur(16px)' : 'none',
    WebkitBackdropFilter: isLight ? 'blur(16px)' : 'none',
    minHeight: compact ? '100px' : '160px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '20px 16px', gap: '12px',
  }}>
    <p style={{ margin: 0, fontSize: TYPE.sm, color: colors.subText, textAlign: 'center' }}>
      Scan barcode dengan alat scanner — otomatis terkirim.
    </p>
    <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
      <input
        ref={inputRef} value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKey} disabled={busy}
        placeholder="Nomor Pesanan…"
        style={{
          flex: 1, height: '44px', padding: '0 14px',
          background: isLight ? 'rgba(255,255,255,0.5)' : 'rgba(8,18,32,0.8)',
          backdropFilter: isLight ? 'blur(10px)' : 'none',
          border: `1px solid rgba(59,130,196,${isLight ? '0.2' : '0.15'})`,
          borderRadius: RADIUS.md, fontSize: TYPE.base,
          color: colors.text, fontFamily: FONT, outline: 'none',
          opacity: busy ? 0.6 : 1,
          boxShadow: isLight ? 'inset 0 1px 0 rgba(255,255,255,0.8)' : 'none',
        }}
        autoComplete="off"
        autoFocus
      />
      <button onClick={onSubmit} disabled={busy || !value.trim()} style={{
        height: '44px', padding: '0 14px',
        background: value.trim() && !busy
          ? 'linear-gradient(135deg,#1A3A5C,#3B82C4)'
          : isLight ? 'rgba(255,255,255,0.4)' : 'rgba(8,18,32,0.6)',
        border: `1px solid rgba(59,130,196,${value.trim() && !busy ? '0.4' : '0.1'})`,
        borderRadius: RADIUS.md, cursor: busy || !value.trim() ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center',
        boxShadow: value.trim() && !busy ? '0 0 12px rgba(59,130,196,0.3)' : 'none',
      }}>
        <ICONS.Send color={value.trim() && !busy ? '#fff' : colors.subText} size={15} />
      </button>
    </div>
  </div>
);

const CamPicker = ({ colors, onSelect, isLight, theme }) => (
  <div style={{
    maxWidth: '360px', margin: '32px auto', textAlign: 'center',
    ...glassCard(theme, '59,130,196'),
    borderRadius: RADIUS.xl, padding: '32px 24px',
    backdropFilter: isLight ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: isLight ? 'blur(20px)' : 'none',
  }}>
    {/* Top accent line */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: 'linear-gradient(90deg,rgba(59,130,196,0.7),rgba(59,130,196,0))', borderRadius: `${RADIUS.xl} ${RADIUS.xl} 0 0` }} />
    <div style={{
      width: '52px', height: '52px', borderRadius: '14px',
      background: isLight ? 'rgba(59,130,196,0.1)' : NAVY[900],
      border: `1px solid rgba(59,130,196,${isLight ? '0.2' : '0.2'})`,
      margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 16px rgba(59,130,196,0.15)',
    }}>
      <ICONS.Camera color={colors.brand} size={24} />
    </div>
    <h2 style={{ margin: '0 0 4px', fontSize: TYPE.lg, fontWeight: '800', color: colors.text }}>Pilih Kamera</h2>
    <p style={{ margin: '0 0 20px', fontSize: TYPE.sm, color: colors.subText }}>Pilih kamera CCTV kamu</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      {CAM_OPTIONS.map((c) => (
        <button key={c} onClick={() => onSelect(c)} style={{
          padding: '12px', borderRadius: RADIUS.md,
          background: isLight ? 'rgba(255,255,255,0.6)' : NAVY[900],
          backdropFilter: isLight ? 'blur(10px)' : 'none',
          border: `1px solid rgba(59,130,196,${isLight ? '0.15' : '0.12'})`,
          color: colors.text, fontSize: TYPE.base, fontWeight: '700',
          cursor: 'pointer', fontFamily: FONT,
          boxShadow: isLight ? 'inset 0 1px 0 rgba(255,255,255,0.9)' : 'none',
          transition: 'all 0.15s',
        }}>
          {c}
        </button>
      ))}
    </div>
  </div>
);

const HistoryList = ({ history, colors, compact, isLight, theme }) => (
  <div style={{
    ...glassCard(theme),
    borderRadius: RADIUS.md, overflow: 'hidden',
    backdropFilter: isLight ? 'blur(16px)' : 'none',
    WebkitBackdropFilter: isLight ? 'blur(16px)' : 'none',
  }}>
    {history.slice(0, compact ? 4 : 10).map((item, i) => (
      <div key={i} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: compact ? '7px 12px' : '10px 16px',
        borderBottom: i < Math.min(history.length, compact ? 4 : 10) - 1 ? `1px solid ${colors.borderSub}` : 'none',
        animation: i === 0 ? 'fadeSlideIn .2s ease' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.ok ? colors.success : colors.error, flexShrink: 0, boxShadow: `0 0 6px ${item.ok ? colors.success : colors.error}` }} />
          <span style={{ fontSize: TYPE.xs, color: colors.text, fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.id}</span>
        </div>
        <span style={{ fontSize: '10px', color: colors.subText, whiteSpace: 'nowrap', marginLeft: '8px' }}>{item.time}</span>
      </div>
    ))}
  </div>
);

export default ScannerCamera;
