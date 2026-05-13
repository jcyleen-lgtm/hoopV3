import React, { useState, useEffect, useCallback, useRef } from 'react';
import { callScript } from './api';
import { NAVY, RADIUS, TYPE, FONT, makeColors } from './theme';
import KpiCard   from './components/KpiCard';
import ChartCard from './components/ChartCard';
import RankCard  from './components/RankCard';
import FilterBar from './components/FilterBar';

const QUICK = [
  { value: 'today',     label: 'Hari ini'  },
  { value: 'yesterday', label: 'Kemarin'   },
  { value: 'monthly',   label: 'Bulan ini' },
  { value: 'custom',    label: 'Custom'    },
];

// ── Cache global (persist selama tab hidup, tidak reset saat ganti halaman) ──
const GLOBAL_CACHE = {};

// ── Skeleton shimmer ──────────────────────────────────────────
const Shimmer = ({ w = '100%', h = '18px', r = '8px' }) => (
  <div style={{
    width:w, height:h, borderRadius:r,
    background:'linear-gradient(90deg,rgba(91,155,213,0.07) 25%,rgba(91,155,213,0.15) 50%,rgba(91,155,213,0.07) 75%)',
    backgroundSize:'200% 100%',
    animation:'shimmer 1.4s infinite',
  }} />
);

const SkeletonDashboard = ({ isDesktop, colors }) => (
  <>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <div style={{ display:'grid', gridTemplateColumns:isDesktop?'repeat(3,1fr)':'repeat(2,1fr)', gap:'14px', marginBottom:'20px' }}>
      {[1,2,isDesktop?3:null].filter(Boolean).map(i => (
        <div key={i} style={{ background:colors.card, border:`1px solid ${colors.border}`, borderRadius:RADIUS.lg, padding:'20px' }}>
          <Shimmer h="12px" w="55%" /><div style={{marginTop:'10px'}}/>
          <Shimmer h="30px" w="40%" r="6px" /><div style={{marginTop:'8px'}}/>
          <Shimmer h="10px" w="25%" />
        </div>
      ))}
    </div>
    <div style={{ display:isDesktop?'grid':'flex', flexDirection:'column', gridTemplateColumns:'1.3fr 0.7fr', gap:'20px' }}>
      <div style={{ background:colors.card, border:`1px solid ${colors.border}`, borderRadius:RADIUS.lg, padding:'20px', minHeight:'280px' }}>
        <Shimmer h="12px" w="40%" />
        <div style={{ margin:'28px auto', width:'180px', height:'180px', borderRadius:'50%', border:'30px solid rgba(91,155,213,0.07)' }} />
      </div>
      <div style={{ background:colors.card, border:`1px solid ${colors.border}`, borderRadius:RADIUS.lg, padding:'20px' }}>
        <Shimmer h="12px" w="50%" />
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ display:'flex', gap:'10px', alignItems:'center', marginTop:'14px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'rgba(91,155,213,0.1)' }} />
            <div style={{ flex:1 }}><Shimmer h="12px" /><div style={{marginTop:'6px'}}><Shimmer h="3px" /></div></div>
            <Shimmer h="14px" w="28px" />
          </div>
        ))}
      </div>
    </div>
  </>
);

