import React, { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { TYPE, RADIUS, FONT, glassCard } from '../theme';
import { callScript } from '../api';

const FilterIcon   = ({ color }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const CalendarIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ChevronIcon  = ({ open }) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:open?'rotate(180deg)':'none',transition:'transform .15s'}}><polyline points="6 9 12 15 18 9"/></svg>;

const MONTH_SHORT   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const FULL_MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_PATTERN = /^(January|February|March|April|May|June|July|August|September|October|November|December)$/;

// Cache prefetch supaya tidak double-fetch
const PREFETCH_CACHE = {};

const pill = (active) => ({
  padding:'6px 14px', borderRadius:RADIUS.pill,
  border: active ? '1px solid rgba(59,130,196,0.6)' : '1px solid rgba(91,155,213,0.15)',
  background: active ? 'linear-gradient(135deg,rgba(26,58,92,0.9),rgba(59,130,196,0.7))' : 'rgba(5,14,28,0.4)',
  color: active ? '#fff' : 'rgba(181,212,244,0.55)',
  fontSize:TYPE.sm, fontWeight: active ? '600':'400',
  cursor:'pointer', fontFamily:FONT, transition:'all .15s',
  whiteSpace:'nowrap', boxShadow: active ? '0 2px 12px rgba(59,130,196,0.25)':'none',
});

