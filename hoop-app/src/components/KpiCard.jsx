import React, { memo } from 'react';
import { TYPE, RADIUS, glassCard } from '../theme';

// Built-in inline icon shapes keyed by name
const ICONS = {
  package: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  users: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  trophy: (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 7 4 7 4 14 8 14"/>
      <polyline points="16 7 20 7 20 14 16 14"/>
      <path d="M8 7a4 4 0 0 0 8 0V3H8z"/>
      <line x1="12" y1="17" x2="12" y2="21"/><line x1="9" y1="21" x2="15" y2="21"/>
    </svg>
  ),
};

const KpiCard = ({ icon, label, value, unit, accent, colors, small, theme }) => {
  if (!colors) return null;
  const IconEl = icon && ICONS[icon] ? ICONS[icon](accent) : null;
  const isLight = theme === 'light';
  // derive rgb from accent color
  const accentMap = { '#2D5A8E':'45,90,142', '#3B82C4':'59,130,196', '#6B7280':'107,114,128', '#D4AF37':'212,175,55' };
  const accentRgb = accentMap[accent] || '59,130,196';
  const card = glassCard(theme || 'dark', accentRgb);

  return (
    <div style={{
      ...card,
      borderRadius: RADIUS.lg,
      padding: '16px 18px',
      position: 'relative',
      overflow: 'hidden',
      flex: 1,
      minWidth: '150px',
      backdropFilter: isLight ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: isLight ? 'blur(20px)' : 'none',
    }}>
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: `linear-gradient(90deg,${accent},rgba(0,0,0,0))`, borderRadius: `${RADIUS.lg} ${RADIUS.lg} 0 0` }} />
      {/* Corner glow */}
      <div style={{ position: 'absolute', width: '70px', height: '70px', borderRadius: '50%', background: `radial-gradient(circle,rgba(${accentRgb},${isLight ? '0.18' : '0.15'}) 0%,transparent 70%)`, top: '-20px', right: '-20px', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
        {IconEl}
        <span style={{
          fontSize: TYPE.xs, fontWeight: '600',
          color: colors.subText, letterSpacing: '.07em', textTransform: 'uppercase',
        }}>
          {label}
        </span>
      </div>
      <div style={{
        fontSize: small ? TYPE.md : TYPE.xl,
        fontWeight: '700', color: colors.text,
        letterSpacing: '-.3px', lineHeight: 1.1,
      }}>
        {typeof value === 'number' ? value.toLocaleString() : (value || 0)}
        {unit && (
          <span style={{ fontSize: TYPE.xs, color: colors.subText, fontWeight: '400', marginLeft: '5px' }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(KpiCard); // FIX: memo — skip re-render if props unchanged
