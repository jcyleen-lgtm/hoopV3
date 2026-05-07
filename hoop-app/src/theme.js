export const NAVY = {
  950: '#060D18',
  900: '#0F1923',
  800: '#1E3A5F',
  700: '#2D5A8E',
  600: '#3B82C4',
  500: '#5B9BD5',
  400: '#85B7E8',
  300: '#B5D4F4',
  100: '#DFF0FC',
  50:  '#EBF3FC',
};

// Alias kept for components that import BLUE
export const BLUE = {
  50:  NAVY[50],
  100: NAVY[100],
  200: NAVY[300],
  400: NAVY[600],
  500: NAVY[700],
  600: NAVY[800],
  700: NAVY[800],
  800: NAVY[900],
  900: NAVY[950],
};

export const makeColors = (theme) => {
  const dark = theme === 'dark';
  return {
    // Page backgrounds
    bg:       dark ? '#080F1A' : '#F0F2F5',
    card:     dark ? '#111E2E' : '#FFFFFF',
    surface:  dark ? '#172538' : NAVY[50],

    // Sidebar (always dark)
    sidebar:  NAVY[900],

    // Brand
    brand:    NAVY[600],
    brandDark:NAVY[800],

    // Text
    text:     dark ? '#E8EFF8' : NAVY[900],
    subText:  dark ? NAVY[300] : '#6B7280',
    onDark:   '#FFFFFF',
    onBrand:  '#FFFFFF',

    // Borders
    border:    dark ? 'rgba(181,212,244,0.10)' : '#EAECF0',
    borderMid: dark ? 'rgba(181,212,244,0.20)' : '#D1D5DB',

    // Semantic
    success: '#22C55E',
    warning: '#F59E0B',
    error:   '#EF4444',
    info:    NAVY[600],

    theme,
  };
};

export const STATUS_CONFIG = {
  'READY':             { label: 'Ready',       color: '#F59E0B', icon: 'Clock'         },
  'SAVING...':         { label: 'Saving…',     color: NAVY[600], icon: 'Loader'        },
  'SUCCESS!':          { label: 'Success',      color: '#22C55E', icon: 'CheckCircle'   },
  'DOUBLE SCAN!':      { label: 'Double scan',  color: '#F59E0B', icon: 'AlertTriangle' },
  'ERROR!':            { label: 'Error',        color: '#EF4444', icon: 'XCircle'       },
  'GAGAL!':            { label: 'Failed',       color: '#EF4444', icon: 'XCircle'       },
  'LOADING...':        { label: 'Loading…',     color: NAVY[600], icon: 'Loader'        },
  'AUTHENTICATING...': { label: 'Signing in…',  color: NAVY[600], icon: 'Loader'        },
};

export const getStatusConfig = (s) =>
  STATUS_CONFIG[s] ?? { label: s, color: '#EF4444', icon: 'AlertCircle' };

export const TYPE = {
  xs:   '11px',
  sm:   '13px',
  base: '14px',
  md:   '15px',
  lg:   '18px',
  xl:   '22px',
};

export const RADIUS = {
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '24px',
  pill: '999px',
};

export const FONT = "'Inter', system-ui, -apple-system, sans-serif";