import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TYPE, RADIUS, NAVY } from '../theme';

const ChartCard = ({ rows, colors, barColor }) => (
  <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: RADIUS.lg, padding: '18px 20px' }}>
    <div style={{ fontSize: TYPE.xs, fontWeight: '600', letterSpacing: '.08em', textTransform: 'uppercase', color: colors.subText }}>
      Performance Chart
    </div>
    <div style={{ width: '100%', height: 210, marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} barCategoryGap="32%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
          <XAxis dataKey="nama" stroke={colors.subText} fontSize={10} axisLine={false} tickLine={false} />
          <YAxis stroke={colors.subText} fontSize={10} axisLine={false} tickLine={false} width={34} />
          <Tooltip
            contentStyle={{ background: NAVY[900], border: 'none', borderRadius: RADIUS.md, color: '#fff', fontSize: TYPE.sm }}
            itemStyle={{ color: NAVY[300] }}
            cursor={{ fill: 'rgba(59,130,196,0.06)' }}
            formatter={(v) => [`${v.toLocaleString()} pcs`, 'Total']}
          />
          <Bar dataKey="total" radius={[5, 5, 0, 0]}>
            {rows.map((_, i) => <Cell key={i} fill={barColor(i)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ChartCard;