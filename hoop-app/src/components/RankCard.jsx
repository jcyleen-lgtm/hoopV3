import React from 'react';
import { TYPE, RADIUS, glassCard } from '../theme';

const RankCard = ({ rows, colors, rankStyle, barColor, theme }) => {
  const isLight = theme === 'light';
  const card = glassCard(theme);
  const max   = rows[0]?.total || 1;
  const grand = rows.reduce((s, r) => s + r.total, 0) || 1;

  return (
    <div style={{
      ...card,
      borderRadius: RADIUS.lg, overflow: 'hidden',
      backdropFilter: isLight ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: isLight ? 'blur(20px)' : 'none',
    }}>
      <div style={{ padding: '18px 20px 10px', fontSize: TYPE.xs, fontWeight: '600', color: colors.subText }}>
        STAFF RANKING
      </div>
      {rows.map((item, i) => {
        const rs  = rankStyle(i);
        const pct = Math.round((item.total / max) * 100);
        const pctOfTotal = ((item.total / grand) * 100).toFixed(1);
        return (
          <div key={i} style={{ padding: '11px 20px', borderTop: `1px solid ${colors.borderSub || colors.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Rank badge */}
            <div style={{ width: '28px', height: '28px', borderRadius: RADIUS.sm, background: rs.bg, color: rs.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: TYPE.sm, fontWeight: '700', flexShrink: 0 }}>
              {i + 1}
            </div>

            {/* Name + bar */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: TYPE.sm, fontWeight: '600', color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.nama}
              </div>
              <div style={{ height: '3px', background: colors.surface, borderRadius: RADIUS.pill, marginTop: '5px' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: barColor(i), borderRadius: RADIUS.pill }} />
              </div>
            </div>

            {/* Total + pct */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: TYPE.md, fontWeight: '700', color: colors.text }}>{item.total.toLocaleString()}</span>
                <span style={{ fontSize: '10px', color: colors.subText, fontWeight: '500' }}>{pctOfTotal}%</span>
              </div>
              <div style={{ fontSize: TYPE.xs, color: colors.subText }}>pcs</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RankCard;