import React from 'react';
import { TYPE, RADIUS, FONT } from '../theme';

const FilterIcon   = ({ color }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const CalendarIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ChevronIcon  = ({ open }) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><polyline points="6 9 12 15 18 9"/></svg>;

const glassBtn = (active) => ({
  padding: '6px 14px', borderRadius: RADIUS.pill,
  border: active ? '1px solid rgba(59,130,196,0.6)' : '1px solid rgba(91,155,213,0.15)',
  background: active
    ? 'linear-gradient(135deg, rgba(26,58,92,0.9), rgba(59,130,196,0.7))'
    : 'rgba(5,14,28,0.4)',
  color: active ? '#fff' : 'rgba(181,212,244,0.55)',
  fontSize: TYPE.sm, fontWeight: active ? '600' : '400',
  cursor: 'pointer', fontFamily: FONT, transition: 'all .15s',
  whiteSpace: 'nowrap', backdropFilter: 'blur(10px)',
  boxShadow: active ? '0 2px 12px rgba(59,130,196,0.25)' : 'none',
});

const FilterBar = ({
  QUICK, filterMode, activeQuick,
  setFilterMode, setActiveQuick,
  selectedMonth, setSelMonth,
  availMonths,
  showMonthMenu, setShowMonthMenu,
  dateRange, setDateRange,
  fetchData, colors,
  monthMenuRef,
}) => (
  <div style={{
    background: 'rgba(10,25,41,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(91,155,213,0.15)',
    borderRadius: RADIUS.lg, padding: '14px 16px', marginBottom: '18px',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      <FilterIcon color="rgba(181,212,244,0.4)" />

      {QUICK.map(({ value, label }) => {
        const on = filterMode === 'quick' && activeQuick === value;
        return (
          <button key={value}
            onClick={() => { setFilterMode('quick'); setActiveQuick(value); setShowMonthMenu(false); }}
            style={glassBtn(on)}
          >
            {label}
          </button>
        );
      })}

      {/* Month Picker - shows actual sheet names like "May 26" */}
      <div style={{ position: 'relative' }} ref={monthMenuRef}>
        <button
          onClick={() => { setFilterMode('month'); setShowMonthMenu(o => !o); }}
          style={{ ...glassBtn(filterMode === 'month'), display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <CalendarIcon />
          {selectedMonth || 'By month'}
          <ChevronIcon open={showMonthMenu} />
        </button>

        {showMonthMenu && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0,
            background: 'rgba(5,14,28,0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(91,155,213,0.2)',
            borderRadius: RADIUS.md, padding: '8px',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: '4px', zIndex: 200, minWidth: '220px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          }}>
            {availMonths && availMonths.length > 0 ? (
              availMonths.map(m => {
                const sel = selectedMonth === m;
                return (
                  <button key={m}
                    onClick={() => { setSelMonth(m); setShowMonthMenu(false); fetchData && setTimeout(fetchData, 0); }}
                    style={{
                      padding: '8px 6px', borderRadius: RADIUS.sm, border: 'none',
                      background: sel ? 'linear-gradient(135deg, #1A3A5C, #3B82C4)' : 'rgba(13,33,55,0.6)',
                      color: sel ? '#fff' : 'rgba(181,212,244,0.7)',
                      fontSize: TYPE.xs, fontWeight: sel ? '700' : '400',
                      cursor: 'pointer', fontFamily: FONT, textAlign: 'center',
                      border: sel ? 'none' : '1px solid rgba(91,155,213,0.1)',
                    }}
                  >
                    {m}
                  </button>
                );
              })
            ) : (
              <div style={{ gridColumn: '1/-1', padding: '12px', textAlign: 'center', fontSize: TYPE.xs, color: 'rgba(181,212,244,0.4)' }}>
                Tidak ada data bulan
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Custom date range */}
    {filterMode === 'quick' && activeQuick === 'custom' && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
        {['start','end'].map((k, i) => (
          <input key={k} type="date"
            value={dateRange[k]}
            onChange={e => setDateRange(r => ({ ...r, [k]: e.target.value }))}
            style={{
              height: '36px', padding: '0 12px',
              background: 'rgba(5,14,28,0.6)',
              border: '1px solid rgba(91,155,213,0.2)',
              borderRadius: RADIUS.sm, fontSize: TYPE.sm,
              color: '#E8F0FA', outline: 'none', fontFamily: FONT,
            }}
          />
        ))}
        <button
          onClick={() => { setFilterMode('custom'); fetchData(); }}
          disabled={!dateRange.start || !dateRange.end}
          style={{
            height: '36px', padding: '0 16px',
            background: 'linear-gradient(135deg, #1A3A5C, #3B82C4)',
            color: '#fff', border: 'none',
            borderRadius: RADIUS.sm, fontSize: TYPE.sm,
            fontWeight: '600', cursor: 'pointer', fontFamily: FONT,
            opacity: (!dateRange.start || !dateRange.end) ? 0.4 : 1,
          }}
        >
          Apply
        </button>
      </div>
    )}
  </div>
);

export default FilterBar;
