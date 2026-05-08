export const NAVY = {
  950: '#020810',
  900: '#050E1C',
  800: '#0A1929',
  700: '#0D2137',
  600: '#112845',
  500: '#1A3A5C',
  400: '#2D5A8E',
  300: '#3B82C4',
  200: '#5B9BD5',
  100: '#85B7E8',
  50:  '#B5D4F4',
};

export const BLUE = NAVY;

export const GLASS = {
  card:    'rgba(13, 33, 55, 0.55)',
  surface: 'rgba(10, 25, 41, 0.70)',
  input:   'rgba(5, 14, 28, 0.60)',
  border:  'rgba(91, 155, 213, 0.15)',
  borderHi:'rgba(91, 155, 213, 0.35)',
  blur:    'blur(20px)',
};

export const makeColors = (theme) => {
  // Always dark — glass morphism is inherently dark
  return {
    bg:        '#030B18',
    bgGrad:    'radial-gradient(ellipse at 20% 0%, #0D2137 0%, #030B18 60%)',
    card:      GLASS.card,
    surface:   GLASS.surface,
    border:    GLASS.border,
    borderMid: GLASS.borderHi,
    sidebar:   'rgba(5, 14, 28, 0.85)',
    brand:     '#3B82C4',
    brandDark: '#0D2137',
    text:      '#E8F0FA',
    subText:   'rgba(181, 212, 244, 0.55)',
    onDark:    '#FFFFFF',
    onBrand:   '#FFFFFF',
    success:   '#22C55E',
    warning:   '#F59E0B',
    error:     '#EF4444',
    info:      '#3B82C4',
    theme:     'dark',
  };
};

export const STATUS_CONFIG = {
  'READY':      { label: 'Siap Scan',  color: '#F59E0B', icon: 'Clock',         bg: 'rgba(245,158,11,0.12)'  },
  'SAVING...':  { label: 'Menyimpan…', color: '#5B9BD5', icon: 'Loader',        bg: 'rgba(91,155,213,0.12)'  },
  'SUCCESS!':   { label: 'Berhasil!',  color: '#22C55E', icon: 'CheckCircle',   bg: 'rgba(34,197,94,0.12)'   },
  'DUPLICATE!': { label: 'Duplicate!', color: '#F59E0B', icon: 'AlertTriangle', bg: 'rgba(245,158,11,0.12)'  },
  'ERROR!':     { label: 'Error',      color: '#EF4444', icon: 'XCircle',       bg: 'rgba(239,68,68,0.12)'   },
  'GAGAL!':     { label: 'Gagal',      color: '#EF4444', icon: 'XCircle',       bg: 'rgba(239,68,68,0.12)'   },
};

export const getStatusConfig = (s) =>
  STATUS_CONFIG[s] ?? { label: s, color: '#EF4444', icon: 'AlertCircle', bg: 'rgba(239,68,68,0.12)' };

export const TYPE = {
  xs:   '11px',
  sm:   '13px',
  base: '14px',
  md:   '15px',
  lg:   '18px',
  xl:   '22px',
};

export const RADIUS = {
  sm:   '10px',
  md:   '14px',
  lg:   '20px',
  xl:   '28px',
  pill: '999px',
};

export const FONT = "'Inter', system-ui, -apple-system, sans-serif";
