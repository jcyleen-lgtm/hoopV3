import React, { useState, useRef, useEffect } from 'react';
import { useScanner } from '../hooks/useScanner';
import { NAVY, RADIUS, TYPE, FONT } from '../theme';

// ── Inline SVG Icons ─────────────────────────────────────────────
const ICONS = {
  CheckCircle:   ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  AlertTriangle: ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  XCircle:       ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  Clock:         ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Loader:        ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
  AlertCircle:   ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Camera:        ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Keyboard:      ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6.01" y2="10"/><line x1="10" y1="10" x2="10.01" y2="10"/><line x1="14" y1="10" x2="14.01" y2="10"/><line x1="18" y1="10" x2="18.01" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>,
  Monitor:       ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Send:          ({ color, size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
};

const STATUS_MAP = {
  'READY':        { label: 'Siap Scan',   color: '#F59E0B', icon: 'Clock'         },
  'SAVING...':    { label: 'Menyimpan…',  color: NAVY[600], icon: 'Loader'        },
  'SUCCESS!':     { label: 'Berhasil ✓',  color: '#22C55E', icon: 'CheckCircle'   },
  'DOUBLE SCAN!': { label: 'Sudah Scan!', color: '#F59E0B', icon: 'AlertTriangle' },
  'ERROR!':       { label: 'Error',       color: '#EF4444', icon: 'XCircle'       },
  'GAGAL!':       { label: 'Gagal',       color: '#EF4444', icon: 'XCircle'       },
};
const getCfg = (s) => STATUS_MAP[s] ?? { label: s, color: '#EF4444', icon: 'AlertCircle' };

// Camera options — customise to match your CCTV setup
const CAM_OPTIONS = ['CAM 1', 'CAM 2', 'CAM 3', 'CAM 4', 'CAM 5', 'CAM 6'];

const ScannerCamera = ({ user, active, colors, isDesktop }) => {
  const [mode, setMode]   = useState('camera');  // 'camera' | 'manual'
  const [cam, setCam]     = useState(() => localStorage.getItem('hoop_cam') || '');
  const [manualInput, setManualInput] = useState('');
  const manualRef         = useRef(null);

  const { status, lastScan, scanHistory, cameraError, sendScanData } =
    useScanner({ user, cam, active, mode });

  // Persist cam choice
  useEffect(() => {
    if (cam) localStorage.setItem('hoop_cam', cam);
  }, [cam]);

  // Auto-focus manual input when switching to manual
  useEffect(() => {
    if (mode === 'manual' && manualRef.current) {
      setTimeout(() => manualRef.current?.focus(), 200);
    }
  }, [mode]);

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    sendScanData(manualInput.trim());
    setManualInput('');
    if (manualRef.current) manualRef.current.focus();
  };

  const handleManualKey = (e) => {
    if (e.key === 'Enter') handleManualSubmit();
  };

  // ── Gate: must pick cam first ─────────────────────────────────
  if (!cam) {
    return <CamPicker colors={colors} onSelect={setCam} />;
  }

  return (
    <div style={{ maxWidth: isDesktop ? '100%' : '480px', margin: '0 auto' }}>
      {/* Header strip */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px', gap: '10px', flexWrap: 'wrap',
      }}>
        {/* Cam badge */}
        <button
          onClick={() => setCam('')}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: NAVY[900], border: `1.5px solid ${NAVY[700]}`,
            borderRadius: RADIUS.pill, padding: '6px 14px',
            color: '#fff', fontSize: TYPE.sm, fontWeight: '700',
            cursor: 'pointer', fontFamily: FONT,
          }}
        >
          <ICONS.Camera color="#5B9BD5" size={14} />
          {cam}
          <span style={{ opacity: 0.5, fontSize: '10px' }}>▼</span>
        </button>

        {/* Mode toggle */}
        <ModeToggle mode={mode} onChange={setMode} colors={colors} />
      </div>

      {isDesktop ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          <div>
            {mode === 'camera' ? (
              <CameraBox cameraError={cameraError} colors={colors} />
            ) : (
              <ManualBox
                value={manualInput}
                onChange={setManualInput}
                onKey={handleManualKey}
                onSubmit={handleManualSubmit}
                inputRef={manualRef}
                colors={colors}
                status={status}
              />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <StatusCard status={status} lastScan={lastScan} colors={colors} />
            <HistoryList history={scanHistory} colors={colors} />
          </div>
        </div>
      ) : (
        <>
          {mode === 'camera' ? (
            <CameraBox cameraError={cameraError} colors={colors} />
          ) : (
            <ManualBox
              value={manualInput}
              onChange={setManualInput}
              onKey={handleManualKey}
              onSubmit={handleManualSubmit}
              inputRef={manualRef}
              colors={colors}
              status={status}
            />
          )}
          <div style={{ marginTop: '14px' }}>
            <StatusCard status={status} lastScan={lastScan} colors={colors} />
          </div>
          {scanHistory.length > 0 && (
            <div style={{ marginTop: '18px' }}>
              <Label colors={colors}>Riwayat Scan</Label>
              <HistoryList history={scanHistory} colors={colors} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────

const CamPicker = ({ colors, onSelect }) => (
  <div style={{
    maxWidth: '380px', margin: '40px auto', textAlign: 'center',
    background: colors.card, border: `1px solid ${colors.border}`,
    borderRadius: RADIUS.xl, padding: '36px 28px',
  }}>
    <div style={{
      width: '56px', height: '56px', borderRadius: '16px',
      background: NAVY[900], margin: '0 auto 18px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <ICONS.Camera color="#5B9BD5" size={26} />
    </div>
    <h2 style={{ margin: '0 0 6px', fontSize: TYPE.lg, fontWeight: '800', color: colors.text }}>
      Pilih Kamera
    </h2>
    <p style={{ margin: '0 0 24px', fontSize: TYPE.sm, color: colors.subText }}>
      Setiap sesi, pilih kamera CCTV yang kamu gunakan
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
      {CAM_OPTIONS.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          style={{
            padding: '14px', borderRadius: RADIUS.md,
            background: NAVY[900], border: `1.5px solid ${NAVY[700]}`,
            color: '#fff', fontSize: TYPE.base, fontWeight: '700',
            cursor: 'pointer', fontFamily: FONT,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.borderColor = NAVY[600]}
          onMouseLeave={e => e.target.style.borderColor = NAVY[700]}
        >
          {c}
        </button>
      ))}
    </div>
  </div>
);

const ModeToggle = ({ mode, onChange, colors }) => (
  <div style={{
    display: 'flex', gap: '4px',
    background: colors.surface, borderRadius: RADIUS.pill,
    padding: '4px', border: `1px solid ${colors.border}`,
  }}>
    {[
      { key: 'camera', Icon: ICONS.Camera,   label: 'Kamera' },
      { key: 'manual', Icon: ICONS.Keyboard, label: 'Scanner' },
    ].map(({ key, Icon, label }) => {
      const active = mode === key;
      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: RADIUS.pill,
            background: active ? NAVY[900] : 'transparent',
            color: active ? '#fff' : colors.subText,
            border: 'none', cursor: 'pointer',
            fontSize: TYPE.sm, fontWeight: active ? '700' : '500',
            fontFamily: FONT, transition: 'all 0.15s',
          }}
        >
          <Icon color={active ? '#5B9BD5' : colors.subText} size={14} />
          {label}
        </button>
      );
    })}
  </div>
);

const CameraBox = ({ cameraError, colors }) => (
  <div style={{
    width: '100%', borderRadius: RADIUS.lg, overflow: 'hidden',
    backgroundColor: '#000', border: `1.5px solid ${colors.borderMid}`,
    position: 'relative', minHeight: '220px',
  }}>
    <div id="reader" style={{ width: '100%' }} />
    {cameraError && (
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '10px', backgroundColor: 'rgba(0,0,0,0.88)',
      }}>
        <ICONS.AlertCircle color="#EF4444" size={30} />
        <span style={{ color: '#fff', fontSize: TYPE.sm, textAlign: 'center', padding: '0 20px' }}>
          {cameraError}
        </span>
      </div>
    )}
  </div>
);

const ManualBox = ({ value, onChange, onKey, onSubmit, inputRef, colors, status }) => {
  const busy = status === 'SAVING...';
  return (
    <div style={{
      borderRadius: RADIUS.lg, overflow: 'hidden',
      border: `1.5px solid ${colors.borderMid}`,
      background: colors.card, minHeight: '220px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '28px 24px', gap: '16px',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px',
        background: NAVY[900], display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ICONS.Monitor color="#5B9BD5" size={22} />
      </div>
      <p style={{ margin: 0, fontSize: TYPE.sm, color: colors.subText, textAlign: 'center' }}>
        Mode Scanner USB/Alat.<br/>
        <span style={{ fontWeight: '600', color: colors.text }}>Scan atau ketik</span> Nomor Pesanan lalu Enter.
      </p>
      <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKey}
          disabled={busy}
          placeholder="Nomor Pesanan / Barcode…"
          style={{
            flex: 1, height: '46px', padding: '0 14px',
            background: colors.surface, border: `1.5px solid ${colors.border}`,
            borderRadius: RADIUS.md, fontSize: TYPE.base,
            color: colors.text, fontFamily: FONT, outline: 'none',
            opacity: busy ? 0.6 : 1,
          }}
          autoComplete="off"
        />
        <button
          onClick={onSubmit}
          disabled={busy || !value.trim()}
          style={{
            height: '46px', padding: '0 16px',
            background: value.trim() && !busy ? NAVY[700] : colors.surface,
            border: `1.5px solid ${colors.border}`,
            borderRadius: RADIUS.md, cursor: busy || !value.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          <ICONS.Send color={value.trim() && !busy ? '#fff' : colors.subText} size={16} />
        </button>
      </div>
    </div>
  );
};

const StatusCard = ({ status, lastScan, colors }) => {
  const cfg  = getCfg(status);
  const Icon = ICONS[cfg.icon] || ICONS.AlertCircle;
  return (
    <div style={{
      backgroundColor: colors.card, border: `1px solid ${colors.border}`,
      borderRadius: RADIUS.lg, borderTop: `3px solid ${cfg.color}`, padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <Icon size={18} color={cfg.color} />
        <span style={{ fontSize: TYPE.lg, fontWeight: '700', color: cfg.color, letterSpacing: '.02em' }}>
          {cfg.label.toUpperCase()}
        </span>
      </div>
      <div style={{
        backgroundColor: colors.surface, borderRadius: RADIUS.md,
        padding: '11px 14px', fontSize: TYPE.base, fontWeight: '600',
        color: colors.text, minHeight: '42px',
        display: 'flex', alignItems: 'center', wordBreak: 'break-all',
      }}>
        {lastScan || <span style={{ color: colors.subText, fontWeight: '400' }}>Menunggu scan…</span>}
      </div>
    </div>
  );
};

const HistoryList = ({ history, colors }) => {
  if (!history.length) return (
    <div style={{
      backgroundColor: colors.card, border: `1px solid ${colors.border}`,
      borderRadius: RADIUS.lg, padding: '24px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: TYPE.sm, color: colors.subText }}>Belum ada scan sesi ini</span>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: RADIUS.lg, overflow: 'hidden' }}>
      {history.map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: i < history.length - 1 ? `1px solid ${colors.border}` : 'none',
          animation: i === 0 ? 'fadeSlideIn .2s ease' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: item.ok ? '#22C55E' : '#EF4444', flexShrink: 0 }} />
            <span style={{ fontSize: TYPE.sm, color: colors.text, fontWeight: '500', wordBreak: 'break-all' }}>{item.id}</span>
          </div>
          <span style={{ fontSize: TYPE.xs, color: colors.subText, whiteSpace: 'nowrap', marginLeft: '8px' }}>{item.time}</span>
        </div>
      ))}
    </div>
  );
};

const Label = ({ colors, children }) => (
  <div style={{
    fontSize: TYPE.xs, fontWeight: '600', letterSpacing: '.08em',
    textTransform: 'uppercase', color: colors.subText, marginBottom: '10px', fontFamily: FONT,
  }}>
    {children}
  </div>
);

export default ScannerCamera;
