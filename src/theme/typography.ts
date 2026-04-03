/**
 * UNIX App — Typography System
 *
 * Reference image uses a geometric sans-serif family.
 * We use "Inter" (via @expo-google-fonts/inter) as a faithful match
 * for the ultra-clean, wide-spaced logotype aesthetic.
 *
 * Install: npx expo install @expo-google-fonts/inter expo-font
 */

import { Platform } from 'react-native';

// ─── Font families ─────────────────────────────────────────────────────────────

export const fontFamilies = {
  /** Primary UI font — all body copy, labels, inputs */
  sans: Platform.select({
    ios: 'Inter',
    android: 'Inter',
    default: 'Inter',
  }),
  /** Monospace — financial figures, amounts */
  mono: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

// ─── Font weights (mapped to actual font face names) ──────────────────────────

export const fontWeights = {
  thin: '100' as const,
  extraLight: '200' as const,
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
} as const;

// ─── Font sizes ────────────────────────────────────────────────────────────────

export const fontSizes = {
  /** 10px — micro labels, badges */
  xs: 10,
  /** 12px — captions, timestamps */
  sm: 12,
  /** 14px — secondary body, metadata */
  base: 14,
  /** 16px — primary body text */
  md: 16,
  /** 18px — subheadings */
  lg: 18,
  /** 22px — section headings */
  xl: 22,
  /** 28px — screen titles */
  '2xl': 28,
  /** 36px — large balance amounts */
  '3xl': 36,
  /** 44px — hero balance display */
  '4xl': 44,
  /** 56px — full-bleed hero numbers */
  '5xl': 56,
} as const;

// ─── Line heights ─────────────────────────────────────────────────────────────

export const lineHeights = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// ─── Letter spacing ──────────────────────────────────────────────────────────

export const letterSpacings = {
  /** Tight — dense numeric displays */
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  /** Used for body labels */
  wide: 0.5,
  /** Used for section headers */
  wider: 1.5,
  /** Used for the logotype "U N I X" */
  widest: 8,
  /** Extreme — splash / hero wordmarks */
  ultraWide: 12,
} as const;

// ─── Preset text styles ───────────────────────────────────────────────────────

export const textStyles = {
  /** "U N I X" logotype */
  logotype: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.widest,
    lineHeight: fontSizes.xl * lineHeights.tight,
  },

  /** Large balance hero — e.g. "$15,694.26" */
  heroBalance: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.light,
    letterSpacing: letterSpacings.tight,
    lineHeight: fontSizes['4xl'] * lineHeights.snug,
  },

  /** Medium balance — e.g. "$12,928.12" */
  balanceLarge: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.light,
    letterSpacing: letterSpacings.tight,
    lineHeight: fontSizes['3xl'] * lineHeights.snug,
  },

  /** Screen heading */
  heading: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.light,
    letterSpacing: letterSpacings.tight,
    lineHeight: fontSizes['2xl'] * lineHeights.snug,
  },

  /** Sub-heading / section title */
  subheading: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.normal,
  },

  /** Primary body */
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.normal,
    lineHeight: fontSizes.base * lineHeights.normal,
  },

  /** Secondary / muted body */
  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.normal,
    lineHeight: fontSizes.sm * lineHeights.relaxed,
  },

  /** Labels — e.g. "Current Balance", "Income", "Spent" */
  label: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.wider,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },

  /** CTA button text */
  button: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacings.wide,
    lineHeight: fontSizes.base * lineHeights.tight,
  },

  /** Small financial amount — e.g. "- 5.99 $" */
  amountSmall: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.light,
    letterSpacing: letterSpacings.normal,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
} as const;
