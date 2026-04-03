/**
 * UNIX App — Spacing Scale
 *
 * 4px base unit. All layout spacing should be chosen from this scale
 * to maintain visual rhythm.
 */

export const spacing = {
  /** 2px */
  '0.5': 2,
  /** 4px */
  '1': 4,
  /** 6px */
  '1.5': 6,
  /** 8px */
  '2': 8,
  /** 12px */
  '3': 12,
  /** 16px */
  '4': 16,
  /** 20px */
  '5': 20,
  /** 24px */
  '6': 24,
  /** 28px */
  '7': 28,
  /** 32px */
  '8': 32,
  /** 40px */
  '10': 40,
  /** 48px */
  '12': 48,
  /** 56px */
  '14': 56,
  /** 64px */
  '16': 64,
  /** 80px */
  '20': 80,
  /** 96px */
  '24': 96,
} as const;

// ─── Semantic aliases ─────────────────────────────────────────────────────────

export const layout = {
  /** Global horizontal screen padding */
  screenPadding: spacing['6'],
  /** Card internal padding */
  cardPadding: spacing['5'],
  /** Gap between stacked cards */
  cardGap: spacing['3'],
  /** Bottom safe-area margin for CTAs */
  ctaBottomMargin: spacing['10'],
  /** Top bar / header height */
  headerHeight: 56,
  /** Standard border radius for cards */
  cardRadius: 20,
  /** Button border radius */
  buttonRadius: 50,
  /** Input border radius */
  inputRadius: 12,
  /** Small chip / tag radius */
  chipRadius: 8,
} as const;
