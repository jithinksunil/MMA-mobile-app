export const Colors = {
  // Primary palette
  primary: '#FF4B2B',
  primaryDark: '#C73010',
  primaryLight: '#FF7655',

  // Secondary
  secondary: '#FFB347',
  secondaryDark: '#E09020',

  // Neutrals
  background: '#0A0A0F',
  surface: '#141420',
  card: '#1E1E2E',
  border: '#2E2E3E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#5A5A70',

  // Status
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',

  // Gradients (used as arrays)
  gradientPrimary: ['#FF4B2B', '#FF8C00'],
  gradientCard: ['#1E1E2E', '#14141E'],
};

export const Typography = {
  // Font families
  fontRegular: 'System',
  fontMedium: 'System',
  fontBold: 'System',

  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 38,

  // Line heights
  lineHeightSm: 18,
  lineHeightBase: 22,
  lineHeightLg: 28,
  lineHeightXl: 34,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#FF4B2B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
};
