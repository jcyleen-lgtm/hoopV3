import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TYPE, RADIUS, NAVY } from '../theme';

const COLORS = ['#3B82C4','#2D5A8E','#5B9BD5','#1A3A5C','#85B7E8','#0D2137','#60A5FA','#93C5FD','#BFDBFE','#1E40AF','#1D4ED8','#2563EB'];

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, nama }) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const r  = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + r * Math.cos(-midAngle * RADIAN);
  const y  = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ChartCard = ({ rows, colors }) => {
  const total = rows.reduce((s, r) => s + r.total, 0);
  const top   = rows.slice(0, 10); // max 10 slices

  return (
    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: RADIUS.lg, padding: '18px 16px' }}>
      <div style={{ fontSize: TYPE.xs, fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase', color: colors.subText, marginBottom: '4px' }}>
        Performance Chart
      </div>
      {total > 0 ? (
        <>
          {/* Center total */}
          <div style={{ position: 'relative', width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={top} dataKey="total" nameKey="nama"
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={95}
                  labelLine={false}
                  label={CustomLabel}
                  strokeWidth={2}
                  stroke="rgba(0,0,0,0.3)"
                >
                  {top.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: NAVY[900], border: '1px solid rgba(91,155,213,0.2)', borderRadius: RADIUS.md, color: '#fff', fontSize: TYPE.sm }}
                  formatter={(v, n) => [`${v.toLocaleString()} pcs`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center', pointerEvents: 'none',
            }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: colors.text, lineHeight: 1 }}>
                {total.toLocaleString()}
              </div>
              <div style={{ fontSize: TYPE.xs, color: colors.subText, marginTop: '2px' }}>total pcs</div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            {top.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ fontSize: TYPE.xs, color: colors.subText, fontWeight: '500' }}>{r.nama}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: TYPE.xs, color: colors.text, fontWeight: '700' }}>{r.total.toLocaleString()}</span>
                  <span style={{ fontSize: '10px', color: colors.subText, width: '34px', textAlign: 'right' }}>
                    {((r.total/total)*100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: TYPE.sm, color: colors.subText }}>Tidak ada data</span>
        </div>
      )}
    </div>
  );
};

export default ChartCard;