const RefreshIcon = ({ size=18, color='currentColor', spinning }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: spinning ? 'spin 0.8s linear infinite' : 'none' }}>
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const AlertIcon = ({ size=40, color='#EF4444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const AdminDashboard = ({ user, isDesktop, theme }) => {
  const colors  = makeColors(theme || 'dark');
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';

  const [rows, setRows]         = useState([]);
  const [meta, setMeta]         = useState({ totalScan:0, staffCount:0 });
  // initialLoading: true hanya saat pertama kali (belum ada data sama sekali)
  // fetching: true saat sedang fetch (tapi data lama masih tampil)
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching]             = useState(false);
  const [error, setError]       = useState(false);
  const [availMonths, setAvail] = useState([]);

  const [filterMode, setFilterMode]       = useState('quick');
  const [activeQuick, setActiveQuick]     = useState('today');
  const [selectedMonth, setSelMonth]      = useState('');
  const [dateRange, setDateRange]         = useState({ start:'', end:'' });
  const [showMonthMenu, setShowMonthMenu] = useState(false);

  // Simpan state terbaru di ref supaya fetchData bisa baca tanpa stale closure
  const stateRef = useRef({ filterMode, activeQuick, selectedMonth, dateRange });
  useEffect(() => {
    stateRef.current = { filterMode, activeQuick, selectedMonth, dateRange };
  });

  const barColor  = (i) => ['#3B82C4','#2D5A8E','#1E3A5F','#5B9BD5','#85B7E8'][Math.min(i,4)];
  const rankStyle = (i) => {
    if (i===0) return { bg:'#D4AF37', color:'#fff' };
    if (i===1) return { bg:'#9EA7B1', color:'#fff' };
    if (i===2) return { bg:'#C17F3D', color:'#fff' };
    return { bg:colors.surface, color:colors.text };
  };

  // Load available month sheets — pakai global cache juga
  useEffect(() => {
    if (GLOBAL_CACHE['__months__']) {
      setAvail(GLOBAL_CACHE['__months__']);
      return;
    }
    callScript({ action:'getMonths' })
      .then(r => {
        if (r?.months) {
          GLOBAL_CACHE['__months__'] = r.months;
          setAvail(r.months);
        }
      })
      .catch(() => {});
  }, []);

  const getCacheKey = useCallback((mode, quick, month, range) => {
    if (mode === 'month')  return `month_${month}`;
    if (mode === 'custom') return `custom_${range?.start}_${range?.end}`;
    return `quick_${quick}`;
  }, []);

  const fetchData = useCallback(async (overrideMode, overrideRange, overrideMonth) => {
    const s     = stateRef.current;
    const mode  = overrideMode  !== undefined ? overrideMode  : s.filterMode;
    // overrideRange selalu dipakai kalau ada — jangan fallback ke stateRef
    // karena stateRef belum tentu update saat fetchData dipanggil
    const range = overrideRange !== undefined && overrideRange !== null ? overrideRange : s.dateRange;
    const month = overrideMonth !== undefined && overrideMonth !== null ? overrideMonth : s.selectedMonth;
    const quick = s.activeQuick;

    const cacheKey = getCacheKey(mode, quick, month, range);

    // Hit cache → tampil instant, tidak ada loading sama sekali
    if (GLOBAL_CACHE[cacheKey]) {
      const c = GLOBAL_CACHE[cacheKey];
      setRows(c.data);
      setMeta({ totalScan:c.totalScan, staffCount:c.staffCount });
      setInitialLoading(false);
      setFetching(false);
      setError(false);
      return;
    }

    // Kalau sudah ada data lama, pakai fetching (subtle spinner)
    // Kalau belum ada data sama sekali, pakai skeleton penuh
    if (rows.length > 0) {
      setFetching(true);
    } else {
      setInitialLoading(true);
    }
    setError(false);

    try {
      const type = mode === 'month'
        ? month
        : mode === 'custom' ? 'custom'
        : quick;

      const res = await callScript({
        action: 'getRekapan',
        type,
        start: (range?.start || '').trim(),
        end:   (range?.end   || '').trim(),
      });

      if (res?.status === 'success') {
        GLOBAL_CACHE[cacheKey] = res;
        setRows(res.data || []);
        setMeta({ totalScan:res.totalScan??0, staffCount:res.staffCount??0 });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setInitialLoading(false);
      setFetching(false);
    }
  }, [getCacheKey, rows.length]);

  // Fetch pertama kali saat mount
  useEffect(() => { fetchData(); }, []); // eslint-disable-line

  // Fetch saat quick filter berubah
  useEffect(() => {
    if (filterMode === 'quick') fetchData('quick');
  }, [activeQuick]); // eslint-disable-line

  // Manual refresh — hapus cache entry aktif
  const handleRefresh = () => {
    const s = stateRef.current;
    const cacheKey = getCacheKey(s.filterMode, s.activeQuick, s.selectedMonth, s.dateRange);
    delete GLOBAL_CACHE[cacheKey];
    setRows([]); // force skeleton
    fetchData();
  };

  const showSkeleton = initialLoading && !error;
  const showData     = !initialLoading && !error;

  return (
    <div style={{ background:'transparent', fontFamily:FONT }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{
        padding: isDesktop ? '20px 36px' : '14px 18px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        borderBottom:`1px solid ${colors.border}`,
        background:'rgba(5,14,28,0.6)',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div>
          <h1 style={{ fontSize:TYPE.xl, fontWeight:'800', color:colors.text, margin:0, letterSpacing:'-0.3px' }}>
            Dashboard
          </h1>
          <p style={{ fontSize:TYPE.xs, color:colors.subText, margin:'2px 0 0', letterSpacing:'0.04em' }}>
            WAREHOUSE PERFORMANCE ANALYTICS
          </p>
        </div>
        <button onClick={handleRefresh} disabled={initialLoading || fetching} style={{
          background:colors.surface, border:`1px solid ${colors.border}`,
          borderRadius:RADIUS.sm, padding:'8px', cursor:'pointer',
          display:'flex', alignItems:'center',
        }}>
          <RefreshIcon size={18} color={colors.text} spinning={initialLoading || fetching} />
        </button>
      </div>

      <div style={{ padding: isDesktop ? '24px 36px 40px' : '16px 16px 100px' }}>
        <FilterBar
          QUICK={QUICK}
          filterMode={filterMode}       activeQuick={activeQuick}
          setFilterMode={setFilterMode} setActiveQuick={setActiveQuick}
          selectedMonth={selectedMonth} setSelMonth={setSelMonth}
          availMonths={availMonths}
          showMonthMenu={showMonthMenu} setShowMonthMenu={setShowMonthMenu}
          dateRange={dateRange}         setDateRange={setDateRange}
          fetchData={fetchData}
          colors={colors}
        />

        {error && (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#EF4444' }}>
            <AlertIcon size={40} />
            <p style={{ marginTop:'12px', fontSize:TYPE.base }}>Gagal memuat data dari Google Sheets.</p>
            <button onClick={handleRefresh} style={{
              marginTop:'16px', height:'38px', padding:'0 20px',
              background:NAVY[700], color:'#fff', border:'none',
              borderRadius:RADIUS.md, fontSize:TYPE.sm, fontWeight:'600',
              cursor:'pointer', fontFamily:FONT,
            }}>
              Coba Lagi
            </button>
          </div>
        )}

        {showSkeleton && <SkeletonDashboard isDesktop={isDesktop} colors={colors} />}

        {showData && (
          /* opacity saat fetching supaya user tahu ada update tanpa skeleton */
          <div style={{ opacity: fetching ? 0.6 : 1, transition: 'opacity 0.2s ease', pointerEvents: fetching ? 'none' : 'auto' }}>
            <div style={{
              display:'grid',
              gridTemplateColumns: isDesktop ? 'repeat(3,1fr)' : 'repeat(2,1fr)',
              gap:'14px', marginBottom:'20px',
            }}>
              <KpiCard label="Total Paket"    value={meta.totalScan}  accent={NAVY[700]} colors={colors} unit="pcs" />
              <KpiCard label="Staff Aktif"    value={meta.staffCount} accent="#6B7280"   colors={colors} unit="org" />
              {isDesktop && rows.length > 0 && (
                <KpiCard label="Top Performer" value={rows[0]?.nama}  accent="#D4AF37"   colors={colors} small />
              )}
            </div>

            <div style={{
              display: isDesktop ? 'grid' : 'flex',
              flexDirection:'column',
              gridTemplateColumns:'1.3fr 0.7fr',
              gap:'20px',
            }}>
              <ChartCard rows={rows} colors={colors} barColor={barColor} loading={false} isDesktop={isDesktop} />
              <RankCard  rows={rows} colors={colors} rankStyle={rankStyle} barColor={barColor} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
