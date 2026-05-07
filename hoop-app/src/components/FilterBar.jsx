import React from 'react';
import { TYPE, RADIUS, NAVY, FONT } from '../theme';

// Inline SVG icons
const FilterIcon   = ({ color }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const CalendarIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ChevronIcon  = ({ open }) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><polyline points="6 9 12 15 18 9"/></svg>;

const FilterBar = ({
  QUICK, filterMode, activeQuick,
  setFilterMode, setActiveQuick,
  selectedMonth, setSelMonth,
  availMonths, MONTH_NAMES,
  showMonthMenu, setShowMonthMenu,
  dateRange, setDateRange,
  fetchData, colors, isAdmin,
  exportOpen, setExportOpen,
  exportRef, monthMenuRef,
  dateInpStyle, navyBtnStyle,
}) => (
  <div style={{
    background: colors.card, border: `1px solid ${colors.border}`,
    borderRadius: RADIUS.lg, padding: '14px 16px', marginBottom: '18px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      <FilterIcon color={colors.subText} />

      {/* Quick Pills */}
      {QUICK.map(({ value, label }) => {
        const on = filterMode === 'quick' && activeQuick === value;
        return (
          <button
            key={value}
            onClick={() => { setFilterMode('quick'); setActiveQuick(value); setShowMonthMenu(false); }}
            style={{
              padding: '5px 13px', borderRadius: RADIUS.pill,
              border: on ? `1.5px solid ${NAVY[900]}` : `1px solid ${colors.border}`,
              background: on ? NAVY[900] : 'transparent',
              color: on ? '#fff' : colors.subText,
              fontSize: TYPE.sm, fontWeight: on ? '600' : '400',
              cursor: 'pointer', fontFamily: FONT, transition: 'all .15s', whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        );
      })}

      {/* Month Picker */}
      <div style={{ position: 'relative' }} ref={monthMenuRef}>
        <button
          onClick={() => { setFilterMode('month'); setShowMonthMenu(o => !o); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 13px', borderRadius: RADIUS.pill,
            border: filterMode === 'month' ? `1.5px solid ${NAVY[900]}` : `1px solid ${colors.border}`,
            background: filterMode === 'month' ? NAVY[900] : 'transparent',
            color: filterMode === 'month' ? '#fff' : colors.subText,
            fontSize: TYPE.sm, fontWeight: filterMode === 'month' ? '600' : '400',
            cursor: 'pointer', fontFamily: FONT, transition: 'all .15s',
          }}
        >
          <CalendarIcon />
          {selectedMonth || 'By month'}
          <ChevronIcon open={showMonthMenu} />
        </button>

        {showMonthMenu && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0,
            background: colors.card, border: `1px solid ${colors.border}`,
            borderRadius: RADIUS.md, padding: '8px',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: '4px', zIndex: 200, minWidth: '210px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
          }}>
            {MONTH_NAMES.map(m => {
              const avail = !availMonths?.length || availMonths.includes(m);
              const sel   = selectedMonth === m;
              return (
                <button
                  key={m}
                  disabled={!avail}
                  onClick={() => { setSelMonth(m); setShowMonthMenu(false); }}
                  style={{
                    padding: '7px 6px', borderRadius: RADIUS.sm, border: 'none',
                    background: sel ? NAVY[900] : avail ? colors.surface : 'transparent',
                    color: sel ? '#fff' : avail ? colors.text : colors.subText,
                    fontSize: TYPE.xs, fontWeight: sel ? '700' : '400',
                    cursor: avail ? 'pointer' : 'not-allowed',
                    opacity: avail ? 1 : 0.35, fontFamily: FONT, textAlign: 'center',
                  }}
                >
                  {m.slice(0, 3)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>

    {/* Custom date range — shown only when "Custom" quick pill is active */}
    {filterMode === 'quick' && activeQuick === 'custom' && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
        <input
          type="date" value={dateRange.start}
          onChange={e => { setFilterMode('custom'); setDateRange(r => ({ ...r, start: e.target.value })); }}
          style={dateInpStyle || { height: '34px', padding: '0 12px', border: `1px solid ${colors.border}`, borderRadius: RADIUS.sm, fontSize: TYPE.sm, color: colors.text, background: colors.surface, outline: 'none' }}
        />
        <span style={{ fontSize: TYPE.sm, color: colors.subText }}>to</span>
        <input
          type="date" value={dateRange.end}
          onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))}
          style={dateInpStyle || { height: '34px', padding: '0 12px', border: `1px solid ${colors.border}`, borderRadius: RADIUS.sm, fontSize: TYPE.sm, color: colors.text, background: colors.surface, outline: 'none' }}
        />
        <button
          onClick={() => { setFilterMode('custom'); fetchData(); }}
          disabled={!dateRange.start || !dateRange.end}
          style={{
            ...(navyBtnStyle || { height: '34px', padding: '0 16px', backgroundColor: NAVY[900], color: '#fff', border: 'none', borderRadius: RADIUS.sm, fontSize: TYPE.sm, fontWeight: '600', cursor: 'pointer' }),
            opacity: (!dateRange.start || !dateRange.end) ? 0.5 : 1,
          }}
        >
          Apply
        </button>
      </div>
    )}
  </div>
);

export default FilterBar;
