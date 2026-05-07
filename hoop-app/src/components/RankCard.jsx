import React from 'react';
import { TYPE, RADIUS } from '../theme';

const RankCard = ({ rows, colors, rankStyle, barColor }) => {
  const max = rows[0]?.total || 1;
  return (
    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: RADIUS.lg, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px 10px', fontSize: TYPE.xs, fontWeight: '600', color: colors.subText }}>
        STAFF RANKING
      </div>
      {rows.map((item, i) => {
        const rs = rankStyle(i);
        const pct = Math.round((item.total / max) * 100);
        return (
          <div key={i} style={{ padding: '11px 20px', borderTop: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: RADIUS.sm, background: rs.bg, color: rs.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: TYPE.sm, fontWeight: '700' }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: TYPE.sm, fontWeight: '600', color: colors.text }}>{item.nama}</div>
              <div style={{ height: '3px', background: colors.surface, borderRadius: RADIUS.pill, marginTop: '5px' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: barColor(i), borderRadius: RADIUS.pill }} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: TYPE.md, fontWeight: '700', color: colors.text }}>{item.total.toLocaleString()}</div>
              <div style={{ fontSize: TYPE.xs, color: colors.subText }}>pcs</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RankCard;