/**
 * UNIX App — Color Palette
 *
 * Derived from the dark-luxury design system visible in the reference.
 * All values are tuned for OLED/dark-first display.
 */

export const colors = {
  // ─── Backgrounds ────────────────────────────────────────────────────────────
  background: {
    /** Primary app background — near-black, faint cool undertone */
    primary: '#1C1D20',
    /** Elevated surfaces: cards, modals, sheets */
    surface: '#1C1D20',
    /** Slightly raised — grouped list rows, inputs */
    elevated: '#1C1D20',
    /** Overlay / bottom sheets */
    overlay: 'rgba(18, 19, 21, 0.92)',
  },

  // ─── Text ────────────────────────────────────────────────────────────────────
  text: {
    /** Primary labels — always pure white */
    primary: '#feffff',
    /** Secondary labels — muted */
    secondary: '#a4a4a8ff',
    /** Tertiary / disabled / placeholder */
    tertiary: '#1C1D20',
    /** Inverse (for light surfaces if ever needed) */
    inverse: '#0C0D12',
  },

  // ─── Brand ───────────────────────────────────────────────────────────────────
  brand: {
    /** Primary accent — crisp white (matches CTA button) */
    primary: '#feffff',
    /** Soft glow tint used on hover / pressed states */
    primaryMuted: 'rgba(255, 255, 255, 0.08)',
  },

  // ─── Borders & Dividers ───────────────────────────────────────────────────────
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    default: 'rgba(255, 255, 255, 0.10)',
    strong: 'rgba(255, 255, 255, 0.18)',
  },

  // ─── Semantic ────────────────────────────────────────────────────────────────
  semantic: {
    success: '#3DDC84',
    warning: '#F5A623',
    error: '#FF4C4C',
    info: '#5B9CF6',
  },

  // ─── Misc ────────────────────────────────────────────────────────────────────
  /** Fully transparent */
  transparent: 'transparent',
  /** True black for status bar / system UI */
  black: '#000000',
  white: '#FFFFFF',
} as const;

export type ColorToken = typeof colors;
