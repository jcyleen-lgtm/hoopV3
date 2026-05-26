import React, { useState, useEffect, useRef, useCallback } from 'react';
import { callScript } from '../api';
import { NAVY, FONT, RADIUS, TYPE, glassCard } from '../theme';

const GLOBAL_HOME_CACHE = {};

// ── Icons ──────────────────────────────────────────────────────
const HomeIcon = ({ color, sw }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

// ── Avatar colors per initial ──────────────────────────────────
const AVATAR_COLORS = [
  ['#92400E','#D4AF37'], ['#1E3A6E','#3B82C4'], ['#14532D','#22C55E'],
  ['#78350F','#C17F3D'], ['#4A1D96','#A855F7'], ['#7C2D12','#EF4444'],
  ['#0C4A6E','#0EA5E9'], ['#134E4A','#14B8A6'],
];
const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const rankStyle = (i) => {
  if (i === 0) return { border: '1px solid rgba(212,175,55,0.3)', glow: 'rgba(212,175,55,0.15)', line: 'linear-gradient(90deg,#D4AF37,#F59E0B)', lineGlow: 'rgba(212,175,55,0.6)' };
  if (i === 1) return { border: '1px solid rgba(158,167,177,0.2)', glow: 'rgba(158,167,177,0.1)', line: 'linear-gradient(90deg,#9EA7B1,#6B7280)', lineGlow: 'rgba(158,167,177,0.5)' };
  if (i === 2) return { border: '1px solid rgba(193,127,61,0.2)', glow: 'rgba(193,127,61,0.1)', line: 'linear-gradient(90deg,#C17F3D,#F59E0B)', lineGlow: 'rgba(193,127,61,0.5)' };
  return { border: '1px solid rgba(59,130,196,0.12)', glow: 'rgba(59,130,196,0.06)', line: 'linear-gradient(90deg,#3B82C4,#1A3A5C)', lineGlow: 'rgba(59,130,196,0.4)' };
};

// ── Animated counter ───────────────────────────────────────────
const AnimCounter = ({ target, duration = 800 }) => {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    const diff  = target - start;
    const startTime = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(start + diff * ease));
      if (p < 1) requestAnimationFrame(tick);
      else prev.current = target;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <>{val.toLocaleString('id-ID')}</>;
};

// ── Mini sparkline bars ────────────────────────────────────────
const SparkBars = ({ color, glowColor }) => {
  const heights = [35, 52, 44, 68, 58, 78, 100];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '22px', marginTop: '10px' }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: '7px', height: `${h}%`, borderRadius: '2px',
          background: i >= 5 ? color : `rgba(${glowColor},0.18)`,
          boxShadow: i >= 5 ? `0 0 6px rgba(${glowColor},0.7)` : 'none',
        }} />
      ))}
    </div>
  );
};

// ── Staff dot grid ─────────────────────────────────────────────
const StaffDots = ({ count, total = 15 }) => (
  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '10px' }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        width: '10px', height: '10px', borderRadius: '50%',
        background: i < count ? '#22C55E' : 'rgba(255,255,255,0.07)',
        boxShadow: i < count ? '0 0 8px rgba(34,197,94,0.7)' : 'none',
      }} />
    ))}
  </div>
);

// ── Feed time format ───────────────────────────────────────────
const timeAgo = (isoStr) => {
  if (!isoStr) return '';
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 60000);
  if (diff <= 1) return 'baru saja';
  if (diff < 60) return `${diff}m lalu`;
  return `${Math.floor(diff / 60)}j lalu`;
};

const FEED_COLORS = ['#22C55E','#3B82C4','#F59E0B','#A855F7','#EF4444','#14B8A6'];

