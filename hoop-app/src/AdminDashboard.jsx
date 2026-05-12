import React, { useState, useEffect, useCallback, useRef } from 'react';
import { callScript } from './api';
import { NAVY, RADIUS, TYPE, FONT, makeColors } from './theme';
import KpiCard   from './components/KpiCard';
import ChartCard from './components/ChartCard';
import RankCard  from './components/RankCard';
import FilterBar from './components/FilterBar';


const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const QUICK = [
  { value: 'today',     label: 'Hari ini'    },
  { value: 'yesterday', label: 'Kemarin'     },
  { value: 'monthly',   label: 'Bulan ini'   },
  { value: 'custom',    label: 'Custom'      },
];

// SVG icons
const RefreshIcon = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const AlertIcon = ({ size = 40, color = '#EF4444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const AdminDashboard = ({ user, isDesktop, theme }) => {
  const colors  = makeColors(theme || 'light');
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';

  const [rows, setRows]       = useState([]);
  const [meta, setMeta]       = useState({ totalScan: 0, staffCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [availMonths, setAvail] = useState([]);

  const [filterMode, setFilterMode]   = useState('quick');
  const [activeQuick, setActiveQuick] = useState('today');
  const [selectedMonth, setSelMonth]  = useState('');
  const [dateRange, setDateRange]     = useState({ start: '', end: '' });
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  const [exportOpen, setExportOpen]   = useState(false);

  const exportRef    = useRef(null);
  const monthMenuRef = useRef(null);
  const cache        = useRef({});

  const barColor  = (i) => ['#3B82C4','#2D5A8E','#1E3A5F','#5B9BD5','#85B7E8'][Math.min(i, 4)];
  const rankStyle = (i) => {
    if (i === 0) return { bg: '#D4AF37', color: '#fff' };
    if (i === 1) return { bg: '#9EA7B1', color: '#fff' };
    if (i === 2) return { bg: '#C17F3D', color: '#fff' };
    return { bg: colors.surface, color: colors.text };
  };

  // Fetch available month sheets on mount
  useEffect(() => {
    callScript({ action: 'getMonths' })
      .then(r => { 
        console.log('getMonths response:', r);
        if (r?.months) setAvail(r.months);
        else console.warn('No months in response:', r);
      })
      .catch(err => console.error('getMonths error:', err));
  }, []);

  const fetchData = useCallback(async () => {
    // Cache key
    const cacheKey = filterMode === 'month' ? selectedMonth : filterMode === 'custom' ? `${dateRange.start}_${dateRange.end}` : activeQuick;
    if (cache.current[cacheKey]) {
      const cached = cache.current[cacheKey];
      setRows(cached.data); setMeta({ totalScan: cached.totalScan, staffCount: cached.staffCount });
      setLoading(false); return;
    }
    setLoading(true);
    setError(false);
    try {
      const type = filterMode === 'month'
        ? selectedMonth
        : filterMode === 'custom' ? 'custom' : activeQuick;

      const res = await callScript({ action: 'getRekapan', type, start: dateRange.start, end: dateRange.end });

      if (res?.status === 'success') {
        setRows(res.data || []);
        setMeta({ totalScan: res.totalScan ?? 0, staffCount: res.staffCount ?? 0 });
        cache.current[cacheKey] = res;
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filterMode, activeQuick, selectedMonth, dateRange]);

  useEffect(() => { fetchData(); }, [activeQuick, selectedMonth, fetchData]);

  // Trigger fetch when filterMode changes to month
  useEffect(() => {
    if (filterMode === 'month' && selectedMonth) fetchData();
  }, [filterMode, selectedMonth]);

  const dateInpStyle = {
    height: '34px', padding: '0 12px',
    backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
    borderRadius: RADIUS.sm, fontSize: TYPE.sm, color: colors.text,
    outline: 'none', fontFamily: FONT,
  };
  const navyBtnStyle = {
    height: '34px', padding: '0 16px',
    backgroundColor: NAVY[700], color: '#fff',
    border: 'none', borderRadius: RADIUS.sm,
    fontSize: TYPE.sm, fontWeight: '600', cursor: 'pointer', fontFamily: FONT,
  };

  return (
    <div style={{ background: 'transparent', fontFamily: FONT }}>

      {/* Header */}
      <div style={{
        padding: isDesktop ? '20px 36px' : '14px 18px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `1px solid ${colors.border}`,
        background: 'rgba(5,14,28,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div>
          <h1 style={{ fontSize: TYPE.xl, fontWeight: '800', color: colors.text, margin: 0, letterSpacing: '-0.3px' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: TYPE.xs, color: colors.subText, margin: '2px 0 0', letterSpacing: '0.04em' }}>
            WAREHOUSE PERFORMANCE ANALYTICS
          </p>
        </div>
        <button
          onClick={fetchData} disabled={loading}
          style={{
            background: colors.surface, border: `1px solid ${colors.border}`,
            borderRadius: RADIUS.sm, padding: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
          }}
        >
          <RefreshIcon size={18} color={colors.text} className={loading ? 'spin' : ''} />
        </button>
      </div>

      <div style={{ padding: isDesktop ? '24px 36px 40px' : '16px 16px 100px' }}>
        <FilterBar
          QUICK={QUICK} filterMode={filterMode} activeQuick={activeQuick}
          setFilterMode={setFilterMode} setActiveQuick={setActiveQuick}
          selectedMonth={selectedMonth} setSelMonth={setSelMonth}
          availMonths={availMonths} MONTH_NAMES={MONTH_NAMES}
          showMonthMenu={showMonthMenu} setShowMonthMenu={setShowMonthMenu}
          dateRange={dateRange} setDateRange={setDateRange}
          fetchData={fetchData} colors={colors} isAdmin={isAdmin}
          exportOpen={exportOpen} setExportOpen={setExportOpen}
          exportRef={exportRef} monthMenuRef={monthMenuRef}
          dateInpStyle={dateInpStyle} navyBtnStyle={navyBtnStyle}
        />

        {error && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#EF4444' }}>
            <AlertIcon size={40} />
            <p style={{ marginTop: '12px', fontSize: TYPE.base }}>Gagal memuat data dari Google Sheets.</p>
            <button onClick={fetchData} style={{ ...navyBtnStyle, marginTop: '16px', borderRadius: RADIUS.md }}>
              Coba Lagi
            </button>
          </div>
        )}

        {!error && (
          <>
            {/* KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
              gap: '14px', marginBottom: '20px',
            }}>
              <KpiCard label="Total Paket"    value={meta.totalScan}  accent={NAVY[700]}  colors={colors} unit="pcs" />
              <KpiCard label="Staff Aktif"    value={meta.staffCount} accent="#6B7280"    colors={colors} unit="org" />
              {isDesktop && rows.length > 0 && (
                <KpiCard label="Top Performer" value={rows[0]?.nama}  accent="#D4AF37"    colors={colors} small />
              )}
            </div>

            {/* Charts */}
            <div style={{
              display: isDesktop ? 'grid' : 'flex',
              flexDirection: 'column',
              gridTemplateColumns: '1.3fr 0.7fr',
              gap: '20px',
            }}>
              <ChartCard rows={rows} colors={colors} barColor={barColor} loading={loading} />
              <RankCard  rows={rows} colors={colors} rankStyle={rankStyle} barColor={barColor} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
