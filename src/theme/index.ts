/**
 * UNIX App — Theme
 *
 * Single import point for all design tokens.
 *
 * Usage:
 *   import { theme } from '@/theme';
 *   style={{ color: theme.colors.text.primary }}
 *   <User weight={theme.icons.weight} size={theme.icons.size.md} />
 */

export { colors } from './colors';
export { fontFamilies, fontWeights, fontSizes, lineHeights, letterSpacings, textStyles } from './typography';
export { spacing, layout } from './spacing';
export { shadows } from './shadows';

// ─── Composed theme object ────────────────────────────────────────────────────

import { colors } from './colors';
import { fontFamilies, fontWeights, fontSizes, lineHeights, letterSpacings, textStyles } from './typography';
import { spacing, layout } from './spacing';
import { shadows } from './shadows';

// ─── Icon tokens ─────────────────────────────────────────────────────────────
// Yksi paikka muuttaa kaikkien Phosphor-ikonien paino ja koko.
export const icons = {
  weight: 'light' as const,
  size: {
    sm: 18,
    md: 22,
    lg: 28,
  },
} as const;

export type IconWeight = typeof icons.weight;

export const theme = {
  colors,
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacings,
  textStyles,
  spacing,
  layout,
  shadows,
  icons,
} as const;

export type Theme = typeof theme;