const FilterBar = ({
  QUICK, filterMode, activeQuick,
  setFilterMode, setActiveQuick,
  selectedMonth, setSelMonth,
  availMonths,
  showMonthMenu, setShowMonthMenu,
  dateRange, setDateRange,
  fetchData,
  theme,
}) => {
  const isLight = theme === 'light';
  const menuRef    = useRef(null);
  const btnRef     = useRef(null);
  const prefetchRef = useRef(null);
  const [dropPos, setDropPos] = useState(null);

  // Tutup menu saat klik luar
  useEffect(() => {
    if (!showMonthMenu) return;
    const handler = (e) => {
      // Check if click is outside the button AND outside the portal dropdown
      const clickedInsideBtn = menuRef.current && menuRef.current.contains(e.target);
      const clickedInsideDrop = e.target.closest('[data-month-drop]');
      if (!clickedInsideBtn && !clickedInsideDrop) {
        setShowMonthMenu(false);
      }
    };
    document.addEventListener('mousedown', handler, { passive: true }); // FIX: passive listener
    return () => document.removeEventListener('mousedown', handler);
  }, [showMonthMenu, setShowMonthMenu]);

  const validMonths = useMemo(() =>
    (availMonths || []).filter(m => MONTH_PATTERN.test(m)),
  [availMonths]);

  const selectedLabel = useMemo(() => {
    if (!selectedMonth) return 'By month';
    const idx = FULL_MONTHS.indexOf(selectedMonth);
    return idx >= 0 ? MONTH_SHORT[idx] : selectedMonth;
  }, [selectedMonth]);

  // Prefetch ke Worker/Apps Script di background — simpan hasilnya di PREFETCH_CACHE
  // supaya saat user klik Tampilkan, fetchData tinggal ambil dari cache
  const prefetch = useCallback((start, end) => {
    if (!start || !end) return;
    const key = `custom_${start}_${end}`;
    if (PREFETCH_CACHE[key]) return; // sudah pernah prefetch
    PREFETCH_CACHE[key] = true;

    // Panggil callScript langsung — hasilnya akan di-cache di Cloudflare Worker
    // Saat fetchData dipanggil nanti, Worker langsung return dari cache
    callScript({ action: 'getRekapan', type: 'custom', start, end })
      .then(res => {
        if (res?.status === 'success') {
          // Simpan juga di GLOBAL_CACHE AdminDashboard via event
          window.__hoopPrefetchResult = window.__hoopPrefetchResult || {};
          window.__hoopPrefetchResult[key] = res;
        }
      })
      .catch(() => { delete PREFETCH_CACHE[key]; });
  }, []);

  const handleMonthSelect = (monthName) => {
    setSelMonth(monthName);
    setFilterMode('month');
    setShowMonthMenu(false);
    fetchData('month', null, monthName);
  };

  const handleCustomApply = () => {
    if (!dateRange.start || !dateRange.end) return;
    fetchData('custom', { start: dateRange.start, end: dateRange.end }, null);
    setFilterMode('custom');
  };

  // Prefetch saat start date diisi dan end date sudah ada, atau sebaliknya
  const handleStartChange = (val) => {
    setDateRange(r => {
      const next = { ...r, start: val };
      if (next.end) {
        // Debounce 300ms supaya tidak prefetch tiap keystroke
        clearTimeout(prefetchRef.current);
        prefetchRef.current = setTimeout(() => prefetch(val, next.end), 300);
      }
      return next;
    });
  };

  const handleEndChange = (val) => {
    setDateRange(r => {
      const next = { ...r, end: val };
      if (next.start) {
        clearTimeout(prefetchRef.current);
        prefetchRef.current = setTimeout(() => prefetch(next.start, val), 300);
      }
      return next;
    });
  };

  const isCustomActive = (filterMode === 'quick' && activeQuick === 'custom') || filterMode === 'custom';

  return (
    <div style={{
      ...glassCard(theme),
      borderRadius:RADIUS.lg, padding:'12px 14px', marginBottom:'16px',
      backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
        <FilterIcon color="rgba(181,212,244,0.4)" />

        {QUICK.map(({ value, label }) => {
          const on = filterMode === 'quick' && activeQuick === value;
          return (
            <button key={value}
              onClick={() => { setFilterMode('quick'); setActiveQuick(value); setShowMonthMenu(false); }}
              style={pill(on)}
            >
              {label}
            </button>
          );
        })}

        {/* Month Picker */}
        <div ref={menuRef}>
          <button
            ref={btnRef}
            onClick={() => {
              if (!showMonthMenu && btnRef.current) {
                const rect = btnRef.current.getBoundingClientRect();
                setDropPos({ top: rect.bottom + 6, left: rect.left });
              }
              setShowMonthMenu(o => !o);
            }}
            style={{ ...pill(filterMode === 'month'), display:'flex', alignItems:'center', gap:'5px' }}
          >
            <CalendarIcon />
            {selectedLabel}
            <ChevronIcon open={showMonthMenu} />
          </button>

          {showMonthMenu && dropPos && createPortal(
            <div
              data-month-drop="true"
              style={{
                position:'fixed', top: dropPos.top, left: dropPos.left,
                background: isLight ? 'rgba(238,243,252,0.97)' : 'rgba(4,12,28,0.98)',
                backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
                border: isLight ? '1px solid rgba(255,255,255,0.85)' : '1px solid rgba(59,130,196,0.25)',
                borderRadius:RADIUS.md, padding:'14px',
                zIndex:99999, minWidth:'244px',
                boxShadow: isLight
                  ? '0 20px 60px rgba(100,140,220,0.2), inset 0 1px 0 rgba(255,255,255,0.9)'
                  : '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,196,0.1)',
              }}
            >
              <div style={{
                fontSize:'10px', fontWeight:'700',
                color: isLight ? 'rgba(30,60,120,0.4)' : 'rgba(96,165,250,0.5)',
                letterSpacing:'.1em', marginBottom:'10px',
              }}>
                PILIH BULAN
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'5px' }}>
                {FULL_MONTHS.map((fullName, i) => {
                  const exists = validMonths.includes(fullName);
                  const sel    = selectedMonth === fullName;
                  return (
                    <button key={fullName}
                      disabled={!exists}
                      onClick={() => exists && handleMonthSelect(fullName)}
                      style={{
                        padding:'9px 4px', borderRadius:'8px',
                        border: sel
                          ? '1px solid rgba(59,130,196,0.4)'
                          : exists
                          ? `1px solid ${isLight ? 'rgba(59,130,196,0.1)' : 'rgba(59,130,196,0.08)'}`
                          : '1px solid transparent',
                        background: sel
                          ? 'linear-gradient(135deg,#1A3A5C,#3B82C4)'
                          : exists
                          ? isLight ? 'rgba(255,255,255,0.6)' : 'rgba(8,20,40,0.8)'
                          : 'transparent',
                        color: sel
                          ? '#fff'
                          : exists
                          ? isLight ? '#0D1F40' : 'rgba(181,212,244,0.85)'
                          : isLight ? 'rgba(30,60,120,0.2)' : 'rgba(181,212,244,0.15)',
                        fontSize:TYPE.xs, fontWeight: sel ? '700' : '500',
                        cursor: exists ? 'pointer' : 'default',
                        fontFamily:FONT, textAlign:'center',
                        boxShadow: sel ? '0 2px 12px rgba(59,130,196,0.4)' : 'none',
                        transition:'all .15s',
                      }}
                    >
                      {MONTH_SHORT[i]}
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>

      {isCustomActive && (
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'10px', flexWrap:'wrap' }}>
          <span style={{ fontSize:TYPE.xs, color:'rgba(181,212,244,0.45)', whiteSpace:'nowrap' }}>Dari</span>
          <input type="date" value={dateRange.start}
            onChange={e => handleStartChange(e.target.value)}
            style={dateInputStyle(isLight)}
          />
          <span style={{ fontSize:TYPE.xs, color:'rgba(181,212,244,0.45)', whiteSpace:'nowrap' }}>s/d</span>
          <input type="date" value={dateRange.end}
            min={dateRange.start}
            onChange={e => handleEndChange(e.target.value)}
            style={dateInputStyle(isLight)}
          />
          <button
            onClick={handleCustomApply}
            disabled={!dateRange.start || !dateRange.end}
            style={{
              height:'34px', padding:'0 16px',
              background: (!dateRange.start || !dateRange.end) ? 'rgba(13,33,55,0.4)' : 'linear-gradient(135deg,#1A3A5C,#3B82C4)',
              color:'#fff', border:'none', borderRadius:RADIUS.sm,
              fontSize:TYPE.sm, fontWeight:'600',
              cursor: (!dateRange.start || !dateRange.end) ? 'not-allowed' : 'pointer',
              fontFamily:FONT,
              opacity: (!dateRange.start || !dateRange.end) ? 0.45 : 1,
              transition:'all .15s',
            }}
          >
            Tampilkan
          </button>
        </div>
      )}
    </div>
  );
};

const dateInputStyle = (isLight) => ({
  height:'34px', padding:'0 10px',
  background: isLight ? 'rgba(255,255,255,0.6)' : 'rgba(5,14,28,0.6)',
  backdropFilter: isLight ? 'blur(10px)' : 'none',
  border: isLight ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(91,155,213,0.2)',
  borderRadius:RADIUS.sm,
  fontSize:TYPE.sm,
  color: isLight ? '#0D1F40' : '#E8F0FA',
  outline:'none', fontFamily:FONT,
  colorScheme: isLight ? 'light' : 'dark',
  boxShadow: isLight ? 'inset 0 1px 0 rgba(255,255,255,0.9)' : 'none',
});

export default FilterBar;