// ── Desktop layout wrapper ─────────────────────────────────────
const DesktopGrid = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const HomePage = ({ user, isDesktop, onNavigate, theme = 'dark' }) => {
  const isLight = theme === 'light';
  const [todayData, setTodayData] = useState(null);
  const [activity,  setActivity]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const pollRef = useRef(null);

  const fetchHome = useCallback(async (force = false) => {
    const cacheKey = `home_today_${new Date().toDateString()}`;
    if (!force && GLOBAL_HOME_CACHE[cacheKey]) {
      setTodayData(GLOBAL_HOME_CACHE[cacheKey]);
      setLoading(false);
      return;
    }
    try {
      const [rekapan, act] = await Promise.all([
        callScript({ action: 'getRekapan', type: 'today' }),
        callScript({ action: 'getRecentActivity' }),
      ]);
      if (rekapan?.status === 'success') {
        GLOBAL_HOME_CACHE[cacheKey] = rekapan;
        setTodayData(rekapan);
      }
      if (act?.status === 'success') setActivity(act.data || []);
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHome();
    // FIX: Polling dari 15 detik → 60 detik — kurangi beban ke backend (Google Apps Script ada rate limit)
    pollRef.current = setInterval(() => fetchHome(true), 60000);
    return () => clearInterval(pollRef.current);
  }, [fetchHome]);

  const rows       = todayData?.data        || [];
  const totalScan  = todayData?.totalScan   || 0;
  const staffCount = todayData?.staffCount  || 0;
  const avgPerStaff = staffCount > 0 ? Math.round(totalScan / staffCount) : 0;
  const topStaff   = rows[0];

  // ── KPI cards config ─────────────────────────────────────────
  const kpis = [
    {
      label: 'Total Paket',
      value: totalScan,
      unit: 'pcs',
      accent: '#3B82C4',
      rgb: '59,130,196',
      extra: <SparkBars color="#3B82C4" glowColor="59,130,196" />,
    },
    {
      label: 'Staff Aktif',
      value: staffCount,
      unit: 'org',
      accent: '#22C55E',
      rgb: '34,197,94',
      extra: <StaffDots count={staffCount} />,
    },
    {
      label: 'Avg / Staff',
      value: avgPerStaff,
      unit: 'pcs',
      accent: '#F59E0B',
      rgb: '245,158,11',
      extra: null,
    },
    {
      label: 'Top Performer',
      value: null,
      nameVal: topStaff?.nama || '-',
      subVal: topStaff ? `${topStaff.total.toLocaleString('id-ID')} pcs` : '',
      accent: '#A855F7',
      rgb: '168,85,247',
      extra: null,
    },
  ];

  // ── Render ────────────────────────────────────────────────────
  const Greeting = () => {
    const hour = new Date().getHours();
    const timeLabel = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 20 ? 'Good evening' : 'Good night';
    const motivasi = hour < 5
      ? "Still grinding? You're a legend — rest when you can."
      : hour < 9
      ? "New day, new target. Let's go!"
      : hour < 12
      ? 'Morning energy. Stay sharp and keep pushing.'
      : hour < 14
      ? 'Midday focus. Finish strong.'
      : hour < 17
      ? "Afternoon grind. You've got this."
      : hour < 20
      ? "Closing shift — give it everything you've got."
      : 'Overtime mode ON. The best teams never quit.';

    return (
      <div style={{ padding: isDesktop ? '28px 36px 0' : '52px 20px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: isDesktop ? '22px' : '18px', fontWeight: '700', color: isLight ? '#0D1F40' : '#fff', letterSpacing: '-0.3px', lineHeight: 1.2, marginBottom: '5px' }}>
            {timeLabel},{' '}
            <span style={{ color: '#60A5FA', textShadow: isLight ? 'none' : '0 0 16px rgba(96,165,250,0.5)' }}>
              {user?.name || 'Admin'}
            </span>
            <span style={{ color: '#60A5FA', marginLeft: '2px' }}>.</span>
          </div>
          <div style={{
            fontSize: isDesktop ? '13px' : '12px', fontWeight: '500',
            color: isLight ? 'rgba(30,60,120,0.5)' : 'rgba(148,185,230,0.5)',
            lineHeight: 1.4, marginBottom: '10px',
            maxWidth: isDesktop ? '360px' : '240px',
          }}>
            {motivasi}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isLight ? '#16A34A' : '#22C55E', boxShadow: isLight ? '0 0 10px rgba(22,163,74,0.8)' : '0 0 10px #22C55E, 0 0 20px rgba(34,197,94,0.4)', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: isLight ? 'rgba(30,60,120,0.45)' : 'rgba(148,185,230,0.4)' }}>{staffCount} staff aktif sekarang</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: '20px', padding: '4px 10px', boxShadow: '0 0 14px rgba(239,68,68,0.12)' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 6px #EF4444', animation: 'hpBlink 1.4s ease-in-out infinite' }} />
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#F87171', letterSpacing: '0.1em' }}>LIVE</span>
          </div>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#1E3A6E,#3B82C4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#fff', border: '1.5px solid rgba(59,130,196,0.35)', boxShadow: '0 0 16px rgba(59,130,196,0.3)' }}>
            {(user?.name || 'AD').slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    );
  };

  const KpiSection = () => (
    <div style={{ padding: isDesktop ? '22px 0 0' : '22px 16px 0' }}>
      <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', color: isLight ? 'rgba(30,60,120,0.3)' : 'rgba(148,185,230,0.22)', marginBottom: '12px' }}>
        Operasional Hari Ini
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {kpis.map((k, i) => (
          <div key={i} style={{
            background: isLight ? 'rgba(255,255,255,0.5)' : 'rgba(8,18,32,0.95)',
            backdropFilter: isLight ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: isLight ? 'blur(20px)' : 'none',
            border: `1px solid rgba(${k.rgb},${isLight ? '0.22' : '0.15'})`,
            borderRadius: '20px',
            padding: '16px 15px 14px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: isLight
              ? `0 8px 24px rgba(100,140,220,0.1), 0 0 20px rgba(${k.rgb},0.1), inset 0 1px 0 rgba(255,255,255,0.95)`
              : `0 0 28px rgba(${k.rgb},0.1), inset 0 1px 0 rgba(${k.rgb},0.08)`,
          }}>
            <div style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle,rgba(${k.rgb},0.2) 0%,transparent 70%)`, top: '-20px', right: '-20px', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: `linear-gradient(90deg,rgba(${k.rgb},0.9),rgba(${k.rgb},0))`, borderRadius: '20px 20px 0 0' }} />

            <div style={{ fontSize: '9px', color: isLight ? 'rgba(30,60,120,0.4)' : 'rgba(148,185,230,0.35)', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '7px' }}>
              {k.label}
            </div>

            {k.nameVal != null ? (
              <>
                <div style={{ fontSize: '20px', fontWeight: '900', color: isLight ? '#0D1F40' : '#fff', letterSpacing: '-0.5px', lineHeight: 1, marginTop: '4px' }}>{loading ? '—' : k.nameVal}</div>
                <div style={{ fontSize: '11px', color: `rgba(${k.rgb},0.7)`, marginTop: '5px', fontWeight: '600' }}>{k.subVal}</div>
                <div style={{ fontSize: '10px', color: 'rgba(148,185,230,0.2)', marginTop: '3px' }}>🥇 #1 ranking</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '30px', fontWeight: '900', color: isLight ? '#0D1F40' : '#fff', letterSpacing: '-1.5px', lineHeight: 1 }}>
                  {loading ? '—' : <AnimCounter target={k.value} />}
                  <span style={{ fontSize: '12px', fontWeight: '400', color: isLight ? 'rgba(30,60,120,0.35)' : 'rgba(148,185,230,0.3)', marginLeft: '3px' }}>{k.unit}</span>
                </div>
                {k.extra}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const StaffSection = () => (
    <div style={{ padding: isDesktop ? '22px 0 0' : '22px 16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(148,185,230,0.22)' }}>
          Staff Performance
        </div>
        <span onClick={() => onNavigate('dashboard')} style={{ fontSize: '11px', color: isLight ? 'rgba(59,130,196,0.8)' : 'rgba(59,130,196,0.6)', fontWeight: '600', cursor: 'pointer' }}>
          Lihat semua →
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px', overflowX: isDesktop ? 'visible' : 'auto', flexWrap: isDesktop ? 'wrap' : 'nowrap', paddingBottom: isDesktop ? '0' : '6px' }}>
        {loading ? (
          [1,2,3,4].map(i => (
            <div key={i} style={{ minWidth: '110px', height: '120px', background: 'rgba(8,18,32,0.8)', border: '1px solid rgba(59,130,196,0.08)', borderRadius: '18px', flexShrink: 0 }} />
          ))
        ) : rows.slice(0, isDesktop ? 8 : 5).map((r, i) => {
          const rs = rankStyle(i);
          const [c1, c2] = avatarColor(r.nama);
          const pct = rows[0]?.total > 0 ? Math.round((r.total / rows[0].total) * 100) : 0;
          return (
            <div key={i} style={{
              minWidth: isDesktop ? '0' : '110px',
              flex: isDesktop ? '1 1 140px' : '0 0 auto',
              background: isLight ? 'rgba(255,255,255,0.5)' : 'rgba(8,18,32,0.95)',
              backdropFilter: isLight ? 'blur(16px)' : 'none',
              WebkitBackdropFilter: isLight ? 'blur(16px)' : 'none',
              border: rs.border,
              borderRadius: '18px',
              padding: '14px 12px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: isLight ? `0 6px 20px rgba(100,140,220,0.1), 0 0 16px ${rs.glow}, inset 0 1px 0 rgba(255,255,255,0.95)` : `0 0 20px ${rs.glow}, inset 0 1px 0 ${rs.glow}`,
              flexShrink: 0,
            }}>
              <div style={{ position: 'absolute', width: '60px', height: '60px', borderRadius: '50%', background: `radial-gradient(circle,${rs.glow} 0%,transparent 70%)`, top: '-15px', right: '-15px', pointerEvents: 'none' }} />
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg,${c1},${c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: '#fff', marginBottom: '9px', position: 'relative' }}>
                {r.nama.slice(0,2)}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px', borderRadius: '50%', background: '#22C55E', border: '2px solid #040810', boxShadow: '0 0 8px #22C55E' }} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: isLight ? '#0D1F40' : '#fff', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.nama}</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: isLight ? '#0D1F40' : '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
                {r.total.toLocaleString('id-ID')}<span style={{ fontSize: '9px', color: isLight ? 'rgba(30,60,120,0.35)' : 'rgba(148,185,230,0.3)', marginLeft: '2px' }}>pcs</span>
              </div>
              <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: rs.line, borderRadius: '2px', boxShadow: `0 0 8px ${rs.lineGlow}` }} />
              </div>
              <div style={{ fontSize: '9px', marginTop: '5px', fontWeight: '700', color: i === 0 ? '#D4AF37' : 'rgba(148,185,230,0.35)' }}>
                {i === 0 ? '🥇 Top' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : `#${i+1}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const FeedSection = () => (
    <div style={{ padding: isDesktop ? '22px 0 0' : '22px 16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(148,185,230,0.22)' }}>
          Live Activity
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '20px', padding: '3px 8px', boxShadow: '0 0 10px rgba(239,68,68,0.1)' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 6px #EF4444', animation: 'hpBlink 1.4s ease-in-out infinite' }} />
          <span style={{ fontSize: '9px', fontWeight: '700', color: '#F87171', letterSpacing: '0.1em' }}>REALTIME</span>
        </div>
      </div>

      <div style={{ background: isLight ? 'rgba(255,255,255,0.5)' : 'rgba(8,18,32,0.8)', backdropFilter: isLight ? 'blur(16px)' : 'none', WebkitBackdropFilter: isLight ? 'blur(16px)' : 'none', border: isLight ? '1px solid rgba(255,255,255,0.75)' : '1px solid rgba(59,130,196,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: isLight ? '0 6px 20px rgba(100,140,220,0.08), inset 0 1px 0 rgba(255,255,255,0.95)' : 'none' }}>
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} style={{ height: '52px', borderBottom: '1px solid rgba(255,255,255,0.03)', margin: '0 16px' }} />
          ))
        ) : activity.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: '12px', color: isLight ? 'rgba(30,60,120,0.35)' : 'rgba(148,185,230,0.3)' }}>
            Belum ada aktivitas hari ini
          </div>
        ) : activity.map((item, i) => {
          const dotColor = FEED_COLORS[i % FEED_COLORS.length];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '11px 16px', borderBottom: i < activity.length - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: dotColor, boxShadow: `0 0 8px ${dotColor}`, flexShrink: 0, marginTop: '5px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: isLight ? 'rgba(30,60,120,0.6)' : 'rgba(148,185,230,0.65)', lineHeight: 1.5 }}>
                  <span style={{ color: isLight ? '#0D1F40' : '#E8F4FF', fontWeight: '600' }}>{item.nama}</span>
                  {' · '}{item.cam}
                  {' · scan '}
                  <span style={{ color: isLight ? '#0D1F40' : '#E8F4FF', fontWeight: '600', fontFamily: 'monospace', fontSize: '11px' }}>{item.id}</span>
                </div>
                <div style={{ fontSize: '10px', color: isLight ? 'rgba(30,60,120,0.3)' : 'rgba(148,185,230,0.2)', marginTop: '2px' }}>{timeAgo(item.time)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes hpBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
      `}</style>

      {/* Ambient orbs */}
      <div style={{ position: 'fixed', top: 0, left: isDesktop ? 72 : 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '400px', height: '400px', top: '-150px', left: '-80px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(37,99,235,0.14) 0%,transparent 65%)' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', top: '250px', right: '-80px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(220,38,38,0.09) 0%,transparent 65%)' }} />
        <div style={{ position: 'absolute', width: '350px', height: '350px', bottom: '100px', left: '-60px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(37,99,235,0.08) 0%,transparent 65%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100%', paddingBottom: isDesktop ? '40px' : '100px' }}>
        <Greeting />
        <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(59,130,196,0.15),transparent)', margin: '20px 20px 0' }} />

        {isDesktop ? (
          <div style={{ padding: '0 36px' }}>
            <DesktopGrid>
              <div>
                <KpiSection />
                <StaffSection />
              </div>
              <div>
                <FeedSection />
              </div>
            </DesktopGrid>
          </div>
        ) : (
          <>
            <KpiSection />
            <StaffSection />
            <FeedSection />
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
