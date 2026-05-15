export const NAVY = {
  950: '#020810', 900: '#050E1C', 800: '#0A1929', 700: '#0D2137',
  600: '#112845', 500: '#1A3A5C', 400: '#2D5A8E', 300: '#3B82C4',
  200: '#5B9BD5', 100: '#85B7E8', 50: '#B5D4F4',
};

export const makeColors = (theme) => {
  if (theme === 'light') {
    return {
      bg:        '#E2EAF8',
      bgGrad:    'linear-gradient(160deg, #EEF3FC 0%, #E2EAF8 40%, #EAF0FB 100%)',
      card:      'rgba(255,255,255,0.5)',
      cardSolid: 'rgba(255,255,255,0.65)',
      surface:   'rgba(255,255,255,0.35)',
      border:    'rgba(255,255,255,0.75)',
      borderMid: 'rgba(59,130,196,0.25)',
      borderSub: 'rgba(30,60,120,0.07)',
      sidebar:   'rgba(5,14,28,0.92)',
      brand:     '#3B82C4',
      text:      '#0D1F40',
      subText:   'rgba(30,60,120,0.5)',
      success:   '#16A34A',
      warning:   '#D97706',
      error:     '#DC2626',
      glowBlue:  'rgba(59,130,196,0.15)',
      glowGreen: 'rgba(22,163,74,0.12)',
      inset:     'inset 0 1px 0 rgba(255,255,255,0.95)',
      shadow:    '0 8px 32px rgba(100,140,220,0.12)',
      theme:     'light',
    };
  }
  return {
    bg:        '#040810',
    bgGrad:    'radial-gradient(ellipse at 20% 0%, #0D2137 0%, #040810 60%)',
    card:      'rgba(8,18,32,0.92)',
    cardSolid: 'rgba(8,18,32,0.95)',
    surface:   'rgba(8,18,32,0.7)',
    border:    'rgba(91,155,213,0.12)',
    borderMid: 'rgba(91,155,213,0.35)',
    borderSub: 'rgba(255,255,255,0.04)',
    sidebar:   'rgba(5,14,28,0.95)',
    brand:     '#3B82C4',
    text:      '#E8F0FA',
    subText:   'rgba(148,185,230,0.55)',
    success:   '#22C55E',
    warning:   '#F59E0B',
    error:     '#EF4444',
    glowBlue:  'rgba(59,130,196,0.1)',
    glowGreen: 'rgba(34,197,94,0.08)',
    inset:     'inset 0 1px 0 rgba(255,255,255,0.05)',
    shadow:    '0 8px 32px rgba(0,0,0,0.4)',
    theme:     'dark',
  };
};

// Glass card helper — call in components
export const glassCard = (theme, accentRgb = null) => {
  const isLight = theme === 'light';
  const base = isLight
    ? { background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.75)', boxShadow: '0 8px 32px rgba(100,140,220,0.1), inset 0 1px 0 rgba(255,255,255,0.95)' }
    : { background: 'rgba(8,18,32,0.92)', border: '1px solid rgba(91,155,213,0.12)', boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' };
  if (!accentRgb) return base;
  return {
    ...base,
    boxShadow: base.boxShadow + `, 0 0 24px rgba(${accentRgb},${isLight ? '0.1' : '0.08'})`,
    border: `1px solid rgba(${accentRgb},${isLight ? '0.2' : '0.15'})`,
  };
};

export const TYPE  = { xs:'11px', sm:'13px', base:'14px', md:'15px', lg:'18px', xl:'22px' };
export const RADIUS = { sm:'10px', md:'14px', lg:'20px', xl:'28px', pill:'999px' };
export const FONT  = "'Rajdhani', 'Inter', system-ui, sans-serif";
