import React, { useMemo } from 'react';
import { TYPE, RADIUS, FONT } from '../theme';

const FilterIcon   = ({ color }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const CalendarIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ChevronIcon  = ({ open }) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:open?'rotate(180deg)':'none',transition:'transform .15s'}}><polyline points="6 9 12 15 18 9"/></svg>;

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_PATTERN = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s(\d{2})$/;

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
  fetchData, monthMenuRef,
}) => {

  // Group availMonths by year: { "26": ["May 26","Apr 26",...], "25": ["Dec 25"] }
  const byYear = useMemo(() => {
    const map = {};
    (availMonths || []).forEach(m => {
      const match = m.match(MONTH_PATTERN);
      if (!match) return;
      const yy = match[2];
      if (!map[yy]) map[yy] = [];
      map[yy].push(m);
    });
    return map;
  }, [availMonths]);

  const years = Object.keys(byYear).sort((a,b) => b-a); // newest first

  // Get short display for selected month e.g. "May 26" → "May '26"
  const selectedLabel = useMemo(() => {
    if (!selectedMonth) return 'By month';
    const match = selectedMonth.match(MONTH_PATTERN);
    if (!match) return selectedMonth;
    const mIdx = ['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(match[1]);
    return `${MONTH_SHORT[mIdx]} '${match[2]}`;
  }, [selectedMonth]);

  return (
    <div style={{
      background:'rgba(10,25,41,0.55)',
      backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
      border:'1px solid rgba(91,155,213,0.15)',
      borderRadius:RADIUS.lg, padding:'12px 14px', marginBottom:'16px',
      boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
        <FilterIcon color="rgba(181,212,244,0.4)" />

        {QUICK.map(({ value, label }) => {
          const on = filterMode==='quick' && activeQuick===value;
          return (
            <button key={value} onClick={() => { setFilterMode('quick'); setActiveQuick(value); setShowMonthMenu(false); }} style={pill(on)}>
              {label}
            </button>
          );
        })}

        {/* Month Picker - calendar grouped by year */}
        <div style={{ position:'relative' }} ref={monthMenuRef}>
          <button
            onClick={() => setShowMonthMenu(o=>!o)}
            style={{ ...pill(filterMode==='month'), display:'flex', alignItems:'center', gap:'5px' }}
          >
            <CalendarIcon />
            {selectedLabel}
            <ChevronIcon open={showMonthMenu} />
          </button>

          {showMonthMenu && (
            <div style={{
              position:'absolute', top:'calc(100% + 6px)', left:0,
              background:'rgba(5,14,28,0.96)',
              backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
              border:'1px solid rgba(91,155,213,0.2)',
              borderRadius:RADIUS.md, padding:'10px',
              zIndex:200, minWidth:'240px',
              boxShadow:'0 16px 48px rgba(0,0,0,0.7)',
            }}>
              {years.length === 0 ? (
                <div style={{ padding:'12px', textAlign:'center', fontSize:TYPE.xs, color:'rgba(181,212,244,0.4)' }}>
                  Tidak ada data
                </div>
              ) : years.map(yy => {
                const sheets = byYear[yy]; // e.g. ["May 26","Apr 26",...]
                // Build full 12-month grid for this year
                const fullYear = `20${yy}`;
                return (
                  <div key={yy} style={{ marginBottom:'10px' }}>
                    <div style={{ fontSize:'10px', fontWeight:'700', color:'rgba(181,212,244,0.4)', letterSpacing:'.08em', marginBottom:'6px' }}>
                      {fullYear}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'4px' }}>
                      {MONTH_SHORT.map((short, i) => {
                        const FULL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                        const sheetName = `${FULL_MONTHS[i]} ${yy}`;
                        const exists = sheets.includes(sheetName);
                        const sel = selectedMonth === sheetName;
                        return (
                          <button key={i}
                            disabled={!exists}
                            onClick={() => { if(!exists) return; setSelMonth(sheetName); setFilterMode('month'); setShowMonthMenu(false); }}
                            style={{
                              padding:'7px 4px', borderRadius:'8px',
                              border: sel ? 'none' : '1px solid rgba(91,155,213,0.1)',
                              background: sel ? 'linear-gradient(135deg,#1A3A5C,#3B82C4)' : exists ? 'rgba(13,33,55,0.7)' : 'transparent',
                              color: sel ? '#fff' : exists ? 'rgba(181,212,244,0.8)' : 'rgba(181,212,244,0.2)',
                              fontSize:TYPE.xs, fontWeight: sel ? '700':'400',
                              cursor: exists ? 'pointer':'default',
                              fontFamily:FONT, textAlign:'center',
                              boxShadow: sel ? '0 2px 8px rgba(59,130,196,0.4)' : 'none',
                            }}
                          >
                            {short}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Custom date range */}
      {filterMode==='quick' && activeQuick==='custom' && (
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'10px', flexWrap:'wrap' }}>
          {['start','end'].map(k => (
            <input key={k} type="date" value={dateRange[k]}
              onChange={e => setDateRange(r=>({...r,[k]:e.target.value}))}
              style={{ height:'34px', padding:'0 10px', background:'rgba(5,14,28,0.6)', border:'1px solid rgba(91,155,213,0.2)', borderRadius:RADIUS.sm, fontSize:TYPE.sm, color:'#E8F0FA', outline:'none', fontFamily:FONT }}
            />
          ))}
          <button onClick={() => { setFilterMode('custom'); fetchData(); }}
            disabled={!dateRange.start||!dateRange.end}
            style={{ height:'34px', padding:'0 14px', background:'linear-gradient(135deg,#1A3A5C,#3B82C4)', color:'#fff', border:'none', borderRadius:RADIUS.sm, fontSize:TYPE.sm, fontWeight:'600', cursor:'pointer', fontFamily:FONT, opacity:(!dateRange.start||!dateRange.end)?0.4:1 }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
