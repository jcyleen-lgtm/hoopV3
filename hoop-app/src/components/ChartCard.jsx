import React, { memo, memo } from 'react'; // FIX: removed duplicate
import React, { useState, memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { TYPE, RADIUS, glassCard } from '../theme';

// Brighter, more vibrant colors for glow effect
const COLORS     = ['#60A5FA','#3B82F6','#818CF8','#34D399','#FBBF24','#F472B6','#38BDF8','#A78BFA','#FB923C','#4ADE80'];
const GLOW_COLORS= ['59,165,250','59,130,246','129,140,248','52,211,153','251,191,36','244,114,182','56,189,248','167,139,250','251,146,60','74,222,128'];

const ActiveSlice = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle} fill={fill}
        style={{ filter: `drop-shadow(0 0 8px ${fill}99)` }}
      />
    </g>
  );
};

const PctLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + r * Math.sin(-midAngle * Math.PI / 180);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="800">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ChartCard = ({ rows, colors, isDesktop, theme }) => {
  const isLight = theme === 'light';
  const card = glassCard(theme, '59,130,196');
  const [hoverIdx, setHoverIdx]   = useState(null);
  const [pinnedIdx, setPinnedIdx] = useState(null);
  const activeIdx = hoverIdx !== null ? hoverIdx : pinnedIdx;
  const top    = rows.slice(0, 10);
  const total  = rows.reduce((s, r) => s + r.total, 0);
  const active = activeIdx !== null ? top[activeIdx] : null;  // activeIdx = hoverIdx ?? pinnedIdx
  const activeColor = activeIdx !== null ? COLORS[activeIdx % COLORS.length] : null;
  const activeGlow  = activeIdx !== null ? GLOW_COLORS[activeIdx % GLOW_COLORS.length] : null;

  return (
    <div style={{
      ...card,
      borderRadius: RADIUS.lg, padding: '18px 16px',
      position: 'relative', overflow: 'hidden',
      backdropFilter: isLight ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: isLight ? 'blur(20px)' : 'none',
    }}>
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: 'linear-gradient(90deg,rgba(96,165,250,0.8),rgba(96,165,250,0))', borderRadius: `${RADIUS.lg} ${RADIUS.lg} 0 0` }} />

      {/* Ambient glow when slice active */}
      {activeColor && (
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, rgba(${activeGlow},0.06) 0%, transparent 70%)`, pointerEvents: 'none', transition: 'all .3s' }} />
      )}

      <div style={{ fontSize: TYPE.xs, fontWeight: '700', letterSpacing: '.1em', textTransform: 'uppercase', color: colors.subText, marginBottom: '4px' }}>
        Performance Chart
      </div>

      {total > 0 ? (
        <div style={{ position: 'relative', width: '100%', height: isDesktop ? 380 : 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={top} dataKey="total" nameKey="nama"
                cx="50%" cy="50%"
                innerRadius={isDesktop ? 100 : 60}
                outerRadius={isDesktop ? 150 : 90}
                labelLine={false} label={PctLabel}
                activeIndex={activeIdx} activeShape={ActiveSlice}
                onMouseEnter={(_, i) => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                onClick={(_, i) => setPinnedIdx(pinnedIdx === i ? null : i)}
                strokeWidth={1.5} stroke="rgba(0,0,0,0.3)"
              >
                {top.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    style={{
                      cursor: 'pointer',
                      filter: `drop-shadow(0 0 4px rgba(${GLOW_COLORS[i % GLOW_COLORS.length]},0.5))`,
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            textAlign: 'center', pointerEvents: 'none',
            transition: 'all .2s',
          }}>
            {active ? (
              <>
                <div style={{ fontSize: isDesktop ? '15px' : '12px', fontWeight: '700', color: activeColor, lineHeight: 1.2, maxWidth: isDesktop ? '120px' : '80px', textShadow: `0 0 12px rgba(${activeGlow},0.7)` }}>{active.nama}</div>
                <div style={{ fontSize: isDesktop ? '24px' : '18px', fontWeight: '900', color: '#fff', lineHeight: 1, textShadow: `0 0 16px rgba(${activeGlow},0.5)` }}>{active.total.toLocaleString()}</div>
                <div style={{ fontSize: '10px', color: activeColor, opacity: 0.8 }}>{((active.total / total) * 100).toFixed(1)}%</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: isDesktop ? '28px' : '20px', fontWeight: '900', color: isLight ? '#0D1F40' : '#fff', lineHeight: 1, textShadow: isLight ? 'none' : '0 0 20px rgba(96,165,250,0.3)' }}>{total.toLocaleString()}</div>
                <div style={{ fontSize: TYPE.xs, color: colors.subText, marginTop: '2px' }}>total pcs</div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: TYPE.sm, color: colors.subText }}>Tidak ada data</span>
        </div>
      )}
    </div>
  );
};

export default memo(ChartCard); // FIX: memo — skip re-render if props unchanged
