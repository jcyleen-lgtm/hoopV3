import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { TYPE, RADIUS, NAVY } from '../theme';

const COLORS = ['#3B82C4','#2D5A8E','#5B9BD5','#1A3A5C','#85B7E8','#60A5FA','#1E40AF','#93C5FD','#1D4ED8','#BFDBFE'];

const ActiveSlice = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 3} outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

const PctLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + r * Math.sin(-midAngle * Math.PI / 180);
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="700">{`${(percent*100).toFixed(0)}%`}</text>;
};

const ChartCard = ({ rows, colors }) => {
  const [activeIdx, setActiveIdx] = useState(null);
  const top   = rows.slice(0, 10);
  const total = rows.reduce((s,r) => s+r.total, 0);
  const active = activeIdx !== null ? top[activeIdx] : null;

  return (
    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: RADIUS.lg, padding: '18px 16px' }}>
      <div style={{ fontSize: TYPE.xs, fontWeight:'600', letterSpacing:'.08em', textTransform:'uppercase', color:colors.subText, marginBottom:'4px' }}>
        Performance Chart
      </div>

      {total > 0 ? (
        <>
          <div style={{ position:'relative', width:'100%', height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={top} dataKey="total" nameKey="nama"
                  cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  labelLine={false} label={PctLabel}
                  activeIndex={activeIdx} activeShape={ActiveSlice}
                  onMouseEnter={(_, i) => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                  onClick={(_, i) => setActiveIdx(activeIdx === i ? null : i)}
                  strokeWidth={2} stroke="rgba(0,0,0,0.25)"
                >
                  {top.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} style={{cursor:'pointer'}} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background:NAVY[900], border:'1px solid rgba(91,155,213,0.2)', borderRadius:RADIUS.md, color:'#fff', fontSize:TYPE.sm }}
                  formatter={(v,n) => [`${v.toLocaleString()} pcs`, n]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center — shows selected or total */}
            <div style={{
              position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%)',
              textAlign:'center', pointerEvents:'none',
              transition:'all .2s',
            }}>
              {active ? (
                <>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:'#fff', lineHeight:1.2, maxWidth:'80px' }}>{active.nama}</div>
                  <div style={{ fontSize:'18px', fontWeight:'800', color:'#fff', lineHeight:1 }}>{active.total.toLocaleString()}</div>
                  <div style={{ fontSize:'10px', color:'rgba(181,212,244,0.6)' }}>{((active.total/total)*100).toFixed(1)}%</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize:'20px', fontWeight:'800', color:colors.text, lineHeight:1 }}>{total.toLocaleString()}</div>
                  <div style={{ fontSize:TYPE.xs, color:colors.subText, marginTop:'2px' }}>total pcs</div>
                </>
              )}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display:'flex', flexDirection:'column', gap:'5px', marginTop:'6px' }}>
            {top.map((r, i) => {
              const isActive = activeIdx === i;
              return (
                <div key={i}
                  onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'4px 6px', borderRadius:'8px', cursor:'pointer',
                    background: isActive ? 'rgba(59,130,196,0.12)' : 'transparent',
                    transition:'background .15s',
                  }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:COLORS[i%COLORS.length], flexShrink:0 }} />
                    <span style={{ fontSize:TYPE.xs, color: isActive ? '#fff' : colors.subText, fontWeight: isActive ? '700' : '500' }}>{r.nama}</span>
                  </div>
                  <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                    <span style={{ fontSize:TYPE.xs, color:colors.text, fontWeight:'700' }}>{r.total.toLocaleString()}</span>
                    <span style={{ fontSize:'10px', color:colors.subText, width:'34px', textAlign:'right' }}>{((r.total/total)*100).toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ height:'180px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:TYPE.sm, color:colors.subText }}>Tidak ada data</span>
        </div>
      )}
    </div>
  );
};

export default ChartCard;
