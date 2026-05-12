export const NAVY = {
  950: '#020810', 900: '#050E1C', 800: '#0A1929', 700: '#0D2137',
  600: '#112845', 500: '#1A3A5C', 400: '#2D5A8E', 300: '#3B82C4',
  200: '#5B9BD5', 100: '#85B7E8', 50: '#B5D4F4',
};

export const makeColors = (theme) => {
  if (theme === 'light') {
    return {
      bg:        '#F0F4F8',
      bgGrad:    'linear-gradient(135deg, #E8F0FB 0%, #F0F4F8 100%)',
      card:      'rgba(255,255,255,0.85)',
      surface:   'rgba(240,244,248,0.9)',
      border:    'rgba(59,130,196,0.15)',
      borderMid: 'rgba(59,130,196,0.3)',
      sidebar:   'rgba(255,255,255,0.9)',
      brand:     '#2D5A8E',
      text:      '#0D2137',
      subText:   '#5B7A9D',
      success:   '#16A34A',
      warning:   '#D97706',
      error:     '#DC2626',
      theme:     'light',
    };
  }
  return {
    bg:        '#030B18',
    bgGrad:    'radial-gradient(ellipse at 20% 0%, #0D2137 0%, #030B18 60%)',
    card:      'rgba(13,33,55,0.55)',
    surface:   'rgba(10,25,41,0.70)',
    border:    'rgba(91,155,213,0.15)',
    borderMid: 'rgba(91,155,213,0.35)',
    sidebar:   'rgba(5,14,28,0.85)',
    brand:     '#3B82C4',
    text:      '#E8F0FA',
    subText:   'rgba(181,212,244,0.55)',
    success:   '#22C55E',
    warning:   '#F59E0B',
    error:     '#EF4444',
    theme:     'dark',
  };
};

export const TYPE  = { xs:'11px', sm:'13px', base:'14px', md:'15px', lg:'18px', xl:'22px' };
export const RADIUS = { sm:'10px', md:'14px', lg:'20px', xl:'28px', pill:'999px' };
export const FONT  = "'Inter', system-ui, -apple-system, sans-serif";
