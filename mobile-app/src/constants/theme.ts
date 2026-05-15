/**
 * ArcLock Mobile — Theme Constants
 * Design tokens for the dark cybersecurity aesthetic.
 */

export const COLORS = {
  // Primary backgrounds
  bg: {
    primary: '#0A0E1A',
    secondary: '#111827',
    tertiary: '#1F2937',
  },

  // Accent colors
  primary: '#00D4AA',
  primaryLight: '#00FFD0',
  primaryDark: '#00A888',
  accent: '#6366F1',
  accentLight: '#818CF8',

  // Status colors
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',

  // Text colors
  text: {
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
    muted: '#6B7280',
    inverse: '#0A0E1A',
  },

  // Surface / glass
  surface: {
    glass: 'rgba(255,255,255,0.05)',
    glassHover: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.08)',
    borderLight: 'rgba(255,255,255,0.12)',
  },

  // Gradients (used with LinearGradient)
  gradient: {
    primary: ['#00D4AA', '#6366F1'] as const,
    dark: ['#0A0E1A', '#111827'] as const,
    card: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'] as const,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const GLASSMORPHISM = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderColor: 'rgba(255,255,255,0.08)',
  borderWidth: 1,
  borderRadius: 16,
} as const;
